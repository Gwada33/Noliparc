import { NextResponse } from 'next/server';
import { client } from '@/lib/db';
import { checkAdmin } from '@/lib/auth-admin';
import { logActivity } from '@/lib/logger';

export async function GET(request: Request) {
  const admin = await checkAdmin();
  if (!admin) return new NextResponse('Unauthorized', { status: 401 });

  try {
    const result = await client.query(`SELECT * FROM availability ORDER BY date ASC`);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await checkAdmin();
  if (!admin) return new NextResponse('Unauthorized', { status: 401 });

  try {
    const { date, reason } = await request.json();
    if (!date) return NextResponse.json({ error: 'Date required' }, { status: 400 });

    await client.query(
      `INSERT INTO availability (date, is_blocked, reason) VALUES ($1, true, $2)
       ON CONFLICT (date) DO UPDATE SET is_blocked = true, reason = EXCLUDED.reason`,
      [date, reason || 'Fermé']
    );

    await logActivity(parseInt(admin.sub), 'block_date', { date, reason });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error blocking date:', error);
    return NextResponse.json({ error: 'Failed to block date' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const admin = await checkAdmin();
  if (!admin) return new NextResponse('Unauthorized', { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    if (!date) return NextResponse.json({ error: 'Date required' }, { status: 400 });

    await client.query(`DELETE FROM availability WHERE date = $1`, [date]);
    await logActivity(parseInt(admin.sub), 'unblock_date', { date });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unblocking date:', error);
    return NextResponse.json({ error: 'Failed to unblock date' }, { status: 500 });
  }
}
