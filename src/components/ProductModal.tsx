import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { X, Package, Check, Tag, DollarSign } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  onProductSaved?: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  onProductSaved,
}) => {
  const { addProduct, updateProduct, settings } = useApp();

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    unitPrice: 0,
    unit: 'pza',
    category: 'General',
    defaultTaxRate: settings.defaultTaxRate || 16,
    inStock: 100,
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        code: productToEdit.code || '',
        name: productToEdit.name || '',
        description: productToEdit.description || '',
        unitPrice: productToEdit.unitPrice || 0,
        unit: productToEdit.unit || 'pza',
        category: productToEdit.category || 'General',
        defaultTaxRate: productToEdit.defaultTaxRate !== undefined ? productToEdit.defaultTaxRate : (settings.defaultTaxRate || 16),
        inStock: productToEdit.inStock !== undefined ? productToEdit.inStock : 100,
      });
    } else {
      setFormData({
        code: `PRD-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        description: '',
        unitPrice: 0,
        unit: 'pza',
        category: 'Servicios',
        defaultTaxRate: settings.defaultTaxRate || 16,
        inStock: 100,
      });
    }
  }, [productToEdit, isOpen, settings.defaultTaxRate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (productToEdit) {
      updateProduct(productToEdit.id, formData);
      if (onProductSaved) {
        onProductSaved({ ...productToEdit, ...formData });
      }
    } else {
      const created = addProduct(formData);
      if (onProductSaved) {
        onProductSaved(created);
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {productToEdit ? 'Editar Producto / Servicio' : 'Nuevo Producto / Servicio'}
              </h3>
              <p className="text-xs text-slate-500">
                {productToEdit ? 'Modifique precios y detalles de catálogo' : 'Agregue un nuevo ítem a su catálogo'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Código / Ref / SKU <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Ej. WEB-01"
                className="w-full px-3.5 py-2 font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs uppercase"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nombre del Concepto / Ítem <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej. Mantenimiento Preventivo"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Descripción Detallada (Aparecerá en el PDF)
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Especificaciones técnicas, alcances, entregables incluidos..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none text-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Precio Unitario <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                  {settings.defaultCurrencySymbol || '$'}
                </span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  required
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Unidad de Medida
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs font-medium"
              >
                <option value="pza">Pieza (pza)</option>
                <option value="servicio">Servicio</option>
                <option value="hora">Hora (hr)</option>
                <option value="mes">Mes</option>
                <option value="proyecto">Proyecto</option>
                <option value="paquete">Paquete</option>
                <option value="m2">Metro cuadrado (m²)</option>
                <option value="kg">Kilogramo (kg)</option>
                <option value="licencia">Licencia</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                IVA Predeterminado (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0"
                  max="100"
                  value={formData.defaultTaxRate}
                  onChange={(e) => setFormData({ ...formData, defaultTaxRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 pr-8 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                  %
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Categoría / Familia
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ej. Servicios TI, Software, Hardware..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Disponibilidad / Stock (opcional)
              </label>
              <input
                type="number"
                value={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-600/30 transition-colors text-xs"
            >
              <Check className="w-4 h-4" />
              {productToEdit ? 'Guardar Cambios' : 'Registrar en Catálogo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
