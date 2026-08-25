"use client";

import { useEffect, useState } from "react";
import AdminSidebar, { toggleAdminSidebar, toggleAdminMini } from "@/components/AdminSidebar";

/* ══════════════════════════════════════════════
   INTERFACES
══════════════════════════════════════════════ */

interface Variant {
  w: string;
  p: number;
  mrp: number;
  s: number;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  catLabel: string;
  status: string;
  variants: Variant[];
  thumb: number;
  featured: boolean;
  bestseller: boolean;
  miniLabel?: string;
  tags?: string[];
}

interface Category {
  id: string;
  label: string;
  icon: string;
}

/* ══════════════════════════════════════════════
   STATIC DATA
══════════════════════════════════════════════ */

const INITIAL_PRODUCTS: Product[] = [
  { id:1, name:"Garam Masala Blend", sku:"SKU-GM-001", category:"masala", catLabel:"Ground Masalas", status:"active", variants:[{w:"100g",p:149,mrp:180,s:320},{w:"200g",p:249,mrp:299,s:210},{w:"500g",p:549,mrp:699,s:85}], thumb:0, featured:true, bestseller:true, miniLabel:"Premium Grade", tags:["14 Whole Spices","No MSG","Gluten Free"] },
  { id:2, name:"Pure Turmeric Powder", sku:"SKU-TM-002", category:"masala", catLabel:"Ground Masalas", status:"active", variants:[{w:"100g",p:89,mrp:110,s:480},{w:"250g",p:199,mrp:240,s:135},{w:"500g",p:349,mrp:420,s:20}], thumb:1, featured:false, bestseller:true, miniLabel:"Farm Fresh", tags:["100% Natural","No Preservatives"] },
  { id:3, name:"Cumin Powder (Jeera)", sku:"SKU-JR-003", category:"masala", catLabel:"Ground Masalas", status:"active", variants:[{w:"100g",p:99,mrp:120,s:295},{w:"200g",p:179,mrp:215,s:100}], thumb:2, featured:false, bestseller:false },
  { id:4, name:"Red Chilli Powder", sku:"SKU-RC-004", category:"masala", catLabel:"Ground Masalas", status:"lowstock", variants:[{w:"100g",p:99,mrp:120,s:8},{w:"200g",p:179,mrp:215,s:3}], thumb:3, featured:false, bestseller:false },
  { id:5, name:"Coriander Powder", sku:"SKU-CR-005", category:"masala", catLabel:"Ground Masalas", status:"active", variants:[{w:"100g",p:79,mrp:95,s:400},{w:"200g",p:139,mrp:170,s:260},{w:"500g",p:299,mrp:360,s:90}], thumb:4, featured:false, bestseller:false },
  { id:6, name:"Black Pepper Whole", sku:"SKU-BP-006", category:"whole", catLabel:"Whole Spices", status:"draft", variants:[{w:"50g",p:149,mrp:180,s:0},{w:"100g",p:279,mrp:340,s:0}], thumb:5, featured:false, bestseller:false },
];

const INITIAL_CATEGORIES: Category[] = [
  { id:'whole',      label:'Whole Spices',   icon:'local_fire_department' },
  { id:'masala',     label:'Ground Masalas', icon:'soup_kitchen'           },
  { id:'dryfruits',  label:'Dry Fruits',     icon:'eco'                    },
  { id:'dal',        label:'Dals & Pulses',  icon:'grain'                  },
  { id:'seeds',      label:'Seeds & Herbs',  icon:'grass'                  },
  { id:'blend',      label:'Signature Blends',icon:'blender'               },
  { id:'readymix',   label:'Ready Mixes',    icon:'kitchen'                },
];

const ICONS = [
  'spa','local_fire_department','eco','grain','star','local_florist','forest','water_drop',
  'nutrition','restaurant','skillet','kitchen','blender','soup_kitchen','rice_bowl','set_meal',
  'egg','grass','yard','inventory_2','factory','qr_code','verified','science',
  'thermostat','timer','bolt','favorite','healing','self_improvement','psychiatry','bloodtype',
  'colorize','category','cookie','cake','coffee','breakfast_dining','food_bank','local_cafe',
  'bedtime','lightbulb','info','warning','check_circle','shield','lock','public',
  'wb_sunny','air','recycling','energy_savings_leaf'
];

const CAT_ICONS_ALL = [
  'category','local_fire_department','soup_kitchen','eco','grain','grass','kitchen',
  'spa','blender','rice_bowl','skillet','set_meal','restaurant','dinner_dining',
  'bakery_dining','energy_savings_leaf','forest','water_drop','science','factory',
  'inventory_2','shopping_basket','store','storefront','sell','label',
  'star','favorite','verified','workspace_premium','local_offer','redeem',
  'bolt','diamond','emoji_nature','compost','recycling','agriculture',
  'sprout','nutrition','herb','cookie','cake','icecream','coffee',
  'ramen_dining','tapas','bento','lunch_dining','breakfast_dining',
];

const BADGES_LIST = [
  {id:'badge-nomsg',label:'No MSG',icon:'block'},
  {id:'badge-gluten',label:'Gluten Free',icon:'grain'},
  {id:'badge-vegan',label:'Vegan',icon:'eco'},
  {id:'badge-halal',label:'Halal',icon:'verified'},
  {id:'badge-organic',label:'Organic',icon:'energy_savings_leaf'},
  {id:'badge-noartificial',label:'No Artificial Color',icon:'colorize'},
  {id:'badge-bsti',label:'BSTI Certified',icon:'workspace_premium'},
  {id:'badge-natural',label:'100% Natural',icon:'forest'},
  {id:'badge-nopreserv',label:'No Preservatives',icon:'science'},
];

/* ══════════════════════════════════════════════
   PAGE COMPONENT
══════════════════════════════════════════════ */

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentSort, setCurrentSort] = useState('newest');
  const [currentSearch, setCurrentSearch] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [toast, setToast] = useState<{ msg: string; icon: string; show: boolean }>({ msg: '', icon: 'check_circle', show: false });
  
  // Modals & Panels
  const [isProductPanelOpen, setIsProductPanelOpen] = useState(false);
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [isDelCatModalOpen, setIsDelCatModalOpen] = useState(false);
  const [isDelProdModalOpen, setIsDelProdModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null);
  const [deletingProdId, setDeletingProdId] = useState<number | null>(null);

  // Category Modal State
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("category");
  const [catIconSearch, setCatIconSearch] = useState("");

  // Product Form State
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    sec_basic: false, sec_photos: false, sec_variants: false, sec_miniinfo: false,
    sec_desc: false, sec_ingr: false, sec_nutr: false, sec_howto: false
  });
  const [formName, setFormName] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formStatus, setFormStatus] = useState("active");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formBestseller, setFormBestseller] = useState(false);
  const [formNewbadge, setFormNewbadge] = useState(false);
  const [formShortDesc, setFormShortDesc] = useState("");
  const [formFullDesc, setFormFullDesc] = useState("");
  const [formIngrText, setFormIngrText] = useState("");
  const [formProtip, setFormProtip] = useState("");
  const [formServing, setFormServing] = useState("100g");
  const [formServingsPer, setFormServingsPer] = useState("");

  // NEW: Mini label (e.g. "Premium Grade"), Tags, Description heading, Ingredients heading & Allergen Info
  const [formMiniLabel, setFormMiniLabel] = useState("");
  const [formTags, setFormTags] = useState<string[]>([]);
  const [formTagInput, setFormTagInput] = useState("");
  const [formDescHeading, setFormDescHeading] = useState("");
  const [formIngrHeading, setFormIngrHeading] = useState("");
  const [formAllergenInfo, setFormAllergenInfo] = useState("");
  
  const [formVariants, setFormVariants] = useState<Variant[]>([]);
  const [formDescs, setFormDescs] = useState<{icon:string, title:string, desc:string, color:string}[]>([]);
  const [formIngrs, setFormIngrRows] = useState<{icon:string, name:string, origin:string, color:string}[]>([]);
  const [formNutrs, setFormNutrRows] = useState<{name:string, amt:string, unit:string}[]>([]);
  const [formHealths, setFormHealthRows] = useState<{icon:string, color:string, title:string, desc:string}[]>([]);
  const [formHowTos, setFormHowToRows] = useState<{icon:string, theme:string, title:string, desc:string, tip:string, tipIcon:string}[]>([]);
  const [formBadges, setFormBadges] = useState<Set<string>>(new Set());

  // Dropdowns
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  // Icon Picker
  const [iconPicker, setIconPicker] = useState<{show:boolean, target:string, x:number, y:number, q:string}>({
    show:false, target:"", x:0, y:0, q:""
  });

  // Image Picker Dialog
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [selectedProductImage, setSelectedProductImage] = useState<string | null>(null);
  const [imagePickerSearch, setImagePickerSearch] = useState("");

  // Simulated images from public/images folder
  const PUBLIC_IMAGES = [
    { name: 'garam-masala.jpg',    label: 'Garam Masala',     gradient: 'linear-gradient(135deg,#ff8a65,#9f4122)',     icon: 'local_fire_department' },
    { name: 'turmeric.jpg',        label: 'Turmeric',          gradient: 'linear-gradient(135deg,#d6ed7a,#bbd062)',     icon: 'eco' },
    { name: 'cardamom.jpg',        label: 'Cardamom',          gradient: 'linear-gradient(135deg,#bbe9ff,#80b1c7)',     icon: 'spa' },
    { name: 'chilli-powder.jpg',   label: 'Chilli Powder',     gradient: 'linear-gradient(135deg,#ffdbd0,#ffb59e)',     icon: 'whatshot' },
    { name: 'cumin-seeds.jpg',     label: 'Cumin Seeds',       gradient: 'linear-gradient(135deg,#d6ed7a,#556500)',     icon: 'grass' },
    { name: 'cinnamon.jpg',        label: 'Cinnamon Sticks',   gradient: 'linear-gradient(135deg,#ede8dd,#ddc0b8)',     icon: 'water_drop' },
    { name: 'cloves.jpg',          label: 'Cloves',            gradient: 'linear-gradient(135deg,#ffdbd0,#9f4122)',     icon: 'local_fire_department' },
    { name: 'black-pepper.jpg',    label: 'Black Pepper',      gradient: 'linear-gradient(135deg,#ede8dd,#56423c)',     icon: 'grain' },
    { name: 'almonds.jpg',         label: 'Premium Almonds',   gradient: 'linear-gradient(135deg,#f3ede2,#ddc0b8)',     icon: 'nutrition' },
    { name: 'cashews.jpg',         label: 'Cashew Nuts',       gradient: 'linear-gradient(135deg,#d6ed7a,#8fa800)',     icon: 'grain' },
    { name: 'mixed-fruits.jpg',    label: 'Mixed Dry Fruits',  gradient: 'linear-gradient(135deg,#ffdbd0,#ff8a65)',     icon: 'shopping_basket' },
    { name: 'moong-dal.jpg',       label: 'Moong Dal',         gradient: 'linear-gradient(135deg,#d6ed7a,#bbd062)',     icon: 'set_meal' },
    { name: 'masoor-dal.jpg',      label: 'Masoor Dal',        gradient: 'linear-gradient(135deg,#ff8a65,#9f4122)',     icon: 'grain' },
    { name: 'biryani-masala.jpg',  label: 'Biryani Masala',    gradient: 'linear-gradient(135deg,#d6ed7a,#556500)',     icon: 'soup_kitchen' },
    { name: 'curry-powder.jpg',    label: 'Curry Powder',      gradient: 'linear-gradient(135deg,#ede8dd,#ffdbd0)',     icon: 'rice_bowl' },
    { name: 'pistachios.jpg',      label: 'Pistachios',        gradient: 'linear-gradient(135deg,#d6ed7a,#8fa800)',     icon: 'eco' },
    { name: 'raisins.jpg',         label: 'Golden Raisins',    gradient: 'linear-gradient(135deg,#bbe9ff,#9ccee4)',     icon: 'local_florist' },
    { name: 'halwa-mix.jpg',       label: 'Halwa Mix',         gradient: 'linear-gradient(135deg,#d6ed7a,#bbd062)',     icon: 'skillet' },
    { name: 'khichdi-mix.jpg',     label: 'Khichdi Mix',       gradient: 'linear-gradient(135deg,#ede8dd,#ddc0b8)',     icon: 'rice_bowl' },
    { name: 'product-default.jpg', label: 'Default Product',   gradient: 'linear-gradient(135deg,#f3ede2,#ddc0b8)',     icon: 'inventory_2' },
  ];

  const filteredPublicImages = PUBLIC_IMAGES.filter(img =>
    img.label.toLowerCase().includes(imagePickerSearch.toLowerCase()) ||
    img.name.toLowerCase().includes(imagePickerSearch.toLowerCase())
  );

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
  }, []);

  const showToast = (msg: string, icon = 'check_circle') => {
    setToast({ msg, icon, show: true });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 2800);
  };

  const toggleSection = (id: string) => {
    setCollapsedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getFiltered = () => {
    let result = [...products];
    if (currentFilter !== 'all') {
      if (currentFilter === 'lowstock') result = result.filter(p => p.variants.some(v => v.s < 20));
      else if (currentFilter === 'active' || currentFilter === 'draft') result = result.filter(p => p.status === currentFilter);
      else result = result.filter(p => p.category === currentFilter);
    }
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.catLabel.toLowerCase().includes(q));
    }
    if (currentSort === 'name') result.sort((a,b) => a.name.localeCompare(b.name));
    else if (currentSort === 'newest') result.sort((a,b) => b.id - a.id);
    else if (currentSort === 'oldest') result.sort((a,b) => a.id - b.id);
    else if (currentSort === 'price') result.sort((a,b) => Math.min(...a.variants.map(v=>v.p)) - Math.min(...b.variants.map(v=>v.p)));
    return result;
  };

  const filtered = getFiltered();

  const openAddCategoryModal = () => {
    setNewCatName("");
    setNewCatIcon("category");
    setCatIconSearch("");
    setIsAddCatModalOpen(true);
  };

  const confirmAddCategory = () => {
    if (!newCatName.trim()) {
      showToast('Category name is required', 'warning');
      return;
    }
    const slug = newCatName.toLowerCase().replace(/[^a-z0-9]/g,'_');
    if (categories.find(c => c.id === slug || c.label.toLowerCase() === newCatName.toLowerCase())) {
      showToast('Category already exists', 'warning');
      return;
    }
    setCategories(prev => [...prev, { id: slug, label: newCatName, icon: newCatIcon }]);
    setIsAddCatModalOpen(false);
    showToast(`"${newCatName}" category added`, 'add_circle');
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    setIsDelCatModalOpen(false);
    showToast('Category deleted', 'delete');
  };

  const openAddProductPanel = () => {
    setEditingProductId(null);
    resetForm();
    // Default rows
    setFormVariants([{w:"100g",p:149,mrp:180,s:500},{w:"200g",p:249,mrp:299,s:250}]);
    setFormDescs([
      {icon:'inventory_2',title:'Resealable Pouch',desc:'Food-grade laminated pouch with a zip-seal for extended freshness.',color:'primary'},
      {icon:'factory',title:'Small Batch Grinding',desc:'Ground in certified facilities in small lots to ensure freshness.',color:'secondary'},
      {icon:'qr_code',title:'Full Traceability',desc:'Scan the QR code to view origin farm, batch date, and lab report.',color:'tertiary'}
    ]);
    setFormIngrRows([
      {icon:'spa',name:'Green Cardamom',origin:'Kerala origin · Aromatic',color:'primary'},
      {icon:'local_fire_department',name:'Cloves',origin:'Zanzibar-grade · Intense',color:'neutral'},
      {icon:'grain',name:'Cumin',origin:'Rajasthan origin · Earthy',color:'secondary'}
    ]);
    setFormNutrRows([
      {name:'Calories',amt:'305',unit:'kcal'},
      {name:'Total Fat',amt:'12',unit:'g'},
      {name:'Protein',amt:'14',unit:'g'},
      {name:'Sodium',amt:'38',unit:'mg'}
    ]);
    setFormHealthRows([
      {icon:'favorite',color:'primary',title:'Anti-inflammatory',desc:'Contains eugenol and piperine with anti-inflammatory effects.'},
      {icon:'psychiatry',color:'secondary',title:'Aids Digestion',desc:'Cumin and fennel promote healthy gut flora.'}
    ]);
    setFormHowToRows([
      {icon:'soup_kitchen',theme:'primary',title:'Curries & Gravies',desc:'Add ½–1 tsp per serving. Best added in last 10 minutes.',tip:'Add with 10 min to go',tipIcon:'timer'},
      {icon:'rice_bowl',theme:'secondary',title:'Biryani & Pulao',desc:'Use 1–2 tsp per kg of rice.',tip:'1–2 tsp per kg rice',tipIcon:'restaurant'},
      {icon:'skillet',theme:'tertiary',title:'Meats & Marinades',desc:'Rub 1 tsp into chicken with yoghurt.',tip:'Marinate overnight',tipIcon:'bedtime'}
    ]);
    setFormMiniLabel("Premium Grade");
    setFormTags(["14 Whole Spices","No MSG"]);
    setFormDescHeading("Why Choose Our Blend?");
    setFormIngrHeading("What's Inside");
    setFormAllergenInfo("May contain traces of nuts and sesame. Manufactured in a facility that also processes wheat.");
    setIsProductPanelOpen(true);
  };

  const openEditProductPanel = (id: number) => {
    const p = products.find(x => x.id === id);
    if (!p) return;
    setEditingProductId(id);
    resetForm();
    setFormName(p.name);
    setFormSku(p.sku);
    setFormCategory(p.category);
    setFormStatus(p.status === 'lowstock' ? 'active' : p.status);
    setFormFeatured(p.featured);
    setFormBestseller(p.bestseller);
    setFormVariants([...p.variants]);
    setFormMiniLabel(p.miniLabel || "");
    setFormTags(p.tags ? [...p.tags] : []);
    // Mock other sections
    setFormDescs([
      {icon:'inventory_2',title:'Resealable Pouch',desc:'Food-grade laminated pouch with a zip-seal for extended freshness.',color:'primary'},
      {icon:'factory',title:'Small Batch Grinding',desc:'Ground in certified facilities in small lots to ensure freshness.',color:'secondary'}
    ]);
    setFormIngrRows([
      {icon:'spa',name:'Green Cardamom',origin:'Kerala origin · Aromatic',color:'primary'},
      {icon:'grain',name:'Cumin',origin:'Rajasthan origin · Earthy',color:'secondary'}
    ]);
    setFormNutrRows([
      {name:'Calories',amt:'305',unit:'kcal'},
      {name:'Total Fat',amt:'12',unit:'g'},
      {name:'Protein',amt:'14',unit:'g'}
    ]);
    setFormHealthRows([
      {icon:'favorite',color:'primary',title:'Anti-inflammatory',desc:'Contains eugenol and piperine with anti-inflammatory effects.'}
    ]);
    setFormHowToRows([
      {icon:'soup_kitchen',theme:'primary',title:'Curries & Gravies',desc:'Add ½–1 tsp per serving. Best added in last 10 minutes.',tip:'Add with 10 min to go',tipIcon:'timer'},
      {icon:'rice_bowl',theme:'secondary',title:'Biryani & Pulao',desc:'Use 1–2 tsp per kg of rice.',tip:'1–2 tsp per kg rice',tipIcon:'restaurant'}
    ]);
    setFormDescHeading("Why Choose Our Blend?");
    setFormIngrHeading("What's Inside");
    setFormAllergenInfo("May contain traces of nuts and sesame.");
    setIsProductPanelOpen(true);
  };

  const resetForm = () => {
    setFormName(""); setFormSku(""); setFormCategory(""); setFormStatus("active");
    setFormFeatured(false); setFormBestseller(false); setFormNewbadge(false);
    setFormShortDesc(""); setFormFullDesc(""); setFormIngrText(""); setFormProtip("");
    setFormServing("100g"); setFormServingsPer("");
    setFormMiniLabel(""); setFormTags([]); setFormTagInput("");
    setFormDescHeading(""); setFormIngrHeading(""); setFormAllergenInfo("");
    setFormVariants([]); setFormDescs([]); setFormIngrRows([]); setFormNutrRows([]); setFormHealthRows([]); setFormHowToRows([]);
    setFormBadges(new Set());
    setCollapsedSections({
      sec_basic: false, sec_photos: false, sec_variants: false, sec_miniinfo: false,
      sec_desc: false, sec_ingr: false, sec_nutr: false, sec_howto: false
    });
  };

  const saveProduct = (mode: 'draft' | 'publish') => {
    if (!formName.trim()) {
      showToast('Product name is required', 'warning');
      return;
    }
    const catObj = categories.find(c => c.id === formCategory);
    const newProd: Product = {
      id: editingProductId || Date.now(),
      name: formName,
      sku: formSku || `SKU-${formName.slice(0,3).toUpperCase()}-${Math.floor(Math.random()*900)+100}`,
      category: formCategory,
      catLabel: catObj ? catObj.label : "Ground Masalas",
      status: mode === 'publish' ? formStatus : 'draft',
      variants: formVariants,
      thumb: editingProductId ? (products.find(p => p.id === editingProductId)?.thumb || 0) : Math.floor(Math.random()*6),
      featured: formFeatured,
      bestseller: formBestseller,
      miniLabel: formMiniLabel.trim() || undefined,
      tags: formTags.length > 0 ? [...formTags] : undefined,
    };

    if (editingProductId) {
      setProducts(prev => prev.map(p => p.id === editingProductId ? newProd : p));
      showToast(`"${formName}" updated successfully!`, mode === 'publish' ? 'rocket_launch' : 'save');
    } else {
      setProducts(prev => [newProd, ...prev]);
      showToast(`"${formName}" ${mode === 'publish' ? 'published' : 'saved as draft'}!`, mode === 'publish' ? 'rocket_launch' : 'save');
    }
    setIsProductPanelOpen(false);
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setIsDelProdModalOpen(false);
    showToast('Product deleted', 'delete');
  };

  const openIconPicker = (target: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setIconPicker({
      show: true,
      target,
      x: rect.left,
      y: rect.bottom + 5,
      q: ""
    });
  };

  const selectIcon = (icon: string) => {
    const [type, idxStr, subType] = iconPicker.target.split('-');
    const idx = parseInt(idxStr);
    
    if (type === 'desc') {
      setFormDescs(prev => prev.map((d, i) => i === idx ? { ...d, icon } : d));
    } else if (type === 'ingr') {
      setFormIngrRows(prev => prev.map((d, i) => i === idx ? { ...d, icon } : d));
    } else if (type === 'health') {
      setFormHealthRows(prev => prev.map((d, i) => i === idx ? { ...d, icon } : d));
    } else if (type === 'howto') {
      if (subType === 'tip') {
        setFormHowToRows(prev => prev.map((d, i) => i === idx ? { ...d, tipIcon: icon } : d));
      } else {
        setFormHowToRows(prev => prev.map((d, i) => i === idx ? { ...d, icon } : d));
      }
    }
    setIconPicker(prev => ({ ...prev, show: false }));
  };

  const handleBadgeToggle = (id: string) => {
    setFormBadges(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Tag helpers
  const addTag = () => {
    const t = formTagInput.trim();
    if (t && !formTags.includes(t)) {
      setFormTags(prev => [...prev, t]);
    }
    setFormTagInput("");
  };
  const removeTag = (idx: number) => setFormTags(prev => prev.filter((_, i) => i !== idx));

  const addVariant = () => setFormVariants(prev => [...prev, { w: "", p: 0, mrp: 0, s: 0 }]);
  const removeVariant = (idx: number) => setFormVariants(prev => prev.filter((_, i) => i !== idx));

  const addDescRow = () => setFormDescs(prev => [...prev, { icon: "inventory_2", title: "", desc: "", color: "primary" }]);
  const removeDescRow = (idx: number) => setFormDescs(prev => prev.filter((_, i) => i !== idx));

  const addIngrRow = () => setFormIngrRows(prev => [...prev, { icon: "spa", name: "", origin: "", color: "primary" }]);
  const removeIngrRow = (idx: number) => setFormIngrRows(prev => prev.filter((_, i) => i !== idx));

  const addNutrRow = () => setFormNutrRows(prev => [...prev, { name: "", amt: "", unit: "g" }]);
  const removeNutrRow = (idx: number) => setFormNutrRows(prev => prev.filter((_, i) => i !== idx));

  const addHealthRow = () => setFormHealthRows(prev => [...prev, { icon: "favorite", color: "primary", title: "", desc: "" }]);
  const removeHealthRow = (idx: number) => setFormHealthRows(prev => prev.filter((_, i) => i !== idx));

  const addHowToRow = () => setFormHowToRows(prev => [...prev, { icon: "soup_kitchen", theme: "primary", title: "", desc: "", tip: "", tipIcon: "timer" }]);
  const removeHowToRow = (idx: number) => setFormHowToRows(prev => prev.filter((_, i) => i !== idx));

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
        .badge-pulse{animation:pulse 2s cubic-bezier(0.4,0,0.6,1) infinite}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        .fade-up{animation:fadeUp 0.4s ease both}
        .fade-up-1{animation-delay:0.05s}.fade-up-2{animation-delay:0.10s}.fade-up-3{animation-delay:0.15s}.fade-up-4{animation-delay:0.20s}
        .prod-panel{transition:transform 0.38s cubic-bezier(0.4,0,0.2,1);transform:translateX(100%)}
        .prod-panel.open{transform:translateX(0)}
        .panel-overlay{transition:opacity 0.3s ease}
        .dropdown-menu{transition:opacity 0.15s ease,transform 0.15s ease;transform-origin:top right}
        .dropdown-menu.hidden{opacity:0;transform:scale(0.95);pointer-events:none}
        .form-section-body{transition:max-height 0.35s cubic-bezier(0.4,0,0.2,1),opacity:0.2s;overflow:hidden}
        .form-section.collapsed .form-section-body{max-height:0!important;opacity:0}
        .form-section.collapsed .section-chevron{transform:rotate(-90deg)}
        .section-chevron{transition:transform 0.3s ease}
        .pthmb-0{background:linear-gradient(135deg,#ff8a65 0%,#9f4122 60%,#5d1a0a 100%)}
        .pthmb-1{background:linear-gradient(135deg,#d6ed7a 0%,#bbd062 45%,#8fa800 100%)}
        .pthmb-2{background:linear-gradient(135deg,#bbe9ff 0%,#80b1c7 45%,#326578 100%)}
        .pthmb-3{background:linear-gradient(135deg,#ffdbd0 0%,#ffb59e 45%,#9f4122 100%)}
        .pthmb-4{background:linear-gradient(135deg,#f3ede2 0%,#ddc0b8 45%,#56423c 100%)}
        .pthmb-5{background:linear-gradient(135deg,#efffcc 0%,#bbd062 45%,#556500 100%)}
        .photo-drop{transition:border-color 0.2s,background 0.2s}
        .photo-drop:hover{border-color:#9f4122;background:rgba(159,65,34,0.04)}
        .tooltip{position:relative}
        .tooltip::after{content:attr(data-tip);position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);background:#1d1c15;color:#fff9ee;font-size:11px;padding:4px 8px;border-radius:6px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity 0.15s;z-index:999}
        .tooltip:hover::after{opacity:1}
        .preview-desc-card{background:linear-gradient(135deg,rgba(248,243,234,0.8),rgba(237,232,221,0.6))}
        .preview-ingr-primary{background:linear-gradient(135deg,rgba(255,138,101,0.4),rgba(159,65,34,0.1));border-color:rgba(159,65,34,0.2)}
        .preview-ingr-secondary{background:linear-gradient(135deg,rgba(214,237,122,0.5),rgba(187,208,98,0.2));border-color:rgba(85,101,0,0.2)}
        .preview-ingr-tertiary{background:linear-gradient(135deg,rgba(187,233,255,0.6),rgba(128,177,199,0.3));border-color:rgba(50,101,120,0.2)}
        .preview-ingr-neutral{background:linear-gradient(135deg,rgba(237,232,221,1),rgba(223,217,207,0.8));border-color:rgba(136,114,107,0.3)}
        .preview-howtouse-primary{background:linear-gradient(135deg,rgba(255,138,101,0.3),rgba(159,65,34,0.1));border-color:rgba(159,65,34,0.2)}
        .preview-howtouse-secondary{background:linear-gradient(135deg,rgba(214,237,122,0.4),rgba(187,208,98,0.2));border-color:rgba(85,101,0,0.2)}
        .preview-howtouse-tertiary{background:linear-gradient(135deg,rgba(187,233,255,0.4),rgba(128,177,199,0.3));border-color:rgba(50,101,120,0.2)}
        .form-inp:focus{outline:none;border-color:#9f4122;box-shadow:0 0 0 3px rgba(159,65,34,0.12)}
        .cat-chip{transition:box-shadow 0.18s,transform 0.18s}
        .cat-chip:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(159,65,34,0.12)}
        .cat-chip-del{opacity:0;transition:opacity 0.15s}
        .cat-chip:hover .cat-chip-del{opacity:1}
        .icon-grid-btn:hover{background:rgba(159,65,34,0.12);color:#9f4122}
        .icon-grid-btn.selected{background:#9f4122;color:#fff}
        .color-swatch{width:20px;height:20px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:transform 0.15s,border-color 0.15s}
        .color-swatch:hover{transform:scale(1.2)}
        .color-swatch.selected{border-color:#9f4122;transform:scale(1.15)}
        .tag-pill{display:inline-flex;align-items:center;gap:4px;background:rgba(159,65,34,0.08);border:1px solid rgba(159,65,34,0.2);border-radius:99px;padding:3px 10px;font-size:12px;font-weight:600;color:#9f4122}
      ` }} />

      <AdminSidebar pendingProducts={products.length} />

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
              <span className="text-on-surface font-semibold">Products</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 bg-surface-container rounded-full px-4 py-2 border border-outline-variant/30 w-48 xl:w-64">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
              <input 
                type="text" 
                placeholder="Search products…" 
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

        <main className="flex-1 p-4 md:p-6 space-y-5 md:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 fade-up">
            <div>
              <h1 className="font-extrabold text-[22px] md:text-[28px] text-on-surface leading-tight">All Products</h1>
              <p className="text-[13px] text-on-surface-variant mt-0.5">Manage your product catalog, variants & rich content</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={openAddProductPanel} className="flex items-center gap-2 bg-primary text-on-primary font-semibold text-[14px] px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span className="hidden sm:inline">Add Product</span>
                <span className="sm:hidden">Add</span>
              </button>
              <button className="flex items-center gap-1.5 bg-surface-container border border-outline-variant/30 rounded-full px-4 py-2.5 text-[13px] font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-[18px]">upload</span>
                <span className="hidden sm:inline">Import</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 fade-up fade-up-1">
            <div className="stat-card bg-surface-container-lowest rounded-[20px] border border-outline-variant/30 p-4 md:p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-[18px] md:text-[20px]">inventory_2</span>
                </div>
                <span className="text-[10px] font-bold text-secondary bg-secondary-container/60 px-2 py-0.5 rounded-full">+6 this month</span>
              </div>
              <p className="text-[24px] md:text-[28px] font-extrabold text-on-surface leading-none">{products.length}</p>
              <p className="text-[11px] md:text-[12px] text-on-surface-variant font-medium mt-1">Total Products</p>
            </div>
            <div className="stat-card bg-surface-container-lowest rounded-[20px] border border-outline-variant/30 p-4 md:p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-[18px] md:text-[20px]">check_circle</span>
                </div>
                <span className="text-[10px] font-bold text-secondary bg-secondary-container/60 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <p className="text-[24px] md:text-[28px] font-extrabold text-on-surface leading-none">{products.filter(p => p.status === 'active').length}</p>
              <p className="text-[11px] md:text-[12px] text-on-surface-variant font-medium mt-1">Published</p>
            </div>
            <div className="stat-card bg-surface-container-lowest rounded-[20px] border border-outline-variant/30 p-4 md:p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-error/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-error text-[18px] md:text-[20px]">warning</span>
                </div>
                <span className="text-[10px] font-bold text-error bg-error-container px-2 py-0.5 rounded-full badge-pulse">Alert</span>
              </div>
              <p className="text-[24px] md:text-[28px] font-extrabold text-on-surface leading-none">{products.filter(p => p.status === 'lowstock').length}</p>
              <p className="text-[11px] md:text-[12px] text-on-surface-variant font-medium mt-1">Low Stock</p>
            </div>
            <div className="stat-card bg-surface-container-lowest rounded-[20px] border border-outline-variant/30 p-4 md:p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-tertiary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary text-[18px] md:text-[20px]">category</span>
                </div>
                <span className="text-[10px] font-bold text-tertiary bg-tertiary-container/60 px-2 py-0.5 rounded-full">Updated</span>
              </div>
              <p className="text-[24px] md:text-[28px] font-extrabold text-on-surface leading-none">{categories.length}</p>
              <p className="text-[11px] md:text-[12px] text-on-surface-variant font-medium mt-1">Categories</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] shadow-sm fade-up fade-up-2">
            <div className="p-4 md:p-5 border-b border-outline-variant/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-tertiary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-tertiary text-[18px]">category</span>
                </div>
                <div>
                  <h3 className="font-bold text-[16px] text-on-surface">Manage Categories</h3>
                  <p className="text-[12px] text-on-surface-variant">Add, remove and customise your product categories & icons</p>
                </div>
              </div>
              <button onClick={openAddCategoryModal} className="flex items-center gap-1.5 bg-primary text-on-primary rounded-full px-4 py-2 text-[13px] font-semibold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 shrink-0">
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span className="hidden sm:inline">New Category</span>
              </button>
            </div>
            <div className="p-4 md:p-5 flex flex-wrap gap-3">
              {categories.map(c => (
                <div key={c.id} className="cat-chip relative flex items-center gap-2.5 bg-surface border border-outline-variant/40 rounded-full pl-3 pr-4 py-2.5 shadow-sm select-none group">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-[16px]">{c.icon}</span>
                  </div>
                  <span className="text-[13px] font-semibold text-on-surface">{c.label}</span>
                  <button 
                    className="cat-chip-del absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-error flex items-center justify-center shadow group-hover:opacity-100 opacity-0 transition-opacity"
                    onClick={(e) => { e.stopPropagation(); setDeletingCatId(c.id); setIsDelCatModalOpen(true); }}
                  >
                    <span className="material-symbols-outlined text-on-error text-[12px]">close</span>
                  </button>
                </div>
              ))}
                  {categories.length === 0 && (
                <div className="w-full flex flex-col items-center justify-center text-center py-6">
                  <span className="material-symbols-outlined text-[40px] text-outline mb-2">category</span>
                  <p className="text-[14px] font-semibold text-on-surface-variant">No categories yet</p>
                  <p className="text-[12px] text-outline mt-1">Click &quot;New Category&quot; to create your first one.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] shadow-sm fade-up fade-up-2">
            <div className="p-4 md:p-5 border-b border-outline-variant/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="font-bold text-[16px] text-on-surface">Product Catalog <span className="text-[13px] font-medium text-on-surface-variant ml-1">({filtered.length})</span></h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex md:hidden items-center gap-2 bg-surface-container rounded-full px-3 py-2 border border-outline-variant/30 flex-1 min-w-[160px]">
                    <span className="material-symbols-outlined text-on-surface-variant text-[17px]">search</span>
                    <input 
                      type="text" 
                      placeholder="Search products…" 
                      className="bg-transparent text-[12px] text-on-surface placeholder:text-outline border-none focus:ring-0 w-full p-0"
                      value={currentSearch}
                      onChange={(e) => setCurrentSearch(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <button onClick={() => setOpenDropdown(openDropdown === 'filter' ? null : 'filter')} className="flex items-center gap-1.5 bg-surface-container border border-outline-variant/30 rounded-full px-3 py-2 text-[12px] font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors">
                      <span className="material-symbols-outlined text-[16px]">filter_list</span>
                      <span className="hidden sm:inline">Filter</span>
                    </button>
                    <div className={`dropdown-menu absolute right-0 top-full mt-2 w-48 bg-surface-container-lowest border border-outline-variant/30 rounded-[16px] shadow-lg p-2 z-20 ${openDropdown === 'filter' ? '' : 'hidden'}`}>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider px-2 mb-1">Category</p>
                      <button onClick={() => { setCurrentFilter('all'); setOpenDropdown(null); }} className="w-full text-left px-3 py-2 rounded-xl text-[13px] text-on-surface hover:bg-surface-container transition-colors font-medium">All Categories</button>
                      {categories.map(c => (
                        <button key={c.id} onClick={() => { setCurrentFilter(c.id); setOpenDropdown(null); }} className="w-full text-left px-3 py-2 rounded-xl text-[13px] text-on-surface hover:bg-surface-container transition-colors">{c.label}</button>
                      ))}
                      <div className="h-px bg-outline-variant/20 my-1"></div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider px-2 mb-1">Status</p>
                      <button onClick={() => { setCurrentFilter('active'); setOpenDropdown(null); }} className="w-full text-left px-3 py-2 rounded-xl text-[13px] text-on-surface hover:bg-surface-container transition-colors">Active</button>
                      <button onClick={() => { setCurrentFilter('draft'); setOpenDropdown(null); }} className="w-full text-left px-3 py-2 rounded-xl text-[13px] text-on-surface hover:bg-surface-container transition-colors">Draft</button>
                      <button onClick={() => { setCurrentFilter('lowstock'); setOpenDropdown(null); }} className="w-full text-left px-3 py-2 rounded-xl text-[13px] text-on-surface hover:bg-surface-container transition-colors">Low Stock</button>
                    </div>
                  </div>
                  <div className="relative">
                    <button onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')} className="flex items-center gap-1.5 bg-surface-container border border-outline-variant/30 rounded-full px-3 py-2 text-[12px] font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors">
                      <span className="material-symbols-outlined text-[16px]">sort</span>
                      <span className="hidden sm:inline">Sort</span>
                    </button>
                    <div className={`dropdown-menu absolute right-0 top-full mt-2 w-44 bg-surface-container-lowest border border-outline-variant/30 rounded-[16px] shadow-lg p-2 z-20 ${openDropdown === 'sort' ? '' : 'hidden'}`}>
                      <button onClick={() => { setCurrentSort('newest'); setOpenDropdown(null); }} className="w-full text-left px-3 py-2 rounded-xl text-[13px] text-on-surface hover:bg-surface-container transition-colors font-medium">Newest First</button>
                      <button onClick={() => { setCurrentSort('oldest'); setOpenDropdown(null); }} className="w-full text-left px-3 py-2 rounded-xl text-[13px] text-on-surface hover:bg-surface-container transition-colors">Oldest First</button>
                      <button onClick={() => { setCurrentSort('name'); setOpenDropdown(null); }} className="w-full text-left px-3 py-2 rounded-xl text-[13px] text-on-surface hover:bg-surface-container transition-colors">Name A–Z</button>
                      <button onClick={() => { setCurrentSort('price'); setOpenDropdown(null); }} className="w-full text-left px-3 py-2 rounded-xl text-[13px] text-on-surface hover:bg-surface-container transition-colors">Price Low–High</button>
                    </div>
                  </div>
                  <button onClick={() => { showToast('CSV exported!', 'download'); }} className="flex items-center gap-1.5 bg-surface-container border border-outline-variant/30 rounded-full px-3 py-2 text-[12px] font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors tooltip" data-tip="Export CSV">
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    <span className="hidden sm:inline">Export</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto hide-scrollbar">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="bg-surface-container/60 border-b border-outline-variant/20">
                    <th className="text-left px-4 md:px-5 py-3 w-10"><input type="checkbox" className="w-4 h-4 rounded border-outline-variant cursor-pointer" style={{ accentColor: '#9f4122' }} /></th>
                    <th className="text-left px-4 md:px-5 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Product</th>
                    <th className="text-left px-4 md:px-5 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Category</th>
                    <th className="text-left px-4 md:px-5 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Weights</th>
                    <th className="text-left px-4 md:px-5 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider hidden lg:table-cell">Price Range</th>
                    <th className="text-left px-4 md:px-5 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider hidden lg:table-cell">Stock</th>
                    <th className="text-left px-4 md:px-5 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th className="text-right px-4 md:px-5 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15">
                  {filtered.map(p => {
                    const lowestPrice = Math.min(...p.variants.map(v => v.p));
                    const highestPrice = Math.max(...p.variants.map(v => v.p));
                    const totalStock = p.variants.reduce((a, v) => a + v.s, 0);
                    const priceStr = lowestPrice === highestPrice ? `৳${lowestPrice}` : `৳${lowestPrice}–৳${highestPrice}`;
                    const statusMap: Record<string, any> = {
                      active: { bg: 'bg-secondary-container/60', text: 'text-on-secondary-container', label: 'Active' },
                      draft: { bg: 'bg-surface-container-high', text: 'text-on-surface-variant', label: 'Draft' },
                      lowstock: { bg: 'bg-error-container', text: 'text-error', label: 'Low Stock' },
                      outofstock: { bg: 'bg-surface-variant', text: 'text-on-surface-variant', label: 'Out of Stock' },
                    };
                    const st = statusMap[p.status] || statusMap.draft;
                    const thmbIcons = ['local_fire_department', 'eco', 'water_drop', 'spa', 'grain', 'star'];
                    return (
                      <tr key={p.id} className="trow cursor-pointer" onClick={() => openEditProductPanel(p.id)}>
                        <td className="px-4 md:px-5 py-3.5" onClick={e => e.stopPropagation()}>
                          <input type="checkbox" className="w-4 h-4 rounded" style={{ accentColor: '#9f4122' }} />
                        </td>
                        <td className="px-4 md:px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-[12px] shrink-0 pthmb-${p.thumb} flex items-center justify-center overflow-hidden`}>
                              <span className="material-symbols-outlined text-white text-[18px] md:text-[20px]">{thmbIcons[p.thumb] || 'inventory_2'}</span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-[13px] text-on-surface truncate max-w-[130px] md:max-w-none">{p.name}</p>
                              <p className="text-[11px] text-on-surface-variant">{p.sku}</p>
                              <div className="flex gap-1 mt-0.5 flex-wrap">
                                {p.miniLabel && <span className="text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full border border-primary/20">{p.miniLabel}</span>}
                                {p.featured && <span className="text-[9px] font-bold bg-primary-fixed text-on-primary-container px-1.5 py-0.5 rounded-full">Featured</span>}
                                {p.bestseller && <span className="text-[9px] font-bold bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded-full">Best Seller</span>}
                              </div>
                              {p.tags && p.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {p.tags.slice(0,2).map((tag, ti) => (
                                    <span key={ti} className="text-[9px] font-medium bg-surface-container border border-outline-variant/40 text-on-surface-variant px-1.5 py-0.5 rounded-full">{tag}</span>
                                  ))}
                                  {p.tags.length > 2 && <span className="text-[9px] text-outline">+{p.tags.length - 2}</span>}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 md:px-5 py-3.5 hidden md:table-cell">
                          <span className="text-[12px] text-on-surface-variant">{p.catLabel}</span>
                        </td>
                        <td className="px-4 md:px-5 py-3.5">
                          <div className="flex flex-wrap gap-1">
                            {p.variants.map((v, i) => (
                              <span key={i} className="text-[10px] bg-surface-container border border-outline-variant/40 px-2 py-0.5 rounded-full text-on-surface-variant">{v.w}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 md:px-5 py-3.5 hidden lg:table-cell">
                          <span className="text-[13px] font-semibold text-on-surface">{priceStr}</span>
                        </td>
                        <td className="px-4 md:px-5 py-3.5 hidden lg:table-cell">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[13px] font-semibold ${totalStock < 20 ? 'text-error' : 'text-on-surface'}`}>{totalStock}</span>
                            {totalStock < 20 && <span className="material-symbols-outlined text-error text-[14px]">warning</span>}
                          </div>
                        </td>
                        <td className="px-4 md:px-5 py-3.5">
                          <span className={`text-[11px] font-semibold ${st.bg} ${st.text} px-2.5 py-1 rounded-full`}>{st.label}</span>
                        </td>
                        <td className="px-4 md:px-5 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => openEditProductPanel(p.id)} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant tooltip" data-tip="Edit">
                              <span className="material-symbols-outlined text-[17px]">edit</span>
                            </button>
                            <button onClick={() => showToast(`Viewing ${p.name}`, 'open_in_new')} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant tooltip" data-tip="View">
                              <span className="material-symbols-outlined text-[17px]">open_in_new</span>
                            </button>
                            <button onClick={() => { setDeletingProdId(p.id); setIsDelProdModalOpen(true); }} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-error-container transition-colors text-on-surface-variant hover:text-error tooltip" data-tip="Delete">
                              <span className="material-symbols-outlined text-[17px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-12 text-on-surface-variant text-[13px]">
                  <span className="material-symbols-outlined text-[40px] block mb-2 mx-auto text-outline-variant">inventory_2</span>
                  No products found
                </div>
              )}
            </div>
            <div className="px-4 md:px-5 py-4 border-t border-outline-variant/20 flex items-center justify-between">
              <span className="text-[12px] text-on-surface-variant">Showing 1–{filtered.length} of {filtered.length} products</span>
              <div className="flex items-center gap-1.5">
                <button className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant text-[13px]">‹</button>
                <button className="w-8 h-8 rounded-xl flex items-center justify-center bg-primary text-on-primary text-[13px] font-bold">1</button>
                <button className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant text-[13px]">›</button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ─── PRODUCT PANEL ─── */}
      <div 
        className={`panel-overlay fixed inset-0 bg-black/50 z-[55] transition-opacity duration-300 ${isProductPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsProductPanelOpen(false)}
      />
      <div className={`prod-panel fixed right-0 top-0 bottom-0 z-[60] w-full md:w-[680px] xl:w-[820px] bg-background flex flex-col shadow-2xl transition-transform duration-300 ${isProductPanelOpen ? 'open' : ''}`}>
        <div className="shrink-0 bg-surface/95 backdrop-blur-xl border-b border-outline-variant/30 px-4 md:px-6 py-4 flex items-center gap-3">
          <button onClick={() => setIsProductPanelOpen(false)} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-[17px] text-on-surface leading-none">{editingProductId ? 'Edit Product' : 'Add New Product'}</h2>
            <p className="text-[12px] text-on-surface-variant mt-0.5">Fill in all sections to publish to the storefront</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => saveProduct('draft')} className="hidden sm:flex items-center gap-1.5 bg-surface-container border border-outline-variant/30 rounded-full px-4 py-2 text-[13px] font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-[16px]">save</span>Save Draft
            </button>
            <button onClick={() => saveProduct('publish')} className="flex items-center gap-1.5 bg-primary text-on-primary rounded-full px-4 md:px-5 py-2 text-[13px] font-semibold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">
              <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
              <span className="hidden sm:inline">{editingProductId ? 'Update Product' : 'Publish Product'}</span>
              <span className="sm:hidden">Publish</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {/* SECTION 1: Basic Information */}
          <div className={`form-section bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] overflow-hidden ${collapsedSections.sec_basic ? 'collapsed' : ''}`}>
            <button onClick={() => toggleSection('sec_basic')} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-surface-container/50 transition-colors text-left">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[18px]">info</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[14px] text-on-surface">Basic Information</p>
                <p className="text-[11px] text-on-surface-variant">Name, SKU, category, status</p>
              </div>
              <span className="section-chevron material-symbols-outlined text-on-surface-variant text-[20px]">expand_more</span>
            </button>
            <div className="form-section-body" style={{ maxHeight: collapsedSections.sec_basic ? '0px' : '600px' }}>
              <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Product Name <span className="text-error">*</span></label>
                  <input type="text" value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. Garam Masala Blend" className="form-inp w-full bg-surface-container rounded-[12px] border border-outline-variant/60 px-4 py-3 text-[14px] text-on-surface transition-all"/>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">SKU</label>
                  <div className="relative">
                    <input type="text" value={formSku} onChange={e => setFormSku(e.target.value)} placeholder="Auto-generate" className="form-inp w-full bg-surface-container rounded-[12px] border border-outline-variant/60 px-4 py-3 text-[14px] text-on-surface transition-all pr-24"/>
                    <button onClick={() => setFormSku(`SKU-${formName.slice(0,3).toUpperCase() || 'PRO'}-${Math.floor(Math.random()*900)+100}`)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-primary bg-primary-fixed px-2.5 py-1 rounded-full hover:bg-primary-fixed-dim transition-colors">Auto</button>
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Category</label>
                  <select value={formCategory} onChange={e => setFormCategory(e.target.value)} className="form-inp w-full bg-surface-container rounded-[12px] border border-outline-variant/60 px-4 py-3 text-[14px] text-on-surface transition-all appearance-none cursor-pointer">
                    <option value="">Select category…</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Status</label>
                  <select value={formStatus} onChange={e => setFormStatus(e.target.value)} className="form-inp w-full bg-surface-container rounded-[12px] border border-outline-variant/60 px-4 py-3 text-[14px] text-on-surface transition-all appearance-none cursor-pointer">
                    <option value="active">🟢 Active (Published)</option>
                    <option value="draft">⚪ Draft</option>
                    <option value="outofstock">🔴 Out of Stock</option>
                    <option value="coming">🟡 Coming Soon</option>
                  </select>
                </div>
                <div className="sm:col-span-2 flex gap-3 flex-wrap">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={formFeatured} onChange={e => setFormFeatured(e.target.checked)} className="w-4 h-4 rounded" style={{ accentColor: '#9f4122' }} />
                    <span className="text-[13px] font-medium text-on-surface">Featured Product</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={formBestseller} onChange={e => setFormBestseller(e.target.checked)} className="w-4 h-4 rounded" style={{ accentColor: '#9f4122' }} />
                    <span className="text-[13px] font-medium text-on-surface">Best Seller</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={formNewbadge} onChange={e => setFormNewbadge(e.target.checked)} className="w-4 h-4 rounded" style={{ accentColor: '#9f4122' }} />
                    <span className="text-[13px] font-medium text-on-surface">New Badge</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Product Image */}
          <div className={`form-section bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] overflow-hidden ${collapsedSections.sec_photos ? 'collapsed' : ''}`}>
            <button onClick={() => toggleSection('sec_photos')} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-surface-container/50 transition-colors text-left">
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary text-[18px]">image</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[14px] text-on-surface">Product Image</p>
                <p className="text-[11px] text-on-surface-variant">Select an image from your public/images folder</p>
              </div>
              <span className="section-chevron material-symbols-outlined text-on-surface-variant text-[20px]">expand_more</span>
            </button>
            <div className="form-section-body" style={{ maxHeight: collapsedSections.sec_photos ? '0px' : '400px' }}>
              <div className="px-5 pb-5">
                <label className="block text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide mb-2">Selected Image</label>
                {selectedProductImage ? (
                  <div className="flex items-center gap-3 mb-3 bg-surface-container rounded-[12px] px-4 py-3 border border-outline-variant/40">
                    <div className="w-10 h-10 rounded-[10px] overflow-hidden shrink-0 flex items-center justify-center" style={{ background: PUBLIC_IMAGES.find(i => i.name === selectedProductImage)?.gradient || '#f3ede2' }}>
                      <span className="material-symbols-outlined text-white text-[18px]">{PUBLIC_IMAGES.find(i => i.name === selectedProductImage)?.icon || 'image'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-on-surface truncate">{PUBLIC_IMAGES.find(i => i.name === selectedProductImage)?.label}</p>
                      <p className="text-[11px] text-on-surface-variant truncate">public/images/{selectedProductImage}</p>
                    </div>
                    <button onClick={() => setSelectedProductImage(null)} className="w-7 h-7 rounded-full hover:bg-error-container hover:text-error text-on-surface-variant flex items-center justify-center transition-colors shrink-0">
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                ) : (
                  <p className="text-[12px] text-outline mb-3">No image selected yet.</p>
                )}
                <button
                  onClick={() => { setImagePickerSearch(""); setIsImagePickerOpen(true); }}
                  className="photo-drop w-full border-2 border-dashed border-outline-variant/50 rounded-[16px] py-5 flex flex-col items-center gap-2 text-on-surface-variant hover:border-primary hover:text-primary transition-all"
                >
                  <span className="material-symbols-outlined text-[32px]">add_photo_alternate</span>
                  <span className="text-[13px] font-semibold">Browse Images</span>
                  <span className="text-[11px] opacity-70">Click to open image gallery</span>
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 3: Weight & Price Variants */}
          <div className={`form-section bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] overflow-hidden ${collapsedSections.sec_variants ? 'collapsed' : ''}`}>
            <button onClick={() => toggleSection('sec_variants')} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-surface-container/50 transition-colors text-left">
              <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-tertiary text-[18px]">scale</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[14px] text-on-surface">Weight & Price Variants</p>
                <p className="text-[11px] text-on-surface-variant">Add multiple weights with individual prices & stock</p>
              </div>
              <span className="section-chevron material-symbols-outlined text-on-surface-variant text-[20px]">expand_more</span>
            </button>
            <div className="form-section-body" style={{ maxHeight: collapsedSections.sec_variants ? '0px' : '700px' }}>
              <div className="px-5 pb-5">
                <div className="grid grid-cols-12 gap-2 px-2 pb-1.5 border-b border-outline-variant/20 mb-2">
                  <p className="col-span-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Weight</p>
                  <p className="col-span-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Price (৳)</p>
                  <p className="col-span-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">MRP (৳)</p>
                  <p className="col-span-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Stock</p>
                </div>
                <div className="space-y-2">
                  {formVariants.map((v, i) => (
                    <div key={i} className="variant-row grid grid-cols-12 gap-2 items-center bg-surface-container/50 rounded-[12px] px-2 py-2">
                      <input type="text" value={v.w} onChange={e => setFormVariants(prev => prev.map((curr, idx) => idx === i ? { ...curr, w: e.target.value } : curr))} placeholder="200g" className="col-span-3 form-inp bg-surface rounded-[10px] border border-outline-variant/50 px-3 py-2 text-[13px] text-on-surface text-center focus:outline-none transition-all"/>
                      <input type="number" value={v.p} onChange={e => setFormVariants(prev => prev.map((curr, idx) => idx === i ? { ...curr, p: parseInt(e.target.value) || 0 } : curr))} placeholder="৳ Price" className="col-span-3 form-inp bg-surface rounded-[10px] border border-outline-variant/50 px-3 py-2 text-[13px] text-on-surface text-center focus:outline-none transition-all"/>
                      <input type="number" value={v.mrp} onChange={e => setFormVariants(prev => prev.map((curr, idx) => idx === i ? { ...curr, mrp: parseInt(e.target.value) || 0 } : curr))} placeholder="৳ MRP" className="col-span-3 form-inp bg-surface rounded-[10px] border border-outline-variant/50 px-3 py-2 text-[13px] text-on-surface text-center focus:outline-none transition-all"/>
                      <input type="number" value={v.s} onChange={e => setFormVariants(prev => prev.map((curr, idx) => idx === i ? { ...curr, s: parseInt(e.target.value) || 0 } : curr))} placeholder="Qty" className="col-span-2 form-inp bg-surface rounded-[10px] border border-outline-variant/50 px-2 py-2 text-[13px] text-on-surface text-center focus:outline-none transition-all"/>
                      <button onClick={() => removeVariant(i)} className="col-span-1 w-7 h-7 rounded-full hover:bg-error-container hover:text-error text-on-surface-variant flex items-center justify-center transition-colors mx-auto">
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={addVariant} className="mt-3 flex items-center gap-2 text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors">
                  <div className="w-7 h-7 rounded-full border-2 border-primary/40 flex items-center justify-center hover:border-primary transition-colors">
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </div>
                  Add Weight Variant
                </button>
                <div className="mt-4 pt-4 border-t border-outline-variant/20">
                  <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide mb-2">Preview (as shown on product page)</p>
                  <div className="flex flex-wrap gap-2">
                    {formVariants.map((v, i) => (
                      v.w && (
                        <button 
                          key={i} 
                          className={`px-4 py-2 rounded-full border-2 text-[13px] font-semibold transition-colors ${i === 0 ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant bg-surface text-on-surface'}`}
                        >
                          {v.w} {v.p > 0 && ` · ৳${v.p}`}
                        </button>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: Mini Info — now with Mini Label + Tags */}
          <div className={`form-section bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] overflow-hidden ${collapsedSections.sec_miniinfo ? 'collapsed' : ''}`}>
            <button onClick={() => toggleSection('sec_miniinfo')} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-surface-container/50 transition-colors text-left">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[18px]">description</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[14px] text-on-surface">Mini Product Information</p>
                <p className="text-[11px] text-on-surface-variant">Short description, mini label, badges & product tags</p>
              </div>
              <span className="section-chevron material-symbols-outlined text-on-surface-variant text-[20px]">expand_more</span>
            </button>
            <div className="form-section-body" style={{ maxHeight: collapsedSections.sec_miniinfo ? '0px' : '900px' }}>
              <div className="px-5 pb-5 space-y-4">
                {/* ── NEW: Mini Label ── */}
                <div>
                  <label className="block text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Mini Label <span className="text-[11px] font-normal text-outline normal-case tracking-normal">(e.g. &quot;Premium Grade&quot;, &quot;Farm Fresh&quot;)</span></label>
                  <input
                    type="text"
                    value={formMiniLabel}
                    onChange={e => setFormMiniLabel(e.target.value)}
                    maxLength={30}
                    placeholder="Premium Grade"
                    className="form-inp w-full bg-surface-container rounded-[12px] border border-outline-variant/60 px-4 py-3 text-[14px] text-on-surface transition-all"
                  />
                  {formMiniLabel && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] text-on-surface-variant">Preview:</span>
                      <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">{formMiniLabel}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Short Description</label>
                  <textarea rows={3} value={formShortDesc} onChange={e => setFormShortDesc(e.target.value)} placeholder="Brief aromatic blend description…" className="form-inp w-full bg-surface-container rounded-[12px] border border-outline-variant/60 px-4 py-3 text-[14px] text-on-surface placeholder:text-outline resize-none transition-all"></textarea>
                  <p className="text-[11px] text-outline mt-1 text-right">{formShortDesc.length}/150 characters</p>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide mb-2">Product Badges</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {BADGES_LIST.map(b => (
                      <label key={b.id} className="flex items-center gap-2 cursor-pointer select-none bg-surface-container rounded-[10px] px-3 py-2.5 border border-outline-variant/30 hover:border-primary/40 transition-colors">
                        <input type="checkbox" checked={formBadges.has(b.id)} onChange={() => handleBadgeToggle(b.id)} className="w-3.5 h-3.5 rounded shrink-0" style={{ accentColor: '#9f4122' }} />
                        <span className="material-symbols-outlined text-on-surface-variant text-[15px]">{b.icon}</span>
                        <span className="text-[12px] font-medium text-on-surface">{b.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ── NEW: Product Tags ── */}
                <div>
                  <label className="block text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Product Tags <span className="text-[11px] font-normal text-outline normal-case tracking-normal">(e.g. &quot;14 Whole Spices&quot;, &quot;No MSG&quot;)</span></label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formTagInput}
                      onChange={e => setFormTagInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                      placeholder="Type a tag and press Enter or Add"
                      className="form-inp flex-1 bg-surface-container rounded-[12px] border border-outline-variant/60 px-4 py-2.5 text-[13px] text-on-surface transition-all"
                    />
                    <button onClick={addTag} className="flex items-center gap-1 bg-primary text-on-primary rounded-full px-4 py-2 text-[13px] font-semibold hover:bg-primary/90 transition-colors shrink-0">
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      Add
                    </button>
                  </div>
                  {formTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formTags.map((tag, i) => (
                        <span key={i} className="tag-pill">
                          {tag}
                          <button onClick={() => removeTag(i)} className="ml-1 text-primary/60 hover:text-error transition-colors">
                            <span className="material-symbols-outlined text-[13px]">close</span>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Full Description</label>
                  <textarea rows={4} value={formFullDesc} onChange={e => setFormFullDesc(e.target.value)} placeholder="Detailed product description…" className="form-inp w-full bg-surface-container rounded-[12px] border border-outline-variant/60 px-4 py-3 text-[14px] text-on-surface placeholder:text-outline resize-none transition-all"></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: Rich Descriptions — now with Heading input */}
          <div className={`form-section bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] overflow-hidden ${collapsedSections.sec_desc ? 'collapsed' : ''}`}>
            <button onClick={() => toggleSection('sec_desc')} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-surface-container/50 transition-colors text-left">
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary text-[18px]">view_list</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[14px] text-on-surface">Rich Icon Descriptions</p>
                <p className="text-[11px] text-on-surface-variant">Section heading + icon cards shown on product page</p>
              </div>
              <span className="section-chevron material-symbols-outlined text-on-surface-variant text-[20px]">expand_more</span>
            </button>
            <div className="form-section-body" style={{ maxHeight: collapsedSections.sec_desc ? '0px' : '1000px' }}>
              <div className="px-5 pb-5 space-y-3">
                {/* ── NEW: Description Section Heading ── */}
                <div>
                  <label className="block text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Section Heading <span className="text-[11px] font-normal text-outline normal-case tracking-normal">(shown above the description cards)</span></label>
                  <input
                    type="text"
                    value={formDescHeading}
                    onChange={e => setFormDescHeading(e.target.value)}
                    placeholder="e.g. Why Choose Our Blend?"
                    className="form-inp w-full bg-surface-container rounded-[12px] border border-outline-variant/60 px-4 py-3 text-[14px] text-on-surface transition-all"
                  />
                </div>
                <div className="space-y-3">
                  {formDescs.map((d, i) => (
                    <div key={i} className="bg-surface-container/60 rounded-[16px] border border-outline-variant/30 p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <button onClick={(e) => openIconPicker(`desc-${i}`, e)} className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${{primary:'bg-primary/10 border-primary/20', secondary:'bg-secondary/10 border-secondary/20', tertiary:'bg-tertiary/10 border-tertiary/20'}[d.color]}`}>
                          <span className={`material-symbols-outlined text-[20px] ${{primary:'text-primary', secondary:'text-secondary', tertiary:'text-tertiary'}[d.color]}`}>{d.icon}</span>
                        </button>
                        <div className="flex-1 space-y-2">
                          <input type="text" value={d.title} onChange={e => setFormDescs(prev => prev.map((curr, idx) => idx === i ? { ...curr, title: e.target.value } : curr))} placeholder="Card Title" className="form-inp w-full bg-surface rounded-[10px] border border-outline-variant/50 px-3 py-2 text-[13px] text-on-surface transition-all"/>
                          <textarea rows={2} value={d.desc} onChange={e => setFormDescs(prev => prev.map((curr, idx) => idx === i ? { ...curr, desc: e.target.value } : curr))} placeholder="Description..." className="form-inp w-full bg-surface rounded-[10px] border border-outline-variant/50 px-3 py-2 text-[13px] text-on-surface resize-none transition-all"></textarea>
                        </div>
                        <div className="flex flex-col items-center gap-2 shrink-0">
                          <div className="flex gap-1">
                            {['primary', 'secondary', 'tertiary'].map(c => (
                              <div key={c} className={`color-swatch ${c === 'primary' ? 'bg-primary' : c === 'secondary' ? 'bg-secondary' : 'bg-tertiary'} ${d.color === c ? 'selected' : ''}`} onClick={() => setFormDescs(prev => prev.map((curr, idx) => idx === i ? { ...curr, color: c } : curr))}></div>
                            ))}
                          </div>
                          <button onClick={() => removeDescRow(i)} className="w-7 h-7 rounded-full hover:bg-error-container hover:text-error text-on-surface-variant flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined text-[16px]">close</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={addDescRow} className="flex items-center gap-2 text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors">
                  <div className="w-7 h-7 rounded-full border-2 border-primary/40 flex items-center justify-center hover:border-primary transition-colors">
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </div>
                  Add Description Card
                </button>
                <div className="mt-4 pt-4 border-t border-outline-variant/20 space-y-2">
                  {formDescHeading && <p className="font-bold text-[14px] text-on-surface mb-3">{formDescHeading}</p>}
                  {formDescs.map((d, i) => (
                    <div key={i} className="flex items-start gap-3 preview-desc-card rounded-[16px] p-4 border border-outline-variant/30">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${{primary:'bg-primary/10', secondary:'bg-secondary/10', tertiary:'bg-tertiary/10'}[d.color]}`}>
                        <span className={`material-symbols-outlined text-[18px] ${{primary:'text-primary', secondary:'text-secondary', tertiary:'text-tertiary'}[d.color]}`}>{d.icon}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-[13px] text-on-surface">{d.title || 'Card Title'}</p>
                        <p className="text-[12px] text-on-surface-variant leading-snug mt-0.5">{d.desc || 'Description…'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6: Rich Ingredients — now with Heading + Allergen Info */}
          <div className={`form-section bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] overflow-hidden ${collapsedSections.sec_ingr ? 'collapsed' : ''}`}>
            <button onClick={() => toggleSection('sec_ingr')} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-surface-container/50 transition-colors text-left">
              <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-tertiary text-[18px]">spa</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[14px] text-on-surface">Rich Icon Ingredients</p>
                <p className="text-[11px] text-on-surface-variant">Section heading, ingredient cards, allergen info</p>
              </div>
              <span className="section-chevron material-symbols-outlined text-on-surface-variant text-[20px]">expand_more</span>
            </button>
            <div className="form-section-body" style={{ maxHeight: collapsedSections.sec_ingr ? '0px' : '1400px' }}>
              <div className="px-5 pb-5 space-y-3">
                {/* ── NEW: Ingredients Section Heading ── */}
                <div>
                  <label className="block text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Section Heading <span className="text-[11px] font-normal text-outline normal-case tracking-normal">(shown above ingredient cards)</span></label>
                  <input
                    type="text"
                    value={formIngrHeading}
                    onChange={e => setFormIngrHeading(e.target.value)}
                    placeholder="e.g. What's Inside"
                    className="form-inp w-full bg-surface-container rounded-[12px] border border-outline-variant/60 px-4 py-3 text-[14px] text-on-surface transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Ingredients Text</label>
                  <textarea rows={2} value={formIngrText} onChange={e => setFormIngrText(e.target.value)} placeholder="Coriander, Cumin, Black Pepper…" className="form-inp w-full bg-surface-container rounded-[12px] border border-outline-variant/60 px-4 py-3 text-[14px] text-on-surface placeholder:text-outline resize-none transition-all"></textarea>
                </div>
                <div className="space-y-3">
                  {formIngrs.map((n, i) => (
                    <div key={i} className="bg-surface-container/60 rounded-[16px] border border-outline-variant/30 p-4">
                      <div className="flex items-center gap-3">
                        <button onClick={(e) => openIconPicker(`ingr-${i}`, e)} className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 hover:bg-primary/20 transition-colors cursor-pointer border-2 border-primary/20">
                          <span className="material-symbols-outlined text-primary text-[19px]">{n.icon}</span>
                        </button>
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <input type="text" value={n.name} onChange={e => setFormIngrRows(prev => prev.map((curr, idx) => idx === i ? { ...curr, name: e.target.value } : curr))} placeholder="Ingredient name" className="form-inp bg-surface rounded-[10px] border border-outline-variant/50 px-3 py-2 text-[13px] text-on-surface transition-all"/>
                          <input type="text" value={n.origin} onChange={e => setFormIngrRows(prev => prev.map((curr, idx) => idx === i ? { ...curr, origin: e.target.value } : curr))} placeholder="Origin · Note" className="form-inp bg-surface rounded-[10px] border border-outline-variant/50 px-3 py-2 text-[12px] text-on-surface transition-all"/>
                        </div>
                        <div className="flex flex-col items-center gap-2 shrink-0">
                          <div className="flex gap-1">
                            {['primary', 'secondary', 'tertiary', 'neutral'].map(c => (
                              <div key={c} className={`color-swatch ${c === 'primary' ? 'bg-primary' : c === 'secondary' ? 'bg-secondary' : c === 'tertiary' ? 'bg-tertiary' : 'bg-on-surface-variant'} ${n.color === c ? 'selected' : ''}`} onClick={() => setFormIngrRows(prev => prev.map((curr, idx) => idx === i ? { ...curr, color: c } : curr))}></div>
                            ))}
                          </div>
                          <button onClick={() => removeIngrRow(i)} className="w-7 h-7 rounded-full hover:bg-error-container hover:text-error text-on-surface-variant flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined text-[16px]">close</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={addIngrRow} className="flex items-center gap-2 text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors">
                  <div className="w-7 h-7 rounded-full border-2 border-primary/40 flex items-center justify-center hover:border-primary transition-colors">
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </div>
                  Add Ingredient Card
                </button>

                {/* ── NEW: Allergen Info ── */}
                <div className="pt-2">
                  <label className="block text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-error">warning</span>
                      Allergen Info
                    </span>
                  </label>
                  <textarea
                    rows={2}
                    value={formAllergenInfo}
                    onChange={e => setFormAllergenInfo(e.target.value)}
                    placeholder="e.g. May contain traces of nuts and sesame. Manufactured in a facility that also processes wheat."
                    className="form-inp w-full bg-error/5 border border-error/20 rounded-[12px] px-4 py-3 text-[13px] text-on-surface placeholder:text-outline resize-none transition-all focus:border-error/40 focus:shadow-[0_0_0_3px_rgba(186,26,26,0.08)]"
                  />
                  {formAllergenInfo && (
                    <div className="mt-2 flex items-start gap-2 bg-error/5 border border-error/20 rounded-[12px] px-3 py-2.5">
                      <span className="material-symbols-outlined text-error text-[15px] shrink-0 mt-0.5">warning</span>
                      <p className="text-[11px] text-error/80 font-medium leading-snug">{formAllergenInfo}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                  {formIngrs.map((n, i) => (
                    <div key={i} className={`rounded-[16px] p-3 border flex flex-col gap-1.5 ${{primary:'preview-ingr-primary', secondary:'preview-ingr-secondary', tertiary:'preview-ingr-tertiary', neutral:'preview-ingr-neutral'}[n.color]}`}>
                      <span className={`material-symbols-outlined text-[20px] ${{primary:'text-primary', secondary:'text-secondary', tertiary:'text-tertiary', neutral:'text-on-surface-variant'}[n.color]}`}>{n.icon}</span>
                      <p className="font-bold text-[12px] text-on-surface">{n.name || 'Ingredient'}</p>
                      <p className="text-[10px] text-on-surface-variant">{n.origin}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 7: Nutrition */}
          <div className={`form-section bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] overflow-hidden ${collapsedSections.sec_nutr ? 'collapsed' : ''}`}>
            <button onClick={() => toggleSection('sec_nutr')} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-surface-container/50 transition-colors text-left">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[18px]">nutrition</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[14px] text-on-surface">Nutrition Facts</p>
                <p className="text-[11px] text-on-surface-variant">Structured nutrition table shown on product page</p>
              </div>
              <span className="section-chevron material-symbols-outlined text-on-surface-variant text-[20px]">expand_more</span>
            </button>
            <div className="form-section-body" style={{ maxHeight: collapsedSections.sec_nutr ? '0px' : '1000px' }}>
              <div className="px-5 pb-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Serving Size</label>
                    <input type="text" value={formServing} onChange={e => setFormServing(e.target.value)} className="form-inp w-full bg-surface-container rounded-[12px] border border-outline-variant/60 px-4 py-3 text-[14px] text-on-surface transition-all"/>
                  </div>
                  <div className="flex-1">
                    <label className="block text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Servings Per Pack</label>
                    <input type="number" value={formServingsPer} onChange={e => setFormServingsPer(e.target.value)} placeholder="e.g. 20" className="form-inp w-full bg-surface-container rounded-[12px] border border-outline-variant/60 px-4 py-3 text-[14px] text-on-surface transition-all"/>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 px-2 pb-1.5 border-b border-outline-variant/20">
                    <p className="col-span-5 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Nutrient</p>
                    <p className="col-span-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Amount</p>
                    <p className="col-span-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Unit</p>
                  </div>
                  {formNutrs.map((n, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center bg-surface-container/40 rounded-[10px] px-2 py-2">
                      <input type="text" value={n.name} onChange={e => setFormNutrRows(prev => prev.map((curr, idx) => idx === i ? { ...curr, name: e.target.value } : curr))} placeholder="Nutrient" className="col-span-5 form-inp bg-surface rounded-[10px] border border-outline-variant/50 px-3 py-2 text-[13px] text-on-surface transition-all"/>
                      <input type="text" value={n.amt} onChange={e => setFormNutrRows(prev => prev.map((curr, idx) => idx === i ? { ...curr, amt: e.target.value } : curr))} placeholder="0" className="col-span-3 form-inp bg-surface rounded-[10px] border border-outline-variant/50 px-3 py-2 text-[13px] text-on-surface text-center transition-all"/>
                      <select value={n.unit} onChange={e => setFormNutrRows(prev => prev.map((curr, idx) => idx === i ? { ...curr, unit: e.target.value } : curr))} className="col-span-3 form-inp bg-surface rounded-[10px] border border-outline-variant/50 px-2 py-2 text-[12px] text-on-surface transition-all">
                        <option>kcal</option><option>g</option><option>mg</option><option>mcg</option><option>IU</option><option>%</option>
                      </select>
                      <button onClick={() => removeNutrRow(i)} className="col-span-1 w-7 h-7 rounded-full hover:bg-error-container hover:text-error text-on-surface-variant flex items-center justify-center transition-colors mx-auto">
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  ))}
                  <button onClick={addNutrRow} className="mt-3 flex items-center gap-2 text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors">
                    <div className="w-7 h-7 rounded-full border-2 border-primary/40 flex items-center justify-center hover:border-primary transition-colors">
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    </div>
                    Add Nutrient Row
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-outline-variant/20">
                  <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide mb-2">Preview (nutrition label style)</p>
                  <div className="rounded-[16px] border-2 border-on-surface overflow-hidden max-w-xs">
                    <div className="bg-on-surface text-surface px-4 py-2.5">
                      <p className="text-[10px] font-bold tracking-widest uppercase">Nutrition Facts</p>
                      <p className="font-bold text-[14px]">{formName || 'Product'} · {formServing || 'Per serving'}</p>
                    </div>
                    <div className="bg-surface px-4 divide-y divide-outline-variant/30">
                      {formNutrs.map((n, i) => n.name && (
                        <div key={i} className="flex justify-between py-2">
                          <span className="text-[12px] font-semibold text-on-surface">{n.name}</span>
                          <span className="text-[12px] font-semibold text-on-surface">{n.amt}{n.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide mb-2">Health Benefit Cards (optional)</label>
                  <div className="space-y-3">
                    {formHealths.map((n, i) => (
                      <div key={i} className="bg-surface-container/60 rounded-[16px] border border-outline-variant/30 p-4">
                        <div className="flex items-center gap-3">
                          <button onClick={(e) => openIconPicker(`health-${i}`, e)} className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 hover:bg-primary/20 transition-colors cursor-pointer border-2 border-primary/20">
                            <span className="material-symbols-outlined text-primary text-[18px]">{n.icon}</span>
                          </button>
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <input type="text" value={n.title} onChange={e => setFormHealthRows(prev => prev.map((curr, idx) => idx === i ? { ...curr, title: e.target.value } : curr))} placeholder="Benefit title" className="form-inp bg-surface rounded-[10px] border border-outline-variant/50 px-3 py-2 text-[13px] text-on-surface transition-all"/>
                            <input type="text" value={n.desc} onChange={e => setFormHealthRows(prev => prev.map((curr, idx) => idx === i ? { ...curr, desc: e.target.value } : curr))} placeholder="Brief description" className="form-inp bg-surface rounded-[10px] border border-outline-variant/50 px-3 py-2 text-[12px] text-on-surface transition-all"/>
                          </div>
                          <button onClick={() => removeHealthRow(i)} className="w-7 h-7 rounded-full hover:bg-error-container hover:text-error text-on-surface-variant flex items-center justify-center transition-colors shrink-0">
                            <span className="material-symbols-outlined text-[16px]">close</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={addHealthRow} className="mt-2 flex items-center gap-2 text-[13px] font-semibold text-secondary hover:text-secondary/80 transition-colors">
                    <div className="w-7 h-7 rounded-full border-2 border-secondary/40 flex items-center justify-center hover:border-secondary transition-colors">
                      <span className="material-symbols-outlined text-[16px] text-secondary">add</span>
                    </div>
                    Add Health Benefit
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 8: How to Use */}
          <div className={`form-section bg-surface-container-lowest border border-outline-variant/30 rounded-[20px] overflow-hidden ${collapsedSections.sec_howto ? 'collapsed' : ''}`}>
            <button onClick={() => toggleSection('sec_howto')} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-surface-container/50 transition-colors text-left">
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary text-[18px]">menu_book</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[14px] text-on-surface">Rich Icon How to Use</p>
                <p className="text-[11px] text-on-surface-variant">Usage cards with icons, tips and pro-tip note</p>
              </div>
              <span className="section-chevron material-symbols-outlined text-on-surface-variant text-[20px]">expand_more</span>
            </button>
            <div className="form-section-body" style={{ maxHeight: collapsedSections.sec_howto ? '0px' : '1200px' }}>
              <div className="px-5 pb-5 space-y-3">
                <div className="space-y-3">
                  {formHowTos.map((n, i) => (
                    <div key={i} className="bg-surface-container/60 rounded-[16px] border border-outline-variant/30 p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <button onClick={(e) => openIconPicker(`howto-${i}`, e)} className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0 hover:bg-primary/20 transition-colors cursor-pointer border-2 border-primary/20">
                          <span className="material-symbols-outlined text-primary text-[20px]">{n.icon}</span>
                        </button>
                        <div className="flex-1 space-y-2">
                          <input type="text" value={n.title} onChange={e => setFormHowToRows(prev => prev.map((curr, idx) => idx === i ? { ...curr, title: e.target.value } : curr))} placeholder="Usage title" className="form-inp w-full bg-surface rounded-[10px] border border-outline-variant/50 px-3 py-2 text-[13px] text-on-surface transition-all"/>
                          <textarea rows={2} value={n.desc} onChange={e => setFormHowToRows(prev => prev.map((curr, idx) => idx === i ? { ...curr, desc: e.target.value } : curr))} placeholder="Detailed usage description…" className="form-inp w-full bg-surface rounded-[10px] border border-outline-variant/50 px-3 py-2 text-[13px] text-on-surface resize-none transition-all"></textarea>
                          <div className="flex gap-2">
                            <input type="text" value={n.tip} onChange={e => setFormHowToRows(prev => prev.map((curr, idx) => idx === i ? { ...curr, tip: e.target.value } : curr))} placeholder="Tip label" className="form-inp flex-1 bg-surface rounded-[10px] border border-outline-variant/50 px-3 py-2 text-[12px] text-on-surface transition-all"/>
                            <button onClick={(e) => openIconPicker(`howto-${i}-tip`, e)} className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center shrink-0 hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/40">
                              <span className="material-symbols-outlined text-on-surface-variant text-[17px]">{n.tipIcon}</span>
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-2 shrink-0">
                          <div className="flex gap-1">
                            {['primary', 'secondary', 'tertiary'].map(t => (
                              <div key={t} className={`color-swatch ${t === 'primary' ? 'bg-primary' : t === 'secondary' ? 'bg-secondary' : 'bg-tertiary'} ${n.theme === t ? 'selected' : ''}`} onClick={() => setFormHowToRows(prev => prev.map((curr, idx) => idx === i ? { ...curr, theme: t } : curr))}></div>
                            ))}
                          </div>
                          <button onClick={() => removeHowToRow(i)} className="w-7 h-7 rounded-full hover:bg-error-container hover:text-error text-on-surface-variant flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined text-[16px]">close</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={addHowToRow} className="flex items-center gap-2 text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors">
                  <div className="w-7 h-7 rounded-full border-2 border-primary/40 flex items-center justify-center hover:border-primary transition-colors">
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </div>
                  Add Usage Card
                </button>
                <div className="mt-4 pt-4 border-t border-outline-variant/20 space-y-2">
                  <label className="block text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide">Pro Tip</label>
                  <textarea rows={2} value={formProtip} onChange={e => setFormProtip(e.target.value)} placeholder="Pro tip note…" className="form-inp w-full bg-surface-container rounded-[12px] border border-outline-variant/60 px-4 py-3 text-[14px] text-on-surface placeholder:text-outline resize-none transition-all"></textarea>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  {formHowTos.map((n, i) => (
                    <div key={i} className={`rounded-[20px] p-4 border ${{primary:'preview-howtouse-primary', secondary:'preview-howtouse-secondary', tertiary:'preview-howtouse-tertiary'}[n.theme]}`}>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-3 ${{primary:'bg-primary/20', secondary:'bg-secondary/20', tertiary:'bg-tertiary/20'}[n.theme]}`}>
                        <span className={`material-symbols-outlined text-[20px] ${{primary:'text-primary', secondary:'text-secondary', tertiary:'text-tertiary'}[n.theme]}`}>{n.icon}</span>
                      </div>
                      <h3 className="font-bold text-[13px] text-on-surface mb-1.5">{n.title || 'Usage Title'}</h3>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed mb-3">{n.desc || 'Description…'}</p>
                      <div className="bg-white/60 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold text-on-surface flex items-center gap-1.5">
                        <span className={`material-symbols-outlined text-[13px] ${{primary:'text-primary', secondary:'text-secondary', tertiary:'text-tertiary'}[n.theme]}`}>{n.tipIcon}</span>{n.tip || 'Tip'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pb-8">
            <button onClick={() => setIsProductPanelOpen(false)} className="flex items-center gap-2 text-[13px] font-medium text-on-surface-variant hover:text-on-surface transition-colors px-4 py-2.5 rounded-full border border-outline-variant/40 hover:bg-surface-container">
              <span className="material-symbols-outlined text-[16px]">close</span> Cancel
            </button>
            <div className="flex items-center gap-2">
              <button onClick={() => saveProduct('draft')} className="flex items-center gap-1.5 bg-surface-container border border-outline-variant/30 rounded-full px-5 py-2.5 text-[13px] font-semibold text-on-surface hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-[16px]">save</span>Save Draft
              </button>
              <button onClick={() => saveProduct('publish')} className="flex items-center gap-1.5 bg-primary text-on-primary rounded-full px-6 py-2.5 text-[13px] font-semibold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">
                <span className="material-symbols-outlined text-[16px]">rocket_launch</span>Publish Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ADD CATEGORY MODAL */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[70] transition-opacity duration-300 ${isAddCatModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsAddCatModalOpen(false)}
      >
        <div className={`fixed z-[80] inset-0 flex items-center justify-center p-4 pointer-events-none transition-all duration-300 ${isAddCatModalOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="bg-surface-container-lowest rounded-[24px] shadow-2xl border border-outline-variant/30 w-full max-w-sm pointer-events-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant/20">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[18px]">add_box</span>
              </div>
              <h3 className="flex-1 font-bold text-[16px] text-on-surface">New Category</h3>
              <button onClick={() => setIsAddCatModalOpen(false)} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Category Name <span className="text-error">*</span></label>
                <input value={newCatName} onChange={e => setNewCatName(e.target.value)} type="text" maxLength={32} placeholder="e.g. Ready Mixes" className="form-inp w-full bg-surface-container rounded-[12px] border border-outline-variant/60 px-4 py-3 text-[14px] text-on-surface transition-all" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Icon</label>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border-2 border-primary/20">
                    <span className="material-symbols-outlined text-primary text-[20px]">{newCatIcon}</span>
                  </div>
                  <input value={catIconSearch} onChange={e => setCatIconSearch(e.target.value)} type="text" placeholder="Search icons…" className="form-inp flex-1 bg-surface-container rounded-[12px] border border-outline-variant/60 px-3 py-2.5 text-[13px] text-on-surface transition-all" />
                </div>
                <div className="grid grid-cols-7 gap-1 bg-surface-container rounded-[16px] p-2 max-h-[160px] overflow-y-auto hide-scrollbar">
                  {CAT_ICONS_ALL.filter(i => i.includes(catIconSearch.toLowerCase())).map(ic => (
                    <button key={ic} onClick={() => setNewCatIcon(ic)} className={`icon-grid-btn w-8 h-8 rounded-[10px] flex items-center justify-center ${ic === newCatIcon ? 'selected' : ''}`} title={ic}>
                      <span className="material-symbols-outlined text-[18px]">{ic}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Preview</label>
                <div className="flex">
                  <div className="flex items-center gap-2 bg-surface border border-outline-variant/40 rounded-full px-4 py-2 text-[13px] font-medium text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">{newCatIcon}</span>
                    <span>{newCatName || 'Category Name'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 pb-5 flex items-center justify-end gap-2">
              <button onClick={() => setIsAddCatModalOpen(false)} className="px-4 py-2 rounded-full text-[13px] font-medium text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/30">Cancel</button>
              <button onClick={confirmAddCategory} className="flex items-center gap-1.5 bg-primary text-on-primary rounded-full px-5 py-2 text-[13px] font-semibold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">
                <span className="material-symbols-outlined text-[16px]">add</span> Add Category
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ICON PICKER */}
      {iconPicker.show && (
        <div 
          className="fixed inset-0 z-[65]" 
          onClick={() => setIconPicker(prev => ({ ...prev, show: false }))}
        >
          <div 
            className="absolute z-[70] bg-surface-container-lowest border border-outline-variant/30 rounded-[16px] shadow-2xl p-3 w-64"
            style={{ left: iconPicker.x, top: iconPicker.y }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="material-symbols-outlined text-on-surface-variant text-[16px]">search</span>
              <input value={iconPicker.q} onChange={e => setIconPicker(prev => ({ ...prev, q: e.target.value }))} type="text" placeholder="Search icons…" className="flex-1 bg-transparent text-[12px] text-on-surface placeholder:text-outline border-none focus:ring-0 p-0" />
            </div>
            <div className="grid grid-cols-6 gap-1 max-h-40 overflow-y-auto hide-scrollbar">
              {ICONS.filter(i => i.includes(iconPicker.q.toLowerCase())).map(ic => (
                <button key={ic} onClick={() => selectIcon(ic)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-primary-fixed transition-colors tooltip" data-tip={ic}>
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">{ic}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DELETE CATEGORY MODAL */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[70] transition-opacity duration-300 ${isDelCatModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsDelCatModalOpen(false)}
      >
        <div className={`fixed z-[80] inset-0 flex items-center justify-center p-4 pointer-events-none transition-all duration-300 ${isDelCatModalOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="bg-surface-container-lowest rounded-[24px] shadow-2xl border border-outline-variant/30 w-full max-w-xs pointer-events-auto text-center p-6" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-error text-[24px]">delete</span>
            </div>
            <p className="font-bold text-[15px] text-on-surface mb-1">Delete Category?</p>
            <p className="text-[13px] text-on-surface-variant mb-4">This will remove the category &quot;{categories.find(c => c.id === deletingCatId)?.label}&quot; from the list.</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setIsDelCatModalOpen(false)} className="px-4 py-2 rounded-full text-[13px] font-medium text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/30">Cancel</button>
              <button onClick={() => deletingCatId && deleteCategory(deletingCatId)} className="px-4 py-2 rounded-full text-[13px] font-semibold bg-error text-on-error hover:bg-error/90 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      </div>

      {/* DELETE PRODUCT MODAL */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[70] transition-opacity duration-300 ${isDelProdModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsDelProdModalOpen(false)}
      >
        <div className={`fixed inset-0 flex items-center justify-center p-4 pointer-events-none transition-all duration-300 ${isDelProdModalOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="bg-surface-container-lowest rounded-[24px] p-6 w-full max-w-sm shadow-2xl border border-outline-variant/30 pointer-events-auto" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-error-container flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-error text-[24px]">delete</span>
            </div>
            <h3 className="font-bold text-[17px] text-on-surface text-center mb-1">Delete Product?</h3>
            <p className="text-[13px] text-on-surface-variant text-center mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDelProdModalOpen(false)} className="flex-1 py-3 rounded-full border border-outline-variant/40 text-[13px] font-semibold text-on-surface hover:bg-surface-container transition-colors">Cancel</button>
              <button onClick={() => deletingProdId && deleteProduct(deletingProdId)} className="flex-1 py-3 rounded-full bg-error text-on-error text-[13px] font-semibold hover:bg-error/90 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── IMAGE PICKER DIALOG ─── */}
      <div
        className={`fixed inset-0 bg-black/50 z-[75] transition-opacity duration-300 ${isImagePickerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsImagePickerOpen(false)}
      >
        <div className={`fixed inset-0 flex items-center justify-center p-4 pointer-events-none transition-all duration-300 ${isImagePickerOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div
            className="bg-surface-container-lowest rounded-[24px] shadow-2xl border border-outline-variant/30 w-full max-w-2xl pointer-events-auto flex flex-col"
            style={{ maxHeight: '85vh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Dialog Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant/20 shrink-0">
              <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary text-[20px]">photo_library</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[16px] text-on-surface leading-none">Select Product Image</h3>
                <p className="text-[12px] text-on-surface-variant mt-0.5">public/images folder · {PUBLIC_IMAGES.length} images</p>
              </div>
              <button onClick={() => setIsImagePickerOpen(false)} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Search */}
            <div className="px-5 pt-4 pb-3 shrink-0">
              <div className="flex items-center gap-2 bg-surface-container rounded-[12px] border border-outline-variant/50 px-3 py-2.5">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
                <input
                  value={imagePickerSearch}
                  onChange={e => setImagePickerSearch(e.target.value)}
                  type="text"
                  placeholder="Search images…"
                  className="flex-1 bg-transparent text-[13px] text-on-surface placeholder:text-outline border-none focus:ring-0 p-0"
                />
                {imagePickerSearch && (
                  <button onClick={() => setImagePickerSearch("")} className="text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
              </div>
            </div>

            {/* Image Grid */}
            <div className="flex-1 overflow-y-auto px-5 pb-5 hide-scrollbar">
              {filteredPublicImages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <span className="material-symbols-outlined text-[40px] text-outline mb-2">image_search</span>
                  <p className="text-[14px] font-semibold text-on-surface-variant">No images found</p>
                  <p className="text-[12px] text-outline mt-1">Try a different search term</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {filteredPublicImages.map(img => (
                    <button
                      key={img.name}
                      onClick={() => { setSelectedProductImage(img.name); setIsImagePickerOpen(false); showToast(`"${img.label}" selected`, 'image'); }}
                      className={`group relative rounded-[16px] overflow-hidden border-2 transition-all ${selectedProductImage === img.name ? 'border-primary shadow-lg shadow-primary/20 scale-[1.02]' : 'border-outline-variant/30 hover:border-primary/50 hover:shadow-md'}`}
                    >
                      {/* Image preview (gradient placeholder since real files may not exist) */}
                      <div className="aspect-square flex items-center justify-center relative" style={{ background: img.gradient }}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white/15"></div>
                        </div>
                        <span className="material-symbols-outlined text-white text-[28px] relative z-10 drop-shadow">{img.icon}</span>
                        {selectedProductImage === img.name && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                              <span className="material-symbols-outlined text-on-primary text-[16px]">check</span>
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black/50 backdrop-blur-sm rounded-full px-1.5 py-0.5">
                            <span className="material-symbols-outlined text-white text-[12px]">open_in_full</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-surface-container px-2 py-1.5">
                        <p className="text-[11px] font-semibold text-on-surface truncate text-left">{img.label}</p>
                        <p className="text-[10px] text-on-surface-variant truncate text-left">{img.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dialog Footer */}
            <div className="px-5 py-4 border-t border-outline-variant/20 flex items-center justify-between shrink-0">
              <p className="text-[12px] text-on-surface-variant">{filteredPublicImages.length} of {PUBLIC_IMAGES.length} images</p>
              <button onClick={() => setIsImagePickerOpen(false)} className="px-4 py-2 rounded-full text-[13px] font-medium text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/30">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-full shadow-2xl transition-all duration-300 ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <span className="material-symbols-outlined text-[18px]">{toast.icon}</span>
        <span className="text-[13px] font-semibold">{toast.msg}</span>
      </div>
    </div>
  );
}