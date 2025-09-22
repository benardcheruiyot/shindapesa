# 📱 ShindaPesa APK - Device Testing Guide

## ✅ Installation Complete!
- **Device**: R3CT307E1MV 
- **APK Installed**: app-internal-debug.apk (100.6 MB)
- **Backend Server**: Running on port 3000 ✅

## 🧪 Test the New Authentication Feature

### **Problem You Wanted Solved:**
*"When I clear data and try login into account I already registered, it says wrong password"*

### **Solution Test Steps:**

#### 1. **Register a New Account** 
- Open ShindaPesa app on your device
- Go to "Sign up here" 
- Create account with:
  - Username: `testuser2025`
  - Phone: `+254712345678`
  - Password: `mypassword123`
- ✅ Account will be saved on BOTH server and device

#### 2. **Verify Registration Success**
- You should see successful registration
- Account data should load (points, referral code, etc.)

#### 3. **Clear App Data** (The Critical Test!)
- Go to: Settings > Apps > ShindaPesa
- Tap "Storage" 
- Tap "Clear Data" or "Clear Storage"
- Confirm deletion

#### 4. **Test Login After Data Clear** 🎯
- Open ShindaPesa app again
- Try to login with:
  - Username: `testuser2025`
  - Password: `mypassword123`
- **✅ EXPECTED RESULT**: Login should work!
- **✅ Your account data should be restored**

### **What's Different Now:**

#### ❌ **Before (Old Behavior):**
- Clear data → Account deleted locally
- Login attempt → "Invalid username or password"
- Had to register again

#### ✅ **After (New Behavior):**
- Clear data → Only local cache deleted  
- Account still exists on server
- Login attempt → ✅ Success! Data restored from server

### **Visual Indicators:**

The login screen now shows:
- 📊 Number of accounts available
- ⚠️ Warning if no local accounts found
- Clear messages about what's happening

### **Troubleshooting:**

#### If Login Still Fails:
1. **Check backend server**: Make sure terminal shows "Server running on port 3000"
2. **Try airplane mode test**: Turn off WiFi/mobile data, try login (should show different error)
3. **Register fresh account**: Use a new username to test

#### Expected Error Messages:
- **No backend + no local data**: "No accounts found. Please register..."
- **Wrong password**: "Incorrect password for this username"  
- **Non-existent username**: "Username not found..."

## 🎯 Success Criteria

✅ **Registration**: Account created and saved on server
✅ **Data Clear**: Local storage cleared but server retains account  
✅ **Login Restoration**: Login works and data is restored from server
✅ **Better UX**: Clear error messages guide user appropriately

## 🔧 Backend Server Status

The backend server is currently running and ready to:
- Store your account permanently
- Authenticate login attempts  
- Restore account data after app data clearing

**Server Endpoints Available:**
- POST /register - Create account on server
- POST /login - Authenticate against server  
- GET /users - List all registered users

Your device testing should now demonstrate that **accounts persist even after clearing app data!**
