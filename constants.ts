
import { ShopItem } from './types';

export const APP_NAME = "KLOVER";
export const APP_VERSION = "2.0.0";

// Ad Configuration (Adsgram)
export const AD_ZONE_ID = "18871";
export const REWARD_PER_AD = 0.001; // $0.001 USD
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
  CWALLET: 0.10, // $0.10 USD
  FAUCETPAY: 0.01 // $0.01 USD
};

export const ROULETTE_PRIZES = [
  { id: 'common_cash', type: 'CASH', value: 0.001, label: '$0.001', weight: 40, color: '#00A8FF' }, // Neon Blue
  { id: 'common_points', type: 'POINTS', value: 10, label: '10 PTS', weight: 30, color: '#B400FF' }, // Neon Purple
  { id: 'rare_cash', type: 'CASH', value: 0.005, label: '$0.005', weight: 15, color: '#22c55e' }, // Green
  { id: 'rare_points', type: 'POINTS', value: 50, label: '50 PTS', weight: 10, color: '#fbbf24' }, // Gold
  { id: 'jackpot', type: 'CASH', value: 0.05, label: '$0.05', weight: 5, color: '#ef4444' }   // Red (Jackpot)
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
    name: 'Cash Ticket ($0.01)',
    description: 'Instantly convert points to withdrawable balance.',
    price: 500,
    currency: 'PTS',
    icon: 'cash',
    rarity: 'COMMON'
  },
  {
    id: 'nano_miner',
    name: 'Nano Miner v1',
    description: 'Cloud mining simulation: Instantly yields $0.05.',
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
    nav_home: "Home",
    nav_earn: "Earn",
    nav_wallet: "Wallet",
    nav_shop: "Shop",
    nav_hist: "Hist",
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
    reactor_core: "Reactor Core",
    init_seq: "INITIATE SEQUENCE",
    stabilizing: "STABILIZING...",
    activate: "ACTIVATE",
    core_depleted: "Core Depleted",
    recharge_core: "Recharge Core",
    watch_ad: "Watch ad stream • +1 Charge",
    output_pot: "Output Potential",
    result: "Result",
    withdraw_funds: "Withdraw Funds",
    avail_bal: "Available Balance",
    method_cwallet: "CWALLET",
    method_faucetpay: "FAUCETPAY",
    label_cwallet: "CWallet Email / ID",
    label_faucetpay: "FaucetPay Address",
    label_amount: "Amount (USD)",
    min_withdraw: "Min",
    process_tx: "PROCESSING TRANSACTION...",
    confirm_withdraw: "CONFIRM WITHDRAWAL",
    secure_tx: "Secure Encrypted Transaction",
    success_withdraw: "Withdrawal request sent successfully!",
    error_min: "Minimum withdrawal is",
    black_market: "Black Market",
    shop_desc: "Exchange loyalty for upgrades.",
    balance: "Balance",
    cost: "Cost",
    acquire: "ACQUIRE",
    acquired: "Acquired",
    insufficient_pts: "Insufficient Points",
    history: "History",
    no_tx: "No transactions yet.",
    ad_reward: "Ad Reward",
    withdraw_to: "Withdraw to",
    lucky_spin: "Lucky Spin Reward",
    shop_buy: "Shop Purchase",
    referral_comm: "Referral Commission",
    identity_uplink: "Identity Uplink",
    login_desc: "Enter your FaucetPay email to connect.",
    email_label: "FaucetPay Email",
    ref_code_label: "Referral Code (Optional)",
    init_session: "INITIALIZE SESSION",
    establishing: "ESTABLISHING CONNECTION...",
    no_pass: "No Password Required",
    profile_settings: "Profile Settings",
    disconnect: "Disconnect Session"
  },
  ru: {
    nav_home: "Главная",
    nav_earn: "Заработок",
    nav_wallet: "Кошелек",
    nav_shop: "Магазин",
    nav_hist: "История",
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
    reactor_core: "Ядро Реактора",
    init_seq: "ИНИЦИАЛИЗАЦИЯ",
    stabilizing: "СТАБИЛИЗАЦИЯ...",
    activate: "АКТИВИРОВАТЬ",
    core_depleted: "Ядро истощено",
    recharge_core: "Зарядить ядро",
    watch_ad: "Смотреть рекламу • +1 Заряд",
    output_pot: "Потенциал выхода",
    result: "Результат",
    withdraw_funds: "Вывод средств",
    avail_bal: "Доступный баланс",
    method_cwallet: "CWALLET",
    method_faucetpay: "FAUCETPAY",
    label_cwallet: "Email / ID CWallet",
    label_faucetpay: "Адрес FaucetPay",
    label_amount: "Сумма (USD)",
    min_withdraw: "Мин",
    process_tx: "ОБРАБОТКА ТРАНЗАКЦИИ...",
    confirm_withdraw: "ПОДТВЕРДИТЬ ВЫВОД",
    secure_tx: "Защищенная транзакция",
    success_withdraw: "Запрос на вывод отправлен!",
    error_min: "Минимальный вывод",
    black_market: "Черный Рынок",
    shop_desc: "Обмен лояльности на улучшения.",
    balance: "Баланс",
    cost: "Цена",
    acquire: "КУПИТЬ",
    acquired: "Приобретено",
    insufficient_pts: "Недостаточно очков",
    history: "История",
    no_tx: "Транзакций пока нет.",
    ad_reward: "Награда за рекламу",
    withdraw_to: "Вывод на",
    lucky_spin: "Награда рулетки",
    shop_buy: "Покупка в магазине",
    referral_comm: "Реферальная комиссия",
    identity_uplink: "Идентификация",
    login_desc: "Введите FaucetPay email для входа.",
    email_label: "FaucetPay Email",
    ref_code_label: "Код приглашения (Опционально)",
    init_session: "НАЧАТЬ СЕССИЮ",
    establishing: "УСТАНОВЛЕНИЕ СОЕДИНЕНИЯ...",
    no_pass: "Пароль не требуется",
    profile_settings: "Настройки профиля",
    disconnect: "Завершить сессию"
  }
};
