// src/app/api/reservation/route.ts

export const runtime = 'nodejs'; // 👈 nécessaire pour utiliser Nodemailer sans erreurs Vercel

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import {client} from '@/lib/db';


type ReservationPayload = {
  userId: string;
  date: string; // ou Date si tu préfères
  formule: string;
  childrenCount: number;
  adultsCount: number;
  extras: string[] | string; // tu gères les deux cas dans ton code
};


function generateId() {
  return 'resv_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

async function sendEmail({ to, subject, html }: EmailPayload): Promise<void> {
  if (!to || !subject || !html) {
    throw new Error('Champs manquants pour l\'envoi de mail');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Noliparc Contact" <contact@noliparc.com>',
    to,
    subject,
    html,
  });
}

export async function POST(request: Request) {
  try {
    const data: ReservationPayload = await request.json();

    const date = new Date(data.date);
    const formattedDate = date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    if (typeof data.extras === 'string') {
      data.extras = data.extras.split(',').map(e => e.trim()).filter(Boolean);
    }

    const extrasText =
      Array.isArray(data.extras) && data.extras.length > 0
        ? data.extras.join(', ')
        : 'Aucun';

    if (!data.userId) {
      return NextResponse.json({ message: 'userId manquant' }, { status: 400 });
    }

    // 🔍 Récupération de l'email de l'utilisateur
    const userQuery = `SELECT email FROM users WHERE id = $1 LIMIT 1;`;
    const userResult = await client.query(userQuery, [data.userId]);

    if (userResult.rows.length === 0) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const userEmail = userResult.rows[0].email;

    // 🛠 Insertion de la réservation
    const id = generateId();
    const createdAt = new Date().toISOString();
    const status = 'pending';

    const insertQuery = `
      INSERT INTO reservations
        (id, user_id, date, formule, children_count, adults_count, extras, status, created_at)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const insertValues = [
      id,
      data.userId,
      data.date,
      data.formule,
      data.childrenCount,
      data.adultsCount,
      JSON.stringify(data.extras),
      status,
      createdAt,
    ];

    const { rows } = await client.query(insertQuery, insertValues);
    const reservation = rows[0];

    // 📨 Construction de l'email HTML
    const subject = 'Confirmation de votre réservation';
    const logoUrl = 'https://i.imgur.com/ahQpl7N.png';
    const host = request.headers.get('host');
    const protocol = host?.startsWith('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    const imageUrl = `${baseUrl}/images/carte-anniversaire.jpeg`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <div style="text-align: center;">
          <img src="${logoUrl}" alt="Noliparc Logo" style="max-height: 120px; margin-bottom: 20px;" />
        </div>
        <h2 style="color: #4CAF50;">🎉 Votre réservation a bien été prise en compte !</h2>
        <p>Bonjour,</p>
        <p>Nous vous confirmons la réception de votre demande de réservation. Voici un récapitulatif :</p>

        <ul style="list-style: none; padding-left: 0;">
          <li><strong>🗓️ Date :</strong> ${formattedDate}</li>
          <li><strong>📋 Formule :</strong> ${data.formule}</li>
          <li><strong>👨‍👩‍👧‍👦 Adultes :</strong> ${data.adultsCount}</li>
          <li><strong>🧒 Enfants :</strong> ${data.childrenCount}</li>
          <li><strong>🧩 Infos supplémentaires :</strong> ${extrasText}</li>
        </ul>

        ${
          imageUrl
            ? `<div style="margin-top: 20px;">
                 <p>📎 La carte d'anniversaire à télécharger :</p>
                 <a href="${imageUrl}" download style="display: inline-block; padding: 10px 15px; background-color: #4CAF50; color: white; border-radius: 5px; text-decoration: none;">Télécharger l'image</a>
               </div>`
            : ''
        }

        <p style="margin-top: 30px;">Merci pour votre confiance,<br>L’équipe Noliparc.</p>
      </div>
    `;

    // ✉️ Envoi de l'email HTML
    await sendEmail({
      to: userEmail,
      subject,
      html,
    });

    return NextResponse.json({
      message: 'Réservation enregistrée et email envoyé avec succès',
      data: reservation,
    });
  } catch (error) {
    console.error('Erreur POST /api/reservation :', error);
    return NextResponse.json(
      { message: 'Erreur lors de l\'enregistrement de la réservation' },
      { status: 500 }
    );
  }
}
