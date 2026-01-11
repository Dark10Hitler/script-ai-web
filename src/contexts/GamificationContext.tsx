import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  totalXP: number;
  maxXP: number;
  streak: number;
  scriptsGenerated: number;
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
  userId: string | null;
  setUserId: (id: string) => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const getDefaultState = (): GamificationState => ({
  level: 1,
  currentXP: 0,
  totalXP: 0,
  maxXP: 100,
  streak: 0,
  scriptsGenerated: 0,
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
  const [userId, setUserIdState] = useState<string | null>(null);
  const [showFloatingXP, setShowFloatingXP] = useState(false);
  const [floatingXPAmount, setFloatingXPAmount] = useState(0);
  const [levelUpCelebration, setLevelUpCelebration] = useState(false);
  const [newLevelRank, setNewLevelRank] = useState('');

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  // Sync to database when userId is set
  const syncToDatabase = useCallback(async (newState: GamificationState, uid: string) => {
    if (!uid) return;
    
    try {
      const { error } = await supabase
        .from('user_stats')
        .upsert({
          user_id: uid,
          level: newState.level,
          current_xp: newState.currentXP,
          total_xp: newState.totalXP,
          streak: newState.streak,
          scripts_generated: newState.scriptsGenerated,
          last_generation_date: newState.lastGenerationDate,
        }, {
          onConflict: 'user_id',
        });

      if (error) {
        console.error('Error syncing to database:', error);
      }
    } catch (e) {
      console.error('Failed to sync gamification data:', e);
    }
  }, []);

  const setUserId = useCallback((id: string) => {
    setUserIdState(id);
    // Initial sync when userId is set
    syncToDatabase(state, id);
  }, [state, syncToDatabase]);

  const addXP = useCallback((amount: number) => {
    let leveledUp = false;
    let finalLevel = state.level;

    setState(prev => {
      let newXP = prev.currentXP + amount;
      let newLevel = prev.level;
      let newMaxXP = prev.maxXP;
      const newTotalXP = prev.totalXP + amount;
      const newScriptsGenerated = prev.scriptsGenerated + 1;

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

      const newState = {
        ...prev,
        currentXP: newXP,
        level: newLevel,
        maxXP: newMaxXP,
        totalXP: newTotalXP,
        scriptsGenerated: newScriptsGenerated,
      };

      // Sync to database
      if (userId) {
        syncToDatabase(newState, userId);
      }

      return newState;
    });

    // Show floating XP animation
    setFloatingXPAmount(amount);
    setShowFloatingXP(true);
    setTimeout(() => setShowFloatingXP(false), 1500);

    return { leveledUp, newLevel: finalLevel };
  }, [state.level, userId, syncToDatabase]);

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

      const newState = {
        ...prev,
        streak: newStreak,
        lastGenerationDate: today,
      };

      // Sync to database
      if (userId) {
        syncToDatabase(newState, userId);
      }

      return newState;
    });
  }, [userId, syncToDatabase]);

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
        userId,
        setUserId,
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
