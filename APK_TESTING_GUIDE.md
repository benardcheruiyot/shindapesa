# 🧪 APK Testing Guide - Backend Authentication

## Built APKs Ready for Testing

### 📦 Available APK Files
- **Debug APK**: `app-internal-debug.apk` (100.6 MB) - Built at 10:17:20 AM
- **Release APK**: `app-internal-release.apk` (42.9 MB) - Built at 10:27:23 AM

### 🔧 Prerequisites for Testing
1. **Backend Server Must Be Running**:
   ```bash
   cd backend
   node index.js
   ```
   You should see: "🚀 Server running on port 3000"

2. **Android Device/Emulator Connected**:
   ```bash
   adb devices
   ```

### 📱 Installation Commands
```bash
# Install Debug Version (recommended for testing)
adb install app\build\outputs\apk\internal\debug\app-internal-debug.apk

# OR Install Release Version
adb install app\build\outputs\apk\internal\release\app-internal-release.apk
```

### 🧪 Testing Scenarios

#### Test 1: Backend Authentication (New Feature)
1. **Start backend server** (port 3000)
2. **Register a new account** in the app
3. **Your account is saved on the server** ✅
4. **Clear app data** (Settings > Apps > ShindaPesa > Storage > Clear Data)
5. **Try to login** with the same credentials
6. **✅ SUCCESS**: You should be able to login (backend authentication)

#### Test 2: Offline Fallback
1. **Stop the backend server**
2. **Register a new account** in the app
3. **Account is saved locally** (fallback mode)
4. **Clear app data**
5. **Try to login**
6. **Expected**: Error message saying "No accounts found" (local storage cleared)

#### Test 3: Better Error Messages
1. Try logging in with **wrong password**
2. Try logging in with **non-existent username**
3. **✅ You should see clear, helpful error messages**

### 🎯 Key Features to Test

#### ✅ Server-Based Authentication
- Register account → stored on backend server
- Login works even after clearing app data
- Account data restored from server

#### ✅ Smart Fallback System
- Works offline (uses local storage)
- Graceful degradation if server unavailable
- Clear error messages about connectivity

#### ✅ Password Persistence
- "Remember my password" checkbox
- Auto-fills credentials on return
- Saved credentials survive app restarts

#### ✅ Better User Experience
- Account status indicators
- Clear error messages
- Visual feedback for storage state

### 🐛 Troubleshooting

#### Backend Not Responding
- Check if server is running: `netstat -an | findstr :3000`
- Restart server: `cd backend && node index.js`
- Check console for server logs

#### App Connection Issues
- Ensure device/emulator can reach `localhost:3000`
- For real device, may need to use computer's IP instead of localhost
- Check network connectivity

#### Old App Version
- Uninstall old version first: `adb uninstall com.shindapesa.internal`
- Install fresh APK
- Clear app data to reset state

### 📊 Success Indicators

✅ **Backend Registration**: Account survives app data clearing
✅ **Smart Error Messages**: Clear feedback about account status  
✅ **Fallback Mode**: Works without backend server
✅ **Password Saving**: Credentials remembered between sessions
✅ **Visual Feedback**: Account count and status displayed

### 🎮 Ready to Test!

**Recommended Test Flow**:
1. Install debug APK
2. Start backend server
3. Register new account
4. Clear app data
5. Login again → Should work! 🎉

This demonstrates the key improvement: **your account persists even after clearing app data** because it's stored on the backend server.
