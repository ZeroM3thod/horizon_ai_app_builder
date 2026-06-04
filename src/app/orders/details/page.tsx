"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function OrderDetailsPage() {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText("SHC-2024-7891").then(() => triggerToast("Order ID copied!"));
  };

  const copyTracking = () => {
    navigator.clipboard.writeText("PTC-9823-DK2").then(() => triggerToast("Tracking number copied!"));
  };

  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
      <style jsx global>{`
        .action-btn { transition: background 0.18s, color 0.18s, border-color 0.18s; }
        .action-btn:hover .btn-icon { transform: translateX(2px); transition: transform 0.2s; }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.8; }
          70%, 100% { transform: scale(1.6); opacity: 0; }
        }
        .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
      `}</style>

      {/* Toast Notification */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1d1c15] text-[#fff9ee] px-5 py-2.5 rounded-full font-medium text-[13px] z-[9999] shadow-lg transition-all duration-300 ${
          showToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {toastMsg}
      </div>

      <main className="max-w-[1728px] mx-auto w-full">
        {/* ─── PAGE HEADER ─── */}
        <section className="pt-28 md:pt-40 pb-6 md:pb-10 px-6 md:px-container-padding">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[11px] md:text-[13px] text-on-surface-variant mb-5 md:mb-6">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="material-symbols-outlined text-[14px] md:text-[16px]">chevron_right</span>
              <Link href="/orders" className="hover:text-primary transition-colors">My Orders</Link>
              <span className="material-symbols-outlined text-[14px] md:text-[16px]">chevron_right</span>
              <span className="text-on-surface font-medium">#SHC-2024-7891</span>
            </div>

            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <h1 className="font-display-xl text-[26px] md:text-headline-lg text-on-surface tracking-tight">Order Details</h1>
                  <span className="inline-flex items-center gap-1.5 bg-tertiary-fixed/60 text-on-tertiary-container text-[10px] md:text-label-caps font-bold px-2.5 md:px-3 py-1 md:py-1.5 rounded-full border border-tertiary-container/40 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse inline-block"></span>
                    In Transit
                  </span>
                </div>
                <p className="text-[12px] md:text-[14px] text-on-surface-variant">Order <span className="font-medium text-on-surface">#SHC-2024-7891</span> · Placed on Saturday, June 1, 2024 · 3 items</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={copyOrderId} className="inline-flex items-center gap-1.5 border border-outline-variant/60 text-on-surface-variant hover:text-on-surface hover:border-outline text-[11px] md:text-[13px] font-medium px-3 md:px-4 py-1.5 md:py-2 rounded-full transition-colors bg-surface">
                  <span className="material-symbols-outlined text-[15px] md:text-[17px]">content_copy</span>
                  <span className="hidden sm:inline">Copy ID</span>
                </button>
                <button className="inline-flex items-center gap-1.5 border border-outline-variant/60 text-on-surface-variant hover:text-primary hover:border-primary text-[11px] md:text-[13px] font-medium px-3 md:px-4 py-1.5 md:py-2 rounded-full transition-colors bg-surface">
                  <span className="material-symbols-outlined text-[15px] md:text-[17px]">download</span>
                  <span className="hidden sm:inline">Invoice</span>
                </button>
                <button className="inline-flex items-center gap-1.5 bg-primary text-on-primary text-[11px] md:text-[13px] font-medium px-3 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-primary/90 transition-colors">
                  <span className="material-symbols-outlined text-[15px] md:text-[17px]">share</span>
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── MAIN CONTENT GRID ─── */}
        <section className="pb-12 md:pb-section-gap px-6 md:px-container-padding">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-7">
            {/* ── LEFT COLUMN ── */}
            <div className="lg:col-span-2 flex flex-col gap-5 md:gap-6">
              {/* ─ TRACKING CARD ─ */}
              <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md p-5 md:p-8">
                <div className="flex items-center justify-between mb-5 md:mb-7">
                  <h2 className="font-headline-md text-[16px] md:text-headline-md text-on-surface">Track Shipment</h2>
                  <Link href="#" className="inline-flex items-center gap-1 text-primary text-[12px] md:text-[14px] font-medium hover:underline underline-offset-4">
                    <span className="material-symbols-outlined text-[15px] md:text-[17px]">open_in_new</span>
                    Live Tracking
                  </Link>
                </div>

                <div className="flex items-center gap-3 bg-surface-container-low rounded-[14px] md:rounded-[16px] px-4 py-3 md:px-5 md:py-3.5 mb-6 md:mb-8 border border-outline-variant/30">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-tertiary-fixed flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-tertiary text-[18px] md:text-[20px]">local_shipping</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[12px] md:text-body-md text-on-surface">Pathao Courier</p>
                    <p className="text-[10px] md:text-[12px] text-on-surface-variant font-mono tracking-wide mt-0.5">PTC-9823-DK2</p>
                  </div>
                  <button onClick={copyTracking} className="text-[11px] md:text-[13px] text-primary font-semibold border border-primary/30 rounded-full px-3 py-1 hover:bg-primary/8 transition-colors shrink-0 bg-surface">
                    Copy
                  </button>
                </div>

                {/* Desktop Stepper */}
                <div className="hidden md:block relative pb-2 mb-2">
                  <div className="absolute top-[20px] left-[10%] w-[80%] h-0.5 bg-surface-variant z-0"></div>
                  <div className="absolute top-[20px] left-[10%] h-0.5 bg-primary z-0" style={{ width: "40%" }}></div>
                  <div className="flex justify-between items-start">
                    {[
                      { label: "Order Confirmed", date: "Jun 1, 9:23 AM", icon: "check", completed: true },
                      { label: "Processing", date: "Jun 1, 11:45 AM", icon: "check", completed: true },
                      { label: "Shipped", date: "Jun 2, 8:00 AM", icon: "local_shipping", current: true },
                      { label: "Out for Delivery", date: "Est. Jun 3", icon: "pedal_bike" },
                      { label: "Delivered", date: "Est. Jun 3–4", icon: "home" },
                    ].map((step, idx) => (
                      <div key={idx} className="flex flex-col items-center" style={{ width: "20%" }}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 relative ${
                          step.completed ? "bg-primary shadow-md" : step.current ? "bg-primary border-[3px] border-primary-fixed shadow-lg" : "bg-surface border-2 border-outline-variant/50"
                        }`}>
                          {step.current && <span className="absolute inset-0 rounded-full bg-primary/25 animate-ping-slow"></span>}
                          <span className={`material-symbols-outlined ${step.completed || step.current ? "text-on-primary" : "text-on-surface-variant"} ${step.current ? "text-[16px]" : "text-[18px]"}`}>
                            {step.icon}
                          </span>
                        </div>
                        <p className={`font-semibold text-[11px] text-center mt-2 leading-tight px-1 ${step.current ? "text-primary font-bold" : "text-on-surface"}`}>{step.label}</p>
                        <p className="text-[10px] text-on-surface-variant text-center mt-0.5">{step.date}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Stepper */}
                <div className="md:hidden flex flex-col mb-2">
                  {[
                    { label: "Order Confirmed", date: "Jun 1, 2024 · 9:23 AM", icon: "check", completed: true },
                    { label: "Processing", date: "Jun 1, 2024 · 11:45 AM", icon: "check", completed: true },
                    { label: "Shipped · In Transit", date: "Jun 2, 2024 · 8:00 AM", sub: "Last scan: Dhaka Sorting Hub", icon: "local_shipping", current: true },
                    { label: "Out for Delivery", date: "Est. Jun 3, 2024", icon: "pedal_bike" },
                    { label: "Delivered", date: "Est. Jun 3–4, 2024", icon: "home", last: true },
                  ].map((step, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="flex flex-col items-center shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center relative ${step.completed || step.current ? "bg-primary" : "bg-surface-container border-2 border-outline-variant/40"}`}>
                          {step.current && <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping"></span>}
                          <span className={`material-symbols-outlined text-[14px] ${step.completed || step.current ? "text-on-primary" : "text-on-surface-variant"}`}>
                            {step.icon}
                          </span>
                        </div>
                        {!step.last && <div className={`w-px h-8 mt-1 ${step.completed ? "bg-primary" : "bg-outline-variant/30"}`}></div>}
                      </div>
                      <div className={`pt-1 ${!step.last ? "pb-4" : ""}`}>
                        <p className={`font-semibold text-[13px] ${step.current ? "text-primary font-bold" : "text-on-surface"}`}>{step.label}</p>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">{step.date}</p>
                        {step.sub && <p className="text-[11px] text-on-surface-variant/70 mt-0.5">{step.sub}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 md:mt-6 flex items-center gap-3 bg-secondary-fixed/20 border border-secondary-fixed/50 rounded-[14px] md:rounded-[16px] px-4 py-3 md:px-5 md:py-4">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-secondary-container text-[17px] md:text-[19px]">schedule</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[12px] md:text-body-md text-on-surface">
                      Expected delivery: <span className="text-secondary">Tue Jun 3 – Wed Jun 4</span>
                    </p>
                    <p className="text-[10px] md:text-[12px] text-on-surface-variant mt-0.5">Your package is moving from Dhaka Sorting Hub to Gazipur</p>
                  </div>
                </div>
              </div>

              {/* ─ ORDER ITEMS CARD ─ */}
              <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md p-5 md:p-8">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h2 className="font-headline-md text-[16px] md:text-headline-md text-on-surface">
                    Order Items <span className="text-on-surface-variant text-[13px] md:text-[16px] font-normal ml-1">(3)</span>
                  </h2>
                  <Link href="/products" className="text-primary text-[12px] md:text-[14px] font-medium hover:underline underline-offset-4">Buy Again</Link>
                </div>
                <div className="flex flex-col gap-3 md:gap-4">
                  {[
                    { name: "Biryani Masala", sub: "100g · Restaurant Grade", qty: 2, price: 199, total: 398, icon: "local_fire_department", grad: "from-primary-fixed to-primary-container/50", iconCol: "text-primary" },
                    { name: "Yellow Moong Dal", sub: "1kg · Premium Washed", qty: 1, price: 149, total: 149, icon: "set_meal", grad: "from-secondary-fixed to-secondary-fixed-dim/50", iconCol: "text-secondary", off: "19% OFF", oldPrice: 185 },
                    { name: "Green Cardamom", sub: "50g · Kerala Origin", qty: 1, price: 349, total: 349, icon: "spa", grad: "from-tertiary-fixed to-tertiary-container", iconCol: "text-tertiary" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-[14px] md:rounded-[16px] bg-surface-container-low border border-outline-variant/20 hover:border-outline-variant/60 transition-colors">
                      <div className={`w-14 h-14 md:w-[72px] md:h-[72px] rounded-[12px] md:rounded-[14px] bg-gradient-to-br ${item.grad} flex items-center justify-center shrink-0`}>
                        <span className={`material-symbols-outlined ${item.iconCol} text-[22px] md:text-[28px]`}>{item.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[13px] md:text-body-md text-on-surface">{item.name}</p>
                        <p className="text-[11px] md:text-[13px] text-on-surface-variant mt-0.5">{item.sub}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="bg-surface-container text-on-surface-variant border border-outline-variant/40 rounded-full text-[10px] md:text-[11px] px-2.5 py-0.5 font-medium">Qty: {item.qty}</span>
                          {item.off && <span className="bg-secondary-container/30 text-on-secondary-container rounded-full text-[10px] md:text-[11px] px-2.5 py-0.5 font-medium">{item.off}</span>}
                          {!item.off && <span className="text-[10px] md:text-[11px] text-on-surface-variant">৳{item.price} each</span>}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-[16px] md:text-[20px] text-on-surface">৳{item.total}</p>
                        {item.oldPrice && <p className="text-[10px] md:text-[12px] text-on-surface-variant line-through mt-0.5">৳{item.oldPrice}</p>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 md:mt-5 flex items-center gap-3 p-3 md:p-4 rounded-[14px] border border-dashed border-outline-variant/50 bg-surface-container/40">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-outline text-[16px]">star</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] md:text-[13px] text-on-surface-variant font-medium">Rate your products</p>
                    <p className="text-[10px] md:text-[12px] text-outline">Available after delivery</p>
                  </div>
                  <button disabled className="text-[11px] md:text-[13px] bg-surface-container text-outline font-medium px-3 py-1.5 rounded-full cursor-not-allowed opacity-60">Leave a Review</button>
                </div>
              </div>

              {/* ─ ACTIVITY LOG CARD ─ */}
              <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md p-5 md:p-8">
                <h2 className="font-headline-md text-[16px] md:text-headline-md text-on-surface mb-5 md:mb-6">Activity Log</h2>
                <div className="flex flex-col">
                  {[
                    { title: "Package dispatched · Dhaka Sorting Hub", time: "Jun 2, 2024 · 8:00 AM", icon: "local_shipping", col: "text-tertiary", bg: "bg-tertiary-fixed" },
                    { title: "Order packed and quality-checked", time: "Jun 1, 2024 · 11:45 AM", icon: "inventory_2" },
                    { title: "Payment confirmed · bKash", time: "Jun 1, 2024 · 9:25 AM · Ref: BKH-9823-4521", icon: "payments" },
                    { title: "Order placed successfully", time: "Jun 1, 2024 · 9:23 AM", icon: "check_circle", col: "text-primary", bg: "bg-primary/12", last: true },
                  ].map((log, i) => (
                    <div key={i} className="flex gap-3 md:gap-4 items-start">
                      <div className="flex flex-col items-center shrink-0">
                        <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center ${log.bg || "bg-surface-container"}`}>
                          <span className={`material-symbols-outlined ${log.col || "text-on-surface-variant"} text-[14px] md:text-[16px]`}>{log.icon}</span>
                        </div>
                        {!log.last && <div className="w-px h-9 md:h-10 bg-outline-variant/30 my-1"></div>}
                      </div>
                      <div className={`pt-0.5 ${!log.last ? "pb-4 md:pb-5" : ""}`}>
                        <p className="font-medium text-[13px] md:text-body-md text-on-surface">{log.title}</p>
                        <p className="text-[11px] md:text-[13px] text-on-surface-variant mt-0.5">{log.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="flex flex-col gap-5 md:gap-6 lg:sticky lg:top-24 lg:self-start">
              {/* Delivery Address */}
              <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md p-5 md:p-6">
                <h2 className="font-headline-md text-[16px] md:text-headline-md text-on-surface mb-4">Delivery Address</h2>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[13px] md:text-body-md text-on-surface">Rahima Begum</p>
                    <p className="text-[12px] md:text-[14px] text-on-surface-variant mt-1 leading-relaxed">House 42, Road 7, Sector 3<br/>Uttara, Dhaka – 1230<br/>Bangladesh</p>
                    <div className="flex items-center gap-1.5 mt-2.5 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[14px]">phone</span>
                      <p className="text-[12px] md:text-[13px]">+880 1712-345678</p>
                    </div>
                  </div>
                </div>
                <button className="mt-4 w-full text-center text-[12px] md:text-[13px] text-on-surface-variant hover:text-primary font-medium border border-outline-variant/40 rounded-full py-2 transition-colors hover:border-primary/30">View on Map</button>
              </div>

              {/* Order Summary */}
              <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md p-5 md:p-6">
                <h2 className="font-headline-md text-[16px] md:text-headline-md text-on-surface mb-4">Order Summary</h2>
                <div className="flex flex-col gap-2.5 md:gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] md:text-[14px] text-on-surface-variant">Subtotal (3 items)</span>
                    <span className="text-[13px] md:text-body-md text-on-surface font-medium">৳932</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] md:text-[14px] text-on-surface-variant">Product discount</span>
                    <span className="text-[13px] md:text-body-md text-secondary font-medium">−৳36</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] md:text-[14px] text-on-surface-variant">Promo</span>
                      <span className="bg-secondary-container/30 text-on-secondary-container text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">FRESH10</span>
                    </div>
                    <span className="text-[13px] md:text-body-md text-secondary font-medium">−৳99</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] md:text-[14px] text-on-surface-variant">Shipping</span>
                    <span className="text-[13px] md:text-body-md text-secondary font-semibold">FREE</span>
                  </div>
                  <div className="h-px bg-outline-variant/30 my-1"></div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[14px] md:text-body-md text-on-surface">Total Paid</span>
                    <span className="font-bold text-[22px] md:text-[28px] text-on-surface tracking-tight">৳797</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-5 pt-4 border-t border-outline-variant/30">
                  <p className="text-[11px] md:text-[12px] text-on-surface-variant mb-2.5 uppercase tracking-wider font-semibold">Payment Method</p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-[16px]">payment</span>
                    </div>
                    <div>
                      <p className="font-semibold text-[13px] md:text-body-md text-on-surface">bKash</p>
                      <p className="text-[10px] md:text-[11px] text-on-surface-variant font-mono">BKH-9823-4521</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Manage Order */}
              <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md p-5 md:p-6">
                <h2 className="font-headline-md text-[16px] md:text-headline-md text-on-surface mb-4">Manage Order</h2>
                <div className="flex flex-col gap-2">
                  <button className="action-btn w-full flex items-center gap-3 p-3 md:p-3.5 rounded-[12px] hover:bg-surface-container-low border border-transparent hover:border-outline-variant/30 transition-all group">
                    <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-[16px]">download</span>
                    </div>
                    <span className="flex-1 text-left text-[12px] md:text-[14px] text-on-surface group-hover:text-primary font-medium transition-colors">Download Invoice</span>
                    <span className="material-symbols-outlined text-outline text-[16px] btn-icon">chevron_right</span>
                  </button>
                  <button className="action-btn w-full flex items-center gap-3 p-3 md:p-3.5 rounded-[12px] hover:bg-surface-container-low border border-transparent hover:border-outline-variant/30 transition-all group">
                    <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 group-hover:bg-tertiary/10 transition-colors">
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-tertiary text-[16px]">headset_mic</span>
                    </div>
                    <span className="flex-1 text-left text-[12px] md:text-[14px] text-on-surface group-hover:text-tertiary font-medium transition-colors">Contact Support</span>
                    <span className="material-symbols-outlined text-outline text-[16px] btn-icon">chevron_right</span>
                  </button>
                  <button className="action-btn w-full flex items-center gap-3 p-3 md:p-3.5 rounded-[12px] hover:bg-error-container/20 border border-transparent hover:border-error/20 transition-all group">
                    <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 group-hover:bg-error-container transition-colors">
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-error text-[16px]">cancel</span>
                    </div>
                    <span className="flex-1 text-left text-[12px] md:text-[14px] text-on-surface group-hover:text-error font-medium transition-colors">Cancel Order</span>
                    <span className="material-symbols-outlined text-outline text-[16px] btn-icon">chevron_right</span>
                  </button>
                </div>
                <p className="mt-4 text-[10px] md:text-[11px] text-outline text-center leading-relaxed px-2">Cancellation available before dispatch · Returns within 7 days of delivery</p>
              </div>

              {/* Need Help */}
              <div className="bg-primary rounded-[20px] md:rounded-[24px] p-5 md:p-6 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-24 h-24 border-[16px] border-white/10 rounded-full"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 border-[10px] border-black/5 rounded-full"></div>
                <div className="relative z-10">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-on-primary text-[18px]">support_agent</span>
                  </div>
                  <p className="font-bold text-[14px] md:text-body-md text-on-primary mb-1">Need help with your order?</p>
                  <p className="text-[11px] md:text-[13px] text-on-primary/70 mb-4">Our team typically replies within 30 minutes.</p>
                  <Link href="#" className="inline-flex items-center gap-1.5 bg-surface text-primary text-[12px] md:text-[14px] font-semibold px-4 py-2 rounded-full hover:bg-primary-fixed transition-colors">
                    Chat with Us <span className="material-symbols-outlined text-[14px]">chat</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
