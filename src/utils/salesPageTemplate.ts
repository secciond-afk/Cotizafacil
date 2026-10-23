export interface SalesPageConfig {
  productName: string;
  tagline: string;
  logoUrl?: string;
  checkoutUrl: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  regularPrice: string;
  promoPrice: string;
  currencySymbol: string;
  currencyCode: string;
  whatsappNumber: string;
  whatsappMessage: string;
  contactEmail: string;
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
  guaranteeDays: number;
}

export const defaultSalesPageConfig: SalesPageConfig = {
  productName: 'CotizaFácil Pro',
  tagline: 'Sistema Profesional de Cotizaciones & Ventas para Empresas',
  logoUrl: '',
  checkoutUrl: 'https://biohealth.com.mx/products/cotizafacil-pro?utm_source=copyToPasteBoard&utm_medium=product-links&utm_content=web',
  heroTitle: 'Cierra más ventas con cotizaciones de alto impacto en',
  heroHighlight: 'menos de 60 segundos',
  heroSubtitle: 'El software corporativo todo en uno para emitir cotizaciones profesionales, gestionar cartera de clientes, controlar catálogo de productos y automatizar seguimientos comerciales sin rentas mensuales.',
  regularPrice: '149',
  promoPrice: '49',
  currencySymbol: '$',
  currencyCode: 'USD',
  whatsappNumber: '523316656419',
  whatsappMessage: 'Hola, deseo adquirir la licencia de CotizaFácil Pro.',
  contactEmail: 'ventas@cotizafacil.com',
  companyName: 'CotizaFácil Pro Software',
  primaryColor: '#1d4ed8',
  secondaryColor: '#0f172a',
  guaranteeDays: 30,
};

export function generateSalesPageHtml(config: SalesPageConfig): string {
  const cleanPhone = config.whatsappNumber.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(config.whatsappMessage);
  const waLink = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
  const checkoutLink = config.checkoutUrl || 'https://biohealth.com.mx/products/cotizafacil-pro?utm_source=copyToPasteBoard&utm_medium=product-links&utm_content=web';

  // Logo rendering: if config.logoUrl is provided use it, otherwise render the sleek document brand mark
  const logoMarkHtml = config.logoUrl
    ? `<img src="${config.logoUrl}" alt="${config.productName}" class="max-h-10 max-w-10 object-contain rounded-xl" />`
    : `<div class="w-10 h-10 rounded-xl text-white flex items-center justify-center font-black text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform" style="background-color: ${config.primaryColor}">
         <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
           <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
         </svg>
       </div>`;

  const footerLogoHtml = config.logoUrl
    ? `<img src="${config.logoUrl}" alt="${config.productName}" class="max-h-9 max-w-9 object-contain rounded-lg" />`
    : `<div class="w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold text-base" style="background-color: ${config.primaryColor}">
         <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
           <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
         </svg>
       </div>`;

  return `<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.productName} | ${config.tagline}</title>
  <meta name="description" content="${config.heroSubtitle}">
  <meta property="og:title" content="${config.productName} - ${config.tagline}">
  <meta property="og:description" content="${config.heroSubtitle}">
  <meta property="og:type" content="website">

  <!-- Google Fonts & Tailwind CDN -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
          },
          colors: {
            brand: {
              50: '#eff6ff',
              100: '#dbeafe',
              500: '${config.primaryColor}',
              600: '${config.primaryColor}',
              700: '#1d4ed8',
              900: '${config.secondaryColor}',
            }
          }
        }
      }
    }
  </script>
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .glass-card {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }
    .gradient-glow {
      background: radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.15) 0%, rgba(255, 255, 255, 0) 70%);
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased selection:bg-blue-600 selection:text-white">

  <!-- Top Announcement Bar -->
  <div class="bg-slate-900 text-white text-xs font-semibold py-2.5 px-4 text-center border-b border-slate-800">
    <div class="max-w-6xl mx-auto flex items-center justify-center gap-2">
      <span class="inline-block px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
        Oferta Especial
      </span>
      <span>Licencia Vitalicia sin mensualidades recurrentes • Ahorra más del 65% hoy</span>
      <a href="${checkoutLink}" target="_blank" rel="noopener noreferrer" class="underline text-blue-300 hover:text-white transition-colors ml-1 font-bold">Comprar Ahora &rarr;</a>
    </div>
  </div>

  <!-- Header / Navigation -->
  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
      <a href="#" class="flex items-center gap-3 group">
        ${logoMarkHtml}
        <div>
          <span class="text-xl font-extrabold text-slate-900 tracking-tight leading-none block">
            ${config.productName}
          </span>
          <span class="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mt-0.5">
            Software Comercial
          </span>
        </div>
      </a>

      <nav class="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
        <a href="#beneficios" class="hover:text-blue-600 transition-colors">Beneficios</a>
        <a href="#caracteristicas" class="hover:text-blue-600 transition-colors">Funcionalidades</a>
        <a href="#comparativa" class="hover:text-blue-600 transition-colors">Antes vs Después</a>
        <a href="#testimonios" class="hover:text-blue-600 transition-colors">Testimonios</a>
        <a href="#faq" class="hover:text-blue-600 transition-colors">Preguntas</a>
      </nav>

      <div class="flex items-center gap-3">
        <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
          Chat WhatsApp
        </a>
        <a href="${checkoutLink}" target="_blank" rel="noopener noreferrer" class="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all">
          Comprar Ahora
        </a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
    <div class="absolute inset-0 gradient-glow pointer-events-none"></div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
      <!-- Badge -->
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-extrabold mb-8 shadow-xs">
        <span class="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
        <span>Versión 2026 • Alto Rendimiento y Seguridad Corporativa</span>
      </div>

      <!-- Headline -->
      <h1 class="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
        ${config.heroTitle}
        <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          ${config.heroHighlight}
        </span>
      </h1>

      <!-- Subtitle -->
      <p class="mt-6 text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
        ${config.heroSubtitle}
      </p>

      <!-- CTA Buttons & Guarantee -->
      <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="${checkoutLink}" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-base font-extrabold shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
          ¡Comprar Licencia Vitalicia por ${config.currencySymbol}${config.promoPrice} ${config.currencyCode}!
        </a>
        <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto px-7 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2">
          <span>Hablar por WhatsApp (+52 33 1665 6419)</span>
        </a>
      </div>

      <!-- Trust Badges -->
      <div class="mt-12 pt-8 border-t border-slate-200/60 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-xs font-bold text-slate-500">
        <div class="flex items-center justify-center gap-2">
          <span class="text-blue-600 text-base">🛡️</span>
          <span>Pago Único Vitalicio</span>
        </div>
        <div class="flex items-center justify-center gap-2">
          <span class="text-emerald-600 text-base">⚡</span>
          <span>Activación Inmediata</span>
        </div>
        <div class="flex items-center justify-center gap-2">
          <span class="text-indigo-600 text-base">🔒</span>
          <span>Privacidad Total de Datos</span>
        </div>
        <div class="flex items-center justify-center gap-2">
          <span class="text-amber-600 text-base">⭐</span>
          <span>Garantía de ${config.guaranteeDays} Días</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Problem & Solution Section (Antes vs Después) -->
  <section id="comparativa" class="py-20 bg-slate-100 border-y border-slate-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-xs font-black uppercase tracking-wider text-blue-600 mb-2">Transformación Radical</h2>
        <h3 class="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Deja de perder clientes por enviar cotizaciones tardías o informales
        </h3>
        <p class="text-slate-600 mt-3 text-sm sm:text-base">
          El 70% de las ventas se cierran con el primer proveedor que responde con una cotización clara, profesional y formal.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Sin CotizaFacil -->
        <div class="bg-white rounded-3xl p-8 border border-rose-200 shadow-sm relative overflow-hidden">
          <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl font-black mb-4">
            ✕
          </div>
          <h4 class="text-xl font-bold text-rose-950 mb-4">El Método Tradicional (Lento y Frustrante)</h4>
          <ul class="space-y-3.5 text-sm text-slate-600">
            <li class="flex items-start gap-3">
              <span class="text-rose-500 font-bold">✗</span>
              <span><strong>Pérdida de tiempo en hojas de cálculo:</strong> 25 a 45 minutos copiando y pegando precios y datos del cliente.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-rose-500 font-bold">✗</span>
              <span><strong>Errores en cálculos manuales:</strong> Fórmulas desconfiguradas en impuestos o descuentos que te hacen perder dinero.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-rose-500 font-bold">✗</span>
              <span><strong>Imagen poco profesional:</strong> Documentos desalineados que generan desconfianza frente a grandes empresas.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-rose-500 font-bold">✗</span>
              <span><strong>Olvido de prospectos:</strong> Cotizaciones enviadas que nunca se siguen y terminan frías en la bandeja de entrada.</span>
            </li>
          </ul>
        </div>

        <!-- Con CotizaFacil -->
        <div class="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div class="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-300 flex items-center justify-center text-xl font-black mb-4">
            ✓
          </div>
          <h4 class="text-xl font-bold text-white mb-4">Con ${config.productName} (Ágil y Rentable)</h4>
          <ul class="space-y-3.5 text-sm text-slate-200">
            <li class="flex items-start gap-3">
              <span class="text-emerald-400 font-bold">✓</span>
              <span><strong>Cotizaciones en 60 segundos:</strong> Selecciona cliente, añade productos con 1 clic y calcula totales al instante.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-emerald-400 font-bold">✓</span>
              <span><strong>PDFs con diseño corporativo impecable:</strong> Tu logo, colores, condiciones bancarias y firma digitalizada.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-emerald-400 font-bold">✓</span>
              <span><strong>Recordatorios inteligentes de seguimiento:</strong> Alertas antes de que venza la cotización para llamar y cerrar.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-emerald-400 font-bold">✓</span>
              <span><strong>100% Tuyo para siempre:</strong> Sin suscripciones mensuales, compatible con cualquier navegador en PC, Mac o Tablet.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- Features Grid -->
  <section id="caracteristicas" class="py-20 bg-white">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-xs font-black uppercase tracking-wider text-blue-600 mb-2">Potencia Comercial</h2>
        <h3 class="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Todo lo que tu equipo comercial necesita en una sola herramienta
        </h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Feature 1 -->
        <div class="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition-all">
          <div class="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl mb-4 font-bold">
            📄
          </div>
          <h4 class="font-extrabold text-lg text-slate-900 mb-2">Generador de Cotizaciones</h4>
          <p class="text-sm text-slate-600 leading-relaxed">
            Editor visual interactivo con partidas, códigos SKU, descuentos por porcentaje o monto, cálculo automático de impuestos y tipos de moneda personalizables.
          </p>
        </div>

        <!-- Feature 2 -->
        <div class="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition-all">
          <div class="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl mb-4 font-bold">
            👥
          </div>
          <h4 class="font-extrabold text-lg text-slate-900 mb-2">Cartera de Clientes &amp; CRM</h4>
          <p class="text-sm text-slate-600 leading-relaxed">
            Directorio completo con datos fiscales (RFC, RUT, NIT), contacto directo, dirección, teléfono, correo e historial de cotizaciones asociadas.
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition-all">
          <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl mb-4 font-bold">
            📦
          </div>
          <h4 class="font-extrabold text-lg text-slate-900 mb-2">Catálogo de Productos &amp; Servicios</h4>
          <p class="text-sm text-slate-600 leading-relaxed">
            Organiza tus productos por categorías, unidades de medida, precios unitarios e inventario disponible para seleccionarlos al vuelo.
          </p>
        </div>

        <!-- Feature 4 -->
        <div class="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition-all">
          <div class="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl mb-4 font-bold">
            🛡️
          </div>
          <h4 class="font-extrabold text-lg text-slate-900 mb-2">Control de Vendedores &amp; Permisos</h4>
          <p class="text-sm text-slate-600 leading-relaxed">
            Asigna usuarios comerciales independientes con límites de descuento, restricción para no borrar cotizaciones y aislamiento de cartera.
          </p>
        </div>

        <!-- Feature 5 -->
        <div class="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition-all">
          <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl mb-4 font-bold">
            🖨️
          </div>
          <h4 class="font-extrabold text-lg text-slate-900 mb-2">Exportación PDF &amp; WhatsApp</h4>
          <p class="text-sm text-slate-600 leading-relaxed">
            Genera documentos PDF de calidad imprenta con 1 clic o envía el resumen estructurado de la cotización directamente por WhatsApp al cliente.
          </p>
        </div>

        <!-- Feature 6 -->
        <div class="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition-all">
          <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl mb-4 font-bold">
            💾
          </div>
          <h4 class="font-extrabold text-lg text-slate-900 mb-2">Respaldo Total &amp; Máxima Privacidad</h4>
          <p class="text-sm text-slate-600 leading-relaxed">
            Exporta e importa tu base de datos en archivos JSON estándar. Todos tus datos permanecen seguros bajo tu control y soberanía digital.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Pricing Section -->
  <section id="precio" class="py-20 bg-gradient-to-b from-slate-900 to-slate-950 text-white relative">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
      <div class="text-center mb-12">
        <span class="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
          Oferta por Tiempo Limitado
        </span>
        <h3 class="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Adquiere tu Licencia Vitalicia Hoy
        </h3>
        <p class="text-slate-400 mt-3 text-sm sm:text-base">
          Un solo pago, sin suscripciones mensuales, sin tarifas ocultas.
        </p>
      </div>

      <!-- Main Pricing Card -->
      <div class="bg-slate-800/90 rounded-3xl border border-slate-700/80 p-8 sm:p-10 shadow-2xl relative">
        <div class="absolute -top-3.5 right-6 px-3.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-full shadow-md">
          Ahorras ${config.currencySymbol}${(parseFloat(config.regularPrice) - parseFloat(config.promoPrice)).toFixed(0)} ${config.currencyCode}
        </div>

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-700">
          <div>
            <h4 class="text-2xl font-extrabold text-white">Licencia Vitalicia Completa</h4>
            <p class="text-xs text-slate-400 mt-1">Acceso ilimitado al software, soporte continuo y actualizaciones.</p>
          </div>
          <div class="text-right">
            <span class="text-slate-400 line-through text-lg block">${config.currencySymbol}${config.regularPrice} ${config.currencyCode}</span>
            <div class="flex items-baseline gap-1">
              <span class="text-4xl sm:text-5xl font-black text-white">${config.currencySymbol}${config.promoPrice}</span>
              <span class="text-xs font-bold text-slate-300">${config.currencyCode} / Único Pago</span>
            </div>
          </div>
        </div>

        <!-- What is included -->
        <div class="py-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-200">
          <div class="flex items-center gap-3">
            <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">✓</span>
            <span>Cotizaciones, clientes y productos ilimitados</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">✓</span>
            <span>Generador de PDFs con tu logotipo y firma</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">✓</span>
            <span>Módulo de usuarios administradores y vendedores</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">✓</span>
            <span>Gestión integral de cartera de clientes y catálogo</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">✓</span>
            <span>Actualizaciones y mejoras continuas incluidas</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">✓</span>
            <span>Garantía de satisfacción de ${config.guaranteeDays} días</span>
          </div>
        </div>

        <!-- Action Buttons: Online Purchase Link + WhatsApp Option -->
        <div class="pt-4 flex flex-col sm:flex-row gap-4 items-center">
          <a href="${checkoutLink}" target="_blank" rel="noopener noreferrer" class="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-center text-sm sm:text-base shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2">
            <span>Comprar Licencia en Línea Ahora</span>
            <span>&rarr;</span>
          </a>
          <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm text-center transition-colors flex items-center justify-center gap-2">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            <span>Dudas por WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section id="faq" class="py-20 bg-slate-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      <div class="text-center mb-14">
        <h2 class="text-xs font-black uppercase tracking-wider text-blue-600 mb-2">Respuestas Inmediatas</h2>
        <h3 class="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Preguntas Frecuentes</h3>
      </div>

      <div class="space-y-4">
        <details class="group bg-white p-6 rounded-2xl border border-slate-200 cursor-pointer shadow-xs">
          <summary class="font-extrabold text-slate-900 text-base flex justify-between items-center list-none">
            <span>¿Qué requisitos técnicos necesito para usar la aplicación?</span>
            <span class="transition-transform group-open:rotate-180 text-blue-600">▼</span>
          </summary>
          <p class="text-slate-600 text-sm mt-3 leading-relaxed">
            Solo necesitas cualquier navegador web moderno (Chrome, Edge, Safari o Firefox) en tu computadora, laptop o tablet. No requiere instalaciones pesadas ni configuraciones técnicas complejas.
          </p>
        </details>

        <details class="group bg-white p-6 rounded-2xl border border-slate-200 cursor-pointer shadow-xs">
          <summary class="font-extrabold text-slate-900 text-base flex justify-between items-center list-none">
            <span>¿Tengo que pagar suscripciones mensuales o anuales?</span>
            <span class="transition-transform group-open:rotate-180 text-blue-600">▼</span>
          </summary>
          <p class="text-slate-600 text-sm mt-3 leading-relaxed">
            No. Esta oferta incluye una licencia vitalicia de un solo pago. No cobramos mensualidades, ni comisiones por cotizaciones emitidas, ni costos ocultos.
          </p>
        </details>

        <details class="group bg-white p-6 rounded-2xl border border-slate-200 cursor-pointer shadow-xs">
          <summary class="font-extrabold text-slate-900 text-base flex justify-between items-center list-none">
            <span>¿Puedo personalizar los PDFs con el logo y colores de mi empresa?</span>
            <span class="transition-transform group-open:rotate-180 text-blue-600">▼</span>
          </summary>
          <p class="text-slate-600 text-sm mt-3 leading-relaxed">
            Totalmente. Puedes subir el logo de tu empresa, cambiar los colores corporativos primarios y secundarios, ajustar márgenes, notas legales, cuentas bancarias para transferencias y firmar digitalmente.
          </p>
        </details>

        <details class="group bg-white p-6 rounded-2xl border border-slate-200 cursor-pointer shadow-xs">
          <summary class="font-extrabold text-slate-900 text-base flex justify-between items-center list-none">
            <span>¿Cómo se respalda mi información?</span>
            <span class="transition-transform group-open:rotate-180 text-blue-600">▼</span>
          </summary>
          <p class="text-slate-600 text-sm mt-3 leading-relaxed">
            El sistema cuenta con un centro de respaldo de un clic que genera archivos .JSON seguros. Puedes descargarlos cuando quieras para guardarlos en Google Drive, Dropbox o tu almacenamiento seguro.
          </p>
        </details>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
      <div class="flex items-center gap-3">
        ${footerLogoHtml}
        <div>
          <span class="text-white font-extrabold text-base block">${config.productName}</span>
          <p class="mt-0.5">${config.companyName} • Todos los derechos reservados.</p>
        </div>
      </div>
      <div class="flex items-center gap-6">
        <a href="#beneficios" class="hover:text-white transition-colors">Beneficios</a>
        <a href="${checkoutLink}" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">Comprar</a>
        <a href="mailto:${config.contactEmail}" class="hover:text-white transition-colors">Soporte</a>
      </div>
    </div>
  </footer>

  <!-- Floating WhatsApp CTA -->
  <div class="fixed bottom-6 right-6 z-50">
    <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer">
      <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
      <span>¿Dudas? WhatsApp: +52 33 1665 6419</span>
    </a>
  </div>

</body>
</html>
`;
}
