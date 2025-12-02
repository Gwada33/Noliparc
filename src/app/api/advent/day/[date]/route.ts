import { NextRequest, NextResponse } from 'next/server';
import { AdventDaySchema, getDay, setDay } from '@/lib/advent';
import { AUTH_CONFIG } from '@/lib/constants';

export async function GET(_req: NextRequest, { params }: { params: { date: string } }) {
  const item = await getDay(params.date);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item, { headers: { 'Cache-Control': 'public, max-age=10, s-maxage=10' } });
}

export async function PUT(req: NextRequest, { params }: { params: { date: string } }) {
  const token = req.cookies.get(AUTH_CONFIG.ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const parsed = AdventDaySchema.parse(body);
    const saved = await setDay(params.date, parsed, 'admin');
    return NextResponse.json(saved);
  } catch (err: any) {
    return NextResponse.json({ error: 'Invalid payload', details: String(err.message || err) }, { status: 400 });
  }
}

