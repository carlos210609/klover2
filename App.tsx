
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Earn from './pages/Earn';
import Wallet from './pages/Wallet';
import History from './pages/History';
import Login from './pages/Login';
import Shop from './pages/Shop';
import { backendService } from './services/mockBackend';
import { TRANSLATIONS } from './constants';
import { Language } from './types';

// --- LANGUAGE CONTEXT ---
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS.en) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export const useLanguage = () => useContext(LanguageContext);

const LanguageProvider = ({ children }: { children?: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('klover_lang');
    return (saved === 'ru' || saved === 'en') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('klover_lang', language);
  }, [language]);

  const t = (key: keyof typeof TRANSLATIONS.en) => {
    return TRANSLATIONS[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// --- AUTH GUARD ---
const RequireAuth = ({ children }: { children?: React.ReactNode }) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const check = backendService.isAuthenticated();
    setIsAuth(check);
  }, []);

  if (isAuth === null) return null; // Loading state

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// --- PROFILE COMPONENT ---
const Profile = () => {
  const [user, setUser] = React.useState<any>(null);
  const { t, setLanguage, language } = useLanguage();
  
  React.useEffect(() => {
    backendService.getUser().then(setUser).catch(() => {});
  }, []);

  if (!user) return null;

  return (
    <div className="pt-10 px-4 text-center animate-fade-in-up">
      <h2 className="text-xl font-mono mb-4 text-white">{t('profile_settings')}</h2>
      
      {/* Lang Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-white/5 border border-white/10 p-1 rounded-lg flex">
           <button 
             onClick={() => setLanguage('en')}
             className={`px-3 py-1 text-xs font-mono rounded ${language === 'en' ? 'bg-white text-black' : 'text-white/50'}`}
           >
             ENGLISH
           </button>
           <button 
             onClick={() => setLanguage('ru')}
             className={`px-3 py-1 text-xs font-mono rounded ${language === 'ru' ? 'bg-white text-black' : 'text-white/50'}`}
           >
             РУССКИЙ
           </button>
        </div>
      </div>

      <div className="p-4 border border-white/10 rounded-xl bg-slate-900/50 backdrop-blur-sm">
        <div className="w-16 h-16 rounded-full mx-auto mb-4 border border-white/20 overflow-hidden ring-2 ring-purple-500/20">
          <img src={user.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <p className="text-sm font-bold text-white mb-1">
           {user.email.startsWith('tg_') ? user.firstName : user.email}
        </p>
        <p className="text-xs text-white/50 mb-4">UID: {user.id}</p>
        
        {user.username && (
           <p className="text-xs text-cyan-400 mb-4 font-mono">@{user.username}</p>
        )}

        <div className="grid grid-cols-2 gap-2 mb-6">
           <div className="bg-black/30 p-2 rounded border border-white/5">
             <p className="text-[10px] text-white/40">{t('spins_avail')}</p>
             <p className="font-mono text-cyan-400">{user.spins}</p>
           </div>
           <div className="bg-black/30 p-2 rounded border border-white/5">
             <p className="text-[10px] text-white/40">{t('loyalty_pts')}</p>
             <p className="font-mono text-purple-400">{user.points}</p>
           </div>
        </div>

        <div className="mt-6 border-t border-white/5 pt-4">
            <button className="text-xs text-red-400 border border-red-500/20 bg-red-500/5 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors uppercase tracking-wider" onClick={() => {
              backendService.logout();
              window.location.reload();
            }}>
              {t('disconnect')}
            </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP CONTENT ---
const AppContent = () => {
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      // 1. Check if running inside Telegram
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        if (tg.platform !== 'unknown') {
            tg.ready();
            tg.expand();
            try {
                tg.setHeaderColor('#1e1b4b'); 
                tg.setBackgroundColor('#020617');
            } catch (e) {}
        }

        if (tg.initDataUnsafe?.user) {
          try {
            // Check start_param for referral
            const startParam = tg.initDataUnsafe.start_param;
            await backendService.loginWithTelegram(tg.initDataUnsafe, startParam);
            setIsInitializing(false);
            return; 
          } catch (e) {
            console.error("TG Login error", e);
          }
        }
      }

      // 3. If Web (or TG login failed), check existing session
      if (!backendService.isAuthenticated()) {
        navigate('/login');
      }
      setIsInitializing(false);
    };

    initApp();
  }, [navigate]);

  if (isInitializing) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-transparent">
        <div className="text-center">
            <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[10px] font-mono text-white/50 animate-pulse">ESTABLISHING SECURE CONNECTION...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
      <Route path="/earn" element={<RequireAuth><Earn /></RequireAuth>} />
      <Route path="/shop" element={<RequireAuth><Shop /></RequireAuth>} />
      <Route path="/wallet" element={<RequireAuth><Wallet /></RequireAuth>} />
      <Route path="/history" element={<RequireAuth><History /></RequireAuth>} />
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
