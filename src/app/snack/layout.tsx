import { ReactNode } from 'react';

export const metadata = {
  title: "Noliparc - Snack",
  description: 'Découvrez nos délicieuses offres pour tout les gouts',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}