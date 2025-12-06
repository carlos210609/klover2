import React, { useEffect, useState } from 'react';
import { backendService } from '../services/mockBackend';
import { Transaction, TransactionType } from '../types';

const History: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    backendService.getHistory().then(setTransactions);
  }, []);

  return (
    <div className="space-y-6 pt-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold font-mono px-2 tracking-tight">History</h2>
      
      <div className="space-y-4 pb-20">
        {transactions.length === 0 ? (
          <div className="text-center text-white/30 py-10 font-mono text-sm border border-dashed border-white/10 rounded-xl">
            No transactions yet.
          </div>
        ) : (
          transactions.map((tx, index) => (
            <div 
              key={tx.id} 
              className="relative group perspective-1000"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative transform transition-all duration-500 ease-out preserve-3d group-hover:[transform:rotateX(5deg)_scale(1.02)] origin-center">
                {/* Glow Background */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-white/10 to-transparent rounded-xl blur-md opacity-0 group-hover:opacity-100 transition duration-500"></div>
                
                {/* Card Content */}
                <div className="relative bg-black/40 border border-white/10 rounded-xl p-4 flex justify-between items-center backdrop-blur-md shadow-lg group-hover:bg-black/60 group-hover:border-white/20">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border backdrop-blur-xl ${
                      tx.type === TransactionType.EARN 
                        ? 'border-green-500/20 bg-green-500/5 text-green-400' 
                        : 'border-blue-500/20 bg-blue-500/5 text-blue-400'
                    }`}>
                      <span className="text-sm">
                        {tx.type === TransactionType.EARN ? '⚡' : '↘'}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold font-mono text-white tracking-wide">
                        {tx.type === TransactionType.EARN ? 'Ad Reward' : `Withdraw to ${tx.method}`}
                      </p>
                      <p className="text-[10px] text-white/40 mt-0.5">
                        {new Date(tx.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono text-sm font-bold ${
                      tx.type === TransactionType.EARN ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.3)]' : 'text-white'
                    }`}>
                      {tx.type === TransactionType.EARN ? '+' : '-'}${tx.amount.toFixed(4)}
                    </p>
                    <div className={`text-[9px] font-bold uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full inline-block ${
                      tx.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {tx.status}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;