import type { ReactNode } from "react";
import { cn } from "@/lib/constants";

type GlowButtonProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function GlowButton({
  children,
  className,
  onClick,
  type = "button",
  disabled = false,
}: GlowButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-xl border border-cyan-300/60 bg-cyan-400/20",
        "px-6 py-4 font-semibold text-white",
        "shadow-[0_0_28px_rgba(34,211,238,.35)]",
        "transition hover:bg-cyan-300/30 active:scale-[0.99]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
}