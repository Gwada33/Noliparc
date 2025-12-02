import { NextResponse } from "next/server";
import { get_config, update_config } from "@/lib/config";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = "accessToken";

async function checkAdmin() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

export async function GET() {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const config = await get_config();
  return NextResponse.json(config);
}

export async function POST(request: Request) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const newConfig = await update_config(body);
    return NextResponse.json(newConfig);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update config" }, { status: 500 });
  }
}
