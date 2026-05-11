import Image from "next/image";

type FutureAvatarProps = {
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: "h-[220px]",
  md: "h-[360px]",
  lg: "h-[560px]",
};

export function FutureAvatar({
  imageUrl = "/assets/body-hologram.png",
  size = "md",
}: FutureAvatarProps) {
  return (
    <div
      className={[
        "relative flex w-full items-center justify-center overflow-hidden rounded-3xl border border-cyan-300/10 bg-slate-950/40",
        sizeMap[size],
      ].join(" ")}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.035)_1px,transparent_1px)] bg-[size:36px_36px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.18),transparent_58%)]" />

      <Image
        src={imageUrl}
        alt="FutureBody avatar"
        width={700}
        height={900}
        className="relative z-10 h-full w-auto object-contain p-4 drop-shadow-[0_0_45px_rgba(34,211,238,.9)]"
      />
    </div>
  );
}