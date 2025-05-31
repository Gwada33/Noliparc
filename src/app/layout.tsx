import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "@/css/globals.css";
import Navbar from "../components/Navbar"
import { AuthProvider } from "./context/AuthContext";
const RubikSANS = Rubik({
  variable: "--font-rubik-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Noliparc - Accueil",
  description: "Le plus grand parc de trampolines indoor de Guadeloupe",

  // SEO
  keywords: ["Noliparc", "trampoline", "Guadeloupe", "loisirs", "indoor"],
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
      <head>
         <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap" />
  <link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet" />
      </head>
      <body className={`${RubikSANS.variable} body-main `}>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
