import { Client, Product, Quote, CompanySettings, User, QuoteLayoutSettings, UserPermissions } from '../types';

export const DEFAULT_COMMERCIAL_PERMISSIONS: UserPermissions = {
  canManageProducts: true,
  canDeleteQuotes: true,
  canDeleteClients: true,
  canGiveDiscounts: true,
  maxDiscountPercent: 100,
  canExportData: true,
};

export const DEFAULT_LAYOUT_SETTINGS: QuoteLayoutSettings = {
  pagePadding: 28,
  fontSizeScale: 'normal',
  logoHeight: 56,
  logoAlignment: 'left',
  showAccentBar: true,
  headerMarginBottom: 24,
  clientPadding: 16,
  clientMarginBottom: 24,
  clientBoxStyle: 'card',
  tableRowPadding: 'normal',
  tableMarginBottom: 24,
  descriptionFontSize: 'xs',
  totalsMarginTop: 24,
  totalsBoxPadding: 16,
  notesMarginBottom: 16,
  totalsBoxWidth: 320,
  termsMarginTop: 20,
  termsMarginBottom: 24,
  termsFontSize: 'xs',
  signatureMarginTop: 32,
  signatureHeight: 56,
  signatureLineWidth: 192,
  signatureLayout: 'split',
  footerMarginTop: 28,
  showFooterId: true,
};

export const initialUsers: User[] = [
  {
    id: 'user-admin',
    name: 'Administrador Principal',
    email: 'admin@cotizafacil.com',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    status: 'active',
    company: 'Mi Empresa',
    phone: '',
    createdAt: new Date().toISOString(),
    permissions: {
      canManageProducts: true,
      canDeleteQuotes: true,
      canDeleteClients: true,
      canGiveDiscounts: true,
      maxDiscountPercent: 100,
      canExportData: true,
    },
  }
];

export const initialCompanySettings: CompanySettings = {
  companyName: 'Mi Empresa / Negocio',
  legalName: '',
  taxId: '',
  email: '',
  phone: '',
  website: '',
  address: '',
  logoUrl: '',
  primaryColor: '#1e40af', // Deep professional blue
  accentColor: '#0ea5e9', // Sky blue
  templateStyle: 'modern',
  defaultCurrency: 'USD',
  defaultCurrencySymbol: '$',
  defaultTaxRate: 16, // 16% IVA editable
  defaultTaxEnabled: true,
  defaultPaymentMethods: 'Transferencia bancaria:\nBanco: Nombre del Banco\nBeneficiario: Nombre de la Empresa o Titular\nCuenta / CLABE: 000000000000000000\nReferencia: Número de cotización',
  defaultTerms: '1. Los precios están expresados en la moneda indicada e incluyen los impuestos desglosados.\n2. La validez de esta cotización es de 15 días a partir de su emisión.\n3. Términos de pago: 50% de anticipo al confirmar y 50% contra entrega final.\n4. Tiempos de entrega estimados: Sujeto a disponibilidad de inventario o agenda de servicio.',
  defaultNotes: 'Agradecemos la oportunidad de presentarle esta propuesta económica. Quedamos a su disposición para cualquier duda o ajuste.',
  showSignatureArea: true,
  signatureTitle: 'Firma Autorizada\nDirección Comercial',
  signatureImage: '',
  showWatermark: false,
  watermarkText: 'COTIZACIÓN OFICIAL',
  notificationPushEnabled: false,
  layout: DEFAULT_LAYOUT_SETTINGS,
};

export const createCleanCompanySettings = (user?: Partial<User>): CompanySettings => ({
  companyName: user?.company || '',
  legalName: '',
  taxId: '',
  email: user?.email || '',
  phone: user?.phone || '',
  website: '',
  address: '',
  logoUrl: '',
  primaryColor: '#1e40af',
  accentColor: '#0ea5e9',
  templateStyle: 'modern',
  defaultCurrency: 'USD',
  defaultCurrencySymbol: '$',
  defaultTaxRate: 16,
  defaultTaxEnabled: true,
  defaultPaymentMethods: '',
  defaultTerms: '',
  defaultNotes: '',
  showSignatureArea: true,
  signatureTitle: '',
  signatureImage: '',
  showWatermark: false,
  watermarkText: '',
  notificationPushEnabled: false,
  layout: DEFAULT_LAYOUT_SETTINGS,
});

// Clean empty collections so the user captures only real data
export const initialClients: Client[] = [];
export const initialProducts: Product[] = [];
export const initialQuotes: Quote[] = [];

