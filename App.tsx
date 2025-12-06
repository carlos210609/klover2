import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Earn from './pages/Earn';
import Wallet from './pages/Wallet';
import History from './pages/History';

// Simple profile placeholder
const Profile = () => (
  <div className="pt-10 px-4 text-center animate-fade-in-up">
    <h2 className="text-xl font-mono mb-4">Profile Settings</h2>
    <div className="p-4 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm">
       <p className="text-sm text-white/50">Telegram ID: 12345678</p>
       <p className="text-sm text-white/50 mt-2">Version: 1.0.0 (KLOVER)</p>
       <div className="mt-4 border-t border-white/5 pt-4">
          <button className="text-xs text-red-400 opacity-60 hover:opacity-100 transition-opacity">
             Log Out
          </button>
       </div>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/earn" element={<Earn />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;