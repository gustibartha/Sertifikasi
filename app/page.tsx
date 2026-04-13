// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Kredensial Baru (Pastikan URL dan Key ini yang tampil di Dashboard Supabase Anda)
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
    bidang: "", 
    no_sertifikat: "", 
    tgl_expired: ""
  });

  useEffect(() => { fetchData(); }, []);

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

    // Payload bersih untuk menghindari error kolom
    const payload = {
      nama: formData.nama,
      nid: formData.nid,
      bidang: formData.bidang,
      no_sertifikat: formData.no_sertifikat,
      tgl_expired: formData.tgl_expired
    };

    try {
      const { error } = await supabase.from("sertifikasi_final").insert([payload]);
      
      if (error) {
        alert("Error Database: " + error.message);
        console.error(error);
      } else {
        alert("BERHASIL! Data sudah masuk ke Cloud.");
        setFormData({ nama: "", nid: "", bidang: "", no_sertifikat: "", tgl_expired: "" });
        fetchData();
      }
    } catch (err) {
      alert("System Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm p-4 border-0">
            <h4 className="fw-bold text-center mb-4">INPUT DATA SERTIFIKASI</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <input className="form-control" placeholder="Nama Lengkap" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required />
              </div>
              <div className="mb-2">
                <input className="form-control" placeholder="NID" value={formData.nid} onChange={e => setFormData({...formData, nid: e.target.value})} required />
              </div>
              <div className="mb-2">
                <input className="form-control" placeholder="Bidang" value={formData.bidang} onChange={e => setFormData({...formData, bidang: e.target.value})} required />
              </div>
              <div className="mb-2">
                <input className="form-control" placeholder="Nomor Sertifikat" value={formData.no_sertifikat} onChange={e => setFormData({...formData, no_sertifikat: e.target.value})} required />
              </div>
              <div className="mb-3">
                <label className="small text-muted">Tanggal Kedaluwarsa</label>
                <input type="date" className="form-control" value={formData.tgl_expired} onChange={e => setFormData({...formData, tgl_expired: e.target.value})} required />
              </div>
              <button className="btn btn-primary w-100 fw-bold" disabled={loading}>
                {loading ? "MENYIMPAN..." : "SIMPAN KE CLOUD"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h5 className="fw-bold">Data Terdaftar:</h5>
        <div className="table-responsive">
          <table className="table table-striped table-sm mt-2" style={{ fontSize: '12px' }}>
            <thead className="table-dark">
              <tr>
                <th>Nama</th>
                <th>No. Sertifikat</th>
                <th>Expired</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.nama}</td>
                  <td>{item.no_sertifikat}</td>
                  <td>{item.tgl_expired}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}