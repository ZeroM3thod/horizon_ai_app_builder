"use client";

import { useState } from "react";
import Link from "next/link";

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

export default function Home() {
  return (
    <>
      {/* ─── SECTION 1: HERO ─── */}
      <section className="relative pt-28 md:pt-48 pb-12 md:pb-section-gap px-6 md:px-container-padding min-h-[88vh] md:min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-tertiary-fixed/30 to-background -z-10"></div>
        <div className="absolute top-32 right-8 md:right-20 w-24 md:w-48 h-24 md:h-48 rounded-full bg-primary-container/25 blur-3xl -z-10"></div>
        <div className="absolute bottom-16 left-8 md:left-24 w-28 md:w-56 h-28 md:h-56 rounded-full bg-secondary-container/30 blur-3xl -z-10"></div>

        <div className="inline-flex items-center gap-2 bg-surface/70 backdrop-blur-xl border border-outline-variant/50 rounded-full px-3 md:px-4 py-1.5 md:py-2 mb-6 md:mb-8 shadow-sm">
          <span className="bg-secondary-container text-on-secondary-container font-label-caps text-[10px] md:text-label-caps px-2 py-1 rounded-full uppercase">
            NEW
          </span>
          <span className="font-body-md text-[11px] md:text-body-md text-on-surface">
            Fresh Harvest 2024 — Now Available
          </span>
        </div>

        <h1 className="font-display-xl text-[38px] md:text-[72px] leading-[1.1] tracking-tighter text-on-surface max-w-4xl mb-4 md:mb-6">
          Pure Spices,
          <br />
          Bold Flavors
        </h1>
        <p className="font-body-lg text-[14px] md:text-body-lg text-on-surface-variant max-w-2xl mb-8 md:mb-12 px-2 md:px-0">
          Shuddhota Co. brings you authentic masalas and premium dry foods — sourced directly from
          certified farms, lab-tested for purity, and delivered fresh to your kitchen.
        </p>

        {/* Search Box */}
        <div className="w-full max-w-[870px] bg-surface rounded-3xl border border-outline-variant shadow-[0_24px_64px_rgba(159,65,34,0.08)] p-4 md:p-6 mb-6 md:mb-8 backdrop-blur-xl">
          <div className="flex flex-col gap-3 md:gap-4">
            <input
              type="text"
              className="w-full bg-transparent border-none font-body-lg text-[14px] md:text-body-lg text-on-surface placeholder:text-outline focus:ring-0 py-1 md:py-2"
              placeholder="Search spices, dals, dry fruits, masalas..."
            />
            <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-surface-variant">
              <div className="flex items-center gap-2 md:gap-3">
                <button className="p-1.5 md:p-2 rounded-full hover:bg-surface-variant transition-colors text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px] md:text-[24px]">tune</span>
                </button>
                <div className="flex items-center gap-1.5 md:gap-2 bg-surface-variant rounded-full px-3 md:px-4 py-1.5 md:py-2 cursor-pointer">
                  <span className="font-body-md text-[11px] md:text-body-md text-on-surface-variant">
                    All Categories
                  </span>
                  <span className="material-symbols-outlined text-[16px] md:text-[20px]">
                    expand_more
                  </span>
                </div>
              </div>
              <button className="bg-primary text-on-primary rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors">
                <span className="material-symbols-outlined text-[20px] md:text-[24px]">search</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
          <button className="bg-secondary-fixed/20 text-on-surface border border-secondary-fixed/30 rounded-full px-3 md:px-5 py-1.5 md:py-2 text-[11px] md:text-body-md hover:bg-secondary-fixed/30 transition-colors backdrop-blur-sm inline-flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] md:text-[16px]">
              local_fire_department
            </span>
            &nbsp;Whole Spices
          </button>
          <button className="bg-secondary-fixed/20 text-on-surface border border-secondary-fixed/30 rounded-full px-3 md:px-5 py-1.5 md:py-2 text-[11px] md:text-body-md hover:bg-secondary-fixed/30 transition-colors backdrop-blur-sm inline-flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] md:text-[16px]">
              soup_kitchen
            </span>
            &nbsp;Ground Masalas
          </button>
          <button className="bg-secondary-fixed/20 text-on-surface border border-secondary-fixed/30 rounded-full px-3 md:px-5 py-1.5 md:py-2 text-[11px] md:text-body-md hover:bg-secondary-fixed/30 transition-colors backdrop-blur-sm inline-flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] md:text-[16px]">nutrition</span>
            &nbsp;Dry Fruits & Nuts
          </button>
          <button className="bg-secondary-fixed/20 text-on-surface border border-secondary-fixed/30 rounded-full px-3 md:px-5 py-1.5 md:py-2 text-[11px] md:text-body-md hover:bg-secondary-fixed/30 transition-colors backdrop-blur-sm inline-flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] md:text-[16px]">grain</span>
            &nbsp;Dals & Pulses
          </button>
        </div>
      </section>

      {/* ─── SECTION 2: SLOGAN ─── */}
      <section className="py-12 md:py-section-gap px-6 md:px-container-padding bg-surface relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-container/10 to-transparent"></div>
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display-xl text-[34px] md:text-[68px] leading-[1.2] font-normal text-on-surface tracking-tight">
            Flavor without compromise.
          </h2>
        </div>
      </section>

      {/* ─── SECTION 7: BESTSELLING PRODUCTS ─── */}
      <section className="py-12 md:py-section-gap px-6 md:px-container-padding bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
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
        </div>
      </section>

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
      <section className="py-12 md:py-section-gap px-6 md:px-container-padding bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest mb-2 block">
              REVIEWS
            </span>
            <h2 className="font-display-xl text-[28px] md:text-[56px] leading-tight text-on-surface">
              Trusted by Home Cooks
              <br className="hidden md:block" /> & Restaurants Alike
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            <div className="bg-surface-container-low rounded-[24px] p-5 md:p-8 border border-outline-variant/30">
              <div className="text-primary text-[18px] md:text-[20px] mb-3 md:mb-4">★★★★★</div>
              <p className="font-body-lg text-[13px] md:text-body-lg text-on-surface mb-4 md:mb-6">
                The garam masala is unlike anything from a supermarket. You can smell the freshness
                the moment you open the packet. My curries taste completely different now.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                  <span className="font-bold text-primary text-[13px] md:text-[14px]">R</span>
                </div>
                <div>
                  <p className="font-body-md text-[12px] md:text-body-md text-on-surface font-semibold">
                    Rehana Begum
                  </p>
                  <p className="text-[10px] md:text-body-md text-on-surface-variant">
                    Home Cook, Dhaka
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-low rounded-[24px] p-5 md:p-8 border border-outline-variant/30">
              <div className="text-primary text-[18px] md:text-[20px] mb-3 md:mb-4">★★★★★</div>
              <p className="font-body-lg text-[13px] md:text-body-lg text-on-surface mb-4 md:mb-6">
                We switched our restaurant to Shuddhota Co. for all spice needs. The consistency and
                quality are excellent. The bulk ordering is seamless and delivery is always on
                time.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                  <span className="font-bold text-secondary text-[13px] md:text-[14px]">K</span>
                </div>
                <div>
                  <p className="font-body-md text-[12px] md:text-body-md text-on-surface font-semibold">
                    Kabir Hossain
                  </p>
                  <p className="text-[10px] md:text-body-md text-on-surface-variant">
                    Chef & Restaurant Owner, Chittagong
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-low rounded-[24px] p-5 md:p-8 border border-outline-variant/30">
              <div className="text-primary text-[18px] md:text-[20px] mb-3 md:mb-4">★★★★★</div>
              <p className="font-body-lg text-[13px] md:text-body-lg text-on-surface mb-4 md:mb-6">
                The Premium Spice Box subscription is a game changer. Every month I discover new
                spices. The dry fruits are incredibly fresh — much better than anything in local
                stores.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-tertiary-fixed flex items-center justify-center shrink-0">
                  <span className="font-bold text-tertiary text-[13px] md:text-[14px]">S</span>
                </div>
                <div>
                  <p className="font-body-md text-[12px] md:text-body-md text-on-surface font-semibold">
                    Sadia Rahman
                  </p>
                  <p className="text-[10px] md:text-body-md text-on-surface-variant">
                    Food Blogger, Sylhet
                  </p>
                </div>
              </div>
            </div>
          </div>
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
              question="What makes Shuddhota Co. spices different?"
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
