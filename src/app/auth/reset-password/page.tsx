"use client";

import React, { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState({ show: false, message: "" });
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    setError({ show: false, message: "" });

    if (!password || !confirmPassword) {
      setError({ show: true, message: "Please enter your new password." });
      return;
    }

    if (password !== confirmPassword) {
      setError({ show: true, message: "Passwords do not match." });
      return;
    }

    if (password.length < 8) {
      setError({ show: true, message: "Password must be at least 8 characters long." });
      return;
    }

    setIsResetting(true);

    const { error: resetError } = await supabase.auth.updateUser({
      password: password,
    });

    setIsResetting(false);

    if (resetError) {
      setError({ show: true, message: resetError.message || "Failed to reset password." });
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/signin");
    }, 2000);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-primary-fixed/20 via-background to-tertiary-fixed/20">
      <div className="w-full max-w-md">
        <div className="bg-surface/90 backdrop-blur-xl rounded-[28px] border border-outline-variant/40 shadow-[0_24px_64px_rgba(159,65,34,0.10)] p-8 md:p-10">
          <div className="w-14 h-14 bg-primary-fixed/60 rounded-full flex items-center justify-center mb-5 mx-auto">
            <span className="material-symbols-outlined text-primary text-[28px]">lock_reset</span>
          </div>

          <h2 className="text-[26px] md:text-[30px] leading-tight tracking-tight text-on-surface mb-2 text-center">
            Reset Your Password
          </h2>
          <p className="text-on-surface-variant text-[13px] md:text-[14px] mb-6 text-center">
            Enter your new password below.
          </p>

          {error.show && (
            <div className="mb-5 flex items-center gap-3 bg-error-container/60 border border-error/20 rounded-[16px] px-4 py-3.5">
              <span className="material-symbols-outlined text-error text-[20px] shrink-0">error</span>
              <p className="text-[13px] text-on-error-container font-medium">{error.message}</p>
            </div>
          )}

          {success ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-secondary text-[26px]">check_circle</span>
              </div>
              <p className="font-semibold text-on-surface text-[15px] mb-2">Password Reset Successfully!</p>
              <p className="text-on-surface-variant text-[13px] mb-5">Redirecting to sign in...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] md:text-[13px] font-semibold text-on-surface mb-1.5 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px] md:text-[20px] pointer-events-none">
                    lock
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/60 rounded-full pl-10 md:pl-11 pr-11 md:pr-12 py-3 md:py-3.5 text-[13px] md:text-[16px] text-on-surface placeholder:text-outline/60 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[12px] md:text-[13px] font-semibold text-on-surface mb-1.5 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px] md:text-[20px] pointer-events-none">
                    lock_reset
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/60 rounded-full pl-10 md:pl-11 pr-11 md:pr-12 py-3 md:py-3.5 text-[13px] md:text-[16px] text-on-surface placeholder:text-outline/60 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10"
                    onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                      {showConfirmPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={isResetting}
                  className={`w-full bg-primary text-on-primary font-semibold text-[14px] md:text-[16px] py-3.5 md:py-4 rounded-full shadow-lg flex items-center justify-center gap-2.5 group transition-all ${
                    isResetting ? "opacity-80 cursor-not-allowed" : "hover:shadow-xl hover:-translate-y-0.5"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] md:text-[22px] group-hover:scale-110 transition-transform">
                    check
                  </span>
                  <span>{isResetting ? "Resetting..." : "Reset Password"}</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <Link
                  href="/signin"
                  className="text-[13px] text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
