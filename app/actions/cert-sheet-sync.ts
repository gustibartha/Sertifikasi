"use server";

import { createHash } from "crypto";
import { db } from "@/lib/db";
import { certifications, employees } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { fetchSheetValues, getCertSheetId } from "@/lib/google-sheets";
import { bersih, parseAngka, parseTanggal } from "@/lib/sheet-parse";

/** Posisi kolom pada sheet "Monitoring Sertifikasi" (0-based). */
const COL = {
  no: 0,
  judul: 1,
  bidang: 2,
  levelKompetensi: 3,
  nid: 6,
  nama: 7,
  jabatan: 8,
  statusPegawai: 9,
  tersertifikasi: 10,
  tglTerbit: 11,
  masaBerlakuBln: 12,
  tglBerakhir: 13,
  noSertifikat: 15,
  lsk: 16,
  status: 17,
} as const;

/** ID stabil agar sync berulang memperbarui baris yang sama, bukan menduplikasi. */
function buildId(nid: string, judul: string, noSert: string, tglTerbit: string | null) {
  return createHash("sha1")
    .update(`${nid}|${judul}|${noSert}|${tglTerbit ?? ""}`.toUpperCase())
    .digest("hex");
}

export async function syncSertifikasiFromSheet() {
  try {
    const rows = await fetchSheetValues("A1:X5000", getCertSheetId());
    if (rows.length === 0) {
      return { success: false, error: "Sheet kosong atau tidak bisa dibaca." };
    }

    // Cari baris header (memuat "JUDUL SERTIFIKASI")
    let headerIdx = -1;
    for (let i = 0; i < Math.min(rows.length, 15); i++) {
      const joined = (rows[i] || []).map((c) => (c || "").toUpperCase()).join("|");
      if (joined.includes("JUDUL SERTIFIKASI") && joined.includes("NID")) {
        headerIdx = i;
        break;
      }
    }
    if (headerIdx === -1) {
      return { success: false, error: "Header 'JUDUL SERTIFIKASI' tidak ditemukan — struktur sheet berubah." };
    }

    const header = (rows[headerIdx] || []).map((c) => (c || "").toUpperCase().replace(/\s+/g, " ").trim());
    if (!header[COL.judul]?.includes("JUDUL SERTIFIKASI") || !header[COL.nid]?.includes("NID")) {
      return {
        success: false,
        error:
          "Susunan kolom sheet tidak sesuai (JUDUL SERTIFIKASI harus kolom B, NID kolom G). Jangan menggeser kolom di sebelah kiri.",
      };
    }

    // NID pegawai Organik yang valid (certifications.employee_nid punya foreign key)
    const pegawai = await db
      .select({ nid: employees.nid })
      .from(employees)
      .where(eq(employees.status_pegawai, "Organik"));
    const nidValid = new Set(pegawai.map((p) => p.nid));

    const today = new Date();
    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];
    const nidTidakDikenal = new Map<string, string>();
    const seen = new Set<string>();

    for (let i = headerIdx + 1; i < rows.length; i++) {
      const r = rows[i] || [];
      const nid = bersih(r[COL.nid]);
      const judul = bersih(r[COL.judul]);
      if (!nid || !judul) continue; // baris kosong / pemisah

      if (!nidValid.has(nid)) {
        // Tidak bisa disimpan: NID tidak ada di direktori pegawai Organik
        nidTidakDikenal.set(nid, bersih(r[COL.nama]) || "(tanpa nama)");
        skipped++;
        continue;
      }

      try {
        const noSert = bersih(r[COL.noSertifikat]);
        const tglTerbit = parseTanggal(r[COL.tglTerbit]);
        const tglBerakhir = parseTanggal(r[COL.tglBerakhir]);
        const id = buildId(nid, judul, noSert, tglTerbit);
        if (seen.has(id)) continue; // baris kembar persis di sheet
        seen.add(id);

        // Status mengikuti tanggal kadaluarsa; jika tidak ada, ikuti kolom STATUS sheet
        let status: string;
        if (tglBerakhir) {
          const sisa = Math.ceil((new Date(tglBerakhir).getTime() - today.getTime()) / 86400000);
          status = sisa < 0 ? "Expired" : sisa <= 30 ? "Warning" : "Aktif";
        } else {
          status = /TIDAK/i.test(bersih(r[COL.status])) ? "Expired" : "Aktif";
        }

        const data = {
          id,
          employee_nid: nid,
          nama_pelatihan: judul,
          no_sertifikat: noSert,
          tanggal_perolehan: tglTerbit,
          masa_berlaku_bulan: parseAngka(r[COL.masaBerlakuBln]),
          tanggal_kadaluarsa: tglBerakhir ?? "",
          lembaga: bersih(r[COL.lsk]),
          status_sertifikasi: status,
        };

        await db
          .insert(certifications)
          .values(data)
          .onConflictDoUpdate({
            target: certifications.id,
            // status_eksekusi & document_url dikelola di aplikasi, tidak ditimpa
            set: {
              employee_nid: data.employee_nid,
              nama_pelatihan: data.nama_pelatihan,
              no_sertifikat: data.no_sertifikat,
              tanggal_perolehan: data.tanggal_perolehan,
              masa_berlaku_bulan: data.masa_berlaku_bulan,
              tanggal_kadaluarsa: data.tanggal_kadaluarsa,
              lembaga: data.lembaga,
              status_sertifikasi: data.status_sertifikasi,
            },
          });

        imported++;
      } catch (rowErr: any) {
        skipped++;
        if (errors.length < 10) errors.push(`Baris ${i + 1} (NID ${nid}): ${rowErr.message}`);
      }
    }

    revalidatePath("/certifications");
    revalidatePath("/dashboard");
    revalidatePath("/monitoring");

    const daftarNidTidakDikenal = Array.from(nidTidakDikenal.entries())
      .slice(0, 20)
      .map(([nid, nama]) => `${nama} (${nid})`);

    return {
      success: true,
      imported,
      skipped,
      errors,
      nidTidakDikenal: daftarNidTidakDikenal,
      totalNidTidakDikenal: nidTidakDikenal.size,
      message: `Berhasil sinkron ${imported} sertifikasi dari Google Sheet${skipped > 0 ? `, ${skipped} dilewati` : ""}.`,
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal sinkron sertifikasi dari Google Sheet." };
  }
}
