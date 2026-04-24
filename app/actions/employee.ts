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
    return { success: true, data };
  } catch (error: any) {
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
