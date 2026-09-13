import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "@/css/globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "./context/AuthContext";
import CookieConsent from "@/components/CookieConsent";
import GlobalStatus from "@/components/GlobalStatus";
import Providers from "./Providers";
import ScrollReveal from "@/components/ScrollReveal";

// Configuration de la police Rubik
const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "swap",
});

export const viewport = {
  themeColor: "#DB7C26",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://noliparc.fr"),
  title: {
    default: "Noliparc - Parc de loisirs indoor en Guadeloupe",
    template: "%s | Noliparc",
  },
  description: "Le plus grand parc de trampolines et de jeux indoor de Guadeloupe : Nolijump, quads enfants, anniversaires et snack à Sainte-Rose.",

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
    title: "Noliparc - Parc de loisirs indoor en Guadeloupe",
    description: "Le plus grand parc de trampolines et de jeux indoor de Guadeloupe : Nolijump, quads enfants, anniversaires et snack à Sainte-Rose.",
    url: "https://noliparc.fr",
    siteName: "Noliparc",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/images/image-noliparc.png",
        width: 1000,
        height: 1050,
        alt: "Noliparc - parc de loisirs indoor en Guadeloupe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Noliparc - Parc de loisirs indoor en Guadeloupe",
    description: "Le plus grand parc de trampolines et de jeux indoor de Guadeloupe.",
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
    <html lang="fr" className={rubik.variable}>
     {/* <head>
        <link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
      </head> */}
      <body className="font-sans">
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js');",
          }}
        />
        <link rel="preconnect" href="https://ia600709.us.archive.org" />
        <link rel="preconnect" href="https://tile.openstreetmap.org" />
        <link rel="preconnect" href="https://server.arcgisonline.com" />
        <link rel="preconnect" href="https://ewyyikh0ws.ufs.sh" />
        <link rel="preconnect" href="https://maps.google.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AmusementPark",
              name: "Noliparc",
              description:
                "Le plus grand parc de trampolines et de jeux indoor de Guadeloupe : Nolijump, quads enfants, anniversaires et snack.",
              url: "https://noliparc.fr",
              telephone: "+590 590 85 86 20",
              email: "contact@noliparc.fr",
              address: {
                "@type": "PostalAddress",
                streetAddress: "10 ZAC de Nolivier",
                addressLocality: "Sainte-Rose",
                postalCode: "97115",
                addressCountry: "GP",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 16.295293,
                longitude: -61.667341,
              },
              image: "https://noliparc.fr/images/image-noliparc.png",
              priceRange: "€€",
            }),
          }}
        />
        <Providers>
        <ScrollReveal />
        <AuthProvider>
          <Toaster />
        <GlobalStatus />
          {/* <GlobalBanner /> */}
          <Navbar />
          {/* <InfoPopup images={["/images/flyers/party.jpeg"]} width={720} height={720} cookieKey="global_flyer_pyjama" maxAgeSeconds={60 * 60 * 24 * 7} showAll /> */}
          {children}
          <CookieConsent />
          {/*<InfoPopup maxAgeSeconds={60 * 60 * 24 * 7} />*/}
        </AuthProvider>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
