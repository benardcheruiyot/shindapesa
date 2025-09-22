#!/usr/bin/env node

// Test script for the new backend-based authentication
const http = require('http');

const BACKEND_URL = 'http://localhost:3000';

// Helper function to make HTTP requests
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (error) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testAuthentication() {
  console.log('🔍 Testing ShindaPesa Backend Authentication\n');

  try {
    // Test 1: Check if backend is running
    console.log('1. Testing backend connectivity...');
    const pingResponse = await makeRequest('/ping');
    if (pingResponse.status === 200) {
      console.log('   ✅ Backend is running');
    } else {
      console.log('   ❌ Backend connectivity failed');
      return;
    }

    // Test 2: Check current users (should be empty initially)
    console.log('\n2. Checking existing users...');
    const usersResponse = await makeRequest('/users');
    console.log(`   📊 Current users: ${usersResponse.data.total}`);

    // Test 3: Register a new user
    console.log('\n3. Registering test user...');
    const registerData = {
      username: 'testuser',
      phoneNumber: '+254712345678',
      password: 'password123'
    };
    
    const registerResponse = await makeRequest('/register', 'POST', registerData);
    if (registerResponse.status === 200) {
      console.log('   ✅ User registered successfully');
      console.log(`   📱 User ID: ${registerResponse.data.data.id}`);
      console.log(`   🎯 Referral Code: ${registerResponse.data.data.referralCode}`);
    } else {
      console.log('   ❌ Registration failed:', registerResponse.data.message);
    }

    // Test 4: Try to login with correct credentials
    console.log('\n4. Testing login with correct credentials...');
    const loginData = {
      username: 'testuser',
      password: 'password123'
    };
    
    const loginResponse = await makeRequest('/login', 'POST', loginData);
    if (loginResponse.status === 200) {
      console.log('   ✅ Login successful');
      console.log(`   👤 Welcome ${loginResponse.data.data.username}!`);
    } else {
      console.log('   ❌ Login failed:', loginResponse.data.message);
    }

    // Test 5: Try to login with wrong password
    console.log('\n5. Testing login with wrong password...');
    const wrongLoginData = {
      username: 'testuser',
      password: 'wrongpassword'
    };
    
    const wrongLoginResponse = await makeRequest('/login', 'POST', wrongLoginData);
    if (wrongLoginResponse.status === 401) {
      console.log('   ✅ Correctly rejected wrong password');
      console.log(`   📝 Error: ${wrongLoginResponse.data.message}`);
    } else {
      console.log('   ❌ Should have rejected wrong password');
    }

    // Test 6: Try to login with non-existent user
    console.log('\n6. Testing login with non-existent user...');
    const nonExistentLoginData = {
      username: 'nonexistentuser',
      password: 'password123'
    };
    
    const nonExistentResponse = await makeRequest('/login', 'POST', nonExistentLoginData);
    if (nonExistentResponse.status === 401) {
      console.log('   ✅ Correctly rejected non-existent user');
      console.log(`   📝 Error: ${nonExistentResponse.data.message}`);
    } else {
      console.log('   ❌ Should have rejected non-existent user');
    }

    // Test 7: Check users again
    console.log('\n7. Checking users after registration...');
    const finalUsersResponse = await makeRequest('/users');
    console.log(`   📊 Total users: ${finalUsersResponse.data.total}`);
    finalUsersResponse.data.data.forEach((user, index) => {
      console.log(`   👤 User ${index + 1}: ${user.username} (${user.phoneNumber})`);
    });

    console.log('\n✨ All tests completed!');
    console.log('\n💡 Key Benefits:');
    console.log('   - User accounts are now stored on the backend server');
    console.log('   - Clearing app data will NOT delete your account');
    console.log('   - You can login with your credentials even after clearing data');
    console.log('   - The app falls back to local storage if backend is unavailable');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Make sure the backend server is running:');
    console.log('   cd backend && node index.js');
  }
}

testAuthentication();
