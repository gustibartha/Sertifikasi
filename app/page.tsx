// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

// 1. KONFIGURASI LANGSUNG (HARDCODED)
// Menggunakan URL dan Key dari dashboard Anda
const SUPABASE_URL = "https://obcaawzhimpbuxcczdvu.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_cdS0vDCML0EumviWiRaSGA_1w8p-724"; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: "", nid: "", bidang: "", sub_bidang: "",
    sertifikat: "", tgl_expired: ""
  });

  useEffect(() => { 
    fetchData(); 
  }, []);

  async function fetchData() {
    setLoading(true);
    // Menargetkan tabel sertifikasi_final
    const { data: res, error } = await supabase
      .from("sertifikasi_final")
      .select("*")
      .order("tgl_expired", { ascending: true });
    
    if (error) {
      console.error("Gagal mengambil data:", error.message);
    } else {
      setData(res || []);
    }
    setLoading(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Mengirim data ke tabel sertifikasi_final
    const { error } = await supabase
      .from("sertifikasi_final")
      .insert([formData]);

    if (error) {
      alert("Gagal simpan: " + error.message);
    } else {
      alert("Berhasil disimpan ke Cloud!");
      setFormData({ nama: "", nid: "", bidang: "", sub_bidang: "", sertifikat: "", tgl_expired: "" });
      fetchData();
    }
    setLoading(false);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sertifikasi");
    XLSX.writeFile(wb, "Data_Sertifikasi.xlsx");
  };

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <div className="container p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <h2 className="text-center fw-bold mb-4 text-primary">MONITORING SERTIFIKASI</h2>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card p-4 shadow-sm">
              <h5 className="fw-bold mb-3">Input Data</h5>
              <form onSubmit={handleSubmit}>
                <input type="text" className="form-control mb-2" placeholder="Nama" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required />
                <input type="text" className="form-control mb-2" placeholder="NID" value={formData.nid} onChange={e => setFormData({...formData, nid: e.target.value})} required />
                <input type="text" className="form-control mb-2" placeholder="Bidang" value={formData.bidang} onChange={e => setFormData({...formData, bidang: e.target.value})} required />
                <input type="text" className="form-control mb-2" placeholder="Sub Bidang" value={formData.sub_bidang} onChange={e => setFormData({...formData, sub_bidang: e.target.value})} required />
                <input type="text" className="form-control mb-2" placeholder="Sertifikat" value={formData.sertifikat} onChange={e => setFormData({...formData, sertifikat: e.target.value})} required />
                <label className="small text-muted">Expired:</label>
                <input type="date" className="form-control mb-3" value={formData.tgl_expired} onChange={e => setFormData({...formData, tgl_expired: e.target.value})} required />
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? "Menyimpan..." : "SIMPAN"}
                </button>
              </form>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card p-4 shadow-sm">
              <div className="d-flex justify-content-between mb-3">
                <h5 className="fw-bold">Data Real-time</h5>
                <button onClick={exportToExcel} className="btn btn-success btn-sm">Export Excel</button>
              </div>
              <div className="table-responsive">
                <table className="table border">
                  <thead className="table-dark">
                    <tr><th>Nama/NID</th><th>Bidang</th><th>Sertifikat</th><th>Expired</th></tr>
                  </thead>
                  <tbody>
                    {data.length === 0 ? (
                      <tr><td colSpan="4" className="text-center">Belum ada data.</td></tr>
                    ) : (
                      data.map((item) => (
                        <tr key={item.id}>
                          <td><strong>{item.nama}</strong><br/><small>{item.nid}</small></td>
                          <td>{item.bidang}<br/><small>{item.sub_bidang}</small></td>
                          <td>{item.sertifikat}</td>
                          <td><span className="badge bg-info text-dark">{item.tgl_expired}</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}