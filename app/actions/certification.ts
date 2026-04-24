"use server";

import { db } from "@/lib/db";
import { certifications, employees } from "@/lib/schema";
import { eq, and, sql, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { sendEmailNotification, sendWhatsAppNotification } from "@/lib/notifications";

export type CertificationInput = typeof certifications.$inferInsert;

export async function getCertifications(statusPegawai?: "Organik" | "TAD") {
  try {
    const query = db.select({
      id: certifications.id,
      employee_nid: certifications.employee_nid,
      employeeName: employees.name,
      employeeStatus: employees.status_pegawai,
      statusKaryawan: employees.status_aktif,
      nama_pelatihan: certifications.nama_pelatihan,
      no_sertifikat: certifications.no_sertifikat,
      tanggal_perolehan: certifications.tanggal_perolehan,
      masa_berlaku_bulan: certifications.masa_berlaku_bulan,
      tanggal_kadaluarsa: certifications.tanggal_kadaluarsa,
      lembaga: certifications.lembaga,
      document_url: certifications.document_url,
      status_sertifikasi: certifications.status_sertifikasi,
      status_eksekusi: certifications.status_eksekusi,
    })
    .from(certifications)
    .innerJoin(employees, eq(certifications.employee_nid, employees.nid));

    let results;
    if (statusPegawai) {
      results = await query.where(eq(employees.status_pegawai, statusPegawai));
    } else {
      results = await query;
    }

    return { success: true, data: results };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addCertification(data: Omit<CertificationInput, "id">) {
  try {
    const id = crypto.randomUUID();
    
    // Auto-calculate status_sertifikasi based on expiry date
    let status: "Aktif" | "Warning" | "Expired" = "Aktif";
    if (data.tanggal_kadaluarsa) {
      const today = new Date();
      const expiry = new Date(data.tanggal_kadaluarsa);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) status = "Expired";
      else if (diffDays <= 30) status = "Warning";
    }

    await db.insert(certifications).values({
      ...data,
      id,
      status_sertifikasi: status
    });

    revalidatePath("/certifications");
    revalidatePath("/certifications-tad");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCertification(id: string, data: Partial<CertificationInput>) {
  try {
    let updateData = { ...data };
    
    // Recalculate status if expiry date is updated
    if (data.tanggal_kadaluarsa) {
      const today = new Date();
      const expiry = new Date(data.tanggal_kadaluarsa);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) updateData.status_sertifikasi = "Expired";
      else if (diffDays <= 30) updateData.status_sertifikasi = "Warning";
      else updateData.status_sertifikasi = "Aktif";
    }

    await db.update(certifications).set(updateData).where(eq(certifications.id, id));
    
    revalidatePath("/certifications");
    revalidatePath("/certifications-tad");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCertification(id: string) {
  try {
    await db.delete(certifications).where(eq(certifications.id, id));
    
    revalidatePath("/certifications");
    revalidatePath("/certifications-tad");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function sendCertificationReminders() {
  try {
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);
    const targetStr = thirtyDaysLater.toISOString().split('T')[0];

    // Ambil sertifikasi yang akan habis dalam 30 hari
    const expiringCerts = await db
      .select({
        id: certifications.id,
        employeeName: employees.name,
        email: employees.email,
        phone: employees.phone,
        certification: certifications.nama_pelatihan,
        expiryDate: certifications.tanggal_kadaluarsa,
      })
      .from(certifications)
      .innerJoin(employees, eq(certifications.employee_nid, employees.nid))
      .where(lte(certifications.tanggal_kadaluarsa, targetStr));

    if (expiringCerts.length === 0) {
      return { success: true, message: "Tidak ada sertifikasi yang mendekati kadaluarsa." };
    }

    let sentCount = 0;
    for (const cert of expiringCerts) {
      const message = `Halo ${cert.employeeName}, sertifikasi Anda "${cert.certification}" akan berakhir pada ${new Date(cert.expiryDate).toLocaleDateString('id-ID')}. Mohon segera lakukan pembaruan.`;
      
      // Kirim Email jika ada
      if (cert.email) {
        await sendEmailNotification(cert.email, "Peringatan Kadaluarsa Sertifikasi", message);
      }

      // Kirim WA jika ada
      if (cert.phone) {
        await sendWhatsAppNotification(cert.phone, message);
      }
      
      sentCount++;
    }

    return { success: true, message: `Berhasil mengirim ${sentCount} notifikasi.` };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
