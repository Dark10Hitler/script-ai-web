import { useState, useCallback } from 'react';

const API_BASE = 'https://scenaries.onrender.com';

export const useBalance = (userId: string) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/get_balance/${userId}`);
      if (!response.ok) {
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
    }
  }, [userId]);

  return { balance, isLoading, error, fetchBalance };
};
