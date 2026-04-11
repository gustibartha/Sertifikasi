// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

// === KONFIGURASI SUPABASE ===
// Ganti dengan URL dan Key milikmu
const SUPABASE_URL = "https://soohdpwdrozxsjcmbptv.supabase.co";
const SUPABASE_KEY = "sb_publishable_UMsKHT3BizHizC-sG2fiDA_XeoNN3SE";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function MonitoringPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    nid: "",
    bidang: "",
    sub_bidang: "",
    sertifikat: "",
    tgl_expired: "",
    file_url: "" as string | null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: res, error } = await supabase
      .from("sertifikasi")
      .select("*")
      .order("tgl_expired", { ascending: true });
    
    if (!error) setData(res || []);
    setLoading(false);
  }

  const handleFile = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, file_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("sertifikasi").insert([formData]);
    if (error) {
      alert("Gagal simpan: " + error.message);
    } else {
      setFormData({
        nama: "", nid: "", bidang: "", sub_bidang: "",
        sertifikat: "", tgl_expired: "", file_url: null
      });
      fetchData();
    }
    setLoading(false);
  };

  async function deleteData(id: string) {
    if (!confirm("Hapus data ini?")) return;
    setLoading(true);
    await supabase.from("sertifikasi").delete().eq("id", id);
    fetchData();
  }

  function exportToExcel() {
    const exportData = data.map(({ id, created_at, file_url, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sertifikasi");
    XLSX.writeFile(wb, "Data_Sertifikasi.xlsx");
  }

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {loading && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(255,255,255,0.7)", z-index: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div className="spinner-border text-primary"></div>
        </div>
      )}

      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm p-4 mb-4 border-0">
            <h5 className="mb-3 fw-bold text-primary">Tambah Sertifikasi</h5>
            <form onSubmit={handleSubmit}>
              <input type="text" className="form-control mb-2" placeholder="Nama Karyawan" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required />
              <input type="text" className="form-control mb-2" placeholder="NID" value={formData.nid} onChange={e => setFormData({...formData, nid: e.target.value})} required />
              <div className="row g-2 mb-2">
                <div className="col"><input type="text" className="form-control" placeholder="Bidang" value={formData.bidang} onChange={e => setFormData({...formData, bidang: e.target.value})} required /></div>
                <div className="col"><input type="text" className="form-control" placeholder="Sub Bidang" value={formData.sub_bidang} onChange={e => setFormData({...formData, sub_bidang: e.target.value})} required /></div>
              </div>
              <input type="text" className="form-control mb-2" placeholder="Nama Sertifikat" value={formData.sertifikat} onChange={e => setFormData({...formData, sertifikat: e.target.value})} required />
              <label className="small text-muted">Tanggal Expired:</label>
              <input type="date" className="form-control mb-3" value={formData.tgl_expired} onChange={e => setFormData({...formData, tgl_expired: e.target.value})} required />
              <label className="small text-muted">Lampiran Sertifikat:</label>
              <input type="file" className="form-control mb-3" onChange={handleFile} accept="image/*,application/pdf" />
              <button type="submit" className="btn btn-primary w-100 fw-bold">Simpan ke Cloud</button>
            </form>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card shadow-sm p-4 border-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold m-0">Daftar Monitoring Online</h5>
              <button onClick={exportToExcel} className="btn btn-success btn-sm fw-bold">📊 Download Excel</button>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Identitas</th>
                    <th>Bidang</th>
                    <th>Sertifikat</th>
                    <th>Expired</th>
                    <th>File</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => {
                    const diffDays = Math.ceil((new Date(item.tgl_expired).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    let color = diffDays < 0 ? "#f8d7da" : diffDays <= 30 ? "#fff3cd" : "#d1e7dd";
                    return (
                      <tr key={item.id} style={{ backgroundColor: color }}>
                        <td><strong>{item.nama}</strong><br/><small className="text-muted">{item.nid}</small></td>
                        <td>{item.bidang}<br/><small>{item.sub_bidang}</small></td>
                        <td>{item.sertifikat}</td>
                        <td>{item.tgl_expired}<br/><small className="fw-bold text-dark">{diffDays < 0 ? "EXPIRED" : `${diffDays} Hari Lagi`}</small></td>
                        <td>{item.file_url ? <a href={item.file_url} target="_blank" className="btn btn-sm btn-outline-dark">Lihat</a> : "-"}</td>
                        <td><button onClick={() => deleteData(item.id)} className="btn btn-sm btn-danger">✕</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}