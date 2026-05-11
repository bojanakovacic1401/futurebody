import type { HealthInput, Recommendation } from "@/types/health";

export function getRecommendations(input: HealthInput): Recommendation[] {
  const recommendations: Recommendation[] = [];

  if (input.sleep < 7.2) {
    recommendations.push({
      id: "sleep",
      title: "Increase sleep duration",
      description:
        "Adding 45–60 minutes of sleep is projected to improve recovery, focus and burnout resilience.",
      impact: "+12 to +18 recovery",
      priority: "high",
    });
  }

  if (input.steps < 8000) {
    recommendations.push({
      id: "steps",
      title: "Walk 8,000+ steps daily",
      description:
        "Daily walking has a strong compounding effect on energy, metabolic score and inflammation trend.",
      impact: "+8 to +14 energy",
      priority: "high",
    });
  }

  if (input.stress > 55) {
    recommendations.push({
      id: "stress",
      title: "Reduce stress load",
      description:
        "Lowering perceived stress may improve readiness and reduce projected burnout risk.",
      impact: "-10 to -20 burnout risk",
      priority: "high",
    });
  }

  if (input.diet < 75) {
    recommendations.push({
      id: "diet",
      title: "Improve diet quality",
      description:
        "Better nutrition quality supports metabolic score, energy stability and inflammation estimates.",
      impact: "+6 to +12 metabolic",
      priority: "medium",
    });
  }

  if (input.alcohol > 3) {
    recommendations.push({
      id: "alcohol",
      title: "Reduce alcohol frequency",
      description:
        "Reducing alcohol may improve sleep quality, recovery and next-day readiness.",
      impact: "+5 to +10 sleep/recovery",
      priority: "medium",
    });
  }

  if (input.strength < 3) {
    recommendations.push({
      id: "strength",
      title: "Add strength training",
      description:
        "Two to three weekly sessions may improve body composition and long-term metabolic resilience.",
      impact: "+5 to +9 metabolic",
      priority: "medium",
    });
  }

  return recommendations.slice(0, 5);
}