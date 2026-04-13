// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx"; // Pastikan baris ini ada

const SUPABASE_URL = "https://obcaawzhimpbuxcczdvu.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_cdS0vDCMl0EumviWiRaSGA_1w8p-724"; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function App() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    nama: "", nid: "", bidang: "", sub_bidang: "",
    sertifikat: "", tgl_expired: ""
  });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    const { data: res } = await supabase
      .from("sertifikasi_final")
      .select("*")
      .order("tgl_expired", { ascending: true });
    if (res) setData(res);
    setLoading(false);
  }

  // --- FUNGSI EXCEL YANG DIPERBAIKI ---
  const downloadExcel = () => {
    if (data.length === 0) {
      alert("Tidak ada data untuk diunduh");
      return;
    }
    // Membuat worksheet dari data JSON
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Sertifikasi");
    
    // Mengunduh file
    XLSX.writeFile(workbook, "Data_Sertifikasi_Online.xlsx");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (editId) {
      const { error } = await supabase.from("sertifikasi_final").update(formData).eq("id", editId);
      if (!error) { alert("Data Diperbarui!"); setEditId(null); }
    } else {
      const { error } = await supabase.from("sertifikasi_final").insert([formData]);
      if (!error) alert("Data Disimpan!");
    }
    setFormData({ nama: "", nid: "", bidang: "", sub_bidang: "", sertifikat: "", tgl_expired: "" });
    fetchData();
    setLoading(false);
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({
      nama: item.nama, nid: item.nid, bidang: item.bidang,
      sub_bidang: item.sub_bidang, sertifikat: item.sertifikat, tgl_expired: item.tgl_expired
    });
    window.scrollTo(0, 0);
  };

  const deleteData = async (id) => {
    if (confirm("Hapus data ini?")) {
      const { error } = await supabase.from("sertifikasi_final").delete().eq("id", id);
      if (!error) fetchData();
    }
  };

  const filteredData = data.filter((item) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      item.nama?.toLowerCase().includes(searchStr) ||
      item.nid?.toLowerCase().includes(searchStr) ||
      item.sertifikat?.toLowerCase().includes(searchStr)
    );
  });

  const getBadgeClass = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(dateString);
    return expDate <= today ? "bg-danger" : "bg-warning text-dark";
  };

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <h2 className="text-center fw-bold mb-4 text-primary">MONITORING SERTIFIKASI ONLINE</h2>
        
        <div className="row justify-content-center">
          <div className="col-md-3 mb-4">
            <div className={`card shadow-sm border-0 p-3 sticky-top ${editId ? 'border-warning' : ''}`} style={{ top: "20px" }}>
              <h6 className="fw-bold mb-3 small">{editId ? "📝 Edit Data" : "➕ Input Data"}</h6>
              <form onSubmit={handleSubmit}>
                <input type="text" className="form-control form-control-sm mb-2" placeholder="Nama" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required />
                <input type="text" className="form-control form-control-sm mb-2" placeholder="NID" value={formData.nid} onChange={e => setFormData({...formData, nid: e.target.value})} required />
                <input type="text" className="form-control form-control-sm mb-2" placeholder="Bidang" value={formData.bidang} onChange={e => setFormData({...formData, bidang: e.target.value})} required />
                <input type="text" className="form-control form-control-sm mb-2" placeholder="Sub Bidang" value={formData.sub_bidang} onChange={e => setFormData({...formData, sub_bidang: e.target.value})} required />
                <input type="text" className="form-control form-control-sm mb-2" placeholder="Sertifikat" value={formData.sertifikat} onChange={e => setFormData({...formData, sertifikat: e.target.value})} required />
                <input type="date" className="form-control form-control-sm mb-3" value={formData.tgl_expired} onChange={e => setFormData({...formData, tgl_expired: e.target.value})} required />
                <button type="submit" className={`btn btn-sm w-100 fw-bold ${editId ? 'btn-warning' : 'btn-primary'}`}>
                  {loading ? "..." : (editId ? "UPDATE" : "SIMPAN")}
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-9">
            <div className="card shadow-sm border-0 p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold m-0 small">Data Terdaftar</h6>
                <div className="d-flex gap-2">
                  <input type="text" className="form-control form-control-sm" placeholder="Cari..." style={{ width: "120px" }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  {/* TOMBOL EXCEL BARU */}
                  <button onClick={downloadExcel} className="btn btn-success btn-sm small">Excel</button>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-sm table-hover border">
                  <thead className="table-dark" style={{ fontSize: '11px' }}>
                    <tr>
                      <th>Nama/NID</th>
                      <th>Bidang/Sub</th>
                      <th>Sertifikat</th>
                      <th>Expired</th>
                      <th className="text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: '11px' }} className="align-middle">
                    {filteredData.map((item) => (
                      <tr key={item.id}>
                        <td><strong>{item.nama}</strong><br/><span className="text-muted">{item.nid}</span></td>
                        <td>{item.bidang}<br/><span className="text-muted">{item.sub_bidang}</span></td>
                        <td>{item.sertifikat}</td>
                        <td><span className={`badge ${getBadgeClass(item.tgl_expired)}`}>{item.tgl_expired}</span></td>
                        <td className="text-center">
                          <div className="d-flex gap-1 justify-content-center">
                            <button onClick={() => handleEdit(item)} className="btn btn-outline-primary btn-xs py-0 px-1" style={{ fontSize: '10px' }}>Edit</button>
                            <button onClick={() => deleteData(item.id)} className="btn btn-outline-danger btn-xs py-0 px-1" style={{ fontSize: '10px' }}>Hapus</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}