import { memo, useState, useEffect, useCallback } from 'react';
import { Coins, RefreshCw, Zap, Key, Loader2 } from 'lucide-react';
import { useBalanceContext } from '@/contexts/BalanceContext';

interface BalanceHeaderProps {
  userId: string;
  onRefresh: () => void;
  onTopUp: () => void;
  onShowRecovery: () => void;
}

export const BalanceHeader = memo(({ userId, onRefresh, onTopUp, onShowRecovery }: BalanceHeaderProps) => {
  const { balance, isLoading, isColdStart, freeTierLimit } = useBalanceContext();
  const [isPulsing, setIsPulsing] = useState(false);
  const [prevBalance, setPrevBalance] = useState<number | null>(null);

  // Detect balance changes and trigger minimal pulse
  useEffect(() => {
    if (prevBalance !== null && balance !== null && balance !== prevBalance) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 300);
      return () => clearTimeout(timer);
    }
    setPrevBalance(balance);
  }, [balance, prevBalance]);

  const displayBalance = balance ?? 0;
  const progressPercentage = Math.min((displayBalance / freeTierLimit) * 100, 100);
  const isLowCredits = displayBalance > 0 && displayBalance <= 1;

  return (
    <div className="glass-card rounded-2xl p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Balance Display */}
        <div className="flex items-center gap-4">
          <div 
            className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center ${isPulsing ? 'pulse-balance' : ''}`}
            style={{ transform: 'translateZ(0)' }}
          >
            <Coins className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Available Credits</p>
            <div className="flex items-center gap-2">
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : (
                <>
                  <span 
                    className={`text-3xl font-bold text-foreground ${isPulsing ? 'pulse-balance' : ''}`}
                  >
                    {displayBalance}
                  </span>
                  {displayBalance <= freeTierLimit && (
                    <span className="text-sm text-muted-foreground">/ {freeTierLimit}</span>
                  )}
                </>
              )}
              {isColdStart && (
                <span className="text-xs text-accent">Loading...</span>
              )}
            </div>
            
            {/* Progress Bar - CSS only, no framer-motion */}
            {displayBalance <= freeTierLimit && (
              <div className="mt-2 w-full max-w-[160px]">
                <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      displayBalance === 0 
                        ? 'bg-destructive' 
                        : isLowCredits 
                          ? 'bg-amber-500' 
                          : 'bg-gradient-to-r from-primary to-accent'
                    }`}
                    style={{ width: `${progressPercentage}%`, transform: 'translateZ(0)' }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {displayBalance === 0 
                    ? 'No credits remaining' 
                    : `${displayBalance} credit${displayBalance !== 1 ? 's' : ''} remaining`
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/50 hover:bg-secondary/70 border border-border text-foreground text-sm font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={onShowRecovery}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/50 hover:bg-secondary/70 border border-border text-foreground text-sm font-medium transition-colors"
          >
            <Key className="w-4 h-4" />
            <span className="hidden sm:inline">Recover</span>
          </button>

          <button
            onClick={onTopUp}
            className="flex-1 sm:flex-none glow-button flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-primary-foreground font-medium"
          >
            <Zap className="w-4 h-4" />
            <span>Top Up</span>
          </button>
        </div>
      </div>

      {/* User ID display */}
      <div className="mt-3 pt-3 border-t border-border/30">
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          <span>Your ID:</span>
          <code className="px-2 py-1 rounded-lg bg-secondary/50 border border-border text-foreground font-mono text-xs">
            {userId || 'Loading...'}
          </code>
        </p>
      </div>
    </div>
  );
});

BalanceHeader.displayName = 'BalanceHeader';
