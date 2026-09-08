import React, { useState } from 'react';
import { Quote } from '../types';
import { generateWhatsAppMessage, sendWhatsApp, generateEmailBody, generateEmailSubject, sendEmail } from '../utils/shareUtils';
import { MessageSquare, Mail, Copy, Check, ExternalLink, X, Send, Phone } from 'lucide-react';

interface ShareModalProps {
  quote: Quote;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ quote, isOpen, onClose }) => {
  const [activeChannel, setActiveChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [customPhone, setCustomPhone] = useState(quote.clientSnapshot?.phone || '');
  const [customEmail, setCustomEmail] = useState(quote.clientSnapshot?.email || '');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const waMessage = generateWhatsAppMessage(quote);
  const emailBody = generateEmailBody(quote);
  const emailSubject = generateEmailSubject(quote);

  const handleCopyText = () => {
    const textToCopy = activeChannel === 'whatsapp' ? waMessage : emailBody;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsApp = () => {
    sendWhatsApp(quote, customPhone);
  };

  const handleSendEmail = () => {
    sendEmail(quote, customEmail);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Enviar Cotización</h3>
              <p className="text-xs text-slate-500">{quote.quoteNumber} • {quote.clientSnapshot?.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Switcher */}
        <div className="p-4 border-b border-slate-100 flex gap-2">
          <button
            onClick={() => setActiveChannel('whatsapp')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs md:text-sm flex items-center justify-center gap-2 transition-all ${
              activeChannel === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            WhatsApp
          </button>
          <button
            onClick={() => setActiveChannel('email')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs md:text-sm flex items-center justify-center gap-2 transition-all ${
              activeChannel === 'email'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
            }`}
          >
            <Mail className="w-4 h-4" />
            Correo Electrónico
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs md:text-sm">
          {activeChannel === 'whatsapp' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Número de Teléfono / WhatsApp del Cliente:
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    placeholder="+52 55 1234 5678"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Incluye código de país (ej. +52 para México, +57 para Colombia, +1 para EE.UU.).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Vista Previa del Mensaje:
                </label>
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5 text-xs text-slate-700 font-sans whitespace-pre-line leading-relaxed max-h-52 overflow-y-auto border-l-4 border-l-emerald-500">
                  {waMessage}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Correo Electrónico del Destinatario:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="cliente@empresa.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Asunto:</label>
                <input
                  type="text"
                  readOnly
                  value={emailSubject}
                  className="w-full px-3 py-1.5 bg-slate-100/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Cuerpo del Correo:
                </label>
                <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-3.5 text-xs text-slate-700 font-mono whitespace-pre-line leading-relaxed max-h-44 overflow-y-auto border-l-4 border-l-blue-500">
                  {emailBody}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={handleCopyText}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            {copied ? '¡Copiado!' : 'Copiar Texto'}
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-200/60 transition-colors"
            >
              Cancelar
            </button>
            {activeChannel === 'whatsapp' ? (
              <button
                onClick={handleSendWhatsApp}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-600/30 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Abrir WhatsApp
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </button>
            ) : (
              <button
                onClick={handleSendEmail}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-blue-600/30 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Abrir Correo
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
