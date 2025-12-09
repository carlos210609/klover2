
import { CryptoAsset } from './types';

export const APP_NAME = "KLOVER";
export const APP_VERSION = "2.0.0-CRYPTO";

// --- SECURITY WARNING ---
// The bot token provided should NEVER be stored in client-side code.
// This is a major security risk. It must be kept on a secure backend server.
// This is a placeholder for demonstration purposes only.
export const TELEGRAM_BOT_TOKEN = "YOUR_BOT_TOKEN_HERE"; 


// --- KLOVER CRYPTO BANK ---

export const SUPPORTED_ASSETS: CryptoAsset[] = [
    {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        iconUrl: 'https://img.icons8.com/fluency/48/bitcoin.png'
    },
    {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        iconUrl: 'https://img.icons8.com/fluency/48/ethereum.png'
    },
    {
        id: 'toncoin',
        symbol: 'TON',
        name: 'Toncoin',
        iconUrl: 'https://img.icons8.com/fluency/48/toncoin.png'
    },
    {
        id: 'tether',
        symbol: 'USDT',
        name: 'Tether',
        iconUrl: 'https://img.icons8.com/fluency/48/tether.png'
    }
];


// --- API & ROUTES ---
export const API_URL = "https://api.klover.app/v2"; 

export const ROUTES = {
  DASHBOARD: "/",
  MARKETS: "/markets",
  SWAP: "/swap",
  WALLET: "/wallet", // Will be /wallet/:assetId
  PROFILE: "/profile",
};


// --- TRANSLATIONS ---
export const TRANSLATIONS = {
  en: {
    nav_dashboard: "Dashboard",
    nav_markets: "Markets",
    nav_swap: "Swap",
    nav_profile: "Profile",
    // Add more translations as needed...
  },
  pt: {
    nav_dashboard: "Painel",
    nav_markets: "Mercado",
    nav_swap: "Trocar",
    nav_profile: "Perfil",
    
    // Dashboard
    portfolio_value: "Valor do Portfólio",
    your_assets: "Seus Ativos",
    deposit: "Depositar",
    withdraw: "Sacar",
    
    // Wallet
    total_balance: "Saldo Total",
    transaction_history: "Histórico de Transações",
    
    // Markets
    market_trends: "Tendências de Mercado",
    price: "Preço",
    change_24h: "Variação 24h",

    // Swap
    from: "De",
    to: "Para",
    you_pay: "Você envia",
    you_receive: "Você recebe",
    rate: "Taxa",
    insufficient_balance: "Saldo insuficiente",
    confirm_swap: "CONFIRMAR TROCA",
    
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