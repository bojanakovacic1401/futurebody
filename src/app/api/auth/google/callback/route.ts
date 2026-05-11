import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth/session";
import type { User } from "@/types/user";

const OAUTH_STATE_COOKIE = "futurebody_oauth_state";

type GoogleTokenResponse = {
  access_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
  id_token?: string;
  error?: string;
  error_description?: string;
};

type GoogleUserInfo = {
  id?: string;
  email?: string;
  verified_email?: boolean;
  name?: string;
  picture?: string;
};

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const error = requestUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/login?error=google", request.url));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/login?error=missing_code", request.url));
  }

  const cookieState = request.headers
    .get("cookie")
    ?.split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${OAUTH_STATE_COOKIE}=`))
    ?.split("=")[1];

  if (!cookieState || cookieState !== state) {
    return NextResponse.redirect(new URL("/login?error=state", request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    "http://localhost:3000/api/auth/google/callback";

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/login?error=missing_google_env", request.url));
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = (await tokenResponse.json()) as GoogleTokenResponse;

  if (!tokenResponse.ok || !tokenData.access_token) {
    console.error("Google token error:", tokenData);

    return NextResponse.redirect(new URL("/login?error=token", request.url));
  }

  const userInfoResponse = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    }
  );

  const googleUser = (await userInfoResponse.json()) as GoogleUserInfo;

  if (!userInfoResponse.ok || !googleUser.email) {
    console.error("Google userinfo error:", googleUser);

    return NextResponse.redirect(new URL("/login?error=userinfo", request.url));
  }

  const user: User = {
    id: `google-${googleUser.id || googleUser.email}`,
    name: googleUser.name || googleUser.email.split("@")[0],
    email: googleUser.email,
    avatarUrl: googleUser.picture,
    provider: "google",
  };

  const response = NextResponse.redirect(new URL("/dashboard", request.url));

  response.cookies.set({
    name: OAUTH_STATE_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  setSessionCookie(response, user);

  return response;
}