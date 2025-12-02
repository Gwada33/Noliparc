import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const COOKIE_NAME = "accessToken";

export interface AdminUser {
  sub: string;
  email: string;
  role: string;
  [key: string]: any;
}

export async function checkAdmin(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (payload.role !== "admin") return null;
    return payload;
  } catch {
    return null;
  }
}
