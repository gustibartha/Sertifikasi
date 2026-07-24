"use client";

import { useState, useEffect } from "react";
import { EmployeeStatsChart } from "@/components/charts/employee-stats-chart";
import { Users, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFormasiWithActual } from "@/app/actions/formasi";

export interface DemographicStats {
  ageData: any[];
  genderData: any[];
  educationData: any[];
  jenjangData: any[];
  gradeData: any[];
  pegVsPogData: any[];
  total: number;
}

type Group = "Organik" | "TAD";

export function DashboardDemographics({
  organik,
  tad,
}: {
  organik: DemographicStats;
  tad: DemographicStats;
}) {
  const [group, setGroup] = useState<Group>("Organik");
  const [pegVsPog, setPegVsPog] = useState<any[]>([]);
  const [pegVsPogMeta, setPegVsPogMeta] = useState<{ unmatched: number; totalPosisi: number }>({ unmatched: 0, totalPosisi: 0 });

  // Muat data PEG vs POG (Bezetting vs Formasi Ideal) client-side agar dashboard SSR
  // tetap cepat (pencocokan formasi cukup berat). Dikategorikan per posisi:
  // PEG>POG / PEG<POG / PEG=POG, dipecah Struktural vs Fungsional (dari jenjang jabatan).
  useEffect(() => {
    let cancelled = false;
    getFormasiWithActual().then((res) => {
      if (cancelled || !res.success || !res.data) return;

      // Bentuk grup posisi: baris ber-formasiIdeal jadi header, baris null menempel ke atasnya
      const groups: { pog: number; peg: number; struktural: boolean }[] = [];
      let cur: { pog: number; peg: number; struktural: boolean } | null = null;
      res.data.forEach((r) => {
        if (r.formasiIdeal !== null) {
          cur = {
            pog: Number(r.formasiIdeal),
            peg: Number(r.bezetting ?? 0),
            struktural: /manajemen/i.test(r.jenjangJabatan || ""),
          };
          groups.push(cur);
        } else if (cur) {
          cur.peg += Number(r.bezetting ?? 0);
        }
      });

      // Hitung jumlah KARYAWAN (bezetting), bukan jumlah posisi, sesuai label
      // "Karyawan Fungsional/Struktural" pada spesifikasi.
      const counts = { gtF: 0, ltS: 0, gtS: 0, ltF: 0, eq: 0 };
      groups.forEach((g) => {
        if (g.peg === g.pog) counts.eq += g.peg;
        else if (g.peg > g.pog) g.struktural ? (counts.gtS += g.peg) : (counts.gtF += g.peg);
        else g.struktural ? (counts.ltS += g.peg) : (counts.ltF += g.peg);
      });

      // Urutan & warna sesuai spesifikasi (gambar acuan)
      const cats = [
        { key: "gtF", label: "PEG > POG (Karyawan Fungsional)", count: counts.gtF, color: "#F5A623" },
        { key: "ltS", label: "PEG < POG (Karyawan Struktural)", count: counts.ltS, color: "#E53935" },
        { key: "gtS", label: "PEG > POG (Karyawan Struktural)", count: counts.gtS, color: "#FBD38D" },
        { key: "ltF", label: "PEG < POG (Karyawan Fungsional)", count: counts.ltF, color: "#FDE047" },
        { key: "eq", label: "PEG = POG", count: counts.eq, color: "#CBD5E1" },
      ];

      setPegVsPog(cats);
      setPegVsPogMeta({ unmatched: res.unmatched ?? 0, totalPosisi: groups.length });
    });
    return () => { cancelled = true; };
  }, []);

  // PEG vs POG (formasi) hanya relevan untuk Organik
  const active = group === "Organik"
    ? { ...organik, pegVsPogData: pegVsPog, pegVsPogMeta }
    : { ...tad, pegVsPogData: [], pegVsPogMeta: { unmatched: 0, totalPosisi: 0 } };

  const tabBase =
    "flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-lg transition-all";

  return (
    <div className="xl:col-span-2 flex flex-col gap-3">
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setGroup("Organik")}
          className={cn(
            tabBase,
            group === "Organik"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Users className="h-4 w-4" /> Organik
          <span className="text-xs font-bold opacity-70">({organik.total})</span>
        </button>
        <button
          type="button"
          onClick={() => setGroup("TAD")}
          className={cn(
            tabBase,
            group === "TAD"
              ? "bg-white text-teal-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          <UserCheck className="h-4 w-4" /> TAD
          <span className="text-xs font-bold opacity-70">({tad.total})</span>
        </button>
      </div>

      <EmployeeStatsChart
        key={group}
        ageData={active.ageData}
        genderData={active.genderData}
        educationData={active.educationData}
        jenjangData={active.jenjangData}
        gradeData={active.gradeData}
        pegVsPogData={active.pegVsPogData}
        pegVsPogMeta={active.pegVsPogMeta}
      />
    </div>
  );
}
