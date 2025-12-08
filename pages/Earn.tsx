
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { backendService } from '../services/mockBackend';
import { User } from '../types';
import { ROULETTE_PRIZES } from '../constants';
import { useLanguage } from '../App';

const Earn: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winMessage, setWinMessage] = useState<{label: string, value: number, type: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    refreshUser();
    // Dynamic Ad Script
    const existingScript = document.getElementById('libtl-sdk');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'libtl-sdk';
      script.src = '//libtl.com/sdk.js';
      script.dataset.zone = '10283220';
      script.dataset.sdk = 'show_10283220';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const refreshUser = () => {
    backendService.getUser().then(setUser);
  };

  const handleWatchAd = async () => {
    setLoading(true);
    setError(null);
    setWinMessage(null);

    try {
      if (typeof window.show_10283220 === 'function') {
        await window.show_10283220();
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      const result = await backendService.creditReward();
      if (result.success) {
        refreshUser();
      }
    } catch (err: any) {
      setError(err.message || "Failed to load ad");
    } finally {
      setLoading(false);
    }
  };

  const handleSpinWheel = async () => {
    if (!user || user.spins <= 0 || isSpinning) return;
    
    setIsSpinning(true);
    setWinMessage(null);
    setError(null);

    try {
      const result = await backendService.spinRoulette();
      
      const spinDuration = 3000;
      const extraSpins = 360 * 8; 
      const randomOffset = Math.floor(Math.random() * 360);
      setRotation(rotation + extraSpins + randomOffset);

      setTimeout(() => {
        setIsSpinning(false);
        setWinMessage({
          label: result.prize.label,
          value: result.prize.value,
          type: result.prize.type
        });
        refreshUser();
      }, spinDuration);

    } catch (err: any) {
      setIsSpinning(false);
      setError(err.message);
    }
  };

  if (!user) return null;

  const segmentSize = 360 / ROULETTE_PRIZES.length;
  const gradientString = ROULETTE_PRIZES.map((prize, i) => {
    return `${prize.color} ${i * segmentSize}deg ${(i + 1) * segmentSize}deg`;
  }).join(', ');

  return (
    <div className="space-y-6 pt-6 animate-fade-in-up pb-24">
      <div className="text-center space-y-1 relative z-10">
        <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          {t('reactor_core')}
        </h2>
        <p className="text-white/40 text-xs font-mono tracking-widest">{t('init_seq')}</p>
      </div>

      {/* REACTOR UI */}
      <div className="relative h-72 w-full flex items-center justify-center perspective-1000 overflow-visible my-6">
         
         {/* Background Pulse */}
         <div className={`absolute w-64 h-64 rounded-full bg-blue-500/10 blur-[60px] transition-all duration-300 ${isSpinning ? 'scale-125 bg-purple-500/20' : 'scale-100'}`}></div>

         {/* Outer Ring */}
         <div className="absolute w-64 h-64 rounded-full border border-white/5 animate-spin-slow opacity-30 border-dashed"></div>
         <div className="absolute w-56 h-56 rounded-full border-2 border-white/10 shadow-[0_0_30px_rgba(0,0,0,1)] bg-black/40 backdrop-blur-sm"></div>

         {/* The Wheel (Conic Gradient) */}
         <div 
           className={`relative w-48 h-48 rounded-full shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden transition-transform cubic-bezier(0.2, 0.8, 0.2, 1) ${isSpinning ? 'blur-[2px]' : 'blur-0'}`}
           style={{ 
             background: `conic-gradient(${gradientString})`,
             transform: `rotate(${rotation}deg)`,
             transitionDuration: isSpinning ? '3s' : '0s'
           }}
         >
         </div>

         {/* Center Reactor Core (Overlay) */}
         <div className="absolute w-16 h-16 rounded-full bg-slate-900 border border-white/20 z-10 flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
            <div className={`w-8 h-8 rounded-full bg-blue-400/20 blur-md ${isSpinning ? 'animate-pulse' : ''}`}></div>
            <div className="absolute w-12 h-12 rounded-full border border-white/10 animate-spin"></div>
         </div>

         {/* Pointer */}
         <div className="absolute top-[3.5rem] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[15px] border-t-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] z-20"></div>
         
         {/* WIN RESULT POPUP */}
         {winMessage && !isSpinning && (
           <div className="absolute inset-0 flex items-center justify-center z-50 animate-victory-pop">
              <div className="bg-black/90 backdrop-blur-xl border border-white/20 p-6 rounded-2xl text-center shadow-[0_0_50px_rgba(255,255,255,0.1)] transform scale-110">
                 <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-30"></div>
                 <div className="relative">
                    <p className="text-[10px] text-white/60 font-mono uppercase tracking-widest mb-1">{t('result')}</p>
                    <p className={`text-3xl font-bold ${winMessage.type === 'CASH' ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]'}`}>
                      {winMessage.label}
                    </p>
                 </div>
              </div>
           </div>
         )}
      </div>

      {/* CONTROLS */}
      <div className="space-y-4 px-4">
        <div className="relative group">
           {user.spins === 0 && (
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500/20 border border-red-500/20 text-red-200 text-[9px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wide whitespace-nowrap z-10">
               {t('core_depleted')}
             </div>
           )}
           <Button 
              onClick={handleSpinWheel}
              disabled={user.spins === 0 || isSpinning}
              className={`h-16 text-xl border-blue-500/30 font-bold tracking-widest ${user.spins > 0 ? 'bg-gradient-to-r from-blue-900/40 to-purple-900/40 text-blue-100 hover:border-blue-400/50' : 'opacity-50 grayscale'}`}
           >
              {isSpinning ? t('stabilizing') : `${t('activate')} (${user.spins})`}
           </Button>
        </div>

        <Card className="border-white/10 bg-white/5 py-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white font-bold text-sm">{t('recharge_core')}</p>
              <p className="text-white/40 text-[10px] font-mono">{t('watch_ad')}</p>
            </div>
            <Button 
              onClick={handleWatchAd}
              isLoading={loading}
              disabled={loading || isSpinning}
              className="w-auto px-4 py-2 h-9 text-[10px]"
              variant="secondary"
            >
               +1 SPIN
            </Button>
          </div>
        </Card>
      </div>

      {/* VISUAL PRIZE LEGEND */}
      <div className="px-4 pb-4">
        <h3 className="text-white/30 text-[9px] uppercase font-mono mb-3 text-center tracking-[0.2em]">{t('output_pot')}</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {ROULETTE_PRIZES.map(prize => (
            <div key={prize.id} className="flex items-center gap-1.5 bg-white/5 rounded px-2 py-1 border border-white/5">
              <div className="w-2 h-2 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: prize.color }}></div>
              <span className="text-[10px] font-mono text-white/80">{prize.label}</span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-center text-red-400 text-xs font-mono bg-red-500/10 py-2 rounded animate-fade-in-up mx-4">
          Error: {error}
        </p>
      )}
    </div>
  );
};

export default Earn;
