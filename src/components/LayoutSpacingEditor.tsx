import React, { useState } from 'react';
import { QuoteLayoutSettings, CompanySettings } from '../types';
import { DEFAULT_LAYOUT_SETTINGS } from '../data/initialData';
import {
  Maximize2,
  Minimize2,
  Sliders,
  Sparkles,
  RotateCcw,
  Layout,
  Building2,
  User,
  Table,
  DollarSign,
  FileText,
  PenTool,
  Check,
  Eye,
  Layers,
  MoveVertical,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Printer
} from 'lucide-react';

interface LayoutSpacingEditorProps {
  settings: CompanySettings;
  onUpdateLayout: (newLayout: QuoteLayoutSettings) => void;
  onSave?: () => void;
}

type SegmentKey =
  | 'page'
  | 'header'
  | 'client'
  | 'table'
  | 'totals'
  | 'terms'
  | 'signatures'
  | 'footer';

export const LayoutSpacingEditor: React.FC<LayoutSpacingEditorProps> = ({
  settings,
  onUpdateLayout,
  onSave,
}) => {
  const layout: QuoteLayoutSettings = {
    ...DEFAULT_LAYOUT_SETTINGS,
    ...(settings.layout || {}),
  };

  const [selectedSegment, setSelectedSegment] = useState<SegmentKey>('header');
  const [previewZoom, setPreviewZoom] = useState<'fit' | 'large'>('fit');
  const [appliedPreset, setAppliedPreset] = useState<string | null>(null);

  const primaryColor = settings.primaryColor || '#1e40af';
  const accentColor = settings.accentColor || '#0ea5e9';

  const updateField = <K extends keyof QuoteLayoutSettings>(
    key: K,
    value: QuoteLayoutSettings[K]
  ) => {
    const updated = {
      ...layout,
      [key]: value,
    };
    onUpdateLayout(updated);
    if (onSave) onSave();
  };

  // Layout Presets
  const applyPreset = (presetName: 'compact' | 'standard' | 'spacious') => {
    let newLayout: QuoteLayoutSettings;
    if (presetName === 'compact') {
      newLayout = {
        ...DEFAULT_LAYOUT_SETTINGS,
        pagePadding: 16,
        fontSizeScale: 'compact',
        logoHeight: 42,
        logoAlignment: 'left',
        showAccentBar: true,
        headerMarginBottom: 14,
        clientPadding: 10,
        clientMarginBottom: 14,
        clientBoxStyle: 'card',
        tableRowPadding: 'compact',
        tableMarginBottom: 14,
        descriptionFontSize: 'xs',
        totalsMarginTop: 14,
        totalsBoxPadding: 10,
        notesMarginBottom: 10,
        totalsBoxWidth: 280,
        termsMarginTop: 12,
        termsMarginBottom: 14,
        termsFontSize: 'xs',
        signatureMarginTop: 18,
        signatureHeight: 40,
        signatureLineWidth: 160,
        signatureLayout: 'split',
        footerMarginTop: 16,
        showFooterId: true,
      };
      setAppliedPreset('Compacto (1 Hoja)');
    } else if (presetName === 'spacious') {
      newLayout = {
        ...DEFAULT_LAYOUT_SETTINGS,
        pagePadding: 36,
        fontSizeScale: 'comfortable',
        logoHeight: 76,
        logoAlignment: 'left',
        showAccentBar: true,
        headerMarginBottom: 32,
        clientPadding: 20,
        clientMarginBottom: 30,
        clientBoxStyle: 'card',
        tableRowPadding: 'spacious',
        tableMarginBottom: 32,
        descriptionFontSize: 'sm',
        totalsMarginTop: 30,
        totalsBoxPadding: 20,
        notesMarginBottom: 22,
        totalsBoxWidth: 350,
        termsMarginTop: 28,
        termsMarginBottom: 32,
        termsFontSize: 'sm',
        signatureMarginTop: 46,
        signatureHeight: 72,
        signatureLineWidth: 220,
        signatureLayout: 'split',
        footerMarginTop: 36,
        showFooterId: true,
      };
      setAppliedPreset('Espacioso Ejecutivo');
    } else {
      newLayout = { ...DEFAULT_LAYOUT_SETTINGS };
      setAppliedPreset('Equilibrado Estándar');
    }

    onUpdateLayout(newLayout);
    if (onSave) onSave();
    setTimeout(() => setAppliedPreset(null), 2500);
  };

  const resetDefaults = () => {
    onUpdateLayout({ ...DEFAULT_LAYOUT_SETTINGS });
    if (onSave) onSave();
    setAppliedPreset('Restablecido a valores predeterminados');
    setTimeout(() => setAppliedPreset(null), 2500);
  };

  const segmentsList: { id: SegmentKey; label: string; icon: React.FC<any>; desc: string }[] = [
    { id: 'page', label: 'Hoja & Margen Global', icon: Layout, desc: 'Márgenes de impresión y escala tipográfica' },
    { id: 'header', label: '1. Encabezado & Logo', icon: Building2, desc: 'Altura del logo, alineación y separación' },
    { id: 'client', label: '2. Datos de Cliente', icon: User, desc: 'Relleno de tarjeta y separación inferior' },
    { id: 'table', label: '3. Tabla de Partidas', icon: Table, desc: 'Densidad de filas y tamaño de descripción' },
    { id: 'totals', label: '4. Totales & Desglose', icon: DollarSign, desc: 'Dimensiones del bloque de cobro y notas' },
    { id: 'terms', label: '5. Términos y Condiciones', icon: FileText, desc: 'Separación y tamaño de cláusulas legales' },
    { id: 'signatures', label: '6. Área de Firmas', icon: PenTool, desc: 'Distancia de firmas, altura y ancho de línea' },
    { id: 'footer', label: '7. Pie de Página', icon: Layers, desc: 'Margen inferior y datos de pie' },
  ];

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-xl space-y-6">
      {/* Top Header & Presets */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Editor Gráfico de Espaciados & Dimensiones de Impresión
              </h3>
              <p className="text-xs text-slate-400">
                Personaliza los márgenes, posiciones y dimensiones entre cada segmento para obtener un PDF e impresión a tu medida
              </p>
            </div>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Plantillas Rápidas:
          </span>
          <button
            type="button"
            onClick={() => applyPreset('compact')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
            title="Reduce espacios para que quepan más conceptos en una sola página"
          >
            <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
            Ajuste Compacto (1 Hoja)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('standard')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
            title="Espaciado equilibrado estándar"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Estándar Equilibrado
          </button>
          <button
            type="button"
            onClick={() => applyPreset('spacious')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
            title="Márgenes amplios para propuestas ejecutivas"
          >
            <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
            Espacioso Ejecutivo
          </button>
          <button
            type="button"
            onClick={resetDefaults}
            className="p-1.5 bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 rounded-xl text-xs font-medium border border-slate-700 transition-all"
            title="Restablecer valores predeterminados"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {appliedPreset && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          {appliedPreset} aplicado correctamente
        </div>
      )}

      {/* Main Studio Grid: Segment Selector & Controls on Left, Interactive Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Segments Menu + Controls Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Segment Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {segmentsList.map((seg) => {
              const Icon = seg.icon;
              const isSelected = selectedSegment === seg.id;
              return (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => setSelectedSegment(seg.id)}
                  className={`flex flex-col items-start p-2.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm ring-1 ring-blue-500/50'
                      : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5 w-full">
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold truncate">{seg.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                    {seg.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Segment Controls Box */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 space-y-5">
            
            {/* Page Margins / Global */}
            {selectedSegment === 'page' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layout className="w-4 h-4 text-blue-400" />
                    Márgenes Globales de la Hoja e Impresión
                  </h4>
                  <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20">
                    {layout.pagePadding} px (~{Math.round(layout.pagePadding * 0.26)} mm)
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                    <span>Margen Exterior del Documento (Padding de Hoja):</span>
                    <span className="font-mono text-white font-bold">{layout.pagePadding} px</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="48"
                    step="2"
                    value={layout.pagePadding}
                    onChange={(e) => updateField('pagePadding', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Mínimo (12px / Compacto)</span>
                    <span>Estándar (28px)</span>
                    <span>Amplio (48px / Ejecutivo)</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-700/80">
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Escala Tipográfica Base del Documento:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['compact', 'normal', 'comfortable'] as const).map((scale) => (
                      <button
                        key={scale}
                        type="button"
                        onClick={() => updateField('fontSizeScale', scale)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                          layout.fontSizeScale === scale
                            ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
                            : 'bg-slate-700/60 border-slate-600 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {scale === 'compact' ? 'Compacta (12px)' : scale === 'comfortable' ? 'Amplia (15px)' : 'Estándar (14px)'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Segment 1: Header & Logo */}
            {selectedSegment === 'header' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    Segmento 1: Encabezado & Logotipo
                  </h4>
                  <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20">
                    Logo: {layout.logoHeight} px | Margen: {layout.headerMarginBottom} px
                  </span>
                </div>

                {/* Logo Height */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                    <span>Altura / Dimensión del Logotipo en Impresión:</span>
                    <span className="font-mono text-white font-bold">{layout.logoHeight} px</span>
                  </div>
                  <input
                    type="range"
                    min="32"
                    max="120"
                    step="2"
                    value={layout.logoHeight}
                    onChange={(e) => updateField('logoHeight', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Pequeño (32px)</span>
                    <span>Recomendado (56px)</span>
                    <span>Grande (120px)</span>
                  </div>
                </div>

                {/* Logo Alignment */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Alineación del Encabezado / Logo:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'left', label: 'Izquierda', icon: AlignLeft },
                      { id: 'center', label: 'Centrado', icon: AlignCenter },
                      { id: 'right', label: 'Derecha', icon: AlignRight },
                    ].map((align) => {
                      const Icon = align.icon;
                      const isSel = layout.logoAlignment === align.id;
                      return (
                        <button
                          key={align.id}
                          type="button"
                          onClick={() => updateField('logoAlignment', align.id as any)}
                          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                            isSel
                              ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
                              : 'bg-slate-700/60 border-slate-600 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {align.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Header Separation Margin */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                    <span>Espacio Inferior de Separación hacia Datos del Cliente:</span>
                    <span className="font-mono text-white font-bold">{layout.headerMarginBottom} px</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="60"
                    step="2"
                    value={layout.headerMarginBottom}
                    onChange={(e) => updateField('headerMarginBottom', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Mínimo (8px)</span>
                    <span>Estándar (24px)</span>
                    <span>Espacioso (60px)</span>
                  </div>
                </div>

                {/* Accent Bar Toggle */}
                <div className="flex items-center justify-between p-3 bg-slate-700/40 rounded-xl border border-slate-700">
                  <span className="text-xs font-bold text-slate-200">
                    Mostrar Barra Superior con Gradiente de Marca
                  </span>
                  <input
                    type="checkbox"
                    checked={layout.showAccentBar}
                    onChange={(e) => updateField('showAccentBar', e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 accent-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Segment 2: Client */}
            {selectedSegment === 'client' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    Segmento 2: Datos del Cliente / Receptor
                  </h4>
                  <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20">
                    Padding: {layout.clientPadding} px | Separación: {layout.clientMarginBottom} px
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                    <span>Relleno Interno de la Tarjeta del Cliente (Padding):</span>
                    <span className="font-mono text-white font-bold">{layout.clientPadding} px</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="32"
                    step="2"
                    value={layout.clientPadding}
                    onChange={(e) => updateField('clientPadding', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                    <span>Separación Inferior hacia la Tabla de Conceptos:</span>
                    <span className="font-mono text-white font-bold">{layout.clientMarginBottom} px</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="60"
                    step="2"
                    value={layout.clientMarginBottom}
                    onChange={(e) => updateField('clientMarginBottom', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Estilo Visual de la Tarjeta del Cliente:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'card', label: 'Fondo Sutil' },
                      { id: 'bordered', label: 'Borde Limpio' },
                      { id: 'minimal', label: 'Sin Fondo' },
                    ].map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => updateField('clientBoxStyle', style.id as any)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                          layout.clientBoxStyle === style.id
                            ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
                            : 'bg-slate-700/60 border-slate-600 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Segment 3: Table */}
            {selectedSegment === 'table' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Table className="w-4 h-4 text-blue-400" />
                    Segmento 3: Tabla de Partidas / Conceptos
                  </h4>
                  <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20">
                    Filas: {layout.tableRowPadding} | Separación: {layout.tableMarginBottom} px
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Densidad & Altura de Filas de Conceptos:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'compact', label: 'Compacta (8px)', desc: 'Para muchas partidas' },
                      { id: 'normal', label: 'Estándar (14px)', desc: 'Equilibrada' },
                      { id: 'spacious', label: 'Espaciosa (20px)', desc: 'Propuestas de alto valor' },
                    ].map((den) => (
                      <button
                        key={den.id}
                        type="button"
                        onClick={() => updateField('tableRowPadding', den.id as any)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          layout.tableRowPadding === den.id
                            ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
                            : 'bg-slate-700/60 border-slate-600 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <div className="text-xs font-bold">{den.label}</div>
                        <div className="text-[10px] text-slate-300/80 mt-0.5">{den.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                    <span>Separación Inferior hacia Totales y Notas:</span>
                    <span className="font-mono text-white font-bold">{layout.tableMarginBottom} px</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="60"
                    step="2"
                    value={layout.tableMarginBottom}
                    onChange={(e) => updateField('tableMarginBottom', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Tamaño de Texto en la Descripción Técnica del Concepto:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateField('descriptionFontSize', 'xs')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        layout.descriptionFontSize === 'xs'
                          ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
                          : 'bg-slate-700/60 border-slate-600 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Texto Fino (12px)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('descriptionFontSize', 'sm')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        layout.descriptionFontSize === 'sm'
                          ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
                          : 'bg-slate-700/60 border-slate-600 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Texto Destacado (14px)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Segment 4: Totals */}
            {selectedSegment === 'totals' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-400" />
                    Segmento 4: Totales, Desglose & Notas
                  </h4>
                  <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20">
                    Ancho: {layout.totalsBoxWidth} px | Separación: {layout.totalsMarginTop} px
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                    <span>Separación Superior del Bloque de Totales:</span>
                    <span className="font-mono text-white font-bold">{layout.totalsMarginTop} px</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="60"
                    step="2"
                    value={layout.totalsMarginTop}
                    onChange={(e) => updateField('totalsMarginTop', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                    <span>Ancho de la Tarjeta de Suma Final / Totales:</span>
                    <span className="font-mono text-white font-bold">{layout.totalsBoxWidth} px</span>
                  </div>
                  <input
                    type="range"
                    min="240"
                    max="380"
                    step="10"
                    value={layout.totalsBoxWidth}
                    onChange={(e) => updateField('totalsBoxWidth', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Compacta (240px)</span>
                    <span>Estándar (320px)</span>
                    <span>Ancha (380px)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                    <span>Relleno Interno (Padding) de la Caja de Totales:</span>
                    <span className="font-mono text-white font-bold">{layout.totalsBoxPadding} px</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="32"
                    step="2"
                    value={layout.totalsBoxPadding}
                    onChange={(e) => updateField('totalsBoxPadding', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                    <span>Espacio entre Notas Adicionales y Cuentas Bancarias:</span>
                    <span className="font-mono text-white font-bold">{layout.notesMarginBottom} px</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="40"
                    step="2"
                    value={layout.notesMarginBottom}
                    onChange={(e) => updateField('notesMarginBottom', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Segment 5: Terms */}
            {selectedSegment === 'terms' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    Segmento 5: Términos y Condiciones
                  </h4>
                  <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20">
                    Separación: {layout.termsMarginTop} px
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                    <span>Separación Superior hacia los Totales:</span>
                    <span className="font-mono text-white font-bold">{layout.termsMarginTop} px</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="50"
                    step="2"
                    value={layout.termsMarginTop}
                    onChange={(e) => updateField('termsMarginTop', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                    <span>Separación Inferior hacia las Firmas:</span>
                    <span className="font-mono text-white font-bold">{layout.termsMarginBottom} px</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="60"
                    step="2"
                    value={layout.termsMarginBottom}
                    onChange={(e) => updateField('termsMarginBottom', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Tamaño de Fuente de las Cláusulas:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateField('termsFontSize', 'xs')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        layout.termsFontSize === 'xs'
                          ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
                          : 'bg-slate-700/60 border-slate-600 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Compacto (11px)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('termsFontSize', 'sm')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        layout.termsFontSize === 'sm'
                          ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
                          : 'bg-slate-700/60 border-slate-600 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Legible (13px)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Segment 6: Signatures */}
            {selectedSegment === 'signatures' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <PenTool className="w-4 h-4 text-blue-400" />
                    Segmento 6: Área de Firmas & Aprobación
                  </h4>
                  <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20">
                    Distancia: {layout.signatureMarginTop} px | Altura: {layout.signatureHeight} px
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                    <span>Separación Superior hacia el Bloque de Firmas:</span>
                    <span className="font-mono text-white font-bold">{layout.signatureMarginTop} px</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="80"
                    step="2"
                    value={layout.signatureMarginTop}
                    onChange={(e) => updateField('signatureMarginTop', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Mínimo (12px)</span>
                    <span>Estándar (32px)</span>
                    <span>Espacioso (80px)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                    <span>Altura del Espacio para Firma / Sello:</span>
                    <span className="font-mono text-white font-bold">{layout.signatureHeight} px</span>
                  </div>
                  <input
                    type="range"
                    min="36"
                    max="110"
                    step="2"
                    value={layout.signatureHeight}
                    onChange={(e) => updateField('signatureHeight', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                    <span>Ancho de la Línea de Firma:</span>
                    <span className="font-mono text-white font-bold">{layout.signatureLineWidth} px</span>
                  </div>
                  <input
                    type="range"
                    min="120"
                    max="280"
                    step="4"
                    value={layout.signatureLineWidth}
                    onChange={(e) => updateField('signatureLineWidth', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Disposición de Firmas:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'split', label: 'Dos Columnas' },
                      { id: 'centered', label: 'Centradas' },
                      { id: 'single', label: 'Solo Emisor' },
                    ].map((lay) => (
                      <button
                        key={lay.id}
                        type="button"
                        onClick={() => updateField('signatureLayout', lay.id as any)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                          layout.signatureLayout === lay.id
                            ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
                            : 'bg-slate-700/60 border-slate-600 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {lay.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Segment 7: Footer */}
            {selectedSegment === 'footer' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    Segmento 7: Pie de Página
                  </h4>
                  <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20">
                    Margen: {layout.footerMarginTop} px
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                    <span>Separación Superior hacia el Pie de Página:</span>
                    <span className="font-mono text-white font-bold">{layout.footerMarginTop} px</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="50"
                    step="2"
                    value={layout.footerMarginTop}
                    onChange={(e) => updateField('footerMarginTop', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700/40 rounded-xl border border-slate-700">
                  <span className="text-xs font-bold text-slate-200">
                    Mostrar Folio de Identificación en Pie de Página
                  </span>
                  <input
                    type="checkbox"
                    checked={layout.showFooterId}
                    onChange={(e) => updateField('showFooterId', e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 accent-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Interactive Visual Canvas (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-300">
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <span>Simulador de Hoja & Espacios (En Vivo)</span>
            </div>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md font-mono">
              Haz clic en cualquier sección
            </span>
          </div>

          {/* Interactive Document Sheet Miniature */}
          <div
            className="bg-white text-slate-800 rounded-xl shadow-2xl overflow-hidden transition-all duration-200 select-none relative"
            style={{
              padding: `${Math.max(10, Math.round(layout.pagePadding * 0.55))}px`,
              fontSize: layout.fontSizeScale === 'compact' ? '9px' : layout.fontSizeScale === 'comfortable' ? '11px' : '10px',
            }}
          >
            {/* Accent Bar */}
            {layout.showAccentBar && (
              <div
                className="h-1.5 w-full rounded-t-md mb-2"
                style={{
                  background: `linear-gradient(90deg, ${primaryColor} 0%, ${accentColor} 100%)`,
                }}
              />
            )}

            {/* Header Segment */}
            <div
              onClick={() => setSelectedSegment('header')}
              className={`p-2 rounded-lg cursor-pointer transition-all border ${
                selectedSegment === 'header'
                  ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/30'
                  : 'border-transparent hover:border-slate-300 hover:bg-slate-50'
              }`}
              style={{
                marginBottom: `${Math.round(layout.headerMarginBottom * 0.45)}px`,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div
                  className={`flex-1 flex ${
                    layout.logoAlignment === 'center'
                      ? 'justify-center'
                      : layout.logoAlignment === 'right'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  {settings.logoUrl ? (
                    <img
                      src={settings.logoUrl}
                      alt="Logo"
                      style={{
                        height: `${Math.max(20, Math.round(layout.logoHeight * 0.45))}px`,
                        maxHeight: `${Math.max(20, Math.round(layout.logoHeight * 0.45))}px`,
                      }}
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center text-white text-[8px] font-bold"
                        style={{ backgroundColor: primaryColor }}
                      >
                        M
                      </div>
                      <span className="font-bold text-slate-900 text-[10px] truncate max-w-[120px]">
                        {settings.companyName || 'Mi Empresa'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0 bg-slate-100 p-1.5 rounded text-[8px]">
                  <span className="font-bold text-slate-700 block">COTIZACIÓN</span>
                  <span className="font-mono text-slate-500">COT-2025-001</span>
                </div>
              </div>

              {selectedSegment === 'header' && (
                <div className="mt-1 flex items-center justify-center gap-1 text-[8px] text-blue-600 font-mono bg-blue-100/70 rounded py-0.5">
                  <MoveVertical className="w-2.5 h-2.5" />
                  <span>Separación: {layout.headerMarginBottom}px</span>
                </div>
              )}
            </div>

            {/* Client Segment */}
            <div
              onClick={() => setSelectedSegment('client')}
              className={`rounded-lg cursor-pointer transition-all border ${
                selectedSegment === 'client'
                  ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/30'
                  : layout.clientBoxStyle === 'card'
                  ? 'bg-slate-50 border-slate-200'
                  : layout.clientBoxStyle === 'bordered'
                  ? 'bg-white border-slate-200'
                  : 'bg-transparent border-transparent'
              }`}
              style={{
                padding: `${Math.round(layout.clientPadding * 0.45)}px`,
                marginBottom: `${Math.round(layout.clientMarginBottom * 0.45)}px`,
              }}
            >
              <div className="flex justify-between items-start text-[8px]">
                <div>
                  <span className="text-[7px] uppercase font-bold text-slate-400 block">Cliente:</span>
                  <span className="font-bold text-slate-800">Constructora Alpha S.A.</span>
                </div>
                <div className="text-right text-slate-500">
                  <span>contacto@alpha.com</span>
                </div>
              </div>

              {selectedSegment === 'client' && (
                <div className="mt-1 flex items-center justify-center gap-1 text-[8px] text-blue-600 font-mono bg-blue-100/70 rounded py-0.5">
                  <MoveVertical className="w-2.5 h-2.5" />
                  <span>Separación: {layout.clientMarginBottom}px</span>
                </div>
              )}
            </div>

            {/* Table Segment */}
            <div
              onClick={() => setSelectedSegment('table')}
              className={`rounded-lg cursor-pointer transition-all border ${
                selectedSegment === 'table'
                  ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/30'
                  : 'border-transparent hover:bg-slate-50'
              }`}
              style={{
                marginBottom: `${Math.round(layout.tableMarginBottom * 0.45)}px`,
              }}
            >
              <div
                className="text-[8px] font-bold text-white px-2 py-1 rounded flex justify-between"
                style={{ backgroundColor: primaryColor }}
              >
                <span># Concepto</span>
                <span>Cant.</span>
                <span>Importe</span>
              </div>

              <div className="divide-y divide-slate-100 text-[8px]">
                {[
                  { name: 'Licencia Software Cloud', sub: 'Acceso corporativo ilimitado', price: '$1,200.00' },
                  { name: 'Servicio de Instalación', sub: 'Configuración de servidor y red', price: '$450.00' },
                ].map((it, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center"
                    style={{
                      paddingTop: layout.tableRowPadding === 'compact' ? '3px' : layout.tableRowPadding === 'spacious' ? '7px' : '5px',
                      paddingBottom: layout.tableRowPadding === 'compact' ? '3px' : layout.tableRowPadding === 'spacious' ? '7px' : '5px',
                      paddingLeft: '6px',
                      paddingRight: '6px',
                    }}
                  >
                    <div>
                      <span className="font-semibold text-slate-800">{i + 1}. {it.name}</span>
                      <p
                        className="text-slate-500 text-[7px]"
                        style={{
                          fontSize: layout.descriptionFontSize === 'sm' ? '8px' : '7px',
                        }}
                      >
                        {it.sub}
                      </p>
                    </div>
                    <span className="text-slate-500">1</span>
                    <span className="font-mono font-bold text-slate-800">{it.price}</span>
                  </div>
                ))}
              </div>

              {selectedSegment === 'table' && (
                <div className="mt-1 flex items-center justify-center gap-1 text-[8px] text-blue-600 font-mono bg-blue-100/70 rounded py-0.5">
                  <MoveVertical className="w-2.5 h-2.5" />
                  <span>Separación: {layout.tableMarginBottom}px</span>
                </div>
              )}
            </div>

            {/* Totals & Notes Segment */}
            <div
              onClick={() => setSelectedSegment('totals')}
              className={`rounded-lg cursor-pointer transition-all border ${
                selectedSegment === 'totals'
                  ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/30'
                  : 'border-transparent hover:bg-slate-50'
              }`}
              style={{
                marginTop: `${Math.round(layout.totalsMarginTop * 0.45)}px`,
              }}
            >
              <div className="flex justify-between items-start gap-2">
                {/* Notes */}
                <div className="flex-1 text-[7px] text-slate-500 space-y-1">
                  <div className="p-1 bg-slate-100 rounded">
                    <span className="font-bold text-slate-700 block">Datos Bancarios:</span>
                    <span>BBVA / CLABE: 0121800...</span>
                  </div>
                </div>

                {/* Financial Summary Box */}
                <div
                  className="bg-slate-100 p-2 rounded-md space-y-1 text-[8px]"
                  style={{
                    width: `${Math.min(180, Math.round(layout.totalsBoxWidth * 0.45))}px`,
                    padding: `${Math.round(layout.totalsBoxPadding * 0.45)}px`,
                  }}
                >
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono font-semibold">$1,650.00</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>IVA (16%):</span>
                    <span className="font-mono font-semibold">$264.00</span>
                  </div>
                  <div
                    className="flex justify-between font-bold pt-1 border-t border-slate-300 text-slate-900"
                    style={{ color: primaryColor }}
                  >
                    <span>TOTAL:</span>
                    <span className="font-mono font-black">$1,914.00</span>
                  </div>
                </div>
              </div>

              {selectedSegment === 'totals' && (
                <div className="mt-1 flex items-center justify-center gap-1 text-[8px] text-blue-600 font-mono bg-blue-100/70 rounded py-0.5">
                  <MoveVertical className="w-2.5 h-2.5" />
                  <span>Separación: {layout.totalsMarginTop}px</span>
                </div>
              )}
            </div>

            {/* Terms Segment */}
            <div
              onClick={() => setSelectedSegment('terms')}
              className={`rounded-lg cursor-pointer transition-all border ${
                selectedSegment === 'terms'
                  ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/30'
                  : 'border-transparent hover:bg-slate-50'
              }`}
              style={{
                marginTop: `${Math.round(layout.termsMarginTop * 0.45)}px`,
                marginBottom: `${Math.round(layout.termsMarginBottom * 0.45)}px`,
              }}
            >
              <span className="font-bold text-[7px] uppercase text-slate-500 block">Términos Comerciales:</span>
              <p
                className="text-slate-400 leading-tight"
                style={{ fontSize: layout.termsFontSize === 'sm' ? '8px' : '7px' }}
              >
                1. Validez de 15 días. 2. Anticipo 50% al confirmar.
              </p>
            </div>

            {/* Signature Segment */}
            {settings.showSignatureArea && (
              <div
                onClick={() => setSelectedSegment('signatures')}
                className={`rounded-lg cursor-pointer transition-all border ${
                  selectedSegment === 'signatures'
                    ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/30'
                    : 'border-transparent hover:bg-slate-50'
                }`}
                style={{
                  marginTop: `${Math.round(layout.signatureMarginTop * 0.45)}px`,
                }}
              >
                <div
                  className={`flex items-end ${
                    layout.signatureLayout === 'centered'
                      ? 'justify-center gap-6'
                      : layout.signatureLayout === 'single'
                      ? 'justify-start'
                      : 'justify-between'
                  }`}
                >
                  <div className="text-center">
                    <div
                      style={{
                        height: `${Math.round(layout.signatureHeight * 0.4)}px`,
                        width: `${Math.round(layout.signatureLineWidth * 0.4)}px`,
                      }}
                      className="border-b border-dashed border-slate-400 mx-auto flex items-end justify-center"
                    >
                      {settings.signatureImage && (
                        <img
                          src={settings.signatureImage}
                          alt="Firma"
                          className="max-h-full object-contain"
                        />
                      )}
                    </div>
                    <span className="text-[7px] font-bold text-slate-700 block mt-0.5">
                      Firma Emisor
                    </span>
                  </div>

                  {layout.signatureLayout !== 'single' && (
                    <div className="text-center">
                      <div
                        style={{
                          height: `${Math.round(layout.signatureHeight * 0.4)}px`,
                          width: `${Math.round(layout.signatureLineWidth * 0.4)}px`,
                        }}
                        className="border-b border-dashed border-slate-400 mx-auto"
                      />
                      <span className="text-[7px] font-bold text-slate-700 block mt-0.5">
                        Aceptación Cliente
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            {layout.showFooterId && (
              <div
                onClick={() => setSelectedSegment('footer')}
                className={`pt-1 border-t border-slate-100 flex justify-between text-[6px] text-slate-400 cursor-pointer ${
                  selectedSegment === 'footer' ? 'text-blue-600 font-bold' : ''
                }`}
                style={{
                  marginTop: `${Math.round(layout.footerMarginTop * 0.45)}px`,
                }}
              >
                <span>CotizaFácil Pro</span>
                <span>Documento Oficial</span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
            <Printer className="w-3.5 h-3.5 text-blue-400" />
            <span>Todos los cambios se aplican de forma inmediata al imprimir o generar PDF.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
