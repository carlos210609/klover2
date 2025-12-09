
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Wallet from './pages/Wallet';
import History from './pages/History';
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

// --- PROFILE PAGE ---
const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const { t } = useLanguage();
  
  useEffect(() => {
    backendService.getUser().then(setUser);
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-6">
       <h1 className="text-2xl font-bold font-display text-k-text-primary">{t('profile_settings')}</h1>
      
      <div className="bg-k-surface border border-k-border rounded-xl p-6 text-center">
        <img src={user.photoUrl} alt="Avatar" className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-k-accent shadow-[0_0_15px_var(--k-accent-glow)]" />
        <p className="text-lg font-bold text-k-text-primary mb-1">
           {user.firstName}
        </p>
        <p className="text-sm text-k-text-secondary mb-4">@{user.username}</p>
        
        <div className="text-xs text-k-text-tertiary font-mono bg-k-bg p-2 rounded-md border border-k-border">
            {t('user_id')}: {user.id}
        </div>
      </div>

       <div className="grid grid-cols-2 gap-4">
           <div className="bg-k-surface p-4 rounded-xl border border-k-border text-center">
             <p className="text-xs text-k-text-secondary">{t('level')}</p>
             <p className="font-display text-2xl font-bold text-k-accent">{user.level}</p>
           </div>
           <div className="bg-k-surface p-4 rounded-xl border border-k-border text-center">
             <p className="text-xs text-k-text-secondary">{t('status')}</p>
             <p className="font-display text-2xl font-bold text-k-green">{user.status}</p>
           </div>
        </div>

      <button className="w-full text-center py-4 text-sm text-red-400 bg-red-500/10 rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-colors" onClick={() => {
        backendService.logout();
        window.location.hash = '/login';
        window.location.reload();
      }}>
        {t('disconnect')}
      </button>
    </div>
  );
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
      <Route path="/wallet" element={<RequireAuth><Wallet /></RequireAuth>} />
      <Route path="/ranking" element={<RequireAuth><Ranking /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
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
