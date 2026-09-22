import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Quote, QuoteStatus } from '../types';
import { ShareModal } from './ShareModal';
import { PrintModal } from './PrintModal';
import { MultiQuoteExportModal } from './MultiQuoteExportModal';
import {
  Search,
  Filter,
  Plus,
  FileText,
  Share2,
  Copy,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  Calendar,
  DollarSign,
  Download,
  Clock,
  Printer,
  MoreVertical,
  X,
  CheckSquare,
  Square,
  Layers,
  Check
} from 'lucide-react';

export const QuotesListView: React.FC = () => {
  const {
    quotes,
    startNewQuote,
    startEditQuote,
    deleteQuote,
    duplicateQuote,
    updateQuoteStatus,
    toggleFollowUpStatus,
    formatCurrency,
    selectedQuoteForPrint,
    setSelectedQuoteForPrint,
    currentUser,
  } = useApp();

  const canDeleteQuotes = currentUser.role === 'admin' || currentUser.permissions?.canDeleteQuotes !== false;

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedShareQuote, setSelectedShareQuote] = useState<Quote | null>(null);
  const [selectedQuoteIds, setSelectedQuoteIds] = useState<string[]>([]);
  const [isMultiExportOpen, setIsMultiExportOpen] = useState(false);

  // Filter and search
  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
      const term = searchTerm.trim().toLowerCase();
      if (!term) return matchesStatus;
      const matchesSearch =
        q.quoteNumber.toLowerCase().includes(term) ||
        (q.clientSnapshot?.name || '').toLowerCase().includes(term) ||
        (q.clientSnapshot?.company || '').toLowerCase().includes(term) ||
        (q.clientSnapshot?.email || '').toLowerCase().includes(term) ||
        (q.clientSnapshot?.phone || '').toLowerCase().includes(term) ||
        (q.clientSnapshot?.taxId || '').toLowerCase().includes(term) ||
        (q.notes || '').toLowerCase().includes(term) ||
        (q.termsAndConditions || '').toLowerCase().includes(term) ||
        (q.paymentMethods || '').toLowerCase().includes(term) ||
        q.items.some(
          (item) =>
            item.name.toLowerCase().includes(term) ||
            item.code.toLowerCase().includes(term) ||
            (item.description || '').toLowerCase().includes(term)
        );
      return matchesStatus && matchesSearch;
    });
  }, [quotes, statusFilter, searchTerm]);

  // Selected quotes array
  const selectedQuotesList = useMemo(() => {
    return quotes.filter((q) => selectedQuoteIds.includes(q.id));
  }, [quotes, selectedQuoteIds]);

  const isAllFilteredSelected =
    filteredQuotes.length > 0 &&
    filteredQuotes.every((q) => selectedQuoteIds.includes(q.id));

  const isSomeFilteredSelected =
    filteredQuotes.some((q) => selectedQuoteIds.includes(q.id)) && !isAllFilteredSelected;

  const toggleSelectQuote = (id: string) => {
    setSelectedQuoteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllFiltered = () => {
    if (isAllFilteredSelected) {
      // Deselect all filtered quotes
      const filteredIds = new Set(filteredQuotes.map((q) => q.id));
      setSelectedQuoteIds((prev) => prev.filter((id) => !filteredIds.has(id)));
    } else {
      // Select all filtered quotes
      const filteredIds = filteredQuotes.map((q) => q.id);
      setSelectedQuoteIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const handleBatchStatusChange = (newStatus: QuoteStatus) => {
    if (selectedQuoteIds.length === 0) return;
    selectedQuoteIds.forEach((id) => {
      updateQuoteStatus(id, newStatus);
    });
  };

  const handleBatchDelete = () => {
    if (selectedQuoteIds.length === 0) return;
    if (
      window.confirm(
        `¿Estás seguro de eliminar las ${selectedQuoteIds.length} cotizaciones seleccionadas?`
      )
    ) {
      selectedQuoteIds.forEach((id) => {
        deleteQuote(id);
      });
      setSelectedQuoteIds([]);
    }
  };

  // Aggregated total of selected quotes
  const selectedTotalAmount = selectedQuotesList.reduce((acc, q) => acc + (q.total || 0), 0);

  const statusBadges: Record<QuoteStatus, { label: string; bg: string; text: string }> = {
    draft: { label: 'Borrador', bg: 'bg-slate-100', text: 'text-slate-700' },
    sent: { label: 'Enviada', bg: 'bg-blue-100', text: 'text-blue-700' },
    approved: { label: 'Aceptada', bg: 'bg-emerald-100', text: 'text-emerald-700' },
    rejected: { label: 'Rechazada', bg: 'bg-rose-100', text: 'text-rose-700' },
    expired: { label: 'Vencida', bg: 'bg-amber-100', text: 'text-amber-700' },
  };

  const handleDelete = (id: string, number: string) => {
    if (window.confirm(`¿Estás seguro de eliminar la cotización ${number}?`)) {
      deleteQuote(id);
      setSelectedQuoteIds((prev) => prev.filter((item) => item !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-32">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Historial de Cotizaciones
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Consulta, selecciona para exportar en PDF único, imprime, duplica y gestiona tus propuestas comerciales
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedQuoteIds.length > 0 && (
            <button
              onClick={() => setIsMultiExportOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all animate-in fade-in"
            >
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Exportar PDF Combinado ({selectedQuoteIds.length})</span>
            </button>
          )}

          <button
            onClick={() => startNewQuote()}
            className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            + Nueva Cotización
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por folio, cliente, empresa, producto, notas o términos..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
                title="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'draft', label: 'Borradores' },
              { id: 'sent', label: 'Enviadas' },
              { id: 'approved', label: 'Aceptadas' },
              { id: 'expired', label: 'Vencidas' },
              { id: 'rejected', label: 'Rechazadas' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === f.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Count & Reset link if filtered */}
        {(searchTerm || statusFilter !== 'all') && (
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
            <span>
              Mostrando <strong className="text-slate-800">{filteredQuotes.length}</strong> de <strong className="text-slate-800">{quotes.length}</strong> cotizaciones
            </span>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="text-blue-600 font-semibold hover:underline"
            >
              Restablecer filtros
            </button>
          </div>
        )}

        {/* Multi-selection Toolbar / Select All Bar */}
        {filteredQuotes.length > 0 && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleSelectAllFiltered}
                className="flex items-center gap-2 font-semibold text-slate-700 hover:text-blue-600 transition-colors py-1 px-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <div
                  className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all ${
                    isAllFilteredSelected
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : isSomeFilteredSelected
                      ? 'bg-blue-50 border-blue-500 text-blue-600'
                      : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                >
                  {isAllFilteredSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  {isSomeFilteredSelected && <div className="w-2 h-0.5 bg-blue-600 rounded" />}
                </div>
                <span>
                  {isAllFilteredSelected
                    ? `Deseleccionar todas (${filteredQuotes.length})`
                    : `Seleccionar todas (${filteredQuotes.length})`}
                </span>
              </button>

              {selectedQuoteIds.length > 0 && (
                <span className="text-slate-400">•</span>
              )}

              {selectedQuoteIds.length > 0 && (
                <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                  {selectedQuoteIds.length} seleccionada{selectedQuoteIds.length === 1 ? '' : 's'}
                </span>
              )}
            </div>

            {selectedQuoteIds.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMultiExportOpen(true)}
                  className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar PDF Combinado</span>
                </button>
                <button
                  onClick={() => setSelectedQuoteIds([])}
                  className="text-slate-500 hover:text-slate-700 py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Limpiar selección
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quotes Cards / Table List */}
      <div className="space-y-3">
        {filteredQuotes.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              {searchTerm || statusFilter !== 'all' ? (
                <Search className="w-6 h-6" />
              ) : (
                <FileText className="w-6 h-6" />
              )}
            </div>
            <h3 className="font-bold text-slate-800 text-base">
              {searchTerm || statusFilter !== 'all'
                ? 'No se encontraron cotizaciones coincidentes'
                : 'No se encontraron cotizaciones'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'all'
                ? `No hay ninguna cotización que coincida con "${searchTerm || statusFilter}". Intenta con otros términos o restablece los filtros.`
                : 'Comienza creando tu primera propuesta comercial real para tus clientes.'}
            </p>
            {searchTerm || statusFilter !== 'all' ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" /> Restablecer Filtros
              </button>
            ) : (
              <button
                onClick={() => startNewQuote()}
                className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Crear Cotización
              </button>
            )}
          </div>
        ) : (
          filteredQuotes.map((q) => {
            const isSelected = selectedQuoteIds.includes(q.id);
            const badge = statusBadges[q.status] || statusBadges.draft;

            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Left info & Selection Checkbox */}
                <div className="flex items-start gap-3.5">
                  {/* Selection Checkbox */}
                  <div className="pt-2 sm:pt-2.5">
                    <button
                      type="button"
                      onClick={() => toggleSelectQuote(q.id)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                          : 'border-slate-300 bg-white hover:border-slate-400'
                      }`}
                      title={isSelected ? 'Deseleccionar' : 'Seleccionar para exportar'}
                      aria-label={`Seleccionar cotización ${q.quoteNumber}`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex flex-col items-center justify-center font-mono font-bold text-xs shrink-0 border border-blue-100">
                    <FileText className="w-5 h-5 mb-0.5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-900">
                        {q.quoteNumber}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                      {q.followUpDate && !q.followUpCompleted && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Seguimiento: {q.followUpDate}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {q.clientSnapshot?.name || 'Cliente sin nombre'}
                      {q.clientSnapshot?.company && (
                        <span className="text-xs text-slate-500 font-normal ml-1.5">
                          ({q.clientSnapshot.company})
                        </span>
                      )}
                    </h3>

                    <div className="text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1 pt-0.5">
                      <span>Emisión: <strong className="text-slate-700">{q.date}</strong></span>
                      <span>Vigencia: <strong className="text-slate-700">{q.expiryDate}</strong></span>
                      <span>Conceptos: <strong className="text-slate-700">{q.items.length}</strong></span>
                      {q.clientSnapshot?.phone && (
                        <span>Tel: <strong className="text-slate-700">{q.clientSnapshot.phone}</strong></span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Amount & Actions */}
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between md:justify-end gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right pr-2">
                    <div className="font-mono font-black text-slate-900 text-base sm:text-lg">
                      {formatCurrency(q.total, q.currency, q.currencySymbol)}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Subtotal: {q.currencySymbol}{q.subtotal.toFixed(2)}
                      {q.taxEnabled ? ` + IVA (${q.globalTaxRate}%)` : ' (Sin IVA)'}
                    </div>
                  </div>

                  {/* Status Dropdown Quick Changer */}
                  <select
                    value={q.status}
                    onChange={(e) => updateQuoteStatus(q.id, e.target.value as QuoteStatus)}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none"
                    title="Cambiar estado"
                  >
                    <option value="draft">Borrador</option>
                    <option value="sent">Enviada</option>
                    <option value="approved">Aceptada</option>
                    <option value="rejected">Rechazada</option>
                    <option value="expired">Vencida</option>
                  </select>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5">
                    {/* Direct Print Button */}
                    <button
                      onClick={() => setSelectedQuoteForPrint(q)}
                      className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      title="Imprimir cotización"
                    >
                      <Printer className="w-4 h-4" />
                      <span className="hidden sm:inline">Imprimir</span>
                    </button>

                    <button
                      onClick={() => setSelectedShareQuote(q)}
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                      title="Enviar por WhatsApp / Correo"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => duplicateQuote(q.id)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Duplicar cotización"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => startEditQuote(q.id)}
                      className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Editar
                    </button>

                    {canDeleteQuotes && (
                      <button
                        onClick={() => handleDelete(q.id, q.quoteNumber)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Sticky Bottom Floating Multi-Selection Action Bar */}
      {selectedQuoteIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-3xl bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-3xl shadow-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              {selectedQuoteIds.length}
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                {selectedQuoteIds.length} cotización{selectedQuoteIds.length === 1 ? '' : 'es'} seleccionada{selectedQuoteIds.length === 1 ? '' : 's'}
              </p>
              <p className="text-[11px] text-slate-400">
                Suma total: <strong className="text-emerald-400 font-mono">${selectedTotalAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Batch Status Dropdown */}
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleBatchStatusChange(e.target.value as QuoteStatus);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="bg-slate-800 text-slate-200 border border-slate-700 text-xs rounded-xl px-2.5 py-2 font-medium focus:outline-none"
            >
              <option value="" disabled>Cambiar estado...</option>
              <option value="draft">Marcar como Borrador</option>
              <option value="sent">Marcar como Enviada</option>
              <option value="approved">Marcar como Aceptada</option>
              <option value="rejected">Marcar como Rechazada</option>
              <option value="expired">Marcar como Vencida</option>
            </select>

            {/* Main Export Combined PDF Button */}
            <button
              onClick={() => setIsMultiExportOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm shadow-blue-600/40 transition-all hover:scale-102 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Exportar PDF Combinado</span>
            </button>

            {/* Clear Selection */}
            <button
              onClick={() => setSelectedQuoteIds([])}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Deseleccionar todas"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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

      {/* Multi-Quote Single-PDF Export Modal */}
      {isMultiExportOpen && (
        <MultiQuoteExportModal
          quotes={selectedQuotesList}
          isOpen={isMultiExportOpen}
          onClose={() => setIsMultiExportOpen(false)}
          onRemoveQuote={(quoteId) => {
            setSelectedQuoteIds((prev) => prev.filter((id) => id !== quoteId));
          }}
        />
      )}
    </div>
  );
};

