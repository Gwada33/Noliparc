import { NextResponse } from "next/server";
import { client } from "@/lib/db";
import { logActivity } from "@/lib/logger";
import { sendEmail } from "@/lib/email";
import { checkAdmin } from "@/lib/auth-admin";

export async function PUT(request: Request, { params }: any) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
  }

  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ message: "Status requis" }, { status: 400 });
    }

    const result = await client.query(
      `UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Réservation introuvable" }, { status: 404 });
    }

    const reservation = result.rows[0];

    // Send notification email
    try {
      if (status === 'confirmed') {
        await sendEmail({
          to: reservation.email,
          subject: 'Confirmation de votre réservation - Noliparc',
          html: `
            <h1>Votre réservation est confirmée !</h1>
            <p>Bonjour ${reservation.parent_name},</p>
            <p>Nous avons le plaisir de vous confirmer votre réservation pour le ${new Date(reservation.date_reservation).toLocaleDateString('fr-FR')}.</p>
            <p>À bientôt chez Noliparc !</p>
          `
        });
      } else if (status === 'cancelled') {
        await sendEmail({
          to: reservation.email,
          subject: 'Annulation de votre réservation - Noliparc',
          html: `
            <h1>Votre réservation a été annulée</h1>
            <p>Bonjour ${reservation.parent_name},</p>
            <p>Votre réservation pour le ${new Date(reservation.date_reservation).toLocaleDateString('fr-FR')} a été annulée.</p>
            <p>Si vous pensez qu'il s'agit d'une erreur, merci de nous contacter.</p>
          `
        });
      }
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
      // Don't fail the request if email fails, but log it
    }

    await logActivity(parseInt(admin.sub), "UPDATE_RESERVATION", { reservationId: id, status });

    return NextResponse.json({ reservation });

  } catch (error) {
    console.error("Error updating reservation:", error);
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
    const result = await client.query("DELETE FROM reservations WHERE id = $1 RETURNING id", [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Réservation introuvable" }, { status: 404 });
    }

    await logActivity(parseInt(admin.sub), "DELETE_RESERVATION", { reservationId: id });

    return NextResponse.json({ message: "Réservation supprimée" });

  } catch (error) {
    console.error("Error deleting reservation:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
