import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth/session";
import type { User } from "@/types/user";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          ok: false,
          message: "Name, email and password are required.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          ok: false,
          message: "Password must be at least 6 characters.",
        },
        { status: 400 }
      );
    }

    const user: User = {
      id: `local-${email.replace(/[^a-zA-Z0-9]/g, "")}`,
      name,
      email,
      provider: "demo",
    };

    const response = NextResponse.json({
      ok: true,
      user,
    });

    setSessionCookie(response, user);

    return response;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Register failed.",
      },
      { status: 500 }
    );
  }
}