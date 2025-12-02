import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAvailability, setAvailability } from '@/lib/calendar';
import { AUTH_CONFIG } from '@/lib/constants';

const PayloadSchema = z.object({
  open: z.boolean(),
  note: z.string().optional(),
});

export async function GET(_req: NextRequest, props: { params: Promise<{ date: string }> }) {
  const params = await props.params;
  const item = await getAvailability(params.date);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item, { headers: { 'Cache-Control': 'public, max-age=10, s-maxage=10' } });
}

export async function PUT(req: NextRequest, props: { params: Promise<{ date: string }> }) {
  try {
    const params = await props.params;
    const token = req.cookies.get(AUTH_CONFIG.ACCESS_TOKEN_COOKIE)?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const parsed = PayloadSchema.parse(body);
    const saved = await setAvailability(params.date, { date: params.date, open: parsed.open, note: parsed.note });
    return NextResponse.json(saved);
  } catch (err: any) {
    return NextResponse.json({ error: 'Invalid payload', details: String(err.message || err) }, { status: 400 });
  }
}
