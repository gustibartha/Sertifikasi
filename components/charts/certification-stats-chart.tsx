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

const statusData = [
  { name: "Aktif", value: 85 },
  { name: "Segera Habis", value: 12 },
  { name: "Kadaluwarsa", value: 8 },
  { name: "Belum Sertifikasi", value: 37 },
];

const monthlyData = [
  { name: "Jan", terbit: 5, expired: 2 },
  { name: "Feb", terbit: 3, expired: 1 },
  { name: "Mar", terbit: 8, expired: 3 },
  { name: "Apr", terbit: 2, expired: 4 },
  { name: "Mei", terbit: 6, expired: 2 },
  { name: "Jun", terbit: 4, expired: 1 },
  { name: "Jul", terbit: 7, expired: 0 },
  { name: "Agu", terbit: 3, expired: 2 },
  { name: "Sep", terbit: 9, expired: 1 },
  { name: "Okt", terbit: 5, expired: 3 },
  { name: "Nov", terbit: 4, expired: 2 },
  { name: "Des", terbit: 6, expired: 1 },
];

const lembagaData = [
  { name: "BNSP", total: 32 },
  { name: "Kemnaker RI", total: 24 },
  { name: "TUV Rheinland", total: 11 },
  { name: "PMI", total: 8 },
  { name: "LSP Lainnya", total: 15 },
];

const STATUS_COLORS = ["#10b981", "#f59e0b", "#ef4444", "#94a3b8"];

export function CertificationStatsChart() {
  const [chartType, setChartType] = useState("status");

  const renderChart = () => {
    switch (chartType) {
      case "status":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                label={({ name, value }: any) => `${name || "Unknown"}: ${value || 0}`}
                style={{ fontSize: "12px" }}
              >
                {statusData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                  fontSize: "13px",
                }}
              />
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
      case "bulanan":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.03)" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                  fontSize: "13px",
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value: string) => (
                  <span style={{ color: "var(--foreground)", fontSize: "12px" }}>
                    {value === "terbit" ? "Sertifikat Terbit" : "Sertifikat Expired"}
                  </span>
                )}
              />
              <Bar dataKey="terbit" fill="#10b981" radius={[3, 3, 0, 0]} name="terbit" />
              <Bar dataKey="expired" fill="#ef4444" radius={[3, 3, 0, 0]} name="expired" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "lembaga":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={lembagaData} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={90} />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.03)" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                  fontSize: "13px",
                }}
              />
              <Bar dataKey="total" fill="var(--primary)" radius={[0, 4, 4, 0]} name="Jumlah Sertifikat" />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (chartType) {
      case "status": return "Status Sertifikasi";
      case "bulanan": return "Tren Sertifikasi Bulanan";
      case "lembaga": return "Sertifikasi per Lembaga";
    }
  };

  const getDescription = () => {
    switch (chartType) {
      case "status": return "Komposisi status sertifikasi seluruh pegawai.";
      case "bulanan": return "Tren penerbitan dan kedaluwarsa sertifikat per bulan.";
      case "lembaga": return "Distribusi sertifikasi berdasarkan lembaga penerbit (LSK).";
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-start sm:items-center justify-between pb-4">
        <div className="space-y-1">
          <CardTitle>{getTitle()}</CardTitle>
          <CardDescription>{getDescription()}</CardDescription>
        </div>
        <div className="w-[180px]">
          <Select value={chartType} onValueChange={(v) => v && setChartType(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih metrik" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="status">Status Sertifikasi</SelectItem>
              <SelectItem value="bulanan">Tren Bulanan</SelectItem>
              <SelectItem value="lembaga">Per Lembaga</SelectItem>
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
