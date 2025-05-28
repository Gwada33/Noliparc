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
    description: "Le plus grand parc de trampolines indoor de Guadeloupe",
    url: "https://noliparc.com",
    siteName: "Noliparc",
    images: [
      {
        url: "https://noliparc.fr/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vue du parc de trampolines",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Noliparc - Accueil",
    description: "Le plus grand parc de trampolines indoor de Guadeloupe",
    images: ["https://noliparc.com/og-image.jpg"],
    creator: "@noliparc",
  },

  // Icones
  icons: {
    icon: "/image/noli.png",
    shortcut: "/image/noli.png",
    apple: "/image/noli.png",
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
    canonical: "https://noliparc.cfr",
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
      </body>
    </html>
  );
}
