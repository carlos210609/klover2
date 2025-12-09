
import React, { useState, useEffect, useCallback } from 'react';
import { backendService } from '../services/mockBackend';
import { MarketData } from '../types';
import { useLanguage } from '../App';

const MarketRow = ({ asset, index }: { asset: MarketData; index: number }) => {
    const isPositive = asset.change24h >= 0;
    return (
    <div 
      className="flex items-center justify-between p-3 rounded-lg animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
        <div className="flex items-center gap-4">
            <img src={asset.iconUrl} alt={asset.name} className="w-10 h-10" />
            <div>
                <p className="font-bold text-k-text-primary">{asset.name}</p>
                <p className="text-sm text-k-text-secondary">{asset.symbol}</p>
            </div>
        </div>
        <div className="text-right">
            <p className="font-mono font-bold text-k-text-primary">R$ {asset.priceBRL.toFixed(2).replace('.', ',')}</p>
            <p className={`text-sm font-semibold ${isPositive ? 'text-k-green' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%
            </p>
        </div>
    </div>
    )
};


const Markets = () => {
    const { t } = useLanguage();
    const [marketData, setMarketData] = useState<MarketData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const data = await backendService.getMarketData();
            setMarketData(data);
        } catch (error) {
            console.error("Failed to fetch market data:", error);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchData(); // Initial fetch
        const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, [fetchData]);

    return (
        <div className="p-4">
            <h1 className="font-display text-3xl font-bold text-k-text-primary mb-6">{t('market_trends')}</h1>

            {loading && marketData.length === 0 ? (
                <div className="flex justify-center mt-12">
                    <div className="w-8 h-8 border-2 border-k-border border-t-k-accent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {marketData.map((asset, index) => (
                        <MarketRow key={asset.id} asset={asset} index={index} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Markets;