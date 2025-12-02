import { NextResponse } from "next/server";
import { client } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token et mot de passe requis" },
        { status: 400 }
      );
    }

    // Verify token
    const { rows } = await client.query(
      `SELECT user_id, expires_at 
       FROM password_reset_tokens 
       WHERE token = $1`,
      [token]
    );

    const record = rows[0];

    if (!record) {
      return NextResponse.json(
        { message: "Lien invalide ou expiré" },
        { status: 400 }
      );
    }

    if (new Date() > new Date(record.expires_at)) {
      // Clean up expired token
      await client.query(
        "DELETE FROM password_reset_tokens WHERE token = $1",
        [token]
      );
      return NextResponse.json(
        { message: "Lien expiré" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    await client.query(
      "UPDATE users SET password = $1 WHERE id = $2",
      [hashedPassword, record.user_id]
    );

    // Delete used token (and potentially other tokens for this user)
    await client.query(
      "DELETE FROM password_reset_tokens WHERE user_id = $1",
      [record.user_id]
    );

    return NextResponse.json(
      { message: "Mot de passe mis à jour" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
