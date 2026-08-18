export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { employees, certifications } from "@/lib/schema";
import { and, eq, lte, sql } from "drizzle-orm";
import { formasiData } from "@/formasi-data";
import {
  ArrowRight,
  ShieldCheck,
  Users,
  Award,
  ClipboardList,
  Activity,
  FileSpreadsheet,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

async function getKpis() {
  // FTK ideal berasal dari data statis — selalu tersedia walau DB gagal.
  const totalIdeal = formasiData.reduce((a, r) => a + Number(r.formasiIdeal ?? 0), 0);
  const fallback = {
    organik: 0, tad: 0 as any, tadCount: 0, totalKaryawan: 0, totalIdeal,
    keterisian: 0, totalCert: 0, aktifCert: 0, warning: 0, expired: 0, expiring: 0,
  };
  try {
    const aktif = sql`(${employees.status_aktif} is null or lower(${employees.status_aktif}) = 'aktif')`;

    const [org] = await db
      .select({ c: sql<number>`count(*)` })
      .from(employees)
      .where(and(eq(employees.status_pegawai, "Organik"), aktif));
    const [tad] = await db
      .select({ c: sql<number>`count(*)` })
      .from(employees)
      .where(and(eq(employees.status_pegawai, "TAD"), aktif));

    const organik = Number(org?.c ?? 0);
    const tadCount = Number(tad?.c ?? 0);
    const keterisian = totalIdeal > 0 ? Math.round((organik / totalIdeal) * 100) : 0;

    // Sertifikasi per status
    const byStatus = await db
      .select({ s: certifications.status_sertifikasi, c: sql<number>`count(*)` })
      .from(certifications)
      .groupBy(certifications.status_sertifikasi);
    let aktifCert = 0,
      warning = 0,
      expired = 0,
      totalCert = 0;
    byStatus.forEach((r) => {
      const n = Number(r.c);
      totalCert += n;
      const st = (r.s || "").toLowerCase();
      if (st === "expired") expired += n;
      else if (st === "warning") warning += n;
      else aktifCert += n;
    });

    // Sertifikasi akan kadaluarsa dalam 30 hari
    const target = new Date();
    target.setDate(target.getDate() + 30);
    const [exp] = await db
      .select({ c: sql<number>`count(*)` })
      .from(certifications)
      .where(lte(certifications.tanggal_kadaluarsa, target.toISOString().split("T")[0]));

    return {
      organik,
      tad,
      tadCount,
      totalKaryawan: organik + tadCount,
      totalIdeal,
      keterisian,
      totalCert,
      aktifCert,
      warning,
      expired,
      expiring: Number(exp?.c ?? 0),
    };
  } catch {
    return fallback;
  }
}

// Gauge lingkaran (SVG) untuk persentase keterisian
function Gauge({ value }: { value: number }) {
  const r = 80;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(100, Math.max(0, value)) / 100) * circ;
  const color = value >= 90 ? "#34d399" : value >= 75 ? "#60a5fa" : value >= 50 ? "#fbbf24" : "#f87171";
  return (
    <svg viewBox="0 0 200 200" className="h-52 w-52 -rotate-90">
      <circle cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
      <circle
        cx="100"
        cy="100"
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

const features = [
  { icon: Users, title: "Direktori Pegawai", desc: "Kelola data Organik & TAD dengan filter, edit, dan import/export Excel." },
  { icon: Award, title: "Sertifikasi & Peringatan", desc: "Pantau masa berlaku sertifikat dan dapatkan peringatan sebelum kadaluarsa." },
  { icon: ClipboardList, title: "Formasi & Bezetting", desc: "Bandingkan formasi ideal (FTK) dengan bezetting aktual per posisi." },
  { icon: BarChart3, title: "PEG vs POG", desc: "Analisis keterisian posisi: Struktural vs Fungsional dalam sekali lihat." },
  { icon: FileSpreadsheet, title: "Import / Export Excel", desc: "Impor data massal dan ekspor daftar sesuai filter ke .xlsx." },
  { icon: Activity, title: "Monitoring Real-time", desc: "Dashboard eksekutif dengan data langsung dari database." },
];

export default async function LandingPage() {
  const kpi = await getKpis();

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 antialiased">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute top-1/3 -left-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white p-1.5">
            <Image src="/logo-pln.png" alt="PLN" width={32} height={32} className="h-8 w-8 object-contain" />
          </div>
          <div className="font-bold tracking-tight">
            Smart <span className="text-blue-400">Certification</span>
          </div>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500"
        >
          Masuk <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-10 lg:grid-cols-2 lg:pt-16">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-300 backdrop-blur">
            <ShieldCheck className="h-4 w-4" /> Sistem Informasi SDM Terpadu — PLN Nusantara Power
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Pantau <span className="text-blue-400">Formasi</span>, Sertifikasi &amp; Kinerja Pegawai
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-400">
            Satu platform untuk memantau keterisian formasi, mengelola direktori pegawai, dan menjaga
            sertifikasi tetap berlaku — dengan data langsung dan monitoring real-time.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500"
            >
              Masuk ke Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#fitur"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-base font-semibold text-slate-200 transition-all hover:bg-white/5"
            >
              Lihat Fitur
            </a>
          </div>
        </div>

        {/* KPI Gauge card */}
        <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Keterisian Formasi (Bezetting)
          </div>
          <div className="flex items-center gap-6">
            <div className="relative flex items-center justify-center">
              <Gauge value={kpi?.keterisian ?? 0} />
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-bold">{kpi?.keterisian ?? 0}%</span>
                <span className="text-xs text-slate-400">terisi</span>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-2xl font-bold text-emerald-400">{kpi?.organik ?? 0}</div>
                <div className="text-slate-400">Bezetting aktual</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{kpi?.totalIdeal ?? 0}</div>
                <div className="text-slate-400">Formasi ideal (FTK)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">{kpi?.expiring ?? 0}</div>
                <div className="text-slate-400">Sertifikasi &lt; 30 hari</div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs">
            <span className="inline-flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> {kpi?.aktifCert ?? 0} sertifikat aktif
            </span>
            <span className="inline-flex items-center gap-1.5 text-red-400">
              <AlertTriangle className="h-4 w-4" /> {kpi?.expired ?? 0} kadaluarsa
            </span>
          </div>
        </div>
      </section>

      {/* Stat strip */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-16">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total Karyawan", value: kpi?.totalKaryawan ?? 0, sub: `${kpi?.organik ?? 0} Organik · ${kpi?.tadCount ?? 0} TAD`, color: "text-blue-400" },
            { label: "Sertifikat Aktif", value: kpi?.aktifCert ?? 0, sub: `dari ${kpi?.totalCert ?? 0} sertifikat`, color: "text-emerald-400" },
            { label: "Keterisian Formasi", value: `${kpi?.keterisian ?? 0}%`, sub: `${kpi?.organik ?? 0} / ${kpi?.totalIdeal ?? 0} posisi`, color: "text-cyan-400" },
            { label: "Akan Kadaluarsa", value: kpi?.expiring ?? 0, sub: "dalam 30 hari", color: "text-amber-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="text-xs font-medium uppercase tracking-wider text-slate-400">{s.label}</div>
              <div className={`mt-2 text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="mt-1 text-xs text-slate-500">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="fitur" className="relative z-10 mx-auto max-w-6xl px-6 pb-20">
        <h2 className="mb-2 text-center text-2xl font-bold sm:text-3xl">Semua yang Anda butuhkan</h2>
        <p className="mb-10 text-center text-slate-400">Dari data pegawai hingga analisis formasi — dalam satu tempat.</p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-all hover:border-blue-500/40 hover:bg-white/[0.07]">
              <div className="mb-4 inline-flex rounded-xl bg-blue-500/15 p-3 text-blue-400">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-1.5 font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-gradient-to-r from-blue-600/20 to-cyan-500/10 p-10 text-center backdrop-blur">
          <h3 className="text-2xl font-bold">Siap memantau kinerja SDM Anda?</h3>
          <p className="max-w-md text-slate-300">Masuk dengan akun korporat untuk mengakses dashboard lengkap.</p>
          <Link
            href="/login"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 transition-all hover:bg-slate-200"
          >
            Masuk ke Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} PT PLN Nusantara Power — Smart Certification.
      </footer>
    </div>
  );
}
