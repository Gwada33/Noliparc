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
  
  description: "Le plus grand de trampolines indoor de Guadeloupe",
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
