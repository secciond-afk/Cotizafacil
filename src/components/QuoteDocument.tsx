import React from 'react';
import { Quote, QuoteLayoutSettings } from '../types';
import { DEFAULT_LAYOUT_SETTINGS } from '../data/initialData';
import { FileText, Building2, User, Phone, Mail, Globe, MapPin, CheckCircle2 } from 'lucide-react';

interface QuoteDocumentProps {
  quote: Quote;
  elementId?: string;
  isPrintVersion?: boolean;
}

export const QuoteDocument: React.FC<QuoteDocumentProps> = ({
  quote,
  elementId = 'quote-printable-document',
  isPrintVersion = false,
}) => {
  const { branding, clientSnapshot, items } = quote;
  const primaryColor = branding.primaryColor || '#1e40af';
  const accentColor = branding.accentColor || '#0ea5e9';
  
  const layout: QuoteLayoutSettings = {
    ...DEFAULT_LAYOUT_SETTINGS,
    ...(branding.layout || {}),
  };

  // Format numbers
  const formatMoney = (val: number) => {
    return `${quote.currencySymbol || '$'}${new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val)} ${quote.currency || 'USD'}`;
  };

  const statusLabels: Record<string, { label: string; bg: string; text: string }> = {
    draft: { label: 'BORRADOR', bg: 'bg-slate-100', text: 'text-slate-700' },
    sent: { label: 'ENVIADA', bg: 'bg-blue-100', text: 'text-blue-700' },
    approved: { label: 'ACEPTADA', bg: 'bg-emerald-100', text: 'text-emerald-700' },
    rejected: { label: 'RECHAZADA', bg: 'bg-rose-100', text: 'text-rose-700' },
    expired: { label: 'VENCIDA', bg: 'bg-amber-100', text: 'text-amber-700' },
  };

  const currentStatus = statusLabels[quote.status] || statusLabels.draft;

  const fontScaleClass =
    layout.fontSizeScale === 'compact'
      ? 'text-xs'
      : layout.fontSizeScale === 'comfortable'
      ? 'text-[15px]'
      : 'text-sm';

  const tableRowPaddingClass =
    layout.tableRowPadding === 'compact'
      ? 'py-2 px-2.5'
      : layout.tableRowPadding === 'spacious'
      ? 'py-4.5 px-4'
      : 'py-3.5 px-3';

  return (
    <div
      id={elementId}
      className={`bg-white text-slate-800 font-sans relative transition-all ${fontScaleClass} ${
        isPrintVersion
          ? 'w-full print:p-0 print:m-0 print:shadow-none print:border-none'
          : 'w-full max-w-[850px] mx-auto shadow-lg rounded-xl border border-slate-200 print:shadow-none print:border-none print:p-0'
      }`}
      style={{
        boxSizing: 'border-box',
        padding: `${layout.pagePadding}px`,
      }}
    >
      {/* Optional Watermark */}
      {branding.showWatermark && branding.watermarkText && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden select-none"
          style={{ opacity: 0.04 }}
        >
          <span className="text-7xl md:text-8xl font-black uppercase tracking-widest rotate-[-35deg] text-slate-900">
            {branding.watermarkText}
          </span>
        </div>
      )}

      {/* Top Accent Bar */}
      {layout.showAccentBar && (
        <div
          className="h-2.5 w-full rounded-t-lg mb-5 print:rounded-none"
          style={{
            margin: `-${layout.pagePadding}px -${layout.pagePadding}px 20px -${layout.pagePadding}px`,
            width: `calc(100% + ${layout.pagePadding * 2}px)`,
            background: `linear-gradient(90deg, ${primaryColor} 0%, ${accentColor} 100%)`,
          }}
        />
      )}

      {/* Document Header Segment */}
      <div
        data-avoid-break="true"
        className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-5 border-b border-slate-200 relative z-10 break-inside-avoid"
        style={{
          marginBottom: `${layout.headerMarginBottom}px`,
        }}
      >
        {/* Company Identity */}
        <div
          className={`flex-1 space-y-2 flex flex-col ${
            layout.logoAlignment === 'center'
              ? 'items-center text-center'
              : layout.logoAlignment === 'right'
              ? 'items-end text-right'
              : 'items-start text-left'
          }`}
        >
          {branding.logoUrl ? (
            <div
              className={`mb-2 flex items-center ${
                layout.logoAlignment === 'center'
                  ? 'justify-center'
                  : layout.logoAlignment === 'right'
                  ? 'justify-end'
                  : 'justify-start'
              }`}
              style={{
                height: `${layout.logoHeight}px`,
                maxHeight: `${layout.logoHeight}px`,
              }}
            >
              <img
                src={branding.logoUrl}
                alt={branding.companyName}
                style={{
                  height: `${layout.logoHeight}px`,
                  maxHeight: `${layout.logoHeight}px`,
                }}
                className="max-w-[260px] object-contain"
                crossOrigin="anonymous"
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm"
                style={{ backgroundColor: primaryColor }}
              >
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
                  {branding.companyName || 'Empresa Emisora'}
                </h1>
                {branding.legalName && branding.legalName !== branding.companyName && (
                  <p className="text-xs text-slate-500">{branding.legalName}</p>
                )}
              </div>
            </div>
          )}

          {branding.logoUrl && (
            <h1 className="text-lg font-bold text-slate-900">{branding.companyName}</h1>
          )}

          <div className="text-xs text-slate-600 space-y-1">
            {branding.taxId && (
              <p>
                <span className="font-semibold text-slate-700">RFC / Tax ID:</span> {branding.taxId}
              </p>
            )}
            {branding.address && (
              <p className="flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0" />
                <span>{branding.address}</span>
              </p>
            )}
            <div
              className={`flex flex-wrap gap-x-4 gap-y-1 pt-0.5 ${
                layout.logoAlignment === 'center'
                  ? 'justify-center'
                  : layout.logoAlignment === 'right'
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              {branding.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" /> {branding.phone}
                </span>
              )}
              {branding.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" /> {branding.email}
                </span>
              )}
              {branding.website && (
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-slate-400" /> {branding.website}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quote Metadata Block */}
        <div className="w-full md:w-64 bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-3 print:bg-slate-50 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
              COTIZACIÓN
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${currentStatus.bg} ${currentStatus.text}`}>
              {currentStatus.label}
            </span>
          </div>

          <div
            className="text-base font-mono font-bold text-slate-900 tracking-tight"
            style={{ fontSize: '16px' }}
          >
            {quote.quoteNumber}
          </div>

          <div className="text-xs space-y-1.5 pt-1 border-t border-slate-200 text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Fecha de Emisión:</span>
              <span className="font-semibold text-slate-800">{quote.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Válida Hasta:</span>
              <span className="font-semibold text-slate-800">{quote.expiryDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Moneda:</span>
              <span className="font-semibold text-slate-800">{quote.currency} ({quote.currencySymbol})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Client Information Section */}
      <div
        data-avoid-break="true"
        className="border-b border-slate-200 relative z-10 break-inside-avoid pb-4"
        style={{
          marginBottom: `${layout.clientMarginBottom}px`,
        }}
      >
        <div className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2.5 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" style={{ color: primaryColor }} />
          <span>DATOS DEL CLIENTE / RECEPTOR</span>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border print:bg-slate-50 ${
            layout.clientBoxStyle === 'minimal'
              ? 'bg-transparent border-transparent px-0'
              : layout.clientBoxStyle === 'bordered'
              ? 'bg-white border-slate-200 shadow-xs'
              : 'bg-slate-50/80 border-slate-200/80'
          }`}
          style={{
            padding: `${layout.clientPadding}px`,
          }}
        >
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {clientSnapshot?.name || 'Cliente sin asignar'}
            </h3>
            {clientSnapshot?.company && (
              <p className="text-sm font-medium text-slate-700">{clientSnapshot.company}</p>
            )}
            {clientSnapshot?.taxId && (
              <p className="text-xs text-slate-600 mt-1">
                <span className="font-medium text-slate-500">RFC / Tax ID / NIT:</span> {clientSnapshot.taxId}
              </p>
            )}
          </div>

          <div className="text-xs text-slate-600 space-y-1 md:text-right">
            {clientSnapshot?.phone && (
              <p className="flex items-center md:justify-end gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium">{clientSnapshot.phone}</span>
              </p>
            )}
            {clientSnapshot?.email && (
              <p className="flex items-center md:justify-end gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{clientSnapshot.email}</span>
              </p>
            )}
            {clientSnapshot?.address && (
              <p className="flex items-center md:justify-end gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{clientSnapshot.address}{clientSnapshot.city ? `, ${clientSnapshot.city}` : ''}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div
        className="relative z-10"
        style={{
          marginBottom: `${layout.tableMarginBottom}px`,
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className="text-xs uppercase font-bold text-white tracking-wider rounded-lg overflow-hidden"
                style={{ backgroundColor: primaryColor }}
              >
                <th className={`${tableRowPaddingClass} rounded-l-lg w-10 text-center`}>#</th>
                <th className={`${tableRowPaddingClass} w-28`}>Ref / Código</th>
                <th className={`${tableRowPaddingClass} px-4`}>Concepto / Descripción</th>
                <th className={`${tableRowPaddingClass} text-center w-14`}>Cant.</th>
                <th className={`${tableRowPaddingClass} text-center w-14`}>Unidad</th>
                <th className={`${tableRowPaddingClass} text-right w-28`}>P. Unitario</th>
                <th className={`${tableRowPaddingClass} rounded-r-lg text-right w-28`}>Importe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                    No se han añadido conceptos a esta cotización.
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    className={`hover:bg-slate-50/80 transition-colors break-inside-avoid ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                    }`}
                  >
                    <td className={`${tableRowPaddingClass} text-center text-slate-400 font-mono`}>
                      {idx + 1}
                    </td>
                    <td className={`${tableRowPaddingClass} font-mono font-medium text-slate-700`}>
                      {item.code || '-'}
                    </td>
                    <td className={`${tableRowPaddingClass} px-4`}>
                      <div className="font-bold text-slate-900 text-sm">
                        {item.name}
                      </div>
                      {item.description && (
                        <div
                          className={`text-slate-600 mt-1 leading-relaxed whitespace-pre-line ${
                            layout.descriptionFontSize === 'sm' ? 'text-[13px]' : 'text-xs'
                          }`}
                        >
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className={`${tableRowPaddingClass} text-center font-semibold text-slate-800`}>
                      {item.quantity}
                    </td>
                    <td className={`${tableRowPaddingClass} text-center text-slate-500`}>
                      {item.unit || 'pza'}
                    </td>
                    <td className={`${tableRowPaddingClass} text-right font-mono text-slate-700`}>
                      {quote.currencySymbol}{item.unitPrice.toFixed(2)}
                    </td>
                    <td className={`${tableRowPaddingClass} text-right font-mono font-bold text-slate-900`}>
                      {quote.currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Totals Breakdown Section */}
        <div
          data-avoid-break="true"
          className="flex flex-col md:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-200 break-inside-avoid"
          style={{
            marginTop: `${layout.totalsMarginTop}px`,
          }}
        >
          {/* Notes & Bank Details on Left */}
          <div className="flex-1 space-y-3 text-xs w-full">
            {quote.paymentMethods && (
              <div
                className="bg-slate-50 rounded-xl border border-slate-200/70"
                style={{
                  padding: `${layout.totalsBoxPadding}px`,
                  marginBottom: `${layout.notesMarginBottom}px`,
                }}
              >
                <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                  Instrucciones de Pago / Datos Bancarios
                </h4>
                <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                  {quote.paymentMethods}
                </p>
              </div>
            )}

            {quote.notes && (
              <div
                className="bg-amber-50/50 rounded-xl border border-amber-200/50"
                style={{
                  padding: `${layout.totalsBoxPadding}px`,
                }}
              >
                <h4 className="font-bold text-amber-900 mb-1">Notas Adicionales</h4>
                <p className="text-amber-800 whitespace-pre-line leading-relaxed">
                  {quote.notes}
                </p>
              </div>
            )}
          </div>

          {/* Financial Calculation Box on Right */}
          <div
            className="bg-slate-50/80 rounded-xl border border-slate-200 space-y-2.5 text-xs shrink-0 print:bg-slate-50"
            style={{
              width: `${layout.totalsBoxWidth}px`,
              maxWidth: '100%',
              padding: `${layout.totalsBoxPadding}px`,
            }}
          >
            <div className="flex justify-between text-slate-600">
              <span className="font-medium">Subtotal:</span>
              <span className="font-mono font-semibold text-slate-800">
                {formatMoney(quote.subtotal)}
              </span>
            </div>

            {quote.discountAmount > 0 && (
              <div className="flex justify-between text-amber-700">
                <span className="font-medium">
                  Descuento ({quote.discountPercent}%):
                </span>
                <span className="font-mono font-semibold">
                  -{formatMoney(quote.discountAmount)}
                </span>
              </div>
            )}

            {quote.taxEnabled ? (
              <div className="flex justify-between text-slate-700">
                <span className="font-medium">
                  IVA ({quote.globalTaxRate}%):
                </span>
                <span className="font-mono font-semibold text-slate-900">
                  +{formatMoney(quote.taxAmount)}
                </span>
              </div>
            ) : (
              <div className="flex justify-between text-slate-500 italic">
                <span>Impuestos:</span>
                <span>Exento de IVA</span>
              </div>
            )}

            <div
              className="pt-3 border-t-2 flex justify-between items-baseline"
              style={{ borderColor: primaryColor }}
            >
              <span className="text-sm font-extrabold text-slate-900">TOTAL:</span>
              <div className="text-right">
                <span
                  className="text-lg font-black font-mono tracking-tight"
                  style={{ color: primaryColor }}
                >
                  {formatMoney(quote.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Section */}
      {quote.termsAndConditions && (
        <div
          data-avoid-break="true"
          className="border-t border-slate-200 relative z-10 break-inside-avoid"
          style={{
            marginTop: `${layout.termsMarginTop}px`,
            marginBottom: `${layout.termsMarginBottom}px`,
            paddingTop: '12px',
          }}
        >
          <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
            Términos y Condiciones Comerciales
          </h4>
          <p
            className={`whitespace-pre-line leading-relaxed text-slate-600 ${
              layout.termsFontSize === 'sm' ? 'text-xs' : 'text-[11px]'
            }`}
          >
            {quote.termsAndConditions}
          </p>
        </div>
      )}

      {/* Signature & Closing Area */}
      {branding.showSignatureArea && (
        <div
          data-avoid-break="true"
          className="border-t border-slate-200 relative z-10 break-inside-avoid"
          style={{
            marginTop: `${layout.signatureMarginTop}px`,
            paddingTop: '16px',
          }}
        >
          <div
            className={`grid gap-8 items-end ${
              layout.signatureLayout === 'centered'
                ? 'grid-cols-1 md:grid-cols-2 max-w-lg mx-auto'
                : layout.signatureLayout === 'single'
                ? 'grid-cols-1'
                : 'grid-cols-1 md:grid-cols-2'
            }`}
          >
            {/* Company Representative Signature */}
            <div className="text-center md:text-left space-y-2">
              {branding.signatureImage ? (
                <div
                  className="flex items-end justify-center md:justify-start"
                  style={{ height: `${layout.signatureHeight}px` }}
                >
                  <img
                    src={branding.signatureImage}
                    alt="Firma"
                    style={{
                      maxHeight: `${layout.signatureHeight}px`,
                    }}
                    className="object-contain"
                    crossOrigin="anonymous"
                  />
                </div>
              ) : (
                <div
                  className="flex items-end justify-center md:justify-start"
                  style={{ height: `${layout.signatureHeight}px` }}
                >
                  <div
                    style={{ width: `${layout.signatureLineWidth}px` }}
                    className="border-b border-dashed border-slate-400"
                  />
                </div>
              )}
              <div
                className="pt-1 border-t border-slate-300"
                style={{ width: `${layout.signatureLineWidth}px` }}
              >
                <p className="font-bold text-slate-800 text-xs whitespace-pre-line">
                  {branding.signatureTitle || 'Firma Autorizada'}
                </p>
                <p className="text-[10px] text-slate-500">{branding.companyName}</p>
              </div>
            </div>

            {/* Client Acceptance Line */}
            {layout.signatureLayout !== 'single' && (
              <div className="text-center md:text-right space-y-2">
                <div
                  className="flex items-end justify-center md:justify-end"
                  style={{ height: `${layout.signatureHeight}px` }}
                >
                  <div
                    style={{ width: `${layout.signatureLineWidth}px` }}
                    className="border-b border-dashed border-slate-400"
                  />
                </div>
                <div
                  className="pt-1 border-t border-slate-300 ml-auto"
                  style={{ width: `${layout.signatureLineWidth}px` }}
                >
                  <p className="font-bold text-slate-800 text-xs">
                    Aceptación del Cliente
                  </p>
                  <p className="text-[10px] text-slate-500">Nombre, Firma y Fecha</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Document Footer Note */}
      {layout.showFooterId && (
        <div
          data-avoid-break="true"
          className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 gap-2 break-inside-avoid"
          style={{
            marginTop: `${layout.footerMarginTop}px`,
          }}
        >
          <span>Cotización generada con CotizaFácil Pro</span>
          <span>ID: {quote.id}</span>
        </div>
      )}
    </div>
  );
};

