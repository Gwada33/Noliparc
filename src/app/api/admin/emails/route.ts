import { NextResponse } from "next/server";
import { client } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { logActivity } from "@/lib/logger";
import { checkAdmin } from "@/lib/auth-admin";

// Removed local sendEmail helper in favor of lib/email.ts

export async function GET(request: Request) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    
    const queryText = `
      SELECT e.id, e.recipient, e.subject, e.status, e.created_at, e.opened_at, e.click_count, t.name as template_name
      FROM emails e
      LEFT JOIN email_templates t ON e.template_id = t.id
      ORDER BY e.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const result = await client.query(queryText, [limit, offset]);
    
    const countResult = await client.query('SELECT COUNT(*) FROM emails');
    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({
      emails: result.rows,
      total,
      limit,
      offset
    });

  } catch (error) {
    console.error("Error fetching emails:", error);
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
    const { to, subject, content, templateId } = body;

    if (!to || !subject || !content) {
      return NextResponse.json({ message: "Champs manquants" }, { status: 400 });
    }

    let status = 'pending';
    let errorMsg = null;

    // 1. Insert into DB first to get ID
    const insertQuery = `
      INSERT INTO emails (recipient, subject, content, template_id, status, error)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, created_at
    `;
    
    const result = await client.query(insertQuery, [
      to, 
      subject, 
      content, 
      templateId || null, 
      status, 
      errorMsg
    ]);
    
    const emailId = result.rows[0].id;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // 2. Inject tracking
    // Pixel de suivi d'ouverture
    const trackingPixel = `<img src="${baseUrl}/api/tracking/open?id=${emailId}" width="1" height="1" alt="" style="display:none;" />`;
    
    // Suivi des clics (remplacement basique des liens)
    let trackedContent = content.replace(/href=["'](http[^"']+)["']/g, (match: string, url: string) => {
        const trackedUrl = `${baseUrl}/api/tracking/click?id=${emailId}&url=${encodeURIComponent(url)}`;
        return `href="${trackedUrl}"`;
    });
    
    trackedContent += trackingPixel;

    // 3. Send email
    try {
      await sendEmail({ to, subject, html: trackedContent });
      
      // Update status to sent
      await client.query(`UPDATE emails SET status = 'sent' WHERE id = $1`, [emailId]);
      
    } catch (err: any) {
      console.error("Failed to send email:", err);
      status = 'failed';
      errorMsg = err.message;
      
      // Update status to failed
      await client.query(`UPDATE emails SET status = 'failed', error = $2 WHERE id = $1`, [emailId, errorMsg]);
      
      return NextResponse.json({ message: "Erreur lors de l'envoi", error: errorMsg }, { status: 500 });
    }

    await logActivity(parseInt(admin.sub), "SEND_EMAIL", { recipient: to, subject, templateId, emailId });

    return NextResponse.json({ message: "Email envoyé avec succès", email: { ...result.rows[0], status: 'sent' } });

  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
