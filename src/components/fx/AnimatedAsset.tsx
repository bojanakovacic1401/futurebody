"use client";

import Image from "next/image";

type AnimatedAssetProps = {
  src: string;
  alt?: string;
  size?: number;
  variant?: "float" | "pulse" | "slow";
  className?: string;
};

export function AnimatedAsset({
  src,
  alt = "",
  size = 160,
  variant = "float",
  className = "",
}: AnimatedAssetProps) {
  return (
    <div
      className={[
        "pointer-events-none relative",
        variant === "float" ? "futurebody-asset-float" : "",
        variant === "pulse" ? "futurebody-asset-pulse" : "",
        variant === "slow" ? "futurebody-asset-slow" : "",
        className,
      ].join(" ")}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 rounded-full bg-cyan-300/20 blur-2xl" />

      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="relative z-10 h-full w-full object-contain drop-shadow-[0_0_28px_rgba(34,211,238,.7)]"
      />
    </div>
  );
}
