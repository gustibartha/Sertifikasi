// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://obcaawzhimpbuxcczdvu.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_cdS0vDCMl0EumviWiRaSGA_1w8p-724"; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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
      nama: formData.nama || "",
      nid: formData.nid || "",
      bidang: formData.bidang || "",
      sub_bidang: formData.sub_bidang || "",
      sertifikat: formData.sertifikat || "",
      no_sertifikat: formData.no_sertifikat || "",
      tgl_expired: formData.tgl_expired
    };

    let result;
    if (editId) {
      result = await supabase.from("sertifikasi_final").update(payload).eq("id", editId);
    } else {
      result = await supabase.from("sertifikasi_final").insert([payload]);
    }

    if (result.error) {
      alert("Error: " + result.error.message);
      console.error(result.error);
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
      <h4 className="text-center mb-4">MONITORING SERTIFIKASI</h4>
      <div className="row">
        <div className="col-md-4">
          <form onSubmit={handleSubmit} className="card p-3 shadow-sm border-0">
            <h6 className="fw-bold">{editId ? "Update" : "Tambah"} Data</h6>
            <input className="form-control form-control-sm mb-2" placeholder="Nama" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required />
            <input className="form-control form-control-sm mb-2" placeholder="NID" value={formData.nid} onChange={e => setFormData({...formData, nid: e.target.value})} required />
            <input className="form-control form-control-sm mb-2" placeholder="Bidang" value={formData.bidang} onChange={e => setFormData({...formData, bidang: e.target.value})} required />
            <input className="form-control form-control-sm mb-2" placeholder="Sub Bidang" value={formData.sub_bidang} onChange={e => setFormData({...formData, sub_bidang: e.target.value})} required />
            <input className="form-control form-control-sm mb-2" placeholder="Nama Sertifikat" value={formData.sertifikat} onChange={e => setFormData({...formData, sertifikat: e.target.value})} required />
            <input className="form-control form-control-sm mb-2" placeholder="No Sertifikat" value={formData.no_sertifikat} onChange={e => setFormData({...formData, no_sertifikat: e.target.value})} required />
            <input type="date" className="form-control form-control-sm mb-3" value={formData.tgl_expired} onChange={e => setFormData({...formData, tgl_expired: e.target.value})} required />
            <button className="btn btn-primary btn-sm">{loading ? "Loading..." : "SIMPAN DATA"}</button>
          </form>
        </div>
        <div className="col-md-8">
          <div className="card p-3 border-0 shadow-sm">
            <table className="table table-sm" style={{fontSize: '11px'}}>
              <thead>
                <tr><th>Nama/NID</th><th>Sertifikat/No</th><th>Expired</th><th>Aksi</th></tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.id}>
                    <td><strong>{item.nama}</strong><br/>{item.nid}</td>
                    <td>{item.sertifikat}<br/><small className="text-primary">{item.no_sertifikat}</small></td>
                    <td>{item.tgl_expired}</td>
                    <td>
                      <button onClick={() => {setEditId(item.id); setFormData(item);}} className="btn btn-warning btn-xs px-1 py-0">Edit</button>
                    </td>
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