"use client";

import { useEffect, useState } from "react";
import AdminSidebar, { toggleAdminSidebar, toggleAdminMini } from "@/components/AdminSidebar";

interface Coupon {
  id: number;
  code: string;
  name: string;
  type: string;
  discount: number;
  maxCap: number | null;
  minOrder: number;
  product: string;
  pointsReq: number | null;
  startDate: string;
  endDate: string | null;
  usageLimit: number | null;
  usedCount: number;
  perUserLimit: number;
  status: string;
}

const INITIAL_COUPONS: Coupon[] = [
  {id:1, code:'WELCOME20', name:'Welcome Discount', type:'percent', discount:20, maxCap:200, minOrder:0, product:'', pointsReq:null, startDate:'2026-06-01', endDate:'2026-06-30', usageLimit:500, usedCount:187, perUserLimit:1, status:'active'},
  {id:2, code:'SAVE100', name:'Flat ৳100 Off', type:'amount', discount:100, maxCap:null, minOrder:500, product:'', pointsReq:null, startDate:'2026-06-01', endDate:'2026-06-30', usageLimit:200, usedCount:64, perUserLimit:1, status:'active'},
  {id:3, code:'MASALA15', name:'Masala Product Offer', type:'product_pct', discount:15, maxCap:null, minOrder:0, product:'Shuddhota Garam Masala', pointsReq:null, startDate:'2026-05-15', endDate:'2026-07-15', usageLimit:100, usedCount:43, perUserLimit:0, status:'active'},
  {id:4, code:'EID2026', name:'Eid Special', type:'percent', discount:30, maxCap:500, minOrder:800, product:'', pointsReq:null, startDate:'2026-07-01', endDate:'2026-07-10', usageLimit:1000, usedCount:0, perUserLimit:1, status:'scheduled'},
  {id:5, code:'PTS500OFF', name:'500 Points → 10% Discount', type:'pts_pct', discount:10, maxCap:150, minOrder:0, product:'', pointsReq:500, startDate:'2026-01-01', endDate:'2026-12-31', usageLimit:null, usedCount:312, perUserLimit:3, status:'active'},
  {id:6, code:'PTS200TK', name:'200 Points → ৳50 Discount', type:'pts_amt', discount:50, maxCap:null, minOrder:0, product:'', pointsReq:200, startDate:'2026-01-01', endDate:'2026-12-31', usageLimit:null, usedCount:891, perUserLimit:0, status:'active'},
  {id:7, code:'RAMADAN30', name:'Ramadan 30% Off', type:'percent', discount:30, maxCap:300, minOrder:600, product:'', pointsReq:null, startDate:'2026-03-01', endDate:'2026-03-31', usageLimit:300, usedCount:300, perUserLimit:2, status:'expired'},
  {id:8, code:'FIRSTBUY', name:'First Purchase Offer', type:'amount', discount:200, maxCap:null, minOrder:0, product:'', pointsReq:null, startDate:'2026-06-01', endDate:'2026-12-31', usageLimit:null, usedCount:29, perUserLimit:1, status:'active'},
  {id:9, code:'SPICE20', name:'Spice Range 20%', type:'product_pct', discount:20, maxCap:null, minOrder:0, product:'Shuddhota Turmeric Powder', pointsReq:null, startDate:'2026-05-01', endDate:'2026-05-31', usageLimit:50, usedCount:50, perUserLimit:1, status:'expired'},
  {id:10, code:'VIP15', name:'VIP Member Reward', type:'percent', discount:15, maxCap:null, minOrder:1000, product:'', pointsReq:null, startDate:'2026-06-15', endDate:'2026-09-15', usageLimit:100, usedCount:0, perUserLimit:0, status:'inactive'},
];

const TYPE_META: Record<string, any> = {
  percent:     {label:'Cart %',       icon:'percent',          iconBg:'bg-primary-fixed',      iconColor:'text-primary',      badgeBg:'bg-primary-fixed',    badgeColor:'text-on-primary-container', desc:'Applies a percentage discount to the entire cart total.'},
  product_pct: {label:'Product %',    icon:'inventory_2',      iconBg:'bg-tertiary-fixed/60',  iconColor:'text-tertiary',     badgeBg:'bg-tertiary-fixed',   badgeColor:'text-on-tertiary-container', desc:'Applies a percentage discount to a specific product only.'},
  amount:      {label:'Fixed ৳',      icon:'currency_rupee',   iconBg:'bg-secondary-fixed/50', iconColor:'text-secondary',    badgeBg:'bg-secondary-fixed',  badgeColor:'text-on-secondary-container', desc:'Deducts a fixed Taka amount from the total cart value.'},
  pts_pct:     {label:'Points→%',     icon:'toll',             iconBg:'bg-[#fff4c2]',          iconColor:'text-[#8a6900]',    badgeBg:'bg-[#fff4c2]',        badgeColor:'text-[#8a6900]', desc:'User redeems loyalty points to receive a percentage discount.'},
  pts_amt:     {label:'Points→৳',    icon:'stars',            iconBg:'bg-[#ede6ff]',          iconColor:'text-[#6941c6]',    badgeBg:'bg-[#ede6ff]',        badgeColor:'text-[#6941c6]', desc:'User redeems loyalty points to receive a fixed Taka discount.'},
};

export default function CouponManagementPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentTypeFilter, setCurrentTypeFilter] = useState('');
  const [currentSearch, setCurrentSearch] = useState('');
  const [isModalOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; icon: string; show: boolean }>({ msg: '', icon: 'check_circle', show: false });
  const [currentDate, setCurrentDate] = useState("");

  // Form State
  const [fType, setFType] = useState('percent');
  const [fCode, setFCode] = useState('');
  const [fName, setFName] = useState('');
  const [fPct, setFPct] = useState('');
  const [fMaxCap, setFMaxCap] = useState('');
  const [fAmt, setFAmt] = useState('');
  const [fPts, setFPts] = useState('');
  const [fProduct, setFProduct] = useState('');
  const [fMinOrder, setFMinOrder] = useState('');
  const [fStart, setFStart] = useState('');
  const [fEnd, setFEnd] = useState('');
  const [formUnlimited, setFormUnlimited] = useState(true);
  const [fUsageLimit, setFUsageLimit] = useState('');
  const [fPerUser, setFPerUser] = useState('1');
  const [fPuN, setFPuN] = useState('');
  const [formStatusOn, setFormStatusOn] = useState(true);

  useEffect(() => {
    const n = new Date();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    setCurrentDate(`${n.getDate()} ${months[n.getMonth()]} ${n.getFullYear()}`);
    const today = new Date().toISOString().split('T')[0];
    setFStart(today);
  }, []);

  const showToast = (msg: string, icon = 'check_circle') => {
    setToast({ msg, icon, show: true });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const computeStatus = (c: Coupon) => {
    if (c.status === 'inactive') return 'inactive';
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    if (c.startDate > today) return 'scheduled';
    if (c.endDate && c.endDate < today) return 'expired';
    if (c.usageLimit !== null && c.usedCount >= c.usageLimit) return 'expired';
    if (c.status === 'active') return 'active';
    return c.status;
  };

  const getFiltered = () => {
    return coupons.filter(c => {
      const cs = computeStatus(c);
      if (currentFilter !== 'all' && cs !== currentFilter) return false;
      if (currentTypeFilter && c.type !== currentTypeFilter) return false;
      if (currentSearch) {
        const q = currentSearch.toLowerCase();
        if (!c.code.toLowerCase().includes(q) && !c.name.toLowerCase().includes(q) && !(c.product || '').toLowerCase().includes(q)) return false;
      }
      return true;
    });
  };

  const updateStats = () => {
    const total = coupons.length;
    const active = coupons.filter(c => computeStatus(c) === 'active').length;
    const scheduled = coupons.filter(c => computeStatus(c) === 'scheduled').length;
    const redeemed = coupons.reduce((s, c) => s + c.usedCount, 0);
    const types = new Set(coupons.map(c => c.type)).size;
    return { total, active, scheduled, redeemed, types };
  };

  const stats = updateStats();
  const filtered = getFiltered();

  const getDiscountLabel = (c: Coupon) => {
    if (c.type === 'percent') return `${c.discount}%${c.maxCap ? ` (max ৳${c.maxCap})` : ''}`;
    if (c.type === 'product_pct') return `${c.discount}% on product`;
    if (c.type === 'amount') return `৳${c.discount} off`;
    if (c.type === 'pts_pct') return `${c.pointsReq} pts → ${c.discount}%`;
    if (c.type === 'pts_amt') return `${c.pointsReq} pts → ৳${c.discount}`;
    return '';
  };

  const getPerUserLabel = (n: number) => {
    if (n === 1) return 'Single use';
    if (n === 0) return 'Unlimited';
    return `${n}× per user`;
  };

  const getStatusMeta = (s: string) => {
    const m: Record<string, any> = {
      active: { cls: 'bg-secondary-fixed/60 text-secondary', dot: 'bg-secondary', label: 'Active' },
      inactive: { cls: 'bg-surface-container text-on-surface-variant', dot: 'bg-outline', label: 'Inactive' },
      expired: { cls: 'bg-error-container text-error', dot: 'bg-error', label: 'Expired' },
      scheduled: { cls: 'bg-tertiary-fixed text-on-tertiary-container', dot: 'bg-tertiary', label: 'Scheduled' },
    };
    return m[s] || m.inactive;
  };

  const fmtDate = (d: string | null) => {
    if (!d) return '—';
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const p = d.split('-');
    return `${parseInt(p[2])} ${months[parseInt(p[1]) - 1]} ${p[0]}`;
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => { });
    showToast(`Copied: ${code}`, 'check_circle');
  };

  const quickToggleStatus = (id: number) => {
    const c = coupons.find(x => x.id === id);
    if (!c) return;
    const cs = computeStatus(c);
    if (cs === 'active') {
      setCoupons(prev => prev.map(x => x.id === id ? { ...x, status: 'inactive' } : x));
      showToast(`${c.code} deactivated`, 'pause_circle');
    } else if (cs === 'inactive' || cs === 'scheduled') {
      setCoupons(prev => prev.map(x => x.id === id ? { ...x, status: 'active' } : x));
      showToast(`${c.code} activated`, 'play_circle');
    } else {
      showToast('Cannot change expired coupon status', 'info');
    }
  };

  const openDeleteModal = (id: number) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTargetId) return;
    const c = coupons.find(x => x.id === deleteTargetId);
    setCoupons(prev => prev.filter(x => x.id !== deleteTargetId));
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
    showToast(`Coupon ${c ? c.code : ''} deleted`, 'delete');
  };

  const openCreateModal = () => {
    setEditingId(null);
    resetForm();
    setIsDrawerOpen(true);
  };

  const openEditModal = (id: number) => {
    const c = coupons.find(x => x.id === id);
    if (!c) return;
    setEditingId(id);
    populateForm(c);
    setIsDrawerOpen(true);
  };

  const resetForm = () => {
    setFType('percent');
    setFCode('');
    setFName('');
    setFPct('');
    setFMaxCap('');
    setFAmt('');
    setFPts('');
    setFProduct('');
    setFMinOrder('');
    const today = new Date().toISOString().split('T')[0];
    setFStart(today);
    setFEnd('');
    setFormUnlimited(true);
    setFUsageLimit('');
    setFPerUser('1');
    setFPuN('');
    setFormStatusOn(true);
  };

  const populateForm = (c: Coupon) => {
    setFType(c.type);
    setFCode(c.code);
    setFName(c.name || '');
    setFPct((c.type === 'percent' || c.type === 'product_pct' || c.type === 'pts_pct') ? c.discount.toString() : '');
    setFMaxCap(c.maxCap?.toString() || '');
    setFAmt((c.type === 'amount' || c.type === 'pts_amt') ? c.discount.toString() : '');
    setFPts(c.pointsReq?.toString() || '');
    setFProduct(c.product || '');
    setFMinOrder(c.minOrder.toString() || '');
    setFStart(c.startDate || '');
    setFEnd(c.endDate || '');
    setFormUnlimited(c.usageLimit === null);
    setFUsageLimit(c.usageLimit?.toString() || '');
    if (c.perUserLimit === 1) setFPerUser('1');
    else if (c.perUserLimit === 0) setFPerUser('0');
    else { setFPerUser('n'); setFPuN(c.perUserLimit.toString()); }
    setFormStatusOn(c.status !== 'inactive');
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
    setFCode(code);
  };

  const saveCoupon = () => {
    if (!fCode.trim()) { showToast('Coupon code is required', 'error_outline'); return; }
    const dup = coupons.find(c => c.code === fCode.trim().toUpperCase() && c.id !== editingId);
    if (dup) { showToast('Coupon code already exists!', 'error_outline'); return; }

    let discount = 0, maxCap = null, pointsReq = null, product = '';
    const isPercent = fType === 'percent' || fType === 'product_pct' || fType === 'pts_pct';
    const isAmount = fType === 'amount' || fType === 'pts_amt';
    const isPoints = fType === 'pts_pct' || fType === 'pts_amt';
    const isProduct = fType === 'product_pct';

    if (isPercent) {
      discount = parseFloat(fPct) || 0;
      if (!discount || discount <= 0 || discount > 100) { showToast('Enter a valid discount (1–100%)', 'error_outline'); return; }
      maxCap = parseFloat(fMaxCap) || null;
    }
    if (isAmount) {
      discount = parseFloat(fAmt) || 0;
      if (!discount || discount <= 0) { showToast('Enter a valid discount amount', 'error_outline'); return; }
    }
    if (isPoints) {
      pointsReq = parseFloat(fPts) || 0;
      if (!pointsReq || pointsReq <= 0) { showToast('Enter valid points required', 'error_outline'); return; }
    }
    if (isProduct) {
      product = fProduct;
      if (!product) { showToast('Select an applicable product', 'error_outline'); return; }
    }

    const usageLimit = formUnlimited ? null : (parseInt(fUsageLimit) || null);
    if (!formUnlimited && !usageLimit) { showToast('Enter a valid usage limit', 'error_outline'); return; }

    let perUserLimit = 1;
    if (fPerUser === '0') perUserLimit = 0;
    else if (fPerUser === 'n') {
      perUserLimit = parseInt(fPuN) || 0;
      if (!perUserLimit || perUserLimit < 2) { showToast('Enter a valid number (min 2)', 'error_outline'); return; }
    }

    const obj: Coupon = {
      id: editingId || Date.now(),
      code: fCode.toUpperCase(),
      name: fName,
      type: fType,
      discount,
      maxCap,
      minOrder: parseFloat(fMinOrder) || 0,
      product,
      pointsReq,
      startDate: fStart,
      endDate: fEnd || null,
      usageLimit,
      perUserLimit,
      status: formStatusOn ? 'active' : 'inactive',
      usedCount: editingId ? (coupons.find(c => c.id === editingId)?.usedCount || 0) : 0,
    };

    if (editingId) {
      setCoupons(prev => prev.map(c => c.id === editingId ? obj : c));
      showToast(`Coupon ${obj.code} updated`, 'check_circle');
    } else {
      setCoupons(prev => [obj, ...prev]);
      showToast(`Coupon ${obj.code} created!`, 'celebration');
    }
    setIsDrawerOpen(false);
  };

  return (
    <div className="bg-background text-on-background font-sans antialiased overflow-x-hidden min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined{font-family:'Material Symbols Outlined';font-weight:normal;font-style:normal;font-size:24px;line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased}
        .stat-card{transition:transform .2s ease,box-shadow .2s ease}
        .stat-card:hover{transform:translateY(-3px);box-shadow:0 16px 40px rgba(159,65,34,.10)}
        .trow{transition:background .15s}
        .trow:hover{background:rgba(248,243,234,.9)}
        .hide-scrollbar{scrollbar-width:none;-ms-overflow-style:none}
        .hide-scrollbar::-webkit-scrollbar{display:none}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#ddc0b8;border-radius:99px}
        .badge-pulse{animation:pulse 2s cubic-bezier(0.4,0,.6,1) infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.55}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        .fade-up{animation:fadeUp .4s ease both}
        .fade-up-1{animation-delay:.05s}.fade-up-2{animation-delay:.1s}.fade-up-3{animation-delay:.15s}.fade-up-4{animation-delay:.2s}
        .type-card{transition:all .2s ease;cursor:pointer;border:2px solid transparent}
        .type-card:hover{border-color:#ddc0b8;background:rgba(248,243,234,.8)}
        .type-card.selected{border-color:#9f4122;background:rgba(159,65,34,.07)}
        .type-card.selected .type-icon{transform:scale(1.1)}
        .type-icon{transition:transform .2s ease}
        .code-mono{font-family:'Courier New',Courier,monospace;letter-spacing:.06em}
        .usage-bar-track{height:5px;border-radius:99px;background:#e8e2d7;overflow:hidden;width:100%}
        .usage-bar-fill{height:100%;border-radius:99px;background:#9f4122;transition:width .6s ease}
        .usage-bar-fill.full{background:#ba1a1a}
        .usage-bar-fill.safe{background:#556500}
        .coupon-card{transition:transform .18s ease,box-shadow .18s ease;cursor:pointer}
        .coupon-card:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(159,65,34,.10)}
        .tgl{width:42px;height:23px;border-radius:99px;background:#e8e2d7;position:relative;cursor:pointer;transition:background .22s;flex-shrink:0}
        .tgl.on{background:#9f4122}
        .tgl::after{content:'';position:absolute;top:3px;left:3px;width:17px;height:17px;border-radius:50%;background:#fff;transition:transform .22s;box-shadow:0 1px 3px rgba(0,0,0,.18)}
        .tgl.on::after{transform:translateX(19px)}
        .fchip{transition:all .15s;cursor:pointer;border:1.5px solid transparent}
        .fchip:hover{border-color:#ddc0b8}
        .fchip.active{background:#9f4122;color:#fff;border-color:#9f4122}
        .modal-backdrop{transition:opacity .22s ease}
        .modal-panel{transition:opacity .22s ease, transform .25s cubic-bezier(.34,1.28,.64,1)}
        .modal-panel.hidden-state{opacity:0;transform:scale(.95) translateY(12px)}
        .coupon-dashed{background-image:repeating-linear-gradient(90deg,#ddc0b8 0,#ddc0b8 6px,transparent 6px,transparent 12px);height:1px}
        .del-panel{transition:opacity .22s ease,transform .25s cubic-bezier(.34,1.28,.64,1)}
        .del-panel.hidden-state{opacity:0;transform:scale(.95)}
      ` }} />

      <AdminSidebar pendingOrders={7} />

      <div id="main-content" className="main-content lg:ml-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 flex items-center justify-between px-4 md:px-6 h-16 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={toggleAdminSidebar} className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>
            <button onClick={toggleAdminMini} className="hidden lg:flex w-9 h-9 rounded-xl items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-[22px]">menu_open</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 text-[13px]">
              <span className="text-on-surface-variant">Admin</span>
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant">chevron_right</span>
              <span className="text-on-surface font-semibold">Coupons</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 bg-surface-container rounded-full px-4 py-2 border border-outline-variant/30 w-48 xl:w-64">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
              <input 
                type="text" 
                placeholder="Search coupons..." 
                value={currentSearch}
                onChange={(e) => setCurrentSearch(e.target.value)}
                className="bg-transparent text-[13px] text-on-surface placeholder:text-outline border-none focus:ring-0 w-full p-0"
              />
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

        <main className="flex-1 p-4 md:p-6 xl:p-8 pb-24 lg:pb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 fade-up">
            <div>
              <h1 className="text-[22px] md:text-[28px] font-extrabold text-on-surface">Coupon Management</h1>
              <p className="text-[13px] text-on-surface-variant mt-0.5">Create &amp; manage discount, product, and point redemption coupons</p>
            </div>
            <button onClick={openCreateModal} className="flex items-center gap-2 bg-primary text-on-primary text-[13px] font-semibold px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors shadow-sm self-start sm:self-auto">
              <span className="material-symbols-outlined text-[18px]">add</span>Create Coupon
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="stat-card bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-4 md:p-5 shadow-sm fade-up fade-up-1 cursor-pointer" onClick={() => setCurrentFilter('all')}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[20px]">local_offer</span>
                </div>
                <span className="text-[10px] font-bold text-secondary bg-secondary-container px-2 py-0.5 rounded-full">Total</span>
              </div>
              <p className="text-[24px] md:text-[28px] font-extrabold text-on-surface leading-none">{stats.total}</p>
              <p className="text-[12px] text-on-surface-variant mt-1 font-medium">Total Coupons</p>
              <p className="text-[11px] text-on-surface-variant/70 mt-0.5">{stats.types} types in use</p>
            </div>
            <div className="stat-card bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-4 md:p-5 shadow-sm fade-up fade-up-2 cursor-pointer" onClick={() => setCurrentFilter('active')}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-secondary-fixed/50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                </div>
                <span className="text-[10px] font-bold text-secondary bg-secondary-container px-2 py-0.5 rounded-full">Live</span>
              </div>
              <p className="text-[24px] md:text-[28px] font-extrabold text-on-surface leading-none">{stats.active}</p>
              <p className="text-[12px] text-on-surface-variant mt-1 font-medium">Active Coupons</p>
              <p className="text-[11px] text-on-surface-variant/70 mt-0.5">{stats.scheduled} scheduled</p>
            </div>
            <div className="stat-card bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-4 md:p-5 shadow-sm fade-up fade-up-3">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-tertiary-fixed/50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary text-[20px]">redeem</span>
                </div>
                <span className="text-[10px] font-bold text-secondary bg-secondary-container px-2 py-0.5 rounded-full">All-time</span>
              </div>
              <p className="text-[24px] md:text-[28px] font-extrabold text-on-surface leading-none">{stats.redeemed.toLocaleString()}</p>
              <p className="text-[12px] text-on-surface-variant mt-1 font-medium">Total Redemptions</p>
              <p className="text-[11px] text-on-surface-variant/70 mt-0.5">Across all coupons</p>
            </div>
            <div className="stat-card bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-4 md:p-5 shadow-sm fade-up fade-up-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#b8860b]/15 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#b8860b] text-[20px]">savings</span>
                </div>
                <span className="text-[10px] font-bold text-secondary bg-secondary-container px-2 py-0.5 rounded-full">Saved</span>
              </div>
              <p className="text-[24px] md:text-[28px] font-extrabold text-on-surface leading-none">৳92k</p>
              <p className="text-[12px] text-on-surface-variant mt-1 font-medium">Discount Given</p>
              <p className="text-[11px] text-on-surface-variant/70 mt-0.5">Estimated savings</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] shadow-sm fade-up fade-up-3">
            <div className="p-4 md:p-5 border-b border-outline-variant/20">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[16px] text-on-surface">All Coupons <span className="text-[13px] font-normal text-on-surface-variant">({filtered.length})</span></h3>
                  <div className="flex md:hidden items-center gap-2 bg-surface-container rounded-full px-3 py-2 border border-outline-variant/30 flex-1 min-w-[140px]">
                    <span className="material-symbols-outlined text-on-surface-variant text-[17px]">search</span>
                    <input 
                      type="text" 
                      placeholder="Search…" 
                      className="bg-transparent text-[12px] text-on-surface placeholder:text-outline border-none focus:ring-0 w-full p-0"
                      value={currentSearch}
                      onChange={(e) => setCurrentSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {['all', 'active', 'scheduled', 'inactive', 'expired'].map(f => (
                    <button 
                      key={f}
                      onClick={() => setCurrentFilter(f)} 
                      className={`fchip text-[12px] font-semibold px-3.5 py-1.5 rounded-full border border-outline-variant/30 ${currentFilter === f ? 'active' : 'bg-surface-container text-on-surface-variant'}`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                  <div className="h-4 w-px bg-outline-variant/40 mx-1 hidden sm:block"></div>
                  <select 
                    value={currentTypeFilter} 
                    onChange={(e) => setCurrentTypeFilter(e.target.value)}
                    className="text-[12px] font-medium bg-surface-container border border-outline-variant/30 rounded-full px-3 py-1.5 text-on-surface-variant focus:ring-1 focus:ring-primary outline-none hidden sm:block"
                  >
                    <option value="">All Types</option>
                    <option value="percent">Cart %</option>
                    <option value="product_pct">Product %</option>
                    <option value="amount">Fixed ৳</option>
                    <option value="pts_pct">Points → %</option>
                    <option value="pts_amt">Points → ৳</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant/15">
                    <th className="px-5 py-3 text-left text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Code &amp; Name</th>
                    <th className="px-5 py-3 text-left text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Type</th>
                    <th className="px-5 py-3 text-left text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Discount</th>
                    <th className="px-5 py-3 text-left text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Usage</th>
                    <th className="px-5 py-3 text-left text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Validity</th>
                    <th className="px-5 py-3 text-left text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Per User</th>
                    <th className="px-5 py-3 text-left text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-right text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15">
                  {filtered.map(c => {
                    const tm = TYPE_META[c.type] || TYPE_META.percent;
                    const sm = getStatusMeta(computeStatus(c));
                    const pct = c.usageLimit ? Math.min(100, Math.round(c.usedCount / c.usageLimit * 100)) : 0;
                    const barClass = pct >= 100 ? 'full' : (pct > 70 ? '' : 'safe');
                    const usageText = c.usageLimit === null ? `${c.usedCount.toLocaleString()} used` : `${c.usedCount}/${c.usageLimit}`;
                    const statusCmp = computeStatus(c);
                    return (
                      <tr key={c.id} className="trow">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl ${tm.iconBg} flex items-center justify-center shrink-0`}>
                              <span className={`material-symbols-outlined ${tm.iconColor} text-[18px]`}>{tm.icon}</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="code-mono font-extrabold text-[13px] text-on-surface">{c.code}</span>
                                <button onClick={() => copyCode(c.code)} className="w-5 h-5 flex items-center justify-center rounded text-on-surface-variant hover:text-primary hover:bg-primary-fixed transition-colors" title="Copy">
                                  <span className="material-symbols-outlined text-[14px]">content_copy</span>
                                </button>
                              </div>
                              <p className="text-[11px] text-on-surface-variant mt-0.5 max-w-[180px] truncate">{c.name || '—'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${tm.badgeBg} ${tm.badgeColor}`}>
                            <span className="material-symbols-outlined text-[12px]">{tm.icon}</span>{tm.label}
                          </span>
                          {c.product && <p className="text-[10px] text-on-surface-variant mt-1 max-w-[120px] truncate">{c.product}</p>}
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-[13px] font-bold text-on-surface">{getDiscountLabel(c)}</p>
                          {c.minOrder > 0 && <p className="text-[10px] text-on-surface-variant mt-0.5">Min. ৳{c.minOrder.toLocaleString()}</p>}
                        </td>
                        <td className="px-5 py-4 min-w-[120px]">
                          <p className="text-[12px] font-semibold text-on-surface mb-1.5">{usageText}</p>
                          <div className="usage-bar-track"><div className={`usage-bar-fill ${barClass}`} style={{ width: `${c.usageLimit ? pct : 0}%` }}></div></div>
                          {c.usageLimit === null && <p className="text-[10px] text-on-surface-variant mt-1">Unlimited</p>}
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-[12px] text-on-surface">{fmtDate(c.startDate)}</p>
                          <p className="text-[11px] text-on-surface-variant">{c.endDate ? '→ ' + fmtDate(c.endDate) : 'No end date'}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-[11px] font-medium text-on-surface-variant">{getPerUserLabel(c.perUserLimit)}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit ${sm.cls}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`}></span>{sm.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => openEditModal(c.id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant hover:text-primary" title="Edit">
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button onClick={() => quickToggleStatus(c.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant ${statusCmp === 'active' ? 'hover:text-error' : 'hover:text-secondary'}`} title={statusCmp === 'active' ? 'Deactivate' : 'Activate'}>
                              <span className="material-symbols-outlined text-[18px]">{statusCmp === 'active' ? 'pause_circle' : 'play_circle'}</span>
                            </button>
                            <button onClick={() => openDeleteModal(c.id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-error-container transition-colors text-on-surface-variant hover:text-error" title="Delete">
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="md:hidden p-3 space-y-2.5">
              {filtered.map(c => {
                const tm = TYPE_META[c.type] || TYPE_META.percent;
                const sm = getStatusMeta(computeStatus(c));
                const pct = c.usageLimit ? Math.min(100, Math.round(c.usedCount / c.usageLimit * 100)) : 0;
                const barClass = pct >= 100 ? 'full' : (pct > 70 ? '' : 'safe');
                const usageText = c.usageLimit === null ? `${c.usedCount.toLocaleString()} used` : `${c.usedCount} / ${c.usageLimit}`;
                return (
                  <div key={c.id} className="coupon-card bg-surface-container-lowest border border-outline-variant/25 rounded-[18px] overflow-hidden">
                    <div className="flex items-start justify-between p-4 gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`w-10 h-10 rounded-xl ${tm.iconBg} flex items-center justify-center shrink-0`}>
                          <span className={`material-symbols-outlined ${tm.iconColor} text-[20px]`}>{tm.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="code-mono font-extrabold text-[14px] text-on-surface">{c.code}</span>
                            <button onClick={() => copyCode(c.code)} className="w-5 h-5 flex items-center justify-center rounded text-on-surface-variant hover:text-primary">
                              <span className="material-symbols-outlined text-[13px]">content_copy</span>
                            </button>
                          </div>
                          <p className="text-[11px] text-on-surface-variant truncate">{c.name || '—'}</p>
                        </div>
                      </div>
                      <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${sm.cls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`}></span>{sm.label}
                      </span>
                    </div>
                    <div className="coupon-dashed mx-4"></div>
                    <div className="p-4 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Discount</p>
                        <p className="text-[13px] font-bold text-on-surface">{getDiscountLabel(c)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Type</p>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${tm.badgeBg} ${tm.badgeColor}`}>
                          <span className="material-symbols-outlined text-[11px]">{tm.icon}</span>{tm.label}
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Validity</p>
                        <p className="text-[11px] text-on-surface">{fmtDate(c.startDate)}</p>
                        <p className="text-[10px] text-on-surface-variant">{c.endDate ? '→ ' + fmtDate(c.endDate) : 'No end'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Per User</p>
                        <p className="text-[11px] text-on-surface">{getPerUserLabel(c.perUserLimit)}</p>
                      </div>
                    </div>
                    <div className="px-4 pb-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Usage</p>
                        <p className="text-[11px] font-semibold text-on-surface">{usageText}</p>
                      </div>
                      <div className="usage-bar-track"><div className={`usage-bar-fill ${barClass}`} style={{ width: `${c.usageLimit ? pct : 0}%` }}></div></div>
                    </div>
                    <div className="flex items-center gap-0 border-t border-outline-variant/15 mt-2">
                      <button onClick={() => openEditModal(c.id)} className="flex-1 flex items-center justify-center gap-1.5 text-[12px] font-semibold text-primary py-3 hover:bg-primary-fixed/30 transition-colors">
                        <span className="material-symbols-outlined text-[16px]">edit</span>Edit
                      </button>
                      <div className="w-px h-8 bg-outline-variant/20"></div>
                      <button onClick={() => quickToggleStatus(c.id)} className={`flex-1 flex items-center justify-center gap-1.5 text-[12px] font-semibold py-3 hover:bg-surface-container transition-colors ${computeStatus(c) === 'active' ? 'text-error' : 'text-secondary'}`}>
                        <span className="material-symbols-outlined text-[16px]">{computeStatus(c) === 'active' ? 'pause_circle' : 'play_circle'}</span>
                        {computeStatus(c) === 'active' ? 'Pause' : 'Activate'}
                      </button>
                      <div className="w-px h-8 bg-outline-variant/20"></div>
                      <button onClick={() => openDeleteModal(c.id)} className="flex-1 flex items-center justify-center gap-1.5 text-[12px] font-semibold text-error py-3 hover:bg-error-container/40 transition-colors">
                        <span className="material-symbols-outlined text-[16px]">delete</span>Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-3xl bg-surface-container flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[32px] text-on-surface-variant/40">local_offer</span>
                </div>
                <p className="font-semibold text-on-surface text-[15px]">No coupons found</p>
                <p className="text-on-surface-variant text-[13px] mt-1">Try a different filter or create a new coupon</p>
                <button onClick={openCreateModal} className="mt-4 flex items-center gap-2 bg-primary text-on-primary text-[13px] font-semibold px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">add</span>Create Coupon
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      <div 
        id="modal-backdrop" 
        className={`fixed inset-0 bg-black/50 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity duration-200 ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsDrawerOpen(false)}
      >
        <div 
          className={`bg-surface-container-lowest w-full sm:max-w-xl rounded-t-[28px] sm:rounded-[24px] border border-outline-variant/30 shadow-2xl flex flex-col max-h-[92dvh] transition-all duration-300 ${isModalOpen ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-12 scale-95 opacity-0'}`} 
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-outline-variant/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[20px]">local_offer</span>
              </div>
              <div>
                <h3 className="font-bold text-[17px] text-on-surface">{editingId ? 'Edit Coupon' : 'Create Coupon'}</h3>
                <p className="text-[11px] text-on-surface-variant">{editingId ? `Editing: ${fCode}` : 'Fill in the details below'}</p>
              </div>
            </div>
            <button onClick={() => setIsDrawerOpen(false)} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto hide-scrollbar px-5 sm:px-6 py-5 space-y-5">
            <div>
              <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">Coupon Type</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {Object.keys(TYPE_META).map(t => (
                  <div 
                    key={t}
                    onClick={() => setFType(t)} 
                    className={`type-card bg-surface-container rounded-[14px] p-3 text-center flex flex-col items-center gap-1.5 ${fType === t ? 'selected' : ''}`}
                  >
                    <div className={`type-icon w-9 h-9 rounded-xl flex items-center justify-center ${TYPE_META[t].iconBg}`}>
                      <span className={`material-symbols-outlined ${TYPE_META[t].iconColor} text-[18px]`}>{TYPE_META[t].icon}</span>
                    </div>
                    <span className="text-[10px] font-bold text-on-surface leading-tight">{TYPE_META[t].label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-primary-fixed/40 border border-primary-fixed-dim/40 rounded-[12px] px-3.5 py-2.5 flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-[18px] shrink-0">info</span>
                <p className="text-[12px] text-on-surface leading-snug">{TYPE_META[fType]?.desc || ''}</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Code &amp; Label</p>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[11px] font-semibold text-on-surface-variant block mb-1.5">Coupon Code <span className="text-error">*</span></label>
                  <input 
                    type="text" 
                    placeholder="e.g. SUMMER25" 
                    value={fCode}
                    onChange={(e) => setFCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,''))}
                    className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[13px] code-mono font-bold focus:ring-1 focus:ring-primary focus:border-primary outline-none transition placeholder:font-normal"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <button onClick={generateCode} className="flex items-center gap-1 bg-surface-container-high border border-outline-variant/30 text-on-surface-variant text-[12px] font-medium px-3 py-2.5 rounded-xl hover:bg-primary-fixed/40 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[17px]">shuffle</span>
                    <span className="hidden sm:inline">Generate</span>
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-on-surface-variant block mb-1.5">Label / Description <span className="text-on-surface-variant/50 font-normal">(optional)</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. Summer Sale 25% Off" 
                  value={fName}
                  onChange={(e) => setFName(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[13px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Discount Configuration</p>

              {(fType === 'pts_pct' || fType === 'pts_amt') && (
                <div>
                  <label className="text-[11px] font-semibold text-on-surface-variant block mb-1.5">Points Required to Redeem <span className="text-error">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                      <span className="material-symbols-outlined text-[#b8860b] text-[17px]">toll</span>
                    </span>
                    <input 
                      type="number" 
                      min="1" 
                      placeholder="e.g. 500" 
                      value={fPts}
                      onChange={(e) => setFPts(e.target.value)}
                      className="w-full bg-surface-container border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2.5 text-[13px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
                    />
                  </div>
                </div>
              )}

              {fType === 'product_pct' && (
                <div>
                  <label className="text-[11px] font-semibold text-on-surface-variant block mb-1.5">Applicable Product <span className="text-error">*</span></label>
                  <select 
                    value={fProduct}
                    onChange={(e) => setFProduct(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[13px] focus:ring-1 focus:ring-primary outline-none transition"
                  >
                    <option value="">— Select a product —</option>
                    <option>Shuddhota Garam Masala</option>
                    <option>Shuddhota Turmeric Powder</option>
                    <option>Shuddhota Chili Powder</option>
                    <option>Shuddhota Coriander Powder</option>
                    <option>Shuddhota Black Pepper</option>
                    <option>Shuddhota Cumin Powder</option>
                    <option>Shuddhota Mustard Seeds</option>
                    <option>Shuddhota Fenugreek</option>
                    <option>Shuddhota Cardamom</option>
                    <option>Shuddhota Cinnamon Sticks</option>
                  </select>
                </div>
              )}

              {(fType === 'percent' || fType === 'product_pct' || fType === 'pts_pct') && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-on-surface-variant block mb-1.5">Discount Percentage <span className="text-error">*</span></label>
                    <div className="relative">
                      <input 
                        type="number" 
                        min="1" 
                        max="100" 
                        placeholder="e.g. 20" 
                        value={fPct}
                        onChange={(e) => setFPct(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 pr-10 py-2.5 text-[13px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-[14px]">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-on-surface-variant block mb-1.5">Max Discount Cap <span className="text-on-surface-variant/50 font-normal">(optional)</span></label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold text-[12px]">৳</span>
                      <input 
                        type="number" 
                        min="0" 
                        placeholder="e.g. 300" 
                        value={fMaxCap}
                        onChange={(e) => setFMaxCap(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant/30 rounded-xl pl-8 pr-4 py-2.5 text-[13px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
                      />
                    </div>
                  </div>
                </div>
              )}

              {(fType === 'amount' || fType === 'pts_amt') && (
                <div>
                  <label className="text-[11px] font-semibold text-on-surface-variant block mb-1.5">Discount Amount <span className="text-error">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold text-[13px]">৳</span>
                    <input 
                      type="number" 
                      min="1" 
                      placeholder="e.g. 100" 
                      value={fAmt}
                      onChange={(e) => setFAmt(e.target.value)}
                      className="w-full bg-surface-container border border-outline-variant/30 rounded-xl pl-8 pr-4 py-2.5 text-[13px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
                    />
                  </div>
                </div>
              )}

              {fType !== 'product_pct' && (
                <div>
                  <label className="text-[11px] font-semibold text-on-surface-variant block mb-1.5">Minimum Order Value <span className="text-on-surface-variant/50 font-normal">(optional)</span></label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold text-[13px]">৳</span>
                    <input 
                      type="number" 
                      min="0" 
                      placeholder="0 = no minimum" 
                      value={fMinOrder}
                      onChange={(e) => setFMinOrder(e.target.value)}
                      className="w-full bg-surface-container border border-outline-variant/30 rounded-xl pl-8 pr-4 py-2.5 text-[13px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Validity &amp; Dates</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-on-surface-variant block mb-1.5">Start Date</label>
                  <input 
                    type="date" 
                    value={fStart}
                    onChange={(e) => setFStart(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[13px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-on-surface-variant block mb-1.5">End Date <span className="text-on-surface-variant/50 font-normal">(optional)</span></label>
                  <input 
                    type="date" 
                    value={fEnd}
                    onChange={(e) => setFEnd(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[13px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Usage Limits</p>
              <div className="bg-surface-container rounded-[16px] p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[13px] font-semibold text-on-surface">Total Usage Limit</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">Max times this coupon can be used across all users</p>
                  </div>
                  <div onClick={() => setFormUnlimited(!formUnlimited)} className={`tgl ${formUnlimited ? 'on' : ''}`}></div>
                </div>
                {!formUnlimited && (
                  <div>
                    <label className="text-[11px] font-semibold text-on-surface-variant block mb-1.5">Maximum Uses</label>
                    <input 
                      type="number" 
                      min="1" 
                      placeholder="e.g. 500" 
                      value={fUsageLimit}
                      onChange={(e) => setFUsageLimit(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[13px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
                    />
                  </div>
                )}
                {formUnlimited && <p className="text-[12px] text-secondary font-medium flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px]">all_inclusive</span>Unlimited uses enabled</p>}
              </div>

              <div className="bg-surface-container rounded-[16px] p-4 space-y-3">
                <div>
                  <p className="text-[13px] font-semibold text-on-surface">Per-User Usage Limit</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">How many times a single user can use this coupon</p>
                </div>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="per-user" value="1" checked={fPerUser === '1'} onChange={(e) => setFPerUser(e.target.value)} className="pu-radio w-4 h-4 cursor-pointer"/>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${fPerUser === '1' ? 'bg-primary-fixed' : 'bg-primary-fixed/50'}`}>
                        <span className="material-symbols-outlined text-primary text-[16px]">person</span>
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-on-surface">Single use</p>
                        <p className="text-[11px] text-on-surface-variant">1 time per user</p>
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="per-user" value="n" checked={fPerUser === 'n'} onChange={(e) => setFPerUser(e.target.value)} className="pu-radio w-4 h-4 cursor-pointer"/>
                    <div className="flex items-center gap-2 flex-1">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${fPerUser === 'n' ? 'bg-tertiary-fixed' : 'bg-tertiary-fixed/40'}`}>
                        <span className="material-symbols-outlined text-tertiary text-[16px]">repeat</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] font-medium text-on-surface">Specific number</p>
                        {fPerUser === 'n' ? (
                          <div className="mt-1.5 flex items-center gap-2">
                            <input 
                              type="number" 
                              min="2" 
                              max="999" 
                              placeholder="e.g. 3" 
                              value={fPuN}
                              onChange={(e) => setFPuN(e.target.value)}
                              className="w-20 bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-1.5 text-[12px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
                            />
                            <span className="text-[12px] text-on-surface-variant">times per user</span>
                          </div>
                        ) : (
                          <p className="text-[11px] text-on-surface-variant">Set exact times per user</p>
                        )}
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="per-user" value="0" checked={fPerUser === '0'} onChange={(e) => setFPerUser(e.target.value)} className="pu-radio w-4 h-4 cursor-pointer"/>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${fPerUser === '0' ? 'bg-secondary-fixed' : 'bg-secondary-fixed/30'}`}>
                        <span className="material-symbols-outlined text-secondary text-[16px]">all_inclusive</span>
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-on-surface">Unlimited per user</p>
                        <p className="text-[11px] text-on-surface-variant">No per-user restrictions</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-surface-container rounded-[16px] p-4 flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-on-surface">Coupon Status</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">Enable to make this coupon immediately active</p>
              </div>
              <div onClick={() => setFormStatusOn(!formStatusOn)} className={`tgl ${formStatusOn ? 'on' : ''}`}></div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-t border-outline-variant/20 shrink-0">
            <button onClick={() => setIsDrawerOpen(false)} className="flex-1 border border-outline-variant/40 text-on-surface text-[13px] font-medium py-2.5 rounded-full hover:bg-surface-container transition-colors">Cancel</button>
            <button onClick={saveCoupon} className="flex-1 bg-primary text-on-primary text-[13px] font-semibold py-2.5 rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[17px]">save</span>
              <span>{editingId ? 'Save Changes' : 'Create Coupon'}</span>
            </button>
          </div>
        </div>
      </div>

      <div 
        id="del-backdrop" 
        className={`fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4 transition-opacity duration-200 ${isDeleteModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsDeleteModalOpen(false)}
      >
        <div 
          className={`bg-surface-container-lowest rounded-[20px] border border-outline-variant/30 shadow-2xl w-full max-w-sm p-6 text-center transition-all duration-300 ${isDeleteModalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} 
          onClick={e => e.stopPropagation()}
        >
          <div className="w-14 h-14 rounded-2xl bg-error-container/60 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-error text-[28px]">delete_forever</span>
          </div>
          <h3 className="font-bold text-[17px] text-on-surface mb-1">Delete Coupon?</h3>
          <p className="text-[13px] text-on-surface-variant mb-1">You are about to delete coupon</p>
          <p className="code-mono font-bold text-[14px] text-primary mb-4">{coupons.find(c => c.id === deleteTargetId)?.code}</p>
          <p className="text-[12px] text-on-surface-variant mb-5">This action cannot be undone. All usage history for this coupon will be lost.</p>
          <div className="flex gap-3">
            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 border border-outline-variant/40 text-on-surface text-[13px] font-medium py-2.5 rounded-full hover:bg-surface-container transition-colors">Cancel</button>
            <button onClick={confirmDelete} className="flex-1 bg-error text-on-error text-[13px] font-semibold py-2.5 rounded-full hover:bg-error/90 transition-colors">Delete</button>
          </div>
        </div>
      </div>

      <div id="toast" className={`fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-inverse-surface text-inverse-on-surface text-[13px] font-medium px-5 py-3 rounded-full shadow-lg z-[100] transition-all duration-300 ${toast.show ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <span className="material-symbols-outlined text-[18px]">{toast.icon}</span>
        <span>{toast.msg}</span>
      </div>
    </div>
  );
}
