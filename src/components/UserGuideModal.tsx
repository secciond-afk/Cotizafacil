import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  FileText,
  Package,
  Users,
  Settings,
  ShieldCheck,
  KeyRound,
  Download,
  Share2,
  MessageSquare,
  Mail,
  Printer,
  ArrowRight,
  HelpCircle,
  Clock,
  Building,
  Check,
  Copy,
  Lightbulb,
  Database
} from 'lucide-react';

import guideDashboardImg from '../assets/images/guide_dashboard_1788372330086.jpg';
import guideQuoteEditorImg from '../assets/images/guide_quote_editor_1788372344289.jpg';
import guideShareExportImg from '../assets/images/guide_share_export_1788372362591.jpg';
import guideCatalogClientsImg from '../assets/images/guide_catalog_clients_1788372374429.jpg';

interface StepData {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  keyActionLabel: string;
  keyActionTab?: 'settings' | 'clients' | 'products' | 'quotes' | 'editor' | 'dashboard' | 'users';
  highlights: {
    icon: React.ElementType;
    title: string;
    description: string;
  }[];
  proTip: string;
}

export const UserGuideModal: React.FC = () => {
  const {
    isUserGuideOpen,
    setIsUserGuideOpen,
    setActiveTab,
    startNewQuote,
    settings,
    currentUser,
  } = useApp();

  const [activeStep, setActiveStep] = useState<number>(0);
  const [copiedTip, setCopiedTip] = useState(false);

  if (!isUserGuideOpen) return null;

  const steps: StepData[] = [
    {
      id: 1,
      badge: 'Paso 1 de 5 • Primeros Pasos',
      title: 'Configura la Marca e Identidad de tu Negocio',
      subtitle: 'Personaliza cómo se verá tu empresa ante los clientes en cada cotización y PDF generado.',
      image: guideDashboardImg,
      imageAlt: 'Configuración visual de marca y cotizaciones',
      keyActionLabel: 'Ir a Configuración de Empresa',
      keyActionTab: 'settings',
      highlights: [
        {
          icon: Building,
          title: 'Logo y Color Corporativo',
          description: 'Sube el logo de tu empresa o pega una URL directa. Selecciona tu color de acento primario para pintar la barra, botones y el PDF.',
        },
        {
          icon: FileText,
          title: 'Datos Fiscales y de Contacto',
          description: 'Ingresa tu RFC / Tax ID, teléfono, WhatsApp, correo y dirección fiscal para que aparezcan en la cabecera oficial.',
        },
        {
          icon: Settings,
          title: 'Términos, IVA y Moneda',
          description: 'Define la vigencia estándar (ej. 15 días), tasa de IVA predeterminada (o exento) y moneda de cobro (MXN $, USD $, etc.).',
        },
      ],
      proTip: 'Todo lo que cambies en Configuración se refleja instantáneamente en la interfaz y en el documento de cotización imprimible.',
    },
    {
      id: 2,
      badge: 'Paso 2 de 5 • Base de Datos',
      title: 'Registra tus Clientes y Catálogo de Productos',
      subtitle: 'Ahorra tiempo cargando tus contactos frecuentes y catálogo de artículos o servicios con precios y claves.',
      image: guideCatalogClientsImg,
      imageAlt: 'Administración de clientes y productos',
      keyActionLabel: 'Ver Catálogo y Clientes',
      keyActionTab: 'products',
      highlights: [
        {
          icon: Users,
          title: 'Directorio de Clientes',
          description: 'Registra a tus clientes con nombre o razón social, RFC, teléfono celular y WhatsApp para envíos directos de propuestas.',
        },
        {
          icon: Package,
          title: 'Catálogo de Productos y Servicios',
          description: 'Crea partidas con código SKU, descripción, precio unitario y unidad de medida (pz, servicio, horas, paquete).',
        },
        {
          icon: Lightbulb,
          title: 'Búsqueda Instantánea',
          description: 'Localiza rápidamente cualquier producto o cliente usando la barra de búsqueda en tiempo real.',
        },
      ],
      proTip: 'Al crear una cotización podrás insertar cualquier producto del catálogo con 1 clic sin tener que reescribir descripciones o precios.',
    },
    {
      id: 3,
      badge: 'Paso 3 de 5 • Núcleo del Negocio',
      title: 'Genera tu Primera Cotización en Segundos',
      subtitle: 'Un editor ágil con cálculos matemáticos automáticos, descuentos y seguimiento comercial.',
      image: guideQuoteEditorImg,
      imageAlt: 'Editor interactivo de cotizaciones',
      keyActionLabel: '+ Nueva Cotización Ahora',
      keyActionTab: 'editor',
      highlights: [
        {
          icon: Sparkles,
          title: 'Cálculos Matemáticos Exactos',
          description: 'Multiplica cantidades por precio, aplica descuentos por partida o generales, y calcula subtotales e impuestos en tiempo real.',
        },
        {
          icon: Package,
          title: 'Agregar desde Catálogo o Manual',
          description: 'Usa el botón "Desde Catálogo" para rellenar partidas con un clic, o escribe descripciones libres y agrega fotos a las partidas.',
        },
        {
          icon: Clock,
          title: 'Fecha de Vencimiento y Recordatorios',
          description: 'Asigna una fecha límite de validez y una fecha de seguimiento para recibir alertas automáticas en la campana de notificaciones.',
        },
      ],
      proTip: 'Puedes editar el porcentaje de IVA libremente o marcarlo como 0% exento según el tipo de cliente o servicio prestado.',
    },
    {
      id: 4,
      badge: 'Paso 4 de 5 • Cierre Comercial',
      title: 'Exporta a PDF y Envía por WhatsApp o Correo',
      subtitle: 'Entrega propuestas de alto impacto visual listas para firma de conformidad y aceptación del cliente.',
      image: guideShareExportImg,
      imageAlt: 'Exportación a PDF y compartir por WhatsApp',
      keyActionLabel: 'Ver Historial de Cotizaciones',
      keyActionTab: 'quotes',
      highlights: [
        {
          icon: Download,
          title: 'Descarga en PDF Profesional',
          description: 'Genera un documento PDF vectorial de alta calidad con el logo, paleta de colores, desglose de partidas y espacio para firma.',
        },
        {
          icon: MessageSquare,
          title: 'Envío Directo por WhatsApp',
          description: 'Abre un mensaje formateado con el saludo, monto total y enlace de la propuesta listo para enviar con 1 toque.',
        },
        {
          icon: Mail,
          title: 'Envío por Correo Electrónico',
          description: 'Redacta un email automático con asunto profesional y detalle comercial para enviar desde tu cliente de correo preferido.',
        },
        {
          icon: Printer,
          title: 'Impresión Inmediata',
          description: 'Vista limpia diseñada para impresoras físicas o guardado como documento digital.',
        },
      ],
      proTip: 'Cuando tu cliente acepte la cotización, cambia su estado a "Aceptada": el sistema lo celebrará con confeti y actualizará tus métricas de conversión.',
    },
    {
      id: 5,
      badge: 'Paso 5 de 5 • Seguridad & Organización',
      title: 'Seguimiento, Multiusuario y Cambio de Contraseña',
      subtitle: 'Control total de tu embudo comercial, seguridad de acceso y cuentas aisladas.',
      image: guideDashboardImg,
      imageAlt: 'Seguridad y control de usuarios',
      keyActionLabel: 'Ir al Tablero Principal',
      keyActionTab: 'dashboard',
      highlights: [
        {
          icon: CheckCircle2,
          title: 'Estados de Cotización',
          description: 'Monitorea si una propuesta está en Borrador, Enviada, Aceptada, Rechazada o Vencida para proyectar tus ingresos reales.',
        },
        {
          icon: ShieldCheck,
          title: 'Aislamiento de Información',
          description: 'Cada vendedor cuenta con su propio espacio independiente. Solo los administradores pueden ver todos los usuarios o registrar nuevas cuentas.',
        },
        {
          icon: KeyRound,
          title: 'Cambio de Contraseña Personal',
          description: 'Cualquier usuario puede cambiar su contraseña en cualquier momento haciendo clic en su botón de usuario (arriba a la derecha).',
        },
        {
          icon: Database,
          title: 'Respaldo y Restauración por Rol',
          description: 'El Administrador puede descargar la copia completa del sistema y tiene la Pregunta de Restauración Selectiva (solo Administrador o todos). Los vendedores y comerciales únicamente respaldan y restauran su propia información personal, protegiendo a los demás usuarios.',
        },
      ],
      proTip: 'Revisa tu Tablero de Control frecuentemente y realiza copias de seguridad periódicas desde Configuración > Respaldo.',
    },
  ];

  const currentStepData = steps[activeStep];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      setIsUserGuideOpen(false);
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleAction = (tab?: string) => {
    setIsUserGuideOpen(false);
    if (tab === 'editor') {
      startNewQuote();
    } else if (tab) {
      setActiveTab(tab as any);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsUserGuideOpen(false)}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 sm:px-8 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/80 via-white to-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Guía de Uso Rápida
                </h2>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                  CotizaFácil Pro
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Aprende a crear, personalizar, exportar y dar seguimiento a tus propuestas comerciales
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsUserGuideOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Cerrar guía"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Pills */}
        <div className="px-5 sm:px-8 py-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          {steps.map((s, index) => {
            const isActive = activeStep === index;
            const isCompleted = activeStep > index;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStep(index)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/25'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70 border border-emerald-200/60'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                    isActive
                      ? 'bg-white text-blue-600'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {isCompleted ? <Check className="w-2.5 h-2.5" /> : s.id}
                </span>
                <span className="hidden md:inline">{s.title.split(' ')[0]}</span>
                <span className="md:hidden">Paso {s.id}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Top Step Banner */}
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
              {currentStepData.badge}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              {currentStepData.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {currentStepData.subtitle}
            </p>
          </div>

          {/* Visual Showcase (Screenshot illustration) */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-950 group">
            <img
              src={currentStepData.image}
              alt={currentStepData.imageAlt}
              referrerPolicy="no-referrer"
              className="w-full h-48 sm:h-64 object-cover object-center group-hover:scale-101 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
              <div className="flex items-center justify-between w-full text-white">
                <span className="text-xs font-semibold drop-shadow-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {currentStepData.imageAlt}
                </span>
                <span className="text-[10px] bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full font-mono">
                  CotizaFácil Pro v2.0
                </span>
              </div>
            </div>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {currentStepData.highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900">{h.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{h.description}</p>
                </div>
              );
            })}
          </div>

          {/* Pro Tip Box */}
          <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/70 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 leading-relaxed flex-1">
              <span className="font-bold text-amber-900 block mb-0.5">Consejo para Maximizar Ventas:</span>
              {currentStepData.proTip}
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="px-5 sm:px-8 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrev}
              disabled={activeStep === 0}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeStep === 0
                  ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-200/60'
                  : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>

            <span className="text-xs font-bold text-slate-500 hidden sm:inline">
              Paso {activeStep + 1} de {steps.length}
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={() => handleAction(currentStepData.keyActionTab)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span>{currentStepData.keyActionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            </button>

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm shadow-blue-600/25 transition-all cursor-pointer"
            >
              {activeStep < steps.length - 1 ? (
                <>
                  <span>Siguiente</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Entendido, Empezar!</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
