"use client";

import { useState, useRef, useEffect } from "react";
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
  FileDown,
  Calendar,
  Filter,
  RotateCcw
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
import { addEmployee, updateEmployee, deleteEmployee, importEmployeesCSV, EmployeeInput } from "@/app/actions/employee";
import { normalizePendidikan } from "@/lib/utils";

// Helper to convert Excel Serial Date to YYYY-MM-DD
function excelDateToJSDate(serial: any): string | null {
  if (!serial) return null;
  if (typeof serial === 'string' && serial.includes('-')) return serial; // Already YYYY-MM-DD
  
  const num = Number(serial);
  if (isNaN(num)) return String(serial);

  const date = new Date(Math.round((num - 25569) * 86400 * 1000));
  return date.toISOString().split('T')[0];
}

// Helper to calculate years between two dates
function calculateYears(startDateStr: string | null): number {
  if (!startDateStr) return 0;
  try {
    const start = new Date(startDateStr);
    if (isNaN(start.getTime())) return 0;
    
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    const monthDiff = now.getMonth() - start.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < start.getDate())) {
      years--;
    }
    return Math.max(0, years);
  } catch {
    return 0;
  }
}

// Excel column configuration for Organik
const EXCEL_TEMPLATE_DATA = [
  {
    nid: "EMP-001",
    name: "Budi Santoso",
    jenis_kelamin: "L",
    tanggal_lahir: "1990-05-20",
    tanggal_masuk: "2015-01-15",
    pendidikan: "S1 Teknik",
    grade: "G-10",
    bidang: "Operasi",
    sub_bidang: "Pemeliharaan",
    jabatan: "Teknisi Senior",
    jenjang_jabatan: "Senior Staff",
    pog: 85,
    tanggal_pensiun: "2045-05-20",
    status_aktif: "aktif",
    email: "budi@pln.co.id",
    phone: "08123456789",
    keterangan: "-"
  }
];

export function OrganikClient({ initialData }: { initialData: any[] }) {
  const [search, setSearch] = useState("");
  const [filterBidang, setFilterBidang] = useState("all");
  const [filterGrade, setFilterGrade] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterJenjang, setFilterJenjang] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [filterPendidikan, setFilterPendidikan] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editErrorMsg, setEditErrorMsg] = useState("");
  const [editData, setEditData] = useState<EmployeeInput | null>(null);
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
    tanggal_masuk: "",
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

  // Auto-calculate masa_kerja when tanggal_masuk changes
  useEffect(() => {
    if (formData.tanggal_masuk) {
      const years = calculateYears(formData.tanggal_masuk);
      if (years !== formData.masa_kerja) {
        setFormData(prev => ({ ...prev, masa_kerja: years }));
      }
    }
  }, [formData.tanggal_masuk, formData.masa_kerja]);

  const handleInputChange = (field: keyof EmployeeInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet(EXCEL_TEMPLATE_DATA);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Organik");
    XLSX.writeFile(wb, "Template_Import_Organik_V2.xlsx");
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
        nid: "", name: "", jenis_kelamin: "L", tanggal_lahir: "", tanggal_masuk: "",
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

  // Edit handlers
  const handleEditOpen = (emp: any) => {
    setEditErrorMsg("");
    setEditData({
      nid: emp.nid || "",
      name: emp.name || "",
      jenis_kelamin: emp.jenis_kelamin || "L",
      tanggal_lahir: emp.tanggal_lahir || "",
      tanggal_masuk: emp.tanggal_masuk || "",
      pendidikan: emp.pendidikan || "",
      grade: emp.grade || "",
      bidang: emp.bidang || "",
      sub_bidang: emp.sub_bidang || "",
      jabatan: emp.jabatan || "",
      jenjang_jabatan: emp.jenjang_jabatan || "",
      pog: emp.pog ?? 0,
      masa_kerja: emp.masa_kerja ?? 0,
      status_aktif: emp.status_aktif || "aktif",
      status_pegawai: "Organik",
      email: emp.email || "",
      phone: emp.phone || "",
      keterangan: emp.keterangan || "",
      tanggal_pensiun: emp.tanggal_pensiun || "",
    });
    setIsEditOpen(true);
  };

  const handleEditChange = (field: keyof EmployeeInput, value: any) => {
    setEditData(prev => {
      if (!prev) return prev;
      const next = { ...prev, [field]: value };
      if (field === "tanggal_masuk") next.masa_kerja = calculateYears(value);
      return next;
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData) return;
    setIsEditing(true);
    setEditErrorMsg("");

    // NID adalah primary key, tidak diikutkan di payload update
    const { nid, ...payload } = editData;
    const res = await updateEmployee(nid, payload);

    if (res.success) {
      setIsEditOpen(false);
      window.location.reload();
    } else {
      setEditErrorMsg(res.error || "Gagal memperbarui data");
    }
    setIsEditing(false);
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
      const wb = XLSX.read(bstr, { type: "binary", cellDates: false });
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
    const employeeData = excelPreview.map(row => {
      const tglLahir = excelDateToJSDate(row.tanggal_lahir || row.tgl_lahir);
      const tglMasuk = excelDateToJSDate(row.tanggal_masuk || row.tgl_masuk);
      const tglPensiun = excelDateToJSDate(row.tanggal_pensiun || row.tgl_pensiun);

      // Auto-calculate masa_kerja if tanggal_masuk exists
      let calculatedMasaKerja = Number(row.masa_kerja) || 0;
      if (tglMasuk) {
        calculatedMasaKerja = calculateYears(tglMasuk);
      }

      return {
        nid: String(row.nid || ""),
        name: String(row.name || row.nama || ""),
        jenis_kelamin: String(row.jenis_kelamin || "L"),
        tanggal_lahir: tglLahir,
        tanggal_masuk: tglMasuk,
        pendidikan: String(row.pendidikan || ""),
        grade: String(row.grade || ""),
        bidang: String(row.bidang || ""),
        sub_bidang: String(row.sub_bidang || ""),
        jabatan: String(row.jabatan || ""),
        jenjang_jabatan: String(row.jenjang_jabatan || ""),
        pog: Number(row.pog) || 0,
        masa_kerja: calculatedMasaKerja,
        tanggal_pensiun: tglPensiun,
        status_aktif: String(row.status_aktif || "aktif"),
        status_pegawai: "Organik",
        email: String(row.email || ""),
        phone: String(row.phone || ""),
        keterangan: String(row.keterangan || ""),
      };
    });

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

  // Unique values for filter dropdowns (sorted, non-empty)
  const uniqueBidang = Array.from(new Set(initialData.map(e => e.bidang).filter(Boolean))).sort();
  const uniqueGrade = Array.from(new Set(initialData.map(e => e.grade).filter(Boolean))).sort();
  const uniqueStatus = Array.from(new Set(initialData.map(e => e.status_aktif).filter(Boolean))).sort();
  const uniqueJenjang = Array.from(new Set(initialData.map(e => e.jenjang_jabatan).filter(Boolean))).sort();
  const uniquePendidikan = Array.from(new Set(initialData.map(e => normalizePendidikan(e.pendidikan)))).sort();

  const activeFilterCount = [filterBidang, filterGrade, filterStatus, filterJenjang, filterGender, filterPendidikan].filter(v => v !== "all").length;

  const resetFilters = () => {
    setSearch("");
    setFilterBidang("all");
    setFilterGrade("all");
    setFilterStatus("all");
    setFilterJenjang("all");
    setFilterGender("all");
    setFilterPendidikan("all");
  };

  const filteredData = initialData.filter(emp => {
    const matchSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.nid.toLowerCase().includes(search.toLowerCase());
    const matchBidang = filterBidang === "all" || emp.bidang === filterBidang;
    const matchGrade = filterGrade === "all" || emp.grade === filterGrade;
    const matchStatus = filterStatus === "all" || emp.status_aktif === filterStatus;
    const matchJenjang = filterJenjang === "all" || emp.jenjang_jabatan === filterJenjang;
    const matchGender = filterGender === "all" || emp.jenis_kelamin === filterGender;
    const matchPendidikan = filterPendidikan === "all" || normalizePendidikan(emp.pendidikan) === filterPendidikan;
    return matchSearch && matchBidang && matchGrade && matchStatus && matchJenjang && matchGender && matchPendidikan;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Direktori Pegawai Organik</h1>
          <p className="text-slate-500 mt-1">Kelola data demografi dan informasi pegawai Organik PLN NP.</p>
        </div>
        <div className="flex gap-2">
          {/* Import Excel Dialog */}
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
                    Download Template Baru
                  </Button>
                </DialogTitle>
                <DialogDescription className="text-slate-500">
                  Sistem akan memperbaiki format tanggal dari Excel secara otomatis.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3">
                  <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileSelect} className="hidden" id="excel-upload-organik" />
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="border-dashed border-2 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 px-6 py-8 w-full flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-slate-400" />
                    <span className="text-sm font-medium">{fileName || "Klik untuk pilih file Excel"}</span>
                    {fileName && <span className="text-xs text-emerald-600">✓ File siap diimport</span>}
                  </Button>
                </div>

                {excelPreview.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <p className="text-sm font-medium text-slate-700">Preview: <span className="text-emerald-600 font-bold">{excelPreview.length}</span> baris</p>
                      <Button variant="ghost" size="sm" onClick={() => { setExcelPreview([]); setFileName(""); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="h-7 text-xs text-red-500 hover:bg-red-50"><X className="h-3.5 w-3.5 mr-1" /> Reset</Button>
                    </div>
                    <div className="rounded-lg border overflow-hidden shadow-inner bg-slate-50/50">
                      <div className="max-h-[250px] overflow-y-auto">
                        <Table>
                          <TableHeader className="bg-slate-100 sticky top-0 text-[10px] uppercase font-bold">
                            <TableRow>
                              <TableHead>NID</TableHead>
                              <TableHead>Nama</TableHead>
                              <TableHead>Tgl Masuk (Raw)</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {excelPreview.slice(0, 10).map((row, i) => (
                              <TableRow key={i} className="bg-white border-b border-slate-100">
                                <TableCell className="text-xs font-mono">{row.nid || "-"}</TableCell>
                                <TableCell className="text-xs font-medium">{row.name || row.nama || "-"}</TableCell>
                                <TableCell className="text-xs">{row.tanggal_masuk || row.tgl_masuk || "-"}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                )}

                {importResult && (
                  <div className={`flex items-center gap-2 rounded-lg p-3 text-sm border shadow-sm ${importResult.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                    {importResult.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    {importResult.message}
                  </div>
                )}
              </div>

              <DialogFooter className="bg-slate-50/80 -mx-6 -mb-6 p-6 mt-2 border-t">
                <Button type="button" variant="ghost" onClick={handleCloseImport}>Batal</Button>
                <Button onClick={handleImport} disabled={excelPreview.length === 0 || isImporting} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
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
                <DialogTitle className="text-2xl font-bold">Data Pegawai Organik Baru</DialogTitle>
                <DialogDescription className="text-slate-500">Isi data lengkap di bawah ini. Masa kerja akan dihitung otomatis.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-5 py-4">
                  {errorMsg && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">{errorMsg}</div>}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nid">NID <span className="text-red-500">*</span></Label>
                      <Input id="nid" required value={formData.nid} onChange={e => handleInputChange('nid', e.target.value)} placeholder="EMP-XXX" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Lengkap <span className="text-red-500">*</span></Label>
                      <Input id="name" required value={formData.name} onChange={e => handleInputChange('name', e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender">Jenis Kelamin <span className="text-red-500">*</span></Label>
                      <Select required value={formData.jenis_kelamin || ""} onValueChange={v => handleInputChange('jenis_kelamin', v)}>
                        <SelectTrigger id="gender"><SelectValue placeholder="Pilih L/P" /></SelectTrigger>
                        <SelectContent><SelectItem value="L">Laki-laki (L)</SelectItem><SelectItem value="P">Perempuan (P)</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Tanggal Lahir <span className="text-red-500">*</span></Label>
                      <Input id="dob" type="date" required value={formData.tanggal_lahir || ""} onChange={e => handleInputChange('tanggal_lahir', e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                    <div className="space-y-2">
                      <Label htmlFor="tgl_masuk" className="text-blue-700 font-bold flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Tanggal Masuk <span className="text-red-500">*</span>
                      </Label>
                      <Input id="tgl_masuk" type="date" required value={formData.tanggal_masuk || ""} onChange={e => handleInputChange('tanggal_masuk', e.target.value)} className="border-blue-200 focus:ring-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="masa_kerja_auto" className="text-blue-700 font-bold">Masa Kerja (Otomatis)</Label>
                      <div className="flex items-center gap-2">
                        <Input id="masa_kerja_auto" type="number" readOnly value={formData.masa_kerja || 0} className="bg-blue-100 border-blue-200 font-bold text-blue-800" />
                        <span className="text-sm font-medium text-blue-600">Tahun</span>
                      </div>
                      <p className="text-[10px] text-blue-500 italic">*Dihitung otomatis dari Tanggal Masuk</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pendidikan">Pendidikan <span className="text-red-500">*</span></Label>
                      <Input id="pendidikan" required value={formData.pendidikan || ""} onChange={e => handleInputChange('pendidikan', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade <span className="text-red-500">*</span></Label>
                      <Input id="grade" required value={formData.grade || ""} onChange={e => handleInputChange('grade', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bidang">Bidang <span className="text-red-500">*</span></Label>
                      <Input id="bidang" required value={formData.bidang || ""} onChange={e => handleInputChange('bidang', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subbidang">Sub Bidang <span className="text-red-500">*</span></Label>
                      <Input id="subbidang" required value={formData.sub_bidang || ""} onChange={e => handleInputChange('sub_bidang', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="jabatan">Jabatan <span className="text-red-500">*</span></Label>
                      <Input id="jabatan" required value={formData.jabatan || ""} onChange={e => handleInputChange('jabatan', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jenjang">Jenjang Jabatan <span className="text-red-500">*</span></Label>
                      <Input id="jenjang" required value={formData.jenjang_jabatan || ""} onChange={e => handleInputChange('jenjang_jabatan', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pog">POG <span className="text-red-500">*</span></Label>
                      <Input id="pog" type="number" required value={formData.pog || ""} onChange={e => handleInputChange('pog', parseInt(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tgl_pensiun">Tgl Pensiun <span className="text-red-500">*</span></Label>
                      <Input id="tgl_pensiun" type="date" required value={formData.tanggal_pensiun || ""} onChange={e => handleInputChange('tanggal_pensiun', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status_aktif">Status Karyawan <span className="text-red-500">*</span></Label>
                      <Select required value={formData.status_aktif || ""} onValueChange={v => handleInputChange('status_aktif', v)}>
                        <SelectTrigger id="status_aktif"><SelectValue placeholder="Pilih status" /></SelectTrigger>
                        <SelectContent><SelectItem value="aktif">Aktif</SelectItem><SelectItem value="mutasi">Mutasi</SelectItem><SelectItem value="pensiun">Pensiun</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">WhatsApp</Label>
                      <Input id="phone" value={formData.phone || ""} onChange={e => handleInputChange('phone', e.target.value)} />
                    </div>
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
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
          <div className="relative flex-1 lg:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input placeholder="Cari nama atau NID..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium pr-1">
              <Filter className="h-4 w-4" /> Filter:
            </div>

            <Select value={filterBidang} onValueChange={(v) => v && setFilterBidang(v)}>
              <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Bidang" /></SelectTrigger>
              <SelectContent className="bg-white max-h-[300px]">
                <SelectItem value="all">Semua Bidang</SelectItem>
                {uniqueBidang.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filterGrade} onValueChange={(v) => v && setFilterGrade(v)}>
              <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Grade" /></SelectTrigger>
              <SelectContent className="bg-white max-h-[300px]">
                <SelectItem value="all">Semua Grade</SelectItem>
                {uniqueGrade.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={(v) => v && setFilterStatus(v)}>
              <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent className="bg-white max-h-[300px]">
                <SelectItem value="all">Semua Status</SelectItem>
                {uniqueStatus.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filterJenjang} onValueChange={(v) => v && setFilterJenjang(v)}>
              <SelectTrigger className="w-[170px] h-9"><SelectValue placeholder="Jenjang Jabatan" /></SelectTrigger>
              <SelectContent className="bg-white max-h-[300px]">
                <SelectItem value="all">Semua Jenjang</SelectItem>
                {uniqueJenjang.map(j => <SelectItem key={j} value={j}>{j}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filterPendidikan} onValueChange={(v) => v && setFilterPendidikan(v)}>
              <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Pendidikan" /></SelectTrigger>
              <SelectContent className="bg-white max-h-[300px]">
                <SelectItem value="all">Semua Pendidikan</SelectItem>
                {uniquePendidikan.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filterGender} onValueChange={(v) => v && setFilterGender(v)}>
              <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="Jenis Kelamin" /></SelectTrigger>
              <SelectContent className="bg-white max-h-[300px]">
                <SelectItem value="all">Semua Gender</SelectItem>
                <SelectItem value="L">Laki-laki</SelectItem>
                <SelectItem value="P">Perempuan</SelectItem>
              </SelectContent>
            </Select>

            {(activeFilterCount > 0 || search) && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-9 text-slate-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-1.5">
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-3 text-sm text-slate-500">
          <span>Menampilkan <span className="font-bold text-slate-700">{filteredData.length}</span> dari {initialData.length} pegawai</span>
          {activeFilterCount > 0 && <span className="text-blue-600 font-medium">{activeFilterCount} filter aktif</span>}
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="text-xs uppercase">
                <TableHead>NID</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Tgl Masuk</TableHead>
                <TableHead>Masa Kerja</TableHead>
                <TableHead>Bidang</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>POG</TableHead>
                <TableHead>Usia</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow><TableCell colSpan={11} className="text-center py-8 text-muted-foreground">Tidak ada data ditemukan.</TableCell></TableRow>
              ) : (
                filteredData.map((emp) => {
                  const usiaNum = calculateYears(emp.tanggal_lahir);
                  const usia = usiaNum > 0 ? `${usiaNum} Thn` : "-";
                  
                  const mkNum = calculateYears(emp.tanggal_masuk);
                  const mk = mkNum > 0 ? `${mkNum} Thn` : (emp.masa_kerja ? `${emp.masa_kerja} Thn` : "-");

                  return (
                    <TableRow key={emp.nid} className="hover:bg-slate-50/50">
                      <TableCell className="font-mono text-xs text-slate-500">{emp.nid}</TableCell>
                      <TableCell className="font-bold">{emp.name}</TableCell>
                      <TableCell className="text-xs font-medium text-blue-600">{emp.tanggal_masuk ? new Date(emp.tanggal_masuk).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}) : "-"}</TableCell>
                      <TableCell className="font-bold text-slate-700">{mk}</TableCell>
                      <TableCell className="text-xs">{emp.bidang || "-"}</TableCell>
                      <TableCell className="text-xs">{emp.jabatan || "-"}</TableCell>
                      <TableCell className="font-mono text-xs">{emp.grade || "-"}</TableCell>
                      <TableCell className="font-mono text-xs">{emp.pog ?? "-"}</TableCell>
                      <TableCell className="text-xs">{usia}</TableCell>
                      <TableCell>
                        <Badge className={emp.status_aktif === "aktif" ? "bg-emerald-500" : "bg-slate-400"}>{emp.status_aktif || "Aktif"}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}><MoreHorizontal className="h-4 w-4" /></DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white">
                            <DropdownMenuItem onClick={() => handleEditOpen(emp)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(emp.nid)}><Trash2 className="mr-2 h-4 w-4" /> Hapus</DropdownMenuItem>
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

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setEditData(null); }}>
        <DialogContent className="sm:max-w-[720px] bg-white border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Pegawai Organik</DialogTitle>
            <DialogDescription className="text-slate-500">Perbarui data pegawai. NID tidak dapat diubah.</DialogDescription>
          </DialogHeader>
          {editData && (
            <form onSubmit={handleEditSubmit}>
              <div className="grid gap-5 py-4">
                {editErrorMsg && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">{editErrorMsg}</div>}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_nid">NID</Label>
                    <Input id="edit_nid" value={editData.nid} readOnly className="bg-slate-100 text-slate-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_name">Nama Lengkap <span className="text-red-500">*</span></Label>
                    <Input id="edit_name" required value={editData.name} onChange={e => handleEditChange('name', e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_gender">Jenis Kelamin <span className="text-red-500">*</span></Label>
                    <Select required value={editData.jenis_kelamin || ""} onValueChange={v => v && handleEditChange('jenis_kelamin', v)}>
                      <SelectTrigger id="edit_gender"><SelectValue placeholder="Pilih L/P" /></SelectTrigger>
                      <SelectContent className="bg-white"><SelectItem value="L">Laki-laki (L)</SelectItem><SelectItem value="P">Perempuan (P)</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_dob">Tanggal Lahir</Label>
                    <Input id="edit_dob" type="date" value={editData.tanggal_lahir || ""} onChange={e => handleEditChange('tanggal_lahir', e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                  <div className="space-y-2">
                    <Label htmlFor="edit_tgl_masuk" className="text-blue-700 font-bold flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Tanggal Masuk
                    </Label>
                    <Input id="edit_tgl_masuk" type="date" value={editData.tanggal_masuk || ""} onChange={e => handleEditChange('tanggal_masuk', e.target.value)} className="border-blue-200 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_masa_kerja" className="text-blue-700 font-bold">Masa Kerja (Otomatis)</Label>
                    <div className="flex items-center gap-2">
                      <Input id="edit_masa_kerja" type="number" readOnly value={editData.masa_kerja || 0} className="bg-blue-100 border-blue-200 font-bold text-blue-800" />
                      <span className="text-sm font-medium text-blue-600">Tahun</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_pendidikan">Pendidikan</Label>
                    <Input id="edit_pendidikan" value={editData.pendidikan || ""} onChange={e => handleEditChange('pendidikan', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_grade">Grade</Label>
                    <Input id="edit_grade" value={editData.grade || ""} onChange={e => handleEditChange('grade', e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_bidang">Bidang</Label>
                    <Input id="edit_bidang" value={editData.bidang || ""} onChange={e => handleEditChange('bidang', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_subbidang">Sub Bidang</Label>
                    <Input id="edit_subbidang" value={editData.sub_bidang || ""} onChange={e => handleEditChange('sub_bidang', e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_jabatan">Jabatan</Label>
                    <Input id="edit_jabatan" value={editData.jabatan || ""} onChange={e => handleEditChange('jabatan', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_jenjang">Jenjang Jabatan</Label>
                    <Input id="edit_jenjang" value={editData.jenjang_jabatan || ""} onChange={e => handleEditChange('jenjang_jabatan', e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_pog">POG</Label>
                    <Input id="edit_pog" type="number" value={editData.pog ?? ""} onChange={e => handleEditChange('pog', e.target.value === "" ? 0 : parseInt(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_tgl_pensiun">Tgl Pensiun</Label>
                    <Input id="edit_tgl_pensiun" type="date" value={editData.tanggal_pensiun || ""} onChange={e => handleEditChange('tanggal_pensiun', e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_status_aktif">Status Karyawan</Label>
                    <Select value={editData.status_aktif || ""} onValueChange={v => v && handleEditChange('status_aktif', v)}>
                      <SelectTrigger id="edit_status_aktif"><SelectValue placeholder="Pilih status" /></SelectTrigger>
                      <SelectContent className="bg-white"><SelectItem value="aktif">Aktif</SelectItem><SelectItem value="mutasi">Mutasi</SelectItem><SelectItem value="pensiun">Pensiun</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_phone">WhatsApp</Label>
                    <Input id="edit_phone" value={editData.phone || ""} onChange={e => handleEditChange('phone', e.target.value)} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setIsEditOpen(false); setEditData(null); }}>Batal</Button>
                <Button type="submit" disabled={isEditing} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {isEditing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Simpan Perubahan
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
