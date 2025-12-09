
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { backendService } from '../services/mockBackend';
import { User, CryptoAsset, PortfolioAsset } from '../types';
import { useLanguage } from '../App';
import { IconChevronRight } from '../components/Icons';

type EnrichedAsset = PortfolioAsset & CryptoAsset & { priceBRL: number };

// --- Helper Components ---
const PortfolioValue = ({ value }: { value: number }) => {
  const { t } = useLanguage();
  return (
    <div className="text-center w-full animate-fade-in-up">
      <p className="text-sm font-medium text-k-text-secondary">{t('portfolio_value')}</p>
      <p className="font-display text-5xl font-bold text-k-text-primary tracking-tighter">
        R$ <span className="tracking-wide">{value.toFixed(2).replace('.', ',')}</span>
      </p>
    </div>
  );
};

const AssetRow = ({ asset, onClick }: { asset: EnrichedAsset; onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between p-3 bg-k-surface rounded-lg border border-k-border hover:border-k-border-hover transition-all duration-300 cursor-pointer animate-fade-in-up"
  >
    <div className="flex items-center gap-4">
      <img src={asset.iconUrl} alt={asset.name} className="w-10 h-10" />
      <div>
        <p className="font-bold text-k-text-primary">{asset.name}</p>
        <p className="text-sm text-k-text-secondary">{asset.symbol}</p>
      </div>
    </div>
    <div className="text-right flex items-center gap-2">
      <div>
         <p className="font-mono font-bold text-k-text-primary">{asset.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</p>
         <p className="text-sm text-k-text-secondary">R$ {(asset.amount * asset.priceBRL).toFixed(2).replace('.', ',')}</p>
      </div>
       <IconChevronRight className="text-k-text-tertiary" />
    </div>
  </div>
);


// --- Main Component ---
const Dashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [portfolio, setPortfolio] = useState<{ assets: EnrichedAsset[], totalValueBRL: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [userData, portfolioData] = await Promise.all([
        backendService.getUser(),
        backendService.getPortfolio(),
      ]);
      setUser(userData);
      setPortfolio(portfolioData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh data every 5 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading || !user || !portfolio) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-k-border border-t-k-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-8">
      <header className="flex items-center justify-between pt-2">
         <div>
            <p className="text-k-text-secondary text-sm">Bem-vindo,</p>
            <h1 className="font-bold text-2xl text-k-text-primary">{user.firstName || user.username}</h1>
         </div>
         <img
            src={user.photoUrl || `https://api.dicebear.com/8.x/bottts/svg?seed=${user.username}`}
            alt="User"
            className="w-12 h-12 rounded-full border-2 border-k-accent"
        />
      </header>
      
      <PortfolioValue value={portfolio.totalValueBRL} />

      <div>
        <h2 className="font-bold text-lg text-k-text-primary mb-3">{t('your_assets')}</h2>
        <div className="flex flex-col gap-3">
          {portfolio.assets.map(asset => (
             <AssetRow key={asset.id} asset={asset} onClick={() => navigate(`/wallet/${asset.id}`)} />
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;