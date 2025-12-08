import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { WithdrawalMethod } from '../types';
import { backendService } from '../services/mockBackend';
import { MIN_WITHDRAWAL } from '../constants';
import { IconLock } from '../components/Icons';
import { useLanguage } from '../App';

const Wallet: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [method, setMethod] = useState<WithdrawalMethod>(WithdrawalMethod.CWALLET);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    backendService.getUser().then(u => setBalance(u.balance));
  }, []);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount < MIN_WITHDRAWAL[method]) {
        setMessage({type: 'error', text: `${t('error_min')} $${MIN_WITHDRAWAL[method]}`});
        setLoading(false);
        return;
    }

    try {
      await backendService.withdraw(method, numAmount, address);
      setMessage({type: 'success', text: t('success_withdraw')});
      const u = await backendService.getUser();
      setBalance(u.balance);
      setAmount('');
    } catch (err: any) {
      setMessage({type: 'error', text: err.message});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="px-2">
        <h2 className="text-xl font-bold font-mono text-white tracking-tight uppercase border-l-4 border-cyan-500 pl-3">{t('withdraw_funds')}</h2>
      </div>

      <div className="relative p-6 rounded-2xl bg-[#0f172a] border border-white/10 overflow-hidden group">
         <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/20 transition-colors duration-700"></div>
         <p className="text-[10px] text-white/50 font-tech mb-2 uppercase tracking-widest">{t('avail_bal')}</p>
         <div className="flex items-baseline gap-1">
             <p className="text-4xl font-mono font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">${balance.toFixed(4)}</p>
         </div>
      </div>

      <form onSubmit={handleWithdraw} className="space-y-6">
        {/* Method Selection */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMethod(WithdrawalMethod.CWALLET)}
            className={`p-4 rounded-xl border text-[10px] font-bold font-mono uppercase tracking-widest transition-all duration-300 relative overflow-hidden ${
              method === WithdrawalMethod.CWALLET 
              ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
              : 'bg-black/40 text-white/40 border-white/10 hover:border-white/30 hover:text-white/80'
            }`}
          >
            {method === WithdrawalMethod.CWALLET && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent animate-shimmer skew-x-12"></div>}
            {t('method_cwallet')}
          </button>
          <button
            type="button"
            onClick={() => setMethod(WithdrawalMethod.FAUCETPAY)}
            className={`p-4 rounded-xl border text-[10px] font-bold font-mono uppercase tracking-widest transition-all duration-300 relative overflow-hidden ${
              method === WithdrawalMethod.FAUCETPAY
              ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
              : 'bg-black/40 text-white/40 border-white/10 hover:border-white/30 hover:text-white/80'
            }`}
          >
            {method === WithdrawalMethod.FAUCETPAY && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent animate-shimmer skew-x-12"></div>}
            {t('method_faucetpay')}
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 bg-slate-900/50 p-4 rounded-xl border border-white/5">
          <div>
            <label className="block text-[9px] font-tech text-cyan-400 mb-2 uppercase tracking-widest">
              {method === WithdrawalMethod.CWALLET ? t('label_cwallet') : t('label_faucetpay')}
            </label>
            <div className="relative">
                <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all font-mono placeholder-white/10"
                placeholder={method === WithdrawalMethod.CWALLET ? "user@example.com" : "BTC Address..."}
                required
                />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-tech text-cyan-400 mb-2 uppercase tracking-widest">{t('label_amount')}</label>
            <div className="relative group">
              <span className="absolute left-3 top-3 text-white/30 group-focus-within:text-white transition-colors font-mono">$</span>
              <input
                type="number"
                step="0.0001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-lg p-3 pl-7 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all font-mono placeholder-white/10"
                placeholder="0.0000"
                required
              />
            </div>
            <div className="flex justify-between mt-2">
                <p className="text-[9px] text-white/30 font-mono">
                FEE: <span className="text-white/50">0%</span>
                </p>
                <p className="text-[9px] text-white/30 font-mono">
                {t('min_withdraw')}: <span className="text-white/70">${MIN_WITHDRAWAL[method]}</span>
                </p>
            </div>
          </div>
        </div>

        <Button type="submit" isLoading={loading} className="mt-4 !bg-cyan-600 !border-cyan-500/50 hover:!shadow-[0_0_20px_rgba(6,182,212,0.4)]">
           {loading ? t('process_tx') : t('confirm_withdraw')}
        </Button>
      </form>
      
      {message && (
        <div className={`p-4 rounded-xl text-xs font-mono border animate-pop-in ${
          message.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex justify-center items-center gap-2 text-[9px] text-white/20 uppercase tracking-[0.2em] font-tech pt-8">
        <IconLock className="w-3 h-3" />
        {t('secure_tx')}
      </div>
    </div>
  );
};

export default Wallet;