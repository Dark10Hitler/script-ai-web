import { motion } from 'framer-motion';
import { Coins, RefreshCw, ExternalLink } from 'lucide-react';

interface BalanceHeaderProps {
  balance: number | null;
  isLoading: boolean;
  userId: string;
  onRefresh: () => void;
}

export const BalanceHeader = ({ balance, isLoading, userId, onRefresh }: BalanceHeaderProps) => {
  const telegramLink = `https://t.me/EducationGPT_AIBot?start=${userId}`;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-4 mb-6"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Coins className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Available Credits</p>
            <p className="text-2xl font-semibold text-foreground">
              {isLoading ? (
                <span className="inline-block w-12 h-6 bg-muted/50 rounded animate-pulse" />
              ) : (
                balance ?? 0
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">Refresh</span>
          </button>

          {balance === 0 && !isLoading && (
            <motion.a
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-button flex items-center gap-2 px-4 py-2 rounded-xl text-primary-foreground font-medium transition-all duration-200"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm">Top Up</span>
            </motion.a>
          )}
        </div>
      </div>
    </motion.header>
  );
};
