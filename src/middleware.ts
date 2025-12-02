// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_CONFIG } from '@/lib/constants';

// Vérifie si une route est protégée
function isProtectedPath(pathname: string): boolean {
  const protectedPaths = ['/admin', '/anniversaires/reserver'];
  return protectedPaths.some((path) => pathname.startsWith(path));
}

// Vérifie la validité du token JWT
function isValidToken(token: string | undefined): boolean {
  if (!token) return false;

  try {
    // Vérification simple du format du token
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Vérification du header
    const header = JSON.parse(atob(parts[0]));
    if (header.alg !== 'HS256') return false;

    // Vérification du payload
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.sub || !payload.exp) return false;

    // Vérification de l'expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp <= currentTime) return false;

    return true;
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    return false;
  }
}

// Crée l'URL de redirection vers la page de login
function createLoginRedirect(req: NextRequest, pathname: string): NextResponse {
  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('next', pathname);
  return NextResponse.redirect(loginUrl);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Si la route n'est pas protégée, continuer
  if (!isProtectedPath(pathname)) return NextResponse.next();

  // Récupérer et vérifier le token
  const token = req.cookies.get('accessToken')?.value;
  
  // Si pas de token ou token invalide, rediriger vers login
  if (!token || !isValidToken(token)) {
    return createLoginRedirect(req, pathname);
  }

  // Vérification du rôle admin pour les routes /admin
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

  // Token valide, continuer
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/anniversaires/reserver/:path*'],
};
