import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "@/css/globals.css";
import Navbar from "../components/Navbar"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { AuthProvider } from "./context/AuthContext";
const RubikSANS = Rubik({
  variable: "--font-rubik-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Noliparc - Accueil",
  description: "Le plus grand parc de trampolines indoor de Guadeloupe",

  // SEO
keywords: [
  "Noliparc",
  "parc de loisirs",
  "trampoline",
  "quad",
  "quad enfant",
  "Guadeloupe",
  "activité enfants",
  "activité famille",
  "parc indoor",
  "loisirs Guadeloupe",
  "divertissement Guadeloupe",
  "Nolijump",
  "jeux pour enfants",
  "centre de loisirs",
  "saut trampoline",
  "plaine de jeux",
  "anniversaire enfants",
  "organisation anniversaire",
  "fêter un anniversaire",
  "parc couvert",
  "parc d'attractions Guadeloupe",
  "fun park",
  "aire de jeux intérieure",
  "activités en intérieur",
  "sortie en famille",
  "snack Guadeloupe",
  "snack enfants",
  "activités vacances Guadeloupe",
  "sauter trampoline",
  "espace de jeux Guadeloupe",
  "loisir indoor Guadeloupe",
  "Noliparc Guadeloupe",
  "anniversaire Guadeloupe",
  "attraction enfants Guadeloupe",
  "Noliparc trampoline park",
  "sortie week-end Guadeloupe",
  "lieu anniversaire Guadeloupe",
  "parc enfant Guadeloupe"
],
  authors: [{ name: "Noliparc", url: "https://noliparc.fr" }],
  creator: "Noliparc Team",

  // Open Graph (réseaux sociaux)
  openGraph: {
    title: "Noliparc - Accueil",
    description: "Le plus grand parc indoor de Guadeloupe",
    url: "https://noliparc.fr",
    siteName: "Noliparc",
    locale: "fr_FR",
    type: "website",
  },
  // Icones
  icons: {
    icon: "/icons/favicon.ico",
    shortcut: "/icons/favicon-32x32.png",
    apple: "/icons/apple-touch-icon.png",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },


  // Alternates (pour i18n ou mobile)
  alternates: {
    canonical: "https://noliparc.fr",
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="fr">
      <body className={`${RubikSANS.variable} body-main `}>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
          <Analytics />
      <SpeedInsights />
      </body>
    </html>
  );
}
