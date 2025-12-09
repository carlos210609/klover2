
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Home'; // Renamed Home to Dashboard conceptually
import Wallet from './pages/Wallet';
import Markets from './pages/Ranking';
import Swap from './pages/Missions';
import Profile from './pages/Klover';
import Login from './pages/Login';
import { backendService } from './services/mockBackend';
import { TRANSLATIONS } from './constants';
import { Language } from './types';

// --- LANGUAGE CONTEXT ---
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS.pt) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'pt',
  setLanguage: () => {},
  t: (key) => key,
});

export const useLanguage = () => useContext(LanguageContext);

const LanguageProvider = ({ children }: { children?: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: keyof typeof TRANSLATIONS.pt): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// --- AUTH GUARD ---
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  return backendService.isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

// --- MAIN APP CONTENT ---
const AppContent = () => {
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        try {
            tg.setHeaderColor('#0D0D12'); 
            tg.setBackgroundColor('#0D0D12');
        } catch (e) {}

        if (tg.initDataUnsafe?.user) {
          try {
            await backendService.loginWithTelegram(tg.initDataUnsafe);
            setIsInitializing(false);
            navigate('/');
            return;
          } catch (e) {
            console.error("TG Login error", e);
          }
        }
      }

      if (!backendService.isAuthenticated()) {
        navigate('/login');
      }
      setIsInitializing(false);
    };

    initApp();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isInitializing) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-k-border border-t-k-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/markets" element={<RequireAuth><Markets /></RequireAuth>} />
      <Route path="/swap" element={<RequireAuth><Swap /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
      <Route path="/wallet/:assetId" element={<RequireAuth><Wallet /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

const App = () => {
  return (
    <LanguageProvider>
      <HashRouter>
        <Layout>
          <AppContent />
        </Layout>
      </HashRouter>
    </LanguageProvider>
  );
};

export default App;