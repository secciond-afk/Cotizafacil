import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Client } from '../types';
import { ClientModal } from './ClientModal';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Building,
  MapPin,
  FileText,
  MessageSquare,
  Edit,
  Trash2,
  X,
  ExternalLink
} from 'lucide-react';

export const ClientsView: React.FC = () => {
  const {
    clients,
    quotes,
    deleteClient,
    startNewQuote,
    formatCurrency,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const term = searchTerm.trim().toLowerCase();
      if (!term) return true;
      return (
        c.name.toLowerCase().includes(term) ||
        (c.company || '').toLowerCase().includes(term) ||
        (c.taxId || '').toLowerCase().includes(term) ||
        (c.phone || '').toLowerCase().includes(term) ||
        (c.email || '').toLowerCase().includes(term) ||
        (c.notes || '').toLowerCase().includes(term) ||
        (c.address || '').toLowerCase().includes(term) ||
        (c.city || '').toLowerCase().includes(term)
      );
    });
  }, [clients, searchTerm]);

  // Calculate stats per client
  const clientStats = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {};
    quotes.forEach((q) => {
      if (!map[q.clientId]) {
        map[q.clientId] = { count: 0, total: 0 };
      }
      map[q.clientId].count += 1;
      map[q.clientId].total += q.total;
    });
    return map;
  }, [quotes]);

  const handleEdit = (client: Client) => {
    setClientToEdit(client);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setClientToEdit(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${name} de tu base de clientes?`)) {
      deleteClient(id);
    }
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hola ${name}, le saludamos de parte de nuestro equipo comercial.`);
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Base de Datos de Clientes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gestiona tu cartera de clientes, contactos y su historial de cotizaciones
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          + Nuevo Cliente
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, empresa, notas, RFC/Tax ID, teléfono o correo..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
              title="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {searchTerm && (
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
            <span>
              Mostrando <strong className="text-slate-800">{filteredClients.length}</strong> de <strong className="text-slate-800">{clients.length}</strong> clientes
            </span>
            <button
              onClick={() => setSearchTerm('')}
              className="text-blue-600 font-semibold hover:underline"
            >
              Limpiar filtro
            </button>
          </div>
        )}
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              {searchTerm ? <Search className="w-6 h-6" /> : <Users className="w-6 h-6" />}
            </div>
            <h3 className="font-bold text-slate-800 text-base">
              {searchTerm ? 'No se encontraron clientes para tu búsqueda' : 'No se encontraron clientes'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchTerm
                ? `No hay ningún cliente que coincida con "${searchTerm}". Intenta con otro término o limpia la búsqueda.`
                : 'Comienza registrando a tus clientes y prospectos para generar cotizaciones más rápido.'}
            </p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" /> Limpiar Búsqueda
              </button>
            ) : (
              <button
                onClick={handleCreate}
                className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Registrar Cliente
              </button>
            )}
          </div>
        ) : (
          filteredClients.map((client) => {
            const stats = clientStats[client.id] || { count: 0, total: 0 };
            return (
              <div
                key={client.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-tight">
                        {client.name}
                      </h3>
                      {client.company && (
                        <p className="text-xs font-semibold text-blue-600 mt-0.5">
                          {client.company}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(client)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Editar cliente"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id, client.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Eliminar cliente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 text-xs text-slate-600">
                    {client.taxId && (
                      <div className="text-[11px] font-mono bg-slate-50 px-2 py-1 rounded-lg text-slate-700">
                        RFC / Tax ID: <strong>{client.taxId}</strong>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium">{client.phone}</span>
                      </div>
                    )}
                    {client.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    {client.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{client.address}{client.city ? `, ${client.city}` : ''}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats badge */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Cotizaciones:</span>
                    <span className="font-bold text-slate-800">
                      {stats.count} ({formatCurrency(stats.total)})
                    </span>
                  </div>
                </div>

                {/* Footer Quick Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex gap-1">
                    {client.phone && (
                      <button
                        onClick={() => handleWhatsApp(client.phone, client.name)}
                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                        title="Abrir WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    )}
                    {client.email && (
                      <a
                        href={`mailto:${client.email}`}
                        className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors inline-block"
                        title="Enviar correo"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => startNewQuote(client.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Cotizar
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Client Modal */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        clientToEdit={clientToEdit}
      />
    </div>
  );
};
