
import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { backendService } from '../services/mockBackend';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';
import { IconZap, IconStar, IconRefresh, IconUser } from '../components/Icons';
import { useLanguage } from '../App';

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    backendService.getUser()
      .then(setUser)
      .catch(() => {
        navigate('/login'); 
      });
  }, [navigate]);

  if (!user) return <div className="flex h-full items-center justify-center pt-20"><div className="animate-spin-slow text-4xl opacity-50">❖</div></div>;

  const referralLink = `https://t.me/KloverBot?start=${user.id}`;

  const copyRef = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden bg-white/5 relative group">
             <div className="absolute inset-0 bg-white/10 animate-pulse-slow"></div>
            <img src={user.photoUrl} alt="User" className="w-full h-full object-cover relative z-10" />
          </div>
          <div>
            <h1 className="text-xs text-white/60 font-mono">{t('connected_as')}</h1>
            <p className="font-bold text-white tracking-wide text-sm">{user.email.length > 20 ? user.email.substring(0,18)+'...' : user.email}</p>
          </div>
        </div>
        <div 
          onClick={() => navigate('/profile')}
          className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.1)] cursor-pointer"
        >
          {t('premium')}
        </div>
      </div>

      {/* Main Balance Card */}
      <Card className="mt-8">
        <div className="flex flex-col items-center justify-center py-6 relative">
          <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full animate-pulse-slow"></div>
          <span className="text-white/40 font-mono text-sm uppercase tracking-widest mb-2 relative z-10">{t('total_balance')}</span>
          <h2 className="text-5xl font-mono font-bold text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] relative z-10">
            ${user.balance.toFixed(4)}
          </h2>
          <div className="mt-6 w-full px-4 relative z-10">
            <Button onClick={() => navigate('/earn')}>
              <IconZap className="w-5 h-5" /> {t('start_earning')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Spins */}
        <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-2xl p-4 flex flex-col justify-between h-24 relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
            <IconRefresh className="w-10 h-10 rotate-12" />
          </div>
          <p className="text-blue-200 font-mono text-xs uppercase tracking-wider">{t('spins_avail')}</p>
          <p className="text-2xl font-bold text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
            {user.spins}
          </p>
        </div>

        {/* Points */}
        <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-2xl p-4 flex flex-col justify-between h-24 relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
            <IconStar className="w-10 h-10 rotate-12" />
          </div>
          <p className="text-purple-200 font-mono text-xs uppercase tracking-wider">{t('loyalty_pts')}</p>
          <p className="text-2xl font-bold text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
            {user.points}
          </p>
        </div>
      </div>

      {/* REFERRAL SYSTEM */}
      <div className="pt-4">
         <h3 className="text-white/40 font-mono text-xs uppercase mb-3 px-2 tracking-widest">{t('referral_prog')}</h3>
         <Card className="bg-slate-900/50">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <p className="text-sm font-bold text-white flex items-center gap-2">
                     <IconUser className="w-4 h-4 text-purple-400" />
                     {t('invite_earn')}
                   </p>
                   <p className="text-[10px] text-white/50 mt-1">{t('total_comm')}: <span className="text-green-400 font-mono">${(user.referralEarnings || 0).toFixed(4)}</span></p>
                </div>
                <div className="text-right">
                   <div className="text-[10px] text-white/30 uppercase font-mono">{t('your_link')}</div>
                </div>
             </div>
             
             <div className="flex gap-2">
                <div className="flex-1 bg-black/40 border border-white/5 rounded-lg p-2 text-xs font-mono text-white/60 truncate">
                  {referralLink}
                </div>
                <button 
                  onClick={copyRef}
                  className={`px-4 py-2 rounded-lg text-[10px] font-bold font-mono transition-colors ${copied ? 'bg-green-500 text-black' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                >
                  {copied ? t('copied') : t('copy')}
                </button>
             </div>
         </Card>
      </div>

      {/* Recent Activity Mini */}
      <div className="pt-4">
        <h3 className="text-white/40 font-mono text-xs uppercase mb-3 px-2 tracking-widest">{t('quick_actions')}</h3>
        <div 
          onClick={() => navigate('/shop')}
          className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm cursor-pointer hover:bg-white/10 transition-colors"
        >
           <span className="text-xs text-white/80 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-purple-500"></div>
             {t('shop_link')}
           </span>
           <span className="text-xs font-mono text-white/40">{t('open')} &rarr;</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
