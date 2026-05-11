import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized. Please log in again." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const imageUrl = String(body.imageUrl || "");
    const scenario = String(body.scenario || "baseline");

    if (!imageUrl) {
      return NextResponse.json(
        { ok: false, message: "Missing uploaded image URL." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      scenario,
      imageUrl,
      message:
        "Temporary generator active. Next step: replace this with OpenAI image generation.",
    });
  } catch (error) {
    console.error("Avatar generation error:", error);

    return NextResponse.json(
      { ok: false, message: "Avatar generation failed." },
      { status: 500 }
    );
  }
}