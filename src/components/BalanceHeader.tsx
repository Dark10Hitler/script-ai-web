import { motion } from 'framer-motion';
import { Coins, RefreshCw, Zap, Key, Loader2 } from 'lucide-react';
import { useBalanceContext } from '@/contexts/BalanceContext';

interface BalanceHeaderProps {
  userId: string;
  onRefresh: () => void;
  onTopUp: () => void;
  onShowRecovery: () => void;
}

export const BalanceHeader = ({ userId, onRefresh, onTopUp, onShowRecovery }: BalanceHeaderProps) => {
  const { balance, isLoading, isColdStart } = useBalanceContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-4 mb-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Balance Display */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Coins className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Available Credits</p>
            <div className="flex items-center gap-2">
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : (
                <span className="text-2xl font-bold text-foreground">
                  {balance ?? 0}
                </span>
              )}
              {isColdStart && (
                <span className="text-xs text-primary animate-pulse">Loading...</span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/50 hover:bg-secondary/70 text-foreground text-sm font-medium transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={onShowRecovery}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/50 hover:bg-secondary/70 text-foreground text-sm font-medium transition-all"
          >
            <Key className="w-4 h-4" />
            <span className="hidden sm:inline">Recover</span>
          </button>

          <button
            onClick={onTopUp}
            className="flex-1 sm:flex-none glow-button flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-primary-foreground font-medium transition-all"
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
          <code className="px-2 py-1 rounded bg-secondary/50 text-foreground font-mono text-xs">
            {userId || 'Loading...'}
          </code>
        </p>
      </div>
    </motion.div>
  );
};
