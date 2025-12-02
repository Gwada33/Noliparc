import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { client } from "@/lib/db";
import { logActivity } from "@/lib/logger";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const COOKIE_NAME = "accessToken";

// Helper to check admin authentication
async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (payload.role !== "admin") return null;
    return payload;
  } catch (err) {
    return null;
  }
}

export async function PUT(request: Request, { params }: any) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
  }

  try {
    const { id } = params;
    const body = await request.json();
    const { email, password, firstName, lastName, phone, role } = body;

    // Check if user exists
    const userCheck = await client.query("SELECT id FROM users WHERE id = $1", [id]);
    if (userCheck.rows.length === 0) {
      return NextResponse.json({ message: "Utilisateur introuvable" }, { status: 404 });
    }

    // Prepare update query
    let queryText = "UPDATE users SET updated_at = NOW()";
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (email) {
      queryText += `, email = $${paramIndex++}`;
      queryParams.push(email);
    }
    if (firstName !== undefined) {
      queryText += `, first_name = $${paramIndex++}`;
      queryParams.push(firstName);
    }
    if (lastName !== undefined) {
      queryText += `, last_name = $${paramIndex++}`;
      queryParams.push(lastName);
    }
    if (phone !== undefined) {
      queryText += `, phone = $${paramIndex++}`;
      queryParams.push(phone);
    }
    if (role) {
      queryText += `, role = $${paramIndex++}`;
      queryParams.push(role);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      queryText += `, password = $${paramIndex++}`;
      queryParams.push(hashedPassword);
    }

    queryText += ` WHERE id = $${paramIndex}`;
    queryParams.push(id);

    // If only updated_at is set (no fields to update), skip or handle gracefully
    if (queryParams.length === 1) { // Only id is in params
       return NextResponse.json({ message: "Aucune modification fournie" }, { status: 400 });
    }

    const result = await client.query(
      `${queryText} RETURNING id, email, first_name, last_name, phone, role, created_at`,
      queryParams
    );

    const updatedUser = result.rows[0];

    await logActivity(parseInt(admin.sub), "UPDATE_USER", { userId: updatedUser.id, changes: body });

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        phone: updatedUser.phone,
        role: updatedUser.role,
        createdAt: updatedUser.created_at
      }
    });

  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: any) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
  }

  try {
    const { id } = params;

    const result = await client.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Utilisateur introuvable" }, { status: 404 });
    }

    await logActivity(parseInt(admin.sub), "DELETE_USER", { userId: id });

    return NextResponse.json({ message: "Utilisateur supprimé avec succès" });

  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
