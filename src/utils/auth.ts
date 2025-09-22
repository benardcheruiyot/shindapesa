import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend configuration
const BACKEND_URL = 'http://10.0.2.2:3000'; // Android emulator localhost
// const BACKEND_URL = 'http://localhost:3000'; // Use this for iOS simulator

export interface User {
  id: string;
  username: string;
  phoneNumber: string;
  points: number;
  isActivated?: boolean;
  pendingActivation?: boolean;
  referralCode?: string;
  referredBy?: string;
  hasUsedFreeSpin?: boolean;
  bonusBalance?: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  phoneNumber: string;
  password: string;
  referralCode?: string;
}

const USERS_KEY = '@users';
const CURRENT_USER_KEY = '@current_user';
const ONBOARDING_COMPLETED_KEY = '@onboarding_completed';
const SAVED_CREDENTIALS_KEY = '@saved_credentials';
const REMEMBER_ME_KEY = '@remember_me';

// API helper function
async function apiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Network request failed');
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Mock user storage and authentication
export class AuthService {
  static async updateUserBonusBalance(userId: string, newBonusBalance: number): Promise<void> {
    try {
      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex].bonusBalance = newBonusBalance;
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
      // Update current user
      const currentUser = await this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        currentUser.bonusBalance = newBonusBalance;
        await this.setCurrentUser(currentUser);
      }
    } catch (error) {
      console.error('Failed to update user bonus balance:', error);
    }
  }
  // Generate a unique referral code
  static generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'PP'; // ShindaPesa prefix
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Initialize test users if none exist
  static async initializeTestUsers(): Promise<void> {
    try {
      const users = await this.getUsers();
      
      // If no users exist, create test users
      if (users.length === 0) {
        const testUsers = [
          {
            id: 'user_demo',
            username: 'demo',
            phoneNumber: '+254712345678',
            password: 'demo123',
            points: 100,
            referralCode: 'PPDEMO01',
            bonusBalance: 0,
            isActivated: true,
            hasUsedFreeSpin: false
          },
          {
            id: 'user_test',
            username: 'test',
            phoneNumber: '+254712345679',
            password: 'test123',
            points: 50,
            referralCode: 'PPTEST01',
            bonusBalance: 0,
            isActivated: true,
            hasUsedFreeSpin: false
          },
          {
            id: 'user_admin',
            username: 'admin',
            phoneNumber: '+254712345680',
            password: 'admin123',
            points: 200,
            referralCode: 'PPADMIN1',
            bonusBalance: 100,
            isActivated: true,
            hasUsedFreeSpin: false
          }
        ];
        
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(testUsers));
        console.log('✅ Test users initialized:', testUsers.map(u => u.username));
      }
    } catch (error) {
      console.error('Failed to initialize test users:', error);
    }
  }

  static async register(credentials: RegisterCredentials): Promise<User> {
    try {
      const response = await apiRequest('/register', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      const user = response.data;
      
      // Store user locally for quick access
      await this.setCurrentUser(user);

      return user;
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      // Fallback to local storage if backend is not available
      if (error.message.includes('Network request failed') || error.message.includes('fetch')) {
        console.log('Backend unavailable, using local storage fallback');
        return this.registerLocal(credentials);
      }
      
      throw error;
    }
  }

  // Fallback local registration method
  private static async registerLocal(credentials: RegisterCredentials): Promise<User> {
    // Initialize test users if none exist
    await this.initializeTestUsers();
    
    const existingUsers = await this.getUsers();
    
    // Check if user already exists
    const userExists = existingUsers.find(
      user => user.username === credentials.username || user.phoneNumber === credentials.phoneNumber
    );
    
    if (userExists) {
      throw new Error('User already exists with this username or phone number');
    }

    let startingPoints = 0;
    let referredByUserId = null;
    let newUserBonusBalance = 0;

    // Check if referral code is provided and valid
    if (credentials.referralCode) {
      const referrerIndex = existingUsers.findIndex(user => user.referralCode === credentials.referralCode);
      if (referrerIndex !== -1) {
        startingPoints = 100; // Bonus points for new user
        referredByUserId = existingUsers[referrerIndex].id;
        existingUsers[referrerIndex].bonusBalance = (existingUsers[referrerIndex].bonusBalance || 0) + 100;
        newUserBonusBalance = 100; // New user also gets 100 referral bonus
        // Persist referrer update
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(existingUsers));
      }
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      username: credentials.username,
      phoneNumber: credentials.phoneNumber,
      points: startingPoints,
      referralCode: this.generateReferralCode(),
      referredBy: referredByUserId,
      bonusBalance: newUserBonusBalance,
    };

    // Store user credentials (in real app, passwords should be hashed)
    const userCredentials = {
      ...newUser,
      password: credentials.password,
    };

    existingUsers.push(userCredentials);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(existingUsers));

    // Auto login after registration
    await this.setCurrentUser(newUser);

    return newUser;
  }
  
  static async login(credentials: LoginCredentials, rememberMe: boolean = false): Promise<User> {
    try {
      // Try backend authentication first
      const response = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      const user = response.data;
      
      // Store user locally for quick access
      await this.setCurrentUser(user);
      
      // Save credentials if remember me is selected
      await this.saveCredentials(credentials, rememberMe);
      
      return user;
    } catch (error: any) {
      console.error('Backend login failed:', error);
      
      // Always fall back to local storage - don't throw backend errors
      console.log('Using local storage authentication');
      return this.loginLocal(credentials, rememberMe);
    }
  }

  // Fallback local login method
  private static async loginLocal(credentials: LoginCredentials, rememberMe: boolean = false): Promise<User> {
    // Initialize test users if none exist
    await this.initializeTestUsers();
    
    const users = await this.getUsers();
    
    const user = users.find(
      u => u.username === credentials.username && u.password === credentials.password
    );
    
    if (!user) {
      // Check if username exists but password is wrong
      const usernameExists = users.find(u => u.username === credentials.username);
      if (usernameExists) {
        throw new Error('Incorrect password for this username');
      } else {
        throw new Error(`Username '${credentials.username}' not found. Available test accounts: demo, test, admin`);
      }
    }
    
    const userWithoutPassword: User = {
      id: user.id,
      username: user.username,
      phoneNumber: user.phoneNumber,
      points: user.points,
      isActivated: user.isActivated,
      referralCode: user.referralCode,
      referredBy: user.referredBy,
      bonusBalance: user.bonusBalance,
      hasUsedFreeSpin: user.hasUsedFreeSpin,
    };
    
    await this.setCurrentUser(userWithoutPassword);
    
    // Save credentials if remember me is selected
    await this.saveCredentials(credentials, rememberMe);
    
    return userWithoutPassword;
  }
  
  static async logout(clearSavedCredentials: boolean = false): Promise<void> {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
    if (clearSavedCredentials) {
      await this.clearSavedCredentials();
    }
  }
  
  static async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      return null;
    }
  }
  
  static async updateUserPoints(userId: string, newPoints: number): Promise<void> {
    try {
      // Update in users storage
      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex].points = newPoints;
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
      
      // Update current user
      const currentUser = await this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        currentUser.points = newPoints;
        await this.setCurrentUser(currentUser);
      }
    } catch (error) {
      console.error('Failed to update user points:', error);
    }
  }

  static async updateUserSpinStatus(userId: string, hasUsedFreeSpin: boolean): Promise<void> {
    try {
      // Update in users storage
      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex].hasUsedFreeSpin = hasUsedFreeSpin;
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
      
      // Update current user
      const currentUser = await this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        currentUser.hasUsedFreeSpin = hasUsedFreeSpin;
        await this.setCurrentUser(currentUser);
      }
    } catch (error) {
      console.error('Failed to update user spin status:', error);
    }
  }

  static async activateUser(userId: string): Promise<void> {
    try {
      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex !== -1) {
        users[userIndex].isActivated = true;
        users[userIndex].pendingActivation = false;
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
        
        // Update current user if it's the same user
        const currentUser = await this.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
          currentUser.isActivated = true;
          currentUser.pendingActivation = false;
          await this.setCurrentUser(currentUser);
        }
      }
    } catch (error) {
      console.error('Failed to activate user:', error);
    }
  }

  static async setPendingActivation(userId: string): Promise<void> {
    try {
      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex !== -1) {
        users[userIndex].pendingActivation = true;
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
        
        // Update current user if it's the same user
        const currentUser = await this.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
          currentUser.pendingActivation = true;
          await this.setCurrentUser(currentUser);
        }
      }
    } catch (error) {
      console.error('Failed to set pending activation:', error);
    }
  }

  static async getReferralStats(userId: string): Promise<{ totalReferrals: number; totalEarnings: number; bonusBalance: number }> {
    try {
      const users = await this.getUsers();
      const referrals = users.filter(user => user.referredBy === userId);
      const totalReferrals = referrals.length;
      const totalEarnings = totalReferrals * 100; // KES 100 per referral
      const user = users.find(u => u.id === userId);
      const bonusBalance = user?.bonusBalance || 0;
      return { totalReferrals, totalEarnings, bonusBalance };
    } catch (error) {
      console.error('Failed to get referral stats:', error);
          return { totalReferrals: 0, totalEarnings: 0, bonusBalance: 0 };
    }
  }

  static async hasCompletedOnboarding(): Promise<boolean> {
    try {
      const completed = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
      return completed === 'true';
    } catch (error) {
      return false;
    }
  }

  static async setOnboardingCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    } catch (error) {
      console.error('Failed to set onboarding completed:', error);
    }
  }
  
  private static async getUsers(): Promise<any[]> {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      return [];
    }
  }
  
  private static async setCurrentUser(user: User): Promise<void> {
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  static async resetPassword(username: string, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.username === username && u.password === currentPassword);
      
      if (userIndex === -1) {
        return false; // Invalid username or current password
      }
      
      // Update password
      users[userIndex].password = newPassword;
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      return true;
    } catch (error) {
      console.error('Failed to reset password:', error);
      return false;
    }
  }

  // Save login credentials for auto-login
  static async saveCredentials(credentials: LoginCredentials, rememberMe: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(REMEMBER_ME_KEY, JSON.stringify(rememberMe));
      if (rememberMe) {
        await AsyncStorage.setItem(SAVED_CREDENTIALS_KEY, JSON.stringify(credentials));
      } else {
        await AsyncStorage.removeItem(SAVED_CREDENTIALS_KEY);
      }
    } catch (error) {
      console.error('Failed to save credentials:', error);
    }
  }

  // Get saved credentials
  static async getSavedCredentials(): Promise<{ credentials: LoginCredentials | null, rememberMe: boolean }> {
    try {
      const rememberMeData = await AsyncStorage.getItem(REMEMBER_ME_KEY);
      const rememberMe = rememberMeData ? JSON.parse(rememberMeData) : false;
      
      if (rememberMe) {
        const credentialsData = await AsyncStorage.getItem(SAVED_CREDENTIALS_KEY);
        const credentials = credentialsData ? JSON.parse(credentialsData) : null;
        return { credentials, rememberMe };
      }
      
      return { credentials: null, rememberMe: false };
    } catch (error) {
      console.error('Failed to get saved credentials:', error);
      return { credentials: null, rememberMe: false };
    }
  }

  // Clear saved credentials
  static async clearSavedCredentials(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SAVED_CREDENTIALS_KEY);
      await AsyncStorage.removeItem(REMEMBER_ME_KEY);
    } catch (error) {
      console.error('Failed to clear saved credentials:', error);
    }
  }

  // Debug method to check stored users
  static async getAllUsers(): Promise<any[]> {
    return await this.getUsers();
  }

  // Debug method to check storage keys
  static async getStorageInfo(): Promise<{totalUsers: number, currentUser: User | null, hasOnboarding: boolean}> {
    try {
      const users = await this.getUsers();
      const currentUser = await this.getCurrentUser();
      const hasOnboarding = await this.hasCompletedOnboarding();
      
      return {
        totalUsers: users.length,
        currentUser,
        hasOnboarding
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return {
        totalUsers: 0,
        currentUser: null,
        hasOnboarding: false
      };
    }
  }
}
