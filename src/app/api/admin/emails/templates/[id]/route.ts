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

export async function PUT(request: Request, { params }: any) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
  }

  try {
    const { id } = params;
    const body = await request.json();
    const { name, subject, content, key } = body;

    let queryText = "UPDATE email_templates SET updated_at = NOW()";
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (name) { queryText += `, name = $${paramIndex++}`; queryParams.push(name); }
    if (subject) { queryText += `, subject = $${paramIndex++}`; queryParams.push(subject); }
    if (content) { queryText += `, html = $${paramIndex++}`; queryParams.push(content); }
    if (key) { queryText += `, key = $${paramIndex++}`; queryParams.push(key); }

    queryText += ` WHERE id = $${paramIndex}`;
    queryParams.push(id);

    const result = await client.query(`${queryText} RETURNING *`, queryParams);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Template introuvable" }, { status: 404 });
    }

    await logActivity(parseInt(admin.sub), "UPDATE_TEMPLATE", { templateId: id, changes: body });

    return NextResponse.json({ template: result.rows[0] });

  } catch (error) {
    console.error("Error updating template:", error);
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
    
    // Check usage?
    
    const result = await client.query("DELETE FROM email_templates WHERE id = $1 RETURNING id", [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Template introuvable" }, { status: 404 });
    }

    await logActivity(parseInt(admin.sub), "DELETE_TEMPLATE", { templateId: id });

    return NextResponse.json({ message: "Template supprimée" });

  } catch (error) {
    console.error("Error deleting template:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
