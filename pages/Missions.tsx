
import React, { useState, useEffect, useCallback } from 'react';
import { backendService } from '../services/mockBackend';
import { useLanguage } from '../App';
import { MarketData, PortfolioAsset } from '../types';
import { IconChevronDown, IconSwap } from '../components/Icons';

const AssetSelector = ({ assets, selected, onSelect, label }: { assets: (MarketData & { balance: number })[], selected?: MarketData, onSelect: (asset: MarketData) => void, label: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="text-sm text-k-text-secondary mb-1 block">{label}</label>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between bg-k-bg border border-k-border rounded-lg p-3">
        {selected ? (
          <div className="flex items-center gap-3">
            <img src={selected.iconUrl} alt={selected.name} className="w-8 h-8" />
            <div>
              <p className="font-bold text-k-text-primary text-left">{selected.symbol}</p>
              <p className="text-xs text-k-text-secondary text-left">Balance: {assets.find(a=>a.id === selected.id)?.balance.toFixed(4) || 0}</p>
            </div>
          </div>
        ) : (
          <p>Select Asset</p>
        )}
        <IconChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-k-surface border border-k-border mt-1 rounded-lg z-10 max-h-48 overflow-y-auto">
          {assets.map(asset => (
            <div key={asset.id} onClick={() => { onSelect(asset); setIsOpen(false); }} className="flex items-center gap-3 p-3 hover:bg-k-bg cursor-pointer">
              <img src={asset.iconUrl} alt={asset.name} className="w-8 h-8" />
              <div>
                 <p className="font-bold text-k-text-primary">{asset.name} ({asset.symbol})</p>
                 <p className="text-xs text-k-text-secondary">Balance: {asset.balance.toFixed(4)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Swap = () => {
  const { t } = useLanguage();
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioAsset[]>([]);
  
  const [fromAsset, setFromAsset] = useState<MarketData | undefined>();
  const [toAsset, setToAsset] = useState<MarketData | undefined>();
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const fetchData = useCallback(async () => {
    try {
      const [market, user] = await Promise.all([backendService.getMarketData(), backendService.getUser()]);
      setMarketData(market);
      setPortfolio(user.portfolio);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const assetsWithBalance = marketData.map(md => {
      const pAsset = portfolio.find(pa => pa.assetId === md.id);
      return { ...md, balance: pAsset?.amount || 0 };
  });

  useEffect(() => {
    if (fromAsset && toAsset && fromAmount) {
      const rate = fromAsset.priceBRL / toAsset.priceBRL;
      const amount = parseFloat(fromAmount) * rate * 0.995; // 0.5% fee
      setToAmount(amount.toFixed(8));
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromAsset, toAsset]);
  
  const handleSwapAssets = () => {
      const temp = fromAsset;
      setFromAsset(toAsset);
      setToAsset(temp);
  }

  const handleSwap = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!fromAsset || !toAsset || !fromAmount || isProcessing) return;

      const numFromAmount = parseFloat(fromAmount);
      const fromAssetBalance = assetsWithBalance.find(a => a.id === fromAsset.id)?.balance || 0;

      if(numFromAmount <= 0) {
          setFeedback({ message: 'Amount must be positive.', type: 'error' });
          return;
      }
      if (numFromAmount > fromAssetBalance) {
          setFeedback({ message: t('insufficient_balance'), type: 'error' });
          return;
      }
      
      setIsProcessing(true);
      setFeedback({ message: '', type: '' });
      try {
          await backendService.performSwap(fromAsset.id, toAsset.id, numFromAmount);
          setFeedback({ message: 'Swap successful!', type: 'success' });
          setFromAmount('');
          setToAmount('');
          fetchData(); // Refresh balances
      } catch(error: any) {
          setFeedback({ message: error.message || 'Swap failed.', type: 'error' });
      }
      setIsProcessing(false);
  }


  return (
    <div className="p-4">
      <h1 className="font-display text-3xl font-bold text-k-text-primary mb-6">{t('nav_swap')}</h1>

      <form onSubmit={handleSwap} className="flex flex-col gap-4">
        
        <div className="bg-k-surface border border-k-border rounded-lg p-4">
           <AssetSelector assets={assetsWithBalance} selected={fromAsset} onSelect={setFromAsset} label={t('you_pay')} />
           <input 
             type="number"
             step="any"
             value={fromAmount}
             onChange={(e) => setFromAmount(e.target.value)}
             placeholder="0.0" 
             className="w-full bg-transparent text-3xl font-mono text-right p-2 focus:outline-none" 
           />
        </div>
        
        <div className="flex justify-center my-[-26px] z-10">
            <button type="button" onClick={handleSwapAssets} className="p-2 bg-k-surface border border-k-border rounded-full text-k-accent hover:bg-k-accent hover:text-k-bg transition-colors">
                <IconSwap className="w-6 h-6" />
            </button>
        </div>

        <div className="bg-k-surface border border-k-border rounded-lg p-4">
           <AssetSelector assets={assetsWithBalance} selected={toAsset} onSelect={setToAsset} label={t('you_receive')} />
           <input 
            type="number"
            disabled 
            value={toAmount}
            placeholder="0.0" 
            className="w-full bg-transparent text-3xl font-mono text-right p-2 focus:outline-none opacity-70"
           />
        </div>

        {fromAsset && toAsset && (
             <p className="text-center text-sm text-k-text-secondary">
                 1 {fromAsset.symbol} ≈ {(fromAsset.priceBRL / toAsset.priceBRL).toFixed(4)} {toAsset.symbol}
             </p>
        )}
        
        {feedback.message && (
          <p className={`text-center text-sm ${feedback.type === 'error' ? 'text-red-500' : 'text-k-green'}`}>{feedback.message}</p>
        )}
        
        <button type="submit" disabled={isProcessing || !fromAmount} className="w-full h-14 rounded-xl font-display text-lg font-bold transition-all duration-300 bg-k-accent text-k-bg disabled:bg-k-surface disabled:text-k-text-tertiary">
          {isProcessing ? 'PROCESSANDO...' : t('confirm_swap')}
        </button>

      </form>
    </div>
  );
};

export default Swap;
