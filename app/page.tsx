// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const supabase = createClient(
  "https://soohdpwdrozxsjcmbptv.supabase.co", 
  "sb_publishable_UMsKHT3BizHizC-sG2fiDA_XeoNN3SE"
);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ username: "", password: "" });
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    nama: "", nid: "", no_hp: "", bidang: "", sub_bidang: "", 
    jenis_sertifikat: "Nasional (BNSP)", judul_sertifikat: "", 
    vendor: "", no_sertifikat: "", tgl_expired: ""
  });

  useEffect(() => { if(isLoggedIn) fetchData(); }, [isLoggedIn]);

  async function fetchData() {
    setLoading(true);
    const { data: res, error } = await supabase.from("sertifikasi_final").select("*").order("tgl_expired", { ascending: true });
    if (error) console.error("Error fetching data:", error);
    if (res) setData(res);
    setLoading(false);
  }

  const handleLogin = (e) => {
    e.preventDefault();
    if(user.username === "admin" && user.password === "pln123") setIsLoggedIn(true);
    else alert("Login Gagal! Cek username dan password.");
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const importedData = XLSX.utils.sheet_to_json(ws);
      const { error } = await supabase.from("sertifikasi_final").insert(importedData);
      if (error) alert("Gagal Impor: " + error.message);
      else { alert("Berhasil Impor Data!"); fetchData(); }
    };
    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const template = [{ 
      nama: "Contoh Nama", nid: "12345", no_hp: "628123456789", 
      bidang: "Operasi", sub_bidang: "Turbin", 
      jenis_sertifikat: "Nasional (BNSP)", judul_sertifikat: "K3 Umum", 
      vendor: "Nama Vendor ABC", no_sertifikat: "REG/2024/001", tgl_expired: "2026-12-31" 
    }];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Template_Monitoring.xlsx");
  };

  const exportToExcel = () => {
    if (data.length === 0) return alert("Tidak ada data untuk diekspor");
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data_Sertifikasi");
    XLSX.writeFile(wb, "Database_Sertifikasi.xlsx");
  };

  const handleDelete = async (id) => {
    if(confirm("Hapus data ini?")) {
      await supabase.from("sertifikasi_final").delete().eq("id", id);
      fetchData();
    }
  };

  const totalData = data.length;
  const expiredData = data.filter(d => new Date(d.tgl_expired) < new Date()).length;
  const activeData = totalData - expiredData;

  const chartData = {
    labels: ['Aktif', 'Expired'],
    datasets: [{
      data: totalData === 0 ? [1, 0] : [activeData, expiredData], 
      backgroundColor: totalData === 0 ? ['#e0e0e0', '#e0e0e0'] : ['#00A2E9', '#dc3545'],
      borderWidth: 0,
    }]
  };

  const filteredData = data.filter(item => 
    item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.judul_sertifikat?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', backgroundColor: '#007BB2', position: 'fixed', top: 0, left: 0 }}>
        <div style={{ width: "400px", maxWidth: "90%", backgroundColor: "#ffffff", borderRadius: "20px", padding: "40px", boxSizing: "border-box", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Logo_PLN.png/600px-Logo_PLN.png" style={{ height: "65px", margin: "0 auto 20px auto", display: "block" }} alt="Logo PLN" />
          <h5 style={{ fontWeight: "bold", margin: "0 0 5px 0", color: "#222" }}>LOGIN</h5>
          <p style={{ fontSize: "14px", color: "#333", margin: "0" }}>PLN NUSANTARA POWER</p>
          <p style={{ fontSize: "14px", color: "#333", margin: "0 0 25px 0" }}>UP MUARA KARANG</p>
          <form onSubmit={handleLogin}>
            <input required placeholder="Username" style={{ width: "100%", padding: "14px", marginBottom: "15px", borderRadius: "10px", border: "none", backgroundColor: "#f0f2f5", textAlign: "center", boxSizing: "border-box" }} onChange={e=>setUser({...user, username:e.target.value})} />
            <input required type="password" placeholder="Password" style={{ width: "100%", padding: "14px", marginBottom: "25px", borderRadius: "10px", border: "none", backgroundColor: "#f0f2f5", textAlign: "center", boxSizing: "border-box" }} onChange={e=>setUser({...user, password:e.target.value})} />
            <button type="submit" style={{ width: "100%", padding: "14px", backgroundColor: "#00A2E9", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "bold", fontSize: "15px" }}>MASUK KE SISTEM</button>
          </form>
          <p style={{ fontSize: "11px", color: "#aaa", marginTop: "30px" }}>© 2026 UP Muara Karang</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: "#f4f7f6" }}>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      
      {/* SIDEBAR */}
      <div className="bg-dark text-white d-flex flex-column shadow" style={{ width: "260px", flexShrink: 0 }}>
        <div className="p-4 text-center border-bottom border-secondary mb-3">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Logo_PLN.png/600px-Logo_PLN.png" height="35" className="mb-2" />
          <div className="small fw-bold">PLN NUSANTARA POWER</div>
        </div>
        <div className="px-3 flex-grow-1">
          <button onClick={()=>setActiveTab("dashboard")} className={`btn w-100 text-start mb-2 py-2 ${activeTab==='dashboard'?'btn-primary':'text-white border-0'}`}>📊 Dashboard</button>
          <button onClick={()=>setActiveTab("input")} className={`btn w-100 text-start mb-2 py-2 ${activeTab==='input'?'btn-primary':'text-white border-0'}`}>➕ Input & Impor</button>
          <button onClick={()=>setActiveTab("data")} className={`btn w-100 text-start mb-2 py-2 ${activeTab==='data'?'btn-primary':'text-white border-0'}`}>📁 Database</button>
        </div>
        <div className="mt-auto p-3 border-top border-secondary">
          <button onClick={()=>setIsLoggedIn(false)} className="btn btn-danger w-100 fw-bold">KELUAR</button>
        </div>
      </div>

      <div className="flex-grow-1 p-4 overflow-auto">
        <h4 className="fw-bold text-secondary mb-4">MONITORING SERTIFIKASI UP MUARA KARANG</h4>

        {/* TAB DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="row g-4 text-center">
            <div className="col-md-4"><div className="card border-0 shadow-sm p-4 bg-primary text-white rounded-4"><h6>Total Sertifikasi</h6><h2 className="fw-bold">{totalData}</h2></div></div>
            <div className="col-md-4"><div className="card border-0 shadow-sm p-4 bg-success text-white rounded-4"><h6>Sertifikasi Aktif</h6><h2 className="fw-bold">{activeData}</h2></div></div>
            <div className="col-md-4"><div className="card border-0 shadow-sm p-4 bg-danger text-white rounded-4"><h6>Expired</h6><h2 className="fw-bold">{expiredData}</h2></div></div>
            <div className="col-md-6 mx-auto mt-5">
              <div className="card border-0 shadow-sm p-4 bg-white rounded-4">
                <h6 className="fw-bold mb-3">Persentase Sertifikasi</h6>
                <div style={{ height: "250px" }}><Doughnut data={chartData} options={{ maintainAspectRatio: false }} /></div>
              </div>
            </div>
          </div>
        )}

        {/* TAB INPUT & IMPOR */}
        {activeTab === "input" && (
          <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
             <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">IMPOR & FORMULIR</h6>
                <button onClick={downloadTemplate} className="btn btn-sm btn-outline-success">📁 Template Excel</button>
             </div>
             <input type="file" className="form-control mb-4" accept=".xlsx, .xls" onChange={handleImport} />
             <form onSubmit={async (e)=>{
               e.preventDefault();
               if(editId) await supabase.from("sertifikasi_final").update(formData).eq("id", editId);
               else await supabase.from("sertifikasi_final").insert([formData]);
               alert("Data Berhasil Disimpan!"); setActiveTab("data"); fetchData(); setEditId(null);
             }}>
               <div className="row g-3">
                 <div className="col-md-4"><label className="small fw-bold">Nama Personel</label><input className="form-control" value={formData.nama} onChange={e=>setFormData({...formData, nama:e.target.value})} required /></div>
                 <div className="col-md-4"><label className="small fw-bold">NID</label><input className="form-control" value={formData.nid} onChange={e=>setFormData({...formData, nid:e.target.value})} required /></div>
                 <div className="col-md-4"><label className="small fw-bold">No. HP (WhatsApp)</label><input className="form-control" placeholder="628xxx" value={formData.no_hp} onChange={e=>setFormData({...formData, no_hp:e.target.value})} /></div>
                 <div className="col-md-6"><label className="small fw-bold">Bidang</label><input className="form-control" value={formData.bidang} onChange={e=>setFormData({...formData, bidang:e.target.value})} /></div>
                 <div className="col-md-6"><label className="small fw-bold">Sub Bidang</label><input className="form-control" value={formData.sub_bidang} onChange={e=>setFormData({...formData, sub_bidang:e.target.value})} /></div>
                 <div className="col-md-4"><label className="small fw-bold">Jenis Sertifikat</label>
                    <select className="form-select" value={formData.jenis_sertifikat} onChange={e=>setFormData({...formData, jenis_sertifikat:e.target.value})}>
                        <option value="Nasional (BNSP)">Nasional (BNSP)</option>
                        <option value="Internasional">Internasional</option>
                        <option value="Kemenaker">Kemenaker</option>
                        <option value="Lainnya">Lainnya</option>
                    </select>
                 </div>
                 <div className="col-md-4"><label className="small fw-bold">Vendor</label><input className="form-control" value={formData.vendor} onChange={e=>setFormData({...formData, vendor:e.target.value})} /></div>
                 <div className="col-md-4"><label className="small fw-bold">No. Sertifikat</label><input className="form-control" value={formData.no_sertifikat} onChange={e=>setFormData({...formData, no_sertifikat:e.target.value})} /></div>
                 <div className="col-md-8"><label className="small fw-bold">Judul Sertifikat</label><input className="form-control" value={formData.judul_sertifikat} onChange={e=>setFormData({...formData, judul_sertifikat:e.target.value})} required /></div>
                 <div className="col-md-4"><label className="small fw-bold">Tanggal Expired</label><input type="date" className="form-control" value={formData.tgl_expired} onChange={e=>setFormData({...formData, tgl_expired:e.target.value})} required /></div>
                 <div className="col-md-12 mt-3"><button className="btn btn-primary w-100 fw-bold py-2">SIMPAN DATA</button></div>
               </div>
             </form>
          </div>
        )}

        {/* TAB DATABASE (PENAMBAHAN KOLOM JENIS & NO HP) */}
        {activeTab === "data" && (
          <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
              <div className="position-relative w-100" style={{ maxWidth: "400px" }}>
                <input type="text" className="form-control ps-5" placeholder="Cari Nama, NID, atau Sertifikat..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ borderRadius: "10px" }} />
                <span className="position-absolute top-50 start-0 translate-middle-y ms-3">🔍</span>
              </div>
              <button onClick={exportToExcel} className="btn btn-success fw-bold px-4" style={{ borderRadius: "10px" }}>📥 Export to Excel</button>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle" style={{ fontSize: '13px' }}>
                <thead className="table-light">
                  <tr>
                    <th>PERSONEL</th>
                    <th>BIDANG</th>
                    <th>NO. HP</th>
                    <th>JENIS</th>
                    <th>JUDUL SERTIFIKAT</th>
                    <th>EXPIRED</th>
                    <th className="text-center">AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(item => (
                    <tr key={item.id}>
                      <td><strong>{item.nama}</strong><br/><small className="text-muted">{item.nid}</small></td>
                      <td>{item.bidang}<br/><small className="text-muted">{item.sub_bidang}</small></td>
                      
                      {/* KOLOM NOMOR HP */}
                      <td className="text-primary">{item.no_hp || "-"}</td>
                      
                      {/* KOLOM JENIS SERTIFIKAT */}
                      <td><span className="badge bg-light text-dark border">{item.jenis_sertifikat}</span></td>
                      
                      <td><strong>{item.judul_sertifikat}</strong><br/><small className="text-muted">{item.vendor || "-"}</small></td>
                      <td><span className={`badge ${new Date(item.tgl_expired) < new Date() ? 'bg-danger' : 'bg-success'}`}>{item.tgl_expired}</span></td>
                      <td className="text-center">
                        <a href={`https://wa.me/${item.no_hp}?text=Halo%20${item.nama},%20sertifikat%20${item.judul_sertifikat}%20akan%20expired%20pada%20${item.tgl_expired}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-success me-1">💬 WA</a>
                        <button onClick={()=>{setEditId(item.id); setFormData(item); setActiveTab("input");}} className="btn btn-sm btn-outline-primary me-1">Edit</button>
                        <button onClick={()=>handleDelete(item.id)} className="btn btn-sm btn-outline-danger">Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}