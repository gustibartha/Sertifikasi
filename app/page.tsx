// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// --- KREDENSIAL PROYEK BARU ANDA ---
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
    if (error) console.error("Gagal mengambil data:", error.message);
  }

  // --- LOGIKA PENGIRIMAN DATA (NOMOR 2) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Pastikan semua field dikirim sebagai string yang bersih
    const payload = {
      nama: String(formData.nama || ""),
      nid: String(formData.nid || ""),
      bidang: String(formData.bidang || ""),
      sub_bidang: String(formData.sub_bidang || ""),
      sertifikat: String(formData.sertifikat || ""),
      no_sertifikat: String(formData.no_sertifikat || ""), // Kolom kritis
      tgl_expired: formData.tgl_expired // Format: YYYY-MM-DD
    };

    try {
      let result;
      if (editId) {
        // Mode Update
        result = await supabase
          .from("sertifikasi_final")
          .update(payload)
          .eq("id", editId);
      } else {
        // Mode Insert Baru
        result = await supabase
          .from("sertifikasi_final")
          .insert([payload]);
      }

      if (result.error) throw result.error;

      alert("Berhasil! Data tersimpan di proyek baru.");
      setEditId(null);
      setFormData({ 
        nama: "", nid: "", bidang: "", sub_bidang: "", 
        sertifikat: "", no_sertifikat: "", tgl_expired: "" 
      });
      fetchData();

    } catch (err) {
      console.error("DEBUG ERROR:", err);
      // Jika muncul PGRST204, pesan ini akan memberi instruksi SQL
      alert(`ERROR: ${err.message}\n\nHint: Jika kolom 'no_sertifikat' tidak ditemukan, jalankan perintah SQL RENAME di dashboard Supabase.`);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container-fluid p-4 bg-light" style={{ minHeight: "100vh" }}>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      
      <h4 className="text-center mb-4 fw-bold text-success">SERTIFIKASI CLOUD - PROYEK BARU</h4>
      
      <div className="row justify-content-center">
        {/* Form Container */}
        <div className="col-md-4">
          <div className="card p-4 shadow-sm border-0 rounded-4">
            <h6 className="fw-bold mb-3">{editId ? "📝 Edit Data" : "➕ Tambah Baru"}</h6>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="small fw-bold">Nama</label>
                <input className="form-control form-control-sm" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required />
              </div>
              <div className="mb-2">
                <label className="small fw-bold">Nomor Sertifikat</label>
                <input className="form-control form-control-sm" value={formData.no_sertifikat} onChange={e => setFormData({...formData, no_sertifikat: e.target.value})} required />
              </div>
              <div className="mb-3">
                <label className="small fw-bold">Tanggal Expired</label>
                <input type="date" className="form-control form-control-sm" value={formData.tgl_expired} onChange={e => setFormData({...formData, tgl_expired: e.target.value})} required />
              </div>
              
              <button className={`btn btn-sm w-100 fw-bold ${editId ? 'btn-warning' : 'btn-success'}`} disabled={loading}>
                {loading ? "PROSES..." : "SIMPAN DATA"}
              </button>
            </form>
          </div>
        </div>

        {/* Tabel Container */}
        <div className="col-md-8">
          <div className="card p-3 shadow-sm border-0 rounded-4">
            <div className="table-responsive">
              <table className="table table-sm table-hover align-middle" style={{ fontSize: '12px' }}>
                <thead className="table-dark">
                  <tr>
                    <th>Nama</th>
                    <th>No. Sertifikat</th>
                    <th>Expired</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.id}>
                      <td>{item.nama}</td>
                      <td className="text-primary fw-bold">{item.no_sertifikat}</td>
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