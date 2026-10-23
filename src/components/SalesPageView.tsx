import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  generateSalesPageHtml,
  SalesPageConfig,
  defaultSalesPageConfig
} from '../utils/salesPageTemplate';
import {
  Download,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  ShieldAlert,
  Globe,
  Sparkles,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  Palette,
  DollarSign,
  MessageSquare,
  Mail,
  Building,
  HelpCircle,
  FileCode,
  ArrowRight,
  Eye,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

export const SalesPageView: React.FC = () => {
  const { currentUser, settings, setActiveTab } = useApp();

  // If user is not administrator, strictly deny access
  if (currentUser.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Acceso Restringido a Administradores
        </h2>
        <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
          La página de ventas descargable y sus herramientas de comercialización están reservadas exclusivamente para el usuario administrador del sistema.
        </p>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="mt-6 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          Volver al Tablero Principal
        </button>
      </div>
    );
  }

  // Admin configuration state
  const [config, setConfig] = useState<SalesPageConfig>(() => ({
    ...defaultSalesPageConfig,
    productName: 'CotizaFácil Pro',
    logoUrl: settings.logoUrl || '',
    companyName: settings.companyName || defaultSalesPageConfig.companyName,
    primaryColor: settings.primaryColor || defaultSalesPageConfig.primaryColor,
    contactEmail: currentUser.email || defaultSalesPageConfig.contactEmail,
  }));

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'preview' | 'config' | 'guide'>('preview');

  // Generate live HTML string based on current config
  const generatedHtml = useMemo(() => {
    return generateSalesPageHtml(config);
  }, [config]);

  // Handler to download the single self-contained HTML sales landing page
  const handleDownloadHtml = () => {
    try {
      const blob = new Blob([generatedHtml], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Pagina_Ventas_${config.productName.replace(/\s+/g, '_')}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (e) {
      console.error('Error generating download:', e);
      alert('Error al descargar el archivo HTML.');
    }
  };

  // Handler to copy HTML code to clipboard
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      alert('No se pudo copiar automáticamente. Puedes descargar el archivo directamente.');
    }
  };

  // Handler to open preview in a new window/tab
  const handleOpenInNewTab = () => {
    const blob = new Blob([generatedHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner & Title */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Página de Ventas Comercial
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" /> Exclusivo Administrador
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Página de Ventas Descargable de la Aplicación
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Genera y descarga una página web de aterrizaje profesional, responsiva y de alta conversión lista para publicar en tu servidor, enviar a clientes o comercializar licencias del software.
            </p>
          </div>

          {/* Quick Action Buttons for Admin */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadHtml}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-900/50 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Página (.HTML)</span>
            </button>

            <button
              onClick={handleOpenInNewTab}
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              title="Abrir en pantalla completa en una nueva pestaña"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Ver en Pantalla Completa</span>
            </button>

            <button
              onClick={handleCopyCode}
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              title="Copiar código fuente HTML al portapapeles"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Copiado!' : 'Copiar Código'}</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>¡Página de ventas descargada con éxito! Puedes abrir el archivo descargado directamente con doble clic o subirlo a cualquier hosting web.</span>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('preview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'preview'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Simulador &amp; Vista Previa</span>
          </button>

          <button
            onClick={() => setActiveSubTab('config')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'config'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Personalizar Precios &amp; Textos</span>
          </button>

          <button
            onClick={() => setActiveSubTab('guide')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'guide'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Guía de Publicación</span>
          </button>
        </div>

        {/* Viewport switchers (only visible when in preview sub-tab) */}
        {activeSubTab === 'preview' && (
          <div className="hidden sm:flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                previewDevice === 'desktop' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Vista de Computadora"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewDevice('tablet')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                previewDevice === 'tablet' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Vista de Tablet"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                previewDevice === 'mobile' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Vista de Teléfono Móvil"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* SUB-TAB 1: LIVE PREVIEW SIMULATOR */}
      {activeSubTab === 'preview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Simulador en Vivo: Cambia tus textos o precios en la pestaña de personalización y observa los cambios instantáneamente.</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadHtml}
                className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Descargar este HTML
              </button>
            </div>
          </div>

          {/* Iframe Viewport Container */}
          <div className="bg-slate-800 p-2 sm:p-4 rounded-3xl border border-slate-700 shadow-2xl flex justify-center overflow-x-auto min-h-[600px]">
            <div
              className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 border border-slate-600 flex flex-col ${
                previewDevice === 'desktop'
                  ? 'w-full h-[750px]'
                  : previewDevice === 'tablet'
                  ? 'w-[768px] h-[750px]'
                  : 'w-[390px] h-[750px]'
              }`}
            >
              {/* Simulated Browser Bar */}
              <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs text-slate-500 shrink-0 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="bg-white px-4 py-1 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-600 max-w-xs truncate">
                  https://tu-dominio.com/cotizafacil
                </div>
                <div className="text-[10px] font-bold text-slate-400">
                  {previewDevice.toUpperCase()}
                </div>
              </div>

              {/* Sandboxed Live Preview Iframe */}
              <iframe
                title="Página de Ventas Preview"
                srcDoc={generatedHtml}
                className="w-full flex-1 border-0 bg-white"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CONFIGURATION & CUSTOMIZATION */}
      {activeSubTab === 'config' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Configurar Datos y Oferta de la Página de Ventas
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Personaliza los textos, precios, número de WhatsApp y moneda antes de descargar tu archivo HTML.
              </p>
            </div>

            <button
              onClick={() => setConfig(defaultSalesPageConfig)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Restablecer Valores
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Field: Program / Company Logo */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Logo del Programa en la Página de Ventas</span>
                {settings.logoUrl && (
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, logoUrl: settings.logoUrl })}
                    className="text-blue-600 hover:text-blue-800 text-[11px] font-bold cursor-pointer"
                  >
                    Sincronizar con Logo Actual del Programa
                  </button>
                )}
              </label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                  {config.logoUrl ? (
                    <img src={config.logoUrl} alt="Logo preview" className="max-h-10 max-w-10 object-contain" />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                      <FileText className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={config.logoUrl || ''}
                    placeholder="URL o Data URI del logo (o sube una imagen con el botón)"
                    onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                  />
                </div>
                <label className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer border border-slate-200 transition-colors whitespace-nowrap">
                  <span>Subir Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setConfig({ ...config, logoUrl: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {config.logoUrl && (
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, logoUrl: '' })}
                    className="px-3 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Usar icono por defecto del programa"
                  >
                    Quitar
                  </button>
                )}
              </div>
            </div>

            {/* Field: Product Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nombre del Software / Producto
              </label>
              <input
                type="text"
                value={config.productName}
                onChange={(e) => setConfig({ ...config, productName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              />
            </div>

            {/* Field: Tagline */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Subtítulo Comercial / Eslogan
              </label>
              <input
                type="text"
                value={config.tagline}
                onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              />
            </div>

            {/* Field: Hero Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Titular Principal (Headline de Alto Impacto)
              </label>
              <input
                type="text"
                value={config.heroTitle}
                onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              />
            </div>

            {/* Field: Hero Highlight */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Frase Destacada con Gradiente
              </label>
              <input
                type="text"
                value={config.heroHighlight}
                onChange={(e) => setConfig({ ...config, heroHighlight: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              />
            </div>

            {/* Field: Company Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nombre de tu Empresa Emisora
              </label>
              <input
                type="text"
                value={config.companyName}
                onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              />
            </div>

            {/* Field: Hero Subtitle */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Descripción / Beneficio de Entrada
              </label>
              <textarea
                rows={3}
                value={config.heroSubtitle}
                onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium leading-relaxed"
              />
            </div>

            {/* Pricing Section */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 md:col-span-2 grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Precio Regular (Tachado)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="text"
                    value={config.regularPrice}
                    onChange={(e) => setConfig({ ...config, regularPrice: e.target.value })}
                    className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-900 mb-1">
                  Precio de Oferta
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 font-bold">$</span>
                  <input
                    type="text"
                    value={config.promoPrice}
                    onChange={(e) => setConfig({ ...config, promoPrice: e.target.value })}
                    className="w-full pl-7 pr-3 py-2 bg-white border border-blue-300 rounded-xl text-xs sm:text-sm font-black text-blue-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Símbolo de Moneda
                </label>
                <input
                  type="text"
                  value={config.currencySymbol}
                  onChange={(e) => setConfig({ ...config, currencySymbol: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900"
                  placeholder="$"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Código de Moneda
                </label>
                <input
                  type="text"
                  value={config.currencyCode}
                  onChange={(e) => setConfig({ ...config, currencyCode: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900"
                  placeholder="USD, MXN, EUR"
                />
              </div>
            </div>

            {/* Field: Checkout URL */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Enlace de Compra en Línea (Checkout / Pasarela de Pago)</span>
                <a
                  href={config.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-[11px] font-bold flex items-center gap-1"
                >
                  <span>Probar Enlace</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </label>
              <input
                type="url"
                value={config.checkoutUrl}
                onChange={(e) => setConfig({ ...config, checkoutUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium font-mono text-[11px]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Los botones principales de compra («Comprar Ahora», «Comprar Licencia en Línea») dirigirán automáticamente a este enlace.
              </span>
            </div>

            {/* Field: WhatsApp Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                Número de WhatsApp (con código de país sin +)
              </label>
              <input
                type="text"
                value={config.whatsappNumber}
                onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                placeholder="Ej. 523316656419"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Número actual: 52 3316656419 (+52 33 1665 6419).</span>
            </div>

            {/* Field: Contact Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                Correo de Soporte y Ventas
              </label>
              <input
                type="email"
                value={config.contactEmail}
                onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              />
            </div>

            {/* Field: Pre-filled WhatsApp message */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Mensaje prellenado al hacer clic en el botón de WhatsApp
              </label>
              <input
                type="text"
                value={config.whatsappMessage}
                onChange={(e) => setConfig({ ...config, whatsappMessage: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Todos los cambios se reflejan al instante en la vista previa y en el archivo descargable.
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveSubTab('preview')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Ver en el Simulador
              </button>

              <button
                onClick={handleDownloadHtml}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Página (.HTML)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PUBLISHING GUIDE */}
      {activeSubTab === 'guide' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <FileCode className="w-5 h-5 text-indigo-600" />
              ¿Cómo publicar y utilizar la página de ventas descargada?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              El archivo descargado es un documento HTML 100% autónomo y responsivo, listo para ser utilizado en cualquier plataforma sin configuraciones complejas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Opción A: Subir a tu Hosting (cPanel / Apache)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Descarga el archivo, renómbralo como <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">index.html</code> y súbelo a la carpeta <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">public_html</code> o a un subdirectorio como <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">/cotizador</code> de tu dominio.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Opción B: Hosting Gratuito (Netlify / Vercel / GitHub)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Arrastra y suelta el archivo <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">index.html</code> en Netlify Drop o súbelo a GitHub Pages para tener una URL pública gratuita en menos de 2 minutos.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Opción C: Apertura Directa en Navegador</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Puedes abrir el archivo HTML directamente con doble clic en tu computadora o enviarlo por correo; funciona en Chrome, Edge, Safari o Firefox de forma inmediata sin configuraciones.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
              <span>
                <strong>Control de Seguridad:</strong> Los usuarios vendedores y comerciales no tienen acceso a esta sección ni pueden descargar el código comercial.
              </span>
            </div>
            <button
              onClick={handleDownloadHtml}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
            >
              Descargar Ahora
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
