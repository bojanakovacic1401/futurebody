import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";
import { getCurrentUser } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Scenario = "baseline" | "improved" | "risk";

type AvatarMetrics = {
  heightCm: number;
  weightKg: number;
  bodyFat: number;
  sleepHours: number;
  stress: number;
  activityLevel: string;
  goalWeightKg: number;
};

function getMimeType(filename: string) {
  const lower = filename.toLowerCase();

  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";

  return "image/png";
}

function getActivityText(activityLevel: string) {
  if (activityLevel === "sedentary") return "low activity / mostly sedentary";
  if (activityLevel === "light") return "light activity";
  if (activityLevel === "moderate") return "moderate activity";
  if (activityLevel === "active") return "active lifestyle";
  if (activityLevel === "very_active") return "very active lifestyle";
  return "moderate activity";
}

function getBodyCompositionText(metrics: AvatarMetrics) {
  const bmi = metrics.weightKg / Math.pow(metrics.heightCm / 100, 2);

  let bodyType = "realistic average healthy body composition";

  if (metrics.bodyFat <= 14) {
    bodyType = "lean athletic body composition, but still realistic and natural";
  } else if (metrics.bodyFat <= 22) {
    bodyType = "moderately fit body composition with natural proportions";
  } else if (metrics.bodyFat <= 30) {
    bodyType = "soft but healthy realistic body composition";
  } else {
    bodyType = "heavier realistic body composition with natural proportions";
  }

  return `
Physical data:
- Height: ${metrics.heightCm} cm
- Current weight: ${metrics.weightKg} kg
- Estimated body fat: ${metrics.bodyFat}%
- Goal weight: ${metrics.goalWeightKg} kg
- Approximate BMI: ${bmi.toFixed(1)}
- Sleep average: ${metrics.sleepHours} hours
- Stress score: ${metrics.stress}/100
- Activity level: ${getActivityText(metrics.activityLevel)}

Body interpretation:
- ${bodyType}
- Body must match the height, weight and body fat values.
- Do not create a fantasy body.
- Do not make the person unrealistically thin.
- Do not make the person unrealistically muscular.
- Keep proportions believable.
`;
}

function getScenarioPrompt(scenario: Scenario, metrics: AvatarMetrics) {
  const bodyData = getBodyCompositionText(metrics);

  const basePrompt = `
Create a realistic future health avatar based on the uploaded photo.

The output should look like a realistic full-body version of the person, not a cartoon, not a skeleton, not a green hologram.

VISUAL STYLE:
- realistic human face and body
- full body portrait
- natural skin tone
- believable future version of the uploaded person
- dark premium health-tech background
- subtle cyan-blue rim light only
- subtle transparent medical HUD glow around the body
- realistic wellness / fitness app aesthetic
- no green body color
- no full-body x-ray
- no skeleton as the main subject
- no nudity
- no sexualized pose
- no revealing clothing
- no underwear
- no bikini
- no hospital patient look
- no text
- no logos
- no UI panels
- clean premium sci-fi wellness aesthetic
- clothing should be fitted dark athletic wellness outfit, tasteful and non-revealing

Identity:
- Use the uploaded photo as identity reference for face, hair, ethnicity, general age range and facial features.
- Keep the person recognizable, but transform into a full-body health avatar.

${bodyData}
`;

  if (scenario === "improved") {
    return `
${basePrompt}

SCENARIO:
Improved future version.

Create a realistic improved future version based on the user's goal and healthier habits:
- weight should trend toward ${metrics.goalWeightKg} kg
- body should look slightly leaner and healthier than current state
- better posture
- more rested face
- clearer skin
- confident but neutral expression
- athletic but realistic body
- if current stress is high, show calmer expression
- if sleep is low, show visibly more rested future self
- subtle blue/cyan medical glow around body edges
- no green glow
- no exaggerated muscles
- no fantasy body
- no skeleton
`;
  }

  if (scenario === "risk") {
    return `
${basePrompt}

SCENARIO:
Risk trajectory version.

Create a realistic future version if current habits do not improve:
- if stress is high, show slightly more tired face and tense posture
- if sleep is below 7 hours, show mild fatigue under eyes
- if activity is low, show slightly softer body composition
- do not make it ugly, scary, sick or extreme
- subtle darker lighting
- very subtle amber warning highlights in the background only
- no disease depiction
- no injury
- no gore
- no scary medical image
- no skeleton
- no green glow
`;
  }

  return `
${basePrompt}

SCENARIO:
Baseline current version.

Create a realistic current health avatar:
- body composition should reflect ${metrics.weightKg} kg, ${metrics.heightCm} cm, and ${metrics.bodyFat}% estimated body fat
- neutral healthy posture
- natural face
- realistic body proportions
- subtle cyan-blue futuristic health scan lighting
- no green hologram
- no skeleton
- no x-ray body
`;
}

function safeUploadedPath(imageUrl: string) {
  if (!imageUrl.startsWith("/uploads/")) {
    return null;
  }

  const filename = path.basename(decodeURIComponent(imageUrl));
  return path.join(process.cwd(), "public", "uploads", filename);
}

function normalizeMetrics(value: unknown): AvatarMetrics {
  const raw = value as Partial<AvatarMetrics>;

  return {
    heightCm: Number(raw?.heightCm || 178),
    weightKg: Number(raw?.weightKg || 72),
    bodyFat: Number(raw?.bodyFat || 18),
    sleepHours: Number(raw?.sleepHours || 6.5),
    stress: Number(raw?.stress || 55),
    activityLevel: String(raw?.activityLevel || "moderate"),
    goalWeightKg: Number(raw?.goalWeightKg || 68),
  };
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

    const body = await request.json();

    const imageUrl = String(body.imageUrl || "");
    const scenario = String(body.scenario || "baseline") as Scenario;
    const metrics = normalizeMetrics(body.metrics);

    if (!imageUrl) {
      return NextResponse.json(
        {
          ok: false,
          message: "Upload a face image first.",
        },
        { status: 400 }
      );
    }

    if (process.env.USE_MOCK_AI === "true") {
      return NextResponse.json({
        ok: true,
        scenario,
        imageUrl,
        message:
          "Mock AI mode active. Returning uploaded image without using OpenAI credits.",
      });
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

    const localImagePath = safeUploadedPath(imageUrl);

    if (!localImagePath) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid uploaded image URL.",
        },
        { status: 400 }
      );
    }

    const inputBuffer = await readFile(localImagePath);
    const inputFilename = path.basename(localImagePath);
    const inputMimeType = getMimeType(inputFilename);

    const inputFile = await toFile(inputBuffer, inputFilename, {
      type: inputMimeType,
    });

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const result = await openai.images.edit({
      model: "gpt-image-1",
      image: inputFile,
      prompt: getScenarioPrompt(scenario, metrics),
      size: "1024x1536",
      quality: "medium",
    });

    const b64 = result.data?.[0]?.b64_json;

    if (!b64) {
      return NextResponse.json(
        {
          ok: false,
          message: "OpenAI did not return an image.",
        },
        { status: 500 }
      );
    }

    const generatedDir = path.join(process.cwd(), "public", "generated");
    await mkdir(generatedDir, { recursive: true });

    const safeUserId = user.id.replace(/[^a-zA-Z0-9-_]/g, "");
    const filename = `futurebody-${safeUserId}-${scenario}-${randomUUID()}.png`;
    const filepath = path.join(generatedDir, filename);

    await writeFile(filepath, Buffer.from(b64, "base64"));

    return NextResponse.json({
      ok: true,
      scenario,
      imageUrl: `/generated/${filename}`,
      message: "Future avatar generated.",
    });
  } catch (error) {
    console.error("Avatar generation error:", error);

    return NextResponse.json(
      {
        ok: false,
        message:
          "Avatar generation failed. Check terminal for OpenAI/API error.",
      },
      { status: 500 }
    );
  }
}