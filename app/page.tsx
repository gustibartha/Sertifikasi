// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Kredensial Baru Anda
const supabase = createClient(
  "https://soohdpwdrozxsjcmbptv.supabase.co", 
  "sb_publishable_UMsKHT3BizHizC-sG2fiDA_XeoNN3SE"
);

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: "", 
    nid: "", 
    no_sertifikat: "", 
    tgl_expired: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: res } = await supabase
      .from("sertifikasi_final")
      .select("*")
      .order("tgl_expired", { ascending: true });
    if (res) setData(res);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Payload dibersihkan agar tidak ada undefined
    const payload = {
      nama: String(formData.nama || ""),
      nid: String(formData.nid || ""),
      no_sertifikat: String(formData.no_sertifikat || ""),
      tgl_expired: formData.tgl_expired 
    };

    const { error } = await supabase
      .from("sertifikasi_final")
      .insert([payload]);

    if (error) {
      console.error("DEBUG:", error);
      alert(`GAGAL: ${error.message}\n\nJalankan Perintah SQL RENAME di Dashboard!`);
    } else {
      alert("BERHASIL! Data Masuk.");
      setFormData({ nama: "", nid: "", no_sertifikat: "", tgl_expired: "" });
      fetchData();
    }
    setLoading(false);
  };

  return (
    <div className="container p-4">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card p-4 shadow-sm border-0">
            <h5 className="fw-bold mb-3 text-success">INPUT CLOUD BARU</h5>
            <form onSubmit={handleSubmit}>
              <input className="form-control mb-2" placeholder="Nama" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required />
              <input className="form-control mb-2" placeholder="NID" value={formData.nid} onChange={e => setFormData({...formData, nid: e.target.value})} required />
              <input className="form-control mb-2" placeholder="Nomor Sertifikat" value={formData.no_sertifikat} onChange={e => setFormData({...formData, no_sertifikat: e.target.value})} required />
              <input type="date" className="form-control mb-3" value={formData.tgl_expired} onChange={e => setFormData({...formData, tgl_expired: e.target.value})} required />
              <button className="btn btn-success w-100 fw-bold" disabled={loading}>
                {loading ? "MENGIRIM..." : "SIMPAN SEKARANG"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}