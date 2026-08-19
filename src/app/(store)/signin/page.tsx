"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState({ show: false, message: "" });
  const [forgotModal, setForgotModal] = useState({ show: false, success: false });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [shaking, setShaking] = useState(false);
  const { signIn, signInWithGoogle, signInWithFacebook, resetPassword } = useAuth();
  const router = useRouter();

  const togglePass = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async () => {
    setError({ show: false, message: "" });

    if (!email.trim() || !password) {
      setError({ show: true, message: "Please enter your email and password." });
      setShaking(true);
      setTimeout(() => setShaking(false), 450);
      return;
    }

    setIsSigningIn(true);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setIsSigningIn(false);
      setError({ show: true, message: signInError.message || "Invalid email or password." });
      setShaking(true);
      setTimeout(() => setShaking(false), 450);
      return;
    }

    setIsSigningIn(false);
    setShowSuccessModal(true);
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  const handleGoogleSignIn = async () => {
    const { error: googleError } = await signInWithGoogle();
    if (googleError) {
      setError({ show: true, message: googleError.message || "Failed to sign in with Google." });
      setShaking(true);
      setTimeout(() => setShaking(false), 450);
    }
  };

  const handleFacebookSignIn = async () => {
    const { error: facebookError } = await signInWithFacebook();
    if (facebookError) {
      setError({ show: true, message: facebookError.message || "Failed to sign in with Facebook." });
      setShaking(true);
      setTimeout(() => setShaking(false), 450);
    }
  };

  const showForgot = () => {
    setForgotModal({ show: true, success: false });
  };

  const closeForgot = () => {
    setForgotModal({ ...forgotModal, show: false });
  };

  const sendReset = async () => {
    const forgotEmailInput = document.getElementById("forgot-email") as HTMLInputElement;
    if (!forgotEmailInput?.value.trim()) {
      forgotEmailInput?.focus();
      return;
    }
    const { error: resetError } = await resetPassword(forgotEmailInput.value);
    if (resetError) {
      setError({ show: true, message: resetError.message || "Failed to send reset email." });
      return;
    }
    setForgotModal({ ...forgotModal, success: true });
  };

  return (
    <main className="min-h-screen flex flex-col">
      <style jsx global>{`
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
          box-shadow: 0 0 0 3px rgba(159, 65, 34, 0.12);
          background-color: #ffffff;
        }

        /* Primary button */
        .btn-primary {
          transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(159, 65, 34, 0.32);
        }
        .btn-primary:active {
          transform: translateY(0);
        }

        /* Social button */
        .btn-social {
          transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
        }
        .btn-social:hover {
          transform: translateY(-1px);
          background-color: #f3ede2;
          border-color: #89726b;
        }

        /* Eye toggle */
        .eye-btn {
          cursor: pointer;
          transition: color 0.15s ease;
        }
        .eye-btn:hover {
          color: #9f4122;
        }

        /* Card entrance */
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .delay-1 {
          animation-delay: 0.1s;
        }

        /* Panel illustration dots */
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .float-1 {
          animation: float 4s ease-in-out infinite;
        }
        .float-2 {
          animation: float 5s ease-in-out infinite 0.8s;
        }
        .float-3 {
          animation: float 3.5s ease-in-out infinite 1.6s;
        }

        /* Shake animation for wrong password */
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-8px);
          }
          40% {
            transform: translateX(8px);
          }
          60% {
            transform: translateX(-5px);
          }
          80% {
            transform: translateX(5px);
          }
        }
        .shake {
          animation: shake 0.45s ease;
        }

        /* Forgot password link */
        .forgot-link {
          transition: color 0.15s ease;
        }
        .forgot-link:hover {
          color: #9f4122;
        }

        /* Divider label */
        .divider-line {
          flex: 1;
          height: 1px;
          background: #ddc0b8;
          opacity: 0.5;
        }

        /* Blur-lock social button overlay */
        .social-locked-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 9999px;
        }
        .social-locked-wrapper .lock-overlay {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          background: rgba(255, 255, 255, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          z-index: 10;
          animation: lockPulse 2.6s ease-in-out infinite;
          cursor: not-allowed;
          pointer-events: all;
        }
        .social-locked-wrapper .lock-overlay .lock-icon {
          font-size: 18px;
          color: #9f4122;
          animation: lockBounce 2.6s ease-in-out infinite;
        }
        .social-locked-wrapper .lock-overlay .lock-text {
          font-size: 12px;
          font-weight: 600;
          color: #9f4122;
          letter-spacing: 0.02em;
          opacity: 0;
          animation: lockTextFade 2.6s ease-in-out infinite;
        }
        @keyframes lockPulse {
          0%, 100% { background: rgba(255, 255, 255, 0.40); }
          50%       { background: rgba(255, 255, 255, 0.60); }
        }
        @keyframes lockBounce {
          0%, 100% { transform: translateY(0px) scale(1);    }
          30%       { transform: translateY(-3px) scale(1.1); }
          60%       { transform: translateY(1px) scale(0.95); }
        }
        @keyframes lockTextFade {
          0%, 20%       { opacity: 0; }
          40%, 70%      { opacity: 1; }
          90%, 100%     { opacity: 0; }
        }
      `}</style>

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
              {/* Welcome back badge */}
              <div className="inline-flex items-center gap-2 bg-surface/70 backdrop-blur-xl border border-outline-variant/50 rounded-full px-4 py-2 mb-8 shadow-sm w-fit">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="font-body-md text-body-md text-on-surface">Welcome back</span>
              </div>

              <h1 className="font-display-xl text-[52px] leading-[1.1] tracking-tighter text-on-surface mb-5">
                Good to see
                <br />
                you again,
                <br />
                <span className="text-primary">Chef.</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-sm">
                Sign in to access your orders, exclusive deals, and your saved spice favourites — right where you left off.
              </p>

              {/* Floating product cards */}
              <div className="relative h-48 mb-8">
                {/* Card 1 */}
                <div className="float-1 absolute left-0 top-2 bg-surface/90 backdrop-blur border border-outline-variant/40 rounded-[20px] px-5 py-4 shadow-md flex items-center gap-3 w-52">
                  <div className="w-10 h-10 rounded-full bg-primary-container/50 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-[20px]">local_fire_department</span>
                  </div>
                  <div>
                    <p className="text-on-surface font-semibold text-[13px]">Garam Masala</p>
                    <p className="text-secondary text-[12px] font-medium">৳249 — In stock</p>
                  </div>
                </div>
                {/* Card 2 */}
                <div className="float-2 absolute right-6 top-0 bg-surface/90 backdrop-blur border border-outline-variant/40 rounded-[20px] px-5 py-4 shadow-md flex items-center gap-3 w-52">
                  <div className="w-10 h-10 rounded-full bg-secondary-container/60 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary text-[20px]">nutrition</span>
                  </div>
                  <div>
                    <p className="text-on-surface font-semibold text-[13px]">Premium Almonds</p>
                    <p className="text-secondary text-[12px] font-medium">৳649 — New batch</p>
                  </div>
                </div>
                {/* Card 3 */}
                <div className="float-3 absolute left-12 bottom-0 bg-surface/90 backdrop-blur border border-outline-variant/40 rounded-[20px] px-5 py-4 shadow-md flex items-center gap-3 w-52">
                  <div className="w-10 h-10 rounded-full bg-tertiary-container/50 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-tertiary text-[20px]">grain</span>
                  </div>
                  <div>
                    <p className="text-on-surface font-semibold text-[13px]">Chana Dal</p>
                    <p className="text-secondary text-[12px] font-medium">৳189 — Farm fresh</p>
                  </div>
                </div>
              </div>

              {/* Stats strip */}
              <div className="flex items-center gap-6 bg-surface/60 backdrop-blur border border-outline-variant/30 rounded-[20px] px-6 py-4 shadow-sm">
                <div className="text-center">
                  <p className="font-display-xl text-[22px] tracking-tight text-primary font-bold">2,400+</p>
                  <p className="text-on-surface-variant text-[11px]">Happy customers</p>
                </div>
                <div className="w-px h-10 bg-outline-variant/40"></div>
                <div className="text-center">
                  <p className="font-display-xl text-[22px] tracking-tight text-primary font-bold">60+</p>
                  <p className="text-on-surface-variant text-[11px]">Spice varieties</p>
                </div>
                <div className="w-px h-10 bg-outline-variant/40"></div>
                <div className="text-center">
                  <p className="font-display-xl text-[22px] tracking-tight text-primary font-bold">100%</p>
                  <p className="text-on-surface-variant text-[11px]">Lab-tested purity</p>
                </div>
              </div>
            </div>

            {/* ─── RIGHT: Sign In Card ─── */}
            <div className="w-full animate-fade-up delay-1">
              <div className="bg-surface/90 backdrop-blur-xl rounded-[28px] md:rounded-[32px] border border-outline-variant/40 shadow-[0_24px_64px_rgba(159,65,34,0.10)] p-6 md:p-10">
                {/* Card Header */}
                <div className="mb-7 md:mb-8">
                  {/* Mobile brand logo */}
                  <div className="flex items-center gap-2 mb-5 lg:hidden">
                    <span className="material-symbols-outlined text-primary text-[22px]">shopping_basket</span>
                    <span className="font-bold text-primary text-[16px] tracking-tight">Khati Family</span>
                  </div>
                  <h2 className="font-display-xl text-[26px] md:text-[34px] leading-tight tracking-tight text-on-surface mb-1.5">
                    Sign in to your account
                  </h2>
                  <p className="text-on-surface-variant text-[13px] md:text-body-md">
                    New here?
                    <Link href="/signup" className="text-primary font-semibold hover:underline underline-offset-2 ml-0.5">
                      Create a free account
                    </Link>
                  </p>
                </div>

                {/* Error Banner */}
                {error.show && (
                  <div id="error-banner" className="mb-5 flex items-center gap-3 bg-error-container/60 border border-error/20 rounded-[16px] px-4 py-3.5">
                    <span className="material-symbols-outlined text-error text-[20px] shrink-0">error</span>
                    <p className="text-[13px] text-on-error-container font-medium" id="error-text">
                      {error.message}
                    </p>
                  </div>
                )}

                {/* Social Sign In */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <div className="social-locked-wrapper">
                    <div className="lock-overlay" title="Coming soon">
                      <span className="material-symbols-outlined lock-icon">lock</span>
                      <span className="lock-text">Coming soon</span>
                    </div>
                  <button onClick={handleGoogleSignIn} type="button" className="btn-social flex items-center justify-center gap-2.5 border border-outline-variant/60 bg-surface rounded-full py-2.5 md:py-3 px-4 text-[13px] md:text-[14px] font-medium text-on-surface">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </button>
                  </div>
                  <div className="social-locked-wrapper">
                    <div className="lock-overlay" title="Coming soon">
                      <span className="material-symbols-outlined lock-icon">lock</span>
                      <span className="lock-text">Coming soon</span>
                    </div>
                  <button onClick={handleFacebookSignIn} type="button" className="btn-social flex items-center justify-center gap-2.5 border border-outline-variant/60 bg-surface rounded-full py-2.5 md:py-3 px-4 text-[13px] md:text-[14px] font-medium text-on-surface">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Continue with Facebook
                  </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="divider-line"></div>
                  <span className="text-on-surface-variant text-[12px] font-medium whitespace-nowrap">or sign in with email</span>
                  <div className="divider-line"></div>
                </div>

                {/* Form */}
                <div id="sign-in-form" className={`space-y-4 ${shaking ? "shake" : ""}`}>
                  {/* Email */}
                  <div>
                    <label className="block text-[12px] md:text-[13px] font-semibold text-on-surface mb-1.5 uppercase tracking-wider" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px] md:text-[20px] pointer-events-none">
                        mail
                      </span>
                      <input
                        type="email"
                        id="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field w-full bg-surface-container-low border border-outline-variant/60 rounded-full pl-10 md:pl-11 pr-4 py-3 md:py-3.5 text-[13px] md:text-body-md text-on-surface placeholder:text-outline/60 font-body-md"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[12px] md:text-[13px] font-semibold text-on-surface uppercase tracking-wider" htmlFor="password">
                        Password
                      </label>
                      <button type="button" onClick={showForgot} className="forgot-link text-[12px] md:text-[13px] text-on-surface-variant font-medium">
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px] md:text-[20px] pointer-events-none">
                        lock
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field w-full bg-surface-container-low border border-outline-variant/60 rounded-full pl-10 md:pl-11 pr-11 md:pr-12 py-3 md:py-3.5 text-[13px] md:text-body-md text-on-surface placeholder:text-outline/60 font-body-md"
                        autoComplete="current-password"
                        onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                      />
                      <button type="button" className="eye-btn absolute right-4 top-1/2 -translate-y-1/2 text-outline" onClick={togglePass}>
                        <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                          {showPassword ? "visibility" : "visibility_off"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Remember me */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        id="remember"
                        className="w-4 h-4 rounded border-outline-variant/60 text-primary focus:ring-primary/30 accent-[#9f4122]"
                      />
                      <span className="text-[13px] text-on-surface-variant group-hover:text-on-surface transition-colors">
                        Remember me for 30 days
                      </span>
                    </label>
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <button
                      type="button"
                      id="signin-btn"
                      onClick={handleSignIn}
                      disabled={isSigningIn}
                      className={`btn-primary w-full bg-primary text-on-primary font-semibold text-[14px] md:text-body-lg py-3.5 md:py-4 rounded-full shadow-lg flex items-center justify-center gap-2.5 group ${
                        isSigningIn ? "opacity-80 cursor-not-allowed" : ""
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px] md:text-[22px] group-hover:scale-110 transition-transform">login</span>
                      <span id="btn-label">{isSigningIn ? "Signing in…" : "Sign In"}</span>
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
              {/* end card */}

              {/* Bottom sign-up nudge */}
              <p className="text-on-surface-variant text-[13px] md:text-body-md">
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

      {/* ─── FORGOT PASSWORD MODAL ─── */}
      {forgotModal.show && (
        <div id="forgot-modal" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-md" onClick={closeForgot}></div>
          <div className="relative bg-surface rounded-[28px] border border-outline-variant/40 shadow-2xl p-8 md:p-10 max-w-sm w-full animate-fade-up">
            <button
              onClick={closeForgot}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">close</span>
            </button>
            <div className="w-14 h-14 bg-primary-fixed/60 rounded-full flex items-center justify-center mb-5">
              <span className="material-symbols-outlined text-primary text-[28px]">key</span>
            </div>
            <h3 className="font-display-xl text-[22px] text-on-surface tracking-tight mb-1.5">Forgot password?</h3>
            <p className="text-on-surface-variant text-[13px] mb-6 leading-relaxed">
              No worries! Enter your registered email and we&apos;ll send you a reset link.
            </p>

            {/* Forgot form */}
            {!forgotModal.success ? (
              <div id="forgot-form" className="space-y-4">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">
                    mail
                  </span>
                  <input
                    type="email"
                    id="forgot-email"
                    placeholder="your@email.com"
                    className="input-field w-full bg-surface-container-low border border-outline-variant/60 rounded-full pl-10 pr-4 py-3 text-[13px] text-on-surface placeholder:text-outline/60 font-body-md"
                  />
                </div>
                <button
                  type="button"
                  onClick={sendReset}
                  className="btn-primary w-full bg-primary text-on-primary font-semibold text-[14px] py-3 rounded-full shadow-md flex items-center justify-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">send</span>
                  Send Reset Link
                </button>
                <button
                  type="button"
                  onClick={closeForgot}
                  className="w-full text-center text-[13px] text-on-surface-variant hover:text-primary transition-colors py-1"
                >
                  ← Back to Sign In
                </button>
              </div>
            ) : (
              /* Success state */
              <div id="forgot-success" className="text-center">
                <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-secondary text-[26px]">mark_email_read</span>
                </div>
                <p className="font-semibold text-on-surface text-[15px] mb-2">Check your inbox!</p>
                <p className="text-on-surface-variant text-[13px] mb-5">A reset link has been sent to your email address.</p>
                <button onClick={closeForgot} className="text-primary text-[13px] font-semibold hover:underline underline-offset-2">
                  ← Back to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── SUCCESS MODAL ─── */}
      {showSuccessModal && (
        <div id="success-modal" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-md"></div>
          <div className="relative bg-surface rounded-[28px] border border-outline-variant/40 shadow-2xl p-8 md:p-12 max-w-sm w-full text-center animate-fade-up">
            <div className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center mx-auto mb-5">
              <span className="material-symbols-outlined text-secondary text-[34px]">waving_hand</span>
            </div>
            <h3 className="font-display-xl text-[24px] text-on-surface tracking-tight mb-2">Welcome back!</h3>
            <p className="text-on-surface-variant text-[14px] mb-7">
              You&apos;ve signed in successfully. Ready to explore today&apos;s fresh picks?
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-on-primary font-medium px-8 py-3 rounded-full hover:bg-primary/90 transition-colors text-[14px]"
            >
              Go to Home
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}