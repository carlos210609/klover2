
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { backendService } from '../services/mockBackend';
import { Transaction, TransactionType, User, CryptoAsset, PortfolioAsset } from '../types';
import { useLanguage } from '../App';
import { SUPPORTED_ASSETS } from '../constants';
import Modal from '../components/Modal';

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

// --- Modals ---

const DepositModal = ({ asset, onClose }: { asset: CryptoAsset; onClose: () => void; }) => {
    const { t } = useLanguage();
    const [feedback, setFeedback] = useState('');

    // This would be a real address from your backend
    const fakeAddress = `0x...${asset.symbol.toLowerCase()}${Date.now().toString().slice(-4)}`;

    const handleSimulateDeposit = async () => {
        await backendService.performDeposit(asset.id, 0.1); // Deposit a fixed test amount
        setFeedback(t('deposit_received'));
        setTimeout(() => {
            onClose();
        }, 1500);
    };

    return (
        <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 mb-4 rounded-lg bg-white p-2">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${fakeAddress}`} alt="QR Code" />
            </div>
            <p className="text-sm text-k-text-secondary mb-2">{t('your_address')}</p>
            <p className="font-mono text-k-text-primary bg-k-bg p-2 rounded-md break-all">{fakeAddress}</p>
            <p className="text-xs text-k-text-tertiary mt-4">
                {t('deposit_warning').replace('{assetSymbol}', asset.symbol)}
            </p>
            <button onClick={handleSimulateDeposit} className="mt-6 w-full h-12 rounded-lg font-bold bg-k-accent text-k-bg transition-colors hover:opacity-90">
                {t('simulate_deposit')}
            </button>
            {feedback && <p className="text-k-green text-sm mt-2">{feedback}</p>}
        </div>
    )
}

const WithdrawModal = ({ asset, balance, onClose }: { asset: CryptoAsset; balance: number; onClose: () => void; }) => {
    const { t } = useLanguage();
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [isProcessing, setIsProcessing] = useState(false);
    
    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);

        if (!address || numAmount <= 0) {
            setFeedback({ message: 'Preencha todos os campos.', type: 'error' });
            return;
        }
        if (numAmount > balance) {
            setFeedback({ message: t('insufficient_balance'), type: 'error' });
            return;
        }

        setIsProcessing(true);
        setFeedback({ message: '', type: '' });
        try {
            await backendService.performWithdrawal(asset.id, numAmount, address);
            setFeedback({ message: t('withdrawal_successful'), type: 'success' });
            setTimeout(() => onClose(), 1500);
        } catch (error: any) {
            setFeedback({ message: error.message, type: 'error' });
        }
        setIsProcessing(false);
    }

    return (
        <form onSubmit={handleWithdraw}>
            <div className="mb-4">
                <label className="block text-sm text-k-text-secondary mb-1">{t('destination_address')}</label>
                <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full bg-k-bg border border-k-border rounded-lg p-2 focus:outline-none focus:border-k-accent"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm text-k-text-secondary mb-1">{t('amount')}</label>
                <input 
                    type="number" 
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full bg-k-bg border border-k-border rounded-lg p-2 focus:outline-none focus:border-k-accent"
                />
            </div>
             {feedback.message && (
                <p className={`text-center text-sm mb-4 ${feedback.type === 'error' ? 'text-red-500' : 'text-k-green'}`}>{feedback.message}</p>
             )}
            <button type="submit" disabled={isProcessing} className="w-full h-12 rounded-lg font-bold bg-k-accent text-k-bg transition-colors hover:opacity-90 disabled:opacity-50">
                {isProcessing ? 'PROCESSANDO...' : t('confirm_withdrawal')}
            </button>
        </form>
    );
}


// --- Main Component ---

const Wallet = () => {
    const { t } = useLanguage();
    const { assetId } = useParams();
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [assetInfo, setAssetInfo] = useState<CryptoAsset | null>(null);
    const [assetPortfolio, setAssetPortfolio] = useState<PortfolioAsset | null>(null);
    const [loading, setLoading] = useState(true);
    
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

    const [liveMarketData, setLiveMarketData] = useState<{ priceBRL: number | null, apr: number | null }>({ priceBRL: null, apr: null });
    const [isLiveLoading, setIsLiveLoading] = useState(true);


    useEffect(() => {
        if (!assetInfo) return;

        const fetchLiveMarketData = async () => {
            setIsLiveLoading(true);
            try {
                // Fetch price from CoinGecko
                const priceResponse = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${assetInfo.id}&vs_currencies=brl`);
                const priceData = await priceResponse.json();
                const priceBRL = priceData[assetInfo.id]?.brl || null;

                // Fetch Staking APR from DefiLlama
                const aprResponse = await fetch('https://api.llama.fi/yields');
                const aprData = await aprResponse.json();
                const assetPools = aprData.data.filter((pool: any) => pool.symbol?.toUpperCase() === assetInfo.symbol.toUpperCase() && pool.apy > 0);
                
                let apr: number | null = null;
                if (assetPools.length > 0) {
                    apr = Math.max(...assetPools.map((p: any) => p.apy));
                }
                
                setLiveMarketData({ priceBRL, apr });

            } catch (error) {
                console.error("Failed to fetch live market data:", error);
                setLiveMarketData({ priceBRL: null, apr: null });
            } finally {
                setIsLiveLoading(false);
            }
        };

        fetchLiveMarketData();
    }, [assetInfo]);

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
                <button onClick={() => setIsDepositModalOpen(true)} className="flex-1 h-12 rounded-lg font-bold bg-k-accent text-k-bg">{t('deposit')}</button>
                <button onClick={() => setIsWithdrawModalOpen(true)} className="flex-1 h-12 rounded-lg font-bold bg-k-surface border border-k-border text-k-text-primary">{t('withdraw')}</button>
            </div>

            <div className="bg-k-surface border border-k-border rounded-lg p-4 mb-6">
                <h2 className="text-sm text-k-text-secondary mb-3 text-center">{t('market_info_live')}</h2>
                {isLiveLoading ? (
                    <div className="flex justify-center items-center h-12">
                        <div className="w-6 h-6 border-2 border-k-border border-t-k-accent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="flex justify-around text-center">
                        <div>
                            <p className="text-xs text-k-text-tertiary">{t('price')}</p>
                            <p className="font-mono font-bold text-k-text-primary text-lg">
                                {liveMarketData.priceBRL ? `R$ ${liveMarketData.priceBRL.toFixed(2).replace('.', ',')}` : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-k-text-tertiary">{t('staking_apr')}</p>
                            <p className="font-mono font-bold text-k-green text-lg">
                                {liveMarketData.apr ? `${liveMarketData.apr.toFixed(2)}%` : '—'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <h2 className="font-bold text-lg mb-2">{t('transaction_history')}</h2>
            {transactions.length > 0 ? (
                <div className="bg-k-surface border border-k-border rounded-lg p-4">
                    {transactions.map(tx => <TransactionItem key={tx.id} tx={tx} asset={assetInfo} />)}
                </div>
            ) : (
                <p className="text-k-text-secondary text-center p-4">Nenhuma transação para este ativo.</p>
            )}

            <Modal isOpen={isDepositModalOpen} onClose={() => { setIsDepositModalOpen(false); fetchData(); }} title={`${t('deposit_to')} ${assetInfo.name}`}>
                <DepositModal asset={assetInfo} onClose={() => { setIsDepositModalOpen(false); fetchData(); }} />
            </Modal>
            
            <Modal isOpen={isWithdrawModalOpen} onClose={() => { setIsWithdrawModalOpen(false); fetchData(); }} title={`${t('withdraw_from')} ${assetInfo.name}`}>
                <WithdrawModal asset={assetInfo} balance={assetPortfolio?.amount || 0} onClose={() => { setIsWithdrawModalOpen(false); fetchData(); }} />
            </Modal>
        </div>
    );
};

export default Wallet;
