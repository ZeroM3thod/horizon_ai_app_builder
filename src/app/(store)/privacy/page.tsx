"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const tocItems = [
  { id: "overview", label: "1. Overview" },
  { id: "collect", label: "2. Data We Collect" },
  { id: "how-we-use", label: "3. How We Use Data" },
  { id: "sharing", label: "4. Sharing Your Data" },
  { id: "cookies", label: "5. Cookies & Tracking" },
  { id: "retention", label: "6. Data Retention" },
  { id: "security", label: "7. Security" },
  { id: "rights", label: "8. Your Rights" },
  { id: "children", label: "9. Children's Privacy" },
  { id: "external", label: "10. External Links" },
  { id: "policy-changes", label: "11. Policy Changes" },
  { id: "contact-privacy", label: "12. Contact Us" },
];

export default function PrivacyPage() {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    // ─── Section fade-in on scroll ───
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            sectionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    const blocks = document.querySelectorAll(".section-block");
    blocks.forEach((el) => sectionObserver.observe(el));

    // ─── TOC active highlight ───
    const tocObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    const sections = document.querySelectorAll(".section-block");
    sections.forEach((s) => tocObserver.observe(s));

    return () => {
      sectionObserver.disconnect();
      tocObserver.disconnect();
    };
  }, []);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* Sticky TOC active state */
            .toc-link { transition: all 0.2s ease; }
            .toc-link.active { color: #9f4122; font-weight: 600; padding-left: 12px; border-left: 3px solid #9f4122; }

            /* Section fade-in */
            .section-block {
              opacity: 0;
              transform: translateY(20px);
              transition: opacity 0.5s ease, transform 0.5s ease;
            }
            .section-block.visible {
              opacity: 1;
              transform: translateY(0);
            }
            /* Decorative blob */
            .blob {
              position: absolute;
              border-radius: 9999px;
              filter: blur(64px);
              pointer-events: none;
              z-index: 0;
            }
            /* Data type cards hover */
            .data-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
            .data-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(159,65,34,0.10); }
          `,
        }}
      />

      {/* ─── HERO HEADER ─── */}
      <section className="relative pt-32 md:pt-44 pb-12 md:pb-20 px-6 md:px-16 overflow-hidden">
        {/* Decorative blobs */}
        <div className="blob w-[360px] h-[360px] bg-tertiary-container/30 top-16 right-[-60px]"></div>
        <div className="blob w-[280px] h-[280px] bg-secondary-container/25 bottom-0 left-[-40px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-tertiary-fixed/20 to-background -z-10"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-surface/70 backdrop-blur-xl border border-outline-variant/50 rounded-full px-4 py-2 mb-6 shadow-sm">
            <span className="bg-tertiary-container/40 text-on-tertiary-container font-label-caps text-[10px] md:text-label-caps px-2.5 py-1 rounded-full uppercase tracking-widest">
              Legal
            </span>
            <span className="font-body-md text-[12px] md:text-body-md text-on-surface-variant">
              Last updated: December 2024
            </span>
          </div>

          <h1 className="font-display-xl text-[36px] md:text-[64px] leading-[1.08] tracking-tighter text-on-surface mb-4 md:mb-6">
            Privacy
            <br />
            Policy
          </h1>
          <p className="font-body-lg text-[14px] md:text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Your privacy matters to us. This policy explains what data we collect, why we collect it, and how we keep it safe — in plain language, no legal maze.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <div className="flex items-center gap-2 bg-surface/80 border border-outline-variant/40 rounded-full px-4 py-2 shadow-sm">
              <span className="material-symbols-outlined text-secondary text-[16px]">lock</span>
              <span className="text-[12px] text-on-surface-variant font-medium">Data Encrypted</span>
            </div>
            <div className="flex items-center gap-2 bg-surface/80 border border-outline-variant/40 rounded-full px-4 py-2 shadow-sm">
              <span className="material-symbols-outlined text-secondary text-[16px]">shield</span>
              <span className="text-[12px] text-on-surface-variant font-medium">Never Sold to Third Parties</span>
            </div>
            <div className="flex items-center gap-2 bg-surface/80 border border-outline-variant/40 rounded-full px-4 py-2 shadow-sm">
              <span className="material-symbols-outlined text-secondary text-[16px]">delete</span>
              <span className="text-[12px] text-on-surface-variant font-medium">Right to Delete</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT AREA ─── */}
      <section className="pb-24 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            {/* ─── STICKY TOC ─── */}
            <aside className="hidden lg:block lg:w-72 shrink-0">
              <div className="sticky top-28">
                <div className="bg-surface border border-outline-variant/30 rounded-[24px] p-6 shadow-sm">
                  <h3 className="font-body-md font-semibold text-on-surface uppercase tracking-widest text-[11px] mb-5">
                    Contents
                  </h3>
                  <nav className="flex flex-col gap-1">
                    {tocItems.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`toc-link text-[14px] text-on-surface-variant hover:text-primary py-1.5 px-3 rounded-lg hover:bg-surface-variant transition-all ${
                          activeId === item.id ? "active" : ""
                        }`}
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </div>

                {/* Also See Card */}
                <div className="mt-4 bg-primary/8 border border-primary/20 rounded-[24px] p-6">
                  <p className="text-[13px] text-on-surface-variant mb-3">Also read our</p>
                  <Link
                    href="/terms"
                    className="flex items-center gap-2 text-primary font-semibold text-[14px] hover:gap-3 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">gavel</span>
                    Terms &amp; Conditions
                    <span className="material-symbols-outlined text-[16px] ml-auto">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </aside>

            {/* ─── CONTENT ─── */}
            <div className="flex-1 min-w-0">
              {/* Intro card */}
              <div className="section-block bg-surface border border-outline-variant/30 rounded-[28px] p-7 md:p-10 mb-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center shrink-0 mt-1">
                    <span className="material-symbols-outlined text-tertiary text-[22px]">privacy_tip</span>
                  </div>
                  <div>
                    <h2 className="font-headline-md text-on-surface mb-2">Your Privacy, Our Commitment</h2>
                    <p className="text-on-surface-variant text-[15px] leading-relaxed">
                      Khati Family (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) is committed to protecting your personal information. This Privacy Policy describes how we collect, use, store, and share data when you visit our website or place an order. We operate in accordance with applicable Bangladeshi data protection standards. By using our services, you consent to the practices described here.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 1 */}
              <div
                id="overview"
                className="section-block bg-surface border border-outline-variant/30 rounded-[28px] p-7 md:p-10 mb-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    01
                  </span>
                  <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">
                    Overview
                  </h2>
                </div>
                <div className="space-y-4 text-on-surface-variant text-[15px] leading-relaxed">
                  <p>
                    This Privacy Policy applies to all personal information collected through our website, mobile-optimised pages, customer service channels, and any other interactions you may have with Khati Family.
                  </p>
                  <p>
                    We act as the data controller for the personal information you provide. We take this responsibility seriously and have put in place appropriate technical and organisational measures to protect your data.
                  </p>
                </div>
              </div>

              {/* Section 2 — Data We Collect */}
              <div
                id="collect"
                className="section-block bg-surface border border-outline-variant/30 rounded-[28px] p-7 md:p-10 mb-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    02
                  </span>
                  <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">
                    Data We Collect
                  </h2>
                </div>
                <div className="space-y-5 text-on-surface-variant text-[15px] leading-relaxed">
                  <p>
                    We collect data in three ways: information you provide directly, information collected automatically, and information from third parties.
                  </p>

                  {/* Data cards grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div className="data-card bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5">
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className="material-symbols-outlined text-primary text-[20px]">person</span>
                        <h4 className="font-semibold text-on-surface text-[14px]">Personal Identity</h4>
                      </div>
                      <ul className="space-y-1.5 text-[13px]">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0"></span>Full name
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0"></span>Phone number
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0"></span>Email address
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0"></span>Date of birth (optional)
                        </li>
                      </ul>
                    </div>
                    <div className="data-card bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5">
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className="material-symbols-outlined text-primary text-[20px]">
                          home_pin
                        </span>
                        <h4 className="font-semibold text-on-surface text-[14px]">Delivery &amp; Billing</h4>
                      </div>
                      <ul className="space-y-1.5 text-[13px]">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0"></span>Delivery address
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0"></span>District &amp; division
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0"></span>Postal code
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0"></span>Billing address
                        </li>
                      </ul>
                    </div>
                    <div className="data-card bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5">
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className="material-symbols-outlined text-primary text-[20px]">
                          shopping_bag
                        </span>
                        <h4 className="font-semibold text-on-surface text-[14px]">Transaction Data</h4>
                      </div>
                      <ul className="space-y-1.5 text-[13px]">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0"></span>Order history &amp; items
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0"></span>Payment method type
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0"></span>Transaction amounts
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0"></span>Refund records
                        </li>
                      </ul>
                    </div>
                    <div className="data-card bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5">
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className="material-symbols-outlined text-primary text-[20px]">
                          devices
                        </span>
                        <h4 className="font-semibold text-on-surface text-[14px]">Technical Data</h4>
                      </div>
                      <ul className="space-y-1.5 text-[13px]">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0"></span>IP address
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0"></span>Browser type &amp; version
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0"></span>Pages visited &amp; duration
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0"></span>Referring website
                        </li>
                      </ul>
                    </div>
                  </div>

                  <p>
                    We do <strong className="text-on-surface font-semibold">not</strong> store full credit/debit card numbers. Payment card processing is handled exclusively by our PCI-DSS compliant payment partners (e.g., SSL Commerz, bKash, Nagad).
                  </p>
                </div>
              </div>

              {/* Section 3 */}
              <div
                id="how-we-use"
                className="section-block bg-surface border border-outline-variant/30 rounded-[28px] p-7 md:p-10 mb-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    03
                  </span>
                  <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">
                    How We Use Your Data
                  </h2>
                </div>
                <div className="space-y-3 text-on-surface-variant text-[15px] leading-relaxed">
                  <p>We use your data only for legitimate business purposes. Specifically:</p>
                  <div className="space-y-3 mt-2">
                    <div className="flex items-start gap-3 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20">
                      <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                        inventory_2
                      </span>
                      <div>
                        <p className="font-semibold text-on-surface text-[14px] mb-1">Order Fulfilment</p>
                        <p className="text-[13px]">
                          Processing, packaging, delivering your orders, and communicating order status updates to you.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20">
                      <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                        support_agent
                      </span>
                      <div>
                        <p className="font-semibold text-on-surface text-[14px] mb-1">Customer Service</p>
                        <p className="text-[13px]">
                          Responding to queries, handling returns, resolving complaints, and improving the quality of our support.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20">
                      <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                        notifications
                      </span>
                      <div>
                        <p className="font-semibold text-on-surface text-[14px] mb-1">
                          Marketing &amp; Promotions
                        </p>
                        <p className="text-[13px]">
                          Sending offers, new product announcements, and seasonal deals — only if you have opted in. You can unsubscribe at any time.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20">
                      <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                        analytics
                      </span>
                      <div>
                        <p className="font-semibold text-on-surface text-[14px] mb-1">Site Improvement</p>
                        <p className="text-[13px]">
                          Analysing browsing patterns to improve our website, fix bugs, and understand which products our customers love most.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20">
                      <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                        verified_user
                      </span>
                      <div>
                        <p className="font-semibold text-on-surface text-[14px] mb-1">
                          Fraud Prevention &amp; Compliance
                        </p>
                        <p className="text-[13px]">
                          Detecting and preventing fraudulent transactions and fulfilling our legal obligations under Bangladeshi law.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div
                id="sharing"
                className="section-block bg-surface border border-outline-variant/30 rounded-[28px] p-7 md:p-10 mb-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    04
                  </span>
                  <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">
                    Sharing Your Data
                  </h2>
                </div>
                <div className="space-y-4 text-on-surface-variant text-[15px] leading-relaxed">
                  <p>
                    <strong className="text-on-surface font-semibold">We do not sell your personal data.</strong> We may share your data only with trusted partners who help us run our business, and only to the extent necessary.
                  </p>

                  <div className="space-y-3 mt-2">
                    <div className="flex items-start gap-3 border-l-2 border-primary/30 pl-4 py-1">
                      <div>
                        <p className="font-semibold text-on-surface text-[14px] mb-0.5">Delivery Partners</p>
                        <p className="text-[13px]">
                          We share your name, phone number, and delivery address with courier services (e.g., Pathao, Redx, Sundarban Courier) solely to complete your delivery.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 border-l-2 border-primary/30 pl-4 py-1">
                      <div>
                        <p className="font-semibold text-on-surface text-[14px] mb-0.5">Payment Processors</p>
                        <p className="text-[13px]">
                          Your payment details are processed by our payment partners under their own security and privacy standards. We never store raw payment credentials.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 border-l-2 border-primary/30 pl-4 py-1">
                      <div>
                        <p className="font-semibold text-on-surface text-[14px] mb-0.5">Legal Authorities</p>
                        <p className="text-[13px]">
                          We may disclose your data if required by Bangladeshi law, court order, or to protect our legal rights, property, or safety.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Assurance pill */}
                  <div className="flex items-start gap-3 bg-secondary-container/30 border border-secondary/20 rounded-2xl p-4 mt-2">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                      handshake
                    </span>
                    <p className="text-[13px] text-on-surface-variant">
                      All third-party service providers we work with are contractually required to protect your data and use it only for the purpose it was shared.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 5 */}
              <div
                id="cookies"
                className="section-block bg-surface border border-outline-variant/30 rounded-[28px] p-7 md:p-10 mb-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    05
                  </span>
                  <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">
                    Cookies &amp; Tracking
                  </h2>
                </div>
                <div className="space-y-4 text-on-surface-variant text-[15px] leading-relaxed">
                  <p>
                    Our website uses cookies — small text files stored on your device — to help us deliver a better, faster experience. We use three types:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                    <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5">
                      <span className="material-symbols-outlined text-primary text-[22px] mb-2 block">cookie</span>
                      <h4 className="font-semibold text-on-surface text-[14px] mb-1">Essential</h4>
                      <p className="text-[12px]">
                        Required for the website to function — login sessions, cart, security tokens. Cannot be disabled.
                      </p>
                    </div>
                    <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5">
                      <span className="material-symbols-outlined text-tertiary text-[22px] mb-2 block font-bold">
                        bar_chart
                      </span>
                      <h4 className="font-semibold text-on-surface text-[14px] mb-1">Analytics</h4>
                      <p className="text-[12px]">
                        Help us understand how visitors use the site so we can improve it. Collected anonymously.
                      </p>
                    </div>
                    <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5">
                      <span className="material-symbols-outlined text-secondary text-[22px] mb-2 block">
                        ads_click
                      </span>
                      <h4 className="font-semibold text-on-surface text-[14px] mb-1">Marketing</h4>
                      <p className="text-[12px]">
                        Used to show relevant offers. Enabled only if you consent. You can opt out at any time.
                      </p>
                    </div>
                  </div>
                  <p>
                    You can manage or disable non-essential cookies through your browser settings at any time. Note that disabling certain cookies may affect website functionality.
                  </p>
                </div>
              </div>

              {/* Section 6 */}
              <div
                id="retention"
                className="section-block bg-surface border border-outline-variant/30 rounded-[28px] p-7 md:p-10 mb-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    06
                  </span>
                  <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">
                    Data Retention
                  </h2>
                </div>
                <div className="space-y-4 text-on-surface-variant text-[15px] leading-relaxed">
                  <p>
                    We retain your personal data only for as long as necessary to fulfil the purposes described in this policy, or as required by law.
                  </p>
                  {/* Retention table */}
                  <div className="overflow-hidden rounded-2xl border border-outline-variant/30 mt-2">
                    <table className="w-full text-[13px]">
                      <thead>
                        <tr className="bg-surface-variant/60">
                          <th className="text-left text-on-surface font-semibold px-5 py-3">Data Type</th>
                          <th className="text-left text-on-surface font-semibold px-5 py-3">Retention Period</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/20">
                        <tr className="hover:bg-surface-container-low transition-colors">
                          <td className="px-5 py-3 text-on-surface-variant">Account &amp; order data</td>
                          <td className="px-5 py-3 text-on-surface-variant">5 years after last purchase</td>
                        </tr>
                        <tr className="hover:bg-surface-container-low transition-colors">
                          <td className="px-5 py-3 text-on-surface-variant">Payment records</td>
                          <td className="px-5 py-3 text-on-surface-variant">7 years (legal requirement)</td>
                        </tr>
                        <tr className="hover:bg-surface-container-low transition-colors">
                          <td className="px-5 py-3 text-on-surface-variant">Marketing preferences</td>
                          <td className="px-5 py-3 text-on-surface-variant">Until you unsubscribe</td>
                        </tr>
                        <tr className="hover:bg-surface-container-low transition-colors">
                          <td className="px-5 py-3 text-on-surface-variant">Website analytics</td>
                          <td className="px-5 py-3 text-on-surface-variant">26 months (anonymised)</td>
                        </tr>
                        <tr className="hover:bg-surface-container-low transition-colors">
                          <td className="px-5 py-3 text-on-surface-variant">Customer service records</td>
                          <td className="px-5 py-3 text-on-surface-variant">3 years from resolution</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p>When your data is no longer required, it is securely deleted or anonymised.</p>
                </div>
              </div>

              {/* Section 7 */}
              <div
                id="security"
                className="section-block bg-surface border border-outline-variant/30 rounded-[28px] p-7 md:p-10 mb-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    07
                  </span>
                  <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">
                    Security
                  </h2>
                </div>
                <div className="space-y-4 text-on-surface-variant text-[15px] leading-relaxed">
                  <p>
                    We implement industry-standard security measures to protect your data against unauthorised access, disclosure, or destruction, including:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                    <div className="flex flex-col items-center text-center gap-2 bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4">
                      <span className="material-symbols-outlined text-primary text-[24px]">https</span>
                      <p className="text-[12px] font-medium text-on-surface">SSL / TLS Encryption</p>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2 bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4">
                      <span className="material-symbols-outlined text-primary text-[24px]">password</span>
                      <p className="text-[12px] font-medium text-on-surface">Hashed Passwords</p>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2 bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4">
                      <span className="material-symbols-outlined text-primary text-[24px]">
                        admin_panel_settings
                      </span>
                      <p className="text-[12px] font-medium text-on-surface">Access Controls</p>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2 bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4">
                      <span className="material-symbols-outlined text-primary text-[24px]">monitor_heart</span>
                      <p className="text-[12px] font-medium text-on-surface">Regular Audits</p>
                    </div>
                  </div>
                  <p>
                    Despite our best efforts, no online service can guarantee absolute security. If you suspect unauthorised access to your account, please contact us immediately.
                  </p>
                </div>
              </div>

              {/* Section 8 — Your Rights */}
              <div
                id="rights"
                className="section-block bg-surface border border-outline-variant/30 rounded-[28px] p-7 md:p-10 mb-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    08
                  </span>
                  <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">
                    Your Rights
                  </h2>
                </div>
                <div className="space-y-4 text-on-surface-variant text-[15px] leading-relaxed">
                  <p>
                    You have the following rights regarding your personal data. To exercise any of these, contact us at{" "}
                    <a href="mailto:privacy@khatifamily.com" className="text-primary font-medium hover:underline">
                      privacy@khatifamily.com
                    </a>
                    .
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    <div className="flex items-start gap-3 bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4">
                      <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0 mt-0.5">
                        visibility
                      </span>
                      <div>
                        <p className="font-semibold text-on-surface text-[13px] mb-0.5">Right to Access</p>
                        <p className="text-[12px]">Request a copy of the personal data we hold about you.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4">
                      <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0 mt-0.5">edit</span>
                      <div>
                        <p className="font-semibold text-on-surface text-[13px] mb-0.5">Right to Rectification</p>
                        <p className="text-[12px]">Ask us to correct inaccurate or incomplete data.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4">
                      <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0 mt-0.5">
                        delete_forever
                      </span>
                      <div>
                        <p className="font-semibold text-on-surface text-[13px] mb-0.5">Right to Erasure</p>
                        <p className="text-[12px]">
                          Request deletion of your data, subject to legal retention obligations.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4">
                      <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0 mt-0.5">block</span>
                      <div>
                        <p className="font-semibold text-on-surface text-[13px] mb-0.5">Right to Object</p>
                        <p className="text-[12px]">Opt out of direct marketing or object to data processing.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4">
                      <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0 mt-0.5">
                        download
                      </span>
                      <div>
                        <p className="font-semibold text-on-surface text-[13px] mb-0.5">Right to Portability</p>
                        <p className="text-[12px]">
                          Receive your data in a machine-readable format where applicable.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4">
                      <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0 mt-0.5">
                        pause_circle
                      </span>
                      <div>
                        <p className="font-semibold text-on-surface text-[13px] mb-0.5">Right to Restrict</p>
                        <p className="text-[12px]">Limit the processing of your data in certain circumstances.</p>
                      </div>
                    </div>
                  </div>
                  <p>
                    We will respond to all requests within{" "}
                    <strong className="text-on-surface font-semibold">30 calendar days</strong>. We may need to verify your identity before fulfilling the request.
                  </p>
                </div>
              </div>

              {/* Section 9 */}
              <div
                id="children"
                className="section-block bg-surface border border-outline-variant/30 rounded-[28px] p-7 md:p-10 mb-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    09
                  </span>
                  <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">
                    Children&apos;s Privacy
                  </h2>
                </div>
                <div className="space-y-4 text-on-surface-variant text-[15px] leading-relaxed">
                  <p>
                    Our website and services are not directed at children under the age of 13. We do not knowingly collect personal data from children. If you believe a child has provided us with personal information, please contact us and we will promptly delete it.
                  </p>
                  <p>If you are between 13 and 18 years old, please use our website with parental guidance.</p>
                </div>
              </div>

              {/* Section 10 */}
              <div
                id="external"
                className="section-block bg-surface border border-outline-variant/30 rounded-[28px] p-7 md:p-10 mb-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    10
                  </span>
                  <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">
                    External Links
                  </h2>
                </div>
                <div className="space-y-4 text-on-surface-variant text-[15px] leading-relaxed">
                  <p>
                    Our website may contain links to third-party websites (for example, social media platforms or payment portals). These sites have their own privacy policies, and we are not responsible for their practices. We encourage you to read their policies before providing any personal information.
                  </p>
                </div>
              </div>

              {/* Section 11 */}
              <div
                id="policy-changes"
                className="section-block bg-surface border border-outline-variant/30 rounded-[28px] p-7 md:p-10 mb-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    11
                  </span>
                  <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">
                    Policy Changes
                  </h2>
                </div>
                <div className="space-y-4 text-on-surface-variant text-[15px] leading-relaxed">
                  <p>
                    We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or technology. The &quot;Last updated&quot; date at the top of this page indicates when revisions were last made.
                  </p>
                  <p>
                    Material changes will be communicated via email or a prominent banner on our website. We encourage you to review this page periodically. Your continued use of our website after any changes constitutes acceptance of the revised policy.
                  </p>
                </div>
              </div>

              {/* Section 12 — Contact */}
              <div
                id="contact-privacy"
                className="section-block bg-primary rounded-[28px] p-7 md:p-10 mb-6 relative overflow-hidden"
              >
                <div className="absolute w-[300px] h-[300px] border-[50px] border-white/10 rounded-full -top-20 -right-20"></div>
                <div className="absolute w-[200px] h-[200px] border-[30px] border-black/5 rounded-full -bottom-10 -left-10"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[11px] font-bold text-on-primary/70 bg-white/20 px-3 py-1.5 rounded-full uppercase tracking-wider">
                      12
                    </span>
                    <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-primary">
                      Contact Our Privacy Team
                    </h2>
                  </div>
                  <p className="text-on-primary/80 text-[15px] leading-relaxed mb-6">
                    Questions, requests, or concerns about your data? Our privacy team is here to help.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <a
                      href="mailto:privacy@khatifamily.com"
                      className="flex items-center gap-3 bg-white/15 hover:bg-white/25 transition-colors rounded-2xl px-4 py-4 backdrop-blur-sm"
                    >
                      <span className="material-symbols-outlined text-on-primary text-[22px]">mail</span>
                      <div>
                        <p className="text-[11px] text-on-primary/60 uppercase tracking-wider mb-0.5">Email</p>
                        <p className="text-[13px] text-on-primary font-semibold">privacy@khatifamily.com</p>
                      </div>
                    </a>
                    <a
                      href="tel:+8801700000000"
                      className="flex items-center gap-3 bg-white/15 hover:bg-white/25 transition-colors rounded-2xl px-4 py-4 backdrop-blur-sm"
                    >
                      <span className="material-symbols-outlined text-on-primary text-[22px]">phone</span>
                      <div>
                        <p className="text-[11px] text-on-primary/60 uppercase tracking-wider mb-0.5">Phone</p>
                        <p className="text-[13px] text-on-primary font-semibold">+880 1700-000000</p>
                      </div>
                    </a>
                    <div className="flex items-center gap-3 bg-white/15 rounded-2xl px-4 py-4 backdrop-blur-sm">
                      <span className="material-symbols-outlined text-on-primary text-[22px]">schedule</span>
                      <div>
                        <p className="text-[11px] text-on-primary/60 uppercase tracking-wider mb-0.5">Response Time</p>
                        <p className="text-[13px] text-on-primary font-semibold">Within 30 days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end content */}
          </div>
          {/* end flex row */}
        </div>
      </section>
    </>
  );
}
