import React, { useState, useEffect, useCallback } from 'react';
import { backendService } from '../services/mockBackend';
import { adService } from '../services/adService';
import { User, Mission } from '../types';
import { useLanguage } from '../App';
import { LEVELS } from '../constants';
import { IconLogout, IconUser } from '../components/Icons';

// --- Helper Components ---
const UserProfilePill = ({ user, onLogout }: { user: User, onLogout: () => void }) => (
  <div className="absolute top-4 right-4 bg-k-surface/80 backdrop-blur-sm p-1.5 rounded-full flex items-center gap-2 border border-k-border animate-fade-in-up">
    <img
      src={user.photoUrl || `https://api.dicebear.com/8.x/bottts/svg?seed=${user.username}`}
      alt="User"
      className="w-8 h-8 rounded-full border-2 border-k-accent"
    />
    <div className="pr-1">
      <p className="text-sm font-bold text-k-text-primary -mb-1">{user.firstName || user.username}</p>
      <p className="text-xs text-k-text-tertiary">ID: {user.id}</p>
    </div>
     <button onClick={onLogout} className="p-2 text-k-text-secondary hover:text-k-accent transition-colors rounded-full bg-k-bg/50">
      <IconLogout />
    </button>
  </div>
);

const BalanceDisplay = ({ balance }: { balance: number }) => (
  <div className="text-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
    <p className="text-sm font-medium text-k-text-secondary">{useLanguage().t('total_balance')}</p>
    <p className="font-display text-5xl font-bold text-k-text-primary tracking-tighter">
      R$ <span className="tracking-wide">{balance.toFixed(2).replace('.', ',')}</span>
    </p>
  </div>
);

const XPBar = ({ xp, level }: { xp: number; level: number }) => {
  const currentLevelInfo = LEVELS[level - 1];
  const nextLevelInfo = LEVELS[level] || currentLevelInfo;
  const xpForNextLevel = nextLevelInfo.xpRequired - currentLevelInfo.xpRequired;
  const xpProgress = xp - currentLevelInfo.xpRequired;
  const progressPercentage = Math.max(0, Math.min(100, (xpProgress / xpForNextLevel) * 100));

  return (
    <div className="w-full max-w-sm mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      <div className="flex justify-between items-end mb-1 px-1">
        <p className="text-sm font-bold text-k-text-primary">
          {useLanguage().t('level')} <span className="font-display text-k-accent">{level}</span>
        </p>
        <p className="text-xs text-k-text-secondary">
          {xp} / {nextLevelInfo.xpRequired} XP
        </p>
      </div>
      <div className="h-2.5 w-full bg-k-surface rounded-full overflow-hidden border border-k-border">
        <div
          className="h-full bg-k-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};


// --- Main Component ---
const Home = () => {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [rewardMessage, setRewardMessage] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [userData, missionsData] = await Promise.all([
        backendService.getUser(),
        backendService.getMissions(),
      ]);
      setUser(userData);
      setMissions(missionsData.filter(m => m.type === 'DAILY' && !m.isComplete));
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  }, []);

  useEffect(() => {
    adService.initialize();
    fetchData();
  }, [fetchData]);

  const handleWatchAd = async () => {
    if (isWatchingAd) return;
    setIsWatchingAd(true);
    setRewardMessage('');

    const adShown = await adService.showRewardedAd();
    if (adShown) {
      try {
        const reward = await backendService.recordAdWatch();
        setRewardMessage(`+R$${reward.balanceGained.toFixed(2)} & ${reward.xpGained} XP!`);
        setTimeout(() => setRewardMessage(''), 3000);
        fetchData(); // Refresh user data
      } catch (error) {
        setRewardMessage('Erro ao registrar recompensa.');
        setTimeout(() => setRewardMessage(''), 3000);
      }
    }
    
    setIsWatchingAd(false);
  };

  const handleLogout = () => {
    backendService.logout();
  }

  if (!user) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-k-border border-t-k-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col items-center justify-between p-6 pt-24 relative">
      <UserProfilePill user={user} onLogout={handleLogout} />

      <div className="flex flex-col items-center gap-6 w-full">
        <BalanceDisplay balance={user.balance} />
        <XPBar xp={user.xp} level={user.level} />
      </div>

      <div className="w-full flex flex-col items-center gap-4 mt-8">
         {rewardMessage && (
            <div className="bg-k-green/10 text-k-green text-sm font-semibold py-2 px-4 rounded-lg animate-reward-reveal">
              {rewardMessage}
            </div>
          )}
        <button
          onClick={handleWatchAd}
          disabled={isWatchingAd}
          className={`w-full max-w-sm h-16 rounded-2xl font-display text-lg font-bold transition-all duration-300 transform active:scale-95
            ${isWatchingAd 
              ? 'bg-k-surface text-k-text-tertiary cursor-not-allowed' 
              : 'bg-k-accent text-k-bg shadow-[0_0_20px_var(--glow-color)] [--glow-color:theme(colors.k.accent.glow)] hover:shadow-[0_0_30px_var(--glow-color)]'
            }`}
        >
          {isWatchingAd ? (
            <div className="flex items-center justify-center gap-2">
               <div className="w-5 h-5 border-2 border-k-border border-t-k-accent rounded-full animate-spin"></div>
               {t('watching_ad')}
            </div>
          ) : (
            t('watch_and_earn')
          )}
        </button>
      </div>
    </div>
  );
};

export default Home;
