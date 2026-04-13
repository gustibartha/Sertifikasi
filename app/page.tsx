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

    const payload = {
      nama: formData.nama,
      nid: formData.nid,
      bidang: formData.bidang,
      sub_bidang: formData.sub_bidang,
      sertifikat: formData.sertifikat,
      no_sertifikat: formData.no_sertifikat,
      tgl_expired: formData.tgl_expired
    };

    const { error } = editId 
      ? await supabase.from("sertifikasi_final").update(payload).eq("id", editId)
      : await supabase.from("sertifikasi_final").insert([payload]);

    if (error) {
      alert("Gagal: " + error.message);
    } else {
      alert("Berhasil!");
      setEditId(null);
      setFormData({ nama: "", nid: "", bidang: "", sub_bidang: "", sertifikat: "", no_sertifikat: "", tgl_expired: "" });
      fetchData();
    }
    setLoading(false);
  };

  return (
    <div className="container p-4">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <div className="row">
        <div className="col-md-4">
          <form onSubmit={handleSubmit} className="card p-3 shadow-sm border-0">
            <h6 className="fw-bold mb-3">{editId ? "Edit" : "Input"} Data</h6>
            <input className="form-control form-control-sm mb-2" placeholder="Nama" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required />
            <input className="form-control form-control-sm mb-2" placeholder="NID" value={formData.nid} onChange={e => setFormData({...formData, nid: e.target.value})} required />
            <input className="form-control form-control-sm mb-2" placeholder="Bidang" value={formData.bidang} onChange={e => setFormData({...formData, bidang: e.target.value})} required />
            <input className="form-control form-control-sm mb-2" placeholder="Sub Bidang" value={formData.sub_bidang} onChange={e => setFormData({...formData, sub_bidang: e.target.value})} required />
            <input className="form-control form-control-sm mb-2" placeholder="Sertifikat" value={formData.sertifikat} onChange={e => setFormData({...formData, sertifikat: e.target.value})} required />
            <input className="form-control form-control-sm mb-2" placeholder="No Sertifikat" value={formData.no_sertifikat} onChange={e => setFormData({...formData, no_sertifikat: e.target.value})} required />
            <input type="date" className="form-control form-control-sm mb-3" value={formData.tgl_expired} onChange={e => setFormData({...formData, tgl_expired: e.target.value})} required />
            <button className="btn btn-primary btn-sm w-100 fw-bold">{loading ? "MENGIRIM..." : "SIMPAN"}</button>
          </form>
        </div>
        <div className="col-md-8">
          <table className="table table-sm" style={{fontSize: '12px'}}>
            <thead><tr><th>Nama</th><th>Sertifikat</th><th>Aksi</th></tr></thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  <td>{item.nama}</td>
                  <td>{item.sertifikat} <br/><small className="text-primary">{item.no_sertifikat}</small></td>
                  <td><button onClick={() => {setEditId(item.id); setFormData(item);}} className="btn btn-warning btn-xs px-2">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}