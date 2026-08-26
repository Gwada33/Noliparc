import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Calendrier et horaires",
  description:
    "Consultez les horaires d'ouverture, jours fermés et événements spéciaux de Noliparc et Nolijump en Guadeloupe.",
  alternates: { canonical: "https://noliparc.fr/calendrier" },
};

export default function CalendrierLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
