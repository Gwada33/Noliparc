import { ReactNode } from 'react';

export const metadata = {
  title: 'Nolijump - Trampolines',
  description: 'Découvrez notre espace Nolijump dédié aux enfants avec trampolines, jeux et parcours d’escalade en toute sécurité.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}