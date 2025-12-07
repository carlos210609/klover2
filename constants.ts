export const APP_NAME = "KLOVER";
export const APP_VERSION = "1.0.0";

// Ad Configuration
export const AD_ZONE_ID = "10283220";
export const REWARD_PER_AD = 0.001; 

// API Endpoints (Mocked for Frontend, would point to real backend in production)
export const API_URL = "https://api.klover.app/v1"; 

export const ROUTES = {
  HOME: "/",
  EARN: "/earn",
  WALLET: "/wallet",
  HISTORY: "/history",
  PROFILE: "/profile",
  SHOP: "/shop",
};

export const MIN_WITHDRAWAL = {
  CWALLET: 0.1,
  FAUCETPAY: 0.05
};

export const ROULETTE_PRIZES = [
  { id: 'common_cash', type: 'CASH', value: 0.0005, label: '$0.0005', weight: 30, color: '#3b82f6' }, // Blue
  { id: 'common_points', type: 'POINTS', value: 10, label: '10 PTS', weight: 40, color: '#a855f7' }, // Purple
  { id: 'rare_cash', type: 'CASH', value: 0.001, label: '$0.0010', weight: 20, color: '#22c55e' }, // Green
  { id: 'rare_points', type: 'POINTS', value: 50, label: '50 PTS', weight: 8, color: '#f59e0b' }, // Amber
  { id: 'jackpot', type: 'CASH', value: 0.005, label: '$0.0050', weight: 2, color: '#ef4444' }   // Red (Jackpot)
];