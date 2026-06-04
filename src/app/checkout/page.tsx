"use client";

import React, { useState, useMemo } from "react";
import { 
  ChevronRight, 
  Verified,
  Truck,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Banknote,
  Receipt,
  Rocket,
  ShoppingBag
} from "lucide-react";
import Link from "next/link";

const ORDER_WEIGHT_KG = 0.7;
const WEIGHT_THRESHOLD = 2;
const WEIGHT_RATE_CITY = 15;
const WEIGHT_RATE_SUBURBS = 25;
const COD_RATE = 0.01;
const EXPRESS_FEE = 60;
const STANDARD_FEE = 0;
const POST_DISCOUNT = 348;
const COUPON_DISCOUNT = 18;

const MaterialIcon = ({ name, size = 24, className = "", style = {} }: { name: string, size?: number, className?: string, style?: React.CSSProperties }) => {
  return (
    <span className={`material-symbols-outlined ${className}`} style={{ fontSize: `${size}px`, ...style }}>
      {name}
    </span>
  );
};

export default function CheckoutPage() {
  const [zone, setZone] = useState('gazipur-city');
  const [delivery, setDelivery] = useState('standard');
  const [payment, setPayment] = useState('bkash');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState({ type: '', text: '' });
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isMobileSummaryOpen, setIsOrderSummaryOpen] = useState(true);

  // Derived state
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

  const handleApplyCoupon = () => {
    if (couponApplied) return;
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

  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      <style jsx global>{`
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; font-size: 24px; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; white-space: nowrap; word-wrap: normal; direction: ltr; -webkit-font-feature-settings: 'liga'; -webkit-font-smoothing: antialiased; }
        .step-dot { transition: all .4s ease; }
        .pay-card, .delivery-card, .zone-btn { transition: all .2s ease; cursor: pointer; border: 2px solid #ddc0b8; }
        .pay-card.selected, .delivery-card.selected, .zone-btn.zone-active { border-color: #9f4122; background: #fff9ee; }
        .delivery-card.disabled { opacity: .38; cursor: not-allowed; pointer-events: none; }
        .order-acc-content { max-height: 0; overflow: hidden; transition: max-height .38s cubic-bezier(.4,0,.2,1); }
        .order-acc-content.open { max-height: 900px; }
        .section-card { background: #fff; border: 1px solid rgba(221,192,184,0.45); border-radius: 20px; box-shadow: 0 2px 16px rgba(159,65,34,0.05); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp .45s ease forwards; }
      `}</style>

      {/* SUCCESS OVERLAY */}
      {isOrderPlaced && (
        <div className="fixed inset-0 bg-background/97 backdrop-blur-xl z-[60] flex flex-col items-center justify-center px-6 text-center">
          <div className="fade-up flex flex-col items-center gap-6 max-w-md mx-auto">
            <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl" style={{ background: 'linear-gradient(135deg,#9f4122,#ff8a65)' }}>
              <CheckCircle2 className="text-white" size={52} />
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
              <ShoppingBag size={20} />Continue Shopping
            </Link>
            <button onClick={() => setIsOrderPlaced(false)} className="text-on-surface-variant text-[13px] hover:text-primary transition-colors">Back to checkout</button>
          </div>
        </div>
      )}

      <main className="max-w-[1728px] mx-auto w-full">
        {/* BREADCRUMB */}
        <div className="pt-28 md:pt-36 pb-3 md:pb-6 px-6 md:px-container-padding">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center gap-1.5 text-[11px] md:text-[13px] text-on-surface-variant">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight size={14} />
              <Link href="/cart" className="hover:text-primary transition-colors">Cart</Link>
              <ChevronRight size={14} />
              <span className="text-on-surface font-medium">Checkout</span>
            </nav>
          </div>
        </div>

        {/* HEADER + STEPS */}
        <div className="px-6 md:px-container-padding pb-6 md:pb-10">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-[26px] md:text-[38px] font-bold text-on-surface tracking-tight mb-6 md:mb-8">Checkout</h1>
            <div className="flex items-center gap-0 md:gap-1 max-w-md">
              <div className="flex flex-col items-center gap-1.5">
                <div className="step-dot active w-8 h-8 md:w-9 md:h-9 rounded-full border-2 flex items-center justify-center text-[13px] font-bold bg-primary text-white border-primary">1</div>
                <span className="text-[10px] md:text-[12px] font-semibold text-primary">Info</span>
              </div>
              <div className="flex-1 h-0.5 bg-primary mx-1 md:mx-2"></div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="step-dot active w-8 h-8 md:w-9 md:h-9 rounded-full border-2 flex items-center justify-center text-[13px] font-bold bg-primary text-white border-primary">2</div>
                <span className="text-[10px] md:text-[12px] font-semibold text-primary">Delivery</span>
              </div>
              <div className="flex-1 h-0.5 bg-outline-variant/50 mx-1 md:mx-2"></div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="step-dot w-8 h-8 md:w-9 md:h-9 rounded-full border-2 flex items-center justify-center text-[13px] font-bold bg-white text-outline border-outline-variant">3</div>
                <span className="text-[10px] md:text-[12px] font-medium text-on-surface-variant">Payment</span>
              </div>
              <div className="flex-1 h-0.5 bg-outline-variant/50 mx-1 md:mx-2"></div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="step-dot w-8 h-8 md:w-9 md:h-9 rounded-full border-2 flex items-center justify-center text-[13px] font-bold bg-white text-outline border-outline-variant">4</div>
                <span className="text-[10px] md:text-[12px] font-medium text-on-surface-variant">Review</span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <section className="px-6 md:px-container-padding pb-32 md:pb-28">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] gap-6 md:gap-10 items-start">

              {/* LEFT: FORM */}
              <div className="flex flex-col gap-5 md:gap-6">
                
                {/* 1. CONTACT */}
                <div className="section-card p-5 md:p-8 fade-up">
                  <div className="flex items-center justify-between mb-5 md:mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <span className="text-on-primary font-bold text-[13px]">1</span>
                      </div>
                      <h2 className="text-[16px] md:text-headline-md font-bold text-on-surface">Contact Information</h2>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <input type="text" placeholder="First Name" className="bg-surface-container-low border border-outline-variant rounded-[14px] px-4 py-3 text-[14px] md:text-[15px] outline-none focus:border-primary" />
                    <input type="text" placeholder="Last Name" className="bg-surface-container-low border border-outline-variant rounded-[14px] px-4 py-3 text-[14px] md:text-[15px] outline-none focus:border-primary" />
                    <input type="email" placeholder="Email Address" className="sm:col-span-2 bg-surface-container-low border border-outline-variant rounded-[14px] px-4 py-3 text-[14px] md:text-[15px] outline-none focus:border-primary" />
                    <div className="sm:col-span-2 flex gap-2">
                      <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant rounded-[14px] px-3 py-3 shrink-0">
                        <span>🇧🇩</span><span className="text-[14px] font-medium">+880</span>
                      </div>
                      <input type="tel" placeholder="01XXXXXXXXX" className="flex-1 bg-surface-container-low border border-outline-variant rounded-[14px] px-4 py-3 text-[14px] md:text-[15px] outline-none focus:border-primary" />
                    </div>
                  </div>
                </div>

                {/* 2. ADDRESS */}
                <div className="section-card p-5 md:p-8 fade-up">
                  <div className="flex items-center gap-3 mb-5 md:mb-6">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <span className="text-on-primary font-bold text-[13px]">2</span>
                    </div>
                    <h2 className="text-[16px] md:text-headline-md font-bold text-on-surface">Delivery Address</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <input type="text" placeholder="Street Address / House No." className="sm:col-span-2 bg-surface-container-low border border-outline-variant rounded-[14px] px-4 py-3 text-[14px] md:text-[15px] outline-none focus:border-primary" />
                    <div className="relative">
                      <select className="w-full appearance-none bg-surface-container-low border border-outline-variant rounded-[14px] px-4 py-3 text-[14px] md:text-[15px] pr-10 outline-none focus:border-primary">
                        <option value="dhaka">Dhaka</option>
                        <option value="gazipur">Gazipur</option>
                      </select>
                      <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-on-surface-variant" size={18} />
                    </div>
                    <input type="text" placeholder="District" className="bg-surface-container-low border border-outline-variant rounded-[14px] px-4 py-3 text-[14px] md:text-[15px] outline-none focus:border-primary" />
                    <input type="text" placeholder="Thana / Upazila" className="bg-surface-container-low border border-outline-variant rounded-[14px] px-4 py-3 text-[14px] md:text-[15px] outline-none focus:border-primary" />
                    <input type="text" placeholder="Postal Code" className="bg-surface-container-low border border-outline-variant rounded-[14px] px-4 py-3 text-[14px] md:text-[15px] outline-none focus:border-primary" />
                  </div>
                </div>

                {/* 3. METHOD */}
                <div className="section-card p-5 md:p-8 fade-up">
                  <div className="flex items-center gap-3 mb-5 md:mb-6">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <span className="text-on-primary font-bold text-[13px]">3</span>
                    </div>
                    <h2 className="text-[16px] md:text-headline-md font-bold text-on-surface">Delivery Method</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button 
                      onClick={() => { setZone('gazipur-city'); if (delivery === 'express') setDelivery('express'); }}
                      className={`zone-btn p-4 rounded-2xl flex flex-col gap-1 ${zone === 'gazipur-city' ? 'zone-active' : ''}`}
                    >
                      <div className="flex items-center gap-2"><MapPin size={18} className="text-primary" /><span className="font-bold text-[13px]">Gazipur City</span></div>
                      <p className="text-[11px] text-on-surface-variant">Express available</p>
                    </button>
                    <button 
                      onClick={() => { setZone('suburbs'); setDelivery('standard'); }}
                      className={`zone-btn p-4 rounded-2xl flex flex-col gap-1 ${zone === 'suburbs' ? 'zone-active' : ''}`}
                    >
                      <div className="flex items-center gap-2"><MapPin size={18} className="text-on-surface-variant" /><span className="font-bold text-[13px]">Suburbs</span></div>
                      <p className="text-[11px] text-on-surface-variant">Standard only</p>
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div 
                      onClick={() => setDelivery('standard')}
                      className={`delivery-card p-4 rounded-2xl ${delivery === 'standard' ? 'selected' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${delivery === 'standard' ? 'border-primary' : 'border-outline-variant'}`}>
                          {delivery === 'standard' && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                        </div>
                        <Truck size={24} className="text-secondary" />
                        <div className="flex-1">
                          <div className="flex justify-between"><p className="font-bold text-[15px]">Standard Delivery</p><p className="font-bold text-secondary">Free</p></div>
                          <p className="text-[12px] text-on-surface-variant">3–5 business days</p>
                        </div>
                      </div>
                    </div>

                    <div 
                      onClick={() => { if (zone === 'gazipur-city') setDelivery('express'); }}
                      className={`delivery-card p-4 rounded-2xl ${delivery === 'express' ? 'selected' : ''} ${zone !== 'gazipur-city' ? 'disabled' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${delivery === 'express' ? 'border-primary' : 'border-outline-variant'}`}>
                          {delivery === 'express' && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                        </div>
                        <Rocket size={24} className="text-primary" />
                        <div className="flex-1">
                          <div className="flex justify-between"><p className="font-bold text-[15px]">Express Delivery</p><p className="font-bold text-on-surface">৳60</p></div>
                          <p className="text-[12px] text-on-surface-variant">Same/Next day delivery</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. PAYMENT */}
                <div className="section-card p-5 md:p-8 fade-up">
                  <div className="flex items-center gap-3 mb-5 md:mb-6">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <span className="text-on-primary font-bold text-[13px]">4</span>
                    </div>
                    <h2 className="text-[16px] md:text-headline-md font-bold text-on-surface">Payment Method</h2>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div onClick={() => setPayment('bkash')} className={`pay-card p-4 rounded-2xl ${payment === 'bkash' ? 'selected' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${payment === 'bkash' ? 'border-primary' : 'border-outline-variant'}`}>
                          {payment === 'bkash' && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-[#E2136E] flex items-center justify-center font-bold text-white text-[12px]">bK</div>
                        <p className="font-bold text-[15px]">bKash</p>
                      </div>
                      {payment === 'bkash' && (
                        <div className="mt-4 ml-7 flex flex-col gap-3">
                          <div className="bg-surface-container rounded-xl p-3 border border-outline-variant/30">
                            <p className="text-[12px] text-on-surface-variant">Send Money to: <strong className="text-on-surface">017XX-XXXXXX</strong></p>
                          </div>
                          <input type="text" placeholder="Transaction ID" className="bg-white border border-outline-variant rounded-xl px-4 py-2.5 text-[14px] outline-none" />
                        </div>
                      )}
                    </div>

                    <div onClick={() => setPayment('cod')} className={`pay-card p-4 rounded-2xl ${payment === 'cod' ? 'selected' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${payment === 'cod' ? 'border-primary' : 'border-outline-variant'}`}>
                          {payment === 'cod' && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-secondary"><Banknote size={20} /></div>
                        <div className="flex-1">
                          <p className="font-bold text-[15px]">Cash on Delivery</p>
                          <p className="text-[11px] text-on-surface-variant">+1% processing fee</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden md:block section-card p-8 fade-up">
                  <button onClick={handlePlaceOrder} className="w-full bg-primary text-on-primary font-bold py-5 rounded-full text-[18px] flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] transition-transform">
                    <ShoppingBag size={22} />
                    Place Order · ৳{total}
                  </button>
                </div>
              </div>

              {/* RIGHT: SUMMARY */}
              <div className="lg:sticky lg:top-28">
                {/* Mobile Acc */}
                <div className="lg:hidden section-card mb-5 overflow-hidden">
                  <button onClick={() => setIsOrderSummaryOpen(!isMobileSummaryOpen)} className="w-full flex items-center justify-between p-5">
                    <div className="flex items-center gap-2"><Receipt className="text-primary" size={20} /><span className="font-bold">Summary</span></div>
                    <div className="flex items-center gap-2"><span className="font-bold text-primary">৳{total}</span><ChevronRight size={20} className={isMobileSummaryOpen ? '-rotate-90' : 'rotate-90'} /></div>
                  </button>
                  <div className={`order-acc-content ${isMobileSummaryOpen ? 'open' : ''} px-5 pb-5`}>
                     <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-[13px]"><span className="text-on-surface-variant">Subtotal</span><span className="font-bold text-on-surface">৳{POST_DISCOUNT + 398}</span></div>
                        <div className="flex justify-between text-[13px] text-error"><span>Discount</span><span>–৳{398 + discountVal}</span></div>
                        <div className="flex justify-between text-[13px]"><span>Delivery</span><span className="font-bold text-secondary">{deliveryFee === 0 ? 'Free' : `৳${deliveryFee}`}</span></div>
                        {codFee > 0 && <div className="flex justify-between text-[13px]"><span>COD Fee</span><span className="font-bold">৳{codFee}</span></div>}
                     </div>
                     <div className="h-px bg-outline-variant/30 mb-3"></div>
                     <div className="flex justify-between items-center"><span className="font-bold">Total</span><span className="font-bold text-[22px] text-primary">৳{total}</span></div>
                  </div>
                </div>

                <div className="hidden lg:block section-card p-7 space-y-6">
                  <h3 className="font-bold text-[18px] flex items-center gap-2"><Receipt size={22} className="text-primary" /> Order Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-xl bg-primary-fixed flex items-center justify-center shrink-0"><MaterialIcon name="local_fire_department" size={24} className="text-primary" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[13px] truncate">Garam Masala Blend</p>
                        <p className="text-[11px] text-on-surface-variant">200g · Qty: 2</p>
                      </div>
                      <p className="font-bold text-[14px]">৳498</p>
                    </div>
                  </div>

                  <div className="h-px bg-outline-variant/30"></div>

                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Coupon" 
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-[13px] outline-none" 
                    />
                    <button onClick={handleApplyCoupon} className="bg-on-surface text-surface px-4 py-2.5 rounded-xl text-[13px] font-bold">Apply</button>
                  </div>
                  {couponMsg.text && <p className={`text-[12px] ${couponMsg.type === 'success' ? 'text-secondary' : 'text-error'}`}>{couponMsg.text}</p>}

                  <div className="space-y-2 text-[14px]">
                    <div className="flex justify-between text-on-surface-variant"><span>Subtotal</span><span className="text-on-surface font-medium">৳{POST_DISCOUNT + 398}</span></div>
                    <div className="flex justify-between text-error"><span>Discount</span><span className="font-medium">–৳{398 + discountVal}</span></div>
                    <div className="flex justify-between text-on-surface-variant"><span>Delivery</span><span className="text-secondary font-bold">{deliveryFee === 0 ? 'Free' : `৳${deliveryFee}`}</span></div>
                    {codFee > 0 && <div className="flex justify-between text-on-surface-variant"><span>COD Fee (1%)</span><span className="text-on-surface font-medium">৳{codFee}</span></div>}
                  </div>

                  <div className="h-px bg-outline-variant/30"></div>
                  <div className="flex justify-between items-center"><span className="font-bold text-[18px]">Total</span><span className="font-bold text-[28px] text-primary">৳{total}</span></div>
                  
                  <button onClick={handlePlaceOrder} className="w-full bg-primary text-on-primary font-bold py-4 rounded-full text-[16px] shadow-lg shadow-primary/20">Place Order</button>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 text-[12px] text-on-surface-variant"><ShieldCheck size={14} className="text-secondary" /> Secure payment</div>
                    <div className="flex items-center gap-2 text-[12px] text-on-surface-variant"><Verified size={14} className="text-primary" /> BSTI Certified</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* MOBILE STICKY */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-xl border-t p-4 shadow-2xl flex items-center gap-4">
        <div><p className="text-[10px] text-on-surface-variant">Total</p><p className="font-bold text-[20px] text-primary leading-none">৳{total}</p></div>
        <button onClick={handlePlaceOrder} className="flex-1 bg-primary text-on-primary font-bold py-3.5 rounded-full flex items-center justify-center gap-2"><ShoppingBag size={18} /> Place Order</button>
      </div>
    </div>
  );
}
