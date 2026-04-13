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

    // Menghindari error 400 dengan memastikan data adalah string
    const payload = {
      nama: String(formData.nama || ""),
      nid: String(formData.nid || ""),
      bidang: String(formData.bidang || ""),
      sub_bidang: String(formData.sub_bidang || ""),
      sertifikat: String(formData.sertifikat || ""),
      no_sertifikat: String(formData.no_sertifikat || ""),
      tgl_expired: formData.tgl_expired
    };

    try {
      let res;
      if (editId) {
        res = await supabase.from("sertifikasi_final").update(payload).eq("id", editId);
      } else {
        res = await supabase.from("sertifikasi_final").insert([payload]);
      }

      if (res.error) throw res.error;

      alert("Berhasil!");
      setEditId(null);
      setFormData({ nama: "", nid: "", bidang: "", sub_bidang: "", sertifikat: "", no_sertifikat: "", tgl_expired: "" });
      fetchData();
    } catch (err) {
      alert("Error: " + err.message);
      console.error("Detail Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-4 bg-light" style={{ minHeight: "100vh" }}>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <h4 className="text-center mb-4 fw-bold text-primary">MONITORING SERTIFIKASI ONLINE</h4>
      <div className="row justify-content-center">
        <div className="col-md-3">
          <form onSubmit={handleSubmit} className="card p-3 shadow-sm border-0 sticky-top" style={{top: '20px'}}>
            <h6 className="fw-bold mb-3">{editId ? "Update Data" : "Input Baru"}</h6>
            <input className="form-control form-control-sm mb-2" placeholder="Nama" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required />
            <input className="form-control form-control-sm mb-2" placeholder="NID" value={formData.nid} onChange={e => setFormData({...formData, nid: e.target.value})} required />
            <input className="form-control form-control-sm mb-2" placeholder="Bidang" value={formData.bidang} onChange={e => setFormData({...formData, bidang: e.target.value})} required />
            <input className="form-control form-control-sm mb-2" placeholder="Sub Bidang" value={formData.sub_bidang} onChange={e => setFormData({...formData, sub_bidang: e.target.value})} required />
            <input className="form-control form-control-sm mb-2" placeholder="Sertifikat" value={formData.sertifikat} onChange={e => setFormData({...formData, sertifikat: e.target.value})} required />
            <input className="form-control form-control-sm mb-2" placeholder="No Sertifikat" value={formData.no_sertifikat} onChange={e => setFormData({...formData, no_sertifikat: e.target.value})} required />
            <input type="date" className="form-control form-control-sm mb-3" value={formData.tgl_expired} onChange={e => setFormData({...formData, tgl_expired: e.target.value})} required />
            <button className="btn btn-primary btn-sm w-100 fw-bold" disabled={loading}>
              {loading ? "PROSES..." : "SIMPAN"}
            </button>
            {editId && <button type="button" onClick={() => setEditId(null)} className="btn btn-link btn-sm w-100 mt-1">Batal</button>}
          </form>
        </div>
        <div className="col-md-9">
          <div className="card p-3 shadow-sm border-0">
            <table className="table table-sm table-hover align-middle" style={{fontSize: '11px'}}>
              <thead className="table-dark">
                <tr><th>Nama/NID</th><th>Bidang</th><th>Sertifikat/No</th><th>Expired</th><th>Aksi</th></tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.id}>
                    <td><strong>{item.nama}</strong><br/>{item.nid}</td>
                    <td>{item.bidang}</td>
                    <td>{item.sertifikat}<br/><small className="text-primary font-monospace">{item.no_sertifikat}</small></td>
                    <td><span className="badge bg-danger">{item.tgl_expired}</span></td>
                    <td>
                      <button onClick={() => {setEditId(item.id); setFormData(item);}} className="btn btn-warning btn-xs px-2">Edit</button>
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