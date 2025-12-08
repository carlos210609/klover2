import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { backendService } from '../services/mockBackend';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';
import { IconZap, IconStar, IconRefresh, IconUser, IconShop } from '../components/Icons';
import { useLanguage } from '../App';

const QUIPS = [
  "SYSTEM ONLINE //",
  "PROTOCOL: WEALTH //",
  "CRYPTO MINING... //",
  "UPLINK SECURE //",
  "LOADING ASSETS //",
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

  if (!user) return <div className="flex h-full items-center justify-center pt-20"><div className="animate-spin-slow text-4xl opacity-50 text-cyan-500">❖</div></div>;

  const referralLink = `https://t.me/KloverBot?start=${user.id}`;

  const copyRef = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      
      {/* Header Profile Chip */}
      <div className="flex justify-between items-center animate-fade-in-up">
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full pl-1 pr-4 py-1 backdrop-blur-md">
          <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden relative">
            <img src={user.photoUrl} alt="User" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-tech text-white/50 leading-none">ID-{user.id.toString().slice(0,6)}</span>
            <span className="text-xs font-bold text-white leading-none tracking-wide">{user.email.split('@')[0]}</span>
          </div>
        </div>
        
        <div 
          onClick={() => navigate('/profile')}
          className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <div className="w-4 h-0.5 bg-current rounded-full mb-0.5"></div>
          <div className="w-4 h-0.5 bg-current rounded-full"></div>
        </div>
      </div>

      {/* Sarcastic Mascot Bubble */}
      <div className="flex justify-start px-2 -mb-2 animate-pulse-slow">
         <span className="text-[10px] font-tech text-cyan-400/80 tracking-widest uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></span>
            {quip}
         </span>
      </div>

      {/* Holographic Balance Card */}
      <div className="animate-zoom-bounce" style={{ animationDelay: '0.1s' }}>
        <div className="relative w-full aspect-[1.8/1] rounded-2xl overflow-hidden group perspective-1000">
           {/* Card Background */}
           <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0B1121] to-black border border-white/10 rounded-2xl"></div>
           
           {/* Holographic Mesh */}
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900 via-transparent to-transparent"></div>
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
           
           {/* Animated Shine */}
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer skew-x-12"></div>

           {/* Content */}
           <div className="relative h-full p-6 flex flex-col justify-between z-10">
              <div className="flex justify-between items-start">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-tech text-white/40 uppercase tracking-[0.2em] mb-1">{t('total_balance')}</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-mono font-bold text-white tracking-tighter drop-shadow-lg">${Math.floor(user.balance)}</span>
                        <span className="text-2xl font-mono text-white/60">.{(user.balance % 1).toFixed(4).substring(2)}</span>
                    </div>
                 </div>
                 <IconZap className="w-6 h-6 text-cyan-400 animate-pulse-slow" />
              </div>

              {/* Data Decoration */}
              <div className="w-full h-px bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 my-2"></div>

              <div className="flex justify-between items-end">
                 <div className="flex gap-4">
                    <div className="flex flex-col">
                       <span className="text-[9px] text-white/30 font-mono">EARNINGS</span>
                       <span className="text-xs text-green-400 font-mono">+0.5%</span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[9px] text-white/30 font-mono">STATUS</span>
                       <span className="text-xs text-white font-mono">ACTIVE</span>
                    </div>
                 </div>
                 <Button 
                   onClick={() => navigate('/earn')} 
                   className="!w-auto !py-2 !px-4 !text-xs !bg-cyan-500 !text-black !font-bold hover:!shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                 >
                   {t('start_earning')}
                 </Button>
              </div>
           </div>
        </div>
      </div>

      {/* Resources Grid - Rolling In */}
      <div className="grid grid-cols-2 gap-3">
        {/* Spins */}
        <div className="animate-roll-in-left" style={{ animationDelay: '0.2s' }}>
            <div className="bg-[#0f172a]/50 border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-28 relative overflow-hidden group hover:border-blue-500/30 transition-all">
               <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="flex justify-between items-start relative z-10">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                     <IconRefresh className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
                  </div>
                  <span className="text-[10px] font-tech text-white/30">LUCK-SYS</span>
               </div>
               <div className="relative z-10">
                  <p className="text-2xl font-bold text-white font-mono">{user.spins}</p>
                  <p className="text-[10px] text-blue-300 uppercase tracking-wider">{t('spins_avail')}</p>
               </div>
            </div>
        </div>

        {/* Points */}
        <div className="animate-roll-in-right" style={{ animationDelay: '0.3s' }}>
            <div className="bg-[#0f172a]/50 border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-28 relative overflow-hidden group hover:border-purple-500/30 transition-all">
               <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="flex justify-between items-start relative z-10">
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                     <IconStar className="w-5 h-5 group-hover:animate-wobble" />
                  </div>
                  <span className="text-[10px] font-tech text-white/30">LOYALTY</span>
               </div>
               <div className="relative z-10">
                  <p className="text-2xl font-bold text-white font-mono">{user.points}</p>
                  <p className="text-[10px] text-purple-300 uppercase tracking-wider">{t('loyalty_pts')}</p>
               </div>
            </div>
        </div>
      </div>

      {/* REFERRAL SYSTEM - Mission Card Style */}
      <div className="pt-2 animate-zoom-bounce" style={{ animationDelay: '0.4s' }}>
         <Card className="!bg-[#0f172a] !border-white/10 !p-0 overflow-hidden">
             <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                   <h3 className="text-xs font-bold text-white uppercase tracking-wider">{t('referral_prog')}</h3>
                </div>
                <span className="text-[10px] font-mono text-green-400 border border-green-500/20 bg-green-500/10 px-2 py-0.5 rounded">
                   +30% COMM
                </span>
             </div>
             
             <div className="p-4 space-y-4">
                <div className="flex justify-between text-xs font-mono">
                   <span className="text-white/40">{t('total_comm')}</span>
                   <span className="text-white">${(user.referralEarnings || 0).toFixed(4)}</span>
                </div>
                
                <div className="flex gap-2">
                    <div className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white/70 truncate flex items-center">
                      <span className="opacity-50 mr-2 select-none">$</span> {referralLink}
                    </div>
                    <button 
                      onClick={copyRef}
                      className={`px-4 rounded-lg text-xs font-bold font-mono transition-all uppercase ${copied ? 'bg-green-500 text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                      {copied ? '✓' : t('copy')}
                    </button>
                </div>
             </div>
         </Card>
      </div>

      {/* Recent Activity Mini */}
      <div className="pt-2 pb-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <div 
          onClick={() => navigate('/shop')}
          className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-white/5 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm cursor-pointer hover:border-white/20 transition-all group"
        >
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                 <IconShop className="w-4 h-4 text-white/70" />
              </div>
              <div className="flex flex-col">
                 <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">{t('black_market')}</span>
                 <span className="text-[10px] text-white/40">{t('shop_link')}</span>
              </div>
           </div>
           <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <span className="text-[10px] text-white/50">&rarr;</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Home;