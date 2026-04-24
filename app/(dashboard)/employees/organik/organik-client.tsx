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
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Upload, 
  Search,
  MoreHorizontal,
  Download,
  Edit,
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

export function OrganikClient({ initialData }: { initialData: any[] }) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
    } else {
      setErrorMsg(res.error || "Gagal menyimpan data");
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async (nid: string) => {
    if (confirm("Yakin ingin menghapus pegawai ini? Semua sertifikasi terkait juga akan terhapus.")) {
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Direktori Pegawai Organik</h1>
          <p className="text-slate-500 mt-1">Kelola data demografi dan informasi pegawai Organik PLN NP.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2 border-slate-300 hover:bg-slate-50 transition-all">
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
                <Plus className="h-4 w-4" />
                Tambah Organik
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[720px] bg-white/95 backdrop-blur-xl border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
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
