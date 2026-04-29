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
      
      // Normalization function for flexible matching
      const normalize = (str: string) => {
        return str
          .toUpperCase()
          .replace(/\bPEMELIHARAAN\b/g, "HAR")
          .replace(/\bASSISTANT MANAGER\b/g, "ASMAN")
          .replace(/\bTECHNICIAN\b/g, "TEKNISI")
          .replace(/\bOFFICER\b/g, "OFR")
          .replace(/\bDAN\b/g, "&")
          .replace(/\s+/g, " ")
          .trim();
      };

      const normalizedLevel = normalize(level);
      const normalizedBaseTitle = normalize(title.split(" (")[0].split(" / ")[0]);
      
      let totalCount = 0;
      
      actualCounts.forEach(item => {
        if (item.jabatan) {
          const empJabatan = item.jabatan.trim().toUpperCase();
          const normalizedEmpJabatan = normalize(empJabatan);
          
          // Matching Logic:
          // 1. Level match (with SENIOR check to avoid Technician matching Senior Technician)
          const hasSenior = normalizedEmpJabatan.includes("SENIOR");
          const wantsSenior = normalizedLevel.includes("SENIOR");
          const levelMatch = normalizedEmpJabatan.includes(normalizedLevel) && (wantsSenior || !hasSenior);
          
          let titleMatch = title === "";
          if (!titleMatch) {
            // Escape special characters for regex
            const escapedBase = normalizedBaseTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // Match the normalized base title as a distinct unit
            const regex = new RegExp(`${escapedBase}(\\s|\\(|$)`, 'i');
            titleMatch = regex.test(normalizedEmpJabatan);
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
