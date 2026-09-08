import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { User } from '../types';
import { UserModal } from './UserModal';
import { ChangePasswordModal } from './ChangePasswordModal';
import {
  Users,
  UserCheck,
  Plus,
  Search,
  Shield,
  Mail,
  Phone,
  Building,
  Edit,
  Trash2,
  Lock,
  ArrowRight,
  CheckCircle2,
  FileText,
  LayoutGrid,
  List,
  UserPlus,
  KeyRound,
  ShieldCheck
} from 'lucide-react';

export const UsersView: React.FC = () => {
  const {
    users,
    currentUser,
    switchUser,
    deleteUser,
    quotes,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const term = searchTerm.toLowerCase();
      return (
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        (u.username || '').toLowerCase().includes(term) ||
        (u.company || '').toLowerCase().includes(term) ||
        (u.phone || '').toLowerCase().includes(term)
      );
    });
  }, [users, searchTerm]);

  // Quote counts per user
  const userQuoteCounts = useMemo(() => {
    const map: Record<string, number> = {};
    quotes.forEach((q) => {
      const uId = q.userId || 'user-admin';
      map[uId] = (map[uId] || 0) + 1;
    });
    return map;
  }, [quotes]);

  const handleCreate = () => {
    if (currentUser.role !== 'admin') {
      alert('Solo los administradores pueden crear nuevos usuarios.');
      return;
    }
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (users.length <= 1) {
      alert('No puedes eliminar al único usuario del sistema.');
      return;
    }
    if (window.confirm(`¿Estás seguro de eliminar al usuario ${name}? Sus cotizaciones y datos permanecerán en el sistema.`)) {
      deleteUser(id);
    }
  };

  if (currentUser.role !== 'admin') {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white font-black text-xl flex items-center justify-center shadow-md shadow-purple-600/20">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold text-slate-900">{currentUser.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                    Vendedor
                  </span>
                </div>
                <p className="text-xs text-slate-500">{currentUser.email}</p>
              </div>
            </div>

            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-purple-600/25 transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              Cambiar mi Contraseña
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Usuario de Acceso
              </span>
              <span className="font-mono font-bold text-slate-800 text-sm">
                {currentUser.username || currentUser.email.split('@')[0]}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Teléfono / WhatsApp
              </span>
              <span className="font-medium text-slate-800 text-sm">
                {currentUser.phone || 'No configurado'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Empresa o Área
              </span>
              <span className="font-medium text-slate-800 text-sm">
                {currentUser.company || 'Espacio comercial independiente'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/60 space-y-1">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Aislamiento de Datos
              </span>
              <span className="font-medium text-emerald-950 text-xs leading-relaxed block">
                Tus cotizaciones, clientes y productos son privados e independientes.
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/70 flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <span className="font-bold">Permiso restringido:</span> La creación y gestión de otros usuarios está reservada exclusivamente para cuentas con rol de Administrador. Para solicitar un nuevo usuario, contacta al administrador de tu sistema.
            </div>
          </div>
        </div>

        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-2">
            <Lock className="w-3.5 h-3.5" />
            Control de Acceso y Privacidad Multi-Usuario
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Base de Datos de Usuarios
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visualiza la tabla completa de usuarios registrados. Cada usuario gestiona de forma aislada sus propias cotizaciones, clientes y productos.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-600/25 hover:shadow-purple-600/40 transition-all cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Registrar Nuevo Usuario</span>
        </button>
      </div>

      {/* Active User Card Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/30 border border-purple-400/40 text-purple-200 flex items-center justify-center font-black text-xl shrink-0">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Sesión Activa Actualmente
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> En uso
              </span>
            </div>
            <h2 className="text-xl font-black text-white mt-0.5">
              {currentUser.name}
            </h2>
            <p className="text-xs text-purple-200">
              {currentUser.email} • Rol: <strong className="capitalize">{currentUser.role === 'admin' ? 'Administrador' : 'Vendedor'}</strong>
              {currentUser.username ? ` • Login: ${currentUser.username}` : ''}
              {currentUser.company ? ` • ${currentUser.company}` : ''}
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-xs text-purple-100 max-w-sm border border-white/10">
          <p className="font-semibold text-white mb-0.5">🔒 Modo Aislamiento Activo</p>
          <p className="text-[11px] opacity-90">
            Toda cotización, cliente o producto que crees en este momento queda asignado a <strong>{currentUser.name}</strong>.
          </p>
        </div>
      </div>

      {/* Search Toolbar & View Mode Switch */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, usuario, correo, empresa..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-slate-500 font-medium">
            {filteredUsers.length} {filteredUsers.length === 1 ? 'usuario' : 'usuarios'}
          </span>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Tabla</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Tarjetas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Content: Table or Cards */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No se encontraron usuarios</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No hay registros que coincidan con el término de búsqueda &quot;{searchTerm}&quot;.
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
          >
            Limpiar Búsqueda
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* FULL RESPONSIVE TABLE VIEW */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Nombre Completo</th>
                  <th className="py-3.5 px-4">Usuario / Login</th>
                  <th className="py-3.5 px-4">Correo Electrónico</th>
                  <th className="py-3.5 px-4">Rol</th>
                  <th className="py-3.5 px-4">Empresa / Teléfono</th>
                  <th className="py-3.5 px-4 text-center">Cotizaciones</th>
                  <th className="py-3.5 px-4 text-center">Estado</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredUsers.map((user) => {
                  const isCurrent = user.id === currentUser.id;
                  const quoteCount = userQuoteCounts[user.id] || 0;

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-purple-50/30 transition-colors ${
                        isCurrent ? 'bg-purple-50/40 font-medium' : ''
                      }`}
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                              isCurrent
                                ? 'bg-purple-600 text-white shadow-xs'
                                : 'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">
                              {user.name}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Registrado el {new Date(user.createdAt).toLocaleDateString('es-MX')}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-purple-700 bg-purple-50 px-2 py-1 rounded-lg text-xs font-semibold border border-purple-100/60 inline-flex items-center gap-1">
                          <Lock className="w-3 h-3 text-purple-500" />
                          {user.username || user.email.split('@')[0]}
                        </span>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{user.email}</span>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                            user.role === 'admin'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200/60'
                              : 'bg-blue-100 text-blue-800 border border-blue-200/60'
                          }`}
                        >
                          <Shield className="w-3 h-3" />
                          {user.role === 'admin' ? 'Administrador' : 'Vendedor'}
                        </span>
                      </td>

                      {/* Company & Phone */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          {user.company && (
                            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                              <Building className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[140px]">{user.company}</span>
                            </div>
                          )}
                          {user.phone ? (
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{user.phone}</span>
                            </div>
                          ) : (
                            !user.company && <span className="text-slate-400 text-[11px]">—</span>
                          )}
                        </div>
                      </td>

                      {/* Quote Count */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          {quoteCount}
                        </span>
                      </td>

                      {/* Session Status */}
                      <td className="py-3.5 px-4 text-center">
                        {isCurrent ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            En uso
                          </span>
                        ) : (
                          <button
                            onClick={() => switchUser(user.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 text-[11px] font-bold transition-colors cursor-pointer"
                            title="Cambiar a este usuario"
                          >
                            <span>Cambiar</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
                            title="Editar usuario"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {users.length > 1 && (
                            <button
                              onClick={() => handleDelete(user.id, user.name)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Eliminar usuario"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => {
            const isCurrent = user.id === currentUser.id;
            const quoteCount = userQuoteCounts[user.id] || 0;

            return (
              <div
                key={user.id}
                className={`rounded-3xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
                  isCurrent
                    ? 'bg-purple-50/40 border-purple-300 shadow-md ring-2 ring-purple-500/20'
                    : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-base ${
                          isCurrent
                            ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                            {user.name}
                          </h3>
                          {isCurrent && (
                            <span className="text-[10px] font-bold bg-purple-600 text-white px-2 py-0.5 rounded-full">
                              Activo
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md inline-block mt-0.5">
                          {user.role === 'admin' ? 'Administrador' : 'Vendedor'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Editar usuario"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {users.length > 1 && (
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    {user.username && (
                      <div className="flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded text-[11px]">
                          Usuario: {user.username}
                        </span>
                      </div>
                    )}
                    {user.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    {user.company && (
                      <div className="flex items-center gap-2">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{user.company}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{quoteCount} {quoteCount === 1 ? 'cotización' : 'cotizaciones'}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                    Registrado el {new Date(user.createdAt).toLocaleDateString('es-MX')}
                  </div>
                </div>

                {/* Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  {isCurrent ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" />
                      Sesión Activa
                    </span>
                  ) : (
                    <button
                      onClick={() => switchUser(user.id)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-purple-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <span>Iniciar sesión como {user.name.split(' ')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setUserToEdit(null);
        }}
        userToEdit={userToEdit}
      />
    </div>
  );
};
