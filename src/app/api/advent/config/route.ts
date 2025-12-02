import { NextRequest, NextResponse } from 'next/server';
import { getConfig, setButtonLabel } from '@/lib/advent';
import { AUTH_CONFIG } from '@/lib/constants';

export async function GET() {
  const config = await getConfig();
  return NextResponse.json(config, { headers: { 'Cache-Control': 'public, max-age=10, s-maxage=10' } });
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get(AUTH_CONFIG.ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { buttonLabel } = await req.json();
  const saved = await setButtonLabel(String(buttonLabel || ''), 'admin');
  return NextResponse.json(saved);
}

