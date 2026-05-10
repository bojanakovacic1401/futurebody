import type { HealthTimelinePoint } from "@/types/health";

export function getDefaultTimeline(): HealthTimelinePoint[] {
  return [
    { label: "Now", currentPath: 78, improvedPath: 78 },
    { label: "30D", currentPath: 80, improvedPath: 82 },
    { label: "6M", currentPath: 79, improvedPath: 86 },
    { label: "2Y", currentPath: 77, improvedPath: 90 },
    { label: "5Y", currentPath: 75, improvedPath: 92 },
  ];
}