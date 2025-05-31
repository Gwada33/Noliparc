import { ReactNode } from 'react';

export const metadata = {
  title: 'Anniversaires - Fêtez chez Noliparc',
  description: 'Organisez une fête d’anniversaire inoubliable pour vos enfants à Noliparc, avec animations, salle dédiée et plus !',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
