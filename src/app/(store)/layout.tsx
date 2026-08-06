import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrganizationSchema from "@/components/OrganizationSchema";

/**
 * (store)/layout.tsx
 *
 * Route group layout for all user-facing pages.
 * The parentheses around "store" mean this folder is invisible in the URL —
 * so /app/(store)/page.tsx is still just "/", not "/store".
 *
 * Move all your existing user-facing pages INTO this (store) folder:
 *   app/(store)/page.tsx          → /
 *   app/(store)/products/...      → /products
 *   app/(store)/cart/...          → /cart
 *   etc.
 *
 * Admin pages stay at app/admin/... and never go through this layout,
 * so they never get Navbar or Footer.
 */
export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OrganizationSchema />
      <Navbar />
      <main className="max-w-[1728px] mx-auto w-full">{children}</main>
      <Footer />
    </>
  );
}