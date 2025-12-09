
/**
 * KLOVER 2.0 BACKEND - Node.js / Express
 * JSON File Persistence System
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIG ---
const PORT = process.env.PORT || 3000;
const ADMIN_KEY = "KLOVER_SECRET_KEY";
const DB_FILE = path.join(__dirname, 'database.json');

// --- PAYMENT GATEWAY CONFIG (PLACEHOLDERS) ---
const PIX_API_KEY = "YOUR_PIX_PROVIDER_API_KEY"; 
const TON_WALLET_SECRET = "YOUR_TON_WALLET_SECRET";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- FILE DATABASE SYSTEM ---
interface Database {
  users: Record<string, any>;
  transactions: any[];
}

const loadDb = (): Database => {
  if (!fs.existsSync(DB_FILE)) {
    const initialDb: Database = { users: {}, transactions: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2));
    return initialDb;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (error) {
    console.error("Error reading DB, recreating...", error);
    const backupDb: Database = { users: {}, transactions: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(backupDb, null, 2));
    return backupDb;
  }
};

const saveDb = (data: Database) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error saving DB:", error);
  }
};

// --- HELPER: Mock Payment API Calls ---
const processPixPayout = async (to: string, amountBRL: number) => {
  if (PIX_API_KEY === "YOUR_PIX_PROVIDER_API_KEY") {
    console.warn("MOCKING PIX: API Key not set.");
    await new Promise(r => setTimeout(r, 1500)); // Simulate API delay
    return { success: true, txid: "mock_pix_" + Date.now() };
  }
  // Real implementation with Asaas, Gerencianet, etc. would go here
  // const response = await fetch('https://api.paymentprovider.com/v1/pix/payout', ...);
  // const data = await response.json();
  // if(!response.ok) throw new Error(data.message);
  // return { success: true, txid: data.transactionId };
  throw new Error("PIX provider not implemented.");
};


// --- ENDPOINTS ---

// 1. Admin Backup
app.get('/api/admin/data', (req, res) => {
  const { adminKey } = req.query;
  if (adminKey !== ADMIN_KEY) return res.status(403).json({ error: 'Access denied' });
  const db = loadDb();
  res.json(db);
});

// 2. Auth: Telegram
app.post('/api/auth/telegram', (req, res) => {
  const { initDataUnsafe, referralCode } = req.body;
  const user = initDataUnsafe?.user;

  if (!user) return res.status(400).json({ error: 'Invalid Telegram data' });

  const db = loadDb();
  let dbUser = db.users[user.id.toString()];
  
  if (!dbUser) {
    dbUser = {
      id: user.id,
      username: user.username || `user${user.id}`,
      email: `tg_${user.id}`,
      firstName: user.first_name,
      photoUrl: user.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.first_name}`,
      balance: 0.00,
      tonBalance: 0.00,
      xp: 0,
      level: 1,
      chests: [{ id: `chest_${Date.now()}`, rarity: 'COMMON', acquiredAt: Date.now() }],
      joinDate: new Date().toISOString(),
      referredBy: referralCode,
      status: 'ACTIVE'
    };
    db.users[user.id.toString()] = dbUser;
    saveDb(db);
  }

  res.json({ user: dbUser });
});

// 3. Update User State (e.g., after ad reward)
app.post('/api/user/update', (req, res) => {
    const { userId, updates } = req.body; // updates can be { xp, level, balance, chests }
    if (!userId || !updates) return res.status(400).json({ error: 'Missing parameters' });
    
    const db = loadDb();
    if (db.users[userId]) {
        db.users[userId] = { ...db.users[userId], ...updates };
        saveDb(db);
        return res.json({ success: true, user: db.users[userId] });
    }
    res.status(404).json({ error: 'User not found' });
});


// 4. WITHDRAWAL ENDPOINT
app.post('/api/withdraw', async (req, res) => {
  const { userId, amount, address, method } = req.body;
  
  const db = loadDb();
  const user = db.users[userId];

  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const isPix = method === 'PIX';
  if (isPix && user.balance < amount) return res.status(400).json({ error: 'Insufficient BRL funds' });
  if (!isPix && user.tonBalance < amount) return res.status(400).json({ error: 'Insufficient TON funds' });

  // 1. Deduct Balance Locally (Optimistic)
  if (isPix) user.balance -= amount;
  else user.tonBalance -= amount;
  
  try {
    let apiResult;
    if (isPix) {
       apiResult = await processPixPayout(address, amount);
    } else {
       // TON payout logic would go here
       throw new Error("TON withdrawals not yet enabled.");
    }

    // 2. Record Transaction
    const tx = {
      id: `wd_${Date.now()}`,
      userId: user.id,
      type: 'WITHDRAWAL',
      amount: amount,
      currency: isPix ? 'BRL' : 'TON',
      method: method,
      status: 'COMPLETED',
      timestamp: Date.now(),
      details: `TX ID: ${apiResult.txid}`
    };
    db.transactions.unshift(tx);
    saveDb(db);

    res.json({ success: true, transaction: tx, newBalance: isPix ? user.balance : user.tonBalance });

  } catch (error: any) {
    // Refund if API fails
    if (isPix) user.balance += amount; 
    else user.tonBalance += amount;
    saveDb(db);
    res.status(500).json({ error: error.message });
  }
});

// --- PLACEHOLDER ENDPOINTS FOR KLOVER 2.0 ---
app.get('/api/missions', (req, res) => {
    // In a real app, this would be dynamic based on user progress
    res.json({ daily: [], weekly: [] });
});

app.get('/api/ranking', (req, res) => {
    const db = loadDb();
    const rankedUsers = Object.values(db.users)
        .sort((a, b) => (b.level - a.level) || (b.xp - a.xp))
        .slice(0, 50)
        .map((u, i) => ({
            rank: i + 1,
            userId: u.id,
            username: u.username,
            photoUrl: u.photoUrl,
            level: u.level,
            xp: u.xp,
        }));
    res.json(rankedUsers);
});


app.listen(PORT, () => {
  console.log(`KLOVER 2.0 Backend running on port ${PORT}`);
  console.log(`Database file: ${DB_FILE}`);
});
