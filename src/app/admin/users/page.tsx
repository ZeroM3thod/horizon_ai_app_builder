"use client";

import { useEffect, useState } from "react";
import AdminSidebar, { toggleAdminSidebar, toggleAdminMini } from "@/components/AdminSidebar";

/* ══════════════════════════════════════════════
   TYPES & INTERFACES
══════════════════════════════════════════════ */

interface Product {
  id: string;
  name: string;
  cat: string;
  emoji: string;
  price: number;
}

interface OrderItem extends Product {
  qty: number;
}

interface Order {
  oid: string;
  date: string;
  status: 'delivered' | 'processing' | 'cancelled';
  items: OrderItem[];
  total: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'staff' | 'customer';
  status: 'active' | 'suspended' | 'pending';
  tier: 'gold' | 'platinum' | 'standard';
  points: number;
  orders: number;
  joined: string;
  addr: string;
  initials: string;
  g: number;
  lastLogin: string;
  device: string;
  note: string;
}

/* ══════════════════════════════════════════════
   STATIC DATA
══════════════════════════════════════════════ */

const PRODUCTS: Product[] = [
  {id:'P01',name:'Pure Turmeric Powder 200g',cat:'Spices',emoji:'🌿',price:320},
  {id:'P02',name:'Cumin Seeds Premium 100g',cat:'Spices',emoji:'🌾',price:210},
  {id:'P03',name:'Red Chilli Powder 500g',cat:'Spices',emoji:'🌶️',price:480},
  {id:'P04',name:'Coriander Powder 200g',cat:'Spices',emoji:'🍃',price:280},
  {id:'P05',name:'Garam Masala Blend 100g',cat:'Masalas',emoji:'🫙',price:390},
  {id:'P06',name:'Black Pepper Whole 100g',cat:'Spices',emoji:'⚫',price:450},
  {id:'P07',name:'Cardamom Green 50g',cat:'Spices',emoji:'🌱',price:580},
  {id:'P08',name:'Bay Leaves 50g',cat:'Spices',emoji:'🍂',price:150},
  {id:'P09',name:'Fenugreek Seeds 200g',cat:'Spices',emoji:'🌰',price:180},
  {id:'P10',name:'Dried Mango Powder 100g',cat:'Spices',emoji:'🥭',price:260},
  {id:'P11',name:'Cashew Nuts Premium 250g',cat:'Dry Fruits',emoji:'🥜',price:1200},
  {id:'P12',name:'Almonds Whole 500g',cat:'Dry Fruits',emoji:'🌰',price:1850},
  {id:'P13',name:'Masoor Dal Red 1kg',cat:'Pulses',emoji:'🫘',price:280},
  {id:'P14',name:'Chickpeas Kabuli 500g',cat:'Pulses',emoji:'🟡',price:320},
  {id:'P15',name:'Biriyani Spice Mix 100g',cat:'Masalas',emoji:'🍛',price:350},
  {id:'P16',name:'Kashmiri Chilli 100g',cat:'Spices',emoji:'🔴',price:420},
  {id:'P17',name:'Mustard Seeds Black 200g',cat:'Spices',emoji:'⚪',price:160},
  {id:'P18',name:'Star Anise 50g',cat:'Spices',emoji:'⭐',price:340},
  {id:'P19',name:'Raisins Golden 200g',cat:'Dry Fruits',emoji:'🍇',price:480},
  {id:'P20',name:'Sesame Seeds White 200g',cat:'Seeds',emoji:'🌟',price:220},
];

const INITIAL_USERS: User[] = [
  {id:1, name:'Raqib Karim',     email:'raqib.karim@email.com',   phone:'+880 1711-111111',role:'customer',status:'active',   tier:'gold',    points:2450, orders:24,joined:'14 Mar 2023',addr:'Gulshan, Dhaka',         initials:'RK',g:0,lastLogin:'2 Jun 2026, 10:14 AM',device:'iPhone 15 · iOS',note:''},
  {id:2, name:'Sumaiya Akter',   email:'sumaiya@email.com',        phone:'+880 1722-222222',role:'customer',status:'active',   tier:'platinum',points:5820, orders:38,joined:'22 Jan 2023',addr:'Dhanmondi, Dhaka',       initials:'SA',g:1,lastLogin:'4 Jun 2026, 08:42 AM',device:'Samsung S23 · Android',note:''},
  {id:3, name:'Mahbub Hossain',  email:'mahbub.h@email.com',       phone:'+880 1733-333333',role:'staff',  status:'active',   tier:'standard',points:850,  orders:0, joined:'05 Apr 2023',addr:'Uttara, Dhaka',           initials:'MH',g:2,lastLogin:'5 Jun 2026, 09:00 AM',device:'Chrome · Windows',note:'Staff account – no orders expected.'},
  {id:4, name:'Nusrat Jahan',    email:'nusrat.jahan@email.com',   phone:'+880 1744-444444',role:'customer',status:'active',   tier:'standard',points:1100, orders:11,joined:'18 Jun 2023',addr:'Mirpur, Dhaka',           initials:'NJ',g:3,lastLogin:'3 Jun 2026, 07:55 PM',device:'Redmi Note 12 · Android',note:''},
  {id:5, name:'Tahmid Rahman',   email:'tahmid.r@email.com',       phone:'+880 1755-555555',role:'admin',  status:'active',   tier:'standard',points:300,  orders:2, joined:'01 Feb 2023',addr:'Banani, Dhaka',            initials:'TR',g:4,lastLogin:'5 Jun 2026, 11:30 AM',device:'MacBook Pro · Safari',note:'Secondary admin – limited access.'},
  {id:6, name:'Farhana Begum',   email:'farhana.b@email.com',      phone:'+880 1766-666666',role:'customer',status:'suspended',tier:'standard',points:420,  orders:7, joined:'30 Aug 2023',addr:'Mohammadpur, Dhaka',      initials:'FB',g:5,lastLogin:'15 Apr 2026, 03:12 PM',device:'OPPO A96 · Android',note:'Account suspended – 3 chargeback attempts.'},
  {id:7, name:'Imran Khan',      email:'imran.khan@email.com',     phone:'+880 1777-777777',role:'customer',status:'active',   tier:'gold',    points:3100, orders:19,joined:'12 Sep 2023',addr:'Gazipur',                  initials:'IK',g:6,lastLogin:'4 Jun 2026, 06:20 PM',device:'iPhone 13 · iOS',note:''},
  {id:8, name:'Dilnoza Sultana', email:'dilnoza.s@email.com',      phone:'+880 1788-888888',role:'customer',status:'pending',  tier:'standard',points:0,    orders:0, joined:'03 Nov 2023',addr:'Sylhet',                   initials:'DS',g:7,lastLogin:'—',device:'—',note:'Pending email verification.'},
  {id:9, name:'Nasir Uddin',     email:'nasir.ud@email.com',       phone:'+880 1799-999999',role:'staff',  status:'active',   tier:'standard',points:200,  orders:0, joined:'15 Oct 2023',addr:'Chittagong',               initials:'NU',g:0,lastLogin:'5 Jun 2026, 02:00 PM',device:'Chrome · Linux',note:''},
  {id:10,name:'Sharmin Akter',   email:'sharmin.a@email.com',      phone:'+880 1700-100100',role:'customer',status:'active',   tier:'platinum',points:7200, orders:42,joined:'08 Dec 2022',addr:'Lalmatia, Dhaka',          initials:'SA',g:1,lastLogin:'5 Jun 2026, 12:05 PM',device:'iPad Pro · iPadOS',note:'Top customer – priority support.'},
  {id:11,name:'Rezaul Karim',    email:'rezaul.k@email.com',       phone:'+880 1701-101101',role:'customer',status:'active',   tier:'gold',    points:2900, orders:16,joined:'19 Mar 2023',addr:'Bashundhara, Dhaka',       initials:'RK',g:2,lastLogin:'2 Jun 2026, 05:40 PM',device:'Realme 10 · Android',note:''},
  {id:12,name:'Tania Islam',     email:'tania.islam@email.com',    phone:'+880 1702-102102',role:'customer',status:'suspended',tier:'standard',points:310,  orders:5, joined:'27 Jul 2023',addr:'Farmgate, Dhaka',           initials:'TI',g:3,lastLogin:'10 Mar 2026, 08:10 AM',device:'Vivo Y73 · Android',note:'Account under review.'},
];

/* ══════════════════════════════════════════════
   UTILITIES
══════════════════════════════════════════════ */

function genOrders(uid: number, userOrdersCount: number): Order[] {
  if (userOrdersCount === 0) return [];
  const statuses: ('delivered' | 'processing' | 'cancelled')[] = ['delivered', 'delivered', 'delivered', 'delivered', 'processing', 'cancelled'];
  const dates = ['28 May 2026', '14 May 2026', '03 May 2026', '22 Apr 2026', '10 Apr 2026', '29 Mar 2026', '18 Mar 2026', '05 Mar 2026', '22 Feb 2026', '11 Feb 2026', '28 Jan 2026', '15 Jan 2026', '02 Jan 2026', '20 Dec 2025', '05 Dec 2025', '22 Nov 2025', '10 Nov 2025', '28 Oct 2025', '14 Oct 2025', '01 Oct 2025', '18 Sep 2025', '05 Sep 2025', '22 Aug 2025', '10 Aug 2025', '28 Jul 2025', '15 Jul 2025', '02 Jul 2025', '20 Jun 2025', '07 Jun 2025', '25 May 2025'];
  const orders: Order[] = [];
  const cnt = Math.min(userOrdersCount, dates.length);
  for (let i = 0; i < cnt; i++) {
    const nItems = Math.floor(Math.random() * 3) + 1;
    const items: OrderItem[] = [];
    const used = new Set();
    for (let j = 0; j < nItems; j++) {
      let product;
      do {
        product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      } while (used.has(product.id));
      used.add(product.id);
      items.push({ ...product, qty: Math.floor(Math.random() * 2) + 1 });
    }
    const total = items.reduce((s, it) => s + it.price * it.qty, 0);
    orders.push({
      oid: 'ORD-' + String(uid * 100 + i + 1).padStart(4, '0'),
      date: dates[i],
      status: statuses[i % statuses.length],
      items,
      total
    });
  }
  return orders;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(INITIAL_USERS);
  const [curPage, setCurPage] = useState(1);
  const [perPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [currentSearch, setCurrentSearch] = useState("");
  const [sortType, setSortType] = useState("newest");
  const [detailUserId, setDetailUserId] = useState<number | null>(null);
  const [curTab, setCurTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; icon: string; show: boolean }>({ msg: '', icon: 'check_circle', show: false });
  const [currentDate, setCurrentDate] = useState("");
  const [dropdowns, setDropdowns] = useState<Record<string, boolean>>({ filter: false, sort: false });

  // Add/Edit Form State
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addr, setAddr] = useState("");
  const [role, setRole] = useState<any>("customer");
  const [status, setStatus] = useState<any>("active");
  const [pass, setPass] = useState("");

  // Points adjustment state
  const [ptsInput, setPtsInput] = useState<number>(0);
  const [ptsReason, setPtsReason] = useState("");

  const detailUser = users.find(u => u.id === detailUserId);
  const detailUserOrders = detailUserId ? genOrders(detailUserId, detailUser?.orders || 0) : [];

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
  }, []);

  useEffect(() => {
    let result = [...users];

    // Filter
    if (activeFilter && activeFilter !== 'all') {
      if (['admin', 'customer', 'staff'].includes(activeFilter)) {
        result = result.filter(u => u.role === activeFilter);
      } else if (['active', 'suspended', 'pending'].includes(activeFilter)) {
        result = result.filter(u => u.status === activeFilter);
      }
    }

    // Search
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      result = result.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q));
    }

    // Sort
    if (sortType === 'newest') result.sort((a, b) => b.id - a.id);
    else if (sortType === 'oldest') result.sort((a, b) => a.id - b.id);
    else if (sortType === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortType === 'orders') result.sort((a, b) => b.orders - a.orders);
    else if (sortType === 'points') result.sort((a, b) => b.points - a.points);
    else if (sortType === 'spent') {
      result.sort((a, b) => {
        const spentB = genOrders(b.id, b.orders).reduce((s, o) => s + o.total, 0);
        const spentA = genOrders(a.id, a.orders).reduce((s, o) => s + o.total, 0);
        return spentB - spentA;
      });
    }

    setFilteredUsers(result);
    setCurPage(1);
  }, [users, currentSearch, activeFilter, sortType]);

  const showToast = (msg: string, icon = 'check_circle') => {
    setToast({ msg, icon, show: true });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 2800);
  };

  const toggleSel = (id: number) => {
    const newSels = new Set(selectedIds);
    if (newSels.has(id)) newSels.delete(id);
    else newSels.add(id);
    setSelectedIds(newSels);
  };

  const toggleAll = (checked: boolean) => {
    const start = (curPage - 1) * perPage;
    const slice = filteredUsers.slice(start, start + perPage);
    const newSels = new Set(selectedIds);
    slice.forEach(u => checked ? newSels.add(u.id) : newSels.delete(u.id));
    setSelectedIds(newSels);
  };

  const bulkAct = (a: string) => {
    if (selectedIds.size === 0) return;
    if (a === 'delete') {
      setUsers(prev => prev.filter(u => !selectedIds.has(u.id)));
      showToast(`${selectedIds.size} users deleted`, 'delete');
    } else if (a === 'activate') {
      setUsers(prev => prev.map(u => selectedIds.has(u.id) ? { ...u, status: 'active' } : u));
      showToast(`${selectedIds.size} users activated`, 'check_circle');
    } else if (a === 'suspend') {
      setUsers(prev => prev.map(u => selectedIds.has(u.id) ? { ...u, status: 'suspended' } : u));
      showToast(`${selectedIds.size} users suspended`, 'block');
    }
    setSelectedIds(new Set());
  };

  const openAddModal = () => {
    setEditingUserId(null);
    setFName(""); setLName(""); setEmail(""); setPhone(""); setAddr(""); setPass("");
    setRole("customer"); setStatus("active");
    setIsModalOpen(true);
  };

  const openEditModal = (uid: number) => {
    const u = users.find(x => x.id === uid);
    if (!u) return;
    setEditingUserId(uid);
    const names = u.name.split(' ');
    setFName(names[0] || "");
    setLName(names.slice(1).join(' ') || "");
    setEmail(u.email); setPhone(u.phone); setAddr(u.addr); setPass("");
    setRole(u.role); setStatus(u.status);
    setIsModalOpen(true);
  };

  const saveUser = () => {
    if (!fName.trim()) return;
    const fullName = `${fName.trim()} ${lName.trim()}`.trim();
    if (editingUserId) {
      setUsers(prev => prev.map(u => u.id === editingUserId ? {
        ...u,
        name: fullName,
        email,
        phone,
        addr: addr || u.addr,
        role,
        status,
        initials: (fName[0] + (lName[0] || "")).toUpperCase()
      } : u));
      showToast('User updated', 'check_circle');
    } else {
      const nid = Math.max(0, ...users.map(x => x.id)) + 1;
      const newUser: User = {
        id: nid,
        name: fullName,
        email,
        phone,
        role,
        status,
        tier: 'standard',
        points: 0,
        orders: 0,
        joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        addr: addr || '—',
        initials: (fName[0] + (lName[0] || "")).toUpperCase(),
        g: nid % 8,
        lastLogin: '—',
        device: '—',
        note: ''
      };
      setUsers(prev => [newUser, ...prev]);
      showToast('User created', 'person_add');
    }
    setIsModalOpen(false);
  };

  const deleteUser = (uid: number) => {
    setUsers(prev => prev.filter(x => x.id !== uid));
    const newSels = new Set(selectedIds);
    newSels.delete(uid);
    setSelectedIds(newSels);
    showToast('User deleted', 'delete');
  };

  const toggleUserStatus = (uid: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id === uid) {
        const nextStatus = u.status === 'active' ? 'suspended' : 'active';
        showToast(`User ${nextStatus === 'active' ? 'activated' : 'suspended'}`, nextStatus === 'active' ? 'check_circle' : 'block');
        return { ...u, status: nextStatus as any };
      }
      return u;
    }));
  };

  const savePoints = (uid: number) => {
    const val = ptsInput || 0;
    setUsers(prev => prev.map(u => {
      if (u.id === uid) {
        let tier = u.tier;
        if (val >= 3000) tier = 'platinum';
        else if (val >= 1500) tier = 'gold';
        else tier = 'standard';
        showToast(`Points updated to ${val.toLocaleString()}${ptsReason ? ' (' + ptsReason + ')' : ''}`, 'toll');
        return { ...u, points: val, tier };
      }
      return u;
    }));
  };

  const openDetail = (uid: number) => {
    setDetailUserId(uid);
    setCurTab('overview');
    const u = users.find(x => x.id === uid);
    if (u) {
      setPtsInput(u.points);
      setPtsReason("");
    }
  };

  const closeDetail = () => setDetailUserId(null);

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    newThisMonth: 94, // Mock
    premium: users.filter(u => u.tier !== 'standard').length
  };

  const startIdx = (curPage - 1) * perPage;
  const pageUsers = filteredUsers.slice(startIdx, startIdx + perPage);
  const totalPages = Math.ceil(filteredUsers.length / perPage);

  const getAvatarGradient = (g: number) => `ag${g}`;

  const roleColors: Record<string, string> = {
    admin: 'bg-primary-fixed text-on-primary-container',
    staff: 'bg-tertiary-fixed text-on-tertiary-container',
    customer: 'bg-surface-container text-on-surface-variant'
  };

  const statusColors: Record<string, string> = {
    active: 'bg-secondary-fixed/50 text-secondary',
    suspended: 'bg-error-container text-error',
    pending: 'bg-primary-fixed text-on-primary-container'
  };

  const statusDots: Record<string, string> = {
    active: 'bg-secondary',
    suspended: 'bg-error',
    pending: 'bg-primary-fixed-dim'
  };

  return (
    <div className="bg-background text-on-background font-sans antialiased overflow-x-hidden min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined{font-family:'Material Symbols Outlined';font-weight:normal;font-style:normal;font-size:24px;line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;direction:ltr;-webkit-font-smoothing:antialiased}
        .stat-card{transition:transform .2s ease,box-shadow .2s ease}
        .stat-card:hover{transform:translateY(-3px);box-shadow:0 16px 40px rgba(159,65,34,.10)}
        .trow{transition:background .15s}
        .trow:hover{background:rgba(248,243,234,.9)}
        .hide-scrollbar{scrollbar-width:none;-ms-overflow-style:none}
        .hide-scrollbar::-webkit-scrollbar{display:none}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#ddc0b8;border-radius:99px}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.55}}
        .badge-pulse{animation:pulse 2s cubic-bezier(.4,0,.6,1) infinite}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        .fade-up{animation:fadeUp .4s ease both}
        .fade-up-1{animation-delay:.05s}.fade-up-2{animation-delay:.1s}.fade-up-3{animation-delay:.15s}.fade-up-4{animation-delay:.2s}
        .detail-panel{transition:transform .38s cubic-bezier(.4,0,.2,1)}
        .detail-panel-ov{transition:opacity .3s ease}
        .dtab{transition:color .15s,border-color .15s}
        .dtab.active{color:#9f4122;border-bottom:2.5px solid #9f4122}
        .dtab:not(.active){border-bottom:2.5px solid transparent;color:#56423c}
        .order-expand{transition:max-height .3s ease,opacity .3s ease;overflow:hidden}
        .pts-btn{transition:background .15s,transform .1s}
        .pts-btn:active{transform:scale(.92)}
        .dropdown-menu{transition:opacity .15s ease,transform .15s ease;transform-origin:top right}
        .dropdown-menu.hidden{opacity:0;transform:scale(.95);pointer-events:none}
        .role-badge{transition:filter .15s}
        .role-badge:hover{filter:brightness(.92)}
        .ag0{background:linear-gradient(135deg,#9f4122,#c4623e)}
        .ag1{background:linear-gradient(135deg,#326578,#4d8fa6)}
        .ag2{background:linear-gradient(135deg,#556500,#7a9200)}
        .ag3{background:linear-gradient(135deg,#7f2a0d,#a83a18)}
        .ag4{background:linear-gradient(135deg,#1d5a7a,#2e7ea8)}
        .ag5{background:linear-gradient(135deg,#4a4500,#6a6300)}
        .ag6{background:linear-gradient(135deg,#8b2a4e,#b53968)}
        .ag7{background:linear-gradient(135deg,#1a5e3a,#268550)}
        .tip{position:relative}
        .tip::after{content:attr(data-t);position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);background:#1d1c15;color:#fff9ee;font-size:11px;padding:4px 8px;border-radius:6px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .15s}
        .tip:hover::after{opacity:1}
      ` }} />

      <AdminSidebar pendingUsers={users.length} />

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
              <span className="text-on-surface font-semibold">Users</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 bg-surface-container rounded-full px-4 py-2 border border-outline-variant/30 w-48 xl:w-64">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
              <input 
                type="text" 
                placeholder="Search users..." 
                className="bg-transparent text-[13px] text-on-surface placeholder:text-outline border-none focus:ring-0 w-full p-0"
                value={currentSearch}
                onChange={(e) => setCurrentSearch(e.target.value)}
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

        <main className="flex-1 p-4 md:p-6 xl:p-8 pb-20 lg:pb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 fade-up">
            <div>
              <h1 className="text-[22px] md:text-[28px] font-extrabold text-on-surface">User Management</h1>
              <p className="text-[13px] text-on-surface-variant mt-0.5">Manage users, orders, points and activity</p>
            </div>
            <button onClick={openAddModal} className="flex items-center gap-2 bg-primary text-on-primary text-[13px] font-semibold px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors shadow-sm self-start sm:self-auto">
              <span className="material-symbols-outlined text-[18px]">person_add</span>Add User
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="stat-card bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-4 md:p-5 shadow-sm fade-up fade-up-1 cursor-pointer" onClick={() => setActiveFilter('all')}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[20px]">group</span>
                </div>
                <span className="text-[10px] font-bold text-secondary bg-secondary-container px-2 py-0.5 rounded-full">+8.2%</span>
              </div>
              <p className="text-[24px] md:text-[28px] font-extrabold text-on-surface leading-none">{stats.total}</p>
              <p className="text-[12px] text-on-surface-variant mt-1 font-medium">Total Users</p>
              <p className="text-[11px] text-on-surface-variant/70 mt-0.5">↑ 94 this month</p>
            </div>
            <div className="stat-card bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-4 md:p-5 shadow-sm fade-up fade-up-2 cursor-pointer" onClick={() => setActiveFilter('active')}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-secondary-fixed/50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                </div>
                <span className="text-[10px] font-bold text-secondary bg-secondary-container px-2 py-0.5 rounded-full">+3.1%</span>
              </div>
              <p className="text-[24px] md:text-[28px] font-extrabold text-on-surface leading-none">{stats.active}</p>
              <p className="text-[12px] text-on-surface-variant mt-1 font-medium">Active Users</p>
              <p className="text-[11px] text-on-surface-variant/70 mt-0.5">87.5% of total</p>
            </div>
            <div className="stat-card bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-4 md:p-5 shadow-sm fade-up fade-up-3">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-tertiary-fixed/50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary text-[20px]">person_add</span>
                </div>
                <span className="text-[10px] font-bold text-secondary bg-secondary-container px-2 py-0.5 rounded-full">+22%</span>
              </div>
              <p className="text-[24px] md:text-[28px] font-extrabold text-on-surface leading-none">{stats.newThisMonth}</p>
              <p className="text-[12px] text-on-surface-variant mt-1 font-medium">New This Month</p>
              <p className="text-[11px] text-on-surface-variant/70 mt-0.5">vs 77 last month</p>
            </div>
            <div className="stat-card bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-4 md:p-5 shadow-sm fade-up fade-up-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#b8860b]/15 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#b8860b] text-[20px]">workspace_premium</span>
                </div>
                <span className="text-[10px] font-bold text-secondary bg-secondary-container px-2 py-0.5 rounded-full">+5.4%</span>
              </div>
              <p className="text-[24px] md:text-[28px] font-extrabold text-on-surface leading-none">{stats.premium}</p>
              <p className="text-[12px] text-on-surface-variant mt-1 font-medium">Premium Members</p>
              <p className="text-[11px] text-on-surface-variant/70 mt-0.5">Gold &amp; Platinum tiers</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] shadow-sm fade-up fade-up-3">
            <div className="p-4 md:p-5 border-b border-outline-variant/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="font-bold text-[16px] text-on-surface">All Users <span className="text-[13px] font-normal text-on-surface-variant">({filteredUsers.length})</span></h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex md:hidden items-center gap-2 bg-surface-container rounded-full px-3 py-2 border border-outline-variant/30 flex-1 min-w-[160px]">
                    <span className="material-symbols-outlined text-on-surface-variant text-[17px]">search</span>
                    <input 
                      type="text" 
                      placeholder="Search…" 
                      className="bg-transparent text-[12px] text-on-surface placeholder:text-outline border-none focus:ring-0 w-full p-0"
                      value={currentSearch}
                      onChange={(e) => setCurrentSearch(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setDropdowns(prev => ({ ...prev, filter: !prev.filter, sort: false }))} 
                      className="flex items-center gap-1.5 bg-surface-container border border-outline-variant/30 rounded-full px-3 py-2 text-[12px] font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">filter_list</span><span className="hidden sm:inline">Filter</span>
                    </button>
                    {dropdowns.filter && (
                      <div className="absolute right-0 top-full mt-2 w-44 bg-surface-container-lowest border border-outline-variant/30 rounded-[16px] shadow-lg p-2 z-20">
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider px-2 mb-1">Role</p>
                        {['all', 'admin', 'customer', 'staff'].map(f => (
                          <button key={f} onClick={() => { setActiveFilter(f); setDropdowns({ filter: false, sort: false }); }} className={`w-full text-left px-3 py-2 rounded-xl text-[13px] text-on-surface hover:bg-surface-container transition-colors ${activeFilter === f ? 'font-bold' : ''}`}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                        ))}
                        <div className="h-px bg-outline-variant/20 my-1"></div>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider px-2 mb-1">Status</p>
                        {['active', 'suspended', 'pending'].map(f => (
                          <button key={f} onClick={() => { setActiveFilter(f); setDropdowns({ filter: false, sort: false }); }} className={`w-full text-left px-3 py-2 rounded-xl text-[13px] text-on-surface hover:bg-surface-container ${activeFilter === f ? 'font-bold' : ''}`}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setDropdowns(prev => ({ ...prev, sort: !prev.sort, filter: false }))} 
                      className="flex items-center gap-1.5 bg-surface-container border border-outline-variant/30 rounded-full px-3 py-2 text-[12px] font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">sort</span><span className="hidden sm:inline">Sort</span>
                    </button>
                    {dropdowns.sort && (
                      <div className="absolute right-0 top-full mt-2 w-44 bg-surface-container-lowest border border-outline-variant/30 rounded-[16px] shadow-lg p-2 z-20">
                        {[
                          { by: 'newest', lbl: 'Newest First' },
                          { by: 'oldest', lbl: 'Oldest First' },
                          { by: 'name', lbl: 'Name A–Z' },
                          { by: 'orders', lbl: 'Most Orders' },
                          { by: 'points', lbl: 'Most Points' },
                          { by: 'spent', lbl: 'Highest Spend' }
                        ].map(s => (
                          <button key={s.by} onClick={() => { setSortType(s.by); setDropdowns({ filter: false, sort: false }); }} className="w-full text-left px-3 py-2 rounded-xl text-[13px] text-on-surface hover:bg-surface-container">{s.lbl}</button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button className="flex items-center gap-1.5 bg-surface-container border border-outline-variant/30 rounded-full px-3 py-2 text-[12px] font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors tip" data-t="Export CSV">
                    <span className="material-symbols-outlined text-[16px]">download</span><span className="hidden sm:inline">Export</span>
                  </button>
                </div>
              </div>
              {activeFilter && activeFilter !== 'all' && (
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="flex items-center gap-1 text-[11px] font-semibold bg-primary-fixed text-on-primary-container px-3 py-1.5 rounded-full">
                    <span>{activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}</span>
                    <button onClick={() => setActiveFilter('all')} className="material-symbols-outlined text-[14px] hover:text-error">close</button>
                  </span>
                </div>
              )}
            </div>

            {selectedIds.size > 0 && (
              <div className="flex items-center gap-3 px-4 md:px-5 py-3 bg-primary-fixed/40 border-b border-outline-variant/20">
                <span className="text-[13px] font-semibold text-on-surface">{selectedIds.size} selected</span>
                <div className="h-4 w-px bg-outline-variant/40 mx-1"></div>
                <button onClick={() => bulkAct('activate')} className="flex items-center gap-1 text-[12px] font-medium text-secondary"><span className="material-symbols-outlined text-[16px]">check_circle</span>Activate</button>
                <button onClick={() => bulkAct('suspend')} className="flex items-center gap-1 text-[12px] font-medium text-on-surface-variant"><span className="material-symbols-outlined text-[16px]">block</span>Suspend</button>
                <button onClick={() => bulkAct('delete')} className="flex items-center gap-1 text-[12px] font-medium text-error ml-auto"><span className="material-symbols-outlined text-[16px]">delete</span>Delete</button>
              </div>
            )}

            <div className="overflow-x-auto hide-scrollbar">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="bg-surface-container/60 border-b border-outline-variant/20">
                    <th className="text-left px-4 md:px-5 py-3 w-10">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-outline-variant cursor-pointer" 
                        style={{ accentColor: '#9f4122' }} 
                        checked={pageUsers.length > 0 && pageUsers.every(u => selectedIds.has(u.id))}
                        onChange={(e) => toggleAll(e.target.checked)}
                      />
                    </th>
                    <th className="text-left px-4 md:px-5 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">User</th>
                    <th className="text-left px-4 md:px-5 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Contact</th>
                    <th className="text-left px-4 md:px-5 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Role</th>
                    <th className="text-left px-4 md:px-5 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 md:px-5 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider hidden lg:table-cell">Orders</th>
                    <th className="text-left px-4 md:px-5 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider hidden lg:table-cell">Points</th>
                    <th className="text-left px-4 md:px-5 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider hidden xl:table-cell">Total Spent</th>
                    <th className="text-right px-4 md:px-5 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15">
                  {pageUsers.map(u => {
                    const spent = genOrders(u.id, u.orders).reduce((s, o) => s + o.total, 0);
                    return (
                      <tr key={u.id} className={`trow ${selectedIds.has(u.id) ? 'bg-primary-fixed/20' : ''}`}>
                        <td className="px-4 md:px-5 py-3.5">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-outline-variant cursor-pointer" 
                            style={{ accentColor: '#9f4122' }} 
                            checked={selectedIds.has(u.id)}
                            onChange={() => toggleSel(u.id)}
                          />
                        </td>
                        <td className="px-4 md:px-5 py-3.5">
                          <div className="flex items-center gap-3 cursor-pointer" onClick={() => openDetail(u.id)}>
                            <div className={`w-9 h-9 rounded-full ${getAvatarGradient(u.g)} text-white flex items-center justify-center font-bold text-[12px] shrink-0 shadow-sm`}>{u.initials}</div>
                            <div>
                              <p className="text-[13px] font-semibold text-on-surface hover:text-primary transition-colors">{u.name}</p>
                              <p className="text-[11px] text-on-surface-variant hidden sm:block">#USR-{String(u.id).padStart(4, '0')}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 md:px-5 py-3.5 hidden md:table-cell">
                          <p className="text-[12px] text-on-surface">{u.email}</p>
                          <p className="text-[11px] text-on-surface-variant">{u.phone}</p>
                        </td>
                        <td className="px-4 md:px-5 py-3.5">
                          <span className={`role-badge text-[11px] font-semibold capitalize px-2.5 py-1 rounded-full ${roleColors[u.role] || ''}`}>{u.role}</span>
                        </td>
                        <td className="px-4 md:px-5 py-3.5">
                          <span className={`flex items-center gap-1.5 text-[11px] font-semibold capitalize px-2.5 py-1 rounded-full w-fit ${statusColors[u.status] || ''}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusDots[u.status] || ''}`}></span>{u.status}
                          </span>
                        </td>
                        <td className="px-4 md:px-5 py-3.5 hidden lg:table-cell">
                          <span className="text-[13px] font-bold text-on-surface">{u.orders}</span>
                          <span className="text-[11px] text-on-surface-variant ml-1">orders</span>
                        </td>
                        <td className="px-4 md:px-5 py-3.5 hidden lg:table-cell">
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[#b8860b] text-[15px]">toll</span>
                            <span className="text-[13px] font-bold text-on-surface">{u.points.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="px-4 md:px-5 py-3.5 hidden xl:table-cell">
                          <span className="text-[12px] font-semibold text-on-surface">৳{spent.toLocaleString()}</span>
                        </td>
                        <td className="px-4 md:px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => openDetail(u.id)} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-primary-fixed transition-colors text-on-surface-variant tip" data-t="View Profile"><span className="material-symbols-outlined text-[18px]">visibility</span></button>
                            <button onClick={() => { openDetail(u.id); setTimeout(() => setCurTab('orders'), 100); }} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-tertiary-fixed/50 transition-colors text-on-surface-variant tip" data-t="View Orders"><span className="material-symbols-outlined text-[18px]">receipt_long</span></button>
                            <button onClick={() => { openDetail(u.id); setTimeout(() => setCurTab('points'), 100); }} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-secondary-container/50 transition-colors text-on-surface-variant tip" data-t="Edit Points"><span className="material-symbols-outlined text-[18px]">toll</span></button>
                            <button onClick={() => openEditModal(u.id)} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface-variant tip" data-t="Edit"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                            <button onClick={() => deleteUser(u.id)} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-error-container transition-colors text-on-surface-variant tip" data-t="Delete"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {pageUsers.length === 0 && (
                    <tr><td colSpan={9} className="text-center py-12 text-on-surface-variant"><span className="material-symbols-outlined text-[40px] block mb-2 opacity-30">search_off</span>No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-4 md:px-5 py-4 border-t border-outline-variant/20">
              <p className="text-[12px] text-on-surface-variant">Showing {Math.min(startIdx + 1, filteredUsers.length)}–{Math.min(startIdx + perPage, filteredUsers.length)} of {filteredUsers.length}</p>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setCurPage(prev => Math.max(1, prev - 1))} 
                  disabled={curPage === 1}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).filter(n => n === 1 || n === totalPages || Math.abs(n - curPage) <= 1).map((n, idx, arr) => (
                    <div key={n} className="flex items-center gap-1">
                      {idx > 0 && n - arr[idx - 1] > 1 && <span className="text-on-surface-variant text-[13px] px-1">…</span>}
                      <button 
                        onClick={() => setCurPage(n)} 
                        className={`w-8 h-8 rounded-xl text-[13px] font-semibold transition-colors ${n === curPage ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}
                      >
                        {n}
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setCurPage(prev => Math.min(totalPages, prev + 1))} 
                  disabled={curPage >= totalPages}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* DETAIL PANEL */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${detailUserId ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={closeDetail}
      />
      <div className={`detail-panel fixed inset-y-0 right-0 w-full md:w-[720px] xl:w-[780px] bg-background z-[61] shadow-2xl transition-transform duration-300 transform ${detailUserId ? 'translate-x-0' : 'translate-x-full'} flex flex-col overflow-hidden`}>
        <div className="flex items-center justify-between px-5 md:px-6 h-16 border-b border-outline-variant/20 bg-surface-container-lowest shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={closeDetail} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <div>
              <h2 className="font-bold text-[16px] text-on-surface leading-none">{detailUser?.name || "User Details"}</h2>
              <p className="text-[11px] text-on-surface-variant mt-0.5">{detailUserId ? `#USR-${String(detailUserId).padStart(4, '0')} · ${detailUser?.email}` : ""}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => detailUserId && openEditModal(detailUserId)} className="flex items-center gap-1.5 bg-primary text-on-primary text-[12px] font-semibold px-4 py-2 rounded-full hover:bg-primary/90 transition-colors">
              <span className="material-symbols-outlined text-[16px]">edit</span><span className="hidden sm:inline">Edit User</span>
            </button>
            <button onClick={closeDetail} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
        </div>

        {detailUser && (
          <>
            <div className="shrink-0 bg-gradient-to-r from-primary-fixed/40 via-tertiary-fixed/20 to-surface px-5 md:px-6 py-5 flex items-center gap-4 border-b border-outline-variant/15">
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${getAvatarGradient(detailUser.g)} text-white flex items-center justify-center font-bold text-[22px] md:text-[28px] shadow-lg shrink-0`}>{detailUser.initials}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-extrabold text-[18px] md:text-[22px] text-on-surface">{detailUser.name}</h3>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full text-white bg-gradient-to-r ${{gold:'from-[#b8860b] to-[#daa520]',platinum:'from-tertiary to-[#4d8fa6]',standard:'from-on-surface-variant to-outline'}[detailUser.tier] || 'from-on-surface-variant to-outline'}`}>
                    {{gold:'🥇 Gold Member',platinum:'💎 Platinum Member',standard:'⭐ Standard'}[detailUser.tier] || detailUser.tier}
                  </span>
                </div>
                <p className="text-[12px] text-on-surface-variant mb-2">{detailUser.email} &nbsp;·&nbsp; {detailUser.phone}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[11px] font-semibold capitalize px-2.5 py-1 rounded-full ${roleColors[detailUser.role] || ''}`}>{detailUser.role}</span>
                  <span className={`text-[11px] font-semibold capitalize px-2.5 py-1 rounded-full ${statusColors[detailUser.status] || ''}`}>{detailUser.status}</span>
                </div>
              </div>
              <div className="hidden md:grid grid-cols-3 gap-3 shrink-0">
                <div className="bg-surface/80 backdrop-blur border border-outline-variant/30 rounded-[16px] px-4 py-3 text-center min-w-[80px]">
                  <p className="text-[20px] font-extrabold text-on-surface">{detailUser.orders}</p>
                  <p className="text-[10px] text-on-surface-variant font-medium">Orders</p>
                </div>
                <div className="bg-surface/80 backdrop-blur border border-outline-variant/30 rounded-[16px] px-4 py-3 text-center min-w-[80px]">
                  <p className="text-[20px] font-extrabold text-on-surface">{detailUser.points.toLocaleString()}</p>
                  <p className="text-[10px] text-on-surface-variant font-medium">Points</p>
                </div>
                <div className="bg-surface/80 backdrop-blur border border-outline-variant/30 rounded-[16px] px-4 py-3 text-center min-w-[80px]">
                  <p className="text-[20px] font-extrabold text-on-surface">৳{detailUserOrders.reduce((s,o)=>s+o.total,0).toLocaleString()}</p>
                  <p className="text-[10px] text-on-surface-variant font-medium">Total Spent</p>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex border-b border-outline-variant/20 bg-surface-container-lowest px-5 md:px-6 gap-0 overflow-x-auto hide-scrollbar">
              {['overview', 'orders', 'products', 'points', 'activity', 'notes'].map(t => (
                <button 
                  key={t} 
                  onClick={() => setCurTab(t)} 
                  className={`dtab text-[13px] font-semibold px-4 py-3.5 whitespace-nowrap ${curTab === t ? 'active' : ''}`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                  {t === 'orders' && <span className="ml-1 text-[10px] bg-primary-fixed text-on-primary-container px-1.5 py-0.5 rounded-full font-bold">{detailUser.orders}</span>}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar">
              {curTab === 'overview' && (
                <div className="p-5 md:p-6 space-y-4 animate-fade-in">
                  <div className="md:hidden grid grid-cols-3 gap-2">
                    <div className="bg-surface-container rounded-[16px] p-3 text-center"><p className="text-[18px] font-extrabold text-on-surface">{detailUser.orders}</p><p className="text-[10px] text-on-surface-variant">Orders</p></div>
                    <div className="bg-surface-container rounded-[16px] p-3 text-center"><p className="text-[18px] font-extrabold text-on-surface">{detailUser.points.toLocaleString()}</p><p className="text-[10px] text-on-surface-variant">Points</p></div>
                    <div className="bg-surface-container rounded-[16px] p-3 text-center"><p className="text-[18px] font-extrabold text-on-surface">৳{detailUserOrders.reduce((s,o)=>s+o.total,0).toLocaleString()}</p><p className="text-[10px] text-on-surface-variant">Spent</p></div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-secondary-fixed/30 border border-secondary-fixed-dim/50 rounded-[16px] p-4">
                      <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                      <p className="text-[20px] font-extrabold text-on-surface mt-1">{detailUserOrders.filter(o=>o.status==='delivered').length}</p>
                      <p className="text-[11px] text-on-surface-variant">Delivered</p>
                    </div>
                    <div className="bg-tertiary-fixed/30 border border-tertiary-container/40 rounded-[16px] p-4">
                      <span className="material-symbols-outlined text-tertiary text-[20px]">autorenew</span>
                      <p className="text-[20px] font-extrabold text-on-surface mt-1">{detailUserOrders.filter(o=>o.status==='processing').length}</p>
                      <p className="text-[11px] text-on-surface-variant">Processing</p>
                    </div>
                    <div className="bg-error-container/40 border border-error/15 rounded-[16px] p-4">
                      <span className="material-symbols-outlined text-error text-[20px]">cancel</span>
                      <p className="text-[20px] font-extrabold text-on-surface mt-1">{detailUserOrders.filter(o=>o.status==='cancelled').length}</p>
                      <p className="text-[11px] text-on-surface-variant">Cancelled</p>
                    </div>
                    <div className="bg-primary-fixed/40 border border-primary-fixed-dim/40 rounded-[16px] p-4">
                      <span className="material-symbols-outlined text-primary text-[20px]">shopping_bag</span>
                      <p className="text-[20px] font-extrabold text-on-surface mt-1">৳{detailUserOrders.length ? Math.round(detailUserOrders.reduce((s,o)=>s+o.total,0)/detailUserOrders.length).toLocaleString() : 0}</p>
                      <p className="text-[11px] text-on-surface-variant">Avg. Order</p>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-5">
                    <h4 className="font-bold text-[14px] text-on-surface mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-primary">person</span>Profile Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 py-2 border-b border-outline-variant/15">
                          <span className="material-symbols-outlined text-on-surface-variant text-[18px] mt-0.5 shrink-0">mail</span>
                          <div><p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Email</p><p className="text-[13px] text-on-surface">{detailUser.email}</p></div>
                        </div>
                        <div className="flex items-start gap-3 py-2 border-b border-outline-variant/15">
                          <span className="material-symbols-outlined text-on-surface-variant text-[18px] mt-0.5 shrink-0">call</span>
                          <div><p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Phone</p><p className="text-[13px] text-on-surface">{detailUser.phone}</p></div>
                        </div>
                        <div className="flex items-start gap-3 py-2">
                          <span className="material-symbols-outlined text-on-surface-variant text-[18px] mt-0.5 shrink-0">home_pin</span>
                          <div><p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Address</p><p className="text-[13px] text-on-surface">{detailUser.addr}</p></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 py-2 border-b border-outline-variant/15">
                          <span className="material-symbols-outlined text-on-surface-variant text-[18px] mt-0.5 shrink-0">calendar_month</span>
                          <div><p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Member Since</p><p className="text-[13px] text-on-surface">{detailUser.joined}</p></div>
                        </div>
                        <div className="flex items-start gap-3 py-2 border-b border-outline-variant/15">
                          <span className="material-symbols-outlined text-on-surface-variant text-[18px] mt-0.5 shrink-0">schedule</span>
                          <div><p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Last Login</p><p className="text-[13px] text-on-surface">{detailUser.lastLogin}</p></div>
                        </div>
                        <div className="flex items-start gap-3 py-2">
                          <span className="material-symbols-outlined text-on-surface-variant text-[18px] mt-0.5 shrink-0">devices</span>
                          <div><p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Device</p><p className="text-[13px] text-on-surface">{detailUser.device}</p></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {detailUserOrders.length > 0 && (
                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-[14px] text-on-surface flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-primary">receipt_long</span>Last Order</h4>
                        <button onClick={() => setCurTab('orders')} className="text-[12px] font-semibold text-primary hover:underline">View All →</button>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-[13px] font-semibold text-on-surface">{detailUserOrders[0].oid}</p>
                          <p className="text-[11px] text-on-surface-variant">{detailUserOrders[0].date}</p>
                        </div>
                        <span className={`text-[11px] font-semibold capitalize px-2.5 py-1 rounded-full ${statusColors[detailUserOrders[0].status] || ''}`}>{detailUserOrders[0].status}</span>
                      </div>
                      <div className="space-y-2 mb-3">
                        {detailUserOrders[0].items.map((it, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-surface-container rounded-xl px-3 py-2">
                            <span className="text-[20px]">{it.emoji}</span>
                            <div className="flex-1 min-w-0"><p className="text-[12px] font-medium text-on-surface truncate">{it.name}</p><p className="text-[11px] text-on-surface-variant">Qty: {it.qty}</p></div>
                            <p className="text-[13px] font-bold text-on-surface">৳{(it.price * it.qty).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-outline-variant/15">
                        <span className="text-[12px] font-semibold text-on-surface-variant">Order Total</span>
                        <span className="text-[16px] font-extrabold text-on-surface">৳{detailUserOrders[0].total.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setCurTab('points')} className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/30 rounded-[16px] p-4 hover:bg-primary-fixed/30 hover:border-primary-fixed-dim transition-colors text-left">
                      <span className="material-symbols-outlined text-[#b8860b] text-[22px]">toll</span>
                      <div><p className="text-[12px] font-bold text-on-surface">Edit Points</p><p className="text-[11px] text-on-surface-variant">Adjust loyalty points</p></div>
                    </button>
                    <button onClick={() => setCurTab('orders')} className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/30 rounded-[16px] p-4 hover:bg-tertiary-fixed/30 hover:border-tertiary-container transition-colors text-left">
                      <span className="material-symbols-outlined text-tertiary text-[22px]">receipt_long</span>
                      <div><p className="text-[12px] font-bold text-on-surface">Order History</p><p className="text-[11px] text-on-surface-variant">{detailUser.orders} total orders</p></div>
                    </button>
                    <button onClick={() => openEditModal(detailUser.id)} className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/30 rounded-[16px] p-4 hover:bg-surface-container-high transition-colors text-left">
                      <span className="material-symbols-outlined text-on-surface-variant text-[22px]">manage_accounts</span>
                      <div><p className="text-[12px] font-bold text-on-surface">Edit Profile</p><p className="text-[11px] text-on-surface-variant">Update user info</p></div>
                    </button>
                    <button onClick={() => toggleUserStatus(detailUser.id)} className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/30 rounded-[16px] p-4 hover:bg-error-container/40 hover:border-error/20 transition-colors text-left">
                      <span className={`material-symbols-outlined text-${detailUser.status === 'active' ? 'error' : 'secondary'} text-[22px]`}>{detailUser.status === 'active' ? 'block' : 'check_circle'}</span>
                      <div><p className="text-[12px] font-bold text-on-surface">{detailUser.status === 'active' ? 'Suspend User' : 'Activate User'}</p><p className="text-[11px] text-on-surface-variant">{detailUser.status === 'active' ? 'Restrict access' : 'Re-enable access'}</p></div>
                    </button>
                  </div>
                </div>
              )}

              {curTab === 'orders' && (
                <div className="p-5 md:p-6 space-y-3">
                  <div className="grid grid-cols-3 gap-3 mb-2">
                    <div className="bg-secondary-fixed/30 rounded-[16px] p-3 text-center"><p className="text-[18px] font-extrabold text-on-surface">{detailUserOrders.filter(o=>o.status==='delivered').length}</p><p className="text-[10px] text-on-surface-variant">Delivered</p></div>
                    <div className="bg-tertiary-fixed/30 rounded-[16px] p-3 text-center"><p className="text-[18px] font-extrabold text-on-surface">{detailUserOrders.filter(o=>o.status==='processing').length}</p><p className="text-[10px] text-on-surface-variant">Processing</p></div>
                    <div className="bg-error-container/40 rounded-[16px] p-3 text-center"><p className="text-[18px] font-extrabold text-on-surface">{detailUserOrders.filter(o=>o.status==='cancelled').length}</p><p className="text-[10px] text-on-surface-variant">Cancelled</p></div>
                  </div>
                  {detailUserOrders.map((o, idx) => (
                    <div key={idx} className="bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-surface-container/60 transition-colors" onClick={() => {
                        const el = document.getElementById(`ord-${idx}`);
                        const chev = document.getElementById(`chev-${idx}`);
                        if (el && chev) {
                          const open = el.style.maxHeight && el.style.maxHeight !== '0px';
                          el.style.maxHeight = open ? '0px' : '600px';
                          el.style.opacity = open ? '0' : '1';
                          chev.style.transform = open ? '' : 'rotate(180deg)';
                        }
                      }}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                              {o.status === 'delivered' ? 'check_circle' : o.status === 'cancelled' ? 'cancel' : 'autorenew'}
                            </span>
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-on-surface">{o.oid}</p>
                            <p className="text-[11px] text-on-surface-variant">{o.date} · {o.items.length} item{o.items.length > 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right hidden sm:block">
                            <p className="text-[14px] font-extrabold text-on-surface">৳{o.total.toLocaleString()}</p>
                            <span className={`text-[10px] font-bold capitalize px-2 py-0.5 rounded-full ${statusColors[o.status] || ''}`}>{o.status}</span>
                          </div>
                          <span className="material-symbols-outlined text-[20px] text-on-surface-variant transition-transform" id={`chev-${idx}`}>expand_more</span>
                        </div>
                      </div>
                      <div id={`ord-${idx}`} className="order-expand max-h-0 opacity-0">
                        <div className="px-4 pb-4 pt-1 space-y-2 border-t border-outline-variant/15">
                          {o.items.map((it, iidx) => (
                            <div key={iidx} className="flex items-center gap-3 bg-surface-container rounded-[14px] px-3 py-2.5">
                              <span className="text-[22px]">{it.emoji}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-semibold text-on-surface truncate">{it.name}</p>
                                <p className="text-[11px] text-on-surface-variant">{it.cat} · Qty: {it.qty} · ৳{it.price.toLocaleString()} each</p>
                              </div>
                              <p className="text-[13px] font-bold text-on-surface shrink-0">৳{(it.price * it.qty).toLocaleString()}</p>
                            </div>
                          ))}
                          <div className="flex items-center justify-between pt-2 border-t border-outline-variant/15 px-1">
                            <span className="text-[12px] text-on-surface-variant">Subtotal &nbsp;<span className="sm:hidden font-semibold text-on-surface">· <span className={`${statusColors[o.status]} px-2 py-0.5 rounded-full text-[10px] font-bold capitalize`}>{o.status}</span></span></span>
                            <span className="text-[15px] font-extrabold text-on-surface">৳{o.total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {detailUserOrders.length === 0 && <div className="text-center py-12 text-on-surface-variant"><span className="material-symbols-outlined text-[40px] block mb-2 opacity-30">receipt_long</span>No orders yet</div>}
                </div>
              )}

              {curTab === 'products' && (
                <div className="p-5 md:p-6 space-y-4">
                  {(() => {
                    const freq: Record<string, any> = {};
                    detailUserOrders.forEach(o => o.items.forEach(it => {
                      if (!freq[it.id]) freq[it.id] = { ...it, count: 0, totalQty: 0, totalSpent: 0 };
                      freq[it.id].count++; freq[it.id].totalQty += it.qty; freq[it.id].totalSpent += it.price * it.qty;
                    }));
                    const sorted = Object.values(freq).sort((a, b) => b.totalQty - a.totalQty);
                    const maxQty = sorted[0]?.totalQty || 1;
                    const totalSpent = detailUserOrders.reduce((s, o) => s + o.total, 0);

                    if (sorted.length === 0) return <div className="text-center py-12 text-on-surface-variant"><span className="material-symbols-outlined text-[40px] block mb-2 opacity-30">inventory_2</span>No purchases yet</div>;

                    return (
                      <>
                        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-5">
                          <h4 className="font-bold text-[14px] text-on-surface mb-1 flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-primary">bar_chart</span>Purchase Breakdown</h4>
                          <p className="text-[12px] text-on-surface-variant mb-4">{sorted.length} unique products · ৳{totalSpent.toLocaleString()} total</p>
                          <div className="space-y-3">
                            {sorted.map((p, i) => {
                              const pct = Math.round((p.totalQty / maxQty) * 100);
                              const barColors = ['bg-primary', 'bg-tertiary', 'bg-secondary', 'bg-[#b8860b]', 'bg-primary-container'];
                              return (
                                <div key={p.id}>
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-[18px]">{p.emoji}</span>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-0.5">
                                        <p className="text-[12px] font-semibold text-on-surface truncate pr-2">{p.name}</p>
                                        <span className="text-[11px] font-bold text-on-surface-variant shrink-0">×{p.totalQty}</span>
                                      </div>
                                      <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                                        <div className={`${barColors[i % barColors.length]} h-full rounded-full transition-all duration-700`} style={{ width: `${pct}%` }}></div>
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0 min-w-[70px]">
                                      <p className="text-[12px] font-bold text-on-surface">৳{p.totalSpent.toLocaleString()}</p>
                                      <p className="text-[10px] text-on-surface-variant">{p.count} order{p.count > 1 ? 's' : ''}</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-5">
                          <h4 className="font-bold text-[14px] text-on-surface mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-secondary">category</span>Category Breakdown</h4>
                          {(() => {
                            const cats: Record<string, { spent: number; qty: number }> = {};
                            sorted.forEach(p => { if (!cats[p.cat]) cats[p.cat] = { spent: 0, qty: 0 }; cats[p.cat].spent += p.totalSpent; cats[p.cat].qty += p.totalQty; });
                            const catArr = Object.entries(cats).sort((a, b) => b[1].spent - a[1].spent);
                            const maxS = catArr[0]?.[1]?.spent || 1;
                            const catColors = ['bg-primary', 'bg-secondary', 'bg-tertiary', 'bg-[#b8860b]'];
                            return catArr.map((c, i) => (
                              <div key={c[0]} className="flex items-center gap-3 mb-3">
                                <span className="text-[11px] font-semibold text-on-surface-variant w-20 shrink-0">{c[0]}</span>
                                <div className="flex-1 h-3 bg-surface-container rounded-full overflow-hidden">
                                  <div className={`${catColors[i % 4]} h-full rounded-full`} style={{ width: `${Math.round(c[1].spent / maxS * 100)}%` }}></div>
                                </div>
                                <span className="text-[12px] font-bold text-on-surface shrink-0 w-24 text-right">৳{c[1].spent.toLocaleString()}</span>
                              </div>
                            ));
                          })()}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {curTab === 'points' && (
                <div className="p-5 md:p-6 space-y-4">
                  <div className={`bg-gradient-to-br ${{ gold: 'from-[#b8860b] to-[#daa520]', platinum: 'from-tertiary to-[#4d8fa6]', standard: 'from-on-surface-variant to-outline' }[detailUser.tier] || 'from-on-surface-variant to-outline'} rounded-[24px] p-6 relative overflow-hidden shadow-lg`}>
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-[28px] border-white/10"></div>
                    <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full border-[20px] border-black/5"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-white/80 text-[22px]">toll</span>
                        <span className="text-[11px] font-bold text-white/70 uppercase tracking-widest">Loyalty Points</span>
                      </div>
                      <p className="text-[52px] font-extrabold text-white leading-none tracking-tight mb-1">{detailUser.points.toLocaleString()}</p>
                      {(() => {
                        const tierThresholds = { standard: { min: 0, max: 1500, next: 'Gold' }, gold: { min: 1500, max: 3000, next: 'Platinum' }, platinum: { min: 3000, max: 3000, next: null } };
                        const t = tierThresholds[detailUser.tier] || tierThresholds.standard;
                        const pctToNext = t.next ? Math.min(100, Math.round((detailUser.points - t.min) / (t.max - t.min) * 100)) : 100;
                        return (
                          <>
                            <p className="text-[13px] text-white/60 mb-5">{t.next ? `${(t.max - detailUser.points).toLocaleString()} more to reach ${t.next}` : 'Maximum tier reached 🎉'}</p>
                            {t.next && (
                              <div className="mb-2">
                                <div className="flex justify-between items-center mb-1.5">
                                  <span className="text-[10px] text-white/60 uppercase font-bold tracking-wider">{detailUser.tier.charAt(0).toUpperCase() + detailUser.tier.slice(1)}</span>
                                  <span className="text-[10px] text-white/80 uppercase font-bold tracking-wider">{t.next}</span>
                                </div>
                                <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                                  <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${pctToNext}%` }}></div>
                                </div>
                                <p className="text-[11px] text-white/50 mt-1.5 text-right">{detailUser.points.toLocaleString()} / {t.max.toLocaleString()}</p>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-5">
                    <h4 className="font-bold text-[15px] text-on-surface mb-1 flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-primary">edit</span>Adjust Points</h4>
                    <p className="text-[12px] text-on-surface-variant mb-4">Manually add, remove, or set user loyalty points</p>
                    <div className="flex items-center gap-3 mb-4">
                      <button onClick={() => setPtsInput(prev => Math.max(0, prev - 100))} className="pts-btn w-11 h-11 rounded-full bg-error-container text-error flex items-center justify-center font-bold text-[18px] hover:bg-error/20 transition-colors">−</button>
                      <div className="flex-1 relative">
                        <input type="number" value={ptsInput} onChange={(e) => setPtsInput(parseInt(e.target.value) || 0)} min="0" className="w-full bg-surface-container border-2 border-primary rounded-xl px-4 py-3 text-[20px] font-extrabold text-center text-on-surface focus:ring-0 focus:border-primary outline-none transition"/>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">pts</span>
                      </div>
                      <button onClick={() => setPtsInput(prev => prev + 100)} className="pts-btn w-11 h-11 rounded-full bg-secondary-fixed/50 text-secondary flex items-center justify-center font-bold text-[18px] hover:bg-secondary/20 transition-colors">+</button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <p className="w-full text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Quick adjust</p>
                      {[[-500, 'Remove 500', true], [-100, 'Remove 100', true], [+100, 'Add 100', false], [+250, 'Add 250', false], [+500, 'Add 500', false], [+1000, 'Add 1000', false]].map(([v, lbl, neg]) => (
                        <button key={lbl as string} onClick={() => setPtsInput(prev => Math.max(0, prev + (v as number)))} className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-colors ${neg ? 'border-error/40 text-error hover:bg-error-container' : 'border-secondary/40 text-secondary hover:bg-secondary-container/50'}`}>{lbl as string}</button>
                      ))}
                    </div>
                    <div className="mb-4">
                      <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Reason (optional)</label>
                      <input type="text" placeholder="e.g. Manual compensation, Referral bonus…" className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[13px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition" value={ptsReason} onChange={(e) => setPtsReason(e.target.value)}/>
                    </div>
                    <button onClick={() => savePoints(detailUser.id)} className="w-full bg-primary text-on-primary text-[14px] font-bold py-3 rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">save</span>Save Points
                    </button>
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-5">
                    <h4 className="font-bold text-[14px] text-on-surface mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-[#b8860b]">workspace_premium</span>Tier Overview</h4>
                    <div className="space-y-2">
                      {[
                        { t: 'standard', label: 'Standard', pts: '0 – 1,499', grad: 'bg-on-surface-variant' },
                        { t: 'gold', label: '🥇 Gold', pts: '1,500 – 2,999', grad: 'bg-[#daa520]' },
                        { t: 'platinum', label: '💎 Platinum', pts: '3,000+', grad: 'bg-tertiary' }
                      ].map(tr => (
                        <div key={tr.t} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${detailUser.tier === tr.t ? 'bg-primary-fixed/30 border border-primary-fixed-dim/50' : 'bg-surface-container/50'}`}>
                          <div className={`w-2.5 h-2.5 rounded-full ${tr.grad} shrink-0`}></div>
                          <div className="flex-1"><p className="text-[13px] font-semibold text-on-surface">{tr.label}</p><p className="text-[11px] text-on-surface-variant">{tr.pts} pts</p></div>
                          {detailUser.tier === tr.t && <span className="text-[10px] font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded-full">CURRENT</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {curTab === 'activity' && (
                <div className="p-5 md:p-6 space-y-4">
                  <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-5">
                    <h4 className="font-bold text-[14px] text-on-surface mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-primary">timeline</span>Activity Timeline</h4>
                    <div className="relative">
                      <div className="absolute left-5 top-0 bottom-0 w-px bg-outline-variant/30"></div>
                      <div className="space-y-4">
                        {[
                          { icon: 'login', color: 'text-tertiary', bg: 'bg-tertiary-fixed/50', title: 'Logged in', desc: detailUser.device, time: detailUser.lastLogin },
                          ...detailUserOrders.slice(0, 6).map(o => ({
                            icon: o.status === 'delivered' ? 'check_circle' : o.status === 'cancelled' ? 'cancel' : 'autorenew',
                            color: o.status === 'delivered' ? 'text-secondary' : o.status === 'cancelled' ? 'text-error' : 'text-primary',
                            bg: o.status === 'delivered' ? 'bg-secondary-fixed/50' : o.status === 'cancelled' ? 'bg-error-container' : 'bg-primary-fixed/50',
                            title: `Order ${o.oid}`,
                            desc: `${o.status.charAt(0).toUpperCase() + o.status.slice(1)} · ৳${o.total.toLocaleString()}`,
                            time: o.date
                          })),
                          { icon: 'person_add', color: 'text-primary', bg: 'bg-primary-fixed/50', title: 'Account Created', desc: 'Registered on Shuddhota Co.', time: detailUser.joined }
                        ].map((ev, i) => (
                          <div key={i} className="flex items-start gap-4 relative">
                            <div className={`w-10 h-10 rounded-full ${ev.bg} flex items-center justify-center shrink-0 z-10 ring-4 ring-background`}>
                              <span className={`material-symbols-outlined text-[18px] ${ev.color}`}>{ev.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0 pt-1">
                              <div className="flex items-start justify-between gap-2">
                                <div><p className="text-[13px] font-semibold text-on-surface">{ev.title}</p><p className="text-[11px] text-on-surface-variant mt-0.5">{ev.desc}</p></div>
                                <span className="text-[10px] text-on-surface-variant whitespace-nowrap shrink-0 mt-0.5">{ev.time}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-5">
                    <h4 className="font-bold text-[14px] text-on-surface mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-secondary">query_stats</span>Session Info</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-surface-container rounded-[14px] p-3"><p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Last Login</p><p className="text-[13px] font-semibold text-on-surface">{detailUser.lastLogin}</p></div>
                      <div className="bg-surface-container rounded-[14px] p-3"><p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Device</p><p className="text-[13px] font-semibold text-on-surface">{detailUser.device}</p></div>
                      <div className="bg-surface-container rounded-[14px] p-3"><p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Member Since</p><p className="text-[13px] font-semibold text-on-surface">{detailUser.joined}</p></div>
                      <div className="bg-surface-container rounded-[14px] p-3"><p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total Orders</p><p className="text-[13px] font-semibold text-on-surface">{detailUser.orders}</p></div>
                    </div>
                  </div>
                </div>
              )}

              {curTab === 'notes' && (
                <div className="p-5 md:p-6 space-y-4">
                  <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-5">
                    <h4 className="font-bold text-[14px] text-on-surface mb-1 flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-primary">sticky_note_2</span>Admin Notes</h4>
                    <p className="text-[12px] text-on-surface-variant mb-4">Private notes visible only to admin staff</p>
                    <textarea 
                      rows={6} 
                      placeholder="Add a note about this user…" 
                      className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-[13px] text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none transition resize-none"
                      defaultValue={detailUser.note}
                      onChange={(e) => {
                        const val = e.target.value;
                        setUsers(prev => prev.map(u => u.id === detailUserId ? { ...u, note: val } : u));
                      }}
                    />
                    <button onClick={() => showToast('Note saved', 'sticky_note_2')} className="mt-3 w-full bg-primary text-on-primary text-[13px] font-semibold py-3 rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">save</span>Save Note
                    </button>
                  </div>
                  <div className="bg-error-container/30 border border-error/20 rounded-[20px] p-5">
                    <h4 className="font-bold text-[14px] text-error mb-3 flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">warning</span>Danger Zone</h4>
                    <div className="space-y-2">
                      <button onClick={() => toggleUserStatus(detailUser.id)} className="w-full flex items-center gap-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 hover:bg-error-container/50 transition-colors text-left">
                        <span className="material-symbols-outlined text-error text-[20px]">{detailUser.status === 'active' ? 'block' : 'check_circle'}</span>
                        <div><p className="text-[13px] font-semibold text-on-surface">{detailUser.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}</p><p className="text-[11px] text-on-surface-variant">{detailUser.status === 'active' ? 'Block user from logging in' : 'Restore access'}</p></div>
                      </button>
                      <button onClick={() => { deleteUser(detailUser.id); closeDetail(); }} className="w-full flex items-center gap-3 bg-surface-container-lowest border border-error/30 rounded-xl px-4 py-3 hover:bg-error-container transition-colors text-left">
                        <span className="material-symbols-outlined text-error text-[20px]">delete_forever</span>
                        <div><p className="text-[13px] font-semibold text-error">Delete Account</p><p className="text-[11px] text-on-surface-variant">Permanently remove this user</p></div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* MODAL */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[70] transition-opacity flex items-center justify-center p-4 ${isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsModalOpen(false)}
      >
        <div 
          className={`bg-surface-container-lowest rounded-[24px] border border-outline-variant/30 shadow-2xl w-full max-w-md transition-transform transform ${isModalOpen ? 'scale-100' : 'scale-95'}`} 
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
            <h3 className="font-bold text-[18px] text-on-surface">{editingUserId ? 'Edit User' : 'Add New User'}</h3>
            <button onClick={() => setIsModalOpen(false)} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">First Name</label><input type="text" placeholder="Raqib" className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[13px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition" value={fName} onChange={(e) => setFName(e.target.value)}/></div>
              <div><label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Last Name</label><input type="text" placeholder="Karim" className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[13px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition" value={lName} onChange={(e) => setLName(e.target.value)}/></div>
            </div>
            <div><label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Email</label><input type="email" placeholder="user@example.com" className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[13px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition" value={email} onChange={(e) => setEmail(e.target.value)}/></div>
            <div><label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Phone</label><input type="text" placeholder="+880 1700-000000" className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[13px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition" value={phone} onChange={(e) => setPhone(e.target.value)}/></div>
            <div><label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Address</label><input type="text" placeholder="Dhaka, Bangladesh" className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[13px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition" value={addr} onChange={(e) => setAddr(e.target.value)}/></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Role</label>
                <select className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[13px] focus:ring-1 focus:ring-primary outline-none transition" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="customer">Customer</option><option value="staff">Staff</option><option value="admin">Admin</option>
                </select>
              </div>
              <div><label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Status</label>
                <select className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[13px] focus:ring-1 focus:ring-primary outline-none transition" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="active">Active</option><option value="suspended">Suspended</option><option value="pending">Pending</option>
                </select>
              </div>
            </div>
            <div><label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Password</label><input type="password" placeholder="••••••••" className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[13px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition" value={pass} onChange={(e) => setPass(e.target.value)}/></div>
          </div>
          <div className="flex items-center gap-3 px-6 py-4 border-t border-outline-variant/20">
            <button onClick={() => setIsModalOpen(false)} className="flex-1 border border-outline-variant/40 text-on-surface text-[13px] font-medium py-2.5 rounded-full hover:bg-surface-container transition-colors">Cancel</button>
            <button onClick={saveUser} className="flex-1 bg-primary text-on-primary text-[13px] font-semibold py-2.5 rounded-full hover:bg-primary/90 transition-colors"><span>{editingUserId ? 'Save Changes' : 'Create User'}</span></button>
          </div>
        </div>
      </div>

      {/* TOAST */}
      <div id="toast" className={`fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-inverse-surface text-inverse-on-surface text-[13px] font-medium px-5 py-3 rounded-full shadow-lg z-[100] transition-all duration-300 ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <span className="material-symbols-outlined text-[18px]">{toast.icon}</span>
        <span>{toast.msg}</span>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/20 flex items-center justify-around px-2 py-2 z-30 lg:hidden">
        <a href="/admin" className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-on-surface-variant"><span className="material-symbols-outlined text-[22px]">dashboard</span><span className="text-[9px] font-semibold">Home</span></a>
        <button className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-on-surface-variant"><span className="material-symbols-outlined text-[22px]">inventory_2</span><span className="text-[9px] font-semibold">Products</span></button>
        <button className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-on-surface-variant"><span className="material-symbols-outlined text-[22px]">receipt_long</span><span className="text-[9px] font-semibold">Orders</span></button>
        <button className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-primary"><span className="material-symbols-outlined text-[22px]">group</span><span className="text-[9px] font-semibold">Users</span></button>
        <button onClick={toggleAdminSidebar} className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-on-surface-variant"><span className="material-symbols-outlined text-[22px]">menu</span><span className="text-[9px] font-semibold">More</span></button>
      </nav>
    </div>
  );
}
