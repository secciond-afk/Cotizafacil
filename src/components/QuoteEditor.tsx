import React, { useState, useEffect, useMemo } from 'react';
import { Quote, QuoteItem, QuoteStatus, Client, Product, QuoteBranding } from '../types';
import { useApp } from '../context/AppContext';
import { QuoteDocument } from './QuoteDocument';
import { ClientModal } from './ClientModal';
import { ProductModal } from './ProductModal';
import { ShareModal } from './ShareModal';
import { exportQuoteToPDF, printQuoteDocument } from '../utils/pdfGenerator';
import {
  Save,
  Download,
  Share2,
  Printer,
  Plus,
  Trash2,
  UserPlus,
  PackagePlus,
  Eye,
  EyeOff,
  Palette,
  Calendar,
  Clock,
  Bell,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Percent,
  CheckCircle2,
  Layers,
  Image as ImageIcon,
  Building,
  Check,
  FileCheck,
  Search,
  X
} from 'lucide-react';

interface QuoteEditorProps {
  quoteId?: string | null;
  onBack: () => void;
}

const COLOR_PRESETS = [
  { name: 'Azul Real', primary: '#1e40af', accent: '#0ea5e9' },
  { name: 'Esmeralda Ejecutivo', primary: '#065f46', accent: '#10b981' },
  { name: 'Índigo Moderno', primary: '#3730a3', accent: '#6366f1' },
  { name: 'Pizarra Grafito', primary: '#1e293b', accent: '#64748b' },
  { name: 'Rubí Corporativo', primary: '#881337', accent: '#f43f5e' },
  { name: 'Ámbar Comercial', primary: '#78350f', accent: '#f59e0b' },
  { name: 'Púrpura Creativo', primary: '#581c87', accent: '#a855f7' },
];

export const QuoteEditor: React.FC<QuoteEditorProps> = ({ quoteId, onBack }) => {
  const {
    quotes,
    clients,
    products,
    settings,
    currentUser,
    saveQuote,
    getNextQuoteNumber,
    formatCurrency,
  } = useApp();

  const canGiveDiscounts = currentUser.role === 'admin' || currentUser.permissions?.canGiveDiscounts !== false;
  const maxAllowedDiscount = currentUser.role === 'admin' ? 100 : (currentUser.permissions?.maxDiscountPercent ?? 100);
  const canManageProducts = currentUser.role === 'admin' || currentUser.permissions?.canManageProducts !== false;

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showCatalogDropdown, setShowCatalogDropdown] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Tabs for mobile view or desktop split toggle
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [expandedSection, setExpandedSection] = useState<'items' | 'branding' | 'terms' | 'followup'>('items');

  // Find existing quote or initialize state
  const existingQuote = useMemo(() => {
    if (!quoteId || quoteId === 'new' || quoteId.startsWith('new_for_')) return null;
    return quotes.find((q) => q.id === quoteId) || null;
  }, [quoteId, quotes]);

  const defaultFallbackClient: Client = {
    id: 'cli-temp',
    userId: '',
    name: 'Cliente General',
    company: '',
    email: '',
    phone: '',
    address: '',
    createdAt: new Date().toISOString(),
  };

  const initialClientId = useMemo(() => {
    if (quoteId && quoteId.startsWith('new_for_')) {
      return quoteId.replace('new_for_', '');
    }
    return existingQuote?.clientId || (clients[0]?.id || 'cli-temp');
  }, [quoteId, existingQuote, clients]);

  // Form states
  const [id, setId] = useState(existingQuote?.id || 'new');
  const [quoteNumber, setQuoteNumber] = useState(existingQuote?.quoteNumber || getNextQuoteNumber());
  const [clientId, setClientId] = useState(initialClientId);
  const [clientSnapshot, setClientSnapshot] = useState<Client>(
    existingQuote?.clientSnapshot || clients.find((c) => c.id === initialClientId) || clients[0] || defaultFallbackClient
  );
  const [date, setDate] = useState(existingQuote?.date || new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState(
    existingQuote?.expiryDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<QuoteStatus>(existingQuote?.status || 'draft');
  const [currency, setCurrency] = useState(existingQuote?.currency || settings.defaultCurrency || 'USD');
  const [currencySymbol, setCurrencySymbol] = useState(existingQuote?.currencySymbol || settings.defaultCurrencySymbol || '$');
  
  // Tax and discounts
  const [taxEnabled, setTaxEnabled] = useState<boolean>(
    existingQuote?.taxEnabled !== undefined ? existingQuote.taxEnabled : settings.defaultTaxEnabled
  );
  const [globalTaxRate, setGlobalTaxRate] = useState<number>(
    existingQuote?.globalTaxRate !== undefined ? existingQuote.globalTaxRate : settings.defaultTaxRate
  );
  const [discountPercent, setDiscountPercent] = useState<number>(existingQuote?.discountPercent || 0);

  // Items
  const [items, setItems] = useState<QuoteItem[]>(() => {
    if (existingQuote?.items && existingQuote.items.length > 0) {
      return existingQuote.items;
    }
    if (products.length > 0) {
      const p = products[0];
      const sub = p.unitPrice;
      const taxRate = settings.defaultTaxRate || 16;
      return [
        {
          id: `item-${Date.now()}`,
          productId: p.id,
          code: p.code,
          name: p.name,
          description: p.description || '',
          quantity: 1,
          unitPrice: p.unitPrice,
          unit: p.unit,
          discountPercent: 0,
          taxRate,
          subtotal: sub,
          taxAmount: sub * (taxRate / 100),
          total: sub + sub * (taxRate / 100),
        },
      ];
    }
    return [];
  });

  // Texts
  const [notes, setNotes] = useState(existingQuote?.notes !== undefined ? existingQuote.notes : settings.defaultNotes);
  const [termsAndConditions, setTermsAndConditions] = useState(
    existingQuote?.termsAndConditions !== undefined ? existingQuote.termsAndConditions : settings.defaultTerms
  );
  const [paymentMethods, setPaymentMethods] = useState(
    existingQuote?.paymentMethods !== undefined ? existingQuote.paymentMethods : settings.defaultPaymentMethods
  );

  // Follow-up
  const [followUpDate, setFollowUpDate] = useState(existingQuote?.followUpDate || '');
  const [followUpTime, setFollowUpTime] = useState(existingQuote?.followUpTime || '10:00');
  const [followUpNotes, setFollowUpNotes] = useState(existingQuote?.followUpNotes || '');
  const [followUpCompleted, setFollowUpCompleted] = useState(existingQuote?.followUpCompleted || false);

  // Branding
  const [branding, setBranding] = useState<QuoteBranding>(() => {
    if (existingQuote?.branding) return existingQuote.branding;
    return {
      companyName: settings.companyName,
      legalName: settings.legalName,
      taxId: settings.taxId,
      email: settings.email,
      phone: settings.phone,
      website: settings.website,
      address: settings.address,
      logoUrl: settings.logoUrl,
      primaryColor: settings.primaryColor || '#1e40af',
      accentColor: settings.accentColor || '#0ea5e9',
      templateStyle: settings.templateStyle || 'modern',
      showSignatureArea: settings.showSignatureArea,
      signatureTitle: settings.signatureTitle,
      signatureImage: settings.signatureImage,
      showWatermark: settings.showWatermark,
      watermarkText: settings.watermarkText,
      layout: settings.layout,
    };
  });

  // Keep client snapshot updated when clientId changes
  const handleClientChange = (cId: string) => {
    setClientId(cId);
    const selected = clients.find((c) => c.id === cId);
    if (selected) {
      setClientSnapshot(selected);
    }
  };

  // Recompute item subtotals and quote totals whenever items, discount or tax changes
  const recalculatedItems = useMemo(() => {
    return items.map((item) => {
      const gross = (item.quantity || 0) * (item.unitPrice || 0);
      const subtotal = Math.max(0, gross);
      return {
        ...item,
        discountPercent: 0,
        taxRate: globalTaxRate,
        subtotal,
        taxAmount: 0,
        total: subtotal,
      };
    });
  }, [items, globalTaxRate]);

  const financialSummary = useMemo(() => {
    const rawSubtotal = recalculatedItems.reduce((acc, item) => acc + item.subtotal, 0);
    const globalDiscountAmount = rawSubtotal * ((discountPercent || 0) / 100);
    const netSubtotal = Math.max(0, rawSubtotal - globalDiscountAmount);
    const totalTax = taxEnabled ? netSubtotal * (globalTaxRate / 100) : 0;
    const grandTotal = netSubtotal + totalTax;

    return {
      subtotal: rawSubtotal,
      discountAmount: globalDiscountAmount,
      taxAmount: totalTax,
      total: grandTotal,
    };
  }, [recalculatedItems, discountPercent, taxEnabled, globalTaxRate]);

  // Construct current dynamic quote object
  const currentQuoteObject: Quote = useMemo(() => {
    return {
      id: id || 'temp',
      quoteNumber,
      clientId,
      clientSnapshot,
      date,
      expiryDate,
      status,
      items: recalculatedItems,
      currency,
      currencySymbol,
      taxEnabled,
      globalTaxRate,
      discountPercent,
      subtotal: financialSummary.subtotal,
      discountAmount: financialSummary.discountAmount,
      taxAmount: financialSummary.taxAmount,
      total: financialSummary.total,
      notes,
      termsAndConditions,
      paymentMethods,
      followUpDate: followUpDate || undefined,
      followUpTime: followUpTime || undefined,
      followUpNotes: followUpNotes || undefined,
      followUpCompleted,
      branding,
      history: existingQuote?.history || [],
      createdAt: existingQuote?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }, [
    id,
    quoteNumber,
    clientId,
    clientSnapshot,
    date,
    expiryDate,
    status,
    recalculatedItems,
    currency,
    currencySymbol,
    taxEnabled,
    globalTaxRate,
    discountPercent,
    financialSummary,
    notes,
    termsAndConditions,
    paymentMethods,
    followUpDate,
    followUpTime,
    followUpNotes,
    followUpCompleted,
    branding,
    existingQuote,
  ]);

  // Actions
  const handleSave = () => {
    const saved = saveQuote(currentQuoteObject);
    setId(saved.id);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportPDF = async () => {
    setIsGeneratingPdf(true);
    setPdfProgress(10);
    // Ensure quote is saved before export
    const saved = saveQuote(currentQuoteObject);
    setId(saved.id);

    const success = await exportQuoteToPDF('quote-printable-document', currentQuoteObject, (p) => {
      setPdfProgress(p);
    });

    setIsGeneratingPdf(false);
    setPdfProgress(0);
  };

  // Add Free Item
  const handleAddFreeItem = () => {
    const newItem: QuoteItem = {
      id: `item-${Date.now()}`,
      code: `ITEM-${items.length + 1}`,
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      unit: 'pza',
      discountPercent: 0,
      taxRate: globalTaxRate,
      subtotal: 0,
      taxAmount: 0,
      total: 0,
    };
    setItems((prev) => [...prev, newItem]);
  };

  // Add Product from Catalog
  const handleAddCatalogProduct = (product: Product) => {
    const newItem: QuoteItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      productId: product.id,
      code: product.code,
      name: product.name,
      description: product.description || '',
      quantity: 1,
      unitPrice: product.unitPrice,
      unit: product.unit,
      discountPercent: 0,
      taxRate: product.defaultTaxRate !== undefined ? product.defaultTaxRate : globalTaxRate,
      subtotal: product.unitPrice,
      taxAmount: product.unitPrice * ((product.defaultTaxRate || globalTaxRate) / 100),
      total: product.unitPrice * (1 + (product.defaultTaxRate || globalTaxRate) / 100),
    };
    setItems((prev) => [...prev, newItem]);
    setShowCatalogDropdown(false);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, updates: Partial<QuoteItem>) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBranding((prev) => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBranding((prev) => ({ ...prev, signatureImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 pb-20">
      {/* Top Fixed Action Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Regresar al historial"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-sm md:text-base">
                  {existingQuote ? `Editar: ${quoteNumber}` : `Nueva Cotización: ${quoteNumber}`}
                </h2>
                {saveSuccess && (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold animate-in fade-in">
                    <Check className="w-3 h-3" /> Guardado
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {clientSnapshot?.name} • Total: {formatCurrency(financialSummary.total, currency, currencySymbol)}
              </p>
            </div>
          </div>

          {/* Desktop & Mobile Tab Switcher (Visible on mobile/tablet) */}
          <div className="flex lg:hidden bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setMobileTab('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mobileTab === 'editor' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Formulario
            </button>
            <button
              onClick={() => setMobileTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mobileTab === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Vista Previa
            </button>
          </div>

          {/* Main Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Guardar</span>
            </button>

            <button
              onClick={handleExportPDF}
              disabled={isGeneratingPdf}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isGeneratingPdf ? `Generando (${pdfProgress}%)...` : 'Exportar PDF'}
              </span>
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp / Email</span>
            </button>

            <button
              onClick={printQuoteDocument}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors hidden md:flex items-center justify-center"
              title="Imprimir cotización"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Split View on Desktop, Tabbed on Mobile */}
      <div className="max-w-7xl mx-auto w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls (Visible if mobileTab === 'editor' or on Desktop) */}
        <div
          className={`lg:col-span-6 xl:col-span-6 space-y-6 ${
            mobileTab === 'editor' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Section 1: Header & Client Info Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                Información de la Cotización
              </h3>
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500 font-medium">Estado:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as QuoteStatus)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="draft">📝 Borrador</option>
                  <option value="sent">📨 Enviada</option>
                  <option value="approved">✅ Aceptada</option>
                  <option value="rejected">❌ Rechazada</option>
                  <option value="expired">⏳ Vencida</option>
                </select>
              </div>
            </div>

            {/* Quote Number & Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Folio / Número</label>
                <input
                  type="text"
                  value={quoteNumber}
                  onChange={(e) => setQuoteNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fecha Emisión</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fecha Vigencia</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Currency & Symbol */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Moneda</label>
                <select
                  value={currency}
                  onChange={(e) => {
                    const c = e.target.value;
                    setCurrency(c);
                    if (c === 'EUR') setCurrencySymbol('€');
                    else setCurrencySymbol('$');
                  }}
                  className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="USD">USD - Dólares Americanos ($)</option>
                  <option value="MXN">MXN - Pesos Mexicanos ($)</option>
                  <option value="EUR">EUR - Euros (€)</option>
                  <option value="COP">COP - Pesos Colombianos ($)</option>
                  <option value="CLP">CLP - Pesos Chilenos ($)</option>
                  <option value="ARS">ARS - Pesos Argentinos ($)</option>
                  <option value="PEN">PEN - Soles Peruanos (S/)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Símbolo</label>
                <input
                  type="text"
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Client Picker */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Cliente / Receptor <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsClientModalOpen(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" /> + Nuevo Cliente
                </button>
              </div>

              <select
                value={clientId}
                onChange={(e) => handleClientChange(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.company ? `(${c.company})` : ''} - {c.phone}
                  </option>
                ))}
              </select>

              {clientSnapshot && (
                <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-800">{clientSnapshot.name}</div>
                  {clientSnapshot.taxId && <div>RFC / Tax ID: {clientSnapshot.taxId}</div>}
                  <div className="flex gap-4">
                    {clientSnapshot.phone && <div>Tel: {clientSnapshot.phone}</div>}
                    {clientSnapshot.email && <div>Email: {clientSnapshot.email}</div>}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Items & Services Builder */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                Conceptos y Productos ({items.length})
              </h3>

              <div className="flex items-center gap-2">
                {/* Catalog dropdown trigger */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCatalogDropdown(!showCatalogDropdown)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <PackagePlus className="w-3.5 h-3.5" />
                    + Desde Catálogo
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {showCatalogDropdown && (
                    <div className="absolute right-0 top-full mt-1 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-40 p-2.5 max-h-72 overflow-y-auto animate-in fade-in space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Seleccionar Producto ({products.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCatalogDropdown(false);
                            setCatalogSearch('');
                          }}
                          className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Mini search input */}
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={catalogSearch}
                          onChange={(e) => setCatalogSearch(e.target.value)}
                          placeholder="Buscar por nombre o clave..."
                          className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          autoFocus
                        />
                      </div>

                      <div className="max-h-40 overflow-y-auto space-y-1 pr-0.5">
                        {products
                          .filter((p) => {
                            const term = catalogSearch.trim().toLowerCase();
                            if (!term) return true;
                            return (
                              p.name.toLowerCase().includes(term) ||
                              p.code.toLowerCase().includes(term) ||
                              (p.description || '').toLowerCase().includes(term)
                            );
                          })
                          .map((prod) => (
                            <button
                              key={prod.id}
                              type="button"
                              onClick={() => {
                                handleAddCatalogProduct(prod);
                                setShowCatalogDropdown(false);
                                setCatalogSearch('');
                              }}
                              className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-slate-50 transition-colors text-xs flex justify-between items-center group cursor-pointer"
                            >
                              <div>
                                <div className="font-semibold text-slate-800 group-hover:text-emerald-700">
                                  {prod.name}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  Ref: {prod.code} • {prod.unit}
                                </div>
                              </div>
                              <span className="font-mono font-bold text-slate-700 text-xs shrink-0 ml-2">
                                {currencySymbol}{prod.unitPrice.toFixed(2)}
                              </span>
                            </button>
                          ))}
                        {products.filter((p) => {
                          const term = catalogSearch.trim().toLowerCase();
                          if (!term) return true;
                          return (
                            p.name.toLowerCase().includes(term) ||
                            p.code.toLowerCase().includes(term) ||
                            (p.description || '').toLowerCase().includes(term)
                          );
                        }).length === 0 && (
                          <div className="text-center py-3 text-xs text-slate-400">
                            No se encontraron productos coincidentes
                          </div>
                        )}
                      </div>

                      {canManageProducts && (
                        <div className="pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              setShowCatalogDropdown(false);
                              setCatalogSearch('');
                              setIsProductModalOpen(true);
                            }}
                            className="w-full py-1 text-center text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Crear Nuevo en Catálogo
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleAddFreeItem}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> + Ítem Libre
                </button>
              </div>
            </div>

            {/* Items List Form */}
            <div className="space-y-3.5">
              {items.length === 0 ? (
                <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 rounded-2xl">
                  <p className="text-xs text-slate-500">No hay conceptos en la cotización.</p>
                  <button
                    type="button"
                    onClick={handleAddFreeItem}
                    className="mt-2 text-xs font-bold text-blue-600 hover:underline"
                  >
                    Haz clic aquí para agregar un concepto
                  </button>
                </div>
              ) : (
                items.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-mono text-[10px] flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          value={item.code}
                          onChange={(e) => handleUpdateItem(index, { code: e.target.value })}
                          placeholder="Ref/SKU"
                          className="w-24 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono uppercase focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleUpdateItem(index, { name: e.target.value })}
                          placeholder="Nombre del producto o servicio"
                          className="flex-1 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Eliminar concepto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={item.description || ''}
                      onChange={(e) => handleUpdateItem(index, { description: e.target.value })}
                      placeholder="Descripción técnica o detalles que aparecerán en la cotización..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                    />

                    {/* Numeric properties */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                          Cantidad
                        </label>
                        <input
                          type="number"
                          step="any"
                          min="0.01"
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateItem(index, { quantity: parseFloat(e.target.value) || 0 })
                          }
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                          Unidad
                        </label>
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => handleUpdateItem(index, { unit: e.target.value })}
                          placeholder="pza, serv, hr"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                          Precio Unitario
                        </label>
                        <input
                          type="number"
                          step="any"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleUpdateItem(index, { unitPrice: parseFloat(e.target.value) || 0 })
                          }
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-semibold text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                          Importe
                        </label>
                        <div className="px-2.5 py-1.5 bg-slate-200/70 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 text-xs text-right truncate">
                          {currencySymbol}
                          {((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Financial Summary & Editable IVA Section */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-900 text-white space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="taxEnabledCheck"
                    checked={taxEnabled}
                    onChange={(e) => setTaxEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="taxEnabledCheck" className="text-xs font-bold cursor-pointer select-none">
                    Aplicar IVA / Impuesto al desglose
                  </label>
                </div>

                {taxEnabled && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400 font-medium">Tasa IVA (%):</span>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      max="100"
                      value={globalTaxRate}
                      onChange={(e) => setGlobalTaxRate(parseFloat(e.target.value) || 0)}
                      className="w-16 px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono font-bold text-white text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <span className="text-xs font-bold text-slate-400">%</span>
                  </div>
                )}
              </div>

              {/* Global Discount Option with Admin Access Control */}
              <div className="flex items-center justify-between text-xs text-slate-300">
                <div className="flex flex-col">
                  <span className="text-xs">Descuento general adicional (%):</span>
                  {!canGiveDiscounts ? (
                    <span className="text-[10px] text-amber-400 font-medium">
                      🔒 No autorizado por el administrador
                    </span>
                  ) : maxAllowedDiscount < 100 ? (
                    <span className="text-[10px] text-slate-400">
                      Máx. permitido: {maxAllowedDiscount}%
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    max={maxAllowedDiscount}
                    disabled={!canGiveDiscounts}
                    value={discountPercent}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      const capped = Math.min(Math.max(0, val), maxAllowedDiscount);
                      setDiscountPercent(capped);
                    }}
                    className={`w-16 px-2 py-1 bg-slate-800 border rounded-lg text-xs font-mono text-white text-center focus:outline-none ${
                      !canGiveDiscounts
                        ? 'opacity-40 cursor-not-allowed border-slate-700'
                        : 'border-slate-700 focus:border-blue-400'
                    }`}
                  />
                  <span className="text-xs text-slate-400">%</span>
                </div>
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold text-slate-200">
                    {formatCurrency(financialSummary.subtotal, currency, currencySymbol)}
                  </span>
                </div>

                {financialSummary.discountAmount > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>Descuento ({discountPercent}%):</span>
                    <span className="font-mono font-semibold">
                      -{formatCurrency(financialSummary.discountAmount, currency, currencySymbol)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400">
                  <span>IVA ({taxEnabled ? `${globalTaxRate}%` : 'Exento'}):</span>
                  <span className="font-mono font-semibold text-slate-200">
                    {formatCurrency(financialSummary.taxAmount, currency, currencySymbol)}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-slate-700">
                  <span className="font-extrabold text-sm text-white">TOTAL FINAL:</span>
                  <span className="text-xl font-black font-mono text-emerald-400">
                    {formatCurrency(financialSummary.total, currency, currencySymbol)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Visual Branding & Graphics Customizer (Collapsible) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() =>
                setExpandedSection(expandedSection === 'branding' ? 'items' : 'branding')
              }
              className="w-full px-5 py-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-slate-900 text-sm">
                  Personalización Gráfica, Colores y Logo
                </span>
              </div>
              {expandedSection === 'branding' ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {expandedSection === 'branding' && (
              <div className="p-5 space-y-4 border-t border-slate-100 text-xs">
                {/* Color presets */}
                <div>
                  <label className="block font-bold text-slate-700 mb-2">
                    Paleta de Color Corporativo:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() =>
                          setBranding({
                            ...branding,
                            primaryColor: preset.primary,
                            accentColor: preset.accent,
                          })
                        }
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                          branding.primaryColor === preset.primary
                            ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full"
                          style={{ backgroundColor: preset.primary }}
                        />
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Color Primario (Hex)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={branding.primaryColor}
                        onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
                      />
                      <input
                        type="text"
                        value={branding.primaryColor}
                        onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                        className="w-full px-2.5 py-1 font-mono bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Color de Acento</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={branding.accentColor}
                        onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
                      />
                      <input
                        type="text"
                        value={branding.accentColor}
                        onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                        className="w-full px-2.5 py-1 font-mono bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Logo Uploader */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Logotipo Corporativo (aparecerá en encabezado del PDF)
                  </label>
                  <div className="flex items-center gap-3">
                    {branding.logoUrl && (
                      <div className="h-12 w-28 bg-slate-50 border border-slate-200 rounded-lg p-1 flex items-center justify-center">
                        <img
                          src={branding.logoUrl}
                          alt="Logo"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}
                    <label className="cursor-pointer px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors">
                      <ImageIcon className="w-4 h-4" />
                      {branding.logoUrl ? 'Cambiar Logo' : 'Subir Imagen de Logo'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    {branding.logoUrl && (
                      <button
                        type="button"
                        onClick={() => setBranding({ ...branding, logoUrl: '' })}
                        className="text-xs text-rose-600 hover:underline"
                      >
                        Quitar Logo
                      </button>
                    )}
                  </div>
                </div>

                {/* Signature Area Settings */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700">Área de Firma Autorizada</label>
                    <input
                      type="checkbox"
                      checked={branding.showSignatureArea}
                      onChange={(e) =>
                        setBranding({ ...branding, showSignatureArea: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-blue-600"
                    />
                  </div>

                  {branding.showSignatureArea && (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-slate-600 mb-1">
                          Título / Cargo del Firmante:
                        </label>
                        <input
                          type="text"
                          value={branding.signatureTitle}
                          onChange={(e) =>
                            setBranding({ ...branding, signatureTitle: e.target.value })
                          }
                          placeholder="Ej. Ing. Carlos Mendoza - Director Comercial"
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 mb-1">
                          Imagen de Firma Digital (opcional):
                        </label>
                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors">
                            <ImageIcon className="w-3.5 h-3.5" />
                            {branding.signatureImage ? 'Cambiar Firma' : 'Cargar Firma'}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleSignatureUpload}
                              className="hidden"
                            />
                          </label>
                          {branding.signatureImage && (
                            <button
                              type="button"
                              onClick={() => setBranding({ ...branding, signatureImage: '' })}
                              className="text-xs text-rose-600 hover:underline"
                            >
                              Eliminar firma
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Watermark */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700">Marca de Agua de Fondo</label>
                    <input
                      type="checkbox"
                      checked={branding.showWatermark}
                      onChange={(e) =>
                        setBranding({ ...branding, showWatermark: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-blue-600"
                    />
                  </div>
                  {branding.showWatermark && (
                    <input
                      type="text"
                      value={branding.watermarkText || 'COTIZACIÓN OFICIAL'}
                      onChange={(e) =>
                        setBranding({ ...branding, watermarkText: e.target.value })
                      }
                      placeholder="Texto de marca de agua"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase font-bold"
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Terms, Conditions & Payment Instructions (Collapsible) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() =>
                setExpandedSection(expandedSection === 'terms' ? 'items' : 'terms')
              }
              className="w-full px-5 py-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-slate-900 text-sm">
                  Términos, Instrucciones de Pago y Notas
                </span>
              </div>
              {expandedSection === 'terms' ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {expandedSection === 'terms' && (
              <div className="p-5 space-y-3.5 border-t border-slate-100 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Métodos de Pago / Datos Bancarios
                  </label>
                  <textarea
                    rows={3}
                    value={paymentMethods}
                    onChange={(e) => setPaymentMethods(e.target.value)}
                    placeholder="Bancos, número de cuenta, CLABE, instrucciones..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Términos y Condiciones Comerciales
                  </label>
                  <textarea
                    rows={4}
                    value={termsAndConditions}
                    onChange={(e) => setTermsAndConditions(e.target.value)}
                    placeholder="Validez, condiciones de anticipo, plazos de entrega..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Notas al Cliente</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Agradecimiento o notas especiales..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Follow-Up Scheduler & Push Reminders (Collapsible) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() =>
                setExpandedSection(expandedSection === 'followup' ? 'items' : 'followup')
              }
              className="w-full px-5 py-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-slate-900 text-sm">
                  Recordatorio y Seguimiento de Venta
                </span>
              </div>
              {expandedSection === 'followup' ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {expandedSection === 'followup' && (
              <div className="p-5 space-y-3.5 border-t border-slate-100 text-xs">
                <p className="text-slate-500">
                  Programa una fecha de seguimiento para recibir notificaciones automáticas y dar seguimiento proactivo al cliente por WhatsApp o correo.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Fecha de Seguimiento
                    </label>
                    <input
                      type="date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Hora Sugerida
                    </label>
                    <input
                      type="time"
                      value={followUpTime}
                      onChange={(e) => setFollowUpTime(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nota o Tarea de Seguimiento
                  </label>
                  <input
                    type="text"
                    value={followUpNotes}
                    onChange={(e) => setFollowUpNotes(e.target.value)}
                    placeholder="Ej. Enviar mensaje de WhatsApp para consultar visto bueno..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                {followUpDate && (
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="fuCompleted"
                      checked={followUpCompleted}
                      onChange={(e) => setFollowUpCompleted(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600"
                    />
                    <label htmlFor="fuCompleted" className="font-semibold text-slate-700 cursor-pointer">
                      Marcar seguimiento como concluido
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Document Preview (Visible if mobileTab === 'preview' or on Desktop) */}
        <div
          className={`lg:col-span-6 xl:col-span-6 space-y-4 ${
            mobileTab === 'preview' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="sticky top-20">
            <div className="bg-slate-200/80 px-4 py-2.5 rounded-t-2xl flex items-center justify-between border border-b-0 border-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-slate-700 ml-2">
                  Vista Previa en Vivo (Formato PDF / Impresión)
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Hoja A4</span>
            </div>

            {/* Scrollable Container with QuoteDocument */}
            <div className="bg-slate-300/60 p-2 sm:p-4 rounded-b-2xl border border-slate-300 max-h-[calc(100vh-140px)] overflow-y-auto">
              <QuoteDocument
                quote={currentQuoteObject}
                elementId="quote-printable-document"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Client Modal */}
      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onClientSaved={(newClient) => {
          setClientId(newClient.id);
          setClientSnapshot(newClient);
        }}
      />

      {/* Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onProductSaved={(newProd) => {
          handleAddCatalogProduct(newProd);
        }}
      />

      {/* Share Modal */}
      <ShareModal
        quote={currentQuoteObject}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};
