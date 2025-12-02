export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '6', 10);
    const category = searchParams.get('category');
    const status = searchParams.get('status') || '';
    const visibility = searchParams.get('visibility') || '';

    const whereClauses: string[] = [];
    const params: any[] = [];

    if (category) { whereClauses.push(`category = $${params.length + 1}`); params.push(category); }
    if (status) { whereClauses.push(`LOWER(status) = LOWER($${params.length + 1})`); params.push(status); }
    if (visibility) { whereClauses.push(`LOWER(visibility) = LOWER($${params.length + 1})`); params.push(visibility); }
    whereClauses.push(`date >= CURRENT_DATE`);

    const where = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countRes = await client.query(`SELECT COUNT(*) AS total FROM events ${where}`, params);
    let total = parseInt(countRes.rows[0]?.total || '0', 10);

    let dataRes = await client.query(
      `SELECT id, title, description, date, time, location, image, capacity, price, category
       FROM events ${where}
       ORDER BY date ASC, time ASC NULLS LAST
       LIMIT $${params.length + 1}`,
      [...params, limit]
    );

    console.log('[api/events] query', { limit, category, status, visibility, futureCount: total, returned: dataRes.rows.length });

    if (total === 0 || dataRes.rows.length === 0) {
      const fallbackParams: any[] = [];
      const fallbackWhereClauses: string[] = [];
      if (category) { fallbackWhereClauses.push(`category = $${fallbackParams.length + 1}`); fallbackParams.push(category); }
      if (visibility) { fallbackWhereClauses.push(`LOWER(visibility) = LOWER($${fallbackParams.length + 1})`); fallbackParams.push(visibility); }
      const fallbackWhere = fallbackWhereClauses.length ? `WHERE ${fallbackWhereClauses.join(' AND ')}` : '';
      const fbCount = await client.query(`SELECT COUNT(*) AS total FROM events ${fallbackWhere}`, fallbackParams);
      total = parseInt(fbCount.rows[0]?.total || '0', 10);
      dataRes = await client.query(
        `SELECT id, title, description, date, time, location, image, capacity, price, category
         FROM events ${fallbackWhere}
         ORDER BY date DESC, time DESC NULLS LAST
         LIMIT $${fallbackParams.length + 1}`,
        [...fallbackParams, limit]
      );
      console.log('[api/events] fallback', { total, returned: dataRes.rows.length });
    }

    return NextResponse.json({ items: dataRes.rows, total }, {
      headers: { 'Cache-Control': 'public, max-age=10, s-maxage=10' }
    });
  } catch (error) {
    console.error('Error fetching public events:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des événements' }, { status: 500 });
  }
}
