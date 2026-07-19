"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Coupon {
  id: string;
  code: string;
  discount: number;
  minOrder: number;
  expiryStr: string;
  isNew?: boolean;
}

interface HistoryItem {
  id: string;
  title: string;
  subtitle: string;
  points: number;
  isEarn: boolean;
}

interface Confetti {
  id: number;
  size: number;
  color: string;
  isCircle: boolean;
  left: number;
  top: number;
  delay: number;
  duration: number;
}

interface PresetCoupon {
  pts: number;
  discount: number;
  code: string;
  minOrder: number;
  label: string;
  tier: "standard" | "premium" | "exclusive";
  platinumOnly?: boolean;
}

export default function RedeemPointsPage() {
  // --- State ---
  const [totalPoints, setTotalPoints] = useState(2450);
  const [sliderValue, setSliderValue] = useState(500);
  const [selectedTier, setSelectedTier] = useState<"all" | "standard" | "premium" | "exclusive">("all");

  // Active coupons state
  const [activeCoupons, setActiveCoupons] = useState<Coupon[]>([
    {
      id: "init-1",
      code: "SHD-CLSC",
      discount: 50,
      minOrder: 300,
      expiryStr: "Feb 8, 2025",
    },
    {
      id: "init-2",
      code: "SHD-STRT",
      discount: 20,
      minOrder: 150,
      expiryStr: "Jan 25, 2025",
    },
  ]);

  // Points history state
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
    {
      id: "h-1",
      title: "Order #SHD-2024-001",
      subtitle: "Garam Masala Blend — Jan 8",
      points: 90,
      isEarn: true,
    },
    {
      id: "h-2",
      title: "Order #SHD-2024-003",
      subtitle: "Green Cardamom — Jan 5",
      points: 50,
      isEarn: true,
    },
    {
      id: "h-3",
      title: "Coupon SHD-STRT Redeemed",
      subtitle: "Jan 3, 2025",
      points: -200,
      isEarn: false,
    },
    {
      id: "h-4",
      title: "Review Bonus",
      subtitle: "Biryani Masala Review — Dec 30",
      points: 25,
      isEarn: true,
    },
    {
      id: "h-5",
      title: "Order #SHD-2024-004",
      subtitle: "Premium Almonds — Dec 28",
      points: 175,
      isEarn: true,
    },
  ]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingRedemption, setPendingRedemption] = useState<{
    pts: number;
    discount: number;
    code: string;
    minOrder: number;
    label: string;
  } | null>(null);

  // Confetti State
  const [confettiPieces, setConfettiPieces] = useState<Confetti[]>([]);

  // Toast State
  const [toast, setToast] = useState<{
    show: boolean;
    msg: string;
    icon: string;
  }>({
    show: false,
    msg: "",
    icon: "check_circle",
  });

  // Automatically cap slider value to total points if total points decreases
  useEffect(() => {
    if (sliderValue > totalPoints) {
      setSliderValue(Math.max(100, totalPoints));
    }
  }, [totalPoints, sliderValue]);

  // Toast auto-hide
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // --- Helpers ---
  const showToastMessage = (msg: string, icon = "check_circle") => {
    setToast({
      show: true,
      msg,
      icon,
    });
  };

  const copyCouponCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          showToastMessage(`${code} copied to clipboard!`, "content_copy");
        })
        .catch(() => {
          showToastMessage(`Copy failed. Code: ${code}`, "error");
        });
    } else {
      showToastMessage(`Copy failed. Code: ${code}`, "error");
    }
  };

  // Preset coupons
  const presetCoupons: PresetCoupon[] = [
    {
      pts: 200,
      discount: 20,
      code: "SHD-STRT",
      minOrder: 150,
      label: "Starter Saver",
      tier: "standard",
    },
    {
      pts: 500,
      discount: 50,
      code: "SHD-CLSC",
      minOrder: 300,
      label: "Classic Discount",
      tier: "standard",
    },
    {
      pts: 1000,
      discount: 110,
      code: "SHD-PREM",
      minOrder: 500,
      label: "Premium Deal",
      tier: "premium",
    },
    {
      pts: 1500,
      discount: 175,
      code: "SHD-BSVR",
      minOrder: 700,
      label: "Big Saver",
      tier: "premium",
    },
    {
      pts: 2500,
      discount: 300,
      code: "SHD-MEGA",
      minOrder: 1000,
      label: "Mega Discount",
      tier: "exclusive",
    },
    {
      pts: 3000,
      discount: 400,
      code: "SHD-PLAT",
      minOrder: 1500,
      label: "Platinum Pack",
      tier: "exclusive",
      platinumOnly: true,
    },
  ];

  // Custom Builder calculations
  const customDiscount = Math.floor(sliderValue / 100) * 10;
  const customMinOrder = Math.max(100, customDiscount * 3);
  const customCode = `SHD-${sliderValue}X${customDiscount}`;
  const customPtsRemain = totalPoints - sliderValue;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(parseInt(e.target.value));
  };

  // Calculate slider slider background percent
  const sliderMax = Math.max(100, totalPoints);
  const sliderPct =
    sliderMax > 100 ? ((sliderValue - 100) / (sliderMax - 100)) * 100 : 0;

  // Trigger modal for preset
  const handlePresetRedeemClick = (preset: PresetCoupon) => {
    if (preset.pts > totalPoints) {
      showToastMessage("Not enough points!", "error_outline");
      return;
    }
    setPendingRedemption({
      pts: preset.pts,
      discount: preset.discount,
      code: preset.code,
      minOrder: preset.minOrder,
      label: preset.label,
    });
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  // Trigger modal for custom
  const handleCustomRedeemClick = () => {
    if (sliderValue > totalPoints) {
      showToastMessage("Not enough points!", "error_outline");
      return;
    }
    setPendingRedemption({
      pts: sliderValue,
      discount: customDiscount,
      code: customCode,
      minOrder: customMinOrder,
      label: "Custom Coupon",
    });
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    document.body.style.overflow = "";
  };

  // Spawn Confetti
  const spawnConfetti = () => {
    const colors = ["#9f4122", "#d6ed7a", "#80b1c7", "#ffb59e", "#bbd062"];
    const pieces: Confetti[] = Array.from({ length: 18 }).map((_, i) => ({
      id: Date.now() + i,
      size: 6 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      isCircle: Math.random() > 0.5,
      left: 10 + Math.random() * 80,
      top: 40 + Math.random() * 40,
      delay: Math.random() * 0.3,
      duration: 0.7 + Math.random() * 0.5,
    }));
    setConfettiPieces(pieces);
    setTimeout(() => {
      setConfettiPieces([]);
    }, 1500);
  };

  // Confirm redemption
  const confirmRedeem = () => {
    if (!pendingRedemption) return;
    const { pts, discount, code, minOrder } = pendingRedemption;

    // Deduct points
    setTotalPoints((prev) => prev - pts);

    // Add new coupon to active list
    const newCoupon: Coupon = {
      id: `new-${Date.now()}`,
      code,
      discount,
      minOrder,
      expiryStr: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      isNew: true,
    };
    setActiveCoupons((prev) => [newCoupon, ...prev]);

    // Add to history
    const newHistory: HistoryItem = {
      id: `h-new-${Date.now()}`,
      title: `Coupon ${code} Redeemed`,
      subtitle: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      points: -pts,
      isEarn: false,
    };
    setHistoryItems((prev) => [newHistory, ...prev]);

    // Confetti
    spawnConfetti();

    // Close Modal
    handleCloseModal();

    // Show Toast
    showToastMessage(`Coupon ${code} redeemed!`, "check_circle");
    setPendingRedemption(null);
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
            .hide-scrollbar::-webkit-scrollbar { display: none; }

            @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes fillBar { from { width: 0%; } to { width: var(--target-width); } }
            .progress-fill { animation: fillBar 1.4s cubic-bezier(0.4,0,0.2,1) forwards; }
            .coupon-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
            .coupon-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(159,65,34,0.13); }
            .coupon-card.selected { outline: 2.5px solid #9f4122; outline-offset: 2px; }

            /* Coupon ticket notch */
            .ticket-notch {
                position: relative;
            }
            .ticket-notch::before, .ticket-notch::after {
                content: '';
                position: absolute;
                width: 18px;
                height: 18px;
                background: #f9f3e8;
                border-radius: 50%;
                top: 50%;
                transform: translateY(-50%);
            }
            .ticket-notch::before { left: -9px; border: 1px solid #ddc0b8; border-right: none; }
            .ticket-notch::after  { right: -9px; border: 1px solid #ddc0b8; border-left: none; }

            /* Modal */
            .modal-overlay { animation: fadeIn 0.2s ease; }
            .modal-box { animation: slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1); }
            @keyframes slideUp { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

            /* Toast */
            #toast { transition: opacity 0.3s ease, transform 0.3s ease; }

            /* Range input */
            input[type=range] { -webkit-appearance: none; appearance: none; background: transparent; cursor: pointer; }
            input[type=range]::-webkit-slider-runnable-track { height: 6px; border-radius: 9999px; background: linear-gradient(to right, #9f4122 0%, #9f4122 var(--fill), #e8e2d7 var(--fill), #e8e2d7 100%); }
            input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; background: #9f4122; margin-top: -8px; box-shadow: 0 0 0 3px #fff, 0 0 0 5px #9f4122; }
            input[type=range]::-moz-range-track { height: 6px; border-radius: 9999px; background: #e8e2d7; }
            input[type=range]::-moz-range-progress { background: #9f4122; height: 6px; border-radius: 9999px; }
            input[type=range]::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: #9f4122; border: 3px solid #fff; box-shadow: 0 0 0 2px #9f4122; }

            .tab-filter.active { background: #9f4122; color: #fff; }
            .tab-filter { transition: background 0.15s, color 0.15s; }

            .redeemed-coupon { position: relative; overflow: hidden; }
            .redeemed-coupon::after {
                content: '';
                position: absolute; inset: 0;
                background: rgba(255,249,238,0.55);
            }

            @keyframes confetti {
                0%   { opacity: 1; transform: translateY(0) rotate(0deg); }
                100% { opacity: 0; transform: translateY(-80px) rotate(360deg); }
            }
            .confetti-piece { animation: confetti 0.9s ease forwards; }
          `,
        }}
      />

      {/* ─── TOAST ─── */}
      <div
        id="toast"
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-5 py-3.5 rounded-full shadow-xl transition-all duration-300 ${
          toast.show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        } whitespace-nowrap`}
      >
        <span className="material-symbols-outlined text-secondary-fixed text-[20px]">{toast.icon}</span>
        <span className="font-body-md text-[13px] font-medium">{toast.msg}</span>
      </div>

      {/* ─── MODAL ─── */}
      {modalOpen && pendingRedemption && (
        <div
          id="modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
          className="modal-overlay fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
          <div className="modal-box bg-surface rounded-[24px] sm:rounded-[28px] border border-outline-variant/40 shadow-2xl w-full max-w-md p-6 md:p-8 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">close</span>
            </button>

            {/* Confetti container */}
            <div id="confetti-container" className="absolute inset-0 pointer-events-none overflow-hidden rounded-[28px]">
              {confettiPieces.map((piece) => (
                <div
                  key={piece.id}
                  className="confetti-piece"
                  style={{
                    position: "absolute",
                    width: `${piece.size}px`,
                    height: `${piece.size}px`,
                    background: piece.color,
                    borderRadius: piece.isCircle ? "50%" : "2px",
                    left: `${piece.left}%`,
                    top: `${piece.top}%`,
                    animationDelay: `${piece.delay}s`,
                    animationDuration: `${piece.duration}s`,
                  }}
                ></div>
              ))}
            </div>

            <div className="text-center mb-6">
              <div id="modal-icon-wrap" className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-on-primary-fixed-variant flex items-center justify-center mb-4 shadow-lg">
                <span className="material-symbols-outlined text-white text-[28px]">confirmation_number</span>
              </div>
              <h2 id="modal-title" className="font-display-xl text-[22px] md:text-[26px] text-on-surface mb-1">
                Redeem Points
              </h2>
              <p id="modal-subtitle" className="font-body-md text-[13px] text-on-surface-variant">
                You are about to redeem <strong className="text-primary">{pendingRedemption.pts.toLocaleString()}</strong> points for a discount coupon.
              </p>
            </div>

            {/* Coupon Preview */}
            <div id="modal-coupon-preview" className="bg-gradient-to-r from-primary/8 to-tertiary/5 border border-outline-variant/50 rounded-[18px] p-4 mb-5 relative ticket-notch">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest mb-1">
                    Discount Coupon
                  </p>
                  <p id="modal-code" className="font-display-xl text-[20px] md:text-[24px] text-primary tracking-widest font-bold">
                    {pendingRedemption.code}
                  </p>
                  <p id="modal-discount" className="font-body-md text-[12px] text-on-surface-variant mt-0.5">
                    ৳{pendingRedemption.discount} OFF on your next order
                  </p>
                </div>
                <div className="text-right">
                  <div id="modal-value-badge" className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-on-primary-fixed-variant flex items-center justify-center shadow-md">
                    <span id="modal-badge-txt" className="font-bold text-white text-[13px] text-center leading-tight">
                      ৳{pendingRedemption.discount}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-outline-variant/30 flex items-center justify-between">
                <p className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider">
                  Valid for 30 days
                </p>
                <p id="modal-min-order" className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider">
                  Min. order ৳{pendingRedemption.minOrder}
                </p>
              </div>
            </div>

            {/* Point deduction summary */}
            <div className="bg-surface-container-low rounded-[14px] p-4 mb-5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-body-md text-[13px] text-on-surface-variant">Current Balance</span>
                <span className="font-body-md text-[13px] font-semibold text-on-surface">
                  {totalPoints.toLocaleString()} pts
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-md text-[13px] text-on-surface-variant">Points Used</span>
                <span id="modal-pts-used" className="font-body-md text-[13px] font-semibold text-error">
                  − {pendingRedemption.pts.toLocaleString()} pts
                </span>
              </div>
              <div className="h-px bg-outline-variant/30"></div>
              <div className="flex justify-between items-center">
                <span className="font-body-md text-[13px] font-semibold text-on-surface">Remaining Balance</span>
                <span id="modal-pts-remain" className="font-body-md text-[13px] font-bold text-primary">
                  {(totalPoints - pendingRedemption.pts).toLocaleString()} pts
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 border border-outline-variant/50 text-on-surface-variant font-body-md text-[13px] font-medium py-3 rounded-full hover:bg-surface-variant transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRedeem}
                className="flex-1 bg-primary text-on-primary font-body-md text-[13px] font-medium py-3 rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <span className="material-symbols-outlined text-[16px]">redeem</span>
                Confirm Redeem
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-24 md:pt-36 pb-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-container/35 via-tertiary-fixed/20 to-secondary-fixed/25 -z-10"></div>
        <div className="absolute top-20 right-10 md:right-32 w-32 md:w-64 h-32 md:h-64 rounded-full bg-primary/10 blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-10 md:left-40 w-24 md:w-48 h-24 md:h-48 rounded-full bg-secondary-container/40 blur-3xl -z-10"></div>
        <div className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] border-[40px] md:border-[60px] border-primary/5 rounded-full top-[-80px] right-[-80px] -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <Link
              href="/profile"
              className="font-body-md text-[12px] text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">account_circle</span>
              My Profile
            </Link>
            <span className="material-symbols-outlined text-[14px] text-on-surface-variant/50">chevron_right</span>
            <span className="font-body-md text-[12px] text-primary font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">redeem</span>
              Redeem Points
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-10 pb-10 md:pb-12">
            {/* Page Title */}
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 font-label-caps text-[9px] md:text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">
                <span className="material-symbols-outlined text-secondary text-[14px]">toll</span>
                Loyalty Rewards
              </span>
              <h1 className="font-display-xl text-[28px] md:text-[48px] leading-tight tracking-tight text-on-surface mb-2">
                Redeem Your Points
              </h1>
              <p className="font-body-md text-[13px] md:text-body-md text-on-surface-variant max-w-xl">
                Convert your loyalty points into discount coupons and save on your next Shuddhota Co. order. Every point
                counts!
              </p>
            </div>

            {/* Points Balance Pill */}
            <div className="bg-gradient-to-br from-primary to-on-primary-fixed-variant rounded-[20px] md:rounded-[24px] shadow-xl p-5 md:p-6 relative overflow-hidden shrink-0 w-full md:w-64">
              <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full border-[18px] border-white/10"></div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full border-[14px] border-black/5"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-secondary-fixed text-[18px]">toll</span>
                  <span className="font-label-caps text-[9px] text-white/70 uppercase tracking-widest">
                    Available Balance
                  </span>
                </div>
                <p id="balance-display" className="font-display-xl text-[36px] md:text-[44px] text-white leading-none tracking-tight">
                  {totalPoints.toLocaleString()}
                </p>
                <p className="font-body-md text-[11px] text-white/60 mt-0.5">Points</p>
                <div className="mt-3 pt-3 border-t border-white/15">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-[9px] text-white/60 uppercase tracking-wider">Gold → Platinum</span>
                    <span className="font-label-caps text-[9px] text-secondary-fixed uppercase tracking-wider">
                      550 more
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="progress-fill h-full bg-secondary-fixed rounded-full"
                      style={{ "--target-width": "82%", width: "82%" } as React.CSSProperties}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How it works strip */}
          <div className="flex gap-0 hide-scrollbar overflow-x-auto border-b border-outline-variant/30 pb-0">
            <div className="flex items-center gap-2 px-4 py-3 shrink-0 text-on-surface-variant">
              <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                1
              </div>
              <span className="font-body-md text-[11px] md:text-[13px]">Choose a coupon tier</span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant/30 self-center shrink-0">
              arrow_forward
            </span>
            <div className="flex items-center gap-2 px-4 py-3 shrink-0 text-on-surface-variant">
              <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                2
              </div>
              <span className="font-body-md text-[11px] md:text-[13px]">Confirm redemption</span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant/30 self-center shrink-0">
              arrow_forward
            </span>
            <div className="flex items-center gap-2 px-4 py-3 shrink-0 text-on-surface-variant">
              <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                3
              </div>
              <span className="font-body-md text-[11px] md:text-[13px]">Apply coupon at checkout</span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant/30 self-center shrink-0">
              arrow_forward
            </span>
            <div className="flex items-center gap-2 px-4 py-3 shrink-0 text-on-surface-variant">
              <div className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-[10px] font-bold shrink-0">
                ✓
              </div>
              <span className="font-body-md text-[11px] md:text-[13px]">Save on your order!</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT ─── */}
      <section className="py-8 md:py-12 px-6 md:px-16 bg-surface-container-low min-h-[60vh]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr] gap-6 md:gap-8 items-start">
            {/* ─── LEFT SIDEBAR ─── */}
            <aside className="flex flex-col gap-4 md:gap-5">
              {/* Points Summary Card */}
              <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md p-5 md:p-6">
                <h3 className="font-headline-md text-[14px] md:text-[16px] font-semibold text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px] md:text-[20px]">
                    account_balance_wallet
                  </span>
                  Points Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5 shrink-0">toll</span>
                    <div className="flex-1">
                      <p className="font-label-caps text-[9px] md:text-[10px] text-on-surface-variant uppercase tracking-widest mb-0.5">
                        Total Points
                      </p>
                      <p className="font-body-md text-[14px] md:text-[15px] text-on-surface font-semibold">
                        {totalPoints.toLocaleString()} pts
                      </p>
                    </div>
                  </div>
                  <div className="h-px bg-outline-variant/20"></div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-tertiary text-[18px] mt-0.5 shrink-0">history</span>
                    <div className="flex-1">
                      <p className="font-label-caps text-[9px] md:text-[10px] text-on-surface-variant uppercase tracking-widest mb-0.5">
                        Earned This Month
                      </p>
                      <p className="font-body-md text-[14px] md:text-[15px] text-on-surface font-semibold">+340 pts</p>
                    </div>
                  </div>
                  <div className="h-px bg-outline-variant/20"></div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-error text-[18px] mt-0.5 shrink-0">redeem</span>
                    <div className="flex-1">
                      <p className="font-label-caps text-[9px] md:text-[10px] text-on-surface-variant uppercase tracking-widest mb-0.5">
                        Redeemed Total
                      </p>
                      <p className="font-body-md text-[14px] md:text-[15px] text-on-surface font-semibold">1,050 pts</p>
                    </div>
                  </div>
                  <div className="h-px bg-outline-variant/20"></div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px] mt-0.5 shrink-0">
                      hourglass_top
                    </span>
                    <div className="flex-1">
                      <p className="font-label-caps text-[9px] md:text-[10px] text-on-surface-variant uppercase tracking-widest mb-0.5">
                        Points Expiry
                      </p>
                      <p className="font-body-md text-[14px] md:text-[15px] text-on-surface font-semibold">
                        Mar 14, 2025
                      </p>
                    </div>
                  </div>
                </div>

                {/* Expiry warning */}
                <div className="mt-4 bg-error-container/40 border border-error/20 rounded-[12px] p-3 flex items-start gap-2">
                  <span className="material-symbols-outlined text-error text-[16px] mt-0.5 shrink-0">warning</span>
                  <p className="font-body-md text-[11px] text-on-error-container">
                    500 points will expire in 14 days. Redeem them before they&apos;re gone!
                  </p>
                </div>
              </div>

              {/* Membership Card */}
              <div className="bg-gradient-to-br from-primary to-on-primary-fixed-variant rounded-[20px] md:rounded-[24px] shadow-lg p-5 md:p-6 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full border-[20px] border-white/10"></div>
                <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full border-[16px] border-black/5"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-secondary-fixed text-[18px]">workspace_premium</span>
                    <span className="font-label-caps text-[9px] text-white/70 uppercase tracking-widest">
                      Membership Tier
                    </span>
                  </div>
                  <p className="font-display-xl text-[26px] text-white leading-none tracking-tight mb-0.5">Gold Member</p>
                  <p className="font-body-md text-[11px] text-white/60 mb-4">550 pts away from Platinum</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary-fixed text-[14px]">check</span>
                      <span className="font-body-md text-[11px] text-white/80">10% off every order</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary-fixed text-[14px]">check</span>
                      <span className="font-body-md text-[11px] text-white/80">2x points on spice orders</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary-fixed text-[14px]">check</span>
                      <span className="font-body-md text-[11px] text-white/80">Free delivery above ৳500</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md p-3 md:p-4">
                <h3 className="font-label-caps text-[9px] md:text-[10px] text-on-surface-variant uppercase tracking-widest px-2 mb-2">
                  Quick Links
                </h3>
                <div className="flex flex-col">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-variant transition-colors group"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">
                      account_circle
                    </span>
                    <span className="font-body-md text-[13px] md:text-[14px] text-on-surface group-hover:text-primary transition-colors">
                      My Profile
                    </span>
                    <span className="material-symbols-outlined text-[14px] text-on-surface-variant/50 ml-auto">
                      chevron_right
                    </span>
                  </Link>
                  <Link
                    href="/orders"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-variant transition-colors group"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">
                      receipt_long
                    </span>
                    <span className="font-body-md text-[13px] md:text-[14px] text-on-surface group-hover:text-primary transition-colors">
                      My Orders
                    </span>
                    <span className="material-symbols-outlined text-[14px] text-on-surface-variant/50 ml-auto">
                      chevron_right
                    </span>
                  </Link>
                  <Link
                    href="/about"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-variant transition-colors group"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">
                      help_outline
                    </span>
                    <span className="font-body-md text-[13px] md:text-[14px] text-on-surface group-hover:text-primary transition-colors">
                      Help & Support
                    </span>
                    <span className="material-symbols-outlined text-[14px] text-on-surface-variant/50 ml-auto">
                      chevron_right
                    </span>
                  </Link>
                </div>
              </div>
            </aside>

            {/* ─── MAIN PANEL ─── */}
            <div className="min-w-0 space-y-5 md:space-y-6">
              {/* ── Custom Redemption Builder ── */}
              <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden">
                <div className="p-5 md:p-6 border-b border-outline-variant/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-[14px] bg-primary-fixed flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                    </div>
                    <div>
                      <h2 className="font-headline-md text-[16px] md:text-[19px] font-semibold text-on-surface">
                        Custom Coupon Builder
                      </h2>
                      <p className="font-body-md text-[12px] md:text-[13px] text-on-surface-variant mt-0.5">
                        Slide to choose how many points to redeem. 100 pts = ৳10 discount.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-5 md:p-6">
                  {/* Slider */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">
                        Points to Redeem
                      </span>
                      <span id="custom-pts-label" className="font-display-xl text-[18px] text-primary font-bold">
                        {sliderValue.toLocaleString()} pts
                      </span>
                    </div>
                    <input
                      type="range"
                      id="pts-slider"
                      min="100"
                      max={sliderMax}
                      step="50"
                      value={sliderValue}
                      onChange={handleSliderChange}
                      className="w-full"
                      style={{ "--fill": `${sliderPct}%` } as React.CSSProperties}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-body-md text-[11px] text-on-surface-variant">100 pts min</span>
                      <span className="font-body-md text-[11px] text-on-surface-variant">
                        {totalPoints.toLocaleString()} pts max
                      </span>
                    </div>
                  </div>

                  {/* Live Preview */}
                  <div className="bg-gradient-to-r from-primary/8 via-background to-tertiary/5 border border-outline-variant/40 rounded-[18px] p-5 relative overflow-hidden">
                    {/* Dashed divider (ticket style) */}
                    <div className="absolute top-0 bottom-0 right-[120px] border-l border-dashed border-outline-variant/50 hidden sm:block"></div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <p className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest mb-1">
                          Your Custom Coupon
                        </p>
                        <p id="custom-code" className="font-display-xl text-[22px] md:text-[28px] text-primary tracking-widest font-bold">
                          {customCode}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="inline-flex items-center gap-1 bg-primary-fixed text-on-primary-container font-label-caps text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                            <span className="material-symbols-outlined text-[10px]">sell</span>
                            <span id="custom-badge">৳{customDiscount} OFF</span>
                          </span>
                          <span className="inline-flex items-center gap-1 bg-tertiary-fixed text-on-tertiary-container font-label-caps text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                            <span className="material-symbols-outlined text-[10px]">event</span>
                            Valid 30 days
                          </span>
                          <span className="inline-flex items-center gap-1 bg-surface-container text-on-surface-variant font-label-caps text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                            Min. <span id="custom-min">৳{customMinOrder}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center shrink-0 sm:pl-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-on-primary-fixed-variant flex items-center justify-center shadow-lg mb-2">
                          <span id="custom-value" className="font-bold text-white text-[15px] leading-tight text-center">
                            ৳{customDiscount}
                          </span>
                        </div>
                        <span className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider">
                          Discount
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-outline-variant/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider">
                            Points Used
                          </p>
                          <p id="custom-pts-used" className="font-body-md text-[13px] font-semibold text-on-surface">
                            {sliderValue.toLocaleString()} pts
                          </p>
                        </div>
                        <div className="h-8 w-px bg-outline-variant/30"></div>
                        <div>
                          <p className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider">
                            Remaining
                          </p>
                          <p id="custom-pts-remain" className="font-body-md text-[13px] font-semibold text-primary">
                            {customPtsRemain.toLocaleString()} pts
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleCustomRedeemClick}
                        className="inline-flex items-center gap-1.5 bg-primary text-on-primary font-body-md text-[13px] font-medium px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors shadow-md shrink-0"
                      >
                        <span className="material-symbols-outlined text-[15px]">redeem</span>
                        Redeem Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Preset Coupon Tiers ── */}
              <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 md:p-6 border-b border-outline-variant/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-[14px] bg-secondary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-secondary text-[20px]">confirmation_number</span>
                    </div>
                    <div>
                      <h2 className="font-headline-md text-[16px] md:text-[19px] font-semibold text-on-surface">
                        Coupon Tiers
                      </h2>
                      <p className="font-body-md text-[12px] md:text-[13px] text-on-surface-variant mt-0.5">
                        Quick-redeem preset coupons — great value bundles.
                      </p>
                    </div>
                  </div>
                  {/* Filter tabs */}
                  <div className="flex gap-1.5 flex-wrap">
                    <button
                      onClick={() => setSelectedTier("all")}
                      className={`tab-filter font-label-caps text-[9px] uppercase tracking-wider px-3 py-1.5 rounded-full border border-outline-variant/40 ${
                        selectedTier === "all" ? "active" : "bg-surface text-on-surface-variant"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setSelectedTier("standard")}
                      className={`tab-filter font-label-caps text-[9px] uppercase tracking-wider px-3 py-1.5 rounded-full border border-outline-variant/40 ${
                        selectedTier === "standard" ? "active" : "bg-surface text-on-surface-variant"
                      }`}
                    >
                      Standard
                    </button>
                    <button
                      onClick={() => setSelectedTier("premium")}
                      className={`tab-filter font-label-caps text-[9px] uppercase tracking-wider px-3 py-1.5 rounded-full border border-outline-variant/40 ${
                        selectedTier === "premium" ? "active" : "bg-surface text-on-surface-variant"
                      }`}
                    >
                      Premium
                    </button>
                    <button
                      onClick={() => setSelectedTier("exclusive")}
                      className={`tab-filter font-label-caps text-[9px] uppercase tracking-wider px-3 py-1.5 rounded-full border border-outline-variant/40 ${
                        selectedTier === "exclusive" ? "active" : "bg-surface text-on-surface-variant"
                      }`}
                    >
                      Exclusive
                    </button>
                  </div>
                </div>

                <div id="coupon-grid" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-5 md:p-6">
                  {presetCoupons
                    .filter((card) => selectedTier === "all" || card.tier === selectedTier)
                    .map((card, i) => {
                      const isLocked = card.pts > totalPoints;

                      if (isLocked) {
                        return (
                          <div
                            key={i}
                            className="coupon-card bg-surface-container-low border border-outline-variant/40 rounded-[18px] overflow-hidden flex flex-col opacity-60 relative"
                          >
                            <div
                              className={`h-2 ${
                                card.platinumOnly
                                  ? "bg-gradient-to-r from-inverse-surface to-on-surface-variant"
                                  : card.tier === "exclusive"
                                  ? "bg-gradient-to-r from-error to-error-container"
                                  : card.pts === 1500
                                  ? "bg-gradient-to-r from-[#b8860b] to-[#daa520]"
                                  : "bg-gradient-to-r from-secondary to-secondary-fixed-dim"
                              }`}
                            ></div>
                            <div className="p-4 flex-1 flex flex-col">
                              <div className="flex items-start justify-between gap-2 mb-3">
                                <div>
                                  <span
                                    className={`inline-flex items-center gap-1 font-label-caps text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider mb-1.5 ${
                                      card.platinumOnly
                                        ? "bg-surface-container-highest text-on-surface"
                                        : card.tier === "exclusive"
                                        ? "bg-error-container text-on-error-container"
                                        : card.pts === 1500
                                        ? "bg-[#fef9e7] text-[#b8860b] border border-[#daa520]/30"
                                        : "bg-secondary-container text-on-secondary-container"
                                    }`}
                                  >
                                    <span className="material-symbols-outlined text-[10px]">
                                      {card.platinumOnly ? "diamond" : card.tier === "exclusive" ? "stars" : "diamond"}
                                    </span>
                                    {card.platinumOnly ? "Platinum" : card.tier === "exclusive" ? "Exclusive" : "Premium+"}
                                  </span>
                                  <p className="font-headline-md text-[15px] font-bold text-on-surface">{card.label}</p>
                                </div>
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md shrink-0 ${
                                    card.platinumOnly
                                      ? "bg-gradient-to-br from-inverse-surface to-on-surface-variant"
                                      : card.tier === "exclusive"
                                      ? "bg-gradient-to-br from-error to-on-error-container"
                                      : card.pts === 1500
                                      ? "bg-gradient-to-br from-[#b8860b] to-[#daa520]"
                                      : "bg-gradient-to-br from-secondary to-on-secondary-fixed"
                                  }`}
                                >
                                  <span className="font-bold text-white text-[11px] text-center leading-tight">
                                    ৳{card.discount}
                                  </span>
                                </div>
                              </div>
                              <div className="ticket-notch bg-surface-container rounded-[12px] p-3 mb-3 relative">
                                <p
                                  className={`font-display-xl text-[15px] tracking-widest font-bold ${
                                    card.platinumOnly
                                      ? "text-inverse-surface"
                                      : card.tier === "exclusive"
                                      ? "text-error"
                                      : card.pts === 1500
                                      ? "text-[#b8860b]"
                                      : "text-secondary"
                                  }`}
                                >
                                  {card.code}
                                </p>
                                <p className="font-body-md text-[11px] text-on-surface-variant mt-0.5">
                                  ৳{card.discount} off your next order
                                </p>
                              </div>
                              <div className="flex flex-col gap-1.5 mb-4 mt-auto">
                                <div className="flex items-center gap-1.5">
                                  <span className="material-symbols-outlined text-[13px] text-on-surface-variant/50">
                                    cancel
                                  </span>
                                  <span className="font-body-md text-[11px] text-on-surface-variant">
                                    {card.pts.toLocaleString()} points required
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="material-symbols-outlined text-[13px] text-on-surface-variant/50">
                                    cancel
                                  </span>
                                  <span className="font-body-md text-[11px] text-on-surface-variant">
                                    {card.platinumOnly ? "Platinum tier only" : `Need ${(card.pts - totalPoints).toLocaleString()} more points`}
                                  </span>
                                </div>
                              </div>
                              <div className="w-full bg-surface-container-high text-on-surface-variant font-body-md text-[12px] font-medium py-2.5 rounded-full flex items-center justify-center gap-1.5 cursor-not-allowed">
                                <span className="material-symbols-outlined text-[14px]">lock</span>
                                {card.platinumOnly ? "Platinum Required" : "Not Enough Points"}
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // Active / Redeemable Card
                      return (
                        <div
                          key={i}
                          className={`coupon-card bg-surface-container-low border rounded-[18px] overflow-hidden flex flex-col relative ${
                            card.code === "SHD-CLSC" ? "border-2 border-primary/30" : "border-outline-variant/40"
                          }`}
                        >
                          <div
                            className={`h-2 ${
                              card.code === "SHD-CLSC"
                                ? "bg-gradient-to-r from-primary to-primary-container"
                                : card.pts === 1000
                                ? "bg-gradient-to-r from-secondary to-secondary-fixed-dim"
                                : "bg-gradient-to-r from-tertiary to-tertiary-container"
                            }`}
                          ></div>
                          {card.code === "SHD-CLSC" && (
                            <div className="absolute top-3 right-3 z-10">
                              <span className="inline-flex items-center gap-0.5 bg-primary text-on-primary font-label-caps text-[8px] px-2 py-1 rounded-full uppercase tracking-widest shadow-sm">
                                <span className="material-symbols-outlined text-[10px]">local_fire_department</span>
                                Popular
                              </span>
                            </div>
                          )}
                          <div className="p-4 flex-1 flex flex-col">
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <div>
                                <span
                                  className={`inline-flex items-center gap-1 font-label-caps text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider mb-1.5 ${
                                    card.code === "SHD-CLSC"
                                      ? "bg-primary-fixed text-on-primary-container"
                                      : card.pts === 1000
                                      ? "bg-secondary-container text-on-secondary-container"
                                      : "bg-tertiary-fixed text-on-tertiary-container"
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-[10px]">local_offer</span>
                                  Standard
                                </span>
                                <p className="font-headline-md text-[15px] font-bold text-on-surface">{card.label}</p>
                              </div>
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md shrink-0 ${
                                  card.code === "SHD-CLSC" ? "mt-5" : ""
                                } ${
                                  card.code === "SHD-CLSC"
                                    ? "bg-gradient-to-br from-primary to-on-primary-fixed-variant"
                                    : card.pts === 1000
                                    ? "bg-gradient-to-br from-secondary to-on-secondary-fixed"
                                    : "bg-gradient-to-br from-tertiary to-on-tertiary-container"
                                }`}
                              >
                                <span className="font-bold text-white text-[11px] text-center leading-tight">
                                  ৳{card.discount}
                                </span>
                              </div>
                            </div>
                            <div className="ticket-notch bg-surface-container rounded-[12px] p-3 mb-3 relative">
                              <p
                                className={`font-display-xl text-[15px] tracking-widest font-bold ${
                                  card.code === "SHD-CLSC"
                                    ? "text-primary"
                                    : card.pts === 1000
                                    ? "text-secondary"
                                    : "text-tertiary"
                                }`}
                              >
                                {card.code}
                              </p>
                              <p className="font-body-md text-[11px] text-on-surface-variant mt-0.5">
                                ৳{card.discount} off your next order
                              </p>
                            </div>
                            <div className="flex flex-col gap-1.5 mb-4 mt-auto">
                              <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[13px] text-secondary">check_circle</span>
                                <span className="font-body-md text-[11px] text-on-surface-variant">
                                  {card.pts.toLocaleString()} points required
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[13px] text-secondary">check_circle</span>
                                <span className="font-body-md text-[11px] text-on-surface-variant">
                                  Min. order ৳{card.minOrder}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[13px] text-secondary">check_circle</span>
                                <span className="font-body-md text-[11px] text-on-surface-variant">
                                  Valid for 30 days
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handlePresetRedeemClick(card)}
                              className={`w-full font-body-md text-[12px] font-medium py-2.5 rounded-full transition-colors flex items-center justify-center gap-1.5 ${
                                card.code === "SHD-CLSC"
                                  ? "bg-primary text-on-primary hover:bg-primary/90 shadow-md"
                                  : card.pts === 1000
                                  ? "bg-secondary text-on-secondary hover:bg-secondary/90"
                                  : "bg-tertiary text-on-tertiary hover:bg-tertiary/90"
                              }`}
                            >
                              <span className="material-symbols-outlined text-[14px]">redeem</span>
                              Redeem {card.pts.toLocaleString()} pts
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* ── Active Coupons ── */}
              <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden">
                <div className="flex items-center justify-between p-5 md:p-6 border-b border-outline-variant/20">
                  <h2 className="font-headline-md text-[16px] md:text-[19px] font-semibold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px] md:text-[20px]">
                      local_offer
                    </span>
                    My Active Coupons
                    <span id="active-count" className="bg-primary text-on-primary font-label-caps text-[9px] px-2 py-0.5 rounded-full">
                      {activeCoupons.length}
                    </span>
                  </h2>
                  <span className="font-body-md text-[12px] text-on-surface-variant">Use at checkout</span>
                </div>
                <div id="active-coupons-list" className="divide-y divide-outline-variant/15 p-5 md:p-6 space-y-3">
                  {activeCoupons.map((coupon) => (
                    <div
                      key={coupon.id}
                      className={`border border-outline-variant/40 rounded-[16px] p-4 flex flex-col sm:flex-row sm:items-center gap-4 ${
                        coupon.discount >= 110
                          ? "bg-gradient-to-r from-secondary/6 to-background"
                          : coupon.discount >= 50
                          ? "bg-gradient-to-r from-primary/6 to-background"
                          : "bg-gradient-to-r from-tertiary/6 to-background"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span
                            className={`font-display-xl text-[17px] tracking-widest font-bold ${
                              coupon.discount >= 110
                                ? "text-secondary"
                                : coupon.discount >= 50
                                ? "text-primary"
                                : "text-tertiary"
                            }`}
                          >
                            {coupon.code}
                          </span>
                          <span className="inline-flex items-center gap-0.5 bg-secondary-container text-on-secondary-container font-label-caps text-[8px] px-2 py-0.5 rounded-full uppercase tracking-widest">
                            <span className="material-symbols-outlined text-[10px]">check_circle</span>{" "}
                            {coupon.isNew ? "New" : "Active"}
                          </span>
                        </div>
                        <p className="font-body-md text-[12px] text-on-surface-variant">
                          ৳{coupon.discount} off · Min. order ৳{coupon.minOrder}
                        </p>
                        <p className="font-body-md text-[11px] text-on-surface-variant/60 mt-0.5">
                          Expires: {coupon.expiryStr}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => copyCouponCode(coupon.code)}
                          className={`inline-flex items-center gap-1 font-body-md text-[11px] border px-3 py-1.5 rounded-full transition-colors ${
                            coupon.discount >= 110
                              ? "text-secondary border-secondary/30 hover:bg-secondary hover:text-on-secondary"
                              : coupon.discount >= 50
                              ? "text-primary border-primary/30 hover:bg-primary hover:text-on-primary"
                              : "text-tertiary border-tertiary/30 hover:bg-tertiary hover:text-on-tertiary"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[13px]">content_copy</span>
                          Copy Code
                        </button>
                        <Link
                          href="/products"
                          className={`inline-flex items-center gap-1 font-body-md text-[11px] px-3 py-1.5 rounded-full transition-colors shadow-sm ${
                            coupon.discount >= 110
                              ? "text-on-secondary bg-secondary hover:bg-secondary/90"
                              : coupon.discount >= 50
                              ? "text-on-primary bg-primary hover:bg-primary/90"
                              : "text-on-tertiary bg-tertiary hover:bg-tertiary/90"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[13px]">shopping_cart</span>
                          Use Now
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Points History ── */}
              <div className="bg-surface rounded-[20px] md:rounded-[24px] border border-outline-variant/40 shadow-md overflow-hidden">
                <div className="flex items-center justify-between p-5 md:p-6 border-b border-outline-variant/20">
                  <h2 className="font-headline-md text-[16px] md:text-[19px] font-semibold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px] md:text-[20px]">history</span>
                    Points History
                  </h2>
                  <button className="font-body-md text-[11px] text-primary font-medium hover:underline underline-offset-4 flex items-center gap-1">
                    View All <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
                <div className="divide-y divide-outline-variant/15">
                  {historyItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 md:p-5 hover:bg-surface-container-low transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          item.isEarn ? "bg-secondary-container" : "bg-primary-fixed"
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-[18px] ${
                            item.isEarn ? "text-secondary" : "text-primary"
                          }`}
                        >
                          {item.isEarn ? "shopping_bag" : "redeem"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body-md text-[13px] font-semibold text-on-surface">{item.title}</p>
                        <p className="font-body-md text-[11px] text-on-surface-variant">{item.subtitle}</p>
                      </div>
                      <span
                        className={`font-body-md text-[13px] font-bold shrink-0 ${
                          item.isEarn ? "text-secondary" : "text-error"
                        }`}
                      >
                        {item.isEarn ? "+" : "−"}
                        {Math.abs(item.points).toLocaleString()} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
