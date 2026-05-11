import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getAvatarCredits } from "@/lib/avatar/credits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      {
        ok: false,
        message: "Unauthorized.",
      },
      { status: 401 }
    );
  }

  const credits = await getAvatarCredits(user.id);

  return NextResponse.json({
    ok: true,
    credits,
  });
}