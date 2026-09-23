"use server";

import { db } from "@/lib/db";
import { employees } from "@/lib/schema";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { fetchSheetValues, getSheetId, listSheetTabs, quoteTab } from "@/lib/google-sheets";

/** Apakah baris ini header tabel direktori pegawai? */
function isHeaderDirektori(row: string[] | undefined) {
  const joined = (row || []).map((c) => (c || "").toUpperCase()).join("|");
  return joined.includes("NO. INDUK");
}

/**
 * Cari tab yang memuat tabel direktori pegawai. Bisa dipaksa lewat
 * GOOGLE_SHEET_DIR_TAB; kalau tidak, semua tab ditelusuri.
 */
async function findDirektoriRange(spreadsheetId: string): Promise<{ range: string; tab: string }> {
  const tabs = await listSheetTabs(spreadsheetId);
  if (tabs.length === 0) throw new Error("Spreadsheet tidak punya tab yang bisa dibaca.");

  const namaTab = process.env.GOOGLE_SHEET_DIR_TAB;
  let kandidat = namaTab ? tabs.filter((t) => t.title === namaTab) : tabs;
  if (kandidat.length === 0) kandidat = tabs;

  for (const t of kandidat) {
    const probe = await fetchSheetValues(`${quoteTab(t.title)}!A1:AE15`, spreadsheetId);
    if (probe.some(isHeaderDirektori)) {
      return { range: `${quoteTab(t.title)}!A1:AE2000`, tab: t.title };
    }
  }

  throw new Error(
    `Tidak menemukan tabel direktori pegawai. Tab yang diperiksa: ${tabs.map((t) => t.title).join(", ")}. ` +
      `Pastikan ada baris header berisi "NO. INDUK".`
  );
}

/** Posisi kolom pada sheet "Keadaan Karyawan" (0-based). */
const COL = {
  no: 0,
  nama: 1,
  namaTanpaGelar: 2,
  noInduk: 3, // -> nid
  nidMims: 4,
  jabatan: 5,
  bagian: 6, // -> sub_bidang
  subBidang: 7, // -> bidang
  jenisKelamin: 8,
  tglJab: 10,
  jenjangJabatan: 11,
  pog: 12, // Position Grade
  jenjang: 14, // F3 / F5 / SPV A / MD  -> penanda Fungsional vs Struktural
  peg: 15, // Person Grade
  pendidikan: 16,
  tglLahir: 19,
  tglPensiun: 24,
  tglMasuk: 26,
  tglMasukAlt: 27,
  masaKerjaTahun: 29,
} as const;

const BULAN: Record<string, number> = {
  januari: 1, februari: 2, pebruari: 2, maret: 3, april: 4, mei: 5, juni: 6,
  juli: 7, agustus: 8, september: 9, oktober: 10, november: 11, nopember: 11, desember: 12,
};

/** Terima "06 Februari 1972", "05/10/1992", atau "1972-02-06". */
function parseTanggal(v?: string): string | null {
  if (!v) return null;
  const s = String(v).trim();
  if (!s || s === "-" || s.startsWith("#")) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  let m = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;

  m = s.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (m) {
    const bl = BULAN[m[2].toLowerCase()];
    if (bl) return `${m[3]}-${String(bl).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  }
  return null;
}

/** Ambil angka pertama: "33 tahun" -> 33, "15" -> 15. */
function parseAngka(v?: string): number | null {
  if (v == null) return null;
  const m = String(v).match(/-?\d+/);
  return m ? parseInt(m[0], 10) : null;
}

const bersih = (v?: string) => {
  const s = (v ?? "").toString().trim();
  return !s || s === "-" || s.startsWith("#") ? "" : s;
};

export async function syncOrganikFromSheet() {
  try {
    // Kolom A..AE cukup untuk semua field yang dipakai
    const spreadsheetId = getSheetId();
    const { range, tab } = await findDirektoriRange(spreadsheetId);
    const rows = await fetchSheetValues(range, spreadsheetId);
    if (rows.length === 0) {
      return { success: false, error: `Tab "${tab}" kosong atau tidak bisa dibaca.` };
    }

    // Cari baris header yang memuat "NO. INDUK", lalu validasi posisi kolom kunci
    let headerIdx = -1;
    for (let i = 0; i < Math.min(rows.length, 10); i++) {
      if (isHeaderDirektori(rows[i])) {
        headerIdx = i;
        break;
      }
    }
    if (headerIdx === -1) {
      return { success: false, error: "Header 'NO. INDUK' tidak ditemukan — struktur sheet berubah." };
    }

    const header = (rows[headerIdx] || []).map((c) => (c || "").toUpperCase().replace(/\s+/g, " ").trim());
    if (!header[COL.noInduk]?.includes("NO. INDUK") || !header[COL.peg]?.includes("PERSON GRADE")) {
      return {
        success: false,
        error:
          "Susunan kolom sheet tidak sesuai (NO. INDUK harus kolom D, PERSON GRADE (PeG) kolom P). Jangan menambah/menggeser kolom di sebelah kiri.",
      };
    }

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];
    const nidsDiSheet: string[] = [];

    for (let i = headerIdx + 1; i < rows.length; i++) {
      const r = rows[i] || [];
      const nid = bersih(r[COL.noInduk]);
      const nama = bersih(r[COL.namaTanpaGelar]) || bersih(r[COL.nama]);
      if (!nid || !nama) continue; // lewati baris header lanjutan / kosong

      // NO. INDUK yang sah selalu gabungan angka+huruf (mis. 9419142ZJY, 7092133K3).
      // Blok legenda/rekap di bawah sheet memakai angka polos ("1", "183") pada kolom
      // ini — baris seperti itu harus dilewati agar tidak masuk sebagai pegawai.
      if (nid.length < 6 || !/[A-Za-z]/.test(nid)) continue;

      // Baris rekap juga memakai teks kategori sebagai "nama"
      if (/^PEG\s*[<>=]/i.test(nama)) continue;

      try {
        const jk = bersih(r[COL.jenisKelamin]).toUpperCase().startsWith("P") ? "P" : "L";
        const data = {
          nid,
          name: nama.toUpperCase(),
          status_pegawai: "Organik",
          jabatan: bersih(r[COL.jabatan]).toUpperCase(),
          bidang: bersih(r[COL.subBidang]).toUpperCase(),
          sub_bidang: bersih(r[COL.bagian]).toUpperCase(),
          jenis_kelamin: jk,
          tanggal_jabatan: parseTanggal(r[COL.tglJab]),
          jenjang_jabatan: bersih(r[COL.jenjangJabatan]),
          grade: bersih(r[COL.pog]),
          pog: parseAngka(r[COL.pog]),
          person_grade: parseAngka(r[COL.peg]),
          jenjang: bersih(r[COL.jenjang]),
          pendidikan: bersih(r[COL.pendidikan]),
          tanggal_lahir: parseTanggal(r[COL.tglLahir]),
          tanggal_pensiun: parseTanggal(r[COL.tglPensiun]),
          tanggal_masuk: parseTanggal(r[COL.tglMasuk]) || parseTanggal(r[COL.tglMasukAlt]),
          masa_kerja: parseAngka(r[COL.masaKerjaTahun]),
        };

        await db
          .insert(employees)
          .values(data)
          .onConflictDoUpdate({
            target: employees.nid,
            // Hanya field dari sheet yang ditimpa; email/phone/keterangan/
            // status_aktif/tanggal_mutasi tetap dikelola di aplikasi.
            set: {
              name: data.name,
              status_pegawai: data.status_pegawai,
              jabatan: data.jabatan,
              bidang: data.bidang,
              sub_bidang: data.sub_bidang,
              jenis_kelamin: data.jenis_kelamin,
              tanggal_jabatan: data.tanggal_jabatan,
              jenjang_jabatan: data.jenjang_jabatan,
              grade: data.grade,
              pog: data.pog,
              person_grade: data.person_grade,
              jenjang: data.jenjang,
              pendidikan: data.pendidikan,
              tanggal_lahir: data.tanggal_lahir,
              tanggal_pensiun: data.tanggal_pensiun,
              tanggal_masuk: data.tanggal_masuk,
              masa_kerja: data.masa_kerja,
            },
          });

        nidsDiSheet.push(nid);
        imported++;
      } catch (rowErr: any) {
        skipped++;
        if (errors.length < 10) errors.push(`Baris ${i + 1} (NID ${nid}): ${rowErr.message}`);
      }
    }

    // Pegawai organik di database yang tidak ada di sheet (tidak dihapus, hanya dilaporkan)
    const dbOrganik = await db
      .select({ nid: employees.nid, name: employees.name })
      .from(employees)
      .where(eq(employees.status_pegawai, "Organik"));
    const setSheet = new Set(nidsDiSheet);
    const tidakAdaDiSheet = dbOrganik.filter((e) => !setSheet.has(e.nid));

    revalidatePath("/employees/organik");
    revalidatePath("/dashboard");
    revalidatePath("/monitoring");
    revalidatePath("/formasi");

    return {
      success: true,
      imported,
      skipped,
      errors,
      tidakAdaDiSheet: tidakAdaDiSheet.slice(0, 20),
      totalTidakAdaDiSheet: tidakAdaDiSheet.length,
      tab,
      message: `Berhasil sinkron ${imported} pegawai dari tab "${tab}"${skipped > 0 ? `, ${skipped} dilewati` : ""}.`,
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal sinkron dari Google Sheet." };
  }
}
