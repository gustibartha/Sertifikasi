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
import { EmployeeStatsChart } from "@/components/charts/employee-stats-chart";
import { CertificationStatsChart } from "@/components/charts/certification-stats-chart";
import { db } from "@/lib/db";
import { employees, certifications } from "@/lib/schema";
import { eq, gte, lte, and, sql } from "drizzle-orm";

export default async function DashboardPage() {
  // --- Data Fetching Logic ---
  
  // 1. Total Karyawan
  const totalOrganikRes = await db.select({ count: sql<number>`count(*)` }).from(employees).where(eq(employees.status_pegawai, 'Organik'));
  const totalTADRes = await db.select({ count: sql<number>`count(*)` }).from(employees).where(eq(employees.status_pegawai, 'TAD'));
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

  // 4. Data Chart Demografi (Dynamic)
  const allEmployees = await db.select().from(employees);
  
  // Distribusi Usia
  const ageStats = [
    { name: "20-30 thn", total: 0 },
    { name: "31-40 thn", total: 0 },
    { name: "41-50 thn", total: 0 },
    { name: "51+ thn", total: 0 },
  ];
  
  // Distribusi Gender
  const genderStats = [
    { name: "Laki-laki", value: 0 },
    { name: "Perempuan", value: 0 },
  ];

  // Distribusi Pendidikan
  const eduMap: Record<string, number> = {};
  
  // Distribusi Jenjang
  const jenjangMap: Record<string, number> = {};

  // Distribusi Grade
  const gradeMap: Record<string, number> = {};

  // Distribusi POG (Range)
  const pogStats = [
    { name: "< 70", total: 0 },
    { name: "70-80", total: 0 },
    { name: "81-90", total: 0 },
    { name: "> 90", total: 0 },
  ];

  allEmployees.forEach(emp => {
    // Usia
    if (emp.tanggal_lahir) {
      const age = today.getFullYear() - new Date(emp.tanggal_lahir).getFullYear();
      if (age <= 30) ageStats[0].total++;
      else if (age <= 40) ageStats[1].total++;
      else if (age <= 50) ageStats[2].total++;
      else ageStats[3].total++;
    }

    // Gender
    if (emp.jenis_kelamin === 'L') genderStats[0].value++;
    else if (emp.jenis_kelamin === 'P') genderStats[1].value++;

    // Pendidikan
    const edu = emp.pendidikan || "Tidak Terdata";
    eduMap[edu] = (eduMap[edu] || 0) + 1;

    // Jenjang
    const jenjang = emp.jenjang_jabatan || "Lainnya";
    jenjangMap[jenjang] = (jenjangMap[jenjang] || 0) + 1;
    
    // Grade
    const grade = emp.grade || "N/A";
    gradeMap[grade] = (gradeMap[grade] || 0) + 1;

    // POG
    if (emp.pog !== null) {
      const p = emp.pog;
      if (p < 70) pogStats[0].total++;
      else if (p <= 80) pogStats[1].total++;
      else if (p <= 90) pogStats[2].total++;
      else pogStats[3].total++;
    }
  });

  const educationStats = Object.entries(eduMap).map(([name, value]) => ({ name, value }));
  const jenjangStats = Object.entries(jenjangMap).map(([name, total]) => ({ name, total }));
  const gradeStats = Object.entries(gradeMap).map(([name, total]) => ({ name, total }));

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
        <EmployeeStatsChart 
          ageData={ageStats} 
          genderData={genderStats}
          educationData={educationStats}
          jenjangData={jenjangStats}
          gradeData={gradeStats}
          pogData={pogStats}
        />

        <CertificationStatsChart />
      </div>

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
        {/* Peringatan Sertifikasi Organik */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Peringatan Sertifikasi Organik</CardTitle>
              <CardDescription>
                Sertifikasi karyawan organik yang kadaluwarsa {`< 30 Hari`}.
              </CardDescription>
            </div>
            <Link href="/certifications" className={buttonVariants({ variant: "outline", size: "sm" })}>
              Lihat <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Pegawai</TableHead>
                  <TableHead>Sertifikasi</TableHead>
                  <TableHead>Tgl Kadaluwarsa</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiringAlertsOrganik.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-4">Aman. Tidak ada sertifikasi organik yang akan habis.</TableCell>
                  </TableRow>
                ) : (
                  expiringAlertsOrganik.map((alert) => {
                    const daysLeft = calculateDaysLeft(alert.expiryDate);
                    return (
                      <TableRow key={alert.id}>
                        <TableCell className="font-medium">{alert.employeeName}</TableCell>
                        <TableCell>{alert.certification}</TableCell>
                        <TableCell>{new Date(alert.expiryDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</TableCell>
                        <TableCell>
                          {daysLeft < 0 ? (
                            <Badge variant="destructive">Kadaluwarsa</Badge>
                          ) : (
                            <Badge variant="destructive" className="bg-red-500">{daysLeft} Hari Lagi</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Peringatan Sertifikasi TAD */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Peringatan Sertifikasi TAD</CardTitle>
              <CardDescription>
                Sertifikasi tenaga alih daya yang kadaluwarsa {`< 30 Hari`}.
              </CardDescription>
            </div>
            <Link href="/certifications-tad" className={buttonVariants({ variant: "outline", size: "sm" })}>
              Lihat <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Perusahaan</TableHead>
                  <TableHead>Sertifikasi</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiringAlertsTAD.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-4">Aman. Tidak ada sertifikasi TAD yang akan habis.</TableCell>
                  </TableRow>
                ) : (
                  expiringAlertsTAD.map((alert) => {
                    const daysLeft = calculateDaysLeft(alert.expiryDate);
                    return (
                      <TableRow key={alert.id}>
                        <TableCell className="font-medium">{alert.employeeName}</TableCell>
                        <TableCell className="text-xs">{alert.perusahaan || '-'}</TableCell>
                        <TableCell>{alert.certification}</TableCell>
                        <TableCell>
                          {daysLeft < 0 ? (
                            <Badge variant="destructive">Kadaluwarsa</Badge>
                          ) : (
                            <Badge variant="destructive" className="bg-red-500">{daysLeft} Hari Lagi</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
