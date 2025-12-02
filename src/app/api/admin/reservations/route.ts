import { NextResponse } from "next/server";
import { client } from "@/lib/db";
import { checkAdmin } from "@/lib/auth-admin";

export async function GET(request: Request) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const date = searchParams.get("date") || "";

    // Auto-update past reservations
    try {
      await client.query(`
        UPDATE reservations 
        SET status = 'completed' 
        WHERE status = 'pending' AND date < CURRENT_DATE
      `);
    } catch (e) {
      console.error("Failed to auto-update past reservations", e);
      // Continue anyway
    }

    let queryText = `
      SELECT 
        r.id, r.date, r.creneau, r.formule, r.status, r.created_at,
        r.children_name, r.age, r.children_count, r.adults_count, r.gateau, r.extras,
        u.email, u.first_name, u.last_name, u.phone
      FROM reservations r
      LEFT JOIN users u ON r.user_id = u.id
    `;
    
    const conditions: string[] = [];
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (search) {
      conditions.push(`(u.email ILIKE $${paramIndex} OR u.first_name ILIKE $${paramIndex} OR u.last_name ILIKE $${paramIndex} OR r.children_name ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    if (status) {
      conditions.push(`r.status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }

    if (date) {
      conditions.push(`r.date = $${paramIndex}`);
      queryParams.push(date);
      paramIndex++;
    }

    if (conditions.length > 0) {
      queryText += ` WHERE ` + conditions.join(' AND ');
    }

    queryText += ` ORDER BY r.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);

    const result = await client.query(queryText, queryParams);

    // Count total
    let countQuery = `
      SELECT COUNT(*) 
      FROM reservations r 
      LEFT JOIN users u ON r.user_id = u.id
    `;
    if (conditions.length > 0) {
      countQuery += ` WHERE ` + conditions.join(' AND ');
    }
    // Reuse params except limit/offset
    const countParams = queryParams.slice(0, paramIndex - 1);
    const countResult = await client.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({
      reservations: result.rows.map(row => ({
        id: row.id,
        date: row.date,
        timeSlot: row.creneau,
        formule: row.formule,
        status: row.status,
        createdAt: row.created_at,
        childName: row.children_name,
        childAge: row.age,
        childrenCount: row.children_count,
        adultsCount: row.adults_count,
        cake: row.gateau,
        extras: row.extras,
        user: {
          email: row.email,
          firstName: row.first_name,
          lastName: row.last_name,
          phone: row.phone
        }
      })),
      total,
      limit,
      offset
    });

  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
