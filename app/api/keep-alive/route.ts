import { db } from "@/lib/db";
import { employees } from "@/lib/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Dipanggil Vercel Cron sekali sehari (lihat vercel.json).
 *
 * Supabase free tier mem-pause project yang tidak ada aktivitas selama 7 hari.
 * Satu query ringan per hari sudah cukup membuat project dianggap aktif,
 * sehingga tidak ter-pause dan login tidak mendadak mati.
 *
 * Kalau env CRON_SECRET diisi, endpoint ini hanya menerima permintaan dari
 * Vercel Cron (yang mengirim header Authorization: Bearer <CRON_SECRET>).
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, message: "Tidak diizinkan" }, { status: 401 });
    }
  }

  try {
    // Query ringan ke tabel nyata agar benar-benar terhitung sebagai aktivitas DB
    await db.select({ c: sql<number>`count(*)` }).from(employees);
    return NextResponse.json({ ok: true, ts: new Date().toISOString() });
  } catch (error: any) {
    // Detail error hanya ke log server, tidak dibocorkan ke publik
    console.error("[keep-alive] gagal menghubungi database:", error?.message);
    return NextResponse.json({ ok: false, message: "Database tidak terjangkau" }, { status: 500 });
  }
}
