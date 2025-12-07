import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { backendService } from '../services/mockBackend';
import { IconCheck, IconZap, IconRefresh } from '../components/Icons';
import { User } from '../types';
import { ROULETTE_PRIZES } from '../constants';

const Earn: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winMessage, setWinMessage] = useState<{label: string, value: number, type: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Roulette Animation State
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
      // 1. Get Result from Backend
      const result = await backendService.spinRoulette();
      
      // 2. Calculate Visual Rotation
      // We want to spin at least 5 times (360 * 5) + random offset to land on target
      // For simplicity in this CSS implementation, we'll just spin wildly and then show result
      // Ideally, we'd map prize ID to specific degrees.
      
      const spinDuration = 3000;
      const extraSpins = 360 * 5;
      const randomOffset = Math.floor(Math.random() * 360);
      setRotation(rotation + extraSpins + randomOffset);

      // 3. Wait for animation
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

  return (
    <div className="space-y-6 pt-6 animate-fade-in-up pb-24">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold font-mono uppercase tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Lucky Protocol</h2>
        <p className="text-white/40 text-xs">Watch Ads • Earn Spins • Win Crypto</p>
      </div>

      {/* ROULETTE SECTION */}
      <div className="relative h-64 w-full flex items-center justify-center perspective-1000 overflow-visible mt-8 mb-8">
         {/* Roulette Glow */}
         <div className="absolute w-56 h-56 rounded-full bg-blue-500/10 blur-3xl animate-pulse-slow"></div>
         
         {/* The Wheel */}
         <div 
           className="relative w-48 h-48 rounded-full border-4 border-white/10 bg-black shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden transition-transform cubic-bezier(0.2, 0.8, 0.2, 1)"
           style={{ 
             transform: `rotate(${rotation}deg)`,
             transitionDuration: isSpinning ? '3s' : '0s'
           }}
         >
            {/* Segments (Visual representation) */}
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="absolute w-full h-0.5 bg-white/10 rotate-0"></div>
               <div className="absolute w-full h-0.5 bg-white/10 rotate-45"></div>
               <div className="absolute w-full h-0.5 bg-white/10 rotate-90"></div>
               <div className="absolute w-full h-0.5 bg-white/10 rotate-135"></div>
               {/* Center Hub */}
               <div className="absolute w-8 h-8 rounded-full bg-white/20 backdrop-blur-md z-10 border border-white/30"></div>
            </div>
            
            {/* Colors (Abstract) */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/20"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-purple-500/20"></div>
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-green-500/20"></div>
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-red-500/20"></div>
         </div>

         {/* Pointer */}
         <div className="absolute top-1/2 right-[calc(50%-100px)] -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
         
         {/* Result Overlay */}
         {winMessage && !isSpinning && (
           <div className="absolute inset-0 flex items-center justify-center z-20 animate-fade-in-up">
              <div className="bg-black/80 backdrop-blur-md border border-white/20 p-4 rounded-xl text-center shadow-2xl transform scale-110">
                 <p className="text-xs text-white/60 font-mono uppercase">You Won</p>
                 <p className={`text-2xl font-bold ${winMessage.type === 'CASH' ? 'text-green-400' : 'text-purple-400'}`}>
                   {winMessage.label}
                 </p>
              </div>
           </div>
         )}
      </div>

      {/* CONTROLS */}
      <div className="space-y-4 px-2">
        {/* Spin Button */}
        <div className="relative group">
           {user.spins === 0 && (
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500/20 border border-red-500/20 text-red-200 text-[9px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wide whitespace-nowrap z-10">
               Out of Spins
             </div>
           )}
           <Button 
              onClick={handleSpinWheel}
              disabled={user.spins === 0 || isSpinning}
              className={`h-16 text-xl border-blue-500/30 ${user.spins > 0 ? 'bg-blue-600/10 text-blue-400 hover:bg-blue-600/20' : 'opacity-50 grayscale'}`}
           >
              {isSpinning ? "CALCULATING..." : `SPIN WHEEL (${user.spins})`}
           </Button>
        </div>

        {/* Ad Button */}
        <Card className="border-white/10 bg-white/5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white font-bold text-sm">Get More Spins</p>
              <p className="text-white/40 text-xs">Watch a short ad to recharge.</p>
            </div>
            <Button 
              onClick={handleWatchAd}
              isLoading={loading}
              disabled={loading || isSpinning}
              className="w-auto px-6 py-2 h-10 text-xs"
              variant="secondary"
            >
               +1 SPIN
            </Button>
          </div>
        </Card>
      </div>

      {/* PRIZE LIST */}
      <div className="px-4">
        <h3 className="text-white/30 text-[10px] uppercase font-mono mb-2 text-center tracking-widest">Possible Rewards</h3>
        <div className="grid grid-cols-3 gap-2">
          {ROULETTE_PRIZES.map(prize => (
            <div key={prize.id} className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
              <p className="font-bold text-xs" style={{ color: prize.color }}>{prize.label}</p>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-center text-red-400 text-xs font-mono bg-red-500/10 py-2 rounded animate-fade-in-up">
          {error}
        </p>
      )}
    </div>
  );
};

export default Earn;