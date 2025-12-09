import React, { useState, useEffect, useCallback } from 'react';
import { backendService } from '../services/mockBackend';
import { Transaction, WithdrawalMethod, TransactionType } from '../types';
import { useLanguage } from '../App';
import { MIN_WITHDRAWAL } from '../constants';

const TransactionItem = ({ tx }: { tx: Transaction }) => {
    const isPositive = [TransactionType.AD_REWARD, TransactionType.CHEST_REWARD, TransactionType.MISSION_REWARD, TransactionType.REFERRAL].includes(tx.type);
    const color = tx.status === 'FAILED' ? 'text-red-500' : isPositive ? 'text-k-green' : 'text-k-text-primary';
    const sign = isPositive ? '+' : tx.type === TransactionType.WITHDRAWAL ? '-' : '';

    return (
        <div className="flex justify-between items-center py-3 border-b border-k-border animate-fade-in-up">
            <div>
                <p className="font-semibold capitalize">{tx.details || tx.type.replace('_', ' ').toLowerCase()}</p>
                <p className="text-xs text-k-text-tertiary">{new Date(tx.timestamp).toLocaleString()}</p>
            </div>
            <div className={`text-right font-mono font-bold ${color}`}>
                {sign} {tx.currency === 'BRL' ? 'R$' : ''}{tx.amount.toFixed(2)} {tx.currency !== 'BRL' ? tx.currency : ''}
                <p className={`text-xs font-sans font-normal ${tx.status === 'PENDING' ? 'text-yellow-500' : 'text-k-text-tertiary'}`}>{tx.status}</p>
            </div>
        </div>
    );
};

const Wallet = () => {
    const { t } = useLanguage();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [method, setMethod] = useState<WithdrawalMethod>(WithdrawalMethod.PIX);
    const [amount, setAmount] = useState('');
    const [address, setAddress] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const txs = await backendService.getTransactions();
            setTransactions(txs);
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleWithdrawal = async (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0 || !address) {
            setFeedback({ message: 'Preencha todos os campos.', type: 'error' });
            return;
        }

        const min = method === 'PIX' ? MIN_WITHDRAWAL.PIX : MIN_WITHDRAWAL.TON;
        if (numAmount < min) {
             setFeedback({ message: `O valor mínimo para saque é ${min}.`, type: 'error' });
             return;
        }

        setIsProcessing(true);
        setFeedback({ message: '', type: '' });
        try {
            await backendService.requestWithdrawal(method, numAmount, address);
            setFeedback({ message: 'Solicitação de saque enviada!', type: 'success' });
            setAmount('');
            setAddress('');
            fetchTransactions();
        } catch (error: any) {
            setFeedback({ message: error.message || 'Erro ao processar saque.', type: 'error' });
        }
        setIsProcessing(false);
    };

    return (
        <div className="p-4">
            <h1 className="font-display text-3xl font-bold text-k-text-primary mb-4">{t('nav_wallet')}</h1>

            <div className="bg-k-surface border border-k-border rounded-lg p-4 mb-6">
                <h2 className="font-bold text-lg mb-3">{t('withdraw_funds')}</h2>
                <form onSubmit={handleWithdrawal} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm text-k-text-secondary mb-1 block">{t('withdraw_method')}</label>
                        <div className="flex gap-2">
                           <button type="button" onClick={() => setMethod(WithdrawalMethod.PIX)} className={`flex-1 p-2 rounded ${method === 'PIX' ? 'bg-k-accent text-k-bg' : 'bg-k-bg'}`}>{WithdrawalMethod.PIX}</button>
                           <button type="button" onClick={() => setMethod(WithdrawalMethod.TON)} className={`flex-1 p-2 rounded ${method === 'TON' ? 'bg-k-accent text-k-bg' : 'bg-k-bg'}`}>{WithdrawalMethod.TON}</button>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-k-text-secondary mb-1 block">{method === 'PIX' ? t('pix_key') : t('ton_address')}</label>
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-k-bg border border-k-border rounded p-2 focus:outline-none focus:ring-1 focus:ring-k-accent" />
                    </div>
                    <div>
                         <label className="text-sm text-k-text-secondary mb-1 block">{method === 'PIX' ? t('amount_brl') : t('amount_ton')}</label>
                         <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={`${t('min_withdrawal')} ${method === 'PIX' ? MIN_WITHDRAWAL.PIX.toFixed(2) : MIN_WITHDRAWAL.TON}`} className="w-full bg-k-bg border border-k-border rounded p-2 focus:outline-none focus:ring-1 focus:ring-k-accent" />
                    </div>
                    
                    {feedback.message && (
                        <p className={`text-sm ${feedback.type === 'error' ? 'text-red-500' : 'text-k-green'}`}>{feedback.message}</p>
                    )}

                    <button type="submit" disabled={isProcessing} className="bg-k-accent text-k-bg font-bold p-3 rounded disabled:bg-k-surface disabled:text-k-text-tertiary">
                       {isProcessing ? t('processing') : t('confirm_withdrawal')}
                    {/* FIX: Corrected the closing tag from </to> to </button> */}
                    </button>
                </form>
            </div>

            <h2 className="font-bold text-lg mb-2">Histórico de Transações</h2>
            {loading ? (
                <div className="text-center p-4"><div className="w-6 h-6 border-2 border-k-border border-t-k-accent rounded-full animate-spin mx-auto"></div></div>
            ) : transactions.length > 0 ? (
                <div className="bg-k-surface border border-k-border rounded-lg p-4">
                    {transactions.map(tx => <TransactionItem key={tx.id} tx={tx} />)}
                </div>
            ) : (
                <p className="text-k-text-secondary text-center p-4">Nenhuma transação ainda.</p>
            )}
        </div>
    );
};

export default Wallet;