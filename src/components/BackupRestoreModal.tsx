import React from 'react';
import {
  X,
  Database,
  ShieldCheck,
  Users,
  FileText,
  Package,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  UserCheck,
  Lock
} from 'lucide-react';
import { BackupSummary, BackupRestoreMode } from '../types';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: BackupSummary | null;
  onConfirmRestore: (mode: BackupRestoreMode) => void;
  currentUserRole?: 'admin' | 'seller';
  currentUserName?: string;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  isOpen,
  onClose,
  summary,
  onConfirmRestore,
  currentUserRole = 'seller',
  currentUserName = 'Usuario',
}) => {
  if (!isOpen || !summary || !summary.valid) return null;

  const isAdmin = currentUserRole === 'admin';

  const formattedDate = summary.exportedAt
    ? new Date(summary.exportedAt).toLocaleString('es-MX', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Fecha desconocida';

  // Seller counts
  const sellerQuotesToRestore = summary.sellerQuotesCount ?? summary.totalQuotes;
  const sellerClientsToRestore = summary.sellerClientsCount ?? summary.totalClients;
  const sellerProductsToRestore = summary.sellerProductsCount ?? summary.totalProducts;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/80 via-white to-slate-50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl ${isAdmin ? 'bg-blue-600' : 'bg-emerald-600'} text-white flex items-center justify-center shadow-md`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  {isAdmin ? 'Cargar Archivo de Respaldo' : 'Restaurar Mi Información'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Archivo Válido
                </span>
                {!isAdmin && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    Comercial
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {isAdmin
                  ? 'Selecciona cómo deseas restaurar la información en tu sistema'
                  : 'Recupera tus cotizaciones, clientes y productos personales'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* File Meta Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 border-b border-slate-200/60 pb-2.5">
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Fecha del respaldo: <strong className="text-slate-900">{formattedDate}</strong></span>
              </div>
              {summary.exportedBy && (
                <div className="flex items-center gap-1.5 font-medium">
                  <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                  <span>Exportado por: <strong className="text-slate-900">{summary.exportedBy.name}</strong> ({summary.exportedBy.role === 'admin' ? 'Administrador' : 'Vendedor'})</span>
                </div>
              )}
            </div>

            {/* If Admin: Breakdown Stats Admin vs Others */}
            {isAdmin ? (
              <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-500 flex items-center justify-center gap-1">
                    <FileText className="w-3 h-3 text-blue-500" /> Cotizaciones
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-0.5">{summary.totalQuotes}</div>
                  <div className="text-[10px] text-slate-500">
                    {summary.adminQuotes} Admin • {summary.otherQuotes} otros
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-500 flex items-center justify-center gap-1">
                    <Users className="w-3 h-3 text-indigo-500" /> Clientes
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-0.5">{summary.totalClients}</div>
                  <div className="text-[10px] text-slate-500">
                    {summary.adminClients} Admin • {summary.otherClients} otros
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-500 flex items-center justify-center gap-1">
                    <Package className="w-3 h-3 text-emerald-500" /> Productos
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-0.5">{summary.totalProducts}</div>
                  <div className="text-[10px] text-slate-500">
                    {summary.adminProducts} Admin • {summary.otherProducts} otros
                  </div>
                </div>
              </div>
            ) : (
              /* If Seller: Personal Stats to be restored */
              <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-500 flex items-center justify-center gap-1">
                    <FileText className="w-3 h-3 text-emerald-500" /> Cotizaciones
                  </div>
                  <div className="text-xl font-black text-slate-900 mt-0.5">{sellerQuotesToRestore}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">Para tu usuario</div>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-500 flex items-center justify-center gap-1">
                    <Users className="w-3 h-3 text-indigo-500" /> Clientes
                  </div>
                  <div className="text-xl font-black text-slate-900 mt-0.5">{sellerClientsToRestore}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">Para tu usuario</div>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-500 flex items-center justify-center gap-1">
                    <Package className="w-3 h-3 text-blue-500" /> Productos
                  </div>
                  <div className="text-xl font-black text-slate-900 mt-0.5">{sellerProductsToRestore}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">Para tu usuario</div>
                </div>
              </div>
            )}

            {/* Detected Users Pill List (Only visible for Admin) */}
            {isAdmin && summary.totalUsers > 0 && (
              <div className="pt-1">
                <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                  Usuarios detectados en el archivo ({summary.totalUsers}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {summary.adminUser && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                      <ShieldCheck className="w-3 h-3 text-blue-600" />
                      {summary.adminUser.name} (Admin)
                    </span>
                  )}
                  {summary.otherUsers.map((u) => (
                    <span
                      key={u.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-200/70 text-slate-700"
                    >
                      <Users className="w-3 h-3 text-slate-500" />
                      {u.name} (Vendedor)
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ADMIN ONLY: Selective Question & Options */}
          {isAdmin ? (
            <>
              {/* Selective Question Callout */}
              <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-blue-950">
                    ¿Deseas restaurar solo los datos del Administrador o también de los demás usuarios?
                  </h4>
                  <p className="text-xs text-blue-800 mt-0.5">
                    Como administrador, puedes aislar la restauración solo para tu cuenta sin alterar a los otros vendedores, o restaurar todo el sistema.
                  </p>
                </div>
              </div>

              {/* Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Option 1: Admin Only */}
                <div
                  onClick={() => onConfirmRestore('admin_only')}
                  className="p-4 rounded-2xl border-2 border-slate-200 hover:border-blue-500 bg-white hover:bg-blue-50/30 transition-all cursor-pointer group flex flex-col justify-between space-y-3 shadow-2xs hover:shadow-md"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        Solo Administrador
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-900 transition-colors">
                        Solo datos del Administrador
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Restaura únicamente las cotizaciones, clientes, productos y ajustes pertenecientes al Administrador.
                      </p>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5 border border-emerald-200/60">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Conserva intactos los datos de los demás vendedores</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-600 group-hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <span>Restaurar Solo Administrador</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Option 2: All Users */}
                <div
                  onClick={() => onConfirmRestore('all')}
                  className="p-4 rounded-2xl border-2 border-slate-200 hover:border-slate-800 bg-white hover:bg-slate-50 transition-all cursor-pointer group flex flex-col justify-between space-y-3 shadow-2xs hover:shadow-md"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                        <Users className="w-5 h-5" />
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                        Todos los Usuarios
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 group-hover:text-slate-900 transition-colors">
                        Administrador y demás usuarios
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Restaura la copia de seguridad completa con todos los vendedores registrados, sus cotizaciones, clientes y configuraciones.
                      </p>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-800 text-[11px] font-semibold flex items-center gap-1.5 border border-amber-200/60">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Reemplaza todos los datos por los del archivo</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 group-hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <span>Restaurar Todos los Usuarios</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* SELLER / COMERCIAL USER: NO SELECTIVE QUESTION, STRICTLY PERSONAL RESTORE */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-emerald-950">
                    Restauración Personal para {currentUserName}
                  </h4>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Como usuario comercial o vendedor, únicamente puedes restaurar tu información personal. 
                    Se asignarán a tu cuenta las cotizaciones, clientes y productos contenidos en este respaldo.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center shrink-0 text-slate-700">
                  <Lock className="w-4 h-4" />
                </div>
                <p>
                  <strong>Seguridad y Privacidad:</strong> Los datos del Administrador y de los demás vendedores permanecerán totalmente protegidos e intactos.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onConfirmRestore('seller_only')}
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Restaurar Mi Información Personal ({sellerQuotesToRestore} cotizaciones, {sellerClientsToRestore} clientes)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Ningún cambio se aplicará si cancelas esta operación.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
