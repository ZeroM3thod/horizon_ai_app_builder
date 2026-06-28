"use client";

import React, { useState, useEffect, useCallback } from"react";
import Link from"next/link";

export default function SignupPage() {
 const [formData, setFormData] = useState({
 firstName:"",
 lastName:"",
 email:"",
 phone:"",
 password:"",
 confirmPassword:"",
 terms: false,
 newsletter: false,
 });

 const [showPassword, setShowPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 const [strength, setStrength] = useState({ score: 0, label:"", color:"", barColors: ["#ddc0b8","#ddc0b8","#ddc0b8","#ddc0b8"] });
 const [matchMsg, setMatchMsg] = useState({ text:"", color:"", hidden: true });
 const [showSuccessModal, setShowSuccessModal] = useState(false);

 const { password, confirmPassword } = formData;

 const checkMatch = useCallback(() => {
 if (!confirmPassword) {
 setMatchMsg(prev => ({ ...prev, hidden: true }));
 return;
 }
 
 if (password === confirmPassword) {
 setMatchMsg({ text:"✓ Passwords match", color:"#556500", hidden: false });
 } else {
 setMatchMsg({ text:"✗ Passwords do not match", color:"#ba1a1a", hidden: false });
 }
 }, [password, confirmPassword]);

 useEffect(() => {
 checkMatch();
 }, [checkMatch]);

 const checkStrength = (val: string) => {
 if (!val) {
 setStrength({ score: 0, label:"", color:"", barColors: ["#ddc0b8","#ddc0b8","#ddc0b8","#ddc0b8"] });
 return;
 }

 let score = 0;
 if (val.length >= 8) score++;
 if (/[A-Z]/.test(val)) score++;
 if (/[0-9]/.test(val)) score++;
 if (/[^a-zA-Z0-9]/.test(val)) score++;

 const colors = ["#ba1a1a","#ff8a65","#d6ed7a","#556500"];
 const labels = ["Weak","Fair","Good","Strong"];
 const labelCol = ["#ba1a1a","#9f4122","#556500","#326578"];

 const newBarColors = ["#ddc0b8","#ddc0b8","#ddc0b8","#ddc0b8"];
 for (let i = 0; i < score; i++) {
 newBarColors[i] = colors[score - 1];
 }

 setStrength({
 score,
 label: labels[score - 1],
 color: labelCol[score - 1],
 barColors: newBarColors
 });
 };

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const { id, value, type, checked } = e.target;
 const val = type ==="checkbox"? checked : value;
 
 const keyMap: { [key: string]: string } = {
"first-name":"firstName",
"last-name":"lastName",
"email":"email",
"phone":"phone",
"password":"password",
"confirm-password":"confirmPassword",
"terms":"terms",
"newsletter":"newsletter"
 };

 const stateKey = keyMap[id];
 if (stateKey) {
 setFormData(prev => ({ ...prev, [stateKey]: val }));
 if (id ==="password") {
 checkStrength(value);
 }
 }
 };

 const handleSignUp = () => {
 const { firstName, email, password, confirmPassword, terms } = formData;

 if (!firstName || !email || !password || !confirmPassword) {
 alert("Please fill in all required fields.");
 return;
 }
 if (password !== confirmPassword) {
 alert("Passwords do not match!");
 return;
 }
 if (!terms) {
 alert("Please accept the Terms of Service to continue.");
 return;
 }
 setShowSuccessModal(true);
 };

 return (
 <main className="min-h-screen flex flex-col">
 <style jsx global>{`
 .orb { position: absolute; border-radius: 9999px; filter: blur(80px); pointer-events: none; }
 .input-field { transition: border-color 0.2s ease, box-shadow 0.2s ease; }
 .input-field:focus { outline: none; border-color: #9f4122; box-shadow: 0 0 0 3px rgba(159,65,34,0.12); }
 .strength-bar { height: 3px; border-radius: 9999px; transition: width 0.4s ease, background-color 0.4s ease; }
 .custom-checkbox:checked { background-color: #9f4122; border-color: #9f4122; }
 .btn-primary { transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease; }
 .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(159,65,34,0.30); }
 .btn-primary:active { transform: translateY(0); }
 .btn-social { transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.15s ease; }
 .btn-social:hover { transform: translateY(-1px); background-color: #f3ede2; }
 @keyframes slideUp { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
 .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
 .eye-btn { cursor: pointer; transition: color 0.15s ease; }
 .eye-btn:hover { color: #9f4122; }
 `}</style>

 <section className="relative flex-1 flex items-center justify-center px-4 pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden">
 <div className="absolute inset-0 bg-gradient-to-br from-tertiary-fixed/25 via-background to-primary-fixed/20 -z-10"></div>
 <div className="orb w-72 h-72 md:w-[500px] md:h-[500px] bg-primary-container/20 top-10 -right-16 md:-right-24 -z-10"></div>
 <div className="orb w-56 h-56 md:w-96 md:h-96 bg-secondary-container/25 bottom-10 -left-10 md:-left-20 -z-10"></div>
 <div className="orb w-40 h-40 md:w-64 md:h-64 bg-tertiary-fixed/30 top-1/3 left-1/4 -z-10"></div>

 <div className="w-full max-w-6xl mx-auto">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
 <div className="hidden lg:flex flex-col justify-center pr-8 animate-slide-up">
 <div className="inline-flex items-center gap-2 bg-surface/70 backdrop-blur-xl border border-outline-variant/50 rounded-full px-3 py-1.5 mb-8 shadow-sm w-fit">
 <span className="shrink-0 bg-secondary-container text-on-secondary-container text-[12px] tracking-[0.1em] font-bold px-2.5 py-1 rounded-full uppercase leading-none">Free</span>
 <span className="text-[16px] text-on-surface whitespace-nowrap">No credit card required</span>
 </div>
 <h1 className="text-[52px] leading-[1.1] tracking-tighter text-on-surface mb-6">
 Join the<br/>Shuddhota<br/><span className="text-primary">Family.</span>
 </h1>
 <p className="text-[18px] leading-relaxed text-on-surface-variant mb-10 max-w-sm">
 Get access to pure spices, premium dry foods, and exclusive member deals — delivered fresh from farms to your kitchen.
 </p>
 <div className="space-y-4">
 <div className="flex items-center gap-4 bg-surface/60 backdrop-blur border border-outline-variant/30 rounded-[20px] px-5 py-4 shadow-sm">
 <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
 <span className="material-symbols-outlined text-primary text-[22px]">local_shipping</span>
 </div>
 <div>
 <p className="font-semibold text-on-surface text-[15px]">Free Delivery</p>
 <p className="text-on-surface-variant text-[13px]">On all orders above ৳499</p>
 </div>
 </div>
 <div className="flex items-center gap-4 bg-surface/60 backdrop-blur border border-outline-variant/30 rounded-[20px] px-5 py-4 shadow-sm">
 <div className="w-11 h-11 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
  <span className="material-symbols-outlined text-secondary text-[22px]">discount</span>
 </div>
 <div>
 <p className="font-semibold text-on-surface text-[15px]">Exclusive Member Deals</p>
 <p className="text-on-surface-variant text-[13px]">Up to 30% off on seasonal items</p>
 </div>
 </div>
 <div className="flex items-center gap-4 bg-surface/60 backdrop-blur border border-outline-variant/30 rounded-[20px] px-5 py-4 shadow-sm">
 <div className="w-11 h-11 rounded-full bg-tertiary/10 flex items-center justify-center shrink-0">
 <span className="material-symbols-outlined text-tertiary text-[22px]">verified</span>
 </div>
 <div>
 <p className="font-semibold text-on-surface text-[15px]">Lab-Tested Purity</p>
 <p className="text-on-surface-variant text-[13px]">BSTI certified, 100% natural</p>
 </div>
 </div>
 </div>
 <div className="mt-10 flex items-center gap-4">
 <div className="flex -space-x-2">
 <div className="w-9 h-9 rounded-full bg-primary-container border-2 border-surface flex items-center justify-center text-primary font-bold text-[13px]">R</div>
 <div className="w-9 h-9 rounded-full bg-secondary-container border-2 border-surface flex items-center justify-center text-secondary font-bold text-[13px]">S</div>
 <div className="w-9 h-9 rounded-full bg-tertiary-container border-2 border-surface flex items-center justify-center text-tertiary font-bold text-[13px]">A</div>
 <div className="w-9 h-9 rounded-full bg-surface-container-high border-2 border-surface flex items-center justify-center text-on-surface font-bold text-[11px]">+2k</div>
 </div>
 <div>
 <div className="flex items-center gap-1 mb-0.5">
 <span className="text-primary text-[14px]">★★★★★</span>
 </div>
 <p className="text-on-surface-variant text-[13px]">Trusted by <span className="text-on-surface font-semibold">2,400+</span> happy customers</p>
 </div>
 </div>
 </div>

 <div className="w-full animate-slide-up">
 <div className="bg-surface/90 backdrop-blur-xl rounded-[28px] md:rounded-[32px] border border-outline-variant/40 shadow-[0_24px_64px_rgba(159,65,34,0.10)] p-6 md:p-10">
 <div className="mb-7 md:mb-8">
 <div className="flex items-center gap-2 mb-5 lg:hidden">
 <span className="material-symbols-outlined text-primary text-[22px]">shopping_basket</span>
 <span className="font-bold text-primary text-[16px] tracking-tight">Shuddhota CO.</span>
 </div>
 <h2 className="text-[26px] md:text-[34px] leading-tight tracking-tight text-on-surface mb-1.5">Create your account</h2>
 <p className="text-on-surface-variant text-[13px] md:text-[16px]">Already have an account? <Link href="/signin"className="text-primary font-semibold hover:underline underline-offset-2 ml-0.5">Sign in</Link></p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
 <button className="btn-social flex items-center justify-center gap-2.5 border border-outline-variant/60 bg-surface rounded-full py-2.5 md:py-3 px-4 text-[13px] md:text-[14px] font-medium text-on-surface hover:border-outline-variant">
 <svg className="w-4 h-4 shrink-0"viewBox="0 0 24 24"xmlns="http://www.w3.org/2000/svg">
 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"fill="#4285F4"/>
 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"fill="#34A853"/>
 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"fill="#FBBC05"/>
 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"fill="#EA4335"/>
 </svg>
 Continue with Google
 </button>
 <button className="btn-social flex items-center justify-center gap-2.5 border border-outline-variant/60 bg-surface rounded-full py-2.5 md:py-3 px-4 text-[13px] md:text-[14px] font-medium text-on-surface hover:border-outline-variant">
 <svg className="w-4 h-4 shrink-0"viewBox="0 0 24 24"fill="currentColor"xmlns="http://www.w3.org/2000/svg">
 <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
 </svg>
 Continue with Facebook
 </button>
 </div>

 <div className="flex items-center gap-4 mb-6"><div className="flex-1 h-px bg-outline-variant/40"></div><span className="text-on-surface-variant text-[12px] font-medium">or sign up with email</span><div className="flex-1 h-px bg-outline-variant/40"></div></div>

 <div className="space-y-4">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div>
 <label className="block text-[12px] md:text-[13px] font-semibold text-on-surface mb-1.5 uppercase tracking-wider"htmlFor="first-name">First Name</label>
 <div className="relative">
 <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px] md:text-[20px] pointer-events-none">person</span>
 <input type="text"id="first-name"placeholder="Rahim"value={formData.firstName} onChange={handleInputChange} className="input-field w-full bg-surface-container-low border border-outline-variant/60 rounded-full pl-10 md:pl-11 pr-4 py-3 md:py-3.5 text-[13px] md:text-[16px] text-on-surface placeholder:text-outline/60"/>
 </div>
 </div>
 <div>
 <label className="block text-[12px] md:text-[13px] font-semibold text-on-surface mb-1.5 uppercase tracking-wider"htmlFor="last-name">Last Name</label>
 <div className="relative">
 <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px] md:text-[20px] pointer-events-none">person</span>
 <input type="text"id="last-name"placeholder="Uddin"value={formData.lastName} onChange={handleInputChange} className="input-field w-full bg-surface-container-low border border-outline-variant/60 rounded-full pl-10 md:pl-11 pr-4 py-3 md:py-3.5 text-[13px] md:text-[16px] text-on-surface placeholder:text-outline/60"/>
 </div>
 </div>
 </div>
 <div>
 <label className="block text-[12px] md:text-[13px] font-semibold text-on-surface mb-1.5 uppercase tracking-wider"htmlFor="email">Email Address</label>
 <div className="relative">
 <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px] md:text-[20px] pointer-events-none">mail</span>
 <input type="email"id="email"placeholder="rahim@example.com"value={formData.email} onChange={handleInputChange} className="input-field w-full bg-surface-container-low border border-outline-variant/60 rounded-full pl-10 md:pl-11 pr-4 py-3 md:py-3.5 text-[13px] md:text-[16px] text-on-surface placeholder:text-outline/60"/>
 </div>
 </div>
 <div>
 <label className="block text-[12px] md:text-[13px] font-semibold text-on-surface mb-1.5 uppercase tracking-wider"htmlFor="phone">Phone Number <span className="normal-case tracking-normal text-outline font-normal ml-1">(optional)</span></label>
 <div className="relative flex">
 <div className="flex items-center gap-1.5 bg-surface-container border border-r-0 border-outline-variant/60 rounded-l-full pl-4 pr-3 py-3 md:py-3.5 shrink-0"><span className="text-[13px] md:text-[14px] font-medium text-on-surface">🇧🇩</span><span className="text-[13px] md:text-[14px] text-on-surface-variant font-medium">+880</span><span className="material-symbols-outlined text-outline text-[16px]">expand_more</span></div>
 <input type="tel"id="phone"placeholder="01XXXXXXXXX"value={formData.phone} onChange={handleInputChange} className="input-field flex-1 bg-surface-container-low border border-l-0 border-outline-variant/60 rounded-r-full pr-4 pl-3 py-3 md:py-3.5 text-[13px] md:text-[16px] text-on-surface placeholder:text-outline/60"style={{ borderRadius:"0 9999px 9999px 0"}} />
 </div>
 </div>
 <div>
 <label className="block text-[12px] md:text-[13px] font-semibold text-on-surface mb-1.5 uppercase tracking-wider"htmlFor="password">Password</label>
 <div className="relative">
 <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px] md:text-[20px] pointer-events-none">lock</span>
 <input type={showPassword ?"text":"password"} id="password"placeholder="Min. 8 characters"value={formData.password} onChange={handleInputChange} className="input-field w-full bg-surface-container-low border border-outline-variant/60 rounded-full pl-10 md:pl-11 pr-11 md:pr-12 py-3 md:py-3.5 text-[13px] md:text-[16px] text-on-surface placeholder:text-outline/60"/>
 <button type="button"className="eye-btn absolute right-4 top-1/2 -translate-y-1/2 text-outline"onClick={() => setShowPassword(!showPassword)}><span className="material-symbols-outlined text-[18px] md:text-[20px]">{showPassword ?"visibility":"visibility_off"}</span></button>
 </div>
 <div className="mt-2.5 flex items-center gap-2"><div className="flex gap-1.5 flex-1">{strength.barColors.map((color, i) => (<div key={i} className="strength-bar flex-1"style={{ backgroundColor: color, opacity: strength.score > i ? 1 : 0.3 }}></div>))}</div><span className="text-[11px] shrink-0 w-16 text-right"style={{ color: strength.color }}>{strength.label}</span></div>
 </div>
 <div>
 <label className="block text-[12px] md:text-[13px] font-semibold text-on-surface mb-1.5 uppercase tracking-wider"htmlFor="confirm-password">Confirm Password</label>
 <div className="relative">
 <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px] md:text-[20px] pointer-events-none">lock_reset</span>
 <input type={showConfirmPassword ?"text":"password"} id="confirm-password"placeholder="Re-enter your password"value={formData.confirmPassword} onChange={handleInputChange} className="input-field w-full bg-surface-container-low border border-outline-variant/60 rounded-full pl-10 md:pl-11 pr-11 md:pr-12 py-3 md:py-3.5 text-[13px] md:text-[16px] text-on-surface placeholder:text-outline/60"/>
 <button type="button"className="eye-btn absolute right-4 top-1/2 -translate-y-1/2 text-outline"onClick={() => setShowConfirmPassword(!showConfirmPassword)}><span className="material-symbols-outlined text-[18px] md:text-[20px]">{showConfirmPassword ?"visibility":"visibility_off"}</span></button>
 </div>
 {!matchMsg.hidden && <p className="mt-1.5 text-[11px] ml-4"style={{ color: matchMsg.color }}>{matchMsg.text}</p>}
 </div>
 <div className="space-y-3 pt-1">
 <label className="flex items-start gap-3 cursor-pointer group">
 <input type="checkbox"id="terms"checked={formData.terms} onChange={handleInputChange} className="custom-checkbox mt-0.5 w-4 h-4 rounded border-outline-variant/60 text-primary focus:ring-primary/30 shrink-0"required />
 <span className="text-[12px] md:text-[13px] text-on-surface-variant leading-snug group-hover:text-on-surface transition-colors">I agree to the <Link href="#"className="text-primary font-semibold hover:underline underline-offset-2 mx-1">Terms of Service</Link> and <Link href="#"className="text-primary font-semibold hover:underline underline-offset-2 mx-1">Privacy Policy</Link></span>
 </label>
 <label className="flex items-start gap-3 cursor-pointer group">
 <input type="checkbox"id="newsletter"checked={formData.newsletter} onChange={handleInputChange} className="custom-checkbox mt-0.5 w-4 h-4 rounded border-outline-variant/60 text-primary focus:ring-primary/30 shrink-0"/>
 <span className="text-[12px] md:text-[13px] text-on-surface-variant leading-snug group-hover:text-on-surface transition-colors">Send me exclusive deals, new arrivals, and seasonal offers</span>
 </label>
 </div>
 <div className="pt-2">
 <button type="button"onClick={handleSignUp} className="btn-primary w-full bg-primary text-on-primary font-semibold text-[14px] md:text-[18px] leading-relaxed py-3.5 md:py-4 rounded-full shadow-lg flex items-center justify-center gap-2.5 group">
 <span className="material-symbols-outlined text-[20px] md:text-[22px] group-hover:scale-110 transition-transform">person_add</span>Create Free Account<span className="material-symbols-outlined text-[18px] md:text-[20px] text-secondary-fixed group-hover:translate-x-1 transition-transform">arrow_forward</span>
 </button>
 </div>
 </div>

 <div className="mt-6 pt-5 border-t border-outline-variant/20 flex items-center justify-center gap-4 flex-wrap">
 <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary text-[15px]">lock</span><span className="text-[11px] text-on-surface-variant">SSL Secured</span></div>
 <div className="w-px h-4 bg-outline-variant/40"></div>
 <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary text-[15px]">verified_user</span><span className="text-[11px] text-on-surface-variant">Data Protected</span></div>
 <div className="w-px h-4 bg-outline-variant/40"></div>
 <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary text-[15px]">verified</span><span className="text-[11px] text-on-surface-variant">BSTI Certified</span></div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </section>

 {showSuccessModal && (
 <div id="success-modal"className="fixed inset-0 z-[100] flex items-center justify-center p-4">
 <div className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-md"onClick={() => setShowSuccessModal(false)}></div>
 <div className="relative bg-surface rounded-[28px] border border-outline-variant/40 shadow-2xl p-8 md:p-12 max-w-sm w-full text-center animate-slide-up">
 <div className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center mx-auto mb-5">
 <span className="material-symbols-outlined text-secondary text-[34px]">check_circle</span>
 </div>
 <h3 className="text-[24px] text-on-surface tracking-tight mb-2">You&apos;re in!</h3>
 <p className="text-on-surface-variant text-[14px] mb-7">Welcome to Shuddhota Co. Your account has been created successfully.</p>
 <Link href="/"className="inline-flex items-center gap-2 bg-primary text-on-primary font-medium px-8 py-3 rounded-full hover:bg-primary/90 transition-colors text-[14px]">
 Start Shopping <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
 </Link>
 </div>
 </div>
 )}
 </main>
 );
}