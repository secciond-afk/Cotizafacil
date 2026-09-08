import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChangePasswordModal } from './ChangePasswordModal';
import {
  LayoutDashboard,
  FileText,
  Users,
  Package,
  Settings,
  Plus,
  X,
  Building,
  Bell,
  Download,
  ShieldCheck,
  UserCheck,
  Lock,
  LogOut,
  KeyRound,
  BookOpen
} from 'lucide-react';

export const MobileDrawer: React.FC = () => {
  const {
    isMobileNavOpen,
    setIsMobileNavOpen,
    activeTab,
    setActiveTab,
    startNewQuote,
    settings,
    currentUser,
    logout,
    openUserGuide,
  } = useApp();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  if (!isMobileNavOpen) return null;

  const handleSelect = (tab: any) => {
    setActiveTab(tab);
    setIsMobileNavOpen(false);
  };

  const handleLogout = () => {
    setIsMobileNavOpen(false);
    logout();
  };

  return (
    <>
      <div className="lg:hidden fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsMobileNavOpen(false)}
        />

        {/* Drawer Body */}
        <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between p-5 z-10 animate-in slide-in-from-left duration-200">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm"
                  style={{ backgroundColor: settings.primaryColor || '#1e40af' }}
                >
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 text-base leading-tight block">
                    CotizaFácil <span className="text-blue-600">Pro</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                    {settings.companyName}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsMobileNavOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current User Card */}
            <div className="p-3 rounded-2xl bg-purple-50/80 border border-purple-200/60 space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-900 truncate block leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-purple-700 font-medium block">
                    {currentUser.role === 'admin' ? 'Administrador' : 'Vendedor'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full py-1.5 px-2.5 rounded-xl bg-white hover:bg-purple-100/70 text-purple-900 font-bold text-xs flex items-center justify-center gap-1.5 border border-purple-200/80 transition-colors cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-purple-600" />
                Cambiar Contraseña
              </button>
            </div>

            {/* Quick Create Button */}
            <button
              onClick={() => {
                startNewQuote();
                setIsMobileNavOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              + Nueva Cotización
            </button>

            {/* Quick User Guide Button */}
            <button
              onClick={() => {
                setIsMobileNavOpen(false);
                openUserGuide();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100/90 text-blue-800 font-bold text-xs flex items-center justify-center gap-2 border border-blue-200/80 transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-blue-600" />
              Guía de Uso con Imágenes
            </button>

            {/* Navigation Links */}
            <div className="space-y-1">
              {[
                { id: 'dashboard', label: 'Tablero de Control', icon: LayoutDashboard },
                { id: 'quotes', label: 'Historial de Cotizaciones', icon: FileText },
                { id: 'clients', label: 'Base de Clientes', icon: Users },
                { id: 'products', label: 'Catálogo de Productos', icon: Package },
                ...(currentUser.role === 'admin' ? [{ id: 'users', label: 'Base de Usuarios', icon: Lock }] : []),
                { id: 'settings', label: 'Configuración & Marca', icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors mt-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Footer info */}
          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center space-y-1">
            <p className="font-semibold text-slate-600">{settings.companyName}</p>
            <p>CotizaFácil Pro v2.0 • Multi-usuario con aislamiento</p>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
};

