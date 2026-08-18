"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Mail, User, Calendar, ShieldCheck, Settings, Loader2 } from "lucide-react";

export default function ProfilPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const initials = (user?.name || user?.email || "U").slice(0, 1).toUpperCase();
  const fmt = (d?: string | Date | null) =>
    d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-";

  const rows = [
    { icon: User, label: "Nama Lengkap", value: user?.name || "-" },
    { icon: Mail, label: "Email", value: user?.email || "-" },
    { icon: ShieldCheck, label: "Status Email", value: user?.emailVerified ? "Terverifikasi" : "Belum diverifikasi" },
    { icon: Calendar, label: "Bergabung Sejak", value: fmt((user as any)?.createdAt) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Profil Saya</h1>
        <p className="mt-1 text-slate-500">Informasi akun yang sedang masuk.</p>
      </div>

      <div className="max-w-2xl overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="flex items-center gap-4 bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-bold ring-2 ring-white/40">
            {initials}
          </span>
          <div>
            <div className="text-xl font-bold">{user?.name || "Pengguna"}</div>
            <div className="text-sm text-white/80">{user?.email || "-"}</div>
          </div>
        </div>

        <div className="divide-y">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center gap-4 px-6 py-4">
              <r.icon className="h-5 w-5 text-slate-400" />
              <div className="flex-1">
                <div className="text-xs uppercase tracking-wide text-slate-400">{r.label}</div>
                <div className="font-medium text-slate-800">{r.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 border-t bg-slate-50 px-6 py-4">
          <Link href="/settings">
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" /> Pengaturan Akun
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
