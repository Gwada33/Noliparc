import { NextResponse } from "next/server";
import { client } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "L'email est requis" },
        { status: 400 }
      );
    }

    // Check if user exists
    const { rows } = await client.query(
      "SELECT id, first_name FROM users WHERE email = $1",
      [email]
    );

    const user = rows[0];

    if (!user) {
      // For security, don't reveal if user exists
      return NextResponse.json(
        { message: "Si l'email existe, un lien a été envoyé." },
        { status: 200 }
      );
    }

    // Generate token
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour

    // Store token
    await client.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, token, expiresAt]
    );

    // Send email
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://noliparc.fr"}/reset-password?token=${token}`;
    
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Réinitialisation de mot de passe</h2>
        <p>Bonjour ${user.first_name || ""},</p>
        <p>Vous avez demandé à réinitialiser votre mot de passe pour Noliparc.</p>
        <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe (valide 1 heure) :</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #DB7C26; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Réinitialiser mon mot de passe
          </a>
        </p>
        <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: "Noliparc - Réinitialisation de mot de passe",
      html: emailHtml,
    });

    return NextResponse.json(
      { message: "Si l'email existe, un lien a été envoyé." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
