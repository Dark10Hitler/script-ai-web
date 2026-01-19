import React, { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';

const AUTH_API_BASE = 'https://script-pwal.onrender.com';
const STORAGE_KEY = 'scen_access_id';
const REQUEST_TIMEOUT_MS = 30000; // 30 second timeout

export interface AuthUser {
  user_id: string;
  lovable_id: string;
  username: string;
  balance: number;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isVerifying: boolean;
  error: string | null;
  verifyAccessId: (accessId: string) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Safe localStorage helper to prevent CSP issues
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('localStorage access failed:', e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('localStorage write failed:', e);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('localStorage remove failed:', e);
    }
  }
};

// Safe fetch with timeout
const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs: number): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initRef = useRef(false);

  const verifyAccessId = useCallback(async (accessId: string): Promise<boolean> => {
    // Sanitize input
    const sanitizedId = String(accessId || '').trim();
    
    if (!sanitizedId) {
      setError('Access ID cannot be empty');
      return false;
    }
    
    setIsVerifying(true);
    setError(null);
    
    try {
      const response = await fetchWithTimeout(
        `${AUTH_API_BASE}/auth/${encodeURIComponent(sanitizedId)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        },
        REQUEST_TIMEOUT_MS
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Access ID not found. Please ensure you have started the bot.');
        } else if (response.status >= 500) {
          setError('Server error. Please try again later.');
        } else {
          setError('Verification failed. Please try again.');
        }
        setIsVerifying(false);
        return false;
      }
      
      let data: Record<string, unknown>;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        setError('Invalid server response. Please try again.');
        setIsVerifying(false);
        return false;
      }
      
      // Validate response data
      if (!data || typeof data !== 'object') {
        setError('Invalid server response format.');
        setIsVerifying(false);
        return false;
      }
      
      // Store the authenticated user data
      const authUser: AuthUser = {
        user_id: String(data.user_id || ''),
        lovable_id: String(data.lovable_id || sanitizedId),
        username: String(data.username || 'User'),
        balance: typeof data.balance === 'number' ? data.balance : 0,
      };
      
      // Persist session first (synchronously)
      safeLocalStorage.setItem(STORAGE_KEY, authUser.lovable_id);
      
      // Then update state
      setUser(authUser);
      setIsVerifying(false);
      
      return true;
    } catch (err) {
      console.error('Auth verification error:', err);
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Connection timeout. Please check your internet and try again.');
        } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          setError('Network error. Please check your connection.');
        } else {
          setError('System Error: Please check your internet or ID. Details in console.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      
      setIsVerifying(false);
      return false;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    const storedId = safeLocalStorage.getItem(STORAGE_KEY);
    if (!storedId) return;
    
    try {
      const response = await fetchWithTimeout(
        `${AUTH_API_BASE}/auth/${encodeURIComponent(storedId)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        },
        REQUEST_TIMEOUT_MS
      );
      
      if (response.ok) {
        const data = await response.json();
        setUser(prevUser => ({
          user_id: String(data.user_id || prevUser?.user_id || ''),
          lovable_id: String(data.lovable_id || storedId),
          username: String(data.username || prevUser?.username || 'User'),
          balance: typeof data.balance === 'number' ? data.balance : (prevUser?.balance ?? 0),
        }));
      }
    } catch (err) {
      console.error('Profile refresh error:', err);
      // Silent fail for refresh - don't update error state
    }
  }, []);

  const updateBalance = useCallback((newBalance: number) => {
    setUser(prev => prev ? { ...prev, balance: newBalance } : null);
  }, []);

  const logout = useCallback(() => {
    safeLocalStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setError(null);
  }, []);

  // Auto-verify on mount if stored ID exists - runs only once
  useEffect(() => {
    // Prevent double initialization in StrictMode
    if (initRef.current) return;
    initRef.current = true;
    
    const initAuth = async () => {
      try {
        const storedId = safeLocalStorage.getItem(STORAGE_KEY);
        
        if (storedId && storedId.trim()) {
          await verifyAccessId(storedId);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, [verifyAccessId]);

  // Refresh on visibility change - with null check
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user) {
        refreshProfile();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user, refreshProfile]);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        isVerifying,
        error, 
        verifyAccessId, 
        refreshProfile,
        logout,
        updateBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
