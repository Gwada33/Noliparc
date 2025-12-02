import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { client } from "@/lib/db";
import { logActivity } from "@/lib/logger";
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

    let queryText = `
      SELECT id, email, first_name, last_name, phone, role, created_at 
      FROM users 
    `;
    const queryParams: any[] = [];

    if (search) {
      queryText += ` WHERE email ILIKE $1 OR first_name ILIKE $1 OR last_name ILIKE $1`;
      queryParams.push(`%${search}%`);
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    const result = await client.query(queryText, queryParams);
    
    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) FROM users`;
    let countParams: any[] = [];
    if (search) {
      countQuery += ` WHERE email ILIKE $1 OR first_name ILIKE $1 OR last_name ILIKE $1`;
      countParams.push(`%${search}%`);
    }
    const countResult = await client.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({
      users: result.rows.map(row => ({
        id: row.id,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        phone: row.phone,
        role: row.role,
        createdAt: row.created_at
      })),
      total,
      limit,
      offset
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone, role } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Email et mot de passe requis" }, { status: 400 });
    }

    // Check existing
    const existing = await client.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ message: "Cet email est déjà utilisé" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || "user";

    const result = await client.query(
      `INSERT INTO users (email, password, first_name, last_name, phone, role) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, email, first_name, last_name, phone, role, created_at`,
      [email, hashedPassword, firstName, lastName, phone, userRole]
    );

    const newUser = result.rows[0];

    await logActivity(parseInt(admin.sub), "CREATE_USER", { userId: newUser.id, email: newUser.email });

    return NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        phone: newUser.phone,
        role: newUser.role,
        createdAt: newUser.created_at
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
