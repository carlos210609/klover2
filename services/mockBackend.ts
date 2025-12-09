// Klover 2.0 Mock Backend Service
// This service simulates a real backend to make the app fully interactive.
// It manages user data, authentication, missions, and rewards.

// FIX: Added ChestRarity, TransactionStatus, and WithdrawalMethod to imports for type safety.
import { User, Mission, Transaction, TransactionType, RankEntry, ChestRarity, TransactionStatus, WithdrawalMethod } from '../types';
import { DAILY_MISSIONS, WEEKLY_MISSIONS, LEVELS, CHEST_DEFINITIONS } from '../constants';

const FAKE_LATENCY = 500; // ms

class BackendService {
  private user: User | null = null;
  private missions: Mission[] = [];
  private transactions: Transaction[] = [];

  constructor() {
    this.loadFromLocalStorage();
  }
  
  private generateInitialMissions(): Mission[] {
    const daily = DAILY_MISSIONS.map(m => ({ ...m, progress: 0, isComplete: false }));
    const weekly = WEEKLY_MISSIONS.map(w => ({ ...w, progress: 0, isComplete: false }));
    return [...daily, ...weekly];
  }

  private saveToLocalStorage() {
    localStorage.setItem('klover_user', JSON.stringify(this.user));
    localStorage.setItem('klover_missions', JSON.stringify(this.missions));
    localStorage.setItem('klover_transactions', JSON.stringify(this.transactions));
  }

  private loadFromLocalStorage() {
    const userJson = localStorage.getItem('klover_user');
    const missionsJson = localStorage.getItem('klover_missions');
    const transactionsJson = localStorage.getItem('klover_transactions');

    if (userJson) {
      this.user = JSON.parse(userJson);
    }
    if (missionsJson) {
      this.missions = JSON.parse(missionsJson);
    } else {
      this.missions = this.generateInitialMissions();
    }
     if (transactionsJson) {
      this.transactions = JSON.parse(transactionsJson);
    }
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }
  
  logout() {
    this.user = null;
    localStorage.removeItem('klover_user');
    localStorage.removeItem('klover_missions');
    localStorage.removeItem('klover_transactions');
    window.location.hash = '/login';
  }

  // --- AUTHENTICATION ---
  async loginWithTelegram(tgUser: any, referralCode?: string): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!this.user) {
            this.user = {
              id: tgUser.user.id || '123456789',
              username: tgUser.user.username || 'user',
              firstName: tgUser.user.first_name || 'User',
              photoUrl: tgUser.user.photo_url || undefined,
              email: 'telegram.user@klover.app',
              balance: 0,
              tonBalance: 0,
              xp: 0,
              level: 1,
              chests: [],
              activeBoosters: [],
              dailyStreak: 1,
              lastLogin: new Date().toISOString(),
              referredBy: referralCode,
              referralEarnings: 0,
              joinDate: new Date().toISOString(),
              status: 'ACTIVE',
            };
            this.missions = this.generateInitialMissions();
            this.transactions = [];
            this.saveToLocalStorage();
        }
        resolve(this.user);
      }, FAKE_LATENCY);
    });
  }

  // --- USER DATA ---
  async getUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.user) {
          resolve(JSON.parse(JSON.stringify(this.user))); // Deep copy
        } else {
          reject(new Error("User not authenticated"));
        }
      }, FAKE_LATENCY / 2);
    });
  }

  // --- CORE ACTIONS (ADS & REWARDS) ---
  async recordAdWatch(): Promise<{ xpGained: number, balanceGained: number, chestEarned: string | null }> {
     return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.user) return reject(new Error("User not found"));
        
        const xpGained = LEVELS[this.user.level -1]?.level > 1 ? 10 * (1 + (this.user.level / 10)) : 10;
        const chestEarned = this.getChestDrop();
        const balanceGained = parseFloat((Math.random() * (0.05 - 0.01) + 0.01).toFixed(2)); // Base BRL reward

        this.user.xp += xpGained;
        this.user.balance += balanceGained;
        
        if(chestEarned) {
          // FIX: Cast string return value to ChestRarity to match the User interface type.
          this.user.chests.push({id: `chest_${Date.now()}`, rarity: chestEarned as ChestRarity, acquiredAt: Date.now()});
        }
        
        this.addTransaction(TransactionType.AD_REWARD, balanceGained, 'BRL', 'Stream de anúncio');

        this.updateMissionProgress('daily_watch_5', 1);
        this.updateMissionProgress('daily_watch_10', 1);
        this.updateMissionProgress('weekly_watch_50', 1);
        this.checkLevelUp();
        
        this.saveToLocalStorage();
        resolve({ xpGained, balanceGained, chestEarned });
      }, FAKE_LATENCY);
    });
  }
  
  private getChestDrop() {
      const rand = Math.random();
      let cumulativeProb = 0;
      for (const rarity in CHEST_DEFINITIONS) {
          const chest = CHEST_DEFINITIONS[rarity as keyof typeof CHEST_DEFINITIONS];
          cumulativeProb += chest.probability;
          if (rand < cumulativeProb) {
              return rarity;
          }
      }
      return null;
  }

  private checkLevelUp() {
    if(!this.user) return;
    const currentLevelInfo = LEVELS[this.user.level - 1];
    if (this.user.xp >= currentLevelInfo.xpRequired) {
      this.user.level++;
      // Give a level up reward
      this.user.balance += this.user.level * 0.10;
      this.addTransaction(TransactionType.MISSION_REWARD, this.user.level * 0.10, 'BRL', `Recompensa Nível ${this.user.level}`)
    }
  }

  // --- MISSIONS ---
  async getMissions(): Promise<Mission[]> {
    return new Promise(resolve => setTimeout(() => resolve(this.missions), FAKE_LATENCY / 2));
  }

  private updateMissionProgress(missionId: string, amount: number) {
    const mission = this.missions.find(m => m.id === missionId);
    if (mission && !mission.isComplete) {
      mission.progress += amount;
      if (mission.progress >= mission.goal) {
        mission.progress = mission.goal;
      }
    }
    this.saveToLocalStorage();
  }

  async claimMissionReward(missionId: string): Promise<Mission> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const mission = this.missions.find(m => m.id === missionId);
        if (!this.user || !mission || mission.isComplete || mission.progress < mission.goal) {
          return reject(new Error("Cannot claim reward"));
        }
        
        mission.isComplete = true;

        if (mission.reward.type === 'XP') {
          this.user.xp += mission.reward.value as number;
        } else if (mission.reward.type === 'CHEST') {
           this.user.chests.push({id: `chest_${Date.now()}`, rarity: mission.reward.value as ChestRarity, acquiredAt: Date.now()});
        }
        
        this.checkLevelUp();
        this.saveToLocalStorage();
        resolve(mission);
      }, FAKE_LATENCY);
    });
  }

  // --- WALLET & TRANSACTIONS ---
  async getTransactions(): Promise<Transaction[]> {
    return new Promise(resolve => setTimeout(() => resolve(this.transactions.sort((a,b) => b.timestamp - a.timestamp)), FAKE_LATENCY / 2));
  }
  
  private addTransaction(type: TransactionType, amount: number, currency: 'BRL' | 'TON' | 'XP', details?: string) {
    if(!this.user) return;
    this.transactions.push({
      id: `txn_${Date.now()}`,
      type,
      amount,
      currency,
      // FIX: Use TransactionStatus enum member instead of string literal.
      status: TransactionStatus.COMPLETED,
      timestamp: Date.now(),
      details
    });
    this.saveToLocalStorage();
  }
  
  // FIX: Changed 'method' parameter from string literal union to WithdrawalMethod enum.
  async requestWithdrawal(method: WithdrawalMethod, amount: number, address: string): Promise<Transaction> {
     return new Promise((resolve, reject) => {
        setTimeout(() => {
           if(!this.user) return reject(new Error("User not authenticated"));

           // FIX: Use WithdrawalMethod enum for comparisons.
           if (method === WithdrawalMethod.PIX && this.user.balance < amount) return reject(new Error("Saldo insuficiente"));
           if (method === WithdrawalMethod.TON && this.user.tonBalance < amount) return reject(new Error("Saldo TON insuficiente"));

           if(method === WithdrawalMethod.PIX) this.user.balance -= amount;
           if(method === WithdrawalMethod.TON) this.user.tonBalance -= amount;
           
           const newTx: Transaction = {
             id: `txn_wd_${Date.now()}`,
             type: TransactionType.WITHDRAWAL,
             amount,
             // FIX: Use WithdrawalMethod enum for comparison.
             currency: method === WithdrawalMethod.PIX ? 'BRL' : 'TON',
             method: method,
             // FIX: Use TransactionStatus enum member instead of string literal.
             status: TransactionStatus.PENDING,
             timestamp: Date.now(),
             details: `Saque para ${address}`
           };
           this.transactions.push(newTx);
           this.saveToLocalStorage();
           resolve(newTx);
        }, FAKE_LATENCY * 2);
     });
  }


  // --- RANKING ---
  async getRanking(): Promise<RankEntry[]> {
    return new Promise(resolve => {
        setTimeout(() => {
            const ranks: RankEntry[] = [
                { rank: 1, userId: '987654', username: 'Zeus', photoUrl: '', level: 99, xp: 999999 },
                { rank: 2, userId: '123456', username: 'Athena', photoUrl: '', level: 95, xp: 950000 },
                { rank: 3, userId: '789012', username: 'Ares', photoUrl: '', level: 92, xp: 920000 },
                // ... add more fake users
            ];
            
            if(this.user) {
              const userRank = ranks.findIndex(r => r.userId === this.user?.id);
              if (userRank === -1) {
                 ranks.push({ rank: 4, userId: this.user.id, username: this.user.username, photoUrl: this.user.photoUrl || '', level: this.user.level, xp: this.user.xp });
              }
            }
            ranks.sort((a,b) => b.xp - a.xp).forEach((r, i) => r.rank = i + 1);
            
            resolve(ranks);
        }, FAKE_LATENCY);
    });
  }
}

export const backendService = new BackendService();