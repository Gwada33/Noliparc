import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { mkdir, writeFile } from "fs/promises";
import { join, extname } from "path";

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = "accessToken";

async function checkAdmin() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    return payload.role === "admin";
  } catch {
    return false;
  }
}

function safeFilename(originalName: string) {
  const ext = extname(originalName || "").toLowerCase();
  const safeExt = ext && ext.length <= 10 ? ext : ".png";
  const rand = Math.random().toString(16).slice(2);
  return `${Date.now()}-${rand}${safeExt}`;
}

export async function POST(request: Request) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    if (!file.type || !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are allowed" }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const maxBytes = 8 * 1024 * 1024;
    if (buf.byteLength > maxBytes) {
      return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 413 });
    }

    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const filename = safeFilename(file.name);
    const targetPath = join(uploadsDir, filename);
    await writeFile(targetPath, buf);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
