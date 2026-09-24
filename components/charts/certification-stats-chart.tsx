"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  LabelList,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

/** Warna mengikuti urutan kategori status pada certStatusData. */
const STATUS_COLORS: Record<string, string> = {
  "Aktif": "#10b981",
  "Segera Habis": "#f59e0b",
  "Kritis": "#ef4444",
  "Kadaluwarsa": "#b91c1c",
  "Tanpa Masa Berlaku": "#94a3b8",
};
const TIPE_COLORS = ["#3b82f6", "#14b8a6"];

const tooltipStyle = {
  borderRadius: "8px",
  border: "1px solid var(--border)",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
  fontSize: "13px",
};

type ChartType = "status" | "jadwal" | "lembaga" | "tipe";

const chartConfig: Record<ChartType, { title: string; description: string }> = {
  status: { title: "Status Sertifikasi", description: "Komposisi sertifikat menurut masa berlakunya." },
  jadwal: { title: "Jadwal Kadaluarsa", description: "Jumlah sertifikat yang berakhir tiap bulan (12 bulan ke depan)." },
  lembaga: { title: "Lembaga Sertifikasi", description: "Sertifikat terbanyak menurut lembaga penerbit." },
  tipe: { title: "Sertifikat per Tipe Pegawai", description: "Perbandingan jumlah sertifikat Organik dan TAD." },
};

interface Props {
  statusData?: { name: string; value: number }[];
  jadwalData?: { name: string; total: number }[];
  lembagaData?: { name: string; total: number }[];
  tipeData?: { name: string; value: number }[];
  total?: number;
}

export function CertificationStatsChart({
  statusData = [],
  jadwalData = [],
  lembagaData = [],
  tipeData = [],
  total = 0,
}: Props) {
  const [chartType, setChartType] = useState<ChartType>("status");

  const kosong = (
    <div className="flex h-[300px] items-center justify-center text-sm italic text-muted-foreground">
      Belum ada data sertifikasi.
    </div>
  );

  /** Pendekkan teks panjang agar tidak terpotong di sumbu. */
  function potong(s: string, n: number) {
    return s.length > n ? s.slice(0, n - 1) + "…" : s;
  }

  /**
   * Donut untuk data kategori (Status & Tipe Pegawai).
   *
   * Catatan penting: JANGAN memberi `fill` lewat prop `style` pada <Pie>.
   * Inline CSS fill menimpa atribut fill dari <Cell>, sehingga seluruh irisan
   * menjadi putih dan grafik tampak hilang di atas kartu putih.
   * Label juga tidak digambar di luar irisan karena kartu ini sempit
   * (1/3 grid) — nama, jumlah, dan persentase ditaruh di legend.
   */
  const renderKategori = (
    data: { name: string; value: number }[],
    colorFor: (n: string, i: number) => string
  ) => {
    const total = data.reduce((a, d) => a + d.value, 0);
    return (
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="40%"
            innerRadius={52}
            outerRadius={88}
            paddingAngle={2}
            isAnimationActive={false}
          >
            {data.map((e, i) => (
              <Cell key={e.name} fill={colorFor(e.name, i)} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} formatter={(v: any, n: any) => [`${v} sertifikat`, n]} />
          <Legend
            verticalAlign="bottom"
            height={76}
            iconSize={9}
            formatter={(value: string, entry: any) => {
              const v = entry?.payload?.value ?? 0;
              const pct = total > 0 ? Math.round((v / total) * 100) : 0;
              return (
                <span style={{ color: "var(--foreground)", fontSize: "11px" }}>
                  {value} — {v} ({pct}%)
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderChart = () => {
    if (chartType === "status") {
      if (statusData.length === 0) return kosong;
      return renderKategori(statusData, (n) => STATUS_COLORS[n] ?? "#94a3b8");
    }

    if (chartType === "tipe") {
      if (tipeData.length === 0) return kosong;
      return renderKategori(tipeData, (_n, i) => TIPE_COLORS[i % TIPE_COLORS.length]);
    }

    if (chartType === "jadwal") {
      if (jadwalData.length === 0) return kosong;
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={jadwalData} margin={{ top: 20, right: 8, left: -22, bottom: 24 }}>
            <XAxis
              dataKey="name"
              stroke="var(--muted-foreground)"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={44}
            />
            <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} width={32} />
            <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} contentStyle={tooltipStyle} formatter={(v: any) => [`${v} sertifikat`, "Kadaluarsa"]} />
            <Bar dataKey="total" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Kadaluarsa">
              <LabelList dataKey="total" position="top" style={{ fontSize: "9px", fill: "var(--muted-foreground)" }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }

    // lembaga
    if (lembagaData.length === 0) return kosong;
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={lembagaData} layout="vertical" margin={{ top: 4, right: 30, left: 4, bottom: 4 }}>
          <XAxis type="number" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="name"
            stroke="var(--muted-foreground)"
            fontSize={9}
            tickLine={false}
            axisLine={false}
            width={118}
            interval={0}
            tickFormatter={(v: string) => potong(v, 20)}
          />
          {/* Tooltip memakai label penuh, jadi nama yang dipendekkan tetap terbaca */}
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.03)" }}
            contentStyle={tooltipStyle}
            formatter={(v: any) => [`${v} sertifikat`, "Jumlah"]}
            labelFormatter={(l: any) => l}
          />
          <Bar dataKey="total" fill="#6366f1" radius={[0, 4, 4, 0]} name="Jumlah">
            <LabelList dataKey="total" position="right" style={{ fontSize: "10px", fontWeight: 600, fill: "var(--foreground)" }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className="shadow-sm">
      {/* Kartu ini sempit (1/3 grid): header ditumpuk agar judul & dropdown tidak terpotong */}
      <CardHeader className="flex flex-col gap-3 pb-4">
        <div className="space-y-1">
          <CardTitle className="flex flex-wrap items-center gap-2 text-base leading-snug">
            <span className="break-words">{chartConfig[chartType].title}</span>
            {total > 0 && (
              <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                {total} sertifikat
              </span>
            )}
          </CardTitle>
          <CardDescription className="text-xs leading-relaxed">
            {chartConfig[chartType].description}
          </CardDescription>
        </div>
        <Select value={chartType} onValueChange={(v) => v && setChartType(v as ChartType)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih metrik" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="status">Status Sertifikasi</SelectItem>
            <SelectItem value="jadwal">Jadwal Kadaluarsa</SelectItem>
            <SelectItem value="lembaga">Lembaga</SelectItem>
            <SelectItem value="tipe">Tipe Pegawai</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pl-2">{renderChart()}</CardContent>
    </Card>
  );
}
