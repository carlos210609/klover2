import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Earn from './pages/Earn';
import Wallet from './pages/Wallet';
import History from './pages/History';
import Login from './pages/Login';
import { backendService } from './services/mockBackend';

// Auth Guard Component
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
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

// Profile Component
const Profile = () => {
  const [user, setUser] = React.useState<any>(null);
  
  React.useEffect(() => {
    backendService.getUser().then(setUser).catch(() => {});
  }, []);

  if (!user) return null;

  return (
    <div className="pt-10 px-4 text-center animate-fade-in-up">
      <h2 className="text-xl font-mono mb-4">Profile Settings</h2>
      <div className="p-4 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm">
        <div className="w-16 h-16 rounded-full mx-auto mb-4 border border-white/20 overflow-hidden">
          <img src={user.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <p className="text-sm font-bold text-white mb-1">
           {user.email.startsWith('tg_') ? user.firstName : user.email}
        </p>
        <p className="text-xs text-white/50 mb-4">UID: {user.id}</p>
        
        {user.username && (
           <p className="text-xs text-blue-400 mb-4 font-mono">@{user.username}</p>
        )}

        <div className="mt-6 border-t border-white/5 pt-4">
            <button className="text-xs text-red-400 border border-red-500/20 bg-red-500/5 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors uppercase tracking-wider" onClick={() => {
              backendService.logout();
              window.location.reload();
            }}>
              Disconnect Session
            </button>
        </div>
      </div>
    </div>
  );
};

// Wrapper to handle Telegram Logic before Routing
const AppContent = () => {
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      // 1. Check if running inside Telegram
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        try {
            tg.setHeaderColor('#000000');
            tg.setBackgroundColor('#000000');
        } catch (e) {}

        // 2. If inside Telegram and has user data, Auto-Login
        if (tg.initDataUnsafe?.user) {
          try {
            console.log("Telegram User detected:", tg.initDataUnsafe.user);
            await backendService.loginWithTelegram(tg.initDataUnsafe);
            // If success, stay on protected routes (default)
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
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="text-center">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
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
      <Route path="/wallet" element={<RequireAuth><Wallet /></RequireAuth>} />
      <Route path="/history" element={<RequireAuth><History /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <AppContent />
      </Layout>
    </HashRouter>
  );
};

export default App;