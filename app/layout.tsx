import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://mapa-astral.net"),
  title: "Mapa Astral — Seu Autoconhecimento através dos Astros",
  description: "Descubra seu mapa natal, sinastria amorosa e previsões personalizadas. Astrologia moderna e acessível.",
  keywords: "mapa astral, astrologia, mapa natal, sinastria, horóscopo, autoconhecimento, signos",
  alternates: {
    canonical: "https://mapa-astral.net",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Mapa Astral — Sabedoria Cósmica",
    description: "Mapa natal, sinastria e previsões personalizadas através da astrologia moderna.",
    url: "https://mapa-astral.net",
    siteName: "Mapa Astral",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/images/og-main.png",
        width: 1200,
        height: 630,
        alt: "Mapa Astral — Seu Autoconhecimento",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mapa Astral — Seu Autoconhecimento através dos Astros",
    description: "Descubra seu mapa natal, sinastria amorosa e previsões personalizadas.",
    images: ["/images/og-main.png"],
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
