export interface User {
  id: number;
  username: string;
  firstName: string;
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

// Extend Window to include the ad function
declare global {
  interface Window {
    show_10283220: () => Promise<void>;
    Telegram?: {
      WebApp: any;
    };
  }
}