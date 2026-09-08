import React, { useState } from 'react';
import { Quote } from '../types';
import { QuoteDocument } from './QuoteDocument';
import { exportMultipleQuotesToPDF, printMultipleQuotes } from '../utils/pdfGenerator';
import {
  FileText,
  Printer,
  Download,
  X,
  Check,
  Layers,
  ArrowUpDown,
  MoveUp,
  MoveDown,
  Trash2,
  Calendar,
  User,
  DollarSign,
  AlertCircle
} from 'lucide-react';

interface MultiQuoteExportModalProps {
  quotes: Quote[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveQuote?: (quoteId: string) => void;
}

export const MultiQuoteExportModal: React.FC<MultiQuoteExportModalProps> = ({
  quotes,
  isOpen,
  onClose,
  onRemoveQuote,
}) => {
  const [orderedQuotes, setOrderedQuotes] = useState<Quote[]>(quotes);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [currentProgressInfo, setCurrentProgressInfo] = useState<{ current: number; total: number } | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<string>(quotes[0]?.id || '');

  // Keep orderedQuotes in sync with incoming quotes prop
  React.useEffect(() => {
    setOrderedQuotes(quotes);
    if (!quotes.some((q) => q.id === activePreviewTab) && quotes.length > 0) {
      setActivePreviewTab(quotes[0].id);
    }
  }, [quotes]);

  if (!isOpen || quotes.length === 0) return null;

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newQuotes = [...orderedQuotes];
    const temp = newQuotes[index - 1];
    newQuotes[index - 1] = newQuotes[index];
    newQuotes[index] = temp;
    setOrderedQuotes(newQuotes);
  };

  const moveDown = (index: number) => {
    if (index === orderedQuotes.length - 1) return;
    const newQuotes = [...orderedQuotes];
    const temp = newQuotes[index + 1];
    newQuotes[index + 1] = newQuotes[index];
    newQuotes[index] = temp;
    setOrderedQuotes(newQuotes);
  };

  const handleExportCombinedPDF = async () => {
    setIsExporting(true);
    setExportProgress(10);
    setExportSuccess(false);

    try {
      const success = await exportMultipleQuotesToPDF(
        orderedQuotes,
        (progress, current, total) => {
          setExportProgress(progress);
          if (current !== undefined && total !== undefined) {
            setCurrentProgressInfo({ current, total });
          }
        }
      );

      if (success) {
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Error generating combined PDF:', err);
    } finally {
      setIsExporting(false);
      setCurrentProgressInfo(null);
    }
  };

  const handlePrintAll = () => {
    printMultipleQuotes('multi-quotes-print-container');
  };

  // Aggregated calculations
  const totalAmount = orderedQuotes.reduce((acc, q) => acc + (q.total || 0), 0);
  const totalItemsCount = orderedQuotes.reduce((acc, q) => acc + (q.items?.length || 0), 0);
  const currencySymbol = orderedQuotes[0]?.currencySymbol || '$';
  const currencyCode = orderedQuotes[0]?.currency || 'USD';

  const activeQuote = orderedQuotes.find((q) => q.id === activePreviewTab) || orderedQuotes[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-100 w-full max-w-6xl max-h-[96vh] rounded-3xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col">
        
        {/* Header Bar */}
        <div className="px-5 py-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  Exportar Cotizaciones a PDF Único
                </h3>
                <span className="font-bold text-xs bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {orderedQuotes.length} Documentos Seleccionados
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Se compilarán en un solo archivo PDF descargable o imprimible manteniendo la calidad y formato exactos
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintAll}
              disabled={isExporting}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
              title="Imprimir todo el lote"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Imprimir Lote</span>
            </button>

            <button
              onClick={handleExportCombinedPDF}
              disabled={isExporting}
              className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50 ${
                exportSuccess
                  ? 'bg-emerald-600 shadow-emerald-600/30'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
              }`}
            >
              {exportSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡PDF Combinado Generado!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>
                    {isExporting
                      ? currentProgressInfo
                        ? `Procesando ${currentProgressInfo.current}/${currentProgressInfo.total}...`
                        : 'Generando PDF...'
                      : `Descargar PDF Combinado (${orderedQuotes.length})`}
                  </span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-1"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar (Visible during export) */}
        {isExporting && (
          <div className="bg-blue-50 px-5 py-2.5 border-b border-blue-100 flex items-center justify-between gap-4 text-xs font-semibold text-blue-900">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
              <span>
                Compilando página {currentProgressInfo?.current || 1} de {currentProgressInfo?.total || orderedQuotes.length} en alta resolución...
              </span>
            </div>
            <div className="w-32 bg-blue-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-200"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Main Body: 2 Columns (Left: Selected Quotes Queue & Order, Right: Live Document Preview) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Panel: Selected Documents Queue & Ordering (4 cols) */}
          <div className="lg:col-span-4 bg-white border-r border-slate-200 p-4 flex flex-col justify-between overflow-y-auto space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Orden de Páginas en el PDF
                </span>
                <span className="text-[11px] text-slate-400">
                  Usa las flechas para ordenar
                </span>
              </div>

              {/* Quotes Queue List */}
              <div className="space-y-2 max-h-[48vh] overflow-y-auto pr-1">
                {orderedQuotes.map((q, index) => {
                  const isActive = activePreviewTab === q.id;
                  return (
                    <div
                      key={q.id}
                      onClick={() => setActivePreviewTab(q.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                        isActive
                          ? 'border-blue-500 bg-blue-50/70 shadow-xs ring-1 ring-blue-500/30'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/60 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-xs text-slate-900 truncate">
                              {q.quoteNumber}
                            </span>
                            <span className="text-[10px] text-slate-500 truncate">
                              • {q.items.length} partidas
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-700 truncate">
                            {q.clientSnapshot?.name || 'Sin cliente'}
                          </p>
                          <p className="text-[11px] font-mono font-bold text-blue-700">
                            {q.currencySymbol}{q.total.toFixed(2)} {q.currency}
                          </p>
                        </div>
                      </div>

                      {/* Re-ordering & Remove Controls */}
                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          className="p-1 rounded-lg hover:bg-slate-200 disabled:opacity-30 text-slate-600 transition-colors"
                          title="Mover arriba"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveDown(index)}
                          disabled={index === orderedQuotes.length - 1}
                          className="p-1 rounded-lg hover:bg-slate-200 disabled:opacity-30 text-slate-600 transition-colors"
                          title="Mover abajo"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                        {onRemoveQuote && orderedQuotes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => onRemoveQuote(q.id)}
                            className="p-1 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Quitar de la selección"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Aggregated Totals Box */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Resumen del Lote:</span>
                <span className="font-bold text-white">{orderedQuotes.length} cotizaciones</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Total de Partidas / Conceptos:</span>
                <span className="font-bold text-white">{totalItemsCount}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Suma Total Combinada:</span>
                <span className="font-mono font-black text-emerald-400 text-base">
                  {currencySymbol}{totalAmount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currencyCode}
                </span>
              </div>
            </div>
          </div>

          {/* Right Panel: Live Document Preview (8 cols) */}
          <div className="lg:col-span-8 bg-slate-200/60 p-4 sm:p-6 overflow-y-auto flex flex-col items-center">
            <div className="w-full max-w-2xl mb-3 flex items-center justify-between text-xs text-slate-500">
              <span>
                Vista previa: <strong>{activeQuote?.quoteNumber}</strong> ({activeQuote?.clientSnapshot?.name || 'Cliente'})
              </span>
              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded shadow-2xs border border-slate-200">
                Documento {orderedQuotes.findIndex((q) => q.id === activeQuote?.id) + 1} de {orderedQuotes.length}
              </span>
            </div>

            {/* Document Sheet Card */}
            <div className="w-full max-w-2xl shadow-xl rounded-2xl overflow-hidden bg-white">
              {activeQuote && (
                <QuoteDocument
                  quote={activeQuote}
                  isPrintVersion={true}
                  elementId={`preview-doc-${activeQuote.id}`}
                />
              )}
            </div>
          </div>
        </div>

        {/* Hidden Container with ALL Quotes Rendered for Single-PDF Compilation & Print */}
        <div
          id="multi-quotes-print-container"
          className="fixed left-[-9999px] top-[-9999px] w-[1024px] pointer-events-none opacity-0 overflow-hidden"
          aria-hidden="true"
        >
          {orderedQuotes.map((q, index) => (
            <div
              key={q.id}
              id={`multi-quote-item-${q.id}`}
              className={index > 0 ? 'multi-quote-page-break' : ''}
              style={{
                pageBreakBefore: index > 0 ? 'always' : 'auto',
                breakBefore: index > 0 ? 'page' : 'auto',
                marginBottom: '40px',
                backgroundColor: '#ffffff',
                width: '1024px',
              }}
            >
              <QuoteDocument
                quote={q}
                isPrintVersion={true}
                elementId={`multi-quote-item-${q.id}`}
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
