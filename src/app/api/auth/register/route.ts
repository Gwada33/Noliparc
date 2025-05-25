import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { client } from '@/lib/db'; // Assure-toi que c'est bien exporté comme ça dans db.ts

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName }: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email et mot de passe requis' }, { status: 400 });
    }

    // Vérifier si l'email existe déjà
    const { rows } = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (rows.length > 0) {
      return NextResponse.json({ message: 'Email déjà utilisé' }, { status: 400 });
    }

    // Hash du mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Insérer l'utilisateur
    const insert = await client.query(
      `INSERT INTO users(email, password, first_name, last_name)
       VALUES($1, $2, $3, $4)
       RETURNING id, email, first_name AS "firstName", last_name AS "lastName", created_at AS "createdAt";`,
      [email, passwordHash, firstName || null, lastName || null]
    );

    const user = insert.rows[0];
    return NextResponse.json({ message: 'Utilisateur créé', user }, { status: 201 });
  } catch (err) {
    console.error('POST /api/register error', err);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
