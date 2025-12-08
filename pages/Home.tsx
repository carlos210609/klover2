import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { backendService } from '../services/mockBackend';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';
import { IconZap, IconStar, IconRefresh, IconUser } from '../components/Icons';
import { useLanguage } from '../App';

const QUIPS = [
  "System Needs Coffee ☕",
  "Fueling Rockets 🚀",
  "Don't Spend It All! 💸",
  "Crypto Goes Brrr 📈",
  "Loading Rich Life... 📶",
  "Beep Boop I'm Rich 🤖"
];

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [copied, setCopied] = useState(false);
  const [quip, setQuip] = useState(QUIPS[0]);
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    backendService.getUser()
      .then(setUser)
      .catch(() => {
        navigate('/login'); 
      });
      
    // Random Quip
    setQuip(QUIPS[Math.floor(Math.random() * QUIPS.length)]);
  }, [navigate]);

  if (!user) return <div className="flex h-full items-center justify-center pt-20"><div className="animate-spin-slow text-4xl opacity-50">❖</div></div>;

  const referralLink = `https://t.me/KloverBot?start=${user.id}`;

  const copyRef = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      
      {/* Sarcastic Mascot Bubble */}
      <div className="flex justify-center -mb-2 animate-pop-in" style={{ animationDelay: '0.2s' }}>
         <div className="bg-white/10 backdrop-blur-md px-4 py-1 rounded-full border border-white/20 text-[10px] font-mono text-cyan-300 animate-wobble">
            {quip}
         </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-2 animate-roll-in-left">
        <div className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden bg-white/5 relative group-hover:scale-125 transition-transform duration-300 ring-2 ring-transparent group-hover:ring-cyan-400">
             <div className="absolute inset-0 bg-white/10 animate-pulse-slow"></div>
            <img src={user.photoUrl} alt="User" className="w-full h-full object-cover relative z-10" />
          </div>
          <div>
            <h1 className="text-xs text-white/60 font-mono group-hover:text-white transition-colors">{t('connected_as')}</h1>
            <p className="font-bold text-white tracking-wide text-sm">{user.email.length > 20 ? user.email.substring(0,18)+'...' : user.email}</p>
          </div>
        </div>
        <div 
          onClick={() => navigate('/profile')}
          className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.1)] cursor-pointer hover:bg-green-400/20 hover:scale-110 transition-all active:scale-90"
        >
          {t('premium')}
        </div>
      </div>

      {/* Main Balance Card - Zoom Bounce on Load */}
      <div className="animate-zoom-bounce" style={{ animationDelay: '0.1s' }}>
        <Card className="mt-8 transform transition-transform hover:rotate-1">
            <div className="flex flex-col items-center justify-center py-6 relative">
            <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full animate-pulse-slow"></div>
            <span className="text-white/40 font-mono text-sm uppercase tracking-widest mb-2 relative z-10">{t('total_balance')}</span>
            <h2 className="text-5xl font-mono font-bold text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] relative z-10 hover:scale-110 transition-transform cursor-default">
                ${user.balance.toFixed(4)}
            </h2>
            <div className="mt-6 w-full px-4 relative z-10">
                <Button onClick={() => navigate('/earn')}>
                <IconZap className="w-5 h-5 animate-pulse" /> {t('start_earning')}
                </Button>
            </div>
            </div>
        </Card>
      </div>

      {/* Resources Grid - Rolling In */}
      <div className="grid grid-cols-2 gap-4">
        {/* Spins */}
        <div className="animate-roll-in-left" style={{ animationDelay: '0.2s' }}>
            <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-2xl p-4 flex flex-col justify-between h-24 relative overflow-hidden group hover:scale-105 transition-transform duration-300">
            <div className="absolute right-0 top-0 p-2 opacity-20 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-500">
                <IconRefresh className="w-10 h-10" />
            </div>
            <p className="text-blue-200 font-mono text-xs uppercase tracking-wider">{t('spins_avail')}</p>
            <p className="text-2xl font-bold text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] group-hover:scale-125 origin-left transition-transform">
                {user.spins}
            </p>
            </div>
        </div>

        {/* Points */}
        <div className="animate-roll-in-right" style={{ animationDelay: '0.3s' }}>
            <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-2xl p-4 flex flex-col justify-between h-24 relative overflow-hidden group hover:scale-105 transition-transform duration-300">
            <div className="absolute right-0 top-0 p-2 opacity-20 group-hover:opacity-100 group-hover:animate-wobble transition-all">
                <IconStar className="w-10 h-10" />
            </div>
            <p className="text-purple-200 font-mono text-xs uppercase tracking-wider">{t('loyalty_pts')}</p>
            <p className="text-2xl font-bold text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] group-hover:scale-125 origin-left transition-transform">
                {user.points}
            </p>
            </div>
        </div>
      </div>

      {/* REFERRAL SYSTEM */}
      <div className="pt-4 animate-zoom-bounce" style={{ animationDelay: '0.4s' }}>
         <h3 className="text-white/40 font-mono text-xs uppercase mb-3 px-2 tracking-widest">{t('referral_prog')}</h3>
         <Card className="bg-slate-900/50">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <p className="text-sm font-bold text-white flex items-center gap-2 group cursor-help">
                     <IconUser className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform" />
                     {t('invite_earn')}
                   </p>
                   <p className="text-[10px] text-white/50 mt-1">{t('total_comm')}: <span className="text-green-400 font-mono">${(user.referralEarnings || 0).toFixed(4)}</span></p>
                </div>
                <div className="text-right">
                   <div className="text-[10px] text-white/30 uppercase font-mono">{t('your_link')}</div>
                </div>
             </div>
             
             <div className="flex gap-2">
                <div className="flex-1 bg-black/40 border border-white/5 rounded-lg p-2 text-xs font-mono text-white/60 truncate hover:text-white transition-colors select-all">
                  {referralLink}
                </div>
                <button 
                  onClick={copyRef}
                  className={`px-4 py-2 rounded-lg text-[10px] font-bold font-mono transition-all transform active:scale-90 ${copied ? 'bg-green-500 text-black rotate-3 scale-110' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                >
                  {copied ? t('copied') : t('copy')}
                </button>
             </div>
         </Card>
      </div>

      {/* Recent Activity Mini */}
      <div className="pt-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <h3 className="text-white/40 font-mono text-xs uppercase mb-3 px-2 tracking-widest">{t('quick_actions')}</h3>
        <div 
          onClick={() => navigate('/shop')}
          className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm cursor-pointer hover:bg-white/10 transition-all hover:scale-[1.02] group"
        >
           <span className="text-xs text-white/80 flex items-center gap-2 group-hover:translate-x-2 transition-transform">
             <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></div>
             {t('shop_link')}
           </span>
           <span className="text-xs font-mono text-white/40 group-hover:-translate-x-2 transition-transform">{t('open')} &rarr;</span>
        </div>
      </div>
    </div>
  );
};

export default Home;