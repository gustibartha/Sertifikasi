"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Search, LogOut, User, Settings, Award, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getExpiringCertifications } from "@/app/actions/certification";

type Notif = { id: string; name: string; pelatihan: string; exp: string; daysLeft: number };

export function Header() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [notifs, setNotifs] = useState<Notif[]>([]);

  useEffect(() => {
    getExpiringCertifications().then((res) => {
      if (res.success) setNotifs(res.data as Notif[]);
    });
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push("/login") },
    });
  };

  const user = session?.user;
  const initials = (user?.name || user?.email || "U").slice(0, 1).toUpperCase();

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-white/50 px-6 backdrop-blur-md sticky top-0 z-30">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari pegawai atau sertifikasi..."
            className="w-full appearance-none bg-white pl-8 shadow-sm rounded-full focus-visible:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        {/* Notifikasi */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 transition-colors">
            <Bell className="h-5 w-5" />
            {notifs.length > 0 && (
              <span className="absolute top-2 right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                {notifs.length}
              </span>
            )}
            <span className="sr-only">Notifikasi</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-white">
            {/* div biasa: Menu.GroupLabel wajib di dalam Menu.Group, kalau tidak popup gagal render */}
            <div className="flex items-center justify-between px-1.5 py-1 text-xs font-medium text-muted-foreground">
              <span>Notifikasi</span>
              <span className="font-normal">{notifs.length} peringatan</span>
            </div>
            <DropdownMenuSeparator />
            {notifs.length === 0 ? (
              <div className="flex flex-col items-center gap-1 py-6 text-center text-sm text-muted-foreground">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                Tidak ada sertifikasi yang akan habis.
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {notifs.map((n) => (
                  <DropdownMenuItem key={n.id} render={<Link href="/monitoring" />} className="cursor-pointer flex-col items-start gap-0.5 py-2.5">
                    <div className="flex w-full items-center gap-2">
                      <Award className="h-4 w-4 shrink-0 text-amber-500" />
                      <span className="font-medium text-slate-800 truncate">{n.name}</span>
                      <span className={`ml-auto shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${n.daysLeft < 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                        {n.daysLeft < 0 ? "Kadaluarsa" : `${n.daysLeft} hari`}
                      </span>
                    </div>
                    <span className="pl-6 text-xs text-muted-foreground truncate w-full">{n.pelatihan || "Sertifikasi"}</span>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/monitoring" />} className="cursor-pointer justify-center text-sm font-medium text-blue-600 focus:text-blue-600">
              Lihat semua di Monitoring
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profil */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-10 items-center gap-2 rounded-full border bg-white pl-1 pr-3 shadow-sm hover:bg-slate-50 transition-colors">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              {initials}
            </span>
            <span className="hidden text-sm font-medium text-slate-700 sm:block max-w-[120px] truncate">
              {user?.name || user?.email || "Akun"}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 bg-white">
            <div className="flex flex-col px-1.5 py-1">
              <span className="text-sm font-semibold text-foreground">{user?.name || "Pengguna"}</span>
              <span className="truncate text-xs text-muted-foreground">{user?.email || "-"}</span>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/profil" />} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" /> Profil Saya
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/settings" />} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" /> Pengaturan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Keluar (Sign Out)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
