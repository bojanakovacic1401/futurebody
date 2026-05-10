import type { ReactNode } from "react";
import { cn } from "@/lib/constants";

type HUDCardProps = {
  children: ReactNode;
  className?: string;
};

export function HUDCard({ children, className }: HUDCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-cyan-300/15 bg-slate-950/45",
        "shadow-[inset_0_0_40px_rgba(14,165,233,.06),0_0_30px_rgba(14,165,233,.06)]",
        "backdrop-blur-xl",
        className
      )}
    >
      {children}
    </div>
  );
}