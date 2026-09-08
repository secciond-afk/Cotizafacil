import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { Quote } from '../types';

/**
 * Converts OKLab color strings to standard rgb/rgba strings compatible with html2canvas
 */
export function oklabToRgb(lStr: string, aStr: string, bStr: string, alphaStr?: string): string {
  let L = parseFloat(lStr);
  if (lStr.includes('%')) L = L / 100;
  if (isNaN(L)) L = 0;

  let a = parseFloat(aStr);
  if (aStr.includes('%')) a = (a / 100) * 0.4;
  if (isNaN(a)) a = 0;

  let b = parseFloat(bStr);
  if (bStr.includes('%')) b = (b / 100) * 0.4;
  if (isNaN(b)) b = 0;

  let alpha = 1;
  if (alphaStr !== undefined && alphaStr.trim() !== '') {
    alpha = parseFloat(alphaStr);
    if (alphaStr.includes('%')) alpha = alpha / 100;
    if (isNaN(alpha)) alpha = 1;
  }

  // OKLab -> Linear sRGB
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const rLinear = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLinear = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLinear = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  const toSrgb = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    return clamped <= 0.0031308
      ? 12.92 * clamped
      : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  };

  const r = Math.round(toSrgb(rLinear) * 255);
  const g = Math.round(toSrgb(gLinear) * 255);
  const bVal = Math.round(toSrgb(bLinear) * 255);

  if (alpha < 1) {
    return `rgba(${r}, ${g}, ${bVal}, ${Math.max(0, Math.min(1, alpha)).toFixed(3)})`;
  }
  return `rgb(${r}, ${g}, ${bVal})`;
}

/**
 * Converts OKLCH color strings to standard rgb/rgba strings compatible with html2canvas
 */
export function oklchToRgb(lStr: string, cStr: string, hStr: string, aStr?: string): string {
  let L = parseFloat(lStr);
  if (lStr.includes('%')) L = L / 100;
  if (isNaN(L)) L = 0;

  let C = parseFloat(cStr);
  if (cStr.includes('%')) C = (C / 100) * 0.4;
  if (isNaN(C)) C = 0;

  let H = parseFloat(hStr);
  if (hStr.includes('rad')) H = (H * 180) / Math.PI;
  else if (hStr.includes('turn')) H = H * 360;
  if (isNaN(H)) H = 0;

  let alpha = 1;
  if (aStr !== undefined && aStr.trim() !== '') {
    alpha = parseFloat(aStr);
    if (aStr.includes('%')) alpha = alpha / 100;
    if (isNaN(alpha)) alpha = 1;
  }

  // OKLCH -> OKLab
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  return oklabToRgb(`${L}`, `${a}`, `${b}`, `${alpha}`);
}

/**
 * Converts CIE Lab to standard rgb/rgba
 */
export function labToRgb(lStr: string, aStr: string, bStr: string, alphaStr?: string): string {
  let L = parseFloat(lStr);
  if (isNaN(L)) L = 0;
  let a = parseFloat(aStr);
  if (isNaN(a)) a = 0;
  let b = parseFloat(bStr);
  if (isNaN(b)) b = 0;

  let alpha = 1;
  if (alphaStr !== undefined && alphaStr.trim() !== '') {
    alpha = parseFloat(alphaStr);
    if (alphaStr.includes('%')) alpha = alpha / 100;
    if (isNaN(alpha)) alpha = 1;
  }

  const y = (L + 16) / 116;
  const x = a / 500 + y;
  const z = y - b / 200;

  const x3 = x * x * x;
  const y3 = y * y * y;
  const z3 = z * z * z;

  const xNorm = (x3 > 0.008856 ? x3 : (x - 16 / 116) / 7.787) * 0.95047;
  const yNorm = (y3 > 0.008856 ? y3 : (y - 16 / 116) / 7.787) * 1.0;
  const zNorm = (z3 > 0.008856 ? z3 : (z - 16 / 116) / 7.787) * 1.08883;

  const rLinear = xNorm * 3.2406 + yNorm * -1.5372 + zNorm * -0.4986;
  const gLinear = xNorm * -0.9689 + yNorm * 1.8758 + zNorm * 0.0415;
  const bLinear = xNorm * 0.0557 + yNorm * -0.204 + zNorm * 1.057;

  const toSrgb = (v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    return clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  };

  const r = Math.round(toSrgb(rLinear) * 255);
  const g = Math.round(toSrgb(gLinear) * 255);
  const bVal = Math.round(toSrgb(bLinear) * 255);

  if (alpha < 1) {
    return `rgba(${r}, ${g}, ${bVal}, ${Math.max(0, Math.min(1, alpha)).toFixed(3)})`;
  }
  return `rgb(${r}, ${g}, ${bVal})`;
}

/**
 * Converts color(srgb r g b / a) to rgb/rgba
 */
export function colorToRgb(contents: string): string {
  const slashParts = contents.split('/');
  const rawParts = slashParts[0].replace(/^(?:srgb|display-p3|a98-rgb|prophoto-rgb|rec2020)\s+/i, '').trim().split(/[\s,]+/);
  let alphaPart = slashParts[1] ? slashParts[1].trim() : undefined;
  if (alphaPart === undefined && rawParts.length >= 4) {
    alphaPart = rawParts[3];
  }

  let r = parseFloat(rawParts[0]) || 0;
  let g = parseFloat(rawParts[1]) || 0;
  let b = parseFloat(rawParts[2]) || 0;

  if (rawParts[0]?.includes('%')) r = r / 100;
  if (rawParts[1]?.includes('%')) g = g / 100;
  if (rawParts[2]?.includes('%')) b = b / 100;

  r = Math.round(Math.max(0, Math.min(1, r)) * 255);
  g = Math.round(Math.max(0, Math.min(1, g)) * 255);
  b = Math.round(Math.max(0, Math.min(1, b)) * 255);

  let alpha = 1;
  if (alphaPart) {
    alpha = parseFloat(alphaPart);
    if (alphaPart.includes('%')) alpha = alpha / 100;
    if (isNaN(alpha)) alpha = 1;
  }

  if (alpha < 1) {
    return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha)).toFixed(3)})`;
  }
  return `rgb(${r}, ${g}, ${b})`;
}

export function replaceModernColorsInString(cssString: string): string {
  if (!cssString) return cssString;

  let result = cssString;

  // 1. Replace oklch(...)
  if (/oklch\s*\(/i.test(result)) {
    result = result.replace(/oklch\s*\(([^)]+)\)/gi, (_, contents) => {
      try {
        const slashParts = contents.split('/');
        const colorParts = slashParts[0].trim().split(/[\s,]+/);
        let alphaPart = slashParts[1] ? slashParts[1].trim() : undefined;
        if (alphaPart === undefined && colorParts.length >= 4) {
          alphaPart = colorParts[3];
        }
        if (colorParts.length >= 3) {
          return oklchToRgb(colorParts[0], colorParts[1], colorParts[2], alphaPart);
        }
        return 'rgb(100, 116, 139)';
      } catch {
        return 'rgb(100, 116, 139)';
      }
    });
  }

  // 2. Replace oklab(...)
  if (/oklab\s*\(/i.test(result)) {
    result = result.replace(/oklab\s*\(([^)]+)\)/gi, (_, contents) => {
      try {
        const slashParts = contents.split('/');
        const colorParts = slashParts[0].trim().split(/[\s,]+/);
        let alphaPart = slashParts[1] ? slashParts[1].trim() : undefined;
        if (alphaPart === undefined && colorParts.length >= 4) {
          alphaPart = colorParts[3];
        }
        if (colorParts.length >= 3) {
          return oklabToRgb(colorParts[0], colorParts[1], colorParts[2], alphaPart);
        }
        return 'rgb(100, 116, 139)';
      } catch {
        return 'rgb(100, 116, 139)';
      }
    });
  }

  // 3. Replace lab(...) - negative lookbehind for ok
  if (/(?<!ok)lab\s*\(/i.test(result)) {
    result = result.replace(/(?<!ok)lab\s*\(([^)]+)\)/gi, (_, contents) => {
      try {
        const slashParts = contents.split('/');
        const colorParts = slashParts[0].trim().split(/[\s,]+/);
        let alphaPart = slashParts[1] ? slashParts[1].trim() : undefined;
        if (alphaPart === undefined && colorParts.length >= 4) {
          alphaPart = colorParts[3];
        }
        if (colorParts.length >= 3) {
          return labToRgb(colorParts[0], colorParts[1], colorParts[2], alphaPart);
        }
        return 'rgb(100, 116, 139)';
      } catch {
        return 'rgb(100, 116, 139)';
      }
    });
  }

  // 4. Replace lch(...) - negative lookbehind for ok
  if (/(?<!ok)lch\s*\(/i.test(result)) {
    result = result.replace(/(?<!ok)lch\s*\(([^)]+)\)/gi, (_, contents) => {
      try {
        const slashParts = contents.split('/');
        const colorParts = slashParts[0].trim().split(/[\s,]+/);
        let alphaPart = slashParts[1] ? slashParts[1].trim() : undefined;
        if (alphaPart === undefined && colorParts.length >= 4) {
          alphaPart = colorParts[3];
        }
        if (colorParts.length >= 3) {
          return oklchToRgb(colorParts[0], colorParts[1], colorParts[2], alphaPart);
        }
        return 'rgb(100, 116, 139)';
      } catch {
        return 'rgb(100, 116, 139)';
      }
    });
  }

  // 5. Replace color(...)
  if (/color\s*\(/i.test(result)) {
    result = result.replace(/color\s*\(([^)]+)\)/gi, (_, contents) => {
      try {
        return colorToRgb(contents);
      } catch {
        return 'rgb(100, 116, 139)';
      }
    });
  }

  return result;
}

// Backwards compatibility alias
export const replaceOklchInString = replaceModernColorsInString;

/**
 * Creates a proxy around CSSStyleDeclaration to sanitize color values on access
 */
function createCleanComputedStyle(origCS: CSSStyleDeclaration): CSSStyleDeclaration {
  return new Proxy(origCS, {
    get(target, prop, receiver) {
      const val = Reflect.get(target, prop, receiver);
      if (typeof val === 'function') {
        if (prop === 'getPropertyValue') {
          return function (propName: string) {
            const raw = target.getPropertyValue(propName);
            return replaceModernColorsInString(raw);
          };
        }
        return val.bind(target);
      }
      if (typeof val === 'string') {
        return replaceModernColorsInString(val);
      }
      return val;
    },
  });
}

/**
 * Strips/converts OKLab, OKLCH, and modern color functions from cloned document
 * to prevent html2canvas parsing errors.
 */
export function sanitizeClonedDoc(clonedDoc: Document) {
  // 1. Hook defaultView.getComputedStyle if available in iframe
  try {
    if (clonedDoc.defaultView) {
      const win = clonedDoc.defaultView;
      const originalGetCS = win.getComputedStyle.bind(win);
      win.getComputedStyle = function (elt: Element, pseudoElt?: string | null) {
        const cs = originalGetCS(elt, pseudoElt);
        return createCleanComputedStyle(cs);
      };
    }
  } catch (err) {
    console.warn('Error patching clonedDoc getComputedStyle:', err);
  }

  // 2. Sanitize all <style> tags in cloned document
  try {
    const styleTags = clonedDoc.querySelectorAll('style');
    styleTags.forEach((styleTag) => {
      if (styleTag.textContent && /(?:oklab|oklch|lab|lch|color)\s*\(/i.test(styleTag.textContent)) {
        styleTag.textContent = replaceModernColorsInString(styleTag.textContent);
      }
    });
  } catch (err) {
    console.warn('Error sanitizing style tags for PDF:', err);
  }

  // 3. Sanitize all inline styles and color attributes on all elements
  try {
    const allElements = clonedDoc.querySelectorAll('*');
    allElements.forEach((el) => {
      const styleAttr = el.getAttribute('style');
      if (styleAttr && /(?:oklab|oklch|lab|lch|color)\s*\(/i.test(styleAttr)) {
        el.setAttribute('style', replaceModernColorsInString(styleAttr));
      }
      ['fill', 'stroke', 'stop-color', 'color'].forEach((attr) => {
        const val = el.getAttribute(attr);
        if (val && /(?:oklab|oklch|lab|lch|color)\s*\(/i.test(val)) {
          el.setAttribute(attr, replaceModernColorsInString(val));
        }
      });
    });
  } catch (err) {
    console.warn('Error sanitizing inline styles for PDF:', err);
  }
}

export const exportQuoteToPDF = async (
  elementId: string,
  quote: Quote,
  onProgress?: (progress: number) => void
): Promise<boolean> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id #${elementId} not found`);
    return false;
  }

  try {
    if (onProgress) onProgress(20);

    // Save previous scroll position
    const prevScrollY = window.scrollY;
    window.scrollTo(0, 0);

    // Create high-res canvas
    const canvas = await html2canvas(element, {
      scale: 2.2, // Retina resolution for crisp text & tables
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1024,
      onclone: (clonedDoc) => {
        // Sanitize modern OKLCH colors in stylesheets and inline attributes
        sanitizeClonedDoc(clonedDoc);

        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          clonedEl.style.width = '1024px';
          clonedEl.style.maxWidth = '1024px';
          clonedEl.style.height = 'auto';
          clonedEl.style.maxHeight = 'none';
          clonedEl.style.overflow = 'visible';
          clonedEl.style.margin = '0 auto';
          clonedEl.style.boxShadow = 'none';
        }
      },
    });

    if (onProgress) onProgress(60);

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Calculate height in mm
    const imgHeightInMm = (canvasHeight * pdfWidth) / canvasWidth;
    let heightLeft = imgHeightInMm;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightInMm, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Additional pages if the quotation content spans multiple pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeightInMm;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightInMm, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    if (onProgress) onProgress(90);

    // Clean client and quote number for filename
    const clientClean = (quote.clientSnapshot?.name || 'Cliente').replace(/[^a-zA-Z0-9_-]/g, '_');
    const quoteNumClean = quote.quoteNumber.replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `Cotizacion_${quoteNumClean}_${clientClean}.pdf`;

    pdf.save(fileName);

    window.scrollTo(0, prevScrollY);
    if (onProgress) onProgress(100);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

/**
 * Exports multiple quotes into a single multi-page consolidated PDF document
 */
export const exportMultipleQuotesToPDF = async (
  quotes: Quote[],
  onProgress?: (progress: number, currentQuoteIndex?: number, total?: number) => void
): Promise<boolean> => {
  if (!quotes || quotes.length === 0) return false;

  try {
    if (onProgress) onProgress(5, 0, quotes.length);

    const prevScrollY = window.scrollY;
    window.scrollTo(0, 0);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    let isFirstDocPage = true;

    for (let i = 0; i < quotes.length; i++) {
      const quote = quotes[i];
      const elId = `multi-quote-item-${quote.id}`;
      const element = document.getElementById(elId);

      if (!element) {
        console.warn(`Element #${elId} for quote ${quote.quoteNumber} not found, skipping`);
        continue;
      }

      if (onProgress) {
        const percent = Math.round(10 + (i / quotes.length) * 80);
        onProgress(percent, i + 1, quotes.length);
      }

      // Small delay to guarantee rendered layout
      await new Promise((r) => setTimeout(r, 60));

      const canvas = await html2canvas(element, {
        scale: 2.2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1024,
        onclone: (clonedDoc) => {
          // Sanitize modern OKLCH colors in stylesheets and inline attributes
          sanitizeClonedDoc(clonedDoc);

          const clonedEl = clonedDoc.getElementById(elId);
          if (clonedEl) {
            clonedEl.style.width = '1024px';
            clonedEl.style.maxWidth = '1024px';
            clonedEl.style.height = 'auto';
            clonedEl.style.maxHeight = 'none';
            clonedEl.style.overflow = 'visible';
            clonedEl.style.margin = '0 auto';
            clonedEl.style.boxShadow = 'none';
          }
        },
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgHeightInMm = (canvasHeight * pdfWidth) / canvasWidth;
      let heightLeft = imgHeightInMm;
      let position = 0;

      // Add a page for the next quotation if not the first page
      if (!isFirstDocPage) {
        pdf.addPage();
      }
      isFirstDocPage = false;

      // First page of current quotation
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightInMm, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Additional pages if this quotation is multi-page
      while (heightLeft > 0) {
        position = heightLeft - imgHeightInMm;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightInMm, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }
    }

    if (onProgress) onProgress(95, quotes.length, quotes.length);

    const nowStr = new Date().toISOString().slice(0, 10);
    const fileName = `Cotizaciones_Compiladas_${quotes.length}_Docs_${nowStr}.pdf`;
    pdf.save(fileName);

    window.scrollTo(0, prevScrollY);
    if (onProgress) onProgress(100, quotes.length, quotes.length);
    return true;
  } catch (error) {
    console.error('Error generating multi-quote PDF:', error);
    return false;
  }
};

/**
 * Prints multiple quotes in a single batch with page-breaks between them
 */
export const printMultipleQuotes = (containerElementId: string = 'multi-quotes-print-container') => {
  const container = document.getElementById(containerElementId);
  if (!container) {
    window.print();
    return;
  }

  const existingFrame = document.getElementById('cotiza-print-frame');
  if (existingFrame) {
    existingFrame.remove();
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'cotiza-print-frame';
  iframe.style.position = 'fixed';
  iframe.style.top = '-10000px';
  iframe.style.left = '-10000px';
  iframe.style.width = '1024px';
  iframe.style.height = '1000px';
  iframe.style.border = '0';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  document.body.appendChild(iframe);

  const frameDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!frameDoc) {
    window.print();
    return;
  }

  let stylesText = '';
  document.querySelectorAll('style, link[rel="stylesheet"]').forEach((tag) => {
    stylesText += tag.outerHTML + '\n';
  });

  const printSpecificRules = `
    <style>
      @page {
        size: A4 portrait;
        margin: 10mm 12mm 10mm 12mm;
      }
      *, *::before, *::after {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
        box-sizing: border-box !important;
      }
      html, body {
        background-color: #ffffff !important;
        background: #ffffff !important;
        color: #0f172a !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        height: auto !important;
        min-height: auto !important;
        overflow: visible !important;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      }
      .multi-quote-page-break {
        page-break-before: always !important;
        break-before: page !important;
      }
      tr, .break-inside-avoid, [data-avoid-break="true"] {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
      thead {
        display: table-header-group !important;
      }
      tfoot {
        display: table-footer-group !important;
      }
      img {
        max-width: 100% !important;
      }
    </style>
  `;

  frameDoc.open();
  frameDoc.write(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>Impresión de Cotizaciones Múltiples</title>
        ${stylesText}
        ${printSpecificRules}
      </head>
      <body>
        <div class="w-full bg-white">
          ${container.innerHTML}
        </div>
      </body>
    </html>
  `);
  frameDoc.close();

  const images = Array.from(frameDoc.images);
  const imagePromises = images.map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });
  });

  Promise.all(imagePromises).then(() => {
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.warn('Iframe print failed, falling back to window.print():', err);
        window.print();
      }
    }, 250);
  });
};

export const printQuoteDocument = (elementId: string = 'quote-printable-document') => {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  // Remove any previous print iframe
  const existingFrame = document.getElementById('cotiza-print-frame');
  if (existingFrame) {
    existingFrame.remove();
  }

  // Create an invisible, isolated iframe dedicated to printing
  const iframe = document.createElement('iframe');
  iframe.id = 'cotiza-print-frame';
  iframe.style.position = 'fixed';
  iframe.style.top = '-10000px';
  iframe.style.left = '-10000px';
  iframe.style.width = '1024px';
  iframe.style.height = '1000px';
  iframe.style.border = '0';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  document.body.appendChild(iframe);

  const frameDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!frameDoc) {
    window.print();
    return;
  }

  // Gather all style elements and stylesheet links
  let stylesText = '';
  document.querySelectorAll('style, link[rel="stylesheet"]').forEach((tag) => {
    stylesText += tag.outerHTML + '\n';
  });

  const printSpecificRules = `
    <style>
      @page {
        size: A4 portrait;
        margin: 10mm 12mm 10mm 12mm;
      }
      *, *::before, *::after {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
        box-sizing: border-box !important;
      }
      html, body {
        background-color: #ffffff !important;
        background: #ffffff !important;
        color: #0f172a !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        height: auto !important;
        min-height: auto !important;
        overflow: visible !important;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      }
      #${elementId} {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 auto !important;
        padding: 0 !important;
        border: none !important;
        box-shadow: none !important;
        min-height: auto !important;
        background-color: #ffffff !important;
      }
      tr, .break-inside-avoid, [data-avoid-break="true"] {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
      thead {
        display: table-header-group !important;
      }
      tfoot {
        display: table-footer-group !important;
      }
      img {
        max-width: 100% !important;
      }
    </style>
  `;

  frameDoc.open();
  frameDoc.write(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>Impresión de Cotización</title>
        ${stylesText}
        ${printSpecificRules}
      </head>
      <body>
        <div id="${elementId}" class="w-full bg-white">
          ${element.innerHTML}
        </div>
      </body>
    </html>
  `);
  frameDoc.close();

  // Wait for all images to be loaded inside the iframe before triggering print
  const images = Array.from(frameDoc.images);
  const imagePromises = images.map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });
  });

  Promise.all(imagePromises).then(() => {
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.warn('Iframe print failed, falling back to window.print():', err);
        window.print();
      }
    }, 200);
  });
};

