"use client";

import { useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Upload, 
  Search,
  MoreHorizontal,
  Download,
  Edit,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  X,
  FileDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as XLSX from "xlsx";
import { addEmployee, deleteEmployee, importEmployeesCSV, EmployeeInput } from "@/app/actions/employee";

// Excel column configuration for Organik
const EXCEL_TEMPLATE_DATA = [
  {
    nid: "EMP-001",
    name: "Budi Santoso",
    jenis_kelamin: "L",
    tanggal_lahir: "1990-05-20",
    pendidikan: "S1 Teknik",
    grade: "G-10",
    bidang: "Operasi",
    sub_bidang: "Pemeliharaan",
    jabatan: "Teknisi Senior",
    jenjang_jabatan: "Senior Staff",
    pog: 85,
    masa_kerja: 5,
    tanggal_pensiun: "2045-05-20",
    status_aktif: "aktif",
    email: "budi@pln.co.id",
    phone: "08123456789",
    keterangan: "-"
  }
];

export function OrganikClient({ initialData }: { initialData: any[] }) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [importResult, setImportResult] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [excelPreview, setExcelPreview] = useState<any[]>([]);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<EmployeeInput>({
    nid: "",
    name: "",
    jenis_kelamin: "L",
    tanggal_lahir: "",
    pendidikan: "",
    grade: "",
    bidang: "",
    sub_bidang: "",
    jabatan: "",
    jenjang_jabatan: "",
    pog: 0,
    masa_kerja: 0,
    status_aktif: "aktif",
    status_pegawai: "Organik", 
    email: "",
    phone: "",
    keterangan: "",
    tanggal_pensiun: ""
  });

  const handleInputChange = (field: keyof EmployeeInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet(EXCEL_TEMPLATE_DATA);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Organik");
    XLSX.writeFile(wb, "Template_Import_Organik.xlsx");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const dataToSubmit = { ...formData, status_pegawai: "Organik" };
    const res = await addEmployee(dataToSubmit);
    
    if (res.success) {
      setIsOpen(false);
      setFormData({
        nid: "", name: "", jenis_kelamin: "L", tanggal_lahir: "",
        pendidikan: "", grade: "", bidang: "", sub_bidang: "",
        jabatan: "", jenjang_jabatan: "", pog: 0, masa_kerja: 0,
        status_aktif: "aktif", status_pegawai: "Organik", email: "", phone: "", keterangan: "", tanggal_pensiun: ""
      });
      window.location.reload();
    } else {
      setErrorMsg(res.error || "Gagal menyimpan data");
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async (nid: string) => {
    if (confirm("Yakin ingin menghapus pegawai ini? Semua sertifikasi terkait juga akan terhapus.")) {
      await deleteEmployee(nid);
      window.location.reload();
    }
  };

  // Excel Import handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const bstr = event.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      setExcelPreview(data);
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = async () => {
    if (excelPreview.length === 0) return;
    setIsImporting(true);
    setImportResult(null);

    // Map fields and ensure types
    const employeeData = excelPreview.map(row => ({
      nid: String(row.nid || ""),
      name: String(row.name || row.nama || ""),
      jenis_kelamin: String(row.jenis_kelamin || "L"),
      tanggal_lahir: row.tanggal_lahir ? String(row.tanggal_lahir) : null,
      pendidikan: String(row.pendidikan || ""),
      grade: String(row.grade || ""),
      bidang: String(row.bidang || ""),
      sub_bidang: String(row.sub_bidang || ""),
      jabatan: String(row.jabatan || ""),
      jenjang_jabatan: String(row.jenjang_jabatan || ""),
      pog: Number(row.pog) || 0,
      masa_kerja: Number(row.masa_kerja) || 0,
      tanggal_pensiun: row.tanggal_pensiun ? String(row.tanggal_pensiun) : null,
      status_aktif: String(row.status_aktif || "aktif"),
      status_pegawai: "Organik",
      email: String(row.email || ""),
      phone: String(row.phone || ""),
      keterangan: String(row.keterangan || ""),
    }));

    const res = await importEmployeesCSV(employeeData as any);

    if (res.success) {
      setImportResult({ message: res.message || `Berhasil import ${res.imported} pegawai.`, type: "success" });
      setTimeout(() => {
        handleCloseImport();
        window.location.reload();
      }, 2000);
    } else {
      setImportResult({ message: res.error || "Gagal import data", type: "error" });
    }
    setIsImporting(false);
  };

  const handleCloseImport = () => {
    setIsImportOpen(false);
    setExcelPreview([]);
    setFileName("");
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const filteredData = initialData.filter(emp => 
    emp.name.toLowerCase().includes(search.toLowerCase()) || 
    emp.nid.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Direktori Pegawai Organik</h1>
          <p className="text-slate-500 mt-1">Kelola data demografi dan informasi pegawai Organik PLN NP.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isImportOpen} onOpenChange={(open) => { if (!open) handleCloseImport(); else setIsImportOpen(true); }}>
            <DialogTrigger render={<Button variant="outline" className="flex items-center gap-2 border-slate-300 hover:bg-slate-50 transition-all" />}>
                <Upload className="h-4 w-4" />
                Import Excel
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] bg-white border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-6 w-6 text-emerald-600" />
                    Import Data Organik (.xlsx)
                  </div>
                  <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="text-xs flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50">
                    <FileDown className="h-3.5 w-3.5" />
                    Download Template
                  </Button>
                </DialogTitle>
                <DialogDescription className="text-slate-500">
                  Gunakan template Excel kami untuk hasil yang akurat. Format file harus .xlsx atau .xls.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* File Input */}
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="excel-upload-organik"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-dashed border-2 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 px-6 py-8 w-full flex flex-col items-center gap-2"
                  >
                    <Upload className="h-8 w-8 text-slate-400" />
                    <span className="text-sm font-medium">
                      {fileName ? fileName : "Klik untuk pilih file Excel"}
                    </span>
                    {fileName && <span className="text-xs text-emerald-600">✓ File siap diimport</span>}
                  </Button>
                </div>

                {/* Preview */}
                {excelPreview.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <p className="text-sm font-medium text-slate-700">
                        Preview: <span className="text-emerald-600 font-bold">{excelPreview.length}</span> baris data
                      </p>
                      <Button variant="ghost" size="sm" onClick={() => { setExcelPreview([]); setFileName(""); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="h-7 text-xs text-red-500 hover:bg-red-50">
                        <X className="h-3.5 w-3.5 mr-1" /> Reset
                      </Button>
                    </div>
                    <div className="rounded-lg border border-slate-200 overflow-hidden shadow-inner bg-slate-50/50">
                      <div className="max-h-[250px] overflow-y-auto">
                        <Table>
                          <TableHeader className="bg-slate-100 sticky top-0">
                            <TableRow>
                              <TableHead className="text-[10px] uppercase font-bold text-slate-600">NID</TableHead>
                              <TableHead className="text-[10px] uppercase font-bold text-slate-600">Nama</TableHead>
                              <TableHead className="text-[10px] uppercase font-bold text-slate-600">Jabatan</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {excelPreview.slice(0, 10).map((row, i) => (
                              <TableRow key={i} className="hover:bg-white bg-white/50 border-b border-slate-100">
                                <TableCell className="text-xs font-mono py-2">{row.nid || "-"}</TableCell>
                                <TableCell className="text-xs font-medium py-2">{row.name || row.nama || "-"}</TableCell>
                                <TableCell className="text-xs py-2">{row.jabatan || "-"}</TableCell>
                              </TableRow>
                            ))}
                            {excelPreview.length > 10 && (
                              <TableRow>
                                <TableCell colSpan={3} className="text-center text-[11px] text-slate-400 py-3 italic bg-slate-50">
                                  ... dan {excelPreview.length - 10} baris lainnya
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Import Result */}
                {importResult && (
                  <div className={`flex items-center gap-2 rounded-lg p-3 text-sm border shadow-sm ${
                    importResult.type === "success" 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}>
                    {importResult.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    {importResult.message}
                  </div>
                )}
              </div>

              <DialogFooter className="bg-slate-50/80 -mx-6 -mb-6 p-6 mt-2 border-t border-slate-100">
                <Button type="button" variant="ghost" onClick={handleCloseImport}>Batal</Button>
                <Button 
                  onClick={handleImport} 
                  disabled={excelPreview.length === 0 || isImporting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                >
                  {isImporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                  Import {excelPreview.length > 0 ? `${excelPreview.length} Pegawai` : ""}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger render={<Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200" />}>
                <Plus className="h-4 w-4" />
                Tambah Organik
            </DialogTrigger>
            <DialogContent className="sm:max-w-[720px] bg-white border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-slate-900">
                  Data Pegawai Organik Baru
                </DialogTitle>
                <DialogDescription className="text-slate-500">
                  Masukkan informasi lengkap pegawai organik.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-5 py-4">
                  {errorMsg && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                      {errorMsg}
                    </div>
                  )}
                  {/* Baris 1: NID & Nama */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nid">NID <span className="text-red-500">*</span></Label>
                      <Input id="nid" required value={formData.nid} onChange={e => handleInputChange('nid', e.target.value)} placeholder="Contoh: EMP-005" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Lengkap <span className="text-red-500">*</span></Label>
                      <Input id="name" required value={formData.name} onChange={e => handleInputChange('name', e.target.value)} placeholder="Masukkan nama" />
                    </div>
                  </div>
                  {/* Baris 2: Jenis Kelamin & Tanggal Lahir */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender">Jenis Kelamin <span className="text-red-500">*</span></Label>
                      <Select required value={formData.jenis_kelamin || ""} onValueChange={v => handleInputChange('jenis_kelamin', v)}>
                        <SelectTrigger id="gender"><SelectValue placeholder="Pilih L/P" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L">Laki-laki (L)</SelectItem>
                          <SelectItem value="P">Perempuan (P)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Tanggal Lahir <span className="text-red-500">*</span></Label>
                      <Input id="dob" type="date" required value={formData.tanggal_lahir || ""} onChange={e => handleInputChange('tanggal_lahir', e.target.value)} />
                    </div>
                  </div>
                  {/* Baris 3: Pendidikan & Grade */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pendidikan">Pendidikan <span className="text-red-500">*</span></Label>
                      <Input id="pendidikan" required value={formData.pendidikan || ""} onChange={e => handleInputChange('pendidikan', e.target.value)} placeholder="Contoh: S1 Teknik Mesin" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade <span className="text-red-500">*</span></Label>
                      <Input id="grade" required value={formData.grade || ""} onChange={e => handleInputChange('grade', e.target.value)} placeholder="Contoh: G-12" />
                    </div>
                  </div>
                  {/* Baris 4: Bidang & Sub Bidang */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bidang">Bidang <span className="text-red-500">*</span></Label>
                      <Input id="bidang" required value={formData.bidang || ""} onChange={e => handleInputChange('bidang', e.target.value)} placeholder="Contoh: Operasional" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subbidang">Sub Bidang <span className="text-red-500">*</span></Label>
                      <Input id="subbidang" required value={formData.sub_bidang || ""} onChange={e => handleInputChange('sub_bidang', e.target.value)} placeholder="Contoh: Maintenance" />
                    </div>
                  </div>
                  {/* Baris 5: Jabatan & Jenjang */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="jabatan">Jabatan <span className="text-red-500">*</span></Label>
                      <Input id="jabatan" required value={formData.jabatan || ""} onChange={e => handleInputChange('jabatan', e.target.value)} placeholder="Contoh: Teknisi Mesin" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jenjang">Jenjang Jabatan <span className="text-red-500">*</span></Label>
                      <Input id="jenjang" required value={formData.jenjang_jabatan || ""} onChange={e => handleInputChange('jenjang_jabatan', e.target.value)} placeholder="Contoh: Senior Staff" />
                    </div>
                  </div>
                  {/* Baris 6: POG & Masa Kerja */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pog">POG (Angka) <span className="text-red-500">*</span></Label>
                      <Input id="pog" type="number" required value={formData.pog || ""} onChange={e => handleInputChange('pog', parseInt(e.target.value))} placeholder="Contoh: 85" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="masa_kerja">Masa Kerja (Tahun) <span className="text-red-500">*</span></Label>
                      <Input id="masa_kerja" type="number" required value={formData.masa_kerja || ""} onChange={e => handleInputChange('masa_kerja', parseInt(e.target.value))} placeholder="Contoh: 5" />
                    </div>
                  </div>
                  {/* Baris 7: Tgl Pensiun & Status */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tgl_pensiun">Tgl Pensiun <span className="text-red-500">*</span></Label>
                      <Input id="tgl_pensiun" type="date" required value={formData.tanggal_pensiun || ""} onChange={e => handleInputChange('tanggal_pensiun', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status_aktif">Status Karyawan <span className="text-red-500">*</span></Label>
                      <Select required value={formData.status_aktif || ""} onValueChange={v => handleInputChange('status_aktif', v)}>
                        <SelectTrigger id="status_aktif"><SelectValue placeholder="Pilih status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aktif">Aktif</SelectItem>
                          <SelectItem value="mutasi">Mutasi</SelectItem>
                          <SelectItem value="pensiun">Pensiun</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {/* Baris 8: Email & WhatsApp */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={formData.email || ""} onChange={e => handleInputChange('email', e.target.value)} placeholder="email@pln.co.id" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">WhatsApp (Phone)</Label>
                      <Input id="phone" value={formData.phone || ""} onChange={e => handleInputChange('phone', e.target.value)} placeholder="0812..." />
                    </div>
                  </div>
                  {/* Baris 9: Keterangan */}
                  <div className="space-y-2">
                    <Label htmlFor="keterangan">Keterangan</Label>
                    <Input id="keterangan" value={formData.keterangan || ""} onChange={e => handleInputChange('keterangan', e.target.value)} placeholder="Catatan tambahan (opsional)" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Simpan Pegawai
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari nama atau NID..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>NID</TableHead>
                <TableHead>Nama Pegawai</TableHead>
                <TableHead>L/P</TableHead>
                <TableHead>Tgl Lahir</TableHead>
                <TableHead>Pendidikan</TableHead>
                <TableHead>Bidang</TableHead>
                <TableHead>Sub Bidang</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Jenjang</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>POG</TableHead>
                <TableHead>Masa Kerja</TableHead>
                <TableHead>Usia</TableHead>
                <TableHead>Tgl Pensiun</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={17} className="text-center py-8 text-muted-foreground">
                    Tidak ada data pegawai organik ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((emp) => {
                  let usia = "-";
                  if (emp.tanggal_lahir) {
                    const birthYear = new Date(emp.tanggal_lahir).getFullYear();
                    const currentYear = new Date().getFullYear();
                    usia = (currentYear - birthYear).toString() + " Thn";
                  }

                  return (
                    <TableRow key={emp.nid}>
                      <TableCell className="font-medium text-muted-foreground">{emp.nid}</TableCell>
                      <TableCell className="font-semibold">{emp.name}</TableCell>
                      <TableCell>{emp.jenis_kelamin || "-"}</TableCell>
                      <TableCell className="text-xs">{emp.tanggal_lahir ? new Date(emp.tanggal_lahir).toLocaleDateString('id-ID') : "-"}</TableCell>
                      <TableCell className="text-xs">{emp.pendidikan || "-"}</TableCell>
                      <TableCell>{emp.bidang || "-"}</TableCell>
                      <TableCell>{emp.sub_bidang || "-"}</TableCell>
                      <TableCell>{emp.jabatan || "-"}</TableCell>
                      <TableCell>{emp.jenjang_jabatan || "-"}</TableCell>
                      <TableCell className="font-mono font-medium">{emp.grade || "-"}</TableCell>
                      <TableCell className="font-mono">{emp.pog ?? "-"}</TableCell>
                      <TableCell>{emp.masa_kerja ?? "-"} Thn</TableCell>
                      <TableCell>{usia}</TableCell>
                      <TableCell className="text-xs">{emp.tanggal_pensiun ? new Date(emp.tanggal_pensiun).toLocaleDateString('id-ID') : "-"}</TableCell>
                      <TableCell className="text-xs">{emp.email || "-"}</TableCell>
                      <TableCell className="text-xs">{emp.phone || "-"}</TableCell>
                      <TableCell>
                        {emp.status_aktif === "aktif" && <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">Aktif</Badge>}
                        {emp.status_aktif === "mutasi" && <Badge className="bg-amber-500 text-white hover:bg-amber-600">Mutasi</Badge>}
                        {emp.status_aktif === "pensiun" && <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30">Pensiun</Badge>}
                        {!["aktif", "mutasi", "pensiun"].includes(emp.status_aktif) && <Badge variant="secondary">{emp.status_aktif || "Aktif"}</Badge>}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate" title={emp.keterangan || "-"}>{emp.keterangan || "-"}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
                              <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 bg-white">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 font-medium" onClick={() => handleDelete(emp.nid)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
