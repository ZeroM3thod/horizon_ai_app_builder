"use client";

import React, { useState, useEffect } from "react";
import { 
  ChevronRight, 
  ShoppingCart, 
  ArrowRight, 
  Verified,
  Heart,
  Share2,
  Plus,
  Minus,
  Bolt,
  ThumbsUp,
  Truck,
  RotateCcw
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// ──────────────────────────────────────────────
//  PRODUCT DATA (Sync with products/page.tsx)
// ──────────────────────────────────────────────
const ALL_PRODUCTS = [
  { id:1, name:'Green Cardamom', category:'whole-spices', catLabel:'Whole Spice', price:349, originalPrice:null, weight:'50g', origin:'Kerala Origin', rating:5, reviews:267, badge:'bestseller', bgGradient:'linear-gradient(135deg,#bbe9ff,#80b1c7)', iconName:'spa', iconColor:'#326578', circleColor:'rgba(50,101,120,0.18)', tags:['bestseller'], order:6 },
  { id:2, name:'Black Pepper', category:'whole-spices', catLabel:'Whole Spice', price:189, originalPrice:229, weight:'100g', origin:'Malabar Grade', rating:5, reviews:198, badge:'sale', bgGradient:'linear-gradient(135deg,#ede8dd,#ffdbd0)', iconName:'grain', iconColor:'#56423c', circleColor:'rgba(86,66,60,0.14)', tags:['sale'], order:9 },
  { id:3, name:'Cumin Seeds', category:'whole-spices', catLabel:'Whole Spice', price:129, originalPrice:null, weight:'200g', origin:'Rajasthan Premium', rating:4, reviews:145, badge:null, bgGradient:'linear-gradient(135deg,#d6ed7a,#bbd062)', iconName:'grass', iconColor:'#556500', circleColor:'rgba(85,101,0,0.15)', tags:['organic'], order:14 },
  { id:4, name:'Cloves (Lavang)', category:'whole-spices', catLabel:'Whole Spice', price:299, originalPrice:null, weight:'50g', origin:'Zanzibar Select', rating:5, reviews:89, badge:'new', bgGradient:'linear-gradient(135deg,#ff8a65,rgba(159,65,34,0.18))', iconName:'local_fire_department', iconColor:'#9f4122', circleColor:'rgba(159,65,34,0.15)', tags:['new'], order:11 },
  { id:5, name:'Cinnamon Sticks', category:'whole-spices', catLabel:'Whole Spice', price:159, originalPrice:null, weight:'100g', origin:'Ceylon Grade A', rating:4, reviews:176, badge:null, bgGradient:'linear-gradient(135deg,#d6ed7a,#bbd062)', iconName:'water_drop', iconColor:'#556500', circleColor:'rgba(85,101,0,0.14)', tags:['organic'], order:17 },
  { id:6, name:'Garam Masala Blend', category:'ground-masalas', catLabel:'Ground Masala', price:249, originalPrice:null, weight:'200g', origin:'Premium Grade', rating:5, reviews:428, badge:'bestseller', bgGradient:'linear-gradient(135deg,#ff8a65,rgba(159,65,34,0.18))', iconName:'local_fire_department', iconColor:'#9f4122', circleColor:'rgba(159,65,34,0.16)', tags:['bestseller'], order:1 },
  { id:7, name:'Biryani Masala', category:'ground-masalas', catLabel:'Ground Masala', price:199, originalPrice:null, weight:'150g', origin:'Special Blend', rating:4, reviews:186, badge:'new', bgGradient:'linear-gradient(135deg,#d6ed7a,rgba(187,208,98,0.55))', iconName:'soup_kitchen', iconColor:'#556500', circleColor:'rgba(85,101,0,0.13)', tags:['new'], order:8 },
  { id:8, name:'Turmeric Powder', category:'ground-masalas', catLabel:'Ground Masala', price:89, originalPrice:null, weight:'250g', origin:'Organic Certified', rating:5, reviews:312, badge:null, bgGradient:'linear-gradient(135deg,#d6ed7a,#bbd062)', iconName:'eco', iconColor:'#556500', circleColor:'rgba(85,101,0,0.16)', tags:['organic'], order:16 },
  { id:9, name:'Red Chilli Powder', category:'ground-masalas', catLabel:'Ground Masala', price:99, originalPrice:125, weight:'200g', origin:'Guntur Premium', rating:4, reviews:203, badge:'sale', bgGradient:'linear-gradient(135deg,#ffdbd0,rgba(255,181,158,0.5))', iconName:'local_fire_department', iconColor:'#9f4122', circleColor:'rgba(159,65,34,0.13)', tags:['sale'], order:15 },
  { id:10, name:'Curry Powder', category:'ground-masalas', catLabel:'Ground Masala', price:149, originalPrice:null, weight:'200g', origin:'Traditional Blend', rating:5, reviews:278, badge:null, bgGradient:'linear-gradient(135deg,#ede8dd,#ffdbd0)', iconName:'rice_bowl', iconColor:'#56423c', circleColor:'rgba(86,66,60,0.12)', tags:[], order:19 },
  { id:11, name:'Premium Almonds', category:'dry-fruits', catLabel:'Dry Fruits & Nuts', price:649, originalPrice:null, weight:'500g', origin:'California Grade A', rating:5, reviews:312, badge:'bestseller', bgGradient:'linear-gradient(135deg,#ede8dd,#ffdbd0)', iconName:'nutrition', iconColor:'#56423c', circleColor:'rgba(86,66,60,0.12)', tags:['bestseller'], order:2 },
  { id:12, name:'Premium Cashews', category:'dry-fruits', catLabel:'Dry Fruits & Nuts', price:549, originalPrice:null, weight:'250g', origin:'W240 Grade', rating:5, reviews:245, badge:null, bgGradient:'linear-gradient(135deg,#d6ed7a,rgba(187,208,98,0.5))', iconName:'grain', iconColor:'#556500', circleColor:'rgba(85,101,0,0.12)', tags:[], order:12 },
  { id:13, name:'Mixed Dry Fruits', category:'dry-fruits', catLabel:'Dry Fruits & Nuts', price:719, originalPrice:899, weight:'250g', origin:'Premium Selection', rating:4, reviews:193, badge:'sale', bgGradient:'linear-gradient(135deg,#ffdbd0,rgba(255,181,158,0.5))', iconName:'shopping_basket', iconColor:'#9f4122', circleColor:'rgba(159,65,34,0.13)', tags:['sale'], order:7 },
  { id:14, name:'Golden Raisins', category:'dry-fruits', catLabel:'Dry Fruits & Nuts', price:249, originalPrice:null, weight:'500g', origin:'Afghanistan Premium', rating:4, reviews:167, badge:null, bgGradient:'linear-gradient(135deg,#bbe9ff,#9ccee4)', iconName:'local_florist', iconColor:'#326578', circleColor:'rgba(50,101,120,0.15)', tags:['organic'], order:18 },
  { id:15, name:'Pistachios', category:'dry-fruits', catLabel:'Dry Fruits & Nuts', price:849, originalPrice:null, weight:'200g', origin:'Iran Premium', rating:5, reviews:134, badge:'new', bgGradient:'linear-gradient(135deg,#d6ed7a,rgba(187,208,98,0.55))', iconName:'eco', iconColor:'#556500', circleColor:'rgba(85,101,0,0.15)', tags:['new'], order:10 },
  { id:16, name:'Yellow Moong Dal', category:'dals-pulses', catLabel:'Dals & Pulses', price:149, originalPrice:185, weight:'1kg', origin:'Premium Washed', rating:5, reviews:541, badge:'sale', bgGradient:'linear-gradient(135deg,#d6ed7a,#bbd062)', iconName:'set_meal', iconColor:'#1d1c15', circleColor:'rgba(29,28,21,0.1)', tags:['sale','bestseller'], order:3 },
  { id:17, name:'Red Masoor Dal', category:'dals-pulses', catLabel:'Dals & Pulses', price:135, originalPrice:null, weight:'1kg', origin:'Premium Quality', rating:4, reviews:398, badge:null, bgGradient:'linear-gradient(135deg,#ff8a65,rgba(159,65,34,0.18))', iconName:'grain', iconColor:'#9f4122', circleColor:'rgba(159,65,34,0.15)', tags:[], order:13 },
  { id:18, name:'Chana Dal', category:'dals-pulses', catLabel:'Dals & Pulses', price:125, originalPrice:null, weight:'1kg', origin:'Rajasthan Select', rating:5, reviews:287, badge:null, bgGradient:'linear-gradient(135deg,#bbe9ff,#9ccee4)', iconName:'spa', iconColor:'#326578', circleColor:'rgba(50,101,120,0.15)', tags:['organic'], order:20 },
  { id:19, name:'Halwa Mix', category:'ready-mixes', catLabel:'Ready Mix', price:249, originalPrice:null, weight:'500g', origin:'Traditional Recipe', rating:4, reviews:112, badge:'new', bgGradient:'linear-gradient(135deg,#d6ed7a,rgba(187,208,98,0.6))', iconName:'skillet', iconColor:'#556500', circleColor:'rgba(85,101,0,0.12)', tags:['new'], order:5 },
  { id:20, name:'Khichdi Mix', category:'ready-mixes', catLabel:'Ready Mix', price:179, originalPrice:null, weight:'500g', origin:'Healthy Blend', rating:5, reviews:89, badge:null, bgGradient:'linear-gradient(135deg,#ede8dd,rgba(221,192,184,0.3))', iconName:'rice_bowl', iconColor:'#56423c', circleColor:'rgba(86,66,60,0.12)', tags:['organic'], order:4 },
];

const MaterialIcon = ({ name, size = 24, className = "", style = {} }: { name: string, size?: number, className?: string, style?: React.CSSProperties }) => {
  return (
    <span className={`material-symbols-outlined ${className}`} style={{ fontSize: `${size}px`, ...style }}>
      {name}
    </span>
  );
};

interface WeightOption {
  label: string;
  price: number;
  orig: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id ? parseInt(params.id as string) : 1;
  const product = ALL_PRODUCTS.find(p => p.id === id) || ALL_PRODUCTS[5]; // Default to Garam Masala Blend if not found

  const [activePhoto, setActivePhoto] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedWeight, setSelectedWeight] = useState(product.weight);
  const [quantity, setQuantity] = useState(1);
  const [isWished, setIsWished] = useState(false);
  const [isStickyBarVisible, setIsStickyBarVisible] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const [stickyCartAdded, setStickyCartAdded] = useState(false);

  const handleAddToCart = () => {
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 1200);
  };

  const handleStickyAddToCart = () => {
    setStickyCartAdded(true);
    setTimeout(() => setStickyCartAdded(false), 1200);
  };
  const [buyNowClicked, setBuyNowClicked] = useState(false);

  const handleBuyNow = () => {
    setBuyNowClicked(true);
    setTimeout(() => setBuyNowClicked(false), 1200);
  };
  const [currentPrice, setCurrentPrice] = useState(product.price);
  const [currentOrigPrice, setCurrentOrigPrice] = useState(product.originalPrice || Math.round(product.price * 1.2));

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setIsStickyBarVisible(true);
      } else {
        setIsStickyBarVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const weights: WeightOption[] = [
    { label: product.weight, price: product.price, orig: product.originalPrice || Math.round(product.price * 1.2) },
    { label: '400g', price: Math.round(product.price * 1.8), orig: Math.round(product.price * 2.2) },
    { label: '750g', price: Math.round(product.price * 3.2), orig: Math.round(product.price * 3.8) },
    { label: '1.5kg', price: Math.round(product.price * 5.6), orig: Math.round(product.price * 6.7) },
  ];

  const handleWeightSelect = (w: WeightOption) => {
    setSelectedWeight(w.label);
    setCurrentPrice(w.price);
    setCurrentOrigPrice(w.orig);
  };

  const relatedProducts = ALL_PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      <style jsx global>{`
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-weight: normal; font-style: normal; font-size: 24px;
          line-height: 1; letter-spacing: normal; text-transform: none;
          display: inline-block; white-space: nowrap; word-wrap: normal;
          direction: ltr; -webkit-font-feature-settings: 'liga';
          -webkit-font-smoothing: antialiased;
        }
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .product-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(159,65,34,0.12); }
        .gallery-main-img { transition: opacity 0.35s ease; }
        .gallery-thumb { cursor: pointer; transition: all 0.2s ease; border: 2px solid transparent; }
        .gallery-thumb.active { border-color: #9f4122; opacity: 1; }
        .gallery-thumb:not(.active) { opacity: 0.65; }
        .gallery-thumb:hover:not(.active) { opacity: 0.85; }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        .tab-btn { transition: all 0.2s ease; }
        .tab-btn.active { color: #9f4122; border-bottom: 2px solid #9f4122; }
        .rating-bar-fill { transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        .sticky-bar { transform: translateY(100%); transition: transform 0.3s ease; }
        .sticky-bar.visible { transform: translateY(0); }
        .qty-btn { transition: background-color 0.15s ease; }
        .qty-btn:hover { background-color: #9f4122; color: #fff; }
        .main-photo-wrap { overflow: hidden; border-radius: 24px; }
        .photo-inner { transition: transform 0.4s ease; }
        .main-photo-wrap:hover .photo-inner { transform: scale(1.03); }
        .review-card { transition: box-shadow 0.2s ease, transform 0.2s ease; }
        .review-card:hover { box-shadow: 0 8px 32px rgba(159,65,34,0.10); transform: translateY(-2px); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.4s ease forwards; }

        /* ── Add to Cart: ripple + cart slide-in ── */
        @keyframes cartRipple { 0% { box-shadow: 0 0 0 0 rgba(159,65,34,0.45); } 60% { box-shadow: 0 0 0 14px rgba(159,65,34,0); } 100% { box-shadow: 0 0 0 0 rgba(159,65,34,0); } }
        @keyframes cartSlideIn { 0% { opacity:0; transform: translateX(-10px) rotate(-20deg); } 60% { opacity:1; transform: translateX(3px) rotate(8deg); } 100% { opacity:1; transform: translateX(0) rotate(0deg); } }
        @keyframes cartTextSlide { 0% { opacity:0; transform: translateY(6px); } 100% { opacity:1; transform: translateY(0); } }
        .cart-ripple { animation: cartRipple 0.65s ease-out forwards; }
        .cart-icon-slide { animation: cartSlideIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .cart-text-slide { animation: cartTextSlide 0.3s ease 0.1s both; }

        /* ── Buy Now: electric pulse + bolt spin-zap ── */
        @keyframes buyPulse { 0% { transform: scale(1); } 15% { transform: scale(0.96); } 35% { transform: scale(1.04) skewX(-2deg); } 55% { transform: scale(0.98) skewX(1deg); } 75% { transform: scale(1.02); } 100% { transform: scale(1); } }
        @keyframes boltZap { 0% { transform: rotate(0deg) scale(1); } 20% { transform: rotate(-30deg) scale(1.3); } 50% { transform: rotate(20deg) scale(0.9); } 70% { transform: rotate(-10deg) scale(1.15); } 100% { transform: rotate(0deg) scale(1); } }
        @keyframes buyTextFlash { 0% { opacity:0; letter-spacing: 0.08em; } 50% { opacity:1; letter-spacing: 0.02em; } 100% { opacity:1; letter-spacing: 0; } }
        .buy-pulse { animation: buyPulse 0.55s cubic-bezier(0.36,0.07,0.19,0.97) forwards; }
        .bolt-zap { animation: boltZap 0.5s cubic-bezier(0.34,1.2,0.64,1) forwards; }
        .buy-text-flash { animation: buyTextFlash 0.35s ease 0.08s both; }

        /* ── Sticky Add to Cart: shake-and-lock ── */
        @keyframes stickyShake { 0% { transform: translateX(0); } 15% { transform: translateX(-5px) rotate(-1deg); } 30% { transform: translateX(5px) rotate(1deg); } 45% { transform: translateX(-3px); } 60% { transform: translateX(3px); } 75% { transform: translateX(-1px); } 100% { transform: translateX(0); } }
        @keyframes stickyIconDrop { 0% { transform: translateY(-8px) scale(0.8); opacity:0; } 60% { transform: translateY(3px) scale(1.1); opacity:1; } 100% { transform: translateY(0) scale(1); opacity:1; } }
        @keyframes stickyTextPop { 0% { opacity:0; transform: scale(0.8); } 70% { transform: scale(1.05); opacity:1; } 100% { transform: scale(1); opacity:1; } }
        .sticky-shake { animation: stickyShake 0.55s ease forwards; }
        .sticky-icon-drop { animation: stickyIconDrop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .sticky-text-pop { animation: stickyTextPop 0.35s ease 0.12s both; }
      `}</style>

      <main className="max-w-[1728px] mx-auto w-full">
        {/* ─── BREADCRUMB ─── */}
        <div className="pt-28 md:pt-36 pb-3 md:pb-6 px-6 md:px-container-padding">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center gap-1.5 text-[11px] md:text-[13px] text-on-surface-variant">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight size={14} />
              <Link href="/products" className="hover:text-primary transition-colors">{product.catLabel}s</Link>
              <ChevronRight size={14} />
              <span className="text-on-surface font-medium">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* ─── PRODUCT HERO SECTION ─── */}
        <section className="px-6 md:px-container-padding pb-12 md:pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-14 items-start">

              {/* ─── LEFT: IMAGE GALLERY ─── */}
              <div className="flex flex-col gap-3 md:gap-4 lg:sticky lg:top-28">
                <div className="main-photo-wrap relative rounded-[24px] md:rounded-[32px] overflow-hidden border border-outline-variant/40 shadow-lg bg-surface">
                  <div className="photo-inner">
                    <div className={`gallery-main-img w-full h-[320px] md:h-[480px] flex items-center justify-center relative overflow-hidden ${activePhoto === 0 ? '' : 'hidden'}`} style={{ background: product.bgGradient }}>
                      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(255,180,100,0.35) 0%, transparent 60%), radial-gradient(circle at 75% 25%, rgba(255,100,50,0.2) 0%, transparent 50%)' }}></div>
                      <div className="absolute top-8 right-8 w-24 md:w-36 h-24 md:h-36 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                        <MaterialIcon name={product.iconName} size={52} className="text-white/90" />
                      </div>
                      <div className="absolute bottom-12 left-8 w-14 md:w-20 h-14 md:h-20 rounded-full bg-black/10 flex items-center justify-center">
                        <MaterialIcon name="spa" size={32} className="text-white/60" />
                      </div>
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-32 md:w-48 h-40 md:h-60 bg-white/95 rounded-2xl shadow-2xl border border-white/50 flex flex-col overflow-hidden">
                          <div className="h-1/3 flex items-center justify-center" style={{ background: product.bgGradient }}>
                            <MaterialIcon name={product.iconName} size={28} className="text-white" />
                          </div>
                          <div className="flex-1 p-3 flex flex-col justify-between">
                            <div className="space-y-1.5">
                              <div className="h-2 w-3/4 bg-on-surface/10 rounded"></div>
                              <div className="h-1.5 w-full bg-on-surface/7 rounded"></div>
                              <div className="h-1.5 w-2/3 bg-on-surface/7 rounded"></div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-[8px] font-bold text-primary">{product.weight}</div>
                              <div className="h-4 w-10 bg-primary/20 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 border border-white/30">
                          <span className="text-white text-[12px] font-semibold tracking-wide uppercase">{product.name}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`gallery-main-img w-full h-[320px] md:h-[480px] flex items-center justify-center relative overflow-hidden ${activePhoto === 1 ? '' : 'hidden'}`} style={{ background: 'linear-gradient(135deg, #d6ed7a 0%, #bbd062 35%, #8fa800 100%)' }}>
                      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,220,100,0.4) 0%, transparent 55%), radial-gradient(circle at 80% 20%, rgba(100,150,0,0.25) 0%, transparent 50%)' }}></div>
                      <div className="absolute top-6 left-6 w-20 md:w-28 h-20 md:h-28 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
                        <MaterialIcon name="grass" size={42} className="text-on-surface/60" />
                      </div>
                      <div className="relative z-10 grid grid-cols-3 gap-3 md:gap-5 p-8">
                        <div className="h-20 md:h-28 bg-white/80 backdrop-blur rounded-xl shadow flex flex-col items-center justify-center gap-1 border border-white/50">
                          <MaterialIcon name="local_fire_department" size={22} className="text-primary" />
                          <span className="text-[9px] font-bold text-on-surface/70">Cloves</span>
                        </div>
                        <div className="h-20 md:h-28 bg-white/80 backdrop-blur rounded-xl shadow flex flex-col items-center justify-center gap-1 border border-white/50 mt-4">
                          <MaterialIcon name="spa" size={22} className="text-secondary" />
                          <span className="text-[9px] font-bold text-on-surface/70">Cardamom</span>
                        </div>
                        <div className="h-20 md:h-28 bg-white/80 backdrop-blur rounded-xl shadow flex flex-col items-center justify-center gap-1 border border-white/50">
                          <MaterialIcon name="grain" size={22} className="text-tertiary" />
                          <span className="text-[9px] font-bold text-on-surface/70">Cumin</span>
                        </div>
                      </div>
                    </div>
                    <div className={`gallery-main-img w-full h-[320px] md:h-[480px] flex items-center justify-center relative overflow-hidden ${activePhoto === 2 ? '' : 'hidden'}`} style={{ background: 'linear-gradient(135deg, #333029 0%, #1d1c15 50%, #3a0b00 100%)' }}>
                      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 60% 40%, rgba(159,65,34,0.4) 0%, transparent 60%)' }}></div>
                      <div className="relative z-10 flex flex-col items-center gap-4">
                        <div className="text-[13px] font-label-caps tracking-[0.2em] text-white/40 uppercase">Premium Grade</div>
                        <div className="w-48 md:w-64 h-48 md:h-64 rounded-full border-[3px] border-white/15 flex items-center justify-center relative">
                          <div className="absolute inset-4 rounded-full bg-primary/30 backdrop-blur-sm border border-white/10"></div>
                          <div className="relative z-10 flex flex-col items-center">
                            <MaterialIcon name={product.iconName} size={64} className="text-white" style={{ fontVariationSettings: "'FILL' 1" }} />
                            <span className="text-white/80 text-[14px] font-bold tracking-wide mt-2">{product.weight}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
                    {product.badge && <span className="bg-on-surface text-surface text-[9px] md:text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">{product.badge}</span>}
                    <span className="bg-secondary text-on-secondary text-[9px] md:text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">In Stock</span>
                  </div>
                  <button onClick={() => setIsWished(!isWished)} className={`absolute top-3 right-3 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface/90 backdrop-blur border border-outline-variant/50 shadow flex items-center justify-center hover:bg-surface transition-colors ${isWished ? 'text-error' : 'text-on-surface-variant'}`}>
                    <Heart size={20} fill={isWished ? "currentColor" : "none"} />
                  </button>
                  <button className="absolute bottom-3 right-3 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-surface/90 backdrop-blur border border-outline-variant/50 shadow flex items-center justify-center hover:bg-surface transition-colors text-on-surface-variant">
                    <Share2 size={18} />
                  </button>
                </div>

                <div className="flex gap-2 md:gap-3 overflow-x-auto hide-scrollbar pb-1">
                  {[0, 1, 2].map((idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setActivePhoto(idx)}
                      className={`gallery-thumb shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-[14px] overflow-hidden border-2 transition-all ${activePhoto === idx ? 'border-primary opacity-100' : 'border-transparent opacity-65'}`}
                    >
                      <div className="w-full h-full flex items-center justify-center" style={{ background: idx === 0 ? product.bgGradient : idx === 1 ? '#bbd062' : '#1d1c15' }}>
                        <MaterialIcon name={idx === 0 ? product.iconName : idx === 1 ? "grass" : "blur_on"} size={24} className="text-white" />
                      </div>
                    </button>
                  ))}
                </div>

                <div className="hidden lg:flex items-center gap-3 pt-1">
                  <div className="flex items-center gap-1.5 bg-surface-container-low rounded-full px-3 py-1.5 border border-outline-variant/30 text-[11px] text-on-surface-variant"><Truck size={14} className="text-secondary" /> Free delivery ৳599+</div>
                  <div className="flex items-center gap-1.5 bg-surface-container-low rounded-full px-3 py-1.5 border border-outline-variant/30 text-[11px] text-on-surface-variant"><RotateCcw size={14} className="text-tertiary" /> 7-day returns</div>
                  <div className="flex items-center gap-1.5 bg-surface-container-low rounded-full px-3 py-1.5 border border-outline-variant/30 text-[11px] text-on-surface-variant"><Verified size={14} className="text-secondary" /> BSTI Certified</div>
                </div>
              </div>

              {/* ─── RIGHT: PRODUCT INFO ─── */}
              <div className="flex flex-col gap-5 md:gap-7 pt-0 lg:pt-2">
                <div>
                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    <span className="bg-secondary-container text-on-secondary-container font-label-caps text-[10px] md:text-label-caps px-3 py-1 rounded-full uppercase tracking-widest">{product.catLabel}</span>
                    <span className="flex items-center gap-0.5 text-[11px] text-on-surface-variant"><MaterialIcon name="inventory_2" size={13} /> SKU: {product.name.substring(0,3).toUpperCase()}-{product.id}</span>
                  </div>
                  <h1 className="font-display-xl text-[28px] md:text-[44px] leading-tight text-on-surface tracking-tight mb-2 md:mb-3">{product.name}</h1>
                  <p className="text-on-surface-variant text-[14px] md:text-body-lg leading-relaxed">A rich, aromatic {product.name.toLowerCase()} — stone-ground to perfection and slow-roasted for maximum depth.</p>
                </div>

                <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-primary text-[18px] md:text-[22px]">{"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}</div>
                    <span className="font-bold text-[15px] md:text-[17px] text-on-surface">{product.rating}.0</span>
                  </div>
                  <Link href="#reviews" className="text-[13px] md:text-body-md text-primary hover:underline underline-offset-4 font-medium">{product.reviews} reviews</Link>
                  <div className="flex items-center gap-1 text-[12px] text-on-surface-variant"><ThumbsUp size={14} className="text-secondary" /> 97% recommend</div>
                </div>

                <div className="flex items-end gap-3 md:gap-4">
                  <span className="font-bold text-[32px] md:text-[42px] text-on-surface leading-none">৳{currentPrice}</span>
                  <span className="text-on-surface-variant line-through text-[16px] md:text-[20px] mb-1">৳{currentOrigPrice}</span>
                  <span className="bg-error text-on-error font-bold text-[11px] md:text-[13px] px-2.5 py-1 rounded-full mb-1">{Math.round((1 - currentPrice/currentOrigPrice)*100)}% OFF</span>
                </div>

                <div>
                  <p className="font-semibold text-[13px] md:text-body-md text-on-surface mb-2.5">Choose Weight</p>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {weights.map((w) => (
                      <button key={w.label} onClick={() => handleWeightSelect(w)} className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full border-2 font-medium text-[13px] md:text-body-md transition-all ${selectedWeight === w.label ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant bg-surface text-on-surface hover:border-primary/50'}`}>{w.label}</button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-start sm:items-center">
                  <div className="flex items-center gap-0 border-2 border-outline-variant rounded-full overflow-hidden">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-btn w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-on-surface transition-colors"><Minus size={18} /></button>
                    <span className="w-10 md:w-12 text-center font-bold text-[16px] text-on-surface">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="qty-btn w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-on-surface transition-colors"><Plus size={18} /></button>
                  </div>
                  <button onClick={handleAddToCart} className={`flex-1 sm:flex-none bg-primary text-on-primary font-semibold text-[14px] md:text-body-lg px-6 md:px-10 py-3 md:py-4 rounded-full hover:bg-primary/90 transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-primary/20${cartAdded ? ' cart-ripple' : ''}`}>
                    <ShoppingCart size={20} className={cartAdded ? 'cart-icon-slide' : ''} />
                    {cartAdded ? <span className="cart-text-slide">Added ✓</span> : 'Add to Cart'}
                  </button>
                  <button onClick={handleBuyNow} className={`flex-1 sm:flex-none bg-surface border-2 border-on-surface text-on-surface font-semibold text-[14px] md:text-body-md px-6 md:px-8 py-3 md:py-4 rounded-full hover:bg-surface-variant transition-all flex items-center justify-center gap-2${buyNowClicked ? ' buy-pulse' : ''}`}>
                    <Bolt size={18} className={buyNowClicked ? 'bolt-zap' : ''} />
                    {buyNowClicked ? <span className="buy-text-flash">Ordering!</span> : 'Buy Now'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2.5 md:gap-3 pt-1">
                  {[
                    { title: 'Lab Tested', icon: <MaterialIcon name="science" size={18} className="text-primary" />, bg: 'bg-primary/15' },
                    { title: 'Stone Ground', icon: <MaterialIcon name="grain" size={18} className="text-secondary" />, bg: 'bg-secondary/15' },
                    { title: 'Fast Delivery', icon: <MaterialIcon name="local_shipping" size={18} className="text-tertiary" />, bg: 'bg-tertiary/15' },
                    { title: 'No Additives', icon: <MaterialIcon name="no_food" size={18} className="text-error" />, bg: 'bg-error/10' },
                  ].map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 bg-surface-container-low rounded-[16px] p-3 md:p-4 border border-outline-variant/30">
                      <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full ${h.bg} flex items-center justify-center shrink-0`}>{h.icon}</div>
                      <p className="font-semibold text-[11px] md:text-[13px] text-on-surface">{h.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── TABS ─── */}
        <section className="px-6 md:px-container-padding py-10 md:py-16 bg-surface border-t border-outline-variant/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-0 border-b-2 border-outline-variant/30 mb-8 md:mb-12 overflow-x-auto hide-scrollbar">
              {['Description', 'Ingredients', 'Nutrition', 'How to Use'].map((t) => {
                const val = t.toLowerCase().replace(/ /g, "");
                return (
                  <button key={val} onClick={() => setActiveTab(val)} className={`tab-btn shrink-0 pb-3 md:pb-4 px-4 md:px-6 font-semibold text-[13px] md:text-body-md transition-all ${activeTab === val ? 'text-primary border-primary border-b-2' : 'text-on-surface-variant hover:text-on-surface border-transparent border-b-2'}`}>{t}</button>
                );
              })}
            </div>
            {/* ── Tab: Description ── */}
            {activeTab === 'description' && (
              <div className="tab-content active fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-start">
                  <div>
                    <h2 className="font-display-xl text-[22px] md:text-[36px] leading-tight text-on-surface mb-4 md:mb-6">Crafted from 14 Whole Spices</h2>
                    <p className="text-on-surface-variant text-[14px] md:text-body-lg leading-relaxed mb-4 md:mb-6">
                      Our {product.name} is the result of decades of culinary research and farmer partnerships. We source each of the 14 whole spices from their origin states — green cardamom from Kerala, cloves from Zanzibar-via-Bengal, cumin from Rajasthan — and stone-grind them in small batches for maximum freshness and potency.
                    </p>
                    <p className="text-on-surface-variant text-[14px] md:text-body-lg leading-relaxed mb-6 md:mb-8">
                      Unlike mass-produced blends that use stale pre-ground spices, Khati Family stone-grinds every batch fresh. The result? A deeper, more complex flavour profile with visible spice particles — not a fine, lifeless powder.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['14 Whole Spices', 'No MSG', 'Gluten Free', 'Vegan', 'Halal'].map((tag) => (
                        <span key={tag} className="bg-surface-container-low border border-outline-variant/40 text-on-surface-variant text-[11px] md:text-[13px] px-3 py-1.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    {[
                      { icon: 'inventory_2', color: 'primary', bg: 'bg-primary/15', title: 'Resealable Pouch', desc: 'Food-grade laminated pouch with a zip-seal for extended freshness up to 18 months from production.' },
                      { icon: 'factory', color: 'secondary', bg: 'bg-secondary/15', title: 'Small Batch Grinding', desc: 'Ground in certified facilities in Dhaka in lots under 500kg to ensure each batch is fresh and traceable.' },
                      { icon: 'qr_code', color: 'tertiary', bg: 'bg-tertiary/15', title: 'Full Traceability', desc: 'Scan the QR code on every pouch to view origin farm, batch date, and lab report in real-time.' },
                    ].map((item) => (
                      <div key={item.title} className="flex items-start gap-4 bg-surface-container-low rounded-[20px] p-4 md:p-5 border border-outline-variant/30">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${item.bg} flex items-center justify-center shrink-0`}>
                          <MaterialIcon name={item.icon} size={22} className={`text-${item.color}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[14px] md:text-body-lg text-on-surface mb-1">{item.title}</h4>
                          <p className="text-[12px] md:text-[14px] text-on-surface-variant leading-snug">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Tab: Ingredients ── */}
            {activeTab === 'ingredients' && (
              <div className="tab-content active fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
                  <div>
                    <h2 className="font-display-xl text-[22px] md:text-[36px] leading-tight text-on-surface mb-4 md:mb-6">What&apos;s Inside</h2>
                    <p className="text-on-surface-variant text-[14px] md:text-body-lg leading-relaxed mb-6">
                      Coriander, Cumin, Black Pepper, Green Cardamom, Cloves, Cinnamon (Cassia), Nutmeg, Mace, Bay Leaves, Dried Ginger, Black Cardamom, Star Anise, Fennel Seeds, Dried Rose Petals.
                    </p>
                    <div className="bg-surface-container rounded-[20px] p-5 border border-outline-variant/40">
                      <h4 className="font-semibold text-[13px] md:text-body-md text-on-surface mb-3 flex items-center gap-2">
                        <MaterialIcon name="info" size={18} className="text-primary" /> Allergen Info
                      </h4>
                      <p className="text-[12px] md:text-[14px] text-on-surface-variant leading-relaxed">
                        No known allergens. Processed in a facility that also handles sesame seeds and tree nuts. Contains no artificial colours, flavours, or preservatives.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: 'spa', color: 'text-primary', bg: 'from-primary-container/40 to-primary/10 border-primary/20', name: 'Green Cardamom', origin: 'Kerala origin · Aromatic, floral' },
                      { icon: 'local_fire_department', color: 'text-on-surface-variant', bg: 'from-surface-container-high to-outline-variant/20 border-outline-variant/30', name: 'Cloves', origin: 'Zanzibar-grade · Intense, warm' },
                      { icon: 'grain', color: 'text-secondary', bg: 'from-secondary-container/50 to-secondary-fixed/20 border-secondary/20', name: 'Cumin', origin: 'Rajasthan origin · Earthy, rich' },
                      { icon: 'star', color: 'text-tertiary', bg: 'from-tertiary-fixed/60 to-tertiary-container/30 border-tertiary/20', name: 'Star Anise', origin: 'Vietnam-grade · Sweet, licorice' },
                      { icon: 'local_florist', color: 'text-on-primary-container', bg: 'from-primary-fixed/60 to-inverse-primary/20 border-primary/20', name: 'Rose Petals', origin: 'Dried · Delicate floral note' },
                      { icon: 'eco', color: 'text-on-surface-variant', bg: 'from-surface-container-high to-surface-dim border-outline-variant/30', name: '+ 9 more spices', origin: 'Full list on package label' },
                    ].map((s) => (
                      <div key={s.name} className={`bg-gradient-to-br ${s.bg} rounded-[20px] p-4 border flex flex-col gap-2`}>
                        <MaterialIcon name={s.icon} size={24} className={s.color} />
                        <p className="font-bold text-[13px] md:text-[15px] text-on-surface">{s.name}</p>
                        <p className="text-[11px] md:text-[12px] text-on-surface-variant">{s.origin}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Tab: Nutrition ── */}
            {activeTab === 'nutrition' && (
              <div className="tab-content active fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-start">
                  <div>
                    <h2 className="font-display-xl text-[22px] md:text-[36px] leading-tight text-on-surface mb-2">Nutrition Facts</h2>
                    <p className="text-on-surface-variant text-[13px] md:text-[15px] mb-6">Per 100g serving</p>
                    <div className="rounded-[20px] border-2 border-on-surface overflow-hidden">
                      <div className="bg-on-surface text-surface px-5 py-3">
                        <p className="text-[11px] font-bold tracking-widest uppercase">Nutrition Facts</p>
                        <p className="font-bold text-[18px] md:text-[22px]">{product.name} · {product.weight}</p>
                      </div>
                      <div className="bg-surface px-5 divide-y divide-outline-variant/30">
                        {[
                          { label: 'Calories', value: '305 kcal', bold: true },
                          { label: 'Total Fat', value: '12g', bold: true },
                          { label: 'Saturated Fat', value: '2g', bold: false, indent: true },
                          { label: 'Total Carbohydrate', value: '52g', bold: true },
                          { label: 'Dietary Fiber', value: '16g', bold: false, indent: true },
                          { label: 'Sugars', value: '3g', bold: false, indent: true },
                          { label: 'Protein', value: '14g', bold: true },
                          { label: 'Sodium', value: '38mg', bold: true },
                          { label: 'Iron', value: '28mg', bold: true },
                        ].map((row) => (
                          <div key={row.label} className={`flex justify-between py-2.5 ${row.indent ? 'pl-4' : ''}`}>
                            <span className={`text-[${row.indent ? '12' : '13'}px] ${row.bold ? 'font-bold' : ''} ${row.indent ? 'text-on-surface-variant' : 'text-on-surface'}`}>{row.label}</span>
                            <span className={`text-[${row.indent ? '12' : '13'}px] ${row.bold ? 'font-semibold' : ''} ${row.indent ? 'text-on-surface-variant' : 'text-on-surface'}`}>{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-3">*Percent Daily Values based on a 2,000 calorie diet. Spices are used in small amounts; total contribution to daily intake is minimal.</p>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-[18px] md:text-headline-md text-on-surface mb-5">Health Benefits</h3>
                    <div className="space-y-3 md:space-y-4">
                      {[
                        { icon: 'favorite', color: 'text-primary', title: 'Anti-inflammatory', desc: 'Cloves and black pepper contain eugenol and piperine, known for powerful anti-inflammatory effects.' },
                        { icon: 'psychiatry', color: 'text-secondary', title: 'Aids Digestion', desc: 'Cumin and fennel promote healthy gut flora and can reduce bloating and stomach discomfort.' },
                        { icon: 'self_improvement', color: 'text-tertiary', title: 'Antioxidant Rich', desc: 'Cardamom and nutmeg are among the most antioxidant-dense spices, supporting cellular health.' },
                        { icon: 'bloodtype', color: 'text-error', title: 'Blood Sugar Support', desc: 'Cinnamon and cloves may help support healthy blood glucose levels when used regularly.' },
                      ].map((b) => (
                        <div key={b.title} className="flex items-start gap-3 bg-surface-container-low rounded-[16px] p-4 border border-outline-variant/30">
                          <MaterialIcon name={b.icon} size={22} className={`${b.color} shrink-0`} />
                          <div>
                            <p className="font-semibold text-[13px] md:text-body-md text-on-surface">{b.title}</p>
                            <p className="text-[11px] md:text-[13px] text-on-surface-variant">{b.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Tab: How to Use ── */}
            {activeTab === 'howtouse' && (
              <div className="tab-content active fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
                  {[
                    {
                      bg: 'from-primary-container/30 to-primary/10 border-primary/20',
                      iconBg: 'bg-primary/20', icon: 'soup_kitchen', iconColor: 'text-primary',
                      title: 'Curries & Gravies',
                      desc: 'Add ½–1 tsp per serving of curry, dal, or vegetable gravy. Best added in the last 10 minutes of cooking to preserve fragrance. Bloom in hot oil or ghee for even deeper flavour.',
                      tipIcon: 'timer', tipColor: 'text-primary', tip: 'Add with 10 min to go',
                    },
                    {
                      bg: 'from-secondary-container/40 to-secondary-fixed/20 border-secondary/20',
                      iconBg: 'bg-secondary/20', icon: 'rice_bowl', iconColor: 'text-secondary',
                      title: 'Biryani & Pulao',
                      desc: 'Use 1–2 tsp per kg of rice. Layer into the dum pot when adding fried onion and saffron water. Also works beautifully in white sauce-based rice dishes for fusion flavour.',
                      tipIcon: 'restaurant', tipColor: 'text-secondary', tip: '1–2 tsp per kg rice',
                    },
                    {
                      bg: 'from-tertiary-fixed/40 to-tertiary-container/30 border-tertiary/20',
                      iconBg: 'bg-tertiary/20', icon: 'skillet', iconColor: 'text-tertiary',
                      title: 'Meats & Marinades',
                      desc: 'Rub 1 tsp into chicken, mutton, or fish with yoghurt, lemon, and salt. Marinate overnight for kebabs and tandoor-style dishes. Also excellent in kofta and seekh kabab mix.',
                      tipIcon: 'bedtime', tipColor: 'text-tertiary', tip: 'Marinate overnight',
                    },
                  ].map((card) => (
                    <div key={card.title} className={`bg-gradient-to-br ${card.bg} rounded-[24px] p-5 md:p-7 border`}>
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${card.iconBg} flex items-center justify-center mb-4 md:mb-5`}>
                        <MaterialIcon name={card.icon} size={24} className={card.iconColor} />
                      </div>
                      <h3 className="font-bold text-[15px] md:text-body-lg text-on-surface mb-3">{card.title}</h3>
                      <p className="text-[13px] md:text-[14px] text-on-surface-variant leading-relaxed mb-4">{card.desc}</p>
                      <div className="bg-white/60 rounded-xl px-3 py-2 text-[12px] font-semibold text-on-surface flex items-center gap-2">
                        <MaterialIcon name={card.tipIcon} size={15} className={card.tipColor} />
                        {card.tip}
                      </div>
                    </div>
                  ))}
                  {/* Pro Tip full-width row */}
                  <div className="md:col-span-3 bg-surface-container-low rounded-[20px] p-5 border border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-10 h-10 rounded-full bg-on-surface flex items-center justify-center">
                        <MaterialIcon name="lightbulb" size={20} className="text-surface" />
                      </div>
                      <span className="font-bold text-[14px] text-on-surface">Pro Tip</span>
                    </div>
                    <p className="text-[13px] md:text-[14px] text-on-surface-variant leading-relaxed">
                      For the best flavour, bloom 1 tsp of garam masala in 2 tbsp of hot ghee or oil before adding other ingredients. This &ldquo;tadka&rdquo; technique releases fat-soluble aromatics that make the whole dish sing. Store your pouch away from heat and light for maximum shelf life — a cool, dark pantry is ideal.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ─── REVIEWS ─── */}
        <section id="reviews" className="px-6 md:px-container-padding py-12 md:py-20 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 md:mb-14">
              <div>
                <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest mb-2 block uppercase">CUSTOMER REVIEWS</span>
                <h2 className="font-display-xl text-[26px] md:text-[44px] leading-tight text-on-surface">What Our Customers Say</h2>
              </div>

            </div>

            {/* Rating Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mb-10 md:mb-14 bg-surface rounded-[24px] p-6 md:p-10 border border-outline-variant/30 shadow-sm">
              <div className="flex flex-col items-center justify-center text-center md:border-r md:border-outline-variant/30 py-2">
                <span className="font-bold text-[64px] md:text-[80px] leading-none text-on-surface">{product.rating}.0</span>
                <div className="text-primary text-[24px] md:text-[28px] my-2">★★★★★</div>
                <span className="text-[13px] md:text-body-md text-on-surface-variant">Based on {product.reviews} reviews</span>
              </div>
              <div className="md:col-span-2 flex flex-col justify-center gap-2.5 md:gap-3.5">
                {[{ label: '5 stars', pct: '84%' }, { label: '4 stars', pct: '10%' }, { label: '3 stars', pct: '4%' }, { label: '2 stars', pct: '1%' }, { label: '1 star', pct: '1%' }].map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <span className="text-[12px] md:text-[14px] font-medium text-on-surface w-14 text-right shrink-0">{row.label}</span>
                    <div className="flex-1 h-2.5 md:h-3 bg-surface-variant rounded-full overflow-hidden">
                      <div className="rating-bar-fill h-full bg-primary rounded-full" style={{ width: row.pct }}></div>
                    </div>
                    <span className="text-[12px] md:text-[14px] text-on-surface-variant w-10 shrink-0">{row.pct}</span>
                  </div>
                ))}
                <div className="flex flex-wrap gap-2 mt-2 pt-3 border-t border-outline-variant/30">
                  {['Great aroma (321)', 'Authentic taste (287)', 'Good value (211)'].map((tag) => (
                    <span key={tag} className="bg-secondary-container/50 border border-secondary/20 text-on-secondary-container text-[11px] md:text-[13px] px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
                      <MaterialIcon name="thumb_up" size={14} />{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-2 md:gap-3 mb-7 md:mb-10">
              <button className="bg-on-surface text-surface text-[12px] md:text-[14px] font-semibold px-4 py-2 rounded-full">All ({product.reviews})</button>
              {['★ 5 (360)', '★ 4 (43)', '★ 3 (17)'].map((f) => (
                <button key={f} className="bg-surface-container border border-outline-variant/40 text-on-surface text-[12px] md:text-[14px] font-medium px-4 py-2 rounded-full hover:bg-surface-variant transition-colors">{f}</button>
              ))}
              <button className="ml-auto bg-surface-container border border-outline-variant/40 text-on-surface text-[12px] md:text-[14px] font-medium px-4 py-2 rounded-full hover:bg-surface-variant transition-colors flex items-center gap-1.5">
                <MaterialIcon name="photo_library" size={16} /> With Photos
              </button>
            </div>

            {/* Review Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Review 1 */}
              <div className="review-card bg-surface rounded-[20px] md:rounded-[24px] p-5 md:p-7 border border-outline-variant/30 shadow-sm flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-[15px] md:text-[18px] text-on-primary shrink-0" style={{ background: 'linear-gradient(135deg,#9f4122,#ff8a65)' }}>R</div>
                    <div>
                      <p className="font-bold text-[13px] md:text-[15px] text-on-surface">Rafa Islam</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-primary text-[13px]">★★★★★</span>
                        <span className="text-[10px] md:text-[12px] text-on-surface-variant">· Dhaka, BD</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="bg-secondary-container/70 text-on-secondary-container text-[9px] md:text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-0.5 border border-secondary/20"><MaterialIcon name="verified" size={11} /> Verified</span>
                    <span className="text-[10px] md:text-[12px] text-on-surface-variant">14 May 2025</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-[13px] md:text-[15px] text-on-surface mb-1.5">&ldquo;Game-changer for my biryanis!&rdquo;</h4>
                  <p className="text-[12px] md:text-[14px] text-on-surface-variant leading-relaxed">I&apos;ve been using this for 6 months and I will never go back to supermarket masala. The aroma when you open the pouch is incredible — you can actually smell the individual spices. My mutton biryani has gone from good to legendary according to my family. Worth every taka.</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-[12px] overflow-hidden shrink-0 border border-outline-variant/30 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#ff8a65,#9f4122)' }}><MaterialIcon name="rice_bowl" size={22} className="text-white" /></div>
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-[12px] overflow-hidden shrink-0 border border-outline-variant/30 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#9f4122,#5d1a0a)' }}><MaterialIcon name="local_fire_department" size={22} className="text-white" /></div>
                </div>
                <div className="flex items-center gap-4 pt-1 border-t border-outline-variant/20">
                  <button className="flex items-center gap-1.5 text-[11px] md:text-[13px] text-on-surface-variant hover:text-primary transition-colors"><MaterialIcon name="thumb_up" size={16} /> Helpful (42)</button>
                  <button className="flex items-center gap-1.5 text-[11px] md:text-[13px] text-on-surface-variant hover:text-on-surface transition-colors"><MaterialIcon name="reply" size={16} /> Reply</button>
                </div>
              </div>

              {/* Review 2 */}
              <div className="review-card bg-surface rounded-[20px] md:rounded-[24px] p-5 md:p-7 border border-outline-variant/30 shadow-sm flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-[15px] md:text-[18px] text-on-secondary shrink-0" style={{ background: 'linear-gradient(135deg,#556500,#bbd062)' }}>N</div>
                    <div>
                      <p className="font-bold text-[13px] md:text-[15px] text-on-surface">Nusrat Jahan</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-primary text-[13px]">★★★★★</span>
                        <span className="text-[10px] md:text-[12px] text-on-surface-variant">· Chattogram, BD</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="bg-secondary-container/70 text-on-secondary-container text-[9px] md:text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-0.5 border border-secondary/20"><MaterialIcon name="verified" size={11} /> Verified</span>
                    <span className="text-[10px] md:text-[12px] text-on-surface-variant">2 Apr 2025</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-[13px] md:text-[15px] text-on-surface mb-1.5">&ldquo;Genuinely addictive — in the best way&rdquo;</h4>
                  <p className="text-[12px] md:text-[14px] text-on-surface-variant leading-relaxed">As someone who cooks every day, I&apos;ve tried almost every brand on the market. Khati Family is on a completely different level. The balance between the warm spices (cardamom, cloves) and the earthy ones (cumin, coriander) is perfect. It never overwhelms a dish — it enhances it.</p>
                </div>
                <div className="flex items-center gap-4 pt-1 border-t border-outline-variant/20">
                  <button className="flex items-center gap-1.5 text-[11px] md:text-[13px] text-on-surface-variant hover:text-primary transition-colors"><MaterialIcon name="thumb_up" size={16} /> Helpful (28)</button>
                  <button className="flex items-center gap-1.5 text-[11px] md:text-[13px] text-on-surface-variant hover:text-on-surface transition-colors"><MaterialIcon name="reply" size={16} /> Reply</button>
                </div>
              </div>

              {/* Review 3 — with brand reply */}
              <div className="review-card bg-surface rounded-[20px] md:rounded-[24px] p-5 md:p-7 border border-outline-variant/30 shadow-sm flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-[15px] md:text-[18px] text-on-primary shrink-0" style={{ background: 'linear-gradient(135deg,#326578,#80b1c7)' }}>S</div>
                    <div>
                      <p className="font-bold text-[13px] md:text-[15px] text-on-surface">Sajid Hossain</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-primary text-[13px]">★★★★★</span>
                        <span className="text-[10px] md:text-[12px] text-on-surface-variant">· Sylhet, BD</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="bg-secondary-container/70 text-on-secondary-container text-[9px] md:text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-0.5 border border-secondary/20"><MaterialIcon name="verified" size={11} /> Verified</span>
                    <span className="text-[10px] md:text-[12px] text-on-surface-variant">18 Mar 2025</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-[13px] md:text-[15px] text-on-surface mb-1.5">&ldquo;Ordered for my restaurant — will reorder&rdquo;</h4>
                  <p className="text-[12px] md:text-[14px] text-on-surface-variant leading-relaxed">Bought the 1.5kg pack for our small restaurant. Guests have started asking what spice blend we use — that&apos;s the biggest endorsement I can give. Consistent quality batch to batch, fast delivery, and the resealable pouch keeps it fresh for weeks.</p>
                </div>
                <div className="bg-surface-container-low rounded-[14px] p-3.5 border border-outline-variant/40">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0"><MaterialIcon name="shopping_basket" size={13} className="text-on-primary" /></div>
                    <span className="text-[11px] md:text-[13px] font-bold text-primary">Khati Family</span>
                    <span className="text-[10px] text-on-surface-variant">· Brand Reply</span>
                  </div>
                  <p className="text-[11px] md:text-[13px] text-on-surface-variant leading-snug">Thank you so much, Sajid bhai! We love hearing that your guests are noticing the difference. For restaurant accounts, please ask about our bulk pricing program — we have dedicated support for food businesses. 🌿</p>
                </div>
                <div className="flex items-center gap-4 pt-1 border-t border-outline-variant/20">
                  <button className="flex items-center gap-1.5 text-[11px] md:text-[13px] text-on-surface-variant hover:text-primary transition-colors"><MaterialIcon name="thumb_up" size={16} /> Helpful (67)</button>
                  <button className="flex items-center gap-1.5 text-[11px] md:text-[13px] text-on-surface-variant hover:text-on-surface transition-colors"><MaterialIcon name="reply" size={16} /> Reply</button>
                </div>
              </div>

              {/* Review 4 — 4 stars */}
              <div className="review-card bg-surface rounded-[20px] md:rounded-[24px] p-5 md:p-7 border border-outline-variant/30 shadow-sm flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-[15px] md:text-[18px] bg-surface-container-high text-on-surface shrink-0">F</div>
                    <div>
                      <p className="font-bold text-[13px] md:text-[15px] text-on-surface">Fatema Begum</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-primary text-[13px]">★★★★</span><span className="text-on-surface-variant text-[13px]">☆</span>
                        <span className="text-[10px] md:text-[12px] text-on-surface-variant">· Rajshahi, BD</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[10px] md:text-[12px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full border border-outline-variant/30">Unverified</span>
                    <span className="text-[10px] md:text-[12px] text-on-surface-variant">5 Feb 2025</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-[13px] md:text-[15px] text-on-surface mb-1.5">&ldquo;Very good, slight packaging issue&rdquo;</h4>
                  <p className="text-[12px] md:text-[14px] text-on-surface-variant leading-relaxed">The masala itself is excellent — the fragrance is genuinely different from what I find at local shops. Removed one star because my first order arrived with the zip seal slightly bent, making it hard to close. Product quality 5/5, packaging 3/5. Would still buy again.</p>
                </div>
                <div className="flex items-center gap-4 pt-1 border-t border-outline-variant/20">
                  <button className="flex items-center gap-1.5 text-[11px] md:text-[13px] text-on-surface-variant hover:text-primary transition-colors"><MaterialIcon name="thumb_up" size={16} /> Helpful (14)</button>
                  <button className="flex items-center gap-1.5 text-[11px] md:text-[13px] text-on-surface-variant hover:text-on-surface transition-colors"><MaterialIcon name="reply" size={16} /> Reply</button>
                </div>
              </div>

              {/* Review 5 */}
              <div className="review-card bg-surface rounded-[20px] md:rounded-[24px] p-5 md:p-7 border border-outline-variant/30 shadow-sm flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-[15px] md:text-[18px] text-on-primary shrink-0" style={{ background: 'linear-gradient(135deg,#ff8a65,#ffdbd0)' }}>T</div>
                    <div>
                      <p className="font-bold text-[13px] md:text-[15px] text-on-surface">Tanvir Ahmed</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-primary text-[13px]">★★★★★</span>
                        <span className="text-[10px] md:text-[12px] text-on-surface-variant">· Khulna, BD</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="bg-secondary-container/70 text-on-secondary-container text-[9px] md:text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-0.5 border border-secondary/20"><MaterialIcon name="verified" size={11} /> Verified</span>
                    <span className="text-[10px] md:text-[12px] text-on-surface-variant">29 Jan 2025</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-[13px] md:text-[15px] text-on-surface mb-1.5">&ldquo;My mother approved — enough said&rdquo;</h4>
                  <p className="text-[12px] md:text-[14px] text-on-surface-variant leading-relaxed">I brought this home and my mother — who grinds her own spices and is notoriously hard to impress — asked me to order more. That&apos;s the highest review I can give any spice product. The smell alone in the kitchen when you add it to oil is absolutely divine.</p>
                </div>
                <div className="flex items-center gap-4 pt-1 border-t border-outline-variant/20">
                  <button className="flex items-center gap-1.5 text-[11px] md:text-[13px] text-on-surface-variant hover:text-primary transition-colors"><MaterialIcon name="thumb_up" size={16} /> Helpful (89)</button>
                  <button className="flex items-center gap-1.5 text-[11px] md:text-[13px] text-on-surface-variant hover:text-on-surface transition-colors"><MaterialIcon name="reply" size={16} /> Reply</button>
                </div>
              </div>

              {/* Review 6 — with photo */}
              <div className="review-card bg-surface rounded-[20px] md:rounded-[24px] p-5 md:p-7 border border-outline-variant/30 shadow-sm flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-[15px] md:text-[18px] text-white shrink-0" style={{ background: 'linear-gradient(135deg,#5d1a0a,#9f4122)' }}>M</div>
                    <div>
                      <p className="font-bold text-[13px] md:text-[15px] text-on-surface">Mariam Sultana</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-primary text-[13px]">★★★★★</span>
                        <span className="text-[10px] md:text-[12px] text-on-surface-variant">· Sylhet, BD</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="bg-secondary-container/70 text-on-secondary-container text-[9px] md:text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-0.5 border border-secondary/20"><MaterialIcon name="verified" size={11} /> Verified</span>
                    <span className="text-[10px] md:text-[12px] text-on-surface-variant">10 Dec 2024</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-[13px] md:text-[15px] text-on-surface mb-1.5">&ldquo;QR traceability feature is genius&rdquo;</h4>
                  <p className="text-[12px] md:text-[14px] text-on-surface-variant leading-relaxed">I scanned the QR code on the pouch and could see exactly which farms the spices came from and the lab report. As someone who&apos;s conscious about what goes into family food, this is huge. And the taste is extraordinary — my kids now ask for seconds on everything I cook with it.</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-[12px] overflow-hidden shrink-0 border border-outline-variant/30 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#d6ed7a,#556500)' }}><MaterialIcon name="eco" size={22} className="text-on-secondary" /></div>
                </div>
                <div className="flex items-center gap-4 pt-1 border-t border-outline-variant/20">
                  <button className="flex items-center gap-1.5 text-[11px] md:text-[13px] text-on-surface-variant hover:text-primary transition-colors"><MaterialIcon name="thumb_up" size={16} /> Helpful (53)</button>
                  <button className="flex items-center gap-1.5 text-[11px] md:text-[13px] text-on-surface-variant hover:text-on-surface transition-colors"><MaterialIcon name="reply" size={16} /> Reply</button>
                </div>
              </div>
            </div>

            {/* Load More */}
            <div className="mt-8 md:mt-12 text-center">
              <button className="inline-flex items-center gap-2.5 border-2 border-on-surface text-on-surface font-semibold text-[14px] md:text-body-md px-8 py-3.5 rounded-full hover:bg-surface-variant transition-colors">
                <MaterialIcon name="expand_more" size={20} /> Load More Reviews (422 remaining)
              </button>
            </div>
          </div>
        </section>

        {/* ─── RELATED PRODUCTS ─── */}
        <section className="px-6 md:px-container-padding py-12 md:py-20 bg-surface">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display-xl text-[24px] md:text-[42px] leading-tight text-on-surface mb-8 md:mb-12 uppercase tracking-tight">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {relatedProducts.map(p => (
                <Link key={p.id} href={`/products/${p.id}`} className="product-card bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden flex flex-col">
                  <div className="h-36 md:h-44 relative overflow-hidden p-3 md:p-5 flex items-end" style={{ background: p.bgGradient }}>
                    <div className="relative z-10 bg-surface/90 backdrop-blur rounded-xl px-2 py-1.5 md:px-3 md:py-2 border border-white/50 shadow">
                      <MaterialIcon name={p.iconName} size={22} className="text-primary" />
                    </div>
                  </div>
                  <div className="p-3 md:p-5 flex flex-col flex-1">
                    <h4 className="font-bold text-[13px] md:text-[17px] text-on-surface mb-0.5">{p.name}</h4>
                    <p className="text-[10px] md:text-[13px] text-on-surface-variant mb-2">{p.weight} · {p.catLabel}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-bold text-[17px] md:text-[22px] text-on-surface">৳{p.price}</span>
                      <div className="bg-primary text-on-primary p-2 rounded-full"><ShoppingCart size={16} /></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="py-12 md:py-20 px-6 md:px-container-padding bg-primary relative overflow-hidden flex items-center justify-center min-h-[40vh]">
          <div className="relative z-10 bg-surface rounded-[28px] md:rounded-[40px] p-8 md:p-14 max-w-3xl w-full text-center shadow-2xl">
            <h2 className="font-display-xl text-[26px] md:text-[52px] leading-tight text-on-surface mb-6">So, what are we cooking today?</h2>
            <Link href="/products" className="inline-flex items-center justify-center gap-2 bg-on-surface text-surface font-body-lg text-[14px] md:text-body-lg font-medium px-7 md:px-10 py-3.5 md:py-5 rounded-full hover:scale-105 transition-transform group">Start Shopping <ArrowRight className="group-hover:translate-x-1 transition-transform" /></Link>
          </div>
        </section>
      </main>

      <div className={`sticky-bar fixed bottom-0 left-0 right-0 z-40 md:hidden bg-surface/95 backdrop-blur-xl border-t border-outline-variant/30 shadow-2xl px-4 py-3 flex items-center gap-3 ${isStickyBarVisible ? 'visible' : ''}`}>
        <div><p className="text-[10px] text-on-surface-variant">{product.name} · {selectedWeight}</p><p className="font-bold text-[18px] text-on-surface leading-none">৳{currentPrice}</p></div>
        <button onClick={handleStickyAddToCart} className={`flex-1 bg-primary text-on-primary font-semibold text-[14px] py-3.5 rounded-full hover:bg-primary/90 transition-colors shadow-lg flex items-center justify-center gap-2${stickyCartAdded ? ' sticky-shake' : ''}`}>
          <ShoppingCart size={18} className={stickyCartAdded ? 'sticky-icon-drop' : ''} />
          {stickyCartAdded ? <span className="sticky-text-pop">In Bag ✓</span> : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}