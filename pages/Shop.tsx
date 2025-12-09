

import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { backendService } from '../services/mockBackend';
import { ShopItem, ItemRarity } from '../types';
import { SHOP_ITEMS } from '../constants';
import { IconShop, IconStar, IconRefresh, IconCheck, IconZap } from '../components/Icons';
import { useLanguage } from '../App';

const Shop: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const { t } = useLanguage();

  React.useEffect(() => {
    refreshUser();
  }, []);

  const refreshUser = () => backendService.getUser().then(setUser);

  const handleBuy = async (item: ShopItem) => {
    setLoading(item.id);
    setMsg(null);
    try {
      await backendService.buyShopItem(item);
      setMsg(`${t('acquired')}: ${item.name}`);
      refreshUser();
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setLoading(null);
    }
  };

  const getRarityColor = (rarity: ItemRarity) => {
    switch (rarity) {
        case 'LEGENDARY': return 'border-neon-gold text-neon-gold shadow-[0_0_15px_rgba(251,191,36,0.2)]';
        case 'RARE': return 'border-neon-purple text-neon-purple shadow-[0_0_10px_rgba(168,85,247,0.2)]';
        default: return 'border-white/10 text-white/60';
    }
  };

  const getIcon = (iconName: string, className: string) => {
    if (iconName === 'refresh') return <IconRefresh className={className} />;
    if (iconName === 'cash') return <span className={`font-bold ${className}`}>$</span>;
    if (iconName === 'zap') return <IconZap className={className} />;
    if (iconName === 'star') return <IconStar className={className} />;
    return <IconShop className={className} />;
  };

  if (!user) return null;

  return (
    <div className="space-y-6 pt-6 animate-fade-in-up pb-24">
       <div className="px-2 flex justify-between items-end">
         <div>
            <h2 className="text-3xl font-bold font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">{t('black_market')}</h2>
            <p className="text-white/40 text-xs font-mono tracking-wide">{t('shop_desc')}</p>
         </div>
         <div className="text-right">
            <p className="text-[9px] text-purple-300 font-mono uppercase tracking-widest">{t('balance')}</p>
            <p className="text-xl font-bold text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">{user.points} PTS</p>
         </div>
       </div>

       {/* Items Grid */}
       <div className="grid grid-cols-1 gap-4">
          {SHOP_ITEMS.map(item => (
            <div key={item.id} className={`relative group transition-all duration-300 ${item.rarity === 'LEGENDARY' ? 'hover:scale-[1.02]' : ''}`}>
               {/* Rarity Glow */}
               {item.rarity === 'LEGENDARY' && (
                 <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500 animate-pulse-slow"></div>
               )}
               
               <Card className={`relative flex flex-col gap-3 !border-l-4 ${getRarityColor(item.rarity)} bg-slate-900/80`}>
                  <div className="flex justify-between items-start">
                     <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border bg-white/5 ${getRarityColor(item.rarity).split(' ')[0]}`}>
                           {getIcon(item.icon, "w-6 h-6")}
                        </div>
                        <div>
                           <div className="flex items-center gap-2">
                             <h3 className="font-bold text-white text-sm tracking-wide">{item.name}</h3>
                             {item.rarity !== 'COMMON' && (
                               <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${getRarityColor(item.rarity)}`}>
                                 {item.rarity}
                               </span>
                             )}
                           </div>
                           <p className="text-xs text-white/50 leading-relaxed mt-1">{item.description}</p>
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
                     <div className="flex items-center gap-1 text-purple-400">
                        <span className="text-xs text-white/30 uppercase font-mono mr-1">{t('cost')}:</span>
                        <IconStar className="w-3 h-3" />
                        <span className="font-mono font-bold text-sm">{item.price}</span>
                     </div>
                     <Button 
                       onClick={() => handleBuy(item)}
                       isLoading={loading === item.id}
                       disabled={!!loading || user.points < item.price}
                       className={`w-auto py-2 px-6 h-8 text-[10px] ${user.points >= item.price ? '' : 'opacity-50'}`}
                       variant={item.rarity === 'LEGENDARY' ? 'primary' : 'secondary'}
                     >
                       {t('acquire')}
                     </Button>
                  </div>
               </Card>
            </div>
          ))}
       </div>

       {msg && (
         <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-green-500/30 text-green-400 px-6 py-3 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.2)] backdrop-blur-xl text-xs font-mono animate-victory-pop flex items-center gap-2 whitespace-nowrap z-50">
            <IconCheck className="w-4 h-4"/> {msg}
         </div>
       )}
    </div>
  );
};

export default Shop;