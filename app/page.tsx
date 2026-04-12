// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

/**
 * KONFIGURASI SUPABASE (HARDCODED)
 * Ini dilakukan agar aplikasi tidak bergantung pada Environment Variables Vercel
 * yang seringkali telat sinkronisasi.
 */
const SUPABASE_URL = "https://obcaawzhimpbuxcczdvu.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_cdS0vDCML0EumviWiRaSGA_1w8p-724"; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    nid: "",
    bidang: "",
    sub_bidang: "",
    sertifikat: "",
    tgl_expired: ""
  });

  // Ambil data setiap kali halaman dibuka
  useEffect(() => { 
    fetchData(); 
  }, []);

  async function fetchData() {
    setLoading(true);
    // Mengambil dari tabel sertifikasi_final yang sudah kamu buat
    const { data: res, error } = await supabase
      .from("sertifikasi_final")
      .select("*")
      .order("tgl_expired", { ascending: true });
    
    if (error) {
      console.error("Error Fetch:", error.message);
    } else {
      setData(res || []);
    }
    setLoading(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Proses Simpan ke Database
    const { error } = await supabase
      .from("sertifikasi_final")
      .insert([formData]);

    if (error) {
      // Jika error, akan muncul pesan detail (message & hint)
      alert("Gagal simpan: " + error.message + (error.hint ? "\nHint: " + error.hint : ""));
      console.error("Full Error:", error);
    } else {
      alert("Berhasil! Data tersimpan ke Cloud.");
      setFormData({ nama: "", nid: "", bidang: "", sub_bidang: "", sertifikat: "", tgl_expired: "" });
      fetchData();
    }
    setLoading(false);
  };

  const exportToExcel = () => {
    if (data.length === 0) return alert("Belum ada data untuk di-export");
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data Sertifikasi");
    XLSX.writeFile(wb, "Monitoring_Sertifikasi.xlsx");
  };

  return (
    <>
      {/* Import Bootstrap langsung agar tampilan rapi */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      
      <div className="container-fluid p-4" style={{ backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
        <h2 className="text-center fw-bold mb-4 text-primary">MONITORING SERTIFIKASI ONLINE</h2>
        
        <div className="row justify-content-center">
          {/* FORM INPUT */}
          <div className="col-md-4 mb-4">
            <div className="card shadow border-0 p-4">
              <h5 className="fw-bold mb-3">Tambah Data Baru</h5>
              <form onSubmit={handleSubmit}>
                <input type="text" className="form-control mb-2" placeholder="Nama Lengkap" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required />
                <input type="text" className="form-control mb-2" placeholder="NID / No. Pegawai" value={formData.nid} onChange={e => setFormData({...formData, nid: e.target.value})} required />
                <input type="text" className="form-control mb-2" placeholder="Bidang" value={formData.bidang} onChange={e => setFormData({...formData, bidang: e.target.value})} required />
                <input type="text" className="form-control mb-2" placeholder="Sub Bidang" value={formData.sub_bidang} onChange={e => setFormData({...formData, sub_bidang: e.target.value})} required />
                <input type="text" className="form-control mb-2" placeholder="Nama Sertifikasi" value={formData.sertifikat} onChange={e => setFormData({...formData, sertifikat: e.target.value})} required />
                <label className="small text-muted mb-1">Tanggal Masa Berlaku Habis:</label>
                <input type="date" className="form-control mb-3" value={formData.tgl_expired} onChange={e => setFormData({...formData, tgl_expired: e.target.value})} required />
                
                <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={loading}>
                  {loading ? "Menghubungkan Database..." : "SIMPAN DATA"}
                </button>
              </form>
            </div>
          </div>

          {/* TABEL DATA */}
          <div className="col-md-8">
            <div className="card shadow border-0 p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold m-0">Data Terdaftar</h5>
                <button onClick={exportToExcel} className="btn btn-success btn-sm fw-bold">Download Excel</button>
              </div>
              
              <div className="table-responsive">
                <table className="table table-hover border">
                  <thead className="table-dark">
                    <tr>
                      <th>Nama / NID</th>
                      <th>Bidang</th>
                      <th>Sertifikat</th>
                      <th>Expired</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length === 0 ? (
                      <tr><td colSpan="4" className="text-center py-4 text-muted small">Belum ada data di database cloud.</td></tr>
                    ) : (
                      data.map((item) => (
                        <tr key={item.id}>
                          <td><strong>{item.nama}</strong><br/><span className="text-muted small">{item.nid}</span></td>
                          <td>{item.bidang}<br/><small className="text-muted">{item.sub_bidang}</small></td>
                          <td>{item.sertifikat}</td>
                          <td><span className="badge bg-warning text-dark">{item.tgl_expired}</span></td>
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