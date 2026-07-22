"use client";

import { useState } from "react";
import { EmployeeStatsChart } from "@/components/charts/employee-stats-chart";
import { Users, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DemographicStats {
  ageData: any[];
  genderData: any[];
  educationData: any[];
  jenjangData: any[];
  gradeData: any[];
  pogData: any[];
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
  const active = group === "Organik" ? organik : tad;

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
        pogData={active.pogData}
      />
    </div>
  );
}
