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

  // Muat data PEG vs POG (Bezetting vs Formasi Ideal) per bidang secara client-side
  // agar dashboard SSR tetap cepat (pencocokan formasi cukup berat).
  useEffect(() => {
    let cancelled = false;
    getFormasiWithActual().then((res) => {
      if (cancelled || !res.success || !res.data) return;
      const bidangMap: Record<string, { pog: number; peg: number }> = {};
      res.data.forEach((r) => {
        const b = r.bidang && r.bidang !== "-" ? r.bidang : "Lainnya";
        if (!bidangMap[b]) bidangMap[b] = { pog: 0, peg: 0 };
        bidangMap[b].pog += Number(r.formasiIdeal ?? 0);
        bidangMap[b].peg += Number(r.bezetting ?? 0);
      });
      const agg = Object.entries(bidangMap)
        .map(([name, v]) => ({
          name,
          POG: v.pog,
          PEG: v.peg,
          pct: v.pog > 0 ? Math.round((v.peg / v.pog) * 100) : 0,
        }))
        .filter((r) => r.POG > 0 || r.PEG > 0)
        .sort((a, b) => b.POG - a.POG);
      setPegVsPog(agg);
    });
    return () => { cancelled = true; };
  }, []);

  // PEG vs POG (formasi) hanya relevan untuk Organik
  const active = group === "Organik"
    ? { ...organik, pegVsPogData: pegVsPog }
    : { ...tad, pegVsPogData: [] };

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
      />
    </div>
  );
}
