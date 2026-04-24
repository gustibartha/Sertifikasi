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
  Search,
  MoreHorizontal,
  FileText,
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
import { addCertification, deleteCertification, updateCertification } from "@/app/actions/certification";

export function CertificationClient({ 
  initialData, 
  employees,
  title,
  type
}: { 
  initialData: any[], 
  employees: any[],
  title: string,
  type: "Organik" | "TAD"
}) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    employee_nid: "",
    nama_pelatihan: "",
    no_sertifikat: "",
    tanggal_perolehan: "",
    masa_berlaku_bulan: 36,
    tanggal_kadaluarsa: "",
    lembaga: "",
    document_url: ""
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-calculate expiry date if obtained date and masa berlaku are set
      if ((field === "tanggal_perolehan" || field === "masa_berlaku_bulan") && newData.tanggal_perolehan && newData.masa_berlaku_bulan) {
        const date = new Date(newData.tanggal_perolehan);
        date.setMonth(date.getMonth() + parseInt(newData.masa_berlaku_bulan.toString()));
        newData.tanggal_kadaluarsa = date.toISOString().split('T')[0];
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const res = await addCertification(formData);
    
    if (res.success) {
      setIsOpen(false);
      setFormData({
        employee_nid: "",
        nama_pelatihan: "",
        no_sertifikat: "",
        tanggal_perolehan: "",
        masa_berlaku_bulan: 36,
        tanggal_kadaluarsa: "",
        lembaga: "",
        document_url: ""
      });
    } else {
      setErrorMsg(res.error || "Gagal menyimpan data");
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus data sertifikasi ini?")) {
      await deleteCertification(id);
    }
  };

  const handleStatusEksekusi = async (id: string, status: string) => {
    await updateCertification(id, { status_eksekusi: status });
  };

  const filteredData = initialData.filter(cert => 
    cert.employeeName.toLowerCase().includes(search.toLowerCase()) || 
    cert.nama_pelatihan.toLowerCase().includes(search.toLowerCase()) ||
    cert.no_sertifikat?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return <Badge variant="destructive">Kadaluwarsa</Badge>;
    if (diffDays <= 30) return <Badge className="bg-red-500 hover:bg-red-600">Kritis (H-{diffDays})</Badge>;
    if (diffDays <= 90) return <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">Segera Habis</Badge>;
    return <Badge className="bg-emerald-500 hover:bg-emerald-600">Aktif</Badge>;
  };

  const calculateDaysLeft = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-1">Pantau riwayat pelatihan dan masa berlaku sertifikasi karyawan {type.toLowerCase()}.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
                <Plus className="h-4 w-4" />
                Tambah Sertifikasi
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px] bg-white/95 backdrop-blur-xl border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                  Data Sertifikasi Baru
                </DialogTitle>
                <DialogDescription className="text-slate-500">
                  Catat riwayat pelatihan dan unggah dokumen sertifikasi pegawai.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-5 py-4">
                  {errorMsg && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                      {errorMsg}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pegawai">Nama Pegawai</Label>
                      <Select required onValueChange={(v) => handleInputChange("employee_nid", v)}>
                        <SelectTrigger id="pegawai">
                          <SelectValue placeholder="Pilih Pegawai" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map(emp => (
                            <SelectItem key={emp.nid} value={emp.nid}>{emp.name} ({emp.nid})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nama_sertifikasi">Nama Pelatihan / Sertifikasi</Label>
                      <Input id="nama_sertifikasi" required value={formData.nama_pelatihan} onChange={e => handleInputChange('nama_pelatihan', e.target.value)} placeholder="Contoh: Ahli K3 Umum" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="no_sertifikat">No. Sertifikat</Label>
                      <Input id="no_sertifikat" value={formData.no_sertifikat} onChange={e => handleInputChange('no_sertifikat', e.target.value)} placeholder="Nomor registrasi" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lembaga">Lembaga Penerbit (LSK)</Label>
                      <Input id="lembaga" value={formData.lembaga} onChange={e => handleInputChange('lembaga', e.target.value)} placeholder="Contoh: BNSP" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tgl_terbit">Tanggal Terbit</Label>
                      <Input id="tgl_terbit" type="date" required value={formData.tanggal_perolehan} onChange={e => handleInputChange('tanggal_perolehan', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="masa_berlaku">Masa Berlaku (Bln)</Label>
                      <Input id="masa_berlaku" type="number" required value={formData.masa_berlaku_bulan} onChange={e => handleInputChange('masa_berlaku_bulan', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tgl_akhir">Tanggal Akhir</Label>
                      <Input id="tgl_akhir" type="date" required value={formData.tanggal_kadaluarsa} onChange={e => handleInputChange('tanggal_kadaluarsa', e.target.value)} />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Simpan Sertifikasi
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
              placeholder="Cari sertifikasi atau nama..."
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
                <TableHead>Nama Pegawai</TableHead>
                <TableHead>Tersertifikasi</TableHead>
                <TableHead>No. Sertifikat</TableHead>
                <TableHead>Tgl Terbit</TableHead>
                <TableHead>Masa Berlaku</TableHead>
                <TableHead>Tgl Berakhir</TableHead>
                <TableHead>Sisa Hari</TableHead>
                <TableHead>Lembaga</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Eksekusi</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                    Tidak ada data sertifikasi ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell className="font-semibold">{cert.employeeName}</TableCell>
                    <TableCell className="font-medium">{cert.nama_pelatihan}</TableCell>
                    <TableCell className="text-xs">{cert.no_sertifikat || "-"}</TableCell>
                    <TableCell className="text-xs">{cert.tanggal_perolehan ? new Date(cert.tanggal_perolehan).toLocaleDateString('id-ID') : "-"}</TableCell>
                    <TableCell className="text-center">{cert.masa_berlaku_bulan} Bln</TableCell>
                    <TableCell className="text-xs">{cert.tanggal_kadaluarsa ? new Date(cert.tanggal_kadaluarsa).toLocaleDateString('id-ID') : "-"}</TableCell>
                    <TableCell className="text-center">
                      <span className={calculateDaysLeft(cert.tanggal_kadaluarsa) < 30 ? "text-red-600 font-bold" : ""}>
                        {calculateDaysLeft(cert.tanggal_kadaluarsa)}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">{cert.lembaga || "-"}</TableCell>
                    <TableCell>
                      {getStatusBadge(cert.tanggal_kadaluarsa)}
                    </TableCell>
                    <TableCell>
                      {cert.status_eksekusi === "Dieksekusi" ? (
                        <Badge className="bg-blue-500 hover:bg-blue-600">Dieksekusi</Badge>
                      ) : (
                        <Badge variant="outline" className="text-slate-500 border-slate-300">Hold</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuItem 
                            className="cursor-pointer text-blue-600 focus:text-blue-700 focus:bg-blue-50 font-medium"
                            onClick={() => handleStatusEksekusi(cert.id, "Dieksekusi")}
                          >
                            Set Dieksekusi
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer text-slate-600 focus:text-slate-700 focus:bg-slate-50 font-medium"
                            onClick={() => handleStatusEksekusi(cert.id, "Hold")}
                          >
                            Set Hold
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 font-medium" onClick={() => handleDelete(cert.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
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
