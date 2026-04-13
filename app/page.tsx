// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://soohdpwdrozxsjcmbptv.supabase.co", 
  "sb_publishable_UMsKHT3BizHizC-sG2fiDA_XeoNN3SE"
);

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    nama: "", nid: "", bidang: "", sub_bidang: "", 
    sertifikat: "", no_sertifikat: "", tgl_expired: ""
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
    if (error) console.error("Gagal ambil data:", error.message);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { ...formData };

    try {
      let error;
      if (editId) {
        const { error: err } = await supabase.from("sertifikasi_final").update(payload).eq("id", editId);
        error = err;
      } else {
        const { error: err } = await supabase.from("sertifikasi_final").insert([payload]);
        error = err;
      }

      if (error) throw error;

      alert(editId ? "Data Diperbarui!" : "Berhasil! Data masuk ke Cloud.");
      setEditId(null);
      setFormData({ nama: "", nid: "", bidang: "", sub_bidang: "", sertifikat: "", no_sertifikat: "", tgl_expired: "" });
      await fetchData(); // Refresh otomatis

    } catch (err) {
      alert(`Gagal: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({
      nama: item.nama, nid: item.nid, bidang: item.bidang, sub_bidang: item.sub_bidang,
      sertifikat: item.sertifikat, no_sertifikat: item.no_sertifikat, tgl_expired: item.tgl_expired
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sendWhatsApp = (item) => {
    const pesan = `Halo Bapak/Ibu ${item.nama}, sertifikat Anda (${item.no_sertifikat}) akan berakhir pada tanggal ${item.tgl_expired}. Mohon segera diperpanjang.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(pesan)}`, '_blank');
  };

  // Logika Filter Pencarian
  const filteredData = data.filter(item => 
    item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.no_sertifikat?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid p-4 bg-light" style={{ minHeight: "100vh" }}>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      
      <div className="row">
        {/* Form Input */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4 sticky-top">
            <h5 className="fw-bold text-primary mb-3">{editId ? "📝 Edit Data" : "➕ Tambah Data"}</h5>
            <form onSubmit={handleSubmit}>
              <input className="form-control mb-2" placeholder="Nama Lengkap" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required />
              <input className="form-control mb-2" placeholder="NID" value={formData.nid} onChange={e => setFormData({...formData, nid: e.target.value})} required />
              <input className="form-control mb-2" placeholder="Bidang" value={formData.bidang} onChange={e => setFormData({...formData, bidang: e.target.value})} required />
              <input className="form-control mb-2" placeholder="Sub Bidang" value={formData.sub_bidang} onChange={e => setFormData({...formData, sub_bidang: e.target.value})} required />
              <input className="form-control mb-2" placeholder="Nomor Sertifikat" value={formData.no_sertifikat} onChange={e => setFormData({...formData, no_sertifikat: e.target.value})} required />
              <div className="mb-3">
                <label className="small text-muted fw-bold">Tanggal Expired</label>
                <input type="date" className="form-control" value={formData.tgl_expired} onChange={e => setFormData({...formData, tgl_expired: e.target.value})} required />
              </div>
              <button className={`btn w-100 fw-bold ${editId ? 'btn-warning' : 'btn-primary'}`} disabled={loading}>
                {loading ? "MEMPROSES..." : (editId ? "SIMPAN PERUBAHAN" : "SIMPAN KE CLOUD")}
              </button>
            </form>
          </div>
        </div>

        {/* Tabel Data & Search */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0 p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
              <h5 className="fw-bold mb-3 mb-md-0">Monitoring Sertifikasi</h5>
              <div className="input-group" style={{ maxWidth: "300px" }}>
                <span className="input-group-text bg-white border-end-0">🔍</span>
                <input 
                  type="text" 
                  className="form-control border-start-0" 
                  placeholder="Cari nama/no sertifikat..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle" style={{ fontSize: '13px' }}>
                <thead className="table-dark">
                  <tr>
                    <th>Data Personel</th>
                    <th>Nomor Sertifikat</th>
                    <th>Bidang / Sub</th>
                    <th>Status</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => {
                      const isExpired = new Date(item.tgl_expired) < new Date();
                      return (
                        <tr key={item.id}>
                          <td><strong>{item.nama}</strong><br/><small className="text-muted">{item.nid}</small></td>
                          <td className="fw-bold text-primary">{item.no_sertifikat}</td>
                          <td>{item.bidang}<br/><small className="text-muted">{item.sub_bidang}</small></td>
                          <td>
                            <span className={`badge ${isExpired ? 'bg-danger' : 'bg-success'}`}>
                              {item.tgl_expired}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="btn-group btn-group-sm">
                              <button onClick={() => handleEdit(item)} className="btn btn-outline-warning">Edit</button>
                              <button onClick={() => sendWhatsApp(item)} className="btn btn-outline-success">WA</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr><td colSpan="5" className="text-center py-5 text-muted">Data tidak ditemukan...</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}