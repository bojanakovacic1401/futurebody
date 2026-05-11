import { NextResponse } from "next/server";
import { normalizeHealthInput } from "@/lib/health/defaults";
import { calculateHealthScores, getBodySystems } from "@/lib/health/scoring";
import { getDefaultIntervention, getInterventionImpact } from "@/lib/health/interventions";
import { projectHealthTrajectory } from "@/lib/health/projection";
import { getRecommendations } from "@/lib/health/recommendations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = normalizeHealthInput(body.input);
    const intervention = body.intervention || getDefaultIntervention(input);

    const scores = calculateHealthScores(input);
    const bodySystems = getBodySystems(input);
    const projection = projectHealthTrajectory(input, intervention);
    const impact = getInterventionImpact(input, intervention);
    const recommendations = getRecommendations(input);

    return NextResponse.json({
      ok: true,
      input,
      scores,
      bodySystems,
      projection,
      impact,
      recommendations,
    });
  } catch (error) {
    console.error("Simulation error:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Simulation failed.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const input = normalizeHealthInput();
  const intervention = getDefaultIntervention(input);

  return NextResponse.json({
    ok: true,
    input,
    scores: calculateHealthScores(input),
    bodySystems: getBodySystems(input),
    projection: projectHealthTrajectory(input, intervention),
    impact: getInterventionImpact(input, intervention),
    recommendations: getRecommendations(input),
  });
}