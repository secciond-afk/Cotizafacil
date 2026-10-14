import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LayoutSpacingEditor } from './LayoutSpacingEditor';
import { QuoteLayoutSettings, BackupSummary, BackupRestoreMode } from '../types';
import { BackupRestoreModal } from './BackupRestoreModal';
import {
  Settings,
  Building,
  Palette,
  Percent,
  FileText,
  Bell,
  Download,
  Upload,
  RotateCcw,
  Check,
  Image as ImageIcon,
  ShieldCheck,
  DollarSign,
  Sliders,
  Archive,
  WifiOff,
  Terminal,
  Database
} from 'lucide-react';

const COLOR_PRESETS = [
  { name: 'Azul Real', primary: '#1e40af', accent: '#0ea5e9' },
  { name: 'Esmeralda Ejecutivo', primary: '#065f46', accent: '#10b981' },
  { name: 'Índigo Moderno', primary: '#3730a3', accent: '#6366f1' },
  { name: 'Pizarra Grafito', primary: '#1e293b', accent: '#64748b' },
  { name: 'Rubí Corporativo', primary: '#881337', accent: '#f43f5e' },
  { name: 'Ámbar Comercial', primary: '#78350f', accent: '#f59e0b' },
  { name: 'Púrpura Creativo', primary: '#581c87', accent: '#a855f7' },
];

export const SettingsView: React.FC = () => {
  const {
    settings,
    currentUser,
    updateSettings,
    requestNotificationPermission,
    triggerPushNotification,
    exportBackupJSON,
    parseBackupJSON,
    importBackupData,
    clearAllUserData,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'company' | 'branding' | 'layout' | 'tax' | 'texts' | 'notifications' | 'backup'>('company');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<{ msg: string; isError?: boolean } | null>(null);
  const [pendingBackupSummary, setPendingBackupSummary] = useState<BackupSummary | null>(null);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSettings({ logoUrl: reader.result as string });
        handleSave();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSettings({ signatureImage: reader.result as string });
        handleSave();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const content = evt.target?.result as string;
        if (content) {
          const summary = parseBackupJSON(content);
          if (!summary.valid) {
            setImportStatus({ msg: summary.error || 'El archivo seleccionado no es válido.', isError: true });
            setTimeout(() => setImportStatus(null), 5000);
          } else {
            setPendingBackupSummary(summary);
            setIsRestoreModalOpen(true);
          }
        }
      };
      reader.readAsText(file);
      // Reset input value so the same file can be reloaded if desired
      e.target.value = '';
    }
  };

  const handleConfirmRestore = (mode: BackupRestoreMode) => {
    if (!pendingBackupSummary?.data) return;
    const res = importBackupData(pendingBackupSummary.data, mode);
    setIsRestoreModalOpen(false);
    setPendingBackupSummary(null);
    if (res.success) {
      setImportStatus({ msg: res.message });
    } else {
      setImportStatus({ msg: res.message, isError: true });
    }
    setTimeout(() => setImportStatus(null), 6000);
  };

  const handleTestNotification = async () => {
    const granted = await requestNotificationPermission();
    if (granted || Notification.permission === 'granted') {
      triggerPushNotification(
        'CotizaFácil Pro - Prueba de Notificación',
        '¡Las notificaciones push funcionan correctamente para tus recordatorios de cotizaciones!'
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Configuración & Identidad de Marca
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Personaliza la apariencia gráfica de tus cotizaciones, impuestos (IVA), textos y notificaciones
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-emerald-200">
            <Check className="w-4 h-4" /> Cambios Guardados
          </div>
        )}
      </div>

      {/* Tabs Menu */}
      <div className="flex overflow-x-auto gap-2 bg-slate-200/60 p-1.5 rounded-2xl">
        {[
          { id: 'company', label: 'Datos Empresa', icon: Building },
          { id: 'branding', label: 'Marca & Gráficos', icon: Palette },
          { id: 'layout', label: 'Editor de Espacios e Impresión', icon: Sliders },
          { id: 'tax', label: 'IVA & Moneda', icon: Percent },
          { id: 'texts', label: 'Términos & Notas', icon: FileText },
          { id: 'notifications', label: 'Notificaciones Push', icon: Bell },
          { id: 'backup', label: 'Respaldo', icon: Download },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Company Profile */}
      {activeTab === 'company' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-sm">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" />
            Información de tu Negocio / Emisor
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nombre Comercial / Marca
              </label>
              <input
                type="text"
                value={settings.companyName}
                placeholder="Ej. Mi Empresa / Tu Marca"
                onChange={(e) => {
                  updateSettings({ companyName: e.target.value });
                  handleSave();
                }}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Razón Social (opcional)
              </label>
              <input
                type="text"
                value={settings.legalName}
                placeholder="Ej. Servicios y Soluciones S.A. de C.V."
                onChange={(e) => {
                  updateSettings({ legalName: e.target.value });
                  handleSave();
                }}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                RFC / Tax ID / NIT / CIF
              </label>
              <input
                type="text"
                value={settings.taxId}
                placeholder="Ej. RFC/NIT..."
                onChange={(e) => {
                  updateSettings({ taxId: e.target.value });
                  handleSave();
                }}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Teléfono Comercial
              </label>
              <input
                type="text"
                value={settings.phone}
                placeholder="Ej. +52 55 1234 5678"
                onChange={(e) => {
                  updateSettings({ phone: e.target.value });
                  handleSave();
                }}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={settings.email}
                placeholder="contacto@tuempresa.com"
                onChange={(e) => {
                  updateSettings({ email: e.target.value });
                  handleSave();
                }}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dirección Física
              </label>
              <input
                type="text"
                value={settings.address}
                placeholder="Calle, Número, Colonia, Ciudad, CP"
                onChange={(e) => {
                  updateSettings({ address: e.target.value });
                  handleSave();
                }}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sitio Web
              </label>
              <input
                type="text"
                value={settings.website}
                placeholder="https://www.tuempresa.com"
                onChange={(e) => {
                  updateSettings({ website: e.target.value });
                  handleSave();
                }}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Branding & Graphics */}
      {activeTab === 'branding' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6 text-sm">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-600" />
            Identidad Visual y Gráficos del Documento
          </h3>

          {/* Logo */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <label className="block text-xs font-bold text-slate-800">
              Logotipo Oficial de la Empresa
            </label>
            <div className="flex flex-wrap items-center gap-4">
              {settings.logoUrl ? (
                <div className="h-16 w-36 bg-white border border-slate-200 rounded-xl p-2 flex items-center justify-center shadow-xs">
                  <img
                    src={settings.logoUrl}
                    alt="Logo"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="h-16 w-36 bg-slate-200/60 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-xs text-slate-400 font-semibold">
                  Sin Logotipo
                </div>
              )}

              <label className="cursor-pointer px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-colors">
                <ImageIcon className="w-4 h-4" />
                {settings.logoUrl ? 'Cambiar Logotipo' : 'Subir Archivo de Logo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>

              {settings.logoUrl && (
                <button
                  type="button"
                  onClick={() => {
                    updateSettings({ logoUrl: '' });
                    handleSave();
                  }}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  Eliminar Logo
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Se recomienda imagen PNG con fondo transparente o JPG en buena resolución.
            </p>
          </div>

          {/* Graphical Spacing & Layout Administrator (Embedded right alongside Logo & Branding) */}
          <div className="pt-2">
            <LayoutSpacingEditor
              settings={settings}
              onUpdateLayout={(newLayout: QuoteLayoutSettings) => {
                updateSettings({ layout: newLayout });
              }}
              onSave={handleSave}
            />
          </div>

          {/* Palettes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Paletas de Color Prediseñadas:
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    updateSettings({ primaryColor: p.primary, accentColor: p.accent });
                    handleSave();
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    settings.primaryColor === p.primary
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: p.primary }} />
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Color Primario (Encabezados y bordes)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => {
                    updateSettings({ primaryColor: e.target.value });
                    handleSave();
                  }}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200"
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) => {
                    updateSettings({ primaryColor: e.target.value });
                    handleSave();
                  }}
                  className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Color de Acento (Detalles y gradientes)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.accentColor}
                  onChange={(e) => {
                    updateSettings({ accentColor: e.target.value });
                    handleSave();
                  }}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200"
                />
                <input
                  type="text"
                  value={settings.accentColor}
                  onChange={(e) => {
                    updateSettings({ accentColor: e.target.value });
                    handleSave();
                  }}
                  className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase"
                />
              </div>
            </div>
          </div>

          {/* Signature Setup */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Mostrar Área de Firma en Cotizaciones
              </label>
              <input
                type="checkbox"
                checked={settings.showSignatureArea}
                onChange={(e) => {
                  updateSettings({ showSignatureArea: e.target.checked });
                  handleSave();
                }}
                className="w-4 h-4 rounded text-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nombre y Cargo del Firmante
              </label>
              <input
                type="text"
                value={settings.signatureTitle}
                onChange={(e) => {
                  updateSettings({ signatureTitle: e.target.value });
                  handleSave();
                }}
                placeholder="Ej. Ing. Carlos Mendoza - Director Comercial"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="cursor-pointer px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors">
                <ImageIcon className="w-4 h-4" />
                {settings.signatureImage ? 'Cambiar Firma Digital' : 'Cargar Firma Digital'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureUpload}
                  className="hidden"
                />
              </label>
              {settings.signatureImage && (
                <button
                  type="button"
                  onClick={() => {
                    updateSettings({ signatureImage: '' });
                    handleSave();
                  }}
                  className="text-xs text-rose-600 hover:underline"
                >
                  Quitar Firma
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Layout & Spacing Graphical Editor */}
      {activeTab === 'layout' && (
        <div className="space-y-4">
          <LayoutSpacingEditor
            settings={settings}
            onUpdateLayout={(newLayout: QuoteLayoutSettings) => {
              updateSettings({ layout: newLayout });
            }}
            onSave={handleSave}
          />
        </div>
      )}

      {/* Tab 3: IVA & Currency defaults */}
      {activeTab === 'tax' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5 text-sm">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Percent className="w-4 h-4 text-emerald-600" />
            Configuración Predeterminada de IVA e Impuestos
          </h3>

          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-xs text-slate-700 space-y-2">
            <p className="font-semibold text-emerald-900">
              💡 El IVA es 100% editable tanto a nivel global como de manera individual por cotización y por producto.
            </p>
            <p>
              Aquí puedes definir la tasa por defecto para tu país (por ejemplo, 16% en México, 19% en Colombia, 21% en España o 0% si tus servicios son exentos).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tasa General de IVA por Defecto (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0"
                  max="100"
                  value={settings.defaultTaxRate}
                  onChange={(e) => {
                    updateSettings({ defaultTaxRate: parseFloat(e.target.value) || 0 });
                    handleSave();
                  }}
                  className="w-full px-3.5 py-2 pr-8 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold text-sm"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                  %
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-800">
                  Activar IVA Automáticamente
                </label>
                <span className="text-[11px] text-slate-500">
                  Aplica la tasa por defecto al crear nuevas cotizaciones
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.defaultTaxEnabled}
                onChange={(e) => {
                  updateSettings({ defaultTaxEnabled: e.target.checked });
                  handleSave();
                }}
                className="w-5 h-5 rounded text-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Moneda Predeterminada
              </label>
              <select
                value={settings.defaultCurrency}
                onChange={(e) => {
                  const val = e.target.value;
                  const sym = val === 'EUR' ? '€' : '$';
                  updateSettings({ defaultCurrency: val, defaultCurrencySymbol: sym });
                  handleSave();
                }}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
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
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Símbolo de Moneda
              </label>
              <input
                type="text"
                value={settings.defaultCurrencySymbol}
                onChange={(e) => {
                  updateSettings({ defaultCurrencySymbol: e.target.value });
                  handleSave();
                }}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Terms & Notes */}
      {activeTab === 'texts' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-sm">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Textos, Instrucciones de Pago y Términos Predeterminados
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Métodos de Pago e Instrucciones Bancarias por Defecto
            </label>
            <textarea
              rows={4}
              value={settings.defaultPaymentMethods}
              onChange={(e) => {
                updateSettings({ defaultPaymentMethods: e.target.value });
                handleSave();
              }}
              placeholder="Bancos, CLABE, número de cuenta, referencia..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Términos y Condiciones Comerciales por Defecto
            </label>
            <textarea
              rows={5}
              value={settings.defaultTerms}
              onChange={(e) => {
                updateSettings({ defaultTerms: e.target.value });
                handleSave();
              }}
              placeholder="Vigencia, políticas de pago, entregas..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Notas y Agradecimiento al Cliente por Defecto
            </label>
            <textarea
              rows={3}
              value={settings.defaultNotes}
              onChange={(e) => {
                updateSettings({ defaultNotes: e.target.value });
                handleSave();
              }}
              placeholder="Mensaje de cortesía..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* Tab 5: Push Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5 text-sm">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-600" />
            Notificaciones Push y Recordatorios de Seguimiento
          </h3>

          <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/70 text-xs text-amber-900 space-y-2">
            <h4 className="font-bold text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              Notificaciones en Navegador y Móvil
            </h4>
            <p>
              El sistema monitoriza las fechas de seguimiento de tus cotizaciones y envía notificaciones push tanto dentro de la aplicación como en las alertas de escritorio o teléfono.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <div className="font-bold text-slate-900 text-sm">Permisos de Notificación</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Estado actual en tu navegador: <strong>{typeof Notification !== 'undefined' ? Notification.permission : 'No soportado'}</strong>
              </div>
            </div>

            <button
              onClick={handleTestNotification}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <Bell className="w-4 h-4" />
              Activar / Probar Notificación
            </button>
          </div>
        </div>
      )}

      {/* Tab 6: Backup and Restore */}
      {activeTab === 'backup' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6 text-sm">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Download className="w-4 h-4 text-blue-600" />
            Copia de Seguridad y Restauración de Datos
          </h3>

          {/* Offline ZIP Application Package - Only visible to Administrator */}
          {currentUser.role === 'admin' && (
            <div className="p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl text-white shadow-xl space-y-4 border border-slate-700/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-inner shrink-0">
                    <Archive className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-extrabold text-base sm:text-lg text-white">
                        Paquete de Aplicación Completa Offline (.ZIP)
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-indigo-300" /> Exclusivo Administrador
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                        <WifiOff className="w-3 h-3" /> 100% Sin Conexión
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1">
                        <Database className="w-3 h-3" /> Con Bases de Datos
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Descarga el código fuente completo, distribución precompilada, bases de datos de ejemplo (usuarios comerciales y cotizaciones), servidor autónomo y lanzadores automáticos para ejecutar localmente en tu computadora.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
                  <div className="font-bold text-slate-200 flex items-center gap-1.5 mb-1">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Windows (1 Clic)
                  </div>
                  <p className="text-[11px] text-slate-400">Doble clic en <code className="text-indigo-300 bg-slate-900/60 px-1 py-0.5 rounded">INICIAR_LOCAL.bat</code></p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
                  <div className="font-bold text-slate-200 flex items-center gap-1.5 mb-1">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Mac / Linux
                  </div>
                  <p className="text-[11px] text-slate-400">Ejecutar <code className="text-emerald-300 bg-slate-900/60 px-1 py-0.5 rounded">./iniciar_local.sh</code></p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
                  <div className="font-bold text-slate-200 flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Accesos Incluidos
                  </div>
                  <p className="text-[11px] text-slate-400"><strong className="text-slate-200">admin</strong> (admin123) / <strong className="text-slate-200">comercial</strong> (admin123)</p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href="/cotizafacil-pro-offline.zip"
                  download="CotizaFacil_Pro_Offline.zip"
                  className="w-full sm:w-auto flex-1 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-blue-900/40 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Download className="w-4 h-4" />
                  Descargar Archivo ZIP Completo (.ZIP)
                </a>

                <button
                  type="button"
                  onClick={exportBackupJSON}
                  className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5 text-indigo-400" />
                  Exportar Base de Datos Actual (.json)
                </button>
              </div>
            </div>
          )}

          {importStatus && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold ${
                importStatus.isError ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {importStatus.msg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Export */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">
                    {currentUser.role === 'admin' ? 'Descargar Respaldo Completo' : 'Descargar Mi Respaldo'}
                  </h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${currentUser.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {currentUser.role === 'admin' ? 'Incluye todos los usuarios' : 'Solo tu información'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {currentUser.role === 'admin'
                    ? 'Genera una copia de seguridad integral con todas las cotizaciones, clientes y productos de todos los usuarios y vendedores del sistema.'
                    : 'Guarda únicamente tus cotizaciones, clientes, catálogo de productos y configuración personal en un archivo JSON seguro.'}
                </p>
              </div>
              <button
                onClick={exportBackupJSON}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {currentUser.role === 'admin' ? 'Exportar Respaldo del Sistema (.json)' : 'Exportar Mi Respaldo (.json)'}
              </button>
            </div>

            {/* Import */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">
                    {currentUser.role === 'admin' ? 'Restaurar desde Respaldo' : 'Restaurar Mi Información'}
                  </h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${currentUser.role === 'admin' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                    {currentUser.role === 'admin' ? 'Con selección Admin o Todos' : 'Tu cuenta personal'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {currentUser.role === 'admin'
                    ? 'Carga un archivo de respaldo. Como administrador, podrás elegir si deseas restaurar únicamente los datos del Administrador o también los de los demás usuarios.'
                    : 'Carga un archivo de respaldo para recuperar tus cotizaciones, clientes y productos. La información del administrador y de otros vendedores permanecerá protegida.'}
                </p>
              </div>
              <label className="w-full px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                {currentUser.role === 'admin' ? 'Cargar Archivo de Respaldo' : 'Cargar y Restaurar Mis Datos'}
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Reset */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Limpiar Datos y Comenzar desde Cero</h4>
              <p className="text-xs text-slate-500">
                Limpia tus cotizaciones, clientes, productos y configuración para capturar tu información real.
              </p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('¿Seguro de limpiar tus datos y comenzar con la base en blanco para capturar tu información real?')) {
                  clearAllUserData();
                }
              }}
              className="px-4 py-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Limpiar Datos
            </button>
          </div>
        </div>
      )}

      {/* Backup Restore Confirmation Modal */}
      <BackupRestoreModal
        isOpen={isRestoreModalOpen}
        onClose={() => {
          setIsRestoreModalOpen(false);
          setPendingBackupSummary(null);
        }}
        summary={pendingBackupSummary}
        onConfirmRestore={handleConfirmRestore}
        currentUserRole={currentUser.role}
        currentUserName={currentUser.name}
      />
    </div>
  );
};
