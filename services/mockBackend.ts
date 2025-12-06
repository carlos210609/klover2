import { User, Transaction, TransactionType, TransactionStatus, WithdrawalMethod } from '../types';
import { REWARD_PER_AD } from '../constants';

// --- LOCAL STORAGE KEYS ---
const KEY_USER = 'klover_user';
const KEY_TXS = 'klover_transactions';
const KEY_ADS = 'klover_ad_timestamps';

// --- MOCK DATABASE HELPER ---
const loadFromStorage = <T>(key: string, defaultVal: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const saveToStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// --- INITIAL STATE ---
// We start with null if no user is saved, forcing a login.
let currentUser: User | null = loadFromStorage<User | null>(KEY_USER, null);

let transactions: Transaction[] = loadFromStorage<Transaction[]>(KEY_TXS, []);
let adViewTimestamps: number[] = loadFromStorage<number[]>(KEY_ADS, []);

const MIN_TIME_BETWEEN_ADS = 15000; // 15 seconds
const MAX_ADS_PER_HOUR = 20;

export const backendService = {
  
  // 1. Check Auth Status
  isAuthenticated: (): boolean => {
    return !!currentUser;
  },

  // 2. Login with Email (Passwordless/FaucetPay ID)
  loginWithEmail: async (email: string): Promise<User> => {
    await new Promise(r => setTimeout(r, 1500)); // Simulate network/handshake
    
    // In a real app, this would check the backend DB.
    // For this standalone version, if the stored user matches the email, we return it.
    // If not, or if no user exists, we create a new identity for this email.
    
    if (currentUser && currentUser.email === email) {
      return currentUser;
    }

    // Create new user or overwrite session
    const newUser: User = {
      id: Math.floor(Math.random() * 1000000),
      username: email.split('@')[0],
      email: email,
      firstName: "Miner",
      photoUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${email}`, 
      balance: 0.00,
      totalEarnings: 0.00,
      joinDate: new Date().toISOString()
    };

    currentUser = newUser;
    saveToStorage(KEY_USER, currentUser);
    return currentUser;
  },

  logout: async (): Promise<void> => {
    currentUser = null;
    localStorage.removeItem(KEY_USER);
    // Optional: clear other data if you want a fresh start per login
    // localStorage.removeItem(KEY_TXS);
  },

  // 3. Ad Reward Logic
  creditReward: async (): Promise<{ success: boolean; newBalance: number; message: string }> => {
    if (!currentUser) throw new Error("Unauthorized");

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

    // Persist
    saveToStorage(KEY_ADS, adViewTimestamps);
    saveToStorage(KEY_USER, currentUser);
    saveToStorage(KEY_TXS, transactions);

    await new Promise(r => setTimeout(r, 500)); // Database latency
    return { success: true, newBalance: currentUser.balance, message: "Reward Credited" };
  },

  // 4. Withdrawal Logic
  withdraw: async (method: WithdrawalMethod, amount: number, address: string): Promise<Transaction> => {
    if (!currentUser) throw new Error("Unauthorized");
    
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
    
    // Persist
    saveToStorage(KEY_USER, currentUser);
    saveToStorage(KEY_TXS, transactions);
    
    // Simulate Processing time
    setTimeout(() => {
        const t = transactions.find(tr => tr.id === tx.id);
        if(t) {
            t.status = TransactionStatus.COMPLETED;
            saveToStorage(KEY_TXS, transactions);
        }
    }, 5000);

    return tx;
  },

  // 5. Get Data
  getUser: async (): Promise<User> => {
    if (!currentUser) throw new Error("Not authenticated");
    return currentUser;
  },
  
  getHistory: async () => transactions
};