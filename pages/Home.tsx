import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { backendService } from '../services/mockBackend';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';
import { IconZap, IconStar, IconRefresh } from '../components/Icons';

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    backendService.getUser()
      .then(setUser)
      .catch(() => {
        navigate('/login'); 
      });
  }, [navigate]);

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
            <h1 className="text-xs text-white/60 font-mono">Connected as</h1>
            <p className="font-bold text-white tracking-wide text-sm">{user.email.length > 20 ? user.email.substring(0,18)+'...' : user.email}</p>
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

      {/* Resources Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Spins */}
        <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-2xl p-4 flex flex-col justify-between h-24 relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
            <IconRefresh className="w-10 h-10 rotate-12" />
          </div>
          <p className="text-blue-200 font-mono text-xs uppercase tracking-wider">Spins Available</p>
          <p className="text-2xl font-bold text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
            {user.spins}
          </p>
        </div>

        {/* Points */}
        <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-2xl p-4 flex flex-col justify-between h-24 relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
            <IconStar className="w-10 h-10 rotate-12" />
          </div>
          <p className="text-purple-200 font-mono text-xs uppercase tracking-wider">Loyalty Points</p>
          <p className="text-2xl font-bold text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
            {user.points}
          </p>
        </div>
      </div>

      {/* Recent Activity Mini */}
      <div className="pt-4">
        <h3 className="text-white/40 font-mono text-xs uppercase mb-3 px-2 tracking-widest">Quick Actions</h3>
        <div 
          onClick={() => navigate('/shop')}
          className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm cursor-pointer hover:bg-white/10 transition-colors"
        >
           <span className="text-xs text-white/80 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-purple-500"></div>
             Spend Points in Shop
           </span>
           <span className="text-xs font-mono text-white/40">OPEN &rarr;</span>
        </div>
      </div>
    </div>
  );
};

export default Home;