// src/app/api/mail/route.ts

export const runtime = 'nodejs'; // 👈 Empêche d'être traité comme Edge Function

import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/sendMail';

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
