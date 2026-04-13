// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://obcaawzhimpbuxcczdvu.supabase.co", 
  "sb_publishable_cdS0vDCMl0EumviWiRaSGA_1w8p-724"
);

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    nama: "", nid: "", bidang: "", sub_bidang: "",
    sertifikat: "", no_sertifikat: "", tgl_expired: ""
  });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const { data: res } = await supabase.from("sertifikasi_final").select("*").order("tgl_expired", { ascending: true });
    if (res) setData(res);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Pastikan semua field dikirim sebagai string agar tidak error 400
    const payload = {
      nama: String(formData.nama || ""),
      nid: String(formData.nid || ""),
      bidang: String(formData.bidang || ""),
      sub_bidang: String(formData.sub_bidang || ""),
      sertifikat: String(formData.sertifikat || ""),
      no_sertifikat: String(formData.no_sertifikat || ""),
      tgl_expired: formData.tgl_expired // format YYYY-MM-DD
    };

    try {
      const { error } = editId 
        ? await supabase.from("sertifikasi_final").update(payload).eq("id", editId)
        : await supabase.from("sertifikasi_final").insert([payload]);

      if (error) {
        alert(`Gagal: ${error.message}\nDetail: Jalankan perintah SQL RENAME di Supabase!`);
        console.error("Supabase Error:", error);
      } else {
        alert("Berhasil! Data telah tersinkron ke Cloud.");
        setEditId(null);
        setFormData({ nama: "", nid: "", bidang: "", sub_bidang: "", sertifikat: "", no_sertifikat: "", tgl_expired: "" });
        fetchData();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-4 bg-light" style={{ minHeight: "100vh" }}>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <h4 className="text-center mb-4 fw-bold text-primary">MONITORING SERTIFIKASI CLOUD</h4>
      <div className="row justify-content-center">
        <div className="col-md-3">
          <form onSubmit={handleSubmit} className="card p-3 shadow-sm border-0">
            <h6 className="fw-bold mb-3">{editId ? "Update Data" : "Tambah Baru"}</h6>
            <input className="form-control form-control-sm mb-2" placeholder="Nama" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required />
            <input className="form-control form-control-sm mb-2" placeholder="NID" value={formData.nid} onChange={e => setFormData({...formData, nid: e.target.value})} required />
            <input className="form-control form-control-sm mb-2" placeholder="Nomor Sertifikat" value={formData.no_sertifikat} onChange={e => setFormData({...formData, no_sertifikat: e.target.value})} required />
            <input type="date" className="form-control form-control-sm mb-3" value={formData.tgl_expired} onChange={e => setFormData({...formData, tgl_expired: e.target.value})} required />
            <button className="btn btn-primary btn-sm w-100 fw-bold">{loading ? "MENYIMPAN..." : "SIMPAN KE CLOUD"}</button>
          </form>
        </div>
        <div className="col-md-9">
          <div className="card p-3 shadow-sm border-0">
            <table className="table table-sm table-hover" style={{fontSize: '11px'}}>
              <thead className="table-dark">
                <tr><th>Nama/NID</th><th>No Sertifikat</th><th>Expired</th><th>Aksi</th></tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.id}>
                    <td><strong>{item.nama}</strong><br/>{item.nid}</td>
                    <td><span className="text-primary fw-bold">{item.no_sertifikat}</span></td>
                    <td>{item.tgl_expired}</td>
                    <td><button onClick={() => {setEditId(item.id); setFormData(item);}} className="btn btn-warning btn-xs px-2 py-0">Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}