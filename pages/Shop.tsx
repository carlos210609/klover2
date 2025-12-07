import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { backendService } from '../services/mockBackend';
import { ShopItem } from '../types';
import { IconShop, IconStar, IconRefresh, IconCheck } from '../components/Icons';

const ITEMS: ShopItem[] = [
  {
    id: 'buy_spin',
    name: 'Pack of 5 Spins',
    description: 'Get 5 more chances to hit the Jackpot.',
    price: 150,
    currency: 'PTS',
    icon: 'refresh'
  },
  {
    id: 'cash_conversion_1',
    name: 'Cash Ticket ($0.01)',
    description: 'Instantly convert points to withdrawable balance.',
    price: 500,
    currency: 'PTS',
    icon: 'cash'
  },
];

const Shop: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  React.useEffect(() => {
    refreshUser();
  }, []);

  const refreshUser = () => backendService.getUser().then(setUser);

  const handleBuy = async (item: ShopItem) => {
    setLoading(item.id);
    setMsg(null);
    try {
      await backendService.buyShopItem(item);
      setMsg(`Successfully bought ${item.name}!`);
      refreshUser();
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setLoading(null);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 pt-6 animate-fade-in-up pb-24">
       <div className="px-2 flex justify-between items-end">
         <div>
            <h2 className="text-2xl font-bold font-mono tracking-tight">Shop</h2>
            <p className="text-white/40 text-xs">Spend your loyalty points.</p>
         </div>
         <div className="text-right">
            <p className="text-[10px] text-purple-300 font-mono uppercase">Your Points</p>
            <p className="text-xl font-bold text-purple-400">{user.points}</p>
         </div>
       </div>

       {/* Items Grid */}
       <div className="space-y-4">
          {ITEMS.map(item => (
            <Card key={item.id} className="flex flex-col gap-3">
               <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                        item.icon === 'refresh' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-green-500/10 border-green-500/20 text-green-400'
                     }`}>
                        {item.icon === 'refresh' ? <IconRefresh className="w-5 h-5"/> : <span className="font-bold text-sm">$</span>}
                     </div>
                     <div>
                        <h3 className="font-bold text-white text-sm">{item.name}</h3>
                        <p className="text-xs text-white/50 max-w-[200px] leading-relaxed">{item.description}</p>
                     </div>
                  </div>
               </div>
               
               <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1 text-purple-400">
                     <IconStar className="w-4 h-4" />
                     <span className="font-mono font-bold">{item.price}</span>
                  </div>
                  <Button 
                    onClick={() => handleBuy(item)}
                    isLoading={loading === item.id}
                    disabled={!!loading || user.points < item.price}
                    className="w-auto py-2 px-6 h-9 text-xs"
                    variant={user.points >= item.price ? 'primary' : 'secondary'}
                  >
                    BUY
                  </Button>
               </div>
            </Card>
          ))}
       </div>

       {msg && (
         <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black/80 border border-white/20 text-white px-6 py-3 rounded-full shadow-2xl backdrop-blur-xl text-xs font-mono animate-fade-in-up flex items-center gap-2">
            <IconCheck className="w-4 h-4 text-green-400"/> {msg}
         </div>
       )}
    </div>
  );
};

export default Shop;