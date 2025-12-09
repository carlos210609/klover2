
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { backendService } from '../services/mockBackend';
import { useLanguage } from '../App';

// This component is now a fallback for web-based development.
// The primary authentication flow is via Telegram in App.tsx.

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      // This is a deprecated mock login. The real login is TG based.
      const tgMock = { user: { id: 12345, first_name: 'Dev', username: 'dev_user'}};
      await backendService.loginWithTelegram(tgMock);
      navigate('/');
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[85dvh] items-center justify-center p-4">
      {/* Branding */}
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-bold font-display text-k-text-primary">KLOVER</h1>
        <p className="text-sm text-k-accent tracking-[0.3em] uppercase mt-1">OMEGA</p>
      </div>

      <div className="w-full max-w-sm bg-k-surface/50 border border-k-border rounded-2xl backdrop-blur-xl p-8 shadow-2xl shadow-black/50">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-bold text-k-text-primary">Acessar Rede</h2>
            <p className="text-sm text-k-text-secondary mt-1">Insira um email para modo de teste.</p>
          </div>

          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="dev@klover.app"
            className="w-full bg-k-bg border border-k-border rounded-lg p-3 text-k-text-primary text-center focus:outline-none focus:border-k-accent focus:ring-2 focus:ring-k-accent-glow transition-all"
            required
          />

          <Button type="submit" isLoading={loading}>
            {loading ? "CONECTANDO..." : "INICIAR SESSÃO"}
          </Button>
        </form>
      </div>
      
      <div className="absolute bottom-6 text-center">
         <p className="text-xs text-k-text-tertiary font-mono">KLOVER PROTOCOL V2.0</p>
      </div>
    </div>
  );
};

export default Login;
