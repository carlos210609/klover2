import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { WithdrawalMethod } from '../types';
import { backendService } from '../services/mockBackend';
import { MIN_WITHDRAWAL } from '../constants';
import { IconLock } from '../components/Icons';

const Wallet: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [method, setMethod] = useState<WithdrawalMethod>(WithdrawalMethod.CWALLET);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  useEffect(() => {
    backendService.getUser().then(u => setBalance(u.balance));
  }, []);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const numAmount = parseFloat(amount);

    // Frontend validation
    if (isNaN(numAmount) || numAmount < MIN_WITHDRAWAL[method]) {
        setMessage({type: 'error', text: `Minimum withdrawal is $${MIN_WITHDRAWAL[method]}`});
        setLoading(false);
        return;
    }

    try {
      await backendService.withdraw(method, numAmount, address);
      setMessage({type: 'success', text: 'Withdrawal request sent successfully!'});
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
      <div className="px-1">
        <h2 className="text-2xl font-bold font-mono text-white tracking-tight">Withdraw</h2>
      </div>

      <Card className="bg-gradient-to-br from-white/10 to-transparent border-white/20 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
         <p className="text-xs text-white/50 font-mono mb-1 uppercase tracking-widest">Available Balance</p>
         <p className="text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">${balance.toFixed(4)}</p>
      </Card>

      <form onSubmit={handleWithdraw} className="space-y-4">
        {/* Method Selection */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMethod(WithdrawalMethod.CWALLET)}
            className={`p-4 rounded-xl border text-xs font-bold font-mono uppercase tracking-wider transition-all duration-300 ${
              method === WithdrawalMethod.CWALLET 
              ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
              : 'bg-black/40 text-white/40 border-white/10 hover:border-white/30 hover:text-white/80'
            }`}
          >
            CWALLET
          </button>
          <button
            type="button"
            onClick={() => setMethod(WithdrawalMethod.FAUCETPAY)}
            className={`p-4 rounded-xl border text-xs font-bold font-mono uppercase tracking-wider transition-all duration-300 ${
              method === WithdrawalMethod.FAUCETPAY
              ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
              : 'bg-black/40 text-white/40 border-white/10 hover:border-white/30 hover:text-white/80'
            }`}
          >
            FAUCETPAY
          </button>
        </div>

        {/* Form Fields */}
        <Card className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-white/60 mb-2 uppercase tracking-wide">
              {method === WithdrawalMethod.CWALLET ? 'CWallet Email / ID' : 'FaucetPay Address'}
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              /* text-base prevents iOS zoom on focus */
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-base text-white focus:outline-none focus:border-white/50 focus:bg-white/5 transition-all font-mono placeholder-white/20"
              placeholder={method === WithdrawalMethod.CWALLET ? "user@example.com" : "BTC Address..."}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-white/60 mb-2 uppercase tracking-wide">Amount (USD)</label>
            <div className="relative group">
              <span className="absolute left-3 top-3.5 text-white/40 group-focus-within:text-white transition-colors">$</span>
              <input
                type="number"
                step="0.0001"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                /* text-base prevents iOS zoom on focus */
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 pl-7 text-base text-white focus:outline-none focus:border-white/50 focus:bg-white/5 transition-all font-mono"
                placeholder="0.0000"
                required
              />
            </div>
            <p className="text-[10px] text-white/30 mt-2 text-right font-mono">
              Min: ${MIN_WITHDRAWAL[method]}
            </p>
          </div>
        </Card>

        <Button type="submit" isLoading={loading} className="mt-4">
           {loading ? 'PROCESSING...' : 'CONFIRM WITHDRAWAL'}
        </Button>
      </form>
      
      {message && (
        <div className={`p-4 rounded-xl text-xs font-mono border animate-fade-in-up ${
          message.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex justify-center items-center gap-2 text-[10px] text-white/30 uppercase tracking-widest font-mono pt-4">
        <IconLock className="w-3 h-3" />
        Secure Encrypted Transaction
      </div>
    </div>
  );
};

export default Wallet;