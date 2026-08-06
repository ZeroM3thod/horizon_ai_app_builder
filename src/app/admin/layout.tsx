import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel · Khati Family",
};

/**
 * app/admin/layout.tsx
 *
 * All routes under /admin use this layout.
 * No Navbar, no Footer — just the raw children (which include AdminSidebar).
 * This layout inherits html/body from the root layout only.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}