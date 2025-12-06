import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { backendService } from '../services/mockBackend';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';
import { IconZap } from '../components/Icons';

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      // Auto-login (Guest/Device ID)
      const u = await backendService.login();
      setUser(u);
    };
    loadUser();
  }, []);

  if (!user) return <div className="flex h-full items-center justify-center pt-20"><div className="animate-spin-slow text-4xl opacity-50">❖</div></div>;

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
            <h1 className="text-sm text-white/60 font-mono">Welcome back</h1>
            <p className="font-bold text-white tracking-wide">@{user.username}</p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.1)]">
          PREMIUM
        </div>
      </div>

      {/* Main Balance Card */}
      <Card className="mt-8">
        <div className="flex flex-col items-center justify-center py-6 relative">
          <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full animate-pulse-slow"></div>
          <span className="text-white/40 font-mono text-sm uppercase tracking-widest mb-2 relative z-10">Total Balance</span>
          <h2 className="text-5xl font-mono font-bold text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] relative z-10">
            ${user.balance.toFixed(4)}
          </h2>
          <div className="mt-6 w-full px-4 relative z-10">
            <Button onClick={() => navigate('/earn')}>
              <IconZap className="w-5 h-5" /> Start Earning
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card title="Total Earned">
          <p className="text-xl font-mono text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">${user.totalEarnings.toFixed(4)}</p>
        </Card>
        <Card title="Status">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-[pulse_2s_infinite]"></div>
            <p className="text-sm font-mono text-white/90">Active</p>
          </div>
        </Card>
      </div>

      {/* Recent Activity Mini */}
      <div className="pt-4">
        <h3 className="text-white/40 font-mono text-xs uppercase mb-3 px-2 tracking-widest">System</h3>
        <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm">
           <span className="text-xs text-white/60">Server Status</span>
           <span className="text-xs font-mono text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">ONLINE ●</span>
        </div>
      </div>
    </div>
  );
};

export default Home;