// pages/api/my-reservations.ts
import { NextResponse } from 'next/server';
import client from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('uid');

  if (!userId) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }

  try {
    const { rows } = await client.query(
      `SELECT id, date, formule, status, created_at
       FROM reservations
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId],
    );
    return NextResponse.json({ reservations: rows });
  } catch (err) {
    console.error('GET /api/my-reservations', err);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
