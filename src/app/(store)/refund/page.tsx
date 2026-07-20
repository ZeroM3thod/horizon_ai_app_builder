"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface UploadedFile {
  id: string;
  name: string;
  dataUrl: string;
}

const ITEMS = {
  item1: { name: "Premium Turmeric Powder (200g)", price: 349, sku: "SHC-TUR-200", qty: 1, icon: "grain" },
  item2: { name: "Whole Cumin Seeds (100g)", price: 245, sku: "SHC-CUM-100", qty: 2, icon: "spa" },
  item3: { name: "Kashmiri Red Chilli Powder (250g)", price: 338, sku: "SHC-KRC-250", qty: 1, icon: "eco" },
};

export default function RequestRefundPage() {
  // --- State ---
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [descriptionText, setDescriptionText] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>("bkash");
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  // Warnings
  const [showNoItemsWarning, setShowNoItemsWarning] = useState<boolean>(false);
  const [showReasonWarning, setShowReasonWarning] = useState<boolean>(false);
  const [showTermsWarning, setShowTermsWarning] = useState<boolean>(false);

  // Submission/Success state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successRefundAmount, setSuccessRefundAmount] = useState<number>(0);
  const [successMethodLabel, setSuccessMethodLabel] = useState<string>("bKash");
  const [submitTimeStr, setSubmitTimeStr] = useState<string>("");

  // Toast
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({
    show: false,
    msg: "",
  });

  const showToast = (msg: string) => {
    setToast({ show: true, msg });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // --- Calculations ---
  const itemsTotal = 932;
  const totalDiscount = 135; // 932 - 797

  const checkedPricesSum = selectedItems.reduce((acc, id) => {
    const item = ITEMS[id as keyof typeof ITEMS];
    return acc + (item ? item.price : 0);
  }, 0);

  const discount = Math.round(checkedPricesSum * (totalDiscount / itemsTotal));
  const refund = checkedPricesSum - discount;

  // --- Event Handlers ---
  const selectAllItems = () => {
    const itemKeys = Object.keys(ITEMS);
    const allChecked = itemKeys.every((key) => selectedItems.includes(key));
    if (allChecked) {
      setSelectedItems([]);
    } else {
      setSelectedItems(itemKeys);
    }
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const goToStep = (n: number) => {
    // Validate step 1
    if (n > 1 && currentStep === 1) {
      if (selectedItems.length === 0) {
        setShowNoItemsWarning(true);
        setTimeout(() => setShowNoItemsWarning(false), 3500);
        return;
      }
    }
    // Validate step 2
    if (n > 2 && currentStep === 2) {
      if (!selectedReason) {
        setShowReasonWarning(true);
        setTimeout(() => setShowReasonWarning(false), 3500);
        return;
      }
    }

    setCurrentStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFiles = (filesList: FileList | null) => {
    if (!filesList) return;
    const newFiles = Array.from(filesList);
    newFiles.forEach((file) => {
      if (uploadedFiles.length >= 3) {
        showToast("Maximum 3 photos allowed");
        return;
      }
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result && typeof result === "string") {
          setUploadedFiles((prev) => {
            if (prev.length >= 3) return prev;
            return [
              ...prev,
              {
                id: `${Date.now()}-${Math.random()}`,
                name: file.name,
                dataUrl: result,
              },
            ];
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const submitRefund = () => {
    if (!termsAccepted) {
      setShowTermsWarning(true);
      setTimeout(() => setShowTermsWarning(false), 3500);
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      let bonus = 0;
      if (selectedMethod === "store-credit") {
        bonus = Math.round(refund * 0.05);
      }

      setSuccessRefundAmount(refund + bonus);
      const methodLabels: Record<string, string> = {
        bkash: "bKash",
        "store-credit": "Store Credit (+5% Bonus)",
        bank: "Bank Transfer",
      };
      setSuccessMethodLabel(methodLabels[selectedMethod] || "bKash");
      setSubmitTimeStr(
        new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );

      setSubmitting(false);
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
      showToast("Refund request submitted successfully!");
    }, 1800);
  };

  const copyText = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showToast("Copied: " + text);
      });
    }
  };

  const linePercents = { 1: "0%", 2: "50%", 3: "100%", 4: "100%" };
  const widthVal = linePercents[currentStep as keyof typeof linePercents] || "0%";

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* Step transitions */
            .step-panel { display: none; animation: fadeInUp 0.28s ease; }
            .step-panel.active { display: block; }
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(10px); }
                to   { opacity: 1; transform: translateY(0); }
            }

            /* Item checkbox card */
            .item-card { transition: border-color 0.18s, background 0.18s, box-shadow 0.18s; }
            .item-card:has(input:checked) {
                border-color: #9f4122;
                background: #ffdbd020;
                box-shadow: 0 0 0 3px rgba(159,65,34,0.08);
            }
            .item-card input[type="checkbox"] { display: none; }
            .item-card .check-box {
                width: 20px; height: 20px; border-radius: 6px;
                border: 2px solid #ddc0b8;
                display: flex; align-items: center; justify-content: center;
                transition: background 0.15s, border-color 0.15s;
                flex-shrink: 0;
            }
            .item-card:has(input:checked) .check-box {
                background: #9f4122; border-color: #9f4122;
            }
            .item-card:has(input:checked) .check-box::after {
                content: ''; display: block;
                width: 5px; height: 9px;
                border: 2px solid #fff;
                border-top: none; border-left: none;
                transform: rotate(45deg) translateY(-1px);
            }

            /* Reason radio card */
            .reason-card { transition: border-color 0.18s, background 0.18s; cursor: pointer; }
            .reason-card:has(input:checked) {
                border-color: #9f4122;
                background: #ffdbd020;
            }
            .reason-card input[type="radio"] { display: none; }
            .reason-dot {
                width: 18px; height: 18px; border-radius: 50%;
                border: 2px solid #ddc0b8;
                display: flex; align-items: center; justify-content: center;
                flex-shrink: 0; transition: border-color 0.15s;
            }
            .reason-card:has(input:checked) .reason-dot { border-color: #9f4122; }
            .reason-card:has(input:checked) .reason-dot::after {
                content: ''; display: block;
                width: 8px; height: 8px;
                border-radius: 50%; background: #9f4122;
            }

            /* Refund method card */
            .method-card { transition: border-color 0.18s, background 0.18s; cursor: pointer; }
            .method-card:has(input:checked) {
                border-color: #9f4122;
                background: #ffdbd020;
            }
            .method-card input[type="radio"] { display: none; }
            .method-dot {
                width: 18px; height: 18px; border-radius: 50%;
                border: 2px solid #ddc0b8;
                display: flex; align-items: center; justify-content: center;
                flex-shrink: 0; transition: border-color 0.15s;
            }
            .method-card:has(input:checked) .method-dot { border-color: #9f4122; }
            .method-card:has(input:checked) .method-dot::after {
                content: ''; display: block;
                width: 8px; height: 8px;
                border-radius: 50%; background: #9f4122;
            }

            /* Progress step indicators */
            .progress-step { transition: background 0.3s, border-color 0.3s, color 0.3s; }
            .progress-line { transition: background 0.4s; }

            /* File upload area */
            .upload-zone { transition: border-color 0.2s, background 0.2s; }
            .upload-zone:hover, .upload-zone.drag-over { border-color: #9f4122; background: #ffdbd015; }

            /* Success animation */
            @keyframes checkPop {
                0%   { transform: scale(0); opacity: 0; }
                60%  { transform: scale(1.2); }
                100% { transform: scale(1); opacity: 1; }
            }
            .check-pop { animation: checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both; }

            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-8px); }
                to   { opacity: 1; transform: translateY(0); }
            }
            .slide-down { animation: slideDown 0.3s ease both; }

            /* Custom textarea */
            textarea:focus, input:focus, select:focus { outline: none; }
          `,
        }}
      />

      {/* ─── TOAST ─── */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#1d1c15",
          color: "#fff9ee",
          padding: "10px 20px",
          borderRadius: "9999px",
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontSize: "13px",
          fontWeight: 500,
          zIndex: 9999,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          transition: "opacity 0.3s, transform 0.3s",
          whiteSpace: "nowrap",
        }}
        className={`${
          toast.show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {toast.msg}
      </div>

      {/* ─── PAGE HEADER ─── */}
      <section className="pt-28 md:pt-40 pb-6 md:pb-10 px-6 md:px-container-padding">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[11px] md:text-[13px] text-on-surface-variant mb-5 md:mb-6 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="material-symbols-outlined text-[14px] md:text-[16px]">chevron_right</span>
            <Link href="/orders" className="hover:text-primary transition-colors">
              My Orders
            </Link>
            <span className="material-symbols-outlined text-[14px] md:text-[16px]">chevron_right</span>
            <Link href="/orders" className="hover:text-primary transition-colors">
              #SHC-2024-7891
            </Link>
            <span className="material-symbols-outlined text-[14px] md:text-[16px]">chevron_right</span>
            <span className="text-on-surface font-medium">Request Refund</span>
          </div>

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                <h1 className="font-display-xl text-[26px] md:text-headline-lg text-on-surface tracking-tight">
                  Request a Refund
                </h1>
                <span className="inline-flex items-center gap-1.5 bg-error-container/60 text-on-error-container text-[10px] md:text-label-caps font-bold px-2.5 md:px-3 py-1 md:py-1.5 rounded-full border border-error/20 uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[13px]">policy</span>
                  7-Day Policy
                </span>
              </div>
              <p className="text-[12px] md:text-[14px] text-on-surface-variant">
                Order <span className="font-medium text-on-surface">#SHC-2024-7891</span> · Delivered on Saturday, June
                8, 2024 · 3 items
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/orders"
                className="inline-flex items-center gap-1.5 border border-outline-variant/60 text-on-surface-variant hover:text-on-surface hover:border-outline text-[11px] md:text-[13px] font-medium px-3 md:px-4 py-1.5 md:py-2 rounded-full transition-colors bg-surface"
              >
                <span className="material-symbols-outlined text-[15px] md:text-[17px]">arrow_back</span>
                <span className="hidden sm:inline">Back to Order</span>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 border border-outline-variant/60 text-on-surface-variant hover:text-primary hover:border-primary text-[11px] md:text-[13px] font-medium px-3 md:px-4 py-1.5 md:py-2 rounded-full transition-colors bg-surface"
              >
                <span className="material-symbols-outlined text-[15px] md:text-[17px]">headset_mic</span>
                <span className="hidden sm:inline">Support</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── REFUND ELIGIBILITY BANNER ─── */}
      <section className="px-6 md:px-container-padding mb-5 md:mb-7">
        <div className="max-w-7xl mx-auto">
          <div className="bg-secondary-container/30 border border-secondary/20 rounded-[16px] md:rounded-[20px] px-4 md:px-6 py-3 md:py-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-secondary text-[20px] md:text-[22px] mt-0.5 shrink-0">
              verified_user
            </span>
            <div>
              <p className="font-semibold text-[13px] md:text-[14px] text-on-surface">Eligible for refund</p>
              <p className="text-[11px] md:text-[13px] text-on-surface-variant mt-0.5">
                This order is within the 7-day return window. Refund requests close on{" "}
                <span className="font-medium text-on-surface">June 15, 2024</span>. Refunds are processed within 3–5
                business days.
              </p>
            </div>
            <div className="ml-auto shrink-0 hidden sm:flex items-center gap-1.5 bg-secondary/10 text-secondary text-[11px] font-bold px-3 py-1 rounded-full border border-secondary/20 whitespace-nowrap">
              <span className="material-symbols-outlined text-[13px]">timer</span>7 days left
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT GRID ─── */}
      <section className="pb-12 md:pb-section-gap px-6 md:px-container-padding">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-7">
          {/* ── LEFT / MAIN COLUMN ── */}
          <div className="lg:col-span-2 flex flex-col gap-5 md:gap-6">
            {/* ─── STEP PROGRESS ─── */}
            {currentStep < 4 && (
              <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md px-5 md:px-8 py-5 md:py-6">
                <div className="flex items-center justify-between relative">
                  {/* connector lines */}
                  <div
                    className="absolute top-4 md:top-5 left-[16.5%] right-[16.5%] h-0.5 bg-outline-variant/30 progress-line"
                    id="line-bg"
                  ></div>
                  <div
                    className="absolute top-4 md:top-5 left-[16.5%] h-0.5 bg-primary progress-line transition-all duration-500"
                    id="line-fill"
                    style={{ width: widthVal }}
                  ></div>

                  {/* Step 1 */}
                  <div className="flex flex-col items-center z-10" style={{ width: "33.33%" }}>
                    <div
                      id="ps-1"
                      className={`progress-step w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                        currentStep > 1
                          ? "bg-primary shadow-md"
                          : "bg-primary border-2 border-primary shadow-md"
                      }`}
                    >
                      <span className="material-symbols-outlined text-on-primary text-[14px] md:text-[18px]">
                        {currentStep > 1 ? "check" : "checklist"}
                      </span>
                    </div>
                    <p
                      id="pslabel-1"
                      className={`text-center mt-2 leading-tight px-1 text-[10px] md:text-[11px] ${
                        currentStep > 1
                          ? "font-semibold text-secondary"
                          : "font-semibold text-primary"
                      }`}
                    >
                      Select Items
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center z-10" style={{ width: "33.33%" }}>
                    <div
                      id="ps-2"
                      className={`progress-step w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                        currentStep > 2
                          ? "bg-primary shadow-md"
                          : currentStep === 2
                          ? "bg-primary shadow-md"
                          : "bg-surface border-2 border-outline-variant/50"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[14px] md:text-[18px] ${
                          currentStep >= 2 ? "text-on-primary" : "text-on-surface-variant"
                        }`}
                      >
                        {currentStep > 2 ? "check" : "description"}
                      </span>
                    </div>
                    <p
                      id="pslabel-2"
                      className={`text-center mt-2 leading-tight px-1 text-[10px] md:text-[11px] ${
                        currentStep > 2
                          ? "text-secondary font-semibold"
                          : currentStep === 2
                          ? "font-semibold text-primary"
                          : "text-on-surface-variant"
                      }`}
                    >
                      Reason & Details
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center z-10" style={{ width: "33.33%" }}>
                    <div
                      id="ps-3"
                      className={`progress-step w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                        currentStep > 3
                          ? "bg-primary shadow-md"
                          : currentStep === 3
                          ? "bg-primary shadow-md"
                          : "bg-surface border-2 border-outline-variant/50"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[14px] md:text-[18px] ${
                          currentStep >= 3 ? "text-on-primary" : "text-on-surface-variant"
                        }`}
                      >
                        {currentStep > 3 ? "check" : "account_balance_wallet"}
                      </span>
                    </div>
                    <p
                      id="pslabel-3"
                      className={`text-center mt-2 leading-tight px-1 text-[10px] md:text-[11px] ${
                        currentStep > 3
                          ? "text-secondary font-semibold"
                          : currentStep === 3
                          ? "font-semibold text-primary"
                          : "text-on-surface-variant"
                      }`}
                    >
                      Refund Method
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ─── STEP 1: Select Items ─── */}
            <div id="step-1" className={`step-panel ${currentStep === 1 ? "active" : ""}`}>
              <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md p-5 md:p-8">
                <div className="flex items-center justify-between mb-5 md:mb-6">
                  <div>
                    <h2 className="font-headline-md text-[16px] md:text-headline-md text-on-surface">
                      Select Items to Refund
                    </h2>
                    <p className="text-[11px] md:text-[13px] text-on-surface-variant mt-1">
                      Choose which items from your order you&apos;d like to return
                    </p>
                  </div>
                  <button
                    onClick={selectAllItems}
                    className="text-[11px] md:text-[12px] text-primary font-semibold border border-primary/30 rounded-full px-3 py-1 hover:bg-primary/8 transition-colors bg-surface shrink-0"
                  >
                    Select All
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {Object.entries(ITEMS).map(([id, item]) => {
                    const isChecked = selectedItems.includes(id);
                    return (
                      <label
                        key={id}
                        className="item-card block bg-surface-container-low border-2 border-outline-variant/40 rounded-[16px] p-4 md:p-5 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          id={id}
                          name="items"
                          value={item.price}
                          checked={isChecked}
                          onChange={() => toggleItemSelection(id)}
                        />
                        <div className="flex items-start gap-3 md:gap-4">
                          <div className="check-box mt-0.5"></div>
                          <div className="w-14 h-14 md:w-16 md:h-16 rounded-[12px] bg-surface-container-highest overflow-hidden flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-outline text-[28px] md:text-[32px]">
                              {item.icon}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[13px] md:text-body-md text-on-surface leading-snug">
                              {item.name}
                            </p>
                            <p className="text-[11px] md:text-[12px] text-on-surface-variant mt-0.5">
                              SKU: {item.sku}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <span className="bg-surface-container text-on-surface-variant border border-outline-variant/40 rounded-full text-[10px] md:text-[11px] px-2.5 py-0.5 font-medium">
                                Qty: {item.qty}
                              </span>
                              <span className="bg-primary/10 text-primary rounded-full text-[10px] md:text-[11px] px-2.5 py-0.5 font-semibold">
                                ৳{item.price}
                              </span>
                            </div>
                          </div>
                          <div className="shrink-0 text-right hidden sm:block">
                            <p className="font-bold text-[16px] md:text-[20px] text-on-surface">৳{item.price}</p>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* No items warning */}
                {showNoItemsWarning && (
                  <div
                    id="no-items-warning"
                    className="flex items-center gap-2 p-3 bg-error-container/40 border border-error/20 rounded-[12px] slide-down mt-4"
                  >
                    <span className="material-symbols-outlined text-error text-[18px]">error</span>
                    <p className="text-[12px] md:text-[13px] text-on-error-container font-medium">
                      Please select at least one item to continue.
                    </p>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between gap-4">
                  <p className="text-[11px] md:text-[13px] text-on-surface-variant">
                    <span id="selected-count" className="font-semibold text-on-surface">
                      {selectedItems.length}
                    </span>{" "}
                    item(s) selected
                  </p>
                  <button
                    onClick={() => goToStep(2)}
                    className="inline-flex items-center gap-2 bg-primary text-on-primary font-semibold text-[13px] md:text-body-md px-5 md:px-7 py-2.5 md:py-3 rounded-full hover:bg-primary/90 transition-colors"
                  >
                    Continue
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ─── STEP 2: Reason & Details ─── */}
            <div id="step-2" className={`step-panel ${currentStep === 2 ? "active" : ""}`}>
              <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md p-5 md:p-8">
                <div className="flex items-center gap-3 mb-5 md:mb-6">
                  <button
                    onClick={() => goToStep(1)}
                    className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors shrink-0"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px]">arrow_back</span>
                  </button>
                  <div>
                    <h2 className="font-headline-md text-[16px] md:text-headline-md text-on-surface">Reason & Details</h2>
                    <p className="text-[11px] md:text-[13px] text-on-surface-variant mt-0.5">
                      Tell us what went wrong so we can improve
                    </p>
                  </div>
                </div>

                {/* Reason Select */}
                <div className="mb-5 md:mb-6">
                  <p className="text-[12px] md:text-[13px] font-semibold text-on-surface mb-3 uppercase tracking-wider">
                    Refund Reason <span className="text-error">*</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" id="reason-grid">
                    {[
                      {
                        val: "damaged",
                        title: "Damaged / Defective",
                        desc: "Product arrived broken or unusable",
                      },
                      {
                        val: "wrong",
                        title: "Wrong Item Received",
                        desc: "Received a different product or variant",
                      },
                      {
                        val: "quality",
                        title: "Quality Not as Expected",
                        desc: "Product doesn't match description or photos",
                      },
                      {
                        val: "missing",
                        title: "Missing Items",
                        desc: "Part of the order was not delivered",
                      },
                      {
                        val: "expired",
                        title: "Expired Product",
                        desc: "Product was expired at time of delivery",
                      },
                      {
                        val: "other",
                        title: "Other",
                        desc: "Something else — please describe below",
                      },
                    ].map((reason) => (
                      <label
                        key={reason.val}
                        className="reason-card block border-2 border-outline-variant/40 rounded-[14px] p-3 md:p-4 select-none"
                      >
                        <input
                          type="radio"
                          name="reason"
                          value={reason.val}
                          checked={selectedReason === reason.val}
                          onChange={() => setSelectedReason(reason.val)}
                        />
                        <div className="flex items-start gap-3">
                          <div className="reason-dot mt-0.5"></div>
                          <div>
                            <p className="font-semibold text-[12px] md:text-[13px] text-on-surface">{reason.title}</p>
                            <p className="text-[10px] md:text-[11px] text-on-surface-variant mt-0.5">{reason.desc}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {showReasonWarning && (
                    <div
                      id="reason-warning"
                      className="flex items-center gap-2 p-3 bg-error-container/40 border border-error/20 rounded-[12px] slide-down mt-3"
                    >
                      <span className="material-symbols-outlined text-error text-[18px]">error</span>
                      <p className="text-[12px] md:text-[13px] text-on-error-container font-medium">
                        Please select a reason to continue.
                    </p>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-5 md:mb-6">
                  <label
                    className="block text-[12px] md:text-[13px] font-semibold text-on-surface mb-2 uppercase tracking-wider"
                    htmlFor="description"
                  >
                    Description{" "}
                    <span className="text-on-surface-variant font-normal normal-case tracking-normal">(optional)</span>
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    maxLength={500}
                    value={descriptionText}
                    onChange={(e) => setDescriptionText(e.target.value)}
                    placeholder="Describe the issue in more detail — e.g., the packaging was torn and powder was spilling out…"
                    className="w-full bg-surface-container-low border-2 border-outline-variant/40 rounded-[14px] px-4 py-3 text-[13px] md:text-[14px] text-on-surface placeholder-outline focus:border-primary transition-colors resize-none font-body-md"
                  ></textarea>
                  <div className="flex justify-end mt-1">
                    <span id="char-count" className="text-[10px] md:text-[11px] text-outline">
                      {descriptionText.length} / 500
                    </span>
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="mb-6">
                  <p className="text-[12px] md:text-[13px] font-semibold text-on-surface mb-2 uppercase tracking-wider">
                    Upload Photos{" "}
                    <span className="text-on-surface-variant font-normal normal-case tracking-normal">
                      (optional, max 3)
                    </span>
                  </p>
                  <div
                    className={`upload-zone border-2 border-dashed rounded-[16px] p-5 md:p-7 text-center cursor-pointer ${
                      dragOver ? "border-primary bg-primary/5" : "border-outline-variant/50"
                    }`}
                    id="upload-zone"
                    onClick={() => document.getElementById("file-input")?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      id="file-input"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFiles(e.target.files)}
                    />
                    <div id="upload-placeholder">
                      <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mx-auto mb-3">
                        <span className="material-symbols-outlined text-on-surface-variant text-[24px]">
                          photo_camera
                        </span>
                      </div>
                      <p className="font-semibold text-[13px] md:text-[14px] text-on-surface">
                        {uploadedFiles.length > 0
                          ? `${uploadedFiles.length} photo(s) uploaded`
                          : "Drop photos here or tap to upload"}
                      </p>
                      <p className="text-[11px] md:text-[12px] text-on-surface-variant mt-1">
                        JPG, PNG up to 5MB each · Max 3 photos
                      </p>
                    </div>
                  </div>
                  {uploadedFiles.length > 0 && (
                    <div id="file-previews" className="flex flex-wrap gap-2 mt-3">
                      {uploadedFiles.map((file) => (
                        <div
                          key={file.id}
                          className="relative w-16 h-16 md:w-20 md:h-20 rounded-[10px] overflow-hidden border-2 border-outline-variant/40 shrink-0"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={file.dataUrl} alt={file.name} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(file.id);
                            }}
                            className="absolute top-0.5 right-0.5 w-5 h-5 bg-inverse-surface rounded-full flex items-center justify-center hover:bg-error transition-colors"
                          >
                            <span className="material-symbols-outlined text-inverse-on-surface text-[11px]">close</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={() => goToStep(1)}
                    className="inline-flex items-center gap-2 border border-outline-variant/60 text-on-surface-variant hover:text-on-surface hover:border-outline text-[13px] md:text-body-md font-medium px-5 md:px-6 py-2.5 md:py-3 rounded-full transition-colors bg-surface"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Back
                  </button>
                  <button
                    onClick={() => goToStep(3)}
                    className="inline-flex items-center gap-2 bg-primary text-on-primary font-semibold text-[13px] md:text-body-md px-5 md:px-7 py-2.5 md:py-3 rounded-full hover:bg-primary/90 transition-colors"
                  >
                    Continue
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ─── STEP 3: Refund Method ─── */}
            <div id="step-3" className={`step-panel ${currentStep === 3 ? "active" : ""}`}>
              <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md p-5 md:p-8">
                <div className="flex items-center gap-3 mb-5 md:mb-6">
                  <button
                    onClick={() => goToStep(2)}
                    className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors shrink-0"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px]">arrow_back</span>
                  </button>
                  <div>
                    <h2 className="font-headline-md text-[16px] md:text-headline-md text-on-surface">
                      Choose Refund Method
                    </h2>
                    <p className="text-[11px] md:text-[13px] text-on-surface-variant mt-0.5">
                      Select how you&apos;d like to receive your refund
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mb-5 md:mb-6">
                  {/* Original Payment Method */}
                  <label className="method-card block border-2 border-outline-variant/40 rounded-[16px] p-4 md:p-5 select-none">
                    <input
                      type="radio"
                      name="method"
                      value="bkash"
                      checked={selectedMethod === "bkash"}
                      onChange={() => setSelectedMethod("bkash")}
                    />
                    <div className="flex items-center gap-3">
                      <div className="method-dot"></div>
                      <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-pink-600 text-[20px]">payment</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-[13px] md:text-body-md text-on-surface">
                            bKash · Original Payment
                          </p>
                          <span className="bg-secondary-container/40 text-on-secondary-container text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                            Recommended
                          </span>
                        </div>
                        <p className="text-[11px] md:text-[12px] text-on-surface-variant mt-0.5">
                          Refunded to your bKash account · BKH-9823-4521
                        </p>
                      </div>
                      <div className="shrink-0 text-right hidden sm:block">
                        <p className="text-[11px] md:text-[12px] text-secondary font-semibold">1–3 days</p>
                      </div>
                    </div>
                  </label>

                  {/* Store Credit */}
                  <label className="method-card block border-2 border-outline-variant/40 rounded-[16px] p-4 md:p-5 select-none">
                    <input
                      type="radio"
                      name="method"
                      value="store-credit"
                      checked={selectedMethod === "store-credit"}
                      onChange={() => setSelectedMethod("store-credit")}
                    />
                    <div className="flex items-center gap-3">
                      <div className="method-dot"></div>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-[20px]">loyalty</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-[13px] md:text-body-md text-on-surface">Store Credit</p>
                          <span className="bg-primary/10 text-primary text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                            +5% Bonus
                          </span>
                        </div>
                        <p className="text-[11px] md:text-[12px] text-on-surface-variant mt-0.5">
                          Get an extra 5% added to your Shuddhota wallet
                        </p>
                      </div>
                      <div className="shrink-0 text-right hidden sm:block">
                        <p className="text-[11px] md:text-[12px] text-secondary font-semibold">Instant</p>
                      </div>
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label className="method-card block border-2 border-outline-variant/40 rounded-[16px] p-4 md:p-5 select-none">
                    <input
                      type="radio"
                      name="method"
                      value="bank"
                      checked={selectedMethod === "bank"}
                      onChange={() => setSelectedMethod("bank")}
                    />
                    <div className="flex items-center gap-3">
                      <div className="method-dot"></div>
                      <div className="w-10 h-10 rounded-full bg-tertiary-fixed/60 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-tertiary text-[20px]">account_balance</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[13px] md:text-body-md text-on-surface">Bank Transfer</p>
                        <p className="text-[11px] md:text-[12px] text-on-surface-variant mt-0.5">
                          Transfer to your bank account (NPSB/BEFTN)
                        </p>
                      </div>
                      <div className="shrink-0 text-right hidden sm:block">
                        <p className="text-[11px] md:text-[12px] text-on-surface-variant font-semibold">3–5 days</p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Refund Summary */}
                <div className="bg-surface-container-low border border-outline-variant/30 rounded-[16px] p-4 md:p-5 mb-5 md:mb-6">
                  <p className="text-[11px] md:text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
                    Refund Summary
                  </p>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] md:text-[13px] text-on-surface-variant">Selected items</span>
                      <span id="summary-items" className="text-[12px] md:text-[13px] text-on-surface font-medium">
                        {selectedItems.length} item(s)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] md:text-[13px] text-on-surface-variant">Item total</span>
                      <span id="summary-subtotal" className="text-[12px] md:text-[13px] text-on-surface font-medium">
                        ৳{checkedPricesSum}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] md:text-[13px] text-on-surface-variant">Proportional discount</span>
                      <span id="summary-discount" className="text-[12px] md:text-[13px] text-secondary font-medium">
                        −৳{discount}
                      </span>
                    </div>
                    <div className="h-px bg-outline-variant/30"></div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[13px] md:text-body-md text-on-surface">Estimated Refund</span>
                      <span id="summary-total" className="font-bold text-[22px] md:text-[26px] text-on-surface tracking-tight">
                        ৳{refund}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Terms checkbox */}
                <label className="flex items-start gap-3 mb-6 cursor-pointer group">
                  <input
                    type="checkbox"
                    id="terms"
                    className="hidden"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <div
                    id="terms-box"
                    className={`w-5 h-5 mt-0.5 rounded-[6px] border-2 flex items-center justify-center shrink-0 group-hover:border-primary transition-colors flex-shrink-0 ${
                      termsAccepted ? "bg-primary border-primary" : "border-outline-variant/60"
                    }`}
                  >
                    {termsAccepted && (
                      <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                        <path
                          d="M1 4L4 7L10 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <p className="text-[11px] md:text-[13px] text-on-surface-variant leading-relaxed">
                    I confirm that the items are unused and in original condition (or damaged on arrival). I agree to
                    the{" "}
                    <a href="#" className="text-primary hover:underline underline-offset-2 font-medium">
                      Return & Refund Policy
                    </a>
                    .
                  </p>
                </label>

                {showTermsWarning && (
                  <div
                    id="terms-warning"
                    className="flex items-center gap-2 p-3 bg-error-container/40 border border-error/20 rounded-[12px] slide-down mb-4"
                  >
                    <span className="material-symbols-outlined text-error text-[18px]">error</span>
                    <p className="text-[12px] md:text-[13px] text-on-error-container font-medium">
                      Please accept the terms to submit your refund request.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={() => goToStep(2)}
                    className="inline-flex items-center gap-2 border border-outline-variant/60 text-on-surface-variant hover:text-on-surface hover:border-outline text-[13px] md:text-body-md font-medium px-5 md:px-6 py-2.5 md:py-3 rounded-full transition-colors bg-surface"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Back
                  </button>
                  <button
                    onClick={submitRefund}
                    disabled={submitting}
                    id="submit-btn"
                    className="inline-flex items-center gap-2 bg-primary text-on-primary font-semibold text-[13px] md:text-body-md px-6 md:px-8 py-2.5 md:py-3 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-80"
                  >
                    {submitting ? (
                      <>
                        <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                        Submitting…
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">send</span>
                        Submit Refund Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* ─── STEP 4: Success ─── */}
            <div id="step-4" className={`step-panel ${currentStep === 4 ? "active" : ""}`}>
              <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md p-6 md:p-10 text-center">
                <div className="check-pop w-20 h-20 md:w-24 md:h-24 rounded-full bg-secondary/15 flex items-center justify-center mx-auto mb-5">
                  <span className="material-symbols-outlined text-secondary text-[40px] md:text-[48px]">
                    check_circle
                  </span>
                </div>
                <h2 className="font-display-xl text-[22px] md:text-headline-lg text-on-surface tracking-tight mb-2">
                  Refund Request Submitted!
                </h2>
                <p className="text-[13px] md:text-[15px] text-on-surface-variant max-w-sm mx-auto leading-relaxed mb-6">
                  We&apos;ve received your request and will review it within{" "}
                  <span className="font-semibold text-on-surface">24 hours</span>. You&apos;ll get an SMS and email update.
                </p>

                {/* Ticket Info */}
                <div className="bg-surface-container-low border border-outline-variant/30 rounded-[16px] p-4 md:p-5 mb-6 text-left max-w-sm mx-auto">
                  <p className="text-[11px] md:text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
                    Ticket Details
                  </p>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex justify-between items-center gap-3">
                      <span className="text-[12px] md:text-[13px] text-on-surface-variant">Ticket ID</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px] md:text-[13px] text-on-surface font-mono font-semibold">
                          RFD-2024-4832
                        </span>
                        <button
                          onClick={() => copyText("RFD-2024-4832")}
                          className="text-primary hover:text-primary/70 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[14px]">content_copy</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[12px] md:text-[13px] text-on-surface-variant">Status</span>
                      <span className="inline-flex items-center gap-1 bg-tertiary-fixed/60 text-on-tertiary-container text-[10px] font-bold px-2 py-0.5 rounded-full border border-tertiary-container/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse inline-block"></span>
                        Under Review
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[12px] md:text-[13px] text-on-surface-variant">Refund Amount</span>
                      <span id="success-amount" className="text-[13px] md:text-[14px] text-on-surface font-bold">
                        ৳{successRefundAmount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[12px] md:text-[13px] text-on-surface-variant">Refund Method</span>
                      <span id="success-method" className="text-[12px] md:text-[13px] text-on-surface font-medium">
                        {successMethodLabel}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[12px] md:text-[13px] text-on-surface-variant">Submitted</span>
                      <span className="text-[12px] md:text-[13px] text-on-surface font-medium" id="submit-time">
                        {submitTimeStr}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="text-left max-w-sm mx-auto mb-7">
                  <p className="text-[11px] md:text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
                    What Happens Next
                  </p>
                  <div className="flex flex-col gap-0">
                    <div className="flex gap-3 items-start">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-on-primary text-[13px]">check</span>
                        </div>
                        <div className="w-px h-7 bg-outline-variant/30 mt-1"></div>
                      </div>
                      <div className="pb-4 pt-0.5">
                        <p className="font-semibold text-[12px] md:text-[13px] text-on-surface">Request Submitted</p>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">Just now</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-7 h-7 rounded-full bg-surface-container border-2 border-outline-variant/40 flex items-center justify-center">
                          <span className="material-symbols-outlined text-on-surface-variant text-[13px]">
                            manage_search
                          </span>
                        </div>
                        <div className="w-px h-7 bg-outline-variant/30 mt-1"></div>
                      </div>
                      <div className="pb-4 pt-0.5">
                        <p className="text-[12px] md:text-[13px] text-on-surface-variant">Team Review</p>
                        <p className="text-[11px] text-outline mt-0.5">Within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-7 h-7 rounded-full bg-surface-container border-2 border-outline-variant/40 flex items-center justify-center">
                          <span className="material-symbols-outlined text-on-surface-variant text-[13px]">
                            inventory_2
                          </span>
                        </div>
                        <div className="w-px h-7 bg-outline-variant/30 mt-1"></div>
                      </div>
                      <div className="pb-4 pt-0.5">
                        <p className="text-[12px] md:text-[13px] text-on-surface-variant">
                          Pickup Scheduled (if required)
                        </p>
                        <p className="text-[11px] text-outline mt-0.5">1–2 business days</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="shrink-0">
                        <div className="w-7 h-7 rounded-full bg-surface-container border-2 border-outline-variant/40 flex items-center justify-center">
                          <span className="material-symbols-outlined text-on-surface-variant text-[13px]">payments</span>
                        </div>
                      </div>
                      <div className="pt-0.5">
                        <p className="text-[12px] md:text-[13px] text-on-surface-variant">Refund Processed</p>
                        <p className="text-[11px] text-outline mt-0.5">3–5 business days</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/orders"
                    className="inline-flex items-center gap-2 border border-outline-variant/60 text-on-surface-variant hover:text-on-surface hover:border-outline text-[13px] font-medium px-5 py-2.5 rounded-full transition-colors bg-surface"
                  >
                    <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                    View Orders
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-primary text-on-primary font-semibold text-[13px] px-6 py-2.5 rounded-full hover:bg-primary/90 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">shopping_basket</span>
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* /LEFT COLUMN */}

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col gap-5 md:gap-6 lg:sticky lg:top-24 lg:self-start">
            {/* ─ REFUND SUMMARY CARD ─ */}
            <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md p-5 md:p-6">
              <h2 className="font-headline-md text-[16px] md:text-headline-md text-on-surface mb-4">Refund Summary</h2>

              {selectedItems.length === 0 ? (
                <div id="right-no-selection" className="flex flex-col items-center py-5 text-center">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-outline text-[24px]">shopping_bag</span>
                  </div>
                  <p className="text-[13px] text-on-surface-variant font-medium">No items selected</p>
                  <p className="text-[11px] text-outline mt-1">Select items on the left to see the estimated refund</p>
                </div>
              ) : (
                <div id="right-summary" className="flex flex-col gap-2.5">
                  <div id="right-items-list" className="flex flex-col gap-2 pb-3 border-b border-outline-variant/30 mb-1">
                    {selectedItems.map((id) => {
                      const item = ITEMS[id as keyof typeof ITEMS];
                      if (!item) return null;
                      return (
                        <div key={id} className="flex justify-between items-center gap-2">
                          <span className="text-[11px] md:text-[12px] text-on-surface-variant truncate max-w-[160px]">
                            {item.name}
                          </span>
                          <span className="text-[12px] md:text-[13px] text-on-surface font-semibold shrink-0">
                            ৳{item.price}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] md:text-[13px] text-on-surface-variant">Items total</span>
                    <span id="right-subtotal" className="text-[12px] md:text-[13px] text-on-surface font-medium">
                      ৳{checkedPricesSum}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] md:text-[13px] text-on-surface-variant">Discount (prorated)</span>
                    <span id="right-discount" className="text-[12px] md:text-[13px] text-secondary font-medium">
                      −৳{discount}
                    </span>
                  </div>
                  <div className="h-px bg-outline-variant/30 my-0.5"></div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[13px] md:text-body-md text-on-surface">Est. Refund</span>
                    <span id="right-total" className="font-bold text-[24px] md:text-[28px] text-on-surface tracking-tight">
                      ৳{refund}
                    </span>
                  </div>
                  <p className="text-[10px] text-outline text-center mt-1">Final amount confirmed after review</p>
                </div>
              )}
            </div>

            {/* ─ ORDER DETAILS CARD ─ */}
            <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md p-5 md:p-6">
              <h2 className="font-headline-md text-[16px] md:text-headline-md text-on-surface mb-4">Order Details</h2>
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between">
                  <span className="text-[12px] md:text-[13px] text-on-surface-variant">Order ID</span>
                  <button
                    onClick={() => copyText("SHC-2024-7891")}
                    className="flex items-center gap-1 text-[12px] md:text-[13px] text-on-surface font-mono font-semibold hover:text-primary transition-colors"
                  >
                    #SHC-2024-7891
                    <span className="material-symbols-outlined text-[13px] text-outline">content_copy</span>
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] md:text-[13px] text-on-surface-variant">Delivered</span>
                  <span className="text-[12px] md:text-[13px] text-on-surface font-medium">Jun 8, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] md:text-[13px] text-on-surface-variant">Total Paid</span>
                  <span className="text-[12px] md:text-[13px] text-on-surface font-bold">৳797</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] md:text-[13px] text-on-surface-variant">Payment</span>
                  <span className="text-[12px] md:text-[13px] text-on-surface font-medium">bKash</span>
                </div>
              </div>
            </div>

            {/* ─ REFUND POLICY CARD ─ */}
            <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md p-5 md:p-6">
              <h2 className="font-headline-md text-[16px] md:text-headline-md text-on-surface mb-4">Refund Policy</h2>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5 shrink-0">
                    event_available
                  </span>
                  <p className="text-[12px] md:text-[13px] text-on-surface-variant leading-relaxed">
                    Returns accepted within <span className="font-semibold text-on-surface">7 days</span> of delivery
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5 shrink-0">
                    inventory_2
                  </span>
                  <p className="text-[12px] md:text-[13px] text-on-surface-variant leading-relaxed">
                    Items must be <span className="font-semibold text-on-surface">unused & sealed</span>, or damaged on
                    arrival
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5 shrink-0">
                    currency_exchange
                  </span>
                  <p className="text-[12px] md:text-[13px] text-on-surface-variant leading-relaxed">
                    Refunds processed in <span className="font-semibold text-on-surface">3–5 business days</span>
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5 shrink-0">
                    local_shipping
                  </span>
                  <p className="text-[12px] md:text-[13px] text-on-surface-variant leading-relaxed">
                    Free return pickup for damaged or wrong items
                  </p>
                </div>
              </div>
              <Link
                href="/terms"
                className="mt-4 flex items-center gap-1.5 text-primary text-[12px] md:text-[13px] font-medium hover:underline underline-offset-4"
              >
                Full Refund Policy
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </Link>
            </div>

            {/* ─ NEED HELP CARD ─ */}
            <div className="bg-primary rounded-[20px] md:rounded-[24px] p-5 md:p-6 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-24 h-24 border-[16px] border-white/10 rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 border-[10px] border-black/5 rounded-full"></div>
              <div className="relative z-10">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-on-primary text-[18px]">support_agent</span>
                </div>
                <p className="font-bold text-[14px] md:text-body-md text-on-primary mb-1">
                  Need help with your refund?
                </p>
                <p className="text-[11px] md:text-[13px] text-on-primary/70 mb-4">
                  Our team typically replies within 30 minutes.
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 bg-surface text-primary text-[12px] md:text-[14px] font-semibold px-4 py-2 rounded-full hover:bg-primary-fixed transition-colors"
                >
                  Chat with Us
                  <span className="material-symbols-outlined text-[14px]">chat</span>
                </Link>
              </div>
            </div>
          </div>
          {/* /RIGHT COLUMN */}
        </div>
      </section>
    </>
  );
}
