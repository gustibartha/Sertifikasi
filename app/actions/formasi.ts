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
        countsMap.set(item.jabatan.trim().toLowerCase(), item.count);
      }
    });

    // Map the static formasi data with dynamic bezetting
    const updatedData: FormasiRow[] = formasiData.map(row => {
      // Try to find a match in the counts map
      // We normalize whitespace and case for better matching
      const key = row.jabatan.replace(/\s+/g, ' ').trim().toLowerCase();
      
      // Also try matching the parts if the jabatan has double spaces
      const normalizedJabatan = row.jabatan.replace(/\s\s+/g, ' ').trim().toLowerCase();
      
      const count = countsMap.get(key) || countsMap.get(normalizedJabatan) || 0;
      
      return {
        ...row,
        bezetting: count
      };
    });

    return { success: true, data: updatedData };
  } catch (error: any) {
    console.error("Error fetching formasi with actual:", error);
    return { success: false, error: error.message };
  }
}
