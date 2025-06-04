// src/app/api/reservation/route.ts

export const runtime = 'nodejs'; // 👈 nécessaire pour utiliser Nodemailer sans erreurs Vercel

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import {client} from '@/lib/db';


type ReservationPayload = {
  userId: string;
  date: string; // ou Date si tu préfères
  formule: string;
  childrenName: string;
  timeSlot: string[] | string;
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
  const userQuery = `SELECT email, first_name, last_name, phone FROM users WHERE id = $1 LIMIT 1;`;
const userResult = await client.query(userQuery, [data.userId]);

if (userResult.rows.length === 0) {
  return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
}

const { email: userEmail, first_name, last_name, phone } = userResult.rows[0];

    // 🛠 Insertion de la réservation
    const id = generateId();
    const createdAt = new Date().toISOString();
    const status = 'pending';

    const insertQuery = `
      INSERT INTO reservations
        (id, user_id, date, formule, children_name, children_count, adults_count, extras, status, created_at, creneau)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;

    const insertValues = [
      id,
      data.userId,
      data.date,
      data.formule,
      data.childrenName,
      data.childrenCount,
      data.adultsCount,
      JSON.stringify(data.extras),
      status,
      createdAt,
      data.timeSlot
    ];

    const { rows } = await client.query(insertQuery, insertValues);
    const reservation = rows[0];

    // 📨 Construction de l'email HTML
    const subject = 'Réception de votre demande';
    const logoUrl = 'https://i.imgur.com/ahQpl7N.png';
    const host = request.headers.get('host');
    const protocol = host?.startsWith('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <div style="text-align: center;">
          <img src="${logoUrl}" alt="Noliparc Logo" style="max-height: 120px; margin-bottom: 20px;" />
        </div>
        <h2 style="color: #4CAF50;">🎉 Votre demande a été recu et est <strong style="color:rgb(145, 192, 4)">en cours de traitement ‼️</strong></h2>
        <p>Bonjour ${first_name} ${last_name},</p>
        <p>Nous vous confirmons la réception de votre demande pour l'anniversaire de ${data.childrenName}. Voici un récapitulatif :</p>

        <ul style="list-style: none; padding-left: 0;">
          <li><strong>🗓️ Date :</strong> ${formattedDate}</li>
          <li><strong>⌚️ Heure :</strong> ${data.timeSlot}</li>
          <li><strong>📋 Formule :</strong> ${data.formule}</li>
          <li><strong>👨‍👩‍👧‍👦 Adultes :</strong> ${data.adultsCount}</li>
          <li><strong>🧒 Enfants :</strong> ${data.childrenCount}</li>
          <li><strong>🧩 Infos supplémentaires :</strong> ${extrasText}</li>
        </ul>

        <p style="margin-top: 30px;">Nous reviendrons très vite vers vous<br />Merci pour votre confiance,<br>L’équipe Noliparc.</p>
      </div>
    `;
    // ✉️ Envoi de l'email HTML
    await sendEmail({
      to: userEmail,
      subject,
      html,
    });

    await sendEmail({
  to: 'magdala.galinat@noliparc.com',
  subject: `[DEMANDE-NOLIPARC] Nouvelle demande - ${formattedDate}`,
  html: `
    <p>Nouvelle demande reçue :</p>
    <li><strong>Nom du client :</strong> ${first_name} ${last_name}</li>
    <li>C'est l'anniverssaire de ${data.childrenName} et se tro</li>
    <li><strong>Numéro de téléphone du client :</strong> ${phone}</li>
    <ul>
      <li><strong>Date :</strong> ${formattedDate}</li>
      <li><strong>Heure :</strong> ${data.timeSlot}</li>
      <li><strong>Formule :</strong> ${data.formule}</li>
      <li><strong>Enfants :</strong> ${data.childrenCount}</li>
      <li><strong>Adultes :</strong> ${data.adultsCount}</li>
      <li><strong>Extras :</strong> ${extrasText}</li>
      <li><strong>Email client :</strong> ${userEmail}</li>
    </ul>
  `,
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
