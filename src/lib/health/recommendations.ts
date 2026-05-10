export type Recommendation = {
  title: string;
  impact: string;
  difficulty: "Low" | "Medium" | "High";
};

export function getTopRecommendations(): Recommendation[] {
  return [
    {
      title: "Increase sleep by 45–60 minutes",
      impact: "+18 Recovery",
      difficulty: "Medium",
    },
    {
      title: "Walk 8,000+ steps daily",
      impact: "+12 Energy",
      difficulty: "Low",
    },
    {
      title: "Reduce alcohol to 1–2 drinks/week",
      impact: "+9 Recovery",
      difficulty: "Medium",
    },
    {
      title: "Improve diet quality",
      impact: "+10 Metabolic",
      difficulty: "Medium",
    },
  ];
}