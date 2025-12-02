import { NextResponse } from 'next/server';
import { client } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { logActivity } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Optional: Check CRON_SECRET
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Find confirmed reservations for tomorrow that haven't received a reminder
    // Using specific interval logic. Postgres CURRENT_DATE + INTERVAL '1 day' works.
    const result = await client.query(`
      SELECT r.id, r.date, r.creneau, r.formule, u.email, u.first_name, u.last_name, r.children_name
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      WHERE r.status = 'confirmed'
      AND r.date = CURRENT_DATE + INTERVAL '1 day'
      AND r.reminder_sent_at IS NULL
    `);

    const reservations = result.rows;
    const results = {
      processed: 0,
      errors: 0,
      details: [] as any[]
    };

    for (const reservation of reservations) {
      try {
        const dateStr = new Date(reservation.date).toLocaleDateString('fr-FR');
        
        await sendEmail({
          to: reservation.email,
          subject: 'Rappel : Votre réservation Noliparc pour demain !',
          html: `
            <div style="font-family: sans-serif; color: #333;">
              <h1 style="color: #DB7C26;">À demain chez Noliparc !</h1>
              <p>Bonjour ${reservation.first_name},</p>
              <p>Nous vous rappelons votre réservation prévue pour demain, le <strong>${dateStr}</strong>.</p>
              
              <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Enfant :</strong> ${reservation.children_name || 'Non spécifié'}</p>
                <p><strong>Formule :</strong> ${reservation.formule}</p>
                <p><strong>Créneau :</strong> ${reservation.creneau}</p>
              </div>

              <p>Nous avons hâte de vous accueillir pour fêter cet événement !</p>
              <p>L'équipe Noliparc</p>
            </div>
          `
        });

        // Mark as sent
        await client.query(
          `UPDATE reservations SET reminder_sent_at = NOW() WHERE id = $1`,
          [reservation.id]
        );

        // Log activity (using -1 for system)
        await logActivity(-1, 'send_reminder', { reservation_id: reservation.id, email: reservation.email });

        results.processed++;
        results.details.push({ id: reservation.id, status: 'sent' });

      } catch (err) {
        console.error(`Failed to send reminder for reservation ${reservation.id}:`, err);
        results.errors++;
        results.details.push({ id: reservation.id, status: 'error', error: String(err) });
      }
    }

    return NextResponse.json({ success: true, ...results });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
