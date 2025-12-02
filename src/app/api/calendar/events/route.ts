import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { addEvent, listEvents } from '@/lib/calendar';
import { AUTH_CONFIG } from '@/lib/constants';

const CreateEventSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  start: z.string(),
  end: z.string().optional(),
  allDay: z.boolean().optional(),
  type: z.enum(['event', 'availability', 'note']).optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from') || undefined;
  const to = searchParams.get('to') || undefined;
  const page = Number(searchParams.get('page') || '1');
  const pageSize = Number(searchParams.get('pageSize') || '20');

  const data = await listEvents({ from, to, page, pageSize });
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=10, s-maxage=10',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_CONFIG.ACCESS_TOKEN_COOKIE)?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const parsed = CreateEventSchema.parse(body);
    const item = await addEvent({ id: uuid(), ...parsed, allDay: parsed.allDay ?? false, type: parsed.type ?? 'event' });
    return NextResponse.json(item, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Invalid payload', details: String(err.message || err) }, { status: 400 });
  }
}
