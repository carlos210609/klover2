export interface User {
  id: string | number;
  username: string;
  email: string; // Added email field
  firstName?: string;
  photoUrl?: string;
  balance: number;
  totalEarnings: number;
  joinDate: string;
}

export enum TransactionType {
  EARN = 'EARN',
  WITHDRAWAL = 'WITHDRAWAL',
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
  amount: number;
  method?: WithdrawalMethod;
  status: TransactionStatus;
  timestamp: number;
  details?: string;
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
}

// Extend Window to include the ad function and Telegram
declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
    show_10283220: () => Promise<void>;
  }
}