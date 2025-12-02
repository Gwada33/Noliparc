import { NextResponse } from "next/server";
import { client } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = "accessToken";

export async function GET() {
  // Verify Admin
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (payload.role !== 'admin') return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    // Run queries in parallel
    const [usersRes, reservationsRes, productsRes] = await Promise.all([
      client.query("SELECT COUNT(*) FROM users"),
      client.query("SELECT COUNT(*) FROM reservations"),
      client.query("SELECT COUNT(*) FROM products WHERE status = 'active'")
    ]);

    return NextResponse.json({
      users: parseInt(usersRes.rows[0].count, 10),
      reservations: parseInt(reservationsRes.rows[0].count, 10),
      activeProducts: parseInt(productsRes.rows[0].count, 10)
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
