import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { listAvailability } from '@/lib/calendar';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = searchParams.get('year');
  const month = searchParams.get('month');
  const data = await listAvailability({ year: year ? Number(year) : undefined, month: month ? Number(month) : undefined });
  return NextResponse.json({ items: data }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
