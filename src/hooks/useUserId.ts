import { useState, useEffect } from 'react';

const generateUserId = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'user_';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const useUserId = () => {
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    let storedId = localStorage.getItem('unique_user_id');
    if (!storedId) {
      storedId = generateUserId();
      localStorage.setItem('unique_user_id', storedId);
    }
    setUserId(storedId);
  }, []);

  return userId;
};
