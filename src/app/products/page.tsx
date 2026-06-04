"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  ChevronRight, 
  Grid2X2, 
  Flame, 
  Soup, 
  Leaf, 
  Grape, 
  CookingPot, 
  SlidersHorizontal, 
  ArrowUp, 
  ArrowDown, 
  Newspaper,
  X,
  RefreshCw,
  Check,
  ShoppingCart,
  Star
} from "lucide-react";
import Link from "next/link";

// ──────────────────────────────────────────────
//  PRODUCT DATA
// ──────────────────────────────────────────────
const ALL_PRODUCTS = [
  // ─ WHOLE SPICES ─
  { id:1, name:'Green Cardamom', category:'whole-spices', catLabel:'Whole Spice', price:349, originalPrice:null, weight:'50g', origin:'Kerala Origin', rating:5, reviews:267, badge:'bestseller', bgGradient:'linear-gradient(135deg,#bbe9ff,#80b1c7)', iconName:'spa', iconColor:'#326578', circleColor:'rgba(50,101,120,0.18)', tags:['bestseller'], order:6 },
  { id:2, name:'Black Pepper', category:'whole-spices', catLabel:'Whole Spice', price:189, originalPrice:229, weight:'100g', origin:'Malabar Grade', rating:5, reviews:198, badge:'sale', bgGradient:'linear-gradient(135deg,#ede8dd,#ffdbd0)', iconName:'grain', iconColor:'#56423c', circleColor:'rgba(86,66,60,0.14)', tags:['sale'], order:9 },
  { id:3, name:'Cumin Seeds', category:'whole-spices', catLabel:'Whole Spice', price:129, originalPrice:null, weight:'200g', origin:'Rajasthan Premium', rating:4, reviews:145, badge:null, bgGradient:'linear-gradient(135deg,#d6ed7a,#bbd062)', iconName:'grass', iconColor:'#556500', circleColor:'rgba(85,101,0,0.15)', tags:['organic'], order:14 },
  { id:4, name:'Cloves (Lavang)', category:'whole-spices', catLabel:'Whole Spice', price:299, originalPrice:null, weight:'50g', origin:'Zanzibar Select', rating:5, reviews:89, badge:'new', bgGradient:'linear-gradient(135deg,#ff8a65,rgba(159,65,34,0.18))', iconName:'local_fire_department', iconColor:'#9f4122', circleColor:'rgba(159,65,34,0.15)', tags:['new'], order:11 },
  { id:5, name:'Cinnamon Sticks', category:'whole-spices', catLabel:'Whole Spice', price:159, originalPrice:null, weight:'100g', origin:'Ceylon Grade A', rating:4, reviews:176, badge:null, bgGradient:'linear-gradient(135deg,#d6ed7a,#bbd062)', iconName:'water_drop', iconColor:'#556500', circleColor:'rgba(85,101,0,0.14)', tags:['organic'], order:17 },
  // ─ GROUND MASALAS ─
  { id:6, name:'Garam Masala Blend', category:'ground-masalas', catLabel:'Ground Masala', price:249, originalPrice:null, weight:'200g', origin:'Premium Grade', rating:5, reviews:428, badge:'bestseller', bgGradient:'linear-gradient(135deg,#ff8a65,rgba(159,65,34,0.18))', iconName:'local_fire_department', iconColor:'#9f4122', circleColor:'rgba(159,65,34,0.16)', tags:['bestseller'], order:1 },
  { id:7, name:'Biryani Masala', category:'ground-masalas', catLabel:'Ground Masala', price:199, originalPrice:null, weight:'150g', origin:'Special Blend', rating:4, reviews:186, badge:'new', bgGradient:'linear-gradient(135deg,#d6ed7a,rgba(187,208,98,0.55))', iconName:'soup_kitchen', iconColor:'#556500', circleColor:'rgba(85,101,0,0.13)', tags:['new'], order:8 },
  { id:8, name:'Turmeric Powder', category:'ground-masalas', catLabel:'Ground Masala', price:89, originalPrice:null, weight:'250g', origin:'Organic Certified', rating:5, reviews:312, badge:null, bgGradient:'linear-gradient(135deg,#d6ed7a,#bbd062)', iconName:'eco', iconColor:'#556500', circleColor:'rgba(85,101,0,0.16)', tags:['organic'], order:16 },
  { id:9, name:'Red Chilli Powder', category:'ground-masalas', catLabel:'Ground Masala', price:99, originalPrice:125, weight:'200g', origin:'Guntur Premium', rating:4, reviews:203, badge:'sale', bgGradient:'linear-gradient(135deg,#ffdbd0,rgba(255,181,158,0.5))', iconName:'local_fire_department', iconColor:'#9f4122', circleColor:'rgba(159,65,34,0.13)', tags:['sale'], order:15 },
  { id:10, name:'Curry Powder', category:'ground-masalas', catLabel:'Ground Masala', price:149, originalPrice:null, weight:'200g', origin:'Traditional Blend', rating:5, reviews:278, badge:null, bgGradient:'linear-gradient(135deg,#ede8dd,#ffdbd0)', iconName:'rice_bowl', iconColor:'#56423c', circleColor:'rgba(86,66,60,0.12)', tags:[], order:19 },
  // ─ DRY FRUITS & NUTS ─
  { id:11, name:'Premium Almonds', category:'dry-fruits', catLabel:'Dry Fruits & Nuts', price:649, originalPrice:null, weight:'500g', origin:'California Grade A', rating:5, reviews:312, badge:'bestseller', bgGradient:'linear-gradient(135deg,#ede8dd,#ffdbd0)', iconName:'nutrition', iconColor:'#56423c', circleColor:'rgba(86,66,60,0.12)', tags:['bestseller'], order:2 },
  { id:12, name:'Premium Cashews', category:'dry-fruits', catLabel:'Dry Fruits & Nuts', price:549, originalPrice:null, weight:'250g', origin:'W240 Grade', rating:5, reviews:245, badge:null, bgGradient:'linear-gradient(135deg,#d6ed7a,rgba(187,208,98,0.5))', iconName:'grain', iconColor:'#556500', circleColor:'rgba(85,101,0,0.12)', tags:[], order:12 },
  { id:13, name:'Mixed Dry Fruits', category:'dry-fruits', catLabel:'Dry Fruits & Nuts', price:719, originalPrice:899, weight:'250g', origin:'Premium Selection', rating:4, reviews:193, badge:'sale', bgGradient:'linear-gradient(135deg,#ffdbd0,rgba(255,181,158,0.5))', iconName:'shopping_basket', iconColor:'#9f4122', circleColor:'rgba(159,65,34,0.13)', tags:['sale'], order:7 },
  { id:14, name:'Golden Raisins', category:'dry-fruits', catLabel:'Dry Fruits & Nuts', price:249, originalPrice:null, weight:'500g', origin:'Afghanistan Premium', rating:4, reviews:167, badge:null, bgGradient:'linear-gradient(135deg,#bbe9ff,#9ccee4)', iconName:'local_florist', iconColor:'#326578', circleColor:'rgba(50,101,120,0.15)', tags:['organic'], order:18 },
  { id:15, name:'Pistachios', category:'dry-fruits', catLabel:'Dry Fruits & Nuts', price:849, originalPrice:null, weight:'200g', origin:'Iran Premium', rating:5, reviews:134, badge:'new', bgGradient:'linear-gradient(135deg,#d6ed7a,rgba(187,208,98,0.55))', iconName:'eco', iconColor:'#556500', circleColor:'rgba(85,101,0,0.15)', tags:['new'], order:10 },
  // ─ DALS & PULSES ─
  { id:16, name:'Yellow Moong Dal', category:'dals-pulses', catLabel:'Dals & Pulses', price:149, originalPrice:185, weight:'1kg', origin:'Premium Washed', rating:5, reviews:541, badge:'sale', bgGradient:'linear-gradient(135deg,#d6ed7a,#bbd062)', iconName:'set_meal', iconColor:'#1d1c15', circleColor:'rgba(29,28,21,0.1)', tags:['sale','bestseller'], order:3 },
  { id:17, name:'Red Masoor Dal', category:'dals-pulses', catLabel:'Dals & Pulses', price:135, originalPrice:null, weight:'1kg', origin:'Premium Quality', rating:4, reviews:398, badge:null, bgGradient:'linear-gradient(135deg,#ff8a65,rgba(159,65,34,0.18))', iconName:'grain', iconColor:'#9f4122', circleColor:'rgba(159,65,34,0.15)', tags:[], order:13 },
  { id:18, name:'Chana Dal', category:'dals-pulses', catLabel:'Dals & Pulses', price:125, originalPrice:null, weight:'1kg', origin:'Rajasthan Select', rating:5, reviews:287, badge:null, bgGradient:'linear-gradient(135deg,#bbe9ff,#9ccee4)', iconName:'spa', iconColor:'#326578', circleColor:'rgba(50,101,120,0.15)', tags:['organic'], order:20 },
  // ─ READY MIXES ─
  { id:19, name:'Halwa Mix', category:'ready-mixes', catLabel:'Ready Mix', price:249, originalPrice:null, weight:'500g', origin:'Traditional Recipe', rating:4, reviews:112, badge:'new', bgGradient:'linear-gradient(135deg,#d6ed7a,rgba(187,208,98,0.6))', iconName:'skillet', iconColor:'#556500', circleColor:'rgba(85,101,0,0.12)', tags:['new'], order:5 },
  { id:20, name:'Khichdi Mix', category:'ready-mixes', catLabel:'Ready Mix', price:179, originalPrice:null, weight:'500g', origin:'Healthy Blend', rating:5, reviews:89, badge:null, bgGradient:'linear-gradient(135deg,#ede8dd,rgba(221,192,184,0.3))', iconName:'rice_bowl', iconColor:'#56423c', circleColor:'rgba(86,66,60,0.12)', tags:['organic'], order:4 },
];

const CATEGORIES = [
  { value:'all', label:'All Products', icon: <Grid2X2 size={16} /> },
  { value:'whole-spices', label:'Whole Spices', icon: <Flame size={16} /> },
  { value:'ground-masalas', label:'Ground Masalas', icon: <Soup size={16} /> },
  { value:'dry-fruits', label:'Dry Fruits & Nuts', icon: <Leaf size={16} /> },
  { value:'dals-pulses', label:'Dals & Pulses', icon: <Grape size={16} /> },
  { value:'ready-mixes', label:'Ready Mixes', icon: <CookingPot size={16} /> },
];

const SORT_OPTIONS = [
  { value:'featured', label:'Featured', icon: <Star size={16} /> },
  { value:'price-asc', label:'Price: Low → High', icon: <ArrowUp size={16} /> },
  { value:'price-desc', label:'Price: High → Low', icon: <ArrowDown size={16} /> },
  { value:'rating', label:'Top Rated', icon: <Star size={16} /> },
  { value:'newest', label:'New Arrivals', icon: <Newspaper size={16} /> },
];

const TAGS = [
  { value:'bestseller', label:'Bestseller', color:'#9f4122' },
  { value:'new', label:'New', color:'#326578' },
  { value:'sale', label:'On Sale', color:'#ba1a1a' },
  { value:'organic', label:'Organic', color:'#556500' },
];

const MaterialIcon = ({ name, size = 24, className = "", style = {} }: { name: string, size?: number, className?: string, style?: React.CSSProperties }) => {
  return (
    <span className={`material-symbols-outlined ${className}`} style={{ fontSize: `${size}px`, ...style }}>
      {name}
    </span>
  );
};

export default function ProductsPage() {
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState("featured");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cartCount, setCartCount] = useState(0);

  const filteredProducts = useMemo(() => {
    let arr = [...ALL_PRODUCTS];
    if (category !== 'all') arr = arr.filter(p => p.category === category);
    arr = arr.filter(p => p.price <= maxPrice);
    if (selectedTags.length > 0) arr = arr.filter(p => selectedTags.every(t => p.tags.includes(t)));
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      arr = arr.filter(p => p.name.toLowerCase().includes(q) || p.catLabel.toLowerCase().includes(q) || p.origin.toLowerCase().includes(q));
    }
    switch(sortOrder) {
      case 'price-asc': arr.sort((a,b) => a.price - b.price); break;
      case 'price-desc': arr.sort((a,b) => b.price - a.price); break;
      case 'rating': arr.sort((a,b) => b.rating - a.rating || b.reviews - a.reviews); break;
      case 'newest': arr.sort((a,b) => (b.badge==='new'?1:0) - (a.badge==='new'?1:0) || a.id - b.id); break;
      default: arr.sort((a,b) => a.order - b.order);
    }
    return arr;
  }, [category, maxPrice, selectedTags, sortOrder, searchTerm]);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (category !== 'all') n++;
    if (maxPrice < 1000) n++;
    n += selectedTags.length;
    return n;
  }, [category, maxPrice, selectedTags]);

  const clearAllFilters = () => {
    setCategory("all");
    setMaxPrice(1000);
    setSelectedTags([]);
    setSortOrder("featured");
    setSearchTerm("");
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };

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
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(159,65,34,0.14); }
        .filter-drawer { transition: transform 0.38s cubic-bezier(0.32, 0.72, 0, 1); }
        .filter-overlay { transition: opacity 0.3s ease; }
        .sidebar-section { border-bottom: 1px solid rgba(221,192,184,0.35); }

        input[type="range"] {
          -webkit-appearance: none; appearance: none;
          height: 4px; background: #ddc0b8; border-radius: 2px; outline: none; cursor: pointer; width: 100%;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 18px; height: 18px;
          border-radius: 50%; background: #9f4122; cursor: pointer;
          border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px; height: 18px; border-radius: 50%; background: #9f4122;
          cursor: pointer; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          border: none;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card-animate { animation: cardIn 0.3s ease both; }
        .mobile-filter-bar { box-shadow: 0 -1px 0 rgba(221,192,184,0.4), 0 4px 16px rgba(159,65,34,0.06); }
      `}</style>

      <main className="max-w-[1728px] mx-auto w-full">
        {/* ─── PAGE HEADER ─── */}
        <section className="pt-24 md:pt-36 pb-6 md:pb-10 px-4 md:px-container-padding relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f9f3e8 0%, #ffdbd0 60%, #fff9ee 100%)' }}>
          <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 rounded-full blur-3xl -z-0 pointer-events-none" style={{ background: 'rgba(255,138,101,0.18)', transform: 'translate(30%, -30%)' }}></div>
          <div className="absolute bottom-0 left-0 w-48 md:w-72 h-48 md:h-72 rounded-full blur-3xl -z-0 pointer-events-none" style={{ background: 'rgba(214,237,122,0.2)', transform: 'translate(-20%, 30%)' }}></div>
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-[11px] md:text-[13px] text-on-surface-variant mb-4 md:mb-6">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight size={14} />
              <span className="text-on-surface font-medium">All Products</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-0">
              <div>
                <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest mb-2 block uppercase">OUR COLLECTION</span>
                <h1 className="font-display-xl text-[32px] md:text-[52px] text-on-surface tracking-tight leading-none mb-2">All Products</h1>
                <p className="text-on-surface-variant text-[13px] md:text-body-lg max-w-lg">Premium spices, dry fruits, dals & ready mixes — sourced fresh from certified farms.</p>
              </div>
              {/* Desktop search bar */}
              <div className="hidden md:flex items-center gap-3 bg-surface/80 backdrop-blur rounded-full border border-outline-variant px-4 py-2.5 w-72 shadow-sm">
                <Search size={20} className="text-on-surface-variant" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="bg-transparent border-none outline-none text-[14px] text-on-surface placeholder:text-outline flex-1 w-full" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="text-on-surface-variant hover:text-primary transition-colors">
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
            {/* Category pills (quick filter) */}
            <div className="flex flex-wrap gap-2 mt-5 md:mt-6">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`flex items-center gap-1.5 px-3 md:px-4 py-1.5 rounded-full text-[11px] md:text-[13px] font-medium border transition-all ${
                    category === cat.value 
                    ? 'bg-on-surface text-surface border-on-surface' 
                    : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                  }`}
                >
                  {cat.icon} {cat.label === "All Products" ? "All" : cat.label.replace("Dry Fruits & Nuts", "Dry Fruits").replace("Dals & Pulses", "Dals & Pulses")}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ─── MOBILE: STICKY FILTER BAR ─── */}
        <div className="lg:hidden sticky top-[52px] z-30 bg-surface/95 backdrop-blur-xl border-b border-outline-variant/30 mobile-filter-bar px-4 py-2.5">
          <div className="flex items-center gap-2">
            {/* Mobile search */}
            <div className="flex items-center gap-2 bg-surface-container rounded-full px-3 py-2 flex-1 border border-outline-variant/50">
              <Search size={16} className="text-on-surface-variant" />
              <input 
                type="text" 
                placeholder="Search…" 
                className="bg-transparent border-none outline-none text-[12px] text-on-surface placeholder:text-outline flex-1 w-full" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Filter button */}
            <button 
              onClick={() => setIsFilterDrawerOpen(true)}
              className="flex items-center gap-1.5 bg-surface-container border border-outline-variant/50 rounded-full px-3 py-2 text-[12px] font-medium text-on-surface transition-colors active:bg-primary-fixed"
            >
              <SlidersHorizontal size={16} />
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-primary text-on-primary text-[9px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {/* Sort dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                className="flex items-center gap-1 bg-surface-container border border-outline-variant/50 rounded-full px-3 py-2 text-[12px] font-medium text-on-surface"
              >
                <RefreshCw size={16} />
                <span>{SORT_OPTIONS.find(s => s.value === sortOrder)?.label.split(':')[0]}</span>
              </button>
              {isSortMenuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-surface border border-outline-variant/40 rounded-2xl shadow-xl overflow-hidden w-48 z-50">
                  {SORT_OPTIONS.map((opt) => (
                    <button 
                      key={opt.value}
                      onClick={() => { setSortOrder(opt.value); setIsSortMenuOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-[13px] hover:bg-surface-container-low flex items-center gap-2 ${sortOrder === opt.value ? 'font-bold text-primary' : 'text-on-surface'}`}
                    >
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── PRODUCTS + SIDEBAR SECTION ─── */}
        <section className="py-5 md:py-10 px-4 md:px-container-padding bg-background">
          <div className="max-w-7xl mx-auto flex gap-6 xl:gap-8 items-start">
            {/* ─── SIDEBAR (Desktop only) ─── */}
            <aside className="hidden lg:block w-60 xl:w-64 shrink-0 sticky top-28">
              <div className="bg-surface rounded-[20px] border border-outline-variant/40 shadow-sm overflow-hidden">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={20} className="text-primary" />
                    <span className="font-semibold text-[15px] text-on-surface">Filters</span>
                  </div>
                  <button onClick={clearAllFilters} className="text-[11px] text-primary font-medium hover:underline underline-offset-2 transition-colors">Clear All</button>
                </div>

                <div className="p-4 space-y-0">
                  {/* Category Section */}
                  <div className="sidebar-section pb-4 mb-4">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Category</h3>
                    <div className="space-y-1">
                      {CATEGORIES.map((cat) => (
                        <button 
                          key={cat.value}
                          onClick={() => setCategory(cat.value)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left ${category === cat.value ? 'font-semibold' : 'hover:bg-surface-container'}`}
                          style={category === cat.value ? { background: '#ffdbd0', color: '#3a0b00' } : { color: '#1d1c15' }}
                        >
                          <div className="flex items-center gap-2.5">
                            {React.cloneElement(cat.icon as React.ReactElement, { size: 16, color: category === cat.value ? '#9f4122' : '#56423c' })}
                            <span className="text-[13px]">{cat.label}</span>
                          </div>
                          <span className="text-[11px] px-1.5 py-0.5 rounded-full" style={{ background: category === cat.value ? 'rgba(255,219,208,0.6)' : 'rgba(221,192,184,0.4)', color: category === cat.value ? '#9f4122' : '#56423c' }}>
                            {ALL_PRODUCTS.filter(p => cat.value === 'all' || p.category === cat.value).length}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Section */}
                  <div className="sidebar-section pb-4 mb-4">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Max Price</h3>
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[12px] text-on-surface-variant">৳0</span>
                        <span className="text-[13px] font-bold text-on-surface px-2.5 py-1 rounded-full" style={{ background: '#ffdbd0' }}>৳{maxPrice}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="1000" 
                        value={maxPrice} 
                        step="10" 
                        className="range-styled" 
                        onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                        style={{ background: `linear-gradient(to right, #9f4122 ${(maxPrice / 1000) * 100}%, #ddc0b8 ${(maxPrice / 1000) * 100}%)` }}
                      />
                      <div className="flex justify-between mt-1.5">
                        <span className="text-[10px] text-on-surface-variant">Budget</span>
                        <span className="text-[10px] text-on-surface-variant">Premium</span>
                      </div>
                    </div>
                  </div>

                  {/* Sort By Section */}
                  <div className="sidebar-section pb-4 mb-4">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Sort By</h3>
                    <div className="flex flex-col gap-1">
                      {SORT_OPTIONS.map((opt) => (
                        <button 
                          key={opt.value}
                          onClick={() => setSortOrder(opt.value)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-left w-full ${sortOrder === opt.value ? 'font-semibold' : ''}`}
                          style={sortOrder === opt.value ? { background: '#1d1c15', color: '#fff9ee' } : { color: '#1d1c15' }}
                        >
                          {React.cloneElement(opt.icon as React.ReactElement, { size: 15, color: sortOrder === opt.value ? '#ffb59e' : '#56423c' })}
                          <span className="text-[12px]">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tags Section */}
                  <div className="pb-2">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Product Tags</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {TAGS.map((tag) => (
                        <button 
                          key={tag.value}
                          onClick={() => toggleTag(tag.value)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] transition-all font-medium`}
                          style={selectedTags.includes(tag.value) 
                            ? { background: tag.color, color: 'white', borderColor: tag.color } 
                            : { background: '#f3ede2', color: '#56423c', borderColor: 'rgba(221,192,184,0.5)' }
                          }
                        >
                          {selectedTags.includes(tag.value) && <Check size={13} />}
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* ─── PRODUCTS AREA ─── */}
            <div className="flex-1 min-w-0">
              {/* Desktop: Sort bar + results */}
              <div className="hidden lg:flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-medium text-on-surface">{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}</span>
                  {searchTerm && <span className="text-[14px] text-on-surface-variant">for &quot;{searchTerm}&quot;</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-on-surface-variant">Sort:</span>
                  <div className="flex gap-1.5 flex-wrap justify-end">
                    {SORT_OPTIONS.map((opt) => (
                      <button 
                        key={opt.value}
                        onClick={() => setSortOrder(opt.value)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] transition-all ${sortOrder === opt.value ? 'bg-on-surface text-surface border-on-surface font-semibold' : 'bg-surface-container-low text-on-surface-variant border-outline-variant'}`}
                        style={sortOrder === opt.value ? { background: '#1d1c15', color: '#fff9ee', borderColor: '#1d1c15' } : { background: '#f9f3e8', color: '#56423c', borderColor: 'rgba(221,192,184,0.5)' }}
                      >
                        {React.cloneElement(opt.icon as React.ReactElement, { size: 14, color: sortOrder === opt.value ? '#ffb59e' : '#89726b' })}
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Filter Chips */}
              <div className={`flex flex-wrap gap-2 mb-4 ${activeFilterCount === 0 && !searchTerm ? 'hidden' : ''}`}>
                {category !== 'all' && (
                  <button onClick={() => setCategory('all')} className="flex items-center gap-1.5 text-[11px] md:text-[13px] font-medium px-3 py-1.5 rounded-full border bg-primary-fixed text-on-primary-fixed border-primary-fixed-dim">
                    {CATEGORIES.find(c => c.value === category)?.label}
                    <X size={14} className="text-primary" />
                  </button>
                )}
                {maxPrice < 1000 && (
                  <button onClick={() => setMaxPrice(1000)} className="flex items-center gap-1.5 text-[11px] md:text-[13px] font-medium px-3 py-1.5 rounded-full border bg-primary-fixed text-on-primary-fixed border-primary-fixed-dim">
                    Under ৳{maxPrice}
                    <X size={14} className="text-primary" />
                  </button>
                )}
                {selectedTags.map(tag => (
                  <button key={tag} onClick={() => toggleTag(tag)} className="flex items-center gap-1.5 text-[11px] md:text-[13px] font-medium px-3 py-1.5 rounded-full border bg-primary-fixed text-on-primary-fixed border-primary-fixed-dim">
                    {TAGS.find(t => t.value === tag)?.label}
                    <X size={14} className="text-primary" />
                  </button>
                ))}
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="flex items-center gap-1.5 text-[11px] md:text-[13px] font-medium px-3 py-1.5 rounded-full border bg-primary-fixed text-on-primary-fixed border-primary-fixed-dim">
                    &quot;{searchTerm}&quot;
                    <X size={14} className="text-primary" />
                  </button>
                )}
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 md:gap-4 xl:gap-5">
                {filteredProducts.map((p, idx) => (
                  <div key={p.id} className="product-card card-animate flex flex-col overflow-hidden" style={{ background: '#fff9ee', borderRadius: '20px', border: '1px solid rgba(221,192,184,0.45)', boxShadow: '0 2px 12px rgba(159,65,34,0.06)', animationDelay: `${Math.min(idx * 40, 300)}ms` }}>
                    <div className="relative overflow-hidden p-[14px] flex items-end h-[clamp(130px,22vw,200px)]" style={{ background: p.bgGradient }}>
                      {p.badge && (
                        <div className="absolute top-[10px] left-[10px] px-2 py-0.5 rounded-full text-[8px] font-bold tracking-widest uppercase" style={p.badge === 'bestseller' ? { background: '#1d1c15', color: '#fff9ee' } : p.badge === 'sale' ? { background: '#ba1a1a', color: 'white' } : { background: '#9f4122', color: 'white' }}>
                          {p.badge === 'sale' && p.originalPrice ? `${Math.round((1 - p.price/p.originalPrice)*100)}% OFF` : p.badge}
                        </div>
                      )}
                      {p.badge === 'new' && (
                        <div className="absolute top-[10px] right-[10px] px-2 py-0.5 rounded-full text-[8px] font-bold uppercase bg-primary text-white">
                          NEW
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[clamp(56px,10vw,88px)] h-[clamp(56px,10vw,88px)] rounded-full" style={{ background: p.circleColor }}></div>
                      </div>
                      <div className="relative z-10 backdrop-blur-md rounded-xl p-[7px_9px] border border-white/60 shadow-sm" style={{ background: 'rgba(255,249,238,0.92)' }}>
                        <MaterialIcon name={p.iconName} size={22} className={`block text-clamp-[16px,3vw,22px]`} style={{ color: p.iconColor }} />
                      </div>
                    </div>
                    <div className="p-[clamp(10px,3vw,18px)] flex flex-col flex-1">
                      <div className="flex items-center gap-[3px] mb-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className="text-[11px]" style={{ color: s <= p.rating ? '#9f4122' : '#ddc0b8' }}>{s <= p.rating ? '★' : '☆'}</span>
                        ))}
                        <span className="text-[10px] text-on-surface-variant ml-[3px]">({p.reviews})</span>
                      </div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-secondary mb-[3px]">{p.catLabel}</div>
                      <h4 className="font-bold text-[clamp(12px,2.2vw,16px)] leading-tight text-on-surface mb-[3px]">{p.name}</h4>
                      <p className="text-[clamp(10px,1.8vw,13px)] text-on-surface-variant mb-2.5">{p.weight} · {p.origin}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-baseline gap-1">
                          <span className="font-extrabold text-[clamp(15px,2.5vw,20px)] text-on-surface">৳{p.price}</span>
                          {p.originalPrice && <span className="text-[11px] text-outline line-through">৳{p.originalPrice}</span>}
                        </div>
                        <button 
                          onClick={addToCart}
                          className="bg-primary text-on-primary font-semibold p-[clamp(6px,1.2vw,9px)_clamp(9px,2vw,16px)] rounded-full flex items-center gap-[5px] hover:opacity-85 transition-opacity"
                        >
                          <ShoppingCart size={16} />
                          <span className="hidden sm:inline text-[13px]">Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* No Results */}
              <div className={`text-center py-20 ${filteredProducts.length > 0 ? 'hidden' : ''}`}>
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-primary-fixed">
                  <Search size={28} className="text-primary" />
                </div>
                <h3 className="font-semibold text-[18px] text-on-surface mb-2">No products found</h3>
                <p className="text-on-surface-variant text-[14px] mb-6">Try adjusting your filters or search term.</p>
                <button onClick={clearAllFilters} className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full text-[14px] font-medium hover:bg-primary/90 transition-colors">
                  <RefreshCw size={16} />
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── MOBILE FILTER DRAWER ─── */}
      {isFilterDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity opacity-100" onClick={() => setIsFilterDrawerOpen(false)}></div>
          <div className="fixed bottom-0 left-0 right-0 bg-surface z-50 transition-transform translate-y-0 rounded-t-[24px] max-h-[88vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-center pt-3 pb-2">
              <div className="w-9 h-1 rounded-full bg-outline-variant"></div>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={20} className="text-primary" />
                <span className="font-bold text-[16px] text-on-surface">Filters & Sort</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={clearAllFilters} className="text-[13px] text-primary font-medium">Clear All</button>
                <button onClick={() => setIsFilterDrawerOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container">
                  <X size={18} className="text-on-surface" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto pb-28 flex-1">
              <div className="px-5 py-4 space-y-6">
                {/* Mobile Sort */}
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Sort By</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {SORT_OPTIONS.map((opt) => (
                      <button 
                        key={opt.value}
                        onClick={() => setSortOrder(opt.value)}
                        className={`flex items-center gap-2 px-3 py-3 rounded-2xl border transition-all text-left ${sortOrder === opt.value ? 'bg-on-surface text-surface border-on-surface' : 'bg-surface-container-low text-on-surface border-outline-variant/40'}`}
                      >
                        {React.cloneElement(opt.icon as React.ReactElement, { size: 16, color: sortOrder === opt.value ? '#ffb59e' : '#56423c' })}
                        <span className="text-[12px] font-medium leading-tight">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Category */}
                <div className="border-t border-outline-variant/25 pt-5">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Category</h3>
                  <div className="space-y-1.5">
                    {CATEGORIES.map((cat) => (
                      <button 
                        key={cat.value}
                        onClick={() => setCategory(cat.value)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left ${category === cat.value ? 'bg-primary-fixed text-on-primary-fixed font-semibold' : 'hover:bg-surface-container text-on-surface'}`}
                      >
                        <div className="flex items-center gap-2.5">
                          {React.cloneElement(cat.icon as React.ReactElement, { size: 16, color: category === cat.value ? '#9f4122' : '#56423c' })}
                          <span className="text-[14px]">{cat.label}</span>
                        </div>
                        <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: category === cat.value ? 'rgba(255,219,208,0.6)' : 'rgba(221,192,184,0.4)', color: category === cat.value ? '#9f4122' : '#56423c' }}>
                          {ALL_PRODUCTS.filter(p => cat.value === 'all' || p.category === cat.value).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Price Range */}
                <div className="border-t border-outline-variant/25 pt-5">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Max Price</h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13px] text-on-surface-variant">৳0</span>
                    <span className="text-[14px] font-bold text-on-surface px-3 py-1 rounded-full bg-primary-fixed">৳{maxPrice}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1000" 
                    value={maxPrice} 
                    step="10" 
                    className="range-styled" 
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    style={{ background: `linear-gradient(to right, #9f4122 ${(maxPrice / 1000) * 100}%, #ddc0b8 ${(maxPrice / 1000) * 100}%)` }}
                  />
                </div>

                {/* Mobile Tags */}
                <div className="border-t border-outline-variant/25 pt-5">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Product Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {TAGS.map((tag) => (
                      <button 
                        key={tag.value}
                        onClick={() => toggleTag(tag.value)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-medium transition-all`}
                        style={selectedTags.includes(tag.value) 
                          ? { background: tag.color, color: 'white', borderColor: tag.color } 
                          : { background: '#f3ede2', color: '#56423c', borderColor: 'rgba(221,192,184,0.5)' }
                        }
                      >
                        {selectedTags.includes(tag.value) && <Check size={13} />}
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-surface border-t border-outline-variant/30">
              <button 
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-full bg-primary text-on-primary font-bold py-4 rounded-2xl text-[15px] flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
              >
                <Check size={18} />
                <span>Show {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
