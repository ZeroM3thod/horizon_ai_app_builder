"use client";

import { useEffect, useState } from "react";
import AdminSidebar, { toggleAdminSidebar, toggleAdminMini } from "@/components/AdminSidebar";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface OrderPayment {
  method: 'bkash' | 'nagad' | 'cod';
  status: 'pending' | 'paid' | 'cod' | 'cancelled';
  txnId: string | null;
  account: string | null;
  amount: number;
}

interface OrderTimeline {
  label: string;
  time: string;
  done: boolean;
}

interface Order {
  id: string;
  ref: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
    avatarColor: string;
  };
  date: string;
  dateShort: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  payment: OrderPayment;
  orderStatus: string;
  address: {
    name: string;
    line: string;
    area: string;
  };
  courier: string | null;
  tracking: string | null;
  notes: string;
  timeline: OrderTimeline[];
}

const INITIAL_ORDERS: Order[] = [
  {
    id:'ORD-3841', ref:'#ORD-3841',
    customer:{ name:'Nusrat Sultana', email:'nusrat@email.com', phone:'01711-234567', avatar:'NS', avatarColor:'bg-secondary-fixed text-on-secondary-container' },
    date:'5 Jun 2025, 10:32 AM', dateShort:'5 Jun 2025',
    items:[
      { name:'Biryani Masala Premium', qty:2, price:199 },
      { name:'Turmeric Powder (200g)', qty:1, price:129 }
    ],
    subtotal:527, discount:27, shipping:0, total:500,
    payment:{ method:'bkash', status:'pending', txnId:'BKH-8A92-XY12', account:'01711-234567', amount:500 },
    orderStatus:'Processing',
    address:{ name:'Nusrat Sultana', line:'House 12, Road 5, Block C', area:'Bashundhara R/A, Dhaka 1229' },
    courier:null, tracking:null,
    notes:'',
    timeline:[
      { label:'Order placed', time:'5 Jun, 10:32 AM', done:true },
      { label:'Payment submitted (bKash)', time:'5 Jun, 10:35 AM', done:true },
      { label:'Payment verified', time:'Pending', done:false },
      { label:'Processing', time:'—', done:false },
      { label:'Delivered', time:'—', done:false }
    ]
  },
  {
    id:'ORD-3840', ref:'#ORD-3840',
    customer:{ name:'Rahim Islam', email:'rahim@email.com', phone:'01822-345678', avatar:'RI', avatarColor:'bg-tertiary-fixed text-on-tertiary-container' },
    date:'5 Jun 2025, 09:15 AM', dateShort:'5 Jun 2025',
    items:[
      { name:'Yellow Moong Dal (1kg)', qty:3, price:149 }
    ],
    subtotal:447, discount:0, shipping:60, total:507,
    payment:{ method:'nagad', status:'pending', txnId:'NGD-5C71-MN88', account:'01822-345678', amount:507 },
    orderStatus:'Pending',
    address:{ name:'Rahim Islam', line:'Flat 3B, Moghbazar Circle', area:'Ramna, Dhaka 1217' },
    courier:null, tracking:null,
    notes:'',
    timeline:[
      { label:'Order placed', time:'5 Jun, 09:15 AM', done:true },
      { label:'Payment submitted (Nagad)', time:'5 Jun, 09:18 AM', done:true },
      { label:'Payment verified', time:'Pending', done:false },
      { label:'Processing', time:'—', done:false },
      { label:'Delivered', time:'—', done:false }
    ]
  },
  {
    id:'ORD-3839', ref:'#ORD-3839',
    customer:{ name:'Fariha Akter', email:'fariha@email.com', phone:'01933-456789', avatar:'FA', avatarColor:'bg-primary-fixed text-on-primary-container' },
    date:'4 Jun 2025, 4:20 PM', dateShort:'4 Jun 2025',
    items:[
      { name:'Green Cardamom Whole (50g)', qty:1, price:349 }
    ],
    subtotal:349, discount:35, shipping:0, total:314,
    payment:{ method:'bkash', status:'paid', txnId:'BKH-2F44-RT93', account:'01933-456789', amount:314 },
    orderStatus:'Shipped',
    address:{ name:'Fariha Akter', line:'House 7, Lane 3, Dhanmondi', area:'Dhaka 1205' },
    courier:'Pathao Courier', tracking:'PTC-8823-FX1',
    notes:'Customer requested gift wrapping.',
    timeline:[
      { label:'Order placed', time:'4 Jun, 4:20 PM', done:true },
      { label:'Payment submitted (bKash)', time:'4 Jun, 4:23 PM', done:true },
      { label:'Payment verified', time:'4 Jun, 5:00 PM', done:true },
      { label:'Processing started', time:'4 Jun, 5:30 PM', done:true },
      { label:'Shipped via Pathao', time:'5 Jun, 10:00 AM', done:true },
      { label:'Delivered', time:'—', done:false }
    ]
  },
  {
    id:'ORD-3838', ref:'#ORD-3838',
    customer:{ name:'Mahfuz Khan', email:'mahfuz@email.com', phone:'01677-567890', avatar:'MK', avatarColor:'bg-surface-container-high text-on-surface-variant' },
    date:'3 Jun 2025, 2:10 PM', dateShort:'3 Jun 2025',
    items:[
      { name:'Mixed Dry Fruits (500g)', qty:1, price:599 },
      { name:'Black Pepper Whole (100g)', qty:2, price:259 }
    ],
    subtotal:1117, discount:111, shipping:0, total:1006,
    payment:{ method:'cod', status:'cod', txnId:null, account:null, amount:1006 },
    orderStatus:'Delivered',
    address:{ name:'Mahfuz Khan', line:'Plot 15, Sector 4', area:'Uttara, Dhaka 1230' },
    courier:'Steadfast Courier', tracking:'SFC-3312-MK7',
    notes:'',
    timeline:[
      { label:'Order placed', time:'3 Jun, 2:10 PM', done:true },
      { label:'Processing started', time:'3 Jun, 3:00 PM', done:true },
      { label:'Shipped via Steadfast', time:'4 Jun, 9:00 AM', done:true },
      { label:'Delivered & Cash Collected', time:'5 Jun, 1:00 PM', done:true }
    ]
  },
  {
    id:'ORD-3837', ref:'#ORD-3837',
    customer:{ name:'Tarek Hossain', email:'tarek@email.com', phone:'01555-678901', avatar:'TH', avatarColor:'bg-tertiary-fixed text-on-tertiary-container' },
    date:'2 Jun 2025, 11:45 AM', dateShort:'2 Jun 2025',
    items:[
      { name:'Kashmiri Chilli Powder (200g)', qty:2, price:179 }
    ],
    subtotal:358, discount:0, shipping:60, total:418,
    payment:{ method:'nagad', status:'paid', txnId:'NGD-9P22-CQ77', account:'01555-678901', amount:418 },
    orderStatus:'Delivered',
    address:{ name:'Tarek Hossain', line:'Apt 6A, Rupayan Housing Estate', area:'Mirpur, Dhaka 1216' },
    courier:'eCourier', tracking:'ECR-4421-TH5',
    notes:'',
    timeline:[
      { label:'Order placed', time:'2 Jun, 11:45 AM', done:true },
      { label:'Payment verified (Nagad)', time:'2 Jun, 12:00 PM', done:true },
      { label:'Processing started', time:'2 Jun, 1:00 PM', done:true },
      { label:'Shipped via eCourier', time:'3 Jun, 10:00 AM', done:true },
      { label:'Delivered', time:'4 Jun, 3:00 PM', done:true }
    ]
  },
  {
    id:'ORD-3836', ref:'#ORD-3836',
    customer:{ name:'Salma Begum', email:'salma@email.com', phone:'01844-789012', avatar:'SB', avatarColor:'bg-secondary-fixed text-on-secondary-container' },
    date:'2 Jun 2025, 08:50 AM', dateShort:'2 Jun 2025',
    items:[
      { name:'Sona Moong Dal (1kg)', qty:2, price:189 },
      { name:'Coriander Seeds (100g)', qty:1, price:99 }
    ],
    subtotal:477, discount:48, shipping:0, total:429,
    payment:{ method:'bkash', status:'pending', txnId:'BKH-7R11-QS42', account:'01844-789012', amount:429 },
    orderStatus:'Pending',
    address:{ name:'Salma Begum', line:'House 22, Sobhanbag Lane', area:'Mohammadpur, Dhaka 1207' },
    courier:null, tracking:null,
    notes:'Repeat customer — VIP',
    timeline:[
      { label:'Order placed', time:'2 Jun, 08:50 AM', done:true },
      { label:'Payment submitted (bKash)', time:'2 Jun, 08:55 AM', done:true },
      { label:'Payment verified', time:'Pending', done:false },
      { label:'Processing', time:'—', done:false },
      { label:'Delivered', time:'—', done:false }
    ]
  },
  {
    id:'ORD-3835', ref:'#ORD-3835',
    customer:{ name:'Karim Rahman', email:'karim@email.com', phone:'01966-890123', avatar:'KR', avatarColor:'bg-primary-fixed-dim text-on-primary-container' },
    date:'1 Jun 2025, 3:30 PM', dateShort:'1 Jun 2025',
    items:[
      { name:'Whole Cumin Seeds (200g)', qty:1, price:159 }
    ],
    subtotal:159, discount:0, shipping:60, total:219,
    payment:{ method:'cod', status:'cancelled', txnId:null, account:null, amount:219 },
    orderStatus:'Cancelled',
    address:{ name:'Karim Rahman', line:'Village: Char Bhairabi, Post: Hatia', area:'Noakhali 3800' },
    courier:null, tracking:null,
    notes:'Customer requested cancellation — out of area.',
    timeline:[
      { label:'Order placed', time:'1 Jun, 3:30 PM', done:true },
      { label:'Cancelled by customer', time:'1 Jun, 4:00 PM', done:true }
    ]
  }
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentSearch, setCurrentSearch] = useState('');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: '', show: false });
  const [currentDate, setCurrentDate] = useState("");

  const activeOrder = orders.find(o => o.id === activeOrderId);

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
  }, []);

  const showToast = (msg: string) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast({ msg: '', show: false }), 2500);
  };

  const filteredOrders = orders.filter(o => {
    const matchesFilter = (() => {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'pending') return o.orderStatus === 'Pending';
      if (currentFilter === 'processing') return o.orderStatus === 'Processing';
      if (currentFilter === 'shipped') return o.orderStatus === 'Shipped';
      if (currentFilter === 'delivered') return o.orderStatus === 'Delivered';
      if (currentFilter === 'cancelled') return o.orderStatus === 'Cancelled';
      if (currentFilter === 'pay-pending') return o.payment.status === 'pending';
      return true;
    })();
    const q = currentSearch.toLowerCase();
    const matchesSearch = !q ||
      o.id.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.email.toLowerCase().includes(q) ||
      o.customer.phone.includes(q) ||
      o.items.some(i => i.name.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  const payMethodBadge = (method: string) => {
    if (method === 'bkash') return <span className="pay-bkash text-[10px] font-bold px-2 py-0.5 rounded-full">bKash</span>;
    if (method === 'nagad') return <span className="pay-nagad text-[10px] font-bold px-2 py-0.5 rounded-full">Nagad</span>;
    return <span className="pay-cod text-[10px] font-bold px-2 py-0.5 rounded-full">COD</span>;
  };

  const payStatusBadge = (method: string, status: string) => {
    if (status === 'paid') return <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-0.5 rounded-full">Paid ✓</span>;
    if (status === 'pending') return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full badge-pulse" style={{ background: '#fce4ee', color: '#c2185b' }}>⚠ Verify</span>;
    if (status === 'cod') return <span className="bg-surface-container-high text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-full">COD</span>;
    if (status === 'cancelled') return <span className="bg-error-container text-error text-[10px] font-bold px-2 py-0.5 rounded-full">Cancelled</span>;
    return null;
  };

  const orderStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      'Pending': 'bg-primary-fixed text-on-primary-container',
      'Processing': 'bg-tertiary-fixed text-on-tertiary-container',
      'Shipped': 'bg-primary-fixed-dim text-on-primary-container',
      'Delivered': 'bg-secondary-container text-on-secondary-container',
      'Cancelled': 'bg-error-container text-error'
    };
    const cls = map[status] || 'bg-surface-container text-on-surface-variant';
    return <span className={`${cls} text-[10px] font-bold px-2.5 py-1 rounded-full`}>{status}</span>;
  };

  const handleOpenDrawer = (orderId: string) => {
    setActiveOrderId(orderId);
    setIsDrawerOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    document.body.style.overflow = '';
  };

  const handleStatusChange = (newStatus: string) => {
    if (!activeOrderId) return;
    setOrders(prev => prev.map(o => o.id === activeOrderId ? { ...o, orderStatus: newStatus } : o));
  };

  const saveStatus = () => {
    if (!activeOrder) return;
    const courier = (document.getElementById('courier-input') as HTMLInputElement)?.value;
    const tracking = (document.getElementById('tracking-input') as HTMLInputElement)?.value;
    
    setOrders(prev => prev.map(o => {
      if (o.id === activeOrder.id) {
        return {
          ...o,
          courier: courier || o.courier,
          tracking: tracking || o.tracking
        };
      }
      return o;
    }));
    showToast(`Order ${activeOrder.ref} status updated`);
  };

  const confirmCOD = () => {
    if (!activeOrderId) return;
    setOrders(prev => prev.map(o => o.id === activeOrderId ? { ...o, orderStatus: 'Delivered' } : o));
    showToast(`COD collected for ${activeOrder?.ref}`);
  };

  const confirmPayment = () => {
    if (!activeOrderId) return;
    setOrders(prev => prev.map(o => o.id === activeOrderId ? { ...o, payment: { ...o.payment, status: 'paid' } } : o));
    setIsPayModalOpen(false);
    showToast(`✓ Payment verified for ${activeOrder?.ref}`);
  };

  const saveNote = () => {
    const notes = (document.getElementById('drawer-notes') as HTMLTextAreaElement)?.value;
    if (!activeOrderId) return;
    setOrders(prev => prev.map(o => o.id === activeOrderId ? { ...o, notes } : o));
    showToast('Note saved');
  };

  const stats = {
    all: orders.length,
    pending: orders.filter(o => o.orderStatus === 'Pending').length,
    processing: orders.filter(o => o.orderStatus === 'Processing').length,
    delivered: orders.filter(o => o.orderStatus === 'Delivered').length,
    payPending: orders.filter(o => o.payment.status === 'pending').length
  };

  return (
    <div className="bg-background text-on-background font-sans antialiased overflow-x-hidden min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; font-size: 24px; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; white-space: nowrap; word-wrap: normal; direction: ltr; -webkit-font-smoothing: antialiased; }
        .stat-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(159,65,34,0.10); }
        .trow { transition: background 0.15s; cursor: pointer; }
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
        .drawer-panel { transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1); transform: translateX(100%); }
        .drawer-panel.open { transform: translateX(0); }
        .drawer-overlay { transition: opacity 0.3s ease; }
        .modal-wrap { transition: opacity 0.25s ease; opacity: 0; pointer-events: none; }
        .modal-wrap.open { opacity: 1; pointer-events: auto; }
        .modal-card { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease; transform: scale(0.92); opacity: 0; }
        .modal-wrap.open .modal-card { transform: scale(1); opacity: 1; }
        #toast { position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: #1d1c15; color: #fff9ee; padding: 11px 22px; border-radius: 9999px; font-size: 13px; font-weight: 500; z-index: 9999; box-shadow: 0 8px 24px rgba(0,0,0,0.18); transition: opacity 0.3s; opacity: 0; white-space: nowrap; pointer-events: none; }
        @media (min-width: 1024px) { #toast { bottom: 28px; } }
        .filter-tab { transition: all 0.18s; }
        .filter-tab.active { background: #9f4122; color: #fff; font-weight: 700; box-shadow: 0 4px 12px rgba(159,65,34,0.25); }
        .pay-bkash { background:#fce4ee; color:#c2185b; border:1px solid #f8bbd0; }
        .pay-nagad  { background:#fff3e0; color:#e65100; border:1px solid #ffe0b2; }
        .pay-cod    { background:#f3f4f6; color:#374151; border:1px solid #e5e7eb; }
        .verify-bkash { background: linear-gradient(135deg, #fce4ee 0%, #fff0f5 100%); border-color: #f48fb1; }
        .verify-nagad  { background: linear-gradient(135deg, #fff3e0 0%, #fffde7 100%); border-color: #ffcc80; }
        @keyframes slideIn { from{opacity:0;transform:translateX(18px)} to{opacity:1;transform:none} }
        .slide-in { animation: slideIn 0.3s ease both; }
        .status-select { appearance: none; -webkit-appearance: none; }
      ` }} />

      <AdminSidebar pendingProducts={48} pendingUsers={1200} pendingOrders={stats.payPending} />

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
              <a href="/admin" className="text-on-surface-variant hover:text-primary transition-colors">Admin</a>
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant">chevron_right</span>
              <span className="text-on-surface font-semibold">Orders</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 bg-surface-container rounded-full px-4 py-2 border border-outline-variant/30 w-48 xl:w-64">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
              <input 
                type="text" 
                placeholder="Search orders..." 
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

        <main className="flex-1 p-4 md:p-6 xl:p-8 pb-24 lg:pb-8 overflow-y-auto">
          <div className="fade-up flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-[22px] md:text-[28px] font-extrabold text-on-surface tracking-tight">Orders</h1>
              <p className="text-[13px] text-on-surface-variant mt-0.5">
                3,841 total orders · <span className="text-primary font-semibold">{stats.payPending} pending payment verification</span>
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => showToast('Orders exported to CSV')} className="flex items-center gap-2 border border-outline-variant/40 text-on-surface-variant text-[13px] font-medium px-4 py-2 rounded-full hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span className="hidden sm:inline">Export CSV</span>
              </button>
              <button className="flex items-center gap-2 bg-primary text-on-primary text-[13px] font-medium px-4 py-2 rounded-full hover:bg-primary/90 transition-colors shadow-md">
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span className="hidden sm:inline">New Order</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5 fade-up fade-up-1">
            <div className="stat-card bg-surface-container-lowest border border-outline-variant/30 rounded-[18px] p-4 text-center cursor-pointer" onClick={() => setCurrentFilter('all')}>
              <div className="text-[22px] font-extrabold text-on-surface">{stats.all}</div>
              <div className="text-[11px] text-on-surface-variant">All Orders</div>
            </div>
            <div className="stat-card bg-surface-container-lowest border border-outline-variant/30 rounded-[18px] p-4 text-center cursor-pointer" onClick={() => setCurrentFilter('pending')}>
              <div className="text-[22px] font-extrabold text-primary">{stats.pending}</div>
              <div className="text-[11px] text-on-surface-variant">Pending</div>
            </div>
            <div className="stat-card bg-surface-container-lowest border border-outline-variant/30 rounded-[18px] p-4 text-center cursor-pointer" onClick={() => setCurrentFilter('processing')}>
              <div className="text-[22px] font-extrabold text-tertiary">{stats.processing}</div>
              <div className="text-[11px] text-on-surface-variant">Processing</div>
            </div>
            <div className="stat-card bg-surface-container-lowest border border-outline-variant/30 rounded-[18px] p-4 text-center cursor-pointer" onClick={() => setCurrentFilter('delivered')}>
              <div className="text-[22px] font-extrabold text-secondary">{stats.delivered}</div>
              <div className="text-[11px] text-on-surface-variant">Delivered</div>
            </div>
            <div className="stat-card bg-surface-container-lowest border border-outline-variant/30 rounded-[18px] p-4 text-center cursor-pointer col-span-2 md:col-span-1" onClick={() => setCurrentFilter('pay-pending')}>
              <div className="text-[22px] font-extrabold" style={{ color: '#c2185b' }}>{stats.payPending}</div>
              <div className="text-[11px] text-on-surface-variant">Verify Payment</div>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-4 mb-4 fade-up fade-up-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(f => (
                  <button 
                    key={f}
                    className={`filter-tab text-[12px] font-semibold px-3.5 py-1.5 rounded-full border border-outline-variant/30 text-on-surface-variant ${currentFilter === f ? 'active' : ''}`} 
                    onClick={() => setCurrentFilter(f)}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
                <button 
                  className={`filter-tab text-[12px] font-semibold px-3.5 py-1.5 rounded-full border border-outline-variant/30 text-on-surface-variant ${currentFilter === 'pay-pending' ? 'active' : ''}`} 
                  style={{ borderColor: '#f48fb1', color: '#c2185b' }}
                  onClick={() => setCurrentFilter('pay-pending')}
                >
                  ⚠ Verify Payment
                </button>
              </div>
              <div className="flex md:hidden items-center gap-2 bg-surface-container rounded-full px-3 py-2 border border-outline-variant/30 w-full">
                <span className="material-symbols-outlined text-on-surface-variant text-[16px]">search</span>
                <input 
                  type="text" 
                  placeholder="Search orders..." 
                  value={currentSearch}
                  onChange={(e) => setCurrentSearch(e.target.value)}
                  className="bg-transparent text-[12px] text-on-surface placeholder:text-outline border-none focus:ring-0 w-full p-0"
                />
              </div>
            </div>
          </div>

          <div className="hidden md:block bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] shadow-sm overflow-hidden fade-up fade-up-3">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px] min-w-[780px]">
                <thead>
                  <tr className="bg-surface-container-low">
                    <th className="text-left text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider px-5 py-3">Order</th>
                    <th className="text-left text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider px-3 py-3">Customer</th>
                    <th className="text-left text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider px-3 py-3">Items</th>
                    <th className="text-left text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider px-3 py-3">Amount</th>
                    <th className="text-left text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider px-3 py-3">Payment</th>
                    <th className="text-left text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider px-3 py-3">Order Status</th>
                    <th className="text-left text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider px-3 py-3">Date</th>
                    <th className="px-3 py-3 text-right text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15">
                  {filteredOrders.map(o => (
                    <tr key={o.id} className="trow" onClick={() => handleOpenDrawer(o.id)}>
                      <td className="px-5 py-3.5">
                        <div className="font-mono text-[12px] text-on-surface-variant font-semibold">{o.ref}</div>
                        <div className="text-[10px] text-outline mt-0.5">{o.dateShort}</div>
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full ${o.customer.avatarColor} flex items-center justify-center text-[10px] font-bold shrink-0`}>{o.customer.avatar}</div>
                          <div>
                            <div className="font-medium text-on-surface text-[13px]">{o.customer.name}</div>
                            <div className="text-[10px] text-on-surface-variant">{o.customer.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-on-surface-variant text-[12px]">
                        {o.items.length === 1
                          ? `${o.items[0].name.substring(0, 28)}${o.items[0].name.length > 28 ? '…' : ''} ×${o.items[0].qty}`
                          : `${o.items[0].name.substring(0, 22)}… +${o.items.length - 1} more`}
                      </td>
                      <td className="px-3 py-3.5 font-bold text-on-surface text-[13px]">৳{o.total}</td>
                      <td className="px-3 py-3.5">
                        <div className="flex flex-col gap-1">
                          {payMethodBadge(o.payment.method)}
                          {payStatusBadge(o.payment.method, o.payment.status)}
                        </div>
                      </td>
                      <td className="px-3 py-3.5">{orderStatusBadge(o.orderStatus)}</td>
                      <td className="px-3 py-3.5 text-[11px] text-on-surface-variant whitespace-nowrap">{o.date.split(',')[0]}</td>
                      <td className="px-3 py-3.5 text-right">
                        <button className="text-[12px] font-semibold text-primary hover:text-on-primary hover:bg-primary px-3 py-1.5 rounded-full border border-primary/30 hover:border-transparent transition-all">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredOrders.length === 0 && (
              <div className="py-16 text-center">
                <span className="material-symbols-outlined text-[48px] text-outline/50">receipt_long</span>
                <p className="text-[15px] font-semibold text-on-surface mt-3">No orders found</p>
                <p className="text-[13px] text-on-surface-variant mt-1">Try a different filter or search query</p>
              </div>
            )}
          </div>

          <div className="md:hidden space-y-3 fade-up fade-up-3">
            {filteredOrders.map(o => (
              <div key={o.id} className="order-card bg-surface-container-lowest border border-outline-variant/30 rounded-[18px] p-4 cursor-pointer shadow-sm" onClick={() => handleOpenDrawer(o.id)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-full ${o.customer.avatarColor} flex items-center justify-center text-[11px] font-bold shrink-0`}>{o.customer.avatar}</div>
                    <div>
                      <div className="font-semibold text-[14px] text-on-surface">{o.customer.name}</div>
                      <div className="font-mono text-[11px] text-on-surface-variant">{o.ref}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {orderStatusBadge(o.orderStatus)}
                    <span className="font-bold text-[15px] text-on-surface">৳{o.total}</span>
                  </div>
                </div>
                <div className="text-[12px] text-on-surface-variant mb-3">
                  {o.items.map(i => `${i.name.substring(0, 30)} ×${i.qty}`).join(' · ')}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {payMethodBadge(o.payment.method)}
                    {payStatusBadge(o.payment.method, o.payment.status)}
                  </div>
                  <span className="text-[11px] text-on-surface-variant">{o.dateShort}</span>
                </div>
              </div>
            ))}
            {filteredOrders.length === 0 && (
              <div className="py-16 text-center bg-surface-container-lowest border border-outline-variant/30 rounded-[20px]">
                <span className="material-symbols-outlined text-[48px] text-outline/50">receipt_long</span>
                <p className="text-[15px] font-semibold text-on-surface mt-3">No orders found</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <div 
        className={`drawer-overlay fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={handleCloseDrawer} 
      />

      <div className={`drawer-panel fixed right-0 top-0 h-full w-full sm:w-[520px] xl:w-[600px] bg-surface-container-lowest z-50 flex flex-col shadow-2xl border-l border-outline-variant/30 ${isDrawerOpen ? 'open' : ''}`}>
        {activeOrder && (
          <>
            <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20 shrink-0 bg-surface-container-lowest">
              <div className="flex items-center gap-3">
                <button onClick={handleCloseDrawer} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
                <div>
                  <div className="font-bold text-[15px] text-on-surface">{activeOrder.ref}</div>
                  <div className="text-[11px] text-on-surface-variant">{activeOrder.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {orderStatusBadge(activeOrder.orderStatus)}
                <button onClick={() => window.print()} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant" title="Print">
                  <span className="material-symbols-outlined text-[18px]">print</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {(activeOrder.payment.method === 'bkash' || activeOrder.payment.method === 'nagad') && (
                <div className={`mx-4 mt-4 rounded-[16px] border p-4 slide-in ${activeOrder.payment.method === 'bkash' ? 'verify-bkash' : 'verify-nagad'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 text-white`} style={{ backgroundColor: activeOrder.payment.method === 'bkash' ? '#E2136E' : '#F47B20' }}>
                          {activeOrder.payment.method === 'bkash' ? 'bK' : 'NG'}
                        </div>
                        <div>
                          <div className="font-bold text-[14px]">{activeOrder.payment.method === 'bkash' ? 'bKash Payment' : 'Nagad Payment'}</div>
                          <div className="text-[11px] text-on-surface-variant">Submitted by customer</div>
                        </div>
                      </div>
                    </div>
                    {payStatusBadge(activeOrder.payment.method, activeOrder.payment.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 mb-3">
                    <div className="bg-white/60 rounded-[10px] px-3 py-2.5 border border-white/80">
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold mb-0.5">Transaction ID</div>
                      <div className="font-mono font-bold text-[13px] text-on-surface flex items-center gap-1.5">
                        <span>{activeOrder.payment.txnId}</span>
                        <button onClick={() => { navigator.clipboard.writeText(activeOrder.payment.txnId!); showToast('Transaction ID copied!'); }} className="text-[10px] text-primary hover:underline">Copy</button>
                      </div>
                    </div>
                    <div className="bg-white/60 rounded-[10px] px-3 py-2.5 border border-white/80">
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold mb-0.5">Amount</div>
                      <div className="font-bold text-[15px] text-on-surface">৳{activeOrder.payment.amount}</div>
                    </div>
                    <div className="bg-white/60 rounded-[10px] px-3 py-2.5 border border-white/80 col-span-2">
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold mb-0.5">Sender Number</div>
                      <div className="font-mono font-medium text-[13px] text-on-surface">{activeOrder.payment.account}</div>
                    </div>
                  </div>

                  {activeOrder.payment.status === 'paid' ? (
                    <div className="flex items-center gap-2 bg-white/60 rounded-[10px] px-3 py-2.5 border border-secondary/30">
                      <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                      <span className="text-[13px] font-semibold text-secondary">Payment verified & marked as Paid</span>
                    </div>
                  ) : (
                    <button onClick={() => setIsPayModalOpen(true)} className="w-full py-2.5 rounded-full font-bold text-[13px] text-white transition-all hover:opacity-90 active:scale-95 shadow-md bg-primary">
                      <span className="material-symbols-outlined text-[16px] align-middle mr-1">verified</span>
                      Verify & Mark as Paid
                    </button>
                  )}
                </div>
              )}

              {activeOrder.payment.method === 'cod' && (
                <div className="mx-4 mt-4 bg-surface-container rounded-[16px] border border-outline-variant/30 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-on-surface-variant text-[18px]">payments</span>
                    </div>
                    <div>
                      <div className="font-bold text-[14px] text-on-surface">Cash on Delivery</div>
                      <div className="text-[12px] text-on-surface-variant">Collect ৳<span>{activeOrder.total}</span> upon delivery</div>
                    </div>
                    <div className="ml-auto">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${activeOrder.orderStatus === 'Delivered' ? 'bg-secondary-container text-on-secondary-container' : activeOrder.orderStatus === 'Cancelled' ? 'bg-error-container text-error' : 'bg-surface-container-high text-on-surface-variant'}`}>
                        {activeOrder.orderStatus === 'Delivered' ? '✓ Delivered' : activeOrder.orderStatus === 'Cancelled' ? 'Cancelled' : 'COD'}
                      </span>
                    </div>
                  </div>
                  {activeOrder.orderStatus === 'Shipped' && (
                    <div className="mt-3 pt-3 border-t border-outline-variant/20">
                      <button onClick={confirmCOD} className="w-full py-2 rounded-full bg-secondary text-on-secondary font-bold text-[13px] hover:bg-secondary/90 transition-colors">
                        <span className="material-symbols-outlined text-[16px] align-middle mr-1">check_circle</span>
                        Confirm Cash Received
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="px-4 pt-4 pb-3">
                <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2.5">Customer</div>
                <div className="flex items-start gap-3 bg-surface-container rounded-[14px] p-3.5 border border-outline-variant/20">
                  <div className={`w-10 h-10 rounded-full ${activeOrder.customer.avatarColor} flex items-center justify-center font-bold text-[13px] shrink-0`}>{activeOrder.customer.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[14px] text-on-surface">{activeOrder.customer.name}</div>
                    <div className="text-[12px] text-on-surface-variant">{activeOrder.customer.email}</div>
                    <div className="text-[12px] text-on-surface-variant font-mono mt-0.5">{activeOrder.customer.phone}</div>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <a href={`mailto:${activeOrder.customer.email}`} className="text-[11px] text-primary font-medium hover:underline flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">mail</span>Email
                    </a>
                    <a href={`tel:${activeOrder.customer.phone}`} className="text-[11px] text-primary font-medium hover:underline flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">call</span>Call
                    </a>
                  </div>
                </div>
              </div>

              <div className="px-4 pb-3">
                <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2.5">Ordered Items</div>
                <div className="bg-surface-container rounded-[14px] border border-outline-variant/20 overflow-hidden">
                  <div className="divide-y divide-outline-variant/15">
                    {activeOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 px-4 py-3">
                        <div className="w-8 h-8 rounded-[8px] bg-primary-fixed/40 flex items-center justify-center shrink-0 text-[11px] font-bold text-on-primary-container">{item.name[0]}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-medium text-on-surface truncate">{item.name}</div>
                          <div className="text-[11px] text-on-surface-variant">Qty: {item.qty} × ৳{item.price}</div>
                        </div>
                        <div className="font-semibold text-[13px] text-on-surface shrink-0">৳{item.qty * item.price}</div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 bg-surface-container-low space-y-1.5">
                    <div className="flex justify-between text-[12px] text-on-surface-variant">
                      <span>Subtotal</span><span className="font-medium text-on-surface">৳{activeOrder.subtotal}</span>
                    </div>
                    {activeOrder.discount > 0 && (
                      <div className="flex justify-between text-[12px] text-on-surface-variant">
                        <span>Discount</span><span className="font-medium text-secondary">−৳{activeOrder.discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[12px] text-on-surface-variant">
                      <span>Shipping</span><span className="font-medium text-on-surface">{activeOrder.shipping > 0 ? `৳${activeOrder.shipping}` : 'FREE'}</span>
                    </div>
                    <div className="h-px bg-outline-variant/20"></div>
                    <div className="flex justify-between text-[14px] font-bold text-on-surface">
                      <span>Total</span><span>৳{activeOrder.total}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 pb-3">
                <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2.5">Delivery Address</div>
                <div className="flex items-start gap-3 bg-surface-container rounded-[14px] p-3.5 border border-outline-variant/20">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px] shrink-0 mt-0.5">location_on</span>
                  <div>
                    <div className="font-semibold text-[13px] text-on-surface">{activeOrder.address.name}</div>
                    <div className="text-[12px] text-on-surface-variant mt-0.5">{activeOrder.address.line}</div>
                    <div className="text-[12px] text-on-surface-variant">{activeOrder.address.area}</div>
                  </div>
                </div>
              </div>

              <div className="px-4 pb-3">
                <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2.5">Update Order Status</div>
                <div className="bg-surface-container rounded-[14px] border border-outline-variant/20 p-3.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[160px]">
                      <select 
                        id="drawer-status-select" 
                        value={activeOrder.orderStatus}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="status-select w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2 text-[13px] text-on-surface font-medium pr-8 focus:ring-primary focus:border-primary cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
                    </div>
                    <button onClick={saveStatus} className="flex items-center gap-1.5 bg-primary text-on-primary text-[12px] font-semibold px-4 py-2 rounded-full hover:bg-primary/90 transition-colors shrink-0">
                      <span className="material-symbols-outlined text-[15px]">save</span>Save
                    </button>
                  </div>
                  {(activeOrder.orderStatus === 'Processing' || activeOrder.orderStatus === 'Shipped') && (
                    <div className="mt-3 pt-3 border-t border-outline-variant/15 flex flex-col gap-2">
                      <label className="text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider">Courier & Tracking</label>
                      <div className="flex gap-2">
                        <input id="courier-input" type="text" placeholder="Courier name" defaultValue={activeOrder.courier || ''} className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-full px-3 py-1.5 text-[12px] text-on-surface focus:ring-primary focus:border-primary"/>
                        <input id="tracking-input" type="text" placeholder="Tracking number" defaultValue={activeOrder.tracking || ''} className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-full px-3 py-1.5 text-[12px] text-on-surface focus:ring-primary focus:border-primary font-mono"/>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {activeOrder.courier && (
                <div className="px-4 pb-3">
                  <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2.5">Shipment Tracking</div>
                  <div className="flex items-center gap-3 bg-surface-container rounded-[14px] p-3.5 border border-outline-variant/20">
                    <div className="w-9 h-9 rounded-full bg-tertiary-fixed flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-tertiary text-[18px]">local_shipping</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-[13px] text-on-surface">{activeOrder.courier}</div>
                      <div className="text-[11px] text-on-surface-variant font-mono mt-0.5">{activeOrder.tracking}</div>
                    </div>
                    <button onClick={() => { navigator.clipboard.writeText(activeOrder.tracking!); showToast('Tracking number copied!'); }} className="text-[11px] text-primary font-semibold border border-primary/30 rounded-full px-3 py-1 hover:bg-primary/8 bg-surface transition-colors">Copy</button>
                  </div>
                </div>
              )}

              <div className="px-4 pb-3">
                <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2.5">Order Timeline</div>
                <div className="relative pl-5 space-y-0">
                  {activeOrder.timeline.map((step, i) => (
                    <div key={i} className="relative flex gap-3 pb-4">
                      <div className="flex flex-col items-center shrink-0">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 z-10 ${step.done ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high border-2 border-outline-variant/40'}`}>
                          {step.done ? <span className="material-symbols-outlined text-[12px]">check</span> : <div className="w-2 h-2 rounded-full bg-outline-variant/60"></div>}
                        </div>
                        {i < activeOrder.timeline.length - 1 && (
                          <div className={`w-0.5 flex-1 mt-1 ${step.done ? 'bg-secondary/30' : 'bg-outline-variant/25'}`}></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pb-1">
                        <div className="text-[13px] font-medium text-on-surface">{step.label}</div>
                        <div className="text-[11px] text-on-surface-variant mt-0.5">{step.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-4 pb-6">
                <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2.5">Internal Notes</div>
                <div className="bg-surface-container rounded-[14px] border border-outline-variant/20 p-3.5">
                  <textarea id="drawer-notes" rows={2} placeholder="Add internal note (only visible to admins)..." defaultValue={activeOrder.notes} className="w-full bg-transparent text-[13px] text-on-surface placeholder:text-outline border-none focus:ring-0 resize-none"></textarea>
                  <div className="flex justify-end mt-2 pt-2 border-t border-outline-variant/15">
                    <button onClick={saveNote} className="text-[12px] font-semibold text-primary hover:underline flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">save</span>Save Note
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-outline-variant/20 px-4 py-3 bg-surface-container-lowest flex items-center gap-2">
              <button onClick={handleCloseDrawer} className="flex-1 border border-outline-variant/40 text-on-surface-variant text-[13px] font-medium py-2.5 rounded-full hover:bg-surface-container transition-colors">
                Close
              </button>
              <button onClick={() => showToast(`Invoice for ${activeOrder.ref} downloaded`)} className="flex items-center gap-1.5 border border-primary/30 text-primary text-[13px] font-semibold px-4 py-2.5 rounded-full hover:bg-primary-fixed transition-colors">
                <span className="material-symbols-outlined text-[15px]">download</span>Invoice
              </button>
            </div>
          </>
        )}
      </div>

      <div className={`modal-wrap fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 ${isPayModalOpen ? 'open' : ''}`} onClick={() => setIsPayModalOpen(false)}>
        <div className="modal-card bg-surface-container-lowest rounded-[24px] w-full max-w-[420px] shadow-2xl border border-outline-variant/30 overflow-hidden" onClick={(e) => e.stopPropagation()}>
          {activeOrder && (
            <>
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 text-white" style={{ backgroundColor: activeOrder.payment.method === 'bkash' ? '#E2136E' : '#F47B20' }}>
                    {activeOrder.payment.method === 'bkash' ? 'bK' : 'NG'}
                  </div>
                  <div>
                    <div className="font-bold text-[16px] text-on-surface">Confirm Payment Verification</div>
                    <div className="text-[12px] text-on-surface-variant">{activeOrder.ref}</div>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-2">
                <div className={`rounded-[14px] border p-4 mb-4 ${activeOrder.payment.method === 'bkash' ? 'verify-bkash' : 'verify-nagad'}`}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] text-on-surface-variant">Method</span>
                      <span className="font-bold text-[13px] text-on-surface">{activeOrder.payment.method === 'bkash' ? 'bKash' : 'Nagad'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] text-on-surface-variant">Transaction ID</span>
                      <span className="font-mono font-bold text-[13px] text-on-surface">{activeOrder.payment.txnId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] text-on-surface-variant">Sender Number</span>
                      <span className="font-mono text-[13px] text-on-surface">{activeOrder.payment.account}</span>
                    </div>
                    <div className="h-px bg-outline-variant/20"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] font-semibold text-on-surface">Amount to Verify</span>
                      <span className="font-extrabold text-[18px] text-on-surface">৳{activeOrder.payment.amount}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-surface-container rounded-[10px] px-3 py-2.5 mb-4">
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant shrink-0 mt-0.5">info</span>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">Please verify the transaction ID in your <strong className="text-on-surface">{activeOrder.payment.method === 'bkash' ? 'bKash' : 'Nagad'}</strong> merchant account before confirming. This action cannot be undone.</p>
                </div>
              </div>
              <div className="px-6 pb-6 flex gap-3">
                <button onClick={() => setIsPayModalOpen(false)} className="flex-1 border border-outline-variant/40 text-on-surface-variant text-[13px] font-medium py-3 rounded-full hover:bg-surface-container transition-colors">
                  Cancel
                </button>
                <button onClick={confirmPayment} className="flex-1 text-white text-[13px] font-bold py-3 rounded-full hover:opacity-90 transition-all active:scale-95 shadow-md flex items-center justify-center gap-1.5 bg-primary">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  Verify & Confirm Paid
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/20 flex items-center justify-around px-2 py-2 z-30 lg:hidden">
        <a href="/admin" className="mobile-nav-btn flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined text-[22px]">dashboard</span>
          <span className="text-[9px] font-semibold">Home</span>
        </a>
        <a href="/admin/products" className="mobile-nav-btn flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined text-[22px]">inventory_2</span>
          <span className="text-[9px] font-semibold">Products</span>
        </a>
        <button className="mobile-nav-btn flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors text-primary">
          <span className="material-symbols-outlined text-[22px]">receipt_long</span>
          <span className="text-[9px] font-semibold">Orders</span>
        </button>
        <a href="/admin/users" className="mobile-nav-btn flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined text-[22px]">group</span>
          <span className="text-[9px] font-semibold">Users</span>
        </a>
        <button onClick={toggleAdminSidebar} className="mobile-nav-btn flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined text-[22px]">menu</span>
          <span className="text-[9px] font-semibold">More</span>
        </button>
      </nav>

      <div id="toast" style={{ opacity: toast.show ? 1 : 0 }}>{toast.msg}</div>
    </div>
  );
}
