import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Menormalkan nilai pendidikan menjadi jenjang/pendidikan terakhir saja.
 * Contoh: "S1 Teknik Mesin" -> "S1", "Diploma III Akuntansi" -> "D3",
 * "Sarjana" -> "S1", "SLTA/SMK" -> "SMA/SMK".
 */
export function normalizePendidikan(raw: string | null | undefined): string {
  if (!raw) return "Tidak Terdata";
  const s = raw.toString().trim().toUpperCase();
  if (!s) return "Tidak Terdata";

  // Doktoral / S3
  if (/\bS-?\s?3\b/.test(s) || s.includes("DOKTOR") || s.includes("DOCTORAL") || s.includes("PH.?D")) return "S3";
  // Magister / S2
  if (/\bS-?\s?2\b/.test(s) || s.includes("MAGISTER") || s.includes("MASTER") || s.includes("PASCASARJANA")) return "S2";
  // Sarjana / S1 (termasuk D4/D-IV yang setara sarjana terapan)
  if (/\bD-?\s?(4|IV)\b/.test(s) || s.includes("SARJANA TERAPAN") || s.includes("DIPLOMA 4") || s.includes("DIPLOMA IV")) return "D4";
  if (/\bS-?\s?1\b/.test(s) || s.includes("SARJANA")) return "S1";
  // Diploma
  if (/\bD-?\s?(3|III)\b/.test(s) || s.includes("DIPLOMA 3") || s.includes("DIPLOMA III")) return "D3";
  if (/\bD-?\s?(2|II)\b/.test(s) || s.includes("DIPLOMA 2") || s.includes("DIPLOMA II")) return "D2";
  if (/\bD-?\s?(1|I)\b/.test(s) || s.includes("DIPLOMA 1") || s.includes("DIPLOMA I")) return "D1";
  // Menengah atas
  if (s.includes("SMK") || s.includes("SMA") || s.includes("SMU") || s.includes("SLTA") || s.includes("MA") || s.includes("STM") || s.includes("SEDERAJAT")) return "SMA/SMK";
  // Menengah pertama & dasar
  if (s.includes("SMP") || s.includes("SLTP") || s.includes("MTS")) return "SMP";
  if (s.includes("SD") || s.includes("MI")) return "SD";

  return "Lainnya";
}
