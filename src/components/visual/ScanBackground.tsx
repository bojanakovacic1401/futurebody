import { cn } from "@/lib/constants";

type ScanBackgroundProps = {
  className?: string;
};

export function ScanBackground({ className }: ScanBackgroundProps) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0",
        "bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,.08),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(14,165,233,.08),transparent_34%),linear-gradient(rgba(34,211,238,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.025)_1px,transparent_1px)]",
        "bg-[size:auto,auto,48px_48px,48px_48px]",
        className
      )}
    />
  );
}