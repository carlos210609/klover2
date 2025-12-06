/**
 * KLOVER BACKEND - Node.js / Express
 * This file contains the server logic for the Standalone Web App.
 * In a real deployment, this runs on a VPS/Heroku/Render.
 */

/* 
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import bodyParser from 'body-parser';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// --- CONFIG ---
const PORT = process.env.PORT || 3000;
const ADMIN_ID = process.env.ADMIN_ID;

// --- DATABASE MOCK (Use PostgreSQL/MongoDB in production) ---
const db = {
  users: new Map(), // key: device_id, value: UserObj
  transactions: [],
  pendingWithdrawals: []
};

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- MIDDLEWARE: Device Auth Validation ---
// For a standalone PWA without email/pass, we use a persistent Device ID generated on the client.
const validateDeviceAuth = (req, res, next) => {
  const deviceId = req.headers['x-device-id'];
  
  if (!deviceId) {
    return res.status(401).json({ error: 'Device ID required' });
  }

  // In a real app, you might sign this ID with a JWT after the first handshake
  req.deviceId = deviceId;
  next();
};

// --- ANTI-FRAUD: Rate Limiter ---
const adLimiter = new RateLimiterMemory({
  points: 20, // 20 ads
  duration: 3600, // per hour
});

// --- ENDPOINTS ---

// 1. Auth/Login (Get or Create User by Device ID)
app.post('/api/auth', validateDeviceAuth, (req, res) => {
  let user = db.users.get(req.deviceId);
  
  if (!user) {
    // Register new user
    user = { 
      id: req.deviceId, 
      username: `User_${Math.floor(Math.random() * 100000)}`, 
      balance: 0, 
      joined: Date.now() 
    };
    db.users.set(req.deviceId, user);
  }
  
  res.json({ user });
});

// 2. Ad Reward
app.post('/api/earn/ad-complete', validateDeviceAuth, async (req, res) => {
  try {
    await adLimiter.consume(req.deviceId); // Consume 1 point
    
    const user = db.users.get(req.deviceId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const reward = 0.001; // $0.001 per ad
    
    user.balance += reward;
    
    // Log transaction
    const tx = {
      userId: user.id,
      type: 'EARN',
      amount: reward,
      timestamp: Date.now(),
      status: 'COMPLETED'
    };

    db.transactions.push(tx);

    res.json({ success: true, newBalance: user.balance });

  } catch (rejRes) {
    res.status(429).json({ error: 'Rate limit exceeded: Too many ads watched recently' });
  }
});

// 3. Withdraw (CWallet / FaucetPay)
app.post('/api/withdraw', validateDeviceAuth, async (req, res) => {
  const { method, amount, address } = req.body;
  const user = db.users.get(req.deviceId);

  if (!user) return res.status(404).json({ error: 'User not found' });

  if (user.balance < amount) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }

  // Deduct balance immediately to prevent double-spend
  user.balance -= amount;

  // In production: Call CWallet/FaucetPay APIs here
  // const payoutResult = await cwalletApi.send(amount, address);
  
  const tx = {
    userId: user.id,
    type: 'WITHDRAWAL',
    method,
    amount,
    address,
    status: 'PENDING', // Pending manual review or API callback
    txId: 'TX_' + crypto.randomBytes(4).toString('hex'),
    timestamp: Date.now()
  };
  
  db.transactions.push(tx);
  res.json({ success: true, tx });
});

app.listen(PORT, () => {
  console.log(`KLOVER Backend running on port ${PORT}`);
});
*/