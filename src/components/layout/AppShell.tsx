import type { ReactNode } from "react";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { ScanBackground } from "@/components/visual/ScanBackground";
import { cn } from "@/lib/constants";

type AppShellProps = {
  children: ReactNode;
  showHeader?: boolean;
  showMobileNav?: boolean;
  className?: string;
};

export function AppShell({
  children,
  showHeader = true,
  showMobileNav = true,
  className,
}: AppShellProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-[#030915] pb-20 text-slate-100 selection:bg-cyan-400/30 md:pb-0",
        className
      )}
    >
      <ScanBackground />

      <div className="relative">
        {showHeader && <Header />}

        {children}

        {showMobileNav && <MobileNav />}
      </div>
    </div>
  );
}