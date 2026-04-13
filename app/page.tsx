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

    // Kirim data dengan nama kolom yang PERSIS sama dengan di SQL Editor
    const payload = {
      nama: String(formData.nama),
      nid: String(formData.nid),
      bidang: String(formData.bidang),
      sub_bidang: String(formData.sub_bidang),
      sertifikat: String(formData.sertifikat),
      no_sertifikat: String(formData.no_sertifikat), // Kolom penyebab PGRST204
      tgl_expired: formData.tgl_expired
    };

    try {
      const { error } = editId 
        ? await supabase.from("sertifikasi_final").update(payload).eq("id", editId)
        : await supabase.from("sertifikasi_final").insert([payload]);

      if (error) {
        alert(`Error: ${error.message}\nDetail: Jalankan 'NOTIFY pgrst, reload schema' di SQL Editor Supabase!`);
        console.error("DEBUG ERROR:", error);
      } else {
        alert("Berhasil!");
        setEditId(null);
        setFormData({ nama: "", nid: "", bidang: "", sub_bidang: "", sertifikat: "", no_sertifikat: "", tgl_expired: "" });
        fetchData();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container p-4">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <h3 className="text-center mb-4 fw-bold">MONITORING SERTIFIKASI</h3>
      <div className="row g-4">
        <div className="col-md-4">
          <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
            <h6>{editId ? "Edit" : "Tambah"} Data</h6>
            <input className="form-control mb-2" placeholder="Nama" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required />
            <input className="form-control mb-2" placeholder="NID" value={formData.nid} onChange={e => setFormData({...formData, nid: e.target.value})} required />
            <input className="form-control mb-2" placeholder="Sertifikat" value={formData.sertifikat} onChange={e => setFormData({...formData, sertifikat: e.target.value})} required />
            <input className="form-control mb-2" placeholder="Nomor Sertifikat" value={formData.no_sertifikat} onChange={e => setFormData({...formData, no_sertifikat: e.target.value})} required />
            <input type="date" className="form-control mb-3" value={formData.tgl_expired} onChange={e => setFormData({...formData, tgl_expired: e.target.value})} required />
            <button className="btn btn-primary w-100">{loading ? "Menyimpan..." : "SIMPAN"}</button>
          </form>
        </div>
        <div className="col-md-8">
          <table className="table table-sm">
            <thead className="table-dark"><tr><th>Nama</th><th>No Sertifikat</th><th>Aksi</th></tr></thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  <td>{item.nama}</td>
                  <td>{item.no_sertifikat}</td>
                  <td><button onClick={() => {setEditId(item.id); setFormData(item);}} className="btn btn-warning btn-xs">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}