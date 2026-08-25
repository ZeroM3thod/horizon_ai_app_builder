"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Check, ShoppingCart } from "lucide-react";
import Link from "next/link";

// ─── Data ───────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: "All Categories", icon: "apps" },
  { label: "Whole Spices", icon: "local_fire_department" },
  { label: "Ground Masalas", icon: "soup_kitchen" },
  { label: "Dry Fruits & Nuts", icon: "nutrition" },
  { label: "Dals & Pulses", icon: "grain" },
  { label: "Ready Spice Mixes", icon: "skillet" },
];

const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Best Rated", value: "rating" },
  { label: "Newest First", value: "newest" },
];

const PRICE_RANGES = [
  { label: "Any Price", value: "any" },
  { label: "Under ৳200", value: "0-200" },
  { label: "৳200 – ৳500", value: "200-500" },
  { label: "৳500 – ৳1000", value: "500-1000" },
  { label: "Above ৳1000", value: "1000+" },
];

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  weight: string;
  rating: number;
  reviews: number;
  badge?: string;
  badgeColor?: string;
  icon: string;
  iconColor: string;
  gradientFrom: string;
  gradientTo: string;
  inStock: boolean;
  isNew: boolean;
};

const ALL_PRODUCTS: Product[] = [
  { id: 1, name: "Garam Masala Blend",   category: "Ground Masalas",    price: 249, weight: "200g • Premium Grade",      rating: 5, reviews: 428, badge: "Bestseller", badgeColor: "bg-on-surface text-surface",       icon: "local_fire_department", iconColor: "text-primary",          gradientFrom: "from-primary-container",     gradientTo: "to-primary/20",              inStock: true,  isNew: false },
  { id: 2, name: "Premium Almonds",       category: "Dry Fruits & Nuts", price: 649, weight: "500g • California Grade A", rating: 5, reviews: 312,                                                                           icon: "nutrition",             iconColor: "text-outline",          gradientFrom: "from-surface-container-high",gradientTo: "to-primary-fixed/50",        inStock: true,  isNew: false },
  { id: 3, name: "Biryani Masala",        category: "Ground Masalas",    price: 199, weight: "100g • Restaurant Grade",   rating: 4, reviews: 186, badge: "New",         badgeColor: "bg-primary text-on-primary top-2.5 right-2.5", icon: "soup_kitchen",          iconColor: "text-secondary",        gradientFrom: "from-secondary-container",   gradientTo: "to-secondary-fixed/50",      inStock: true,  isNew: true  },
  { id: 4, name: "Yellow Moong Dal",      category: "Dals & Pulses",     price: 149, originalPrice: 185, weight: "1kg • Premium Washed",     rating: 5, reviews: 541,                                                       icon: "set_meal",              iconColor: "text-on-surface",       gradientFrom: "from-secondary-fixed",       gradientTo: "to-secondary-fixed-dim/50",  inStock: true,  isNew: false },
  { id: 5, name: "Green Cardamom",        category: "Whole Spices",      price: 349, weight: "50g • Kerala Origin",       rating: 5, reviews: 267,                                                                           icon: "spa",                   iconColor: "text-tertiary",         gradientFrom: "from-tertiary-fixed",        gradientTo: "to-tertiary-container",      inStock: true,  isNew: false },
  { id: 6, name: "Mixed Dry Fruits",      category: "Dry Fruits & Nuts", price: 719, originalPrice: 899, weight: "250g • Premium Selection", rating: 4, reviews: 193, badge: "20% OFF",    badgeColor: "bg-error text-on-error top-2.5 left-2.5",      icon: "shopping_basket",       iconColor: "text-primary",          gradientFrom: "from-primary-fixed",         gradientTo: "to-inverse-primary/40",      inStock: true,  isNew: false },
  { id: 7, name: "Turmeric Powder",       category: "Ground Masalas",    price: 129, weight: "200g • Pure Ground",        rating: 5, reviews: 612,                                                                           icon: "colorize",              iconColor: "text-tertiary",         gradientFrom: "from-tertiary-fixed",        gradientTo: "to-primary-container/50",    inStock: true,  isNew: false },
  { id: 8, name: "Black Pepper Whole",    category: "Whole Spices",      price: 289, weight: "100g • Malabar Grade",      rating: 5, reviews: 334,                                                                           icon: "grass",                 iconColor: "text-secondary",        gradientFrom: "from-secondary-container",   gradientTo: "to-surface-container-high",  inStock: true,  isNew: false },
  { id: 9, name: "Cashew Nuts W240",      category: "Dry Fruits & Nuts", price: 899, weight: "500g • Premium Grade",      rating: 5, reviews: 201, badge: "Bestseller", badgeColor: "bg-on-surface text-surface",       icon: "nutrition",             iconColor: "text-primary",          gradientFrom: "from-primary-container",     gradientTo: "to-tertiary-fixed/40",       inStock: false, isNew: false },
  { id:10, name: "Biryani Spice Mix",     category: "Ready Spice Mixes", price: 179, weight: "75g • Restaurant Pack",     rating: 4, reviews: 155,                                                                           icon: "skillet",               iconColor: "text-secondary",        gradientFrom: "from-secondary-fixed",       gradientTo: "to-secondary-container",     inStock: true,  isNew: true  },
  { id:11, name: "Red Lentil (Masoor)",   category: "Dals & Pulses",     price: 119, weight: "1kg • Premium Whole",       rating: 4, reviews: 278,                                                                           icon: "grain",                 iconColor: "text-on-surface",       gradientFrom: "from-surface-container-high",gradientTo: "to-primary-fixed/30",        inStock: true,  isNew: false },
  { id:12, name: "Cinnamon Sticks",       category: "Whole Spices",      price: 219, weight: "100g • Ceylon Grade",       rating: 5, reviews: 189, badge: "New",         badgeColor: "bg-primary text-on-primary top-2.5 right-2.5", icon: "local_fire_department", iconColor: "text-tertiary",         gradientFrom: "from-tertiary-container",    gradientTo: "to-tertiary-fixed/50",       inStock: true,  isNew: true  },
];

// ─── Hero Banner Carousel ────────────────────────────────────────────────────

const BANNER_COUNT = 4;

/**
 * Banner image paths are device-specific:
 *   public/banner/mobile/1.png   → shown on screens < 768px
 *   public/banner/tablet/1.png   → shown on screens 768px–1279px
 *   public/banner/desktop/1.png  → shown on screens ≥ 1280px
 *
 * Recommended banner dimensions:
 *   Mobile  → 750 × 400 px  (aspect ratio ~1.875:1, full-width up to 767px)
 *   Tablet  → 1440 × 560 px (aspect ratio ~2.57:1, full-width up to 1279px)
 *   Desktop → 1920 × 680 px (aspect ratio ~2.82:1, full-width 1280px+)
 */

function HeroBannerCarousel() {
  const [current, setCurrent] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragDelta, setDragDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = BANNER_COUNT;

  const goTo = useCallback((idx: number) => {
    setCurrent((idx + total) % total);
  }, [total]);

  const next = useCallback(() => goTo(current + 1), [goTo, current]);
  const prev = useCallback(() => goTo(current - 1), [goTo, current]);

  const resetAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, 4000);
  }, [total]);

  useEffect(() => {
    resetAuto();
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [resetAuto]);

  const onPointerDown = (e: React.PointerEvent) => {
    setDragStartX(e.clientX);
    setDragDelta(0);
    setIsDragging(false);
    if (autoRef.current) clearInterval(autoRef.current);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStartX === null) return;
    const delta = e.clientX - dragStartX;
    setDragDelta(delta);
    if (Math.abs(delta) > 6) setIsDragging(true);
  };
  const onPointerUp = () => {
    if (isDragging) {
      if (dragDelta < -50) next();
      else if (dragDelta > 50) prev();
    }
    setDragStartX(null);
    setDragDelta(0);
    setIsDragging(false);
    resetAuto();
  };

  return (
    <section
      className="relative w-full select-none bg-surface"
      style={{ touchAction: "pan-y" }}
    >
      {/* ══ Premium Frame ══ */}
      <div className="mx-2 md:mx-5 xl:mx-8 mt-[90px] md:mt-[100px] rounded-[18px] md:rounded-[26px] overflow-hidden shadow-[0_4px_6px_rgba(0,0,0,0.07),0_12px_40px_rgba(0,0,0,0.13)] ring-2 ring-black/[0.06] relative">

        {/* ── Slides wrapper ── */}
        <div
          className="relative w-full overflow-hidden h-[58vw] max-h-[500px] min-h-[200px] md:h-[42vw] md:max-h-[620px] md:min-h-[340px] xl:h-[36vw] xl:max-h-[720px]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          {/* Slide strip */}
          <div
            className="absolute inset-0 flex"
            style={{
              width: `${total * 100}%`,
              transform: `translateX(calc(-${(current / total) * 100}% + ${dragDelta / total}px))`,
              transition: isDragging ? "none" : "transform 0.55s cubic-bezier(0.77,0,0.18,1)",
            }}
          >
            {Array.from({ length: total }, (_, i) => (
              <div key={i} className="relative h-full" style={{ width: `${100 / total}%` }}>
                {/* Mobile < 768px */}
                <img src={`/banner/mobile/${i + 1}.png`} alt={`Banner ${i + 1}`}
                  className="block md:hidden absolute inset-0 w-full h-full object-cover object-center" draggable={false} />
                {/* Tablet 768px–1279px */}
                <img src={`/banner/tablet/${i + 1}.png`} alt={`Banner ${i + 1}`}
                  className="hidden md:block xl:hidden absolute inset-0 w-full h-full object-cover object-center" draggable={false} />
                {/* Desktop ≥ 1280px */}
                <img src={`/banner/desktop/${i + 1}.png`} alt={`Banner ${i + 1}`}
                  className="hidden xl:block absolute inset-0 w-full h-full object-cover object-center" draggable={false} />
              </div>
            ))}
          </div>

          {/* Bottom gradient for dot/progress visibility */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none" />

          {/* ── Prev arrow ── */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); resetAuto(); }}
            className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 border border-white/25 shadow-lg"
            aria-label="Previous banner"
          >
            <span className="material-symbols-outlined text-white text-[22px] md:text-[26px]">chevron_left</span>
          </button>

          {/* ── Next arrow ── */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); resetAuto(); }}
            className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 border border-white/25 shadow-lg"
            aria-label="Next banner"
          >
            <span className="material-symbols-outlined text-white text-[22px] md:text-[26px]">chevron_right</span>
          </button>

          {/* ── Dot indicators ── */}
          <div className="absolute bottom-5 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {Array.from({ length: total }, (_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); goTo(i); resetAuto(); }}
                aria-label={`Go to banner ${i + 1}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? "28px" : "8px",
                  height: "8px",
                  background: i === current ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.5)",
                }}
              />
            ))}
          </div>

          {/* ── Progress bar ── */}
          <div className="absolute bottom-0 left-0 right-0 z-20 h-[3px] bg-white/20">
            <div key={current} className="h-full bg-white/80"
              style={{ animation: "bannerProgress 4s linear forwards" }} />
          </div>
        </div>
      </div>{/* end premium frame */}



      <style jsx>{`
        @keyframes bannerProgress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </section>
  );
}

// ─── Category Pills Scroller ─────────────────────────────────────────────────

const CATEGORY_PILLS = [
  { label: "Whole Spices",      icon: "local_fire_department" },
  { label: "Ground Masalas",    icon: "soup_kitchen" },
  { label: "Dry Fruits & Nuts", icon: "nutrition" },
  { label: "Dals & Pulses",     icon: "grain" },
  { label: "Ready Spice Mixes", icon: "skillet" },
  { label: "Premium Blends",    icon: "auto_awesome" },
  { label: "Gift Sets",         icon: "card_giftcard" },
];

function CategoryPillsScroller() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
    if (scrollRef.current) scrollRef.current.style.cursor = "grabbing";
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };
  const onMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };

  return (
    <div
      ref={scrollRef}
      className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-1 w-full max-w-[870px] hide-scrollbar"
      style={{ cursor: "grab", scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {CATEGORY_PILLS.map((pill) => (
        <button
          key={pill.label}
          className="bg-secondary-fixed/20 text-on-surface border border-secondary-fixed/30 rounded-full px-3 md:px-5 py-1.5 md:py-2 text-[11px] md:text-body-md hover:bg-secondary-fixed/30 transition-colors backdrop-blur-sm inline-flex items-center gap-1.5 shrink-0"
        >
          <span className="material-symbols-outlined text-[14px] md:text-[16px]">{pill.icon}</span>
          &nbsp;{pill.label}
        </button>
      ))}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parsePrice(value: string): [number, number] {
  if (value === "any") return [0, Infinity];
  if (value === "1000+") return [1000, Infinity];
  const [lo, hi] = value.split("-").map(Number);
  return [lo, hi];
}

// ─── Auto-Scroll Reviews ─────────────────────────────────────────────────────

const ALL_REVIEWS = [
  { stars: 5, text: "The garam masala is unlike anything from a supermarket. You can smell the freshness the moment you open the packet. My curries taste completely different now.", name: "Rehana Begum", role: "Home Cook, Dhaka", initial: "R", bg: "bg-primary-container", color: "text-primary" },
  { stars: 5, text: "We switched our restaurant to Khati Family for all spice needs. The consistency and quality are excellent. Bulk ordering is seamless and delivery is always on time.", name: "Kabir Hossain", role: "Chef & Restaurant Owner, Chittagong", initial: "K", bg: "bg-secondary-container", color: "text-secondary" },
  { stars: 5, text: "The Premium Spice Box subscription is a game changer. Every month I discover new spices. The dry fruits are incredibly fresh — much better than local stores.", name: "Sadia Rahman", role: "Food Blogger, Sylhet", initial: "S", bg: "bg-tertiary-fixed", color: "text-tertiary" },
  { stars: 5, text: "I have been buying almonds and cashews from Khati Family for 6 months. The quality never disappoints — always fresh, always delivered on time. Highly recommended!", name: "Farida Khanam", role: "Home Chef, Rajshahi", initial: "F", bg: "bg-primary-container", color: "text-primary" },
  { stars: 5, text: "Finally found a place where spices actually smell like spices! The turmeric and coriander have transformed my cooking. Free delivery above ৳500 is a great bonus.", name: "Nadia Islam", role: "Food Content Creator, Dhaka", initial: "N", bg: "bg-secondary-container", color: "text-secondary" },
  { stars: 4, text: "Ordered the Biryani Masala and the Garam Masala together — both excellent. My guests kept asking what restaurant cooked the biryani. Shipping was very fast too.", name: "Arif Hossain", role: "Home Cook, Khulna", initial: "A", bg: "bg-tertiary-fixed", color: "text-tertiary" },
  { stars: 5, text: "The mixed dry fruits pack is value for money. Great quality pistachios and raisins — fresher than what I find in local stores. Will definitely order again!", name: "Taslima Akter", role: "Nutritionist, Cumilla", initial: "T", bg: "bg-primary-container", color: "text-primary" },
  { stars: 5, text: "Running a catering business, I need consistent quality in bulk. Khati Family delivers exactly that. Their wholesale team is very responsive and helpful.", name: "Mizanur Rahman", role: "Catering Business Owner, Gazipur", initial: "M", bg: "bg-secondary-container", color: "text-secondary" },
  { stars: 5, text: "I love that the packs clearly show the sourcing region. Kerala cardamom — the aroma is phenomenal! This is the real deal, not some generic store brand.", name: "Sumaiya Chowdhury", role: "Cooking Enthusiast, Sylhet", initial: "S", bg: "bg-tertiary-fixed", color: "text-tertiary" },
  { stars: 4, text: "Very impressed with the packaging — airtight and well-sealed. The moong dal cooked beautifully, no stones or debris. Solid quality for a great price.", name: "Jahangir Alam", role: "Home Cook, Comilla", initial: "J", bg: "bg-primary-container", color: "text-primary" },
];

function AutoScrollReviews() {
  const trackRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  const posRef = useRef(0);
  const rafRef = useRef<number>(0);
  const doubled = [...ALL_REVIEWS, ...ALL_REVIEWS];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const speed = 0.5; // px per frame

    function step() {
      if (!isPaused.current && track) {
        posRef.current += speed;
        const halfWidth = track.scrollWidth / 2;
        if (posRef.current >= halfWidth) posRef.current = 0;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const pause = () => { isPaused.current = true; };
  const resume = () => { isPaused.current = false; };

  return (
    <div
      className="overflow-hidden w-full"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
    >
      <div ref={trackRef} className="flex gap-4 md:gap-6 will-change-transform" style={{ width: "max-content" }}>
        {doubled.map((r, i) => (
          <div
            key={i}
            className="bg-surface-container-low rounded-[24px] p-5 md:p-8 border border-outline-variant/30 w-[280px] md:w-[360px] shrink-0 flex flex-col"
          >
            <div className="text-primary text-[16px] md:text-[20px] mb-3">{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</div>
            <p className="font-body-lg text-[12px] md:text-body-lg text-on-surface mb-4 flex-1">{r.text}</p>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full ${r.bg} flex items-center justify-center shrink-0`}>
                <span className={`font-bold ${r.color} text-[13px] md:text-[14px]`}>{r.initial}</span>
              </div>
              <div>
                <p className="font-body-md text-[12px] md:text-body-md text-on-surface font-semibold">{r.name}</p>
                <p className="text-[10px] md:text-body-md text-on-surface-variant">{r.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`faq-item border-b border-outline-variant/30 py-4 md:py-6 cursor-pointer ${
        isOpen ? "open" : ""
      }`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-headline-md text-[15px] md:text-headline-md text-on-surface hover:text-primary transition-colors pr-4">
          {question}
        </h3>
        <span className="material-symbols-outlined faq-icon text-on-surface-variant text-[20px] md:text-[24px] shrink-0">
          add
        </span>
      </div>
      <div className="faq-content">
        <p className="font-body-md text-[12px] md:text-body-md text-on-surface-variant pt-3 md:pt-4 pr-8">
          {answer}
        </p>
      </div>
    </div>
  );
}

// ─── Product Card ────────────────────────────────────────────────────────────

function ProductCard({ p }: { p: Product }) {
  const stars = "★".repeat(p.rating) + (p.rating < 5 ? "☆" : "");
  const [added, setAdded] = useState(false);

  const handleAdd = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!p.inStock || added) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2800);
  }, [p.inStock, added]);

  return (
    <div className="product-card bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden flex flex-col">
      <div className={`h-36 md:h-52 bg-gradient-to-br ${p.gradientFrom} ${p.gradientTo} relative overflow-hidden p-3 md:p-5 flex items-end`}>
        {p.badge && (
          <div className={`absolute text-[8px] md:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${p.badgeColor}`}>
            {p.badge}
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 md:w-24 h-16 md:h-24 rounded-full bg-white/10"></div>
        </div>
        <div className="relative z-10 bg-surface/90 backdrop-blur rounded-xl px-2 py-1.5 md:px-3 md:py-2 border border-white/50 shadow">
          <span className={`material-symbols-outlined ${p.iconColor} text-[18px] md:text-[22px]`}>{p.icon}</span>
        </div>
      </div>
      <div className="p-3 md:p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-0.5">
          <span className="text-primary text-[11px] md:text-[13px]">{stars}</span>
          <span className="text-[9px] md:text-[11px] text-on-surface-variant">({p.reviews})</span>
        </div>
        <h4 className="font-headline-md text-[13px] md:text-headline-md text-on-surface mb-0.5">{p.name}</h4>
        <p className="text-[10px] md:text-body-md text-on-surface-variant mb-2 md:mb-3">{p.weight}</p>
        {!p.inStock && (
          <p className="text-[9px] md:text-[11px] text-error font-medium mb-1">Out of stock</p>
        )}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-[17px] md:text-[22px] text-on-surface">৳{p.price}</span>
            {p.originalPrice && (
              <span className="text-[10px] md:text-[12px] text-on-surface-variant line-through">৳{p.originalPrice}</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={!p.inStock}
            className={`text-[10px] md:text-body-md font-semibold px-2.5 md:px-4 py-1.5 md:py-2 rounded-full transition-all flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed${added ? ' cart-btn-added' : ' bg-primary text-on-primary hover:opacity-85'}`}
          >
            {added ? (
              <Check size={13} className="check-icon md:w-4 md:h-4" />
            ) : (
              <ShoppingCart size={13} className="md:w-4 md:h-4" />
            )}
            <span className="hidden sm:inline text-[11px] md:text-body-md">{added ? 'Added' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState(""); // committed on Enter / button click

  // Category dropdown
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const categoryRef = useRef<HTMLDivElement>(null);

  // Filter dropdown — pending (while panel is open) vs applied
  const [filterOpen, setFilterOpen] = useState(false);
  const [pendingSort, setPendingSort]   = useState(SORT_OPTIONS[0]);
  const [pendingPrice, setPendingPrice] = useState(PRICE_RANGES[0]);
  const [pendingStock, setPendingStock] = useState(false);
  // Applied filters (committed when "Apply Filters" is clicked)
  const [appliedSort, setAppliedSort]   = useState(SORT_OPTIONS[0]);
  const [appliedPrice, setAppliedPrice] = useState(PRICE_RANGES[0]);
  const [appliedStock, setAppliedStock] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLElement>(null);

  // Whether a search / filter is active
  const isSearchActive = useMemo(
    () =>
      activeSearch.trim() !== "" ||
      selectedCategory.label !== "All Categories" ||
      appliedPrice.value !== "any" ||
      appliedStock,
    [activeSearch, selectedCategory, appliedPrice, appliedStock]
  );

  // Derived filtered + sorted product list
  const results = useMemo(() => {
    let list = [...ALL_PRODUCTS];

    // text search
    const q = activeSearch.toLowerCase().trim();
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));

    // category
    if (selectedCategory.label !== "All Categories")
      list = list.filter((p) => p.category === selectedCategory.label);

    // price
    const [lo, hi] = parsePrice(appliedPrice.value);
    if (appliedPrice.value !== "any") list = list.filter((p) => p.price >= lo && p.price <= hi);

    // in stock
    if (appliedStock) list = list.filter((p) => p.inStock);

    // sort
    if (appliedSort.value === "price_asc")  list.sort((a, b) => a.price - b.price);
    if (appliedSort.value === "price_desc") list.sort((a, b) => b.price - a.price);
    if (appliedSort.value === "rating")     list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    if (appliedSort.value === "newest")     list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

    return list;
  }, [activeSearch, selectedCategory, appliedPrice, appliedStock, appliedSort]);

  // Active filter tags to show below search box
  const activeTags = useMemo(() => {
    const tags: { key: string; label: string }[] = [];
    if (selectedCategory.label !== "All Categories") tags.push({ key: "category", label: selectedCategory.label });
    if (appliedSort.value !== "relevance")           tags.push({ key: "sort",     label: appliedSort.label });
    if (appliedPrice.value !== "any")                tags.push({ key: "price",    label: appliedPrice.label });
    if (appliedStock)                                tags.push({ key: "stock",    label: "In Stock Only" });
    return tags;
  }, [selectedCategory, appliedSort, appliedPrice, appliedStock]);

  function removeTag(key: string) {
    if (key === "category") setSelectedCategory(CATEGORIES[0]);
    if (key === "sort")     { setAppliedSort(SORT_OPTIONS[0]);   setPendingSort(SORT_OPTIONS[0]); }
    if (key === "price")    { setAppliedPrice(PRICE_RANGES[0]);  setPendingPrice(PRICE_RANGES[0]); }
    if (key === "stock")    { setAppliedStock(false);            setPendingStock(false); }
  }

  function clearAllTags() {
    setSelectedCategory(CATEGORIES[0]);
    setAppliedSort(SORT_OPTIONS[0]);   setPendingSort(SORT_OPTIONS[0]);
    setAppliedPrice(PRICE_RANGES[0]);  setPendingPrice(PRICE_RANGES[0]);
    setAppliedStock(false);            setPendingStock(false);
    setActiveSearch("");               setSearchQuery("");
  }

  function applyFilters() {
    setAppliedSort(pendingSort);
    setAppliedPrice(pendingPrice);
    setAppliedStock(pendingStock);
    setFilterOpen(false);
  }

  function triggerSearch() {
    setActiveSearch(searchQuery);
  }

  // Auto-scroll to results when search/filter activates
  useEffect(() => {
    if (isSearchActive && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isSearchActive, results]);

  // Close both dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) setCategoryOpen(false);
      if (filterRef.current  && !filterRef.current.contains(e.target as Node))  setFilterOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes checkPop {
          0%   { transform: scale(0.5); opacity: 0; }
          60%  { transform: scale(1.25); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes btnConfirm {
          0%   { transform: scale(1); }
          15%  { transform: scale(0.88); }
          40%  { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .cart-btn-added {
          animation: btnConfirm 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          background: #2e7d32 !important;
          color: #fff !important;
        }
        .cart-btn-added .check-icon {
          animation: checkPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
      `}</style>
      {/* ─── SECTION 1: HERO BANNER CAROUSEL ─── */}
      <HeroBannerCarousel />

      {/* ─── SEARCH + FILTER SECTION ─── */}
      <section className="relative pt-6 md:pt-8 pb-8 md:pb-12 px-6 md:px-container-padding bg-surface flex flex-col items-center">
        {/* Search Box */}
        <div className="w-full max-w-[870px] bg-surface rounded-3xl border border-outline-variant shadow-[0_24px_64px_rgba(159,65,34,0.08)] p-4 md:p-6 mb-3 backdrop-blur-xl overflow-visible relative z-10">
          <div className="flex flex-col gap-3 md:gap-4 overflow-visible">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && triggerSearch()}
              className="w-full bg-transparent border-none font-body-lg text-[14px] md:text-body-lg text-on-surface placeholder:text-outline focus:ring-0 py-1 md:py-2"
              placeholder="Search spices, dals, dry fruits, masalas..."
            />
            <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-surface-variant overflow-visible">
              <div className="flex items-center gap-2 md:gap-3 overflow-visible">

                {/* ── Filter button dropdown ── */}
                <div className="relative" ref={filterRef}>
                  <button
                    onClick={() => { setFilterOpen((o) => !o); setCategoryOpen(false); }}
                    className={`p-1.5 md:p-2 rounded-full transition-colors ${filterOpen ? "bg-primary text-on-primary" : "hover:bg-surface-variant text-on-surface-variant"}`}
                    aria-label="Open filters"
                  >
                    <span className="material-symbols-outlined text-[20px] md:text-[24px]">tune</span>
                  </button>

                  {filterOpen && (
                    <div className="absolute left-0 bottom-[calc(100%+8px)] z-[9999] w-64 bg-surface border border-outline-variant/50 rounded-2xl shadow-[0_-8px_40px_rgba(0,0,0,0.12)] p-4 flex flex-col gap-4">
                      {/* Sort by */}
                      <div>
                        <p className="font-label-caps text-[10px] text-on-surface-variant tracking-widest mb-2">SORT BY</p>
                        <div className="flex flex-col gap-1">
                          {SORT_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => setPendingSort(opt)}
                              className={`text-left px-3 py-2 rounded-xl text-[12px] md:text-body-md transition-colors ${
                                pendingSort.value === opt.value
                                  ? "bg-primary-container text-on-primary-container font-medium"
                                  : "text-on-surface hover:bg-surface-variant"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-outline-variant/30" />

                      {/* Price range */}
                      <div>
                        <p className="font-label-caps text-[10px] text-on-surface-variant tracking-widest mb-2">PRICE RANGE</p>
                        <div className="flex flex-col gap-1">
                          {PRICE_RANGES.map((range) => (
                            <button
                              key={range.value}
                              onClick={() => setPendingPrice(range)}
                              className={`text-left px-3 py-2 rounded-xl text-[12px] md:text-body-md transition-colors ${
                                pendingPrice.value === range.value
                                  ? "bg-primary-container text-on-primary-container font-medium"
                                  : "text-on-surface hover:bg-surface-variant"
                              }`}
                            >
                              {range.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-outline-variant/30" />

                      {/* In stock toggle */}
                      <button
                        onClick={() => setPendingStock((v) => !v)}
                        className="flex items-center justify-between px-1"
                      >
                        <span className="text-[12px] md:text-body-md text-on-surface">In Stock Only</span>
                        <div className={`w-9 h-5 rounded-full transition-colors relative ${pendingStock ? "bg-primary" : "bg-surface-variant"}`}>
                          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-surface shadow transition-all ${pendingStock ? "left-4" : "left-0.5"}`} />
                        </div>
                      </button>

                      {/* Apply */}
                      <button
                        onClick={applyFilters}
                        className="w-full bg-primary text-on-primary rounded-full py-2 text-[12px] md:text-body-md font-medium hover:bg-primary/90 transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                  )}
                </div>

                {/* ── Category dropdown ── */}
                <div className="relative" ref={categoryRef}>
                  <button
                    onClick={() => { setCategoryOpen((o) => !o); setFilterOpen(false); }}
                    className="flex items-center gap-1.5 md:gap-2 bg-surface-variant rounded-full px-3 md:px-4 py-1.5 md:py-2 cursor-pointer hover:bg-surface-container-high transition-colors"
                  >
                    <span className="font-body-md text-[11px] md:text-body-md text-on-surface-variant">
                      {selectedCategory.label}
                    </span>
                    <span className={`material-symbols-outlined text-[16px] md:text-[20px] transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`}>
                      expand_more
                    </span>
                  </button>

                  {categoryOpen && (
                    <div className="absolute left-0 bottom-[calc(100%+8px)] z-[9999] w-52 bg-surface border border-outline-variant/50 rounded-2xl shadow-[0_-8px_40px_rgba(0,0,0,0.12)] py-2 overflow-hidden">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.label}
                          onClick={() => { setSelectedCategory(cat); setCategoryOpen(false); }}
                          className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-[12px] md:text-body-md transition-colors ${
                            selectedCategory.label === cat.label
                              ? "bg-primary-container text-on-primary-container font-medium"
                              : "text-on-surface hover:bg-surface-variant"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px] shrink-0">{cat.icon}</span>
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>
              <button
                onClick={triggerSearch}
                className="bg-primary text-on-primary rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px] md:text-[24px]">search</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Active filter tags ── */}
        {activeTags.length > 0 && (
          <div className="w-full max-w-[870px] flex flex-wrap items-center gap-2 mb-5 px-1">
            {activeTags.map((tag) => (
              <span
                key={tag.key}
                className="inline-flex items-center gap-1.5 bg-primary-container text-on-primary-container text-[11px] md:text-[12px] font-medium px-3 py-1.5 rounded-full"
              >
                {tag.label}
                <button
                  onClick={() => removeTag(tag.key)}
                  className="flex items-center hover:opacity-70 transition-opacity"
                  aria-label={`Remove ${tag.label} filter`}
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            ))}
            <button
              onClick={clearAllTags}
              className="text-[11px] md:text-[12px] text-on-surface-variant hover:text-primary underline underline-offset-2 transition-colors ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Category Pills — horizontally scrollable with smooth drag */}
        <CategoryPillsScroller />
      </section>

      {/* ─── SECTION 2: SLOGAN ─── */}
      {!isSearchActive && (
        <section className="py-12 md:py-section-gap px-6 md:px-container-padding bg-surface relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-container/10 to-transparent"></div>
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="font-display-xl text-[34px] md:text-[68px] leading-[1.2] font-normal text-on-surface tracking-tight">
              Flavor without compromise.
            </h2>
          </div>
        </section>
      )}

      {/* ─── SECTION 7: SEARCH RESULTS / BESTSELLING PRODUCTS ─── */}
      <section ref={resultsRef} className="py-12 md:py-section-gap px-6 md:px-container-padding bg-surface-container-low">
        <div className="max-w-7xl mx-auto">

          {isSearchActive ? (
            /* ── Search / Filter Results ── */
            <>
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 md:mb-10 gap-3">
                <div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest mb-2 block">
                    RESULTS
                  </span>
                  <h2 className="font-display-xl text-[28px] md:text-[48px] leading-tight text-on-surface">
                    {results.length > 0
                      ? <>{results.length} product{results.length !== 1 ? "s" : ""} found</>
                      : "No products found"}
                  </h2>
                  {activeSearch && (
                    <p className="text-[13px] md:text-body-md text-on-surface-variant mt-1">
                      for &ldquo;<span className="font-medium text-on-surface">{activeSearch}</span>&rdquo;
                    </p>
                  )}
                </div>
                <button
                  onClick={clearAllTags}
                  className="inline-flex items-center gap-1.5 text-primary font-body-md text-[13px] md:text-body-md font-medium hover:underline underline-offset-4 shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px] md:text-[20px]">close</span>
                  Clear search
                </button>
              </div>

              {results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                  {results.map((p) => <ProductCard key={p.id} p={p} />)}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                  <span className="material-symbols-outlined text-[48px] text-on-surface-variant">search_off</span>
                  <p className="font-body-lg text-[14px] md:text-body-lg text-on-surface-variant max-w-sm">
                    Try a different keyword or remove some filters to see more products.
                  </p>
                  <button
                    onClick={clearAllTags}
                    className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-[13px] md:text-body-md font-medium hover:bg-primary/90 transition-colors"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </>
          ) : (
            /* ── Default Bestsellers ── */
            <>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 md:mb-12 gap-3">
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest mb-2 block">
                BESTSELLERS
              </span>
              <h2 className="font-display-xl text-[28px] md:text-[48px] leading-tight text-on-surface">
                Our Most-Loved Products
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-primary font-body-md text-[13px] md:text-body-md font-medium hover:underline underline-offset-4 shrink-0"
            >
              View All{" "}
              <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                arrow_forward
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {/* Product 1 */}
            <div className="product-card bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden flex flex-col">
              <div className="h-36 md:h-52 bg-gradient-to-br from-primary-container to-primary/20 relative overflow-hidden p-3 md:p-5 flex items-end">
                <div className="absolute top-2.5 left-2.5 bg-on-surface text-surface text-[8px] md:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Bestseller
                </div>
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
                  <span className="text-primary text-[11px] md:text-[13px]">★★★★★</span>
                  <span className="text-[9px] md:text-[11px] text-on-surface-variant">(428)</span>
                </div>
                <h4 className="font-headline-md text-[13px] md:text-headline-md text-on-surface mb-0.5">
                  Garam Masala Blend
                </h4>
                <p className="text-[10px] md:text-body-md text-on-surface-variant mb-2 md:mb-3">
                  200g • Premium Grade
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-[17px] md:text-[22px] text-on-surface">৳249</span>
                  <button className="bg-primary text-on-primary text-[10px] md:text-body-md font-medium px-2.5 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] md:text-[16px]">
                      add_shopping_cart
                    </span>
                    <span className="hidden sm:inline text-[11px] md:text-body-md">Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product 2 */}
            <div className="product-card bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden flex flex-col">
              <div className="h-36 md:h-52 bg-gradient-to-br from-surface-container-high to-primary-fixed/50 relative overflow-hidden p-3 md:p-5 flex items-end">
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
                  <span className="text-primary text-[11px] md:text-[13px]">★★★★★</span>
                  <span className="text-[9px] md:text-[11px] text-on-surface-variant">(312)</span>
                </div>
                <h4 className="font-headline-md text-[13px] md:text-headline-md text-on-surface mb-0.5">
                  Premium Almonds
                </h4>
                <p className="text-[10px] md:text-body-md text-on-surface-variant mb-2 md:mb-3">
                  500g • California Grade A
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-[17px] md:text-[22px] text-on-surface">৳649</span>
                  <button className="bg-primary text-on-primary text-[10px] md:text-body-md font-medium px-2.5 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] md:text-[16px]">
                      add_shopping_cart
                    </span>
                    <span className="hidden sm:inline text-[11px] md:text-body-md">Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product 3 */}
            <div className="product-card bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden flex flex-col">
              <div className="h-36 md:h-52 bg-gradient-to-br from-secondary-container to-secondary-fixed/50 relative overflow-hidden p-3 md:p-5 flex items-end">
                <div className="absolute top-2.5 right-2.5 bg-primary text-on-primary text-[8px] md:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  New
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 md:w-24 h-16 md:h-24 rounded-full bg-secondary/15"></div>
                </div>
                <div className="relative z-10 bg-surface/90 backdrop-blur rounded-xl px-2 py-1.5 md:px-3 md:py-2 border border-white/50 shadow">
                  <span className="material-symbols-outlined text-secondary text-[18px] md:text-[22px]">
                    soup_kitchen
                  </span>
                </div>
              </div>
              <div className="p-3 md:p-5 flex flex-col flex-1">
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-primary text-[11px] md:text-[13px]">★★★★☆</span>
                  <span className="text-[9px] md:text-[11px] text-on-surface-variant">(186)</span>
                </div>
                <h4 className="font-headline-md text-[13px] md:text-headline-md text-on-surface mb-0.5">
                  Biryani Masala
                </h4>
                <p className="text-[10px] md:text-body-md text-on-surface-variant mb-2 md:mb-3">
                  100g • Restaurant Grade
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-[17px] md:text-[22px] text-on-surface">৳199</span>
                  <button className="bg-primary text-on-primary text-[10px] md:text-body-md font-medium px-2.5 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] md:text-[16px]">
                      add_shopping_cart
                    </span>
                    <span className="hidden sm:inline text-[11px] md:text-body-md">Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product 4 */}
            <div className="product-card bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden flex flex-col">
              <div className="h-36 md:h-52 bg-gradient-to-br from-secondary-fixed to-secondary-fixed-dim/50 relative overflow-hidden p-3 md:p-5 flex items-end">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 md:w-24 h-10 md:h-14 rounded-xl bg-secondary/20"></div>
                </div>
                <div className="relative z-10 bg-surface/90 backdrop-blur rounded-xl px-2 py-1.5 md:px-3 md:py-2 border border-white/50 shadow">
                  <span className="material-symbols-outlined text-on-surface text-[18px] md:text-[22px]">
                    set_meal
                  </span>
                </div>
              </div>
              <div className="p-3 md:p-5 flex flex-col flex-1">
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-primary text-[11px] md:text-[13px]">★★★★★</span>
                  <span className="text-[9px] md:text-[11px] text-on-surface-variant">(541)</span>
                </div>
                <h4 className="font-headline-md text-[13px] md:text-headline-md text-on-surface mb-0.5">
                  Yellow Moong Dal
                </h4>
                <p className="text-[10px] md:text-body-md text-on-surface-variant mb-2 md:mb-3">
                  1kg • Premium Washed
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <span className="font-bold text-[17px] md:text-[22px] text-on-surface">৳149</span>
                    <span className="text-[10px] md:text-[12px] text-on-surface-variant line-through ml-1">
                      ৳185
                    </span>
                  </div>
                  <button className="bg-primary text-on-primary text-[10px] md:text-body-md font-medium px-2.5 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] md:text-[16px]">
                      add_shopping_cart
                    </span>
                    <span className="hidden sm:inline text-[11px] md:text-body-md">Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product 5 */}
            <div className="product-card bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden flex flex-col">
              <div className="h-36 md:h-52 bg-gradient-to-br from-tertiary-fixed to-tertiary-container relative overflow-hidden p-3 md:p-5 flex items-end">
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
                  <span className="text-primary text-[11px] md:text-[13px]">★★★★★</span>
                  <span className="text-[9px] md:text-[11px] text-on-surface-variant">(267)</span>
                </div>
                <h4 className="font-headline-md text-[13px] md:text-headline-md text-on-surface mb-0.5">
                  Green Cardamom
                </h4>
                <p className="text-[10px] md:text-body-md text-on-surface-variant mb-2 md:mb-3">
                  50g • Kerala Origin
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-[17px] md:text-[22px] text-on-surface">৳349</span>
                  <button className="bg-primary text-on-primary text-[10px] md:text-body-md font-medium px-2.5 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] md:text-[16px]">
                      add_shopping_cart
                    </span>
                    <span className="hidden sm:inline text-[11px] md:text-body-md">Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product 6 */}
            <div className="product-card bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden flex flex-col">
              <div className="h-36 md:h-52 bg-gradient-to-br from-primary-fixed to-inverse-primary/40 relative overflow-hidden p-3 md:p-5 flex items-end">
                <div className="absolute top-2.5 left-2.5 bg-error text-on-error text-[8px] md:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  20% OFF
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 md:w-24 h-16 md:h-24 rounded-3xl bg-primary/10"></div>
                </div>
                <div className="relative z-10 bg-surface/90 backdrop-blur rounded-xl px-2 py-1.5 md:px-3 md:py-2 border border-white/50 shadow">
                  <span className="material-symbols-outlined text-primary text-[18px] md:text-[22px]">
                    shopping_basket
                  </span>
                </div>
              </div>
              <div className="p-3 md:p-5 flex flex-col flex-1">
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-primary text-[11px] md:text-[13px]">★★★★☆</span>
                  <span className="text-[9px] md:text-[11px] text-on-surface-variant">(193)</span>
                </div>
                <h4 className="font-headline-md text-[13px] md:text-headline-md text-on-surface mb-0.5">
                  Mixed Dry Fruits
                </h4>
                <p className="text-[10px] md:text-body-md text-on-surface-variant mb-2 md:mb-3">
                  250g • Premium Selection
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <span className="font-bold text-[17px] md:text-[22px] text-on-surface">৳719</span>
                    <span className="text-[10px] md:text-[12px] text-on-surface-variant line-through ml-1">
                      ৳899
                    </span>
                  </div>
                  <button className="bg-primary text-on-primary text-[10px] md:text-body-md font-medium px-2.5 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] md:text-[16px]">
                      add_shopping_cart
                    </span>
                    <span className="hidden sm:inline text-[11px] md:text-body-md">Add</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
            </>
          )}

        </div>
      </section>

      {/* ─── PRODUCT SECTION A: TOP SPICES ─── */}
      {!isSearchActive && (
        <section className="py-12 md:py-section-gap px-6 md:px-container-padding bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 md:mb-12 gap-3">
              <div>
                <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest mb-2 block">WHOLE SPICES</span>
                <h2 className="font-display-xl text-[28px] md:text-[48px] leading-tight text-on-surface">Straight from the Source</h2>
              </div>
              <Link href="/products" className="inline-flex items-center gap-1.5 text-primary font-body-md text-[13px] md:text-body-md font-medium hover:underline underline-offset-4 shrink-0">
                View All <span className="material-symbols-outlined text-[18px] md:text-[20px]">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {/* Green Cardamom */}
              <div className="product-card bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden flex flex-col">
                <div className="h-36 md:h-44 bg-gradient-to-br from-tertiary-fixed to-tertiary-container relative overflow-hidden p-3 md:p-5 flex items-end">
                  <div className="absolute inset-0 flex items-center justify-center"><div className="w-16 md:w-20 h-16 md:h-20 rounded-full bg-white/10"></div></div>
                  <div className="relative z-10 bg-surface/90 backdrop-blur rounded-xl px-2 py-1.5 md:px-3 md:py-2 border border-white/50 shadow">
                    <span className="material-symbols-outlined text-tertiary text-[18px] md:text-[22px]">spa</span>
                  </div>
                </div>
                <div className="p-3 md:p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-1 mb-0.5"><span className="text-primary text-[11px] md:text-[13px]">★★★★★</span><span className="text-[9px] md:text-[11px] text-on-surface-variant">(267)</span></div>
                  <h4 className="font-headline-md text-[13px] md:text-headline-md text-on-surface mb-0.5">Green Cardamom</h4>
                  <p className="text-[10px] md:text-body-md text-on-surface-variant mb-2 md:mb-3">50g • Kerala Origin</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-[17px] md:text-[22px] text-on-surface">৳349</span>
                    <button className="bg-primary text-on-primary text-[10px] md:text-body-md font-medium px-2.5 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] md:text-[16px]">add_shopping_cart</span>
                      <span className="hidden sm:inline text-[11px] md:text-body-md">Add</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Black Pepper */}
              <div className="product-card bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden flex flex-col">
                <div className="h-36 md:h-44 bg-gradient-to-br from-secondary-container to-surface-container-high relative overflow-hidden p-3 md:p-5 flex items-end">
                  <div className="absolute inset-0 flex items-center justify-center"><div className="w-16 md:w-20 h-16 md:h-20 rounded-full bg-white/10"></div></div>
                  <div className="relative z-10 bg-surface/90 backdrop-blur rounded-xl px-2 py-1.5 md:px-3 md:py-2 border border-white/50 shadow">
                    <span className="material-symbols-outlined text-secondary text-[18px] md:text-[22px]">grass</span>
                  </div>
                </div>
                <div className="p-3 md:p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-1 mb-0.5"><span className="text-primary text-[11px] md:text-[13px]">★★★★★</span><span className="text-[9px] md:text-[11px] text-on-surface-variant">(334)</span></div>
                  <h4 className="font-headline-md text-[13px] md:text-headline-md text-on-surface mb-0.5">Black Pepper Whole</h4>
                  <p className="text-[10px] md:text-body-md text-on-surface-variant mb-2 md:mb-3">100g • Malabar Grade</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-[17px] md:text-[22px] text-on-surface">৳289</span>
                    <button className="bg-primary text-on-primary text-[10px] md:text-body-md font-medium px-2.5 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] md:text-[16px]">add_shopping_cart</span>
                      <span className="hidden sm:inline text-[11px] md:text-body-md">Add</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Cinnamon Sticks */}
              <div className="product-card bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden flex flex-col">
                <div className="h-36 md:h-44 bg-gradient-to-br from-tertiary-container to-tertiary-fixed/50 relative overflow-hidden p-3 md:p-5 flex items-end">
                  <div className="absolute top-2.5 right-2.5 bg-primary text-on-primary text-[8px] md:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">New</div>
                  <div className="absolute inset-0 flex items-center justify-center"><div className="w-16 md:w-20 h-16 md:h-20 rounded-full bg-white/10"></div></div>
                  <div className="relative z-10 bg-surface/90 backdrop-blur rounded-xl px-2 py-1.5 md:px-3 md:py-2 border border-white/50 shadow">
                    <span className="material-symbols-outlined text-tertiary text-[18px] md:text-[22px]">local_fire_department</span>
                  </div>
                </div>
                <div className="p-3 md:p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-1 mb-0.5"><span className="text-primary text-[11px] md:text-[13px]">★★★★★</span><span className="text-[9px] md:text-[11px] text-on-surface-variant">(189)</span></div>
                  <h4 className="font-headline-md text-[13px] md:text-headline-md text-on-surface mb-0.5">Cinnamon Sticks</h4>
                  <p className="text-[10px] md:text-body-md text-on-surface-variant mb-2 md:mb-3">100g • Ceylon Grade</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-[17px] md:text-[22px] text-on-surface">৳219</span>
                    <button className="bg-primary text-on-primary text-[10px] md:text-body-md font-medium px-2.5 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] md:text-[16px]">add_shopping_cart</span>
                      <span className="hidden sm:inline text-[11px] md:text-body-md">Add</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Cloves */}
              <div className="product-card bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden flex flex-col">
                <div className="h-36 md:h-44 bg-gradient-to-br from-primary-container/60 to-primary/10 relative overflow-hidden p-3 md:p-5 flex items-end">
                  <div className="absolute inset-0 flex items-center justify-center"><div className="w-16 md:w-20 h-16 md:h-20 rounded-full bg-white/10"></div></div>
                  <div className="relative z-10 bg-surface/90 backdrop-blur rounded-xl px-2 py-1.5 md:px-3 md:py-2 border border-white/50 shadow">
                    <span className="material-symbols-outlined text-primary text-[18px] md:text-[22px]">local_florist</span>
                  </div>
                </div>
                <div className="p-3 md:p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-1 mb-0.5"><span className="text-primary text-[11px] md:text-[13px]">★★★★★</span><span className="text-[9px] md:text-[11px] text-on-surface-variant">(142)</span></div>
                  <h4 className="font-headline-md text-[13px] md:text-headline-md text-on-surface mb-0.5">Whole Cloves</h4>
                  <p className="text-[10px] md:text-body-md text-on-surface-variant mb-2 md:mb-3">50g • Zanzibar Grade</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-[17px] md:text-[22px] text-on-surface">৳299</span>
                    <button className="bg-primary text-on-primary text-[10px] md:text-body-md font-medium px-2.5 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] md:text-[16px]">add_shopping_cart</span>
                      <span className="hidden sm:inline text-[11px] md:text-body-md">Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── PRODUCT SECTION B: DRY FRUITS & NUTS ─── */}
      {!isSearchActive && (
        <section className="py-12 md:py-section-gap px-6 md:px-container-padding bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 md:mb-12 gap-3">
              <div>
                <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest mb-2 block">DRY FRUITS & NUTS</span>
                <h2 className="font-display-xl text-[28px] md:text-[48px] leading-tight text-on-surface">Premium Picks, Every Time</h2>
              </div>
              <Link href="/products" className="inline-flex items-center gap-1.5 text-primary font-body-md text-[13px] md:text-body-md font-medium hover:underline underline-offset-4 shrink-0">
                View All <span className="material-symbols-outlined text-[18px] md:text-[20px]">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
              {/* Premium Almonds */}
              <div className="product-card bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden flex flex-col">
                <div className="h-36 md:h-52 bg-gradient-to-br from-surface-container-high to-primary-fixed/50 relative overflow-hidden p-3 md:p-5 flex items-end">
                  <div className="absolute inset-0 flex items-center justify-center"><div className="w-16 md:w-24 h-12 md:h-16 rounded-2xl bg-outline/15"></div></div>
                  <div className="relative z-10 bg-surface/90 backdrop-blur rounded-xl px-2 py-1.5 md:px-3 md:py-2 border border-white/50 shadow">
                    <span className="material-symbols-outlined text-outline text-[18px] md:text-[22px]">nutrition</span>
                  </div>
                </div>
                <div className="p-3 md:p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-1 mb-0.5"><span className="text-primary text-[11px] md:text-[13px]">★★★★★</span><span className="text-[9px] md:text-[11px] text-on-surface-variant">(312)</span></div>
                  <h4 className="font-headline-md text-[13px] md:text-headline-md text-on-surface mb-0.5">Premium Almonds</h4>
                  <p className="text-[10px] md:text-body-md text-on-surface-variant mb-2 md:mb-3">500g • California Grade A</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-[17px] md:text-[22px] text-on-surface">৳649</span>
                    <button className="bg-primary text-on-primary text-[10px] md:text-body-md font-medium px-2.5 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] md:text-[16px]">add_shopping_cart</span>
                      <span className="hidden sm:inline text-[11px] md:text-body-md">Add</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Cashew W240 */}
              <div className="product-card bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden flex flex-col">
                <div className="h-36 md:h-52 bg-gradient-to-br from-primary-container to-tertiary-fixed/40 relative overflow-hidden p-3 md:p-5 flex items-end">
                  <div className="absolute top-2.5 left-2.5 bg-on-surface text-surface text-[8px] md:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Bestseller</div>
                  <div className="absolute inset-0 flex items-center justify-center"><div className="w-16 md:w-24 h-16 md:h-24 rounded-full bg-white/10"></div></div>
                  <div className="relative z-10 bg-surface/90 backdrop-blur rounded-xl px-2 py-1.5 md:px-3 md:py-2 border border-white/50 shadow">
                    <span className="material-symbols-outlined text-primary text-[18px] md:text-[22px]">nutrition</span>
                  </div>
                </div>
                <div className="p-3 md:p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-1 mb-0.5"><span className="text-primary text-[11px] md:text-[13px]">★★★★★</span><span className="text-[9px] md:text-[11px] text-on-surface-variant">(201)</span></div>
                  <h4 className="font-headline-md text-[13px] md:text-headline-md text-on-surface mb-0.5">Cashew Nuts W240</h4>
                  <p className="text-[10px] md:text-body-md text-on-surface-variant mb-2 md:mb-3">500g • Premium Grade</p>
                  <p className="text-[9px] md:text-[11px] text-error font-medium mb-1">Out of stock</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-[17px] md:text-[22px] text-on-surface">৳899</span>
                    <button disabled className="bg-primary text-on-primary text-[10px] md:text-body-md font-medium px-2.5 md:px-4 py-1.5 md:py-2 rounded-full flex items-center gap-1 opacity-40 cursor-not-allowed">
                      <span className="material-symbols-outlined text-[13px] md:text-[16px]">add_shopping_cart</span>
                      <span className="hidden sm:inline text-[11px] md:text-body-md">Add</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Mixed Dry Fruits */}
              <div className="product-card bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden flex flex-col">
                <div className="h-36 md:h-52 bg-gradient-to-br from-primary-fixed to-inverse-primary/40 relative overflow-hidden p-3 md:p-5 flex items-end">
                  <div className="absolute top-2.5 left-2.5 bg-error text-on-error text-[8px] md:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">20% OFF</div>
                  <div className="absolute inset-0 flex items-center justify-center"><div className="w-16 md:w-24 h-16 md:h-24 rounded-full bg-white/10"></div></div>
                  <div className="relative z-10 bg-surface/90 backdrop-blur rounded-xl px-2 py-1.5 md:px-3 md:py-2 border border-white/50 shadow">
                    <span className="material-symbols-outlined text-primary text-[18px] md:text-[22px]">shopping_basket</span>
                  </div>
                </div>
                <div className="p-3 md:p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-1 mb-0.5"><span className="text-primary text-[11px] md:text-[13px]">★★★★☆</span><span className="text-[9px] md:text-[11px] text-on-surface-variant">(193)</span></div>
                  <h4 className="font-headline-md text-[13px] md:text-headline-md text-on-surface mb-0.5">Mixed Dry Fruits</h4>
                  <p className="text-[10px] md:text-body-md text-on-surface-variant mb-2 md:mb-3">250g • Premium Selection</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold text-[17px] md:text-[22px] text-on-surface">৳719</span>
                      <span className="text-[10px] md:text-[12px] text-on-surface-variant line-through">৳899</span>
                    </div>
                    <button className="bg-primary text-on-primary text-[10px] md:text-body-md font-medium px-2.5 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] md:text-[16px]">add_shopping_cart</span>
                      <span className="hidden sm:inline text-[11px] md:text-body-md">Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── PRODUCT SECTION C: DALS & READY MIXES ─── */}
      {!isSearchActive && (
        <section className="py-12 md:py-section-gap px-6 md:px-container-padding bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 md:mb-12 gap-3">
              <div>
                <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest mb-2 block">DALS, PULSES & READY MIXES</span>
                <h2 className="font-display-xl text-[28px] md:text-[48px] leading-tight text-on-surface">Kitchen Essentials, Sorted</h2>
              </div>
              <Link href="/products" className="inline-flex items-center gap-1.5 text-primary font-body-md text-[13px] md:text-body-md font-medium hover:underline underline-offset-4 shrink-0">
                View All <span className="material-symbols-outlined text-[18px] md:text-[20px]">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {/* Yellow Moong */}
              <div className="product-card bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden flex flex-col">
                <div className="h-36 md:h-44 bg-gradient-to-br from-secondary-fixed to-secondary-fixed-dim/50 relative overflow-hidden p-3 md:p-5 flex items-end">
                  <div className="absolute inset-0 flex items-center justify-center"><div className="w-16 md:w-20 h-16 md:h-20 rounded-full bg-white/10"></div></div>
                  <div className="relative z-10 bg-surface/90 backdrop-blur rounded-xl px-2 py-1.5 md:px-3 md:py-2 border border-white/50 shadow">
                    <span className="material-symbols-outlined text-on-surface text-[18px] md:text-[22px]">set_meal</span>
                  </div>
                </div>
                <div className="p-3 md:p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-1 mb-0.5"><span className="text-primary text-[11px] md:text-[13px]">★★★★★</span><span className="text-[9px] md:text-[11px] text-on-surface-variant">(541)</span></div>
                  <h4 className="font-headline-md text-[13px] md:text-headline-md text-on-surface mb-0.5">Yellow Moong Dal</h4>
                  <p className="text-[10px] md:text-body-md text-on-surface-variant mb-2 md:mb-3">1kg • Premium Washed</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold text-[17px] md:text-[22px] text-on-surface">৳149</span>
                      <span className="text-[10px] md:text-[12px] text-on-surface-variant line-through">৳185</span>
                    </div>
                    <button className="bg-primary text-on-primary text-[10px] md:text-body-md font-medium px-2.5 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] md:text-[16px]">add_shopping_cart</span>
                      <span className="hidden sm:inline text-[11px] md:text-body-md">Add</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Red Lentil */}
              <div className="product-card bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden flex flex-col">
                <div className="h-36 md:h-44 bg-gradient-to-br from-surface-container-high to-primary-fixed/30 relative overflow-hidden p-3 md:p-5 flex items-end">
                  <div className="absolute inset-0 flex items-center justify-center"><div className="w-16 md:w-20 h-16 md:h-20 rounded-full bg-white/10"></div></div>
                  <div className="relative z-10 bg-surface/90 backdrop-blur rounded-xl px-2 py-1.5 md:px-3 md:py-2 border border-white/50 shadow">
                    <span className="material-symbols-outlined text-on-surface text-[18px] md:text-[22px]">grain</span>
                  </div>
                </div>
                <div className="p-3 md:p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-1 mb-0.5"><span className="text-primary text-[11px] md:text-[13px]">★★★★☆</span><span className="text-[9px] md:text-[11px] text-on-surface-variant">(278)</span></div>
                  <h4 className="font-headline-md text-[13px] md:text-headline-md text-on-surface mb-0.5">Red Lentil (Masoor)</h4>
                  <p className="text-[10px] md:text-body-md text-on-surface-variant mb-2 md:mb-3">1kg • Premium Whole</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-[17px] md:text-[22px] text-on-surface">৳119</span>
                    <button className="bg-primary text-on-primary text-[10px] md:text-body-md font-medium px-2.5 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] md:text-[16px]">add_shopping_cart</span>
                      <span className="hidden sm:inline text-[11px] md:text-body-md">Add</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Biryani Spice Mix */}
              <div className="product-card bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden flex flex-col">
                <div className="h-36 md:h-44 bg-gradient-to-br from-secondary-fixed to-secondary-container relative overflow-hidden p-3 md:p-5 flex items-end">
                  <div className="absolute top-2.5 right-2.5 bg-primary text-on-primary text-[8px] md:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">New</div>
                  <div className="absolute inset-0 flex items-center justify-center"><div className="w-16 md:w-20 h-16 md:h-20 rounded-full bg-white/10"></div></div>
                  <div className="relative z-10 bg-surface/90 backdrop-blur rounded-xl px-2 py-1.5 md:px-3 md:py-2 border border-white/50 shadow">
                    <span className="material-symbols-outlined text-secondary text-[18px] md:text-[22px]">skillet</span>
                  </div>
                </div>
                <div className="p-3 md:p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-1 mb-0.5"><span className="text-primary text-[11px] md:text-[13px]">★★★★☆</span><span className="text-[9px] md:text-[11px] text-on-surface-variant">(155)</span></div>
                  <h4 className="font-headline-md text-[13px] md:text-headline-md text-on-surface mb-0.5">Biryani Spice Mix</h4>
                  <p className="text-[10px] md:text-body-md text-on-surface-variant mb-2 md:mb-3">75g • Restaurant Pack</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-[17px] md:text-[22px] text-on-surface">৳179</span>
                    <button className="bg-primary text-on-primary text-[10px] md:text-body-md font-medium px-2.5 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] md:text-[16px]">add_shopping_cart</span>
                      <span className="hidden sm:inline text-[11px] md:text-body-md">Add</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Chana Dal */}
              <div className="product-card bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden flex flex-col">
                <div className="h-36 md:h-44 bg-gradient-to-br from-primary-container/50 to-secondary-fixed/40 relative overflow-hidden p-3 md:p-5 flex items-end">
                  <div className="absolute inset-0 flex items-center justify-center"><div className="w-16 md:w-20 h-16 md:h-20 rounded-full bg-white/10"></div></div>
                  <div className="relative z-10 bg-surface/90 backdrop-blur rounded-xl px-2 py-1.5 md:px-3 md:py-2 border border-white/50 shadow">
                    <span className="material-symbols-outlined text-primary text-[18px] md:text-[22px]">eco</span>
                  </div>
                </div>
                <div className="p-3 md:p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-1 mb-0.5"><span className="text-primary text-[11px] md:text-[13px]">★★★★★</span><span className="text-[9px] md:text-[11px] text-on-surface-variant">(398)</span></div>
                  <h4 className="font-headline-md text-[13px] md:text-headline-md text-on-surface mb-0.5">Chana Dal Split</h4>
                  <p className="text-[10px] md:text-body-md text-on-surface-variant mb-2 md:mb-3">1kg • Double Washed</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-[17px] md:text-[22px] text-on-surface">৳139</span>
                    <button className="bg-primary text-on-primary text-[10px] md:text-body-md font-medium px-2.5 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] md:text-[16px]">add_shopping_cart</span>
                      <span className="hidden sm:inline text-[11px] md:text-body-md">Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── SECTION 8: CATEGORY SHOWCASE ─── */}
      <section className="py-12 md:py-section-gap bg-surface relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(#ff8a65 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            opacity: 0.07,
          }}
        ></div>
        <div className="max-w-7xl mx-auto px-6 md:px-container-padding flex flex-col items-center justify-center mb-8 md:mb-16 relative z-10">
          <div className="flex items-center gap-3 md:gap-4 bg-surface-container-high rounded-full px-4 md:px-6 py-2 md:py-3 border border-outline-variant/50 shadow-sm">
            <span className="font-body-lg text-[13px] md:text-body-lg text-on-surface">Browse</span>
            <span className="material-symbols-outlined text-primary text-[18px] md:text-[24px]">
              arrow_forward
            </span>
            <span className="font-body-lg text-[13px] md:text-body-lg text-on-surface font-medium">
              Add to Cart
            </span>
            <span className="material-symbols-outlined text-primary text-[18px] md:text-[24px]">
              arrow_forward
            </span>
            <span className="font-body-lg text-[13px] md:text-body-lg text-on-surface font-medium">
              Fresh Delivered
            </span>
          </div>
        </div>
        <div className="w-full flex gap-4 md:gap-6 overflow-x-auto px-6 md:px-8 pb-8 md:pb-12 snap-x snap-mandatory hide-scrollbar relative z-10">
          {/* Card 1: Whole Spices */}
          <div className="snap-center shrink-0 w-[260px] md:w-[400px] h-[360px] md:h-[500px] bg-surface rounded-3xl border border-outline-variant/40 shadow-lg flex flex-col overflow-hidden group">
            <div className="h-2/3 bg-primary-container relative overflow-hidden p-4 md:p-6">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="relative z-10 h-full bg-white/90 backdrop-blur rounded-xl border border-white/50 shadow-md p-3 md:p-4">
                <div className="h-2.5 w-16 md:w-24 bg-surface-variant rounded mb-3 md:mb-6"></div>
                <div className="grid grid-cols-3 gap-1.5 md:gap-2 mb-2 md:mb-4">
                  <div className="h-10 md:h-16 bg-primary/10 rounded flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[18px] md:text-[22px]">
                      local_fire_department
                    </span>
                  </div>
                  <div className="h-10 md:h-16 bg-primary/10 rounded flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[18px] md:text-[22px]">
                      grass
                    </span>
                  </div>
                  <div className="h-10 md:h-16 bg-primary/10 rounded flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[18px] md:text-[22px]">
                      water_drop
                    </span>
                  </div>
                </div>
                <div className="h-6 md:h-8 bg-surface-variant rounded"></div>
              </div>
            </div>
            <div className="p-4 md:p-6 h-1/3 bg-surface flex flex-col justify-center">
              <h4 className="font-headline-md text-[15px] md:text-headline-md text-on-surface mb-1 md:mb-2">
                Whole Spices
              </h4>
              <p className="font-body-md text-[11px] md:text-body-md text-on-surface-variant">
                Cardamom, cloves, cumin, cinnamon & more.
              </p>
            </div>
          </div>

          {/* Card 2: Ground Masalas */}
          <div className="snap-center shrink-0 w-[260px] md:w-[400px] h-[360px] md:h-[500px] bg-surface rounded-3xl border border-outline-variant/40 shadow-lg flex flex-col overflow-hidden group">
            <div className="h-2/3 bg-secondary-container relative overflow-hidden p-4 md:p-6">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="relative z-10 h-full bg-white/90 backdrop-blur rounded-xl border border-white/50 shadow-md p-3 md:p-4 flex flex-col">
                <div className="h-4 w-full bg-surface-variant rounded mb-2 md:mb-4"></div>
                <div className="flex-1 border-t border-b border-surface-variant flex flex-col gap-1.5 md:gap-2 py-1.5 md:py-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[12px] md:text-[16px]">
                      soup_kitchen
                    </span>
                    <div className="h-3 md:h-4 bg-surface-variant/50 rounded flex-1"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[12px] md:text-[16px]">
                      rice_bowl
                    </span>
                    <div className="h-3 md:h-4 bg-surface-variant/50 rounded w-5/6"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[12px] md:text-[16px]">
                      skillet
                    </span>
                    <div className="h-3 md:h-4 bg-surface-variant/50 rounded w-full"></div>
                  </div>
                </div>
                <div className="h-6 md:h-8 w-16 md:w-24 bg-secondary mt-auto rounded-full self-end"></div>
              </div>
            </div>
            <div className="p-4 md:p-6 h-1/3 bg-surface flex flex-col justify-center">
              <h4 className="font-headline-md text-[15px] md:text-headline-md text-on-surface mb-1 md:mb-2">
                Ground Masalas
              </h4>
              <p className="font-body-md text-[11px] md:text-body-md text-on-surface-variant">
                Garam masala, biryani blend, curry powder & more.
              </p>
            </div>
          </div>

          {/* Card 3: Dry Fruits & Nuts */}
          <div className="snap-center shrink-0 w-[260px] md:w-[400px] h-[360px] md:h-[500px] bg-surface rounded-3xl border border-outline-variant/40 shadow-lg flex flex-col overflow-hidden group">
            <div className="h-2/3 bg-primary-fixed relative overflow-hidden p-4 md:p-6">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="relative z-10 h-full bg-white/90 backdrop-blur rounded-xl border border-white/50 shadow-md p-3 md:p-4">
                <div className="grid grid-cols-3 gap-1.5 md:gap-2 h-full">
                  <div className="rounded-lg bg-surface-variant/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant text-[16px] md:text-[22px]">
                      nutrition
                    </span>
                  </div>
                  <div className="rounded-lg bg-surface-variant/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant text-[16px] md:text-[22px]">
                      eco
                    </span>
                  </div>
                  <div className="rounded-lg bg-surface-variant/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant text-[16px] md:text-[22px]">
                      grain
                    </span>
                  </div>
                  <div className="rounded-lg bg-surface-variant/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant text-[16px] md:text-[22px]">
                      local_florist
                    </span>
                  </div>
                  <div className="rounded-lg bg-surface-variant/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant text-[16px] md:text-[22px]">
                      spa
                    </span>
                  </div>
                  <div className="rounded-lg bg-surface-variant/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant text-[16px] md:text-[22px]">
                      local_dining
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 md:p-6 h-1/3 bg-surface flex flex-col justify-center">
              <h4 className="font-headline-md text-[15px] md:text-headline-md text-on-surface mb-1 md:mb-2">
                Dry Fruits & Nuts
              </h4>
              <p className="font-body-md text-[11px] md:text-body-md text-on-surface-variant">
                Almonds, cashews, raisins, pistachios & more.
              </p>
            </div>
          </div>

          {/* Card 4: Dals & Pulses */}
          <div className="snap-center shrink-0 w-[260px] md:w-[400px] h-[360px] md:h-[500px] bg-surface rounded-3xl border border-outline-variant/40 shadow-lg flex flex-col overflow-hidden group">
            <div className="h-2/3 bg-surface-container-high relative overflow-hidden p-4 md:p-6">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="relative z-10 h-full bg-white/90 backdrop-blur rounded-xl border border-white/50 shadow-md p-3 md:p-4 space-y-2 md:space-y-3">
                <div className="flex items-center gap-2 p-1.5 md:p-2 bg-secondary-fixed/30 rounded-lg">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-secondary-fixed shrink-0"></div>
                  <div className="h-2.5 md:h-3 bg-surface-variant rounded flex-1"></div>
                  <div className="h-2.5 md:h-3 w-10 md:w-12 bg-secondary/20 rounded"></div>
                </div>
                <div className="flex items-center gap-2 p-1.5 md:p-2 bg-primary-fixed/30 rounded-lg">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary-fixed shrink-0"></div>
                  <div className="h-2.5 md:h-3 bg-surface-variant rounded flex-1"></div>
                  <div className="h-2.5 md:h-3 w-10 md:w-12 bg-primary/20 rounded"></div>
                </div>
                <div className="flex items-center gap-2 p-1.5 md:p-2 bg-tertiary-fixed/30 rounded-lg">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-tertiary-fixed shrink-0"></div>
                  <div className="h-2.5 md:h-3 bg-surface-variant rounded flex-1"></div>
                  <div className="h-2.5 md:h-3 w-10 md:w-12 bg-tertiary/20 rounded"></div>
                </div>
              </div>
            </div>
            <div className="p-4 md:p-6 h-1/3 bg-surface flex flex-col justify-center">
              <h4 className="font-headline-md text-[15px] md:text-headline-md text-on-surface mb-1 md:mb-2">
                Dals & Pulses
              </h4>
              <p className="font-body-md text-[11px] md:text-body-md text-on-surface-variant">
                Moong, masoor, chana, toor dal & more.
              </p>
            </div>
          </div>

          {/* Card 5: Ready Mixes */}
          <div className="snap-center shrink-0 w-[260px] md:w-[400px] h-[360px] md:h-[500px] bg-surface rounded-3xl border border-outline-variant/40 shadow-lg flex flex-col overflow-hidden group">
            <div className="h-2/3 bg-surface-container relative overflow-hidden p-4 md:p-6">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="relative z-10 h-full bg-white/90 backdrop-blur rounded-xl border border-white/50 shadow-md p-3 md:p-4">
                <div className="h-3 md:h-4 w-16 md:w-20 bg-surface-variant rounded mb-2 md:mb-4"></div>
                <div className="h-14 md:h-24 bg-gradient-to-br from-primary-container/30 to-secondary-container/30 rounded-lg mb-2 md:mb-3 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[28px] md:text-[40px]">
                    skillet
                  </span>
                </div>
                <div className="flex gap-1.5 md:gap-2">
                  <div className="h-3 md:h-6 flex-1 bg-surface-variant/50 rounded"></div>
                  <div className="h-3 md:h-6 w-12 md:w-16 bg-primary/20 rounded"></div>
                </div>
              </div>
            </div>
            <div className="p-4 md:p-6 h-1/3 bg-surface flex flex-col justify-center">
              <h4 className="font-headline-md text-[15px] md:text-headline-md text-on-surface mb-1 md:mb-2">
                Ready Spice Mixes
              </h4>
              <p className="font-body-md text-[11px] md:text-body-md text-on-surface-variant">
                Pre-measured blends for your favourite dishes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: FARM SOURCING ─── */}
      <section className="py-12 md:py-section-gap px-6 md:px-container-padding relative">
        <div className="absolute inset-0 bg-gradient-to-br from-tertiary-fixed-dim/20 to-inverse-primary/20 -z-10"></div>
        <div className="max-w-[1120px] mx-auto bg-surface/80 backdrop-blur-2xl rounded-[32px] border border-outline-variant/30 shadow-[0_32px_64px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row min-h-[auto] md:min-h-[595px]">
          <div className="p-8 md:p-card-internal flex-1 flex flex-col justify-center">
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-4 md:mb-6 tracking-widest">
              01 / 03
            </span>
            <h3 className="font-headline-lg text-[26px] md:text-headline-lg text-on-surface mb-4 md:mb-6">
              Farm-to-Kitchen Freshness
            </h3>
            <p className="font-body-lg text-[14px] md:text-body-lg text-on-surface-variant mb-8 md:mb-10 max-w-md">
              Every batch is sourced directly from certified farms across India, Bangladesh, and
              Sri Lanka. We cut out middlemen so you get the freshest, most potent spices — at the
              best prices.
            </p>
            <Link
              className="inline-flex items-center gap-2 bg-on-surface text-surface font-body-md text-[13px] md:text-body-md font-medium px-6 md:px-8 py-3 md:py-4 rounded-full w-fit hover:bg-on-surface/90 transition-colors"
              href="#"
            >
              Our Sourcing Story
            </Link>
          </div>
          <div className="flex-1 bg-surface-variant/50 relative overflow-hidden flex items-center justify-end border-t md:border-t-0 md:border-l border-outline-variant/20">
            <div className="w-full h-full p-5 md:p-8 flex flex-col gap-4">
              <div className="bg-surface rounded-2xl p-4 md:p-5 shadow-lg border border-outline-variant/20 flex-1">
                <div className="flex items-center gap-3 mb-4 border-b border-outline-variant/20 pb-3 md:pb-4">
                  <span className="material-symbols-outlined text-primary text-[20px] md:text-[24px]">
                    location_on
                  </span>
                  <span className="font-headline-md text-[15px] md:text-headline-md text-on-surface">
                    Sourcing Regions
                  </span>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center justify-between p-2 md:p-3 bg-primary/5 rounded-xl border border-primary/10">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0"></div>
                      <span className="text-[12px] md:text-body-md text-on-surface font-medium">
                        Kerala, India
                      </span>
                    </div>
                    <span className="text-[11px] md:text-body-md text-on-surface-variant">
                      Cardamom, Pepper
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 md:p-3 bg-secondary/5 rounded-xl border border-secondary/10">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0"></div>
                      <span className="text-[12px] md:text-body-md text-on-surface font-medium">
                        Rajasthan, India
                      </span>
                    </div>
                    <span className="text-[11px] md:text-body-md text-on-surface-variant">
                      Cumin, Coriander
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 md:p-3 bg-tertiary/5 rounded-xl border border-tertiary/10">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-tertiary shrink-0"></div>
                      <span className="text-[12px] md:text-body-md text-on-surface font-medium">
                        Sri Lanka
                      </span>
                    </div>
                    <span className="text-[11px] md:text-body-md text-on-surface-variant">
                      Cinnamon, Cloves
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 md:p-3 bg-surface-variant/50 rounded-xl border border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-outline shrink-0"></div>
                      <span className="text-[12px] md:text-body-md text-on-surface font-medium">
                        Bangladesh
                      </span>
                    </div>
                    <span className="text-[11px] md:text-body-md text-on-surface-variant">
                      Turmeric, Mustard
                    </span>
                  </div>
                </div>
                <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-outline-variant/20 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px] md:text-[20px]">
                    verified
                  </span>
                  <span className="text-[11px] md:text-body-md text-on-surface-variant">
                    All farms are certified & audited annually
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: QUALITY TESTING ─── */}
      <section className="py-12 md:py-section-gap px-6 md:px-container-padding relative">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-container-highest to-secondary-fixed/20 -z-10"></div>
        <div className="max-w-[1120px] mx-auto bg-surface/80 backdrop-blur-2xl rounded-[32px] border border-outline-variant/30 shadow-[0_32px_64px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row min-h-[auto] md:min-h-[595px]">
          <div className="p-8 md:p-card-internal flex-1 flex flex-col justify-center">
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-4 md:mb-6 tracking-widest">
              02 / 03
            </span>
            <h3 className="font-headline-lg text-[26px] md:text-headline-lg text-on-surface mb-4 md:mb-6">
              Purity Tested,
              <br />
              Always Guaranteed
            </h3>
            <p className="font-body-lg text-[14px] md:text-body-lg text-on-surface-variant mb-6 md:mb-10 max-w-md">
              Every product undergoes rigorous lab testing for contaminants, moisture, and
              adulterants before it reaches you. BSTI certified, no artificial colours or additives
              — ever.
            </p>
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 bg-secondary-container/30 rounded-full px-3 md:px-4 py-1.5 md:py-2">
                <span className="material-symbols-outlined text-secondary text-[16px] md:text-[20px]">
                  verified
                </span>
                <span className="text-[11px] md:text-body-md text-on-surface">BSTI Certified</span>
              </div>
              <div className="flex items-center gap-1.5 bg-secondary-container/30 rounded-full px-3 md:px-4 py-1.5 md:py-2">
                <span className="material-symbols-outlined text-secondary text-[16px] md:text-[20px]">
                  science
                </span>
                <span className="text-[11px] md:text-body-md text-on-surface">Lab Tested</span>
              </div>
              <div className="flex items-center gap-1.5 bg-secondary-container/30 rounded-full px-3 md:px-4 py-1.5 md:py-2">
                <span className="material-symbols-outlined text-secondary text-[16px] md:text-[20px]">
                  eco
                </span>
                <span className="text-[11px] md:text-body-md text-on-surface">No Additives</span>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-gradient-to-br from-primary-container/80 to-primary relative overflow-hidden flex items-center justify-center min-h-[280px] md:min-h-0">
            <div className="w-[85%] bg-surface rounded-2xl shadow-xl p-4 md:p-6 relative">
              <div className="flex items-center gap-2 mb-4 md:mb-6 border-b border-outline-variant/30 pb-3 md:pb-4">
                <span className="material-symbols-outlined text-primary text-[20px] md:text-[24px]">
                  science
                </span>
                <span className="font-headline-md text-[14px] md:text-headline-md text-on-surface">
                  Quality Report
                </span>
                <span className="ml-auto text-[11px] md:text-body-md text-secondary font-semibold">
                  ✓ All Passed
                </span>
              </div>
              <div className="space-y-3 md:space-y-4 font-body-md">
                <div className="flex items-start gap-2 md:gap-3">
                  <span className="material-symbols-outlined text-secondary text-[16px] md:text-[20px] mt-0.5">
                    check_circle
                  </span>
                  <div className="flex-1">
                    <span className="text-[12px] md:text-body-md text-on-surface font-medium">
                      Moisture Content
                    </span>
                    <div className="h-1.5 bg-surface-variant rounded-full mt-1.5 w-full">
                      <div className="h-1.5 bg-secondary rounded-full w-[82%]"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 md:gap-3">
                  <span className="material-symbols-outlined text-secondary text-[16px] md:text-[20px] mt-0.5">
                    check_circle
                  </span>
                  <div className="flex-1">
                    <span className="text-[12px] md:text-body-md text-on-surface font-medium">
                      Contamination Free
                    </span>
                    <div className="h-1.5 bg-surface-variant rounded-full mt-1.5 w-full">
                      <div className="h-1.5 bg-secondary rounded-full w-[100%]"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 md:gap-3">
                  <span className="material-symbols-outlined text-secondary text-[16px] md:text-[20px] mt-0.5">
                    check_circle
                  </span>
                  <div className="flex-1">
                    <span className="text-[12px] md:text-body-md text-on-surface font-medium">
                      Colour Additives
                    </span>
                    <div className="h-1.5 bg-surface-variant rounded-full mt-1.5 w-full">
                      <div className="h-1.5 bg-secondary rounded-full w-[100%]"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 md:gap-3">
                  <span className="material-symbols-outlined text-primary text-[16px] md:text-[20px] mt-0.5">
                    check_circle
                  </span>
                  <div className="flex-1">
                    <span className="text-[12px] md:text-body-md text-on-surface font-medium">
                      Aroma & Potency
                    </span>
                    <div className="h-1.5 bg-surface-variant rounded-full mt-1.5 w-full">
                      <div className="h-1.5 bg-primary rounded-full w-[94%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: FAST DELIVERY ─── */}
      <section className="py-12 md:py-section-gap px-6 md:px-container-padding relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed/30 to-tertiary-fixed/20 -z-10"></div>
        <div className="max-w-[1120px] mx-auto bg-surface/80 backdrop-blur-2xl rounded-[32px] border border-outline-variant/30 shadow-[0_32px_64px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row-reverse min-h-[auto] md:min-h-[595px]">
          <div className="p-8 md:p-card-internal flex-1 flex flex-col justify-center">
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-4 md:mb-6 tracking-widest">
              03 / 03
            </span>
            <h3 className="font-headline-lg text-[26px] md:text-headline-lg text-on-surface mb-4 md:mb-6">
              Order Today,
              <br />
              Arrives Tomorrow
            </h3>
            <p className="font-body-lg text-[14px] md:text-body-lg text-on-surface-variant mb-8 md:mb-10 max-w-md">
              Same-day dispatch on all orders before 2 PM. Airtight, moisture-proof packaging keeps
              spices fresh in transit. Track your order in real time from warehouse to doorstep.
            </p>
            <Link
              className="inline-flex items-center gap-2 bg-on-surface text-surface font-body-md text-[13px] md:text-body-md font-medium px-6 md:px-8 py-3 md:py-4 rounded-full w-fit hover:bg-on-surface/90 transition-colors"
              href="#"
            >
              Track My Order
            </Link>
          </div>
          <div className="flex-1 bg-surface-variant/50 relative overflow-hidden flex items-center justify-center border-t md:border-t-0 md:border-r border-outline-variant/20 min-h-[260px] md:min-h-0">
            <div className="w-[85%] bg-surface rounded-2xl shadow-lg p-4 md:p-5">
              <div className="flex items-center gap-2 mb-4 border-b border-outline-variant/20 pb-3">
                <span className="material-symbols-outlined text-primary text-[20px] md:text-[24px]">
                  local_shipping
                </span>
                <span className="font-headline-md text-[14px] md:text-headline-md text-on-surface">
                  Live Order Tracking
                </span>
              </div>
              <div className="relative pl-6 md:pl-8">
                <div className="absolute left-2 md:left-3 top-0 bottom-0 w-0.5 bg-outline-variant/30"></div>
                <div className="space-y-3 md:space-y-5">
                  <div className="relative">
                    <div className="absolute -left-4 md:-left-5 w-2.5 h-2.5 rounded-full bg-secondary mt-1"></div>
                    <p className="text-[12px] md:text-body-md font-semibold text-on-surface">
                      Order Confirmed
                    </p>
                    <p className="text-[11px] md:text-body-md text-on-surface-variant">
                      Today, 10:32 AM
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-4 md:-left-5 w-2.5 h-2.5 rounded-full bg-secondary mt-1"></div>
                    <p className="text-[12px] md:text-body-md font-semibold text-on-surface">
                      Packed & Dispatched
                    </p>
                    <p className="text-[11px] md:text-body-md text-on-surface-variant">
                      Today, 1:15 PM
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-4 md:-left-5 w-2.5 h-2.5 rounded-full bg-primary mt-1 animate-pulse"></div>
                    <p className="text-[12px] md:text-body-md font-semibold text-primary">
                      Out for Delivery
                    </p>
                    <p className="text-[11px] md:text-body-md text-on-surface-variant">
                      Today, 4:00 PM (est.)
                    </p>
                  </div>
                  <div className="relative opacity-35">
                    <div className="absolute -left-4 md:-left-5 w-2.5 h-2.5 rounded-full bg-outline mt-1"></div>
                    <p className="text-[12px] md:text-body-md font-semibold text-on-surface">
                      Delivered
                    </p>
                    <p className="text-[11px] md:text-body-md text-on-surface-variant">Pending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: TRUST BADGES ─── */}
      <section className="py-8 md:py-14 px-6 md:px-container-padding bg-surface border-y border-outline-variant/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            <div className="flex flex-col items-center text-center gap-2 md:gap-3 p-4 md:p-6 rounded-[20px] md:rounded-[24px] bg-surface-container-low">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-[20px] md:text-[28px]">
                  verified
                </span>
              </div>
              <h4 className="font-headline-md text-[13px] md:text-headline-md text-on-surface">
                BSTI Certified
              </h4>
              <p className="font-body-md text-[10px] md:text-body-md text-on-surface-variant leading-snug">
                Approved by Bangladesh Standards & Testing Institution
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-2 md:gap-3 p-4 md:p-6 rounded-[20px] md:rounded-[24px] bg-surface-container-low">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-primary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[20px] md:text-[28px]">
                  eco
                </span>
              </div>
              <h4 className="font-headline-md text-[13px] md:text-headline-md text-on-surface">
                100% Natural
              </h4>
              <p className="font-body-md text-[10px] md:text-body-md text-on-surface-variant leading-snug">
                No artificial colours, flavours, or preservatives
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-2 md:gap-3 p-4 md:p-6 rounded-[20px] md:rounded-[24px] bg-surface-container-low">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-tertiary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary text-[20px] md:text-[28px]">
                  science
                </span>
              </div>
              <h4 className="font-headline-md text-[13px] md:text-headline-md text-on-surface">
                Lab Tested
              </h4>
              <p className="font-body-md text-[10px] md:text-body-md text-on-surface-variant leading-snug">
                Every batch tested for purity, potency and contamination
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-2 md:gap-3 p-4 md:p-6 rounded-[20px] md:rounded-[24px] bg-surface-container-low">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-[20px] md:text-[28px]">
                  agriculture
                </span>
              </div>
              <h4 className="font-headline-md text-[13px] md:text-headline-md text-on-surface">
                Direct from Farms
              </h4>
              <p className="font-body-md text-[10px] md:text-body-md text-on-surface-variant leading-snug">
                No middlemen — freshest produce at the best price
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 9: MONTHLY SPICE BOX ─── */}
      <section className="py-12 md:py-section-gap px-6 md:px-container-padding bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
            {/* Info */}
            <div className="p-6 md:p-8 flex flex-col justify-center bg-surface-container-low rounded-[32px]">
              <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest mb-3 block">
                SUBSCRIPTION
              </span>
              <h2 className="font-display-xl text-[30px] md:text-[48px] leading-tight text-on-surface mb-3 md:mb-4">
                Your Monthly Spice Box.
              </h2>
              <p className="font-body-lg text-[13px] md:text-body-lg text-on-surface-variant">
                A curated selection of fresh spices and dry foods delivered to your door every
                month. Cancel anytime.
              </p>
            </div>
            {/* Essential */}
            <div className="p-6 md:p-8 bg-gradient-to-b from-tertiary-fixed to-secondary-fixed/40 rounded-[32px] border border-outline-variant/30 shadow-lg flex flex-col">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                Essential Box
              </h3>
              <div className="font-display-xl text-[40px] md:text-[56px] text-on-surface mb-4 md:mb-6">
                ৳499<span className="font-body-md text-body-md text-on-surface-variant">/mo</span>
              </div>
              <ul className="space-y-2.5 md:space-y-4 mb-6 md:mb-8 flex-1 font-body-md text-on-surface-variant">
                <li className="flex items-center gap-2.5 text-[12px] md:text-body-md">
                  <span className="material-symbols-outlined text-primary text-[18px] md:text-[22px]">
                    check
                  </span>{" "}
                  5 spice varieties (50g each)
                </li>
                <li className="flex items-center gap-2.5 text-[12px] md:text-body-md">
                  <span className="material-symbols-outlined text-primary text-[18px] md:text-[22px]">
                    check
                  </span>{" "}
                  1 dry fruit mix (100g)
                </li>
                <li className="flex items-center gap-2.5 text-[12px] md:text-body-md">
                  <span className="material-symbols-outlined text-primary text-[18px] md:text-[22px]">
                    check
                  </span>{" "}
                  Free delivery
                </li>
                <li className="flex items-center gap-2.5 text-[12px] md:text-body-md">
                  <span className="material-symbols-outlined text-primary text-[18px] md:text-[22px]">
                    check
                  </span>{" "}
                  Monthly recipe card
                </li>
              </ul>
              <button className="w-full bg-surface text-on-surface border border-outline-variant rounded-full py-3 md:py-4 font-body-md text-[13px] md:text-body-md hover:bg-surface-variant transition-colors">
                Subscribe Now
              </button>
            </div>
            {/* Premium */}
            <div className="p-6 md:p-8 bg-gradient-to-b from-primary-container/80 to-inverse-primary/80 rounded-[32px] border border-outline-variant/30 shadow-xl flex flex-col relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-on-surface text-surface text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Popular
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Premium Box</h3>
              <div className="font-display-xl text-[40px] md:text-[56px] text-on-surface mb-4 md:mb-6">
                ৳999<span className="font-body-md text-body-md text-on-surface-variant">/mo</span>
              </div>
              <ul className="space-y-2.5 md:space-y-4 mb-6 md:mb-8 flex-1 font-body-md text-on-surface-variant">
                <li className="flex items-center gap-2.5 text-[12px] md:text-body-md">
                  <span className="material-symbols-outlined text-on-surface text-[18px] md:text-[22px]">
                    check
                  </span>{" "}
                  12 spice varieties (100g each)
                </li>
                <li className="flex items-center gap-2.5 text-[12px] md:text-body-md">
                  <span className="material-symbols-outlined text-on-surface text-[18px] md:text-[22px]">
                    check
                  </span>{" "}
                  3 premium dry fruit selections
                </li>
                <li className="flex items-center gap-2.5 text-[12px] md:text-body-md">
                  <span className="material-symbols-outlined text-on-surface text-[18px] md:text-[22px]">
                    check
                  </span>{" "}
                  Exclusive blends not sold separately
                </li>
                <li className="flex items-center gap-2.5 text-[12px] md:text-body-md">
                  <span className="material-symbols-outlined text-on-surface text-[18px] md:text-[22px]">
                    check
                  </span>{" "}
                  Priority delivery + recipe booklet
                </li>
                <li className="flex items-center gap-2.5 text-[12px] md:text-body-md">
                  <span className="material-symbols-outlined text-on-surface text-[18px] md:text-[22px]">
                    check
                  </span>{" "}
                  10% off all individual orders
                </li>
              </ul>
              <button className="w-full bg-on-surface text-surface rounded-full py-3 md:py-4 font-body-md text-[13px] md:text-body-md hover:bg-on-surface/90 transition-colors shadow-md">
                Get Premium Box
              </button>
            </div>
          </div>
          {/* Wholesale */}
          <div className="mt-5 md:mt-8 bg-surface-container rounded-[24px] p-5 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between border border-outline-variant/30 gap-4">
            <div>
              <h4 className="font-headline-md text-headline-md text-on-surface mb-1.5">
                Restaurant or Caterer?
              </h4>
              <p className="font-body-md text-[13px] md:text-body-md text-on-surface-variant">
                Bulk ordering with custom packaging, a dedicated account manager, and wholesale
                pricing.
              </p>
            </div>
            <button className="shrink-0 bg-transparent text-primary border border-primary rounded-full px-6 md:px-8 py-2.5 md:py-3 font-body-md text-[13px] md:text-body-md hover:bg-primary/5 transition-colors">
              Contact Wholesale
            </button>
          </div>
        </div>
      </section>

      {/* ─── SECTION 10: CUSTOMER REVIEWS ─── */}
      <section className="py-12 md:py-section-gap bg-surface overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-container-padding">
          <div className="text-center mb-8 md:mb-12">
            <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest mb-2 block">
              REVIEWS
            </span>
            <h2 className="font-display-xl text-[28px] md:text-[56px] leading-tight text-on-surface">
              Trusted by Home Cooks
              <br className="hidden md:block" /> & Restaurants Alike
            </h2>
          </div>
        </div>
        <AutoScrollReviews />
        <div className="max-w-7xl mx-auto px-6 md:px-container-padding mt-8 md:mt-12">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            <div className="text-center p-4 md:p-6 bg-surface-container rounded-[20px] border border-outline-variant/20">
              <div className="font-display-xl text-[26px] md:text-[48px] font-bold text-primary mb-1">
                50K+
              </div>
              <p className="font-body-md text-[10px] md:text-body-md text-on-surface-variant">
                Happy Customers
              </p>
            </div>
            <div className="text-center p-4 md:p-6 bg-surface-container rounded-[20px] border border-outline-variant/20">
              <div className="font-display-xl text-[26px] md:text-[48px] font-bold text-primary mb-1">
                200+
              </div>
              <p className="font-body-md text-[10px] md:text-body-md text-on-surface-variant">
                Products
              </p>
            </div>
            <div className="text-center p-4 md:p-6 bg-surface-container rounded-[20px] border border-outline-variant/20">
              <div className="font-display-xl text-[26px] md:text-[48px] font-bold text-primary mb-1">
                4.9★
              </div>
              <p className="font-body-md text-[10px] md:text-body-md text-on-surface-variant">
                Average Rating
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 11: FAQ ─── */}
      <section className="py-12 md:py-section-gap px-6 md:px-container-padding bg-surface-container-low">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 md:gap-16">
          <div className="lg:w-1/3">
            <h2 className="font-display-xl text-[32px] md:text-[64px] leading-[1.1] text-on-surface lg:sticky lg:top-32">
              Frequently asked questions
            </h2>
          </div>
          <div className="lg:w-2/3 flex flex-col">
            <FAQItem
              question="What makes Khati Family spices different?"
              answer="Our spices are sourced directly from certified farms and tested in independent labs for purity and potency. No middlemen, no artificial additives — just the purest spices you can buy at honest prices."
            />
            <FAQItem
              question="How long do your spices stay fresh?"
              answer="Packed in airtight, moisture-proof bags at dispatch. Whole spices last 2–4 years, ground masalas 1–2 years when stored in a cool, dry place. Every pack is printed with an expiry date."
            />
            <FAQItem
              question="Do you offer bulk or wholesale orders?"
              answer="Yes! We serve restaurants, catering businesses, and bulk buyers. Minimum wholesale order is ৳5,000. Contact our team for custom pricing, packaging, and delivery schedules."
            />
            <FAQItem
              question="What are the delivery charges?"
              answer="Free delivery on all orders above ৳500 across Bangladesh. Below ৳500 is a flat ৳60 charge. Express same-day delivery is available in Dhaka for ৳100 extra."
            />
            <FAQItem
              question="Can I return or exchange a product?"
              answer="Yes — for damaged, defective, or incorrect products within 7 days of delivery. Contact us with a photo and we'll arrange a replacement or full refund promptly, no hassle."
            />
          </div>
        </div>
      </section>

      {/* ─── SECTION 12: FINAL CTA ─── */}
      <section className="py-12 md:py-section-gap px-6 md:px-container-padding bg-primary relative overflow-hidden flex items-center justify-center min-h-[50vh] md:min-h-[70vh]">
        <div className="absolute w-[500px] h-[500px] md:w-[800px] md:h-[800px] border-[60px] md:border-[100px] border-white/10 rounded-full top-[-150px] md:top-[-200px] right-[-150px] md:right-[-200px]"></div>
        <div className="absolute w-[350px] h-[350px] md:w-[600px] md:h-[600px] border-[40px] md:border-[60px] border-black/5 rounded-full bottom-[-80px] md:bottom-[-100px] left-[-80px] md:left-[-100px]"></div>
        <div className="relative z-10 bg-surface rounded-[28px] md:rounded-[40px] p-8 md:p-16 max-w-4xl w-full text-center shadow-2xl border border-white/20 backdrop-blur-sm">
          <h2 className="font-display-xl text-[30px] md:text-[64px] leading-tight text-on-surface mb-6 md:mb-10">
            So, what are we cooking today?
          </h2>
          <Link
            className="inline-flex items-center gap-2 md:gap-3 bg-on-surface text-surface font-body-lg text-[14px] md:text-body-lg font-medium px-7 md:px-10 py-3.5 md:py-5 rounded-full hover:scale-105 transition-transform shadow-xl group"
            href="#"
          >
            Start Shopping
            <span className="material-symbols-outlined text-secondary-fixed group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}