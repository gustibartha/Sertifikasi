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
    sertifikat: "Internal", no_sertifikat: "", tgl_expired: ""
  });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const { data: res } = await supabase.from("sertifikasi_final").select("*").order("tgl_expired", { ascending: true });
    if (res) setData(res);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await supabase.from("sertifikasi_final").update(formData).eq("id", editId);
      } else {
        await supabase.from("sertifikasi_final").insert([formData]);
      }
      alert("Data Berhasil Disimpan!");
      setEditId(null);
      setFormData({ nama: "", nid: "", bidang: "", sub_bidang: "", sertifikat: "Internal", no_sertifikat: "", tgl_expired: "" });
      fetchData();
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      await supabase.from("sertifikasi_final").delete().eq("id", id);
      fetchData();
    }
  };

  const filteredData = data.filter(item => 
    item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.no_sertifikat?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-light min-vh-100">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      
      {/* HEADER / NAVBAR PLN */}
      <nav className="navbar navbar-dark shadow-sm" style={{ backgroundColor: "#00A2E9" }}>
        <div className="container">
          <span className="navbar-brand fw-bold d-flex align-items-center">
            <img src="https://web.pln.co.id/cms/media/logo-pln.png" alt="Logo" width="30" className="me-2" />
            PLN NP UP MUARA KARANG - MONITORING SERTIFIKASI
          </span>
        </div>
      </nav>

      <div className="container py-4">
        <div className="row">
          {/* FORM PANEL */}
          <div className="col-lg-4 mb-4">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="p-3 text-white fw-bold text-center" style={{ backgroundColor: "#005E91" }}>
                {editId ? "EDIT DATA SERTIFIKAT" : "TAMBAH SERTIFIKAT BARU"}
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-2">
                    <label className="small fw-bold">Jenis Sertifikat</label>
                    <select className="form-select form-select-sm" value={formData.sertifikat} onChange={e => setFormData({...formData, sertifikat: e.target.value})}>
                      <option value="Internal">Internal (PLN)</option>
                      <option value="BNSP">Nasional (BNSP)</option>
                      <option value="Internasional">Internasional</option>
                      <option value="Kemenaker">Kemenaker</option>
                    </select>
                  </div>
                  <input className="form-control form-control-sm mb-2" placeholder="Nama Lengkap" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required />
                  <input className="form-control form-control-sm mb-2" placeholder="NID" value={formData.nid} onChange={e => setFormData({...formData, nid: e.target.value})} required />
                  <div className="row g-2 mb-2">
                    <div className="col-6"><input className="form-control form-control-sm" placeholder="Bidang" value={formData.bidang} onChange={e => setFormData({...formData, bidang: e.target.value})} /></div>
                    <div className="col-6"><input className="form-control form-control-sm" placeholder="Sub Bidang" value={formData.sub_bidang} onChange={e => setFormData({...formData, sub_bidang: e.target.value})} /></div>
                  </div>
                  <input className="form-control form-control-sm mb-2" placeholder="Nomor Sertifikat" value={formData.no_sertifikat} onChange={e => setFormData({...formData, no_sertifikat: e.target.value})} required />
                  <div className="mb-3">
                    <label className="small text-muted fw-bold">Tanggal Expired</label>
                    <input type="date" className="form-control form-control-sm" value={formData.tgl_expired} onChange={e => setFormData({...formData, tgl_expired: e.target.value})} required />
                  </div>
                  <button className={`btn w-100 fw-bold shadow-sm ${editId ? 'btn-warning' : 'btn-primary'}`} disabled={loading}>
                    {loading ? "PROSES..." : "SIMPAN DATA"}
                  </button>
                  {editId && <button onClick={() => setEditId(null)} className="btn btn-link btn-sm w-100 mt-2 text-decoration-none text-muted">Batal Edit</button>}
                </form>
              </div>
            </div>
          </div>

          {/* DATA TABLE PANEL */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold m-0">DATABASE SERTIFIKASI</h5>
                <input 
                  className="form-control form-control-sm shadow-none" 
                  style={{ maxWidth: "250px", borderRadius: "20px" }} 
                  placeholder="🔍 Cari nama atau nomor..." 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle" style={{ fontSize: '12.5px' }}>
                  <thead className="bg-light text-secondary text-uppercase" style={{ fontSize: '11px' }}>
                    <tr>
                      <th>Personel</th>
                      <th>Detail Sertifikat</th>
                      <th>Jenis</th>
                      <th>Masa Berlaku</th>
                      <th className="text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item) => {
                      const isExpired = new Date(item.tgl_expired) < new Date();
                      return (
                        <tr key={item.id}>
                          <td>
                            <div className="fw-bold">{item.nama}</div>
                            <div className="text-muted small">{item.nid}</div>
                          </td>
                          <td>
                            <div className="text-primary fw-bold">{item.no_sertifikat}</div>
                            <div className="small">{item.bidang} / {item.sub_bidang}</div>
                          </td>
                          <td><span className="badge rounded-pill bg-secondary">{item.sertifikat}</span></td>
                          <td>
                            <span className={`badge shadow-sm ${isExpired ? 'bg-danger' : 'bg-success'}`}>
                              {item.tgl_expired}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="btn-group">
                              <button onClick={() => setEditId(item.id) || setFormData(item)} className="btn btn-sm btn-outline-primary px-2 py-0">Edit</button>
                              <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-outline-danger px-2 py-0">Hapus</button>
                            </div>
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
    </div>
  );
}