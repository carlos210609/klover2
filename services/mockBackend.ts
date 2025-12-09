
import { User, Transaction, TransactionType, TransactionStatus, WithdrawalMethod, Chest, ChestRarity, Mission } from '../types';
import { LEVELS, CHEST_DEFINITIONS, BASE_AD_REWARD_XP, DAILY_MISSIONS, WEEKLY_MISSIONS } from '../constants';

// --- LOCAL STORAGE KEYS ---
const KEY_USER = 'klover_v2_user';
const KEY_TXS = 'klover_v2_transactions';

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


const createNewUser = (id: string | number, email: string, username: string, firstName?: string, photoUrl?: string, referredBy?: string): User => ({
    id,
    email,
    username,
    firstName: firstName || 'Klover User',
    photoUrl: photoUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${email}`,
    balance: 0.00,
    tonBalance: 0.00,
    xp: 0,
    level: 1,
    chests: [{ id: `chest_${Date.now()}`, rarity: 'COMMON', acquiredAt: Date.now() }],
    activeBoosters: [],
    dailyStreak: 1,
    lastLogin: new Date().toISOString(),
    referredBy,
    referralEarnings: 0,
    joinDate: new Date().toISOString(),
    status: 'ACTIVE',
});

const addTransaction = (tx: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTx: Transaction = {
        ...tx,
        id: `tx_${Date.now()}`,
        timestamp: Date.now(),
    };
    transactions.unshift(newTx);
    saveToStorage(KEY_TXS, transactions);
};

export const backendService = {
  
  isAuthenticated: (): boolean => !!currentUser,

  loginWithTelegram: async (initDataUnsafe: any, referralCode?: string): Promise<User> => {
    const tgUser = initDataUnsafe.user;
    if (!tgUser) throw new Error("No Telegram user data");

    // Try to find existing user first
    let user = await backendService.getUserById(tgUser.id);
    if (user) {
        currentUser = user;
        currentUser.lastLogin = new Date().toISOString();
        // Here you could add logic for daily streak
        saveToStorage(KEY_USER, currentUser);
        return currentUser;
    }

    // Create new user if not found
    const newUser = createNewUser(
        tgUser.id, 
        `tg_${tgUser.id}`, 
        tgUser.username || `user${tgUser.id}`, 
        tgUser.first_name, 
        tgUser.photo_url,
        referralCode
    );
    
    currentUser = newUser;
    saveToStorage(KEY_USER, currentUser);
    return currentUser;
  },

  logout: async (): Promise<void> => {
    currentUser = null;
    localStorage.removeItem(KEY_USER);
  },

  // Simulate watching an ad and getting a reward
  creditAdReward: async (): Promise<{ success: boolean; xp: number; chest: Chest }> => {
    if (!currentUser) throw new Error("Unauthorized");

    // 1. Grant XP
    const xpGained = BASE_AD_REWARD_XP; // Add booster logic later
    currentUser.xp += xpGained;
    
    // 2. Check for Level Up
    const currentLevelInfo = LEVELS[currentUser.level - 1];
    if (currentUser.xp >= currentLevelInfo.xpRequired) {
      currentUser.level += 1;
      // Maybe grant a level-up chest?
    }

    // 3. Grant a chest based on smart RNG
    const random = Math.random();
    let cumulativeProbability = 0;
    let awardedRarity: ChestRarity = 'COMMON';
    for (const rarity in CHEST_DEFINITIONS) {
      const chestInfo = CHEST_DEFINITIONS[rarity as ChestRarity];
      cumulativeProbability += chestInfo.probability;
      if (random <= cumulativeProbability) {
        awardedRarity = rarity as ChestRarity;
        break;
      }
    }

    const newChest: Chest = {
      id: `chest_${Date.now()}`,
      rarity: awardedRarity,
      acquiredAt: Date.now(),
    };
    currentUser.chests.push(newChest);

    addTransaction({
        type: TransactionType.AD_REWARD,
        amount: xpGained,
        currency: 'XP',
        status: TransactionStatus.COMPLETED,
        details: `Watched ad stream, got ${awardedRarity} chest`
    });

    saveToStorage(KEY_USER, currentUser);

    return { success: true, xp: xpGained, chest: newChest };
  },

  openChest: async (chestId: string): Promise<{ success: boolean; rewardAmount: number; rewardCurrency: 'BRL' | 'TON' }> => {
    if (!currentUser) throw new Error("Unauthorized");

    const chestIndex = currentUser.chests.findIndex(c => c.id === chestId);
    if (chestIndex === -1) throw new Error("Chest not found");

    const chestToOpen = currentUser.chests[chestIndex];
    const chestInfo = CHEST_DEFINITIONS[chestToOpen.rarity];

    // Simple reward logic for now
    const reward = chestInfo.rewards[0];
    const rewardAmount = Math.random() * (reward.max - reward.min) + reward.min;
    
    if(reward.type === 'BRL') {
        currentUser.balance += rewardAmount;
    }
    // Add TON logic if needed

    // Remove chest from inventory
    currentUser.chests.splice(chestIndex, 1);

    addTransaction({
        type: TransactionType.CHEST_REWARD,
        amount: rewardAmount,
        currency: 'BRL',
        status: TransactionStatus.COMPLETED,
        details: `Opened ${chestInfo.name}`
    });

    saveToStorage(KEY_USER, currentUser);

    return { success: true, rewardAmount, rewardCurrency: 'BRL' };
  },

  withdraw: async (method: WithdrawalMethod, amount: number, address: string): Promise<Transaction> => {
    if (!currentUser) throw new Error("Unauthorized");
    
    if (method === 'PIX' && currentUser.balance < amount) throw new Error("Insufficient BRL balance");
    if (method === 'TON' && currentUser.tonBalance < amount) throw new Error("Insufficient TON balance");

    // Deduct balance optimistically
    if (method === 'PIX') currentUser.balance -= amount;
    if (method === 'TON') currentUser.tonBalance -= amount;

    const newTx: Transaction = {
      id: `wd_${Date.now()}`,
      type: TransactionType.WITHDRAWAL,
      amount,
      currency: method === 'PIX' ? 'BRL' : 'TON',
      method,
      status: TransactionStatus.PENDING, // Mock: should be pending until confirmed
      timestamp: Date.now(),
      details: `To: ${address}`
    };
    transactions.unshift(newTx);
    
    saveToStorage(KEY_USER, currentUser);
    saveToStorage(KEY_TXS, transactions);

    // Simulate backend processing
    await new Promise(r => setTimeout(r, 2000));
    const txIndex = transactions.findIndex(t => t.id === newTx.id);
    if(txIndex > -1) {
        transactions[txIndex].status = TransactionStatus.COMPLETED;
        saveToStorage(KEY_TXS, transactions);
    }

    return transactions[txIndex];
  },

  getMissions: async(): Promise<Mission[]> => {
    // In a real app, this would check user's progress from the backend.
    // Here, we just return the static definitions with mock progress.
    return [...DAILY_MISSIONS, ...WEEKLY_MISSIONS].map(m => ({
        ...m,
        progress: 0, // Mock progress
        isComplete: false
    }));
  },

  getUser: async (): Promise<User> => {
    if (!currentUser) {
        // Create a default mock user for development if none exists
        const mockUser = createNewUser(12345, 'dev@klover.app', 'dev_user');
        currentUser = mockUser;
        saveToStorage(KEY_USER, currentUser);
    }
    return JSON.parse(JSON.stringify(currentUser)); // Return a copy
  },

  getUserById: async(id: string | number): Promise<User | null> => {
    // This is a mock. In a real backend, you'd query the DB.
    // For now, we only have one user in localStorage.
    if (currentUser && currentUser.id.toString() === id.toString()) {
      return currentUser;
    }
    return null;
  },
  
  getHistory: async (): Promise<Transaction[]> => transactions,

  getRanking: async(): Promise<any[]> => {
      // Mock ranking data
      return [
          { rank: 1, photoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Alice', username: 'Alice', level: 25, xp: 15000 },
          { rank: 2, photoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Bob', username: 'Bob', level: 23, xp: 13500 },
          { rank: 3, photoUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${currentUser?.email}`, username: currentUser?.username || 'You', level: currentUser?.level || 1, xp: currentUser?.xp || 0 },
          { rank: 4, photoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Charlie', username: 'Charlie', level: 20, xp: 11000 },
      ].sort((a,b) => a.xp > b.xp ? -1 : 1).map((u, i) => ({ ...u, rank: i+1 }));
  }
};
