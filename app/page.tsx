// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

// === ISI SESUAI DATA SUPABASE KAMU ===
const SUPABASE_URL = "https://soohdpwdrozxsjcmbptv.supabase.co";
const SUPABASE_KEY = "sb_publishable_UMsKHT3BizHizC-sG2fiDA_XeoNN3SE";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function MonitoringPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: "", nid: "", bidang: "", sub_bidang: "",
    sertifikat: "", tgl_expired: "", file_url: null,
  });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    const { data: res, error } = await supabase.from("sertifikasi").select("*").order("tgl_expired", { ascending: true });
    if (!error) setData(res || []);
    setLoading(false);
  }

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, file_url: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("sertifikasi").insert([formData]);
    if (error) alert("Gagal simpan: " + error.message);
    else {
      setFormData({ nama: "", nid: "", bidang: "", sub_bidang: "", sertifikat: "", tgl_expired: "", file_url: null });
      fetchData();
    }
    setLoading(false);
  };

  async function deleteData(id) {
    if (!confirm("Hapus data?")) return;
    await supabase.from("sertifikasi").delete().eq("id", id);
    fetchData();
  }

  function exportToExcel() {
    const ws = XLSX.utils.json_to_sheet(data.map(({ id, created_at, file_url, ...rest }) => rest));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sertifikasi");
    XLSX.writeFile(wb, "Sertifikasi.xlsx");
  }

  return (
    <div className="container p-4">
      <div className="row">
        <div className="col-md-4">
          <div className="card p-4 shadow-sm border-0">
            <h5 className="fw-bold mb-3">Input Sertifikasi</h5>
            <form onSubmit={handleSubmit}>
              <input type="text" className="form-control mb-2" placeholder="Nama" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required />
              <input type="text" className="form-control mb-2" placeholder="NID" value={formData.nid} onChange={e => setFormData({...formData, nid: e.target.value})} required />
              <input type="text" className="form-control mb-2" placeholder="Bidang" value={formData.bidang} onChange={e => setFormData({...formData, bidang: e.target.value})} required />
              <input type="text" className="form-control mb-2" placeholder="Sub Bidang" value={formData.sub_bidang} onChange={e => setFormData({...formData, sub_bidang: e.target.value})} required />
              <input type="text" className="form-control mb-2" placeholder="Sertifikat" value={formData.sertifikat} onChange={e => setFormData({...formData, sertifikat: e.target.value})} required />
              <input type="date" className="form-control mb-3" value={formData.tgl_expired} onChange={e => setFormData({...formData, tgl_expired: e.target.value})} required />
              <input type="file" className="form-control mb-3" onChange={handleFile} accept="image/*,application/pdf" />
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? "Menyimpan..." : "Simpan"}</button>
            </form>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card p-4 shadow-sm border-0">
            <div className="d-flex justify-content-between mb-3">
              <h5 className="fw-bold">Data Monitoring</h5>
              <button onClick={exportToExcel} className="btn btn-success btn-sm">Download Excel</button>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nama/NID</th>
                    <th>Sertifikat</th>
                    <th>Expired</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => {
                    const diff = Math.ceil((new Date(item.tgl_expired).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <tr key={item.id} className={diff < 0 ? "table-danger" : diff <= 30 ? "table-warning" : ""}>
                        <td>{item.nama}<br/><small>{item.nid}</small></td>
                        <td>{item.sertifikat}</td>
                        <td>{item.tgl_expired}</td>
                        <td>
                          {item.file_url && <a href={item.file_url} target="_blank" className="btn btn-sm btn-info me-1">Lihat</a>}
                          <button onClick={() => deleteData(item.id)} className="btn btn-sm btn-danger">X</button>
                        </td>
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