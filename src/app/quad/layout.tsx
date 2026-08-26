import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Les Quads enfants",
  description:
    "Parcours quad sécurisé et encadré pour enfants à Noliparc, Sainte-Rose en Guadeloupe. Une expérience fun et inoubliable.",
  alternates: { canonical: "https://noliparc.fr/quad" },
};

export default function QuadLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
