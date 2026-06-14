"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [progressWidth, setProgressWidth] = useState("0%");

  useEffect(() => {
    // Animate progress bar on load
    const timer = setTimeout(() => {
      setProgressWidth("82%");
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleTabSwitch = (name: string) => {
    setActiveTab(name);
    // Scroll to content smoothly on mobile
    if (window.innerWidth < 768) {
      const element = document.getElementById("panel-" + name);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .material-symbols-outlined {
          font-family: "Material Symbols Outlined";
          font-weight: normal;
          font-style: normal;
          font-size: 24px;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
          -webkit-font-feature-settings: "liga";
          -webkit-font-smoothing: antialiased;
        }
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .tab-panel {
          display: none;
        }
        .tab-panel.active {
          display: block;
          animation: fadeIn 0.25s ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .product-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(159, 65, 34, 0.12);
        }
        @keyframes fillBar {
          from {
            width: 0%;
          }
          to {
            width: var(--target-width);
          }
        }
        .progress-fill {
          animation: fillBar 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `,
        }}
      />

      {/* ─── PROFILE HERO ─── */}
      <section className="relative pt-24 md:pt-36 pb-0 overflow-hidden">
        {/* Banner gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-container/35 via-tertiary-fixed/20 to-secondary-fixed/25 -z-10"></div>
        <div className="absolute top-20 right-10 md:right-32 w-32 md:w-64 h-32 md:h-64 rounded-full bg-primary/10 blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-10 md:left-40 w-24 md:w-48 h-24 md:h-48 rounded-full bg-secondary-container/40 blur-3xl -z-10"></div>
        {/* Decorative circles like CTA section */}
        <div className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] border-[40px] md:border-[60px] border-primary/5 rounded-full top-[-80px] right-[-80px] -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-container-padding">
          {/* Profile Identity Row */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-5 md:gap-8 pb-8 md:pb-10">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary to-on-primary-fixed-variant text-on-primary flex items-center justify-center text-[32px] md:text-[44px] font-bold shadow-xl ring-4 ring-surface border-2 border-primary/20">
                রক
              </div>
              <button className="absolute bottom-1 right-1 w-8 h-8 bg-surface border border-outline-variant/50 rounded-full flex items-center justify-center shadow-md hover:bg-surface-variant transition-colors">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                  photo_camera
                </span>
              </button>
            </div>

            {/* Name & Details */}
            <div className="flex-1 text-center md:text-left pb-1">
              <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3 flex-wrap mb-1">
                <h1 className="font-display-xl text-[26px] md:text-[42px] leading-tight tracking-tight text-on-surface">
                  Raqib Karim
                </h1>
                {/* Gold tier badge */}
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white font-label-caps text-[9px] md:text-[10px] px-2.5 py-1 rounded-full shadow-sm uppercase tracking-widest">
                  <span className="material-symbols-outlined text-[11px] md:text-[12px]">
                    workspace_premium
                  </span>
                  Gold Member
                </span>
              </div>
              <p className="font-body-md text-[12px] md:text-body-md text-on-surface-variant mb-3 md:mb-4">
                raqib.karim@email.com &nbsp;·&nbsp; Member since March 2023
              </p>
              {/* Stats pills */}
              <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 bg-surface/80 backdrop-blur border border-outline-variant/40 rounded-full px-3 md:px-4 py-1.5 md:py-2 shadow-sm">
                  <span className="material-symbols-outlined text-primary text-[15px] md:text-[18px]">
                    shopping_bag
                  </span>
                  <span className="font-body-md text-[11px] md:text-[13px] font-semibold text-on-surface">
                    24
                  </span>
                  <span className="font-body-md text-[10px] md:text-[12px] text-on-surface-variant">
                    Orders
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-surface/80 backdrop-blur border border-outline-variant/40 rounded-full px-3 md:px-4 py-1.5 md:py-2 shadow-sm">
                  <span className="material-symbols-outlined text-error text-[15px] md:text-[18px]">
                    favorite
                  </span>
                  <span className="font-body-md text-[11px] md:text-[13px] font-semibold text-on-surface">
                    12
                  </span>
                  <span className="font-body-md text-[10px] md:text-[12px] text-on-surface-variant">
                    Wishlist
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-surface/80 backdrop-blur border border-outline-variant/40 rounded-full px-3 md:px-4 py-1.5 md:py-2 shadow-sm">
                  <span className="material-symbols-outlined text-secondary text-[15px] md:text-[18px]">
                    star
                  </span>
                  <span className="font-body-md text-[11px] md:text-[13px] font-semibold text-on-surface">
                    8
                  </span>
                  <span className="font-body-md text-[10px] md:text-[12px] text-on-surface-variant">
                    Reviews
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-secondary-fixed/40 backdrop-blur border border-secondary-fixed-dim/60 rounded-full px-3 md:px-4 py-1.5 md:py-2 shadow-sm">
                  <span className="material-symbols-outlined text-secondary text-[15px] md:text-[18px]">
                    toll
                  </span>
                  <span className="font-body-md text-[11px] md:text-[13px] font-semibold text-on-surface">
                    2,450
                  </span>
                  <span className="font-body-md text-[10px] md:text-[12px] text-on-surface-variant">
                    Points
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <div className="shrink-0 flex gap-2 md:gap-3">
              <button
                onClick={() => handleTabSwitch("settings")}
                className="inline-flex items-center gap-1.5 border border-primary text-primary font-body-md text-[12px] md:text-body-md font-medium px-4 md:px-6 py-2 md:py-2.5 rounded-full hover:bg-primary hover:text-on-primary transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px] md:text-[18px]">
                  edit
                </span>
                Edit Profile
              </button>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 bg-primary text-on-primary font-body-md text-[12px] md:text-body-md font-medium px-4 md:px-6 py-2 md:py-2.5 rounded-full hover:bg-primary/90 transition-all shadow-md"
              >
                <span className="material-symbols-outlined text-[16px] md:text-[18px]">
                  add_shopping_cart
                </span>
                <span className="hidden sm:inline">Shop Now</span>
              </Link>
            </div>
          </div>

          {/* ─── TAB BAR ─── */}
          <div className="flex items-center gap-0 border-b border-outline-variant/30 hide-scrollbar overflow-x-auto">
            <button
              onClick={() => handleTabSwitch("overview")}
              id="tab-btn-overview"
              className={`tab-btn flex items-center gap-1.5 px-4 md:px-6 py-3 md:py-4 font-body-md text-[12px] md:text-body-md font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[16px] md:text-[18px]">
                dashboard
              </span>
              Overview
            </button>
            <button
              onClick={() => handleTabSwitch("orders")}
              id="tab-btn-orders"
              className={`tab-btn flex items-center gap-1.5 px-4 md:px-6 py-3 md:py-4 font-body-md text-[12px] md:text-body-md font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === "orders"
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[16px] md:text-[18px]">
                receipt_long
              </span>
              Orders
              <span className="bg-surface-container text-on-surface-variant text-[9px] md:text-[11px] font-semibold px-1.5 py-0.5 rounded-full ml-1.5">
                24
              </span>
            </button>
            <button
              onClick={() => handleTabSwitch("wishlist")}
              id="tab-btn-wishlist"
              className={`tab-btn flex items-center gap-1.5 px-4 md:px-6 py-3 md:py-4 font-body-md text-[12px] md:text-body-md font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === "wishlist"
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[16px] md:text-[18px]">
                favorite
              </span>
              Wishlist
              <span className="bg-surface-container text-on-surface-variant text-[9px] md:text-[11px] font-semibold px-1.5 py-0.5 rounded-full ml-1.5">
                12
              </span>
            </button>
            <button
              onClick={() => handleTabSwitch("addresses")}
              id="tab-btn-addresses"
              className={`tab-btn flex items-center gap-1.5 px-4 md:px-6 py-3 md:py-4 font-body-md text-[12px] md:text-body-md font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === "addresses"
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[16px] md:text-[18px]">
                location_on
              </span>
              Addresses
            </button>
            <button
              onClick={() => handleTabSwitch("settings")}
              id="tab-btn-settings"
              className={`tab-btn flex items-center gap-1.5 px-4 md:px-6 py-3 md:py-4 font-body-md text-[12px] md:text-body-md font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === "settings"
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[16px] md:text-[18px]">
                settings
              </span>
              Settings
            </button>
          </div>
        </div>
      </section>

      {/* ─── PROFILE CONTENT ─── */}
      <section className="py-8 md:py-12 px-6 md:px-container-padding bg-surface-container-low min-h-[60vh]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr] gap-6 md:gap-8 items-start">
            {/* ─── LEFT SIDEBAR ─── */}
            <aside className="flex flex-col gap-4 md:gap-6">
              {/* Quick Info Card */}
              <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md p-5 md:p-6">
                <h3 className="font-headline-md text-[14px] md:text-[16px] font-semibold text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px] md:text-[20px]">
                    person
                  </span>
                  Account Info
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px] mt-0.5 shrink-0">
                      mail
                    </span>
                    <div>
                      <p className="font-label-caps text-[9px] md:text-[10px] text-on-surface-variant uppercase tracking-widest mb-0.5">
                        Email
                      </p>
                      <p className="font-body-md text-[12px] md:text-[14px] text-on-surface">
                        raqib.karim@email.com
                      </p>
                    </div>
                  </div>
                  <div className="h-px bg-outline-variant/20"></div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px] mt-0.5 shrink-0">
                      phone
                    </span>
                    <div>
                      <p className="font-label-caps text-[9px] md:text-[10px] text-on-surface-variant uppercase tracking-widest mb-0.5">
                        Phone
                      </p>
                      <p className="font-body-md text-[12px] md:text-[14px] text-on-surface">
                        +880 1712-345678
                      </p>
                    </div>
                  </div>
                  <div className="h-px bg-outline-variant/20"></div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px] mt-0.5 shrink-0">
                      location_city
                    </span>
                    <div>
                      <p className="font-label-caps text-[9px] md:text-[10px] text-on-surface-variant uppercase tracking-widest mb-0.5">
                        City
                      </p>
                      <p className="font-body-md text-[12px] md:text-[14px] text-on-surface">
                        Dhaka, Bangladesh
                      </p>
                    </div>
                  </div>
                  <div className="h-px bg-outline-variant/20"></div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px] mt-0.5 shrink-0">
                      calendar_month
                    </span>
                    <div>
                      <p className="font-label-caps text-[9px] md:text-[10px] text-on-surface-variant uppercase tracking-widest mb-0.5">
                        Member Since
                      </p>
                      <p className="font-body-md text-[12px] md:text-[14px] text-on-surface">
                        March 14, 2023
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loyalty Points Card */}
              <div className="bg-gradient-to-br from-primary to-on-primary-fixed-variant rounded-[20px] md:rounded-[24px] shadow-lg p-5 md:p-6 relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full border-[20px] border-white/10"></div>
                <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full border-[16px] border-black/5"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-secondary-fixed text-[20px] md:text-[22px]">
                      toll
                    </span>
                    <span className="font-label-caps text-[9px] md:text-[10px] text-white/70 uppercase tracking-widest">
                      Loyalty Points
                    </span>
                  </div>
                  <p className="font-display-xl text-[40px] md:text-[52px] text-white leading-none tracking-tight mb-1">
                    2,450
                  </p>
                  <p className="font-body-md text-[11px] md:text-[13px] text-white/60 mb-5">
                    550 more to reach Platinum tier
                  </p>

                  {/* Progress bar */}
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-label-caps text-[9px] text-white/60 uppercase tracking-wider">
                        Gold
                      </span>
                      <span className="font-label-caps text-[9px] text-secondary-fixed uppercase tracking-wider">
                        Platinum
                      </span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="progress-fill h-full bg-secondary-fixed rounded-full"
                        style={
                          {
                            "--target-width": "82%",
                            width: progressWidth,
                          } as React.CSSProperties
                        }
                      ></div>
                    </div>
                    <p className="font-body-md text-[10px] text-white/50 mt-1.5 text-right">
                      2,450 / 3,000
                    </p>
                  </div>

                  <button className="mt-3 w-full bg-white/15 hover:bg-white/25 border border-white/20 text-white font-body-md text-[12px] md:text-[13px] font-medium py-2.5 rounded-full transition-colors flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px]">
                      redeem
                    </span>
                    Redeem Points
                  </button>
                </div>
              </div>

              {/* Quick Links Card */}
              <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md p-3 md:p-4">
                <h3 className="font-label-caps text-[9px] md:text-[10px] text-on-surface-variant uppercase tracking-widest px-2 mb-2">
                  Quick Links
                </h3>
                <div className="flex flex-col">
                  <Link
                    href="#"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-variant transition-colors group"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">
                      receipt_long
                    </span>
                    <span className="font-body-md text-[13px] md:text-[14px] text-on-surface group-hover:text-primary transition-colors">
                      Track My Orders
                    </span>
                    <span className="material-symbols-outlined text-[14px] text-on-surface-variant/50 ml-auto">
                      chevron_right
                    </span>
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-variant transition-colors group"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">
                      autorenew
                    </span>
                    <span className="font-body-md text-[13px] md:text-[14px] text-on-surface group-hover:text-primary transition-colors">
                      Returns & Refunds
                    </span>
                    <span className="material-symbols-outlined text-[14px] text-on-surface-variant/50 ml-auto">
                      chevron_right
                    </span>
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-variant transition-colors group"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">
                      help_outline
                    </span>
                    <span className="font-body-md text-[13px] md:text-[14px] text-on-surface group-hover:text-primary transition-colors">
                      Help & Support
                    </span>
                    <span className="material-symbols-outlined text-[14px] text-on-surface-variant/50 ml-auto">
                      chevron_right
                    </span>
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-variant transition-colors group"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">
                      notifications
                    </span>
                    <span className="font-body-md text-[13px] md:text-[14px] text-on-surface group-hover:text-primary transition-colors">
                      Notifications
                    </span>
                    <span className="flex items-center gap-1 ml-auto">
                      <span className="w-2 h-2 rounded-full bg-error"></span>
                      <span className="material-symbols-outlined text-[14px] text-on-surface-variant/50">
                        chevron_right
                      </span>
                    </span>
                  </Link>
                  <div className="h-px bg-outline-variant/20 mx-2 my-1"></div>
                  <Link
                    href="#"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-error-container transition-colors group"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-error transition-colors">
                      logout
                    </span>
                    <span className="font-body-md text-[13px] md:text-[14px] text-on-surface group-hover:text-error transition-colors">
                      Sign Out
                    </span>
                  </Link>
                </div>
              </div>
            </aside>

            {/* ─── MAIN CONTENT ─── */}
            <div className="min-w-0 flex-1">
              {/* ━━━━━━━ TAB: OVERVIEW ━━━━━━━ */}
              <div
                id="panel-overview"
                className={`tab-panel ${
                  activeTab === "overview" ? "active" : ""
                } space-y-5 md:space-y-6`}
              >
                {/* Welcome banner */}
                <div className="bg-gradient-to-r from-tertiary-fixed/50 to-secondary-fixed/30 border border-outline-variant/30 rounded-[20px] md:rounded-[24px] p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-surface/80 border border-white/50 shadow flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-[22px]">
                      waving_hand
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-headline-md text-[16px] md:text-[20px] text-on-surface mb-0.5">
                      Welcome back, Raqib!
                    </h2>
                    <p className="font-body-md text-[12px] md:text-body-md text-on-surface-variant">
                      You have 1 active order and 3 items in your cart. Your
                      Gold membership saves you 10% on every order.
                    </p>
                  </div>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-1.5 bg-primary text-on-primary font-body-md text-[12px] md:text-[13px] font-medium px-4 py-2 rounded-full hover:bg-primary/90 transition-colors shrink-0 shadow-sm"
                  >
                    Continue Shopping
                    <span className="material-symbols-outlined text-[14px]">
                      arrow_forward
                    </span>
                  </Link>
                </div>

                {/* Summary Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  <div className="bg-surface rounded-[16px] md:rounded-[20px] border border-outline-variant/40 shadow-sm p-4 md:p-5">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary-fixed flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-primary text-[18px] md:text-[20px]">
                        shopping_bag
                      </span>
                    </div>
                    <p className="font-display-xl text-[26px] md:text-[32px] text-on-surface leading-none mb-1">
                      24
                    </p>
                    <p className="font-body-md text-[11px] md:text-[12px] text-on-surface-variant">
                      Total Orders
                    </p>
                  </div>
                  <div className="bg-surface rounded-[16px] md:rounded-[20px] border border-outline-variant/40 shadow-sm p-4 md:p-5">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-error-container flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-error text-[18px] md:text-[20px]">
                        favorite
                      </span>
                    </div>
                    <p className="font-display-xl text-[26px] md:text-[32px] text-on-surface leading-none mb-1">
                      12
                    </p>
                    <p className="font-body-md text-[11px] md:text-[12px] text-on-surface-variant">
                      Wishlist Items
                    </p>
                  </div>
                  <div className="bg-surface rounded-[16px] md:rounded-[20px] border border-outline-variant/40 shadow-sm p-4 md:p-5">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-secondary-container flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-secondary text-[18px] md:text-[20px]">
                        star
                      </span>
                    </div>
                    <p className="font-display-xl text-[26px] md:text-[32px] text-on-surface leading-none mb-1">
                      8
                    </p>
                    <p className="font-body-md text-[11px] md:text-[12px] text-on-surface-variant">
                      Reviews Given
                    </p>
                  </div>
                  <div className="bg-surface rounded-[16px] md:rounded-[20px] border border-outline-variant/40 shadow-sm p-4 md:p-5">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-tertiary-container flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-tertiary text-[18px] md:text-[20px]">
                        savings
                      </span>
                    </div>
                    <p className="font-display-xl text-[26px] md:text-[32px] text-on-surface leading-none mb-1">
                      ৳820
                    </p>
                    <p className="font-body-md text-[11px] md:text-[12px] text-on-surface-variant">
                      Total Saved
                    </p>
                  </div>
                </div>

                {/* Recent Orders (overview) */}
                <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden">
                  <div className="flex items-center justify-between p-5 md:p-6 border-b border-outline-variant/20">
                    <h3 className="font-headline-md text-[15px] md:text-[18px] font-semibold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px] md:text-[20px]">
                        receipt_long
                      </span>
                      Recent Orders
                    </h3>
                    <button
                      onClick={() => handleTabSwitch("orders")}
                      className="font-body-md text-[11px] md:text-body-md text-primary font-medium hover:underline underline-offset-4 flex items-center gap-1"
                    >
                      View All{" "}
                      <span className="material-symbols-outlined text-[14px] md:text-[16px]">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                  <div className="divide-y divide-outline-variant/15">
                    {/* Order 1 */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 md:p-5 hover:bg-surface-container-low transition-colors">
                      <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary-container to-primary/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-[20px]">
                          local_fire_department
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body-md text-[13px] md:text-[14px] font-semibold text-on-surface truncate">
                          Garam Masala Blend, Premium Almonds
                        </p>
                        <p className="font-body-md text-[11px] md:text-[12px] text-on-surface-variant">
                          Order #SHD-2024-001 &nbsp;·&nbsp; Jan 8, 2025
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-[14px] md:text-[16px] text-on-surface">
                          ৳898
                        </span>
                        <span className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container font-label-caps text-[9px] md:text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                          <span className="material-symbols-outlined text-[11px]">
                            check_circle
                          </span>
                          Delivered
                        </span>
                      </div>
                    </div>
                    {/* Order 2 */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 md:p-5 hover:bg-surface-container-low transition-colors">
                      <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-tertiary-fixed to-tertiary-container flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-tertiary text-[20px]">
                          spa
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body-md text-[13px] md:text-[14px] font-semibold text-on-surface truncate">
                          Green Cardamom, Yellow Moong Dal
                        </p>
                        <p className="font-body-md text-[11px] md:text-[12px] text-on-surface-variant">
                          Order #SHD-2024-003 &nbsp;·&nbsp; Jan 5, 2025
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-[14px] md:text-[16px] text-on-surface">
                          ৳498
                        </span>
                        <span className="inline-flex items-center gap-1 bg-tertiary-fixed text-on-tertiary-container font-label-caps text-[9px] md:text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                          <span className="material-symbols-outlined text-[11px]">
                            local_shipping
                          </span>
                          In Transit
                        </span>
                      </div>
                    </div>
                    {/* Order 3 */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 md:p-5 hover:bg-surface-container-low transition-colors">
                      <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-secondary-container to-secondary-fixed/50 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-secondary text-[20px]">
                          soup_kitchen
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body-md text-[13px] md:text-[14px] font-semibold text-on-surface truncate">
                          Biryani Masala
                        </p>
                        <p className="font-body-md text-[11px] md:text-[12px] text-on-surface-variant">
                          Order #SHD-2024-004 &nbsp;·&nbsp; Jan 8, 2025
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-[14px] md:text-[16px] text-on-surface">
                          ৳199
                        </span>
                        <span className="inline-flex items-center gap-1 bg-primary-fixed text-on-primary-container font-label-caps text-[9px] md:text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                          <span className="material-symbols-outlined text-[11px]">
                            schedule
                          </span>
                          Processing
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Saved Addresses (overview) */}
                <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden">
                  <div className="flex items-center justify-between p-5 md:p-6 border-b border-outline-variant/20">
                    <h3 className="font-headline-md text-[15px] md:text-[18px] font-semibold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px] md:text-[20px]">
                        location_on
                      </span>
                      Saved Addresses
                    </h3>
                    <button
                      onClick={() => handleTabSwitch("addresses")}
                      className="font-body-md text-[11px] md:text-body-md text-primary font-medium hover:underline underline-offset-4 flex items-center gap-1"
                    >
                      Manage{" "}
                      <span className="material-symbols-outlined text-[14px] md:text-[16px]">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 p-4 md:p-5">
                    <div className="border border-outline-variant/40 rounded-[14px] md:rounded-[16px] p-3.5 md:p-4 hover:border-primary/40 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 bg-primary-fixed text-on-primary-container font-label-caps text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                          <span className="material-symbols-outlined text-[10px]">
                            home
                          </span>
                          Home
                        </span>
                        <span className="inline-flex items-center gap-0.5 bg-secondary-container text-on-secondary-container font-label-caps text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                          <span className="material-symbols-outlined text-[9px]">
                            check
                          </span>
                          Default
                        </span>
                      </div>
                      <p className="font-body-md text-[12px] md:text-[13px] font-semibold text-on-surface mb-0.5">
                        Raqib Karim
                      </p>
                      <p className="font-body-md text-[11px] md:text-[12px] text-on-surface-variant leading-relaxed">
                        House 12, Road 4, Block B
                        <br />
                        Bashundhara R/A, Dhaka 1229
                      </p>
                      <p className="font-body-md text-[11px] text-on-surface-variant mt-1">
                        +880 1712-345678
                      </p>
                    </div>
                    <div className="border border-outline-variant/40 rounded-[14px] md:rounded-[16px] p-3.5 md:p-4 hover:border-primary/40 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 bg-tertiary-fixed text-on-tertiary-container font-label-caps text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                          <span className="material-symbols-outlined text-[10px]">
                            work
                          </span>
                          Office
                        </span>
                      </div>
                      <p className="font-body-md text-[12px] md:text-[13px] font-semibold text-on-surface mb-0.5">
                        Raqib Karim
                      </p>
                      <p className="font-body-md text-[11px] md:text-[12px] text-on-surface-variant leading-relaxed">
                        Level 5, TechHub Center
                        <br />
                        Motijheel, Dhaka 1000
                      </p>
                      <p className="font-body-md text-[11px] text-on-surface-variant mt-1">
                        +880 1712-345678
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ━━━━━━━ TAB: ORDERS ━━━━━━━ */}
              <div
                id="panel-orders"
                className={`tab-panel ${activeTab === "orders" ? "active" : ""} space-y-4`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-label-caps text-[9px] md:text-label-caps text-on-surface-variant tracking-widest">
                      ALL ORDERS
                    </span>
                    <h2 className="font-display-xl text-[22px] md:text-[32px] leading-tight text-on-surface">
                      Order History
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-surface border border-outline-variant/40 rounded-full px-3 py-2 cursor-pointer hover:border-primary/40 transition-colors">
                      <span className="font-body-md text-[11px] md:text-[13px] text-on-surface-variant">
                        All Status
                      </span>
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                        expand_more
                      </span>
                    </div>
                    <button className="p-2 border border-outline-variant/40 bg-surface rounded-full hover:border-primary/40 transition-colors">
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                        tune
                      </span>
                    </button>
                  </div>
                </div>

                <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden">
                  <div className="divide-y divide-outline-variant/15">
                    {/* Order 1 */}
                    <div className="p-4 md:p-5 hover:bg-surface-container-low transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
                        <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary-container to-primary/20 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-primary text-[20px]">
                            local_fire_department
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-0.5">
                            <p className="font-body-md text-[12px] md:text-[13px] font-semibold text-on-surface-variant">
                              #SHD-2024-001
                            </p>
                            <span className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container font-label-caps text-[8px] md:text-[9px] px-2 py-0.5 rounded-full uppercase">
                              <span className="material-symbols-outlined text-[10px]">
                                check_circle
                              </span>
                              Delivered
                            </span>
                          </div>
                          <p className="font-body-md text-[13px] md:text-[15px] font-semibold text-on-surface">
                            Garam Masala Blend, Premium Almonds
                          </p>
                          <p className="font-body-md text-[11px] md:text-[12px] text-on-surface-variant">
                            Dec 28, 2024 &nbsp;·&nbsp; 2 items
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className="font-bold text-[16px] md:text-[18px] text-on-surface">
                            ৳898
                          </span>
                          <div className="flex gap-1.5">
                            <button className="font-body-md text-[10px] md:text-[11px] text-primary border border-primary/30 px-2.5 py-1 rounded-full hover:bg-primary hover:text-on-primary transition-colors">
                              Reorder
                            </button>
                            <button className="font-body-md text-[10px] md:text-[11px] text-on-surface-variant border border-outline-variant/40 px-2.5 py-1 rounded-full hover:bg-surface-variant transition-colors">
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="bg-surface-container-low rounded-xl p-3 flex items-center gap-1.5 md:gap-2 overflow-x-auto hide-scrollbar">
                        <div className="flex items-center gap-1 shrink-0">
                          <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                            <span className="material-symbols-outlined text-on-secondary text-[11px]">
                              check
                            </span>
                          </div>
                          <span className="font-body-md text-[9px] md:text-[11px] text-secondary font-medium">
                            Placed
                          </span>
                        </div>
                        <div className="flex-1 h-px bg-secondary min-w-[16px]"></div>
                        <div className="flex items-center gap-1 shrink-0">
                          <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                            <span className="material-symbols-outlined text-on-secondary text-[11px]">
                              check
                            </span>
                          </div>
                          <span className="font-body-md text-[9px] md:text-[11px] text-secondary font-medium">
                            Packed
                          </span>
                        </div>
                        <div className="flex-1 h-px bg-secondary min-w-[16px]"></div>
                        <div className="flex items-center gap-1 shrink-0">
                          <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                            <span className="material-symbols-outlined text-on-secondary text-[11px]">
                              check
                            </span>
                          </div>
                          <span className="font-body-md text-[9px] md:text-[11px] text-secondary font-medium">
                            Shipped
                          </span>
                        </div>
                        <div className="flex-1 h-px bg-secondary min-w-[16px]"></div>
                        <div className="flex items-center gap-1 shrink-0">
                          <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                            <span className="material-symbols-outlined text-on-secondary text-[11px]">
                              check
                            </span>
                          </div>
                          <span className="font-body-md text-[9px] md:text-[11px] text-secondary font-medium">
                            Delivered
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Order 2 - In Transit */}
                    <div className="p-4 md:p-5 hover:bg-surface-container-low transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-tertiary-fixed to-tertiary-container flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-tertiary text-[20px]">
                            spa
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-0.5">
                            <p className="font-body-md text-[12px] md:text-[13px] font-semibold text-on-surface-variant">
                              #SHD-2024-003
                            </p>
                            <span className="inline-flex items-center gap-1 bg-tertiary-fixed text-on-tertiary-container font-label-caps text-[8px] md:text-[9px] px-2 py-0.5 rounded-full uppercase">
                              <span className="material-symbols-outlined text-[10px]">
                                local_shipping
                              </span>
                              In Transit
                            </span>
                          </div>
                          <p className="font-body-md text-[13px] md:text-[15px] font-semibold text-on-surface">
                            Green Cardamom, Yellow Moong Dal
                          </p>
                          <p className="font-body-md text-[11px] md:text-[12px] text-on-surface-variant">
                            Jan 5, 2025 &nbsp;·&nbsp; 2 items &nbsp;·&nbsp; Est.
                            arrival Jan 10
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className="font-bold text-[16px] md:text-[18px] text-on-surface">
                            ৳498
                          </span>
                          <div className="flex gap-1.5">
                            <button className="font-body-md text-[10px] md:text-[11px] text-tertiary border border-tertiary/30 px-2.5 py-1 rounded-full hover:bg-tertiary hover:text-on-tertiary transition-colors">
                              Track
                            </button>
                            <button className="font-body-md text-[10px] md:text-[11px] text-on-surface-variant border border-outline-variant/40 px-2.5 py-1 rounded-full hover:bg-surface-variant transition-colors">
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Order 3 - Processing */}
                    <div className="p-4 md:p-5 hover:bg-surface-container-low transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-secondary-container to-secondary-fixed/50 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-secondary text-[20px]">
                            soup_kitchen
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-0.5">
                            <p className="font-body-md text-[12px] md:text-[13px] font-semibold text-on-surface-variant">
                              #SHD-2024-004
                            </p>
                            <span className="inline-flex items-center gap-1 bg-primary-fixed text-on-primary-container font-label-caps text-[8px] md:text-[9px] px-2 py-0.5 rounded-full uppercase">
                              <span className="material-symbols-outlined text-[10px]">
                                schedule
                              </span>
                              Processing
                            </span>
                          </div>
                          <p className="font-body-md text-[13px] md:text-[15px] font-semibold text-on-surface">
                            Biryani Masala
                          </p>
                          <p className="font-body-md text-[11px] md:text-[12px] text-on-surface-variant">
                            Jan 8, 2025 &nbsp;·&nbsp; 1 item
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className="font-bold text-[16px] md:text-[18px] text-on-surface">
                            ৳199
                          </span>
                          <div className="flex gap-1.5">
                            <button className="font-body-md text-[10px] md:text-[11px] text-error border border-error/30 px-2.5 py-1 rounded-full hover:bg-error-container transition-colors">
                              Cancel
                            </button>
                            <button className="font-body-md text-[10px] md:text-[11px] text-on-surface-variant border border-outline-variant/40 px-2.5 py-1 rounded-full hover:bg-surface-variant transition-colors">
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Order 4 */}
                    <div className="p-4 md:p-5 hover:bg-surface-container-low transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary-fixed to-inverse-primary/40 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-primary text-[20px]">
                            shopping_basket
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-0.5">
                            <p className="font-body-md text-[12px] md:text-[13px] font-semibold text-on-surface-variant">
                              #SHD-2024-002
                            </p>
                            <span className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container font-label-caps text-[8px] md:text-[9px] px-2 py-0.5 rounded-full uppercase">
                              <span className="material-symbols-outlined text-[10px]">
                                check_circle
                              </span>
                              Delivered
                            </span>
                          </div>
                          <p className="font-body-md text-[13px] md:text-[15px] font-semibold text-on-surface">
                            Mixed Dry Fruits, Premium Almonds
                          </p>
                          <p className="font-body-md text-[11px] md:text-[12px] text-on-surface-variant">
                            Nov 28, 2024 &nbsp;·&nbsp; 2 items
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className="font-bold text-[16px] md:text-[18px] text-on-surface">
                            ৳1,248
                          </span>
                          <div className="flex gap-1.5">
                            <button className="font-body-md text-[10px] md:text-[11px] text-primary border border-primary/30 px-2.5 py-1 rounded-full hover:bg-primary hover:text-on-primary transition-colors">
                              Reorder
                            </button>
                            <button className="font-body-md text-[10px] md:text-[11px] text-secondary border border-secondary/30 px-2.5 py-1 rounded-full hover:bg-secondary-container transition-colors">
                              Review
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ━━━━━━━ TAB: WISHLIST ━━━━━━━ */}
              <div
                id="panel-wishlist"
                className={`tab-panel ${activeTab === "wishlist" ? "active" : ""}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div>
                    <span className="font-label-caps text-[9px] md:text-label-caps text-on-surface-variant tracking-widest">
                      SAVED ITEMS
                    </span>
                    <h2 className="font-display-xl text-[22px] md:text-[32px] leading-tight text-on-surface">
                      My Wishlist
                    </h2>
                  </div>
                  <button className="inline-flex items-center gap-1.5 bg-primary text-on-primary font-body-md text-[12px] md:text-[13px] font-medium px-4 py-2 rounded-full hover:bg-primary/90 transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[15px]">
                      add_shopping_cart
                    </span>
                    Add All to Cart
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
                  {/* Wishlist item 1 */}
                  <div className="product-card bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden flex flex-col relative">
                    <button className="absolute top-2.5 right-2.5 z-10 w-8 h-8 bg-surface/90 border border-outline-variant/30 rounded-full flex items-center justify-center hover:bg-error-container transition-colors shadow-sm">
                      <span
                        className="material-symbols-outlined text-error text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        favorite
                      </span>
                    </button>
                    <div className="h-36 md:h-48 bg-gradient-to-br from-primary-container to-primary/20 relative overflow-hidden p-3 md:p-5 flex items-end">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 md:w-24 h-16 md:h-24 rounded-full bg-primary/15"></div>
                      </div>
                      <div className="relative z-10 bg-surface/90 backdrop-blur rounded-xl px-2 py-1.5 md:px-3 md:py-2 border border-white/50 shadow">
                        <span className="material-symbols-outlined text-primary text-[18px] md:text-[22px]">
                          local_fire_department
                        </span>
                      </div>
                    </div>
                    <div className="p-3 md:p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-primary text-[11px] md:text-[13px]">
                          ★★★★★
                        </span>
                        <span className="text-[9px] md:text-[11px] text-on-surface-variant">
                          (428)
                        </span>
                      </div>
                      <h4 className="font-headline-md text-[13px] md:text-headline-md text-on-surface mb-0.5">
                        Garam Masala Blend
                      </h4>
                      <p className="text-[10px] md:text-body-md text-on-surface-variant mb-2 md:mb-3">
                        200g • Premium Grade
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="font-bold text-[17px] md:text-[22px] text-on-surface">
                          ৳249
                        </span>
                        <button className="bg-primary text-on-primary text-[10px] md:text-body-md font-medium px-2.5 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] md:text-[16px]">
                            add_shopping_cart
                          </span>
                          <span className="hidden sm:inline text-[11px] md:text-body-md">
                            Add
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Wishlist item 2 */}
                  <div className="product-card bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden flex flex-col relative">
                    <button className="absolute top-2.5 right-2.5 z-10 w-8 h-8 bg-surface/90 border border-outline-variant/30 rounded-full flex items-center justify-center hover:bg-error-container transition-colors shadow-sm">
                      <span
                        className="material-symbols-outlined text-error text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        favorite
                      </span>
                    </button>
                    <div className="h-36 md:h-48 bg-gradient-to-br from-surface-container-high to-primary-fixed/50 relative overflow-hidden p-3 md:p-5 flex items-end">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 md:w-24 h-12 md:h-16 rounded-2xl bg-outline/15"></div>
                      </div>
                      <div className="relative z-10 bg-surface/90 backdrop-blur rounded-xl px-2 py-1.5 md:px-3 md:py-2 border border-white/50 shadow">
                        <span className="material-symbols-outlined text-outline text-[18px] md:text-[22px]">
                          nutrition
                        </span>
                      </div>
                    </div>
                    <div className="p-3 md:p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-primary text-[11px] md:text-[13px]">
                          ★★★★★
                        </span>
                        <span className="text-[9px] md:text-[11px] text-on-surface-variant">
                          (312)
                        </span>
                      </div>
                      <h4 className="font-headline-md text-[13px] md:text-headline-md text-on-surface mb-0.5">
                        Premium Almonds
                      </h4>
                      <p className="text-[10px] md:text-body-md text-on-surface-variant mb-2 md:mb-3">
                        500g • California Grade A
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="font-bold text-[17px] md:text-[22px] text-on-surface">
                          ৳649
                        </span>
                        <button className="bg-primary text-on-primary text-[10px] md:text-body-md font-medium px-2.5 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] md:text-[16px]">
                            add_shopping_cart
                          </span>
                          <span className="hidden sm:inline text-[11px] md:text-body-md">
                            Add
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Wishlist item 3 */}
                  <div className="product-card bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden flex flex-col relative">
                    <button className="absolute top-2.5 right-2.5 z-10 w-8 h-8 bg-surface/90 border border-outline-variant/30 rounded-full flex items-center justify-center hover:bg-error-container transition-colors shadow-sm">
                      <span
                        className="material-symbols-outlined text-error text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        favorite
                      </span>
                    </button>
                    <div className="h-36 md:h-48 bg-gradient-to-br from-tertiary-fixed to-tertiary-container relative overflow-hidden p-3 md:p-5 flex items-end">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 md:w-24 h-16 md:h-24 rounded-full bg-tertiary/15"></div>
                      </div>
                      <div className="relative z-10 bg-surface/90 backdrop-blur rounded-xl px-2 py-1.5 md:px-3 md:py-2 border border-white/50 shadow">
                        <span className="material-symbols-outlined text-tertiary text-[18px] md:text-[22px]">
                          spa
                        </span>
                      </div>
                    </div>
                    <div className="p-3 md:p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-primary text-[11px] md:text-[13px]">
                          ★★★★★
                        </span>
                        <span className="text-[9px] md:text-[11px] text-on-surface-variant">
                          (267)
                        </span>
                      </div>
                      <h4 className="font-headline-md text-[13px] md:text-headline-md text-on-surface mb-0.5">
                        Green Cardamom
                      </h4>
                      <p className="text-[10px] md:text-body-md text-on-surface-variant mb-2 md:mb-3">
                        50g • Kerala Origin
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="font-bold text-[17px] md:text-[22px] text-on-surface">
                          ৳349
                        </span>
                        <button className="bg-primary text-on-primary text-[10px] md:text-body-md font-medium px-2.5 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] md:text-[16px]">
                            add_shopping_cart
                          </span>
                          <span className="hidden sm:inline text-[11px] md:text-body-md">
                            Add
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ━━━━━━━ TAB: ADDRESSES ━━━━━━━ */}
              <div
                id="panel-addresses"
                className={`tab-panel ${activeTab === "addresses" ? "active" : ""}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div>
                    <span className="font-label-caps text-[9px] md:text-label-caps text-on-surface-variant tracking-widest">
                      DELIVERY LOCATIONS
                    </span>
                    <h2 className="font-display-xl text-[22px] md:text-[32px] leading-tight text-on-surface">
                      Saved Addresses
                    </h2>
                  </div>
                  <button className="inline-flex items-center gap-1.5 bg-primary text-on-primary font-body-md text-[12px] md:text-[13px] font-medium px-4 py-2 rounded-full hover:bg-primary/90 transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[15px]">
                      add
                    </span>
                    Add New Address
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                  {/* Address 1 - Home (Default) */}
                  <div className="bg-surface rounded-[20px] md:rounded-[24px] border-2 border-primary/30 shadow-md p-5 md:p-6 relative">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-[20px]">
                            home
                          </span>
                        </div>
                        <div>
                          <p className="font-headline-md text-[14px] md:text-[16px] font-semibold text-on-surface">
                            Home
                          </p>
                          <span className="inline-flex items-center gap-0.5 bg-secondary-container text-on-secondary-container font-label-caps text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                            <span className="material-symbols-outlined text-[9px]">
                              check
                            </span>
                            Default
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <button className="w-8 h-8 border border-outline-variant/40 rounded-full flex items-center justify-center hover:bg-surface-variant transition-colors">
                          <span className="material-symbols-outlined text-[15px] text-on-surface-variant">
                            edit
                          </span>
                        </button>
                        <button className="w-8 h-8 border border-outline-variant/40 rounded-full flex items-center justify-center hover:bg-error-container transition-colors">
                          <span className="material-symbols-outlined text-[15px] text-on-surface-variant hover:text-error">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <p className="font-body-md text-[13px] md:text-[14px] font-semibold text-on-surface">
                        Raqib Karim
                      </p>
                      <p className="font-body-md text-[12px] md:text-[13px] text-on-surface-variant">
                        House 12, Road 4, Block B
                      </p>
                      <p className="font-body-md text-[12px] md:text-[13px] text-on-surface-variant">
                        Bashundhara Residential Area
                      </p>
                      <p className="font-body-md text-[12px] md:text-[13px] text-on-surface-variant">
                        Dhaka 1229, Bangladesh
                      </p>
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="material-symbols-outlined text-on-surface-variant text-[14px]">
                          phone
                        </span>
                        <p className="font-body-md text-[12px] text-on-surface-variant">
                          +880 1712-345678
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Address 2 - Office */}
                  <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md p-5 md:p-6 relative hover:border-primary/30 transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center">
                          <span className="material-symbols-outlined text-tertiary text-[20px]">
                            work
                          </span>
                        </div>
                        <div>
                          <p className="font-headline-md text-[14px] md:text-[16px] font-semibold text-on-surface">
                            Office
                          </p>
                          <button className="font-label-caps text-[8px] text-on-surface-variant hover:text-primary transition-colors">
                            Set as Default
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <button className="w-8 h-8 border border-outline-variant/40 rounded-full flex items-center justify-center hover:bg-surface-variant transition-colors">
                          <span className="material-symbols-outlined text-[15px] text-on-surface-variant">
                            edit
                          </span>
                        </button>
                        <button className="w-8 h-8 border border-outline-variant/40 rounded-full flex items-center justify-center hover:bg-error-container transition-colors">
                          <span className="material-symbols-outlined text-[15px] text-on-surface-variant">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <p className="font-body-md text-[13px] md:text-[14px] font-semibold text-on-surface">
                        Raqib Karim
                      </p>
                      <p className="font-body-md text-[12px] md:text-[13px] text-on-surface-variant">
                        Level 5, TechHub Center
                      </p>
                      <p className="font-body-md text-[12px] md:text-[13px] text-on-surface-variant">
                        Motijheel Commercial Area
                      </p>
                      <p className="font-body-md text-[12px] md:text-[13px] text-on-surface-variant">
                        Dhaka 1000, Bangladesh
                      </p>
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="material-symbols-outlined text-on-surface-variant text-[14px]">
                          phone
                        </span>
                        <p className="font-body-md text-[12px] text-on-surface-variant">
                          +880 1712-345678
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Add new address card */}
                  <div className="border-2 border-dashed border-outline-variant/50 rounded-[20px] md:rounded-[24px] p-5 md:p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-primary/40 hover:bg-surface/50 transition-all cursor-pointer min-h-[200px] group">
                    <div className="w-12 h-12 rounded-2xl bg-surface-variant group-hover:bg-primary-fixed flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-[22px] transition-colors">
                        add_location_alt
                      </span>
                    </div>
                    <div>
                      <p className="font-headline-md text-[14px] md:text-[16px] text-on-surface font-semibold mb-1">
                        Add New Address
                      </p>
                      <p className="font-body-md text-[11px] md:text-[12px] text-on-surface-variant">
                        Add a new delivery location
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ━━━━━━━ TAB: SETTINGS ━━━━━━━ */}
              <div
                id="panel-settings"
                className={`tab-panel ${activeTab === "settings" ? "active" : ""} space-y-5 md:space-y-6`}
              >
                <div>
                  <span className="font-label-caps text-[9px] md:text-label-caps text-on-surface-variant tracking-widest">
                    ACCOUNT SETTINGS
                  </span>
                  <h2 className="font-display-xl text-[22px] md:text-[32px] leading-tight text-on-surface">
                    Profile Settings
                  </h2>
                </div>

                {/* Personal Info Form */}
                <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md p-5 md:p-7">
                  <h3 className="font-headline-md text-[15px] md:text-[18px] font-semibold text-on-surface mb-5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px] md:text-[20px]">
                      manage_accounts
                    </span>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-label-caps text-[9px] md:text-[10px] text-on-surface-variant uppercase tracking-widest block mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Raqib Karim"
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-2.5 font-body-md text-[13px] md:text-[14px] text-on-surface focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-label-caps text-[9px] md:text-[10px] text-on-surface-variant uppercase tracking-widest block mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Raqib"
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-2.5 font-body-md text-[13px] md:text-[14px] text-on-surface focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-label-caps text-[9px] md:text-[10px] text-on-surface-variant uppercase tracking-widest block mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue="raqib.karim@email.com"
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-2.5 font-body-md text-[13px] md:text-[14px] text-on-surface focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-label-caps text-[9px] md:text-[10px] text-on-surface-variant uppercase tracking-widest block mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        defaultValue="+880 1712-345678"
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-2.5 font-body-md text-[13px] md:text-[14px] text-on-surface focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-label-caps text-[9px] md:text-[10px] text-on-surface-variant uppercase tracking-widest block mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        defaultValue="1992-06-15"
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-2.5 font-body-md text-[13px] md:text-[14px] text-on-surface focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-label-caps text-[9px] md:text-[10px] text-on-surface-variant uppercase tracking-widest block mb-2">
                        Gender
                      </label>
                      <select className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-2.5 font-body-md text-[13px] md:text-[14px] text-on-surface focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors outline-none">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                        <option>Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end mt-5">
                    <button className="inline-flex items-center gap-2 bg-primary text-on-primary font-body-md text-[13px] md:text-body-md font-medium px-6 py-2.5 rounded-full hover:bg-primary/90 transition-colors shadow-sm">
                      <span className="material-symbols-outlined text-[16px]">
                        save
                      </span>
                      Save Changes
                    </button>
                  </div>
                </div>

                {/* Password Section */}
                <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md p-5 md:p-7">
                  <h3 className="font-headline-md text-[15px] md:text-[18px] font-semibold text-on-surface mb-5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px] md:text-[20px]">
                      lock
                    </span>
                    Change Password
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="font-label-caps text-[9px] md:text-[10px] text-on-surface-variant uppercase tracking-widest block mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-2.5 font-body-md text-[13px] md:text-[14px] text-on-surface focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-label-caps text-[9px] md:text-[10px] text-on-surface-variant uppercase tracking-widest block mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="At least 8 characters"
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-2.5 font-body-md text-[13px] md:text-[14px] text-on-surface focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-label-caps text-[9px] md:text-[10px] text-on-surface-variant uppercase tracking-widest block mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Repeat new password"
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-2.5 font-body-md text-[13px] md:text-[14px] text-on-surface focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-5">
                    <button className="inline-flex items-center gap-2 bg-primary text-on-primary font-body-md text-[13px] md:text-body-md font-medium px-6 py-2.5 rounded-full hover:bg-primary/90 transition-colors shadow-sm">
                      <span className="material-symbols-outlined text-[16px]">
                        lock_reset
                      </span>
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md p-5 md:p-7">
                  <h3 className="font-headline-md text-[15px] md:text-[18px] font-semibold text-on-surface mb-5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px] md:text-[20px]">
                      notifications
                    </span>
                    Notification Preferences
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-body-md text-[13px] md:text-[14px] font-semibold text-on-surface">
                          Order Updates
                        </p>
                        <p className="font-body-md text-[11px] md:text-[12px] text-on-surface-variant">
                          Get notified about your order status changes
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="sr-only peer"
                        />
                        <div className="w-10 h-6 bg-surface-variant peer-checked:bg-primary rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-primary/30">
                          <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4"></div>
                        </div>
                      </label>
                    </div>
                    <div className="h-px bg-outline-variant/20"></div>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-body-md text-[13px] md:text-[14px] font-semibold text-on-surface">
                          Promotions & Deals
                        </p>
                        <p className="font-body-md text-[11px] md:text-[12px] text-on-surface-variant">
                          Receive alerts for exclusive offers and discounts
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="sr-only peer"
                        />
                        <div className="w-10 h-6 bg-surface-variant peer-checked:bg-primary rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-primary/30">
                          <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4"></div>
                        </div>
                      </label>
                    </div>
                    <div className="h-px bg-outline-variant/20"></div>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-body-md text-[13px] md:text-[14px] font-semibold text-on-surface">
                          New Products
                        </p>
                        <p className="font-body-md text-[11px] md:text-[12px] text-on-surface-variant">
                          Be the first to know about new arrivals
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-10 h-6 bg-surface-variant peer-checked:bg-primary rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-primary/30">
                          <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4"></div>
                        </div>
                      </label>
                    </div>
                    <div className="h-px bg-outline-variant/20"></div>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-body-md text-[13px] md:text-[14px] font-semibold text-on-surface">
                          Newsletter
                        </p>
                        <p className="font-body-md text-[11px] md:text-[12px] text-on-surface-variant">
                          Weekly digest of recipes and spice tips
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="sr-only peer"
                        />
                        <div className="w-10 h-6 bg-surface-variant peer-checked:bg-primary rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-primary/30">
                          <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4"></div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-error/20 shadow-md p-5 md:p-7">
                  <h3 className="font-headline-md text-[15px] md:text-[18px] font-semibold text-error mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                      warning
                    </span>
                    Danger Zone
                  </h3>
                  <p className="font-body-md text-[12px] md:text-[13px] text-on-surface-variant mb-4">
                    Once you delete your account, all your data, order history,
                    and loyalty points will be permanently removed and cannot be
                    recovered.
                  </p>
                  <button className="inline-flex items-center gap-1.5 border border-error text-error font-body-md text-[12px] md:text-[13px] font-medium px-5 py-2 rounded-full hover:bg-error hover:text-on-error transition-all">
                    <span className="material-symbols-outlined text-[15px]">
                      delete_forever
                    </span>
                    Delete My Account
                  </button>
                </div>
              </div>
            </div>
            {/* end main content */}
          </div>
          {/* end grid */}
        </div>
        {/* end max-w-7xl */}
      </section>
    </>
  );
}
