/** Utilitas parsing nilai sel Google Sheet (dipakai oleh sync direktori & sertifikasi). */

const BULAN: Record<string, number> = {
  januari: 1, februari: 2, pebruari: 2, maret: 3, april: 4, mei: 5, juni: 6,
  juli: 7, agustus: 8, september: 9, oktober: 10, november: 11, nopember: 11, desember: 12,
};

/** Buang nilai kosong/placeholder ("-", "#REF!", dll). */
export const bersih = (v?: string) => {
  const s = (v ?? "").toString().trim();
  return !s || s === "-" || s.startsWith("#") ? "" : s;
};

/** Terima "06 Februari 1972", "05/10/1992", atau "1972-02-06" -> "YYYY-MM-DD". */
export function parseTanggal(v?: string): string | null {
  const s = bersih(v);
  if (!s) return null;

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

/** Ambil angka pertama: "33 tahun" -> 33, "15" -> 15, "-1110" -> -1110. */
export function parseAngka(v?: string): number | null {
  const s = bersih(v);
  if (!s) return null;
  const m = s.replace(/\./g, "").match(/-?\d+/);
  return m ? parseInt(m[0], 10) : null;
}
