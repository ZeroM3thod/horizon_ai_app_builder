"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  ChevronRight, 
  ShoppingBag, 
  ArrowLeft, 
  Ticket, 
  ShieldCheck, 
  RotateCcw, 
  Truck, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Minus,
  X
} from "lucide-react";
import Link from "next/link";

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  weight: string;
  category: string;
  icon: string;
  gradient: string;
  rating: number;
  reviews: number;
  selected: boolean;
}

const INITIAL_ITEMS: CartItem[] = [
  { 
    id: 'item-1', 
    name: 'Garam Masala Blend', 
    price: 249, 
    qty: 2, 
    weight: '200g', 
    category: 'Ground Masala', 
    icon: 'local_fire_department', 
    gradient: 'linear-gradient(135deg,#ff8a65 0%,#9f4122 40%,#5d1a0a 100%)',
    rating: 5,
    reviews: 428,
    selected: true
  },
  { 
    id: 'item-2', 
    name: 'Pure Turmeric Powder', 
    price: 189, 
    qty: 1, 
    weight: '500g', 
    category: 'Ground Masala', 
    icon: 'spa', 
    gradient: 'linear-gradient(135deg,#ffe082 0%,#f9a825 50%,#e65100 100%)',
    rating: 5,
    reviews: 93,
    selected: true
  },
  { 
    id: 'item-3', 
    name: 'Whole Cumin Seeds', 
    price: 119, 
    qty: 1, 
    weight: '100g', 
    category: 'Whole Spice', 
    icon: 'grain', 
    gradient: 'linear-gradient(135deg,#d7ccc8 0%,#8d6e63 50%,#4e342e 100%)',
    rating: 4,
    reviews: 47,
    selected: true
  },
  { 
    id: 'item-4', 
    name: 'Coriander Powder', 
    price: 149, 
    qty: 1, 
    weight: '200g', 
    category: 'Ground Masala', 
    icon: 'eco', 
    gradient: 'linear-gradient(135deg,#c8e6c9 0%,#66bb6a 50%,#2e7d32 100%)',
    rating: 5,
    reviews: 61,
    selected: true
  }
];

const SUGGESTIONS = [
  { name: 'Red Chilli Powder', price: 169, weight: '200g', trait: 'Hot & Spicy', icon: 'local_fire_department', gradient: 'linear-gradient(135deg,#ffccbc 0%,#ff7043 60%,#bf360c 100%)' },
  { name: 'Cardamom Pods', price: 299, weight: '50g', trait: 'Aromatic', icon: 'grass', gradient: 'linear-gradient(135deg,#e8f5e9 0%,#66bb6a 60%,#1b5e20 100%)' },
  { name: 'Fenugreek Seeds', price: 129, weight: '150g', trait: 'Herbal', icon: 'water_drop', gradient: 'linear-gradient(135deg,#fff9c4 0%,#f9a825 60%,#e65100 100%)' },
  { name: 'Biryani Masala', price: 219, weight: '100g', trait: 'Blend', icon: 'soup_kitchen', gradient: 'linear-gradient(135deg,#fce4ec 0%,#ef5350 60%,#b71c1c 100%)' }
];

const MaterialIcon = ({ name, size = 24, className = "", style = {} }: { name: string, size?: number, className?: string, style?: React.CSSProperties }) => {
  return (
    <span className={`material-symbols-outlined ${className}`} style={{ fontSize: `${size}px`, ...style }}>
      {name}
    </span>
  );
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState({ type: '', text: '' });
  const [isStickyVisible, setIsStickyVisible] = useState(false);

  const FREE_SHIP_THRESHOLD = 599;
  const SHIP_COST = 60;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) setIsStickyVisible(true);
      else if (window.scrollY <= 80) setIsStickyVisible(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { subtotal, units } = useMemo(() => {
    let sub = 0;
    let u = 0;
    items.forEach(item => {
      if (item.selected) {
        sub += item.price * item.qty;
        u += item.qty;
      }
    });
    return { subtotal: sub, units: u };
  }, [items]);

  const discount = Math.round(subtotal * promoDiscount);
  const afterDiscount = subtotal - discount;
  const shipping = (afterDiscount > 0 && afterDiscount < FREE_SHIP_THRESHOLD) ? SHIP_COST : 0;
  const total = afterDiscount + shipping;
  const shipProgress = subtotal > 0 ? Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100) : 0;

  const changeQty = (id: string, delta: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, qty: Math.max(1, Math.min(99, item.qty + delta)) } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleSelect = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const toggleAll = (checked: boolean) => {
    setItems(prev => prev.map(item => ({ ...item, selected: checked })));
  };

  const removeSelected = () => {
    setItems(prev => prev.filter(item => !item.selected));
  };

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'SHUDDHOTA10') {
      setPromoDiscount(0.10);
      setPromoMsg({ type: 'success', text: '10% discount applied!' });
    } else if (code === 'SPICE20') {
      setPromoDiscount(0.20);
      setPromoMsg({ type: 'success', text: '20% discount applied!' });
    } else {
      setPromoDiscount(0);
      setPromoMsg({ type: 'error', text: 'Invalid promo code. Try SHUDDHOTA10' });
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      <style jsx global>{`
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; font-size: 24px; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; white-space: nowrap; word-wrap: normal; direction: ltr; -webkit-font-feature-settings: 'liga'; -webkit-font-smoothing: antialiased; }
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .qty-btn { transition: background-color 0.15s ease, color 0.15s ease; }
        .qty-btn:hover { background-color: #9f4122; color: #fff; }
        .product-sugg { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .product-sugg:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(159,65,34,0.12); }
        .ship-bar-fill { transition: width 0.6s cubic-bezier(0.4,0,0.2,1); }
        .sticky-checkout { transform: translateY(100%); transition: transform 0.3s ease; }
        .sticky-checkout.visible { transform: translateY(0); }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .float-anim { animation: float 3s ease-in-out infinite; }
        input[type="checkbox"] { accent-color: #9f4122; }
      `}</style>

      <main className="max-w-[1728px] mx-auto w-full">
        {/* BREADCRUMB */}
        <div className="pt-28 md:pt-36 pb-5 md:pb-7 px-6 md:px-container-padding">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center gap-1.5 text-[11px] md:text-[13px] text-on-surface-variant mb-4">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight size={14} />
              <span className="text-on-surface font-semibold">Cart</span>
            </nav>
            <div className="flex items-center gap-3">
              <h1 className="font-display-xl text-[28px] md:text-[42px] font-bold tracking-tight text-on-surface">Your Cart</h1>
              <span className="bg-primary text-on-primary text-[12px] font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1">{units}</span>
            </div>
          </div>
        </div>

        {/* CART CONTENT */}
        <section className="px-6 md:px-container-padding pb-24 md:pb-32">
          <div className="max-w-7xl mx-auto">
            {items.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-10 items-start">
                {/* LEFT: ITEMS */}
                <div className="lg:col-span-2 space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between py-1.5 px-1">
                    <label className="flex items-center gap-2.5 cursor-pointer text-[13px] text-on-surface-variant select-none font-medium">
                      <input 
                        type="checkbox" 
                        checked={items.length > 0 && items.every(i => i.selected)}
                        onChange={(e) => toggleAll(e.target.checked)}
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                      <span>Select All Items</span>
                    </label>
                    <button onClick={removeSelected} className="text-[12px] text-error font-semibold hover:text-error/70 transition-colors flex items-center gap-1">
                      <MaterialIcon name="delete_sweep" size={16} />
                      Remove Selected
                    </button>
                  </div>

                  {items.map((item) => (
                    <div key={item.id} className="bg-surface-container-low rounded-[20px] md:rounded-[24px] border border-outline-variant/40 p-4 md:p-5 flex gap-3 md:gap-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <input 
                          type="checkbox" 
                          checked={item.selected}
                          onChange={() => toggleSelect(item.id)}
                          className="w-4 h-4 rounded cursor-pointer mt-1 shrink-0"
                        />
                        <div className="w-[72px] h-[72px] md:w-24 md:h-24 rounded-[14px] overflow-hidden shrink-0 relative" style={{ background: item.gradient }}>
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                            <MaterialIcon name={item.icon} size={32} className="text-white/90" style={{ fontVariationSettings: "'FILL' 1" }} />
                            <span className="text-white text-[7px] font-bold tracking-wider uppercase">{item.name.split(' ')[0]}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-[14px] md:text-[16px] text-on-surface hover:text-primary transition-colors leading-snug truncate">{item.name}</h3>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold tracking-wide rounded-full px-2.5 py-0.5">{item.weight}</span>
                              <span className="text-on-surface-variant text-[11px]">{item.category}</span>
                            </div>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="text-on-surface-variant hover:text-error transition-colors p-1 rounded-full hover:bg-error/10 shrink-0">
                            <X size={18} />
                          </button>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <span className="text-primary text-[13px]">{'★'.repeat(item.rating)}{'☆'.repeat(5-item.rating)}</span>
                          <span className="text-[11px] text-on-surface-variant ml-1">({item.reviews})</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 mt-auto">
                          <div className="flex items-center border-2 border-outline-variant rounded-full overflow-hidden">
                            <button onClick={() => changeQty(item.id, -1)} className="qty-btn w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-on-surface font-bold text-[15px]"><Minus size={16} /></button>
                            <span className="w-8 md:w-9 text-center font-bold text-[14px] text-on-surface">{item.qty}</span>
                            <button onClick={() => changeQty(item.id, 1)} className="qty-btn w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-on-surface font-bold text-[15px]"><Plus size={16} /></button>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[17px] md:text-[20px] text-on-surface leading-none">৳{item.price * item.qty}</p>
                            <p className="text-[10px] md:text-[11px] text-on-surface-variant mt-0.5">৳{item.price} each</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="pt-2">
                    <Link href="/products" className="inline-flex items-center gap-1.5 text-[13px] md:text-body-md text-on-surface-variant hover:text-primary transition-colors font-medium">
                      <ArrowLeft size={18} />
                      Continue Shopping
                    </Link>
                  </div>
                </div>

                {/* RIGHT: SUMMARY */}
                <div className="lg:col-span-1 lg:sticky lg:top-28 space-y-4">
                  <div className="bg-surface-container-low rounded-[24px] border border-outline-variant/40 p-5 md:p-6 shadow-sm">
                    <h3 className="font-bold text-[18px] md:text-headline-md text-on-surface mb-5">Order Summary</h3>
                    
                    {/* Promo */}
                    <div className="mb-5">
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                          <input 
                            type="text" 
                            placeholder="Promo code" 
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="w-full bg-surface border-2 border-outline-variant rounded-2xl pl-9 pr-3 py-2.5 text-on-surface text-[14px] focus:border-primary transition-colors placeholder:text-on-surface-variant/60 outline-none"
                          />
                        </div>
                        <button onClick={applyPromo} className="bg-on-surface text-surface font-semibold px-4 py-2.5 rounded-2xl text-[13px] hover:bg-on-surface/80 transition-colors whitespace-nowrap shrink-0">Apply</button>
                      </div>
                      {promoMsg.text && (
                        <div className={`mt-2 text-[12px] font-medium flex items-center gap-1.5 ${promoMsg.type === 'success' ? 'text-secondary' : 'text-error'}`}>
                          {promoMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                          {promoMsg.text}
                        </div>
                      )}
                      <p className="text-[10px] text-on-surface-variant mt-1.5">Try <span className="font-semibold text-primary cursor-pointer hover:underline" onClick={() => { setPromoCode('SHUDDHOTA10'); setPromoDiscount(0.10); setPromoMsg({ type: 'success', text: '10% discount applied!' }); }}>SHUDDHOTA10</span> for 10% off</p>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-3 border-t border-outline-variant/30 pt-4">
                      <div className="flex justify-between text-[14px]">
                        <span className="text-on-surface-variant">Subtotal ({units} items)</span>
                        <span className="text-on-surface font-medium">৳{subtotal}</span>
                      </div>
                      <div className="flex justify-between text-[14px]">
                        <span className="text-on-surface-variant">Shipping</span>
                        <span className={`${shipping === 0 ? 'text-secondary font-semibold' : 'text-on-surface font-medium'}`}>{shipping === 0 ? 'Free' : `৳${shipping}`}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-[14px]">
                          <span className="text-secondary flex items-center gap-1"><Ticket size={14} /> Discount</span>
                          <span className="text-secondary font-bold">−৳{discount}</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t-2 border-outline-variant/30 mt-4 pt-4 flex justify-between items-center">
                      <span className="font-bold text-[17px] md:text-[18px] text-on-surface">Total</span>
                      <div className="text-right">
                        <p className="font-bold text-[24px] md:text-[28px] text-on-surface leading-none">৳{total}</p>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">Incl. all taxes</p>
                      </div>
                    </div>

                    <Link href="/checkout" className="mt-5 w-full bg-primary text-on-primary font-semibold py-4 rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.01] flex items-center justify-center gap-2.5 text-[15px]">
                      <ShieldCheck size={20} />
                      Proceed to Checkout
                    </Link>

                    <div className="mt-4 flex items-center gap-2 justify-center flex-wrap">
                      <div className="flex items-center gap-1 text-[11px] text-on-surface-variant"><ShieldCheck size={14} className="text-secondary" /> Secure payment</div>
                      <span className="text-outline-variant text-[10px]">·</span>
                      <div className="flex items-center gap-1 text-[11px] text-on-surface-variant"><RotateCcw size={14} className="text-tertiary" /> 7-day returns</div>
                      <span className="text-outline-variant text-[10px]">·</span>
                      <div className="flex items-center gap-1 text-[11px] text-on-surface-variant"><Truck size={14} className="text-secondary" /> Free ৳599+</div>
                    </div>
                  </div>

                  {/* Payments */}
                  <div className="bg-surface-container-low rounded-[20px] border border-outline-variant/40 p-4 md:p-5 shadow-sm">
                    <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">We Accept</p>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="flex flex-col items-center gap-1.5 bg-surface rounded-xl p-2.5 border border-outline-variant/30">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[9px] bg-[#E2136E]">bK</div>
                        <span className="text-[9px] text-on-surface-variant font-medium">bKash</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 bg-surface rounded-xl p-2.5 border border-outline-variant/30">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[10px] bg-[#F6821F]">N</div>
                        <span className="text-[9px] text-on-surface-variant font-medium">Nagad</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 bg-surface rounded-xl p-2.5 border border-outline-variant/30">
                        <div className="w-8 h-8 rounded-xl bg-surface-container-high flex items-center justify-center">
                           <MaterialIcon name="credit_card" size={16} />
                        </div>
                        <span className="text-[9px] text-on-surface-variant font-medium">Card</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 bg-surface rounded-xl p-2.5 border border-outline-variant/30">
                        <div className="w-8 h-8 rounded-xl bg-surface-container-high flex items-center justify-center">
                           <MaterialIcon name="payments" size={16} />
                        </div>
                        <span className="text-[9px] text-on-surface-variant font-medium">COD</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="bg-surface-container-low rounded-[20px] border border-outline-variant/40 p-4 md:p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-2.5">
                      <Truck size={20} className="text-secondary" />
                      <p className="text-[13px] font-semibold text-on-surface">
                        {subtotal >= FREE_SHIP_THRESHOLD ? (
                          <>You&apos;ve unlocked <span className="text-secondary">Free Shipping!</span></>
                        ) : (
                          <>Add <span className="text-secondary font-bold">৳{FREE_SHIP_THRESHOLD - subtotal}</span> more for Free Shipping</>
                        )}
                      </p>
                    </div>
                    <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="ship-bar-fill h-full bg-secondary rounded-full" style={{ width: `${shipProgress}%` }}></div>
                    </div>
                    <p className={`text-[11px] mt-1.5 font-medium ${subtotal >= FREE_SHIP_THRESHOLD ? 'text-secondary' : 'text-on-surface-variant'}`}>
                      {subtotal >= FREE_SHIP_THRESHOLD ? '🎉 Free delivery on your order' : `৳${FREE_SHIP_THRESHOLD - subtotal} away from free delivery`}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="fade-in text-center py-16 md:py-24 px-4">
                <div className="float-anim inline-block mb-6">
                  <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center mx-auto border-2 border-dashed border-outline-variant/60">
                    <ShoppingBag size={44} className="text-on-surface-variant" />
                  </div>
                </div>
                <h3 className="font-bold text-[22px] md:text-[28px] text-on-surface mb-2">Your cart is empty</h3>
                <p className="text-on-surface-variant text-[14px] md:text-body-md mb-8 max-w-xs mx-auto">No spices yet! Explore our collection and discover your kitchen&apos;s next secret weapon.</p>
                <Link href="/products" className="inline-flex items-center gap-2 bg-primary text-on-primary font-semibold px-8 py-3.5 rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                  <ShoppingBag size={20} />
                  Browse Products
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* SUGGESTIONS */}
        <section className="px-6 md:px-container-padding py-12 md:py-16 bg-surface border-t border-outline-variant/20">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 md:mb-8">
              <p className="text-[11px] font-bold tracking-[0.12em] text-secondary uppercase mb-2">Frequently Bought Together</p>
              <h2 className="font-display-xl text-[22px] md:text-[32px] font-bold tracking-tight text-on-surface">You May Also Like</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {SUGGESTIONS.map((s, i) => (
                <div key={i} className="product-sugg bg-surface-container-low rounded-[20px] border border-outline-variant/30 overflow-hidden group cursor-pointer">
                  <div className="h-32 md:h-40 relative overflow-hidden" style={{ background: s.gradient }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MaterialIcon name={s.icon} size={46} className="text-white/90 group-hover:scale-110 transition-transform duration-300" style={{ fontVariationSettings: "'FILL' 1" }} />
                    </div>
                  </div>
                  <div className="p-3 md:p-4">
                    <p className="font-semibold text-[13px] md:text-[15px] text-on-surface mb-0.5 truncate">{s.name}</p>
                    <p className="text-[11px] text-on-surface-variant mb-2.5">{s.weight} · {s.trait}</p>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-[15px] text-on-surface">৳{s.price}</p>
                      <button className="add-btn w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-on-primary flex items-center justify-center">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* STICKY MOBILE CHECKOUT */}
      <div className={`sticky-checkout fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-surface/95 backdrop-blur-xl border-t border-outline-variant/30 shadow-2xl px-4 py-3 flex items-center gap-3 ${isStickyVisible && items.length > 0 ? 'visible' : ''}`}>
        <div>
          <p className="text-[10px] text-on-surface-variant">Selected items · {shipping === 0 ? 'Free delivery' : 'Express delivery'}</p>
          <p className="font-bold text-[18px] text-on-surface leading-none">৳{total}</p>
        </div>
        <Link href="/checkout" className="flex-1 bg-primary text-on-primary font-semibold text-[14px] py-3.5 rounded-full hover:bg-primary/90 transition-colors shadow-lg flex items-center justify-center gap-2">
          <ShieldCheck size={18} />
          Checkout
        </Link>
      </div>
    </div>
  );
}
