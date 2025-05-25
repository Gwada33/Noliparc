// src/app/api/mail/route.ts
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/sendMail';

export async function POST(req: Request) {
  try {
    const { to, subject, text } = await req.json();
    await sendEmail({ to, subject, text });

    return NextResponse.json({ success: true, message: 'Email envoyé avec succès' });
  } catch (error: any) {
    console.error('Erreur lors de l\'envoi de l\'email :', error);
    return NextResponse.json({ success: false, message: error.message || 'Erreur serveur' }, { status: 500 });
  }
}
