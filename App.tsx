import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Earn from './pages/Earn';
import Wallet from './pages/Wallet';
import History from './pages/History';
import Login from './pages/Login';
import { backendService } from './services/mockBackend';

// Auth Guard Component
const RequireAuth = ({ children }: { children: React.ReactElement }) => {
  const isAuthenticated = backendService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Simple profile placeholder
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
        <p className="text-sm font-bold text-white mb-1">{user.email}</p>
        <p className="text-xs text-white/50 mb-4">ID: {user.id}</p>
        <p className="text-xs text-white/50 mt-2">Version: 1.0.0 (KLOVER)</p>
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

const App: React.FC = () => {
  React.useEffect(() => {
    // Initialize Telegram Web App features if available
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      try {
        window.Telegram.WebApp.setHeaderColor('#000000');
        window.Telegram.WebApp.setBackgroundColor('#000000');
      } catch (e) {
        console.warn("Telegram theming not supported in this version");
      }
    }
  }, []);

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          } />
          <Route path="/earn" element={
            <RequireAuth>
              <Earn />
            </RequireAuth>
          } />
          <Route path="/wallet" element={
            <RequireAuth>
              <Wallet />
            </RequireAuth>
          } />
          <Route path="/history" element={
            <RequireAuth>
              <History />
            </RequireAuth>
          } />
          <Route path="/profile" element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;