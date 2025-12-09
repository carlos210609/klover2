
import React, { useEffect, useState } from 'react';
import { backendService } from '../services/mockBackend';
import { Transaction, TransactionType } from '../types';
import { useLanguage } from '../App';

const History: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    backendService.getHistory().then(setTransactions);
  }, []);

  const getTxInfo = (tx: Transaction): { icon: string; label: string; color: string; amountPrefix: string } => {
    switch(tx.type) {
        case TransactionType.AD_REWARD:
        case TransactionType.CHEST_REWARD:
        case TransactionType.MISSION_REWARD:
        case TransactionType.REFERRAL:
            return { icon: '✨', label: tx.details || 'Recompensa', color: 'text-k-green', amountPrefix: '+' };
        case TransactionType.WITHDRAWAL:
             return { icon: '💸', label: `Saque para ${tx.method}`, color: 'text-k-text-primary', amountPrefix: '-' };
        case TransactionType.BOOSTER_PURCHASE:
             return { icon: '🚀', label: tx.details || 'Compra', color: 'text-k-text-primary', amountPrefix: '-' };
        default: return { icon: '?', label: 'Transação', color: 'text-k-text-secondary', amountPrefix: '' };
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display text-k-text-primary">Histórico</h1>
      
      <div className="space-y-3 pb-20">
        {transactions.length === 0 ? (
          <div className="text-center text-k-text-secondary py-16 border border-dashed border-k-border rounded-xl">
            <p>Nenhuma transação ainda.</p>
          </div>
        ) : (
          transactions.map((tx) => {
            const info = getTxInfo(tx);
            return (
              <div 
                key={tx.id} 
                className="bg-k-surface border border-k-border rounded-xl p-4 flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-k-bg border border-k-border text-lg">
                    {info.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-k-text-primary">
                      {info.label}
                    </p>
                    <p className="text-xs text-k-text-tertiary mt-0.5">
                      {new Date(tx.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-mono text-base font-bold ${info.color}`}>
                    {info.amountPrefix} {tx.amount.toFixed(2)} {tx.currency}
                  </p>
                  <p className="text-[10px] text-k-text-tertiary uppercase mt-1">
                    {tx.status}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
};

export default History;
