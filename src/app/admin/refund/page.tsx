"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import AdminSidebar, { toggleAdminSidebar, toggleAdminMini } from "@/components/AdminSidebar";

/* ══════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════ */
interface TimelineItem {
  label: string;
  time: string;
  done: boolean;
}
interface OrderItem {
  name: string;
  qty: number;
  price: number;
}
interface Customer {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  avatarColor: string;
}
interface Refund {
  id: string;
  ref: string;
  orderId: string;
  orderRef: string;
  customer: Customer;
  date: string;
  dateShort: string;
  items: OrderItem[];
  orderTotal: number;
  amount: number;
  reason: string;
  returnMethod: string;
  returnAccount: string;
  status: string;
  txnId: string | null;
  evidenceText: string;
  attachments: string[];
  notes: string;
  rejectionReason: string;
  timeline: TimelineItem[];
}

/* ══════════════════════════════════════════════
   INITIAL DATA
══════════════════════════════════════════════ */
const INITIAL_REFUNDS: Refund[] = [
  {
    id:"RFD-0008", ref:"#RFD-0008",
    orderId:"ORD-3841", orderRef:"#ORD-3841",
    customer:{ name:"Nusrat Sultana", email:"nusrat@email.com", phone:"01711-234567", avatar:"NS", avatarColor:"bg-secondary-fixed text-on-secondary-container" },
    date:"7 Jun 2025, 10:00 AM", dateShort:"7 Jun 2025",
    items:[{ name:"Biryani Masala Premium", qty:2, price:199 },{ name:"Turmeric Powder (200g)", qty:1, price:129 }],
    orderTotal:500, amount:500,
    reason:"Wrong item delivered", returnMethod:"bKash", returnAccount:"01711-234567",
    status:"Requested", txnId:null,
    evidenceText:"Customer submitted photos of the incorrect item received. Package was sealed but contents do not match order.",
    attachments:["photo_001.jpg","photo_002.jpg"], notes:"", rejectionReason:"",
    timeline:[
      { label:"Refund requested by customer", time:"7 Jun, 10:00 AM", done:true },
      { label:"Under admin review", time:"7 Jun, 10:05 AM", done:true },
      { label:"Approved", time:"—", done:false },
      { label:"Refund processed", time:"—", done:false },
      { label:"Completed", time:"—", done:false }
    ]
  },
  {
    id:"RFD-0007", ref:"#RFD-0007",
    orderId:"ORD-3840", orderRef:"#ORD-3840",
    customer:{ name:"Rahim Islam", email:"rahim@email.com", phone:"01822-345678", avatar:"RI", avatarColor:"bg-tertiary-fixed text-on-tertiary-container" },
    date:"6 Jun 2025, 3:15 PM", dateShort:"6 Jun 2025",
    items:[{ name:"Yellow Moong Dal (1kg)", qty:3, price:149 }],
    orderTotal:507, amount:507,
    reason:"Item not received", returnMethod:"Nagad", returnAccount:"01822-345678",
    status:"Requested", txnId:null,
    evidenceText:"Customer claims package was not delivered despite courier marking it as delivered. Provided address confirmation.",
    attachments:["screenshot_delivery.jpg"], notes:"", rejectionReason:"",
    timeline:[
      { label:"Refund requested by customer", time:"6 Jun, 3:15 PM", done:true },
      { label:"Under admin review", time:"6 Jun, 3:20 PM", done:true },
      { label:"Approved", time:"—", done:false },
      { label:"Refund processed", time:"—", done:false },
      { label:"Completed", time:"—", done:false }
    ]
  },
  {
    id:"RFD-0006", ref:"#RFD-0006",
    orderId:"ORD-3835", orderRef:"#ORD-3835",
    customer:{ name:"Karim Rahman", email:"karim@email.com", phone:"01966-890123", avatar:"KR", avatarColor:"bg-primary-fixed-dim text-on-primary-container" },
    date:"5 Jun 2025, 9:40 AM", dateShort:"5 Jun 2025",
    items:[{ name:"Whole Cumin Seeds (200g)", qty:1, price:159 }],
    orderTotal:219, amount:219,
    reason:"Customer changed mind", returnMethod:"bKash", returnAccount:"01966-890123",
    status:"Requested", txnId:null,
    evidenceText:"Customer cancelled order before dispatch due to change of mind. Full refund requested.",
    attachments:[], notes:"", rejectionReason:"",
    timeline:[
      { label:"Refund requested by customer", time:"5 Jun, 9:40 AM", done:true },
      { label:"Awaiting admin decision", time:"—", done:false },
      { label:"Approved / Rejected", time:"—", done:false },
      { label:"Refund processed", time:"—", done:false }
    ]
  },
  {
    id:"RFD-0005", ref:"#RFD-0005",
    orderId:"ORD-3836", orderRef:"#ORD-3836",
    customer:{ name:"Salma Begum", email:"salma@email.com", phone:"01844-789012", avatar:"SB", avatarColor:"bg-secondary-fixed text-on-secondary-container" },
    date:"4 Jun 2025, 2:00 PM", dateShort:"4 Jun 2025",
    items:[{ name:"Sona Moong Dal (1kg)", qty:2, price:189 },{ name:"Coriander Seeds (100g)", qty:1, price:99 }],
    orderTotal:429, amount:429,
    reason:"Damaged / defective product", returnMethod:"bKash", returnAccount:"01844-789012",
    status:"Requested", txnId:null,
    evidenceText:"Both moong dal packs arrived with torn packaging. Evidence photos attached.",
    attachments:["dmg_pack_01.jpg","dmg_pack_02.jpg"], notes:"VIP repeat customer — process fast", rejectionReason:"",
    timeline:[
      { label:"Refund requested by customer", time:"4 Jun, 2:00 PM", done:true },
      { label:"Awaiting admin decision", time:"—", done:false },
      { label:"Approved / Rejected", time:"—", done:false },
      { label:"Refund processed", time:"—", done:false }
    ]
  },
  {
    id:"RFD-0004", ref:"#RFD-0004",
    orderId:"ORD-3839", orderRef:"#ORD-3839",
    customer:{ name:"Fariha Akter", email:"fariha@email.com", phone:"01933-456789", avatar:"FA", avatarColor:"bg-primary-fixed text-on-primary-container" },
    date:"3 Jun 2025, 11:00 AM", dateShort:"3 Jun 2025",
    items:[{ name:"Green Cardamom Whole (50g)", qty:1, price:349 }],
    orderTotal:314, amount:314,
    reason:"Wrong item delivered", returnMethod:"bKash", returnAccount:"01933-456789",
    status:"Approved", txnId:null,
    evidenceText:"Customer received cinnamon sticks instead of cardamom. Clear mislabel in packing.",
    attachments:["wrong_item.jpg"], notes:"Confirmed mismatch. Approve full refund.", rejectionReason:"",
    timeline:[
      { label:"Refund requested by customer", time:"3 Jun, 11:00 AM", done:true },
      { label:"Evidence reviewed", time:"3 Jun, 11:30 AM", done:true },
      { label:"Approved by admin", time:"3 Jun, 12:00 PM", done:true },
      { label:"Refund being processed", time:"—", done:false },
      { label:"Completed", time:"—", done:false }
    ]
  },
  {
    id:"RFD-0003", ref:"#RFD-0003",
    orderId:"ORD-3838", orderRef:"#ORD-3838",
    customer:{ name:"Mahfuz Khan", email:"mahfuz@email.com", phone:"01677-567890", avatar:"MK", avatarColor:"bg-surface-container-high text-on-surface-variant" },
    date:"2 Jun 2025, 4:30 PM", dateShort:"2 Jun 2025",
    items:[{ name:"Mixed Dry Fruits (500g)", qty:1, price:599 },{ name:"Black Pepper Whole (100g)", qty:2, price:259 }],
    orderTotal:1006, amount:599,
    reason:"Damaged / defective product", returnMethod:"Bank Transfer", returnAccount:"CITY-0011-23456789",
    status:"Processing", txnId:null,
    evidenceText:"Dry fruits pack arrived with mold. Only the dry fruits item to be refunded, not black pepper.",
    attachments:["mold_evidence.jpg"], notes:"Partial refund only. Processed via bank transfer.", rejectionReason:"",
    timeline:[
      { label:"Refund requested by customer", time:"2 Jun, 4:30 PM", done:true },
      { label:"Evidence verified", time:"2 Jun, 5:00 PM", done:true },
      { label:"Partial refund approved (৳599)", time:"2 Jun, 5:30 PM", done:true },
      { label:"Bank transfer initiated", time:"3 Jun, 9:00 AM", done:true },
      { label:"Completed", time:"—", done:false }
    ]
  },
  {
    id:"RFD-0002", ref:"#RFD-0002",
    orderId:"ORD-3837", orderRef:"#ORD-3837",
    customer:{ name:"Tarek Hossain", email:"tarek@email.com", phone:"01555-678901", avatar:"TH", avatarColor:"bg-tertiary-fixed text-on-tertiary-container" },
    date:"1 Jun 2025, 9:00 AM", dateShort:"1 Jun 2025",
    items:[{ name:"Kashmiri Chilli Powder (200g)", qty:2, price:179 }],
    orderTotal:418, amount:418,
    reason:"Duplicate payment", returnMethod:"Nagad", returnAccount:"01555-678901",
    status:"Completed", txnId:"NGD-4499-TX88",
    evidenceText:"Customer was charged twice due to a payment gateway error. Second transaction confirmed on Nagad portal.",
    attachments:["duplicate_txn.jpg"], notes:"Confirmed duplicate. Refund sent.", rejectionReason:"",
    timeline:[
      { label:"Refund requested", time:"1 Jun, 9:00 AM", done:true },
      { label:"Duplicate confirmed on Nagad portal", time:"1 Jun, 9:30 AM", done:true },
      { label:"Approved", time:"1 Jun, 10:00 AM", done:true },
      { label:"Refund processed via Nagad", time:"1 Jun, 10:30 AM", done:true },
      { label:"Completed — Txn NGD-4499-TX88", time:"1 Jun, 11:00 AM", done:true }
    ]
  },
  {
    id:"RFD-0001", ref:"#RFD-0001",
    orderId:"ORD-3830", orderRef:"#ORD-3830",
    customer:{ name:"Bilal Ahmed", email:"bilal@email.com", phone:"01799-001122", avatar:"BA", avatarColor:"bg-surface-container-high text-on-surface-variant" },
    date:"28 May 2025, 2:00 PM", dateShort:"28 May 2025",
    items:[{ name:"Star Anise Whole (50g)", qty:1, price:199 }],
    orderTotal:259, amount:259,
    reason:"Customer changed mind", returnMethod:"bKash", returnAccount:"01799-001122",
    status:"Rejected", txnId:null,
    evidenceText:"Customer opened package and claims they no longer need it. No damage reported.",
    attachments:[], notes:"Policy: No refund for opened/used items without defect.", rejectionReason:"Item was opened and used — does not qualify under our return policy.",
    timeline:[
      { label:"Refund requested", time:"28 May, 2:00 PM", done:true },
      { label:"Evidence reviewed", time:"28 May, 3:00 PM", done:true },
      { label:"Rejected by admin", time:"28 May, 4:00 PM", done:true }
    ]
  }
];

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
function refundStatusBadge(status: string) {
  const map: Record<string, string> = {
    Requested:  "refund-requested",
    Approved:   "refund-approved",
    Processing: "refund-processing",
    Completed:  "refund-completed",
    Rejected:   "refund-rejected",
  };
  return (
    <span className={`${map[status] || "refund-requested"} text-[10px] font-bold px-2.5 py-1 rounded-full border`}>
      {status}
    </span>
  );
}

function refundStatusDrawerClasses(status: string) {
  const map: Record<string, string> = {
    Requested:  "bg-primary-fixed text-on-primary-container",
    Approved:   "bg-secondary-container text-on-secondary-container",
    Processing: "bg-tertiary-fixed text-on-tertiary-container",
    Completed:  "bg-secondary-container text-on-secondary-container",
    Rejected:   "bg-error-container text-error",
  };
  return map[status] || "bg-surface-container text-on-surface-variant";
}

function returnMethodBadge(method: string) {
  if (method === "bKash")
    return <span className="pay-bkash text-[10px] font-bold px-2 py-0.5 rounded-full">bKash</span>;
  if (method === "Nagad")
    return <span className="pay-nagad text-[10px] font-bold px-2 py-0.5 rounded-full">Nagad</span>;
  if (method === "Store Credit")
    return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background:"#e8f5e9", color:"#2e7d32", border:"1px solid #c8e6c9" }}>Credit</span>;
  return <span className="pay-cod text-[10px] font-bold px-2 py-0.5 rounded-full">Bank</span>;
}

function reasonIcon(reason: string) {
  const map: Record<string, string> = {
    "Wrong item delivered": "swap_horiz",
    "Damaged / defective product": "broken_image",
    "Item not received": "local_shipping",
    "Duplicate payment": "content_copy",
    "Customer changed mind": "undo",
    "Other": "help_outline",
  };
  return map[reason] || "help_outline";
}

/* ══════════════════════════════════════════════
   PAGE COMPONENT
══════════════════════════════════════════════ */
export default function AdminRefundPage() {
  const [refunds, setRefunds] = useState<Refund[]>(INITIAL_REFUNDS);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [currentSearch, setCurrentSearch] = useState("");
  const [activeRefundId, setActiveRefundId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerOverlay, setDrawerOverlay] = useState(false);
  const [newRefundModal, setNewRefundModal] = useState(false);
  const [toast, setToast] = useState({ msg: "", visible: false });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Drawer state (controlled)
  const [drawerStatusSelect, setDrawerStatusSelect] = useState("Requested");
  const [txnInput, setTxnInput] = useState("");
  const [rejectReasonInput, setRejectReasonInput] = useState("");
  const [drawerNotes, setDrawerNotes] = useState("");
  const [showTxnInputRow, setShowTxnInputRow] = useState(false);
  const [showRejectReasonRow, setShowRejectReasonRow] = useState(false);

  // New refund modal state
  const [newOrderId, setNewOrderId] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newReason, setNewReason] = useState("Wrong item delivered");
  const [newReturnMethod, setNewReturnMethod] = useState("bKash");

  const [currentDate, setCurrentDate] = useState("");
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" }));
  }, []);

  /* ── Toast ── */
  const showToast = useCallback((msg: string, duration = 2500) => {
    setToast({ msg, visible: true });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast({ msg:"", visible: false }), duration);
  }, []);

  /* ── Filtered refunds ── */
  const filteredRefunds = refunds.filter((r) => {
    const matchesFilter =
      currentFilter === "all" ? true :
      currentFilter === "requested"  ? r.status === "Requested"  :
      currentFilter === "approved"   ? r.status === "Approved"   :
      currentFilter === "processing" ? r.status === "Processing" :
      currentFilter === "completed"  ? r.status === "Completed"  :
      currentFilter === "rejected"   ? r.status === "Rejected"   : true;
    const q = currentSearch.toLowerCase();
    const matchesSearch = !q ||
      r.id.toLowerCase().includes(q) ||
      r.orderId.toLowerCase().includes(q) ||
      r.customer.name.toLowerCase().includes(q) ||
      r.customer.email.toLowerCase().includes(q) ||
      r.reason.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  /* ── Stats ── */
  const statAll       = refunds.length;
  const statRequested = refunds.filter(r => r.status === "Requested").length;
  const statApproved  = refunds.filter(r => r.status === "Approved").length;
  const statCompleted = refunds.filter(r => r.status === "Completed").length;
  const statRejected  = refunds.filter(r => r.status === "Rejected").length;
  const pendingCount  = statRequested;

  /* ── Open drawer ── */
  const openDrawer = useCallback((refundId: string) => {
    const r = refunds.find(x => x.id === refundId);
    if (!r) return;
    setActiveRefundId(refundId);
    setDrawerStatusSelect(r.status);
    setDrawerNotes(r.notes);
    setTxnInput("");
    setRejectReasonInput("");
    setShowTxnInputRow(false);
    setShowRejectReasonRow(false);
    setDrawerOpen(true);
    setDrawerOverlay(true);
  }, [refunds]);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setDrawerOverlay(false);
    setActiveRefundId(null);
  }, []);

  /* ── Status change ── */
  const onStatusChange = (status: string, fromUser = true) => {
    setDrawerStatusSelect(status);
    if (!fromUser) { setShowTxnInputRow(false); setShowRejectReasonRow(false); return; }
    setShowTxnInputRow(status === "Completed");
    setShowRejectReasonRow(status === "Rejected");
  };

  /* ── Save status ── */
  const saveStatus = () => {
    if (!activeRefundId) return;
    const newStatus = drawerStatusSelect;
    setRefunds(prev => prev.map(r => {
      if (r.id !== activeRefundId) return r;
      const updated = { ...r, status: newStatus };
      if (newStatus === "Completed" && txnInput) {
        updated.txnId = txnInput;
        const tl = [...r.timeline];
        if (tl.length) { tl[tl.length-1] = { ...tl[tl.length-1], done:true, time: new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}), label:`Completed — Txn ${txnInput}` }; }
        updated.timeline = tl;
      }
      if (newStatus === "Rejected") {
        updated.rejectionReason = rejectReasonInput || "No reason given";
        updated.timeline = [...r.timeline, { label:"Rejected by admin", time: new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}), done:true }];
      }
      if (newStatus === "Approved" && r.status === "Requested") {
        updated.timeline = [...r.timeline, { label:"Approved by admin", time: new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}), done:true }];
      }
      return updated;
    }));
    showToast(`Refund ${activeRefundId} updated to ${newStatus}`);
  };

  /* ── Quick approve / reject ── */
  const quickApprove = () => {
    if (!activeRefundId) return;
    const r = refunds.find(x => x.id === activeRefundId);
    if (!r) return;
    setRefunds(prev => prev.map(x => x.id !== activeRefundId ? x : {
      ...x, status:"Approved",
      timeline: [...x.timeline, { label:"Approved by admin", time: new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}), done:true }]
    }));
    setDrawerStatusSelect("Approved");
    showToast(`✓ Refund ${r.ref} approved`);
  };

  const quickReject = () => {
    if (!activeRefundId) return;
    const r = refunds.find(x => x.id === activeRefundId);
    if (!r) return;
    setRefunds(prev => prev.map(x => x.id !== activeRefundId ? x : {
      ...x, status:"Rejected", rejectionReason:"Rejected by admin",
      timeline: [...x.timeline, { label:"Rejected by admin", time: new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}), done:true }]
    }));
    setDrawerStatusSelect("Rejected");
    showToast(`Refund ${r.ref} rejected`);
  };

  /* ── Notes ── */
  const saveNote = () => {
    if (!activeRefundId) return;
    setRefunds(prev => prev.map(r => r.id !== activeRefundId ? r : { ...r, notes: drawerNotes }));
    showToast("Note saved");
  };

  /* ── Copy helpers ── */
  const copyAccount = () => {
    const r = refunds.find(x => x.id === activeRefundId);
    if (r) { navigator.clipboard.writeText(r.returnAccount).catch(()=>{}); showToast("Account copied"); }
  };
  const copyTxn = () => {
    const r = refunds.find(x => x.id === activeRefundId);
    if (r?.txnId) { navigator.clipboard.writeText(r.txnId).catch(()=>{}); showToast("Transaction ID copied"); }
  };

  /* ── Submit new refund ── */
  const submitNewRefund = () => {
    const orderId = newOrderId.trim().toUpperCase().replace("#","");
    const amount  = parseInt(newAmount, 10);
    if (!orderId || !amount || amount <= 0) { showToast("Please fill all fields"); return; }
    const newId = `RFD-${String(refunds.length + 1).padStart(4,"0")}`;
    const now = new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
    const entry: Refund = {
      id:newId, ref:`#${newId}`,
      orderId, orderRef:`#${orderId}`,
      customer:{ name:"Manual Entry", email:"—", phone:"—", avatar:"ME", avatarColor:"bg-surface-container-high text-on-surface-variant" },
      date:now, dateShort:now,
      items:[], orderTotal:amount, amount,
      reason:newReason, returnMethod:newReturnMethod, returnAccount:"—",
      status:"Requested", txnId:null,
      evidenceText:"Manually created refund by admin.",
      attachments:[], notes:"", rejectionReason:"",
      timeline:[{ label:"Refund created by admin", time:now, done:true }]
    };
    setRefunds(prev => [entry, ...prev]);
    setNewRefundModal(false);
    setNewOrderId(""); setNewAmount(""); setNewReason("Wrong item delivered"); setNewReturnMethod("bKash");
    showToast(`✓ Refund ${newId} created`);
  };

  /* ── Active refund for drawer ── */
  const activeRefund = activeRefundId ? refunds.find(x => x.id === activeRefundId) : null;

  /* ── Filter tab helper ── */
  const filterTabClass = (tab: string) =>
    `filter-tab text-[12px] font-semibold px-3.5 py-1.5 rounded-full border border-outline-variant/30 text-on-surface-variant${currentFilter === tab ? " active" : ""}`;

  /* ════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════ */
  return (
    <>
      {/* ── Global styles ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-weight: normal; font-style: normal; font-size: 24px;
          line-height: 1; letter-spacing: normal; text-transform: none;
          display: inline-block; white-space: nowrap; word-wrap: normal;
          direction: ltr; -webkit-font-smoothing: antialiased;
        }
        .stat-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(159,65,34,0.10); }
        .trow { transition: background 0.15s; cursor: pointer; }
        .trow:hover { background: rgba(248,243,234,0.9); }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #ddc0b8; border-radius: 99px; }
        .badge-pulse { animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.55} }
        .main-content { transition: margin-left 0.3s cubic-bezier(0.4,0,0.2,1); }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        .fade-up { animation: fadeUp 0.4s ease both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.1s; }
        .fade-up-3 { animation-delay: 0.15s; }
        .fade-up-4 { animation-delay: 0.2s; }
        .drawer-panel { transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); transform: translateX(100%); }
        .drawer-panel.open { transform: translateX(0); }
        .drawer-overlay { transition: opacity 0.3s ease; }
        .modal-wrap { transition: opacity 0.25s ease; opacity: 0; pointer-events: none; }
        .modal-wrap.open { opacity: 1; pointer-events: auto; }
        .modal-card { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease; transform: scale(0.92); opacity: 0; }
        .modal-wrap.open .modal-card { transform: scale(1); opacity: 1; }
        #toast {
          position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
          background: #1d1c15; color: #fff9ee; padding: 11px 22px;
          border-radius: 9999px; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 500; z-index: 9999;
          box-shadow: 0 8px 24px rgba(0,0,0,0.18);
          transition: opacity 0.3s; white-space: nowrap; pointer-events: none;
        }
        @media (min-width: 1024px) { #toast { bottom: 28px; } }
        .filter-tab { transition: all 0.18s; }
        .filter-tab.active { background: #9f4122; color: #fff; font-weight: 700; box-shadow: 0 4px 12px rgba(159,65,34,0.25); }
        .refund-card { transition: box-shadow 0.18s, transform 0.18s; }
        .refund-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .status-select { appearance: none; -webkit-appearance: none; }
        .pay-bkash { background:#fce4ee; color:#c2185b; border:1px solid #f8bbd0; }
        .pay-nagad  { background:#fff3e0; color:#e65100; border:1px solid #ffe0b2; }
        .pay-cod    { background:#f3f4f6; color:#374151; border:1px solid #e5e7eb; }
        .refund-requested  { background:#fff3e0; color:#e65100; border:1px solid #ffe0b2; }
        .refund-approved   { background:#e8f5e9; color:#2e7d32; border:1px solid #c8e6c9; }
        .refund-rejected   { background:#fce4ee; color:#c2185b; border:1px solid #f8bbd0; }
        .refund-processing { background:#e3f2fd; color:#1565c0; border:1px solid #bbdefb; }
        .refund-completed  { background:#e8f5e9; color:#1b5e20; border:1px solid #a5d6a7; }
        @keyframes slideIn { from{opacity:0;transform:translateX(18px)} to{opacity:1;transform:none} }
        .slide-in { animation: slideIn 0.3s ease both; }
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      ` }} />

      <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden min-h-screen">

        {/* ── Sidebar ── */}
        <AdminSidebar pendingRefunds={pendingCount} />

        {/* ══════════ MAIN CONTENT ══════════ */}
        <div id="main-content" className="main-content lg:ml-64 min-h-screen flex flex-col">

          {/* ── TOPBAR ── */}
          <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 flex items-center justify-between px-4 md:px-6 h-16 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => { toggleAdminSidebar(); setHamburgerOpen(v => !v); }}
                className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[22px]">{hamburgerOpen ? "close" : "menu"}</span>
              </button>
              <button
                onClick={toggleAdminMini}
                className="hidden lg:flex w-9 h-9 rounded-xl items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[22px]">menu_open</span>
              </button>
              <div className="hidden sm:flex items-center gap-2 text-[13px]">
                <a href="/admin" className="text-on-surface-variant hover:text-primary transition-colors">Admin</a>
                <span className="material-symbols-outlined text-[14px] text-on-surface-variant">chevron_right</span>
                <span className="text-on-surface font-semibold">Refunds</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 bg-surface-container rounded-full px-4 py-2 border border-outline-variant/30 w-48 xl:w-64">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
                <input
                  type="text"
                  placeholder="Search refunds..."
                  value={currentSearch}
                  onChange={e => setCurrentSearch(e.target.value)}
                  className="bg-transparent text-[13px] text-on-surface placeholder:text-outline border-none focus:ring-0 w-full p-0 outline-none"
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

          {/* ── PAGE CONTENT ── */}
          <main className="flex-1 p-4 md:p-6 xl:p-8 pb-24 lg:pb-8 overflow-y-auto">

            {/* Header */}
            <div className="fade-up flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-[22px] md:text-[28px] font-extrabold text-on-surface tracking-tight">Refunds</h1>
                <p className="text-[13px] text-on-surface-variant mt-0.5">
                  {statAll} total refunds ·{" "}
                  <span className="text-primary font-semibold">
                    {pendingCount} awaiting review
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => showToast("Refunds exported to CSV")}
                  className="flex items-center gap-2 border border-outline-variant/40 text-on-surface-variant text-[13px] font-medium px-4 py-2 rounded-full hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span className="hidden sm:inline">Export CSV</span>
                </button>
                <button
                  onClick={() => setNewRefundModal(true)}
                  className="flex items-center gap-2 bg-primary text-on-primary text-[13px] font-medium px-4 py-2 rounded-full hover:bg-primary/90 transition-colors shadow-md"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span className="hidden sm:inline">New Refund</span>
                </button>
              </div>
            </div>

            {/* Stat mini row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5 fade-up fade-up-1">
              {[
                { id:"all",       label:"All Refunds", val:statAll,       color:"text-on-surface",          onClick:() => setCurrentFilter("all") },
                { id:"requested", label:"Requested",   val:statRequested, color:"text-primary",             onClick:() => setCurrentFilter("requested") },
                { id:"approved",  label:"Approved",    val:statApproved,  color:"text-tertiary",            onClick:() => setCurrentFilter("approved") },
                { id:"completed", label:"Completed",   val:statCompleted, color:"text-secondary",           onClick:() => setCurrentFilter("completed") },
                { id:"rejected",  label:"Rejected",    val:statRejected,  color:"",                         style:{ color:"#c2185b" }, col:"col-span-2 md:col-span-1", onClick:() => setCurrentFilter("rejected") },
              ].map(s => (
                <div
                  key={s.id}
                  className={`stat-card bg-surface-container-lowest border border-outline-variant/30 rounded-[18px] p-4 text-center cursor-pointer${s.col ? ` ${s.col}` : ""}`}
                  onClick={s.onClick}
                >
                  <div className={`text-[22px] font-extrabold ${s.color}`} style={s.style}>{s.val}</div>
                  <div className="text-[11px] text-on-surface-variant">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Filter tabs + Search */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] p-4 mb-4 fade-up fade-up-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { key:"all",        label:"All" },
                    { key:"requested",  label:"Requested" },
                    { key:"approved",   label:"Approved" },
                    { key:"processing", label:"Processing" },
                    { key:"completed",  label:"Completed" },
                    { key:"rejected",   label:"Rejected", style:{ borderColor:"#f48fb1", color:"#c2185b" } as React.CSSProperties },
                  ].map(t => (
                    <button
                      key={t.key}
                      className={filterTabClass(t.key)}
                      style={currentFilter !== t.key && t.style ? t.style : undefined}
                      onClick={() => setCurrentFilter(t.key)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                {/* Mobile search */}
                <div className="flex md:hidden items-center gap-2 bg-surface-container rounded-full px-3 py-2 border border-outline-variant/30 w-full">
                  <span className="material-symbols-outlined text-on-surface-variant text-[16px]">search</span>
                  <input
                    type="text"
                    placeholder="Search refunds..."
                    value={currentSearch}
                    onChange={e => setCurrentSearch(e.target.value)}
                    className="bg-transparent text-[12px] text-on-surface placeholder:text-outline border-none focus:ring-0 w-full p-0 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* ═══ REFUNDS TABLE (desktop / tablet) ═══ */}
            <div className="hidden md:block bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] shadow-sm overflow-hidden fade-up fade-up-3">
              <div className="overflow-x-auto">
                <table className="w-full text-[13px] min-w-[860px]">
                  <thead>
                    <tr className="bg-surface-container-low">
                      {["Refund ID","Customer","Order","Reason","Amount","Method","Status","Date","Actions"].map((h, i) => (
                        <th key={h} className={`${i===0?"px-5":"px-3"} py-3 text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider ${i===8?"text-right":"text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/15">
                    {filteredRefunds.map(r => (
                      <tr key={r.id} className="trow" onClick={() => openDrawer(r.id)}>
                        <td className="px-5 py-3.5">
                          <div className="font-mono text-[12px] text-on-surface-variant font-semibold">{r.ref}</div>
                          <div className="text-[10px] text-outline mt-0.5">{r.dateShort}</div>
                        </td>
                        <td className="px-3 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full ${r.customer.avatarColor} flex items-center justify-center text-[10px] font-bold shrink-0`}>{r.customer.avatar}</div>
                            <div>
                              <div className="font-medium text-on-surface text-[13px]">{r.customer.name}</div>
                              <div className="text-[10px] text-on-surface-variant">{r.customer.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3.5">
                          <div className="font-mono text-[12px] text-primary font-semibold">{r.orderRef}</div>
                          <div className="text-[10px] text-on-surface-variant">{r.items.length} item{r.items.length !== 1 ? "s" : ""}</div>
                        </td>
                        <td className="px-3 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px] text-on-surface-variant">{reasonIcon(r.reason)}</span>
                            <span className="text-[12px] text-on-surface-variant max-w-[120px] xl:max-w-none truncate">{r.reason}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3.5 font-bold text-on-surface text-[13px]">৳{r.amount}</td>
                        <td className="px-3 py-3.5">{returnMethodBadge(r.returnMethod)}</td>
                        <td className="px-3 py-3.5">{refundStatusBadge(r.status)}</td>
                        <td className="px-3 py-3.5 text-[11px] text-on-surface-variant whitespace-nowrap">{r.dateShort}</td>
                        <td className="px-3 py-3.5 text-right">
                          <button className="text-[12px] font-semibold text-primary hover:text-on-primary hover:bg-primary px-3 py-1.5 rounded-full border border-primary/30 hover:border-transparent transition-all">
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredRefunds.length === 0 && (
                <div className="py-16 text-center">
                  <span className="material-symbols-outlined text-[48px] text-outline/50">currency_exchange</span>
                  <p className="text-[15px] font-semibold text-on-surface mt-3">No refunds found</p>
                  <p className="text-[13px] text-on-surface-variant mt-1">Try a different filter or search query</p>
                </div>
              )}
            </div>

            {/* ═══ REFUND CARDS (mobile) ═══ */}
            <div className="md:hidden space-y-3 fade-up fade-up-3">
              {filteredRefunds.length === 0 ? (
                <div className="py-16 text-center bg-surface-container-lowest border border-outline-variant/30 rounded-[20px]">
                  <span className="material-symbols-outlined text-[48px] text-outline/50">currency_exchange</span>
                  <p className="text-[15px] font-semibold text-on-surface mt-3">No refunds found</p>
                </div>
              ) : filteredRefunds.map(r => (
                <div key={r.id} className="refund-card bg-surface-container-lowest border border-outline-variant/30 rounded-[18px] p-4 cursor-pointer shadow-sm" onClick={() => openDrawer(r.id)}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-full ${r.customer.avatarColor} flex items-center justify-center text-[11px] font-bold shrink-0`}>{r.customer.avatar}</div>
                      <div>
                        <div className="font-semibold text-[14px] text-on-surface">{r.customer.name}</div>
                        <div className="font-mono text-[11px] text-on-surface-variant">{r.ref} · {r.orderRef}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {refundStatusBadge(r.status)}
                      <span className="font-bold text-[15px] text-on-surface">৳{r.amount}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="material-symbols-outlined text-[14px] text-on-surface-variant">{reasonIcon(r.reason)}</span>
                    <span className="text-[12px] text-on-surface-variant">{r.reason}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {returnMethodBadge(r.returnMethod)}
                      <span className="text-[11px] text-on-surface-variant">{r.returnAccount}</span>
                    </div>
                    <span className="text-[11px] text-on-surface-variant">{r.dateShort}</span>
                  </div>
                </div>
              ))}
            </div>

          </main>
        </div>

        {/* ════════════ REFUND DETAIL DRAWER ════════════ */}
        <div
          className="drawer-overlay fixed inset-0 bg-black/30 z-40"
          style={{ opacity: drawerOverlay ? 1 : 0, pointerEvents: drawerOverlay ? "auto" : "none" }}
          onClick={closeDrawer}
        />

        <div className={`drawer-panel fixed right-0 top-0 h-full w-full sm:w-[520px] xl:w-[600px] bg-surface-container-lowest z-50 flex flex-col shadow-2xl border-l border-outline-variant/30${drawerOpen ? " open" : ""}`}>
          {activeRefund && (
            <>
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20 shrink-0 bg-surface-container-lowest">
                <div className="flex items-center gap-3">
                  <button onClick={closeDrawer} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant">
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                  <div>
                    <div className="font-bold text-[15px] text-on-surface">{activeRefund.ref}</div>
                    <div className="text-[11px] text-on-surface-variant">{activeRefund.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${refundStatusDrawerClasses(activeRefund.status)}`}>{activeRefund.status}</span>
                  <button onClick={() => window.print()} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant" title="Print">
                    <span className="material-symbols-outlined text-[18px]">print</span>
                  </button>
                </div>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto">

                {/* Refund Summary Banner */}
                <div className="mx-4 mt-4 rounded-[16px] border p-4 slide-in bg-primary-fixed/40 border-primary-fixed">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-[18px]">currency_exchange</span>
                      </div>
                      <div>
                        <div className="font-bold text-[14px] text-on-surface">Refund Request</div>
                        <div className="text-[11px] text-on-surface-variant">for order <span className="font-mono font-semibold">{activeRefund.orderRef}</span></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-[22px] text-on-surface">৳{activeRefund.amount}</div>
                      <div className="text-[10px] text-on-surface-variant">Refund Amount</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/60 rounded-[10px] px-3 py-2.5 border border-white/80">
                    <span className="material-symbols-outlined text-[15px] text-on-surface-variant shrink-0">help_outline</span>
                    <div>
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Reason</div>
                      <div className="text-[13px] font-medium text-on-surface">{activeRefund.reason}</div>
                    </div>
                  </div>
                </div>

                {/* Customer */}
                <div className="px-4 pt-4 pb-3">
                  <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2.5">Customer</div>
                  <div className="flex items-start gap-3 bg-surface-container rounded-[14px] p-3.5 border border-outline-variant/20">
                    <div className={`w-10 h-10 rounded-full ${activeRefund.customer.avatarColor} flex items-center justify-center font-bold text-[13px] shrink-0`}>{activeRefund.customer.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[14px] text-on-surface">{activeRefund.customer.name}</div>
                      <div className="text-[12px] text-on-surface-variant">{activeRefund.customer.email}</div>
                      <div className="text-[12px] text-on-surface-variant font-mono mt-0.5">{activeRefund.customer.phone}</div>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <a href={`mailto:${activeRefund.customer.email}`} className="text-[11px] text-primary font-medium hover:underline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">mail</span>Email
                      </a>
                      <a href={`tel:${activeRefund.customer.phone}`} className="text-[11px] text-primary font-medium hover:underline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">call</span>Call
                      </a>
                    </div>
                  </div>
                </div>

                {/* Original Order */}
                <div className="px-4 pb-3">
                  <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2.5">Original Order</div>
                  <div className="bg-surface-container rounded-[14px] border border-outline-variant/20 overflow-hidden">
                    <div className="divide-y divide-outline-variant/15">
                      {activeRefund.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between px-4 py-3 gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-medium text-on-surface truncate">{item.name}</div>
                            <div className="text-[11px] text-on-surface-variant">Qty: {item.qty}</div>
                          </div>
                          <div className="text-[13px] font-semibold text-on-surface shrink-0">৳{item.qty * item.price}</div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-3 bg-surface-container-low space-y-1.5">
                      <div className="flex justify-between text-[12px] text-on-surface-variant">
                        <span>Order Total</span><span className="font-bold text-on-surface">৳{activeRefund.orderTotal}</span>
                      </div>
                      <div className="flex justify-between text-[12px] text-on-surface-variant">
                        <span>Paid Via</span><span className="font-medium text-on-surface">{activeRefund.returnMethod}</span>
                      </div>
                      <div className="h-px bg-outline-variant/20" />
                      <div className="flex justify-between text-[14px] font-bold text-on-surface">
                        <span>Refund Amount</span><span className="text-primary">৳{activeRefund.amount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Return Method */}
                <div className="px-4 pb-3">
                  <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2.5">Return Method</div>
                  <div className="bg-surface-container rounded-[14px] border border-outline-variant/20 p-3.5">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="bg-surface-container-lowest rounded-[10px] px-3 py-2.5 border border-outline-variant/20">
                        <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold mb-0.5">Return To</div>
                        <div className="font-semibold text-[13px] text-on-surface">{activeRefund.returnMethod}</div>
                      </div>
                      <div className="bg-surface-container-lowest rounded-[10px] px-3 py-2.5 border border-outline-variant/20">
                        <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold mb-0.5">Account</div>
                        <div className="font-mono font-medium text-[12px] text-on-surface flex items-center gap-1.5">
                          <span>{activeRefund.returnAccount}</span>
                          <button onClick={copyAccount} className="text-[10px] text-primary hover:underline">Copy</button>
                        </div>
                      </div>
                    </div>
                    {activeRefund.txnId && (
                      <div className="mt-2.5 bg-surface-container-lowest rounded-[10px] px-3 py-2.5 border border-outline-variant/20">
                        <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold mb-0.5">Refund Transaction ID</div>
                        <div className="font-mono font-bold text-[13px] text-on-surface flex items-center gap-2">
                          <span>{activeRefund.txnId}</span>
                          <button onClick={copyTxn} className="text-[10px] text-primary hover:underline">Copy</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Evidence */}
                <div className="px-4 pb-3">
                  <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2.5">Customer Evidence</div>
                  <div className="bg-surface-container rounded-[14px] border border-outline-variant/20 p-3.5">
                    <div className="flex items-start gap-2.5 mb-2.5">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant mt-0.5 shrink-0">description</span>
                      <p className="text-[13px] text-on-surface leading-relaxed">{activeRefund.evidenceText}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeRefund.attachments.length > 0 ? activeRefund.attachments.map(a => (
                        <div key={a} className="flex items-center gap-1.5 bg-surface-container-low border border-outline-variant/30 rounded-full px-3 py-1.5 cursor-pointer hover:bg-primary-fixed/30 transition-colors">
                          <span className="material-symbols-outlined text-[14px] text-on-surface-variant">image</span>
                          <span className="text-[11px] font-medium text-on-surface">{a}</span>
                          <span className="material-symbols-outlined text-[12px] text-primary">download</span>
                        </div>
                      )) : (
                        <span className="text-[12px] text-on-surface-variant italic">No attachments provided</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div className="px-4 pb-3">
                  <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2.5">Update Refund Status</div>
                  <div className="bg-surface-container rounded-[14px] border border-outline-variant/20 p-3.5 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="relative flex-1 min-w-[160px]">
                        <select
                          value={drawerStatusSelect}
                          onChange={e => onStatusChange(e.target.value)}
                          className="status-select w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2 text-[13px] text-on-surface font-medium pr-8 focus:ring-primary focus:border-primary cursor-pointer outline-none"
                        >
                          <option value="Requested">Requested</option>
                          <option value="Approved">Approved</option>
                          <option value="Processing">Processing</option>
                          <option value="Completed">Completed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
                      </div>
                      <button onClick={saveStatus} className="flex items-center gap-1.5 bg-primary text-on-primary text-[12px] font-semibold px-4 py-2 rounded-full hover:bg-primary/90 transition-colors shrink-0">
                        <span className="material-symbols-outlined text-[15px]">save</span>Save
                      </button>
                    </div>
                    {showTxnInputRow && (
                      <div className="pt-2 border-t border-outline-variant/15 flex flex-col gap-2">
                        <label className="text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider">Refund Transaction ID</label>
                        <input
                          type="text"
                          placeholder="Enter transaction ID (e.g. BKH-0023-TX99)"
                          value={txnInput}
                          onChange={e => setTxnInput(e.target.value)}
                          className="w-full bg-surface-container-low border border-outline-variant/30 rounded-full px-4 py-2 text-[12px] text-on-surface font-mono focus:ring-primary focus:border-primary outline-none"
                        />
                      </div>
                    )}
                    {showRejectReasonRow && (
                      <div className="pt-2 border-t border-outline-variant/15 flex flex-col gap-2">
                        <label className="text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider">Rejection Reason</label>
                        <input
                          type="text"
                          placeholder="e.g. Item was not defective per inspection"
                          value={rejectReasonInput}
                          onChange={e => setRejectReasonInput(e.target.value)}
                          className="w-full bg-surface-container-low border border-outline-variant/30 rounded-full px-4 py-2 text-[12px] text-on-surface focus:ring-primary focus:border-primary outline-none"
                        />
                      </div>
                    )}
                    {activeRefund.status === "Rejected" && activeRefund.rejectionReason && (
                      <div className="pt-2 border-t border-outline-variant/15">
                        <div className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold mb-1">Rejection Reason</div>
                        <p className="text-[13px] text-error font-medium">{activeRefund.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div className="px-4 pb-3">
                  <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2.5">Refund Timeline</div>
                  <div className="relative pl-5 space-y-0">
                    {activeRefund.timeline.map((item, i, arr) => (
                      <div key={i} className="relative flex gap-3 pb-4">
                        <div className="absolute left-[-20px] top-[3px] flex flex-col items-center">
                          <div className={`w-3.5 h-3.5 rounded-full border-2 z-10 ${item.done ? "bg-secondary border-secondary" : "bg-surface-container border-outline-variant"}`} />
                          {i < arr.length - 1 && (
                            <div className={`w-0.5 flex-1 mt-1 ${item.done ? "bg-secondary/40" : "bg-outline-variant/30"}`} style={{ minHeight: 24 }} />
                          )}
                        </div>
                        <div className="pt-0 flex-1">
                          <div className={`text-[13px] ${item.done ? "font-semibold text-on-surface" : "font-medium text-on-surface-variant"}`}>{item.label}</div>
                          <div className={`text-[11px] mt-0.5 ${item.done ? "text-secondary" : "text-outline"}`}>{item.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Admin Notes */}
                <div className="px-4 pb-6">
                  <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2.5">Internal Notes</div>
                  <div className="bg-surface-container rounded-[14px] border border-outline-variant/20 p-3.5">
                    <textarea
                      rows={2}
                      placeholder="Add internal note (only visible to admins)..."
                      value={drawerNotes}
                      onChange={e => setDrawerNotes(e.target.value)}
                      className="w-full bg-transparent text-[13px] text-on-surface placeholder:text-outline border-none focus:ring-0 resize-none outline-none"
                    />
                    <div className="flex justify-end mt-2 pt-2 border-t border-outline-variant/15">
                      <button onClick={saveNote} className="text-[12px] font-semibold text-primary hover:underline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">save</span>Save Note
                      </button>
                    </div>
                  </div>
                </div>

              </div>{/* /drawer-body */}

              {/* Drawer Footer */}
              <div className="shrink-0 border-t border-outline-variant/20 px-4 py-3 bg-surface-container-lowest flex items-center gap-2 flex-wrap">
                <button onClick={closeDrawer} className="flex-1 border border-outline-variant/40 text-on-surface-variant text-[13px] font-medium py-2.5 rounded-full hover:bg-surface-container transition-colors">
                  Close
                </button>
                {activeRefund.status === "Requested" && (
                  <>
                    <button onClick={quickApprove} className="flex-1 flex items-center justify-center gap-1.5 bg-secondary text-on-secondary text-[13px] font-bold py-2.5 rounded-full hover:bg-secondary/90 transition-all active:scale-95 shadow-md">
                      <span className="material-symbols-outlined text-[15px]">thumb_up</span>Approve
                    </button>
                    <button onClick={quickReject} className="flex-1 flex items-center justify-center gap-1.5 bg-error-container text-error text-[13px] font-bold py-2.5 rounded-full hover:bg-error/10 transition-all active:scale-95">
                      <span className="material-symbols-outlined text-[15px]">thumb_down</span>Reject
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* ════════════ NEW REFUND MODAL ════════════ */}
        <div
          className={`modal-wrap fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40${newRefundModal ? " open" : ""}`}
          onClick={e => { if (e.target === e.currentTarget) setNewRefundModal(false); }}
        >
          <div className="modal-card bg-surface-container-lowest rounded-[24px] w-full max-w-[460px] shadow-2xl border border-outline-variant/30 overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-outline-variant/15">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-[16px] text-on-surface">Create Manual Refund</div>
                  <div className="text-[12px] text-on-surface-variant mt-0.5">Issue a refund for an existing order</div>
                </div>
                <button onClick={() => setNewRefundModal(false)} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 block">Order ID</label>
                <input type="text" placeholder="e.g. ORD-3841" value={newOrderId} onChange={e => setNewOrderId(e.target.value)} className="w-full bg-surface-container border border-outline-variant/40 rounded-full px-4 py-2.5 text-[13px] text-on-surface font-mono focus:ring-primary focus:border-primary outline-none" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 block">Refund Amount (৳)</label>
                <input type="number" placeholder="0" value={newAmount} onChange={e => setNewAmount(e.target.value)} className="w-full bg-surface-container border border-outline-variant/40 rounded-full px-4 py-2.5 text-[13px] text-on-surface focus:ring-primary focus:border-primary outline-none" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 block">Reason</label>
                <div className="relative">
                  <select value={newReason} onChange={e => setNewReason(e.target.value)} className="status-select w-full bg-surface-container border border-outline-variant/40 rounded-full px-4 py-2.5 text-[13px] text-on-surface focus:ring-primary focus:border-primary pr-10 outline-none">
                    <option>Wrong item delivered</option>
                    <option>Damaged / defective product</option>
                    <option>Item not received</option>
                    <option>Duplicate payment</option>
                    <option>Customer changed mind</option>
                    <option>Other</option>
                  </select>
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 block">Return Method</label>
                <div className="relative">
                  <select value={newReturnMethod} onChange={e => setNewReturnMethod(e.target.value)} className="status-select w-full bg-surface-container border border-outline-variant/40 rounded-full px-4 py-2.5 text-[13px] text-on-surface focus:ring-primary focus:border-primary pr-10 outline-none">
                    <option>bKash</option>
                    <option>Nagad</option>
                    <option>Bank Transfer</option>
                    <option>Store Credit</option>
                  </select>
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setNewRefundModal(false)} className="flex-1 border border-outline-variant/40 text-on-surface-variant text-[13px] font-medium py-3 rounded-full hover:bg-surface-container transition-colors">
                Cancel
              </button>
              <button onClick={submitNewRefund} className="flex-1 bg-primary text-on-primary text-[13px] font-bold py-3 rounded-full hover:bg-primary/90 transition-all active:scale-95 shadow-md flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                Create Refund
              </button>
            </div>
          </div>
        </div>

        {/* ── MOBILE BOTTOM NAV ── */}
        <nav className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/20 flex items-center justify-around px-2 py-2 z-30 lg:hidden">
          <a href="/admin" className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined text-[22px]">dashboard</span>
            <span className="text-[9px] font-semibold">Home</span>
          </a>
          <a href="/admin/products" className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined text-[22px]">inventory_2</span>
            <span className="text-[9px] font-semibold">Products</span>
          </a>
          <a href="/admin/orders" className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined text-[22px]">receipt_long</span>
            <span className="text-[9px] font-semibold">Orders</span>
          </a>
          <button className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors text-primary">
            <span className="material-symbols-outlined text-[22px]">currency_exchange</span>
            <span className="text-[9px] font-semibold">Refunds</span>
          </button>
          <button onClick={toggleAdminSidebar} className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined text-[22px]">menu</span>
            <span className="text-[9px] font-semibold">More</span>
          </button>
        </nav>

        {/* ── Toast ── */}
        <div id="toast" style={{ opacity: toast.visible ? 1 : 0 }}>{toast.msg}</div>

      </div>
    </>
  );
}