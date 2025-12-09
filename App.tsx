
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Wallet from './pages/Wallet';
import Klover from './pages/Klover';
import Login from './pages/Login';
import Missions from './pages/Missions';
import Ranking from './pages/Ranking';
import { backendService } from './services/mockBackend';
import { TRANSLATIONS } from './constants';
import { Language, User } from './types';

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

// --- PROFILE PAGE (MOVED INTO HOME HEADER) ---
// The profile is now more integrated into the Home page header, so a separate page is not needed.

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
            await backendService.loginWithTelegram(tg.initDataUnsafe, tg.initDataUnsafe.start_param);
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
     // This loader will be replaced by the one in index.html, but serves as a fallback.
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-k-border border-t-k-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
      <Route path="/missions" element={<RequireAuth><Missions /></RequireAuth>} />
      <Route path="/klover" element={<RequireAuth><Klover /></RequireAuth>} />
      <Route path="/wallet" element={<RequireAuth><Wallet /></RequireAuth>} />
      <Route path="/ranking" element={<RequireAuth><Ranking /></RequireAuth>} />
      {/* <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} /> */}
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
