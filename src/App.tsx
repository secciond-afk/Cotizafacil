import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginView } from './components/LoginView';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { MobileDrawer } from './components/MobileDrawer';
import { DashboardView } from './components/DashboardView';
import { QuotesListView } from './components/QuotesListView';
import { ClientsView } from './components/ClientsView';
import { ProductsView } from './components/ProductsView';
import { UsersView } from './components/UsersView';
import { SettingsView } from './components/SettingsView';
import { SalesPageView } from './components/SalesPageView';
import { QuoteEditor } from './components/QuoteEditor';
import { UserGuideModal } from './components/UserGuideModal';

const MainLayout: React.FC = () => {
  const { isAuthenticated, activeTab, editingQuoteId, setActiveTab, currentUser } = useApp();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased selection:bg-blue-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Mobile Drawer menu */}
      <MobileDrawer />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'quotes' && <QuotesListView />}
        {activeTab === 'clients' && <ClientsView />}
        {activeTab === 'products' && <ProductsView />}
        {activeTab === 'users' && <UsersView />}
        {activeTab === 'settings' && <SettingsView />}
        {activeTab === 'sales-page' && currentUser.role === 'admin' && <SalesPageView />}
        {activeTab === 'editor' && (
          <QuoteEditor
            quoteId={editingQuoteId}
            onBack={() => setActiveTab('quotes')}
          />
        )}
      </main>

      {/* Bottom Nav on Mobile (hidden when in quote editor to give maximum typing space) */}
      {activeTab !== 'editor' && <BottomNav />}

      {/* Global Interactive User Guide Modal */}
      <UserGuideModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}


