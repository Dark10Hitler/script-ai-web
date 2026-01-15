import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { API_BASE_URL } from '@/lib/apiConfig';

interface BalanceContextType {
  balance: number | null;
  isLoading: boolean;
  error: string | null;
  isColdStart: boolean;
  fetchBalance: () => Promise<void>;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider = ({ children, userId }: { children: ReactNode; userId: string }) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isColdStart, setIsColdStart] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    setIsColdStart(false);
    
    const startTime = Date.now();
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        setIsColdStart(true);
      }, 5000);

      const response = await fetch(`${API_BASE_URL}/get_balance/${userId}`, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        if (response.status === 404) {
          // User not found - trigger registration with 10 free credits
          const registerResponse = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId }),
          });
          
          if (registerResponse.ok) {
            setBalance(10);
            return;
          }
        }
        throw new Error('Failed to fetch balance');
      }
      
      const data = await response.json();
      setBalance(data.balance ?? data.credits ?? 0);
    } catch (err) {
      console.error('Balance fetch error:', err);
      setError('Failed to load balance');
      setBalance(0);
    } finally {
      setIsLoading(false);
      setIsColdStart(false);
    }
  }, [userId]);

  // Fetch on mount and when tab becomes visible
  useEffect(() => {
    if (userId) {
      fetchBalance();
      
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          fetchBalance();
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [userId, fetchBalance]);

  return (
    <BalanceContext.Provider value={{ balance, isLoading, error, isColdStart, fetchBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalanceContext = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalanceContext must be used within BalanceProvider');
  }
  return context;
};
