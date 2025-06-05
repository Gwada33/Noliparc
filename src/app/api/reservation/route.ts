// src/app/api/reservation/route.ts

export const runtime = 'nodejs'; // nécessaire pour Nodemailer sur Vercel

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { client } from '@/lib/db';
import { formules } from '@/lib/formules'; // ajustez le chemin si besoin

type ReservationPayload = {
  userId: string;
  date: string;               // ou Date, selon ta préférence
  formule: string;
  childrenName: string;
  childAge: number;           // âge de l’enfant
  timeSlot: string[] | string;
  childrenCount: number;
  adultsCount: number;
  cake: string;               // type/gâteau
  extras: string[] | string;  // chaîne ou tableau
};

function generateId() {
  return 'resv_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

// Si jamais une formule ne figure pas dans formules[], on découpe sur tirets et underscore
function formatText(input: string): string {
  return input
    .split(/[-_]/g)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Cherche dans formules[] le label correspondant à value, sinon fallback à formatText
function formatFormule(value: string): string {
  const found = formules.find(f => f.value === value);
  return found ? found.label : formatText(value);
}

// Pour les gâteaux, on peut définir un mapping dédié
function formatCake(cake: string): string {
  const map: Record<string, string> = {
    gateau_chocolat: 'Gâteau au chocolat',
    gateau_yaourt: 'Gâteau au yaourt',
    gateau_vanille: 'Gâteau à la vanille',
    fraisier: 'Fraisier',
    gateau_personnalise: 'Gâteau personnalisé',
  };
  return map[cake] || formatText(cake);
}

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

async function sendEmail({ to, subject, html }: EmailPayload): Promise<void> {
  if (!to || !subject || !html) {
    throw new Error("Champs manquants pour l'envoi de mail");
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

    // Conversion et formatage de la date pour l'e-mail
    const date = new Date(data.date);
    const formattedDate = date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    // Si extras vient sous forme de chaîne, on transforme en tableau
    if (typeof data.extras === 'string') {
      data.extras = data.extras
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean);
    }
    const extrasText =
      Array.isArray(data.extras) && data.extras.length > 0
        ? data.extras.join(', ')
        : 'Aucun';

    if (!data.userId) {
      return NextResponse.json({ message: 'userId manquant' }, { status: 400 });
    }

    // 🔍 Récupération de l'e-mail et des infos du client
    const userQuery = `
      SELECT email, first_name, last_name, phone
      FROM users
      WHERE id = $1
      LIMIT 1;
    `;
    const userResult = await client.query(userQuery, [data.userId]);

    if (userResult.rows.length === 0) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }
    const { email: userEmail, first_name, last_name, phone } = userResult.rows[0];

    // 🛠 Insertion en base (avec child_age et cake)
    const id = generateId();
    const createdAt = new Date().toISOString();
    const status = 'pending';

    const insertQuery = `
      INSERT INTO reservations
        (
          id,
          user_id,
          date,
          formule,
          children_name,
          age,
          children_count,
          adults_count,
          gateau,
          extras,
          status,
          created_at,
          creneau
        )
      VALUES
        (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11, $12, $13
        )
      RETURNING *;
    `;

    const insertValues = [
      id,
      data.userId,
      data.date,
      data.formule,
      data.childrenName,
      data.childAge,
      data.childrenCount,
      data.adultsCount,
      data.cake,
      JSON.stringify(data.extras),
      status,
      createdAt,
      data.timeSlot,
    ];

    const { rows } = await client.query(insertQuery, insertValues);
    const reservation = rows[0];

    // 📨 Construction de l'e-mail HTML pour le client
    const subjectClient = 'Réception de votre demande';
    const logoUrl = 'https://i.imgur.com/ahQpl7N.png';
    const host = request.headers.get('host');
    const protocol = host?.startsWith('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const htmlClient = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <div style="text-align: center;">
          <img src="${logoUrl}" alt="Noliparc Logo" style="max-height: 120px; margin-bottom: 20px;" />
        </div>
        <h2 style="color: #4CAF50;">
          🎉 Votre demande a été reçue et est <strong style="color:rgb(145, 192, 4)">en cours de traitement ‼️</strong>
        </h2>
        <p>Bonjour ${first_name} ${last_name},</p>
        <p>
          Nous vous confirmons la réception de votre demande pour l'anniversaire de <strong>${data.childrenName}</strong>, 
          qui aura <strong>${data.childAge} an${data.childAge > 1 ? 's' : ''}</strong> le <strong>${formattedDate}</strong>. Voici un récapitulatif :
        </p>
        <ul style="list-style: none; padding-left: 0;">
          <li><strong>🗓️ Date :</strong> ${formattedDate}</li>
          <li><strong>⌚️ Heure :</strong> ${data.timeSlot}</li>
          <li><strong>📋 Formule :</strong> ${formatFormule(data.formule)}</li>
          <li><strong>🎂 Gâteau :</strong> ${formatCake(data.cake)}</li>
          <li><strong>👨‍👩‍👧‍👦 Adultes :</strong> ${data.adultsCount}</li>
          <li><strong>🧒 Enfants :</strong> ${data.childrenCount}</li>
          <li><strong>🧩 Infos supplémentaires :</strong> ${extrasText}</li>
        </ul>
        <p style="margin-top: 30px;">
          Nous reviendrons très vite vers vous.<br />
          Merci pour votre confiance,<br />
          L’équipe Noliparc.
        </p>
      </div>
    `;

    await sendEmail({
      to: userEmail,
      subject: subjectClient,
      html: htmlClient,
    });

    // 📨 Construction de l’e-mail HTML interne
    const subjectIntern = `[DEMANDE-NOLIPARC] Nouvelle demande - ${formattedDate}`;
    const htmlIntern = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;">

        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #2E7D32;">Nouvelle demande Noliparc</h2>
          <p style="margin: 4px 0 0; color: #555;">${formattedDate}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #E8F5E9;">
            <th style="text-align: left; padding: 8px; border: 1px solid #ccc; width: 35%;">Champ</th>
            <th style="text-align: left; padding: 8px; border: 1px solid #ccc;">Valeur</th>
          </tr>

          <tr>
            <td style="padding: 8px; border: 1px solid #ccc;">Nom du client</td>
            <td style="padding: 8px; border: 1px solid #ccc;">${first_name} ${last_name}</td>
          </tr>

          <tr style="background-color: #FAFAFA;">
            <td style="padding: 8px; border: 1px solid #ccc;">Téléphone</td>
            <td style="padding: 8px; border: 1px solid #ccc;">${phone}</td>
          </tr>

          <tr>
            <td style="padding: 8px; border: 1px solid #ccc;">Email client</td>
            <td style="padding: 8px; border: 1px solid #ccc;">${userEmail}</td>
          </tr>

          <tr style="background-color: #FAFAFA;">
            <td style="padding: 8px; border: 1px solid #ccc;">Enfant & âge J</td>
            <td style="padding: 8px; border: 1px solid #ccc;">
              ${data.childrenName} (&#x2b50; ${data.childAge} an${data.childAge > 1 ? 's' : ''})
            </td>
          </tr>

          <tr>
            <td style="padding: 8px; border: 1px solid #ccc;">Date & heure</td>
            <td style="padding: 8px; border: 1px solid #ccc;">
              ${formattedDate} à ${data.timeSlot}
            </td>
          </tr>

          <tr style="background-color: #FAFAFA;">
            <td style="padding: 8px; border: 1px solid #ccc;">Formule</td>
            <td style="padding: 8px; border: 1px solid #ccc;">${formatFormule(data.formule)}</td>
          </tr>

          <tr>
            <td style="padding: 8px; border: 1px solid #ccc;">Gâteau</td>
            <td style="padding: 8px; border: 1px solid #ccc;">${formatCake(data.cake)}</td>
          </tr>

          <tr style="background-color: #FAFAFA;">
            <td style="padding: 8px; border: 1px solid #ccc;">Nombre d'enfants</td>
            <td style="padding: 8px; border: 1px solid #ccc;">${data.childrenCount}</td>
          </tr>

          <tr>
            <td style="padding: 8px; border: 1px solid #ccc;">Nombre d'adultes</td>
            <td style="padding: 8px; border: 1px solid #ccc;">${data.adultsCount}</td>
          </tr>

          <tr style="background-color: #FAFAFA;">
            <td style="padding: 8px; border: 1px solid #ccc;">Extras</td>
            <td style="padding: 8px; border: 1px solid #ccc;">${extrasText}</td>
          </tr>
        </table>

        <div style="margin-top: 30px; text-align: center;">
          <p style="color: #555; font-size: 14px;">
            Vous pouvez consulter plus de détails dans l’admin Noliparc.
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to: 'magdala.galinat@noliparc.com',
      subject: subjectIntern,
      html: htmlIntern,
    });

    return NextResponse.json({
      message: 'Réservation enregistrée et e-mails envoyés.',
      data: reservation,
    });
  } catch (error) {
    console.error('Erreur POST /api/reservation :', error);
    return NextResponse.json(
      { message: "Erreur lors de l'enregistrement de la réservation" },
      { status: 500 }
    );
  }
}
