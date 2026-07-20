"use client";

import { useState } from "react";
import AdminSidebar, { toggleAdminSidebar, toggleAdminMini } from "@/components/AdminSidebar";

export default function AdminSettings() {
  const [notifications, setNotifications] = useState({
    newOrder: true,
    lowStock: true,
    reviews: false,
    weekly: true
  });

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        .fade-up { animation: fadeUp 0.4s ease both; }
        .fade-up-1 { animation-delay: 0.05s; }
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
              <span id="breadcrumb" className="text-on-surface font-semibold">Settings</span>
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
            <div className="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center font-bold text-[12px] text-on-primary-container cursor-pointer">RA</div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 md:p-6 xl:p-8 overflow-y-auto">
          <section id="section-settings" className="space-y-6">
            <div className="fade-up">
              <h1 className="text-[22px] md:text-[28px] font-extrabold text-on-surface">Settings</h1>
              <p className="text-[13px] text-on-surface-variant mt-0.5">Manage store configuration</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 fade-up fade-up-1">
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-[15px] text-on-surface border-b border-outline-variant/20 pb-3">Store Information</h3>
                <div>
                  <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">Store Name</label>
                  <input type="text" defaultValue="Shuddhota Co." className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[13px] text-on-surface focus:ring-primary focus:border-primary"/>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">Support Email</label>
                  <input type="email" defaultValue="support@shuddhota.com" className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[13px] text-on-surface focus:ring-primary focus:border-primary"/>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">Phone</label>
                  <input type="text" defaultValue="+880 1700-000000" className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[13px] text-on-surface focus:ring-primary focus:border-primary"/>
                </div>
                <button className="bg-primary text-on-primary text-[13px] font-medium px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors">Save Changes</button>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-[15px] text-on-surface border-b border-outline-variant/20 pb-3">Notifications</h3>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-[13px] font-medium text-on-surface">New Order Alerts</div>
                    <div className="text-[11px] text-on-surface-variant">Get notified on each new order</div>
                  </div>
                  <button 
                    onClick={() => toggleNotif('newOrder')}
                    className={`w-11 h-6 ${notifications.newOrder ? 'bg-primary' : 'bg-surface-container-high'} rounded-full relative transition-colors`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow transition-all ${notifications.newOrder ? 'right-1' : 'left-1'}`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-outline-variant/15">
                  <div>
                    <div className="text-[13px] font-medium text-on-surface">Low Stock Alerts</div>
                    <div className="text-[11px] text-on-surface-variant">Alert when stock drops below 20</div>
                  </div>
                  <button 
                    onClick={() => toggleNotif('lowStock')}
                    className={`w-11 h-6 ${notifications.lowStock ? 'bg-primary' : 'bg-surface-container-high'} rounded-full relative transition-colors`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow transition-all ${notifications.lowStock ? 'right-1' : 'left-1'}`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-outline-variant/15">
                  <div>
                    <div className="text-[13px] font-medium text-on-surface">Review Notifications</div>
                    <div className="text-[11px] text-on-surface-variant">Email on new customer reviews</div>
                  </div>
                  <button 
                    onClick={() => toggleNotif('reviews')}
                    className={`w-11 h-6 ${notifications.reviews ? 'bg-primary' : 'bg-surface-container-high'} rounded-full relative transition-colors`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow transition-all ${notifications.reviews ? 'right-1' : 'left-1'}`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-outline-variant/15">
                  <div>
                    <div className="text-[13px] font-medium text-on-surface">Weekly Reports</div>
                    <div className="text-[11px] text-on-surface-variant">Receive weekly performance digest</div>
                  </div>
                  <button 
                    onClick={() => toggleNotif('weekly')}
                    className={`w-11 h-6 ${notifications.weekly ? 'bg-primary' : 'bg-surface-container-high'} rounded-full relative transition-colors`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow transition-all ${notifications.weekly ? 'right-1' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
