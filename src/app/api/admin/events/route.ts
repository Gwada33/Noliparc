export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { checkAdmin } from '@/utils/check-admin';
import { client } from '@/lib/db';

export async function GET(req: NextRequest) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    const offset = (page - 1) * limit;

    const whereClauses: string[] = [];
    const params: any[] = [];

    if (status) { whereClauses.push(`status = $${params.length + 1}`); params.push(status); }
    if (category) { whereClauses.push(`category = $${params.length + 1}`); params.push(category); }
    if (year && month) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1).toISOString();
      const endDate = new Date(parseInt(year), parseInt(month), 0).toISOString();
      whereClauses.push(`date >= $${params.length + 1}`); params.push(startDate);
      whereClauses.push(`date <= $${params.length + 1}`); params.push(endDate);
    }

    const where = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countRes = await client.query(`SELECT COUNT(*) AS total FROM events ${where}`, params);
    const total = parseInt(countRes.rows[0]?.total || '0', 10);

    const dataRes = await client.query(
      `SELECT id, title, description, date, time, location, image, capacity, price, category, status, visibility
       FROM events ${where}
       ORDER BY date DESC, time ASC NULLS LAST
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    return NextResponse.json({
      data: dataRes.rows,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: "Erreur lors de la récupération des événements" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, description, date, time, location, image, capacity, price, category, status, visibility } = body;

    if (!title || !description || !date || !location) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const result = await client.query(
      `INSERT INTO events (title, description, date, time, location, image, capacity, price, category, status, visibility)
       VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 0), COALESCE($8, 0), $9, COALESCE($10, 'upcoming'), COALESCE($11, 'active'))
       RETURNING id, title, description, date, time, location, image, capacity, price, category, status, visibility`,
      [title, description, date, time ?? null, location, image ?? null, capacity ?? null, price ?? null, category ?? null, status ?? null, visibility ?? null]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (e) {
    console.error('Error creating event:', e);
    return NextResponse.json({ error: "Erreur lors de la création de l'événement" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: "ID d'événement manquant" }, { status: 400 });
    }

    const body = await req.json();
    const fields = ['title','description','date','time','location','image','capacity','price','category','status','visibility'] as const;
    const setClauses: string[] = [];
    const params: any[] = [];
    for (const f of fields) {
      if (body[f] !== undefined) {
        setClauses.push(`${f} = $${params.length + 1}`);
        params.push(body[f]);
      }
    }
    if (setClauses.length === 0) {
      return NextResponse.json({ error: "Aucun champ à mettre à jour" }, { status: 400 });
    }
    params.push(id);

    const result = await client.query(
      `UPDATE events SET ${setClauses.join(', ')} WHERE id = $${params.length} RETURNING id, title, description, date, time, location, image, capacity, price, category, status, visibility`,
      params
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Événement introuvable" }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (e) {
    console.error('Error updating event:', e);
    return NextResponse.json({ error: "Erreur lors de la mise à jour de l'événement" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: "ID d'événement manquant" }, { status: 400 });
    }

    const result = await client.query(`DELETE FROM events WHERE id = $1 RETURNING id`, [id]);
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Événement introuvable" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error('Error deleting event:', e);
    return NextResponse.json({ error: "Erreur lors de la suppression de l'événement" }, { status: 500 });
  }
}
