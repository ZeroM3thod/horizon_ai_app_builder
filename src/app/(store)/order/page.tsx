"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Mock order data ───────────────────────────────────────────────────────────
const MOCK_ORDERS: Record<string, Order> = {
  "SC-10042": {
    id: "SC-10042",
    status: "out_for_delivery",
    placedAt: "15 Jun 2024, 10:32 AM",
    estimatedDelivery: "15 Jun 2024",
    customer: { name: "Rehana Begum", phone: "017**-****89", address: "House 12, Road 5, Dhanmondi, Dhaka" },
    items: [
      { name: "Garam Masala Blend", qty: 2, weight: "200g", price: 249, icon: "local_fire_department", color: "text-primary" },
      { name: "Green Cardamom", qty: 1, weight: "50g", price: 349, icon: "spa", color: "text-tertiary" },
      { name: "Yellow Moong Dal", qty: 3, weight: "1kg", price: 149, icon: "grain", color: "text-secondary" },
    ],
    subtotal: 1194,
    delivery: 0,
    total: 1194,
    paymentMethod: "bKash",
    timeline: [
      { key: "placed", label: "Order Placed", desc: "We received your order", time: "10:32 AM", done: true },
      { key: "confirmed", label: "Confirmed", desc: "Payment verified & packed", time: "11:15 AM", done: true },
      { key: "dispatched", label: "Dispatched", desc: "Left our warehouse", time: "1:20 PM", done: true },
      { key: "out_for_delivery", label: "Out for Delivery", desc: "Your rider is on the way", time: "4:00 PM est.", done: true, active: true },
      { key: "delivered", label: "Delivered", desc: "Pending", time: "", done: false },
    ],
  },
  "SC-10019": {
    id: "SC-10019",
    status: "delivered",
    placedAt: "10 Jun 2024, 3:14 PM",
    estimatedDelivery: "11 Jun 2024",
    customer: { name: "Kabir Hossain", phone: "019**-****22", address: "Flat 4B, Agrabad, Chittagong" },
    items: [
      { name: "Biryani Masala", qty: 5, weight: "100g", price: 199, icon: "soup_kitchen", color: "text-secondary" },
      { name: "Premium Almonds", qty: 2, weight: "500g", price: 649, icon: "nutrition", color: "text-on-surface" },
    ],
    subtotal: 2293,
    delivery: 0,
    total: 2293,
    paymentMethod: "Nagad",
    timeline: [
      { key: "placed", label: "Order Placed", desc: "We received your order", time: "3:14 PM", done: true },
      { key: "confirmed", label: "Confirmed", desc: "Payment verified & packed", time: "3:52 PM", done: true },
      { key: "dispatched", label: "Dispatched", desc: "Left our warehouse", time: "5:10 PM", done: true },
      { key: "out_for_delivery", label: "Out for Delivery", desc: "Rider was on the way", time: "9:30 AM", done: true },
      { key: "delivered", label: "Delivered", desc: "Delivered successfully", time: "11 Jun, 11:15 AM", done: true },
    ],
  },
  "SC-10088": {
    id: "SC-10088",
    status: "confirmed",
    placedAt: "15 Jun 2024, 1:05 PM",
    estimatedDelivery: "16 Jun 2024",
    customer: { name: "Sadia Rahman", phone: "018**-****56", address: "Zindabazar, Sylhet" },
    items: [
      { name: "Mixed Dry Fruits", qty: 1, weight: "250g", price: 719, icon: "shopping_basket", color: "text-primary" },
    ],
    subtotal: 719,
    delivery: 60,
    total: 779,
    paymentMethod: "Cash on Delivery",
    timeline: [
      { key: "placed", label: "Order Placed", desc: "We received your order", time: "1:05 PM", done: true },
      { key: "confirmed", label: "Confirmed", desc: "Payment verified & packed", time: "1:40 PM", done: true, active: true },
      { key: "dispatched", label: "Dispatched", desc: "Pending", time: "", done: false },
      { key: "out_for_delivery", label: "Out for Delivery", desc: "Pending", time: "", done: false },
      { key: "delivered", label: "Delivered", desc: "Pending", time: "", done: false },
    ],
  },
};

type OrderStatus = "confirmed" | "dispatched" | "out_for_delivery" | "delivered";

interface TimelineStep {
  key: string;
  label: string;
  desc: string;
  time: string;
  done: boolean;
  active?: boolean;
}

interface OrderItem {
  name: string;
  qty: number;
  weight: string;
  price: number;
  icon: string;
  color: string;
}

interface Order {
  id: string;
  status: OrderStatus | string;
  placedAt: string;
  estimatedDelivery: string;
  customer: { name: string; phone: string; address: string };
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
  paymentMethod: string;
  timeline: TimelineStep[];
}

// ─── Status badge config ───────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; icon: string; bg: string; text: string; border: string }> = {
  confirmed: {
    label: "Confirmed",
    icon: "check_circle",
    bg: "bg-secondary-container/40",
    text: "text-secondary",
    border: "border-secondary/20",
  },
  dispatched: {
    label: "Dispatched",
    icon: "local_shipping",
    bg: "bg-tertiary-fixed/40",
    text: "text-tertiary",
    border: "border-tertiary/20",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    icon: "directions_bike",
    bg: "bg-primary-container/40",
    text: "text-primary",
    border: "border-primary/20",
  },
  delivered: {
    label: "Delivered",
    icon: "task_alt",
    bg: "bg-secondary-container/60",
    text: "text-secondary",
    border: "border-secondary/30",
  },
};

// ─── Search form ───────────────────────────────────────────────────────────────
function SearchForm({ onSearch }: { onSearch: (id: string) => void }) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmed = value.trim().toUpperCase();
    if (trimmed) onSearch(trimmed);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-surface rounded-2xl border border-outline-variant/50 shadow-[0_8px_32px_rgba(159,65,34,0.08)] p-1.5 flex items-center gap-2">
        <span className="material-symbols-outlined text-on-surface-variant text-[20px] ml-3 shrink-0">
          receipt_long
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Enter your order ID (e.g. SC-10042)"
          className="flex-1 bg-transparent border-none outline-none font-body-md text-[14px] md:text-body-md text-on-surface placeholder:text-outline py-2.5 pr-1"
        />
        <button
          onClick={handleSubmit}
          className="bg-primary text-on-primary rounded-xl px-4 md:px-6 py-2.5 font-body-md text-[13px] md:text-body-md font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5 shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">search</span>
          <span className="hidden sm:inline">Track Order</span>
        </button>
      </div>
      <p className="text-center text-[11px] md:text-[12px] text-on-surface-variant mt-3">
        Try demo IDs: <button onClick={() => { setValue("SC-10042"); onSearch("SC-10042"); }} className="text-primary underline underline-offset-2 hover:no-underline">SC-10042</button>
        {" · "}
        <button onClick={() => { setValue("SC-10019"); onSearch("SC-10019"); }} className="text-primary underline underline-offset-2 hover:no-underline">SC-10019</button>
        {" · "}
        <button onClick={() => { setValue("SC-10088"); onSearch("SC-10088"); }} className="text-primary underline underline-offset-2 hover:no-underline">SC-10088</button>
      </p>
    </div>
  );
}

// ─── Order result ──────────────────────────────────────────────────────────────
function OrderResult({ order, onReset }: { order: Order; onReset: () => void }) {
  const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.confirmed;
  const isDelivered = order.status === "delivered";

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-4 md:gap-5 animate-in fade-in duration-300">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors text-[13px] md:text-body-md font-medium"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Track another order
        </button>
        <span className={`inline-flex items-center gap-1.5 text-[11px] md:text-[13px] font-semibold px-3 py-1.5 rounded-full border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
          <span className="material-symbols-outlined text-[14px] md:text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {statusCfg.icon}
          </span>
          {statusCfg.label}
        </span>
      </div>

      {/* Main card */}
      <div className="bg-surface rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden">
        {/* Order banner */}
        <div className={`px-5 md:px-8 py-5 md:py-6 border-b border-outline-variant/20 ${isDelivered ? "bg-secondary-container/20" : "bg-primary-container/15"}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-[11px] md:text-[12px] text-on-surface-variant font-medium uppercase tracking-wider mb-1">Order ID</p>
              <p className="font-headline-md text-[20px] md:text-[26px] text-on-surface font-bold tracking-tight">{order.id}</p>
            </div>
            <div className="flex flex-col sm:items-end gap-1">
              <p className="text-[11px] md:text-[12px] text-on-surface-variant">Placed: <span className="text-on-surface font-medium">{order.placedAt}</span></p>
              <p className="text-[11px] md:text-[12px] text-on-surface-variant">
                {isDelivered ? "Delivered on:" : "Est. delivery:"}{" "}
                <span className="text-primary font-semibold">{order.estimatedDelivery}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="px-5 md:px-8 py-5 md:py-6 border-b border-outline-variant/20">
          <h3 className="font-headline-md text-[13px] md:text-[15px] text-on-surface-variant uppercase tracking-widest mb-5 md:mb-6">
            Delivery Progress
          </h3>

          {/* Desktop timeline (horizontal) */}
          <div className="hidden md:flex items-start relative">
            {/* connector line */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-outline-variant/30 z-0"></div>
            <div
              className="absolute top-4 left-0 h-0.5 bg-primary z-0 transition-all duration-700"
              style={{
                width: `${(order.timeline.filter((t) => t.done).length - 1) / (order.timeline.length - 1) * 100}%`,
              }}
            ></div>
            {order.timeline.map((step) => (
              <div key={step.key} className="flex-1 flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  step.active
                    ? "bg-primary border-primary shadow-[0_0_0_4px_rgba(159,65,34,0.15)]"
                    : step.done
                    ? "bg-secondary border-secondary"
                    : "bg-surface border-outline-variant"
                }`}>
                  {step.done ? (
                    <span className="material-symbols-outlined text-surface text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {step.active ? "radio_button_checked" : "check"}
                    </span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-outline-variant"></span>
                  )}
                </div>
                <div className={`mt-3 text-center px-1 ${step.done ? "" : "opacity-40"}`}>
                  <p className={`text-[12px] font-semibold leading-tight mb-0.5 ${step.active ? "text-primary" : "text-on-surface"}`}>
                    {step.label}
                  </p>
                  <p className="text-[10px] text-on-surface-variant leading-tight">{step.desc}</p>
                  {step.time && (
                    <p className={`text-[10px] font-medium mt-1 ${step.active ? "text-primary" : "text-on-surface-variant"}`}>
                      {step.time}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile timeline (vertical) */}
          <div className="flex md:hidden flex-col relative">
            <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-outline-variant/30 z-0"></div>
            {order.timeline.map((step, i) => (
              <div key={step.key} className={`flex gap-4 relative z-10 ${i < order.timeline.length - 1 ? "pb-5" : ""}`}>
                <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center border-2 transition-all ${
                  step.active
                    ? "bg-primary border-primary shadow-[0_0_0_4px_rgba(159,65,34,0.15)]"
                    : step.done
                    ? "bg-secondary border-secondary"
                    : "bg-surface border-outline-variant"
                } ${!step.done ? "opacity-40" : ""}`}>
                  {step.done ? (
                    <span className="material-symbols-outlined text-surface text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {step.active ? "radio_button_checked" : "check"}
                    </span>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                  )}
                </div>
                <div className={`flex-1 pb-0.5 ${!step.done ? "opacity-40" : ""}`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-[13px] font-semibold ${step.active ? "text-primary" : "text-on-surface"}`}>
                      {step.label}
                    </p>
                    {step.time && (
                      <p className={`text-[11px] font-medium shrink-0 ${step.active ? "text-primary" : "text-on-surface-variant"}`}>
                        {step.time}
                      </p>
                    )}
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Items + summary grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-outline-variant/20">
          {/* Items */}
          <div className="px-5 md:px-8 py-5 md:py-6">
            <h3 className="font-headline-md text-[13px] md:text-[15px] text-on-surface-variant uppercase tracking-widest mb-4">
              Items Ordered
            </h3>
            <div className="flex flex-col gap-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-center shrink-0">
                    <span className={`material-symbols-outlined text-[18px] md:text-[20px] ${item.color}`}>
                      {item.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] md:text-[14px] text-on-surface font-medium leading-tight truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] md:text-[12px] text-on-surface-variant">
                      {item.weight} × {item.qty}
                    </p>
                  </div>
                  <p className="text-[13px] md:text-[14px] text-on-surface font-semibold shrink-0">
                    ৳{(item.price * item.qty).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="px-5 md:px-8 py-5 md:py-6">
            <h3 className="font-headline-md text-[13px] md:text-[15px] text-on-surface-variant uppercase tracking-widest mb-4">
              Order Summary
            </h3>
            <div className="flex flex-col gap-2.5 mb-4">
              <div className="flex justify-between text-[12px] md:text-[14px]">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="text-on-surface">৳{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[12px] md:text-[14px]">
                <span className="text-on-surface-variant">Delivery</span>
                <span className={order.delivery === 0 ? "text-secondary font-medium" : "text-on-surface"}>
                  {order.delivery === 0 ? "Free" : `৳${order.delivery}`}
                </span>
              </div>
              <div className="h-px bg-outline-variant/30 my-1"></div>
              <div className="flex justify-between">
                <span className="text-[14px] md:text-[16px] font-semibold text-on-surface">Total</span>
                <span className="text-[14px] md:text-[16px] font-bold text-primary">৳{order.total.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-3 md:p-4 space-y-2.5 border border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-on-surface-variant text-[16px]">location_on</span>
                <p className="text-[11px] md:text-[12px] text-on-surface-variant leading-snug">{order.customer.address}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-on-surface-variant text-[16px]">payments</span>
                <p className="text-[11px] md:text-[12px] text-on-surface-variant">{order.paymentMethod}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-on-surface-variant text-[16px]">person</span>
                <p className="text-[11px] md:text-[12px] text-on-surface-variant">
                  {order.customer.name} · {order.customer.phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 md:px-8 py-4 bg-surface-container-low border-t border-outline-variant/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <span className="text-[11px] md:text-[12px] text-on-surface-variant">
              All products are BSTI certified & lab tested.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:+8801700000000"
              className="inline-flex items-center gap-1.5 text-[12px] md:text-[13px] text-primary font-medium hover:underline underline-offset-2"
            >
              <span className="material-symbols-outlined text-[15px]">support_agent</span>
              Need help?
            </a>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 bg-primary text-on-primary text-[12px] md:text-[13px] font-medium px-4 py-2 rounded-full hover:bg-primary/90 transition-colors"
            >
              Shop Again
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Not found state ───────────────────────────────────────────────────────────
function NotFound({ orderId, onReset }: { orderId: string; onReset: () => void }) {
  return (
    <div className="w-full max-w-md mx-auto text-center py-6 md:py-10 animate-in fade-in duration-300">
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4 md:mb-5">
        <span className="material-symbols-outlined text-error text-[28px] md:text-[36px]">search_off</span>
      </div>
      <h3 className="font-headline-md text-[18px] md:text-[22px] text-on-surface mb-2">Order not found</h3>
      <p className="text-[13px] md:text-body-md text-on-surface-variant mb-6 px-4">
        No order matched <span className="font-semibold text-on-surface">{orderId}</span>. Check your confirmation SMS or email for the correct order ID.
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-full font-body-md text-[14px] font-medium hover:bg-primary/90 transition-colors"
      >
        <span className="material-symbols-outlined text-[16px]">replay</span>
        Try again
      </button>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function OrderPage() {
  const [searchId, setSearchId] = useState<string | null>(null);
  const [result, setResult] = useState<Order | "not_found" | null>(null);

  const handleSearch = (id: string) => {
    setSearchId(id);
    const order = MOCK_ORDERS[id];
    setResult(order ?? "not_found");
  };

  const handleReset = () => {
    setSearchId(null);
    setResult(null);
  };

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative pt-28 md:pt-40 pb-10 md:pb-16 px-6 md:px-container-padding overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-tertiary-fixed/25 to-background -z-10"></div>
        <div className="absolute top-24 right-8 md:right-24 w-32 md:w-64 h-32 md:h-64 rounded-full bg-primary-container/20 blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-8 md:left-24 w-24 md:w-48 h-24 md:h-48 rounded-full bg-secondary-container/25 blur-3xl -z-10"></div>

        <div className="max-w-3xl mx-auto text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 bg-surface/70 backdrop-blur-xl border border-outline-variant/50 rounded-full px-3 md:px-4 py-1.5 mb-5 md:mb-6">
            <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_shipping
            </span>
            <span className="font-body-md text-[11px] md:text-body-md text-on-surface">
              No login required
            </span>
          </div>
          <h1 className="font-display-xl text-[32px] md:text-[60px] leading-[1.1] tracking-tight text-on-surface mb-3 md:mb-4">
            Track Your Order
          </h1>
          <p className="font-body-lg text-[13px] md:text-body-lg text-on-surface-variant max-w-md mx-auto mb-8 md:mb-10">
            Enter the order ID from your confirmation SMS or email to see live delivery updates.
          </p>

          {!result && <SearchForm onSearch={handleSearch} />}
        </div>

        {result === "not_found" && searchId && (
          <NotFound orderId={searchId} onReset={handleReset} />
        )}

        {result && result !== "not_found" && (
          <OrderResult order={result} onReset={handleReset} />
        )}
      </section>

      {/* ─── Info strip ─── */}
      {!result && (
        <section className="py-8 md:py-12 px-6 md:px-container-padding bg-surface border-t border-outline-variant/20">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <div className="flex items-start gap-3 p-4 md:p-5 bg-surface-container-low rounded-2xl border border-outline-variant/20">
              <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[18px]">receipt_long</span>
              </div>
              <div>
                <p className="text-[13px] md:text-[14px] font-semibold text-on-surface mb-0.5">Find your order ID</p>
                <p className="text-[11px] md:text-[12px] text-on-surface-variant leading-relaxed">
                  Check the confirmation SMS sent to your phone right after placing the order.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 md:p-5 bg-surface-container-low rounded-2xl border border-outline-variant/20">
              <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary text-[18px]">notifications_active</span>
              </div>
              <div>
                <p className="text-[13px] md:text-[14px] font-semibold text-on-surface mb-0.5">Live SMS updates</p>
                <p className="text-[11px] md:text-[12px] text-on-surface-variant leading-relaxed">
                  We send you an SMS at every stage — confirmed, dispatched, and out for delivery.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 md:p-5 bg-surface-container-low rounded-2xl border border-outline-variant/20">
              <div className="w-9 h-9 rounded-full bg-tertiary-fixed flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-tertiary text-[18px]">support_agent</span>
              </div>
              <div>
                <p className="text-[13px] md:text-[14px] font-semibold text-on-surface mb-0.5">Need help?</p>
                <p className="text-[11px] md:text-[12px] text-on-surface-variant leading-relaxed">
                  Call or WhatsApp us at <a href="tel:+8801700000000" className="text-primary font-medium">01700-000000</a>. We reply within 30 minutes.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}