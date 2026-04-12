// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

// Konfigurasi Supabase
const SUPABASE_URL = "https://obcaawzhimpbuxcczdvu.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_cdS0vDCM10EumviWiRaSGA_1w8p-724"; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  global: { headers: { apikey: SUPABASE_KEY } },
});

export default function App() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: "", nid: "", bidang: "", sub_bidang: "",
    sertifikat: "", tgl_expired: ""
  });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    const { data: res } = await supabase
      .from("sertifikasi_final")
      .select("*")
      .order("tgl_expired", { ascending: true });
    if (res) setData(res);
    setLoading(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("sertifikasi_final").insert([formData]);
    if (error) {
      alert("Gagal: " + error.message);
    } else {
      alert("Data Berhasil Disimpan!");
      setFormData({ nama: "", nid: "", bidang: "", sub_bidang: "", sertifikat: "", tgl_expired: "" });
      fetchData();
    }
    setLoading(false);
  };

  // --- 1. LOGIC FILTER PENCARIAN ---
  const filteredData = data.filter((item) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      item.nama?.toLowerCase().includes(searchStr) ||
      item.nid?.toLowerCase().includes(searchStr) ||
      item.sertifikat?.toLowerCase().includes(searchStr)
    );
  });

  // --- 2. LOGIC WARNA BADGE DINAMIS ---
  const getBadgeClass = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(dateString);
    
    // Merah jika sudah expired atau expired hari ini
    return expDate <= today ? "bg-danger" : "bg-warning text-dark";
  };

  // --- 3. MENU REMINDER WA OTOMATIS ---
  const sendWhatsApp = (item) => {
    const pesan = `Halo Pak/Bu *${item.nama}*, menginfokan bahwa sertifikat *${item.sertifikat}* Anda akan/sudah expired pada tanggal *${item.tgl_expired}*. Mohon segera diproses pembaruannya. Terima kasih.`;
    const url = `https://wa.me/?text=${encodeURIComponent(pesan)}`;
    window.open(url, "_blank");
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sertifikasi");
    XLSX.writeFile(wb, "Data_Monitoring_Sertifikasi.xlsx");
  };

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <h2 className="text-center fw-bold mb-4 text-primary">MONITORING SERTIFIKASI ONLINE</h2>
        
        <div className="row justify-content-center">
          {/* KOLOM KIRI: FORM INPUT */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: "20px" }}>
              <h5 className="fw-bold mb-3">Input Data Baru</h5>
              <form onSubmit={handleSubmit}>
                <input type="text" className="form-control mb-2" placeholder="Nama Lengkap" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required />
                <input type="text" className="form-control mb-2" placeholder="NID" value={formData.nid} onChange={e => setFormData({...formData, nid: e.target.value})} required />
                <input type="text" className="form-control mb-2" placeholder="Bidang" value={formData.bidang} onChange={e => setFormData({...formData, bidang: e.target.value})} required />
                <input type="text" className="form-control mb-2" placeholder="Sub Bidang" value={formData.sub_bidang} onChange={e => setFormData({...formData, sub_bidang: e.target.value})} required />
                <input type="text" className="form-control mb-2" placeholder="Nama Sertifikat" value={formData.sertifikat} onChange={e => setFormData({...formData, sertifikat: e.target.value})} required />
                <label className="small text-muted mb-1">Tanggal Expired:</label>
                <input type="date" className="form-control mb-3" value={formData.tgl_expired} onChange={e => setFormData({...formData, tgl_expired: e.target.value})} required />
                <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={loading}>
                  {loading ? "Menyimpan..." : "SIMPAN DATA"}
                </button>
              </form>
            </div>
          </div>

          {/* KOLOM KANAN: TABEL DENGAN SEARCH & WA */}
          <div className="col-md-8">
            <div className="card shadow-sm border-0 p-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
                <h5 className="fw-bold m-0">Data Terdaftar</h5>
                
                {/* BAGIAN SEARCH & DOWNLOAD */}
                <div className="d-flex gap-2 w-100 w-md-auto">
                  <input 
                    type="text" 
                    className="form-control form-control-sm border-primary" 
                    placeholder="Cari Nama / NID..." 
                    style={{ maxWidth: "250px" }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button onClick={exportToExcel} className="btn btn-success btn-sm fw-bold">Download Excel</button>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover border">
                  <thead className="table-dark text-center">
                    <tr>
                      <th>Nama / NID</th>
                      <th>Bidang</th>
                      <th>Sertifikat</th>
                      <th>Expired</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="align-middle">
                    {filteredData.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-4 text-muted">Data tidak ditemukan atau masih kosong.</td></tr>
                    ) : (
                      filteredData.map((item) => (
                        <tr key={item.id}>
                          <td><strong>{item.nama}</strong><br/><span className="text-muted small">{item.nid}</span></td>
                          <td>{item.bidang}<br/><small className="text-muted">{item.sub_bidang}</small></td>
                          <td>{item.sertifikat}</td>
                          <td className="text-center">
                            <span className={`badge ${getBadgeClass(item.tgl_expired)} px-3 py-2`}>
                              {item.tgl_expired}
                            </span>
                          </td>
                          <td className="text-center">
                            <button 
                              onClick={() => sendWhatsApp(item)} 
                              className="btn btn-outline-success btn-sm fw-bold"
                            >
                              WhatsApp
                            </button>
                          </td>
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