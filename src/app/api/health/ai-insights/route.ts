import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getCurrentUser } from "@/lib/auth/session";
import { normalizeHealthInput } from "@/lib/health/defaults";
import { calculateHealthScores, getBodySystems } from "@/lib/health/scoring";
import { getRecommendations } from "@/lib/health/recommendations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function buildPrompt(data: {
  input: ReturnType<typeof normalizeHealthInput>;
  scores: ReturnType<typeof calculateHealthScores>;
  bodySystems: ReturnType<typeof getBodySystems>;
  recommendations: ReturnType<typeof getRecommendations>;
}) {
  return `
You are the AI insight engine for FutureBody, a personal predictive health simulator.

IMPORTANT SAFETY RULES:
- Do not diagnose disease.
- Do not say the user will definitely develop a condition.
- Use probabilistic language: "may", "could", "is associated with", "suggests".
- Make it clear this is a lifestyle simulation, not medical advice.
- Do not recommend medication.
- Do not tell the user to ignore clinicians.
- Keep the tone premium, calm, futuristic, and practical.

USER INPUT:
Age: ${data.input.age}
Sex: ${data.input.biologicalSex}
Height: ${data.input.heightCm} cm
Weight: ${data.input.weight} kg
Goal weight: ${data.input.goalWeight} kg
Body fat: ${data.input.bodyFat}%
Sleep: ${data.input.sleep} hours
Sleep quality: ${data.input.sleepQuality}/100
Steps: ${data.input.steps}
Strength training: ${data.input.strength} days/week
Cardio: ${data.input.cardio} minutes/week
Diet quality: ${data.input.diet}/100
Alcohol: ${data.input.alcohol} drinks/week
Stress: ${data.input.stress}/100
Activity level: ${data.input.activityLevel}

CURRENT SCORES:
Energy: ${data.scores.energy}/100
Focus: ${data.scores.focus}/100
Recovery: ${data.scores.recovery}/100
Burnout risk: ${data.scores.burnoutRisk}/100
Metabolic: ${data.scores.metabolic}/100
Inflammation estimate: ${data.scores.inflammation}
Sleep debt: ${data.scores.sleepDebt} hours
Biological age estimate: ${data.scores.biologicalAge}
Longevity potential: ${data.scores.longevityPotential}/100
Readiness: ${data.scores.readiness}/100

BODY SYSTEMS:
${data.bodySystems
  .map((system) => `- ${system.name}: ${system.score}/100 (${system.status})`)
  .join("\n")}

RECOMMENDATIONS:
${data.recommendations
  .map((item) => `- ${item.title}: ${item.description} Impact: ${item.impact}`)
  .join("\n")}

Return a concise but useful insight report in this exact structure:

1. FutureBody Summary
2. Strongest Signal
3. Main Pressure Point
4. Highest-Leverage Action
5. 30-Day Prediction
6. Safety Note

Make it readable and direct.
`;
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          message: "Unauthorized. Please log in again.",
        },
        { status: 401 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          ok: false,
          message: "Missing OPENAI_API_KEY in .env.local.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const input = normalizeHealthInput(body.input);

    const scores = calculateHealthScores(input);
    const bodySystems = getBodySystems(input);
    const recommendations = getRecommendations(input);

    if (process.env.USE_MOCK_AI === "true") {
  return NextResponse.json({
    ok: true,
        insight: `1. FutureBody Summary
    Your current simulation shows readiness at ${scores.readiness}/100, energy at ${scores.energy}/100, and recovery at ${scores.recovery}/100. This is a lifestyle simulation, not a diagnosis.

    2. Strongest Signal
    Your strongest signal is ${
        bodySystems.sort((a, b) => b.score - a.score)[0]?.name || "overall readiness"
        }, based on the current body-system model.

    3. Main Pressure Point
    The main pressure point appears to be ${
        bodySystems.sort((a, b) => a.score - b.score)[0]?.name || "recovery load"
        }. This may reflect sleep, stress, movement, nutrition, or body-composition inputs.

    4. Highest-Leverage Action
    ${
        recommendations[0]?.title || "Maintain consistency"
        }: ${recommendations[0]?.description || "Your current pattern looks relatively stable."}

    5. 30-Day Prediction
    If you improve your strongest leverage habits consistently for 30 days, your readiness and recovery trajectory may improve modestly.

    6. Safety Note
    This is not medical advice. FutureBody provides probabilistic lifestyle simulations only. For medical decisions, consult a qualified clinician.`,
    });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.responses.create({
      model: process.env.OPENAI_TEXT_MODEL || "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You generate careful, non-diagnostic lifestyle simulation insights for a health-tech hackathon app.",
        },
        {
          role: "user",
          content: buildPrompt({
            input,
            scores,
            bodySystems,
            recommendations,
          }),
        },
      ],
    });

    return NextResponse.json({
      ok: true,
      insight: response.output_text,
    });
  } catch (error) {
    console.error("AI insight error:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "AI insight generation failed. Check terminal for details.",
      },
      { status: 500 }
    );
  }
}