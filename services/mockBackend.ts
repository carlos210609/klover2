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
let currentUser: User | null = loadFromStorage<User | null>(KEY_USER, null);
let transactions: Transaction[] = loadFromStorage<Transaction[]>(KEY_TXS, []);
let adViewTimestamps: number[] = loadFromStorage<number[]>(KEY_ADS, []);

export const backendService = {
  
  isAuthenticated: (): boolean => {
    return !!currentUser;
  },

  // LOGIN METHOD 1: EMAIL (Web/Browser)
  loginWithEmail: async (email: string): Promise<User> => {
    await new Promise(r => setTimeout(r, 800)); 
    
    // Check if this email matches stored session
    if (currentUser && currentUser.email === email) {
      return currentUser;
    }

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

  // LOGIN METHOD 2: TELEGRAM (Native App)
  loginWithTelegram: async (initDataUnsafe: any): Promise<User> => {
    // In a real app, we would send the raw 'initData' string to the backend
    // to be validated with the Bot Token (840723...). 
    // Here in the frontend mock, we trust the unsafe data for the UI demo.
    
    const tgUser = initDataUnsafe.user;
    if (!tgUser) throw new Error("No Telegram user data");

    // Check if we already have this user cached
    if (currentUser && currentUser.id === tgUser.id) {
      // Update photo/name if changed
      currentUser.firstName = tgUser.first_name;
      currentUser.username = tgUser.username || '';
      currentUser.photoUrl = tgUser.photo_url || currentUser.photoUrl;
      saveToStorage(KEY_USER, currentUser);
      return currentUser;
    }

    const newUser: User = {
      id: tgUser.id,
      username: tgUser.username || `User${tgUser.id}`,
      email: `tg_${tgUser.id}`, // Internal ID for Telegram users
      firstName: tgUser.first_name,
      photoUrl: tgUser.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${tgUser.first_name}`,
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
  },

  creditReward: async (): Promise<{ success: boolean; newBalance: number; message: string }> => {
    if (!currentUser) throw new Error("Unauthorized");

    const now = Date.now();
    const recentAds = adViewTimestamps.filter(t => now - t < 3600000); 
    if (recentAds.length >= 20) {
      throw new Error("Rate limit exceeded. Try again later.");
    }
    
    // Simple cooldown
    if (adViewTimestamps.length > 0) {
      const last = adViewTimestamps[adViewTimestamps.length - 1];
      if (now - last < 5000) throw new Error("Too fast");
    }

    adViewTimestamps.push(now);
    currentUser.balance += REWARD_PER_AD;
    currentUser.totalEarnings += REWARD_PER_AD;
    
    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      type: TransactionType.EARN,
      amount: REWARD_PER_AD,
      status: TransactionStatus.COMPLETED,
      timestamp: now,
      details: "Ad Reward"
    };
    transactions.unshift(tx);

    saveToStorage(KEY_ADS, adViewTimestamps);
    saveToStorage(KEY_USER, currentUser);
    saveToStorage(KEY_TXS, transactions);

    await new Promise(r => setTimeout(r, 500));
    return { success: true, newBalance: currentUser.balance, message: "Reward Credited" };
  },

  withdraw: async (method: WithdrawalMethod, amount: number, address: string): Promise<Transaction> => {
    if (!currentUser) throw new Error("Unauthorized");
    if (amount > currentUser.balance) throw new Error("Insufficient balance");

    currentUser.balance -= amount;

    const tx: Transaction = {
      id: `wd_${Date.now()}`,
      type: TransactionType.WITHDRAWAL,
      amount: amount,
      method: method,
      status: TransactionStatus.PENDING,
      timestamp: Date.now(),
      details: `To: ${address}`
    };
    
    transactions.unshift(tx);
    
    saveToStorage(KEY_USER, currentUser);
    saveToStorage(KEY_TXS, transactions);
    
    setTimeout(() => {
        const t = transactions.find(tr => tr.id === tx.id);
        if(t) {
            t.status = TransactionStatus.COMPLETED;
            saveToStorage(KEY_TXS, transactions);
        }
    }, 5000);

    return tx;
  },

  getUser: async (): Promise<User> => {
    if (!currentUser) throw new Error("Not authenticated");
    return currentUser;
  },
  
  getHistory: async () => transactions
};