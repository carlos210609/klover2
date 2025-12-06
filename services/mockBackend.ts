import { User, Transaction, TransactionType, TransactionStatus, WithdrawalMethod } from '../types';
import { REWARD_PER_AD } from '../constants';

// --- MOCK DATABASE ---
let currentUser: User = {
  id: 123456,
  username: "klover_user",
  firstName: "Crypto Nomad",
  photoUrl: "https://picsum.photos/200/200", // Placeholder
  balance: 0.00,
  totalEarnings: 0.00,
  joinDate: new Date().toISOString()
};

let transactions: Transaction[] = [];

// --- ANTI-FRAUD STATE ---
const adViewTimestamps: number[] = [];
const MIN_TIME_BETWEEN_ADS = 15000; // 15 seconds
const MAX_ADS_PER_HOUR = 20;

export const backendService = {
  
  // 1. Authenticate (Simulated)
  login: async (telegramInitData: string): Promise<User> => {
    // In real app: Verify signature of initData with Bot Token
    console.log("Validating Telegram Data:", telegramInitData);
    await new Promise(r => setTimeout(r, 800)); // Network delay
    return { ...currentUser };
  },

  // 2. Ad Reward Logic (Critical)
  creditReward: async (): Promise<{ success: boolean; newBalance: number; message: string }> => {
    const now = Date.now();
    
    // Anti-Fraud: Rate Limiting
    const recentAds = adViewTimestamps.filter(t => now - t < 3600000); // last hour
    if (recentAds.length >= MAX_ADS_PER_HOUR) {
      throw new Error("Rate limit exceeded. Try again later.");
    }

    if (adViewTimestamps.length > 0) {
      const lastAdTime = adViewTimestamps[adViewTimestamps.length - 1];
      if (now - lastAdTime < MIN_TIME_BETWEEN_ADS) {
         throw new Error("Watching too fast. Slow down.");
      }
    }

    // Process Reward
    adViewTimestamps.push(now);
    currentUser.balance += REWARD_PER_AD;
    currentUser.totalEarnings += REWARD_PER_AD;
    
    // Record Transaction
    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      type: TransactionType.EARN,
      amount: REWARD_PER_AD,
      status: TransactionStatus.COMPLETED,
      timestamp: now,
      details: "Ad Reward"
    };
    transactions.unshift(tx);

    await new Promise(r => setTimeout(r, 500)); // Database latency
    return { success: true, newBalance: currentUser.balance, message: "Reward Credited" };
  },

  // 3. Withdrawal Logic
  withdraw: async (method: WithdrawalMethod, amount: number, address: string): Promise<Transaction> => {
    if (amount > currentUser.balance) {
      throw new Error("Insufficient balance");
    }

    // Deduct Balance
    currentUser.balance -= amount;

    const tx: Transaction = {
      id: `wd_${Date.now()}`,
      type: TransactionType.WITHDRAWAL,
      amount: amount,
      method: method,
      status: TransactionStatus.PENDING, // Pending until admin/auto-process checks
      timestamp: Date.now(),
      details: `To: ${address}`
    };
    
    transactions.unshift(tx);
    
    // Simulate Processing time
    setTimeout(() => {
        // Find and update transaction status to completed for demo
        const t = transactions.find(tr => tr.id === tx.id);
        if(t) t.status = TransactionStatus.COMPLETED;
    }, 5000);

    return tx;
  },

  // 4. Get Data
  getUser: async () => currentUser,
  getHistory: async () => transactions
};