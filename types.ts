
export interface User {
  id: string | number;
  username: string;
  email: string;
  firstName?: string;
  photoUrl?: string;
  
  // Klover 2.0 Economy
  balance: number; // Main currency (BRL)
  tonBalance: number;
  xp: number;
  level: number;
  
  // Klover 2.0 Rewards
  chests: Chest[];
  activeBoosters: Booster[];
  dailyStreak: number;
  lastLogin: string;

  // Referral System
  referredBy?: string;
  referralEarnings: number;

  // Metadata
  joinDate: string;
  status: 'ACTIVE' | 'FLAGGED' | 'BANNED';
}

export type Language = 'en' | 'pt';

// --- REWARD SYSTEM ---

export type ChestRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'DIVINE' | 'ULTRA_DIVINE';

export interface Chest {
  id: string;
  rarity: ChestRarity;
  acquiredAt: number;
}

export interface Mission {
  id: string;
  type: 'DAILY' | 'WEEKLY';
  title: string;
  description: string;
  goal: number;
  progress: number;
  reward: { type: 'XP' | 'CHEST', value: number | ChestRarity };
  isComplete: boolean;
}

export interface Booster {
  id: '2X_REWARDS' | 'XP_BOOSTER' | 'RARE_DROP_BOOSTER';
  name: string;
  description: string;
  durationSeconds: number;
  expiresAt: number;
}

// --- TRANSACTIONS ---

export enum TransactionType {
  AD_REWARD = 'AD_REWARD',
  CHEST_REWARD = 'CHEST_REWARD',
  MISSION_REWARD = 'MISSION_REWARD',
  BOOSTER_PURCHASE = 'BOOSTER_PURCHASE',
  WITHDRAWAL = 'WITHDRAWAL',
  REFERRAL = 'REFERRAL',
}

export enum WithdrawalMethod {
  PIX = 'PIX',
  TON = 'TON',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: 'BRL' | 'TON' | 'XP';
  method?: WithdrawalMethod;
  status: TransactionStatus;
  timestamp: number;
  details?: string;
}

// --- RANKING ---
export interface RankEntry {
  rank: number;
  userId: string | number;
  username: string;
  photoUrl: string;
  level: number;
  xp: number;
}


// --- TELEGRAM ---

export interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  initData: string;
  initDataUnsafe: any;
  colorScheme: 'light' | 'dark';
  platform: string;
}

// --- TELEGA ADS SDK ---
export interface TelegaAdShowResult {
    // Define properties based on SDK documentation if available
    success: boolean; 
}

export interface TelegaAdsController {
    ad_show(params: { adBlockUuid: string }): Promise<TelegaAdShowResult>;
}

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
    TelegaIn?: {
      AdsController: {
        create_miniapp(config: { token: string }): TelegaAdsController;
      }
    };
  }
}
