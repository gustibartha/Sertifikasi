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
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  X,
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
import { addCertification, deleteCertification, updateCertification } from "@/app/actions/certification";
import { syncSertifikasiFromSheet } from "@/app/actions/cert-sheet-sync";

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
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLembaga, setFilterLembaga] = useState("all");
  const [filterEksekusi, setFilterEksekusi] = useState("all");

  const handleSyncSheet = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    const res = await syncSertifikasiFromSheet();
    setSyncResult(res);
    setIsSyncing(false);
  };

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

  // Deklarasi fungsi (bukan const) agar ter-hoist: dipakai oleh filteredData di bawah.
  /** Sisa hari; null bila tanggal berakhir kosong/tidak valid. */
  function calculateDaysLeft(expiryDate?: string | null) {
    if (!expiryDate) return null;
    const expiry = new Date(expiryDate);
    if (isNaN(expiry.getTime())) return null;
    return Math.ceil((expiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  }

  /** Kategori status; "tanpa" bila sertifikat tidak punya tanggal berakhir. */
  function getStatusKey(expiryDate?: string | null) {
    const d = calculateDaysLeft(expiryDate);
    if (d === null) return "tanpa";
    if (d < 0) return "kadaluwarsa";
    if (d <= 30) return "kritis";
    if (d <= 90) return "segera";
    return "aktif";
  }

  function getStatusBadge(expiryDate?: string | null) {
    const key = getStatusKey(expiryDate);
    const d = calculateDaysLeft(expiryDate);
    if (key === "tanpa")
      return <Badge variant="outline" className="text-slate-500 border-slate-300">Tanpa Masa Berlaku</Badge>;
    if (key === "kadaluwarsa") return <Badge variant="destructive">Kadaluwarsa</Badge>;
    if (key === "kritis") return <Badge className="bg-red-500 hover:bg-red-600">Kritis (H-{d})</Badge>;
    if (key === "segera")
      return <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">Segera Habis</Badge>;
    return <Badge className="bg-emerald-500 hover:bg-emerald-600">Aktif</Badge>;
  }

  const uniqueLembaga = Array.from(
    new Set(initialData.map((c) => c.lembaga).filter(Boolean))
  ).sort() as string[];

  const activeFilterCount = [filterStatus, filterLembaga, filterEksekusi].filter((v) => v !== "all").length;

  const resetFilters = () => {
    setSearch("");
    setFilterStatus("all");
    setFilterLembaga("all");
    setFilterEksekusi("all");
  };

  const filteredData = initialData.filter((cert) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      cert.employeeName?.toLowerCase().includes(q) ||
      cert.nama_pelatihan?.toLowerCase().includes(q) ||
      cert.no_sertifikat?.toLowerCase().includes(q) ||
      cert.lembaga?.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || getStatusKey(cert.tanggal_kadaluarsa) === filterStatus;
    const matchLembaga = filterLembaga === "all" || cert.lembaga === filterLembaga;
    const matchEksekusi =
      filterEksekusi === "all" ||
      (filterEksekusi === "Dieksekusi" ? cert.status_eksekusi === "Dieksekusi" : cert.status_eksekusi !== "Dieksekusi");
    return matchSearch && matchStatus && matchLembaga && matchEksekusi;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-1">Pantau riwayat pelatihan dan masa berlaku sertifikasi karyawan {type.toLowerCase()}.</p>
        </div>
        <div className="flex gap-2">
          {type === "Organik" && (
            <Button
              variant="outline"
              onClick={handleSyncSheet}
              disabled={isSyncing}
              className="flex items-center gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition-all"
            >
              {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              {isSyncing ? "Menyinkron..." : "Sync Google Sheet"}
            </Button>
          )}

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger
              render={
                <Button className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5" />
              }
            >
              <Plus className="h-4 w-4" />
              Tambah Sertifikasi
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

      {syncResult && (
        <div
          className={`rounded-xl border p-4 shadow-sm ${
            syncResult.success ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"
          }`}
        >
          <div className="flex items-start gap-3">
            {syncResult.success ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            ) : (
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            )}
            <div className="flex-1 text-sm">
              <p className={`font-semibold ${syncResult.success ? "text-emerald-800" : "text-red-800"}`}>
                {syncResult.success ? syncResult.message : syncResult.error}
              </p>
              {syncResult.success && syncResult.totalNidTidakDikenal > 0 && (
                <p className="mt-1 text-amber-700">
                  {syncResult.totalNidTidakDikenal} NID di sheet tidak ditemukan di Direktori Organik, jadi
                  sertifikasinya dilewati:{" "}
                  <span className="text-xs">
                    {syncResult.nidTidakDikenal.join(", ")}
                    {syncResult.totalNidTidakDikenal > 20 ? ", …" : ""}
                  </span>
                </p>
              )}
              {syncResult.errors?.length > 0 && (
                <ul className="mt-1 list-inside list-disc text-xs text-red-700">
                  {syncResult.errors.map((er: string, i: number) => (
                    <li key={i}>{er}</li>
                  ))}
                </ul>
              )}
              {syncResult.success && (
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-xs font-semibold text-blue-600 underline"
                >
                  Muat ulang untuk melihat data terbaru
                </button>
              )}
            </div>
            <button onClick={() => setSyncResult(null)} className="text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex flex-col gap-3 mb-4">
          {/* Pencarian — lebar penuh agar tidak terdesak filter */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari nama pegawai, judul sertifikasi, no. sertifikat, atau lembaga..."
              className="h-10 w-full pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                aria-label="Bersihkan pencarian"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 pr-1 text-sm font-medium text-slate-500">
              <Filter className="h-4 w-4" /> Filter:
            </div>

            <Select value={filterStatus} onValueChange={(v) => v && setFilterStatus(v)}>
              <SelectTrigger className="h-9 w-[190px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent className="bg-white max-h-[300px]">
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="aktif">Aktif</SelectItem>
                <SelectItem value="segera">Segera Habis (≤90 hari)</SelectItem>
                <SelectItem value="kritis">Kritis (≤30 hari)</SelectItem>
                <SelectItem value="kadaluwarsa">Kadaluwarsa</SelectItem>
                <SelectItem value="tanpa">Tanpa Masa Berlaku</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterLembaga} onValueChange={(v) => v && setFilterLembaga(v)}>
              <SelectTrigger className="h-9 w-[220px]"><SelectValue placeholder="Lembaga" /></SelectTrigger>
              <SelectContent className="bg-white max-h-[300px]">
                <SelectItem value="all">Semua Lembaga</SelectItem>
                {uniqueLembaga.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterEksekusi} onValueChange={(v) => v && setFilterEksekusi(v)}>
              <SelectTrigger className="h-9 w-[150px]"><SelectValue placeholder="Eksekusi" /></SelectTrigger>
              <SelectContent className="bg-white max-h-[300px]">
                <SelectItem value="all">Semua Eksekusi</SelectItem>
                <SelectItem value="Dieksekusi">Dieksekusi</SelectItem>
                <SelectItem value="Hold">Hold</SelectItem>
              </SelectContent>
            </Select>

            {(activeFilterCount > 0 || search) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="flex h-9 items-center gap-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </Button>
            )}
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
          <span>
            Menampilkan <span className="font-bold text-slate-700">{filteredData.length}</span> dari{" "}
            {initialData.length} sertifikasi
          </span>
          {activeFilterCount > 0 && (
            <span className="font-medium text-blue-600">{activeFilterCount} filter aktif</span>
          )}
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
                    <TableCell className="text-center">{cert.masa_berlaku_bulan ? `${cert.masa_berlaku_bulan} Bln` : "-"}</TableCell>
                    <TableCell className="text-xs">{cert.tanggal_kadaluarsa ? new Date(cert.tanggal_kadaluarsa).toLocaleDateString('id-ID') : "-"}</TableCell>
                    <TableCell className="text-center">
                      {(() => {
                        const d = calculateDaysLeft(cert.tanggal_kadaluarsa);
                        if (d === null) return <span className="text-slate-400">-</span>;
                        return <span className={d < 30 ? "text-red-600 font-bold" : ""}>{d}</span>;
                      })()}
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
