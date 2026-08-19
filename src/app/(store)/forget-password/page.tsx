"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isEmailInputError, setIsEmailInputError] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // OTP State
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpSeconds, setOtpSeconds] = useState(899); // 14:59
  const [resendCooldown, setResendCooldown] = useState(30);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Password State
  const [newPassword, setNewPasswordVal] = useState("");
  const [confirmPassword, setConfirmPasswordVal] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Success Redirect Timer
  const [redirectCount, setRedirectCount] = useState(5);

  // Animation helper
  const [shakeStep1, setShakeStep1] = useState(false);
  const [shakeOtpGroup, setShakeOtpGroup] = useState(false);
  const [shakeStep3, setShakeStep3] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Password strength checks
  const hasLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-]/.test(newPassword);
  const hasUpper = /[A-Z]/.test(newPassword);

  let strengthScore = 0;
  if (hasLength) strengthScore++;
  if (hasNumber) strengthScore++;
  if (hasSpecial) strengthScore++;
  if (hasUpper) strengthScore++;

  const isPasswordMatch = confirmPassword.length > 0 && newPassword === confirmPassword;

  // Code countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (currentStep === 2) {
      interval = setInterval(() => {
        setOtpSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentStep]);

  // Resend cooldown timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (currentStep === 2 && resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentStep, resendCooldown]);

  // Success redirect countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (currentStep === 4) {
      interval = setInterval(() => {
        setRedirectCount((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            window.location.href = "/signin";
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentStep]);

  const formatTime = (totalSeconds: number) => {
    if (totalSeconds <= 0) return "Expired";
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleOtpChange = (value: string, idx: number) => {
    const val = value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1);
    setOtp(newOtp);
    if (val && idx < 5) {
      otpRefs.current[idx + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
    if (e.key === "Enter") {
      verifyOTP();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((ch, i) => {
      if (i < 6) {
        newOtp[i] = ch;
      }
    });
    setOtp(newOtp);
    const focusIdx = Math.min(pasted.length, 5);
    otpRefs.current[focusIdx]?.focus();
  };

  const triggerShake = (type: "step1" | "otp" | "step3") => {
    if (type === "step1") {
      setShakeStep1(true);
      setTimeout(() => setShakeStep1(false), 450);
    } else if (type === "otp") {
      setShakeOtpGroup(true);
      setTimeout(() => setShakeOtpGroup(false), 450);
    } else if (type === "step3") {
      setShakeStep3(true);
      setTimeout(() => setShakeStep3(false), 450);
    }
  };

  const isValidEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const sendOTP = async () => {
    setEmailError("");
    setIsEmailInputError(false);

    if (!email || !isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      setIsEmailInputError(true);
      triggerShake("step1");
      return;
    }

    setIsSendingEmail(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setEmailError(data.error || "Failed to send reset code.");
        setIsEmailInputError(true);
        setIsSendingEmail(false);
        triggerShake("step1");
        return;
      }

      setIsSendingEmail(false);
      setCurrentStep(2);
      setResendCooldown(30);
      setOtpSeconds(899);
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    } catch (error) {
      setEmailError("Network error. Please try again.");
      setIsEmailInputError(true);
      setIsSendingEmail(false);
      triggerShake("step1");
    }
  };

  const verifyOTP = async () => {
    setOtpError("");
    const code = otp.join("");

    if (code.length < 6) {
      setOtpError("Please enter the complete 6-digit code.");
      triggerShake("otp");
      return;
    }

    setIsVerifyingOtp(true);

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setOtpError(data.error || "Invalid or expired code.");
        setIsVerifyingOtp(false);
        triggerShake("otp");
        return;
      }

      setIsVerifyingOtp(false);
      setCurrentStep(3);
    } catch (error) {
      setOtpError("Network error. Please try again.");
      setIsVerifyingOtp(false);
      triggerShake("otp");
    }
  };

  const resendOTP = async () => {
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setOtpSeconds(899);
        setResendCooldown(30);
        setTimeout(() => {
          otpRefs.current[0]?.focus();
        }, 100);
      }
    } catch (error) {
      setOtpError("Failed to resend code. Please try again.");
    }
  };

  const setNewPassword = async () => {
    setPasswordError("");

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      triggerShake("step3");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match. Please try again.");
      triggerShake("step3");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const code = otp.join("");
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          code, 
          newPassword 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(data.error || "Failed to reset password.");
        setIsUpdatingPassword(false);
        triggerShake("step3");
        return;
      }

      setIsUpdatingPassword(false);
      setCurrentStep(4);
    } catch (error) {
      setPasswordError("Network error. Please try again.");
      setIsUpdatingPassword(false);
      triggerShake("step3");
    }
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* Ambient orbs */
            .orb {
              position: absolute;
              border-radius: 9999px;
              filter: blur(90px);
              pointer-events: none;
            }

            /* Input focus */
            .input-field {
              transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
            }
            .input-field:focus {
              outline: none;
              border-color: #9f4122;
              box-shadow: 0 0 0 3px rgba(159,65,34,0.12);
              background-color: #ffffff;
            }
            .input-field.error {
              border-color: #ba1a1a;
              box-shadow: 0 0 0 3px rgba(186,26,26,0.1);
            }

            /* Primary button */
            .btn-primary {
              transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
            }
            .btn-primary:hover {
              transform: translateY(-2px);
              box-shadow: 0 14px 36px rgba(159,65,34,0.32);
            }
            .btn-primary:active { transform: translateY(0); }
            .btn-primary:disabled { transform: none; box-shadow: none; }

            /* Eye toggle */
            .eye-btn {
              cursor: pointer;
              transition: color 0.15s ease;
            }
            .eye-btn:hover { color: #9f4122; }

            /* Card entrance */
            @keyframes fadeUp {
              from { opacity: 0; transform: translateY(28px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
            .delay-1 { animation-delay: 0.1s; }
            .delay-2 { animation-delay: 0.2s; }

            /* Float animations */
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50%       { transform: translateY(-10px); }
            }
            .float-1 { animation: float 4s ease-in-out infinite; }
            .float-2 { animation: float 5s ease-in-out infinite 0.8s; }
            .float-3 { animation: float 3.5s ease-in-out infinite 1.6s; }

            /* Shake for errors */
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              20%       { transform: translateX(-8px); }
              40%       { transform: translateX(8px); }
              60%       { transform: translateX(-5px); }
              80%       { transform: translateX(5px); }
            }
            .shake { animation: shake 0.45s ease; }

            /* Success checkmark */
            @keyframes scaleIn {
              from { opacity: 0; transform: scale(0.5); }
              to   { opacity: 1; transform: scale(1); }
            }
            .scale-in { animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

            /* Step transition */
            @keyframes slideIn {
              from { opacity: 0; transform: translateX(24px); }
              to   { opacity: 1; transform: translateX(0); }
            }
            .slide-in { animation: slideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both; }

            /* Divider line */
            .divider-line {
              flex: 1;
              height: 1px;
              background: #ddc0b8;
              opacity: 0.5;
            }

            /* Password strength bar */
            .strength-bar {
              height: 3px;
              border-radius: 9999px;
              transition: width 0.4s ease, background-color 0.4s ease;
            }

            /* OTP input group */
            .otp-input {
              width: 48px;
              height: 52px;
              text-align: center;
              font-size: 20px;
              font-weight: 700;
              border-radius: 16px;
              border: 1.5px solid #ddc0b8;
              background: #f9f3e8;
              transition: border-color 0.2s ease, box-shadow 0.2s ease;
              caret-color: #9f4122;
            }
            .otp-input:focus {
              outline: none;
              border-color: #9f4122;
              box-shadow: 0 0 0 3px rgba(159,65,34,0.12);
              background: #ffffff;
            }
            @media (max-width: 360px) {
              .otp-input { width: 40px; height: 46px; font-size: 17px; }
            }
          `,
        }}
      />

      <main className="min-h-screen flex flex-col">
        <section className="relative flex-1 flex items-center justify-center px-4 pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed/20 via-background to-tertiary-fixed/20 -z-10"></div>

          {/* Orbs */}
          <div className="orb w-80 h-80 md:w-[520px] md:h-[520px] bg-primary-container/18 top-0 -left-20 md:-left-32 -z-10"></div>
          <div className="orb w-60 h-60 md:w-[400px] md:h-[400px] bg-secondary-container/20 bottom-0 -right-12 md:-right-24 -z-10"></div>
          <div className="orb w-36 h-36 md:w-56 md:h-56 bg-tertiary-fixed/25 top-1/2 right-1/3 -z-10"></div>

          <div className="w-full max-w-6xl mx-auto">
            {/* Two-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
              {/* ─── LEFT: Brand Panel ─── */}
              <div className="hidden lg:flex flex-col justify-center pr-6 animate-fade-up">
                <div className="inline-flex items-center gap-2 bg-surface/70 backdrop-blur-xl border border-outline-variant/50 rounded-full px-4 py-2 mb-8 shadow-sm w-fit">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="font-body-md text-body-md text-on-surface">Account Recovery</span>
                </div>

                <h1 className="font-display-xl text-[52px] leading-[1.1] tracking-tighter text-on-surface mb-5">
                  Locked out?
                  <br />
                  We&apos;ve got
                  <br />
                  <span className="text-primary">you covered.</span>
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-sm">
                  Resetting your password is quick and secure. You&apos;ll be back to your spice favourites in no time.
                </p>

                {/* Security info cards */}
                <div className="space-y-3 mb-8">
                  <div className="float-1 bg-surface/90 backdrop-blur border border-outline-variant/40 rounded-[20px] px-5 py-4 shadow-md flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-container/50 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-[20px]">lock_reset</span>
                    </div>
                    <div>
                      <p className="text-on-surface font-semibold text-[13px]">Secure Reset Link</p>
                      <p className="text-on-surface-variant text-[12px]">Expires in 15 minutes for your safety</p>
                    </div>
                  </div>
                  <div className="float-2 bg-surface/90 backdrop-blur border border-outline-variant/40 rounded-[20px] px-5 py-4 shadow-md flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary-container/60 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-secondary text-[20px]">verified_user</span>
                    </div>
                    <div>
                      <p className="text-on-surface font-semibold text-[13px]">OTP Verified</p>
                      <p className="text-on-surface-variant text-[12px]">6-digit code sent to your email</p>
                    </div>
                  </div>
                  <div className="float-3 bg-surface/90 backdrop-blur border border-outline-variant/40 rounded-[20px] px-5 py-4 shadow-md flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-tertiary-container/50 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-tertiary text-[20px]">encrypted</span>
                    </div>
                    <div>
                      <p className="text-on-surface font-semibold text-[13px]">End-to-End Encrypted</p>
                      <p className="text-on-surface-variant text-[12px]">Your new password is always private</p>
                    </div>
                  </div>
                </div>

                {/* Stats strip */}
                <div className="flex items-center gap-6 bg-surface/60 backdrop-blur border border-outline-variant/30 rounded-[20px] px-6 py-4 shadow-sm">
                  <div className="text-center">
                    <p className="font-display-xl text-[22px] tracking-tight text-primary font-bold">~30s</p>
                    <p className="text-on-surface-variant text-[11px]">Avg. reset time</p>
                  </div>
                  <div className="w-px h-10 bg-outline-variant/40"></div>
                  <div className="text-center">
                    <p className="font-display-xl text-[22px] tracking-tight text-primary font-bold">SSL</p>
                    <p className="text-on-surface-variant text-[11px]">Secured transfer</p>
                  </div>
                  <div className="w-px h-10 bg-outline-variant/40"></div>
                  <div className="text-center">
                    <p className="font-display-xl text-[22px] tracking-tight text-primary font-bold">256-bit</p>
                    <p className="text-on-surface-variant text-[11px]">Encryption</p>
                  </div>
                </div>
              </div>
              {/* end left */}

              {/* ─── RIGHT: Form Card ─── */}
              <div className="w-full animate-fade-up delay-1">
                <div className="bg-surface/90 backdrop-blur-xl rounded-[28px] md:rounded-[32px] border border-outline-variant/40 shadow-[0_24px_64px_rgba(159,65,34,0.10)] p-6 md:p-10">
                  {/* Progress Steps (top) */}
                  <div id="step-indicator" className="flex items-center gap-2 mb-7 md:mb-8">
                    {/* Step 1 */}
                    <div
                      id="step-dot-1"
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        currentStep > 1
                          ? "bg-secondary"
                          : currentStep === 1
                          ? "bg-primary"
                          : "bg-surface-variant"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[16px] ${
                          currentStep > 1 ? "text-on-secondary" : "text-on-primary"
                        }`}
                      >
                        {currentStep > 1 ? "check" : "mail"}
                      </span>
                    </div>
                    <div id="step-line-1" className="flex-1 h-[2px] bg-outline-variant/40 rounded-full overflow-hidden">
                      <div
                        id="step-fill-1"
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: currentStep > 1 ? "100%" : "0%" }}
                      ></div>
                    </div>
                    {/* Step 2 */}
                    <div
                      id="step-dot-2"
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        currentStep > 2
                          ? "bg-secondary"
                          : currentStep === 2
                          ? "bg-primary"
                          : "bg-surface-variant"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[16px] ${
                          currentStep > 2
                            ? "text-on-secondary"
                            : currentStep === 2
                            ? "text-on-primary"
                            : "text-on-surface-variant"
                        }`}
                      >
                        {currentStep > 2 ? "check" : "pin"}
                      </span>
                    </div>
                    <div id="step-line-2" className="flex-1 h-[2px] bg-outline-variant/40 rounded-full overflow-hidden">
                      <div
                        id="step-fill-2"
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: currentStep > 2 ? "100%" : "0%" }}
                      ></div>
                    </div>
                    {/* Step 3 */}
                    <div
                      id="step-dot-3"
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        currentStep > 3
                          ? "bg-secondary"
                          : currentStep === 3
                          ? "bg-primary"
                          : "bg-surface-variant"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[16px] ${
                          currentStep > 3
                            ? "text-on-secondary"
                            : currentStep === 3
                            ? "text-on-primary"
                            : "text-on-surface-variant"
                        }`}
                      >
                        {currentStep > 3 ? "check" : "lock_reset"}
                      </span>
                    </div>
                  </div>

                  {/* Mobile brand logo */}
                  <div className="flex items-center gap-2 mb-5 lg:hidden">
                    <span className="material-symbols-outlined text-primary text-[22px]">shopping_basket</span>
                    <span className="font-bold text-primary text-[16px] tracking-tight">Khati Family</span>
                  </div>

                  {/* ═══════════════════════════════════
                       STEP 1: Request Reset Link
                  ═══════════════════════════════════ */}
                  <div id="step-1" className={currentStep === 1 ? "block slide-in" : "hidden"}>
                    <div className="mb-7 md:mb-8">
                      <div className="w-12 h-12 bg-primary-fixed/60 rounded-2xl flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-primary text-[26px]">key</span>
                      </div>
                      <h2 className="font-display-xl text-[26px] md:text-[34px] leading-tight tracking-tight text-on-surface mb-1.5">
                        Forgot your password?
                      </h2>
                      <p className="text-on-surface-variant text-[13px] md:text-body-md">
                        No worries! Enter your registered email and we&apos;ll send you a 6-digit OTP to verify your identity.
                      </p>
                    </div>

                    {/* Error Banner */}
                    {emailError && (
                      <div className="mb-5 flex items-center gap-3 bg-error-container/60 border border-error/20 rounded-[16px] px-4 py-3.5 animate-fade-up">
                        <span className="material-symbols-outlined text-error text-[20px] shrink-0">error</span>
                        <p className="text-[13px] text-on-error-container font-medium">{emailError}</p>
                      </div>
                    )}

                    <div id="step1-form" className={`space-y-5 ${shakeStep1 ? "shake" : ""}`}>
                      {/* Email */}
                      <div>
                        <label
                          className="block text-[12px] md:text-[13px] font-semibold text-on-surface mb-1.5 uppercase tracking-wider"
                          htmlFor="reset-email"
                        >
                          Email Address
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px] md:text-[20px] pointer-events-none">
                            mail
                          </span>
                          <input
                            type="email"
                            id="reset-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className={`input-field w-full bg-surface-container-low border border-outline-variant/60 rounded-full pl-10 md:pl-11 pr-4 py-3 md:py-3.5 text-[13px] md:text-body-md text-on-surface placeholder:text-outline/60 font-body-md ${
                              isEmailInputError ? "error" : ""
                            }`}
                            autoComplete="email"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") sendOTP();
                            }}
                          />
                        </div>
                      </div>

                      {/* Submit */}
                      <div className="pt-1">
                        <button
                          type="button"
                          id="send-otp-btn"
                          onClick={sendOTP}
                          disabled={isSendingEmail}
                          className="btn-primary w-full bg-primary text-on-primary font-semibold text-[14px] md:text-body-lg py-3.5 md:py-4 rounded-full shadow-lg flex items-center justify-center gap-2.5 group"
                        >
                          <span className="material-symbols-outlined text-[20px] md:text-[22px] group-hover:scale-110 transition-transform">
                            send
                          </span>
                          <span>{isSendingEmail ? "Sending…" : "Send Reset Code"}</span>
                          <span className="material-symbols-outlined text-[18px] md:text-[20px] text-secondary-fixed group-hover:translate-x-1 transition-transform">
                            arrow_forward
                          </span>
                        </button>
                      </div>

                      {/* Back link */}
                      <p className="text-center text-[13px] text-on-surface-variant">
                        Remembered it?
                        <Link href="/signin" className="text-primary font-semibold hover:underline underline-offset-2 ml-0.5">
                          Back to Sign In →
                        </Link>
                      </p>
                    </div>

                    {/* Trust badges */}
                    <div className="mt-6 pt-5 border-t border-outline-variant/20 flex items-center justify-center gap-4 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-secondary text-[15px]">lock</span>
                        <span className="text-[11px] text-on-surface-variant">SSL Secured</span>
                      </div>
                      <div className="w-px h-4 bg-outline-variant/40"></div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-secondary text-[15px]">verified_user</span>
                        <span className="text-[11px] text-on-surface-variant">Data Protected</span>
                      </div>
                      <div className="w-px h-4 bg-outline-variant/40"></div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-secondary text-[15px]">verified</span>
                        <span className="text-[11px] text-on-surface-variant">BSTI Certified</span>
                      </div>
                    </div>
                  </div>

                  {/* ═══════════════════════════════════
                       STEP 2: Verify OTP
                  ═══════════════════════════════════ */}
                  <div id="step-2" className={currentStep === 2 ? "block slide-in" : "hidden"}>
                    <div className="mb-7 md:mb-8">
                      <div className="w-12 h-12 bg-secondary-container/70 rounded-2xl flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-secondary text-[26px]">mark_email_read</span>
                      </div>
                      <h2 className="font-display-xl text-[26px] md:text-[34px] leading-tight tracking-tight text-on-surface mb-1.5">
                        Check your inbox
                      </h2>
                      <p className="text-on-surface-variant text-[13px] md:text-body-md" id="otp-sent-to">
                        We&apos;ve sent a 6-digit verification code to <strong className="text-on-surface">{email || "your@email.com"}</strong>. Enter it below to continue.
                      </p>
                    </div>

                    {/* OTP Error Banner */}
                    {otpError && (
                      <div className="mb-5 flex items-center gap-3 bg-error-container/60 border border-error/20 rounded-[16px] px-4 py-3.5 animate-fade-up">
                        <span className="material-symbols-outlined text-error text-[20px] shrink-0">error</span>
                        <p className="text-[13px] text-on-error-container font-medium">{otpError}</p>
                      </div>
                    )}

                    <div className="space-y-6">
                      {/* OTP Boxes */}
                      <div>
                        <label className="block text-[12px] md:text-[13px] font-semibold text-on-surface mb-3 uppercase tracking-wider">
                          Verification Code
                        </label>
                        <div
                          className={`flex items-center gap-2 sm:gap-3 justify-center ${
                            shakeOtpGroup ? "shake" : ""
                          }`}
                          id="otp-group"
                        >
                          {otp.map((val, idx) => (
                            <React.Fragment key={idx}>
                              {idx === 3 && (
                                <div className="w-4 h-[2px] bg-outline-variant/60 rounded-full shrink-0"></div>
                              )}
                              <input
                                ref={(el) => {
                                  otpRefs.current[idx] = el;
                                }}
                                className="otp-input"
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={val}
                                onChange={(e) => handleOtpChange(e.target.value, idx)}
                                onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                                onPaste={handleOtpPaste}
                              />
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      {/* Timer + Resend */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-outline text-[16px]">timer</span>
                          <span className="text-[13px] text-on-surface-variant">
                            Code expires in <strong className="text-on-surface">{formatTime(otpSeconds)}</strong>
                          </span>
                        </div>
                        <button
                          type="button"
                          id="resend-btn"
                          onClick={resendOTP}
                          disabled={resendCooldown > 0}
                          className={`text-[13px] ${
                            resendCooldown > 0
                              ? "text-on-surface-variant cursor-not-allowed"
                              : "text-primary cursor-pointer font-semibold"
                          }`}
                        >
                          <span>{resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : "Resend code"}</span>
                        </button>
                      </div>

                      {/* Verify Button */}
                      <button
                        type="button"
                        id="verify-otp-btn"
                        onClick={verifyOTP}
                        disabled={isVerifyingOtp}
                        className="btn-primary w-full bg-primary text-on-primary font-semibold text-[14px] md:text-body-lg py-3.5 md:py-4 rounded-full shadow-lg flex items-center justify-center gap-2.5 group"
                      >
                        <span className="material-symbols-outlined text-[20px] md:text-[22px] group-hover:scale-110 transition-transform">
                          verified
                        </span>
                        <span>{isVerifyingOtp ? "Verifying…" : "Verify Code"}</span>
                        <span className="material-symbols-outlined text-[18px] md:text-[20px] text-secondary-fixed group-hover:translate-x-1 transition-transform">
                          arrow_forward
                        </span>
                      </button>

                      {/* Back */}
                      <p className="text-center text-[13px] text-on-surface-variant">
                        Wrong email?
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="text-primary font-semibold hover:underline underline-offset-2 ml-0.5"
                        >
                          Change email →
                        </button>
                      </p>
                    </div>

                    {/* Trust badges */}
                    <div className="mt-6 pt-5 border-t border-outline-variant/20 flex items-center justify-center gap-4 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-secondary text-[15px]">lock</span>
                        <span className="text-[11px] text-on-surface-variant">SSL Secured</span>
                      </div>
                      <div className="w-px h-4 bg-outline-variant/40"></div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-secondary text-[15px]">verified_user</span>
                        <span className="text-[11px] text-on-surface-variant">Data Protected</span>
                      </div>
                      <div className="w-px h-4 bg-outline-variant/40"></div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-secondary text-[15px]">verified</span>
                        <span className="text-[11px] text-on-surface-variant">BSTI Certified</span>
                      </div>
                    </div>
                  </div>

                  {/* ═══════════════════════════════════
                       STEP 3: Set New Password
                  ═══════════════════════════════════ */}
                  <div id="step-3" className={currentStep === 3 ? "block slide-in" : "hidden"}>
                    <div className="mb-7 md:mb-8">
                      <div className="w-12 h-12 bg-tertiary-container/60 rounded-2xl flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-tertiary text-[26px]">lock_reset</span>
                      </div>
                      <h2 className="font-display-xl text-[26px] md:text-[34px] leading-tight tracking-tight text-on-surface mb-1.5">
                        Set a new password
                      </h2>
                      <p className="text-on-surface-variant text-[13px] md:text-body-md">
                        Create a strong password you haven&apos;t used before. It must be at least 8 characters.
                      </p>
                    </div>

                    {/* Error Banner */}
                    {passwordError && (
                      <div className="mb-5 flex items-center gap-3 bg-error-container/60 border border-error/20 rounded-[16px] px-4 py-3.5 animate-fade-up">
                        <span className="material-symbols-outlined text-error text-[20px] shrink-0">error</span>
                        <p className="text-[13px] text-on-error-container font-medium">{passwordError}</p>
                      </div>
                    )}

                    <div id="step3-form" className={`space-y-4 ${shakeStep3 ? "shake" : ""}`}>
                      {/* New Password */}
                      <div>
                        <label
                          className="block text-[12px] md:text-[13px] font-semibold text-on-surface mb-1.5 uppercase tracking-wider"
                          htmlFor="new-password"
                        >
                          New Password
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px] md:text-[20px] pointer-events-none">
                            lock
                          </span>
                          <input
                            type={showNewPassword ? "text" : "password"}
                            id="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPasswordVal(e.target.value)}
                            placeholder="Enter new password"
                            className="input-field w-full bg-surface-container-low border border-outline-variant/60 rounded-full pl-10 md:pl-11 pr-11 md:pr-12 py-3 md:py-3.5 text-[13px] md:text-body-md text-on-surface placeholder:text-outline/60 font-body-md"
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            className="eye-btn absolute right-4 top-1/2 -translate-y-1/2 text-outline"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                              {showNewPassword ? "visibility" : "visibility_off"}
                            </span>
                          </button>
                        </div>

                        {/* Strength meter */}
                        <div className="mt-2.5 space-y-1.5">
                          <div className="flex gap-1.5">
                            {[1, 2, 3, 4].map((num) => {
                              const isFilled = strengthScore >= num;
                              const barColor =
                                strengthScore > 0
                                  ? ["#ba1a1a", "#e8742a", "#556500", "#326578"][strengthScore - 1]
                                  : "";
                              return (
                                <div key={num} className="flex-1 h-[3px] rounded-full bg-outline-variant/30 overflow-hidden">
                                  <div
                                    className="strength-bar h-full"
                                    style={{
                                      width: isFilled ? "100%" : "0%",
                                      backgroundColor: barColor,
                                    }}
                                  ></div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] text-on-surface-variant" id="strength-label">
                              {newPassword.length === 0 ? "Use 8+ chars, numbers & symbols" : ""}
                            </p>
                            <p
                              className="text-[11px] font-semibold"
                              id="strength-word"
                              style={{
                                color:
                                  strengthScore > 0
                                    ? ["#ba1a1a", "#e8742a", "#556500", "#326578"][strengthScore - 1]
                                    : "transparent",
                              }}
                            >
                              {newPassword.length > 0 ? ["Weak", "Fair", "Good", "Strong"][strengthScore - 1] : ""}
                            </p>
                          </div>
                        </div>

                        {/* Requirements checklist */}
                        <div className="mt-3 space-y-1.5" id="pw-requirements">
                          <div className="flex items-center gap-2" id="req-length">
                            <span
                              className={`material-symbols-outlined text-[14px] ${
                                hasLength ? "text-secondary" : "text-outline-variant"
                              }`}
                            >
                              {hasLength ? "check_circle" : "radio_button_unchecked"}
                            </span>
                            <span
                              className={`text-[12px] ${
                                hasLength ? "text-secondary font-medium" : "text-on-surface-variant"
                              }`}
                            >
                              At least 8 characters
                            </span>
                          </div>
                          <div className="flex items-center gap-2" id="req-number">
                            <span
                              className={`material-symbols-outlined text-[14px] ${
                                hasNumber ? "text-secondary" : "text-outline-variant"
                              }`}
                            >
                              {hasNumber ? "check_circle" : "radio_button_unchecked"}
                            </span>
                            <span
                              className={`text-[12px] ${
                                hasNumber ? "text-secondary font-medium" : "text-on-surface-variant"
                              }`}
                            >
                              Contains a number
                            </span>
                          </div>
                          <div className="flex items-center gap-2" id="req-special">
                            <span
                              className={`material-symbols-outlined text-[14px] ${
                                hasSpecial ? "text-secondary" : "text-outline-variant"
                              }`}
                            >
                              {hasSpecial ? "check_circle" : "radio_button_unchecked"}
                            </span>
                            <span
                              className={`text-[12px] ${
                                hasSpecial ? "text-secondary font-medium" : "text-on-surface-variant"
                              }`}
                            >
                              Contains a special character
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label
                          className="block text-[12px] md:text-[13px] font-semibold text-on-surface mb-1.5 uppercase tracking-wider"
                          htmlFor="confirm-password"
                        >
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px] md:text-[20px] pointer-events-none">
                            lock_open
                          </span>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPasswordVal(e.target.value)}
                            placeholder="Re-enter new password"
                            className="input-field w-full bg-surface-container-low border border-outline-variant/60 rounded-full pl-10 md:pl-11 pr-11 md:pr-12 py-3 md:py-3.5 text-[13px] md:text-body-md text-on-surface placeholder:text-outline/60 font-body-md"
                            autoComplete="new-password"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") setNewPassword();
                            }}
                          />
                          <button
                            type="button"
                            className="eye-btn absolute right-4 top-1/2 -translate-y-1/2 text-outline"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                              {showConfirmPassword ? "visibility" : "visibility_off"}
                            </span>
                          </button>
                        </div>
                        {/* Match indicator */}
                        {isPasswordMatch && (
                          <div id="match-indicator" className="mt-2 flex items-center gap-1.5 animate-fade-up">
                            <span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
                            <span className="text-[12px] text-secondary font-medium">Passwords match</span>
                          </div>
                        )}
                      </div>

                      {/* Submit */}
                      <div className="pt-2">
                        <button
                          type="button"
                          id="set-password-btn"
                          onClick={setNewPassword}
                          disabled={isUpdatingPassword}
                          className="btn-primary w-full bg-primary text-on-primary font-semibold text-[14px] md:text-body-lg py-3.5 md:py-4 rounded-full shadow-lg flex items-center justify-center gap-2.5 group"
                        >
                          <span className="material-symbols-outlined text-[20px] md:text-[22px] group-hover:scale-110 transition-transform">
                            lock_reset
                          </span>
                          <span>{isUpdatingPassword ? "Updating…" : "Update Password"}</span>
                          <span className="material-symbols-outlined text-[18px] md:text-[20px] text-secondary-fixed group-hover:translate-x-1 transition-transform">
                            arrow_forward
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Trust badges */}
                    <div className="mt-6 pt-5 border-t border-outline-variant/20 flex items-center justify-center gap-4 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-secondary text-[15px]">lock</span>
                        <span className="text-[11px] text-on-surface-variant">SSL Secured</span>
                      </div>
                      <div className="w-px h-4 bg-outline-variant/40"></div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-secondary text-[15px]">verified_user</span>
                        <span className="text-[11px] text-on-surface-variant">Data Protected</span>
                      </div>
                      <div className="w-px h-4 bg-outline-variant/40"></div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-secondary text-[15px]">verified</span>
                        <span className="text-[11px] text-on-surface-variant">BSTI Certified</span>
                      </div>
                    </div>
                  </div>

                  {/* ═══════════════════════════════════
                       STEP 4: Success
                  ═══════════════════════════════════ */}
                  <div id="step-4" className={currentStep === 4 ? "block text-center py-4 slide-in" : "hidden"}>
                    <div className="scale-in w-20 h-20 bg-secondary-container rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="material-symbols-outlined text-secondary text-[40px]">check_circle</span>
                    </div>
                    <h2 className="font-display-xl text-[28px] md:text-[34px] leading-tight tracking-tight text-on-surface mb-2">
                      Password updated!
                    </h2>
                    <p className="text-on-surface-variant text-[14px] md:text-body-md mb-8 max-w-xs mx-auto">
                      Your password has been reset successfully. You can now sign in with your new credentials.
                    </p>

                    {/* Countdown redirect */}
                    <div className="flex items-center justify-center gap-2 mb-7">
                      <span className="material-symbols-outlined text-outline text-[16px]">timer</span>
                      <span className="text-[13px] text-on-surface-variant">
                        Redirecting in <strong className="text-on-surface">{redirectCount}</strong>s…
                      </span>
                    </div>

                    <Link
                      href="/signin"
                      className="btn-primary inline-flex items-center gap-2.5 bg-primary text-on-primary font-semibold px-8 py-3.5 rounded-full shadow-lg hover:bg-primary/90 transition-colors text-[14px] md:text-[15px] group"
                    >
                      <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                        login
                      </span>
                      Sign In Now
                      <span className="material-symbols-outlined text-[18px] text-secondary-fixed group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </Link>

                    <p className="mt-6 text-[12px] text-on-surface-variant">
                      For security, all other sessions have been logged out.
                    </p>
                  </div>
                </div>
                {/* end card */}

                <p className="text-center text-[13px] text-on-surface-variant mt-5">
                  Don&apos;t have an account?
                  <Link href="/signup" className="text-primary font-semibold hover:underline underline-offset-2 ml-0.5">
                    Sign up free →
                  </Link>
                </p>
              </div>
              {/* end right column */}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
