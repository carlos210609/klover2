import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { backendService } from '../services/mockBackend';
import { REWARD_PER_AD } from '../constants';
import { IconCheck, IconZap } from '../components/Icons';

const Earn: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [lastReward, setLastReward] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Dynamically load the Ad SDK script
  useEffect(() => {
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

  const handleWatchAd = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Call the Global SDK Function (libtl)
      // We check if it exists first
      if (typeof window.show_10283220 === 'function') {
        console.log("Invoking SDK...");
        await window.show_10283220();
      } else {
        // Fallback for demo if script is blocked by CSP/Adblocker or not loaded yet
        console.warn("SDK not found or blocked. Simulating ad watch for demo purposes.");
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate ad duration
      }

      // 2. Credit Reward (Backend Call)
      const result = await backendService.creditReward();
      
      if (result.success) {
        setLastReward(Date.now());
      }

    } catch (err: any) {
      setError(err.message || "Failed to load ad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pt-10 animate-fade-in-up">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold font-mono uppercase tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Ad Terminal</h2>
        <p className="text-white/40 text-sm">Watch ads to generate crypto rewards.</p>
      </div>

      <div className="relative">
        {/* Holographic Circle Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white/5 rounded-full blur-3xl animate-pulse-slow pointer-events-none"></div>
        
        <Card className="text-center py-10 border-white/20">
          <div className="mb-6 flex justify-center">
            <div className={`w-20 h-20 rounded-full bg-black/40 flex items-center justify-center border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500 ${loading ? 'scale-110 border-white/40 shadow-[0_0_50px_rgba(255,255,255,0.2)]' : ''}`}>
               <IconZap className={`w-8 h-8 text-white transition-all duration-300 ${loading ? 'animate-pulse scale-125' : ''}`} />
            </div>
          </div>
          
          <div className="space-y-1 mb-8">
            <p className="text-xs font-mono text-white/50 uppercase tracking-widest">Reward per Ad</p>
            <p className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">${REWARD_PER_AD}</p>
          </div>

          <div className="px-8 relative z-20">
             <Button 
               onClick={handleWatchAd} 
               isLoading={loading}
               disabled={loading}
               className="h-14 text-lg"
             >
               {loading ? "ESTABLISHING UPLINK..." : "WATCH AD"}
             </Button>
          </div>

          {error && (
            <p className="mt-4 text-red-400 text-xs font-mono bg-red-500/10 py-2 px-4 rounded mx-6 border border-red-500/20 animate-fade-in-up">
              Error: {error}
            </p>
          )}

          {lastReward && !loading && !error && (
            <div className="mt-6 flex items-center justify-center gap-2 text-green-400 animate-bounce">
              <IconCheck className="w-5 h-5" />
              <span className="font-mono text-sm tracking-wide">REWARD CREDITED</span>
            </div>
          )}
        </Card>
      </div>

      <div className="px-4 text-center">
        <p className="text-[10px] text-white/30 font-mono border-t border-white/5 pt-4">
          Anti-Fraud Active: Do not use VPNs or multiple tabs.<br/>
          Rate Limit: 20 ads/hour.
        </p>
      </div>
    </div>
  );
};

export default Earn;