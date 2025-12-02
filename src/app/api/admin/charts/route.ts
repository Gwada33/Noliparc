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
    // 1. Users Growth (Last 12 months)
    // Use generate_series to ensure all months are returned even if count is 0
    const usersGrowthQuery = `
      SELECT to_char(d, 'YYYY-MM') as month, COUNT(u.id) as count 
      FROM generate_series(
        date_trunc('month', NOW() - INTERVAL '11 months'),
        date_trunc('month', NOW()),
        '1 month'::interval
      ) d
      LEFT JOIN users u ON date_trunc('month', u.created_at) = d
      GROUP BY 1 
      ORDER BY 1 ASC
    `;

    // 2. Reservations Trend (Last 12 months)
    const reservationsTrendQuery = `
      SELECT to_char(d, 'YYYY-MM') as month, COUNT(r.id) as count 
      FROM generate_series(
        date_trunc('month', NOW() - INTERVAL '11 months'),
        date_trunc('month', NOW()),
        '1 month'::interval
      ) d
      LEFT JOIN reservations r ON date_trunc('month', r.created_at) = d
      GROUP BY 1 
      ORDER BY 1 ASC
    `;

    // 3. Reservations by Formula (Distribution)
    const reservationsByFormulaQuery = `
      SELECT formule as name, COUNT(*) as value 
      FROM reservations 
      GROUP BY 1
    `;

    // 4. Daily Reservations (Last 30 Days)
    const dailyReservationsQuery = `
      SELECT to_char(d, 'YYYY-MM-DD') as date, COUNT(r.id) as count
      FROM generate_series(
        NOW() - INTERVAL '29 days',
        NOW(),
        '1 day'::interval
      ) d
      LEFT JOIN reservations r ON date_trunc('day', r.created_at) = date_trunc('day', d)
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    const [usersRes, reservationsRes, formulasRes, dailyRes] = await Promise.all([
      client.query(usersGrowthQuery),
      client.query(reservationsTrendQuery),
      client.query(reservationsByFormulaQuery),
      client.query(dailyReservationsQuery)
    ]);

    // Format data for Recharts (convert BigInt/strings to numbers)
    const formatData = (rows: any[], valueKey: string) => {
      return rows.map(row => ({
        ...row,
        [valueKey]: parseInt(row[valueKey] || '0', 10)
      }));
    };

    return NextResponse.json({
      usersGrowth: formatData(usersRes.rows, 'count'),
      reservationsTrend: formatData(reservationsRes.rows, 'count'),
      reservationsByFormula: formatData(formulasRes.rows, 'value'),
      dailyReservations: formatData(dailyRes.rows, 'count')
    });
  } catch (error) {
    console.error("Charts error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
