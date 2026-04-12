// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

// === KONFIGURASI SUPABASE ===
// Pastikan URL dan Key ini sesuai dengan yang ada di dashboard Settings -> API kamu
const SUPABASE_URL = "https://obcaawzhimpbuxcczdvu.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_UMsKHT3BizHizC-sG2fiDA_XeoNN3SE"; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function MonitoringSertifikasi() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    nama: "",
    nid: "",
    bidang: "",
    sub_bidang: "",
    sertifikat: "",
    tgl_expired: "",
    file_url: null,
  });

  // Ambil data saat halaman pertama kali dibuka
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    // Menggunakan nama tabel baru: data_sertifikat
    const { data: res, error } = await supabase
      .from("data_sertifikat")
      .select("*")
      .order("tgl_expired", { ascending: true });

    if (error) {
      console.error("Error fetch:", error.message);
    } else {
      setData(res || []);
    }
    setLoading(false);
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, file_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Menggunakan nama tabel baru: data_sertifikat
    const { error } = await supabase
      .from("data_sertifikat")
      .insert([formData]);

    if (error) {
      alert("Gagal simpan: " + error.message);
    } else {
      alert("Data berhasil disimpan ke Cloud!");
      setFormData({
        nama: "", nid: "", bidang: "", sub_bidang: "",
        sertifikat: "", tgl_expired: "", file_url: null
      });
      // Reset input file secara manual
      e.target.reset();
      fetchData();
    }
    setLoading(false);
  };

  async function handleDelete(id) {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      setLoading(true);
      const { error } = await supabase
        .from("data_sertifikat")
        .delete()
        .eq("id", id);
      
      if (error) alert("Gagal hapus: " + error.message);
      fetchData();
    }
  }

  const exportToExcel = () => {
    const filteredData = data.map(({ id, created_at, file_url, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sertifikasi");
    XLSX.writeFile(workbook, "Monitoring_Sertifikasi.xlsx");
  };

  // Filter pencarian
  const displayData = data.filter(item => 
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sertifikat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f4f7f6", minHeight: "100vh", fontFamily: "sans-serif" }}>
      
      {/* Loading Overlay */}
      {loading && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(255,255,255,0.7)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      )}

      <div className="row">
        {/* Form Input */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4 mb-4">
            <h4 className="fw-bold text-primary mb-4">Input Data</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <input type="text" className="form-control" placeholder="Nama Karyawan" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required />
              </div>
              <div className="mb-2">
                <input type="text" className="form-control" placeholder="NID / NIP" value={formData.nid} onChange={e => setFormData({...formData, nid: e.target.value})} required />
              </div>
              <div className="row g-2 mb-2">
                <div className="col">
                  <input type="text" className="form-control" placeholder="Bidang" value={formData.bidang} onChange={e => setFormData({...formData, bidang: e.target.value})} required />
                </div>
                <div className="col">
                  <input type="text" className="form-control" placeholder="Sub Bidang" value={formData.sub_bidang} onChange={e => setFormData({...formData, sub_bidang: e.target.value})} required />
                </div>
              </div>
              <div className="mb-2">
                <input type="text" className="form-control" placeholder="Nama Sertifikat" value={formData.sertifikat} onChange={e => setFormData({...formData, sertifikat: e.target.value})} required />
              </div>
              <div className="mb-3">
                <label className="form-label small text-muted mb-1">Tanggal Masa Berlaku:</label>
                <input type="date" className="form-control" value={formData.tgl_expired} onChange={e => setFormData({...formData, tgl_expired: e.target.value})} required />
              </div>
              <div className="mb-4">
                <label className="form-label small text-muted mb-1">Upload Sertifikat (Gambar/PDF):</label>
                <input type="file" className="form-control" accept="image/*,application/pdf" onChange={handleFileChange} />
              </div>
              <button type="submit" className="btn btn-primary w-100 fw-bold py-2">SIMPAN KE DATABASE</button>
            </form>
          </div>
        </div>

        {/* Tabel Data */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0 p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold m-0">Monitoring Sertifikasi</h4>
              <button onClick={exportToExcel} className="btn btn-success fw-bold btn-sm">📊 Export Excel</button>
            </div>

            <div className="mb-3">
              <input type="text" className="form-control" placeholder="Cari Nama, NID, atau Sertifikat..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle" style={{ fontSize: "0.9rem" }}>
                <thead className="table-dark">
                  <tr>
                    <th>Karyawan</th>
                    <th>Bidang</th>
                    <th>Sertifikat</th>
                    <th>Masa Berlaku</th>
                    <th>File</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {displayData.map((item) => {
                    const today = new Date();
                    const expDate = new Date(item.tgl_expired);
                    const diffTime = expDate - today;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    let statusColor = "#d1e7dd"; // Hijau (Aman)
                    if (diffDays < 0) statusColor = "#f8d7da"; // Merah (Expired)
                    else if (diffDays <= 30) statusColor = "#fff3cd"; // Kuning (Hampir Expired)

                    return (
                      <tr key={item.id} style={{ backgroundColor: statusColor }}>
                        <td>
                          <strong>{item.nama}</strong><br/>
                          <small className="text-muted">{item.nid}</small>
                        </td>
                        <td>{item.bidang}<br/><small>{item.sub_bidang}</small></td>
                        <td>{item.sertifikat}</td>
                        <td>
                          {item.tgl_expired}<br/>
                          <span className="badge bg-dark text-white">
                            {diffDays < 0 ? "EXPIRED" : `${diffDays} Hari Lagi`}
                          </span>
                        </td>
                        <td>
                          {item.file_url ? (
                            <a href={item.file_url} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">Lihat</a>
                          ) : "-"}
                        </td>
                        <td>
                          <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-danger">Hapus</button>
                        </td>
                      </tr>
                    );
                  })}
                  {displayData.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center p-4 text-muted">Tidak ada data ditemukan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}