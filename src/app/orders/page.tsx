"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

/* ─── DATA ─── */
const ORDERS_DATA = [
  {
    id: "#SHC-2024-7891",
    status: "active",
    statusLabel: "In Transit",
    date: "Jun 1, 2024",
    itemCount: 3,
    total: 797,
    shipping: "FREE shipping",
    color: "bg-tertiary",
    icon: "local_shipping",
    items: [
      { name: "Biryani Masala", qty: 2, price: 398, icon: "local_fire_department", gradient: "from-primary-fixed to-primary-container/50", iconColor: "text-primary" },
      { name: "Yellow Moong Dal", qty: 1, price: 149, icon: "set_meal", gradient: "from-secondary-fixed to-secondary-fixed-dim/50", iconColor: "text-secondary" },
      { name: "Green Cardamom", qty: 1, price: 349, icon: "spa", gradient: "from-tertiary-fixed to-tertiary-container", iconColor: "text-tertiary" },
    ],
    eta: "Est. Jun 3–4, 2024",
    tracking: "Via Pathao · PTC-9823-DK2",
    step: 3, // 1: Confirmed, 2: Processing, 3: Shipped, 4: Out for Delivery, 5: Delivered
  },
  {
    id: "#SHC-2024-7654",
    status: "active",
    statusLabel: "Out for Delivery",
    date: "May 28, 2024",
    itemCount: 4,
    total: 1240,
    savings: 180,
    color: "bg-secondary",
    icon: "pedal_bike",
    items: [
      { name: "Turmeric Powder", qty: 2, price: 280, icon: "grain", gradient: "from-primary-fixed to-primary-container/50", iconColor: "text-primary" },
      { name: "Coriander Seeds", qty: 1, price: 320, icon: "eco", gradient: "from-secondary-fixed to-secondary-fixed-dim/50", iconColor: "text-secondary" },
      { name: "Chana Dal", qty: 1, price: 295, icon: "breakfast_dining", gradient: "from-tertiary-fixed to-tertiary-container", iconColor: "text-tertiary" },
      { name: "+1 more", qty: 0, price: 0, icon: "more_horiz", gradient: "bg-surface-container", iconColor: "text-on-surface-variant", isMore: true },
    ],
    eta: "Arriving Today",
    step: 4,
  },
  {
    id: "#SHC-2024-7421",
    status: "delivered",
    statusLabel: "Delivered",
    date: "May 10, 2024",
    deliveredDate: "May 13",
    itemCount: 2,
    total: 935,
    color: "bg-primary/40",
    icon: "check_circle",
    items: [
      { name: "Cashew Nuts", qty: 1, price: 590, icon: "nutrition", gradient: "from-primary-fixed to-primary-container/50", iconColor: "text-primary" },
      { name: "Garam Masala", qty: 2, price: 345, icon: "kitchen", gradient: "from-secondary-fixed to-secondary-fixed-dim/50", iconColor: "text-secondary" },
    ],
    location: "Uttara, Dhaka",
    rated: 4, // 1-5
  },
  {
    id: "#SHC-2024-7103",
    status: "delivered",
    statusLabel: "Delivered",
    date: "Apr 22, 2024",
    deliveredDate: "Apr 25",
    itemCount: 3,
    total: 476,
    color: "bg-primary/40",
    icon: "check_circle",
    items: [
      { name: "Bay Leaves", qty: 3, price: 180, icon: "spa", gradient: "from-tertiary-fixed to-tertiary-container", iconColor: "text-tertiary" },
      { name: "Red Chilli", qty: 2, price: 296, icon: "local_fire_department", gradient: "from-primary-fixed to-primary-container/50", iconColor: "text-primary" },
    ],
    rated: 5,
  },
  {
    id: "#SHC-2024-6880",
    status: "cancelled",
    statusLabel: "Cancelled",
    date: "Apr 5, 2024",
    itemCount: 2,
    total: 393,
    color: "bg-error/50",
    icon: "cancel",
    items: [
      { name: "Black Pepper", qty: 1, price: 248, icon: "set_meal", gradient: "from-secondary-fixed to-secondary-fixed-dim/50", iconColor: "text-secondary" },
      { name: "Cumin Seeds", qty: 1, price: 145, icon: "grain", gradient: "from-primary-fixed to-primary-container/50", iconColor: "text-primary" },
    ],
    refundInfo: "Refund of ৳393 processed via bKash",
    refundDate: "Apr 6, 2024",
    refundRef: "BKH-4421-7713",
    cancelReason: "Cancelled by you on Apr 5, 2024",
  },
];

export default function OrderListPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = useMemo(() => {
    return ORDERS_DATA.filter((order) => {
      const matchesTab = activeTab === "all" || order.status === activeTab;
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
      <style jsx global>{`
        .action-btn { transition: background 0.18s, color 0.18s, border-color 0.18s; }
        .action-btn:hover .btn-icon { transform: translateX(2px); transition: transform 0.2s; }
        .tab-pill.active { background-color: #9f4122; color: #ffffff; border-color: transparent; }
        .tab-pill:not(.active) { background-color: transparent; }
        .order-card { transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s; }
        .order-card:hover { box-shadow: 0 12px 40px rgba(159,65,34,0.10); transform: translateY(-2px); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.45s ease both; }
        .fade-up:nth-child(1) { animation-delay: 0.05s; }
        .fade-up:nth-child(2) { animation-delay: 0.12s; }
        .fade-up:nth-child(3) { animation-delay: 0.19s; }
        .fade-up:nth-child(4) { animation-delay: 0.26s; }
        .fade-up:nth-child(5) { animation-delay: 0.33s; }
        .search-box:focus-within { border-color: #9f4122; box-shadow: 0 0 0 3px rgba(159,65,34,0.10); }
        .tab-scroll::-webkit-scrollbar { display: none; }
        .tab-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <main className="max-w-[1728px] mx-auto w-full">
        {/* ─── PAGE HEADER ─── */}
        <section className="pt-28 md:pt-40 pb-6 md:pb-10 px-6 md:px-container-padding">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[11px] md:text-[13px] text-on-surface-variant mb-5 md:mb-6">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="material-symbols-outlined text-[14px] md:text-[16px]">chevron_right</span>
              <span className="text-on-surface font-medium">My Orders</span>
            </div>

            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="font-display-xl text-[26px] md:text-headline-lg text-on-surface tracking-tight mb-1.5">My Orders</h1>
                <p className="text-[12px] md:text-[14px] text-on-surface-variant">
                  Showing <span className="font-medium text-on-surface">{filteredOrders.length} orders</span> · Last updated today at 9:41 AM
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="inline-flex items-center gap-1.5 border border-outline-variant/60 text-on-surface-variant hover:text-on-surface hover:border-outline text-[11px] md:text-[13px] font-medium px-3 md:px-4 py-1.5 md:py-2 rounded-full transition-colors bg-surface">
                  <span className="material-symbols-outlined text-[15px] md:text-[17px]">tune</span>
                  <span className="hidden sm:inline">Filter</span>
                </button>
                <button className="inline-flex items-center gap-1.5 border border-outline-variant/60 text-on-surface-variant hover:text-on-surface hover:border-outline text-[11px] md:text-[13px] font-medium px-3 md:px-4 py-1.5 md:py-2 rounded-full transition-colors bg-surface">
                  <span className="material-symbols-outlined text-[15px] md:text-[17px]">sort</span>
                  <span className="hidden sm:inline">Sort</span>
                </button>
                <Link href="/products" className="inline-flex items-center gap-1.5 bg-primary text-on-primary text-[11px] md:text-[13px] font-medium px-3 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-primary/90 transition-colors">
                  <span className="material-symbols-outlined text-[15px] md:text-[17px]">add_shopping_cart</span>
                  <span className="hidden sm:inline">Shop Again</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── MAIN CONTENT ─── */}
        <section className="pb-12 md:pb-section-gap px-6 md:px-container-padding">
          <div className="max-w-7xl mx-auto">
            {/* ── SEARCH + TABS BAR ── */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-6 md:mb-8">
              {/* Search */}
              <div className="search-box flex items-center gap-2.5 bg-surface border border-outline-variant/50 rounded-full px-4 py-2.5 md:py-3 flex-1 max-w-full md:max-w-sm transition-all">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px] md:text-[20px] shrink-0">search</span>
                <input
                  type="text"
                  placeholder="Search orders, products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-[13px] md:text-body-md text-on-surface placeholder:text-outline outline-none min-w-0"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-outline hover:text-on-surface-variant transition-colors">
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
              </div>

              {/* Status Tabs */}
              <div className="tab-scroll flex items-center gap-1.5 overflow-x-auto pb-0.5 md:pb-0">
                {["all", "active", "delivered", "cancelled"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`tab-pill shrink-0 text-[11px] md:text-[13px] font-semibold px-4 py-1.5 rounded-full border border-outline-variant/40 transition-all whitespace-nowrap ${
                      activeTab === tab ? "active text-on-primary" : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}{" "}
                    <span className={`ml-0.5 ${activeTab === tab ? "opacity-75" : "opacity-60"}`}>
                      ({ORDERS_DATA.filter((o) => tab === "all" || o.status === tab).length})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── STATS STRIP ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="bg-surface rounded-[16px] md:rounded-[20px] border border-outline-variant/40 px-4 py-3.5 md:px-5 md:py-4">
                <p className="text-[10px] md:text-label-caps text-on-surface-variant uppercase tracking-widest mb-1.5">Total Orders</p>
                <p className="font-bold text-[24px] md:text-[28px] text-on-surface tracking-tight">5</p>
              </div>
              <div className="bg-surface rounded-[16px] md:rounded-[20px] border border-outline-variant/40 px-4 py-3.5 md:px-5 md:py-4">
                <p className="text-[10px] md:text-label-caps text-on-surface-variant uppercase tracking-widest mb-1.5">Total Spent</p>
                <p className="font-bold text-[24px] md:text-[28px] text-on-surface tracking-tight">৳3,841</p>
              </div>
              <div className="bg-surface rounded-[16px] md:rounded-[20px] border border-outline-variant/40 px-4 py-3.5 md:px-5 md:py-4">
                <p className="text-[10px] md:text-label-caps text-on-surface-variant uppercase tracking-widest mb-1.5">Active</p>
                <p className="font-bold text-[24px] md:text-[28px] text-tertiary tracking-tight">2</p>
              </div>
              <div className="bg-surface rounded-[16px] md:rounded-[20px] border border-outline-variant/40 px-4 py-3.5 md:px-5 md:py-4">
                <p className="text-[10px] md:text-label-caps text-on-surface-variant uppercase tracking-widest mb-1.5">Savings</p>
                <p className="font-bold text-[24px] md:text-[28px] text-secondary tracking-tight">৳420</p>
              </div>
            </div>

            {/* ── ORDER CARDS LIST ── */}
            <div className="flex flex-col gap-4 md:gap-5" id="order-list">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className={`order-card fade-up bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden ${
                    order.status === "cancelled" ? "opacity-80" : ""
                  }`}
                >
                  <div className={`h-1 w-full ${order.color}`}></div>

                  <div className="p-5 md:p-7">
                    {/* Order Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-[12px] flex items-center justify-center shrink-0 ${
                          order.status === "active" ? "bg-tertiary-fixed" : 
                          order.status === "delivered" ? "bg-primary/10" : "bg-error-container"
                        }`}>
                          <span className={`material-symbols-outlined text-[20px] md:text-[24px] ${
                            order.status === "active" ? "text-tertiary" : 
                            order.status === "delivered" ? "text-primary" : "text-error"
                          }`}>
                            {order.icon}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="font-bold text-[14px] md:text-body-md text-on-surface">{order.id}</h2>
                            <span className={`inline-flex items-center gap-1 text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                              order.status === "active" ? "bg-tertiary-fixed/60 text-on-tertiary-container border-tertiary-container/40" : 
                              order.status === "delivered" ? "bg-primary/8 text-primary border-primary/20" : "bg-error-container/60 text-on-error-container border-error/20"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full inline-block ${
                                order.status === "active" ? "bg-tertiary animate-pulse" : 
                                order.status === "delivered" ? "bg-primary" : "bg-error"
                              }`}></span>
                              {order.statusLabel}
                            </span>
                          </div>
                          <p className="text-[11px] md:text-[13px] text-on-surface-variant mt-0.5">
                            Placed {order.date} {order.deliveredDate ? `· Delivered ${order.deliveredDate}` : `· ${order.itemCount} items`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`font-bold text-[22px] md:text-[26px] tracking-tight ${order.status === 'cancelled' ? 'text-on-surface-variant line-through decoration-error/60' : 'text-on-surface'}`}>৳{order.total}</p>
                        <p className={`text-[10px] md:text-[12px] font-medium ${order.status === 'cancelled' ? 'text-error' : 'text-secondary'}`}>
                          {order.shipping || (order.savings ? `Saved ৳${order.savings}` : (order.status === 'cancelled' ? 'Refunded' : `${order.itemCount} items`))}
                        </p>
                      </div>
                    </div>

                    {/* Items preview strip */}
                    <div className="flex gap-2 md:gap-3 mb-4 md:mb-5 overflow-x-auto pb-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className={`flex items-center gap-2 bg-surface-container-low rounded-[12px] border border-outline-variant/25 px-3 py-2 shrink-0 ${order.status === 'cancelled' ? 'opacity-60' : ''}`}>
                          <div className={`w-8 h-8 md:w-9 md:h-9 rounded-[8px] flex items-center justify-center shrink-0 ${item.gradient} bg-gradient-to-br`}>
                            <span className={`material-symbols-outlined text-[15px] md:text-[17px] ${item.iconColor}`}>{item.icon}</span>
                          </div>
                          <div>
                            <p className="font-medium text-[11px] md:text-[12px] text-on-surface leading-tight">{item.name}</p>
                            {!item.isMore && <p className="text-[9px] md:text-[10px] text-on-surface-variant">×{item.qty} · ৳{item.price}</p>}
                            {item.isMore && <p className="text-[9px] md:text-[10px] text-on-surface-variant">item</p>}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tracker (only for active) */}
                    {order.status === "active" && (
                      <div className="flex items-center gap-0 mb-5">
                        {[
                          { label: "Confirmed", icon: "check", step: 1 },
                          { label: "Processing", icon: "check", step: 2 },
                          { label: "Shipped", icon: "local_shipping", step: 3 },
                          { label: "Out for Del.", icon: "pedal_bike", step: 4 },
                          { label: "Delivered", icon: "home", step: 5 },
                        ].map((s, idx, arr) => (
                          <React.Fragment key={idx}>
                            <div className="flex flex-col items-center gap-1">
                              {order.step > s.step ? (
                                <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-primary flex items-center justify-center">
                                  <span className="material-symbols-outlined text-on-primary text-[11px] md:text-[13px]">{s.icon === 'check' ? 'check' : s.icon}</span>
                                </div>
                              ) : order.step === s.step ? (
                                <div className="relative w-6 h-6 md:w-7 md:h-7">
                                  <span className={`absolute inset-0 rounded-full animate-ping ${order.step >= 4 ? 'bg-secondary/25' : 'bg-primary/25'}`}></span>
                                  <div className={`relative w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center ${order.step >= 4 ? 'bg-secondary' : 'bg-primary'}`}>
                                    <span className={`material-symbols-outlined text-white text-[11px] md:text-[13px]`}>{s.icon}</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-surface border-2 border-outline-variant/50 flex items-center justify-center">
                                  <span className="material-symbols-outlined text-on-surface-variant text-[10px] md:text-[12px]">{s.icon}</span>
                                </div>
                              )}
                              <p className={`text-[8px] md:text-[9px] text-center whitespace-nowrap ${order.step === s.step ? (order.step >= 4 ? 'text-secondary font-bold' : 'text-primary font-bold') : (order.step > s.step ? 'text-on-surface-variant' : 'text-outline')}`}>
                                {s.label}
                              </p>
                            </div>
                            {idx < arr.length - 1 && (
                              <div className={`flex-1 h-0.5 mb-3 mx-1 ${order.step > s.step ? 'bg-primary' : 'bg-outline-variant/40'}`}></div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}

                    {/* Delivered Rating */}
                    {order.status === "delivered" && order.rated === 4 && (
                      <div className="flex items-center gap-3 p-3 md:p-4 rounded-[14px] border border-dashed border-outline-variant/50 bg-surface-container/30 mb-4">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className="material-symbols-outlined text-[18px] md:text-[20px]"
                              style={{ color: star <= 4 ? "#9f4122" : "#ddc0b8", fontVariationSettings: star <= 4 ? "'FILL' 1" : "" }}
                            >
                              star
                            </span>
                          ))}
                        </div>
                        <div className="flex-1">
                          <p className="text-[12px] md:text-[13px] text-on-surface font-medium">How was your order?</p>
                          <p className="text-[10px] md:text-[11px] text-on-surface-variant">Tap to leave a review</p>
                        </div>
                        <button className="text-[11px] md:text-[13px] bg-primary text-on-primary font-medium px-3 py-1.5 rounded-full hover:bg-primary/90 transition-colors">
                          Rate
                        </button>
                      </div>
                    )}

                    {/* Cancelled Refund Info */}
                    {order.status === "cancelled" && (
                      <div className="flex items-center gap-3 p-3 rounded-[12px] bg-error-container/20 border border-error/10 mb-4">
                        <span className="material-symbols-outlined text-error text-[18px]">account_balance_wallet</span>
                        <div className="flex-1">
                          <p className="text-[11px] md:text-[12px] text-on-surface font-medium">{order.refundInfo}</p>
                          <p className="text-[10px] md:text-[11px] text-on-surface-variant">Credited on {order.refundDate} · Ref: {order.refundRef}</p>
                        </div>
                      </div>
                    )}

                    {/* Card Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-outline-variant/25">
                      <div className="flex items-center gap-2">
                        {order.status === "active" && (
                          <div className="flex items-center gap-1.5 bg-secondary-fixed/20 border border-secondary-fixed/50 rounded-full px-3 py-1.5">
                            <span className="material-symbols-outlined text-secondary text-[13px]">schedule</span>
                            <span className="text-[11px] md:text-[12px] font-semibold text-on-surface">{order.eta}</span>
                          </div>
                        )}
                        {order.status === "delivered" && (
                          <p className="text-[11px] md:text-[12px] text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">{order.rated === 5 ? 'star' : 'check_circle'}</span>
                            {order.rated === 5 ? 'You rated this order · 5 stars' : `Delivered to ${order.location} on ${order.deliveredDate}`}
                          </p>
                        )}
                        {order.status === "cancelled" && (
                          <p className="text-[11px] md:text-[12px] text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">info</span>
                            {order.cancelReason}
                          </p>
                        )}
                        {order.tracking && <span className="text-[10px] md:text-[11px] text-on-surface-variant hidden sm:inline">{order.tracking}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="inline-flex items-center gap-1.5 border border-outline-variant/60 text-on-surface-variant hover:text-on-surface hover:border-outline text-[11px] md:text-[13px] font-medium px-3 md:px-4 py-1.5 rounded-full transition-colors bg-surface">
                          <span className="material-symbols-outlined text-[14px]">{order.status === "cancelled" ? "replay" : (order.status === "delivered" ? "replay" : "support_agent")}</span>
                          {order.status === "active" ? "Help" : (order.status === "delivered" ? "Buy Again" : (order.status === "cancelled" ? "Reorder" : "Help"))}
                        </button>
                        <Link href="/orders/details" className="inline-flex items-center gap-1.5 bg-primary text-on-primary text-[11px] md:text-[13px] font-medium px-4 md:px-5 py-1.5 rounded-full hover:bg-primary/90 transition-colors">
                          View Details
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── LOAD MORE ── */}
            <div className="flex flex-col items-center gap-3 mt-8 md:mt-10">
              <p className="text-[12px] md:text-[13px] text-on-surface-variant">Showing {filteredOrders.length} of 5 orders</p>
              <div className="w-full max-w-xs bg-surface-container-low rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${(filteredOrders.length / 5) * 100}%` }}></div>
              </div>
              <p className="text-[11px] text-outline">
                {filteredOrders.length === 5 ? "You've reached the end · All orders loaded" : "Filtering results..."}
              </p>
            </div>

            {/* ── PROMOTIONAL BANNER ── */}
            <div className="mt-10 md:mt-14 bg-primary rounded-[20px] md:rounded-[24px] p-6 md:p-8 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 border-[20px] border-white/10 rounded-full"></div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 border-[12px] border-black/5 rounded-full"></div>
              <div className="absolute top-4 right-20 w-10 h-10 border-[6px] border-white/8 rounded-full hidden md:block"></div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-primary text-[16px]">local_offer</span>
                    </div>
                    <span className="text-[10px] md:text-label-caps text-on-primary/70 font-bold uppercase tracking-widest">Loyalty Reward</span>
                  </div>
                  <p className="font-bold text-[18px] md:text-[22px] text-on-primary mb-1">You&apos;ve earned 385 Spice Points!</p>
                  <p className="text-[12px] md:text-[14px] text-on-primary/75">Redeem on your next order for up to ৳192 off.</p>
                </div>
                <Link href="#" className="inline-flex items-center gap-2 bg-surface text-primary font-semibold text-[13px] md:text-body-md px-5 md:px-6 py-2.5 md:py-3 rounded-full hover:bg-primary-fixed transition-colors shrink-0">
                  Redeem Now
                  <span className="material-symbols-outlined text-[16px] md:text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
