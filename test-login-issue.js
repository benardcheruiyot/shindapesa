#!/usr/bin/env node

// Test script to demonstrate the login issue after data clearing
const readline = require('readline');

console.log('🔍 ShindaPesa Login Issue Demonstration\n');

// Simulate the authentication flow
class MockAuthService {
  constructor() {
    this.users = []; // This simulates AsyncStorage being empty after clearing app data
  }

  addUser(username, password) {
    this.users.push({ username, password, id: Date.now() });
    console.log(`✅ User '${username}' registered successfully`);
  }

  login(username, password) {
    console.log(`🔐 Attempting login for username: '${username}'`);
    
    if (this.users.length === 0) {
      throw new Error('No accounts found. Please register a new account as your data was cleared.');
    }
    
    const user = this.users.find(u => u.username === username && u.password === password);
    
    if (!user) {
      const usernameExists = this.users.find(u => u.username === username);
      if (usernameExists) {
        throw new Error('Incorrect password for this username');
      } else {
        throw new Error('Username not found. Please check your username or register a new account.');
      }
    }
    
    return user;
  }

  clearData() {
    this.users = [];
    console.log('🗑️ App data cleared (simulating clear app data)');
  }

  getStorageInfo() {
    return {
      totalUsers: this.users.length,
      usersList: this.users.map(u => ({ username: u.username, id: u.id }))
    };
  }
}

// Demo the issue
const auth = new MockAuthService();

console.log('📱 Scenario: User registers and tries to login after clearing app data\n');

// Step 1: User registers
console.log('Step 1: User Registration');
auth.addUser('testuser', 'password123');
const info1 = auth.getStorageInfo();
console.log(`   Storage: ${info1.totalUsers} users registered\n`);

// Step 2: User successfully logs in
console.log('Step 2: Successful Login');
try {
  const user = auth.login('testuser', 'password123');
  console.log(`   ✅ Login successful for ${user.username}\n`);
} catch (error) {
  console.log(`   ❌ Login failed: ${error.message}\n`);
}

// Step 3: User clears app data
console.log('Step 3: Clear App Data');
auth.clearData();
const info2 = auth.getStorageInfo();
console.log(`   Storage: ${info2.totalUsers} users found\n`);

// Step 4: User tries to login with same credentials
console.log('Step 4: Login Attempt After Data Clear');
try {
  const user = auth.login('testuser', 'password123');
  console.log(`   ✅ Login successful for ${user.username}\n`);
} catch (error) {
  console.log(`   ❌ Login failed: ${error.message}\n`);
}

console.log('💡 Solution: The app now shows helpful error messages to guide users:');
console.log('   - "No accounts found. Please register a new account as your data was cleared."');
console.log('   - "Username not found. Please check your username or register a new account."');
console.log('   - "Incorrect password for this username"');
console.log('\n🛠️ The login screen also shows account status for debugging.');
