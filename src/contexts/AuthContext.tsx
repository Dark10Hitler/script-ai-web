import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

const AUTH_API_BASE = 'https://script-pwal.onrender.com';
const STORAGE_KEY = 'scen_access_id';

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyAccessId = useCallback(async (accessId: string): Promise<boolean> => {
    setIsVerifying(true);
    setError(null);
    
    try {
      const response = await fetch(`${AUTH_API_BASE}/auth/${accessId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Access ID not found. Please ensure you have started the bot.');
        } else {
          setError('Verification failed. Please try again.');
        }
        return false;
      }
      
      const data = await response.json();
      
      // Store the authenticated user data
      const authUser: AuthUser = {
        user_id: data.user_id,
        lovable_id: data.lovable_id,
        username: data.username || 'User',
        balance: data.balance ?? 0,
      };
      
      setUser(authUser);
      
      // Persist session
      localStorage.setItem(STORAGE_KEY, authUser.lovable_id);
      
      return true;
    } catch (err) {
      console.error('Auth verification error:', err);
      setError('Network error. Please check your connection.');
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    const storedId = localStorage.getItem(STORAGE_KEY);
    if (!storedId) return;
    
    try {
      const response = await fetch(`${AUTH_API_BASE}/auth/${storedId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser({
          user_id: data.user_id,
          lovable_id: data.lovable_id,
          username: data.username || 'User',
          balance: data.balance ?? 0,
        });
      }
    } catch (err) {
      console.error('Profile refresh error:', err);
    }
  }, []);

  const updateBalance = useCallback((newBalance: number) => {
    setUser(prev => prev ? { ...prev, balance: newBalance } : null);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setError(null);
  }, []);

  // Auto-verify on mount if stored ID exists
  useEffect(() => {
    const initAuth = async () => {
      const storedId = localStorage.getItem(STORAGE_KEY);
      
      if (storedId) {
        await verifyAccessId(storedId);
      }
      
      setIsLoading(false);
    };
    
    initAuth();
  }, [verifyAccessId]);

  // Refresh on visibility change
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
