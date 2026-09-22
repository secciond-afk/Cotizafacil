export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';

export interface UserPermissions {
  canManageProducts?: boolean; // Puede crear y editar productos del catálogo
  canDeleteQuotes?: boolean;   // Puede eliminar cotizaciones
  canDeleteClients?: boolean;  // Puede eliminar clientes
  canGiveDiscounts?: boolean;  // Puede aplicar descuentos
  maxDiscountPercent?: number; // Descuento máximo permitido en % (ej. 20%)
  canExportData?: boolean;     // Puede exportar copias de respaldo
}

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  password?: string;
  role: 'admin' | 'user';
  status?: 'active' | 'inactive'; // Permite habilitar o deshabilitar el acceso al sistema
  company?: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  permissions?: UserPermissions;
}

export interface Client {
  id: string;
  userId: string; // Scoped to creator user
  name: string;
  company?: string;
  taxId?: string; // RFC, CIF, RUT, NIT
  email: string;
  phone: string;
  address?: string;
  city?: string;
  notes?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  userId: string; // Scoped to creator user
  code: string; // SKU or Reference code
  name: string;
  description?: string;
  unitPrice: number;
  unit: string; // pza, serv, hr, m2, kg, paquete, etc.
  category: string;
  defaultTaxRate: number; // e.g. 16 for 16% IVA
  inStock?: number;
  createdAt: string;
}

export interface QuoteItem {
  id: string;
  productId?: string;
  code: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  discountPercent: number;
  taxRate: number; // IVA %
  subtotal: number; // (qty * price) * (1 - discount)
  taxAmount: number; // subtotal * (taxRate / 100)
  total: number; // subtotal + taxAmount
}

export interface QuoteLayoutSettings {
  pagePadding: number; // in px (12 to 48)
  fontSizeScale: 'compact' | 'normal' | 'comfortable';
  
  // Header / Logo segment
  logoHeight: number; // in px (30 to 140)
  logoAlignment: 'left' | 'center' | 'right';
  showAccentBar: boolean;
  headerMarginBottom: number; // in px (8 to 60)
  
  // Client segment
  clientPadding: number; // in px (8 to 32)
  clientMarginBottom: number; // in px (8 to 60)
  clientBoxStyle: 'card' | 'minimal' | 'bordered';
  
  // Table / Items segment
  tableRowPadding: 'compact' | 'normal' | 'spacious';
  tableMarginBottom: number; // in px (8 to 60)
  descriptionFontSize: 'xs' | 'sm';
  
  // Totals & Notes segment
  totalsMarginTop: number; // in px (8 to 60)
  totalsBoxPadding: number; // in px (10 to 32)
  notesMarginBottom: number; // in px (8 to 40)
  totalsBoxWidth: number; // in px (240 to 380)
  
  // Terms segment
  termsMarginTop: number; // in px (8 to 50)
  termsMarginBottom: number; // in px (8 to 60)
  termsFontSize: 'xs' | 'sm';
  
  // Signatures segment
  signatureMarginTop: number; // in px (12 to 80)
  signatureHeight: number; // in px (36 to 120)
  signatureLineWidth: number; // in px (120 to 280)
  signatureLayout: 'split' | 'centered' | 'single';
  
  // Footer
  footerMarginTop: number; // in px (8 to 50)
  showFooterId: boolean;
}

export interface QuoteBranding {
  companyName: string;
  legalName?: string;
  taxId?: string;
  email: string;
  phone: string;
  website?: string;
  address: string;
  logoUrl: string;
  primaryColor: string; // Hex color (e.g. #2563eb)
  accentColor: string;
  templateStyle: 'modern' | 'classic' | 'minimal' | 'executive';
  showSignatureArea: boolean;
  signatureTitle: string;
  signatureImage?: string;
  watermarkText?: string;
  showWatermark: boolean;
  layout?: QuoteLayoutSettings;
}

export interface QuoteHistoryEntry {
  id: string;
  timestamp: string;
  action: string;
  details?: string;
}

export interface Quote {
  id: string;
  userId: string; // Scoped to creator user
  quoteNumber: string; // e.g. COT-2025-001
  clientId: string;
  clientSnapshot: Client;
  date: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  status: QuoteStatus;
  items: QuoteItem[];
  currency: string; // USD, MXN, EUR, COP, etc.
  currencySymbol: string; // $, €, etc.
  
  // Tax & Totals
  taxEnabled: boolean;
  globalTaxRate: number; // editable general IVA percentage, e.g. 16
  discountPercent: number; // global discount %
  
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  
  // Text content & Conditions
  notes: string;
  termsAndConditions: string;
  paymentMethods: string;
  
  // Follow-up
  followUpDate?: string;
  followUpTime?: string;
  followUpNotes?: string;
  followUpCompleted?: boolean;
  
  // Visual Branding snapshot
  branding: QuoteBranding;
  
  history: QuoteHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface CompanySettings {
  companyName: string;
  legalName: string;
  taxId: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  templateStyle: 'modern' | 'classic' | 'minimal' | 'executive';
  defaultCurrency: string;
  defaultCurrencySymbol: string;
  defaultTaxRate: number; // Default IVA %
  defaultTaxEnabled: boolean;
  defaultPaymentMethods: string;
  defaultTerms: string;
  defaultNotes: string;
  showSignatureArea: boolean;
  signatureTitle: string;
  signatureImage?: string;
  showWatermark: boolean;
  watermarkText: string;
  notificationPushEnabled: boolean;
  layout?: QuoteLayoutSettings;
}

export interface NotificationItem {
  id: string;
  userId: string; // Scoped to creator user
  quoteId: string;
  quoteNumber: string;
  clientName: string;
  clientPhone: string;
  dueDate: string;
  title: string;
  message: string;
  read: boolean;
  type: 'follow_up' | 'expiry' | 'system';
  createdAt: string;
}

export type BackupRestoreMode = 'admin_only' | 'all' | 'seller_only';

export interface BackupSummary {
  valid: boolean;
  error?: string;
  data: any;
  exportedAt?: string;
  exportedBy?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
  version?: string;
  totalQuotes: number;
  adminQuotes: number;
  otherQuotes: number;
  totalClients: number;
  adminClients: number;
  otherClients: number;
  totalProducts: number;
  adminProducts: number;
  otherProducts: number;
  adminUser?: User;
  otherUsers: User[];
  totalUsers: number;
  hasOtherUsersData: boolean;
  sellerQuotesCount?: number;
  sellerClientsCount?: number;
  sellerProductsCount?: number;
}
