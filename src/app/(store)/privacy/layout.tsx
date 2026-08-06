import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Khati Family's privacy policy. Learn how we collect, use, and protect your personal information in accordance with Bangladeshi data protection standards.",
  openGraph: {
    title: "Privacy Policy - Khati Family",
    description: "How Khati Family protects your privacy and handles your personal information.",
    url: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
