import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Shuddhota Co. — Pure Spices & Premium Dry Foods",
  description:
    "Shuddhota Co. brings you authentic masalas and premium dry foods — sourced directly from certified farms, lab-tested for purity, and delivered fresh to your kitchen.",
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