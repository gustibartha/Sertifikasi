"use server";

import { db } from "@/lib/db";
import { employees } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { formasiData, type FormasiRow } from "@/formasi-data";

export async function getFormasiWithActual() {
  try {
    // Fetch counts of organic employees grouped by jabatan
    const actualCounts = await db
      .select({
        jabatan: employees.jabatan,
        count: sql<number>`count(*)`
      })
      .from(employees)
      .where(eq(employees.status_pegawai, 'Organik'))
      .groupBy(employees.jabatan);

    // Create a map for quick lookup
    const countsMap = new Map();
    actualCounts.forEach(item => {
      if (item.jabatan) {
        countsMap.set(item.jabatan.trim().toLowerCase(), Number(item.count));
      }
    });

    // Map the static formasi data with dynamic bezetting
    const updatedData: FormasiRow[] = formasiData.map(row => {
      // Split by double space to separate Level and Title (e.g., "TECHNICIAN  PRODUKSI...")
      const parts = row.jabatan.split("  ");
      const level = parts[0].trim().toUpperCase();
      const title = parts.length > 1 ? parts[1].trim().toUpperCase() : "";
      
      // Normalization functions
      const normalize = (str: string) => {
        return str
          .toUpperCase()
          .replace(/\bPEMELIHARAAN\b/g, "HAR")
          .replace(/\bASSISTANT MANAGER\b/g, "ASMAN")
          .replace(/\bASISTEN MANAJER\b/g, "ASMAN")
          .replace(/\bTECHNICIAN\b/g, "TEKNISI")
          .replace(/\bOFFICER\b/g, "OFR")
          .replace(/\bJUNIOR\b/g, "JR")
          .replace(/\bSENIOR\b/g, "SR")
          .replace(/\bCBM\b/g, "CONDITION BASED MAINTENANCE")
          .replace(/\bDAN\b/g, "&")
          .replace(/\//g, " & ")
          .replace(/&/g, " & ")
          .replace(/\bI\b/g, "1")
          .replace(/\bII\b/g, "2")
          .replace(/\bIII\b/g, "3")
          .replace(/\s+/g, " ")
          .trim();
      };

      const getKeywords = (str: string) => {
        return normalize(str)
          .replace(/\b(HAR|PLTGU|PLTU|BLOK|UNIT|ASMAN|TEKNISI|OFR|JR|SR)\b/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .split(" ")
          .filter(k => k.length > 0);
      };

      const normalizedLevel = normalize(level);
      const significantKeywords = getKeywords(title.split(" (")[0]);
      
      let totalCount = 0;
      
      actualCounts.forEach(item => {
        if (item.jabatan) {
          const empJabatan = item.jabatan.trim().toUpperCase();
          const normalizedEmpJabatan = normalize(empJabatan);
          
          // 1. Level Match (Strictly separate JR, SR, and Regular)
          const isJR = normalizedEmpJabatan.includes("JR");
          const isSR = normalizedEmpJabatan.includes("SR");
          const wantsJR = normalizedLevel.includes("JR");
          const wantsSR = normalizedLevel.includes("SR");
          
          const baseLevel = normalizedLevel.replace(/\b(JR|SR)\b/g, "").trim();
          const baseLevelMatch = normalizedEmpJabatan.includes(baseLevel);
          const seniorityMatch = (wantsJR === isJR) && (wantsSR === isSR);
          
          let levelMatch = baseLevelMatch && seniorityMatch;
          
          // 2. Title Match (Keywords)
          let titleMatch = title === "";
          if (!titleMatch && levelMatch) {
            const normalizedTitlePart = normalize(title);
            
            const matchKeyword = (kw: string) => {
              // Exact word match using regex boundaries for alphanumeric
              const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              const isSymbol = /^[^\w\s]+$/.test(kw);
              const regex = isSymbol 
                ? new RegExp(`${escaped}`, 'i') // Symbols don't need boundaries
                : new RegExp(`(^|\\s|&|/|\\()${escaped}(\\s|\\)|&|/|$)`, 'i');
              return regex.test(normalizedEmpJabatan);
            };

            // Stage 1: All significant keywords must match exactly as words
            titleMatch = significantKeywords.every(matchKeyword);

            // Stage 2: Fallback to simple string inclusion
            if (!titleMatch) {
              titleMatch = normalizedEmpJabatan.includes(normalizedTitlePart);
            }

            // Stage 3: Relaxed Match (If at least 70% of significant keywords match)
            if (!titleMatch && significantKeywords.length > 1) {
              const matchCount = significantKeywords.filter(matchKeyword).length;
              if (matchCount / significantKeywords.length >= 0.7) {
                titleMatch = true;
              }
            }
          }
          
          if (levelMatch && titleMatch) {
            totalCount += Number(item.count);
          }
        }
      });
      
      return {
        ...row,
        bezetting: totalCount
      };
    });

    return { success: true, data: updatedData };
  } catch (error: any) {
    console.error("Error fetching formasi with actual:", error);
    return { success: false, error: error.message };
  }
}
