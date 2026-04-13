// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// --- KREDENSIAL BARU ---
const supabase = createClient(
  "https://soohdpwdrozxsjcmbptv.supabase.co", 
  "sb_publishable_UMsKHT3BizHizC-sG2fiDA_XeoNN3SE"
);

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    nama: "", 
    nid: "", 
    bidang: "", 
    sub_bidang: "",
    sertifikat: "", 
    no_sertifikat: "", 
    tgl_expired: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: res, error } = await supabase
      .from("sertifikasi_final")
      .select("*")
      .order("tgl_expired", { ascending: true });
    
    if (res) setData(res);
    if (error) console.error("Fetch Error:", error.message);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
      let result;
      if (editId) {
        result = await supabase
          .from("sertifikasi_final")
          .update(payload)
          .eq("id", editId);
      } else {
        result = await supabase
          .from("sertifikasi_final")
          .insert([payload]);
      }

      if (result.error) throw result.error;

      alert("Berhasil Terhubung ke Proyek Baru!");
      setEditId(null);
      setFormData({ 
        nama: "", nid: "", bidang: "", sub_bidang: "", 
        sertifikat: "", no_sertifikat: "", tgl_expired: "" 
      });
      fetchData();

    } catch (err) {
      alert(`Gagal: ${err.message}\nPastikan Tabel 'sertifikasi_final' sudah dibuat di proyek baru.`);
      console.error("Detail Error:", err);
    } finally {
      setLoading(false);
    }
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container-fluid p-4 bg-light" style={{ minHeight: "100vh" }}>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      
      <h4 className="text-center mb-4 fw-bold text-success">DATABASE SERTIFIKASI (NEW PROJECT)</h4>
      
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card p-4 shadow-sm border-0 rounded-3">
            <h6 className="fw-bold mb-3">{editId ? "📝 Edit Sertifikat" : "➕ Tambah Sertifikat"}</h6>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="small fw-bold text-muted">Nama Lengkap</label>
                <input className="form-control form-control-sm" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required />
              </div>
              <div className="mb-2">
                <label className="small fw-bold text-muted">NID / NIP</label>
                <input className="form-control form-control-sm" value={formData.nid} onChange={e => setFormData({...formData, nid: e.target.value})} required />
              </div>
              <div className="mb-2">
                <label className="small fw-bold text-muted">Nomor Sertifikat</label>
                <input className="form-control form-control-sm" value={formData.no_sertifikat} onChange={e => setFormData({...formData, no_sertifikat: e.target.value})} required />
              </div>
              <div className="mb-3">
                <label className="small fw-bold text-muted">Tanggal Expired</label>
                <input type="date" className="form-control form-control-sm" value={formData.tgl_expired} onChange={e => setFormData({...formData, tgl_expired: e.target.value})} required />
              </div>
              
              <button className={`btn btn-sm w-100 fw-bold ${editId ? 'btn-warning' : 'btn-success'}`} disabled={loading}>
                {loading ? "MENGHUBUNGKAN..." : (editId ? "UPDATE DATA" : "SIMPAN KE CLOUD BARU")}
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card p-3 shadow-sm border-0 rounded-3">
            <div className="table-responsive">
              <table className="table table-sm table-hover align-middle" style={{ fontSize: '12px' }}>
                <thead className="table-dark">
                  <tr>
                    <th>Biodata</th>
                    <th>No. Sertifikat</th>
                    <th>Status</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.nama}</strong><br/><span className="text-muted">{item.nid}</span></td>
                      <td><span className="text-primary fw-bold">{item.no_sertifikat || "-"}</span></td>
                      <td><span className="badge bg-danger">{item.tgl_expired}</span></td>
                      <td className="text-center">
                        <button onClick={() => handleEdit(item)} className="btn btn-outline-primary btn-xs py-0 px-2">Edit</button>
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
  );
}