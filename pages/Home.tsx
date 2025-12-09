
import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import { backendService } from '../services/mockBackend';
import { User, Chest, Mission } from '../types';
import { useNavigate } from 'react-router-dom';
import { IconChevronRight } from '../components/Icons';
import { useLanguage } from '../App';
import { LEVELS, REWARDED_AD_BLOCK_ID, TELEGA_TOKEN, CHEST_DEFINITIONS } from '../constants';

// Initialize the ads controller once
const adsController = window.TelegaIn?.AdsController.create_miniapp({
    token: TELEGA_TOKEN
});

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [adLoading, setAdLoading] = useState(false);
  const [lastChest, setLastChest] = useState<Chest | null>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await backendService.getUser();
        setUser(userData);
        const missionData = await backendService.getMissions();
        setMissions(missionData.filter(m => m.type === 'DAILY'));
      } catch {
        navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  const handleWatchAd = async () => {
    if (!adsController) {
        console.error("Telega Ads SDK not initialized.");
        // Fallback for development
        alert("Development Mode: Simulating ad watch.");
        const reward = await backendService.creditAdReward();
        setLastChest(reward.chest);
        setUser(await backendService.getUser());
        return;
    }

    setAdLoading(true);
    try {
      // Per documentation, this is how you show an ad. 
      // We assume it resolves on completion.
      await adsController.ad_show({ adBlockUuid: REWARDED_AD_BLOCK_ID });
      
      // If the promise resolves without error, credit the reward
      const reward = await backendService.creditAdReward();
      setLastChest(reward.chest);
      setUser(await backendService.getUser());

    } catch (error) {
      console.error("Ad failed to show or was skipped:", error);
    } finally {
      setAdLoading(false);
    }
  };

  const handleOpenChest = () => {
    // Later, this could open a full-screen chest opening animation
    if(lastChest) {
        backendService.openChest(lastChest.id).then(async () => {
            setLastChest(null);
            setUser(await backendService.getUser());
        });
    }
  };

  if (!user) return <div className="flex h-full items-center justify-center pt-20"><div className="w-8 h-8 border-2 border-k-border border-t-k-accent rounded-full animate-spin"></div></div>;

  const levelInfo = LEVELS[user.level - 1] || LEVELS[LEVELS.length - 1];
  const nextLevelInfo = LEVELS[user.level] || null;
  const xpProgress = nextLevelInfo ? (user.xp - levelInfo.xpRequired) / (nextLevelInfo.xpRequired - levelInfo.xpRequired) * 100 : 100;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={user.photoUrl} alt="User" className="w-10 h-10 rounded-full border-2 border-k-border" />
          <div>
            <p className="font-bold text-k-text-primary leading-tight">{user.firstName}</p>
            <p className="text-xs text-k-text-tertiary font-mono">@{user.username}</p>
          </div>
        </div>
        <div className="text-right">
             <p className="text-xs text-k-text-secondary">{t('total_balance')}</p>
             <p className="text-xl font-bold font-display text-k-text-primary">
                R$ {user.balance.toFixed(2)}
             </p>
        </div>
      </header>

      {/* Level Progress Card */}
      <div className="bg-k-surface border border-k-border rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-baseline">
            <p className="text-k-text-secondary text-sm">{t('level')} <span className="font-bold text-k-text-primary font-display">{user.level}</span></p>
            {nextLevelInfo && <p className="text-xs text-k-text-tertiary font-mono">{user.xp} / {nextLevelInfo.xpRequired} XP</p>}
        </div>
        <div className="w-full bg-k-black rounded-full h-2 overflow-hidden">
            <div className="bg-k-accent h-full rounded-full" style={{ width: `${xpProgress}%` }}></div>
        </div>
      </div>

      {/* Main Action Button */}
      <div className="pt-4">
        <Button onClick={handleWatchAd} isLoading={adLoading} disabled={adLoading}>
          {adLoading ? t('watching_ad') : t('watch_and_earn')}
        </Button>
      </div>

      {/* Last Chest Won Modal (Simplified) */}
      {lastChest && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in" onClick={() => setLastChest(null)}>
              <div className="bg-k-surface border border-k-border p-8 rounded-xl text-center space-y-4 animate-pop-in w-11/12 max-w-sm" onClick={(e) => e.stopPropagation()}>
                  <p className="text-k-text-secondary uppercase text-xs tracking-widest">Você ganhou um</p>
                  <h3 className="text-2xl font-bold font-display" style={{ color: CHEST_DEFINITIONS[lastChest.rarity].color }}>
                      {CHEST_DEFINITIONS[lastChest.rarity].name}
                  </h3>
                  <Button onClick={handleOpenChest}>ABRIR BAÚ</Button>
              </div>
          </div>
      )}

      {/* Daily Missions Card */}
      <div 
        onClick={() => navigate('/missions')} 
        className="bg-k-surface border border-k-border rounded-xl p-4 group cursor-pointer hover:border-k-border-hover transition-colors"
      >
        <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-k-text-primary">{t('daily_missions')}</h3>
            <IconChevronRight className="w-5 h-5 text-k-text-tertiary group-hover:text-k-accent transition-colors" />
        </div>
        <div className="space-y-3">
            {missions.slice(0, 2).map(mission => (
                <div key={mission.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-k-bg border border-k-border rounded-md flex items-center justify-center text-k-accent">
                        <span>//</span>
                    </div>
                    <div>
                        <p className="text-sm text-k-text-primary font-medium">{mission.title}</p>
                        <p className="text-xs text-k-text-tertiary">{mission.progress} / {mission.goal}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
