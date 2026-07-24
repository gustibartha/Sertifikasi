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

const COLORS = ["#6366f1", "#ec4899", "#8b5cf6", "#14b8a6", "#f59e0b", "#ef4444", "#06b6d4", "#84cc16", "#f97316", "#a855f7"];

const tooltipStyle = {
  borderRadius: "8px",
  border: "1px solid var(--border)",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
  fontSize: "13px",
};

type ChartType = "umur" | "gender" | "jabatan" | "pendidikan" | "jenjang" | "grade" | "pegpog";

const chartConfig: Record<ChartType, { title: string; description: string }> = {
  umur: { title: "Distribusi Usia Karyawan", description: "Komposisi usia pegawai dari database." },
  gender: { title: "Distribusi Jenis Kelamin", description: "Perbandingan jumlah pegawai Laki-laki dan Perempuan." },
  jabatan: { title: "Distribusi Jabatan", description: "Sebaran pegawai berdasarkan jenjang jabatan." },
  pendidikan: { title: "Distribusi Pendidikan", description: "Komposisi jenjang pendidikan terakhir pegawai." },
  jenjang: { title: "Distribusi Jenjang Jabatan", description: "Sebaran pegawai berdasarkan level jenjang jabatan." },
  grade: { title: "Distribusi Grade", description: "Sebaran pegawai berdasarkan Grade." },
  pegpog: { title: "PEG vs POG (Keterisian Formasi)", description: "Jumlah karyawan menurut kondisi keterisian posisi: PEG (bezetting) vs POG (formasi ideal), dipisah Struktural/Fungsional." },
};

interface EmployeeStatsChartProps {
  ageData: any[];
  genderData: any[];
  educationData: any[];
  jenjangData: any[];
  gradeData: any[];
  pegVsPogData: any[];
  pegVsPogMeta?: { unmatched: number; totalPosisi: number };
}

export function EmployeeStatsChart({
  ageData = [],
  genderData = [],
  educationData = [],
  jenjangData = [],
  gradeData = [],
  pegVsPogData = [],
  pegVsPogMeta = { unmatched: 0, totalPosisi: 0 }
}: EmployeeStatsChartProps) {
  const [chartType, setChartType] = useState<ChartType>("umur");

  const renderBarChart = (data: { name: string; total: number }[], color: string, layout: "horizontal" | "vertical" = "horizontal") => {
    if (layout === "vertical") {
      return (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={110} />
            <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} contentStyle={tooltipStyle} />
            <Bar dataKey="total" fill={color} radius={[0, 4, 4, 0]} name="Jumlah Pegawai" />
          </BarChart>
        </ResponsiveContainer>
      );
    }
    return (
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} contentStyle={tooltipStyle} />
          <Bar dataKey="total" fill={color} radius={[4, 4, 0, 0]} name="Jumlah Pegawai" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderPieChart = (data: { name: string; value: number }[]) => (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={95}
          paddingAngle={4}
          dataKey="value"
          label={({ name, value }: any) => `${name || "Unknown"}: ${value || 0}`}
          style={{ fontSize: "11px" }}
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value: string) => (
            <span style={{ color: "var(--foreground)", fontSize: "11px" }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderPegVsPog = (data: { key: string; label: string; count: number; color: string }[]) => {
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-[350px] text-sm text-muted-foreground italic">
          Data formasi tidak tersedia untuk kelompok ini.
        </div>
      );
    }
    return (
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 48, left: 10, bottom: 0 }}>
          <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
          <YAxis type="category" dataKey="label" stroke="var(--foreground)" fontSize={11} tickLine={false} axisLine={false} width={180} />
          <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} contentStyle={tooltipStyle} formatter={(value: any) => [`${value} karyawan`, "Jumlah"]} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Jumlah Posisi">
            {data.map((entry) => (
              <Cell key={entry.key} fill={entry.color} stroke="#e2e8f0" strokeWidth={entry.key === "eq" ? 1 : 0} />
            ))}
            <LabelList dataKey="count" position="right" style={{ fontSize: "12px", fontWeight: 700, fill: "var(--foreground)" }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderChart = () => {
    switch (chartType) {
      case "umur":
        return renderBarChart(ageData, "#6366f1");
      case "gender":
        return renderPieChart(genderData);
      case "jabatan":
      case "jenjang":
        return renderBarChart(jenjangData, "#8b5cf6");
      case "pendidikan":
        return renderPieChart(educationData);
      case "grade":
        return renderBarChart(gradeData, "#14b8a6");
      case "pegpog":
        return renderPegVsPog(pegVsPogData);
      default:
        return null;
    }
  };

  // Ringkasan untuk metrik PEG vs POG (jumlah posisi per kategori)
  const totalKategori = pegVsPogData.reduce((a, r) => a + Number(r.count || 0), 0);

  return (
    <Card className="xl:col-span-2 shadow-sm">
      <CardHeader className="flex flex-row items-start sm:items-center justify-between pb-4">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            {chartConfig[chartType].title}
            {chartType === "pegpog" && totalKategori > 0 && (
              <span className="text-sm font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                {totalKategori} karyawan
              </span>
            )}
          </CardTitle>
          <CardDescription>
            {chartType === "pegpog" && pegVsPogMeta.unmatched > 0
              ? `${chartConfig[chartType].description} • ${pegVsPogMeta.unmatched} pegawai belum terpetakan ke posisi.`
              : chartConfig[chartType].description}
          </CardDescription>
        </div>
        <div className="w-[180px]">
          <Select value={chartType} onValueChange={(v) => v && setChartType(v as ChartType)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih metrik" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="umur">Umur</SelectItem>
              <SelectItem value="gender">Jenis Kelamin</SelectItem>
              <SelectItem value="pendidikan">Pendidikan</SelectItem>
              <SelectItem value="jenjang">Jenjang Jabatan</SelectItem>
              <SelectItem value="grade">Grade</SelectItem>
              <SelectItem value="pegpog">PEG vs POG</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        {renderChart()}
      </CardContent>
    </Card>
  );
}
