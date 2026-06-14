"use client";

import Link from "next/link";

const teamMembers = [
  {
    name: "Farrukh Rahman",
    role: "Founder & CEO",
    initial: "F",
    color: "bg-primary-container",
    textColor: "text-primary",
    bio: "Started Shuddhota Co. after years of buying substandard spices from local markets. His mission: bring lab-tested purity to every Bangladeshi kitchen.",
  },
  {
    name: "Nusrat Jahan",
    role: "Head of Sourcing",
    initial: "N",
    color: "bg-secondary-container",
    textColor: "text-secondary",
    bio: "Nusrat travels to Kerala, Rajasthan, and Sri Lanka four times a year to audit farms and negotiate directly with growers — no middlemen, ever.",
  },
  {
    name: "Imran Hossain",
    role: "Quality & Lab Director",
    initial: "I",
    color: "bg-tertiary-fixed",
    textColor: "text-tertiary",
    bio: "A food scientist by training, Imran oversees every lab test before a product ships. If it doesn't meet his standard, it doesn't leave the warehouse.",
  },
  {
    name: "Sadia Akhter",
    role: "Head of Customer Experience",
    initial: "S",
    color: "bg-primary-fixed",
    textColor: "text-primary",
    bio: "Sadia built Shuddhota's 7-day returns process and the real-time order tracking system from scratch. She treats every complaint as a design problem.",
  },
];

const milestones = [
  {
    year: "Jan '26",
    title: "The Idea",
    desc: "Frustrated by adulterated spices in local markets, our founder starts researching direct farm sourcing and purity testing in Bangladesh.",
  },
  {
    year: "Mar '26",
    title: "First Farm Visit",
    desc: "We visit our first certified turmeric farm in Narsingdi and seal a direct sourcing agreement — no middlemen involved.",
  },
  {
    year: "Apr '26",
    title: "Lab Certified",
    desc: "Our first batch passes independent lab testing. BSTI certification process begins. We pack the first 50 orders by hand.",
  },
  {
    year: "May '26",
    title: "Soft Launch",
    desc: "Shuddhota Co. goes live with 12 products. First 200 orders come entirely from word of mouth within the first two weeks.",
  },
  {
    year: "Jun '26",
    title: "We're Just Getting Started",
    desc: "More products, more farms, more cities. The journey to bring pure spices to every Bangladeshi kitchen has only just begun.",
  },
];

const values = [
  {
    icon: "science",
    color: "text-secondary",
    bg: "bg-secondary-container",
    title: "Purity First",
    desc: "Every product is lab-tested for contaminants, moisture, and adulterants before it's packed. No batch skips the test — ever.",
  },
  {
    icon: "agriculture",
    color: "text-primary",
    bg: "bg-primary-container",
    title: "Direct from Farms",
    desc: "We source directly from certified farmers across South Asia. No middlemen means better prices for you and fairer pay for growers.",
  },
  {
    icon: "handshake",
    color: "text-tertiary",
    bg: "bg-tertiary-fixed",
    title: "Honest Pricing",
    desc: "We publish our sourcing costs quarterly. You pay for quality spice, not a marketing budget. Premium shouldn't mean exploitative.",
  },
  {
    icon: "eco",
    color: "text-secondary",
    bg: "bg-secondary-container",
    title: "Sustainable Packaging",
    desc: "Airtight, moisture-proof bags that keep spices fresh — and recyclable. We're working toward fully compostable packaging by 2026.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative pt-28 md:pt-48 pb-16 md:pb-section-gap px-6 md:px-container-padding min-h-[70vh] md:min-h-[80vh] flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-tertiary-fixed/30 to-background -z-10"></div>
        <div className="absolute top-32 right-8 md:right-20 w-32 md:w-64 h-32 md:h-64 rounded-full bg-primary-container/25 blur-3xl -z-10"></div>
        <div className="absolute bottom-16 left-8 md:left-24 w-40 md:w-72 h-40 md:h-72 rounded-full bg-secondary-container/30 blur-3xl -z-10"></div>

        <div className="inline-flex items-center gap-2 bg-surface/70 backdrop-blur-xl border border-outline-variant/50 rounded-full px-3 md:px-4 py-1.5 md:py-2 mb-6 md:mb-8 shadow-sm">
          <span className="bg-secondary-container text-on-secondary-container font-label-caps text-[10px] md:text-label-caps px-2 py-1 rounded-full uppercase">
            Our Story
          </span>
          <span className="font-body-md text-[11px] md:text-body-md text-on-surface">
            Founded in Dhaka, 2026
          </span>
        </div>

        <h1 className="font-display-xl text-[38px] md:text-[72px] leading-[1.1] tracking-tighter text-on-surface max-w-4xl mb-4 md:mb-6">
          Pure by Name.
          <br />
          Pure by Nature.
        </h1>
        <p className="font-body-lg text-[14px] md:text-body-lg text-on-surface-variant max-w-2xl mb-10 md:mb-14 px-2 md:px-0">
          Shuddhota means purity in Bengali. That's not a tagline — it's the single standard every
          product in our catalog must meet before it reaches your kitchen.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          <div className="flex flex-col items-center gap-1">
            <span className="font-display-xl text-[28px] md:text-[48px] font-bold text-primary leading-none">2026</span>
            <span className="font-body-md text-[11px] md:text-body-md text-on-surface-variant">Founded</span>
          </div>
          <div className="w-px h-10 bg-outline-variant/40 hidden sm:block"></div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-display-xl text-[28px] md:text-[48px] font-bold text-primary leading-none">50K+</span>
            <span className="font-body-md text-[11px] md:text-body-md text-on-surface-variant">Customers</span>
          </div>
          <div className="w-px h-10 bg-outline-variant/40 hidden sm:block"></div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-display-xl text-[28px] md:text-[48px] font-bold text-primary leading-none">200+</span>
            <span className="font-body-md text-[11px] md:text-body-md text-on-surface-variant">Products</span>
          </div>
          <div className="w-px h-10 bg-outline-variant/40 hidden sm:block"></div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-display-xl text-[28px] md:text-[48px] font-bold text-primary leading-none">100%</span>
            <span className="font-body-md text-[11px] md:text-body-md text-on-surface-variant">Lab Tested</span>
          </div>
        </div>
      </section>

      {/* ─── FOUNDING STORY ─── */}
      <section className="py-12 md:py-section-gap px-6 md:px-container-padding bg-surface relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-container/10 to-transparent"></div>
        <div className="max-w-[1120px] mx-auto bg-surface/80 backdrop-blur-2xl rounded-[32px] border border-outline-variant/30 shadow-[0_32px_64px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row min-h-[auto] md:min-h-[540px]">
          <div className="p-8 md:p-card-internal flex-1 flex flex-col justify-center">
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-4 md:mb-6 tracking-widest">
              The Beginning
            </span>
            <h2 className="font-headline-lg text-[26px] md:text-headline-lg text-on-surface mb-4 md:mb-6">
              It started with a bad curry.
            </h2>
            <p className="font-body-lg text-[14px] md:text-body-lg text-on-surface-variant mb-4 max-w-md">
              In early 2026, our founder grew frustrated by adulterated spices sold in local markets — products that smelled of nothing and did nothing for food. He drove to Narsingdi, found a turmeric farmer, bought a sack, and the difference was immediate.
            </p>
            <p className="font-body-lg text-[14px] md:text-body-lg text-on-surface-variant mb-8 md:mb-10 max-w-md">
              The first 50 packages were hand-packed at a kitchen table. Within two weeks there were 200 orders — all word of mouth. Shuddhota Co. was born from the simple idea that every Bangladeshi cook deserves spices as good as what the farmers themselves use.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                <span className="font-bold text-primary text-[15px] md:text-[17px]">F</span>
              </div>
              <div>
                <p className="font-body-md text-[13px] md:text-body-md text-on-surface font-semibold">Farrukh Rahman</p>
                <p className="text-[11px] md:text-body-md text-on-surface-variant">Founder & CEO, Shuddhota Co.</p>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-gradient-to-br from-primary-container/60 to-tertiary-fixed/40 relative overflow-hidden flex items-center justify-center border-t md:border-t-0 md:border-l border-outline-variant/20 min-h-[260px] md:min-h-0 p-6 md:p-8">
            <div className="w-full max-w-[340px] space-y-3 md:space-y-4">
              <div className="bg-surface/90 backdrop-blur rounded-2xl border border-white/50 shadow-lg p-4 md:p-5">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-[18px] md:text-[22px]">edit_note</span>
                  <span className="font-body-md text-[12px] md:text-body-md text-on-surface font-semibold">First order note, 2026</span>
                </div>
                <p className="text-[11px] md:text-body-md text-on-surface-variant italic leading-relaxed">
                  "Thank you for buying directly from me. This turmeric was harvested last week. I hope it makes your food taste the way it's supposed to."
                </p>
                <p className="text-[11px] md:text-body-md text-primary font-medium mt-2">— Rafiq, Narsingdi farmer</p>
              </div>
              <div className="bg-surface/90 backdrop-blur rounded-2xl border border-white/50 shadow-lg p-4 md:p-5 flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary text-[18px] md:text-[22px]">local_shipping</span>
                </div>
                <div>
                  <p className="font-body-md text-[12px] md:text-body-md text-on-surface font-semibold">50 → 50,000 orders</p>
                  <p className="text-[11px] md:text-body-md text-on-surface-variant">Dhaka kitchen table to nationwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CORE VALUES ─── */}
      <section className="py-12 md:py-section-gap px-6 md:px-container-padding bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-12">
            <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest mb-2 block">WHAT WE STAND FOR</span>
            <h2 className="font-display-xl text-[28px] md:text-[52px] leading-tight text-on-surface max-w-xl">
              Four principles. Non-negotiable.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-surface rounded-[24px] border border-outline-variant/40 shadow-md p-6 md:p-8 flex gap-4 md:gap-5">
                <div className={`w-11 h-11 md:w-14 md:h-14 rounded-2xl ${v.bg} flex items-center justify-center shrink-0`}>
                  <span className={`material-symbols-outlined ${v.color} text-[22px] md:text-[28px]`}>{v.icon}</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-[15px] md:text-headline-md text-on-surface mb-2">{v.title}</h3>
                  <p className="font-body-md text-[12px] md:text-body-md text-on-surface-variant leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TIMELINE ─── */}
      <section className="py-12 md:py-section-gap px-6 md:px-container-padding bg-surface relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(#ff8a65 1px, transparent 1px)", backgroundSize: "32px 32px", opacity: 0.07 }}></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-10 md:mb-16">
            <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest mb-2 block">OUR JOURNEY</span>
            <h2 className="font-display-xl text-[28px] md:text-[52px] leading-tight text-on-surface">Our journey so far.</h2>
          </div>
          {/* Desktop timeline */}
          <div className="hidden md:block relative">
            <div className="absolute top-7 left-0 right-0 h-0.5 bg-outline-variant/30"></div>
            <div className="grid grid-cols-5 gap-4 relative">
              {milestones.map((m, i) => (
                <div key={m.year} className="flex flex-col items-center text-center">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md border-2 border-surface z-10 relative mb-4 ${i === milestones.length - 1 ? "bg-primary text-on-primary" : "bg-surface border-outline-variant/40"}`}>
                    <span className={`font-bold text-[12px] ${i === milestones.length - 1 ? "text-on-primary" : "text-on-surface"}`}>{m.year}</span>
                  </div>
                  <h4 className="font-headline-md text-[14px] text-on-surface mb-2">{m.title}</h4>
                  <p className="font-body-md text-[11px] text-on-surface-variant leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Mobile timeline */}
          <div className="md:hidden relative pl-8">
            <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-outline-variant/30"></div>
            <div className="space-y-6">
              {milestones.map((m, i) => (
                <div key={m.year} className="relative">
                  <div className={`absolute -left-8 w-7 h-7 rounded-full flex items-center justify-center border-2 border-surface ${i === milestones.length - 1 ? "bg-primary" : "bg-surface-container-high border-outline-variant/40"}`}>
                    <div className={`w-2 h-2 rounded-full ${i === milestones.length - 1 ? "bg-on-primary" : "bg-outline"}`}></div>
                  </div>
                  <div className="bg-surface rounded-2xl border border-outline-variant/40 shadow-sm p-4">
                    <span className="font-label-caps text-label-caps text-primary tracking-widest mb-1 block">{m.year}</span>
                    <h4 className="font-headline-md text-[14px] text-on-surface mb-1.5">{m.title}</h4>
                    <p className="font-body-md text-[11px] text-on-surface-variant leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOURCING PROCESS ─── */}
      <section className="py-12 md:py-section-gap px-6 md:px-container-padding relative">
        <div className="absolute inset-0 bg-gradient-to-br from-tertiary-fixed-dim/20 to-inverse-primary/20 -z-10"></div>
        <div className="max-w-[1120px] mx-auto bg-surface/80 backdrop-blur-2xl rounded-[32px] border border-outline-variant/30 shadow-[0_32px_64px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row-reverse min-h-[auto] md:min-h-[540px]">
          <div className="p-8 md:p-card-internal flex-1 flex flex-col justify-center">
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-4 md:mb-6 tracking-widest">How It Works</span>
            <h2 className="font-headline-lg text-[26px] md:text-headline-lg text-on-surface mb-4 md:mb-6">
              Farm to packet<br />in four steps.
            </h2>
            <p className="font-body-lg text-[14px] md:text-body-lg text-on-surface-variant mb-8 max-w-md">
              We control the entire chain — from the field to your front door. Each step has a named person responsible for it. That's why we can guarantee what's on the label.
            </p>
            <Link className="inline-flex items-center gap-2 bg-on-surface text-surface font-body-md text-[13px] md:text-body-md font-medium px-6 md:px-8 py-3 md:py-4 rounded-full w-fit hover:bg-on-surface/90 transition-colors" href="#">
              View Lab Reports
            </Link>
          </div>
          <div className="flex-1 bg-surface-variant/40 flex items-center justify-center border-t md:border-t-0 md:border-r border-outline-variant/20 p-6 md:p-8 min-h-[280px] md:min-h-0">
            <div className="w-full max-w-[340px] space-y-3">
              {[
                { icon: "location_on", label: "Farm Audit", detail: "Certified & visited in person", color: "text-primary" },
                { icon: "science", label: "Lab Testing", detail: "Every batch, every time", color: "text-secondary" },
                { icon: "package_2", label: "Airtight Packing", detail: "Moisture-proof within 24hr", color: "text-tertiary" },
                { icon: "local_shipping", label: "Same-day Dispatch", detail: "Orders before 2PM ship today", color: "text-primary" },
              ].map((step) => (
                <div key={step.label} className="bg-surface/90 backdrop-blur rounded-2xl border border-white/50 shadow p-3 md:p-4 flex items-center gap-3 md:gap-4">
                  <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0">
                    <span className={`material-symbols-outlined ${step.color} text-[18px] md:text-[22px]`}>{step.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body-md text-[12px] md:text-body-md text-on-surface font-semibold">{step.label}</p>
                    <p className="text-[10px] md:text-[12px] text-on-surface-variant truncate">{step.detail}</p>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-secondary/15 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary text-[13px]">check</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TEAM ─── */}
      <section className="py-12 md:py-section-gap px-6 md:px-container-padding bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 md:mb-12 gap-3">
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest mb-2 block">THE TEAM</span>
              <h2 className="font-display-xl text-[28px] md:text-[48px] leading-tight text-on-surface">
                The people behind the purity.
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-surface-container-low rounded-[24px] border border-outline-variant/30 shadow-md p-5 md:p-6 flex flex-col gap-3">
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${member.color} flex items-center justify-center`}>
                  <span className={`font-bold text-[22px] md:text-[26px] ${member.textColor}`}>{member.initial}</span>
                </div>
                <div>
                  <h4 className="font-headline-md text-[14px] md:text-headline-md text-on-surface mb-0.5">{member.name}</h4>
                  <span className="font-label-caps text-[10px] text-on-surface-variant tracking-widest uppercase">{member.role}</span>
                </div>
                <p className="font-body-md text-[11px] md:text-body-md text-on-surface-variant leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CERTIFICATIONS ─── */}
      <section className="py-8 md:py-14 px-6 md:px-container-padding bg-surface-container-low border-y border-outline-variant/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 md:mb-10">
            <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest mb-2 block">CERTIFICATIONS & TRUST</span>
            <h2 className="font-display-xl text-[22px] md:text-[36px] text-on-surface">Our quality, independently verified.</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {[
              { icon: "verified", color: "text-secondary", bg: "bg-secondary-container", label: "BSTI Certified", sub: "Bangladesh Standards & Testing" },
              { icon: "science", color: "text-tertiary", bg: "bg-tertiary-fixed", label: "Lab Tested", sub: "Every batch, independent lab" },
              { icon: "eco", color: "text-primary", bg: "bg-primary-fixed", label: "100% Natural", sub: "No additives, ever" },
              { icon: "agriculture", color: "text-secondary", bg: "bg-secondary-container", label: "Farm Audited", sub: "Annual on-site visits" },
            ].map((cert) => (
              <div key={cert.label} className="flex flex-col items-center text-center gap-2 md:gap-3 p-4 md:p-6 rounded-[20px] md:rounded-[24px] bg-surface">
                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full ${cert.bg} flex items-center justify-center`}>
                  <span className={`material-symbols-outlined ${cert.color} text-[20px] md:text-[28px]`}>{cert.icon}</span>
                </div>
                <h4 className="font-headline-md text-[13px] md:text-headline-md text-on-surface">{cert.label}</h4>
                <p className="font-body-md text-[10px] md:text-body-md text-on-surface-variant leading-snug">{cert.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-12 md:py-section-gap px-6 md:px-container-padding bg-primary relative overflow-hidden flex items-center justify-center min-h-[50vh] md:min-h-[60vh]">
        <div className="absolute w-[500px] h-[500px] md:w-[800px] md:h-[800px] border-[60px] md:border-[100px] border-white/10 rounded-full top-[-150px] md:top-[-200px] right-[-150px] md:right-[-200px]"></div>
        <div className="absolute w-[350px] h-[350px] md:w-[600px] md:h-[600px] border-[40px] md:border-[60px] border-black/5 rounded-full bottom-[-80px] md:bottom-[-100px] left-[-80px] md:left-[-100px]"></div>
        <div className="relative z-10 bg-surface rounded-[28px] md:rounded-[40px] p-8 md:p-16 max-w-3xl w-full text-center shadow-2xl border border-white/20 backdrop-blur-sm">
          <h2 className="font-display-xl text-[28px] md:text-[56px] leading-tight text-on-surface mb-4 md:mb-6">
            Taste the difference for yourself.
          </h2>
          <p className="font-body-lg text-[13px] md:text-body-lg text-on-surface-variant mb-8 md:mb-10 max-w-md mx-auto">
            Every first order comes with a sample of our best-selling Garam Masala Blend — free, no strings attached.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link className="inline-flex items-center justify-center gap-2 md:gap-3 bg-on-surface text-surface font-body-lg text-[14px] md:text-body-lg font-medium px-7 md:px-10 py-3.5 md:py-5 rounded-full hover:scale-105 transition-transform shadow-xl group" href="/products">
              Shop Now
              <span className="material-symbols-outlined text-secondary-fixed group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
            <Link className="inline-flex items-center justify-center gap-2 bg-surface text-on-surface border border-outline-variant/40 font-body-md text-[13px] md:text-body-md font-medium px-6 md:px-8 py-3.5 md:py-5 rounded-full hover:bg-surface-variant transition-colors shadow-md" href="/contact">
              <span className="material-symbols-outlined text-[16px] md:text-[18px]">mail</span>
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}