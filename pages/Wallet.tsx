
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { backendService } from '../services/mockBackend';
import { Transaction, TransactionType, User, CryptoAsset, PortfolioAsset } from '../types';
import { useLanguage } from '../App';
import { SUPPORTED_ASSETS } from '../constants';

const TransactionItem = ({ tx, asset }: { tx: Transaction, asset: CryptoAsset }) => {
    const isPositive = [TransactionType.DEPOSIT, TransactionType.SWAP_IN].includes(tx.type);
    const color = tx.status === 'FAILED' ? 'text-red-500' : isPositive ? 'text-k-green' : 'text-k-text-primary';
    const sign = isPositive ? '+' : '-';
    
    let title = tx.type.replace('_', ' ').toLowerCase();
    if(tx.type === TransactionType.SWAP_IN) title = `Swap de ${tx.details?.from.toUpperCase()}`;
    if(tx.type === TransactionType.SWAP_OUT) title = `Swap para ${tx.details?.to.toUpperCase()}`;

    return (
        <div className="flex justify-between items-center py-3 border-b border-k-border animate-fade-in-up">
            <div>
                <p className="font-semibold capitalize">{title}</p>
                <p className="text-xs text-k-text-tertiary">{new Date(tx.timestamp).toLocaleString()}</p>
            </div>
            <div className={`text-right font-mono font-bold ${color}`}>
                {sign} {tx.amount.toFixed(6)} {asset.symbol}
                <p className={`text-xs font-sans font-normal ${tx.status === 'PENDING' ? 'text-yellow-500' : 'text-k-text-tertiary'}`}>{tx.status}</p>
            </div>
        </div>
    );
};

const Wallet = () => {
    const { t } = useLanguage();
    const { assetId } = useParams();
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [assetInfo, setAssetInfo] = useState<CryptoAsset | null>(null);
    const [assetPortfolio, setAssetPortfolio] = useState<PortfolioAsset | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!assetId) return;
        setLoading(true);
        try {
            const info = SUPPORTED_ASSETS.find(a => a.id === assetId);
            if (!info) {
                 navigate('/'); // Redirect if asset is invalid
                 return;
            }
            setAssetInfo(info);
            
            const [txs, userData] = await Promise.all([
                backendService.getTransactions(assetId),
                backendService.getUser()
            ]);
            setTransactions(txs);
            setUser(userData);
            const portfolioData = userData.portfolio.find(p => p.assetId === assetId);
            setAssetPortfolio(portfolioData || { assetId, amount: 0 });

        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
        setLoading(false);
    }, [assetId, navigate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading || !assetInfo) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-k-border border-t-k-accent rounded-full animate-spin"></div>
            </div>
        );
    }
    
    return (
        <div className="p-4">
            <header className="flex items-center gap-4 mb-8">
                <img src={assetInfo.iconUrl} alt={assetInfo.name} className="w-12 h-12" />
                <div>
                     <h1 className="font-display text-3xl font-bold text-k-text-primary">{assetInfo.name}</h1>
                     <p className="text-k-text-secondary">{assetInfo.symbol}</p>
                </div>
            </header>

            <div className="bg-k-surface border border-k-border rounded-lg p-4 mb-6 text-center">
                 <h2 className="text-sm text-k-text-secondary mb-1">{t('total_balance')}</h2>
                 <p className="text-3xl font-mono font-bold text-k-text-primary">{assetPortfolio?.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 }) || '0.00'}</p>
            </div>
            
            <div className="flex gap-4 mb-8">
                <button className="flex-1 h-12 rounded-lg font-bold bg-k-accent text-k-bg">{t('deposit')}</button>
                <button className="flex-1 h-12 rounded-lg font-bold bg-k-surface border border-k-border text-k-text-primary">{t('withdraw')}</button>
            </div>


            <h2 className="font-bold text-lg mb-2">{t('transaction_history')}</h2>
            {transactions.length > 0 ? (
                <div className="bg-k-surface border border-k-border rounded-lg p-4">
                    {transactions.map(tx => <TransactionItem key={tx.id} tx={tx} asset={assetInfo} />)}
                </div>
            ) : (
                <p className="text-k-text-secondary text-center p-4">Nenhuma transação para este ativo.</p>
            )}
        </div>
    );
};

export default Wallet;