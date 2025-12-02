import { NextRequest, NextResponse } from 'next/server';
import { listDays } from '@/lib/advent';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = Number(searchParams.get('year') || new Date().getFullYear());
  const month = Number(searchParams.get('month') || 12);
  const items = await listDays(year, month);
  return NextResponse.json({ items }, { headers: { 'Cache-Control': 'public, max-age=10, s-maxage=10' } });
}

