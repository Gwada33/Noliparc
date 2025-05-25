 // lib/sendMail.ts
import nodemailer from 'nodemailer';

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: EmailPayload): Promise<void> {
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
