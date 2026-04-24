"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { sendCertificationReminders } from "@/app/actions/certification";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

export function NotificationButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSend = async () => {
    setLoading(true);
    const res = await sendCertificationReminders();
    setResult(res as any);
    setLoading(false);
  };

  return (
    <Dialog onOpenChange={(open) => !open && setResult(null)}>
      <DialogTrigger>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
          <Send className="h-4 w-4" />
          Blast Notifikasi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Kirim Notifikasi Blast</DialogTitle>
          <DialogDescription>
            Sistem akan mengirimkan pengingat ke WhatsApp dan Email pegawai yang sertifikasinya akan habis dalam 30 hari ke depan.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {result ? (
            <div className={`p-4 rounded-lg flex items-center gap-3 ${result.success ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {result.success ? <CheckCircle2 className="h-5 w-5" /> : null}
              <p className="text-sm font-medium">{result.message || result.success ? "Berhasil!" : "Gagal mengirim."}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-600">
              Pastikan data email dan nomor telepon pegawai sudah terisi dengan benar di Direktori Pegawai.
            </p>
          )}
        </div>

        {!result && (
          <Button 
            onClick={handleSend} 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            Mulai Kirim Sekarang
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
