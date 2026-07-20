"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminSidebarProps {
  pendingRefunds?: number;
  pendingProducts?: number;
  pendingUsers?: number;
  pendingOrders?: number;
  pendingCoupons?: number;
  pendingReviews?: number;
}

export default function AdminSidebar({
  pendingRefunds = 4,
  pendingProducts = 48,
  pendingUsers = 1200,
  pendingOrders = 3,
  pendingCoupons = 10,
  pendingReviews = 14,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [miniMode, setMiniMode] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  /* Expose toggle functions globally so topbar buttons can call them */
  useEffect(() => {
    (window as any).__adminSidebarToggle = () => setSidebarOpen((v) => !v);
    (window as any).__adminMiniToggle = () => setMiniMode((v) => !v);
    return () => {
      delete (window as any).__adminSidebarToggle;
      delete (window as any).__adminMiniToggle;
    };
  }, []);

  /* Sync main content margin */
  useEffect(() => {
    const main = document.getElementById("main-content");
    if (!main) return;
    if (miniMode) {
      main.style.marginLeft = "72px";
    } else {
      main.style.marginLeft = "";
    }
  }, [miniMode]);

  const isActive = (href: string) => pathname === href;

  const navItemClass = (href: string) =>
    `nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[14px] text-on-surface cursor-pointer select-none${
      isActive(href) ? " active" : ""
    }`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .sidebar { transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1); }
        .sidebar-overlay { transition: opacity 0.3s ease; }
        .nav-item { transition: background 0.18s, color 0.18s, transform 0.18s; }
        .nav-item:hover { transform: translateX(3px); }
        .nav-item.active { background: rgba(159,65,34,0.10); color: #9f4122; }
        .nav-item.active .nav-icon { color: #9f4122; }
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .badge-pulse { animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.55} }
        @media (max-width: 1023px) {
          .sidebar { position: fixed; z-index: 50; transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); }
        }
        .sidebar-mini { width: 72px !important; }
        .sidebar-mini .sidebar-label { display: none; }
        .sidebar-mini .sidebar-logo-text { display: none; }
        .sidebar-mini .sidebar-section-title { display: none; }
        .sidebar-mini .nav-item { justify-content: center; padding-left: 0; padding-right: 0; }
        .sidebar-mini .nav-badge { display: none; }
        .main-content { transition: margin-left 0.3s cubic-bezier(0.4,0,0.2,1); }
      ` }} />

      {/* Overlay */}
      <div
        id="sidebar-overlay"
        className="sidebar-overlay fixed inset-0 bg-black/40 z-40 lg:hidden"
        style={{ opacity: sidebarOpen ? 1 : 0, pointerEvents: sidebarOpen ? "auto" : "none" }}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        id="sidebar"
        className={`sidebar bg-surface-container-lowest border-r border-outline-variant/30 h-screen w-64 flex flex-col overflow-hidden lg:fixed top-0 left-0 shadow-xl lg:shadow-none${sidebarOpen ? " open" : ""}${miniMode ? " sidebar-mini" : ""}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-outline-variant/20 shrink-0">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-md shrink-0">
            <span className="material-symbols-outlined text-on-primary text-[18px]">shopping_basket</span>
          </div>
          <div className="sidebar-logo-text">
            <div className="font-bold text-[15px] text-on-surface leading-none">Shuddhota Co.</div>
            <div className="text-[10px] text-on-surface-variant mt-0.5 font-medium uppercase tracking-wider">Admin Panel</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto hide-scrollbar py-4 px-3 space-y-0.5">
          <p className="sidebar-section-title text-[10px] text-on-surface-variant uppercase tracking-widest font-bold px-3 pt-1 pb-2">Main</p>

          <Link href="/admin" className={navItemClass("/admin")}>
            <span className="nav-icon material-symbols-outlined text-[20px] text-on-surface-variant shrink-0">dashboard</span>
            <span className="sidebar-label">Dashboard</span>
          </Link>

          <Link href="/admin/products" className={navItemClass("/admin/products")}>
            <span className="nav-icon material-symbols-outlined text-[20px] text-on-surface-variant shrink-0">inventory_2</span>
            <span className="sidebar-label">All Products</span>
            <span className="nav-badge ml-auto bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-0.5 rounded-full">{pendingProducts >= 1000 ? `${Math.floor(pendingProducts / 1000)}k` : pendingProducts}</span>
          </Link>

          <Link href="/admin/users" className={navItemClass("/admin/users")}>
            <span className="nav-icon material-symbols-outlined text-[20px] text-on-surface-variant shrink-0">group</span>
            <span className="sidebar-label">Users</span>
            <span className="nav-badge ml-auto bg-tertiary-container text-on-tertiary-container text-[10px] font-bold px-2 py-0.5 rounded-full">{pendingUsers >= 1000 ? `${(pendingUsers / 1000).toFixed(1)}k` : pendingUsers}</span>
          </Link>

          <Link href="/admin/orders" className={navItemClass("/admin/orders")}>
            <span className="nav-icon material-symbols-outlined text-[20px] text-on-surface-variant shrink-0">receipt_long</span>
            <span className="sidebar-label">Orders</span>
            {pendingOrders > 0 && (
              <span className="nav-badge ml-auto bg-primary-fixed text-on-primary-container text-[10px] font-bold px-2 py-0.5 rounded-full badge-pulse">
                {pendingOrders}
              </span>
            )}
          </Link>

          <Link href="/admin/refund" className={navItemClass("/admin/refund")}>
            <span className="nav-icon material-symbols-outlined text-[20px] text-on-surface-variant shrink-0">currency_exchange</span>
            <span className="sidebar-label">Refunds</span>
            {pendingRefunds > 0 && (
              <span className="nav-badge ml-auto bg-primary-fixed text-on-primary-container text-[10px] font-bold px-2 py-0.5 rounded-full badge-pulse" id="pending-badge">
                {pendingRefunds}
              </span>
            )}
          </Link>

          <Link href="/admin/reviews" className={navItemClass("/admin/reviews")}>
            <span className="nav-icon material-symbols-outlined text-[20px] text-on-surface-variant shrink-0">rate_review</span>
            <span className="sidebar-label">Reviews</span>
            {pendingReviews > 0 && (
              <span className="nav-badge ml-auto bg-primary-fixed text-on-primary-container text-[10px] font-bold px-2 py-0.5 rounded-full badge-pulse">
                {pendingReviews}
              </span>
            )}
          </Link>

          <Link href="/admin/coupon" className={navItemClass("/admin/coupon")}>
            <span className="nav-icon material-symbols-outlined text-[20px] text-on-surface-variant shrink-0">local_offer</span>
            <span className="sidebar-label">Coupons</span>
            {pendingCoupons > 0 && (
              <span className="nav-badge ml-auto bg-primary-fixed text-on-primary-container text-[10px] font-bold px-2 py-0.5 rounded-full">
                {pendingCoupons}
              </span>
            )}
          </Link>

          <div className="h-px bg-outline-variant/30 my-3 mx-2" />
          <p className="sidebar-section-title text-[10px] text-on-surface-variant uppercase tracking-widest font-bold px-3 pb-2">System</p>

          <Link href="/admin/settings" className={navItemClass("/admin/settings")}>
            <span className="nav-icon material-symbols-outlined text-[20px] text-on-surface-variant shrink-0">settings</span>
            <span className="sidebar-label">Settings</span>
          </Link>

          <Link href="/" className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[14px] text-on-surface cursor-pointer select-none">
            <span className="nav-icon material-symbols-outlined text-[20px] text-on-surface-variant shrink-0">storefront</span>
            <span className="sidebar-label">View Store</span>
          </Link>
        </nav>

        {/* Admin profile */}
        <div className="px-3 py-4 border-t border-outline-variant/20 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center shrink-0 font-bold text-[13px] text-on-primary-container">RA</div>
            <div className="sidebar-label flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-on-surface truncate">Rakib Admin</div>
              <div className="text-[11px] text-on-surface-variant truncate">admin@shuddhota.com</div>
            </div>
            <span className="sidebar-label material-symbols-outlined text-on-surface-variant text-[18px]">logout</span>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ─── Exported helpers so the page can wire topbar buttons ─── */
export function toggleAdminSidebar() {
  if (typeof window !== "undefined" && (window as any).__adminSidebarToggle) {
    (window as any).__adminSidebarToggle();
  }
}
export function toggleAdminMini() {
  if (typeof window !== "undefined" && (window as any).__adminMiniToggle) {
    (window as any).__adminMiniToggle();
  }
}