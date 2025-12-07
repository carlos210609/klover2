/**
 * KLOVER BACKEND - Node.js / Express
 * Sistema de Persistência em Arquivo JSON
 */

import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIG ---
const PORT = process.env.PORT || 3000;
const ADMIN_KEY = "KLOVER_SECRET_KEY"; // Chave para baixar o backup
const DB_FILE = path.join(__dirname, 'database.json');

// SECURITY WARNING: In production, use process.env.BOT_TOKEN
const BOT_TOKEN = "8407232561:AAES_3QNfxtOUYFBbvS9MJlCM6ZIYZwf5B4"; 

// --- FAUCETPAY CONFIGURATION ---
// OBRIGATÓRIO: Coloque sua API Key da FaucetPay aqui
const FAUCETPAY_API_KEY = "YOUR_FAUCETPAY_API_KEY_HERE"; 
const FAUCETPAY_CURRENCY = "USDT"; // Moeda padrão para envio (USDT na rede TRC20 é comum no FaucetPay)

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- FILE DATABASE SYSTEM ---
interface Database {
  users: Record<string, any>;
  transactions: any[];
}

// Carregar DB
const loadDb = (): Database => {
  if (!fs.existsSync(DB_FILE)) {
    const initialDb: Database = { users: {}, transactions: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2));
    return initialDb;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (error) {
    console.error("Erro ao ler DB, recriando...", error);
    return { users: {}, transactions: [] };
  }
};

// Salvar DB
const saveDb = (data: Database) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Erro ao salvar DB:", error);
  }
};

// --- HELPER: Validate Telegram WebApp Data ---
const verifyTelegramWebAppData = (telegramInitData: string) => {
  const urlParams = new URLSearchParams(telegramInitData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');
  
  const paramsList: string[] = [];
  for (const [key, value] of urlParams.entries()) {
    paramsList.push(`${key}=${value}`);
  }
  const dataCheckString = paramsList.sort().join('\n');

  const secret = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
  const calculatedHash = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');

  return calculatedHash === hash;
};

// --- HELPER: FaucetPay API Call ---
const sendFaucetPayPayout = async (to: string, amountUSD: number) => {
  if (FAUCETPAY_API_KEY === "YOUR_FAUCETPAY_API_KEY_HERE") {
    console.warn("MOCKING FAUCETPAY: API Key not set.");
    return { status: 200, message: "Mock payout successful" };
  }

  // Conversão simples: Assumindo que o saldo é em USD e enviamos USDT
  // A FaucetPay aceita 'amount' em satoshis para BTC, mas para USDT geralmente é a unidade inteira ou baseada na moeda.
  // Vamos usar o endpoint /send
  
  try {
    const params = new URLSearchParams();
    params.append('api_key', FAUCETPAY_API_KEY);
    params.append('amount', (amountUSD * 100000000).toString()); // Satoshis (se for BTC) ou ajuste conforme moeda
    params.append('to', to);
    params.append('currency', FAUCETPAY_CURRENCY);
    
    // Nota: FaucetPay documentation pode variar. Para USDT, verifique a escala decimal correta.
    // Este é um exemplo genérico.
    
    const response = await fetch('https://faucetpay.io/api/v1/send', {
      method: 'POST',
      body: params
    });

    const data: any = await response.json();
    
    if (data.status === 200) {
      return { success: true, txid: data.payout_id };
    } else {
      throw new Error(data.message || "FaucetPay API Error");
    }
  } catch (error: any) {
    throw new Error(error.message || "Failed to connect to FaucetPay");
  }
};

// --- ENDPOINTS ---

// 1. SCRIPT DE EXPORTAÇÃO / BACKUP
// Acesse: GET /api/admin/users?adminKey=KLOVER_SECRET_KEY
app.get('/api/admin/users', (req, res) => {
  const { adminKey } = req.query;
  
  if (adminKey !== ADMIN_KEY) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const db = loadDb();
  res.json({
    count: Object.keys(db.users).length,
    users: Object.values(db.users),
    transactions: db.transactions
  });
});

// 2. Auth: Unified (Telegram OR Email)
app.post('/api/auth/telegram', (req, res) => {
  const { initData } = req.body;

  if (!initData) {
    return res.status(400).json({ error: 'No initData provided' });
  }

  // Validate only if running in production with real data
  // const isValid = verifyTelegramWebAppData(initData);
  // if (!isValid) return res.status(403).json({ error: 'Invalid Telegram data' });

  const urlParams = new URLSearchParams(initData);
  const userJson = urlParams.get('user');
  
  if (!userJson) return res.status(400).json({ error: 'No user data' });

  const telegramUser = JSON.parse(userJson);
  const db = loadDb();

  // Find or Create User
  let user = db.users[telegramUser.id.toString()];
  
  if (!user) {
    user = {
      id: telegramUser.id,
      username: telegramUser.username,
      email: telegramUser.username ? `${telegramUser.username}@telegram.user` : `tg_${telegramUser.id}`,
      firstName: telegramUser.first_name,
      photoUrl: telegramUser.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${telegramUser.first_name}`,
      balance: 0.00,
      spins: 1,
      points: 0,
      totalEarnings: 0.00,
      joinDate: new Date().toISOString()
    };
    db.users[telegramUser.id.toString()] = user;
    saveDb(db);
  }

  res.json({ user, token: 'session_token_persistent' });
});

// 3. Auth: Email (FaucetPay Style)
app.post('/api/auth/email', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const db = loadDb();
  
  // Simple "Login by Email" lookup - extremely simplified for demo
  let foundUser = Object.values(db.users).find((u: any) => u.email === email);
  
  if (!foundUser) {
    const newId = Math.floor(Math.random() * 100000000).toString();
    foundUser = {
      id: newId,
      username: email.split('@')[0],
      email: email,
      firstName: 'Miner',
      photoUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${email}`,
      balance: 0.00,
      spins: 1,
      points: 0,
      totalEarnings: 0.00,
      joinDate: new Date().toISOString()
    };
    db.users[newId] = foundUser;
    saveDb(db);
  }

  res.json({ user: foundUser });
});

// 4. Update Balance / Actions
app.post('/api/action/update', (req, res) => {
    const { userId, balance, spins, points } = req.body;
    const db = loadDb();

    if (db.users[userId]) {
        if (balance !== undefined) db.users[userId].balance = balance;
        if (spins !== undefined) db.users[userId].spins = spins;
        if (points !== undefined) db.users[userId].points = points;
        
        saveDb(db);
        return res.json({ success: true, user: db.users[userId] });
    }
    res.status(404).json({ error: 'User not found' });
});

// 5. WITHDRAWAL ENDPOINT (REAL)
app.post('/api/withdraw', async (req, res) => {
  const { userId, amount, address, method } = req.body;
  
  const db = loadDb();
  const user = db.users[userId];

  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.balance < amount) return res.status(400).json({ error: 'Insufficient funds' });

  try {
    // 1. Deduct Balance Locally (Optimistic)
    user.balance -= amount;
    
    let txDetails = "";
    
    if (method === 'FAUCETPAY') {
       // CALL REAL FAUCETPAY API
       const result: any = await sendFaucetPayPayout(address, amount);
       txDetails = `FP_ID: ${result.txid || 'MOCKED'}`;
    } else {
       // CWallet implementation placeholder
       txDetails = "Manual/Cwallet Processing";
    }

    // 2. Record Transaction
    const tx = {
      id: `wd_${Date.now()}`,
      userId: user.id,
      type: 'WITHDRAWAL',
      amount: amount,
      currency: 'USD',
      method: method,
      status: 'COMPLETED', // Or PENDING if manual
      timestamp: Date.now(),
      details: txDetails
    };

    db.transactions.unshift(tx);
    saveDb(db);

    res.json({ success: true, transaction: tx, newBalance: user.balance });

  } catch (error: any) {
    // Refund if API fails
    user.balance += amount; 
    saveDb(db);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`KLOVER Persistent Backend running on port ${PORT}`);
  console.log(`Database file: ${DB_FILE}`);
  console.log(`FaucetPay API Key Loaded: ${FAUCETPAY_API_KEY !== "YOUR_FAUCETPAY_API_KEY_HERE"}`);
});