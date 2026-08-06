"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const tocItems = [
  { id: "acceptance", label: "1. Acceptance of Terms" },
  { id: "eligibility", label: "2. Eligibility" },
  { id: "products", label: "3. Products & Descriptions" },
  { id: "orders", label: "4. Orders & Payment" },
  { id: "pricing", label: "5. Pricing & Promotions" },
  { id: "shipping", label: "6. Shipping & Delivery" },
  { id: "returns", label: "7. Returns & Refunds" },
  { id: "ip", label: "8. Intellectual Property" },
  { id: "liability", label: "9. Limitation of Liability" },
  { id: "conduct", label: "10. User Conduct" },
  { id: "governing", label: "11. Governing Law" },
  { id: "changes", label: "12. Changes to Terms" },
  { id: "contact-terms", label: "13. Contact Us" },
];

export default function TermsPage() {
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
          `,
        }}
      />

      {/* ─── HERO HEADER ─── */}
      <section className="relative pt-32 md:pt-44 pb-12 md:pb-20 px-6 md:px-16 overflow-hidden">
        {/* Decorative blobs */}
        <div className="blob w-[360px] h-[360px] bg-primary-container/25 top-16 right-[-60px]"></div>
        <div className="blob w-[280px] h-[280px] bg-secondary-container/30 bottom-0 left-[-40px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-tertiary-fixed/20 to-background -z-10"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-surface/70 backdrop-blur-xl border border-outline-variant/50 rounded-full px-4 py-2 mb-6 shadow-sm">
            <span className="bg-primary-container/30 text-on-primary-container font-label-caps text-[10px] md:text-label-caps px-2.5 py-1 rounded-full uppercase tracking-widest">
              Legal
            </span>
            <span className="font-body-md text-[12px] md:text-body-md text-on-surface-variant">
              Last updated: December 2024
            </span>
          </div>

          <h1 className="font-display-xl text-[36px] md:text-[64px] leading-[1.08] tracking-tighter text-on-surface mb-4 md:mb-6">
            Terms &amp;
            <br />
            Conditions
          </h1>
          <p className="font-body-lg text-[14px] md:text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            By shopping with Khati Family, you agree to these terms. Please read them carefully — they&apos;re written in plain language so you know exactly where you stand.
          </p>
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
                    href="/privacy"
                    className="flex items-center gap-2 text-primary font-semibold text-[14px] hover:gap-3 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">privacy_tip</span>
                    Privacy Policy
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
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <span className="material-symbols-outlined text-primary text-[22px]">info</span>
                  </div>
                  <div>
                    <h2 className="font-headline-md text-on-surface mb-2">Welcome to Khati Family</h2>
                    <p className="text-on-surface-variant text-[15px] leading-relaxed">
                      These Terms &amp; Conditions (&quot;Terms&quot;) govern your use of our website and your purchase of products from Khati Family (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). Khati Family is a registered business in Bangladesh, specialising in pure spices and premium dry foods. By accessing our website or placing an order, you confirm that you have read, understood, and agreed to these Terms.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 1 */}
              <div
                id="acceptance"
                className="section-block bg-surface border border-outline-variant/30 rounded-[28px] p-7 md:p-10 mb-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    01
                  </span>
                  <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">
                    Acceptance of Terms
                  </h2>
                </div>
                <div className="space-y-4 text-on-surface-variant text-[15px] leading-relaxed">
                  <p>
                    By visiting our website, creating an account, or completing a purchase, you enter into a legally binding agreement with Khati Family under these Terms. If you do not agree, please refrain from using our website or placing orders.
                  </p>
                  <p>
                    These Terms apply to all users of the site, including browsers, customers, merchants, and contributors of content.
                  </p>
                </div>
              </div>

              {/* Section 2 */}
              <div
                id="eligibility"
                className="section-block bg-surface border border-outline-variant/30 rounded-[28px] p-7 md:p-10 mb-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    02
                  </span>
                  <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">
                    Eligibility
                  </h2>
                </div>
                <div className="space-y-4 text-on-surface-variant text-[15px] leading-relaxed">
                  <p>
                    You must be at least 18 years of age to use this website and place orders. By agreeing to these Terms, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into a binding contract.
                  </p>
                  <p>
                    We currently serve customers within Bangladesh. Orders placed from outside our serviceable delivery areas may be cancelled and refunded in full.
                  </p>
                </div>
              </div>

              {/* Section 3 */}
              <div
                id="products"
                className="section-block bg-surface border border-outline-variant/30 rounded-[28px] p-7 md:p-10 mb-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    03
                  </span>
                  <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">
                    Products &amp; Descriptions
                  </h2>
                </div>
                <div className="space-y-4 text-on-surface-variant text-[15px] leading-relaxed">
                  <p>
                    We make every effort to display our products as accurately as possible, including images, weights, ingredient lists, and nutritional information. However, we do not warrant that product descriptions or other content on the site are complete, accurate, or error-free.
                  </p>
                  <p>
                    Product packaging, batch numbers, and appearance may vary slightly from images shown on the website. This does not constitute a defect.
                  </p>
                  <p>
                    All our spices and dry foods are sourced from BSTI-certified suppliers and undergo purity testing. Certifications and lab-test results are available upon request.
                  </p>
                  {/* Info pill */}
                  <div className="flex items-start gap-3 bg-secondary-container/30 border border-secondary/20 rounded-2xl p-4 mt-2">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                      eco
                    </span>
                    <p className="text-[13px] text-on-surface-variant">
                      All Khati Family products are 100% natural, free from artificial colours, flavours, and preservatives unless explicitly stated on the product label.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div
                id="orders"
                className="section-block bg-surface border border-outline-variant/30 rounded-[28px] p-7 md:p-10 mb-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    04
                  </span>
                  <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">
                    Orders &amp; Payment
                  </h2>
                </div>
                <div className="space-y-4 text-on-surface-variant text-[15px] leading-relaxed">
                  <p>
                    Placing an order constitutes an offer to purchase products. An order is accepted only when we send you a confirmation email with your order ID. We reserve the right to refuse or cancel any order at our discretion.
                  </p>
                  <p>We accept the following payment methods:</p>
                  {/* Payment methods grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
                    <div className="flex items-center gap-2.5 bg-surface-container-low rounded-xl px-4 py-3 border border-outline-variant/20">
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        account_balance
                      </span>
                      <span className="text-[13px] font-medium text-on-surface">Bank Transfer</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-surface-container-low rounded-xl px-4 py-3 border border-outline-variant/20">
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        smartphone
                      </span>
                      <span className="text-[13px] font-medium text-on-surface">bKash / Nagad</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-surface-container-low rounded-xl px-4 py-3 border border-outline-variant/20">
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        payments
                      </span>
                      <span className="text-[13px] font-medium text-on-surface">Cash on Delivery</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-surface-container-low rounded-xl px-4 py-3 border border-outline-variant/20">
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        credit_card
                      </span>
                      <span className="text-[13px] font-medium text-on-surface">Debit / Credit Card</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-surface-container-low rounded-xl px-4 py-3 border border-outline-variant/20">
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        swap_horiz
                      </span>
                      <span className="text-[13px] font-medium text-on-surface">SSL Commerz</span>
                    </div>
                  </div>
                  <p>
                    All transactions are processed in Bangladeshi Taka (BDT). We are not responsible for additional charges or currency conversion fees applied by your bank or payment provider.
                  </p>
                  <p>
                    If a payment fails, your order will not be processed. You will be notified and may retry within 24 hours before the cart expires.
                  </p>
                </div>
              </div>

              {/* Section 5 */}
              <div
                id="pricing"
                className="section-block bg-surface border border-outline-variant/30 rounded-[28px] p-7 md:p-10 mb-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    05
                  </span>
                  <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">
                    Pricing &amp; Promotions
                  </h2>
                </div>
                <div className="space-y-4 text-on-surface-variant text-[15px] leading-relaxed">
                  <p>
                    All prices displayed on our website are inclusive of applicable taxes unless stated otherwise. We reserve the right to change prices at any time without notice. The price charged will be that shown at the time your order is confirmed.
                  </p>
                  <p>
                    Promotional offers and discount codes are subject to specific terms stated at the time of the promotion. Promotions cannot be combined unless explicitly permitted. We reserve the right to withdraw or modify any promotion without notice.
                  </p>
                  <p>
                    In the event of a pricing error, we will contact you before processing payment. You will have the option to proceed at the correct price or cancel your order for a full refund.
                  </p>
                </div>
              </div>

              {/* Section 6 */}
              <div
                id="shipping"
                className="section-block bg-surface border border-outline-variant/30 rounded-[28px] p-7 md:p-10 mb-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    06
                  </span>
                  <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">
                    Shipping &amp; Delivery
                  </h2>
                </div>
                <div className="space-y-4 text-on-surface-variant text-[15px] leading-relaxed">
                  <p>
                    We aim to dispatch all orders within 1–2 working days of payment confirmation. Estimated delivery windows are as follows:
                  </p>
                  {/* Delivery timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
                    <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 text-center">
                      <span className="material-symbols-outlined text-tertiary text-[28px] mb-2">
                        location_city
                      </span>
                      <p className="font-semibold text-on-surface text-[14px] mb-1">Dhaka City</p>
                      <p className="text-[13px] text-primary font-bold">1–2 Business Days</p>
                    </div>
                    <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 text-center">
                      <span className="material-symbols-outlined text-tertiary text-[28px] mb-2">
                        map
                      </span>
                      <p className="font-semibold text-on-surface text-[14px] mb-1">Other Districts</p>
                      <p className="text-[13px] text-primary font-bold">3–5 Business Days</p>
                    </div>
                    <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 text-center">
                      <span className="material-symbols-outlined text-tertiary text-[28px] mb-2">
                        terrain
                      </span>
                      <p className="font-semibold text-on-surface text-[14px] mb-1">Remote Areas</p>
                      <p className="text-[13px] text-primary font-bold">5–7 Business Days</p>
                    </div>
                  </div>
                  <p>
                    Delivery estimates are indicative and may vary during peak periods, holidays, or due to factors beyond our control such as weather events or courier delays. We are not liable for delays outside our reasonable control.
                  </p>
                  <p>
                    Risk of loss and title for items purchased pass to you upon delivery to the courier. Please inspect your order upon receipt and report any damage or missing items within 48 hours.
                  </p>
                </div>
              </div>

              {/* Section 7 */}
              <div
                id="returns"
                className="section-block bg-surface border border-outline-variant/30 rounded-[28px] p-7 md:p-10 mb-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    07
                  </span>
                  <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">
                    Returns &amp; Refunds
                  </h2>
                </div>
                <div className="space-y-4 text-on-surface-variant text-[15px] leading-relaxed">
                  <p>We accept return requests for the following reasons only:</p>
                  <ul className="space-y-2 mt-2">
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">
                        check_circle
                      </span>
                      <span>The product arrived damaged or defective.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">
                        check_circle
                      </span>
                      <span>You received the wrong item.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">
                        check_circle
                      </span>
                      <span>The product is significantly different from its description.</span>
                    </li>
                  </ul>
                  <p>
                    Returns must be requested within{" "}
                    <strong className="text-on-surface font-semibold">7 calendar days</strong> of delivery. To initiate a return, contact us at{" "}
                    <a href="mailto:support@khatifamily.com" className="text-primary font-medium hover:underline">
                      support@khatifamily.com
                    </a>{" "}
                    with your order ID and a clear photograph of the issue.
                  </p>
                  <p>
                    Due to the perishable and consumable nature of food products, we{" "}
                    <strong className="text-on-surface font-semibold">cannot accept returns</strong> of opened products unless they are defective or contaminated. Approved refunds are processed within 5–7 business days to your original payment method.
                  </p>
                  {/* Note */}
                  <div className="flex items-start gap-3 bg-error-container/30 border border-error/20 rounded-2xl p-4 mt-2">
                    <span className="material-symbols-outlined text-error text-[20px] shrink-0 mt-0.5">
                      warning
                    </span>
                    <p className="text-[13px] text-on-surface-variant">
                      Shipping costs for returns are borne by the customer unless the return is due to our error. We do not refund original shipping charges unless the entire order is defective.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 8 */}
              <div
                id="ip"
                className="section-block bg-surface border border-outline-variant/30 rounded-[28px] p-7 md:p-10 mb-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    08
                  </span>
                  <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">
                    Intellectual Property
                  </h2>
                </div>
                <div className="space-y-4 text-on-surface-variant text-[15px] leading-relaxed">
                  <p>
                    All content on this website — including text, images, logos, graphics, videos, and the overall design — is the exclusive property of Khati Family or its content partners and is protected under Bangladeshi copyright and intellectual property laws.
                  </p>
                  <p>
                    You may not reproduce, distribute, modify, or create derivative works from any content on our website without prior written consent from Khati Family. Sharing product images or reviews for personal, non-commercial purposes with attribution is permitted.
                  </p>
                </div>
              </div>

              {/* Section 9 */}
              <div
                id="liability"
                className="section-block bg-surface border border-outline-variant/30 rounded-[28px] p-7 md:p-10 mb-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    09
                  </span>
                  <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">
                    Limitation of Liability
                  </h2>
                </div>
                <div className="space-y-4 text-on-surface-variant text-[15px] leading-relaxed">
                  <p>
                    To the fullest extent permitted by law, Khati Family shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or products, including but not limited to loss of data, revenue, or profit.
                  </p>
                  <p>
                    Our total liability for any claim arising from your purchase shall not exceed the amount you paid for the specific order giving rise to the claim.
                  </p>
                  <p>
                    Nothing in these Terms limits liability for death or personal injury caused by our negligence, fraud, or any other liability that cannot be excluded by applicable law.
                  </p>
                </div>
              </div>

              {/* Section 10 */}
              <div
                id="conduct"
                className="section-block bg-surface border border-outline-variant/30 rounded-[28px] p-7 md:p-10 mb-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    10
                  </span>
                  <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">
                    User Conduct
                  </h2>
                </div>
                <div className="space-y-4 text-on-surface-variant text-[15px] leading-relaxed">
                  <p>
                    You agree not to use our website for any unlawful purpose or in any way that could damage, disable, or impair the site. Prohibited conduct includes:
                  </p>
                  <ul className="space-y-2 mt-2">
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-error text-[18px] mt-0.5">
                        cancel
                      </span>
                      <span>Submitting false, misleading, or fraudulent orders or reviews.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-error text-[18px] mt-0.5">
                        cancel
                      </span>
                      <span>Using automated tools (bots, scrapers) to access or harvest data from our website.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-error text-[18px] mt-0.5">
                        cancel
                      </span>
                      <span>Uploading harmful, offensive, or illegal content.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-error text-[18px] mt-0.5">
                        cancel
                      </span>
                      <span>Attempting to gain unauthorised access to our systems or other users&apos; accounts.</span>
                    </li>
                  </ul>
                  <p>
                    Violation of these rules may result in the immediate suspension of your account and cancellation of pending orders.
                  </p>
                </div>
              </div>

              {/* Section 11 */}
              <div
                id="governing"
                className="section-block bg-surface border border-outline-variant/30 rounded-[28px] p-7 md:p-10 mb-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    11
                  </span>
                  <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">
                    Governing Law
                  </h2>
                </div>
                <div className="space-y-4 text-on-surface-variant text-[15px] leading-relaxed">
                  <p>
                    These Terms are governed by and construed in accordance with the laws of the People&apos;s Republic of Bangladesh. Any disputes arising from or relating to these Terms shall be subject to the exclusive jurisdiction of the courts of Bangladesh.
                  </p>
                  <p>
                    We encourage resolving any disputes informally first by contacting our customer support team. Most issues can be resolved quickly and fairly without legal proceedings.
                  </p>
                </div>
              </div>

              {/* Section 12 */}
              <div
                id="changes"
                className="section-block bg-surface border border-outline-variant/30 rounded-[28px] p-7 md:p-10 mb-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    12
                  </span>
                  <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">
                    Changes to Terms
                  </h2>
                </div>
                <div className="space-y-4 text-on-surface-variant text-[15px] leading-relaxed">
                  <p>
                    We reserve the right to update or amend these Terms at any time. The &quot;Last updated&quot; date at the top of this page reflects the most recent revision. Material changes will be communicated via email or a prominent notice on our website.
                  </p>
                  <p>
                    Your continued use of our website after any changes constitutes your acceptance of the revised Terms. We recommend reviewing this page periodically.
                  </p>
                </div>
              </div>

              {/* Section 13 — Contact */}
              <div
                id="contact-terms"
                className="section-block bg-primary rounded-[28px] p-7 md:p-10 mb-6 relative overflow-hidden"
              >
                <div className="absolute w-[300px] h-[300px] border-[50px] border-white/10 rounded-full -top-20 -right-20"></div>
                <div className="absolute w-[200px] h-[200px] border-[30px] border-black/5 rounded-full -bottom-10 -left-10"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[11px] font-bold text-on-primary/70 bg-white/20 px-3 py-1.5 rounded-full uppercase tracking-wider">
                      13
                    </span>
                    <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-primary">
                      Contact Us
                    </h2>
                  </div>
                  <p className="text-on-primary/80 text-[15px] leading-relaxed mb-6">
                    Have questions about these Terms? We&apos;re happy to help. Reach out through any of the channels below.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <a
                      href="mailto:support@khatifamily.com"
                      className="flex items-center gap-3 bg-white/15 hover:bg-white/25 transition-colors rounded-2xl px-4 py-4 backdrop-blur-sm"
                    >
                      <span className="material-symbols-outlined text-on-primary text-[22px]">mail</span>
                      <div>
                        <p className="text-[11px] text-on-primary/60 uppercase tracking-wider mb-0.5">Email</p>
                        <p className="text-[13px] text-on-primary font-semibold">support@khatifamily.com</p>
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
                        <p className="text-[11px] text-on-primary/60 uppercase tracking-wider mb-0.5">Support Hours</p>
                        <p className="text-[13px] text-on-primary font-semibold">Sat–Thu, 9AM–6PM</p>
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
