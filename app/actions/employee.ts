"use server";

import { db } from "@/lib/db";
import { employees, certifications } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type EmployeeInput = typeof employees.$inferInsert;

export async function getEmployees(statusPegawai?: "Organik" | "TAD") {
  try {
    let data;
    if (statusPegawai) {
      data = await db.select().from(employees).where(eq(employees.status_pegawai, statusPegawai));
    } else {
      data = await db.select().from(employees);
    }
    console.log(`[getEmployees] Fetched ${data.length} records for status: ${statusPegawai || 'All'}`);
    return { success: true, data };
  } catch (error: any) {
    console.error(`[getEmployees] ERROR:`, error);
    return { success: false, error: error.message };
  }
}

export async function addEmployee(data: EmployeeInput) {
  try {
    if (!data.nid || !data.name) {
      return { success: false, error: "NID dan Nama wajib diisi" };
    }

    await db.insert(employees).values(data);
    revalidatePath("/employees");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
      return { success: false, error: "NID sudah terdaftar" };
    }
    return { success: false, error: error.message };
  }
}

export async function updateEmployee(nid: string, data: Partial<EmployeeInput>) {
  try {
    await db.update(employees).set(data).where(eq(employees.nid, nid));
    revalidatePath("/employees");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteEmployee(nid: string) {
  try {
    // Hapus sertifikasi terkait terlebih dahulu untuk menghindari foreign key constraint error
    await db.delete(certifications).where(eq(certifications.employee_nid, nid));
    // Hapus pegawai
    await db.delete(employees).where(eq(employees.nid, nid));
    
    revalidatePath("/employees");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function importEmployeesCSV(rows: EmployeeInput[]) {
  try {
    if (!rows || rows.length === 0) {
      return { success: false, error: "Tidak ada data untuk diimport" };
    }

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const row of rows) {
      try {
        if (!row.nid || !row.name) {
          skipped++;
          errors.push(`Baris dengan NID "${row.nid || '(kosong)'}" dilewati: NID dan Nama wajib diisi`);
          continue;
        }

        // Upsert: insert or update if NID already exists
        await db.insert(employees).values(row).onConflictDoUpdate({
          target: employees.nid,
          set: {
            name: row.name,
            status_pegawai: row.status_pegawai,
            perusahaan_asal: row.perusahaan_asal,
            jabatan: row.jabatan,
            bidang: row.bidang,
            sub_bidang: row.sub_bidang,
            grade: row.grade,
            jenjang_jabatan: row.jenjang_jabatan,
            tanggal_jabatan: row.tanggal_jabatan,
            tanggal_lahir: row.tanggal_lahir,
            tanggal_pensiun: row.tanggal_pensiun,
            jenis_kelamin: row.jenis_kelamin,
            pendidikan: row.pendidikan,
            pog: row.pog,
            masa_kerja: row.masa_kerja,
            tanggal_masuk: row.tanggal_masuk,
            status_aktif: row.status_aktif,
            email: row.email,
            phone: row.phone,
            keterangan: row.keterangan,
          },
        });
        imported++;
      } catch (rowError: any) {
        skipped++;
        errors.push(`NID "${row.nid}": ${rowError.message}`);
      }
    }

    revalidatePath("/employees");
    revalidatePath("/");
    return { 
      success: true, 
      imported, 
      skipped, 
      errors: errors.slice(0, 10), // Limit error messages
      message: `Berhasil import ${imported} pegawai${skipped > 0 ? `, ${skipped} dilewati` : ''}.`
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
