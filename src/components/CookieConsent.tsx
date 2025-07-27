"use client";

import dynamic from 'next/dynamic';

// Chargement dynamique du composant de bannière avec désactivation du SSR
const CookieBanner = dynamic(
  () => import('./CookieBanner'),
  { ssr: false }
);

export default function CookieConsent() {
  return <CookieBanner />;
}
