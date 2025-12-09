
import { ShopItem } from './types';

export const APP_NAME = "KLOVER";
export const APP_VERSION = "1.3.0";

// Ad Configuration
export const AD_ZONE_ID = "10283220";
export const REWARD_PER_AD = 0.05; // R$ 0.05
export const REFERRAL_RATE = 0.30; // 30% Commission

// API Endpoints
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
  CWALLET: 2.00, // R$ 2.00
  FAUCETPAY: 2.00
};

export const ROULETTE_PRIZES = [
  { id: 'common_cash', type: 'CASH', value: 0.01, label: 'R$0.01', weight: 30, color: '#3b82f6' }, // Blue
  { id: 'common_points', type: 'POINTS', value: 10, label: '10 PTS', weight: 40, color: '#a855f7' }, // Purple
  { id: 'rare_cash', type: 'CASH', value: 0.05, label: 'R$0.05', weight: 20, color: '#22c55e' }, // Green
  { id: 'rare_points', type: 'POINTS', value: 50, label: '50 PTS', weight: 8, color: '#f59e0b' }, // Amber
  { id: 'jackpot', type: 'CASH', value: 0.25, label: 'R$0.25', weight: 2, color: '#ef4444' }   // Red (Jackpot)
];

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'buy_spin_5',
    name: 'Pack of 5 Spins',
    description: 'Get 5 more chances to hit the Jackpot.',
    price: 150,
    currency: 'PTS',
    icon: 'refresh',
    rarity: 'COMMON'
  },
  {
    id: 'cash_conversion_1',
    name: 'Cash Ticket (R$0.10)',
    description: 'Instantly convert points to withdrawable balance.',
    price: 500,
    currency: 'PTS',
    icon: 'cash',
    rarity: 'COMMON'
  },
  {
    id: 'nano_miner',
    name: 'Nano Miner v1',
    description: 'Cloud mining simulation: Instantly yields R$0.50.',
    price: 2000,
    currency: 'PTS',
    icon: 'zap',
    rarity: 'RARE'
  },
  {
    id: 'golden_ticket',
    name: 'Golden Ticket',
    description: 'A legendary ticket that grants 25 Spins instantly.',
    price: 1000,
    currency: 'PTS',
    icon: 'star',
    rarity: 'LEGENDARY'
  }
];

export const TRANSLATIONS = {
  en: {
    // Nav
    nav_home: "Home",
    nav_earn: "Earn",
    nav_wallet: "Wallet",
    nav_shop: "Shop",
    nav_hist: "Hist",
    // Home
    connected_as: "Connected as",
    premium: "PREMIUM",
    total_balance: "Total Balance",
    start_earning: "Start Earning",
    spins_avail: "Spins Available",
    loyalty_pts: "Loyalty Points",
    quick_actions: "Quick Actions",
    shop_link: "Spend Points in Shop",
    open: "OPEN",
    referral_prog: "Referral Program",
    invite_earn: "Invite & Earn 30%",
    your_link: "Your Invite Link",
    total_comm: "Total Commission",
    copy: "COPY",
    copied: "COPIED",
    // Earn
    reactor_core: "Reactor Core",
    init_seq: "INITIATE SEQUENCE",
    stabilizing: "STABILIZING...",
    activate: "ACTIVATE",
    core_depleted: "Core Depleted",
    recharge_core: "Recharge Core",
    watch_ad: "Watch ad stream • +1 Charge",
    output_pot: "Output Potential",
    result: "Result",
    // Wallet
    withdraw_funds: "Withdraw Funds",
    avail_bal: "Available Balance",
    method_cwallet: "CWALLET",
    method_faucetpay: "FAUCETPAY",
    label_cwallet: "CWallet Email / ID",
    label_faucetpay: "FaucetPay Address",
    label_amount: "Amount (BRL)",
    min_withdraw: "Min",
    process_tx: "PROCESSING TRANSACTION...",
    confirm_withdraw: "CONFIRM WITHDRAWAL",
    secure_tx: "Secure Encrypted Transaction",
    success_withdraw: "Withdrawal request sent successfully!",
    error_min: "Minimum withdrawal is",
    // Shop
    black_market: "Black Market",
    shop_desc: "Exchange loyalty for upgrades.",
    balance: "Balance",
    cost: "Cost",
    acquire: "ACQUIRE",
    acquired: "Acquired",
    insufficient_pts: "Insufficient Points",
    // History
    history: "History",
    no_tx: "No transactions yet.",
    ad_reward: "Ad Reward",
    withdraw_to: "Withdraw to",
    lucky_spin: "Lucky Spin Reward",
    shop_buy: "Shop Purchase",
    referral_comm: "Referral Commission",
    // Login
    identity_uplink: "Identity Uplink",
    login_desc: "Enter your FaucetPay email to connect.",
    email_label: "FaucetPay Email",
    ref_code_label: "Referral Code (Optional)",
    init_session: "INITIALIZE SESSION",
    establishing: "ESTABLISHING CONNECTION...",
    no_pass: "No Password Required",
    // Profile
    profile_settings: "Profile Settings",
    disconnect: "Disconnect Session"
  },
  ru: {
    // Nav
    nav_home: "Главная",
    nav_earn: "Заработок",
    nav_wallet: "Кошелек",
    nav_shop: "Магазин",
    nav_hist: "История",
    // Home
    connected_as: "Вы вошли как",
    premium: "ПРЕМИУМ",
    total_balance: "Общий баланс",
    start_earning: "Начать заработок",
    spins_avail: "Доступно спинов",
    loyalty_pts: "Очки лояльности",
    quick_actions: "Быстрые действия",
    shop_link: "Потратить очки в магазине",
    open: "ОТКРЫТЬ",
    referral_prog: "Реферальная программа",
    invite_earn: "Пригласи и получи 30%",
    your_link: "Ваша ссылка",
    total_comm: "Комиссия",
    copy: "КОПИРОВАТЬ",
    copied: "СКОПИРОВАНО",
    // Earn
    reactor_core: "Ядро Реактора",
    init_seq: "ИНИЦИАЛИЗАЦИЯ",
    stabilizing: "СТАБИЛИЗАЦИЯ...",
    activate: "АКТИВИРОВАТЬ",
    core_depleted: "Ядро истощено",
    recharge_core: "Зарядить ядро",
    watch_ad: "Смотреть рекламу • +1 Заряд",
    output_pot: "Потенциал выхода",
    result: "Результат",
    // Wallet
    withdraw_funds: "Вывод средств",
    avail_bal: "Доступный баланс",
    method_cwallet: "CWALLET",
    method_faucetpay: "FAUCETPAY",
    label_cwallet: "Email / ID CWallet",
    label_faucetpay: "Адрес FaucetPay",
    label_amount: "Сумма (BRL)",
    min_withdraw: "Мин",
    process_tx: "ОБРАБОТКА ТРАНЗАКЦИИ...",
    confirm_withdraw: "ПОДТВЕРДИТЬ ВЫВОД",
    secure_tx: "Защищенная транзакция",
    success_withdraw: "Запрос на вывод отправлен!",
    error_min: "Минимальный вывод",
    // Shop
    black_market: "Черный Рынок",
    shop_desc: "Обмен лояльности на улучшения.",
    balance: "Баланс",
    cost: "Цена",
    acquire: "КУПИТЬ",
    acquired: "Приобретено",
    insufficient_pts: "Недостаточно очков",
    // History
    history: "История",
    no_tx: "Транзакций пока нет.",
    ad_reward: "Награда за рекламу",
    withdraw_to: "Вывод на",
    lucky_spin: "Награда рулетки",
    shop_buy: "Покупка в магазине",
    referral_comm: "Реферальная комиссия",
    // Login
    identity_uplink: "Идентификация",
    login_desc: "Введите FaucetPay email для входа.",
    email_label: "FaucetPay Email",
    ref_code_label: "Код приглашения (Опционально)",
    init_session: "НАЧАТЬ СЕССИЮ",
    establishing: "УСТАНОВЛЕНИЕ СОЕДИНЕНИЯ...",
    no_pass: "Пароль не требуется",
    // Profile
    profile_settings: "Настройки профиля",
    disconnect: "Завершить сессию"
  }
};