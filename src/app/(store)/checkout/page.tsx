"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

/* ─── Constants ─── */
const SUBTOTAL = 955;

type Zone = "gazipur" | "outside";
type Plan =
  | "gazipur-standard"
  | "gazipur-express"
  | "outside-standard"
  | "outside-express";
type Payment = "cod" | "bkash" | "nagad" | "rocket";

/* ─── Checkout page ─── */
export default function CheckoutPage() {
  /* state */
  const [selectedAddr, setSelectedAddr] = useState("addr-1");
  const [newAddrOpen, setNewAddrOpen] = useState(false);
  const [zone, setZone] = useState<Zone>("gazipur");
  const [plan, setPlan] = useState<Plan>("gazipur-standard");
  const [deliveryCharge, setDeliveryCharge] = useState(60);
  const [payment, setPayment] = useState<Payment>("cod");
  const [showModal, setShowModal] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [copyToast, setCopyToast] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  /* computed */
  const codCharge =
    payment === "cod" ? Math.ceil((SUBTOTAL + deliveryCharge) * 0.01) : 0;
  const total = SUBTOTAL + deliveryCharge + codCharge;

  /* helpers */
  const isPlan = (p: Plan) => plan === p;
  const isPay = (m: Payment) => payment === m;

  /* inline style helpers for custom radio dots */
  const radioOn = { borderColor: "#9f4122", backgroundColor: "#9f4122" };
  const radioOff = { borderColor: "#ddc0b8", backgroundColor: "transparent" };
  const addrOff = { borderColor: "#89726b", backgroundColor: "transparent" };
  const dotOn = { backgroundColor: "white" };
  const dotOff = { backgroundColor: "transparent" };

  /* actions */
  const switchDelivery = (z: Zone) => {
    setZone(z);
    if (z === "gazipur") {
      setPlan("gazipur-standard");
      setDeliveryCharge(60);
    } else {
      setPlan("outside-standard");
      setDeliveryCharge(120);
    }
  };

  const selectDelivery = (charge: number, p: Plan) => {
    setPlan(p);
    setDeliveryCharge(charge);
  };

  const copyNumber = (num: string) => {
    navigator.clipboard.writeText(num).catch(() => {});
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2200);
  };

  const placeOrder = () => {
    const id = "SHD-" + Date.now().toString().slice(-6);
    setOrderId(id);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const handleOrderClick = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      const t1 = setTimeout(() => placeOrder(), 7000);
      const t2 = setTimeout(() => setIsAnimating(false), 10000);
      timersRef.current = [t1, t2];
    }
  };

  const handleViewOrder = () => {
    setShowModal(false);
    document.body.style.overflow = "";
    alert(
      "Navigating to order details page...\n(Integrate with your order tracking system)"
    );
  };

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  /* modal display values */
  const payLabels: Record<Payment, string> = {
    cod: "Cash on Delivery",
    bkash: "bKash",
    nagad: "Nagad",
    rocket: "Rocket",
  };
  const zoneLabel = zone === "gazipur" ? "Inside Gazipur" : "Outside Gazipur";
  const planLabel = plan.includes("express") ? "Express" : "Standard";

  return (
    <>
      {/* ─── CHECKOUT-SPECIFIC CSS ─── */}
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeIn 0.4s ease forwards; }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }
        .scale-in { animation: scaleIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .slide-up { animation: slideUp 0.4s ease forwards; }
        @keyframes checkmark { 0% { stroke-dashoffset:100; } 100% { stroke-dashoffset:0; } }
        .checkmark-path { stroke-dasharray:100; stroke-dashoffset:100; animation:checkmark 0.6s 0.3s ease forwards; }

        .radio-card { transition:all 0.2s ease; cursor:pointer; }
        .radio-card:hover { border-color:#9f4122; background-color:#ffdbd0; }
        .radio-card.selected { border-color:#9f4122; background-color:#ffdbd0; box-shadow:0 0 0 2px rgba(159,65,34,0.2); }

        .payment-card { transition:all 0.2s ease; cursor:pointer; }
        .payment-card:hover { border-color:#9f4122; }
        .payment-card.selected { border-color:#9f4122; background-color:#fff9ee; box-shadow:0 0 0 2px rgba(159,65,34,0.15); }

        .address-card { transition:all 0.2s ease; cursor:pointer; }
        .address-card:hover { border-color:#9f4122; }
        .address-card.selected { border-color:#9f4122; background-color:#ffdbd0; box-shadow:0 0 0 2px rgba(159,65,34,0.2); }

        .checkout-input { transition:border-color 0.2s, box-shadow 0.2s; }
        .checkout-input:focus { outline:none; border-color:#9f4122; box-shadow:0 0 0 3px rgba(159,65,34,0.12); }

        .delivery-tab { transition:all 0.2s ease; }
        .delivery-tab.active { background-color:#9f4122; color:#fff; box-shadow:0 4px 12px rgba(159,65,34,0.3); }

        .accordion-body { max-height:0; overflow:hidden; transition:max-height 0.35s ease; }
        .accordion-body.open { max-height:600px; }

        .step-line { flex:1; height:2px; background:#ddc0b8; margin:0 6px; }
        .step-line.done { background:#9f4122; }

        .modal-overlay { background:rgba(29,28,21,0.55); backdrop-filter:blur(6px); }
        .sticky-summary { position:sticky; top:100px; }

        @keyframes ringPulse { 0%,100% { box-shadow:0 0 0 0 rgba(85,101,0,0.3); } 50% { box-shadow:0 0 0 16px rgba(85,101,0,0); } }
        .success-ring { animation:ringPulse 2s 0.8s ease infinite; }

        input[type="radio"] { accent-color:#9f4122; }
        input[type="checkbox"] { accent-color:#9f4122; }
        input:focus { outline:none; }

        /* ── Animated Order Button ── */
        :root {
          --order-primary:#9f4122; --order-primary-light:#ff8a65;
          --order-dark:#7f2a0d; --order-grey-dark:#3F4656;
          --order-grey:#6C7486; --order-grey-light:#CDD9ED;
          --order-white:#FFF; --order-green:#556500;
          --order-sand:#DCB773; --order-sand-light:#EDD9A9;
        }
        .order {
          -webkit-appearance:none; -moz-appearance:none; appearance:none;
          border:0; background:var(--order-dark); position:relative;
          height:63px; width:240px; padding:0; outline:none;
          cursor:pointer; border-radius:32px;
          -webkit-mask-image:-webkit-radial-gradient(white,black);
          -webkit-tap-highlight-color:transparent;
          overflow:hidden; transition:transform 0.3s ease;
        }
        .order span {
          --o:1; position:absolute; left:0; right:0; text-align:center;
          top:19px; line-height:24px; color:var(--order-white);
          font-size:16px; font-weight:500; opacity:var(--o); transition:opacity 0.3s ease;
        }
        .order span.default { transition-delay:0.3s; }
        .order span.success { --offset:16px; --o:0; }
        .order span.success svg {
          width:12px; height:10px; display:inline-block; vertical-align:top;
          fill:none; margin:7px 0 0 4px; stroke:var(--order-green);
          stroke-width:2; stroke-linecap:round; stroke-linejoin:round;
          stroke-dasharray:16px; stroke-dashoffset:var(--offset);
          transition:stroke-dashoffset 0.3s ease;
        }
        .order:active { transform:scale(0.96); }
        .order .lines {
          opacity:0; position:absolute; height:3px; background:var(--order-white);
          border-radius:2px; width:6px; top:30px; left:100%;
          box-shadow:15px 0 0 var(--order-white),30px 0 0 var(--order-white),
            45px 0 0 var(--order-white),60px 0 0 var(--order-white),
            75px 0 0 var(--order-white),90px 0 0 var(--order-white),
            105px 0 0 var(--order-white),120px 0 0 var(--order-white),
            135px 0 0 var(--order-white),150px 0 0 var(--order-white),
            165px 0 0 var(--order-white),180px 0 0 var(--order-white),
            195px 0 0 var(--order-white),210px 0 0 var(--order-white),
            225px 0 0 var(--order-white),240px 0 0 var(--order-white),
            255px 0 0 var(--order-white),270px 0 0 var(--order-white),
            285px 0 0 var(--order-white),300px 0 0 var(--order-white),
            315px 0 0 var(--order-white),330px 0 0 var(--order-white);
        }
        .order .back, .order .box {
          --start:var(--order-white); --stop:var(--order-grey-light);
          border-radius:2px; background:linear-gradient(var(--start),var(--stop));
          position:absolute;
        }
        .order .truck {
          width:60px; height:41px; left:100%; z-index:1; top:11px;
          position:absolute; transform:translateX(24px);
        }
        .order .truck:before, .order .truck:after {
          --r:-90deg; content:""; height:2px; width:20px; right:58px;
          position:absolute; display:block; background:var(--order-white);
          border-radius:1px; transform-origin:100% 50%; transform:rotate(var(--r));
        }
        .order .truck:before { top:4px; }
        .order .truck:after { --r:90deg; bottom:4px; }
        .order .truck .back { left:0; top:0; width:60px; height:41px; z-index:1; }
        .order .truck .front {
          overflow:hidden; position:absolute; border-radius:2px 9px 9px 2px;
          width:26px; height:41px; left:60px;
        }
        .order .truck .front:before, .order .truck .front:after {
          content:""; position:absolute; display:block;
        }
        .order .truck .front:before {
          height:13px; width:2px; left:0; top:14px;
          background:linear-gradient(var(--order-grey),var(--order-grey-dark));
        }
        .order .truck .front:after {
          border-radius:2px 9px 9px 2px; background:var(--order-primary);
          width:24px; height:41px; right:0;
        }
        .order .truck .front .window {
          overflow:hidden; border-radius:2px 8px 8px 2px;
          background:var(--order-primary-light);
          transform:perspective(4px) rotateY(3deg);
          width:22px; height:41px; position:absolute; left:2px; top:0;
          z-index:1; transform-origin:0 50%;
        }
        .order .truck .front .window:before, .order .truck .front .window:after {
          content:""; position:absolute; right:0;
        }
        .order .truck .front .window:before {
          top:0; bottom:0; width:14px; background:var(--order-dark);
        }
        .order .truck .front .window:after {
          width:14px; top:7px; height:4px; position:absolute;
          background:rgba(255,255,255,0.14); transform:skewY(14deg);
          box-shadow:0 7px 0 rgba(255,255,255,0.14);
        }
        .order .truck .light {
          width:3px; height:8px; left:83px; transform-origin:100% 50%;
          position:absolute; border-radius:2px; transform:scaleX(0.8);
          background:#f0dc5f;
        }
        .order .truck .light:before {
          content:""; height:4px; width:7px; opacity:0;
          transform:perspective(2px) rotateY(-15deg) scaleX(0.94);
          position:absolute; transform-origin:0 50%; left:3px;
          top:50%; margin-top:-2px;
          background:linear-gradient(90deg,#f0dc5f,rgba(240,220,95,0.7),rgba(240,220,95,0));
        }
        .order .truck .light.top { top:4px; }
        .order .truck .light.bottom { bottom:4px; }
        .order .box {
          --start:var(--order-sand-light); --stop:var(--order-sand);
          width:21px; height:21px; right:100%; top:21px;
        }
        .order .box:before, .order .box:after {
          content:""; top:10px; position:absolute; left:0; right:0;
        }
        .order .box:before { height:3px; margin-top:-1px; background:rgba(0,0,0,0.1); }
        .order .box:after { height:1px; background:rgba(0,0,0,0.15); }

        .order.animate .default { --o:0; transition-delay:0s; }
        .order.animate .success { --offset:0; --o:1; transition-delay:7s; }
        .order.animate .success svg { transition-delay:7.3s; }
        .order.animate .truck { animation:truck 10s ease forwards; }
        .order.animate .truck:before { animation:door1 2.4s ease forwards 0.3s; }
        .order.animate .truck:after { animation:door2 2.4s ease forwards 0.6s; }
        .order.animate .truck .light:before,
        .order.animate .truck .light:after { animation:light 10s ease forwards; }
        .order.animate .box { animation:box 10s ease forwards; }
        .order.animate .lines { animation:lines 10s ease forwards; }

        @keyframes truck {
          10%,30% { transform:translateX(-164px); }
          40% { transform:translateX(-104px); }
          60% { transform:translateX(-224px); }
          75%,100% { transform:translateX(24px); }
        }
        @keyframes lines {
          0%,30% { opacity:0; transform:scaleY(0.7) translateX(0); }
          35%,65% { opacity:1; }
          70% { opacity:0; }
          100% { transform:scaleY(0.7) translateX(-400px); }
        }
        @keyframes light {
          0%,30% { opacity:0; transform:perspective(2px) rotateY(-15deg) scaleX(0.88); }
          40%,100% { opacity:1; transform:perspective(2px) rotateY(-15deg) scaleX(0.94); }
        }
        @keyframes door1 { 30%,50% { transform:rotate(32deg); } }
        @keyframes door2 { 30%,50% { transform:rotate(-32deg); } }
        @keyframes box {
          8%,10% { transform:translateX(40px); opacity:1; }
          25% { transform:translateX(112px); opacity:1; }
          26% { transform:translateX(112px); opacity:0; }
          27%,100% { transform:translateX(0px); opacity:0; }
        }
      `}</style>

      {/* ─── BREADCRUMB + TITLE ─── */}
      <div className="pt-28 md:pt-36 pb-5 md:pb-7 px-6 md:px-container-padding">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-1.5 text-[11px] md:text-[13px] text-on-surface-variant mb-4">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="material-symbols-outlined text-[14px]">
              chevron_right
            </span>
            <Link href="/cart" className="hover:text-primary transition-colors">
              Cart
            </Link>
            <span className="material-symbols-outlined text-[14px]">
              chevron_right
            </span>
            <span className="text-on-surface font-semibold">Checkout</span>
          </nav>

          {/* Progress steps */}
          <div className="flex items-center gap-0 mb-6 md:mb-8 max-w-sm">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-[11px] font-bold shrink-0">
                ✓
              </div>
              <span className="text-[11px] font-semibold text-primary hidden sm:inline">
                Cart
              </span>
            </div>
            <div className="step-line done mx-2"></div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-[11px] font-bold shrink-0">
                2
              </div>
              <span className="text-[11px] font-semibold text-primary hidden sm:inline">
                Checkout
              </span>
            </div>
            <div className="step-line mx-2"></div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-[11px] font-bold shrink-0">
                3
              </div>
              <span className="text-[11px] font-medium text-on-surface-variant hidden sm:inline">
                Confirmed
              </span>
            </div>
          </div>

          <h1 className="font-display-xl text-[28px] md:text-[42px] font-bold tracking-tight text-on-surface">
            Checkout
          </h1>
          <p className="text-on-surface-variant text-[14px] mt-1">
            Review your order and complete payment securely.
          </p>
        </div>
      </div>

      {/* ─── CHECKOUT CONTENT ─── */}
      <section className="px-6 md:px-container-padding pb-32 md:pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-10 items-start">

            {/* ════ LEFT: CHECKOUT FORM ════ */}
            <div className="lg:col-span-2 space-y-5 md:space-y-6 fade-in">

              {/* ── SECTION 1: DELIVERY ADDRESS ── */}
              <div className="bg-surface-container-low rounded-[20px] md:rounded-[24px] border border-outline-variant/40 overflow-hidden shadow-sm">
                <div className="flex items-center gap-3 px-5 md:px-6 py-4 md:py-5 border-b border-outline-variant/30">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span
                      className="material-symbols-outlined text-primary text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      location_on
                    </span>
                  </div>
                  <div>
                    <h2 className="font-bold text-[15px] md:text-[17px] text-on-surface">
                      Delivery Address
                    </h2>
                    <p className="text-[11px] text-on-surface-variant">
                      Choose where to deliver your order
                    </p>
                  </div>
                </div>

                <div className="p-5 md:p-6 space-y-3">
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">
                    Saved Addresses
                  </p>

                  {/* Address card 1 (default) */}
                  <div
                    className={`address-card border-2 rounded-[16px] p-4 flex items-start gap-3 ${
                      selectedAddr === "addr-1"
                        ? "selected"
                        : "border-outline-variant/50"
                    }`}
                    onClick={() => setSelectedAddr("addr-1")}
                  >
                    <div className="mt-0.5 shrink-0">
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                        style={selectedAddr === "addr-1" ? radioOn : addrOff}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={selectedAddr === "addr-1" ? dotOn : dotOff}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[14px] text-on-surface">
                          Hasan Ahmed
                        </span>
                        <span className="bg-primary text-on-primary text-[9px] font-bold px-2 py-0.5 rounded-full">
                          Default
                        </span>
                        <span className="bg-secondary-container text-on-secondary-container text-[9px] font-bold px-2 py-0.5 rounded-full">
                          Home
                        </span>
                      </div>
                      <p className="text-[13px] text-on-surface-variant mt-1 leading-relaxed">
                        House 12, Road 5, Block C, Tongi Industrial Area
                        <br />
                        Gazipur Sadar, Gazipur — 1711
                      </p>
                      <p className="text-[12px] text-on-surface-variant mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          phone
                        </span>
                        +880 1711-000000
                      </p>
                    </div>
                  </div>

                  {/* Address card 2 */}
                  <div
                    className={`address-card border-2 rounded-[16px] p-4 flex items-start gap-3 ${
                      selectedAddr === "addr-2"
                        ? "selected"
                        : "border-outline-variant/50"
                    }`}
                    onClick={() => setSelectedAddr("addr-2")}
                  >
                    <div className="mt-0.5 shrink-0">
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                        style={selectedAddr === "addr-2" ? radioOn : addrOff}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={selectedAddr === "addr-2" ? dotOn : dotOff}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[14px] text-on-surface">
                          Hasan Ahmed
                        </span>
                        <span className="bg-tertiary-container text-on-tertiary-container text-[9px] font-bold px-2 py-0.5 rounded-full">
                          Office
                        </span>
                      </div>
                      <p className="text-[13px] text-on-surface-variant mt-1 leading-relaxed">
                        Flat 4B, Tower Plaza, Mirpur 10
                        <br />
                        Dhaka — 1216
                      </p>
                      <p className="text-[12px] text-on-surface-variant mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          phone
                        </span>
                        +880 1911-000001
                      </p>
                    </div>
                  </div>

                  {/* Add new address toggle */}
                  <button
                    onClick={() => setNewAddrOpen(!newAddrOpen)}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed rounded-[16px] text-[13px] font-semibold transition-all ${
                      newAddrOpen
                        ? "border-error/40 text-error hover:border-error hover:bg-error/5"
                        : "border-outline-variant/60 text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {newAddrOpen ? "close" : "add_location_alt"}
                    </span>
                    {newAddrOpen ? "Cancel" : "Add New Address"}
                  </button>

                  {/* New address form (collapsible) */}
                  <div className={`accordion-body ${newAddrOpen ? "open" : ""}`}>
                    <div className="pt-1 pb-2 space-y-3">
                      <div className="h-px bg-outline-variant/30 my-2"></div>
                      <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">
                        New Delivery Address
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            placeholder="Your full name"
                            className="checkout-input w-full bg-surface border-2 border-outline-variant/50 rounded-[12px] px-4 py-3 text-[14px] text-on-surface placeholder:text-on-surface-variant/50"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            placeholder="+880 1X00-000000"
                            className="checkout-input w-full bg-surface border-2 border-outline-variant/50 rounded-[12px] px-4 py-3 text-[14px] text-on-surface placeholder:text-on-surface-variant/50"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide">
                          Street / House Address *
                        </label>
                        <input
                          type="text"
                          placeholder="House no., road, area"
                          className="checkout-input w-full bg-surface border-2 border-outline-variant/50 rounded-[12px] px-4 py-3 text-[14px] text-on-surface placeholder:text-on-surface-variant/50"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide">
                            City *
                          </label>
                          <input
                            type="text"
                            placeholder="City"
                            className="checkout-input w-full bg-surface border-2 border-outline-variant/50 rounded-[12px] px-4 py-3 text-[14px] text-on-surface placeholder:text-on-surface-variant/50"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide">
                            District
                          </label>
                          <input
                            type="text"
                            placeholder="District"
                            className="checkout-input w-full bg-surface border-2 border-outline-variant/50 rounded-[12px] px-4 py-3 text-[14px] text-on-surface placeholder:text-on-surface-variant/50"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            placeholder="0000"
                            className="checkout-input w-full bg-surface border-2 border-outline-variant/50 rounded-[12px] px-4 py-3 text-[14px] text-on-surface placeholder:text-on-surface-variant/50"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="saveAddrCb"
                          className="w-4 h-4 rounded"
                        />
                        <label
                          htmlFor="saveAddrCb"
                          className="text-[13px] text-on-surface-variant cursor-pointer"
                        >
                          Save this address for future orders
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── SECTION 2: DELIVERY METHOD ── */}
              <div className="bg-surface-container-low rounded-[20px] md:rounded-[24px] border border-outline-variant/40 overflow-hidden shadow-sm">
                <div className="flex items-center gap-3 px-5 md:px-6 py-4 md:py-5 border-b border-outline-variant/30">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span
                      className="material-symbols-outlined text-primary text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      local_shipping
                    </span>
                  </div>
                  <div>
                    <h2 className="font-bold text-[15px] md:text-[17px] text-on-surface">
                      Delivery Method
                    </h2>
                    <p className="text-[11px] text-on-surface-variant">
                      Select your delivery zone
                    </p>
                  </div>
                </div>

                <div className="p-5 md:p-6">
                  {/* Zone tabs */}
                  <div className="flex gap-2 p-1.5 bg-surface-container-high rounded-full mb-5">
                    <button
                      onClick={() => switchDelivery("gazipur")}
                      className={`delivery-tab flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-[13px] font-semibold transition-all ${
                        zone === "gazipur" ? "active" : "text-on-surface-variant"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        location_city
                      </span>
                      Inside Gazipur
                    </button>
                    <button
                      onClick={() => switchDelivery("outside")}
                      className={`delivery-tab flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-[13px] font-semibold transition-all ${
                        zone === "outside" ? "active" : "text-on-surface-variant"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        map
                      </span>
                      Outside Gazipur
                    </button>
                  </div>

                  {/* Inside Gazipur Plans */}
                  {zone === "gazipur" && (
                    <div className="space-y-3">
                      {/* Standard */}
                      <div
                        className={`radio-card border-2 rounded-[16px] p-4 ${
                          isPlan("gazipur-standard")
                            ? "selected"
                            : "border-outline-variant/50"
                        }`}
                        onClick={() => selectDelivery(60, "gazipur-standard")}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            <div
                              className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                              style={isPlan("gazipur-standard") ? radioOn : radioOff}
                            >
                              <div
                                className="w-2 h-2 rounded-full"
                                style={isPlan("gazipur-standard") ? dotOn : dotOff}
                              ></div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div>
                                <p className="font-bold text-[14px] text-on-surface">
                                  Standard Delivery
                                </p>
                                <p className="text-[12px] text-on-surface-variant mt-0.5">
                                  3–5 Business Days · Inside Gazipur City
                                </p>
                              </div>
                              <span className="font-bold text-[16px] text-primary">
                                ৳60
                              </span>
                            </div>
                            <div className="mt-3 p-3 bg-surface rounded-[10px] border border-outline-variant/30 space-y-1.5">
                              <div className="flex items-start gap-2 text-[11px] text-on-surface-variant">
                                <span className="material-symbols-outlined text-[14px] text-primary mt-0.5 shrink-0">
                                  info
                                </span>
                                <span>
                                  1% COD charge applicable on Cash on Delivery
                                  orders.
                                </span>
                              </div>
                              <div className="flex items-start gap-2 text-[11px] text-on-surface-variant">
                                <span className="material-symbols-outlined text-[14px] text-primary mt-0.5 shrink-0">
                                  scale
                                </span>
                                <span>
                                  For orders over 2 KG, additional{" "}
                                  <strong className="text-on-surface">
                                    ৳15/KG
                                  </strong>{" "}
                                  (same city rate) applies.
                                </span>
                              </div>
                              <div className="flex items-start gap-2 text-[11px] text-on-surface-variant">
                                <span className="material-symbols-outlined text-[14px] text-secondary mt-0.5 shrink-0">
                                  receipt
                                </span>
                                <span>Price exclusive of any VAT/TAX.</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Express */}
                      <div
                        className={`radio-card border-2 rounded-[16px] p-4 ${
                          isPlan("gazipur-express")
                            ? "selected"
                            : "border-outline-variant/50"
                        }`}
                        onClick={() => selectDelivery(40, "gazipur-express")}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            <div
                              className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                              style={isPlan("gazipur-express") ? radioOn : radioOff}
                            >
                              <div
                                className="w-2 h-2 rounded-full"
                                style={isPlan("gazipur-express") ? dotOn : dotOff}
                              ></div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-[14px] text-on-surface">
                                    Express Delivery
                                  </p>
                                  <span className="bg-error/10 text-error text-[9px] font-bold px-2 py-0.5 rounded-full">
                                    FAST
                                  </span>
                                </div>
                                <p className="text-[12px] text-on-surface-variant mt-0.5">
                                  Same Day / Next Day · Inside Gazipur City
                                </p>
                              </div>
                              <span className="font-bold text-[16px] text-primary">
                                ৳100
                              </span>
                            </div>
                            <div className="mt-3 p-3 bg-surface rounded-[10px] border border-outline-variant/30 space-y-1.5">
                              <div className="flex items-start gap-2 text-[11px] text-on-surface-variant">
                                <span className="material-symbols-outlined text-[14px] text-primary mt-0.5 shrink-0">
                                  info
                                </span>
                                <span>
                                  1% COD charge applicable on Cash on Delivery
                                  orders.
                                </span>
                              </div>
                              <div className="flex items-start gap-2 text-[11px] text-on-surface-variant">
                                <span className="material-symbols-outlined text-[14px] text-primary mt-0.5 shrink-0">
                                  scale
                                </span>
                                <span>
                                  For orders over 2 KG, additional{" "}
                                  <strong className="text-on-surface">
                                    ৳15/KG
                                  </strong>{" "}
                                  (same city rate) applies.
                                </span>
                              </div>
                              <div className="flex items-start gap-2 text-[11px] text-on-surface-variant">
                                <span className="material-symbols-outlined text-[14px] text-secondary mt-0.5 shrink-0">
                                  receipt
                                </span>
                                <span>Price exclusive of any VAT/TAX.</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Outside Gazipur Plans */}
                  {zone === "outside" && (
                    <div className="space-y-3">
                      {/* National Standard */}
                      <div
                        className={`radio-card border-2 rounded-[16px] p-4 ${
                          isPlan("outside-standard")
                            ? "selected"
                            : "border-outline-variant/50"
                        }`}
                        onClick={() => selectDelivery(120, "outside-standard")}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            <div
                              className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                              style={
                                isPlan("outside-standard") ? radioOn : radioOff
                              }
                            >
                              <div
                                className="w-2 h-2 rounded-full"
                                style={
                                  isPlan("outside-standard") ? dotOn : dotOff
                                }
                              ></div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div>
                                <p className="font-bold text-[14px] text-on-surface">
                                  National Standard
                                </p>
                                <p className="text-[12px] text-on-surface-variant mt-0.5">
                                  5–7 Business Days · Anywhere in Bangladesh
                                </p>
                              </div>
                              <span className="font-bold text-[16px] text-primary">
                                ৳120
                              </span>
                            </div>
                            <div className="mt-3 p-3 bg-surface rounded-[10px] border border-outline-variant/30 space-y-1.5">
                              <div className="flex items-start gap-2 text-[11px] text-on-surface-variant">
                                <span className="material-symbols-outlined text-[14px] text-primary mt-0.5 shrink-0">
                                  info
                                </span>
                                <span>
                                  1% COD charge applicable on Cash on Delivery
                                  orders.
                                </span>
                              </div>
                              <div className="flex items-start gap-2 text-[11px] text-on-surface-variant">
                                <span className="material-symbols-outlined text-[14px] text-primary mt-0.5 shrink-0">
                                  scale
                                </span>
                                <span>
                                  For orders over 2 KG, additional{" "}
                                  <strong className="text-on-surface">
                                    ৳25/KG
                                  </strong>{" "}
                                  (outside city rate) applies.
                                </span>
                              </div>
                              <div className="flex items-start gap-2 text-[11px] text-on-surface-variant">
                                <span className="material-symbols-outlined text-[14px] text-secondary mt-0.5 shrink-0">
                                  receipt
                                </span>
                                <span>Price exclusive of any VAT/TAX.</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* National Express */}
                      <div
                        className={`radio-card border-2 rounded-[16px] p-4 ${
                          isPlan("outside-express")
                            ? "selected"
                            : "border-outline-variant/50"
                        }`}
                        onClick={() => selectDelivery(180, "outside-express")}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            <div
                              className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                              style={
                                isPlan("outside-express") ? radioOn : radioOff
                              }
                            >
                              <div
                                className="w-2 h-2 rounded-full"
                                style={
                                  isPlan("outside-express") ? dotOn : dotOff
                                }
                              ></div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-[14px] text-on-surface">
                                    National Express
                                  </p>
                                  <span className="bg-error/10 text-error text-[9px] font-bold px-2 py-0.5 rounded-full">
                                    FAST
                                  </span>
                                </div>
                                <p className="text-[12px] text-on-surface-variant mt-0.5">
                                  2–3 Business Days · Anywhere in Bangladesh
                                </p>
                              </div>
                              <span className="font-bold text-[16px] text-primary">
                                ৳180
                              </span>
                            </div>
                            <div className="mt-3 p-3 bg-surface rounded-[10px] border border-outline-variant/30 space-y-1.5">
                              <div className="flex items-start gap-2 text-[11px] text-on-surface-variant">
                                <span className="material-symbols-outlined text-[14px] text-primary mt-0.5 shrink-0">
                                  info
                                </span>
                                <span>
                                  1% COD charge applicable on Cash on Delivery
                                  orders.
                                </span>
                              </div>
                              <div className="flex items-start gap-2 text-[11px] text-on-surface-variant">
                                <span className="material-symbols-outlined text-[14px] text-primary mt-0.5 shrink-0">
                                  scale
                                </span>
                                <span>
                                  For orders over 2 KG, additional{" "}
                                  <strong className="text-on-surface">
                                    ৳25/KG
                                  </strong>{" "}
                                  (outside city rate) applies.
                                </span>
                              </div>
                              <div className="flex items-start gap-2 text-[11px] text-on-surface-variant">
                                <span className="material-symbols-outlined text-[14px] text-secondary mt-0.5 shrink-0">
                                  receipt
                                </span>
                                <span>Price exclusive of any VAT/TAX.</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── SECTION 3: PAYMENT METHOD ── */}
              <div className="bg-surface-container-low rounded-[20px] md:rounded-[24px] border border-outline-variant/40 overflow-hidden shadow-sm">
                <div className="flex items-center gap-3 px-5 md:px-6 py-4 md:py-5 border-b border-outline-variant/30">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span
                      className="material-symbols-outlined text-primary text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      payments
                    </span>
                  </div>
                  <div>
                    <h2 className="font-bold text-[15px] md:text-[17px] text-on-surface">
                      Payment Method
                    </h2>
                    <p className="text-[11px] text-on-surface-variant">
                      Choose how you&apos;d like to pay
                    </p>
                  </div>
                </div>

                <div className="p-5 md:p-6 space-y-3">
                  {/* COD */}
                  <div
                    className={`payment-card border-2 rounded-[16px] p-4 ${
                      isPay("cod") ? "selected" : "border-outline-variant/50"
                    }`}
                    onClick={() => setPayment("cod")}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                        style={isPay("cod") ? radioOn : radioOff}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={isPay("cod") ? dotOn : dotOff}
                        ></div>
                      </div>
                      <div className="w-10 h-10 rounded-[10px] bg-surface-container-high flex items-center justify-center shrink-0">
                        <span
                          className="material-symbols-outlined text-on-surface text-[22px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          payments
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[14px] text-on-surface">
                          Cash on Delivery
                        </p>
                        <p className="text-[11px] text-on-surface-variant">
                          Pay when you receive your order
                        </p>
                      </div>
                      <span className="text-[10px] font-bold bg-secondary-container text-on-secondary-container px-2 py-1 rounded-full shrink-0">
                        +1% COD Fee
                      </span>
                    </div>
                  </div>

                  {/* bKash */}
                  <div
                    className={`payment-card border-2 border-outline-variant/50 rounded-[16px] overflow-hidden ${
                      isPay("bkash") ? "selected" : ""
                    }`}
                  >
                    <div
                      className="flex items-center gap-3 p-4 cursor-pointer"
                      onClick={() => setPayment("bkash")}
                    >
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                        style={isPay("bkash") ? radioOn : radioOff}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={isPay("bkash") ? dotOn : dotOff}
                        ></div>
                      </div>
                      <div
                        className="w-10 h-10 rounded-[10px] overflow-hidden shrink-0 flex items-center justify-center"
                        style={{ background: "#E2136E" }}
                      >
                        <span className="text-white font-black text-[13px] tracking-tight">
                          bK
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[14px] text-on-surface">
                          bKash
                        </p>
                        <p className="text-[11px] text-on-surface-variant">
                          Mobile banking · Instant transfer
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                        {isPay("bkash") ? "expand_less" : "expand_more"}
                      </span>
                    </div>
                    <div
                      className={`accordion-body ${isPay("bkash") ? "open" : ""}`}
                    >
                      <div className="mx-4 mb-4 p-4 bg-[#fdf0f5] rounded-[12px] border border-[#E2136E]/20">
                        <div className="flex items-center gap-2 mb-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: "#E2136E" }}
                          >
                            <span className="text-white font-black text-[11px]">
                              bK
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-[13px] text-on-surface">
                              Send Money to bKash
                            </p>
                            <p className="text-[11px] text-on-surface-variant">
                              Merchant Number
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white rounded-[10px] px-3 py-2.5 border border-[#E2136E]/20 mb-3">
                          <span className="material-symbols-outlined text-[#E2136E] text-[18px]">
                            call
                          </span>
                          <span className="font-bold text-[16px] text-on-surface tracking-wider">
                            01712-345678
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyNumber("01712-345678");
                            }}
                            className="ml-auto text-[11px] text-[#E2136E] font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity"
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              content_copy
                            </span>
                            Copy
                          </button>
                        </div>
                        <div className="space-y-2">
                          {[
                            <>Open <strong>bKash</strong> app → Tap <strong>&quot;Send Money&quot;</strong></>,
                            <>Enter the number above and send the <strong>exact order amount</strong></>,
                            <>Enter your <strong>TrxID</strong> below after completing the transfer</>,
                          ].map((step, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-[11px] text-on-surface-variant"
                            >
                              <span
                                className="w-5 h-5 rounded-full bg-[#E2136E] text-white text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                              >
                                {i + 1}
                              </span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 space-y-1.5">
                          <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">
                            Transaction ID (TrxID) *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. AB1234CDEF5"
                            className="checkout-input w-full bg-white border-2 border-[#E2136E]/30 rounded-[10px] px-4 py-2.5 text-[13px] text-on-surface placeholder:text-on-surface-variant/50 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nagad */}
                  <div
                    className={`payment-card border-2 border-outline-variant/50 rounded-[16px] overflow-hidden ${
                      isPay("nagad") ? "selected" : ""
                    }`}
                  >
                    <div
                      className="flex items-center gap-3 p-4 cursor-pointer"
                      onClick={() => setPayment("nagad")}
                    >
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                        style={isPay("nagad") ? radioOn : radioOff}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={isPay("nagad") ? dotOn : dotOff}
                        ></div>
                      </div>
                      <div
                        className="w-10 h-10 rounded-[10px] overflow-hidden shrink-0 flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(135deg,#F55F20,#F7941D)",
                        }}
                      >
                        <span className="text-white font-black text-[11px] tracking-tight">
                          নগদ
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[14px] text-on-surface">
                          Nagad
                        </p>
                        <p className="text-[11px] text-on-surface-variant">
                          Mobile banking · Instant transfer
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                        {isPay("nagad") ? "expand_less" : "expand_more"}
                      </span>
                    </div>
                    <div
                      className={`accordion-body ${isPay("nagad") ? "open" : ""}`}
                    >
                      <div
                        className="mx-4 mb-4 p-4 rounded-[12px] border"
                        style={{
                          background: "#fff8f5",
                          borderColor: "rgba(245,95,32,0.2)",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                            style={{
                              background:
                                "linear-gradient(135deg,#F55F20,#F7941D)",
                            }}
                          >
                            <span className="text-white font-black text-[10px]">
                              নগদ
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-[13px] text-on-surface">
                              Send Money to Nagad
                            </p>
                            <p className="text-[11px] text-on-surface-variant">
                              Merchant Number
                            </p>
                          </div>
                        </div>
                        <div
                          className="flex items-center gap-2 bg-white rounded-[10px] px-3 py-2.5 border mb-3"
                          style={{ borderColor: "rgba(245,95,32,0.2)" }}
                        >
                          <span
                            className="material-symbols-outlined text-[18px]"
                            style={{ color: "#F55F20" }}
                          >
                            call
                          </span>
                          <span className="font-bold text-[16px] text-on-surface tracking-wider">
                            01612-987654
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyNumber("01612-987654");
                            }}
                            className="ml-auto text-[11px] font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity"
                            style={{ color: "#F55F20" }}
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              content_copy
                            </span>
                            Copy
                          </button>
                        </div>
                        <div className="space-y-2">
                          {[
                            <>Open <strong>Nagad</strong> app → Tap <strong>&quot;Send Money&quot;</strong></>,
                            <>Enter the number above and send the <strong>exact order amount</strong></>,
                            <>Enter your <strong>TrxID</strong> below after completing the transfer</>,
                          ].map((step, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-[11px] text-on-surface-variant"
                            >
                              <span
                                className="w-5 h-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                                style={{ background: "#F55F20" }}
                              >
                                {i + 1}
                              </span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 space-y-1.5">
                          <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">
                            Transaction ID (TrxID) *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. NG1234ABCD5"
                            className="checkout-input w-full bg-white border-2 rounded-[10px] px-4 py-2.5 text-[13px] text-on-surface placeholder:text-on-surface-variant/50 font-mono"
                            style={{ borderColor: "rgba(245,95,32,0.3)" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rocket */}
                  <div
                    className={`payment-card border-2 border-outline-variant/50 rounded-[16px] overflow-hidden ${
                      isPay("rocket") ? "selected" : ""
                    }`}
                  >
                    <div
                      className="flex items-center gap-3 p-4 cursor-pointer"
                      onClick={() => setPayment("rocket")}
                    >
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                        style={isPay("rocket") ? radioOn : radioOff}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={isPay("rocket") ? dotOn : dotOff}
                        ></div>
                      </div>
                      <div
                        className="w-10 h-10 rounded-[10px] overflow-hidden shrink-0 flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(135deg,#7B2D8B,#9B59B6)",
                        }}
                      >
                        <span
                          className="material-symbols-outlined text-white text-[20px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          rocket_launch
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[14px] text-on-surface">
                          Rocket
                        </p>
                        <p className="text-[11px] text-on-surface-variant">
                          DBBL Mobile Banking · Instant transfer
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                        {isPay("rocket") ? "expand_less" : "expand_more"}
                      </span>
                    </div>
                    <div
                      className={`accordion-body ${isPay("rocket") ? "open" : ""}`}
                    >
                      <div
                        className="mx-4 mb-4 p-4 rounded-[12px] border"
                        style={{
                          background: "#f9f4fc",
                          borderColor: "rgba(123,45,139,0.2)",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                            style={{
                              background:
                                "linear-gradient(135deg,#7B2D8B,#9B59B6)",
                            }}
                          >
                            <span
                              className="material-symbols-outlined text-white text-[16px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              rocket_launch
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-[13px] text-on-surface">
                              Send Money to Rocket
                            </p>
                            <p className="text-[11px] text-on-surface-variant">
                              Merchant Number
                            </p>
                          </div>
                        </div>
                        <div
                          className="flex items-center gap-2 bg-white rounded-[10px] px-3 py-2.5 border mb-3"
                          style={{ borderColor: "rgba(123,45,139,0.2)" }}
                        >
                          <span
                            className="material-symbols-outlined text-[18px]"
                            style={{ color: "#7B2D8B" }}
                          >
                            call
                          </span>
                          <span className="font-bold text-[16px] text-on-surface tracking-wider">
                            01501-112233
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyNumber("01501-112233");
                            }}
                            className="ml-auto text-[11px] font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity"
                            style={{ color: "#7B2D8B" }}
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              content_copy
                            </span>
                            Copy
                          </button>
                        </div>
                        <div className="space-y-2">
                          {[
                            <>Dial <strong>*322#</strong> or open <strong>Rocket</strong> app → Send Money</>,
                            <>Enter the number above and send the <strong>exact order amount</strong></>,
                            <>Enter your <strong>TrxID</strong> below after completing the transfer</>,
                          ].map((step, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-[11px] text-on-surface-variant"
                            >
                              <span
                                className="w-5 h-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                                style={{ background: "#7B2D8B" }}
                              >
                                {i + 1}
                              </span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 space-y-1.5">
                          <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">
                            Transaction ID (TrxID) *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. RK8888XYZ99"
                            className="checkout-input w-full bg-white border-2 rounded-[10px] px-4 py-2.5 text-[13px] text-on-surface placeholder:text-on-surface-variant/50 font-mono"
                            style={{ borderColor: "rgba(123,45,139,0.3)" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* COD info banner */}
                  {payment === "cod" && (
                    <div className="flex items-start gap-2.5 bg-secondary-container/30 border border-secondary/20 rounded-[12px] px-4 py-3">
                      <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5 shrink-0">
                        info
                      </span>
                      <p className="text-[12px] text-on-surface-variant leading-relaxed">
                        Cash on Delivery orders include a{" "}
                        <strong className="text-on-surface">
                          1% COD service charge
                        </strong>{" "}
                        added to your total. Pay the delivery agent in cash when
                        you receive your package.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ── SECTION 4: ORDER NOTES ── */}
              <div className="bg-surface-container-low rounded-[20px] md:rounded-[24px] border border-outline-variant/40 overflow-hidden shadow-sm">
                <div className="flex items-center gap-3 px-5 md:px-6 py-4 md:py-5 border-b border-outline-variant/30">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      edit_note
                    </span>
                  </div>
                  <div>
                    <h2 className="font-bold text-[15px] md:text-[17px] text-on-surface">
                      Order Notes
                    </h2>
                    <p className="text-[11px] text-on-surface-variant">
                      Optional · Special instructions for your order
                    </p>
                  </div>
                </div>
                <div className="p-5 md:p-6">
                  <textarea
                    rows={3}
                    placeholder="e.g. Please leave at the front gate if no one is home…"
                    className="checkout-input w-full bg-surface border-2 border-outline-variant/50 rounded-[14px] px-4 py-3 text-[14px] text-on-surface placeholder:text-on-surface-variant/50 resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* ════ RIGHT: ORDER SUMMARY ════ */}
            <div className="sticky-summary fade-in">
              <div className="bg-surface-container-low rounded-[20px] md:rounded-[24px] border border-outline-variant/40 overflow-hidden shadow-sm">
                <div className="flex items-center gap-3 px-5 md:px-6 py-4 md:py-5 border-b border-outline-variant/30">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span
                      className="material-symbols-outlined text-primary text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      receipt_long
                    </span>
                  </div>
                  <h2 className="font-bold text-[15px] md:text-[17px] text-on-surface">
                    Order Summary
                  </h2>
                </div>

                {/* Items list */}
                <div className="px-5 md:px-6 py-4 space-y-3 border-b border-outline-variant/20">
                  {[
                    {
                      icon: "local_fire_department",
                      name: "Garam Masala Blend",
                      qty: "200g × 2",
                      price: "৳498",
                      gradient: "linear-gradient(135deg,#ff8a65,#9f4122)",
                    },
                    {
                      icon: "spa",
                      name: "Pure Turmeric Powder",
                      qty: "500g × 1",
                      price: "৳189",
                      gradient: "linear-gradient(135deg,#ffe082,#e65100)",
                    },
                    {
                      icon: "grain",
                      name: "Cumin Seeds Whole",
                      qty: "300g × 1",
                      price: "৳119",
                      gradient: "linear-gradient(135deg,#d7ccc8,#4e342e)",
                    },
                    {
                      icon: "local_fire_department",
                      name: "Red Chilli Powder",
                      qty: "250g × 1",
                      price: "৳149",
                      gradient: "linear-gradient(135deg,#ef9a9a,#b71c1c)",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-[10px] shrink-0 flex items-center justify-center"
                        style={{ background: item.gradient }}
                      >
                        <span
                          className="material-symbols-outlined text-white text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {item.icon}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-on-surface truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-on-surface-variant">
                          {item.qty}
                        </p>
                      </div>
                      <span className="text-[13px] font-bold text-on-surface shrink-0">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div className="px-5 md:px-6 py-4 space-y-2.5 border-b border-outline-variant/20">
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-on-surface-variant">
                      Subtotal (4 items)
                    </span>
                    <span className="text-[13px] font-medium text-on-surface">
                      ৳955
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-on-surface-variant">
                      Delivery Charge
                    </span>
                    <span className="text-[13px] font-medium text-on-surface">
                      ৳{deliveryCharge}
                    </span>
                  </div>
                  {payment === "cod" && (
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] text-on-surface-variant flex items-center gap-1">
                        COD Charge{" "}
                        <span className="text-[10px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded-full font-bold">
                          1%
                        </span>
                      </span>
                      <span className="text-[13px] font-medium text-on-surface">
                        ৳{codCharge}
                      </span>
                    </div>
                  )}
                </div>

                <div className="px-5 md:px-6 py-4">
                  <div className="flex justify-between items-center mb-5">
                    <span className="font-bold text-[16px] text-on-surface">
                      Total
                    </span>
                    <div className="text-right">
                      <span className="font-bold text-[22px] text-primary">
                        ৳{total}
                      </span>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">
                        Incl. all charges
                      </p>
                    </div>
                  </div>

                  {/* Trust badges */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { icon: "verified_user", label: "Secure" },
                      { icon: "cached", label: "Easy Return" },
                      { icon: "eco", label: "100% Pure" },
                    ].map((b, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center gap-1 p-2 bg-surface rounded-[10px] border border-outline-variant/30"
                      >
                        <span className="material-symbols-outlined text-secondary text-[18px]">
                          {b.icon}
                        </span>
                        <span className="text-[9px] text-on-surface-variant font-medium text-center">
                          {b.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Animated order button */}
                  <div className="flex justify-center">
                    <button
                      className={`order ${isAnimating ? "animate" : ""}`}
                      onClick={handleOrderClick}
                    >
                      <span className="default">Complete Order</span>
                      <span className="success">
                        Order Placed
                        <svg viewBox="0 0 12 10">
                          <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                        </svg>
                      </span>
                      <div className="box"></div>
                      <div className="truck">
                        <div className="back"></div>
                        <div className="front">
                          <div className="window"></div>
                        </div>
                        <div className="light top"></div>
                        <div className="light bottom"></div>
                      </div>
                      <div className="lines"></div>
                    </button>
                  </div>
                  <p className="text-center text-[11px] text-on-surface-variant mt-2.5 flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-secondary">
                      shield
                    </span>
                    Protected by Shuddhota secure checkout
                  </p>
                </div>
              </div>

              {/* Back to cart */}
              <Link
                href="/cart"
                className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-on-surface-variant hover:text-primary transition-colors font-medium py-2"
              >
                <span className="material-symbols-outlined text-[16px]">
                  arrow_back
                </span>
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ORDER SUCCESS MODAL ─── */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="modal-overlay absolute inset-0"></div>
          <div className="relative bg-surface rounded-[28px] w-full max-w-md shadow-2xl scale-in border border-outline-variant/30 overflow-hidden">
            {/* Top accent stripe */}
            <div
              className="h-2 w-full"
              style={{
                background:
                  "linear-gradient(90deg,#9f4122,#ff8a65,#556500)",
              }}
            ></div>

            <div className="p-7 md:p-8 text-center">
              {/* Success icon */}
              <div className="relative w-20 h-20 mx-auto mb-5">
                <div
                  className="success-ring w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg,#d6ed7a,#bbd062)",
                  }}
                >
                  <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
                    <path
                      className="checkmark-path"
                      d="M8 20 L16 30 L32 12"
                      stroke="white"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="font-bold text-[22px] md:text-[26px] text-on-surface mb-1">
                Order Placed!
              </h2>
              <p className="text-on-surface-variant text-[14px] mb-1">
                Thank you for shopping with Shuddhota Co.
              </p>
              <div className="inline-flex items-center gap-1.5 bg-secondary-container text-on-secondary-container text-[12px] font-bold px-3 py-1 rounded-full mb-5">
                <span className="material-symbols-outlined text-[14px]">
                  tag
                </span>
                Order #{orderId}
              </div>

              {/* Order quick summary */}
              <div className="bg-surface-container-low rounded-[16px] p-4 mb-5 text-left border border-outline-variant/30">
                <div className="grid grid-cols-2 gap-3 text-[12px]">
                  <div>
                    <p className="text-on-surface-variant mb-0.5">Payment</p>
                    <p className="font-semibold text-on-surface">
                      {payLabels[payment]}
                    </p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant mb-0.5">Delivery</p>
                    <p className="font-semibold text-on-surface">
                      {zoneLabel} · {planLabel}
                    </p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant mb-0.5">Items</p>
                    <p className="font-semibold text-on-surface">4 items</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant mb-0.5">Total Paid</p>
                    <p className="font-bold text-primary">৳{total}</p>
                  </div>
                </div>
              </div>

              <p className="text-[12px] text-on-surface-variant mb-6">
                <span className="material-symbols-outlined text-[14px] text-secondary align-middle">
                  schedule
                </span>{" "}
                You&apos;ll receive a confirmation SMS shortly.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/cart"
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-outline-variant text-on-surface font-semibold text-[14px] py-3.5 rounded-full hover:border-primary hover:text-primary transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    shopping_bag
                  </span>
                  Continue Shopping
                </Link>
                <button
                  onClick={handleViewOrder}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-on-primary font-bold text-[14px] py-3.5 rounded-full hover:bg-primary/90 transition-all shadow-lg"
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    receipt_long
                  </span>
                  View Order Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── COPY TOAST ─── */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-inverse-surface text-inverse-on-surface text-[13px] font-medium px-5 py-3 rounded-full shadow-xl flex items-center gap-2 slide-up ${
          copyToast ? "" : "hidden"
        }`}
      >
        <span className="material-symbols-outlined text-[16px]">
          check_circle
        </span>
        Number copied!
      </div>
    </>
  );
}