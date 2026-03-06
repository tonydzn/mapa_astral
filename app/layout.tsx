import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Mapa Astral — Seu Autoconhecimento através dos Astros",
  description: "Descubra seu mapa natal, sinastria amorosa e previsões personalizadas. Astrologia moderna e acessível.",
  keywords: "mapa astral, astrologia, mapa natal, sinastria, horóscopo",
  openGraph: {
    title: "Mapa Astral — Sabedoria Cósmica",
    description: "Mapa natal, sinastria e previsões personalizadas.",
    type: "website",
  },
};

import Footer from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        {children}
        <Footer />
      </body>
    </html>
  );
}
