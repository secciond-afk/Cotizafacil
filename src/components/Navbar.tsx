import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserModal } from './UserModal';
import { ChangePasswordModal } from './ChangePasswordModal';
import {
  FileText,
  Plus,
  Bell,
  Check,
  Building,
  Menu,
  X,
  ExternalLink,
  MessageSquare,
  Clock,
  ChevronRight,
  ShieldCheck,
  User as UserIcon,
  Users,
  ChevronDown,
  Lock,
  LogOut,
  UserPlus,
  CheckCircle2,
  KeyRound,
  BookOpen
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    settings,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    startNewQuote,
    startEditQuote,
    activeTab,
    setActiveTab,
    isMobileNavOpen,
    setIsMobileNavOpen,
    users,
    currentUser,
    switchUser,
    logout,
    openUserGuide,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Abrir menú"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:scale-105 transition-transform"
              style={{ backgroundColor: settings.primaryColor || '#1e40af' }}
            >
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt="Logo"
                  className="max-h-8 max-w-8 object-contain"
                />
              ) : (
                <FileText className="w-5 h-5" />
              )}
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight block leading-tight">
                CotizaFácil <span className="text-blue-600">Pro</span>
              </span>
              <span className="text-[10px] font-medium text-slate-400 block truncate max-w-[140px] sm:max-w-[200px]">
                {settings.companyName || 'Cotizaciones Profesionales'}
              </span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation Pills */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl">
          {[
            { id: 'dashboard', label: 'Tablero' },
            { id: 'quotes', label: 'Cotizaciones' },
            { id: 'clients', label: 'Clientes' },
            { id: 'products', label: 'Catálogo' },
            ...(currentUser.role === 'admin' ? [
              { id: 'users', label: 'Usuarios' },
              { id: 'sales-page', label: 'Página de Ventas' },
            ] : []),
            { id: 'settings', label: 'Configuración' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === item.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right: User Guide, Notification Bell, User Switcher & Quick Create Button */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* User Guide Button */}
          <button
            onClick={openUserGuide}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-2xl bg-blue-50 hover:bg-blue-100/80 text-blue-700 font-bold text-xs border border-blue-200/70 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
            title="Abrir Guía de Uso con imágenes ilustrativas"
          >
            <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="hidden sm:inline">Guía de Uso</span>
          </button>

          {/* Notification Tray Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsUserMenuOpen(false);
              }}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
              title="Recordatorios de seguimiento"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 p-4 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      Recordatorios de Seguimiento
                    </span>
                  </div>
                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] font-bold text-blue-600 hover:underline"
                    >
                      Marcar leídas
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 -mx-2 px-2">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs space-y-1">
                      <p>No tienes recordatorios pendientes.</p>
                      <p className="text-[10px] text-slate-400">
                        Programa fechas de seguimiento en tus cotizaciones para recibir alertas automáticas.
                      </p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`py-3 transition-colors ${notif.read ? 'opacity-70' : 'bg-amber-50/40 rounded-xl p-2.5 my-1'}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-slate-900 text-xs">{notif.title}</h4>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            {notif.dueDate}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-snug">
                          {notif.message}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <button
                            onClick={() => {
                              startEditQuote(notif.quoteId);
                              setIsNotifOpen(false);
                              markNotificationRead(notif.id);
                            }}
                            className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                          >
                            Abrir Cotización <ChevronRight className="w-3 h-3" />
                          </button>
                          {!notif.read && (
                            <button
                              onClick={() => markNotificationRead(notif.id)}
                              className="text-[11px] text-slate-400 hover:text-slate-600"
                            >
                              Leído
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account / Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsUserMenuOpen(!isUserMenuOpen);
                setIsNotifOpen(false);
              }}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200/70 transition-colors cursor-pointer"
              title={currentUser.role === 'admin' ? 'Perfil y cambio de usuario' : `Mi cuenta: ${currentUser.name}`}
            >
              <div className="w-6 h-6 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <span className="font-bold block leading-tight max-w-[90px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="text-[9px] text-purple-600 font-medium block leading-none">
                  {currentUser.role === 'admin' ? 'Admin' : 'Vendedor'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 p-4 space-y-3 animate-in fade-in">
                <div className="pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-black text-base flex items-center justify-center shadow-sm">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                          {currentUser.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                      {currentUser.role === 'admin' ? 'Administrador' : 'Vendedor'}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Espacio aislado activo
                    </span>
                  </div>
                </div>

                {/* Users List to Switch - strictly visible for Administrators only */}
                {currentUser.role === 'admin' && users.length > 1 && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Cambiar Usuario ({users.length})
                      </span>
                      <button
                        onClick={() => {
                          setActiveTab('users');
                          setIsUserMenuOpen(false);
                        }}
                        className="text-[11px] font-bold text-purple-600 hover:underline cursor-pointer"
                      >
                        Gestionar todos
                      </button>
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-1 -mx-1 px-1">
                      {users.map((u) => {
                        const isCurrent = u.id === currentUser.id;
                        return (
                          <button
                            key={u.id}
                            onClick={() => {
                              switchUser(u.id);
                              setIsUserMenuOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                              isCurrent
                                ? 'bg-purple-50 text-purple-900 font-bold'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                                   isCurrent ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <span className="text-xs truncate block">{u.name}</span>
                                <span className="text-[10px] text-slate-400 truncate block">
                                  {u.email}
                                </span>
                              </div>
                            </div>

                            {isCurrent && <Check className="w-4 h-4 text-purple-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      openUserGuide();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-blue-50/80 hover:bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    Guía de Uso & Tutorial
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsPasswordModalOpen(true);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-purple-50/70 hover:bg-purple-100/90 text-purple-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-purple-600" />
                    Cambiar Contraseña
                  </button>

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsNewUserModalOpen(true);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-slate-500" />
                      + Registrar Nuevo Usuario
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full py-2 px-3 rounded-xl hover:bg-rose-50 text-rose-600 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Create Quote Button */}
          <button
            onClick={() => startNewQuote()}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-blue-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nueva Cotización</span>
          </button>
        </div>
      </div>
    </header>

    {/* Modals rendered outside header */}
    <ChangePasswordModal
      isOpen={isPasswordModalOpen}
      onClose={() => setIsPasswordModalOpen(false)}
    />

    {currentUser.role === 'admin' && (
      <UserModal
        isOpen={isNewUserModalOpen}
        onClose={() => setIsNewUserModalOpen(false)}
      />
    )}
  </>
  );
};
