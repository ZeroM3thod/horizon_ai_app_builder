import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Khati Family — Pure Spices & Premium Dry Foods",
    template: "%s | Khati Family"
  },
  description:
    "Khati Family brings you authentic masalas and premium dry foods — sourced directly from certified farms, lab-tested for purity, and delivered fresh to your kitchen.",
  keywords: [
    "spices Bangladesh",
    "premium dry foods",
    "authentic masalas",
    "BSTI certified spices",
    "lab tested spices",
    "organic spices",
    "garam masala",
    "turmeric powder",
    "whole spices",
    "spice shop online Bangladesh"
  ],
  authors: [{ name: "Khati Family" }],
  creator: "Khati Family",
  publisher: "Khati Family",
  metadataBase: new URL('https://www.khatifamily.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_BD',
    url: 'https://www.khatifamily.com',
    title: 'Khati Family — Pure Spices & Premium Dry Foods',
    description: 'Khati Family brings you authentic masalas and premium dry foods — sourced directly from certified farms, lab-tested for purity, and delivered fresh to your kitchen.',
    siteName: 'Khati Family',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Khati Family - Pure Spices & Premium Dry Foods',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Khati Family — Pure Spices & Premium Dry Foods',
    description: 'Authentic masalas and premium dry foods from certified farms',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

/**
 * Root layout — only sets up <html> / <head> / <body>.
 * Navbar & Footer live in (store)/layout.tsx so admin pages never see them.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`light ${plusJakartaSans.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#9f4122" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        {/* Material Symbols only — no Google Fonts for Plus Jakarta Sans
            (next/font self-hosts it via the variable above) */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="font-sans bg-background text-on-background antialiased overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container"
      >
        {children}
      </body>
    </html>
  );
}