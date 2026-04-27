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
  X
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
import { addEmployee, deleteEmployee, importEmployeesCSV, EmployeeInput } from "@/app/actions/employee";

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
  if (lines.length < 2) return [];
  const delimiter = lines[0].includes(";") ? ";" : ",";
  const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase().replace(/['"]/g, ""));
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter).map(v => v.trim().replace(/^["']|["']$/g, ""));
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = values[idx] || ""; });
    rows.push(row);
  }
  return rows;
}

function mapCSVToTAD(csvRow: Record<string, string>): EmployeeInput {
  return {
    nid: csvRow["nid"] || "",
    name: csvRow["name"] || csvRow["nama"] || "",
    jenis_kelamin: csvRow["jenis_kelamin"] || csvRow["gender"] || "L",
    tanggal_lahir: csvRow["tanggal_lahir"] || csvRow["tgl_lahir"] || "",
    pendidikan: csvRow["pendidikan"] || "",
    grade: csvRow["grade"] || "",
    bidang: csvRow["bidang"] || "",
    sub_bidang: csvRow["sub_bidang"] || "",
    jabatan: csvRow["jabatan"] || "",
    jenjang_jabatan: csvRow["jenjang_jabatan"] || "",
    pog: csvRow["pog"] ? parseInt(csvRow["pog"]) || 0 : 0,
    masa_kerja: csvRow["masa_kerja"] ? parseInt(csvRow["masa_kerja"]) || 0 : 0,
    tanggal_pensiun: csvRow["tanggal_pensiun"] || "",
    status_aktif: csvRow["status_aktif"] || "aktif",
    status_pegawai: "TAD",
    perusahaan_asal: csvRow["perusahaan_asal"] || csvRow["vendor"] || "",
    email: csvRow["email"] || "",
    phone: csvRow["phone"] || csvRow["whatsapp"] || "",
    keterangan: csvRow["keterangan"] || "",
  };
}

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
  const [csvPreview, setCsvPreview] = useState<Record<string, string>[]>([]);
  const [csvFileName, setCsvFileName] = useState("");
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

  // CSV Import handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFileName(file.name);
    setImportResult(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvPreview(parseCSV(text));
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (csvPreview.length === 0) return;
    setIsImporting(true);
    setImportResult(null);
    const data = csvPreview.map(row => mapCSVToTAD(row));
    const res = await importEmployeesCSV(data);
    if (res.success) {
      setImportResult({ message: res.message || `Berhasil import ${res.imported} TAD.`, type: "success" });
      setTimeout(() => { setIsImportOpen(false); setCsvPreview([]); setCsvFileName(""); window.location.reload(); }, 2000);
    } else {
      setImportResult({ message: res.error || "Gagal import data", type: "error" });
    }
    setIsImporting(false);
  };

  const handleCloseImport = () => {
    setIsImportOpen(false); setCsvPreview([]); setCsvFileName(""); setImportResult(null);
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
          {/* Import CSV Dialog */}
          <Dialog open={isImportOpen} onOpenChange={(open) => { if (!open) handleCloseImport(); else setIsImportOpen(true); }}>
            <DialogTrigger>
              <Button variant="outline" className="flex items-center gap-2 border-slate-300 hover:bg-slate-50 transition-all">
                <Upload className="h-4 w-4" />
                Import CSV
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] bg-white/95 backdrop-blur-xl border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center gap-2">
                  <FileSpreadsheet className="h-6 w-6 text-emerald-600" />
                  Import Data TAD
                </DialogTitle>
                <DialogDescription className="text-slate-500">
                  Upload file CSV dengan kolom: nid, name, perusahaan_asal, jabatan, bidang, tanggal_lahir, email, phone, keterangan
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3">
                  <input ref={fileInputRef} type="file" accept=".csv,.txt" onChange={handleFileSelect} className="hidden" id="csv-upload-tad" />
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="border-dashed border-2 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 px-6 py-8 w-full flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-emerald-500" />
                    <span className="text-sm font-medium">{csvFileName || "Klik untuk pilih file CSV"}</span>
                    {csvFileName && <span className="text-xs text-emerald-600">✓ File terpilih</span>}
                  </Button>
                </div>
                {csvPreview.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-700">Preview: <span className="text-emerald-600 font-bold">{csvPreview.length}</span> baris</p>
                      <Button variant="ghost" size="sm" onClick={() => { setCsvPreview([]); setCsvFileName(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}><X className="h-4 w-4 mr-1" /> Reset</Button>
                    </div>
                    <div className="rounded-md border overflow-x-auto max-h-[250px] overflow-y-auto">
                      <Table>
                        <TableHeader className="bg-slate-50 sticky top-0">
                          <TableRow>
                            <TableHead className="text-xs">#</TableHead>
                            <TableHead className="text-xs">NID</TableHead>
                            <TableHead className="text-xs">Nama</TableHead>
                            <TableHead className="text-xs">Vendor</TableHead>
                            <TableHead className="text-xs">Jabatan</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {csvPreview.slice(0, 10).map((row, i) => (
                            <TableRow key={i}>
                              <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                              <TableCell className="text-xs font-mono">{row.nid || "-"}</TableCell>
                              <TableCell className="text-xs font-medium">{row.name || row.nama || "-"}</TableCell>
                              <TableCell className="text-xs">{row.perusahaan_asal || row.vendor || "-"}</TableCell>
                              <TableCell className="text-xs">{row.jabatan || "-"}</TableCell>
                            </TableRow>
                          ))}
                          {csvPreview.length > 10 && (
                            <TableRow><TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-2">... dan {csvPreview.length - 10} baris lainnya</TableCell></TableRow>
                          )}
                        </TableBody>
                      </Table>
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
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseImport}>Batal</Button>
                <Button onClick={handleImport} disabled={csvPreview.length === 0 || isImporting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  {isImporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                  Import {csvPreview.length > 0 ? `${csvPreview.length} Data` : ""}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
                <Plus className="h-4 w-4" />
                Tambah TAD
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border-slate-200 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                  Data TAD Baru
                </DialogTitle>
                <DialogDescription className="text-slate-500">
                  Masukkan informasi esensial tenaga alih daya.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-5 py-4">
                  {errorMsg && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                      {errorMsg}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="nid">NID / NIK KTP <span className="text-red-500">*</span></Label>
                    <Input id="nid" required value={formData.nid || ""} onChange={e => handleInputChange('nid', e.target.value)} placeholder="Contoh: 357123..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap <span className="text-red-500">*</span></Label>
                    <Input id="name" required value={formData.name || ""} onChange={e => handleInputChange('name', e.target.value)} placeholder="Masukkan nama" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vendor">Perusahaan Asal (Vendor) <span className="text-red-500">*</span></Label>
                    <Select required value={formData.perusahaan_asal || ""} onValueChange={v => handleInputChange('perusahaan_asal', v)}>
                      <SelectTrigger id="vendor"><SelectValue placeholder="Pilih Vendor PT" /></SelectTrigger>
                      <SelectContent>
                        {VENDOR_LIST.map(vendor => (
                          <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="jabatan">Jabatan <span className="text-red-500">*</span></Label>
                      <Input id="jabatan" required value={formData.jabatan || ""} onChange={e => handleInputChange('jabatan', e.target.value)} placeholder="Contoh: Security" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bidang">Bidang <span className="text-red-500">*</span></Label>
                      <Input id="bidang" required value={formData.bidang || ""} onChange={e => handleInputChange('bidang', e.target.value)} placeholder="Contoh: K3 & Keamanan" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Tanggal Lahir <span className="text-red-500">*</span></Label>
                    <Input id="dob" type="date" required value={formData.tanggal_lahir || ""} onChange={e => handleInputChange('tanggal_lahir', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={formData.email || ""} onChange={e => handleInputChange('email', e.target.value)} placeholder="email@vendor.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">WhatsApp</Label>
                      <Input id="phone" value={formData.phone || ""} onChange={e => handleInputChange('phone', e.target.value)} placeholder="0812..." />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
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
                <TableHead>Vendor (PT)</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Bidang</TableHead>
                <TableHead>Tgl Lahir</TableHead>
                <TableHead>Usia</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Tidak ada data pegawai TAD ditemukan.
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
                      <TableCell className="text-indigo-600 font-medium">{emp.perusahaan_asal || "-"}</TableCell>
                      <TableCell>{emp.jabatan || "-"}</TableCell>
                      <TableCell>{emp.bidang || "-"}</TableCell>
                      <TableCell>{emp.tanggal_lahir ? new Date(emp.tanggal_lahir).toLocaleDateString('id-ID') : "-"}</TableCell>
                      <TableCell>{usia}</TableCell>
                      <TableCell className="text-xs">{emp.email || "-"}</TableCell>
                      <TableCell className="text-xs">{emp.phone || "-"}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none">
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
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
