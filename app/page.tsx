// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Pastikan URL dan KEY ini benar (diambil dari Project Settings -> API)
const supabase = createClient(
  "https://obcaawzhimpbuxcczdvu.supabase.co", 
  "sb_publishable_cdS0vDCMl0EumviWiRaSGA_1w8p-724"
);

export default function App() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    nama: "", nid: "", bidang: "", sub_bidang: "",
    sertifikat: "", no_sertifikat: "", tgl_expired: ""
  });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const { data: res } = await supabase.from("sertifikasi_final").select("*");
    if (res) setData(res);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // NAMA KOLOM DI KIRI HARUS PERSIS SAMA DENGAN DI SUPABASE
    const payload = {
      nama: formData.nama,
      nid: formData.nid,
      bidang: formData.bidang,
      sub_bidang: formData.sub_bidang,
      sertifikat: formData.sertifikat,
      no_sertifikat: formData.no_sertifikat,
      tgl_expired: formData.tgl_expired
    };

    const { error } = await supabase.from("sertifikasi_final").insert([payload]);

    if (error) {
      alert("Error detail: " + error.message);
      console.log(error);
    } else {
      alert("Berhasil disimpan!");
      fetchData();
    }
  };

  return (
    <div className="p-5">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <form onSubmit={handleSubmit} className="card p-3 mb-4 shadow-sm">
        <input className="form-control mb-2" placeholder="Nama" onChange={e => setFormData({...formData, nama: e.target.value})} />
        <input className="form-control mb-2" placeholder="NID" onChange={e => setFormData({...formData, nid: e.target.value})} />
        <input className="form-control mb-2" placeholder="No Sertifikat" onChange={e => setFormData({...formData, no_sertifikat: e.target.value})} />
        <input type="date" className="form-control mb-2" onChange={e => setFormData({...formData, tgl_expired: e.target.value})} />
        <button className="btn btn-primary">SIMPAN KE CLOUD</button>
      </form>

      <table className="table table-bordered">
        <thead><tr><th>Nama</th><th>No Sertifikat</th></tr></thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.nama}</td>
              <td>{item.no_sertifikat}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}