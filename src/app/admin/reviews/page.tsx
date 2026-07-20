"use client";

import { useEffect, useState } from "react";
import AdminSidebar, { toggleAdminSidebar, toggleAdminMini } from "@/components/AdminSidebar";

interface Review {
  id: number;
  name: string;
  initials: string;
  color: number;
  product: string;
  content: string;
  rating: number;
  date: string;
  status: 'approved' | 'pending' | 'banned';
}

const AVATAR_COLORS = [
  'bg-primary-fixed text-on-primary-container',
  'bg-secondary-fixed text-on-secondary-container',
  'bg-tertiary-fixed text-on-tertiary-container',
  'bg-surface-variant text-on-surface-variant',
  'bg-primary-fixed-dim text-on-primary-container',
];

const INITIAL_REVIEWS: Review[] = [
  {id:1,  name:'Nadia Karim',      initials:'NK', color:0, product:'Biryani Masala',     content:'Best spices I\'ve ever used! The aroma is incredible — freshly packed and delivered right on time.',                       rating:5, date:'2 Jun 2025', status:'approved'},
  {id:2,  name:'Mosharraf Hossain',initials:'MH', color:1, product:'Yellow Moong Dal',   content:'Delivery was quick and Dal quality is genuine and unadulterated. Will definitely order again next month.',                  rating:4, date:'1 Jun 2025', status:'approved'},
  {id:3,  name:'Sumaiya Parvin',   initials:'SP', color:2, product:'Green Cardamom',     content:'Cardamom is so fragrant! Nothing like the ones from supermarkets. Absolutely fresh and pure.',                             rating:5, date:'28 May 2025',status:'approved'},
  {id:4,  name:'Tanvir Rahman',    initials:'TR', color:3, product:'Turmeric Powder',    content:'Color and texture is perfect. I\'ve been searching for pure turmeric for years — finally found it here at Shuddhota.',     rating:5, date:'25 May 2025',status:'approved'},
  {id:5,  name:'Rehana Begum',     initials:'RB', color:4, product:'Mustard Oil',        content:'Smell is authentic. Reminds me of my grandmother\'s kitchen. Packaging could be slightly improved though.',                 rating:4, date:'22 May 2025',status:'pending'},
  {id:6,  name:'Jahid Ul Islam',   initials:'JU', color:0, product:'Chili Powder',       content:'A bit too spicy for my taste but the quality is undeniable. Great for people who like heat in their food.',                rating:3, date:'20 May 2025',status:'pending'},
  {id:7,  name:'Fariha Akter',     initials:'FA', color:1, product:'Coriander Seeds',    content:'Excellent product. I use these every single day for cooking and they never disappoint. Highly recommended.',                rating:5, date:'17 May 2025',status:'approved'},
  {id:8,  name:'Mahfuz Khan',      initials:'MK', color:2, product:'Basmati Rice',       content:'Rice quality is subpar. Found small stones in the bag. Very disappointed with this purchase. Requesting refund.',           rating:1, date:'14 May 2025',status:'banned'},
  {id:9,  name:'Shirin Nessa',     initials:'SN', color:3, product:'Dried Mango',        content:'Not as described. Very sour and not properly dried. The packaging was also torn on arrival. Unacceptable.',                 rating:2, date:'10 May 2025',status:'banned'},
  {id:10, name:'Kamal Hossain',    initials:'KH', color:4, product:'Biryani Masala',     content:'Repeat customer here! Always consistent quality. I trust this brand completely for all my spice needs now.',               rating:5, date:'7 May 2025', status:'approved'},
  {id:11, name:'Roksana Islam',    initials:'RI', color:0, product:'Black Pepper Whole', content:'Premium quality. No filler material, pure whole peppercorns. A bit pricier than market but absolutely worth every taka.',  rating:5, date:'4 May 2025', status:'approved'},
  {id:12, name:'Delwar Mia',       initials:'DM', color:1, product:'Cumin Seeds',        content:'Smells very fresh, tastes completely authentic. Very happy with this purchase. Fast delivery as well.',                     rating:4, date:'30 Apr 2025',status:'approved'},
  {id:13, name:'Parvin Sultana',   initials:'PS', color:2, product:'Garam Masala',       content:'Blend is slightly off — too much clove dominance. Expected a more balanced profile from a premium product line.',           rating:3, date:'26 Apr 2025',status:'pending'},
  {id:14, name:'Nasima Tuli',      initials:'NT', color:3, product:'Cloves Whole',       content:'Perfect for tea and biryani. Aromatic and beautifully clean. Exactly what I expect from Shuddhota Co. every time.',        rating:5, date:'20 Apr 2025',status:'approved'},
  {id:15, name:'Babul Roy',        initials:'BR', color:4, product:'Sesame Seeds',       content:'Creamy and wonderfully nutty. Used for making tahini at home and the result was absolutely amazing. High quality.',         rating:5, date:'15 Apr 2025',status:'approved'},
  {id:16, name:'Khaleda Mitu',     initials:'KM', color:0, product:'Turmeric Powder',    content:'Bought for the second time now. Consistent quality every order. Will keep buying as long as this quality is maintained.',   rating:4, date:'10 Apr 2025',status:'approved'},
  {id:17, name:'Shahedul Islam',   initials:'SI', color:1, product:'Poppy Seeds',        content:'Good product overall. Arrived well packaged and sealed. Will try more products from this store in future.',                  rating:4, date:'5 Apr 2025', status:'pending'},
  {id:18, name:'Arif Chowdhury',   initials:'AC', color:2, product:'Fennel Seeds',       content:'Seeds look and smell fresh. Nice packaging. Only downside is the quantity was a little less than expected for the price.',  rating:3, date:'1 Apr 2025', status:'pending'},
];

const PER_PAGE = 8;

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSearch, setCurrentSearch] = useState('');
  const [starFilter, setStarFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [currentRating, setCurrentRating] = useState(5);
  const [toast, setToast] = useState<{ icon: string; msg: string; show: boolean }>({ icon: '', msg: '', show: false });
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
  }, []);

  const showToast = (icon: string, msg: string) => {
    setToast({ icon, msg, show: true });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 2600);
  };

  const getFiltered = () => {
    const q = currentSearch.toLowerCase();
    return reviews.filter(r => {
      if (currentFilter !== 'all' && r.status !== currentFilter) return false;
      if (starFilter && r.rating !== parseInt(starFilter)) return false;
      if (q && !r.name.toLowerCase().includes(q) && !r.product.toLowerCase().includes(q) && !r.content.toLowerCase().includes(q)) return false;
      return true;
    });
  };

  const filtered = getFiltered();
  const total = filtered.length;
  const maxPage = Math.max(1, Math.ceil(total / PER_PAGE));
  const slice = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const stats = {
    total: reviews.length,
    approved: reviews.filter(r => r.status === 'approved').length,
    pending: reviews.filter(r => r.status === 'pending').length,
    banned: reviews.filter(r => r.status === 'banned').length,
  };

  const starsHTML = (n: number, size = 'text-[13px]') => {
    return (
      <span className={`text-primary ${size}`}>
        {'★'.repeat(n)}
        <span className="opacity-25">{'★'.repeat(5 - n)}</span>
      </span>
    );
  };

  const statusBadge = (s: string) => {
    if (s === 'approved') return (
      <span className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2.5 py-1 rounded-full">
        <span className="material-symbols-outlined text-[11px]">check_circle</span>Approved
      </span>
    );
    if (s === 'banned') return (
      <span className="inline-flex items-center gap-1 bg-error-container text-error text-[10px] font-bold px-2.5 py-1 rounded-full">
        <span className="material-symbols-outlined text-[11px]">block</span>Banned
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1 bg-primary-fixed text-on-primary-container text-[10px] font-bold px-2.5 py-1 rounded-full badge-pulse">
        <span className="material-symbols-outlined text-[11px]">schedule</span>Pending
      </span>
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(selectedIds);
      slice.forEach(r => newSelected.add(r.id));
      setSelectedIds(newSelected);
    } else {
      const newSelected = new Set(selectedIds);
      slice.forEach(r => newSelected.delete(r.id));
      setSelectedIds(newSelected);
    }
  };

  const toggleOne = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) newSelected.add(id);
    else newSelected.delete(id);
    setSelectedIds(newSelected);
  };

  const quickStatus = (id: number, status: 'approved' | 'pending' | 'banned') => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    const labels = { approved: 'Approved', banned: 'Banned', pending: 'Set to Pending' };
    const icons = { approved: 'check_circle', banned: 'block', pending: 'schedule' };
    showToast(icons[status], labels[status]);
  };

  const bulkAction = (action: 'approved' | 'pending' | 'banned' | 'delete') => {
    if (selectedIds.size === 0) return;
    if (action === 'delete') {
      setReviews(prev => prev.filter(r => !selectedIds.has(r.id)));
      showToast('delete', 'Reviews deleted');
    } else {
      setReviews(prev => prev.map(r => selectedIds.has(r.id) ? { ...r, status: action } : r));
      showToast('check_circle', 'Reviews ' + (action === 'approved' ? 'approved' : 'banned'));
    }
    setSelectedIds(new Set());
  };

  const openModal = (mode: 'add' | 'edit', id?: number) => {
    if (mode === 'edit' && id != null) {
      const r = reviews.find(x => x.id === id);
      if (r) {
        setEditingReview(r);
        setCurrentRating(r.rating);
        setIsModalOpen(true);
      }
    } else {
      setEditingReview(null);
      setCurrentRating(5);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingReview(null);
  };

  const saveReview = () => {
    const nameInput = (document.getElementById('modal-name') as HTMLInputElement).value.trim();
    const productInput = (document.getElementById('modal-product') as HTMLInputElement).value.trim();
    const contentInput = (document.getElementById('modal-content') as HTMLTextAreaElement).value.trim();
    const statusInput = (document.getElementById('modal-status') as HTMLSelectElement).value as any;

    if (!nameInput || !productInput || !contentInput) {
      document.getElementById('modal-error')?.classList.remove('hidden');
      return;
    }

    if (editingReview) {
      setReviews(prev => prev.map(r => r.id === editingReview.id ? {
        ...r,
        name: nameInput,
        product: productInput,
        content: contentInput,
        rating: currentRating,
        status: statusInput,
        initials: nameInput.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
      } : r));
      showToast('edit', 'Review updated');
    } else {
      const newReview: Review = {
        id: Date.now(),
        name: nameInput,
        initials: nameInput.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase(),
        color: Math.floor(Math.random() * 5),
        product: productInput,
        content: contentInput,
        rating: currentRating,
        date: 'Today',
        status: statusInput
      };
      setReviews(prev => [newReview, ...prev]);
      showToast('add_circle', 'Review added');
    }
    closeModal();
  };

  const openDelModal = (id: number) => {
    setPendingDeleteId(id);
    setIsDelModalOpen(true);
  };

  const confirmDelete = () => {
    if (pendingDeleteId != null) {
      setReviews(prev => prev.filter(r => r.id !== pendingDeleteId));
      showToast('delete', 'Review deleted');
    }
    setIsDelModalOpen(false);
    setPendingDeleteId(null);
  };

  const isAllSelected = slice.length > 0 && slice.every(r => selectedIds.has(r.id));
  const isSomeSelected = slice.some(r => selectedIds.has(r.id)) && !isAllSelected;

  return (
    <div className="bg-background text-on-background font-sans antialiased overflow-x-hidden min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined{font-family:'Material Symbols Outlined';font-weight:normal;font-style:normal;font-size:24px;line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;direction:ltr;-webkit-font-smoothing:antialiased;}
        .stat-card{transition:transform .2s,box-shadow .2s;}.stat-card:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(159,65,34,.10);}
        .trow{transition:background .15s;}.trow:hover{background:rgba(248,243,234,.9);}
        .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        .badge-pulse{animation:pulse 2s cubic-bezier(.4,0,.6,1) infinite;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        .fade-up{animation:fadeUp .35s ease both;}
        .fade-up-1{animation-delay:.06s}.fade-up-2{animation-delay:.12s}.fade-up-3{animation-delay:.18s}.fade-up-4{animation-delay:.24s}
        .star-btn{cursor:pointer;transition:color .15s,transform .15s;}.star-btn:hover{transform:scale(1.2);}
        .filt-btn.active{background:#9f4122;color:#fff;}
        .filt-btn{transition:background .15s,color .15s;}
      ` }} />

      <AdminSidebar pendingReviews={stats.pending} />

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
              <span className="text-on-surface font-semibold">Reviews</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 bg-surface-container rounded-full px-4 py-2 border border-outline-variant/30 w-48 xl:w-60">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
              <input 
                type="text" 
                placeholder="Search anything…" 
                className="bg-transparent text-[13px] placeholder:text-outline border-none focus:ring-0 w-full p-0"
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

        <main className="flex-1 p-4 md:p-6 xl:p-8 space-y-6 pb-24 lg:pb-8">
          <div className="fade-up flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-[24px] md:text-[30px] font-extrabold text-on-surface tracking-tight">Customer Reviews</h1>
              <p className="text-[13px] text-on-surface-variant mt-0.5">View, approve, ban, edit and delete customer reviews</p>
            </div>
            <button onClick={() => openModal('add')} className="flex items-center gap-2 bg-primary text-white text-[13px] font-semibold px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors shadow-md shrink-0 self-start sm:self-auto">
              <span className="material-symbols-outlined text-[17px]">add</span>Add Review
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 fade-up fade-up-1">
            <div className="stat-card bg-surface-container-lowest border border-outline-variant/30 rounded-[18px] p-4 shadow-sm cursor-pointer" onClick={() => setCurrentFilter('all')}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Total</span>
                <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant text-[16px]">reviews</span>
                </div>
              </div>
              <div className="text-[28px] font-extrabold text-on-surface leading-none">{stats.total}</div>
              <div className="text-[11px] text-on-surface-variant mt-1">All reviews</div>
            </div>
            <div className="stat-card bg-surface-container-lowest border border-outline-variant/30 rounded-[18px] p-4 shadow-sm cursor-pointer" onClick={() => setCurrentFilter('approved')}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Approved</span>
                <div className="w-8 h-8 rounded-xl bg-secondary-container/50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                </div>
              </div>
              <div className="text-[28px] font-extrabold text-secondary leading-none">{stats.approved}</div>
              <div className="text-[11px] text-on-surface-variant mt-1">Published live</div>
            </div>
            <div className="stat-card bg-surface-container-lowest border border-outline-variant/30 rounded-[18px] p-4 shadow-sm cursor-pointer" onClick={() => setCurrentFilter('pending')}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Pending</span>
                <div className="w-8 h-8 rounded-xl bg-primary-fixed/60 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[16px] badge-pulse">schedule</span>
                </div>
              </div>
              <div className="text-[28px] font-extrabold text-primary leading-none badge-pulse">{stats.pending}</div>
              <div className="text-[11px] text-on-surface-variant mt-1">Awaiting review</div>
            </div>
            <div className="stat-card bg-surface-container-lowest border border-outline-variant/30 rounded-[18px] p-4 shadow-sm cursor-pointer" onClick={() => setCurrentFilter('banned')}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Banned</span>
                <div className="w-8 h-8 rounded-xl bg-error-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-error text-[16px]">block</span>
                </div>
              </div>
              <div className="text-[28px] font-extrabold text-error leading-none">{stats.banned}</div>
              <div className="text-[11px] text-on-surface-variant mt-1">Hidden from store</div>
            </div>
          </div>

          <div className="fade-up fade-up-2 bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-4 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 bg-surface-container border border-outline-variant/30 rounded-full px-4 py-2.5 flex-1">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px] shrink-0">search</span>
                <input 
                  type="text" 
                  placeholder="Search by reviewer, product, or content…"
                  value={currentSearch}
                  onChange={(e) => setCurrentSearch(e.target.value)}
                  className="bg-transparent text-[13px] text-on-surface placeholder:text-outline border-none focus:ring-0 w-full p-0"
                />
                {currentSearch && (
                  <button onClick={() => setCurrentSearch('')} className="text-on-surface-variant hover:text-on-surface">
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
              </div>
              <select 
                value={starFilter} 
                onChange={(e) => setStarFilter(e.target.value)}
                className="bg-surface-container border border-outline-variant/30 rounded-full px-4 py-2.5 text-[13px] font-semibold text-on-surface-variant focus:ring-primary cursor-pointer shrink-0"
              >
                <option value="">All Stars</option>
                <option value="5">★★★★★ 5 Stars</option>
                <option value="4">★★★★☆ 4 Stars</option>
                <option value="3">★★★☆☆ 3 Stars</option>
                <option value="2">★★☆☆☆ 2 Stars</option>
                <option value="1">★☆☆☆☆ 1 Star</option>
              </select>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mr-1">Status:</span>
              {['all', 'pending', 'approved', 'banned'].map(f => (
                <button 
                  key={f}
                  className={`filt-btn text-[12px] font-semibold px-4 py-1.5 rounded-full ${currentFilter === f ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}`}
                  onClick={() => setCurrentFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-outline-variant/15">
                <span className="text-[12px] font-bold text-on-surface-variant">{selectedIds.size} selected</span>
                <button onClick={() => bulkAction('approved')} className="flex items-center gap-1.5 bg-secondary-container text-on-secondary-container text-[12px] font-semibold px-3 py-1.5 rounded-full hover:opacity-80 transition-opacity">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>Approve All
                </button>
                <button onClick={() => bulkAction('banned')} className="flex items-center gap-1.5 bg-error-container text-error text-[12px] font-semibold px-3 py-1.5 rounded-full hover:opacity-80 transition-opacity">
                  <span className="material-symbols-outlined text-[14px]">block</span>Ban All
                </button>
                <button onClick={() => bulkAction('delete')} className="flex items-center gap-1.5 bg-surface-container-high text-on-surface-variant text-[12px] font-semibold px-3 py-1.5 rounded-full hover:bg-error-container hover:text-error transition-colors">
                  <span className="material-symbols-outlined text-[14px]">delete</span>Delete All
                </button>
                <button onClick={() => setSelectedIds(new Set())} className="text-[12px] text-on-surface-variant underline ml-auto">Clear</button>
              </div>
            )}
          </div>

          <div className="fade-up fade-up-3 hidden md:block bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-surface-container border-b border-outline-variant/20">
                  <tr>
                    <th className="px-5 py-3 text-left w-10">
                      <input 
                        type="checkbox" 
                        checked={isAllSelected}
                        ref={(el) => { if (el) el.indeterminate = isSomeSelected; }}
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded cursor-pointer accent-primary"
                      />
                    </th>
                    <th className="px-3 py-3 text-left text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Reviewer</th>
                    <th className="px-3 py-3 text-left text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Product</th>
                    <th className="px-3 py-3 text-left text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Review</th>
                    <th className="px-3 py-3 text-left text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Rating</th>
                    <th className="px-3 py-3 text-left text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Date</th>
                    <th className="px-3 py-3 text-left text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th className="px-3 py-3 text-left text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15">
                  {slice.map(r => (
                    <tr key={r.id} className="trow">
                      <td className="px-5 py-3.5">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.has(r.id)}
                          onChange={(e) => toggleOne(r.id, e.target.checked)}
                          className="row-cb w-4 h-4 rounded cursor-pointer accent-primary"
                        />
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full ${AVATAR_COLORS[r.color]} flex items-center justify-center text-[10px] font-extrabold shrink-0`}>{r.initials}</div>
                          <span className="font-semibold text-on-surface text-[13px] whitespace-nowrap">{r.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-[12px] text-on-surface-variant whitespace-nowrap">{r.product}</td>
                      <td className="px-3 py-3.5 text-[12px] text-on-surface-variant max-w-[200px]">
                        <p className="line-clamp-2">{r.content}</p>
                      </td>
                      <td className="px-3 py-3.5">{starsHTML(r.rating)}</td>
                      <td className="px-3 py-3.5 text-[12px] text-on-surface-variant whitespace-nowrap">{r.date}</td>
                      <td className="px-3 py-3.5">{statusBadge(r.status)}</td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-1">
                          {r.status !== 'approved' && (
                            <button title="Approve" onClick={() => quickStatus(r.id, 'approved')} className="w-7 h-7 rounded-lg bg-secondary-container text-on-secondary-container hover:opacity-75 flex items-center justify-center transition-opacity">
                              <span className="material-symbols-outlined text-[14px]">check</span>
                            </button>
                          )}
                          {r.status !== 'pending' && (
                            <button title="Set Pending" onClick={() => quickStatus(r.id, 'pending')} className="w-7 h-7 rounded-lg bg-primary-fixed text-on-primary-container hover:opacity-75 flex items-center justify-center transition-opacity">
                              <span className="material-symbols-outlined text-[14px]">schedule</span>
                            </button>
                          )}
                          {r.status !== 'banned' && (
                            <button title="Ban" onClick={() => quickStatus(r.id, 'banned')} className="w-7 h-7 rounded-lg bg-error-container text-error hover:opacity-75 flex items-center justify-center transition-opacity">
                              <span className="material-symbols-outlined text-[14px]">block</span>
                            </button>
                          )}
                          <button title="Edit" onClick={() => openModal('edit', r.id)} className="w-7 h-7 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined text-[14px]">edit</span>
                          </button>
                          <button title="Delete" onClick={() => openDelModal(r.id)} className="w-7 h-7 rounded-lg bg-surface-container text-on-surface-variant hover:bg-error-container hover:text-error flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {slice.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">rate_review</span>
                <p className="text-[15px] font-semibold text-on-surface-variant">No reviews found</p>
                <p className="text-[12px] text-outline">Try a different filter or search term</p>
              </div>
            )}
          </div>

          <div className="md:hidden space-y-3 fade-up fade-up-3">
            {slice.map(r => (
              <div key={r.id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-[18px] p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.has(r.id)}
                    onChange={(e) => toggleOne(r.id, e.target.checked)}
                    className="w-4 h-4 rounded cursor-pointer accent-primary mt-0.5 shrink-0"
                  />
                  <div className={`w-10 h-10 rounded-full ${AVATAR_COLORS[r.color]} flex items-center justify-center text-[11px] font-extrabold shrink-0`}>{r.initials}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <p className="font-bold text-on-surface text-[14px] leading-tight">{r.name}</p>
                        <p className="text-[11px] text-on-surface-variant">{r.product} · {r.date}</p>
                      </div>
                      {statusBadge(r.status)}
                    </div>
                    <div className="mb-2">{starsHTML(r.rating, 'text-[15px]')}</div>
                    <p className="text-[12px] text-on-surface-variant line-clamp-2">{r.content}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-outline-variant/15 flex-wrap">
                  {r.status !== 'approved' && (
                    <button onClick={() => quickStatus(r.id, 'approved')} className="flex items-center gap-1 text-[11px] font-semibold bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full hover:opacity-75 transition-opacity">
                      <span className="material-symbols-outlined text-[13px]">check_circle</span>Approve
                    </button>
                  )}
                  {r.status !== 'banned' && (
                    <button onClick={() => quickStatus(r.id, 'banned')} className="flex items-center gap-1 text-[11px] font-semibold bg-error-container text-error px-3 py-1.5 rounded-full hover:opacity-75 transition-opacity">
                      <span className="material-symbols-outlined text-[13px]">block</span>Ban
                    </button>
                  )}
                  {r.status !== 'pending' && (
                    <button onClick={() => quickStatus(r.id, 'pending')} className="flex items-center gap-1 text-[11px] font-semibold bg-primary-fixed text-on-primary-container px-3 py-1.5 rounded-full hover:opacity-75 transition-opacity">
                      <span className="material-symbols-outlined text-[13px]">schedule</span>Pending
                    </button>
                  )}
                  <button onClick={() => openModal('edit', r.id)} className="flex items-center gap-1 text-[11px] font-semibold bg-surface-container text-on-surface-variant px-3 py-1.5 rounded-full hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-[13px]">edit</span>Edit
                  </button>
                  <button onClick={() => openDelModal(r.id)} className="flex items-center gap-1 text-[11px] font-semibold bg-surface-container text-error px-3 py-1.5 rounded-full hover:bg-error-container transition-colors ml-auto">
                    <span className="material-symbols-outlined text-[13px]">delete</span>Delete
                  </button>
                </div>
              </div>
            ))}
            {slice.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 bg-surface-container-lowest border border-outline-variant/30 rounded-[20px]">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">rate_review</span>
                <p className="text-[15px] font-semibold text-on-surface-variant">No reviews found</p>
              </div>
            )}
          </div>

          <div className="fade-up fade-up-4 flex items-center justify-between px-1">
            <span className="text-[12px] text-on-surface-variant">
              {total === 0 ? '' : `Showing ${(currentPage - 1) * PER_PAGE + 1}–${Math.min(currentPage * PER_PAGE, total)} of ${total} reviews`}
            </span>
            <div className="flex items-center gap-1.5">
              <button disabled={currentPage <= 1} onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} className="w-8 h-8 rounded-xl border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <div className="flex gap-1">
                {Array.from({ length: maxPage }, (_, i) => i + 1).map(p => (
                  <button 
                    key={p} 
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 rounded-xl text-[12px] font-bold flex items-center justify-center transition-colors ${p === currentPage ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button disabled={currentPage >= maxPage} onClick={() => setCurrentPage(prev => Math.min(maxPage, prev + 1))} className="w-8 h-8 rounded-xl border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/40" onClick={closeModal}></div>
        <div className={`relative bg-surface-container-lowest rounded-[24px] shadow-2xl w-full max-w-lg z-10 overflow-hidden transition-all duration-300 ${isModalOpen ? 'translate-y-0 scale-100' : 'translate-y-12 scale-95'}`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
            <h2 className="text-[17px] font-extrabold text-on-surface">{editingReview ? 'Edit Review' : 'Add Review'}</h2>
            <button onClick={closeModal} className="w-8 h-8 rounded-xl hover:bg-surface-container flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Reviewer Name *</label>
                <input id="modal-name" type="text" defaultValue={editingReview?.name || ''} placeholder="e.g. Nadia K." className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[13px] text-on-surface focus:ring-primary focus:border-primary"/>
              </div>
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Product *</label>
                <input id="modal-product" type="text" defaultValue={editingReview?.product || ''} placeholder="e.g. Biryani Masala" className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[13px] text-on-surface focus:ring-primary focus:border-primary"/>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Review Content *</label>
              <textarea id="modal-content" rows={3} defaultValue={editingReview?.content || ''} placeholder="Write the review here…" className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[13px] text-on-surface focus:ring-primary focus:border-primary resize-none"></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2">Rating *</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button 
                      key={n} 
                      type="button" 
                      onClick={() => setCurrentRating(n)}
                      className={`star-btn text-[28px] ${n <= currentRating ? 'text-primary' : 'text-outline-variant'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Status</label>
                <select id="modal-status" defaultValue={editingReview?.status || 'approved'} className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[13px] text-on-surface focus:ring-primary cursor-pointer">
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
            </div>
            <p id="modal-error" className="hidden text-[12px] text-error font-medium">Please fill in all required fields.</p>
          </div>
          <div className="flex gap-3 px-6 py-4 border-t border-outline-variant/20">
            <button onClick={closeModal} className="flex-1 border border-outline-variant/40 text-on-surface-variant text-[13px] font-semibold py-2.5 rounded-full hover:bg-surface-container transition-colors">Cancel</button>
            <button onClick={saveReview} className="flex-1 bg-primary text-white text-[13px] font-semibold py-2.5 rounded-full hover:bg-primary/90 transition-colors">Save Review</button>
          </div>
        </div>
      </div>

      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isDelModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsDelModalOpen(false)}></div>
        <div className={`relative bg-surface-container-lowest rounded-[22px] shadow-2xl w-full max-w-sm z-10 p-6 text-center transition-all duration-300 ${isDelModalOpen ? 'translate-y-0 scale-100' : 'translate-y-12 scale-95'}`}>
          <div className="w-14 h-14 rounded-full bg-error-container flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-error text-[28px]">delete_forever</span>
          </div>
          <h3 className="text-[17px] font-extrabold text-on-surface mb-2">Delete this review?</h3>
          <p className="text-[13px] text-on-surface-variant mb-6">This cannot be undone. The review will be permanently removed.</p>
          <div className="flex gap-3">
            <button onClick={() => setIsDelModalOpen(false)} className="flex-1 border border-outline-variant/40 text-on-surface-variant text-[13px] font-semibold py-2.5 rounded-full hover:bg-surface-container transition-colors">Cancel</button>
            <button onClick={confirmDelete} className="flex-1 bg-error text-white text-[13px] font-semibold py-2.5 rounded-full hover:bg-error/90 transition-colors">Yes, Delete</button>
          </div>
        </div>
      </div>

      <div id="toast" className={`fixed bottom-20 lg:bottom-8 left-1/2 -translate-x-1/2 z-[100] pointer-events-none transition-all duration-300 ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
        <div className="flex items-center gap-2 bg-inverse-surface text-inverse-on-surface text-[13px] font-semibold px-5 py-3 rounded-full shadow-xl">
          <span className="material-symbols-outlined text-[16px]">{toast.icon}</span>
          <span>{toast.msg}</span>
        </div>
      </div>
    </div>
  );
}
