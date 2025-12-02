import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { deleteEvent, getEvent, updateEvent } from '@/lib/calendar';
import { AUTH_CONFIG } from '@/lib/constants';

const UpdateEventSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  allDay: z.boolean().optional(),
  type: z.enum(['event', 'availability', 'note']).optional(),
});

export async function GET(_req: NextRequest, { params }: any) {
  const item = await getEvent(params.id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item, {
    headers: { 'Cache-Control': 'public, max-age=10, s-maxage=10' },
  });
}

export async function PATCH(req: NextRequest, { params }: any) {
  try {
    const token = req.cookies.get(AUTH_CONFIG.ACCESS_TOKEN_COOKIE)?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const parsed = UpdateEventSchema.parse(body);
    const item = await updateEvent(params.id, parsed);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(item);
  } catch (err: any) {
    return NextResponse.json({ error: 'Invalid payload', details: String(err.message || err) }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: any) {
  const token = _req.cookies.get(AUTH_CONFIG.ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const ok = await deleteEvent(params.id);
  return NextResponse.json({ deleted: ok });
}
