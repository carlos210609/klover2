
// Klover 2.0 Mock Crypto Backend Service
// Simulates a crypto bank backend for a fully interactive experience.
import { User, Transaction, TransactionType, MarketData, CryptoAsset, PortfolioAsset, TransactionStatus } from '../types';
import { SUPPORTED_ASSETS } from '../constants';

const FAKE_LATENCY = 300; // ms

class BackendService {
  private user: User | null = null;
  private transactions: Transaction[] = [];
  private marketPrices: Map<string, number> = new Map();

  constructor() {
    this.loadFromLocalStorage();
    this.initializeMarket();
  }
  
  private initializeMarket() {
    // Set initial prices
    this.marketPrices.set('bitcoin', 67000 * 5.2); // Price in BRL
    this.marketPrices.set('ethereum', 3500 * 5.2);
    this.marketPrices.set('toncoin', 7.5 * 5.2);
    this.marketPrices.set('tether', 1 * 5.2);
    
    // Simulate price fluctuations
    setInterval(() => {
        this.marketPrices.forEach((price, id) => {
            const change = price * (Math.random() - 0.5) * 0.01; // up to 0.5% change
            this.marketPrices.set(id, Math.max(0, price + change));
        });
    }, 3000);
  }

  private saveToLocalStorage() {
    localStorage.setItem('klover_user', JSON.stringify(this.user));
    localStorage.setItem('klover_transactions', JSON.stringify(this.transactions));
  }

  private loadFromLocalStorage() {
    const userJson = localStorage.getItem('klover_user');
    const transactionsJson = localStorage.getItem('klover_transactions');

    if (userJson) {
      this.user = JSON.parse(userJson);
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
    localStorage.removeItem('klover_transactions');
    window.location.hash = '/login';
  }

  // --- AUTHENTICATION ---
  async loginWithTelegram(tgUser: any): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!this.user) {
            this.user = {
              id: tgUser.user.id || '123456789',
              username: tgUser.user.username || 'user',
              firstName: tgUser.user.first_name || 'User',
              photoUrl: tgUser.user.photo_url || undefined,
              email: 'telegram.user@klover.app',
              portfolio: [
                { assetId: 'tether', amount: 100.00 }, // Start with some USDT
                { assetId: 'toncoin', amount: 10.0 },
              ],
              joinDate: new Date().toISOString(),
              status: 'ACTIVE',
            };
            this.transactions = [];
            this.saveToLocalStorage();
        }
        resolve(this.user);
      }, FAKE_LATENCY);
    });
  }

  // --- USER DATA & PORTFOLIO ---
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

  async getPortfolio(): Promise<{ assets: (PortfolioAsset & CryptoAsset & { priceBRL: number })[], totalValueBRL: number }> {
     return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!this.user) return reject(new Error("User not found"));

            let totalValueBRL = 0;
            const assets = this.user.portfolio.map(pAsset => {
                const assetInfo = SUPPORTED_ASSETS.find(a => a.id === pAsset.assetId)!;
                const priceBRL = this.marketPrices.get(pAsset.assetId) || 0;
                totalValueBRL += pAsset.amount * priceBRL;
                return { ...pAsset, ...assetInfo, priceBRL };
            });

            resolve({ assets, totalValueBRL });
        }, FAKE_LATENCY / 2);
     });
  }
  
  // --- MARKET ---
  async getMarketData(): Promise<MarketData[]> {
    return new Promise(resolve => {
        setTimeout(() => {
            const data = SUPPORTED_ASSETS.map(asset => ({
                ...asset,
                priceBRL: this.marketPrices.get(asset.id) || 0,
                change24h: (Math.random() - 0.5) * 10, // -5% to +5%
            }));
            resolve(data);
        }, FAKE_LATENCY);
    });
  }


  // --- ACTIONS ---
  async performSwap(fromAssetId: string, toAssetId: string, fromAmount: number): Promise<boolean> {
      return new Promise((resolve, reject) => {
         setTimeout(() => {
             if (!this.user) return reject(new Error("User not found"));

             const fromAsset = this.user.portfolio.find(a => a.assetId === fromAssetId);
             if (!fromAsset || fromAsset.amount < fromAmount) {
                 return reject(new Error("Insufficient balance"));
             }
             
             const fromPrice = this.marketPrices.get(fromAssetId) || 0;
             const toPrice = this.marketPrices.get(toAssetId) || 0;
             if(fromPrice === 0 || toPrice === 0) return reject(new Error("Could not fetch market price"));

             const toAmount = (fromAmount * fromPrice) / toPrice * 0.995; // 0.5% fee

             // Update portfolio
             fromAsset.amount -= fromAmount;
             
             let toAsset = this.user.portfolio.find(a => a.assetId === toAssetId);
             if (toAsset) {
                 toAsset.amount += toAmount;
             } else {
                 this.user.portfolio.push({ assetId: toAssetId, amount: toAmount });
             }

             // Add transactions
             this.addTransaction(TransactionType.SWAP_OUT, fromAmount, fromAssetId, { to: toAssetId, toAmount });
             this.addTransaction(TransactionType.SWAP_IN, toAmount, toAssetId, { from: fromAssetId, fromAmount });

             this.saveToLocalStorage();
             resolve(true);
         }, FAKE_LATENCY * 2);
      });
  }


  // --- TRANSACTIONS ---
  async getTransactions(assetId?: string): Promise<Transaction[]> {
    return new Promise(resolve => setTimeout(() => {
        const sorted = this.transactions.sort((a,b) => b.timestamp - a.timestamp);
        if(assetId) {
            resolve(sorted.filter(tx => tx.assetId === assetId));
        } else {
            resolve(sorted);
        }
    }, FAKE_LATENCY / 2));
  }
  
  private addTransaction(type: TransactionType, amount: number, assetId: string, details?: object) {
    if(!this.user) return;
    this.transactions.push({
      id: `txn_${Date.now()}`,
      type,
      amount,
      assetId,
      status: TransactionStatus.COMPLETED,
      timestamp: Date.now(),
      details
    });
    this.saveToLocalStorage();
  }
}

export const backendService = new BackendService();