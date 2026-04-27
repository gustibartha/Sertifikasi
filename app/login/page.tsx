"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Lock, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [nid, setNid] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("Mencoba login...");
      const { data, error: signInError } = await authClient.signIn.email({
        email: nid, 
        password,
      });
      console.log("Respon Login:", { data, error: signInError });

      if (signInError) {
        console.error("FULL LOGIN ERROR:", signInError);
        setError(signInError.message || "Gagal masuk. Periksa kembali NID/Email dan Password Anda.");
        setIsLoading(false);
        return;
      }

      // Full page reload to pick up the new session cookie
      window.location.href = "/";
    } catch (err) {
      setError("Terjadi kesalahan sistem. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Panel - Hero/Image Section */}
      <div className="relative hidden w-1/2 lg:flex flex-col justify-between overflow-hidden bg-zinc-950 p-10 text-white">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/login-bg.png"
            alt="Smart SDM Background"
            fill
            className="object-cover opacity-60"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-transparent mix-blend-multiply" />
        </div>

        {/* Content Top */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="rounded-xl bg-white p-2">
            <Image
              src="/logo-pln.png"
              alt="PLN Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="font-bold text-xl tracking-tight text-white/90">
            PLN Nusantara Power
          </div>
        </div>

        {/* Content Bottom */}
        <div className="relative z-10 max-w-lg">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-300 backdrop-blur-md">
            <ShieldCheck className="h-4 w-4" />
            Sistem Informasi SDM Terpadu
          </div>
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-white">
            SMART <span className="text-blue-400">SDM</span>
          </h1>
          <p className="text-lg text-zinc-300 leading-relaxed">
            Empowering Human Resources through Smart Technology. Pantau formasi tenaga kerja, sertifikasi, dan performa pegawai dalam satu platform cerdas.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-24 xl:px-32 relative">
        {/* Decorative elements for the right side */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="relative z-10 mx-auto w-full max-w-sm">
          {/* Mobile Logo (hidden on desktop) */}
          <div className="mb-8 flex justify-center lg:hidden">
            <div className="rounded-2xl bg-white p-3 shadow-lg shadow-black/5 ring-1 ring-black/5">
              <Image
                src="/logo-pln.png"
                alt="PLN Logo"
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Selamat Datang
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Silakan masuk menggunakan akun korporat Anda
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-600 border border-red-500/20">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="nid"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
              >
                NID / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <User className="h-5 w-5" />
                </div>
                <Input
                  id="nid"
                  placeholder="Masukkan NID atau Email"
                  className="pl-10 h-12 bg-muted/50 border-muted-foreground/20 focus-visible:ring-blue-500"
                  value={nid}
                  onChange={(e) => setNid(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Lupa Password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-12 bg-muted/50 border-muted-foreground/20 focus-visible:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-md shadow-blue-500/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Memproses...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Masuk</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PT PLN Nusantara Power.<br />All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
