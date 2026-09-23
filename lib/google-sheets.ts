import { JWT } from "google-auth-library";

/**
 * Klien Google Sheets memakai Service Account (sheet tetap privat).
 * Env yang dibutuhkan:
 *  - GOOGLE_SERVICE_ACCOUNT_EMAIL : email service account (…@….iam.gserviceaccount.com)
 *  - GOOGLE_PRIVATE_KEY           : private key PEM (baris baru boleh ditulis sebagai \n)
 *  - GOOGLE_SHEET_ID              : ID spreadsheet
 */
export function getSheetsAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !rawKey) {
    throw new Error(
      "Kredensial Google belum diatur. Set GOOGLE_SERVICE_ACCOUNT_EMAIL dan GOOGLE_PRIVATE_KEY di environment."
    );
  }

  // Vercel menyimpan newline sebagai literal \n
  const key = rawKey.replace(/\\n/g, "\n");

  return new JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

export function getSheetId() {
  const id = process.env.GOOGLE_SHEET_ID;
  if (!id) throw new Error("GOOGLE_SHEET_ID belum diatur di environment.");
  return id;
}

/**
 * ID spreadsheet sertifikasi. Jika GOOGLE_SHEET_CERT_ID tidak diset, memakai
 * spreadsheet yang sama dengan direktori (data sertifikasi digabung sebagai tab).
 */
export function getCertSheetId() {
  return process.env.GOOGLE_SHEET_CERT_ID || getSheetId();
}

/** Daftar tab (worksheet) beserta gid-nya. */
export async function listSheetTabs(
  spreadsheetId: string
): Promise<{ title: string; gid: number }[]> {
  const auth = getSheetsAuth();
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}` +
    `?fields=sheets.properties.title,sheets.properties.sheetId`;
  const res = await auth.request<{ sheets?: { properties: { title: string; sheetId: number } }[] }>({ url });
  return (res.data?.sheets ?? []).map((s) => ({
    title: s.properties.title,
    gid: s.properties.sheetId,
  }));
}

/** Bungkus judul tab agar aman dipakai di range A1 notation. */
export function quoteTab(title: string) {
  return `'${title.replace(/'/g, "''")}'`;
}

/** Ambil nilai sel apa adanya (sesuai tampilan di sheet). */
export async function fetchSheetValues(range: string, sheetId?: string): Promise<string[][]> {
  const auth = getSheetsAuth();
  const spreadsheetId = sheetId ?? getSheetId();
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}` +
    `?majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE`;

  const res = await auth.request<{ values?: string[][] }>({ url });
  return res.data?.values ?? [];
}
