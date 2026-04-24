import { Bell, Search, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-white/50 px-6 backdrop-blur-md">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari pegawai atau sertifikasi..."
            className="w-full appearance-none bg-white pl-8 shadow-sm rounded-full"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-600 ring-2 ring-white"></span>
          <span className="sr-only">Notifikasi</span>
        </Button>
        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 border shadow-sm">
          <UserCircle className="h-6 w-6" />
        </div>
      </div>
    </header>
  );
}
