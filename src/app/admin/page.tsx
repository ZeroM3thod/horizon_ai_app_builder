"use client";

import { useEffect, useState } from "react";
import AdminSidebar, { toggleAdminSidebar, toggleAdminMini } from "@/components/AdminSidebar";

export default function AdminDashboard() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
  }, []);

  return (
    <div className="bg-background text-on-background font-sans antialiased overflow-x-hidden min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-weight: normal;
          font-style: normal;
          font-size: 24px;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
          -webkit-font-smoothing: antialiased;
        }
        .stat-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(159,65,34,0.10); }
        .trow { transition: background 0.15s; }
        .trow:hover { background: rgba(248,243,234,0.9); }
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #ddc0b8; border-radius: 99px; }
        .badge-pulse { animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.55} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        .fade-up { animation: fadeUp 0.4s ease both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.1s; }
        .fade-up-3 { animation-delay: 0.15s; }
        .fade-up-4 { animation-delay: 0.2s; }
        .fade-up-5 { animation-delay: 0.25s; }
      ` }} />

      <AdminSidebar />

      <div id="main-content" className="main-content lg:ml-64 min-h-screen flex flex-col">
        {/* TOPBAR */}
        <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 flex items-center justify-between px-4 md:px-6 h-16 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={toggleAdminSidebar} className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant">
              <span id="hamburger-icon" className="material-symbols-outlined text-[22px]">menu</span>
            </button>
            <button onClick={toggleAdminMini} className="hidden lg:flex w-9 h-9 rounded-xl items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-[22px]">menu_open</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 text-[13px]">
              <span className="text-on-surface-variant">Admin</span>
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant">chevron_right</span>
              <span id="breadcrumb" className="text-on-surface font-semibold">Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 bg-surface-container rounded-full px-4 py-2 border border-outline-variant/30 w-48 xl:w-64">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
              <input type="text" placeholder="Search anything..." className="bg-transparent text-[13px] text-on-surface placeholder:text-outline border-none focus:ring-0 w-full p-0"/>
            </div>
            <button className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-surface badge-pulse"></span>
            </button>
            <div className="hidden lg:flex items-center gap-1.5 bg-surface-container rounded-full px-3 py-2 border border-outline-variant/20 text-[12px] text-on-surface-variant font-medium">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              <span>{currentDate}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center font-bold text-[12px] text-on-primary-container cursor-pointer">RA</div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 md:p-6 xl:p-8 overflow-y-auto">
          <section id="section-dashboard" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 fade-up">
              <div>
                <h1 className="text-[22px] md:text-[28px] font-extrabold text-on-surface tracking-tight">Good morning, Rakib 👋</h1>
                <p className="text-[13px] text-on-surface-variant mt-0.5">Here&apos;s what&apos;s happening with your store today.</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 border border-outline-variant/40 text-on-surface-variant text-[13px] font-medium px-4 py-2 rounded-full hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  Export
                </button>
                <button className="flex items-center gap-2 bg-primary text-on-primary text-[13px] font-medium px-4 py-2 rounded-full hover:bg-primary/90 transition-colors shadow-md">
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  New Product
                </button>
              </div>
            </div>

            {/* KPI STAT CARDS */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 fade-up fade-up-1">
              {/* Revenue */}
              <div className="stat-card bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-5 flex flex-col gap-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-primary-container text-[20px]">payments</span>
                  </div>
                  <span className="text-[11px] font-semibold text-secondary bg-secondary-container/50 px-2.5 py-1 rounded-full flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">arrow_upward</span>12.4%
                  </span>
                </div>
                <div>
                  <div className="text-[11px] text-on-surface-variant font-medium uppercase tracking-wider">Total Revenue</div>
                  <div className="text-[26px] font-extrabold text-on-surface tracking-tight leading-tight mt-0.5">৳4,82,630</div>
                  <div className="text-[11px] text-on-surface-variant mt-1">vs ৳4,29,120 last month</div>
                </div>
              </div>

              {/* Orders */}
              <div className="stat-card bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-5 flex flex-col gap-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-tertiary-container text-[20px]">receipt_long</span>
                  </div>
                  <span className="text-[11px] font-semibold text-secondary bg-secondary-container/50 px-2.5 py-1 rounded-full flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">arrow_upward</span>8.1%
                  </span>
                </div>
                <div>
                  <div className="text-[11px] text-on-surface-variant font-medium uppercase tracking-wider">Total Orders</div>
                  <div className="text-[26px] font-extrabold text-on-surface tracking-tight leading-tight mt-0.5">3,841</div>
                  <div className="text-[11px] text-on-surface-variant mt-1">7 pending review</div>
                </div>
              </div>

              {/* Users */}
              <div className="stat-card bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-5 flex flex-col gap-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-secondary-container text-[20px]">group</span>
                  </div>
                  <span className="text-[11px] font-semibold text-secondary bg-secondary-container/50 px-2.5 py-1 rounded-full flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">arrow_upward</span>5.6%
                  </span>
                </div>
                <div>
                  <div className="text-[11px] text-on-surface-variant font-medium uppercase tracking-wider">Total Users</div>
                  <div className="text-[26px] font-extrabold text-on-surface tracking-tight leading-tight mt-0.5">1,247</div>
                  <div className="text-[11px] text-on-surface-variant mt-1">+38 this week</div>
                </div>
              </div>

              {/* Products */}
              <div className="stat-card bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-5 flex flex-col gap-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-error-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-error text-[20px]">inventory_2</span>
                  </div>
                  <span className="text-[11px] font-semibold text-error bg-error-container px-2.5 py-1 rounded-full flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">arrow_downward</span>2.3%
                  </span>
                </div>
                <div>
                  <div className="text-[11px] text-on-surface-variant font-medium uppercase tracking-wider">Active Products</div>
                  <div className="text-[26px] font-extrabold text-on-surface tracking-tight leading-tight mt-0.5">48</div>
                  <div className="text-[11px] text-on-surface-variant mt-1">3 low stock alerts</div>
                </div>
              </div>
            </div>

            {/* CHARTS + ACTIVITY ROW */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 fade-up fade-up-2">
              {/* Revenue Chart */}
              <div className="xl:col-span-2 bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-bold text-[16px] text-on-surface">Revenue Overview</h3>
                    <p className="text-[12px] text-on-surface-variant mt-0.5">Monthly performance — 2024</p>
                  </div>
                  <div className="flex items-center gap-1.5 border border-outline-variant/30 rounded-full p-1">
                    <button className="text-[11px] font-semibold px-3 py-1 rounded-full bg-primary text-on-primary">Monthly</button>
                    <button className="text-[11px] font-medium px-3 py-1 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors">Weekly</button>
                  </div>
                </div>
                <div className="w-full overflow-x-auto hide-scrollbar">
                  <svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" className="w-full min-w-[400px]">
                    <line x1="40" y1="10" x2="40" y2="185" stroke="#ddc0b8" strokeWidth="0.5"/>
                    <line x1="40" y1="10" x2="630" y2="10" stroke="#ddc0b8" strokeWidth="0.5" strokeDasharray="4,4"/>
                    <line x1="40" y1="52" x2="630" y2="52" stroke="#ddc0b8" strokeWidth="0.5" strokeDasharray="4,4"/>
                    <line x1="40" y1="94" x2="630" y2="94" stroke="#ddc0b8" strokeWidth="0.5" strokeDasharray="4,4"/>
                    <line x1="40" y1="136" x2="630" y2="136" stroke="#ddc0b8" strokeWidth="0.5" strokeDasharray="4,4"/>
                    <line x1="40" y1="178" x2="630" y2="178" stroke="#ddc0b8" strokeWidth="0.5" strokeDasharray="4,4"/>
                    <text x="32" y="13" textAnchor="end" fontSize="9" fill="#89726b">5L</text>
                    <text x="32" y="55" textAnchor="end" fontSize="9" fill="#89726b">4L</text>
                    <text x="32" y="97" textAnchor="end" fontSize="9" fill="#89726b">3L</text>
                    <text x="32" y="139" textAnchor="end" fontSize="9" fill="#89726b">2L</text>
                    <text x="32" y="181" textAnchor="end" fontSize="9" fill="#89726b">1L</text>
                    <rect x="55" y="138" width="28" height="40" rx="5" fill="#ffdbd0"/>
                    <text x="69" y="195" textAnchor="middle" fontSize="9" fill="#89726b">Jan</text>
                    <rect x="103" y="120" width="28" height="58" rx="5" fill="#ffb59e"/>
                    <text x="117" y="195" textAnchor="middle" fontSize="9" fill="#89726b">Feb</text>
                    <rect x="151" y="100" width="28" height="78" rx="5" fill="#ff8a65"/>
                    <text x="165" y="195" textAnchor="middle" fontSize="9" fill="#89726b">Mar</text>
                    <rect x="199" y="80" width="28" height="98" rx="5" fill="#9f4122"/>
                    <text x="213" y="195" textAnchor="middle" fontSize="9" fill="#89726b">Apr</text>
                    <rect x="247" y="110" width="28" height="68" rx="5" fill="#ff8a65"/>
                    <text x="261" y="195" textAnchor="middle" fontSize="9" fill="#89726b">May</text>
                    <rect x="295" y="70" width="28" height="108" rx="5" fill="#9f4122"/>
                    <text x="309" y="195" textAnchor="middle" fontSize="9" fill="#89726b">Jun</text>
                    <rect x="343" y="85" width="28" height="93" rx="5" fill="#ff8a65"/>
                    <text x="357" y="195" textAnchor="middle" fontSize="9" fill="#89726b">Jul</text>
                    <rect x="391" y="55" width="28" height="123" rx="5" fill="#9f4122"/>
                    <text x="405" y="195" textAnchor="middle" fontSize="9" fill="#89726b">Aug</text>
                    <rect x="439" y="90" width="28" height="88" rx="5" fill="#ff8a65"/>
                    <text x="453" y="195" textAnchor="middle" fontSize="9" fill="#89726b">Sep</text>
                    <rect x="487" y="40" width="28" height="138" rx="5" fill="#9f4122"/>
                    <text x="501" y="195" textAnchor="middle" fontSize="9" fill="#89726b">Oct</text>
                    <rect x="535" y="15" width="28" height="163" rx="5" fill="#7f2a0d" opacity="0.9"/>
                    <text x="549" y="195" textAnchor="middle" fontSize="9" fill="#89726b">Nov</text>
                    <rect x="583" y="30" width="28" height="148" rx="5" fill="#9f4122"/>
                    <text x="597" y="195" textAnchor="middle" fontSize="9" fill="#89726b" fontWeight="700">Dec</text>
                    <rect x="571" y="14" width="55" height="18" rx="4" fill="#1d1c15"/>
                    <text x="598" y="26" textAnchor="middle" fontSize="9" fill="#fff9ee" fontWeight="600">৳4.82L</text>
                  </svg>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant">
                    <div className="w-3 h-3 rounded-sm bg-primary"></div> Revenue 2024
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant">
                    <div className="w-3 h-3 rounded-sm bg-primary-fixed-dim"></div> Revenue 2023
                  </div>
                </div>
              </div>

              {/* Order Status Donut */}
              <div className="flex flex-col gap-4">
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-5 shadow-sm flex-1">
                  <h3 className="font-bold text-[16px] text-on-surface mb-1">Order Status</h3>
                  <p className="text-[12px] text-on-surface-variant mb-4">This month&apos;s breakdown</p>
                  <div className="flex items-center gap-4">
                    <svg viewBox="0 0 120 120" className="w-24 h-24 shrink-0" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="60" cy="60" r="46" fill="none" stroke="#e8e2d7" strokeWidth="18"/>
                      <circle cx="60" cy="60" r="46" fill="none" stroke="#9f4122" strokeWidth="18" strokeDasharray="196 289" strokeDashoffset="72" strokeLinecap="round"/>
                      <circle cx="60" cy="60" r="46" fill="none" stroke="#bbe9ff" strokeWidth="18" strokeDasharray="58 289" strokeDashoffset="-124" strokeLinecap="round"/>
                      <circle cx="60" cy="60" r="46" fill="none" stroke="#ffdbd0" strokeWidth="18" strokeDasharray="35 289" strokeDashoffset="-182" strokeLinecap="round"/>
                      <text x="60" y="55" textAnchor="middle" fontSize="15" fontWeight="800" fill="#1d1c15">68%</text>
                      <text x="60" y="68" textAnchor="middle" fontSize="8" fill="#56423c">Delivered</text>
                    </svg>
                    <div className="space-y-2 text-[12px]">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0"></div>
                        <div className="text-on-surface-variant">Delivered</div>
                        <div className="ml-auto font-bold text-on-surface">68%</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed shrink-0"></div>
                        <div className="text-on-surface-variant">Processing</div>
                        <div className="ml-auto font-bold text-on-surface">20%</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary-fixed shrink-0"></div>
                        <div className="text-on-surface-variant">Cancelled</div>
                        <div className="ml-auto font-bold text-on-surface">12%</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-5 shadow-sm">
                  <h3 className="font-bold text-[15px] text-on-surface mb-3">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-on-surface-variant">Avg. Order Value</span>
                      <span className="text-[13px] font-bold text-on-surface">৳785</span>
                    </div>
                    <div className="w-full bg-surface-container-high rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-on-surface-variant">Repeat Customers</span>
                      <span className="text-[13px] font-bold text-on-surface">43%</span>
                    </div>
                    <div className="w-full bg-surface-container-high rounded-full h-1.5">
                      <div className="bg-tertiary h-1.5 rounded-full" style={{ width: '43%' }}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-on-surface-variant">Reviews Score</span>
                      <span className="text-[13px] font-bold text-on-surface">4.7 / 5</span>
                    </div>
                    <div className="w-full bg-surface-container-high rounded-full h-1.5">
                      <div className="bg-secondary h-1.5 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RECENT ORDERS + TOP PRODUCTS */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 fade-up fade-up-3">
              <div className="xl:col-span-2 bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20">
                  <h3 className="font-bold text-[16px] text-on-surface">Recent Orders</h3>
                  <button className="text-[12px] font-semibold text-primary hover:underline flex items-center gap-1">
                    View all <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[13px] min-w-[520px]">
                    <thead>
                      <tr className="bg-surface-container-low">
                        <th className="text-left text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider px-5 py-3">Order</th>
                        <th className="text-left text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider px-3 py-3">Customer</th>
                        <th className="text-left text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider px-3 py-3">Product</th>
                        <th className="text-left text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider px-3 py-3">Amount</th>
                        <th className="text-left text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider px-3 py-3">Status</th>
                        <th className="px-3 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/15">
                      {[
                        { id: '3841', name: 'Nusrat S.', initials: 'NS', product: 'Biryani Masala', amount: '598', status: 'Delivered', statusColor: 'bg-secondary-container text-on-secondary-container' },
                        { id: '3840', name: 'Rahim I.', initials: 'RI', product: 'Yellow Moong Dal × 3', amount: '447', status: 'Processing', statusColor: 'bg-tertiary-container text-on-tertiary-container' },
                        { id: '3839', name: 'Fariha A.', initials: 'FA', product: 'Green Cardamom', amount: '349', status: 'Shipped', statusColor: 'bg-primary-fixed text-on-primary-container' },
                        { id: '3838', name: 'Mahfuz K.', initials: 'MK', product: 'Mixed Dry Fruits × 2', amount: '1,199', status: 'Delivered', statusColor: 'bg-secondary-container text-on-secondary-container' },
                        { id: '3837', name: 'Sadia B.', initials: 'SB', product: 'Turmeric Powder', amount: '189', status: 'Cancelled', statusColor: 'bg-error-container text-error' }
                      ].map((order, i) => (
                        <tr key={i} className="trow">
                          <td className="px-5 py-3.5 font-mono text-[12px] text-on-surface-variant">#ORD-{order.id}</td>
                          <td className="px-3 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-secondary-fixed flex items-center justify-center text-[10px] font-bold text-on-secondary-container shrink-0">{order.initials}</div>
                              <span className="font-medium text-on-surface">{order.name}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3.5 text-on-surface-variant">{order.product}</td>
                          <td className="px-3 py-3.5 font-semibold text-on-surface">৳{order.amount}</td>
                          <td className="px-3 py-3.5"><span className={`${order.statusColor} text-[10px] font-bold px-2.5 py-1 rounded-full`}>{order.status}</span></td>
                          <td className="px-3 py-3.5"><button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-[18px]">more_vert</span></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20">
                  <h3 className="font-bold text-[16px] text-on-surface">Top Products</h3>
                  <span className="text-[11px] text-on-surface-variant font-medium">By revenue</span>
                </div>
                <div className="divide-y divide-outline-variant/15">
                  {[
                    { name: 'Biryani Masala', sold: 542, revenue: '1,07,858', trend: '↑ 14%', trendColor: 'text-secondary', icon: 'local_fire_department', iconColor: 'text-primary' },
                    { name: 'Mixed Dry Fruits', sold: 410, revenue: '97,585', trend: '↑ 9%', trendColor: 'text-secondary', icon: 'nutrition', iconColor: 'text-secondary' },
                    { name: 'Green Cardamom', sold: 267, revenue: '93,183', trend: '↑ 6%', trendColor: 'text-secondary', icon: 'spa', iconColor: 'text-tertiary' },
                    { name: 'Yellow Moong Dal', sold: 541, revenue: '80,609', trend: '↓ 2%', trendColor: 'text-error', icon: 'grain', iconColor: 'text-primary' },
                    { name: 'Turmeric Powder', sold: 389, revenue: '73,521', trend: '↑ 3%', trendColor: 'text-secondary', icon: 'soup_kitchen', iconColor: 'text-secondary' }
                  ].map((p, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-container-low transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-primary-fixed flex items-center justify-center shrink-0">
                        <span className={`material-symbols-outlined ${p.iconColor} text-[16px]`}>{p.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-on-surface truncate">{p.name}</div>
                        <div className="text-[11px] text-on-surface-variant">{p.sold} sold</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[13px] font-bold text-on-surface">৳{p.revenue}</div>
                        <div className={`text-[10px] ${p.trendColor} font-semibold`}>{p.trend}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* BOTTOM ROW: Reviews + Low Stock + Coupons */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 fade-up fade-up-4">
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20">
                  <h3 className="font-bold text-[16px] text-on-surface">Recent Reviews</h3>
                  <div className="flex items-center gap-1 text-primary">
                    <span className="text-[13px]">★</span>
                    <span className="text-[13px] font-bold">4.7</span>
                  </div>
                </div>
                <div className="divide-y divide-outline-variant/15">
                  {[
                    { name: 'Nadia K.', initials: 'NK', stars: '★★★★★', text: "Best spices I've ever used! The aroma is incredible — freshly packed.", product: 'Biryani Masala', time: '2 days ago' },
                    { name: 'Mosharraf H.', initials: 'MH', stars: '★★★★☆', text: "Delivery was quick. Dal quality is genuine. Will order again.", product: 'Yellow Moong Dal', time: '4 days ago' },
                    { name: 'Sumaiya P.', initials: 'SP', stars: '★★★★★', text: "Cardamom is so fragrant! Nothing like the ones from supermarkets.", product: 'Green Cardamom', time: '1 week ago' }
                  ].map((review, i) => (
                    <div key={i} className="px-5 py-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary-fixed flex items-center justify-center text-[9px] font-bold text-on-primary-container">{review.initials}</div>
                          <span className="text-[12px] font-semibold text-on-surface">{review.name}</span>
                        </div>
                        <span className="text-primary text-[11px]">{review.stars}</span>
                      </div>
                      <p className="text-[12px] text-on-surface-variant">&quot;{review.text}&quot;</p>
                      <span className="text-[10px] text-outline mt-1 block">{review.product} · {review.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20">
                  <h3 className="font-bold text-[16px] text-on-surface">Stock Alerts</h3>
                  <span className="bg-error-container text-error text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 badge-pulse">
                    <span className="material-symbols-outlined text-[12px]">warning</span> 3 Low
                  </span>
                </div>
                <div className="divide-y divide-outline-variant/15">
                  {[
                    { name: 'Black Pepper Whole', left: 8, pct: 16, color: 'bg-error' },
                    { name: 'Saffron Premium', left: 12, pct: 24, color: 'bg-error' },
                    { name: 'Star Anise', left: 22, pct: 44, color: 'bg-primary-fixed-dim' }
                  ].map((stock, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-4">
                      <div className="w-9 h-9 rounded-xl bg-error-container flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-error text-[18px]">inventory_2</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-[13px] font-semibold text-on-surface">{stock.name}</div>
                        <div className="text-[11px] text-on-surface-variant">Only {stock.left} units left</div>
                        <div className="w-full bg-surface-container-high rounded-full h-1.5 mt-1.5">
                          <div className={`${stock.color} h-1.5 rounded-full`} style={{ width: `${stock.pct}%` }}></div>
                        </div>
                      </div>
                      <button className="text-[11px] font-semibold text-primary border border-primary/30 px-3 py-1.5 rounded-full hover:bg-primary-fixed transition-colors shrink-0">Restock</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20">
                  <h3 className="font-bold text-[16px] text-on-surface">Active Coupons</h3>
                  <button className="text-[11px] font-semibold text-primary border border-primary/30 px-3 py-1.5 rounded-full hover:bg-primary-fixed transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">add</span> New
                  </button>
                </div>
                <div className="divide-y divide-outline-variant/15">
                  {[
                    { code: 'SPICE20', discount: '20% OFF', info: 'All spice products · Min ৳400', usage: '84 / 200', exp: 'Dec 31', pct: 42, color: 'bg-secondary', bg: 'bg-secondary-fixed/30' },
                    { code: 'NEWUSER', discount: '৳50 OFF', info: 'First order only · No minimum', usage: '211 times', exp: 'No expiry', pct: 100, color: 'bg-tertiary', bg: 'bg-tertiary-fixed/40' },
                    { code: 'WINTER15', discount: '15% OFF', info: 'Sitewide · Min ৳300', usage: '37 / 100', exp: 'Jan 15', pct: 37, color: 'bg-primary', bg: 'bg-primary-fixed/50' }
                  ].map((coupon, i) => (
                    <div key={i} className="px-5 py-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`font-mono font-bold text-[14px] text-on-surface ${coupon.bg} px-2.5 py-1 rounded-lg tracking-wider`}>{coupon.code}</span>
                        <span className={`text-[11px] font-semibold`} style={{ color: coupon.color === 'bg-secondary' ? '#556500' : coupon.color === 'bg-tertiary' ? '#326578' : '#9f4122' }}>{coupon.discount}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                        <span>Used {coupon.usage}</span>
                        <span className="text-outline">Exp: {coupon.exp}</span>
                      </div>
                      <div className="w-full bg-surface-container-high rounded-full h-1 mt-1.5">
                        <div className={`${coupon.color} h-1 rounded-full`} style={{ width: `${coupon.pct}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
