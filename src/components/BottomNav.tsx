import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, FileText, Users, Package, Settings, Plus } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, startNewQuote } = useApp();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg flex items-center justify-around">
      <button
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors ${
          activeTab === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-500'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Tablero</span>
      </button>

      <button
        onClick={() => setActiveTab('quotes')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors ${
          activeTab === 'quotes' ? 'text-blue-600 font-bold' : 'text-slate-500'
        }`}
      >
        <FileText className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Cotizaciones</span>
      </button>

      {/* Floating Center Action Button */}
      <button
        onClick={() => startNewQuote()}
        className="w-12 h-12 -mt-5 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 hover:scale-105 active:scale-95 transition-all"
        aria-label="Nueva Cotización"
      >
        <Plus className="w-6 h-6" />
      </button>

      <button
        onClick={() => setActiveTab('clients')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors ${
          activeTab === 'clients' ? 'text-blue-600 font-bold' : 'text-slate-500'
        }`}
      >
        <Users className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Clientes</span>
      </button>

      <button
        onClick={() => setActiveTab('settings')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors ${
          activeTab === 'settings' ? 'text-blue-600 font-bold' : 'text-slate-500'
        }`}
      >
        <Settings className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Ajustes</span>
      </button>
    </div>
  );
};
