// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Menggunakan kredensial yang aktif berdasarkan log aktivitas Anda
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
    const { data: res } = await supabase
      .from("sertifikasi_final")
      .select("*")
      .order("tgl_expired", { ascending: true });
    if (res) setData(res);
  }

  // LOGIKA NOMOR 3: PENGIRIMAN DATA
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Payload ini harus menggunakan huruf kecil agar sesuai dengan database
    const payload = {
      nama: formData.nama,
      nid: formData.nid,
      bidang: formData.bidang,
      sub_bidang: formData.sub_bidang,
      sertifikat: formData.sertifikat,
      no_sertifikat: formData.no_sertifikat, // Kolom penyebab PGRST204
      tgl_expired: formData.tgl_expired
    };

    try {
      let result;
      if (editId) {
        // Mode Edit
        result = await supabase
          .from("sertifikasi_final")
          .update(payload)
          .eq("id", editId);
      } else {
        // Mode Input Baru
        result = await supabase
          .from("sertifikasi_final")
          .insert([payload]);
      }

      if (result.error) throw result.error;

      alert("Data Berhasil Tersinkron ke Cloud!");
      setEditId(null);
      setFormData({ nama: "", nid: "", bidang: "", sub_bidang: "", sertifikat: "", no_sertifikat: "", tgl_expired: "" });
      fetchData();

    } catch (err) {
      // Jika PGRST204 muncul, ini akan menangkap detailnya
      console.error("Error PGRST:", err);
      alert(`Gagal: ${err.message}\nTip: Jalankan 'NOTIFY pgrst, reload schema' di SQL Editor.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container p-4">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <h4 className="text-center mb-4 fw-bold text-primary">MONITORING SERTIFIKASI CLOUD</h4>
      
      <div className="row">
        <div className="col-md-4">
          <div className="card p-3 shadow-sm border-0">
            <h6 className="fw-bold">{editId ? "Edit Data" : "Input Baru"}</h6>
            <form onSubmit={handleSubmit}>
              <input className="form-control mb-2" placeholder="Nama" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required />
              <input className="form-control mb-2" placeholder="NID" value={formData.nid} onChange={e => setFormData({...formData, nid: e.target.value})} required />
              <input className="form-control mb-2" placeholder="Nomor Sertifikat" value={formData.no_sertifikat} onChange={e => setFormData({...formData, no_sertifikat: e.target.value})} required />
              <input type="date" className="form-control mb-3" value={formData.tgl_expired} onChange={e => setFormData({...formData, tgl_expired: e.target.value})} required />
              <button className="btn btn-primary w-100 fw-bold" disabled={loading}>
                {loading ? "PROSES..." : "SIMPAN"}
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card p-3 shadow-sm border-0">
            <table className="table table-sm align-middle" style={{fontSize: '12px'}}>
              <thead className="table-dark">
                <tr><th>Nama</th><th>Sertifikat/No</th><th>Expired</th><th>Aksi</th></tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.id}>
                    <td>{item.nama}</td>
                    <td>{item.sertifikat}<br/><small className="text-primary">{item.no_sertifikat}</small></td>
                    <td>{item.tgl_expired}</td>
                    <td>
                      <button onClick={() => {setEditId(item.id); setFormData(item);}} className="btn btn-warning btn-xs px-2 py-0">Edit</button>
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