"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CircleUserRound,
  Clock,
  Home,
  Play,
  ScanHeart,
} from "lucide-react";
import { cn } from "@/lib/constants";

const mobileItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Body",
    href: "/body",
    icon: ScanHeart,
  },
  {
    label: "Timeline",
    href: "/timeline",
    icon: Clock,
  },
  {
    label: "Simulate",
    href: "/simulate",
    icon: Play,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: CircleUserRound,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-cyan-300/10 bg-[#030915]/95 px-3 py-2 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-5">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl py-2 text-xs transition",
                isActive
                  ? "bg-cyan-400/10 text-cyan-300 shadow-[inset_0_0_18px_rgba(34,211,238,.08)]"
                  : "text-slate-500 hover:text-cyan-300"
              )}
            >
              <Icon size={22} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
