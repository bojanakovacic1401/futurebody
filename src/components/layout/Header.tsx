import Image from "next/image";
import Link from "next/link";
import { UserCircle, Wifi } from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/onboarding", label: "Inputs" },
  { href: "/body", label: "Body" },
  { href: "/timeline", label: "Timeline" },
  { href: "/simulate", label: "Simulate" },
  { href: "/insights", label: "Insights" },
  { href: "/profile", label: "Profile" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-cyan-300/10 bg-[#020712]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] w-full max-w-[1760px] items-center justify-between px-4 md:px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image
            src="/assets/logo-b.png"
            alt="FutureBody"
            width={54}
            height={54}
            priority
            className="h-12 w-12 object-contain drop-shadow-[0_0_18px_rgba(34,211,238,.9)]"
          />

          <span className="hidden text-2xl font-bold tracking-wide text-white sm:block">
            FutureBody
          </span>
        </Link>

        <nav className="hidden items-center gap-6 2xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-bold uppercase tracking-[0.26em] text-slate-400 transition hover:text-cyan-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden text-right md:block">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Status
            </div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-300">
              Optimal
            </div>
          </div>

          <Wifi className="hidden text-cyan-300 md:block" size={18} />

          <LogoutButton />

          <Link
            href="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/35 bg-cyan-400/10 text-cyan-200"
          >
            <UserCircle size={22} />
          </Link>
        </div>
      </div>
    </header>
  );
}