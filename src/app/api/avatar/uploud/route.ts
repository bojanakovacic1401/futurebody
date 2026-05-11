import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 8 * 1024 * 1024;

function getExtensionFromMimeType(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/jpeg") return "jpg";
  if (type === "image/webp") return "webp";
  return null;
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "/api/avatar/upload",
    message: "Avatar upload route is alive. Use POST with field name avatar.",
  });
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

    const formData = await request.formData();
    const file = formData.get("avatar");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        {
          ok: false,
          message: "No image file received. Field name must be avatar.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          ok: false,
          message: "File is too large. Max size is 8MB.",
        },
        { status: 400 }
      );
    }

    const extension = getExtensionFromMimeType(file.type);

    if (!extension) {
      return NextResponse.json(
        {
          ok: false,
          message: "Only PNG, JPG and WEBP files are allowed.",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const safeUserId = user.id.replace(/[^a-zA-Z0-9-_]/g, "");
    const filename = `avatar-${safeUserId}-${randomUUID()}.${extension}`;
    const filepath = path.join(uploadsDir, filename);

    await writeFile(filepath, buffer);

    return NextResponse.json({
      ok: true,
      imageUrl: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error("Avatar upload error:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Server upload failed. Check terminal for Avatar upload error.",
      },
      { status: 500 }
    );
  }
}