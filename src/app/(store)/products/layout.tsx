import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse our complete collection of authentic spices, premium dry foods, dals, pulses, and masalas. BSTI certified, lab-tested for purity, 100% natural.",
  openGraph: {
    title: "Shop All Products - Khati Family",
    description: "Explore premium spices, masalas, dry fruits, and pulses. All products lab-tested for purity and sourced from certified farms.",
    url: "/products",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
