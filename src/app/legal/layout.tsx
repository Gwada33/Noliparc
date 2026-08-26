import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Mentions légales & CGU",
  description:
    "Mentions légales, conditions générales d'utilisation et politique de confidentialité du site Noliparc.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://noliparc.fr/legal" },
};

export default function LegalLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
