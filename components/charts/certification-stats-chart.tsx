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

  const renderPie = (data: { name: string; value: number }[], colorFor: (n: string, i: number) => string) => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={95}
          paddingAngle={4}
          dataKey="value"
          label={({ name, value }: any) => `${name}: ${value}`}
          style={{ fontSize: "12px" }}
        >
          {data.map((e, i) => (
            <Cell key={e.name} fill={colorFor(e.name, i)} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v} sertifikat`, "Jumlah"]} />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value: string) => (
            <span style={{ color: "var(--foreground)", fontSize: "12px" }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderChart = () => {
    if (chartType === "status") {
      if (statusData.length === 0) return kosong;
      return renderPie(statusData, (n) => STATUS_COLORS[n] ?? "#94a3b8");
    }

    if (chartType === "tipe") {
      if (tipeData.length === 0) return kosong;
      return renderPie(tipeData, (_n, i) => TIPE_COLORS[i % TIPE_COLORS.length]);
    }

    if (chartType === "jadwal") {
      if (jadwalData.length === 0) return kosong;
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={jadwalData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} contentStyle={tooltipStyle} formatter={(v: any) => [`${v} sertifikat`, "Kadaluarsa"]} />
            <Bar dataKey="total" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Kadaluarsa">
              <LabelList dataKey="total" position="top" style={{ fontSize: "10px", fill: "var(--muted-foreground)" }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }

    // lembaga
    if (lembagaData.length === 0) return kosong;
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={lembagaData} layout="vertical" margin={{ top: 10, right: 36, left: 10, bottom: 0 }}>
          <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
          <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} width={150} />
          <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} contentStyle={tooltipStyle} formatter={(v: any) => [`${v} sertifikat`, "Jumlah"]} />
          <Bar dataKey="total" fill="#6366f1" radius={[0, 4, 4, 0]} name="Jumlah">
            <LabelList dataKey="total" position="right" style={{ fontSize: "11px", fontWeight: 600, fill: "var(--foreground)" }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-start sm:items-center justify-between pb-4">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            {chartConfig[chartType].title}
            {total > 0 && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-sm font-bold text-slate-600">
                {total} sertifikat
              </span>
            )}
          </CardTitle>
          <CardDescription>{chartConfig[chartType].description}</CardDescription>
        </div>
        <div className="w-[190px]">
          <Select value={chartType} onValueChange={(v) => v && setChartType(v as ChartType)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih metrik" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="status">Status Sertifikasi</SelectItem>
              <SelectItem value="jadwal">Jadwal Kadaluarsa</SelectItem>
              <SelectItem value="lembaga">Lembaga</SelectItem>
              <SelectItem value="tipe">Tipe Pegawai</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pl-2">{renderChart()}</CardContent>
    </Card>
  );
}
