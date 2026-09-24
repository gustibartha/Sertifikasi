export const dynamic = "force-dynamic";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Users, AlertTriangle, Clock, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";
import { DashboardDemographics, DemographicStats } from "@/components/charts/dashboard-demographics";
import { CertificationStatsChart } from "@/components/charts/certification-stats-chart";
import { db } from "@/lib/db";
import { employees, certifications } from "@/lib/schema";
import { eq, gte, lte, and, sql } from "drizzle-orm";
import { normalizePendidikan } from "@/lib/utils";

// Hitung statistik demografi untuk satu kelompok pegawai (Organik / TAD)
function computeDemographics(list: any[], today: Date): DemographicStats {
  const ageStats = [
    { name: "20-30 thn", total: 0 },
    { name: "31-40 thn", total: 0 },
    { name: "41-50 thn", total: 0 },
    { name: "51+ thn", total: 0 },
  ];
  const genderStats = [
    { name: "Laki-laki", value: 0 },
    { name: "Perempuan", value: 0 },
  ];
  const eduMap: Record<string, number> = {};
  const jenjangMap: Record<string, number> = {};
  const gradeMap: Record<string, number> = {};
  const pegCounts = { gtF: 0, ltS: 0, gtS: 0, ltF: 0, eq: 0 };

  list.forEach((emp) => {
    if (emp.tanggal_lahir) {
      const age = today.getFullYear() - new Date(emp.tanggal_lahir).getFullYear();
      if (age <= 30) ageStats[0].total++;
      else if (age <= 40) ageStats[1].total++;
      else if (age <= 50) ageStats[2].total++;
      else ageStats[3].total++;
    }

    if (emp.jenis_kelamin === "L") genderStats[0].value++;
    else if (emp.jenis_kelamin === "P") genderStats[1].value++;

    // Pendidikan: hanya jenjang/pendidikan terakhir
    const edu = normalizePendidikan(emp.pendidikan);
    eduMap[edu] = (eduMap[edu] || 0) + 1;

    const jenjang = emp.jenjang_jabatan || "Lainnya";
    jenjangMap[jenjang] = (jenjangMap[jenjang] || 0) + 1;

    const grade = emp.grade || "N/A";
    gradeMap[grade] = (gradeMap[grade] || 0) + 1;

    // PEG vs POG: Person Grade (PeG) dibanding Position Grade (PoG) per karyawan.
    // Struktural = jenjang SPV/MD/MM…, Fungsional = jenjang F… (dari Google Sheet)
    const peg = emp.person_grade;
    const pog = emp.pog;
    if (peg != null && pog != null) {
      const jj = (emp.jenjang || "").toString().toUpperCase().trim();
      const fungsional = /^F/.test(jj);
      if (peg === pog) pegCounts.eq++;
      else if (peg > pog) fungsional ? pegCounts.gtF++ : pegCounts.gtS++;
      else fungsional ? pegCounts.ltF++ : pegCounts.ltS++;
    }
  });

  const pegVsPogData = [
    { key: "gtF", label: "PEG > POG (Karyawan Fungsional)", count: pegCounts.gtF, color: "#F5A623" },
    { key: "ltS", label: "PEG < POG (Karyawan Struktural)", count: pegCounts.ltS, color: "#E53935" },
    { key: "gtS", label: "PEG > POG (Karyawan Struktural)", count: pegCounts.gtS, color: "#FBD38D" },
    { key: "ltF", label: "PEG < POG (Karyawan Fungsional)", count: pegCounts.ltF, color: "#FDE047" },
    { key: "eq", label: "PEG = POG", count: pegCounts.eq, color: "#CBD5E1" },
  ];

  return {
    ageData: ageStats,
    genderData: genderStats,
    educationData: Object.entries(eduMap).map(([name, value]) => ({ name, value })),
    jenjangData: Object.entries(jenjangMap).map(([name, total]) => ({ name, total })),
    gradeData: Object.entries(gradeMap).map(([name, total]) => ({ name, total })),
    pegVsPogData,
    total: list.length,
  };
}

export default async function DashboardPage() {
  // --- Data Fetching Logic ---
  
  // 1. Total Karyawan (hanya yang berstatus aktif)
  const aktifCond = sql`(${employees.status_aktif} is null or lower(${employees.status_aktif}) = 'aktif')`;
  const totalOrganikRes = await db.select({ count: sql<number>`count(*)` }).from(employees).where(and(eq(employees.status_pegawai, 'Organik'), aktifCond));
  const totalTADRes = await db.select({ count: sql<number>`count(*)` }).from(employees).where(and(eq(employees.status_pegawai, 'TAD'), aktifCond));
  const totalOrganik = totalOrganikRes[0].count;
  const totalTAD = totalTADRes[0].count;

  // 2. Sertifikasi Akan Habis (dalam 30 hari ke depan, termasuk yang sudah expired)
  const today = new Date();
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(today.getDate() + 30);
  
  const todayStr = today.toISOString().split('T')[0];
  const targetStr = thirtyDaysLater.toISOString().split('T')[0];

  const expiringCerts = await db
    .select({
      id: certifications.id,
      employeeName: employees.name,
      employeeStatus: employees.status_pegawai,
      perusahaan: employees.perusahaan_asal,
      certification: certifications.nama_pelatihan,
      expiryDate: certifications.tanggal_kadaluarsa,
      status: certifications.status_sertifikasi,
    })
    .from(certifications)
    .innerJoin(employees, eq(certifications.employee_nid, employees.nid))
    .where(
      and(
        lte(certifications.tanggal_kadaluarsa, targetStr)
      )
    );

  const expiringAlertsOrganik = expiringCerts.filter(c => c.employeeStatus === 'Organik');
  const expiringAlertsTAD = expiringCerts.filter(c => c.employeeStatus === 'TAD');
  const totalExpiring = expiringCerts.length;

  // 2b. Statistik sertifikasi (data nyata untuk chart dashboard)
  const allCerts = await db
    .select({
      exp: certifications.tanggal_kadaluarsa,
      lembaga: certifications.lembaga,
      empStatus: employees.status_pegawai,
    })
    .from(certifications)
    .innerJoin(employees, eq(certifications.employee_nid, employees.nid));

  const sisaHari = (d?: string | null) => {
    if (!d) return null;
    const t = new Date(d);
    if (isNaN(t.getTime())) return null;
    return Math.ceil((t.getTime() - today.getTime()) / 86400000);
  };

  const certStatus = { aktif: 0, segera: 0, kritis: 0, kadaluwarsa: 0, tanpa: 0 };
  const lembagaMap: Record<string, number> = {};
  const tipeMap = { Organik: 0, TAD: 0 };
  // 12 bulan ke depan: berapa sertifikat kadaluarsa tiap bulan
  const bulanLabels: string[] = [];
  const bulanKey: string[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    bulanKey.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    bulanLabels.push(d.toLocaleDateString("id-ID", { month: "short", year: "2-digit" }));
  }
  const bulanCount: Record<string, number> = {};

  allCerts.forEach((c) => {
    const d = sisaHari(c.exp);
    if (d === null) certStatus.tanpa++;
    else if (d < 0) certStatus.kadaluwarsa++;
    else if (d <= 30) certStatus.kritis++;
    else if (d <= 90) certStatus.segera++;
    else certStatus.aktif++;

    const lb = (c.lembaga || "").trim() || "Tidak Terdata";
    lembagaMap[lb] = (lembagaMap[lb] || 0) + 1;

    if (c.empStatus === "Organik") tipeMap.Organik++;
    else if (c.empStatus === "TAD") tipeMap.TAD++;

    if (c.exp) {
      const key = c.exp.slice(0, 7);
      if (bulanKey.includes(key)) bulanCount[key] = (bulanCount[key] || 0) + 1;
    }
  });

  const certStatusData = [
    { name: "Aktif", value: certStatus.aktif },
    { name: "Segera Habis", value: certStatus.segera },
    { name: "Kritis", value: certStatus.kritis },
    { name: "Kadaluwarsa", value: certStatus.kadaluwarsa },
    { name: "Tanpa Masa Berlaku", value: certStatus.tanpa },
  ].filter((d) => d.value > 0);

  const certLembagaData = Object.entries(lembagaMap)
    .map(([name, total]) => ({ name: name.length > 28 ? name.slice(0, 26) + "…" : name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  const certBulananData = bulanKey.map((k, i) => ({
    name: bulanLabels[i],
    total: bulanCount[k] || 0,
  }));

  const certTipeData = [
    { name: "Organik", value: tipeMap.Organik },
    { name: "TAD", value: tipeMap.TAD },
  ].filter((d) => d.value > 0);

  const totalSertifikat = allCerts.length;

  // 3. Pensiun Tahun Ini
  const currentYear = today.getFullYear().toString();
  const retiringThisYearRes = await db
    .select({ count: sql<number>`count(*)` })
    .from(employees)
    .where(
      and(
        gte(employees.tanggal_pensiun, `${currentYear}-01-01`),
        lte(employees.tanggal_pensiun, `${currentYear}-12-31`)
      )
    );
  const totalRetiringThisYear = retiringThisYearRes[0].count;

  // 4. Data Chart Demografi (Dynamic) — dipisah antara Organik dan TAD,
  //    hanya menghitung karyawan yang berstatus aktif.
  const allEmployees = await db.select().from(employees);
  const isActive = (e: typeof allEmployees[number]) =>
    !e.status_aktif || e.status_aktif.toLowerCase() === "aktif";
  const organikStats = computeDemographics(
    allEmployees.filter((e) => e.status_pegawai === "Organik" && isActive(e)),
    today
  );
  const tadStats = computeDemographics(
    allEmployees.filter((e) => e.status_pegawai === "TAD" && isActive(e)),
    today
  );

  // Helper untuk format tanggal & sisa hari
  const calculateDaysLeft = (expiryDate: string) => {
    const diffTime = Math.abs(new Date(expiryDate).getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isExpired = new Date(expiryDate) < today;
    return isExpired ? -diffDays : diffDays;
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Executive</h1>
          <p className="text-slate-500 mt-1">Ringkasan data karyawan dan status sertifikasi (Live Data).</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Karyawan Organik</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalOrganik}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Data terhubung ke database
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-teal-500 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tenaga Alih Daya</CardTitle>
            <UserCheck className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalTAD}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pegawai kontrak/outsourcing
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sertifikasi Akan Habis</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalExpiring}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Organik: {expiringAlertsOrganik.length} &bull; TAD: {expiringAlertsTAD.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pensiun Tahun Ini</CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRetiringThisYear}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tahun {currentYear}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        <DashboardDemographics organik={organikStats} tad={tadStats} />

        <CertificationStatsChart
          statusData={certStatusData}
          jadwalData={certBulananData}
          lembagaData={certLembagaData}
          tipeData={certTipeData}
          total={totalSertifikat}
        />
      </div>
    </div>
  );
}
