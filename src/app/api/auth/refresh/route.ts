import { NextRequest, NextResponse } from 'next/server';
import  client  from '@/lib/db';
import { verifyToken, signAccessToken, signRefreshToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get('refreshToken')?.value;
  if (!cookie) return NextResponse.json({}, { status: 401 });

  let payload: any;
  try { payload = verifyToken(cookie); }
  catch { return NextResponse.json({}, { status: 401 }); }

  // valider en base
  const { rows } = await client.query(
    `SELECT * FROM refresh_tokens WHERE token=$1 AND expires_at>now()`,
    [cookie]
  );
  if (!rows.length) return NextResponse.json({}, { status: 401 });

  const newAccess  = signAccessToken({ sub: payload.sub, email: payload.email });
  const newRefresh = signRefreshToken({ sub: payload.sub });
  const newExpiry  = new Date(Date.now() + 30*24*60*60*1000);

  // remplacer le token
  await client.query(`DELETE FROM refresh_tokens WHERE token=$1`, [cookie]);
  await client.query(
    `INSERT INTO refresh_tokens(user_id,token,expires_at)
     VALUES($1,$2,$3)`,
    [payload.sub, newRefresh, newExpiry]
  );

  const res = NextResponse.json({ accessToken: newAccess });
  res.cookies.set('refreshToken', newRefresh, {
    httpOnly: true, path: '/', maxAge: 30*24*60*60
  });
  return res;
}
