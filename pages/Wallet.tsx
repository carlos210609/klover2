
import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { WithdrawalMethod, User } from '../types';
import { backendService } from '../services/mockBackend';
import { MIN_WITHDRAWAL } from '../constants';
import { useLanguage } from '../App';
import { IconPix } from '../components/Icons'; // Assuming a TON icon exists too

const Wallet: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [method, setMethod] = useState<WithdrawalMethod>(WithdrawalMethod.PIX);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    backendService.getUser().then(setUser);
  }, []);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const numAmount = parseFloat(amount);
    const min = method === WithdrawalMethod.PIX ? MIN_WITHDRAWAL.PIX : MIN_WITHDRAWAL.TON;

    if (isNaN(numAmount) || numAmount < min) {
        setMessage({type: 'error', text: `${t('min_withdrawal')}: ${min}`});
        setLoading(false);
        return;
    }

    try {
      await backendService.withdraw(method, numAmount, address);
      setMessage({type: 'success', text: t('success') + "!"});
      const updatedUser = await backendService.getUser();
      setUser(updatedUser);
      setAmount('');
      setAddress('');
    } catch (err: any) {
      setMessage({type: 'error', text: err.message});
    } finally {
      setLoading(false);
    }
  };

  const balance = method === WithdrawalMethod.PIX ? user?.balance : user?.tonBalance;
  const currency = method === WithdrawalMethod.PIX ? "BRL" : "TON";

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold font-display text-k-text-primary">{t('withdraw_funds')}</h1>
        <p className="text-sm text-k-text-secondary">Selecione o método e insira os detalhes para sacar.</p>
      </header>

      {/* Balance Display */}
      <div className="bg-k-surface border border-k-border rounded-xl p-4">
         <p className="text-sm text-k-text-secondary mb-1">Saldo Disponível</p>
         <p className="text-3xl font-bold font-display text-k-text-primary">
            {currency === 'BRL' ? 'R$ ' : ''}
            {(balance || 0).toFixed(2)}
            {currency === 'TON' ? ' TON' : ''}
         </p>
      </div>

      <form onSubmit={handleWithdraw} className="space-y-6">
        {/* Method Selection */}
        <div>
            <label className="text-sm font-medium text-k-text-secondary mb-2 block">{t('withdraw_method')}</label>
            <div className="grid grid-cols-2 gap-3">
            <button
                type="button"
                onClick={() => setMethod(WithdrawalMethod.PIX)}
                className={`p-4 rounded-xl border text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                method === WithdrawalMethod.PIX
                ? 'bg-k-accent text-k-black border-k-accent' 
                : 'bg-k-surface text-k-text-secondary border-k-border hover:border-k-border-hover'
                }`}
            >
                <IconPix className="w-5 h-5" /> PIX
            </button>
            <button
                type="button"
                onClick={() => setMethod(WithdrawalMethod.TON)}
                className={`p-4 rounded-xl border text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                method === WithdrawalMethod.TON
                ? 'bg-k-accent text-k-black border-k-accent' 
                : 'bg-k-surface text-k-text-secondary border-k-border hover:border-k-border-hover'
                }`}
            >
                <span className="font-bold">TON</span>
            </button>
            </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-k-text-secondary mb-2">
              {method === WithdrawalMethod.PIX ? t('pix_key') : t('ton_address')}
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-k-bg border border-k-border rounded-lg p-3 text-k-text-primary focus:outline-none focus:border-k-accent focus:ring-2 focus:ring-k-accent-glow transition-all"
              placeholder={method === WithdrawalMethod.PIX ? "email@exemplo.com" : "UQ..."}
              required
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-k-text-secondary mb-2">
              {method === WithdrawalMethod.PIX ? t('amount_brl') : t('amount_ton')}
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-k-bg border border-k-border rounded-lg p-3 text-k-text-primary focus:outline-none focus:border-k-accent focus:ring-2 focus:ring-k-accent-glow transition-all"
              placeholder="0.00"
              required
            />
            <p className="text-xs text-k-text-tertiary mt-2">
              {t('min_withdrawal')}: {method === WithdrawalMethod.PIX ? `R$ ${MIN_WITHDRAWAL.PIX.toFixed(2)}` : `${MIN_WITHDRAWAL.TON} TON`}
            </p>
          </div>
        </div>

        <Button type="submit" isLoading={loading}>
           {loading ? t('processing') : t('confirm_withdrawal')}
        </Button>
      </form>
      
      {message && (
        <div className={`p-4 rounded-xl text-sm border ${
          message.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-300' 
            : 'bg-red-500/10 border-red-500/20 text-red-300'
        }`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default Wallet;
