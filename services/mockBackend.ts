import { User, Transaction, TransactionType, TransactionStatus, WithdrawalMethod, ShopItem } from '../types';
import { ROULETTE_PRIZES } from '../constants';

// --- LOCAL STORAGE KEYS ---
const KEY_USER = 'klover_user';
const KEY_TXS = 'klover_transactions';
const KEY_ADS = 'klover_ad_timestamps';
const API_BASE = 'http://localhost:3000/api'; // Point to your local Node server

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

  loginWithEmail: async (email: string): Promise<User> => {
    // Call Real Backend to Sync/Create User
    try {
        const res = await fetch(`${API_BASE}/auth/email`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (data.user) {
            currentUser = data.user;
            saveToStorage(KEY_USER, currentUser);
            return currentUser!;
        }
        throw new Error("Auth failed");
    } catch (e) {
        console.warn("Backend unavailable, using offline fallback", e);
        // Fallback Logic (Mock)
        if (currentUser && currentUser.email === email) return currentUser;
        const newUser: User = {
          id: Math.floor(Math.random() * 1000000),
          username: email.split('@')[0],
          email: email,
          firstName: "Miner",
          photoUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${email}`, 
          balance: 0.00,
          spins: 1, 
          points: 0,
          totalEarnings: 0.00,
          joinDate: new Date().toISOString()
        };
        currentUser = newUser;
        saveToStorage(KEY_USER, currentUser);
        return currentUser;
    }
  },

  loginWithTelegram: async (initDataUnsafe: any): Promise<User> => {
     // Simplified for this context, normally would POST initData to backend
    const tgUser = initDataUnsafe.user;
    if (!tgUser) throw new Error("No Telegram user data");

    if (currentUser && currentUser.id === tgUser.id) {
      currentUser.firstName = tgUser.first_name;
      currentUser.username = tgUser.username || '';
      currentUser.photoUrl = tgUser.photo_url || currentUser.photoUrl;
      saveToStorage(KEY_USER, currentUser);
      return currentUser;
    }

    const newUser: User = {
      id: tgUser.id,
      username: tgUser.username || `User${tgUser.id}`,
      email: `tg_${tgUser.id}`,
      firstName: tgUser.first_name,
      photoUrl: tgUser.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${tgUser.first_name}`,
      balance: 0.00,
      spins: 1, // Start with 1 free spin
      points: 0,
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

  // Grants a SPIN instead of cash
  creditReward: async (): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) throw new Error("Unauthorized");

    const now = Date.now();
    const recentAds = adViewTimestamps.filter(t => now - t < 3600000); 
    if (recentAds.length >= 20) {
      throw new Error("Rate limit exceeded. Try again later.");
    }
    
    if (adViewTimestamps.length > 0) {
      const last = adViewTimestamps[adViewTimestamps.length - 1];
      if (now - last < 5000) throw new Error("Too fast");
    }

    adViewTimestamps.push(now);
    currentUser.spins += 1;
    
    saveToStorage(KEY_ADS, adViewTimestamps);
    saveToStorage(KEY_USER, currentUser);
    
    // Sync with backend async
    fetch(`${API_BASE}/action/update`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ userId: currentUser.id, spins: currentUser.spins })
    }).catch(e => console.log('Sync failed', e));

    await new Promise(r => setTimeout(r, 500));
    return { success: true, message: "+1 Spin Added" };
  },

  // Play Roulette Logic
  spinRoulette: async (): Promise<{ prize: typeof ROULETTE_PRIZES[0], user: User }> => {
    if (!currentUser) throw new Error("Unauthorized");
    if (currentUser.spins <= 0) throw new Error("No spins available");

    // Deduct Spin
    currentUser.spins -= 1;

    // Weighted RNG
    const totalWeight = ROULETTE_PRIZES.reduce((acc, p) => acc + p.weight, 0);
    let random = Math.random() * totalWeight;
    let selectedPrize = ROULETTE_PRIZES[0];

    for (const prize of ROULETTE_PRIZES) {
      if (random < prize.weight) {
        selectedPrize = prize;
        break;
      }
      random -= prize.weight;
    }

    // Apply Prize
    if (selectedPrize.type === 'CASH') {
      currentUser.balance += selectedPrize.value;
      currentUser.totalEarnings += selectedPrize.value;
    } else {
      currentUser.points += selectedPrize.value;
    }

    // Record Transaction
    const tx: Transaction = {
      id: `spin_${Date.now()}`,
      type: TransactionType.EARN,
      amount: selectedPrize.value,
      currency: selectedPrize.type === 'CASH' ? 'USD' : 'PTS',
      status: TransactionStatus.COMPLETED,
      timestamp: Date.now(),
      details: "Lucky Spin Reward"
    };
    transactions.unshift(tx);

    saveToStorage(KEY_USER, currentUser);
    saveToStorage(KEY_TXS, transactions);

    // Sync Backend
    fetch(`${API_BASE}/action/update`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ 
            userId: currentUser.id, 
            spins: currentUser.spins, 
            balance: currentUser.balance, 
            points: currentUser.points 
        })
    }).catch(e => console.log('Sync failed', e));

    return { prize: selectedPrize, user: currentUser };
  },

  // Buy Shop Item Logic
  buyShopItem: async (item: ShopItem): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) throw new Error("Unauthorized");
    
    if (item.currency === 'PTS') {
      if (currentUser.points < item.price) throw new Error("Insufficient Points");
      currentUser.points -= item.price;
    }

    // Effect Logic
    let message = `Purchased ${item.name}`;
    
    switch (item.id) {
        case 'cash_conversion_1':
            currentUser.balance += 0.01;
            currentUser.totalEarnings += 0.01;
            break;
        case 'buy_spin_5':
            currentUser.spins += 5;
            break;
        case 'golden_ticket':
            currentUser.spins += 25;
            message = "Legendary! +25 Spins added.";
            break;
        case 'nano_miner':
            currentUser.balance += 0.05;
            currentUser.totalEarnings += 0.05;
            message = "Miner yielded $0.05 instantly.";
            break;
        default:
            break;
    }

    const tx: Transaction = {
      id: `shop_${Date.now()}`,
      type: TransactionType.SHOP_PURCHASE,
      amount: item.price,
      currency: 'PTS',
      status: TransactionStatus.COMPLETED,
      timestamp: Date.now(),
      details: `Bought: ${item.name}`
    };
    transactions.unshift(tx);

    saveToStorage(KEY_USER, currentUser);
    saveToStorage(KEY_TXS, transactions);

    return { success: true, message };
  },

  withdraw: async (method: WithdrawalMethod, amount: number, address: string): Promise<Transaction> => {
    if (!currentUser) throw new Error("Unauthorized");

    // TRY REAL BACKEND WITHDRAWAL
    try {
        const response = await fetch(`${API_BASE}/withdraw`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser.id,
                amount: amount,
                address: address,
                method: method
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || "Withdrawal failed");
        }

        // Update Local State based on backend success
        if (data.newBalance !== undefined) {
            currentUser.balance = data.newBalance;
            saveToStorage(KEY_USER, currentUser);
        }
        
        // Add to local transactions list for UI display
        if (data.transaction) {
            transactions.unshift(data.transaction);
            saveToStorage(KEY_TXS, transactions);
            return data.transaction;
        }

        throw new Error("Invalid backend response");

    } catch (e: any) {
        console.error("Backend Withdrawal Failed:", e);
        throw e; // Propagate error to UI
    }
  },

  getUser: async (): Promise<User> => {
    if (!currentUser) throw new Error("Not authenticated");
    return currentUser;
  },
  
  getHistory: async () => transactions
};