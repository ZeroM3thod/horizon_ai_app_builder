import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read Khati Family's terms and conditions. Learn about our policies on orders, payments, shipping, returns, and user responsibilities.",
  openGraph: {
    title: "Terms & Conditions - Khati Family",
    description: "Terms and conditions for shopping with Khati Family. Clear policies for a transparent shopping experience.",
    url: "/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
