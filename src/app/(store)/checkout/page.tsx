"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

/* ─── CONSTANTS ─── */
const ORDER_WEIGHT_KG = 0.7;   // total cart weight (0.4 + 0.1 + 0.2)
const WEIGHT_THRESHOLD = 2;      // kg — surcharge kicks in above this
const WEIGHT_RATE_CITY = 15;     // ৳ per extra kg (Gazipur City)
const WEIGHT_RATE_SUBURBS = 25;  // ৳ per extra kg (Suburbs & Inter-city)
const COD_RATE = 0.01;   // 1% processing fee
const EXPRESS_FEE = 60;     // ৳ (Gazipur City only)
const STANDARD_FEE = 0;      // ৳ (free)
const POST_DISCOUNT = 348;    // base cart total after item-level discounts
const COUPON_DISCOUNT = 18;     // ৳ when SPICE5 applied

export default function CheckoutPage() {
  /* ─── STATE ─── */
  const [zone, setZone] = useState('gazipur-city'); // 'gazipur-city' | 'suburbs'
  const [delivery, setDelivery] = useState('standard'); // 'standard' | 'express'
  const [payment, setPayment] = useState('bkash'); // 'bkash' | 'nagad' | 'cod'
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState({ type: '', text: '' });
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(true);

  /* ─── CALC HELPERS ─── */
  const deliveryFee = delivery === 'express' ? EXPRESS_FEE : STANDARD_FEE;
  
  const weightSurcharge = useMemo(() => {
    if (ORDER_WEIGHT_KG <= WEIGHT_THRESHOLD) return 0;
    const extraKg = Math.ceil(ORDER_WEIGHT_KG - WEIGHT_THRESHOLD);
    return extraKg * (zone === 'gazipur-city' ? WEIGHT_RATE_CITY : WEIGHT_RATE_SUBURBS);
  }, [zone]);

  const discountVal = couponApplied ? COUPON_DISCOUNT : 0;
  
  const codFee = useMemo(() => {
    if (payment !== 'cod') return 0;
    const base = POST_DISCOUNT + deliveryFee + weightSurcharge - discountVal;
    return Math.ceil(base * COD_RATE);
  }, [payment, deliveryFee, weightSurcharge, discountVal]);

  const total = POST_DISCOUNT + deliveryFee + weightSurcharge + codFee - discountVal;

  /* ─── HANDLERS ─── */
  const handleApplyCoupon = () => {
    if (couponApplied) {
      setCouponMsg({ type: 'info', text: 'Coupon already applied.' });
      return;
    }
    if (couponInput.trim().toUpperCase() === 'SPICE5') {
      setCouponApplied(true);
      setCouponMsg({ type: 'success', text: 'SPICE5 applied — ৳18 off!' });
    } else {
      setCouponMsg({ type: 'error', text: 'Invalid coupon. Try SPICE5!' });
    }
  };

  const handlePlaceOrder = () => {
    setIsOrderPlaced(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSetZone = (newZone: string) => {
    setZone(newZone);
    if (newZone === 'suburbs' && delivery === 'express') {
      setDelivery('standard');
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
      <style jsx global>{`
        .step-dot{transition:all .4s ease;}
        .step-dot.active{background-color:#9f4122;color:#fff;border-color:#9f4122;}
        .step-dot.inactive{background-color:#fff;color:#89726b;border-color:#ddc0b8;}
        .order-acc-content{max-height:0;overflow:hidden;transition:max-height .38s cubic-bezier(.4,0,.2,1);}
        .order-acc-content.open{max-height:900px;}
        .order-acc-icon{transition:transform .3s ease;}
        .order-acc-open .order-acc-icon{transform:rotate(180deg);}
        input:focus,select:focus,textarea:focus{outline:none;border-color:#9f4122;box-shadow:0 0 0 3px rgba(159,65,34,.12);}
        .pay-card{border:2px solid #ddc0b8;transition:all .2s ease;cursor:pointer;}
        .pay-card:hover{border-color:#ff8a65;background:#fff9ee;}
        .pay-card.selected{border-color:#9f4122;background:#fff9ee;}
        .delivery-card{border:2px solid #ddc0b8;transition:all .2s ease;cursor:pointer;}
        .delivery-card:hover:not(.delivery-disabled){border-color:#ff8a65;}
        .delivery-card.selected{border-color:#9f4122;background:#fff9ee;}
        .delivery-card.delivery-disabled{opacity:.38;cursor:not-allowed;pointer-events:none;}
        .zone-btn{border:2px solid #ddc0b8;transition:all .22s ease;cursor:pointer;border-radius:16px;padding:12px 14px;background:#fff;text-align:left;width:100%;}
        .zone-btn:hover:not(.zone-active){border-color:#ff8a65;}
        .zone-btn.zone-active{border-color:#9f4122;background:#fff9ee;}
        @media(min-width:1024px){.summary-sticky{position:sticky;top:108px;}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp .45s ease forwards;}
        .success-overlay{display:none;}
        .success-overlay.show{display:flex;animation:fadeUp .5s ease;}
        .mobile-checkout-bar{transform:translateY(100%);transition:transform .3s ease;}
        .mobile-checkout-bar.visible{transform:translateY(0);}
        input[type="checkbox"]{accent-color:#9f4122;width:17px;height:17px;}
        input[type="radio"]{accent-color:#9f4122;width:17px;height:17px;}
        .section-card{background:#fff;border:1px solid rgba(221,192,184,.45);border-radius:20px;box-shadow:0 2px 16px rgba(159,65,34,.05);}
        .cod-fee-badge{background:#fff3e0;border:1px solid #ffcc80;border-radius:999px;padding:2px 10px;font-size:11px;font-weight:700;color:#e65100;}
        .weight-info-bar{background:linear-gradient(90deg,rgba(85,101,0,.07),rgba(85,101,0,.03));border:1px solid rgba(85,101,0,.2);border-radius:14px;padding:10px 14px;}
      `}</style>

      {/* ─── SUCCESS OVERLAY ─── */}
      <div id="successOverlay" className={`success-overlay fixed inset-0 bg-background/97 backdrop-blur-xl z-[60] flex-col items-center justify-center px-6 text-center ${isOrderPlaced ? 'show' : ''}`}>
        <div className="fade-up flex flex-col items-center gap-6 max-w-md mx-auto">
          <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl" style={{background:'linear-gradient(135deg,#9f4122,#ff8a65)'}}>
            <span className="material-symbols-outlined text-white text-[52px]" style={{fontVariationSettings:"'FILL' 1"}}>check_circle</span>
          </div>
          <div>
            <h2 className="text-[28px] md:text-[36px] font-bold text-on-surface tracking-tight mb-2">Order Placed! 🎉</h2>
            <p className="text-on-surface-variant text-[15px] md:text-body-lg">Your order <span className="font-bold text-on-surface">#SHD-29471</span> has been confirmed. We&apos;ll send you an SMS & email with tracking details.</p>
          </div>
          <div className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 text-left space-y-3">
            <div className="flex justify-between text-[14px]">
              <span className="text-on-surface-variant">Estimated Delivery</span>
              <span className="font-semibold text-on-surface">{delivery === 'express' ? 'June 4, 2026' : 'June 5–8, 2026'}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-on-surface-variant">Payment Method</span>
              <span className="font-semibold text-on-surface">{payment === 'bkash' ? 'bKash' : payment === 'nagad' ? 'Nagad' : 'Cash on Delivery'}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-on-surface-variant">Total Paid</span>
              <span className="font-bold text-primary text-[16px]">৳{total}</span>
            </div>
          </div>
          <Link href="/products" className="w-full bg-primary text-on-primary font-bold text-[15px] py-4 rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-lg">
            <span className="material-symbols-outlined text-[20px]">shopping_basket</span>Continue Shopping
          </Link>
          <button onClick={() => setIsOrderPlaced(false)} className="text-on-surface-variant text-[13px] hover:text-primary transition-colors">Back to checkout</button>
        </div>
      </div>

      <main className="max-w-[1728px] mx-auto w-full">

      {/* ─── BREADCRUMB ─── */}
      <div className="pt-28 md:pt-36 pb-3 md:pb-6 px-6 md:px-container-padding">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-1.5 text-[11px] md:text-[13px] text-on-surface-variant">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link href="/cart" className="hover:text-primary transition-colors">Cart</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface font-medium">Checkout</span>
          </nav>
        </div>
      </div>

      {/* ─── HEADER + STEPS ─── */}
      <div className="px-6 md:px-container-padding pb-6 md:pb-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-[26px] md:text-[38px] font-bold text-on-surface tracking-tight mb-6 md:mb-8">Checkout</h1>
          <div className="flex items-center gap-0 md:gap-1 max-w-md">
            <div className="flex flex-col items-center gap-1.5">
              <div className="step-dot active w-8 h-8 md:w-9 md:h-9 rounded-full border-2 flex items-center justify-center text-[13px] font-bold">1</div>
              <span className="text-[10px] md:text-[12px] font-semibold text-primary">Info</span>
            </div>
            <div className="flex-1 h-0.5 bg-primary mx-1 md:mx-2"></div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="step-dot active w-8 h-8 md:w-9 md:h-9 rounded-full border-2 flex items-center justify-center text-[13px] font-bold">2</div>
              <span className="text-[10px] md:text-[12px] font-semibold text-primary">Delivery</span>
            </div>
            <div className="flex-1 h-0.5 bg-outline-variant/50 mx-1 md:mx-2"></div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="step-dot inactive w-8 h-8 md:w-9 md:h-9 rounded-full border-2 flex items-center justify-center text-[13px] font-bold">3</div>
              <span className="text-[10px] md:text-[12px] font-medium text-on-surface-variant">Payment</span>
            </div>
            <div className="flex-1 h-0.5 bg-outline-variant/50 mx-1 md:mx-2"></div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="step-dot inactive w-8 h-8 md:w-9 md:h-9 rounded-full border-2 flex items-center justify-center text-[13px] font-bold">4</div>
              <span className="text-[10px] md:text-[12px] font-medium text-on-surface-variant">Review</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN GRID ─── */}
      <section className="px-6 md:px-container-padding pb-32 md:pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] gap-6 md:gap-10 items-start">

            {/* ═══ LEFT: FORM ═══ */}
            <div className="flex flex-col gap-5 md:gap-6">

              {/* 1. CONTACT INFO */}
              <div className="section-card p-5 md:p-8 fade-up">
                <div className="flex items-center justify-between mb-5 md:mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <span className="text-on-primary font-bold text-[13px]">1</span>
                    </div>
                    <h2 className="text-[16px] md:text-headline-md font-bold text-on-surface">Contact Information</h2>
                  </div>
                  <span className="text-[12px] text-on-surface-variant hidden md:block">Have an account? <Link href="#" className="text-primary font-semibold hover:underline">Sign in</Link></span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide">First Name</label>
                    <input type="text" placeholder="Rahim" className="bg-surface-container-low border border-outline-variant rounded-[14px] px-4 py-3 text-[14px] md:text-[15px] text-on-surface placeholder-on-surface-variant/50 transition-all"/>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide">Last Name</label>
                    <input type="text" placeholder="Uddin" className="bg-surface-container-low border border-outline-variant rounded-[14px] px-4 py-3 text-[14px] md:text-[15px] text-on-surface placeholder-on-surface-variant/50 transition-all"/>
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide">Email Address</label>
                    <input type="email" placeholder="rahim@example.com" className="bg-surface-container-low border border-outline-variant rounded-[14px] px-4 py-3 text-[14px] md:text-[15px] text-on-surface placeholder-on-surface-variant/50 transition-all"/>
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide">Phone Number</label>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant rounded-[14px] px-3 py-3 shrink-0">
                        <span className="text-[18px]">🇧🇩</span>
                        <span className="text-[14px] font-medium text-on-surface">+880</span>
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
                      </div>
                      <input type="tel" placeholder="01XXXXXXXXX" className="flex-1 bg-surface-container-low border border-outline-variant rounded-[14px] px-4 py-3 text-[14px] md:text-[15px] text-on-surface placeholder-on-surface-variant/50 transition-all"/>
                    </div>
                  </div>
                </div>
                <label className="flex items-center gap-2.5 mt-4 cursor-pointer">
                  <input type="checkbox"/>
                  <span className="text-[13px] text-on-surface-variant">Send me order updates via SMS</span>
                </label>
              </div>

              {/* 2. DELIVERY ADDRESS */}
              <div className="section-card p-5 md:p-8 fade-up" style={{animationDelay:'.07s'}}>
                <div className="flex items-center gap-3 mb-5 md:mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <span className="text-on-primary font-bold text-[13px]">2</span>
                  </div>
                  <h2 className="text-[16px] md:text-headline-md font-bold text-on-surface">Delivery Address</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide">Street Address / House No.</label>
                    <input type="text" placeholder="House 12, Road 5, Dhanmondi" className="bg-surface-container-low border border-outline-variant rounded-[14px] px-4 py-3 text-[14px] md:text-[15px] text-on-surface placeholder-on-surface-variant/50 transition-all"/>
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide">Apartment / Floor (Optional)</label>
                    <input type="text" placeholder="Flat 4B, 3rd Floor" className="bg-surface-container-low border border-outline-variant rounded-[14px] px-4 py-3 text-[14px] md:text-[15px] text-on-surface placeholder-on-surface-variant/50 transition-all"/>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide">Division</label>
                    <div className="relative">
                      <select className="w-full appearance-none bg-surface-container-low border border-outline-variant rounded-[14px] px-4 py-3 text-[14px] md:text-[15px] text-on-surface transition-all pr-10">
                        <option value="">Select Division</option>
                        <option value="dhaka" selected>Dhaka</option>
                        <option value="chittagong">Chittagong</option>
                        <option value="sylhet">Sylhet</option>
                        <option value="rajshahi">Rajshahi</option>
                        <option value="khulna">Khulna</option>
                        <option value="barishal">Barishal</option>
                        <option value="rangpur">Rangpur</option>
                        <option value="mymensingh">Mymensingh</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant pointer-events-none">expand_more</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide">District</label>
                    <input type="text" placeholder="Gazipur" className="bg-surface-container-low border border-outline-variant rounded-[14px] px-4 py-3 text-[14px] md:text-[15px] text-on-surface placeholder-on-surface-variant/50 transition-all"/>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide">Thana / Upazila</label>
                    <input type="text" placeholder="Gazipur Sadar" className="bg-surface-container-low border border-outline-variant rounded-[14px] px-4 py-3 text-[14px] md:text-[15px] text-on-surface placeholder-on-surface-variant/50 transition-all"/>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide">Postal Code</label>
                    <input type="text" placeholder="1700" className="bg-surface-container-low border border-outline-variant rounded-[14px] px-4 py-3 text-[14px] md:text-[15px] text-on-surface placeholder-on-surface-variant/50 transition-all"/>
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide">Delivery Notes (Optional)</label>
                    <textarea rows={2} placeholder="e.g. Green building, call before delivery..." className="bg-surface-container-low border border-outline-variant rounded-[14px] px-4 py-3 text-[14px] md:text-[15px] text-on-surface placeholder-on-surface-variant/50 transition-all resize-none"></textarea>
                  </div>
                </div>
                <label className="flex items-center gap-2.5 mt-4 cursor-pointer">
                  <input type="checkbox" checked readOnly/>
                  <span className="text-[13px] text-on-surface-variant">Save this address for future orders</span>
                </label>
              </div>

              {/* 3. DELIVERY METHOD */}
              <div className="section-card p-5 md:p-8 fade-up" style={{animationDelay:'.12s'}}>
                <div className="flex items-center gap-3 mb-5 md:mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <span className="text-on-primary font-bold text-[13px]">3</span>
                  </div>
                  <h2 className="text-[16px] md:text-headline-md font-bold text-on-surface">Delivery Method</h2>
                </div>

                {/* ── ZONE SELECTOR ── */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-[12px] md:text-[13px] font-semibold text-on-surface-variant uppercase tracking-wide">Select Your Delivery Zone</p>
                    <span className="text-[11px] text-on-surface-variant italic">Affects pricing & options</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Gazipur City */}
                    <button 
                      className={`zone-btn flex flex-col gap-1.5 ${zone === 'gazipur-city' ? 'zone-active' : ''}`} 
                      onClick={() => handleSetZone('gazipur-city')}
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]" style={{fontVariationSettings:"'FILL' 1"}}>location_city</span>
                        <span className="font-bold text-[13px] text-on-surface">Gazipur City</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant leading-snug">Express available<br/>+৳15/extra kg (above 2 kg)</p>
                    </button>
                    {/* Suburbs */}
                    <button 
                      className={`zone-btn flex flex-col gap-1.5 ${zone === 'suburbs' ? 'zone-active' : ''}`}
                      onClick={() => handleSetZone('suburbs')}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-[18px] ${zone === 'suburbs' ? 'text-primary' : 'text-on-surface-variant'}`}>map</span>
                        <span className="font-bold text-[13px] text-on-surface">Suburbs & Inter-city</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant leading-snug">Standard delivery only<br/>+৳25/extra kg (above 2 kg)</p>
                    </button>
                  </div>
                </div>

                {/* ── WEIGHT INFO BANNER ── */}
                <div className="weight-info-bar mb-4 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]" style={{fontVariationSettings:"'FILL' 1"}}>scale</span>
                    <span className="text-[12px] md:text-[13px] text-on-surface font-medium">Order weight: <strong>{ORDER_WEIGHT_KG} kg</strong></span>
                    <span className="text-[11px] text-secondary font-semibold bg-secondary-container/50 px-2 py-0.5 rounded-full">Under 2 kg — no surcharge</span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant">Surcharge rate: ৳{zone === 'gazipur-city' ? WEIGHT_RATE_CITY : WEIGHT_RATE_SUBURBS}/extra kg</span>
                </div>

                {/* ── DELIVERY OPTIONS ── */}
                <div className="flex flex-col gap-3">

                  {/* Standard */}
                  <div 
                    className={`delivery-card rounded-2xl p-4 md:p-5 ${delivery === 'standard' ? 'selected' : ''}`}
                    onClick={() => setDelivery('standard')}
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <input type="radio" name="delivery" checked={delivery === 'standard'} className="shrink-0" readOnly/>
                      <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-secondary-container flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-on-secondary-container text-[20px]">local_shipping</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-[14px] md:text-[15px] text-on-surface">Standard Delivery</p>
                          <span className={`font-bold text-[14px] shrink-0 ${deliveryFee === 0 ? 'text-secondary' : 'text-on-surface'}`}>{STANDARD_FEE === 0 ? 'Free' : '৳' + STANDARD_FEE}</span>
                        </div>
                        <p className="text-[12px] md:text-[13px] text-on-surface-variant mt-0.5">3–5 business days · Available all Bangladesh</p>
                      </div>
                    </div>
                    <div className="ml-[52px] md:ml-[56px] mt-2 flex items-center gap-1.5 text-[11px] text-secondary font-medium">
                      <span className="material-symbols-outlined text-[13px]" style={{fontVariationSettings:"'FILL' 1"}}>check_circle</span>
                      Free on orders over ৳599
                    </div>
                  </div>

                  {/* Express */}
                  <div 
                    className={`delivery-card rounded-2xl p-4 md:p-5 ${delivery === 'express' ? 'selected' : ''} ${zone === 'suburbs' ? 'delivery-disabled' : ''}`}
                    onClick={() => zone === 'gazipur-city' && setDelivery('express')}
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <input type="radio" name="delivery" checked={delivery === 'express'} className="shrink-0" readOnly/>
                      <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-primary-fixed flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-[20px]">rocket_launch</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-[14px] md:text-[15px] text-on-surface">Express Delivery</p>
                            <span className="bg-primary text-on-primary text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Gazipur City</span>
                          </div>
                          <span className="font-bold text-[14px] md:text-[15px] text-on-surface shrink-0">৳{EXPRESS_FEE}</span>
                        </div>
                        <p className="text-[12px] md:text-[13px] text-on-surface-variant mt-0.5">Same day or next day delivery</p>
                      </div>
                    </div>
                    <div className="ml-[52px] md:ml-[56px] mt-2">
                      <span className={`text-[11px] font-medium ${zone === 'gazipur-city' ? 'text-secondary' : 'text-error'}`}>
                        <span className="material-symbols-outlined text-[13px] align-middle" style={{fontVariationSettings:"'FILL' 1"}}>{zone === 'gazipur-city' ? 'check_circle' : 'cancel'}</span>
                        {zone === 'gazipur-city' ? ' Available in your zone' : ' Not available outside Gazipur City'}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* 4. PAYMENT */}
              <div className="section-card p-5 md:p-8 fade-up" style={{animationDelay:'.17s'}}>
                <div className="flex items-center gap-3 mb-5 md:mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <span className="text-on-primary font-bold text-[13px]">4</span>
                  </div>
                  <h2 className="text-[16px] md:text-headline-md font-bold text-on-surface">Payment Method</h2>
                </div>

                <div className="flex flex-col gap-3">

                  {/* bKash */}
                  <div 
                    className={`pay-card rounded-2xl p-4 md:p-5 ${payment === 'bkash' ? 'selected' : ''}`}
                    onClick={() => setPayment('bkash')}
                  >
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" checked={payment === 'bkash'} className="shrink-0" readOnly/>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{background:'#E2136E'}}>
                        <span className="font-black text-white text-[13px] tracking-tight leading-none">bK</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[14px] md:text-[15px] text-on-surface">bKash</p>
                        <p className="text-[12px] text-on-surface-variant">Mobile banking payment</p>
                      </div>
                      <span className="text-[10px] font-bold text-on-secondary bg-secondary px-2.5 py-1 rounded-full">0% fee</span>
                    </div>
                    {payment === 'bkash' && (
                      <div className="mt-4 ml-[52px] flex flex-col gap-3">
                        <div className="bg-surface-container rounded-xl p-3.5 border border-outline-variant/30">
                          <p className="text-[12px] text-on-surface-variant mb-1">Send Money to:</p>
                          <p className="font-bold text-[16px] text-on-surface tracking-wide">017XX-XXXXXX</p>
                          <p className="text-[11px] text-on-surface-variant mt-1">(Personal) → Tap &quot;Send Money&quot;</p>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide">bKash Transaction ID</label>
                          <input type="text" placeholder="e.g. 8XXXXXXXXX" className="bg-surface-container-low border border-outline-variant rounded-[14px] px-4 py-3 text-[14px] text-on-surface placeholder-on-surface-variant/50 transition-all"/>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Nagad */}
                  <div 
                    className={`pay-card rounded-2xl p-4 md:p-5 ${payment === 'nagad' ? 'selected' : ''}`}
                    onClick={() => setPayment('nagad')}
                  >
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" checked={payment === 'nagad'} className="shrink-0" readOnly/>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{background:'linear-gradient(135deg,#FF6B00,#FF9800)'}}>
                        <span className="font-black text-white text-[12px] tracking-tight">Ng</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[14px] md:text-[15px] text-on-surface">Nagad</p>
                        <p className="text-[12px] text-on-surface-variant">Fast & secure mobile banking</p>
                      </div>
                      <span className="text-[10px] font-bold text-on-secondary bg-secondary px-2.5 py-1 rounded-full">0% fee</span>
                    </div>
                    {payment === 'nagad' && (
                      <div className="mt-4 ml-[52px] flex flex-col gap-3">
                        <div className="bg-surface-container rounded-xl p-3.5 border border-outline-variant/30">
                          <p className="text-[12px] text-on-surface-variant mb-1">Send Money to:</p>
                          <p className="font-bold text-[16px] text-on-surface">018XX-XXXXXX</p>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide">Nagad Transaction ID</label>
                          <input type="text" placeholder="Transaction ID" className="bg-surface-container-low border border-outline-variant rounded-[14px] px-4 py-3 text-[14px] text-on-surface placeholder-on-surface-variant/50 transition-all"/>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* COD */}
                  <div 
                    className={`pay-card rounded-2xl p-4 md:p-5 ${payment === 'cod' ? 'selected' : ''}`}
                    onClick={() => setPayment('cod')}
                  >
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" checked={payment === 'cod'} className="shrink-0" readOnly/>
                      <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-secondary text-[20px]">payments</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[14px] md:text-[15px] text-on-surface">Cash on Delivery</p>
                        <p className="text-[12px] text-on-surface-variant">Pay when your order arrives</p>
                      </div>
                      <span className="cod-fee-badge shrink-0">+{payment === 'cod' ? `৳${codFee}` : '1% fee'}</span>
                    </div>
                    {payment === 'cod' && (
                      <div className="mt-3 ml-[52px]">
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex flex-col gap-1.5">
                          <div className="flex items-start gap-1.5">
                            <span className="material-symbols-outlined text-[15px] text-amber-700 mt-0.5 shrink-0" style={{fontVariationSettings:"'FILL' 1"}}>info</span>
                            <p className="text-[12px] text-amber-900 font-medium">A <strong>1% processing fee</strong> is added for Cash on Delivery. This is calculated on the order total including delivery charges.</p>
                          </div>
                          <div className="flex items-center justify-between mt-1 pt-2 border-t border-amber-200">
                            <span className="text-[12px] text-amber-800">COD processing fee (1%)</span>
                            <span className="text-[13px] font-bold text-amber-900">৳{codFee}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                <div className="mt-5 flex items-center gap-2 text-[12px] text-on-surface-variant">
                  <span className="material-symbols-outlined text-[15px]" style={{color:'#2e7d32',fontVariationSettings:"'FILL' 1"}}>lock</span>
                  Your payment information is encrypted and securely processed.
                </div>
              </div>

              {/* 5. TERMS + PLACE ORDER (desktop) */}
              <div className="hidden md:block section-card p-5 md:p-7 fade-up" style={{animationDelay:'.22s'}}>
                <label className="flex items-start gap-2.5 mb-5 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 shrink-0"/>
                  <span className="text-[13px] text-on-surface-variant leading-relaxed">I agree to Shuddhota Co.&apos;s <Link href="#" className="text-primary font-semibold hover:underline">Terms & Conditions</Link> and <Link href="#" className="text-primary font-semibold hover:underline">Privacy Policy</Link>. I confirm my delivery address is correct.</span>
                </label>
                <button onClick={handlePlaceOrder} className="w-full bg-primary text-on-primary font-bold text-[15px] md:text-[16px] py-4 md:py-5 rounded-full hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2.5 active:scale-[0.98]">
                  <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                  Place Order · ৳{total}
                </button>
                <p className="text-center text-[11px] text-on-surface-variant mt-3 flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[13px]" style={{color:'#2e7d32',fontVariationSettings:"'FILL' 1"}}>verified</span>
                  100% secure · BSTI certified products
                </p>
              </div>

            </div>
            {/* ═══ END LEFT ═══ */}

            {/* ═══ RIGHT: ORDER SUMMARY ═══ */}
            <div className="summary-sticky">

              {/* Mobile collapsible */}
              <div className="lg:hidden section-card mb-5 overflow-hidden">
                <button onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)} className={`w-full flex items-center justify-between p-5 text-left ${isOrderSummaryOpen ? 'order-acc-open' : ''}`}>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">receipt_long</span>
                    <span className="font-bold text-[15px] text-on-surface">Order Summary</span>
                    <span className="bg-primary text-on-primary text-[11px] font-bold px-2 py-0.5 rounded-full">4 items</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[17px] text-primary">৳{total}</span>
                    <span className={`material-symbols-outlined order-acc-icon text-on-surface-variant text-[20px] ${isOrderSummaryOpen ? 'rotate-180' : ''}`}>expand_more</span>
                  </div>
                </button>
                <div className={`order-acc-content px-5 pb-5 ${isOrderSummaryOpen ? 'open' : ''}`}>
                  <div className="flex flex-col gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-[12px] border border-outline-variant/30 shrink-0 flex items-center justify-center" style={{background:'linear-gradient(135deg,#ff8a65,#9f4122)'}}>
                        <span className="material-symbols-outlined text-white text-[22px]">local_fire_department</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-on-surface truncate">Garam Masala Blend</p>
                        <p className="text-[11px] text-on-surface-variant">200g · Qty: 2 · 0.4 kg</p>
                      </div>
                      <p className="font-bold text-[14px] text-on-surface shrink-0">৳498</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-[12px] border border-outline-variant/30 shrink-0 flex items-center justify-center" style={{background:'linear-gradient(135deg,#d6ed7a,#8fa800)'}}>
                        <span className="material-symbols-outlined text-on-surface/70 text-[22px]">grass</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-on-surface truncate">Turmeric Powder</p>
                        <p className="text-[11px] text-on-surface-variant">100g · Qty: 1 · 0.1 kg</p>
                      </div>
                      <p className="font-bold text-[14px] text-on-surface shrink-0">৳99</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-[12px] border border-outline-variant/30 shrink-0 flex items-center justify-center" style={{background:'linear-gradient(135deg,#bbe9ff,#326578)'}}>
                        <span className="material-symbols-outlined text-white text-[22px]">soup_kitchen</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-on-surface truncate">Coriander Seeds</p>
                        <p className="text-[11px] text-on-surface-variant">200g · Qty: 1 · 0.2 kg</p>
                      </div>
                      <p className="font-bold text-[14px] text-on-surface shrink-0">৳149</p>
                    </div>
                  </div>
                  <div className="h-px bg-outline-variant/30 mb-3"></div>
                  <div className="flex flex-col gap-1.5 text-[13px]">
                    <div className="flex justify-between"><span className="text-on-surface-variant">Subtotal</span><span className="font-medium text-on-surface">৳{POST_DISCOUNT + 398}</span></div>
                    <div className="flex justify-between"><span className="text-on-surface-variant">Discount</span><span className="font-medium text-error">–৳{398 + discountVal}</span></div>
                    <div className="flex justify-between"><span className="text-on-surface-variant">Delivery</span><span className={`font-medium ${deliveryFee === 0 ? 'text-secondary' : 'text-on-surface'}`}>{deliveryFee === 0 ? 'Free' : '৳' + deliveryFee}</span></div>
                    {weightSurcharge > 0 && <div className="flex justify-between"><span className="text-on-surface-variant">Weight surcharge</span><span className="font-medium text-on-surface">৳{weightSurcharge}</span></div>}
                    {codFee > 0 && <div className="flex justify-between"><span className="text-on-surface-variant">COD fee (1%)</span><span className="font-medium text-on-surface">৳{codFee}</span></div>}
                  </div>
                  <div className="h-px bg-outline-variant/30 my-3"></div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[15px] text-on-surface">Total</span>
                    <span className="font-bold text-[21px] text-primary">৳{total}</span>
                  </div>
                </div>
              </div>

              {/* Desktop Summary Card */}
              <div className="hidden lg:block section-card p-6 md:p-7">
                <h3 className="font-bold text-[18px] text-on-surface mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">receipt_long</span>
                  Order Summary
                </h3>

                {/* Items */}
                <div className="flex flex-col gap-4 mb-5">
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 rounded-[14px] border border-outline-variant/30 flex items-center justify-center" style={{background:'linear-gradient(135deg,#ff8a65,#9f4122)'}}>
                        <span className="material-symbols-outlined text-white text-[26px]">local_fire_department</span>
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-on-primary text-[10px] font-bold rounded-full flex items-center justify-center">2</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[13px] text-on-surface leading-tight mb-0.5">Garam Masala Blend</p>
                      <p className="text-[11px] text-on-surface-variant">200g · 0.4 kg total</p>
                      <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-medium mt-1 inline-block">17% OFF</span>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-bold text-[14px] text-on-surface">৳498</p>
                      <p className="text-[11px] text-on-surface-variant line-through">৳598</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 rounded-[14px] border border-outline-variant/30 flex items-center justify-center" style={{background:'linear-gradient(135deg,#d6ed7a,#8fa800)'}}>
                        <span className="material-symbols-outlined text-on-surface/70 text-[26px]">grass</span>
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-on-primary text-[10px] font-bold rounded-full flex items-center justify-center">1</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[13px] text-on-surface leading-tight mb-0.5">Turmeric Powder</p>
                      <p className="text-[11px] text-on-surface-variant">100g · 0.1 kg total</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-bold text-[14px] text-on-surface">৳99</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 rounded-[14px] border border-outline-variant/30 flex items-center justify-center" style={{background:'linear-gradient(135deg,#bbe9ff,#326578)'}}>
                        <span className="material-symbols-outlined text-white text-[26px]">soup_kitchen</span>
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-on-primary text-[10px] font-bold rounded-full flex items-center justify-center">1</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[13px] text-on-surface leading-tight mb-0.5">Coriander Seeds</p>
                      <p className="text-[11px] text-on-surface-variant">200g · 0.2 kg total</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-bold text-[14px] text-on-surface">৳149</p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-outline-variant/30 mb-4"></div>

                {/* Coupon */}
                <div className="mb-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">confirmation_number</span>
                      <input 
                        type="text" 
                        placeholder="Coupon code" 
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        disabled={couponApplied}
                        className={`w-full bg-surface-container-low border border-outline-variant rounded-[14px] pl-9 pr-4 py-3 text-[13px] text-on-surface placeholder-on-surface-variant/50 transition-all ${couponApplied ? 'opacity-60' : ''}`}
                      />
                    </div>
                    <button onClick={handleApplyCoupon} className="bg-on-surface text-surface font-semibold text-[13px] px-4 py-3 rounded-[14px] hover:bg-on-surface/90 transition-colors whitespace-nowrap">Apply</button>
                  </div>
                  {couponMsg.text && (
                    <p className={`text-[12px] mt-2 ${couponMsg.type === 'success' ? 'text-secondary' : couponMsg.type === 'error' ? 'text-error' : 'text-on-surface-variant'}`}>
                      {couponMsg.type === 'success' && <span className="material-symbols-outlined text-[14px] align-middle" style={{fontVariationSettings:"'FILL' 1"}}>check_circle</span>} {couponMsg.text}
                    </p>
                  )}
                </div>

                {/* Price breakdown */}
                <div className="flex flex-col gap-2 text-[14px] mb-4">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Subtotal (4 items)</span>
                    <span className="text-on-surface font-medium">৳{POST_DISCOUNT + 398}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Discount</span>
                    <span className="text-error font-semibold">–৳{398 + discountVal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Delivery</span>
                    <span className={`font-semibold ${deliveryFee === 0 ? 'text-secondary' : 'text-on-surface'}`}>{deliveryFee === 0 ? 'Free' : '৳' + deliveryFee}</span>
                  </div>
                  {weightSurcharge > 0 && (
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Weight surcharge (৳{zone === 'gazipur-city' ? WEIGHT_RATE_CITY : WEIGHT_RATE_SUBURBS}/kg)</span>
                      <span className="text-on-surface font-semibold">৳{weightSurcharge}</span>
                    </div>
                  )}
                  {codFee > 0 && (
                    <div className="flex justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-on-surface-variant">COD fee</span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">1%</span>
                      </div>
                      <span className="text-on-surface font-semibold">৳{codFee}</span>
                    </div>
                  )}
                </div>

                <div className="h-px bg-outline-variant/30 mb-4"></div>

                {/* Total */}
                <div className="flex justify-between items-center mb-5">
                  <div>
                    <span className="font-bold text-[17px] text-on-surface">Total</span>
                    <p className="text-[11px] text-on-surface-variant">All charges included</p>
                  </div>
                  <span className="font-bold text-[27px] text-primary">৳{total}</span>
                </div>

                {/* CTA */}
                <button onClick={handlePlaceOrder} className="w-full bg-primary text-on-primary font-bold text-[15px] py-4 rounded-full hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2.5 active:scale-[0.98]">
                  <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                  Place Order · ৳{total}
                </button>

                {/* Trust */}
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[12px] text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px]" style={{color:'#2e7d32',fontVariationSettings:"'FILL' 1"}}>lock</span>
                    256-bit SSL encrypted & secure
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px] text-secondary" style={{fontVariationSettings:"'FILL' 1"}}>replay</span>
                    Easy 7-day return policy
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px] text-primary" style={{fontVariationSettings:"'FILL' 1"}}>verified</span>
                    BSTI certified, 100% natural
                  </div>
                </div>

                <div className="h-px bg-outline-variant/30 mt-4 mb-4"></div>

                {/* Estimated delivery */}
                <div className="flex items-center gap-2.5 bg-secondary-container/30 border border-secondary-container/60 rounded-xl p-3.5">
                  <span className="material-symbols-outlined text-secondary text-[22px]" style={{fontVariationSettings:"'FILL' 1"}}>local_shipping</span>
                  <div>
                    <p className="text-[12px] font-semibold text-on-surface">Estimated Delivery</p>
                    <p className="text-[11px] text-on-surface-variant">{delivery === 'express' ? 'June 4, 2026 (Same/Next day)' : 'June 5 – June 8, 2026'}</p>
                  </div>
                </div>

                {/* Pricing rules note */}
                <div className="mt-4 bg-surface-container-low border border-outline-variant/30 rounded-xl p-3.5 flex flex-col gap-1.5">
                  <p className="text-[11px] font-bold text-on-surface uppercase tracking-wide mb-0.5">Pricing Rules</p>
                  <div className="flex items-start gap-1.5 text-[11px] text-on-surface-variant">
                    <span className="material-symbols-outlined text-[13px] text-amber-600 mt-0.5 shrink-0" style={{fontVariationSettings:"'FILL' 1"}}>info</span>
                    <span>Orders over 2 kg: <strong className="text-on-surface">+৳15/kg</strong> (Gazipur City) or <strong className="text-on-surface">+৳25/kg</strong> (Suburbs & Inter-city)</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[11px] text-on-surface-variant">
                    <span className="material-symbols-outlined text-[13px] text-amber-600 mt-0.5 shrink-0" style={{fontVariationSettings:"'FILL' 1"}}>info</span>
                    <span>Cash on Delivery: <strong className="text-on-surface">+1%</strong> processing fee on total</span>
                  </div>
                </div>

                {/* Payment logos */}
                <div className="mt-4 flex items-center gap-2 flex-wrap justify-center">
                  <span className="text-[10px] text-on-surface-variant mr-1">We accept:</span>
                  <div className="h-6 px-2.5 rounded-md flex items-center justify-center text-[11px] font-black text-white" style={{background:'#E2136E'}}>bKash</div>
                  <div className="h-6 px-2.5 rounded-md flex items-center justify-center text-[11px] font-black text-white" style={{background:'linear-gradient(135deg,#FF6B00,#FF9800)'}}>Nagad</div>
                  <div className="h-6 px-2.5 rounded-md flex items-center justify-center text-[11px] font-semibold text-on-surface-variant bg-surface-container-high border border-outline-variant/30">COD</div>
                </div>
              </div>

            </div>
            {/* ═══ END RIGHT ═══ */}

          </div>
        </div>
      </section>
      </main>

      {/* ─── MOBILE STICKY BAR ─── */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-surface/96 backdrop-blur-xl border-t border-outline-variant/30 shadow-2xl px-4 py-3 transition-transform duration-300 translate-y-0`}>
        <div className="flex items-center gap-3">
          <div>
            <p className="text-[10px] text-on-surface-variant leading-none mb-0.5">4 items</p>
            <p className="font-bold text-[19px] text-primary leading-none">৳{total}</p>
          </div>
          <button onClick={handlePlaceOrder} className="flex-1 bg-primary text-on-primary font-bold text-[14px] py-3.5 rounded-full hover:bg-primary/90 transition-colors shadow-lg flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            Place Order
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="flex items-center gap-1 text-[10px] text-on-surface-variant">
            <span className="material-symbols-outlined text-[12px]" style={{color:'#2e7d32',fontVariationSettings:"'FILL' 1"}}>lock</span>Secure
          </div>
          <div className="flex items-center gap-1 text-[10px] text-on-surface-variant">
            <span className="material-symbols-outlined text-[12px] text-secondary" style={{fontVariationSettings:"'FILL' 1"}}>replay</span>7-day returns
          </div>
          <div className="flex items-center gap-1 text-[10px] text-on-surface-variant">
            <span className="material-symbols-outlined text-[12px] text-primary" style={{fontVariationSettings:"'FILL' 1"}}>verified</span>BSTI cert.
          </div>
        </div>
      </div>
    </div>
  );
}
