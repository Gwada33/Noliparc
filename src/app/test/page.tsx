"use client"

// pages/test-email.tsx
import { useState } from 'react';
import { sendEmail } from '@/lib/sendMail';

export default function TestEmailPage() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Envoi en cours...');

    try {
      const message = await sendEmail({ to, subject, text });
      setStatus('✅ ' + message);
    } catch (err: any) {
      setStatus('❌ Erreur : ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
      <h1>Test d’envoi d’email</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="email"
          placeholder="Adresse e-mail du destinataire"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Sujet"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <textarea
          placeholder="Contenu du message"
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button type="submit">Envoyer l’e-mail</button>
      </form>
      {status && <p style={{ marginTop: 20 }}>{status}</p>}
    </div>
  );
}
