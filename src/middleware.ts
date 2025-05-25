// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Liste des routes protégées
  const protectedPaths = ['/admin', '/anniversaires/reserver'];

  // Vérifier si la requête cible un des chemins protégés
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected) {
    // Récupérer le token dans les cookies
    const token = req.cookies.get('accessToken')?.value;

    if (!token) {
      // Rediriger vers login avec retour après connexion
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/anniversaires/reserver/:path*'],
};
