import { NextResponse } from "next/server";
import { client } from "@/lib/db";
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
  try {
    const result = await client.query(`
      SELECT * FROM park_schedules ORDER BY location, season
    `);
    
    const schedules = result.rows.map(item => {
      let rows = typeof item.rows === 'string' ? JSON.parse(item.rows) : item.rows;
      
      // Transform from DB format (Object) to UI format (Array) if needed
      if (Array.isArray(rows) && rows.length > 0 && !Array.isArray(rows[0]) && typeof rows[0] === 'object') {
        rows = rows.map((r: any) => [r.day, ...(r.slots || [])]);
      }

      return {
        ...item,
        headers: typeof item.headers === 'string' ? JSON.parse(item.headers) : item.headers,
        rows: rows
      };
    });

    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json({ error: "Failed to fetch schedules" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { id, location, season, headers, rows } = body;

    // Transform UI format (Array) to DB format (Object)
    const dbRows = Array.isArray(rows) ? rows.map((r: any) => {
      if (Array.isArray(r)) {
        return { day: r[0], slots: r.slice(1) };
      }
      return r;
    }) : rows;

    if (id) {
      // Update
      const result = await client.query(`
        UPDATE park_schedules 
        SET location = $1, season = $2, headers = $3, rows = $4, updated_at = NOW()
        WHERE id = $5
        RETURNING *
      `, [location, season, JSON.stringify(headers), JSON.stringify(dbRows), id]);
      return NextResponse.json(result.rows[0]);
    } else {
      // Create
      const result = await client.query(`
        INSERT INTO park_schedules (location, season, headers, rows)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [location, season, JSON.stringify(headers), JSON.stringify(dbRows)]);
      return NextResponse.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error saving schedule:", error);
    return NextResponse.json({ error: "Failed to save schedule" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await client.query("DELETE FROM park_schedules WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete schedule" }, { status: 500 });
  }
}
