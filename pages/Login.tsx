

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { backendService } from '../services/mockBackend';
import { IconLock } from '../components/Icons';
import { useLanguage } from '../App';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await backendService.loginWithEmail(email, referralCode || undefined);
      navigate('/');
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[85dvh] items-center justify-center animate-fade-in-up">
      {/* Branding */}
      <div className="mb-12 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full blur-[50px] animate-pulse-slow"></div>
        <h1 className="text-4xl font-mono font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">KLOVER</h1>
        <p className="text-[10px] font-mono text-white/40 tracking-[0.4em] uppercase mt-2">Premium Network</p>
      </div>

      <Card className="w-full max-w-sm border-white/20 bg-black/60 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <form onSubmit={handleLogin} className="space-y-6 py-4">
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-lg font-mono text-white uppercase tracking-wider">{t('identity_uplink')}</h2>
            <p className="text-xs text-white/40">{t('login_desc')}</p>
          </div>

          <div className="space-y-4">
            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-white/50 pl-1">{t('email_label')}</label>
              <div className="relative group">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-center font-mono placeholder-white/20 focus:outline-none focus:border-white/40 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Referral Code Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-white/50 pl-1">{t('ref_code_label')}</label>
              <div className="relative group">
                <input 
                  type="text" 
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="12345"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-center font-mono placeholder-white/20 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all duration-300 text-sm"
                />
              </div>
            </div>
          </div>

          <Button type="submit" isLoading={loading} className="mt-4 h-14">
            {loading ? t('establishing') : t('init_session')}
          </Button>

          <div className="flex items-center justify-center gap-2 pt-4 opacity-40">
            <IconLock className="w-3 h-3" />
            <span className="text-[9px] font-mono uppercase tracking-widest">{t('no_pass')}</span>
          </div>
        </form>
      </Card>
      
      <div className="absolute bottom-8 text-center">
         <p className="text-[10px] text-white/20 font-mono">SECURE PROTOCOL V.1.0.4</p>
      </div>
    </div>
  );
};

export default Login;