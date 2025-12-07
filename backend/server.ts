/**
 * KLOVER BACKEND - Node.js / Express
 * Real implementation for Telegram Authentication
 */

/*
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import bodyParser from 'body-parser';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// --- CONFIG ---
const PORT = process.env.PORT || 3000;
// SECURITY WARNING: In production, use process.env.BOT_TOKEN
const BOT_TOKEN = "8407232561:AAES_3QNfxtOUYFBbvS9MJlCM6ZIYZwf5B4"; 

// --- DATABASE MOCK ---
const db = {
  users: new Map(), // key: user_id (or email), value: UserObj
  transactions: []
};

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- HELPER: Validate Telegram WebApp Data ---
const verifyTelegramWebAppData = (telegramInitData) => {
  const urlParams = new URLSearchParams(telegramInitData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');
  urlParams.sort();

  let dataCheckString = '';
  for (const [key, value] of urlParams.entries()) {
    dataCheckString += `${key}=${value}\n`;
  }
  dataCheckString = dataCheckString.slice(0, -1);

  const secret = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
  const calculatedHash = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');

  return calculatedHash === hash;
};

// --- ENDPOINTS ---

// 1. Auth: Unified (Telegram OR Email)
app.post('/api/auth/telegram', (req, res) => {
  const { initData } = req.body;

  if (!initData) {
    return res.status(400).json({ error: 'No initData provided' });
  }

  // 1. Validate the data came from Telegram using your Bot Token
  const isValid = verifyTelegramWebAppData(initData);
  
  if (!isValid) {
    return res.status(403).json({ error: 'Invalid Telegram data' });
  }

  // 2. Extract User Data
  const urlParams = new URLSearchParams(initData);
  const userJson = urlParams.get('user');
  const telegramUser = JSON.parse(userJson);

  // 3. Find or Create User in DB
  let user = db.users.get(telegramUser.id.toString());
  
  if (!user) {
    user = {
      id: telegramUser.id,
      username: telegramUser.username,
      email: `${telegramUser.id}@telegram.user`, // Internal placeholder
      firstName: telegramUser.first_name,
      photoUrl: telegramUser.photo_url || null,
      balance: 0.00,
      totalEarnings: 0.00,
      joinDate: new Date().toISOString()
    };
    db.users.set(telegramUser.id.toString(), user);
  }

  res.json({ user, token: 'session_token_example' });
});

app.listen(PORT, () => {
  console.log(`KLOVER Backend running on port ${PORT}`);
});
*/