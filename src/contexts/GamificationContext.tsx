import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

const STORAGE_KEY = 'scriptai_gamification';

// Rank definitions
const RANKS: Record<number, string> = {
  1: 'Content Padawan',
  2: 'Content Padawan',
  3: 'Content Padawan',
  4: 'Script Architect',
  5: 'Script Architect',
  6: 'Script Architect',
  7: 'Script Architect',
  8: 'Viral Lord',
  9: 'Viral Lord',
  10: 'Viral Lord',
};

const getNextRank = (level: number): string => {
  if (level < 4) return 'Script Architect';
  if (level < 8) return 'Viral Lord';
  if (level < 11) return 'Algorithm God';
  return 'Algorithm God';
};

const getRank = (level: number): string => {
  if (level >= 11) return 'Algorithm God';
  return RANKS[level] || 'Content Padawan';
};

const getMaxXP = (level: number): number => {
  // Level 1 starts at 100, each level increases by 20%
  return Math.floor(100 * Math.pow(1.2, level - 1));
};

interface GamificationState {
  level: number;
  currentXP: number;
  maxXP: number;
  streak: number;
  lastGenerationDate: string | null;
}

interface GamificationContextType extends GamificationState {
  rank: string;
  nextRank: string;
  addXP: (amount: number) => { leveledUp: boolean; newLevel: number };
  incrementStreak: () => void;
  showFloatingXP: boolean;
  floatingXPAmount: number;
  levelUpCelebration: boolean;
  newLevelRank: string;
  dismissLevelUp: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const getDefaultState = (): GamificationState => ({
  level: 1,
  currentXP: 0,
  maxXP: 100,
  streak: 0,
  lastGenerationDate: null,
});

const loadFromStorage = (): GamificationState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...getDefaultState(),
        ...parsed,
        maxXP: getMaxXP(parsed.level || 1),
      };
    }
  } catch (e) {
    console.error('Failed to load gamification data:', e);
  }
  return getDefaultState();
};

const saveToStorage = (state: GamificationState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save gamification data:', e);
  }
};

export const GamificationProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GamificationState>(loadFromStorage);
  const [showFloatingXP, setShowFloatingXP] = useState(false);
  const [floatingXPAmount, setFloatingXPAmount] = useState(0);
  const [levelUpCelebration, setLevelUpCelebration] = useState(false);
  const [newLevelRank, setNewLevelRank] = useState('');

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const addXP = useCallback((amount: number) => {
    let leveledUp = false;
    let finalLevel = state.level;

    setState(prev => {
      let newXP = prev.currentXP + amount;
      let newLevel = prev.level;
      let newMaxXP = prev.maxXP;

      // Check for level up
      while (newXP >= newMaxXP) {
        newXP -= newMaxXP;
        newLevel++;
        newMaxXP = getMaxXP(newLevel);
        leveledUp = true;
      }

      finalLevel = newLevel;

      if (leveledUp) {
        setNewLevelRank(getRank(newLevel));
        setLevelUpCelebration(true);
      }

      return {
        ...prev,
        currentXP: newXP,
        level: newLevel,
        maxXP: newMaxXP,
      };
    });

    // Show floating XP animation
    setFloatingXPAmount(amount);
    setShowFloatingXP(true);
    setTimeout(() => setShowFloatingXP(false), 1500);

    return { leveledUp, newLevel: finalLevel };
  }, [state.level]);

  const incrementStreak = useCallback(() => {
    const today = new Date().toDateString();
    
    setState(prev => {
      const lastDate = prev.lastGenerationDate;
      
      if (lastDate === today) {
        // Already generated today, don't increment
        return prev;
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      let newStreak = 1;
      if (lastDate === yesterdayStr) {
        // Continuing streak
        newStreak = prev.streak + 1;
      }

      return {
        ...prev,
        streak: newStreak,
        lastGenerationDate: today,
      };
    });
  }, []);

  const dismissLevelUp = useCallback(() => {
    setLevelUpCelebration(false);
  }, []);

  return (
    <GamificationContext.Provider
      value={{
        ...state,
        rank: getRank(state.level),
        nextRank: getNextRank(state.level),
        addXP,
        incrementStreak,
        showFloatingXP,
        floatingXPAmount,
        levelUpCelebration,
        newLevelRank,
        dismissLevelUp,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within GamificationProvider');
  }
  return context;
};
