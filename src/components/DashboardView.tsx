import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Quote, QuoteStatus } from '../types';
import { ShareModal } from './ShareModal';
import { PrintModal } from './PrintModal';
import { exportQuoteToPDF } from '../utils/pdfGenerator';
import {
  TrendingUp,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
  Download,
  Share2,
  Printer,
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  Check,
  ChevronRight,
  ExternalLink,
  Users,
  Package,
  Layers,
  UserCheck,
  BookOpen
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    quotes,
    clients,
    products,
    currentUser,
    startNewQuote,
    startEditQuote,
    updateQuoteStatus,
    toggleFollowUpStatus,
    setActiveTab,
    formatCurrency,
    settings,
    selectedQuoteForPrint,
    setSelectedQuoteForPrint,
    openUserGuide,
  } = useApp();

  const [selectedShareQuote, setSelectedShareQuote] = useState<Quote | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Metrics calculation
  const totalQuotes = quotes.length;
  const totalAmountQuoted = quotes.reduce((acc, q) => acc + q.total, 0);

  const approvedQuotes = quotes.filter((q) => q.status === 'approved');
  const approvedAmount = approvedQuotes.reduce((acc, q) => acc + q.total, 0);
  const conversionRate = totalQuotes > 0 ? Math.round((approvedQuotes.length / totalQuotes) * 100) : 0;

  const sentQuotes = quotes.filter((q) => q.status === 'sent');
  const draftQuotes = quotes.filter((q) => q.status === 'draft');

  // Follow-ups
  const todayStr = new Date().toISOString().split('T')[0];
  const pendingFollowUps = quotes.filter(
    (q) => q.followUpDate && !q.followUpCompleted && q.status !== 'approved' && q.status !== 'rejected'
  );

  const urgentFollowUps = pendingFollowUps.filter((q) => q.followUpDate! <= todayStr);

  const statusBadges: Record<QuoteStatus, { label: string; bg: string; text: string }> = {
    draft: { label: 'Borrador', bg: 'bg-slate-100', text: 'text-slate-700' },
    sent: { label: 'Enviada', bg: 'bg-blue-100', text: 'text-blue-700' },
    approved: { label: 'Aceptada', bg: 'bg-emerald-100', text: 'text-emerald-700' },
    rejected: { label: 'Rechazada', bg: 'bg-rose-100', text: 'text-rose-700' },
    expired: { label: 'Vencida', bg: 'bg-amber-100', text: 'text-amber-700' },
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pb-24">
      {/* Welcome Banner & Main Quick Action */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {settings.companyName || 'CotizaFácil Pro'}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-400/20">
              <UserCheck className="w-3.5 h-3.5" />
              Usuario: <strong className="text-white">{currentUser.name}</strong>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Tablero de Control Comercial
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Genera cotizaciones profesionales en segundos, personaliza gráficos y textos, exporta a PDF detallado con IVA editable, imprime al instante y gestiona seguimiento por WhatsApp y Correo.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 sm:gap-3 relative z-10 w-full md:w-auto">
          <button
            onClick={openUserGuide}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm flex items-center justify-center gap-2 border border-white/20 backdrop-blur-sm transition-all hover:scale-102 cursor-pointer"
            title="Ver guía paso a paso con imágenes"
          >
            <BookOpen className="w-5 h-5 text-blue-300" />
            Guía de Uso
          </button>

          <button
            onClick={() => startNewQuote()}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-102 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            + Nueva Cotización
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Cotizado */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Cotizado
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black font-mono text-slate-900">
              {formatCurrency(totalAmountQuoted)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {totalQuotes} cotizaciones de {currentUser.name.split(' ')[0]}
            </p>
          </div>
        </div>

        {/* Card 2: Cotizaciones Aceptadas */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Cotizaciones Aprobadas
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black font-mono text-emerald-600">
              {formatCurrency(approvedAmount)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                {conversionRate}% éxito
              </span>
              <span className="text-xs text-slate-500">
                ({approvedQuotes.length} ganadas)
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: En Seguimiento Pendiente */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Recordatorios Activos
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black font-mono text-amber-600">
              {pendingFollowUps.length}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {urgentFollowUps.length > 0 ? (
                <span className="text-rose-600 font-bold">
                  {urgentFollowUps.length} pendientes para hoy o vencidos
                </span>
              ) : (
                'Sin retrasos de seguimiento'
              )}
            </p>
          </div>
        </div>

        {/* Card 4: Catálogos Integrados */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Base de Datos
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <div>
              <span className="text-2xl font-black font-mono text-slate-900">{clients.length}</span>
              <span className="text-xs text-slate-500 ml-1">clientes</span>
            </div>
            <span className="text-slate-300">•</span>
            <div>
              <span className="text-2xl font-black font-mono text-slate-900">{products.length}</span>
              <span className="text-xs text-slate-500 ml-1">productos</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">Espacio privado del usuario</p>
        </div>
      </div>

      {/* Urgent Follow-Up Action Banner */}
      {urgentFollowUps.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-amber-500/10 border-2 border-amber-300/80 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-amber-950 text-base">
                Recordatorios de Seguimiento Pendientes ({urgentFollowUps.length})
              </h3>
              <p className="text-xs text-amber-800">
                Contacta a los clientes hoy para impulsar el cierre de estas propuestas comerciales.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {urgentFollowUps.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-xs flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-slate-800">
                      {q.quoteNumber}
                    </span>
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      Fecha: {q.followUpDate} {q.followUpTime || ''}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mt-1">
                    {q.clientSnapshot?.name} {q.clientSnapshot?.company ? `(${q.clientSnapshot.company})` : ''}
                  </h4>
                  <div className="text-xs text-slate-600 font-mono font-bold mt-0.5">
                    Total: {formatCurrency(q.total, q.currency, q.currencySymbol)}
                  </div>
                  {q.followUpNotes && (
                    <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg italic">
                      "{q.followUpNotes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setSelectedShareQuote(q)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="Enviar WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      WhatsApp
                    </button>
                    <button
                      onClick={() => setSelectedQuoteForPrint(q)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1 transition-colors"
                      title="Imprimir"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Imprimir
                    </button>
                    <button
                      onClick={() => startEditQuote(q.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      Abrir
                    </button>
                  </div>

                  <button
                    onClick={() => toggleFollowUpStatus(q.id)}
                    className="px-3 py-1.5 rounded-xl border border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Hecho
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual Pipeline / Status Distribution Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Distribución y Estado del Historial
            </h3>
            <p className="text-xs text-slate-500">
              Pipeline de cotizaciones en tiempo real
            </p>
          </div>
          <button
            onClick={() => setActiveTab('quotes')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Ver Historial Completo <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${(approvedQuotes.length / (totalQuotes || 1)) * 100}%` }}
            className="bg-emerald-500 transition-all duration-500"
            title={`Aceptadas: ${approvedQuotes.length}`}
          />
          <div
            style={{ width: `${(sentQuotes.length / (totalQuotes || 1)) * 100}%` }}
            className="bg-blue-500 transition-all duration-500"
            title={`Enviadas: ${sentQuotes.length}`}
          />
          <div
            style={{ width: `${(draftQuotes.length / (totalQuotes || 1)) * 100}%` }}
            className="bg-slate-400 transition-all duration-500"
            title={`Borradores: ${draftQuotes.length}`}
          />
          <div
            style={{
              width: `${
                (quotes.filter((q) => q.status === 'expired' || q.status === 'rejected').length /
                  (totalQuotes || 1)) *
                100
              }%`,
            }}
            className="bg-rose-400 transition-all duration-500"
            title="Vencidas o Rechazadas"
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 pt-1 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-700">Aceptadas: {approvedQuotes.length}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="font-semibold text-slate-700">Enviadas: {sentQuotes.length}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-400" />
            <span className="font-semibold text-slate-700">Borradores: {draftQuotes.length}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-400" />
            <span className="font-semibold text-slate-700">
              Otras: {quotes.filter((q) => q.status === 'expired' || q.status === 'rejected').length}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Quotes Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Cotizaciones Recientes</h3>
            <p className="text-xs text-slate-500">Últimas propuestas registradas en tu cuenta</p>
          </div>
          {quotes.length > 0 && (
            <button
              onClick={() => setActiveTab('quotes')}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
            >
              Ver todas ({quotes.length})
            </button>
          )}
        </div>

        {/* List or Empty State */}
        {quotes.length === 0 ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">No tienes cotizaciones registradas aún</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Comienza a cotizar a tus clientes con cálculos de IVA personalizables, plantillas profesionales y exportación a PDF o impresión.
            </p>
            <button
              onClick={() => startNewQuote()}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Crear Mi Primera Cotización
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {quotes.slice(0, 5).map((q) => {
              const badge = statusBadges[q.status] || statusBadges.draft;
              return (
                <div
                  key={q.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 -mx-2 px-2 rounded-2xl transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                      {q.quoteNumber.split('-').pop() || 'COT'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900">
                          {q.quoteNumber}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </div>
                      <div className="font-bold text-slate-800 text-sm mt-0.5">
                        {q.clientSnapshot?.name || 'Cliente'}
                      </div>
                      <div className="text-xs text-slate-500 flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                        <span>Emisión: {q.date}</span>
                        <span>Vigencia: {q.expiryDate}</span>
                        <span>{q.items.length} conceptos</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <div className="font-mono font-black text-slate-900 text-sm md:text-base">
                        {formatCurrency(q.total, q.currency, q.currencySymbol)}
                      </div>
                      {q.taxEnabled && (
                        <span className="text-[11px] text-slate-400">
                          IVA incl. ({q.globalTaxRate}%)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Print Button */}
                      <button
                        onClick={() => setSelectedQuoteForPrint(q)}
                        className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1 transition-colors"
                        title="Imprimir cotización"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">Imprimir</span>
                      </button>

                      <button
                        onClick={() => setSelectedShareQuote(q)}
                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                        title="Enviar por WhatsApp / Email"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => startEditQuote(q.id)}
                        className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {selectedShareQuote && (
        <ShareModal
          quote={selectedShareQuote}
          isOpen={!!selectedShareQuote}
          onClose={() => setSelectedShareQuote(null)}
        />
      )}

      {/* Print Modal */}
      {selectedQuoteForPrint && (
        <PrintModal
          quote={selectedQuoteForPrint}
          isOpen={!!selectedQuoteForPrint}
          onClose={() => setSelectedQuoteForPrint(null)}
        />
      )}
    </div>
  );
};

