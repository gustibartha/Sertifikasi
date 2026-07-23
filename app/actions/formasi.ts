"use server";

import { db } from "@/lib/db";
import { employees } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { formasiData, type FormasiRow } from "@/formasi-data";

// Normalisasi istilah jabatan agar sinonim/singkatan cocok
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
    .filter((k) => k.length > 0);
};

export async function getFormasiWithActual() {
  try {
    // Ambil jumlah pegawai organik per jabatan
    const actualCounts = await db
      .select({
        jabatan: employees.jabatan,
        count: sql<number>`count(*)`,
      })
      .from(employees)
      .where(eq(employees.status_pegawai, "Organik"))
      .groupBy(employees.jabatan);

    // Precompute metadata pencocokan untuk tiap baris formasi
    const rowMeta = formasiData.map((row) => {
      const parts = row.jabatan.split("  ");
      const level = parts[0].trim().toUpperCase();
      const title = parts.length > 1 ? parts[1].trim().toUpperCase() : "";
      const normalizedLevel = normalize(level);
      const baseLevel = normalizedLevel.replace(/\b(JR|SR)\b/g, "").trim();
      return {
        wantsJR: normalizedLevel.includes("JR"),
        wantsSR: normalizedLevel.includes("SR"),
        baseLevel,
        title,
        normalizedTitle: normalize(title),
        significantKeywords: getKeywords(title.split(" (")[0]),
      };
    });

    const matchKeyword = (kw: string, target: string) => {
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const isSymbol = /^[^\w\s]+$/.test(kw);
      const regex = isSymbol
        ? new RegExp(`${escaped}`, "i")
        : new RegExp(`(^|\\s|&|/|\\()${escaped}(\\s|\\)|&|/|$)`, "i");
      return regex.test(target);
    };

    // Bezetting per baris (index), dihitung 1:1 — tiap pegawai masuk ke SATU posisi terbaik
    const bezettingByIndex = new Array(formasiData.length).fill(0);
    let unmatched = 0;
    let totalOrganik = 0;

    actualCounts.forEach((item) => {
      if (!item.jabatan) return;
      const cnt = Number(item.count);
      totalOrganik += cnt;

      const normalizedEmp = normalize(item.jabatan.trim().toUpperCase());
      const isJR = normalizedEmp.includes("JR");
      const isSR = normalizedEmp.includes("SR");

      let bestIdx = -1;
      let bestScore = 0;

      rowMeta.forEach((m, idx) => {
        // 1. Level match (pisahkan JR / SR / reguler)
        const baseLevelMatch = m.baseLevel !== "" && normalizedEmp.includes(m.baseLevel);
        const seniorityMatch = m.wantsJR === isJR && m.wantsSR === isSR;
        if (!baseLevelMatch || !seniorityMatch) return;

        // 2. Skor kecocokan judul (keyword)
        let score: number;
        if (m.title === "") {
          score = 0.5;
        } else if (normalizedEmp.includes(m.normalizedTitle)) {
          const total = m.significantKeywords.length;
          const matched = total > 0 ? m.significantKeywords.filter((kw) => matchKeyword(kw, normalizedEmp)).length : 0;
          score = 1 + (total > 0 ? matched / total : 0); // inklusi utuh = paling kuat
        } else if (m.significantKeywords.length > 0) {
          const matched = m.significantKeywords.filter((kw) => matchKeyword(kw, normalizedEmp)).length;
          const ratio = matched / m.significantKeywords.length;
          score = ratio >= 0.7 ? ratio : 0; // ambang 70%
        } else {
          score = 0.5;
        }

        // Prioritaskan baseLevel yang lebih spesifik saat skor judul seri
        if (score > bestScore || (score === bestScore && score > 0 && m.baseLevel.length > (bestIdx >= 0 ? rowMeta[bestIdx].baseLevel.length : 0))) {
          bestScore = score;
          bestIdx = idx;
        }
      });

      if (bestIdx >= 0 && bestScore >= 0.5) {
        bezettingByIndex[bestIdx] += cnt;
      } else {
        unmatched += cnt;
      }
    });

    const updatedData: FormasiRow[] = formasiData.map((row, idx) => ({
      ...row,
      bezetting: bezettingByIndex[idx],
    }));

    return { success: true, data: updatedData, unmatched, totalOrganik };
  } catch (error: any) {
    console.error("Error fetching formasi with actual:", error);
    return { success: false, error: error.message };
  }
}
