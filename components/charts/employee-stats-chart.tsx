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

type ChartType = "umur" | "gender" | "jabatan" | "pendidikan" | "jenjang" | "grade" | "pog";

const chartConfig: Record<ChartType, { title: string; description: string }> = {
  umur: { title: "Distribusi Usia Karyawan", description: "Komposisi usia pegawai dari database." },
  gender: { title: "Distribusi Jenis Kelamin", description: "Perbandingan jumlah pegawai Laki-laki dan Perempuan." },
  jabatan: { title: "Distribusi Jabatan", description: "Sebaran pegawai berdasarkan jenjang jabatan." },
  pendidikan: { title: "Distribusi Pendidikan", description: "Komposisi jenjang pendidikan terakhir pegawai." },
  jenjang: { title: "Distribusi Jenjang Jabatan", description: "Sebaran pegawai berdasarkan level jenjang jabatan." },
  grade: { title: "Distribusi Grade", description: "Sebaran pegawai berdasarkan Grade." },
  pog: { title: "Distribusi POG", description: "Sebaran pegawai berdasarkan nilai POG." },
};

interface EmployeeStatsChartProps {
  ageData: any[];
  genderData: any[];
  educationData: any[];
  jenjangData: any[];
  gradeData: any[];
  pogData: any[];
}

export function EmployeeStatsChart({ 
  ageData = [], 
  genderData = [], 
  educationData = [], 
  jenjangData = [],
  gradeData = [],
  pogData = []
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
      case "pog":
        return renderBarChart(pogData, "#f59e0b");
      default:
        return null;
    }
  };

  return (
    <Card className="xl:col-span-2 shadow-sm">
      <CardHeader className="flex flex-row items-start sm:items-center justify-between pb-4">
        <div className="space-y-1">
          <CardTitle>{chartConfig[chartType].title}</CardTitle>
          <CardDescription>{chartConfig[chartType].description}</CardDescription>
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
              <SelectItem value="pog">POG</SelectItem>
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
