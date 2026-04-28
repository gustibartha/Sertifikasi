"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
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
import { Search, Download, Filter, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type FormasiRow } from "@/formasi-data";
import { getFormasiWithActual } from "@/app/actions/formasi";
import * as XLSX from "xlsx";

type FilterType = "semua" | "kosong" | "kurang" | "sesuai" | "lebih";

function getDiffColor(diff: number | null): string {
  if (diff === null) return "";
  if (diff < 0) return "bg-blue-100 text-blue-800 font-semibold";
  if (diff > 0) return "bg-red-50 text-red-700 font-semibold";
  return "text-muted-foreground";
}

function getBezettingColor(bez: number | null, ideal: number | null): string {
  if (bez === null) return "";
  if (bez === 0 && ideal !== null && ideal > 0) return "bg-red-100 text-red-700 font-bold";
  if (ideal !== null && bez > ideal) return "bg-emerald-100 text-emerald-800 font-semibold";
  return "font-semibold";
}

export default function FormasiPage() {
  const [data, setData] = useState<FormasiRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("semua");
  const [bidangFilter, setBidangFilter] = useState("semua");

  useEffect(() => {
    async function loadData() {
      const res = await getFormasiWithActual();
      if (res.success && res.data) {
        setData(res.data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleExport = () => {
    const exportData = data.map((row) => ({
      Nomor: row.nomor,
      Bidang: row.bidang,
      "Sub Bidang": row.subBidang,
      "Formasi Jabatan": row.jabatan,
      "Jenjang Jabatan": row.jenjangJabatan,
      "Position Grade": row.positionGrade,
      "FTK Ideal": row.formasiIdeal ?? 0,
      "Bezetting Kary.": row.bezetting ?? 0,
      "Selisih (Vs Ideal)": (row.bezetting !== null && row.formasiIdeal !== null) ? row.bezetting - row.formasiIdeal : 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Formasi");
    
    // Column widths
    const wscols = [
      { wch: 10 },
      { wch: 20 },
      { wch: 25 },
      { wch: 60 },
      { wch: 20 },
      { wch: 15 },
      { wch: 12 },
      { wch: 15 },
      { wch: 15 },
    ];
    worksheet["!cols"] = wscols;

    XLSX.writeFile(workbook, "Formasi_Tenaga_Kerja_Muara_Karang.xlsx");
  };

  const filteredData = data.filter((row) => {
    const matchesSearch =
      row.jabatan.toLowerCase().includes(search.toLowerCase()) ||
      row.nomor.toLowerCase().includes(search.toLowerCase()) ||
      row.bidang.toLowerCase().includes(search.toLowerCase()) ||
      row.subBidang.toLowerCase().includes(search.toLowerCase());

    const matchesBidang = bidangFilter === "semua" || row.bidang === bidangFilter;

    let matchesFilter = true;
    if (filter === "kosong") {
      matchesFilter = row.bezetting === 0 && row.formasiIdeal !== null && row.formasiIdeal > 0;
    } else if (filter === "kurang") {
      matchesFilter = row.bezetting !== null && row.formasiIdeal !== null && row.bezetting < row.formasiIdeal && row.bezetting > 0;
    } else if (filter === "sesuai") {
      matchesFilter = row.bezetting !== null && row.formasiIdeal !== null && row.bezetting === row.formasiIdeal;
    } else if (filter === "lebih") {
      matchesFilter = row.bezetting !== null && row.formasiIdeal !== null && row.bezetting > row.formasiIdeal;
    }

    return matchesSearch && matchesFilter && matchesBidang;
  });

  const uniqueBidang = Array.from(new Set(data.map(r => r.bidang))).filter(b => b !== "-");

  // Summary stats
  const totalFormasi = data.reduce((acc, r) => acc + Number(r.formasiIdeal ?? 0), 0);
  const totalBezetting = data.reduce((acc, r) => acc + Number(r.bezetting ?? 0), 0);
  const totalKosong = data.filter((r) => r.bezetting === 0 && r.formasiIdeal !== null && r.formasiIdeal > 0).length;
  const totalKurang = data.filter((r) => r.bezetting !== null && r.formasiIdeal !== null && r.bezetting < r.formasiIdeal && r.bezetting > 0).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Formasi Tenaga Kerja</h1>
          <p className="text-muted-foreground mt-1">Perbandingan formasi jabatan dengan bezetting tenaga kerja aktual.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <button
          onClick={() => setFilter("semua")}
          className={`bg-card border rounded-xl p-4 shadow-sm text-left transition-all hover:shadow-md ${filter === "semua" ? "ring-2 ring-primary" : ""}`}
        >
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Formasi Ideal</p>
          <p className="text-2xl font-bold mt-1">{totalFormasi}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Total kebutuhan posisi</p>
        </button>
        <button
          onClick={() => setFilter("semua")}
          className={`bg-card border rounded-xl p-4 shadow-sm text-left transition-all hover:shadow-md ${filter === "semua" ? "ring-2 ring-primary" : ""}`}
        >
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Bezetting (Aktual)</p>
          <p className="text-2xl font-bold mt-1">{totalBezetting}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Terisi saat ini</p>
        </button>
        <button
          onClick={() => setFilter("kosong")}
          className={`bg-card border rounded-xl p-4 shadow-sm text-left transition-all hover:shadow-md ${filter === "kosong" ? "ring-2 ring-red-500 border-red-200" : ""}`}
        >
          <p className="text-xs font-medium text-red-600 uppercase tracking-wider">Posisi Kosong</p>
          <p className="text-2xl font-bold mt-1 text-red-600">{totalKosong}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Bezetting = 0, butuh segera diisi</p>
        </button>
        <button
          onClick={() => setFilter("kurang")}
          className={`bg-card border rounded-xl p-4 shadow-sm text-left transition-all hover:shadow-md ${filter === "kurang" ? "ring-2 ring-amber-500 border-amber-200" : ""}`}
        >
          <p className="text-xs font-medium text-amber-600 uppercase tracking-wider">Kekurangan Tenaga</p>
          <p className="text-2xl font-bold mt-1 text-amber-600">{totalKurang}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Bezetting kurang dari ideal</p>
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <span className="font-semibold text-muted-foreground">Keterangan Warna:</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded bg-amber-100 border border-amber-300"></span> Baris Manajerial</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded bg-red-100 border border-red-300"></span> Bezetting Kosong (0)</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded bg-emerald-100 border border-emerald-300"></span> Melebihi Formasi</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded bg-blue-100 border border-blue-300"></span> Kurang dari Formasi</span>
      </div>

      {/* Table */}
      <div className="bg-card p-4 rounded-xl shadow-sm border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari formasi jabatan..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filter} onValueChange={(v) => setFilter((v as FilterType) ?? "semua")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Status</SelectItem>
                <SelectItem value="kosong">🔴 Posisi Kosong</SelectItem>
                <SelectItem value="kurang">🟡 Kurang</SelectItem>
                <SelectItem value="sesuai">🟢 Sesuai</SelectItem>
                <SelectItem value="lebih">🔵 Lebih</SelectItem>
              </SelectContent>
            </Select>

            <Select value={bidangFilter} onValueChange={(v) => setBidangFilter(v ?? "semua")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Semua Bidang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Bidang</SelectItem>
                {uniqueBidang.map(b => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(filter !== "semua" || bidangFilter !== "semua") && (
            <Button variant="ghost" size="sm" onClick={() => { setFilter("semua"); setBidangFilter("semua"); }} className="text-xs text-muted-foreground hover:text-foreground">
              Reset Filter
            </Button>
          )}
        </div>

        {/* Active filter badge */}
        {filter !== "semua" && (
          <div className="flex items-center gap-2 mb-3 px-1">
            <AlertCircle className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground">
              Menampilkan <strong>{filteredData.length}</strong> posisi dengan status:{" "}
              <Badge variant="outline" className="ml-1">
                {filter === "kosong" && "Posisi Kosong (Bezetting = 0)"}
                {filter === "kurang" && "Kekurangan Tenaga"}
                {filter === "sesuai" && "Sesuai Formasi"}
                {filter === "lebih" && "Kelebihan Tenaga"}
              </Badge>
            </span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground italic">Menghubungkan data dengan Direktori Organik...</p>
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[70px] text-center">Nomor</TableHead>
                <TableHead className="w-[150px]">Bidang</TableHead>
                <TableHead className="w-[180px]">Sub Bidang</TableHead>
                <TableHead className="min-w-[300px]">Formasi Jabatan</TableHead>
                <TableHead className="text-center w-[150px]">Jenjang Jabatan</TableHead>
                <TableHead className="text-center w-[100px]">Position Grade</TableHead>
                <TableHead className="text-center w-[100px]">FTK Ideal</TableHead>
                <TableHead className="text-center w-[120px]">Bezetting Kary.</TableHead>
                <TableHead className="text-center w-[120px]">Selisih (Vs Ideal)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Tidak ada data yang sesuai dengan filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row) => {
                  const diffIdeal = (row.bezetting !== null && row.formasiIdeal !== null) ? row.bezetting - row.formasiIdeal : null;

                  // Parse jabatan for bold role title
                  const jabatanParts = row.jabatan.split("  ");
                  const roleTitle = jabatanParts.length > 1 ? jabatanParts[0] : null;
                  const roleName = jabatanParts.length > 1 ? jabatanParts.slice(1).join("  ") : row.jabatan;

                  return (
                    <TableRow key={row.nomor} className={row.isHeader ? "bg-amber-50/70" : ""}>
                      <TableCell className="text-center font-mono text-sm font-medium">{row.nomor}</TableCell>
                      <TableCell className="text-xs font-semibold text-slate-600">{row.bidang}</TableCell>
                      <TableCell className="text-xs text-slate-500">{row.subBidang}</TableCell>
                      <TableCell className={row.isHeader ? "font-semibold" : ""}>
                        {roleTitle ? (
                          <>
                            <span className="font-bold italic">{roleTitle}</span>
                            {"  "}{roleName}
                          </>
                        ) : (
                          roleName
                        )}
                      </TableCell>
                      <TableCell className="text-center text-xs">{row.jenjangJabatan}</TableCell>
                      <TableCell className="text-center font-mono text-sm">{row.positionGrade}</TableCell>
                      <TableCell className="text-center">{row.formasiIdeal ?? ""}</TableCell>
                      <TableCell className={`text-center ${getBezettingColor(row.bezetting, row.formasiIdeal)}`}>
                        {row.bezetting ?? ""}
                      </TableCell>
                      <TableCell className={`text-center ${getDiffColor(diffIdeal)}`}>
                        {diffIdeal !== null ? diffIdeal : ""}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  </div>
);
}
