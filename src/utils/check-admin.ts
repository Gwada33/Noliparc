
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { AUTH_CONFIG } from '@/lib/constants';

interface UserPayload {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

export async function checkAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_CONFIG.ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    return false;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify<UserPayload>(token, secret);
    return payload.role === 'admin';
  } catch (error) {
    console.error('Admin check failed:', error);
    return false;
  }
}
