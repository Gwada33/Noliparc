import { NextResponse } from "next/server";
import { client } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");

  try {
    let query = "SELECT * FROM park_schedules";
    const params: any[] = [];

    if (location) {
      query += " WHERE location = $1";
      params.push(location);
    }
    
    query += " ORDER BY season";

    const result = await client.query(query, params);
    
    const schedules = result.rows.map(item => {
      let rows = typeof item.rows === 'string' ? JSON.parse(item.rows) : item.rows;
      
      // Transform from DB format (Object) to UI format (Array)
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
