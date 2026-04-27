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
import { 
  Plus, 
  Upload, 
  Search,
  MoreHorizontal,
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

// Excel column configuration for TAD
const EXCEL_TEMPLATE_DATA = [
  {
    nid: "TAD-001",
    name: "Ahmad Jalal",
    perusahaan_asal: "PT Tenaga Prima",
    jabatan: "Security",
    bidang: "Keamanan",
    tanggal_lahir: "1988-12-10",
    email: "ahmad@gmail.com",
    phone: "081122334455",
    keterangan: "-"
  }
];

// Daftar vendor PT
const VENDOR_LIST = [
  "PT Tenaga Prima",
  "PT Mitra Energi",
  "PT Garda Security",
  "PT Clean Services",
  "Lainnya"
];

export function TadClient({ initialData }: { initialData: any[] }) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [importResult, setImportResult] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [excelPreview, setExcelPreview] = useState<any[]>([]);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<EmployeeInput>>({
    nid: "",
    name: "",
    tanggal_lahir: "",
    perusahaan_asal: "",
    jabatan: "",
    bidang: "",
    email: "",
    phone: "",
  });

  const handleInputChange = (field: keyof EmployeeInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet(EXCEL_TEMPLATE_DATA);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template TAD");
    XLSX.writeFile(wb, "Template_Import_TAD.xlsx");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const dataToSubmit: EmployeeInput = { 
      ...(formData as any), 
      status_pegawai: "TAD",
      jenis_kelamin: "L",
      status_aktif: "aktif",
    };

    const res = await addEmployee(dataToSubmit);
    
    if (res.success) {
      setIsOpen(false);
      setFormData({
        nid: "", name: "", tanggal_lahir: "",
        perusahaan_asal: "", jabatan: "", bidang: "", email: "", phone: ""
      });
      window.location.reload();
    } else {
      setErrorMsg(res.error || "Gagal menyimpan data");
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async (nid: string) => {
    if (confirm("Yakin ingin menghapus TAD ini? Semua sertifikasi terkait juga akan terhapus.")) {
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
      setExcelPreview(XLSX.utils.sheet_to_json(ws));
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = async () => {
    if (excelPreview.length === 0) return;
    setIsImporting(true);
    setImportResult(null);

    const data = excelPreview.map(row => ({
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
      status_pegawai: "TAD",
      perusahaan_asal: String(row.perusahaan_asal || row.vendor || ""),
      email: String(row.email || ""),
      phone: String(row.phone || ""),
      keterangan: String(row.keterangan || ""),
    }));

    const res = await importEmployeesCSV(data as any);
    if (res.success) {
      setImportResult({ message: res.message || `Berhasil import ${res.imported} TAD.`, type: "success" });
      setTimeout(() => { handleCloseImport(); window.location.reload(); }, 2000);
    } else {
      setImportResult({ message: res.error || "Gagal import data", type: "error" });
    }
    setIsImporting(false);
  };

  const handleCloseImport = () => {
    setIsImportOpen(false); setExcelPreview([]); setFileName(""); setImportResult(null);
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Direktori Tenaga Alih Daya</h1>
          <p className="text-slate-500 mt-1">Kelola data informasi pegawai TAD.</p>
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
                    Import Data TAD (.xlsx)
                  </div>
                  <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="text-xs flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50">
                    <FileDown className="h-3.5 w-3.5" />
                    Download Template
                  </Button>
                </DialogTitle>
                <DialogDescription className="text-slate-500">
                  Gunakan template Excel kami untuk import data TAD yang benar.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3">
                  <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileSelect} className="hidden" id="excel-upload-tad" />
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="border-dashed border-2 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 px-6 py-8 w-full flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-emerald-500" />
                    <span className="text-sm font-medium">{fileName || "Klik untuk pilih file Excel"}</span>
                    {fileName && <span className="text-xs text-emerald-600">✓ File siap diimport</span>}
                  </Button>
                </div>
                {excelPreview.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-700">Preview: <span className="text-emerald-600 font-bold">{excelPreview.length}</span> baris</p>
                      <Button variant="ghost" size="sm" onClick={() => { setExcelPreview([]); setFileName(""); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="h-7 text-xs text-red-500"><X className="h-3.5 w-3.5 mr-1" /> Reset</Button>
                    </div>
                    <div className="rounded-lg border border-slate-200 overflow-hidden shadow-inner bg-slate-50/50">
                      <div className="max-h-[250px] overflow-y-auto">
                        <Table>
                          <TableHeader className="bg-slate-100 sticky top-0">
                            <TableRow>
                              <TableHead className="text-[10px] uppercase font-bold">NID</TableHead>
                              <TableHead className="text-[10px] uppercase font-bold">Nama</TableHead>
                              <TableHead className="text-[10px] uppercase font-bold">Vendor</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {excelPreview.slice(0, 10).map((row, i) => (
                              <TableRow key={i} className="bg-white">
                                <TableCell className="text-xs font-mono py-2">{row.nid || "-"}</TableCell>
                                <TableCell className="text-xs font-medium py-2">{row.name || row.nama || "-"}</TableCell>
                                <TableCell className="text-xs py-2">{row.perusahaan_asal || row.vendor || "-"}</TableCell>
                              </TableRow>
                            ))}
                            {excelPreview.length > 10 && (
                              <TableRow><TableCell colSpan={3} className="text-center text-[10px] text-slate-400 py-2 italic bg-slate-50">... dan {excelPreview.length - 10} baris lainnya</TableCell></TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                )}
                {importResult && (
                  <div className={`flex items-center gap-2 rounded-lg p-3 text-sm border ${importResult.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                    {importResult.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    {importResult.message}
                  </div>
                )}
              </div>
              <DialogFooter className="bg-slate-50/80 -mx-6 -mb-6 p-6 mt-2 border-t">
                <Button type="button" variant="ghost" onClick={handleCloseImport}>Batal</Button>
                <Button onClick={handleImport} disabled={excelPreview.length === 0 || isImporting} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
                  {isImporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                  Import {excelPreview.length > 0 ? `${excelPreview.length} TAD` : ""}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger render={<Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg" />}>
                <Plus className="h-4 w-4" />
                Tambah TAD
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white border-slate-200 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Data Pegawai TAD Baru</DialogTitle>
                <DialogDescription className="text-slate-500">
                  Masukkan informasi dasar untuk tenaga alih daya baru.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  {errorMsg && <div className="bg-red-50 text-red-600 p-2 rounded text-sm">{errorMsg}</div>}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nid">NID <span className="text-red-500">*</span></Label>
                      <Input id="nid" required value={formData.nid} onChange={e => handleInputChange('nid', e.target.value)} placeholder="TAD-XXX" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Lengkap <span className="text-red-500">*</span></Label>
                      <Input id="name" required value={formData.name} onChange={e => handleInputChange('name', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vendor">Perusahaan Asal (Vendor) <span className="text-red-500">*</span></Label>
                      <Select required onValueChange={v => handleInputChange('perusahaan_asal', v)}>
                        <SelectTrigger><SelectValue placeholder="Pilih Vendor" /></SelectTrigger>
                        <SelectContent>
                          {VENDOR_LIST.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Tanggal Lahir</Label>
                      <Input id="dob" type="date" value={formData.tanggal_lahir || ""} onChange={e => handleInputChange('tanggal_lahir', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="jabatan">Jabatan</Label>
                      <Input id="jabatan" value={formData.jabatan || ""} onChange={e => handleInputChange('jabatan', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bidang">Bidang</Label>
                      <Input id="bidang" value={formData.bidang || ""} onChange={e => handleInputChange('bidang', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={formData.email || ""} onChange={e => handleInputChange('email', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone/WA</Label>
                      <Input id="phone" value={formData.phone || ""} onChange={e => handleInputChange('phone', e.target.value)} />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Simpan TAD
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
            <Input placeholder="Cari TAD..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>NID</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Bidang</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Tidak ada data TAD.</TableCell></TableRow>
              ) : (
                filteredData.map((emp) => (
                  <TableRow key={emp.nid}>
                    <TableCell className="font-medium">{emp.nid}</TableCell>
                    <TableCell className="font-semibold">{emp.name}</TableCell>
                    <TableCell>{emp.perusahaan_asal}</TableCell>
                    <TableCell>{emp.jabatan || "-"}</TableCell>
                    <TableCell>{emp.bidang || "-"}</TableCell>
                    <TableCell>{emp.phone || "-"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(emp.nid)}>Hapus</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
