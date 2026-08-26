import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Espace de jeux en images",
  description:
    "Découvrez en images les structures de jeux, toboggans et piscines à balles de Noliparc, le parc indoor de Guadeloupe.",
  alternates: { canonical: "https://noliparc.fr/preview" },
};

export default function PreviewLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
