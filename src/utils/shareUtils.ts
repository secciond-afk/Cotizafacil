import { Quote } from '../types';

export const generateWhatsAppMessage = (quote: Quote, customCompany?: string): string => {
  const company = customCompany || quote.branding.companyName || 'Nuestra Empresa';
  const clientName = quote.clientSnapshot?.name || 'Estimado(a) Cliente';
  const formattedTotal = `${quote.currencySymbol}${new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2 }).format(quote.total)} ${quote.currency}`;
  const formattedSubtotal = `${quote.currencySymbol}${new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2 }).format(quote.subtotal)} ${quote.currency}`;
  const formattedTax = quote.taxEnabled
    ? `${quote.currencySymbol}${new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2 }).format(quote.taxAmount)} (IVA ${quote.globalTaxRate}%)`
    : 'No aplica IVA';

  const itemsList = quote.items
    .map(
      (item, i) =>
        `▪️ *${item.name}* (Ref: ${item.code || 'N/A'})\n   ${item.quantity} ${item.unit} x ${quote.currencySymbol}${item.unitPrice.toFixed(2)} = *${quote.currencySymbol}${item.subtotal.toFixed(2)}*`
    )
    .join('\n');

  const text = `👋 *Hola, ${clientName}!*
Le saluda *${company}*.

Le compartimos los detalles de su cotización formal:
📄 *Cotización:* ${quote.quoteNumber}
📅 *Fecha de emisión:* ${quote.date}
⏳ *Válida hasta:* ${quote.expiryDate}

📦 *Detalle de Productos / Servicios:*
${itemsList}

━━━━━━━━━━━━━━━━━━━━
▫️ *Subtotal:* ${formattedSubtotal}
▫️ *IVA:* ${formattedTax}
${quote.discountAmount > 0 ? `▫️ *Descuento:* -${quote.currencySymbol}${quote.discountAmount.toFixed(2)}\n` : ''}💰 *TOTAL:* *${formattedTotal}*
━━━━━━━━━━━━━━━━━━━━

💳 *Términos de Pago y Notas:*
${quote.paymentMethods ? `${quote.paymentMethods}\n` : ''}
${quote.notes ? `📝 *Nota:* ${quote.notes}\n` : ''}
Quedamos a su disposición para cualquier duda o para proceder con su orden. ¡Muchas gracias por su preferencia!`;

  return text;
};

export const sendWhatsApp = (quote: Quote, customPhone?: string, customCompany?: string) => {
  const rawPhone = customPhone || quote.clientSnapshot?.phone || '';
  // Clean phone number (remove spaces, dashes, plus)
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
  const message = generateWhatsAppMessage(quote, customCompany);
  const encodedText = encodeURIComponent(message);

  let url = '';
  if (cleanPhone) {
    url = `https://wa.me/${cleanPhone}?text=${encodedText}`;
  } else {
    url = `https://wa.me/?text=${encodedText}`;
  }

  window.open(url, '_blank');
};

export const generateEmailSubject = (quote: Quote): string => {
  return `Cotización ${quote.quoteNumber} - ${quote.branding.companyName || 'Propuesta Comercial'}`;
};

export const generateEmailBody = (quote: Quote, customCompany?: string): string => {
  const company = customCompany || quote.branding.companyName || 'Nuestra Empresa';
  const clientName = quote.clientSnapshot?.name || 'Estimado(a) Cliente';
  const formattedTotal = `${quote.currencySymbol}${new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2 }).format(quote.total)} ${quote.currency}`;
  const formattedSubtotal = `${quote.currencySymbol}${new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2 }).format(quote.subtotal)} ${quote.currency}`;
  const formattedTax = quote.taxEnabled
    ? `${quote.currencySymbol}${new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2 }).format(quote.taxAmount)} (${quote.globalTaxRate}% IVA)`
    : 'Exento de IVA';

  const itemsSummary = quote.items
    .map(
      (item) =>
        `- [Ref: ${item.code || 'N/A'}] ${item.name} (${item.quantity} ${item.unit}) -> Subtotal: ${quote.currencySymbol}${item.subtotal.toFixed(2)}`
    )
    .join('\n');

  return `Estimado(a) ${clientName},

Por medio del presente le hacemos llegar la cotización formal ${quote.quoteNumber} emitida por ${company}.

RESUMEN DE LA COTIZACIÓN:
----------------------------------------
Número: ${quote.quoteNumber}
Fecha de Emisión: ${quote.date}
Vigencia: ${quote.expiryDate}

DETALLE DE CONCEPTOS:
${itemsSummary}

----------------------------------------
Subtotal: ${formattedSubtotal}
IVA: ${formattedTax}
TOTAL: ${formattedTotal}
----------------------------------------

MÉTODOS DE PAGO Y CONDICIONES:
${quote.paymentMethods || 'A convenir'}

${quote.termsAndConditions ? `TÉRMINOS:\n${quote.termsAndConditions}\n\n` : ''}${quote.notes ? `NOTAS ADICIONALES:\n${quote.notes}\n\n` : ''}Agradecemos la oportunidad de brindarle nuestros servicios. Quedamos atentos a sus comentarios.

Atentamente,
${quote.branding.companyName}
${quote.branding.email ? `Correo: ${quote.branding.email}\n` : ''}${quote.branding.phone ? `Tel: ${quote.branding.phone}\n` : ''}${quote.branding.website ? `Sitio Web: ${quote.branding.website}` : ''}`;
};

export const sendEmail = (quote: Quote, customEmail?: string, customCompany?: string) => {
  const toEmail = customEmail || quote.clientSnapshot?.email || '';
  const subject = encodeURIComponent(generateEmailSubject(quote));
  const body = encodeURIComponent(generateEmailBody(quote, customCompany));

  const mailtoUrl = `mailto:${toEmail}?subject=${subject}&body=${body}`;
  window.location.href = mailtoUrl;
};
