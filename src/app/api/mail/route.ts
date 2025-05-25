// src/app/api/mail/route.ts

export const runtime = 'nodejs'; // 👈 Empêche d'être traité comme Edge Function

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json();
    await sendEmail({ to, subject, html });

    return NextResponse.json({ success: true, message: 'Email envoyé avec succès' });
  } catch (error: any) {
    console.error('Erreur lors de l\'envoi de l\'email :', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
