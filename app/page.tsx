// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

// PAKAI HASIL COPY LANGSUNG DARI DASHBOARD KAMU
const SUPABASE_URL = "https://obcaawzhimpbuxcczdvu.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_cdS0vDCMl0EumviWiRaSGA_1w8p-724"; // Hasil copy paste kamu

// Konfigurasi ekstra untuk memastikan header apikey terkirim
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false
  },
  global: {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  }
});