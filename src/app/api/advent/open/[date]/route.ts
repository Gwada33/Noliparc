import { NextRequest, NextResponse } from 'next/server';
import { openDay } from '@/lib/advent';
import { AUTH_CONFIG } from '@/lib/constants';

export async function POST(req: NextRequest, { params }: { params: { date: string } }) {
  const token = req.cookies.get(AUTH_CONFIG.ACCESS_TOKEN_COOKIE)?.value;
  const actor = token ? 'admin' : 'guest';
  const saved = await openDay(params.date, actor);
  return NextResponse.json(saved);
}

