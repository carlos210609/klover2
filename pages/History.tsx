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
      <h2 className="text-2xl font-bold font-mono px-2 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">History</h2>
      
      <div className="space-y-5 pb-24 perspective-2000">
        {transactions.length === 0 ? (
          <div className="text-center text-white/30 py-12 font-mono text-xs uppercase tracking-widest border border-dashed border-white/10 rounded-xl bg-white/5 backdrop-blur-sm">
            No transactions found
          </div>
        ) : (
          transactions.map((tx, index) => (
            <div 
              key={tx.id} 
              className="relative group preserve-3d cursor-default"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="relative transform transition-all duration-500 ease-out preserve-3d group-hover:[transform:rotateX(10deg)_translateZ(20px)_scale(1.02)] origin-center">
                
                {/* Back Glow */}
                <div className="absolute -inset-4 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 translate-z-[-20px]"></div>

                {/* Main Card Content */}
                <div className="relative bg-black/60 border border-white/5 rounded-2xl p-5 flex justify-between items-center backdrop-blur-xl shadow-lg group-hover:border-white/20 group-hover:bg-black/80 transition-colors duration-300">
                  
                  {/* Left Side: Icon & Info */}
                  <div className="flex items-center gap-4 transform translate-z-[10px]">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center border backdrop-blur-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-colors duration-300 ${
                      tx.type === TransactionType.EARN 
                        ? 'border-white/10 bg-white/5 text-white group-hover:border-green-400/30 group-hover:text-green-400' 
                        : 'border-white/10 bg-white/5 text-white group-hover:border-blue-400/30 group-hover:text-blue-400'
                    }`}>
                      <span className="text-lg">
                        {tx.type === TransactionType.EARN ? '⚡' : '⬋'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold font-mono text-white tracking-wide group-hover:text-white transition-colors">
                        {tx.type === TransactionType.EARN ? 'Ad Reward' : `${tx.method}`}
                      </p>
                      <p className="text-[10px] text-white/30 mt-1 font-mono uppercase tracking-wider group-hover:text-white/50 transition-colors">
                        {new Date(tx.timestamp).toLocaleDateString()} • {new Date(tx.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Amount & Status */}
                  <div className="text-right transform translate-z-[15px]">
                    <p className={`font-mono text-base font-bold transition-all duration-300 ${
                      tx.type === TransactionType.EARN 
                        ? 'text-white group-hover:text-green-400 group-hover:drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]' 
                        : 'text-white/80 group-hover:text-white'
                    }`}>
                      {tx.type === TransactionType.EARN ? '+' : '-'}${tx.amount.toFixed(4)}
                    </p>
                    <div className={`text-[9px] font-bold uppercase tracking-widest mt-1.5 px-2 py-0.5 rounded border ${
                      tx.status === 'COMPLETED' 
                        ? 'border-green-500/20 bg-green-500/5 text-green-500/80' 
                        : 'border-yellow-500/20 bg-yellow-500/5 text-yellow-500/80'
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