import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { client } from "@/lib/db";
import { logActivity } from "@/lib/logger";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const COOKIE_NAME = "accessToken";

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

export async function GET(request: Request) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
  }

  try {
    const result = await client.query(`SELECT * FROM email_templates ORDER BY name ASC`);
    return NextResponse.json({ templates: result.rows });
  } catch (error) {
    console.error("Error fetching templates:", error);
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
    const { name, subject, content, key } = body; // key is unique in DB

    if (!name || !subject || !content || !key) {
      return NextResponse.json({ message: "Champs manquants" }, { status: 400 });
    }

    // Check if key exists
    const existing = await client.query("SELECT id FROM email_templates WHERE key = $1", [key]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ message: "Une template avec cette clé existe déjà" }, { status: 400 });
    }

    const result = await client.query(
      `INSERT INTO email_templates (name, subject, html, key) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, subject, content, key]
    );

    await logActivity(parseInt(admin.sub), "CREATE_TEMPLATE", { templateId: result.rows[0].id, name });

    return NextResponse.json({ template: result.rows[0] });

  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
