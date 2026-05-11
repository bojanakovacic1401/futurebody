import Image from "next/image";
import { cn } from "@/lib/constants";

type HologramBodyProps = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;

  // ostavljamo zbog starih komponenti koje još šalju ove props
  intensity?: number;
  showHeart?: boolean;
};

const sizeMap = {
  sm: "h-[220px]",
  md: "h-[360px]",
  lg: "h-[540px]",
  xl: "h-[720px]",
};

export function HologramBody({
  size = "lg",
  className,
}: HologramBodyProps) {
  return (
    <div
      className={cn(
        "relative mx-auto flex w-full items-center justify-center overflow-visible",
        sizeMap[size],
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,.22),transparent_58%)]" />

      <div className="absolute left-1/2 top-1/2 h-[86%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />
      <div className="absolute left-1/2 top-1/2 h-[68%] w-[56%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />
      <div className="absolute left-1/2 top-1/2 h-[48%] w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />

      <div className="absolute inset-x-[12%] top-1/2 h-px bg-cyan-300/10" />
      <div className="absolute inset-y-[10%] left-1/2 w-px bg-cyan-300/10" />

      <Image
        src="/assets/body-hologram.png"
        alt="FutureBody holographic body"
        width={900}
        height={1200}
        priority
        className="relative z-10 h-full w-auto object-contain drop-shadow-[0_0_40px_rgba(34,211,238,.95)]"
      />
    </div>
  );
}