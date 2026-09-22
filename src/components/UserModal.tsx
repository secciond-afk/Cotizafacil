import React, { useState, useEffect } from 'react';
import { User, UserPermissions } from '../types';
import { useApp } from '../context/AppContext';
import { DEFAULT_COMMERCIAL_PERMISSIONS } from '../data/initialData';
import {
  User as UserIcon,
  Mail,
  Building,
  Phone,
  Shield,
  X,
  Check,
  Lock,
  Eye,
  EyeOff,
  Copy,
  CheckCheck,
  Sparkles,
  Sliders,
  Percent,
  Package,
  FileSpreadsheet,
  Users as UsersGroup,
  Download
} from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: User | null;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, userToEdit }) => {
  const { createUser, updateUser, currentUser } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [copiedCredentials, setCopiedCredentials] = useState(false);

  // Granular permissions
  const [permissions, setPermissions] = useState<UserPermissions>(DEFAULT_COMMERCIAL_PERMISSIONS);
  const [activeTab, setActiveTab] = useState<'info' | 'permissions'>('info');

  const isAdmin = currentUser.role === 'admin';

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setUsername(userToEdit.username || userToEdit.email.split('@')[0]);
      setPassword(userToEdit.password || '');
      setRole(userToEdit.role);
      setStatus(userToEdit.status || 'active');
      setCompany(userToEdit.company || '');
      setPhone(userToEdit.phone || '');
      setPermissions(userToEdit.permissions || { ...DEFAULT_COMMERCIAL_PERMISSIONS });
    } else {
      setName('');
      setEmail('');
      setUsername('');
      setPassword('Comercial2026!');
      setRole('user');
      setStatus('active');
      setCompany('');
      setPhone('');
      setPermissions({ ...DEFAULT_COMMERCIAL_PERMISSIONS });
    }
    setActiveTab('info');
    setCopiedCredentials(false);
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  // Non-admins are not allowed to create new users
  if (!userToEdit && !isAdmin) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
        <div className="bg-white w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900">Acceso Restringido</h3>
          <p className="text-xs text-slate-600">
            Solo los administradores pueden registrar nuevos usuarios en el sistema.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let res = '';
    for (let i = 0; i < 10; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
    setShowPassword(true);
  };

  const handleCopyAccess = () => {
    const text = `📋 Credenciales de Acceso a CotizaFácil Pro:
👤 Nombre: ${name || 'Usuario'}
📧 Correo: ${email}
🔑 Usuario: ${username || (email ? email.split('@')[0] : '')}
🔒 Contraseña: ${password}
🛡️ Rol: ${role === 'admin' ? 'Administrador' : 'Vendedor Comercial'}
⚡ Estado: ${status === 'active' ? 'Activo (Habilitado)' : 'Inactivo (Suspendido)'}`;

    navigator.clipboard.writeText(text);
    setCopiedCredentials(true);
    setTimeout(() => setCopiedCredentials(false), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('Por favor completa al menos el nombre y el correo electrónico.');
      return;
    }

    const finalUsername = username.trim().toLowerCase() || email.split('@')[0].toLowerCase();
    const finalPassword = password.trim() || '123456';

    if (userToEdit) {
      updateUser(userToEdit.id, {
        name: name.trim(),
        email: email.trim(),
        username: finalUsername,
        password: finalPassword,
        role,
        status,
        permissions,
        company: company.trim(),
        phone: phone.trim(),
      });
    } else {
      createUser({
        name: name.trim(),
        email: email.trim(),
        username: finalUsername,
        password: finalPassword,
        role,
        status,
        permissions,
        company: company.trim(),
        phone: phone.trim(),
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95 duration-150 relative z-10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {userToEdit ? 'Editar Usuario y Accesos' : 'Crear Usuario Comercial'}
              </h3>
              <p className="text-xs text-slate-500">
                {userToEdit
                  ? 'Gestiona credenciales, estado del acceso y permisos operativos'
                  : 'Almacena un nuevo usuario en la base de datos con acceso controlado'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs for Modal */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 px-6 pt-2 gap-2 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'info'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            Datos de Acceso y Perfil
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('permissions')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'permissions'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Permisos de Operación
            {role === 'user' && (
              <span className="w-2 h-2 rounded-full bg-purple-600" />
            )}
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
          {/* Scrollable Form Body */}
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {activeTab === 'info' ? (
              <>
                {/* Account Status Toggle (Active / Inactive) */}
                {isAdmin && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Estado del Acceso al Sistema
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {status === 'active'
                          ? 'El usuario puede iniciar sesión y operar con normalidad.'
                          : 'Acceso bloqueado: el usuario no podrá iniciar sesión en CotizaFácil.'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setStatus('active')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          status === 'active'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Activo
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatus('inactive')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          status === 'inactive'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Inactivo
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Nombre Completo *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      autoFocus
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (!userToEdit && !username) {
                          const suggested = e.target.value
                            .trim()
                            .toLowerCase()
                            .normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '')
                            .replace(/[^a-z0-9]/g, '');
                          if (suggested) setUsername(suggested);
                        }
                      }}
                      placeholder="Ej. Ana Martínez"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Correo Electrónico *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ana@empresa.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Usuario de Acceso (Login)
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="ej. anamartinez"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-800">
                      Contraseña de Acceso *
                    </label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="text-[11px] text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" /> Generar Segura
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Contraseña del usuario"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Rol en el Sistema
                    </label>
                    <div className="relative">
                      <Shield className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select
                        value={role}
                        disabled={!isAdmin}
                        onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
                        className={`w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors ${
                          !isAdmin ? 'bg-slate-100 opacity-80 cursor-not-allowed' : 'bg-slate-50 cursor-pointer'
                        }`}
                      >
                        <option value="user">Vendedor / Usuario Comercial</option>
                        {isAdmin && <option value="admin">Administrador del Sistema</option>}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Teléfono / WhatsApp
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+52 55..."
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Empresa, Sucursal o Territorio (Opcional)
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Sucursal Norte / Ventas Corporativas"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Quick copy credentials block */}
                <div className="p-3.5 bg-purple-50/70 border border-purple-100 rounded-2xl flex items-center justify-between gap-3">
                  <div className="text-xs text-purple-900">
                    <span className="font-bold block">Compartir accesos:</span>
                    <span className="text-[11px] text-purple-700">
                      Copia el usuario y contraseña generados para enviárselos al comercial.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAccess}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-xs"
                  >
                    {copiedCredentials ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCredentials ? 'Copiado' : 'Copiar Accesos'}</span>
                  </button>
                </div>
              </>
            ) : (
              /* TAB: OPERATING PERMISSIONS */
              <div className="space-y-4">
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900">
                  <span className="font-bold flex items-center gap-1.5 mb-1">
                    <Shield className="w-4 h-4 text-amber-600" />
                    Control de Permisos de Usuario Comercial
                  </span>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Como administrador, puedes definir con precisión a qué funciones operativas tendrá acceso este usuario. Sus datos permanecerán siempre en su espacio aislado.
                  </p>
                </div>

                {role === 'admin' ? (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                    ℹ️ Los administradores tienen acceso irrestricto a todas las funciones y catálogos del sistema.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Permission: Manage Products */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-purple-200 transition-colors flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Package className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            Crear y Modificar Catálogo de Productos
                          </span>
                          <span className="text-[11px] text-slate-500 block mt-0.5 leading-snug">
                            Si está deshabilitado, el comercial solo podrá utilizar los productos del catálogo preexistente en modo de solo lectura.
                          </span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={permissions.canManageProducts}
                        onChange={(e) =>
                          setPermissions((prev) => ({ ...prev, canManageProducts: e.target.checked }))
                        }
                        className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer mt-1"
                      />
                    </div>

                    {/* Permission: Give Discounts & Max Limit */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-purple-200 transition-colors space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Percent className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              Aplicar Descuentos Adicionales
                            </span>
                            <span className="text-[11px] text-slate-500 block mt-0.5 leading-snug">
                              Permite al vendedor aplicar un porcentaje de descuento global en las cotizaciones generadas.
                            </span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={permissions.canGiveDiscounts}
                          onChange={(e) =>
                            setPermissions((prev) => ({ ...prev, canGiveDiscounts: e.target.checked }))
                          }
                          className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer mt-1"
                        />
                      </div>

                      {permissions.canGiveDiscounts && (
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700">
                            Límite Máximo de Descuento Autorizado (%):
                          </span>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={permissions.maxDiscountPercent}
                              onChange={(e) =>
                                setPermissions((prev) => ({
                                  ...prev,
                                  maxDiscountPercent: Math.min(100, Math.max(1, parseInt(e.target.value) || 1)),
                                }))
                              }
                              className="w-16 px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-center text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                            />
                            <span className="font-bold text-slate-500">%</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Permission: Delete Quotes */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-purple-200 transition-colors flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                          <FileSpreadsheet className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            Eliminar Cotizaciones
                          </span>
                          <span className="text-[11px] text-slate-500 block mt-0.5 leading-snug">
                            Si se desmarca, el vendedor no podrá borrar cotizaciones para preservar el historial comercial.
                          </span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={permissions.canDeleteQuotes}
                        onChange={(e) =>
                          setPermissions((prev) => ({ ...prev, canDeleteQuotes: e.target.checked }))
                        }
                        className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer mt-1"
                      />
                    </div>

                    {/* Permission: Delete Clients */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-purple-200 transition-colors flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                          <UsersGroup className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            Eliminar Clientes Registrados
                          </span>
                          <span className="text-[11px] text-slate-500 block mt-0.5 leading-snug">
                            Evita la pérdida accidental del directorio de clientes del vendedor.
                          </span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={permissions.canDeleteClients}
                        onChange={(e) =>
                          setPermissions((prev) => ({ ...prev, canDeleteClients: e.target.checked }))
                        }
                        className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer mt-1"
                      />
                    </div>

                    {/* Permission: Export Data */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-purple-200 transition-colors flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Download className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            Exportar Copias de Respaldo JSON
                          </span>
                          <span className="text-[11px] text-slate-500 block mt-0.5 leading-snug">
                            Permite al comercial descargar respaldos de sus cotizaciones y clientes.
                          </span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={permissions.canExportData}
                        onChange={(e) =>
                          setPermissions((prev) => ({ ...prev, canExportData: e.target.checked }))
                        }
                        className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer mt-1"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sticky Footer Action Buttons */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2.5 shrink-0">
            <div className="text-[11px] text-slate-500 font-medium">
              {status === 'active' ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  ● Cuenta Habilitada
                </span>
              ) : (
                <span className="text-rose-600 font-bold flex items-center gap-1">
                  ● Cuenta Deshabilitada
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-800 text-xs font-semibold hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-purple-600/30 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                {userToEdit ? 'Guardar Cambios y Accesos' : 'Crear Usuario Comercial'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
