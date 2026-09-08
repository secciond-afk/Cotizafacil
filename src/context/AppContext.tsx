import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Client, Product, Quote, CompanySettings, QuoteStatus, NotificationItem, User, BackupSummary, BackupRestoreMode } from '../types';
import { initialClients, initialProducts, initialQuotes, initialCompanySettings, createCleanCompanySettings, initialUsers, DEFAULT_LAYOUT_SETTINGS } from '../data/initialData';
import confetti from 'canvas-confetti';

interface AppContextType {
  // Authentication & Current user
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => { success: boolean; message?: string; user?: User };

  // Users Database
  users: User[];
  currentUser: User;
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => User;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
  switchUser: (id: string) => void;

  // Scoped Data (Only for current user)
  quotes: Quote[];
  clients: Client[];
  products: Product[];
  settings: CompanySettings;
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  
  // Navigation & UI state
  activeTab: 'dashboard' | 'quotes' | 'clients' | 'products' | 'users' | 'settings' | 'editor';
  editingQuoteId: string | null;
  selectedQuoteForPreview: Quote | null;
  selectedQuoteForPrint: Quote | null;
  isMobileNavOpen: boolean;
  isUserGuideOpen: boolean;
  
  // Navigation actions
  setActiveTab: (tab: 'dashboard' | 'quotes' | 'clients' | 'products' | 'users' | 'settings' | 'editor') => void;
  setEditingQuoteId: (id: string | null) => void;
  setSelectedQuoteForPreview: (quote: Quote | null) => void;
  setSelectedQuoteForPrint: (quote: Quote | null) => void;
  setIsMobileNavOpen: (open: boolean) => void;
  setIsUserGuideOpen: (open: boolean) => void;
  openUserGuide: () => void;
  startNewQuote: (clientId?: string) => void;
  startEditQuote: (id: string) => void;
  printQuote: (quote: Quote) => void;
  
  // Quotes CRUD & Actions
  saveQuote: (quoteData: Partial<Quote>) => Quote;
  deleteQuote: (id: string) => void;
  duplicateQuote: (id: string) => Quote;
  updateQuoteStatus: (id: string, status: QuoteStatus, details?: string) => void;
  toggleFollowUpStatus: (id: string) => void;
  
  // Clients CRUD
  addClient: (clientData: Omit<Client, 'id' | 'createdAt' | 'userId'>) => Client;
  updateClient: (id: string, clientData: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  // Products CRUD
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'userId'>) => Product;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Settings
  updateSettings: (newSettings: Partial<CompanySettings>) => void;
  
  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  requestNotificationPermission: () => Promise<boolean>;
  triggerPushNotification: (title: string, body: string, quoteId?: string) => void;
  
  // Data management
  exportBackupJSON: () => void;
  parseBackupJSON: (jsonStr: string) => BackupSummary;
  importBackupData: (data: any, mode: BackupRestoreMode) => { success: boolean; message: string };
  importBackupJSON: (jsonStr: string, mode?: BackupRestoreMode) => { success: boolean; message: string };
  clearAllUserData: () => void;
  
  // Helpers
  getNextQuoteNumber: () => string;
  formatCurrency: (amount: number, customCurrency?: string, customSymbol?: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'cotizafacil_users_v2',
  CURRENT_USER_ID: 'cotizafacil_current_user_id_v2',
  AUTH_STATUS: 'cotizafacil_auth_status_v2',
  ALL_QUOTES: 'cotizafacil_all_quotes_v2',
  ALL_CLIENTS: 'cotizafacil_all_clients_v2',
  ALL_PRODUCTS: 'cotizafacil_all_products_v2',
  SETTINGS: 'cotizafacil_settings_v2',
  USER_SETTINGS: 'cotizafacil_user_settings_v2',
  NOTIFICATIONS: 'cotizafacil_notifications_v2',
  DEMO_CLEANED_FLAG: 'cotizafacil_demo_cleaned_flag_v2',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Clear any old legacy demo data on first load to ensure clean real data capture
  useEffect(() => {
    try {
      const isCleaned = localStorage.getItem(STORAGE_KEYS.DEMO_CLEANED_FLAG);
      if (!isCleaned) {
        // Clear old v1 demo keys if present
        localStorage.removeItem('cotizafacil_quotes_v1');
        localStorage.removeItem('cotizafacil_clients_v1');
        localStorage.removeItem('cotizafacil_products_v1');
        localStorage.setItem(STORAGE_KEYS.DEMO_CLEANED_FLAG, 'true');
      }
    } catch {
      // Storage error
    }
  }, []);

  // 1. Users database state
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      if (saved) {
        const parsed: User[] = JSON.parse(saved);
        // Ensure default users have passwords if missing
        return parsed.map((u) => {
          if (!u.password) {
            if (u.id === 'user-admin' || u.role === 'admin') {
              return { ...u, username: u.username || 'admin', password: 'admin123' };
            }
            return { ...u, username: u.username || u.email.split('@')[0], password: '123456' };
          }
          return u;
        });
      }
      return initialUsers;
    } catch {
      return initialUsers;
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      return saved || (users[0]?.id || initialUsers[0].id);
    } catch {
      return initialUsers[0].id;
    }
  });

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const savedAuth = localStorage.getItem(STORAGE_KEYS.AUTH_STATUS);
      // If user has visited before and marked authenticated, or default
      return savedAuth === 'true';
    } catch {
      return false;
    }
  });

  const currentUser = useMemo(() => {
    return users.find((u) => u.id === currentUserId) || users[0] || initialUsers[0];
  }, [users, currentUserId]);

  // 2. Global database records (all users)
  const [allQuotes, setAllQuotes] = useState<Quote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALL_QUOTES);
      const parsed: Quote[] = saved ? JSON.parse(saved) : initialQuotes;
      return parsed.map((q) => ({ ...q, userId: q.userId || 'user-admin' }));
    } catch {
      return initialQuotes;
    }
  });

  const [allClients, setAllClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALL_CLIENTS);
      const parsed: Client[] = saved ? JSON.parse(saved) : initialClients;
      return parsed.map((c) => ({ ...c, userId: c.userId || 'user-admin' }));
    } catch {
      return initialClients;
    }
  });

  const [allProducts, setAllProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALL_PRODUCTS);
      const parsed: Product[] = saved ? JSON.parse(saved) : initialProducts;
      return parsed.map((p) => ({ ...p, userId: p.userId || 'user-admin' }));
    } catch {
      return initialProducts;
    }
  });

  // Per-user isolated settings database
  const [userSettingsMap, setUserSettingsMap] = useState<Record<string, CompanySettings>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      if (saved) {
        return JSON.parse(saved);
      }
      const legacySaved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const adminSettings = legacySaved
        ? { ...initialCompanySettings, ...JSON.parse(legacySaved) }
        : initialCompanySettings;
      return {
        'user-admin': adminSettings,
      };
    } catch {
      return {
        'user-admin': initialCompanySettings,
      };
    }
  });

  const [allNotifications, setAllNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'quotes' | 'clients' | 'products' | 'users' | 'settings' | 'editor'>('dashboard');
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const [selectedQuoteForPreview, setSelectedQuoteForPreview] = useState<Quote | null>(null);
  const [selectedQuoteForPrint, setSelectedQuoteForPrint] = useState<Quote | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState<boolean>(false);

  const openUserGuide = () => setIsUserGuideOpen(true);

  // Sync to Storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.error('Error saving users to storage:', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
    } catch (e) {
      console.error('Error saving current user to storage:', e);
    }
  }, [currentUserId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ALL_QUOTES, JSON.stringify(allQuotes));
    } catch (e) {
      console.error('Error saving quotes to storage:', e);
    }
  }, [allQuotes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ALL_CLIENTS, JSON.stringify(allClients));
    } catch (e) {
      console.error('Error saving clients to storage:', e);
    }
  }, [allClients]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ALL_PRODUCTS, JSON.stringify(allProducts));
    } catch (e) {
      console.error('Error saving products to storage:', e);
    }
  }, [allProducts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(userSettingsMap));
    } catch (e) {
      console.error('Error saving user settings to storage:', e);
    }
  }, [userSettingsMap]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(allNotifications));
    } catch (e) {
      console.error('Error saving notifications to storage:', e);
    }
  }, [allNotifications]);

  // Current active user settings (clean & isolated for new users)
  const settings: CompanySettings = useMemo(() => {
    const userConfig = userSettingsMap[currentUserId];
    if (userConfig) {
      return {
        ...createCleanCompanySettings(currentUser),
        ...userConfig,
        layout: {
          ...DEFAULT_LAYOUT_SETTINGS,
          ...(userConfig.layout || {}),
        },
      };
    }
    if (currentUser.id === 'user-admin' || currentUser.role === 'admin') {
      return initialCompanySettings;
    }
    return createCleanCompanySettings(currentUser);
  }, [userSettingsMap, currentUserId, currentUser]);

  // DATA ISOLATION: Filter records strictly for the current logged-in user
  const quotes = useMemo(() => {
    return allQuotes.filter((q) => q.userId === currentUser.id);
  }, [allQuotes, currentUser.id]);

  const clients = useMemo(() => {
    return allClients.filter((c) => c.userId === currentUser.id);
  }, [allClients, currentUser.id]);

  const products = useMemo(() => {
    return allProducts.filter((p) => p.userId === currentUser.id);
  }, [allProducts, currentUser.id]);

  const notifications = useMemo(() => {
    return allNotifications.filter((n) => n.userId === currentUser.id);
  }, [allNotifications, currentUser.id]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // USERS ISOLATION: Admin sees all users; non-admin users only see themselves
  const visibleUsers = useMemo(() => {
    if (currentUser.role === 'admin') {
      return users;
    }
    return [currentUser];
  }, [users, currentUser]);

  // User Management
  const createUser = (userData: Omit<User, 'id' | 'createdAt'>): User => {
    // Only administrators can create new users
    if (currentUser.role !== 'admin') {
      console.warn('Solo los administradores pueden crear nuevos usuarios.');
      return currentUser;
    }
    const newId = `user-${Date.now()}`;
    const newUser: User = {
      ...userData,
      id: newId,
      username: userData.username?.trim().toLowerCase() || userData.email.split('@')[0].toLowerCase(),
      password: userData.password || '123456',
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    // Automatically set up a clean, blank settings configuration for the new user
    setUserSettingsMap((prev) => ({
      ...prev,
      [newId]: createCleanCompanySettings(newUser),
    }));
    return newUser;
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    // Non-admin users cannot change other users or escalate their role
    if (currentUser.role !== 'admin') {
      if (id !== currentUser.id) return;
      delete userData.role; // prevent role escalation
    }
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...userData } : u)));
  };

  const deleteUser = (id: string) => {
    if (users.length <= 1) {
      alert('Debe haber al menos un usuario en el sistema.');
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (currentUserId === id) {
      const remaining = users.filter((u) => u.id !== id);
      setCurrentUserId(remaining[0].id);
    }
  };

  const switchUser = (id: string) => {
    // Only administrators are allowed to switch active user accounts
    if (currentUser.role !== 'admin' && id !== currentUser.id) {
      return;
    }
    const target = users.find((u) => u.id === id);
    if (target) {
      setCurrentUserId(target.id);
      setActiveTab('dashboard');
    }
  };

  // Authentication methods
  const login = (identifier: string, pass: string): { success: boolean; message?: string } => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanId) {
      return { success: false, message: 'Por favor ingresa tu usuario o correo electrónico.' };
    }
    if (!cleanPass) {
      return { success: false, message: 'Por favor ingresa tu contraseña.' };
    }

    const matchedUser = users.find((u) => {
      const uEmail = (u.email || '').toLowerCase();
      const uName = (u.name || '').toLowerCase();
      const uUsername = (u.username || '').toLowerCase();
      return uEmail === cleanId || uUsername === cleanId || uName === cleanId;
    });

    if (!matchedUser) {
      return { success: false, message: 'No se encontró ninguna cuenta con ese usuario o correo.' };
    }

    // Verify password (fallback to default admin123 or 123456 if none stored)
    const expectedPassword = matchedUser.password || (matchedUser.role === 'admin' ? 'admin123' : '123456');
    if (cleanPass !== expectedPassword) {
      return { success: false, message: 'Contraseña incorrecta. Por favor verifica tus credenciales.' };
    }

    // Successful login
    setCurrentUserId(matchedUser.id);
    setIsAuthenticated(true);
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_STATUS, 'true');
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, matchedUser.id);
    } catch (e) {
      console.error('Error saving auth status:', e);
    }
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_STATUS, 'false');
    } catch (e) {
      console.error('Error saving auth logout:', e);
    }
    setActiveTab('dashboard');
  };

  const register = (userData: Omit<User, 'id' | 'createdAt'>): { success: boolean; message?: string; user?: User } => {
    const cleanEmail = userData.email.trim().toLowerCase();
    const cleanUsername = (userData.username || userData.email.split('@')[0]).trim().toLowerCase();

    if (!userData.name.trim()) {
      return { success: false, message: 'Por favor ingresa tu nombre completo.' };
    }
    if (!cleanEmail) {
      return { success: false, message: 'Por favor ingresa un correo electrónico válido.' };
    }
    if (!userData.password || userData.password.trim().length < 3) {
      return { success: false, message: 'La contraseña debe tener al menos 3 caracteres.' };
    }

    // Check if user/email already exists
    const exists = users.some(
      (u) =>
        u.email.toLowerCase() === cleanEmail ||
        (u.username && u.username.toLowerCase() === cleanUsername)
    );

    if (exists) {
      return { success: false, message: 'Ya existe una cuenta registrada con este correo o nombre de usuario.' };
    }

    const newId = `user-${Date.now()}`;
    const newUser: User = {
      ...userData,
      id: newId,
      username: cleanUsername,
      password: userData.password.trim(),
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    // Set clean, blank settings for the new user
    setUserSettingsMap((prev) => ({
      ...prev,
      [newId]: createCleanCompanySettings(newUser),
    }));
    setCurrentUserId(newUser.id);
    setIsAuthenticated(true);

    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_STATUS, 'true');
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, newUser.id);
    } catch (e) {
      console.error('Error saving new registration:', e);
    }

    return { success: true, user: newUser };
  };

  // Push notifications & follow-up scheduler
  useEffect(() => {
    const checkFollowUps = () => {
      const todayStr = new Date().toISOString().split('T')[0];
      const newNotifs: NotificationItem[] = [];

      quotes.forEach((q) => {
        if (q.followUpDate && q.status !== 'approved' && q.status !== 'rejected') {
          const isDue = q.followUpDate <= todayStr && !q.followUpCompleted;
          if (isDue) {
            const notifId = `notif-fu-${q.id}-${q.followUpDate}`;
            const exists = notifications.some((n) => n.id === notifId);
            if (!exists) {
              const item: NotificationItem = {
                id: notifId,
                userId: currentUser.id,
                quoteId: q.id,
                quoteNumber: q.quoteNumber,
                clientName: q.clientSnapshot?.name || 'Cliente',
                clientPhone: q.clientSnapshot?.phone || '',
                dueDate: q.followUpDate,
                title: `Recordatorio de Seguimiento: ${q.quoteNumber}`,
                message: `Seguimiento pendiente para ${q.clientSnapshot?.name || 'cliente'} (${q.clientSnapshot?.company || ''}) - Total: ${formatCurrency(q.total, q.currency, q.currencySymbol)}`,
                read: false,
                type: 'follow_up',
                createdAt: new Date().toISOString(),
              };
              newNotifs.push(item);
              triggerPushNotification(item.title, item.message, q.id);
            }
          }
        }
      });

      if (newNotifs.length > 0) {
        setAllNotifications((prev) => [...newNotifs, ...prev]);
      }
    };

    checkFollowUps();
    const interval = setInterval(checkFollowUps, 60000);
    return () => clearInterval(interval);
  }, [quotes, notifications, currentUser.id]);

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      alert('Tu navegador actual no soporta notificaciones push.');
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      updateSettings({ notificationPushEnabled: granted });
      if (granted) {
        new Notification('CotizaFácil Pro', {
          body: '¡Notificaciones push activadas correctamente para recordatorios de cotizaciones!',
          icon: '/favicon.ico',
        });
      }
      return granted;
    } catch (e) {
      console.error('Error requesting notification permission:', e);
      return false;
    }
  };

  const triggerPushNotification = (title: string, body: string, quoteId?: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
        });
        notif.onclick = () => {
          window.focus();
          if (quoteId) {
            startEditQuote(quoteId);
          }
        };
      } catch (e) {
        console.warn('Could not display push notification:', e);
      }
    }
  };

  const markNotificationRead = (id: string) => {
    setAllNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setAllNotifications((prev) =>
      prev.map((n) => (n.userId === currentUser.id ? { ...n, read: true } : n))
    );
  };

  const getNextQuoteNumber = (): string => {
    const currentYear = new Date().getFullYear();
    const prefix = `COT-${currentYear}-`;
    const matching = quotes
      .map((q) => q.quoteNumber)
      .filter((num) => num.startsWith(prefix));

    if (matching.length === 0) {
      return `${prefix}001`;
    }

    const numbers = matching.map((num) => {
      const parts = num.split('-');
      const last = parts[parts.length - 1];
      const parsed = parseInt(last, 10);
      return isNaN(parsed) ? 0 : parsed;
    });

    const maxNum = Math.max(...numbers, 0);
    const nextNum = (maxNum + 1).toString().padStart(3, '0');
    return `${prefix}${nextNum}`;
  };

  const formatCurrency = (amount: number, customCurrency?: string, customSymbol?: string): string => {
    const symbol = customSymbol || settings.defaultCurrencySymbol || '$';
    const curr = customCurrency || settings.defaultCurrency || 'USD';
    const formattedNum = new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return `${symbol}${formattedNum} ${curr}`;
  };

  const startNewQuote = (clientId?: string) => {
    setEditingQuoteId(clientId ? `new_for_${clientId}` : 'new');
    setActiveTab('editor');
  };

  const startEditQuote = (id: string) => {
    setEditingQuoteId(id);
    setActiveTab('editor');
  };

  const printQuote = (quote: Quote) => {
    setSelectedQuoteForPrint(quote);
  };

  const saveQuote = (quoteData: Partial<Quote>): Quote => {
    const isNew = !quoteData.id || quoteData.id === 'new' || quoteData.id.startsWith('new_for_');
    const now = new Date().toISOString();

    let savedQuote: Quote;

    if (isNew) {
      const newId = `quote-${Date.now()}`;
      const defaultClient = clients.find((c) => c.id === quoteData.clientId) || clients[0] || {
        id: `cli-default-${Date.now()}`,
        userId: currentUser.id,
        name: 'Cliente General',
        company: '',
        email: '',
        phone: '',
        createdAt: now,
      };
      
      savedQuote = {
        id: newId,
        userId: currentUser.id, // Scoped to current user
        quoteNumber: quoteData.quoteNumber || getNextQuoteNumber(),
        clientId: quoteData.clientId || defaultClient.id,
        clientSnapshot: quoteData.clientSnapshot || defaultClient,
        date: quoteData.date || new Date().toISOString().split('T')[0],
        expiryDate: quoteData.expiryDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        status: quoteData.status || 'draft',
        items: quoteData.items || [],
        currency: quoteData.currency || settings.defaultCurrency,
        currencySymbol: quoteData.currencySymbol || settings.defaultCurrencySymbol,
        taxEnabled: quoteData.taxEnabled !== undefined ? quoteData.taxEnabled : settings.defaultTaxEnabled,
        globalTaxRate: quoteData.globalTaxRate !== undefined ? quoteData.globalTaxRate : settings.defaultTaxRate,
        discountPercent: quoteData.discountPercent || 0,
        subtotal: quoteData.subtotal || 0,
        discountAmount: quoteData.discountAmount || 0,
        taxAmount: quoteData.taxAmount || 0,
        total: quoteData.total || 0,
        notes: quoteData.notes !== undefined ? quoteData.notes : settings.defaultNotes,
        termsAndConditions: quoteData.termsAndConditions !== undefined ? quoteData.termsAndConditions : settings.defaultTerms,
        paymentMethods: quoteData.paymentMethods !== undefined ? quoteData.paymentMethods : settings.defaultPaymentMethods,
        followUpDate: quoteData.followUpDate,
        followUpTime: quoteData.followUpTime,
        followUpNotes: quoteData.followUpNotes,
        followUpCompleted: quoteData.followUpCompleted || false,
        branding: quoteData.branding || {
          companyName: settings.companyName,
          legalName: settings.legalName,
          taxId: settings.taxId,
          email: settings.email,
          phone: settings.phone,
          website: settings.website,
          address: settings.address,
          logoUrl: settings.logoUrl,
          primaryColor: settings.primaryColor,
          accentColor: settings.accentColor,
          templateStyle: settings.templateStyle,
          showSignatureArea: settings.showSignatureArea,
          signatureTitle: settings.signatureTitle,
          signatureImage: settings.signatureImage,
          showWatermark: settings.showWatermark,
          watermarkText: settings.watermarkText,
          layout: settings.layout,
        },
        history: [
          {
            id: `h-${Date.now()}`,
            timestamp: now,
            action: 'Cotización creada',
          },
        ],
        createdAt: now,
        updatedAt: now,
      };

      setAllQuotes((prev) => [savedQuote, ...prev]);
    } else {
      const existing = allQuotes.find((q) => q.id === quoteData.id);
      if (!existing) throw new Error('Cotización no encontrada');

      const historyUpdate = [...existing.history];
      if (quoteData.status && quoteData.status !== existing.status) {
        historyUpdate.unshift({
          id: `h-${Date.now()}`,
          timestamp: now,
          action: `Estado actualizado a "${quoteData.status}"`,
        });
      }

      savedQuote = {
        ...existing,
        ...quoteData,
        userId: existing.userId || currentUser.id,
        history: historyUpdate,
        updatedAt: now,
      } as Quote;

      setAllQuotes((prev) => prev.map((q) => (q.id === savedQuote.id ? savedQuote : q)));
    }

    setEditingQuoteId(savedQuote.id);
    return savedQuote;
  };

  const deleteQuote = (id: string) => {
    setAllQuotes((prev) => prev.filter((q) => q.id !== id));
    if (editingQuoteId === id) {
      setEditingQuoteId(null);
      setActiveTab('quotes');
    }
  };

  const duplicateQuote = (id: string): Quote => {
    const source = allQuotes.find((q) => q.id === id);
    if (!source) throw new Error('Cotización no encontrada para duplicar');

    const nextNumber = getNextQuoteNumber();
    const now = new Date().toISOString();
    const duplicated: Quote = {
      ...source,
      id: `quote-${Date.now()}`,
      userId: currentUser.id,
      quoteNumber: nextNumber,
      status: 'draft',
      date: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      followUpCompleted: false,
      history: [
        {
          id: `h-${Date.now()}`,
          timestamp: now,
          action: `Duplicada a partir de ${source.quoteNumber}`,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    setAllQuotes((prev) => [duplicated, ...prev]);
    startEditQuote(duplicated.id);
    return duplicated;
  };

  const updateQuoteStatus = (id: string, status: QuoteStatus, details?: string) => {
    const target = allQuotes.find((q) => q.id === id);
    if (!target) return;

    if (status === 'approved' && target.status !== 'approved') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Confetti fallback
      }
    }

    const now = new Date().toISOString();
    const historyEntry = {
      id: `h-${Date.now()}`,
      timestamp: now,
      action: `Cambio de estado a: ${status.toUpperCase()}`,
      details,
    };

    setAllQuotes((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              status,
              history: [historyEntry, ...q.history],
              updatedAt: now,
            }
          : q
      )
    );
  };

  const toggleFollowUpStatus = (id: string) => {
    setAllQuotes((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, followUpCompleted: !q.followUpCompleted, updatedAt: new Date().toISOString() } : q
      )
    );
  };

  // Client actions
  const addClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'userId'>): Client => {
    const newClient: Client = {
      ...clientData,
      id: `cli-${Date.now()}`,
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    setAllClients((prev) => [newClient, ...prev]);
    return newClient;
  };

  const updateClient = (id: string, clientData: Partial<Client>) => {
    setAllClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...clientData } : c))
    );
  };

  const deleteClient = (id: string) => {
    setAllClients((prev) => prev.filter((c) => c.id !== id));
  };

  // Product actions
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'userId'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    setAllProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setAllProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...productData } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setAllProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateSettings = (newSettings: Partial<CompanySettings>) => {
    setUserSettingsMap((prev) => {
      const base =
        prev[currentUserId] ||
        (currentUserId === 'user-admin' || currentUser.role === 'admin'
          ? initialCompanySettings
          : createCleanCompanySettings(currentUser));
      return {
        ...prev,
        [currentUserId]: {
          ...base,
          ...newSettings,
          layout: {
            ...DEFAULT_LAYOUT_SETTINGS,
            ...(base.layout || {}),
            ...(newSettings.layout || {}),
          },
        },
      };
    });
  };

  // Data backup
  const exportBackupJSON = () => {
    const isAdmin = currentUser.role === 'admin';
    const data = {
      users: isAdmin ? users : [currentUser],
      quotes: isAdmin ? allQuotes : quotes,
      clients: isAdmin ? allClients : clients,
      products: isAdmin ? allProducts : products,
      userSettingsMap: isAdmin ? userSettingsMap : { [currentUser.id]: settings },
      settings,
      version: '2.0',
      exportedAt: new Date().toISOString(),
      exportedBy: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cleanUserName = (currentUser.name || 'Usuario').trim().replace(/\s+/g, '_');
    a.download = isAdmin
      ? `CotizaFacil_Backup_Completo_${new Date().toISOString().split('T')[0]}.json`
      : `CotizaFacil_Backup_${cleanUserName}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const parseBackupJSON = (jsonStr: string): BackupSummary => {
    try {
      const data = JSON.parse(jsonStr);
      if (!data || typeof data !== 'object') {
        return {
          valid: false,
          error: 'El archivo no contiene un objeto JSON válido.',
          data: null,
          totalQuotes: 0,
          adminQuotes: 0,
          otherQuotes: 0,
          totalClients: 0,
          adminClients: 0,
          otherClients: 0,
          totalProducts: 0,
          adminProducts: 0,
          otherProducts: 0,
          otherUsers: [],
          totalUsers: 0,
          hasOtherUsersData: false,
        };
      }

      if (!Array.isArray(data.quotes) || !Array.isArray(data.clients) || !Array.isArray(data.products)) {
        return {
          valid: false,
          error: 'El archivo JSON no contiene las listas requeridas de cotizaciones, clientes y productos.',
          data,
          totalQuotes: 0,
          adminQuotes: 0,
          otherQuotes: 0,
          totalClients: 0,
          adminClients: 0,
          otherClients: 0,
          totalProducts: 0,
          adminProducts: 0,
          otherProducts: 0,
          otherUsers: [],
          totalUsers: 0,
          hasOtherUsersData: false,
        };
      }

      const backupUsers: User[] = Array.isArray(data.users) ? data.users : [];
      // Detect admin user in backup
      const adminUser =
        backupUsers.find((u) => u.role === 'admin') ||
        (data.exportedBy?.role === 'admin'
          ? {
              id: data.exportedBy.id || 'user-admin',
              name: data.exportedBy.name || 'Administrador',
              email: data.exportedBy.email || '',
              role: 'admin' as const,
              createdAt: '',
            }
          : undefined);

      const adminId = adminUser?.id || 'user-admin';
      const otherUsers = backupUsers.filter((u) => u.id !== adminId && u.role !== 'admin');

      // Quotes breakdown
      const adminQuotes = data.quotes.filter((q: any) => (q.userId || 'user-admin') === adminId).length;
      const otherQuotes = data.quotes.length - adminQuotes;

      // Clients breakdown
      const adminClients = data.clients.filter((c: any) => (c.userId || 'user-admin') === adminId).length;
      const otherClients = data.clients.length - adminClients;

      // Products breakdown
      const adminProducts = data.products.filter((p: any) => (p.userId || 'user-admin') === adminId).length;
      const otherProducts = data.products.length - adminProducts;

      const hasOtherUsersData = otherUsers.length > 0 || otherQuotes > 0 || otherClients > 0 || otherProducts > 0;

      // Seller / Commercial user specific counts
      const isSingleUserBackup = !Array.isArray(data.users) || data.users.length <= 1;
      const backupSourceUserId = data.exportedBy?.id;

      let sellerQuotesCount = 0;
      let sellerClientsCount = 0;
      let sellerProductsCount = 0;

      if (isSingleUserBackup || (backupSourceUserId && backupSourceUserId === currentUser.id)) {
        sellerQuotesCount = data.quotes.length;
        sellerClientsCount = data.clients.length;
        sellerProductsCount = data.products.length;
      } else {
        sellerQuotesCount = data.quotes.filter((q: any) => q.userId === currentUser.id).length;
        sellerClientsCount = data.clients.filter((c: any) => c.userId === currentUser.id).length;
        sellerProductsCount = data.products.filter((p: any) => p.userId === currentUser.id).length;
        if (sellerQuotesCount === 0 && data.quotes.length > 0 && otherUsers.length === 0) {
          sellerQuotesCount = data.quotes.length;
        }
        if (sellerClientsCount === 0 && data.clients.length > 0 && otherUsers.length === 0) {
          sellerClientsCount = data.clients.length;
        }
        if (sellerProductsCount === 0 && data.products.length > 0 && otherUsers.length === 0) {
          sellerProductsCount = data.products.length;
        }
      }

      return {
        valid: true,
        data,
        exportedAt: data.exportedAt,
        exportedBy: data.exportedBy,
        version: data.version,
        totalQuotes: data.quotes.length,
        adminQuotes,
        otherQuotes,
        totalClients: data.clients.length,
        adminClients,
        otherClients,
        totalProducts: data.products.length,
        adminProducts,
        otherProducts,
        adminUser,
        otherUsers,
        totalUsers: backupUsers.length,
        hasOtherUsersData,
        sellerQuotesCount,
        sellerClientsCount,
        sellerProductsCount,
      };
    } catch (e: any) {
      return {
        valid: false,
        error: 'El archivo seleccionado no tiene un formato JSON legible: ' + (e?.message || ''),
        data: null,
        totalQuotes: 0,
        adminQuotes: 0,
        otherQuotes: 0,
        totalClients: 0,
        adminClients: 0,
        otherClients: 0,
        totalProducts: 0,
        adminProducts: 0,
        otherProducts: 0,
        otherUsers: [],
        totalUsers: 0,
        hasOtherUsersData: false,
      };
    }
  };

  const importBackupData = (data: any, mode: BackupRestoreMode = 'all'): { success: boolean; message: string } => {
    try {
      if (!data || !Array.isArray(data.quotes) || !Array.isArray(data.clients) || !Array.isArray(data.products)) {
        return { success: false, message: 'El archivo JSON no tiene la estructura requerida.' };
      }

      // 1. SELLER / COMMERCIAL USER: STRICTLY ISOLATE RESTORE TO THEIR OWN DATA ONLY
      if (currentUser.role !== 'admin' || mode === 'seller_only') {
        const backupSourceUserId = data.exportedBy?.id;
        const isSingleUserBackup = !Array.isArray(data.users) || data.users.length <= 1;

        const sellerQuotesRaw = data.quotes.filter((q: any) => {
          if (q.userId === currentUser.id) return true;
          if (backupSourceUserId && q.userId === backupSourceUserId) return true;
          if (isSingleUserBackup) return true;
          return false;
        });

        const sellerClientsRaw = data.clients.filter((c: any) => {
          if (c.userId === currentUser.id) return true;
          if (backupSourceUserId && c.userId === backupSourceUserId) return true;
          if (isSingleUserBackup) return true;
          return false;
        });

        const sellerProductsRaw = data.products.filter((p: any) => {
          if (p.userId === currentUser.id) return true;
          if (backupSourceUserId && p.userId === backupSourceUserId) return true;
          if (isSingleUserBackup) return true;
          return false;
        });

        // Re-assign all imported records strictly to currentUser.id
        const importedQuotes: Quote[] = sellerQuotesRaw.map((q: Quote) => ({ ...q, userId: currentUser.id }));
        const importedClients: Client[] = sellerClientsRaw.map((c: Client) => ({ ...c, userId: currentUser.id }));
        const importedProducts: Product[] = sellerProductsRaw.map((p: Product) => ({ ...p, userId: currentUser.id }));

        // Current records belonging to other users remain completely untouched!
        const currentOtherQuotes = allQuotes.filter((q) => q.userId !== currentUser.id);
        const currentOtherClients = allClients.filter((c) => c.userId !== currentUser.id);
        const currentOtherProducts = allProducts.filter((p) => p.userId !== currentUser.id);

        setAllQuotes([...currentOtherQuotes, ...importedQuotes]);
        setAllClients([...currentOtherClients, ...importedClients]);
        setAllProducts([...currentOtherProducts, ...importedProducts]);

        // Restore settings for this seller only
        const sellerSettings =
          data.userSettingsMap?.[currentUser.id] ||
          (backupSourceUserId && data.userSettingsMap?.[backupSourceUserId]) ||
          data.settings;

        if (sellerSettings) {
          setUserSettingsMap((prev) => ({
            ...prev,
            [currentUser.id]: sellerSettings,
          }));
        }

        return {
          success: true,
          message: `¡Restauración exitosa! Se restauró tu información personal (${importedQuotes.length} cotizaciones, ${importedClients.length} clientes, ${importedProducts.length} productos). Los registros de los demás usuarios se mantuvieron intactos.`,
        };
      }

      // 2. ADMINISTRATOR USER: CAN CHOOSE 'admin_only' OR 'all'
      const backupUsers: User[] = Array.isArray(data.users) ? data.users : [];
      const backupAdmin =
        backupUsers.find((u) => u.role === 'admin') ||
        (data.exportedBy?.role === 'admin' ? data.exportedBy : null);
      const backupAdminId = backupAdmin?.id || 'user-admin';
      const targetAdminId = currentUser.role === 'admin' ? currentUser.id : 'user-admin';

      if (mode === 'admin_only') {
        // Mode 1: Restore only admin data, keeping other users' records safe and intact
        const importedAdminQuotes = data.quotes
          .filter((q: Quote) => (q.userId || 'user-admin') === backupAdminId)
          .map((q: Quote) => ({ ...q, userId: targetAdminId }));

        const importedAdminClients = data.clients
          .filter((c: Client) => (c.userId || 'user-admin') === backupAdminId)
          .map((c: Client) => ({ ...c, userId: targetAdminId }));

        const importedAdminProducts = data.products
          .filter((p: Product) => (p.userId || 'user-admin') === backupAdminId)
          .map((p: Product) => ({ ...p, userId: targetAdminId }));

        // Current records belonging to other users (sellers)
        const currentOtherQuotes = allQuotes.filter((q) => q.userId !== targetAdminId);
        const currentOtherClients = allClients.filter((c) => c.userId !== targetAdminId);
        const currentOtherProducts = allProducts.filter((p) => p.userId !== targetAdminId);

        setAllQuotes([...currentOtherQuotes, ...importedAdminQuotes]);
        setAllClients([...currentOtherClients, ...importedAdminClients]);
        setAllProducts([...currentOtherProducts, ...importedAdminProducts]);

        // Restore admin settings if available
        const adminSettings = data.userSettingsMap?.[backupAdminId] || data.settings;
        if (adminSettings) {
          setUserSettingsMap((prev) => ({
            ...prev,
            [targetAdminId]: adminSettings,
          }));
        }

        // Update active admin profile name/company if provided, leaving other accounts untouched
        if (backupAdmin) {
          setUsers((prev) =>
            prev.map((u) =>
              u.id === targetAdminId
                ? {
                    ...u,
                    name: backupAdmin.name || u.name,
                    company: backupAdmin.company || u.company,
                    phone: backupAdmin.phone || u.phone,
                  }
                : u
            )
          );
        }

        return {
          success: true,
          message: `¡Restauración exitosa! Se restauraron solo los datos del Administrador (${importedAdminQuotes.length} cotizaciones, ${importedAdminClients.length} clientes, ${importedAdminProducts.length} productos). Los registros de los demás usuarios se mantuvieron intactos.`,
        };
      } else {
        // Mode 2: Restore all users and all data (full backup restore)
        if (backupUsers.length > 0) {
          setUsers(backupUsers);
        }
        setAllQuotes(data.quotes.map((q: Quote) => ({ ...q, userId: q.userId || 'user-admin' })));
        setAllClients(data.clients.map((c: Client) => ({ ...c, userId: c.userId || 'user-admin' })));
        setAllProducts(data.products.map((p: Product) => ({ ...p, userId: p.userId || 'user-admin' })));

        if (data.userSettingsMap) {
          setUserSettingsMap(data.userSettingsMap);
        } else if (data.settings) {
          setUserSettingsMap((prev) => ({
            ...prev,
            [targetAdminId]: data.settings,
          }));
        }

        return {
          success: true,
          message: `¡Restauración completa exitosa! Se restauraron todos los usuarios (${backupUsers.length || 1}) junto con ${data.quotes.length} cotizaciones, ${data.clients.length} clientes y ${data.products.length} productos.`,
        };
      }
    } catch (err: any) {
      return { success: false, message: 'Ocurrió un error al restaurar los datos: ' + (err?.message || String(err)) };
    }
  };

  const importBackupJSON = (jsonStr: string, mode: BackupRestoreMode = 'all'): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonStr);
      return importBackupData(parsed, mode);
    } catch {
      return { success: false, message: 'Formato de archivo inválido. Debe ser un archivo JSON.' };
    }
  };

  const clearAllUserData = () => {
    setAllQuotes((prev) => prev.filter((q) => q.userId !== currentUser.id));
    setAllClients((prev) => prev.filter((c) => c.userId !== currentUser.id));
    setAllProducts((prev) => prev.filter((p) => p.userId !== currentUser.id));
    setAllNotifications((prev) => prev.filter((n) => n.userId !== currentUser.id));
    setUserSettingsMap((prev) => ({
      ...prev,
      [currentUser.id]: createCleanCompanySettings(currentUser),
    }));
    setActiveTab('dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        register,
        users: visibleUsers,
        currentUser,
        createUser,
        updateUser,
        deleteUser,
        switchUser,
        quotes,
        clients,
        products,
        settings,
        notifications,
        unreadNotificationsCount,
        activeTab,
        editingQuoteId,
        selectedQuoteForPreview,
        selectedQuoteForPrint,
        isMobileNavOpen,
        isUserGuideOpen,
        setActiveTab,
        setEditingQuoteId,
        setSelectedQuoteForPreview,
        setSelectedQuoteForPrint,
        setIsMobileNavOpen,
        setIsUserGuideOpen,
        openUserGuide,
        startNewQuote,
        startEditQuote,
        printQuote,
        saveQuote,
        deleteQuote,
        duplicateQuote,
        updateQuoteStatus,
        toggleFollowUpStatus,
        addClient,
        updateClient,
        deleteClient,
        addProduct,
        updateProduct,
        deleteProduct,
        updateSettings,
        markNotificationRead,
        markAllNotificationsRead,
        requestNotificationPermission,
        triggerPushNotification,
        exportBackupJSON,
        parseBackupJSON,
        importBackupData,
        importBackupJSON,
        clearAllUserData,
        getNextQuoteNumber,
        formatCurrency,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
