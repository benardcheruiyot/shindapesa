// Load environment variables
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins (for development)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Log all incoming requests for debugging
  console.log(`📞 ${new Date().toISOString()} - ${req.method} ${req.url} from ${req.ip}`);
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Persistent user storage file
const USERS_FILE = path.join(__dirname, 'users.json');

// In-memory user storage (in production, use a proper database)
let users = new Map();

// Load users from file on startup
function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const userData = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
      users = new Map(Object.entries(userData));
      console.log(`📚 Loaded ${users.size} users from storage`);
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
}

// Save users to file
function saveUsers() {
  try {
    const userData = Object.fromEntries(users);
    fs.writeFileSync(USERS_FILE, JSON.stringify(userData, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
  }
}

// Load users on startup
loadUsers();

// Helper function to generate referral code
function generateReferralCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'PP'; // ShindaPesa prefix
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

app.use(bodyParser.json());

// Simple connectivity test endpoint
app.get('/ping', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Backend is reachable!', 
    timestamp: new Date().toISOString(),
    clientIP: req.ip 
  });
});

app.post('/ping', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'POST request successful!', 
    timestamp: new Date().toISOString(),
    clientIP: req.ip,
    receivedData: req.body
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Hourly notification endpoints
app.post('/notification-clicked', (req, res) => {
  const { notificationId, userId, timestamp } = req.body;
  
  console.log('👆 Notification clicked:', { notificationId, userId, timestamp });
  
  res.json({
    status: 'success',
    message: 'Notification click tracked',
    data: { notificationId, userId, timestamp },
    timestamp: new Date().toISOString()
  });
});

app.get('/notification-stats', (req, res) => {
  console.log('📊 Notification stats requested');
  
  // Mock statistics - in real app, get from database
  const stats = {
    totalSent: 1247,
    clickRate: 23.5,
    conversionRate: 8.2,
    topPerformingHour: 19,
    mostEffectiveMessage: 'Prime Time Rewards!',
    userEngagement: {
      daily: 156,
      weekly: 892,
      monthly: 3245
    }
  };
  
  res.json({
    status: 'success',
    message: 'Notification statistics',
    data: stats,
    timestamp: new Date().toISOString()
  });
});

app.post('/schedule-notification', (req, res) => {
  const { userId, message, scheduleTime, type } = req.body;
  
  console.log('⏰ Notification scheduled:', { userId, message, scheduleTime, type });
  
  res.json({
    status: 'success',
    message: 'Notification scheduled successfully',
    data: { userId, message, scheduleTime, type },
    scheduledId: `sched_${Date.now()}`,
    timestamp: new Date().toISOString()
  });
});

// Withdrawal endpoint
app.post('/withdraw', (req, res) => {
  const { userId, phoneNumber, amount, processingFee } = req.body;
  
  console.log('💰 Withdrawal request:', { userId, phoneNumber, amount, processingFee });
  
  // Simulate processing time
  setTimeout(() => {
    const withdrawalId = `withdraw_${Date.now()}`;
    
    res.json({
      status: 'success',
      message: 'Withdrawal processed successfully',
      data: {
        withdrawalId,
        userId,
        phoneNumber,
        amount,
        processingFee,
        totalDeducted: amount + processingFee,
        timestamp: new Date().toISOString(),
        mpesaCode: `MP${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      }
    });
  }, 2000); // 2 second delay to simulate processing
});

// Check withdrawal status
app.get('/withdrawal-status/:withdrawalId', (req, res) => {
  const { withdrawalId } = req.params;
  
  console.log('📊 Withdrawal status check:', withdrawalId);
  
  res.json({
    status: 'success',
    data: {
      withdrawalId,
      status: 'completed',
      timestamp: new Date().toISOString(),
      mpesaConfirmed: true
    }
  });
});

// Payment verification endpoint
app.post('/verify-payment', (req, res) => {
  const { transactionCode, phoneNumber, amount, payBillNumber, accountNumber, accountName } = req.body;
  
  console.log('🔍 Payment verification request:', { transactionCode, phoneNumber, amount, payBillNumber, accountNumber, accountName });
  
  // Validate transaction code format
  if (!transactionCode || transactionCode.length !== 10) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid transaction code format'
    });
  }

  // Simulate verification process
  setTimeout(() => {
    // Mock verification logic - in real app, verify with M-Pesa API
    const isValidTransaction = Math.random() > 0.1; // 90% success rate for demo
    
    if (isValidTransaction) {
      const verificationId = `verify_${Date.now()}`;
      
      res.json({
        status: 'success',
        message: 'Payment verification submitted successfully',
        data: {
          verificationId,
          transactionCode,
          phoneNumber,
          amount,
          payBillNumber,
          accountNumber,
          accountName,
          status: 'pending',
          timestamp: new Date().toISOString(),
          estimatedConfirmation: '2-5 minutes'
        }
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Transaction code not found or invalid. Please check and try again.',
        error: 'INVALID_TRANSACTION_CODE'
      });
    }
  }, 1500); // Simulate network delay
});

// Account creation endpoint
app.post('/create-account', (req, res) => {
  const { firstName, lastName, phoneNumber, email, password } = req.body;
  
  console.log('👤 Account creation request:', { firstName, lastName, phoneNumber, email });
  
  // Validate required fields
  if (!firstName || !lastName || !phoneNumber || !email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'All fields are required'
    });
  }

  // Validate phone number format
  const phoneRegex = /^\+254[17]\d{8}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid phone number format'
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid email format'
    });
  }

  // Simulate account creation process
  setTimeout(() => {
    // Mock duplicate check - 10% chance of duplicate for demo
    const isDuplicate = Math.random() < 0.1;
    
    if (isDuplicate) {
      res.status(409).json({
        status: 'error',
        message: 'An account with this phone number or email already exists',
        error: 'DUPLICATE_ACCOUNT'
      });
    } else {
      const userId = `user_${Date.now()}`;
      const accountData = {
        userId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber,
        email: email.toLowerCase().trim(),
        points: 0,
        isAccountActivated: false,
        referralCode: `REF${userId.slice(-6).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        welcomeBonus: 10 // Give new users 10 points welcome bonus
      };
      
      res.json({
        status: 'success',
        message: 'Account created successfully',
        data: accountData,
        timestamp: new Date().toISOString()
      });
    }
  }, 2000); // Simulate processing time
});

// User registration endpoint
app.post('/register', (req, res) => {
  const { username, phoneNumber, password, referralCode } = req.body;
  
  console.log('� Registration request:', { username, phoneNumber, referralCode });
  
  // Validate required fields
  if (!username || !phoneNumber || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Username, phone number and password are required'
    });
  }

  // Check if user already exists
  const existingUser = Array.from(users.values()).find(
    user => user.username === username || user.phoneNumber === phoneNumber
  );
  
  if (existingUser) {
    return res.status(409).json({
      status: 'error',
      message: 'User already exists with this username or phone number'
    });
  }

  // Create new user
  const userId = `user_${Date.now()}`;
  let startingPoints = 0;
  let referredByUserId = null;
  let newUserBonusBalance = 0;

  // Check if referral code is provided and valid
  if (referralCode) {
    const referrer = Array.from(users.values()).find(user => user.referralCode === referralCode);
    if (referrer) {
      startingPoints = 100; // Bonus points for new user
      referredByUserId = referrer.id;
      referrer.bonusBalance = (referrer.bonusBalance || 0) + 100;
      newUserBonusBalance = 100; // New user also gets 100 referral bonus
      users.set(referrer.id, referrer); // Update referrer
    }
  }

  const newUser = {
    id: userId,
    username,
    phoneNumber,
    password, // In production, hash this!
    points: startingPoints,
    referralCode: generateReferralCode(),
    referredBy: referredByUserId,
    bonusBalance: newUserBonusBalance,
    isActivated: false,
    pendingActivation: false,
    hasUsedFreeSpin: false,
    createdAt: new Date().toISOString()
  };

  users.set(userId, newUser);
  
  // Save users to file
  saveUsers();

  // Return user without password
  const { password: _, ...userResponse } = newUser;
  
  console.log(`✅ User registered: ${username} (Total users: ${users.size})`);
  
  res.json({
    status: 'success',
    message: 'Registration successful',
    data: userResponse,
    timestamp: new Date().toISOString()
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log('🔐 Login request received:', { 
    username, 
    passwordLength: password ? password.length : 0,
    totalUsers: users.size,
    timestamp: new Date().toISOString()
  });
  
  // Log all available usernames for debugging
  const availableUsernames = Array.from(users.values()).map(u => u.username);
  console.log('📋 Available usernames:', availableUsernames);
  
  // Validate required fields
  if (!username || !password) {
    console.log('❌ Missing credentials');
    return res.status(400).json({
      status: 'error',
      message: 'Username and password are required'
    });
  }

  // Find user by username
  const user = Array.from(users.values()).find(
    u => u.username === username && u.password === password
  );
  
  console.log('🔍 User search result:', {
    found: !!user,
    searchedUsername: username,
    searchedPassword: password
  });
  
  if (!user) {
    // Check if username exists but password is wrong
    const usernameExists = Array.from(users.values()).find(u => u.username === username);
    console.log('👤 Username check:', { 
      usernameExists: !!usernameExists,
      providedUsername: username 
    });
    
    if (usernameExists) {
      console.log('❌ Wrong password for existing user');
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect password for this username',
        error: 'INVALID_PASSWORD'
      });
    } else {
      console.log('❌ Username not found');
      return res.status(401).json({
        status: 'error',
        message: 'Invalid username or password',
        error: 'INVALID_CREDENTIALS'
      });
    }
  }

  // Update last login
  user.lastLogin = new Date().toISOString();
  users.set(user.id, user);
  
  // Save users to file
  saveUsers();

  // Return user without password
  const { password: _, ...userResponse } = user;
  
  console.log(`✅ Login successful: ${username}`);
  
  res.json({
    status: 'success',
    message: 'Login successful',
    data: userResponse,
    timestamp: new Date().toISOString()
  });
});

// Get user profile endpoint
app.get('/profile/:userId', (req, res) => {
  const { userId } = req.params;
  
  const user = users.get(userId);
  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
  }

  // Return user without password
  const { password: _, ...userResponse } = user;
  
  res.json({
    status: 'success',
    data: userResponse,
    timestamp: new Date().toISOString()
  });
});

// Update user points endpoint
app.put('/profile/:userId/points', (req, res) => {
  const { userId } = req.params;
  const { points } = req.body;
  
  const user = users.get(userId);
  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
  }

  user.points = points;
  users.set(userId, user);

  res.json({
    status: 'success',
    message: 'Points updated successfully',
    data: { points: user.points },
    timestamp: new Date().toISOString()
  });
});

// List all users endpoint (for debugging)
app.get('/users', (req, res) => {
  const userList = Array.from(users.values()).map(user => {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
  
  res.json({
    status: 'success',
    data: userList,
    total: userList.length,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Backend URL: http://localhost:${PORT}`);
  console.log(`✨ Simple backend server ready!`);
  console.log(`🔔 Notification endpoints available:`);
  console.log(`   POST /notification-clicked`);
  console.log(`   GET  /notification-stats`);
  console.log(`   POST /schedule-notification`);
  console.log(`💰 Withdrawal endpoints available:`);
  console.log(`   POST /withdraw`);
  console.log(`   GET  /withdrawal-status/:withdrawalId`);
  console.log(`🔍 Payment verification endpoints:`);
  console.log(`   POST /verify-payment`);
  console.log(`👤 Account management endpoints:`);
  console.log(`   POST /create-account`);
  console.log(`   POST /login`);
  console.log(`   POST /register`);
  console.log(`   GET  /users`);
  console.log(`   GET  /profile/:userId`);
});
