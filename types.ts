

export interface User {
  id: string | number;
  username: string;
  email: string;
  firstName?: string;
  photoUrl?: string;
  
  // Klover Crypto Bank
  portfolio: PortfolioAsset[];
  
  // Metadata
  joinDate: string;
  status: 'ACTIVE' | 'FLAGGED' | 'BANNED';
}

export type Language = 'en' | 'pt';

// --- CRYPTO ASSETS ---

export interface CryptoAsset {
  id: string; // e.g., 'bitcoin'
  symbol: string; // e.g., 'BTC'
  name: string; // e.g., 'Bitcoin'
  iconUrl: string;
}

export interface PortfolioAsset {
  assetId: string; // 'bitcoin'
  amount: number;
}

export interface MarketData extends CryptoAsset {
  priceBRL: number;
  change24h: number; // Percentage change
}


// --- TRANSACTIONS ---

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  SWAP_IN = 'SWAP_IN',
  SWAP_OUT = 'SWAP_OUT',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  assetId: string;
  amount: number;
  status: TransactionStatus;
  timestamp: number;
  details?: {
    [key: string]: any; // For swap details, addresses, etc.
  };
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


declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
}