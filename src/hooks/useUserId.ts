import { useState, useEffect } from 'react';

const generateUserId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `scen_${timestamp}_${randomStr}`;
};

// Cookie utilities
const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};

export const useUserId = () => {
  const [userId, setUserId] = useState<string>('');
  const [needsRecovery, setNeedsRecovery] = useState(false);

  useEffect(() => {
    // Check localStorage first
    let storedId = localStorage.getItem('scenario_id');
    
    // If not in localStorage, check cookie (TikTok/IG browser resilience)
    if (!storedId) {
      storedId = getCookie('scenario_id');
    }
    
    // If found in cookie but not localStorage, restore it
    if (storedId) {
      localStorage.setItem('scenario_id', storedId);
      setCookie('scenario_id', storedId, 365);
      setUserId(storedId);
    } else {
      // Generate new ID
      const newId = generateUserId();
      localStorage.setItem('scenario_id', newId);
      setCookie('scenario_id', newId, 365);
      setUserId(newId);
    }
  }, []);

  const recoverAccount = (manualId: string) => {
    if (manualId.trim()) {
      localStorage.setItem('scenario_id', manualId.trim());
      setCookie('scenario_id', manualId.trim(), 365);
      setUserId(manualId.trim());
      setNeedsRecovery(false);
    }
  };

  const showRecovery = () => setNeedsRecovery(true);
  const hideRecovery = () => setNeedsRecovery(false);

  return { userId, needsRecovery, recoverAccount, showRecovery, hideRecovery };
};
