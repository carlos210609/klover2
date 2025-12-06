import { User, Transaction, TransactionType, TransactionStatus, WithdrawalMethod } from '../types';
import { REWARD_PER_AD } from '../constants';

// --- PERSISTENCE HELPERS ---
const STORAGE_KEYS = {
  USER: 'klover_user_v2',
  TXS: 'klover_txs_v2',
  ADS: 'klover_ads_v2'
};

const loadState = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Failed to load ${key}`, e);
    return fallback;
  }
};

const saveState = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to save ${key}`, e);
  }
};

// --- MOCK DATABASE ---
const generateRandomUser = (): User => {
  const randomId = Math.floor(Math.random() * 900000) + 100000;
  return {
    id: randomId,
    username: `user_${randomId}`,
    firstName: "Anonymous",
    photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomId}&backgroundColor=000000`, // Generates a cool avatar
    balance: 0.00,
    totalEarnings: 0.00,
    joinDate: new Date().toISOString()
  };
};

let currentUser: User | null = null;
let transactions: Transaction[] = loadState(STORAGE_KEYS.TXS, []);
let adViewTimestamps: number[] = loadState(STORAGE_KEYS.ADS, []);

// --- ANTI-FRAUD CONFIG ---
const MIN_TIME_BETWEEN_ADS = 15000; // 15 seconds
const MAX_ADS_PER_HOUR = 20;

export const backendService = {
  
  // 1. Authenticate (Device/Local Based)
  login: async (): Promise<User> => {
    // Try to load user from local storage
    const storedUser = loadState<User | null>(STORAGE_KEYS.USER, null);
    
    if (storedUser) {
      currentUser = storedUser;
      console.log("Session restored for:", currentUser.username);
    } else {
      // Create new user if none exists
      currentUser = generateRandomUser();
      saveState(STORAGE_KEYS.USER, currentUser);
      console.log("New user generated:", currentUser.username);
    }

    // Simulate network delay
    await new Promise(r => setTimeout(r, 500)); 
    return { ...currentUser };
  },

  // 2. Ad Reward Logic (Critical)
  creditReward: async (): Promise<{ success: boolean; newBalance: number; message: string }> => {
    if (!currentUser) throw new Error("Not authenticated");

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

    // Persist changes
    saveState(STORAGE_KEYS.USER, currentUser);
    saveState(STORAGE_KEYS.TXS, transactions);
    saveState(STORAGE_KEYS.ADS, adViewTimestamps);

    await new Promise(r => setTimeout(r, 500)); // Database latency
    return { success: true, newBalance: currentUser.balance, message: "Reward Credited" };
  },

  // 3. Withdrawal Logic
  withdraw: async (method: WithdrawalMethod, amount: number, address: string): Promise<Transaction> => {
    if (!currentUser) throw new Error("Not authenticated");
    
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
    
    // Persist changes
    saveState(STORAGE_KEYS.USER, currentUser);
    saveState(STORAGE_KEYS.TXS, transactions);

    // Simulate Processing time
    setTimeout(() => {
        // Find and update transaction status to completed for demo
        const t = transactions.find(tr => tr.id === tx.id);
        if(t) {
            t.status = TransactionStatus.COMPLETED;
            saveState(STORAGE_KEYS.TXS, transactions); // Save updated status
        }
    }, 5000);

    return tx;
  },

  // 4. Get Data
  getUser: async () => {
    if (!currentUser) {
        // If getting user before login, try to login implicitly
        return await backendService.login();
    }
    return currentUser;
  },
  getHistory: async () => transactions
};