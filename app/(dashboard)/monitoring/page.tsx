export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { employees, certifications } from "@/lib/schema";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { formasiData } from "@/formasi-data";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Users,
  UserCheck,
  ClipboardList,
  Clock,
} from "lucide-react";

function Gauge({ value }: { value: number }) {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(100, Math.max(0, value)) / 100) * circ;
  const color = value >= 90 ? "#34d399" : value >= 75 ? "#60a5fa" : value >= 50 ? "#fbbf24" : "#f87171";
  return (
    <svg viewBox="0 0 180 180" className="h-44 w-44 -rotate-90">
      <circle cx="90" cy="90" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
      <circle
        cx="90"
        cy="90"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        style={{ filter: `drop-shadow(0 0 8px ${color}66)` }}
      />
    </svg>
  );
}

export default async function MonitoringPage() {
  const aktif = sql`(${employees.status_aktif} is null or lower(${employees.status_aktif}) = 'aktif')`;
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const target = new Date();
  target.setDate(today.getDate() + 30);
  const targetStr = target.toISOString().split("T")[0];
  const year = today.getFullYear().toString();

  const [org] = await db.select({ c: sql<number>`count(*)` }).from(employees).where(and(eq(employees.status_pegawai, "Organik"), aktif));
  const [tad] = await db.select({ c: sql<number>`count(*)` }).from(employees).where(and(eq(employees.status_pegawai, "TAD"), aktif));
  const [ret] = await db
    .select({ c: sql<number>`count(*)` })
    .from(employees)
    .where(and(gte(employees.tanggal_pensiun, `${year}-01-01`), lte(employees.tanggal_pensiun, `${year}-12-31`)));

  const organik = Number(org?.c ?? 0);
  const tadCount = Number(tad?.c ?? 0);
  const totalIdeal = formasiData.reduce((a, r) => a + Number(r.formasiIdeal ?? 0), 0);
  const keterisian = totalIdeal > 0 ? Math.round((organik / totalIdeal) * 100) : 0;

  const byStatus = await db
    .select({ s: certifications.status_sertifikasi, c: sql<number>`count(*)` })
    .from(certifications)
    .groupBy(certifications.status_sertifikasi);
  let aktifCert = 0, warning = 0, expired = 0, totalCert = 0;
  byStatus.forEach((r) => {
    const n = Number(r.c);
    totalCert += n;
    const st = (r.s || "").toLowerCase();
    if (st === "expired") expired += n;
    else if (st === "warning") warning += n;
    else aktifCert += n;
  });

  const expiring = await db
    .select({
      id: certifications.id,
      name: employees.name,
      status: employees.status_pegawai,
      pelatihan: certifications.nama_pelatihan,
      exp: certifications.tanggal_kadaluarsa,
    })
    .from(certifications)
    .innerJoin(employees, eq(certifications.employee_nid, employees.nid))
    .where(lte(certifications.tanggal_kadaluarsa, targetStr))
    .limit(40);

  const daysLeft = (d: string) => Math.ceil((new Date(d).getTime() - today.getTime()) / 86400000);

  const statusCards = [
    { label: "GREEN — Aktif", value: aktifCert, icon: CheckCircle2, ring: "ring-emerald-500/30", text: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "WARNING — Segera Habis", value: warning + expiring.filter((e) => daysLeft(e.exp) >= 0).length, icon: AlertTriangle, ring: "ring-amber-500/30", text: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "CRITICAL — Kadaluarsa", value: expired || expiring.filter((e) => daysLeft(e.exp) < 0).length, icon: ShieldAlert, ring: "ring-red-500/30", text: "text-red-400", bg: "bg-red-500/10" },
  ];

  const metrics = [
    { label: "Karyawan Organik", value: organik, icon: Users, color: "text-blue-400" },
    { label: "Tenaga Alih Daya", value: tadCount, icon: UserCheck, color: "text-teal-400" },
    { label: "Formasi Ideal (FTK)", value: totalIdeal, icon: ClipboardList, color: "text-cyan-400" },
    { label: "Pensiun Tahun Ini", value: Number(ret?.c ?? 0), icon: Clock, color: "text-purple-400" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-slate-900">
          <Activity className="h-7 w-7 text-blue-600" /> Monitoring Kinerja
        </h1>
        <p className="mt-1 text-slate-500">Ringkasan pencapaian dan status sertifikasi secara real-time.</p>
      </div>

      {/* Hero board (dark) */}
      <div className="rounded-3xl border border-slate-800 bg-[#0b1120] p-6 text-slate-100 shadow-xl">
        <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
          {/* Gauge */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white/5 p-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">Overall — Keterisian Formasi</div>
            <div className="relative mt-2 flex items-center justify-center">
              <Gauge value={keterisian} />
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-bold">{keterisian}%</span>
                <span className="text-xs text-slate-400">{organik}/{totalIdeal}</span>
              </div>
            </div>
            <div className="mt-2 text-sm font-medium text-slate-300">
              {keterisian >= 90 ? "Sangat Baik" : keterisian >= 75 ? "Baik" : keterisian >= 50 ? "Perlu Perhatian" : "Kritis"}
            </div>
          </div>

          {/* Status + metrics */}
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {statusCards.map((c) => (
                <div key={c.label} className={`rounded-2xl ${c.bg} p-4 ring-1 ${c.ring}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">{c.label}</span>
                    <c.icon className={`h-5 w-5 ${c.text}`} />
                  </div>
                  <div className={`mt-3 text-3xl font-bold ${c.text}`}>{c.value}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {metrics.map((m) => (
                <div key={m.label} className="rounded-2xl bg-white/5 p-4">
                  <m.icon className={`h-5 w-5 ${m.color}`} />
                  <div className={`mt-2 text-2xl font-bold ${m.color}`}>{m.value}</div>
                  <div className="mt-0.5 text-[11px] leading-tight text-slate-400">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Perlu perhatian */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <h2 className="font-semibold text-slate-800">Perlu Perhatian — Sertifikasi Kadaluarsa &lt; 30 Hari</h2>
          <Badge className="ml-auto bg-amber-500">{expiring.length}</Badge>
        </div>
        {expiring.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Aman. Tidak ada sertifikasi yang akan habis dalam 30 hari.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-slate-400">
                <tr className="border-b">
                  <th className="py-2 pr-4">Nama</th>
                  <th className="py-2 pr-4">Tipe</th>
                  <th className="py-2 pr-4">Sertifikasi</th>
                  <th className="py-2 pr-4">Kadaluarsa</th>
                  <th className="py-2">Sisa</th>
                </tr>
              </thead>
              <tbody>
                {expiring
                  .sort((a, b) => daysLeft(a.exp) - daysLeft(b.exp))
                  .map((e) => {
                    const d = daysLeft(e.exp);
                    return (
                      <tr key={e.id} className="border-b last:border-0 hover:bg-slate-50/60">
                        <td className="py-2.5 pr-4 font-medium text-slate-800">{e.name}</td>
                        <td className="py-2.5 pr-4">
                          <Badge variant="outline" className="text-[10px]">{e.status}</Badge>
                        </td>
                        <td className="py-2.5 pr-4 text-slate-600">{e.pelatihan || "-"}</td>
                        <td className="py-2.5 pr-4 text-slate-600">
                          {new Date(e.exp).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="py-2.5">
                          {d < 0 ? (
                            <Badge variant="destructive">Kadaluarsa</Badge>
                          ) : (
                            <Badge className="bg-amber-500">{d} hari</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
