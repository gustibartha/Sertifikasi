"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, LogOut, KeyRound, Loader2, CheckCircle2, AlertTriangle, UserCog } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (newPassword.length < 8) {
      setMsg({ type: "error", text: "Password baru minimal 8 karakter." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMsg({ type: "error", text: "Konfirmasi password tidak cocok." });
      return;
    }
    setLoading(true);
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      if (error) {
        setMsg({ type: "error", text: error.message || "Gagal mengubah password. Periksa password lama Anda." });
      } else {
        setMsg({ type: "success", text: "Password berhasil diperbarui." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setMsg({ type: "error", text: "Terjadi kesalahan sistem." });
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await authClient.signOut({ fetchOptions: { onSuccess: () => router.push("/login") } });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-slate-900">
          <UserCog className="h-7 w-7 text-blue-600" /> Pengaturan
        </h1>
        <p className="mt-1 text-slate-500">Kelola akun dan keamanan Anda.</p>
      </div>

      {/* Info Akun */}
      <div className="max-w-2xl rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-slate-800">Informasi Akun</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">Nama</div>
            <div className="font-medium text-slate-800">{user?.name || "-"}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">Email</div>
            <div className="font-medium text-slate-800">{user?.email || "-"}</div>
          </div>
        </div>
      </div>

      {/* Ganti Password */}
      <div className="max-w-2xl rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-1 flex items-center gap-2 font-semibold text-slate-800">
          <KeyRound className="h-5 w-5 text-blue-600" /> Ganti Password
        </h2>
        <p className="mb-4 text-sm text-slate-500">Gunakan password yang kuat, minimal 8 karakter.</p>

        {msg && (
          <div
            className={`mb-4 flex items-center gap-2 rounded-lg border p-3 text-sm ${
              msg.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {msg.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            {msg.text}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current">Password Lama</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input id="current" type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="pl-9" placeholder="••••••••" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new">Password Baru</Label>
              <Input id="new" type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 8 karakter" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Konfirmasi Password</Label>
              <Input id="confirm" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Ulangi password baru" />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="bg-blue-600 text-white hover:bg-blue-700">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Simpan Password
          </Button>
        </form>
      </div>

      {/* Sesi */}
      <div className="max-w-2xl rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-1 font-semibold text-slate-800">Sesi</h2>
        <p className="mb-4 text-sm text-slate-500">Keluar dari akun pada perangkat ini.</p>
        <Button variant="outline" onClick={handleSignOut} className="gap-2 border-red-200 text-red-600 hover:bg-red-50">
          <LogOut className="h-4 w-4" /> Keluar (Sign Out)
        </Button>
      </div>
    </div>
  );
}
