"use client";

import { useState } from "react";
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
  Loader2
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
import { addEmployee, deleteEmployee, EmployeeInput } from "@/app/actions/employee";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
      // Set default nullable fields since TAD has fewer fields
      jenis_kelamin: "L", // Default 
      status_aktif: "aktif",
    };

    const res = await addEmployee(dataToSubmit);
    
    if (res.success) {
      setIsOpen(false);
      setFormData({
        nid: "", name: "", tanggal_lahir: "",
        perusahaan_asal: "", jabatan: "", bidang: "", email: "", phone: ""
      });
    } else {
      setErrorMsg(res.error || "Gagal menyimpan data");
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async (nid: string) => {
    if (confirm("Yakin ingin menghapus TAD ini? Semua sertifikasi terkait juga akan terhapus.")) {
      await deleteEmployee(nid);
    }
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
          <Button variant="outline" className="flex items-center gap-2 border-slate-300 hover:bg-slate-50 transition-all">
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          
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
