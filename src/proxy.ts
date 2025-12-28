import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_CONFIG } from '@/lib/constants';
import { get_config } from '@/lib/config';

function isProtectedPath(pathname: string): boolean {
  const protectedPaths = ['/admin', '/anniversaires/reserver'];
  return protectedPaths.some((path) => pathname.startsWith(path));
}

function isValidToken(token: string | undefined): boolean {
  if (!token) return false;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const header = JSON.parse(atob(parts[0]));
    if (header.alg !== 'HS256') return false;

    const payload = JSON.parse(atob(parts[1]));
    if (!payload.sub || !payload.exp) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp <= currentTime) return false;

    return true;
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    return false;
  }
}

function createLoginRedirect(req: NextRequest, pathname: string): NextResponse {
  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('next', pathname);
  return NextResponse.redirect(loginUrl);
}

function isPublicAssetPath(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/uploads')
  );
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Maintenance mode (bloquant)
  try {
    const cfg = await get_config();
    if (cfg?.maintenanceMode === true) {
      // Always allow admin + admin APIs
      if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
        // continue
      } else if (pathname === '/maintenance' || isPublicAssetPath(pathname)) {
        return NextResponse.next();
      } else if (pathname.startsWith('/api')) {
        return NextResponse.json({ error: 'Maintenance' }, { status: 503 });
      } else {
        return NextResponse.rewrite(new URL('/maintenance', req.url));
      }
    }
  } catch {
    // If config can't be read, don't block traffic.
  }

  if (!isProtectedPath(pathname)) return NextResponse.next();

  const token = req.cookies.get('accessToken')?.value;

  if (!token || !isValidToken(token)) {
    return createLoginRedirect(req, pathname);
  }

  if (pathname.startsWith('/admin')) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    } catch (e) {
      return createLoginRedirect(req, pathname);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};
