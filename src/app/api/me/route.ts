import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = "accessToken";

export async function GET() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    return NextResponse.json({
      user: {
        id        : payload.sub,
        email     : payload.email,
        firstName : payload.firstName,
        lastName  : payload.lastName,
      },
    });
  } catch {
    return NextResponse.json({ message: "Token invalide" }, { status: 401 });
  }
}
