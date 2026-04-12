// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

// Pastikan URL sesuai dengan dashboard Supabase kamu
const SUPABASE_URL = "https://obcaawzhimpbuxcczdvu.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_UMsKHT3BizHizC-sG2fiDA_XeoNN3SE"; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: "", nid: "", bidang: "", sub_bidang: "",
    sertifikat: "", tgl_expired: "", file_url: null
  });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    const { data: res } = await supabase.from("data_monitoring").select("*").order("tgl_expired", { ascending: true });
    setData(res || []);
    setLoading(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("data_monitoring").insert([formData]);
    if (error) {
      alert("Gagal simpan: " + error.message);
    } else {
      setFormData({ nama: "", nid: "", bidang: "", sub_bidang: "", sertifikat: "", tgl_expired: "", file_url: null });
      fetchData();
    }
    setLoading(false);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, file_url: reader.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container p-4">
      {loading && <div className="spinner-border text-primary position-fixed top-50 start-50"></div>}
      <div className="row">
        <div className="col-md-4">
          <div className="card p-4 shadow-sm">
            <h5 className="fw-bold">Input Sertifikasi</h5>
            <form onSubmit={handleSubmit}>
              <input type="text" className="form-control mb-2" placeholder="Nama" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required />
              <input type="text" className="form-control mb-2" placeholder="NID" value={formData.nid} onChange={e => setFormData({...formData, nid: e.target.value})} required />
              <input type="text" className="form-control mb-2" placeholder="Bidang" value={formData.bidang} onChange={e => setFormData({...formData, bidang: e.target.value})} required />
              <input type="text" className="form-control mb-2" placeholder="Sub Bidang" value={formData.sub_bidang} onChange={e => setFormData({...formData, sub_bidang: e.target.value})} required />
              <input type="text" className="form-control mb-2" placeholder="Sertifikat" value={formData.sertifikat} onChange={e => setFormData({...formData, sertifikat: e.target.value})} required />
              <input type="date" className="form-control mb-3" value={formData.tgl_expired} onChange={e => setFormData({...formData, tgl_expired: e.target.value})} required />
              <input type="file" className="form-control mb-3" onChange={handleFile} />
              <button type="submit" className="btn btn-primary w-100">SIMPAN</button>
            </form>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card p-4 shadow-sm">
            <table className="table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Bidang</th>
                  <th>Sertifikat</th>
                  <th>Expired</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nama}</td>
                    <td>{item.bidang}</td>
                    <td>{item.sertifikat}</td>
                    <td>{item.tgl_expired}</td>
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