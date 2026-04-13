// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

// KODE KONEKSI (PASTIKAN INI BENAR)
const SUPABASE_URL = "https://obcaawzhimpbuxcczdvu.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_cdS0vDCMl0EumviWiRaSGA_1w8p-724"; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function App() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: "", nid: "", bidang: "", sub_bidang: "",
    sertifikat: "", tgl_expired: ""
  });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const { data: res, error } = await supabase
        .from("sertifikasi_final")
        .select("*")
        .order("tgl_expired", { ascending: true });
      
      if (error) throw error;
      setData(res || []);
    } catch (err) {
      console.error("Error koneksi:", err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("sertifikasi_final").insert([formData]);
    if (error) {
      alert("Gagal Simpan (Cek API Key): " + error.message);
    } else {
      alert("Data Berhasil Disimpan!");
      setFormData({ nama: "", nid: "", bidang: "", sub_bidang: "", sertifikat: "", tgl_expired: "" });
      fetchData();
    }
    setLoading(false);
  };

  const filteredData = data.filter((item) => {
    const searchStr = searchTerm.toLowerCase().trim();
    if (!searchStr) return true;
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

  const sendWhatsApp = (item) => {
    const pesan = `Halo Pak/Bu *${item.nama}*, sertifikat *${item.sertifikat}* Anda expired pada *${item.tgl_expired}*. Mohon segera diperbarui.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(pesan)}`, "_blank");
  };

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <h2 className="text-center fw-bold mb-4 text-primary">MONITORING SERTIFIKASI ONLINE</h2>
        
        <div className="row justify-content-center">
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: "20px" }}>
              <h5 className="fw-bold mb-3">Input Data Baru</h5>
              <form onSubmit={handleSubmit}>
                <input type="text" className="form-control mb-2" placeholder="Nama" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required />
                <input type="text" className="form-control mb-2" placeholder="NID" value={formData.nid} onChange={e => setFormData({...formData, nid: e.target.value})} required />
                <input type="text" className="form-control mb-2" placeholder="Bidang" value={formData.bidang} onChange={e => setFormData({...formData, bidang: e.target.value})} required />
                <input type="text" className="form-control mb-2" placeholder="Sub Bidang" value={formData.sub_bidang} onChange={e => setFormData({...formData, sub_bidang: e.target.value})} required />
                <input type="text" className="form-control mb-2" placeholder="Sertifikat" value={formData.sertifikat} onChange={e => setFormData({...formData, sertifikat: e.target.value})} required />
                <input type="date" className="form-control mb-3" value={formData.tgl_expired} onChange={e => setFormData({...formData, tgl_expired: e.target.value})} required />
                <button type="submit" className="btn btn-primary w-100 fw-bold">{loading ? "Proses..." : "SIMPAN DATA"}</button>
              </form>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card shadow-sm border-0 p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold m-0">Data Terdaftar</h5>
                <div className="d-flex gap-2">
                  <input 
                    type="text" 
                    className="form-control form-control-sm border-primary" 
                    placeholder="Cari..." 
                    style={{ width: "150px" }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button onClick={() => XLSX.writeFile(XLSX.utils.book_new(), XLSX.utils.json_to_sheet(data), "Data.xlsx")} className="btn btn-success btn-sm">Excel</button>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover border">
                  <thead className="table-dark text-center">
                    <tr><th>Nama/NID</th><th>Sertifikat</th><th>Expired</th><th>Aksi</th></tr>
                  </thead>
                  <tbody className="align-middle">
                    {filteredData.length === 0 ? (
                      <tr><td colSpan="4" className="text-center py-4 text-muted">Data tidak ditemukan.</td></tr>
                    ) : (
                      filteredData.map((item) => (
                        <tr key={item.id}>
                          <td><strong>{item.nama}</strong><br/><small>{item.nid}</small></td>
                          <td>{item.sertifikat}</td>
                          <td className="text-center">
                            <span className={`badge ${getBadgeClass(item.tgl_expired)} px-3 py-2`}>{item.tgl_expired}</span>
                          </td>
                          <td className="text-center">
                            <button onClick={() => sendWhatsApp(item)} className="btn btn-outline-success btn-sm">WA</button>
                          </td>
                        </tr>
                      ))
                    )}
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