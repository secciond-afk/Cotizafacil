import React, { useState } from 'react';
import { Quote } from '../types';
import { QuoteDocument } from './QuoteDocument';
import { exportQuoteToPDF, printQuoteDocument } from '../utils/pdfGenerator';
import { Printer, Download, X, Check, FileText } from 'lucide-react';

interface PrintModalProps {
  quote: Quote | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintModal: React.FC<PrintModalProps> = ({ quote, isOpen, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen || !quote) return null;

  const handlePrint = () => {
    printQuoteDocument();
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportQuoteToPDF('quote-printable-document', quote);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (e) {
      console.error('Error generating PDF:', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-100 w-full max-w-4xl max-h-[95vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Modal Top Action Bar */}
        <div className="no-print px-5 py-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base">
                  Imprimir Cotización
                </h3>
                <span className="font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                  {quote.quoteNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Cliente: <strong className="text-slate-700">{quote.clientSnapshot?.name || 'Cliente'}</strong> • Listo para impresora o PDF
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {exportSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>¡PDF Guardado!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-slate-600" />
                  <span>{isExporting ? 'Generando...' : 'Descargar PDF'}</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm shadow-blue-600/30 transition-all hover:scale-102"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Ahora</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-1"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center bg-slate-200/60">
          <div className="w-full max-w-3xl shadow-xl rounded-2xl overflow-hidden bg-white">
            <QuoteDocument
              quote={quote}
              isPrintVersion={true}
              elementId="quote-printable-document"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
