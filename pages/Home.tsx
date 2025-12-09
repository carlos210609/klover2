
import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import { backendService } from '../services/mockBackend';
import { User, Chest, Mission } from '../types';
import { useNavigate } from 'react-router-dom';
import { IconChevronRight, IconChest, IconProfile } from '../components/Icons';
import { useLanguage } from '../App';
import { LEVELS, REWARDED_AD_BLOCK_ID, TELEGA_TOKEN, CHEST_DEFINITIONS } from '../constants';

// Initialize the ads controller once
const adsController = window.TelegaIn?.AdsController.create_miniapp({
    token: TELEGA_TOKEN
});

// Chest Opening Animation Component
const ChestOpeningOverlay = ({ chest, reward, onClose }: { chest: Chest; reward: { amount: number; currency: string } | null; onClose: () => void; }) => {
    const chestInfo = CHEST_DEFINITIONS[chest.rarity];
    const isRevealed = reward !== null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-fade-in p-4">
            <div className="w-full max-w-sm text-center">
                {/* Reward View */}
                {isRevealed && reward && (
                    <div className="animate-reward-reveal space-y-6">
                        <p className="text-xl text-k-text-secondary">Você recebeu:</p>
                        <p className="text-5xl font-bold font-display text-k-green">
                            + {reward.currency === 'BRL' ? 'R$ ' : ''}{reward.amount.toFixed(2)}
                        </p>
                        <Button onClick={onClose} className="!w-auto px-10 mx-auto">CONTINUAR</Button>
                    </div>
                )}

                {/* Chest View */}
                {!isRevealed && (
                    <div className="space-y-4">
                        <div className="relative animate-shake">
                            <div 
                                className="absolute -inset-8 blur-3xl rounded-full" 
                                style={{ 
                                    background: chestInfo.color.includes('gradient') 
                                        ? chestInfo.color 
                                        : chestInfo.color,
                                    opacity: 0.4
                                }}
                            ></div>
                            <IconChest className="w-40 h-40 mx-auto text-k-text-primary drop-shadow-2xl" />
                        </div>
                        <h3 className="text-2xl font-bold font-display animate-pop-in" style={{ color: chestInfo.color }}>
                            {chestInfo.name}
                        </h3>
                        <p className="text-k-text-tertiary animate-fade-in-up">Abrindo...</p>
                    </div>
                )}
            </div>
        </div>
    );
};


const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [adLoading, setAdLoading] = useState(false);
  const [lastChest, setLastChest] = useState<Chest | null>(null);
  const [isOpeningChest, setIsOpeningChest] = useState(false);
  const [openedReward, setOpenedReward] = useState<{ amount: number; currency: string } | null>(null);
  const [chestToOpen, setChestToOpen] = useState<Chest | null>(null);

  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await backendService.getUser();
        setUser(userData);
        // Check for unopened chests from last session
        if(userData.chests.length > 0) {
            setLastChest(userData.chests[0]);
        }
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
        alert("Development Mode: Simulating ad watch.");
        const reward = await backendService.creditAdReward();
        setLastChest(reward.chest);
        setUser(await backendService.getUser());
        return;
    }

    setAdLoading(true);
    try {
      await adsController.ad_show({ adBlockUuid: REWARDED_AD_BLOCK_ID });
      const reward = await backendService.creditAdReward();
      setLastChest(reward.chest);
      setUser(await backendService.getUser());

    } catch (error) {
      console.error("Ad failed to show or was skipped:", error);
    } finally {
      setAdLoading(false);
    }
  };

  const handleOpenChestClick = (chest: Chest) => {
    setChestToOpen(chest);
    setIsOpeningChest(true);
    
    setTimeout(async () => {
        try {
            const result = await backendService.openChest(chest.id);
            setOpenedReward({ amount: result.rewardAmount, currency: result.rewardCurrency });
            setLastChest(null);
            const updatedUser = await backendService.getUser();
            setUser(updatedUser);
        } catch (error) {
            console.error("Failed to open chest:", error);
            setIsOpeningChest(false);
            setChestToOpen(null);
        }
    }, 1800);
  };

  const handleAnimationClose = () => {
    setIsOpeningChest(false);
    setOpenedReward(null);
    setChestToOpen(null);
  };

  if (!user) return <div className="flex h-full items-center justify-center pt-20"><div className="w-8 h-8 border-2 border-k-border border-t-k-accent rounded-full animate-spin"></div></div>;

  const levelInfo = LEVELS[user.level - 1] || LEVELS[LEVELS.length - 1];
  const nextLevelInfo = LEVELS[user.level] || null;
  const xpProgress = nextLevelInfo ? (user.xp - levelInfo.xpRequired) / (nextLevelInfo.xpRequired - levelInfo.xpRequired) * 100 : 100;

  return (
    <div className="space-y-6">
      
      {isOpeningChest && chestToOpen && (
        <ChestOpeningOverlay chest={chestToOpen} reward={openedReward} onClose={handleAnimationClose} />
      )}

      {/* Header */}
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={user.photoUrl} alt="User" className="w-10 h-10 rounded-full border-2 border-k-border" />
          <div>
            <p className="font-bold text-k-text-primary leading-tight">{user.firstName}</p>
            <p className="text-xs text-k-text-tertiary font-mono">@{user.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right">
                <p className="text-xs text-k-text-secondary">{t('total_balance')}</p>
                <p className="text-xl font-bold font-display text-k-text-primary">
                    R$ {user.balance.toFixed(2)}
                </p>
            </div>
             <button onClick={() => {
                backendService.logout();
                window.location.hash = '/login';
                window.location.reload();
             }} className="w-10 h-10 flex items-center justify-center bg-k-surface rounded-full border border-k-border text-k-text-secondary hover:text-k-text-primary transition-colors">
                <IconProfile className="w-5 h-5"/>
            </button>
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

      {/* Main Action: Reward Card or Watch Button */}
      <div className="pt-4">
        {lastChest ? (
            <div className="bg-gradient-to-br from-k-surface to-k-bg border border-k-border rounded-xl p-4 space-y-4 text-center animate-fade-in-up">
                <div className="flex justify-center items-center h-24">
                    <div 
                        className="relative w-20 h-20 animate-pulse-glow" 
                        style={{ '--glow-color': CHEST_DEFINITIONS[lastChest.rarity].color.includes('gradient') ? 'rgba(255,255,255,0.2)' : CHEST_DEFINITIONS[lastChest.rarity].color + '40' } as React.CSSProperties}
                    >
                        <IconChest className="w-full h-full text-k-text-primary" />
                    </div>
                </div>
                <h3 className="text-lg font-bold font-display" style={{ color: CHEST_DEFINITIONS[lastChest.rarity].color }}>
                    Você ganhou um {CHEST_DEFINITIONS[lastChest.rarity].name}!
                </h3>
                <p className="text-sm text-k-text-secondary -mt-3">Abra para revelar sua recompensa.</p>
                <Button onClick={() => handleOpenChestClick(lastChest)}>ABRIR AGORA</Button>
            </div>
        ) : (
            <Button onClick={handleWatchAd} isLoading={adLoading} disabled={adLoading || isOpeningChest}>
                {adLoading ? t('watching_ad') : t('watch_and_earn')}
            </Button>
        )}
      </div>

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
