
export interface User {
  id: string | number;
  username: string;
  email: string;
  firstName?: string;
  photoUrl?: string;
  balance: number;
  spins: number; 
  points: number; 
  totalEarnings: number;
  joinDate: string;
  // Referral System
  referredBy?: string; // ID of the user who invited this user
  referralEarnings: number; // Amount earned from inviting others
}

export type Language = 'en' | 'ru';

export enum TransactionType {
  EARN = 'EARN',
  WITHDRAWAL = 'WITHDRAWAL',
  SHOP_PURCHASE = 'SHOP_PURCHASE',
  REFERRAL = 'REFERRAL',
  CONVERSION = 'CONVERSION'
}

export enum WithdrawalMethod {
  CWALLET = 'CWALLET',
  FAUCETPAY = 'FAUCETPAY',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number; // Amount or Points
  currency?: 'USD' | 'PTS';
  method?: WithdrawalMethod;
  status: TransactionStatus;
  timestamp: number;
  details?: string;
}

export type ItemRarity = 'COMMON' | 'RARE' | 'LEGENDARY';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'USD' | 'PTS';
  icon: string;
  rarity: ItemRarity;
}

export interface AdConfig {
  zoneId: string;
  sdkName: string;
}

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

export interface AdsgramShowResult {
  done: boolean;
  description: string;
  state: 'load' | 'render' | 'playing' | 'destroy';
  error: boolean;
}

export interface AdsgramController {
  show: () => Promise<AdsgramShowResult>;
}

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
    Adsgram?: {
      init: (config: { blockId: string; debug?: boolean }) => AdsgramController;
    };
  }
}
