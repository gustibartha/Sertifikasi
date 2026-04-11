import { createClient } from "@supabase/supabase-js";

// 🔥 ambil env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 🔍 DEBUG: cek apakah ENV kebaca
console.log("🔥 SUPABASE URL:", supabaseUrl);
console.log("🔥 SUPABASE KEY:", supabaseAnonKey);

// ❌ kalau ENV kosong, langsung error biar ketahuan jelas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("❌ ENV Supabase belum diset. Cek .env.local kamu");
}

// ✅ create supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);