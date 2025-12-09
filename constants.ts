
import { ChestRarity, Mission } from './types';

export const APP_NAME = "KLOVER";
export const APP_VERSION = "2.0.0";

// Ad Configuration (Telega.io)
export const TELEGA_TOKEN = "165a86f6-e5b4-482f-9e05-dac8e12daa56";
export const REWARDED_AD_BLOCK_ID = "c953f2cc-2fc2-4bc1-9400-5ab3ed480e2c";

// --- KLOVER OMEGA SYSTEM ---

// 1. User Levels & XP
export const LEVELS = Array.from({ length: 100 }, (_, i) => ({
  level: i + 1,
  xpRequired: Math.floor(100 * Math.pow(1.15, i)),
  name: `Rank ${i+1}` // Simple naming, can be expanded (Bronze, Silver etc)
}));

// 2. Base Rewards
export const BASE_AD_REWARD_XP = 10;
export const REFERRAL_RATE = 0.15; // 15% Commission

// 3. Chest Definitions
export const CHEST_DEFINITIONS: Record<ChestRarity, { name: string, color: string, probability: number, rewards: any[] }> = {
  COMMON:       { name: "Baú Comum",    color: "#A0A0B0", probability: 0.65, rewards: [{ type: 'BRL', min: 0.01, max: 0.05 }] },
  RARE:         { name: "Baú Raro",      color: "#00A8FF", probability: 0.25, rewards: [{ type: 'BRL', min: 0.05, max: 0.15 }] },
  EPIC:         { name: "Baú Épico",     color: "#B400FF", probability: 0.07, rewards: [{ type: 'BRL', min: 0.20, max: 0.50 }] },
  LEGENDARY:    { name: "Baú Lendário",  color: "#FFD700", probability: 0.02, rewards: [{ type: 'BRL', min: 0.50, max: 2.00 }] },
  DIVINE:       { name: "Baú Divino",    color: "#FFFFFF", probability: 0.009,rewards: [{ type: 'BRL', min: 2.50, max: 10.00 }] },
  ULTRA_DIVINE: { name: "Baú Ultra Divino", color: "linear-gradient(to right, #00A8FF, #B400FF, #FFD700)", probability: 0.001, rewards: [{ type: 'BRL', min: 10.00, max: 50.00 }] },
};

// 4. Missions (Example definitions)
export const DAILY_MISSIONS: Omit<Mission, 'progress' | 'isComplete'>[] = [
  { id: 'daily_watch_5', type: 'DAILY', title: "Assista 5 Anúncios", description: "Complete 5 streams de anúncio.", goal: 5, reward: { type: 'XP', value: 50 } },
  { id: 'daily_watch_10', type: 'DAILY', title: "Assista 10 Anúncios", description: "Complete 10 streams de anúncio.", goal: 10, reward: { type: 'CHEST', value: 'RARE' } },
];
export const WEEKLY_MISSIONS: Omit<Mission, 'progress' | 'isComplete'>[] = [
  { id: 'weekly_watch_50', type: 'WEEKLY', title: "Assista 50 Anúncios", description: "Complete 50 streams durante a semana.", goal: 50, reward: { type: 'CHEST', value: 'EPIC' } },
];


// --- API & ROUTES ---
export const API_URL = "https://api.klover.app/v1"; 

export const ROUTES = {
  HOME: "/",
  MISSIONS: "/missions",
  WALLET: "/wallet",
  RANKING: "/ranking",
  PROFILE: "/profile",
};

export const MIN_WITHDRAWAL = {
  PIX: 5.00, // R$5.00
  TON: 1.0 // 1 TON
};


// --- TRANSLATIONS ---
export const TRANSLATIONS = {
  en: {
    nav_home: "Home",
    nav_missions: "Missions",
    nav_wallet: "Wallet",
    nav_ranking: "Ranking",
    nav_profile: "Profile",
    // Add more translations as needed...
  },
  pt: {
    nav_home: "Início",
    nav_missions: "Missões",
    nav_wallet: "Carteira",
    nav_ranking: "Ranking",
    nav_profile: "Perfil",
    
    // Home
    total_balance: "Saldo Total",
    level: "Nível",
    daily_missions: "Missões Diárias",
    watch_and_earn: "ASSISTIR E GANHAR",
    watching_ad: "CARREGANDO STREAM...",
    
    // Wallet
    withdraw_funds: "Sacar Fundos",
    withdraw_method: "Método de Saque",
    pix_key: "Chave PIX",
    ton_address: "Endereço TON",
    amount_brl: "Valor (BRL)",
    amount_ton: "Valor (TON)",
    confirm_withdrawal: "CONFIRMAR SAQUE",
    processing: "PROCESSANDO...",
    min_withdrawal: "Mínimo",
    
    // Missions
    missions: "Missões",
    daily: "Diárias",
    weekly: "Semanais",
    claim: "RESGATAR",
    claimed: "RESGATADO",
    
    // Profile
    profile_settings: "Configurações",
    user_id: "ID de Usuário",
    disconnect: "Desconectar",
    
    // General
    status: "Status",
    error: "Erro",
    success: "Sucesso",
  }
};
