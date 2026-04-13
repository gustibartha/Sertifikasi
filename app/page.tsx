// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

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
    const { data: res, error } = await supabase
      .from("sertifikasi_final")
      .select("*")
      .order("tgl_expired", { ascending: true });
    if (res) setData(res);
    if (error) console.error("Gagal ambil data:", error.message);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Memastikan payload bersih (menghindari error 400)
    const payload = {
      nama: String(formData.nama || ""),
      nid: String(formData.nid || ""),
      bidang: String(formData.bidang || ""),
      sub_bidang: String(formData.sub_bidang || ""),
      sertifikat: String(formData.sertifikat || ""),
      no_sertifikat: String(formData.no_sertifikat || ""),
      tgl_expired: formData.tgl_expired // Harus format YYYY-MM-DD
    };

    let response;
    if (editId) {
      response = await supabase.from("sertifikasi_final").update(payload).eq("id", editId);
    } else {
      response = await supabase.from("sertifikasi_final").insert([payload]);
    }

    if (response.error) {
      console.error("DEBUG ERROR 400:", response.error);
      alert(`Error: ${response.error.message}\nDetail: ${response.error.details}`);
    } else {
      alert(editId ? "Data Diperbarui!" : "Data Disimpan!");
      setEditId(null);
      setFormData({ nama: "", nid: "", bidang: "", sub_bidang: "", sertifikat: "", no_sertifikat: "", tgl_expired: "" });
      fetchData();
    }
    setLoading(false);
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({
      nama: item.nama || "",
      nid: item.nid || "",
      bidang: item.bidang || "",
      sub_bidang: item.sub_bidang || "",
      sertifikat: item.sertifikat || "",
      no_sertifikat: item.no_sertifikat || "",
      tgl_expired: item.tgl_expired || ""
    });
    window.scrollTo(0, 0);
  };

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <div className="container-fluid p-4 bg-light" style={{ minHeight: "100vh" }}>
        <h3 className="text-center fw-bold mb-4 text-primary">MONITORING SERTIFIKASI</h3>
        <div className="row justify-content-center">
          <div className="col-md-3">
            <div className="card p-3 shadow-sm border-0">
              <h6 className="fw-bold">{editId ? "Edit Data" : "Input Baru"}</h6>
              <form onSubmit={handleSubmit}>
                <input className="form-control form-control-sm mb-2" placeholder="Nama" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required />
                <input className="form-control form-control-sm mb-2" placeholder="NID" value={formData.nid} onChange={e => setFormData({...formData, nid: e.target.value})} required />
                <input className="form-control form-control-sm mb-2" placeholder="Bidang" value={formData.bidang} onChange={e => setFormData({...formData, bidang: e.target.value})} required />
                <input className="form-control form-control-sm mb-2" placeholder="Sub Bidang" value={formData.sub_bidang} onChange={e => setFormData({...formData, sub_bidang: e.target.value})} required />
                <input className="form-control form-control-sm mb-2" placeholder="Sertifikat" value={formData.sertifikat} onChange={e => setFormData({...formData, sertifikat: e.target.value})} required />
                <input className="form-control form-control-sm mb-2" placeholder="No Sertifikat" value={formData.no_sertifikat} onChange={e => setFormData({...formData, no_sertifikat: e.target.value})} required />
                <input type="date" className="form-control form-control-sm mb-3" value={formData.tgl_expired} onChange={e => setFormData({...formData, tgl_expired: e.target.value})} required />
                <button className="btn btn-primary btn-sm w-100 fw-bold">{loading ? "Proses..." : "SIMPAN"}</button>
              </form>
            </div>
          </div>
          <div className="col-md-9">
            <div className="card p-3 shadow-sm border-0 text-center" style={{fontSize: '11px'}}>
              <table className="table table-sm table-hover">
                <thead className="table-dark">
                  <tr><th>Nama</th><th>Sertifikat</th><th>Expired</th><th>Aksi</th></tr>
                </thead>
                <tbody>
                  {data.map(item => (
                    <tr key={item.id}>
                      <td>{item.nama}</td>
                      <td>{item.sertifikat} <br/> <small className="text-primary">{item.no_sertifikat}</small></td>
                      <td>{item.tgl_expired}</td>
                      <td>
                        <button onClick={() => handleEdit(item)} className="btn btn-warning btn-xs py-0 px-1">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}