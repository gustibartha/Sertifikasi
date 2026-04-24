import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  Award,
  UserCheck,
  ClipboardList,
  Settings
} from "lucide-react";

const mainNav = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Formasi Tenaga Kerja", href: "/formasi", icon: ClipboardList },
];

const organikNav = [
  { name: "Direktori Organik", href: "/employees/organik", icon: Users },
  { name: "Sertifikasi Organik", href: "/certifications", icon: Award },
];

const tadNav = [
  { name: "Direktori TAD", href: "/employees/tad", icon: Users },
  { name: "Sertifikasi Alih Daya", href: "/certifications-tad", icon: UserCheck },
];

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="flex flex-col items-center py-6 px-4 border-b border-sidebar-border">
        <img
          src="/logo-pln.png"
          alt="PLN Nusantara Power"
          className="h-10 object-contain mb-3"
        />
        <h1 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
          <span>Smart Certification</span>
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        {/* Main Navigation */}
        <nav className="space-y-1 px-3 mb-4">
          {mainNav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 rounded-[var(--radius)] px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Karyawan Organik Section */}
        <div className="px-3 mb-4">
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            Karyawan Organik
          </p>
          <nav className="space-y-1">
            {organikNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-[var(--radius)] px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Tenaga Alih Daya Section */}
        <div className="px-3">
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            Tenaga Alih Daya
          </p>
          <nav className="space-y-1">
            {tadNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-[var(--radius)] px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="border-t border-sidebar-border p-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-[var(--radius)] px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Settings className="h-5 w-5" />
          Pengaturan
        </Link>
      </div>
    </div>
  );
}
