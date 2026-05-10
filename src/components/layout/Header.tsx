"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRound, Wifi } from "lucide-react";
import { APP_NAME, NAV_ITEMS, cn } from "@/lib/constants";

function FBLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-8 w-12">
        <div className="absolute left-0 top-1 h-1.5 w-10 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,.9)]" />
        <div className="absolute left-0 top-3.5 h-1.5 w-8 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,.9)]" />
        <div className="absolute left-0 top-6 h-1.5 w-10 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,.9)]" />
        <div className="absolute left-8 top-1 h-6 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,.9)]" />
      </div>

      <span className="text-xl font-semibold tracking-wide text-white md:text-2xl">
        {APP_NAME}
      </span>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-cyan-400/10 bg-[#030915]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1800px] items-center justify-between px-4 md:px-8">
        <Link href="/dashboard" className="shrink-0">
          <FBLogo />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-xs font-semibold uppercase tracking-[0.22em] transition",
                  isActive
                    ? "text-cyan-300"
                    : "text-slate-400 hover:text-cyan-200"
                )}
              >
                {item.label}

                {isActive && (
                  <span className="absolute -bottom-6 left-0 h-px w-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,.9)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 md:flex">
            <div className="text-right text-[10px] uppercase tracking-[0.18em]">
              <div className="text-slate-500">Status</div>
              <div className="text-emerald-300">Optimal</div>
            </div>

            <Wifi size={18} className="text-cyan-300" />
          </div>

          <Link
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300/70 bg-cyan-400/10 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,.35)]"
          >
            <CircleUserRound size={24} />
          </Link>
        </div>
      </div>
    </header>
  );
}