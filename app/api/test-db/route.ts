import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        // Tes query sederhana
        const result = await db.execute(sql`SELECT 1 as test`);
        return NextResponse.json({ 
            status: "success", 
            message: "Koneksi Database Berhasil!", 
            data: result 
        });
    } catch (error) {
        return NextResponse.json({ 
            status: "error", 
            message: "Koneksi Database GAGAL", 
            error: error.message 
        }, { status: 500 });
    }
}
