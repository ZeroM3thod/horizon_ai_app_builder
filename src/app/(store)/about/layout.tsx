import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Khati Family's journey to bring pure, authentic spices from certified farms to your kitchen. Meet our team dedicated to quality and purity.",
  openGraph: {
    title: "About Khati Family - Our Story & Mission",
    description: "Discover how Khati Family sources the finest spices directly from certified farms across India, Bangladesh, and Sri Lanka.",
    url: "/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
