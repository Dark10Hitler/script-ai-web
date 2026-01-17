import { memo, useEffect } from 'react';
import { Trophy, Sparkles, Star } from 'lucide-react';

interface LevelUpCelebrationProps {
  isVisible: boolean;
  level: number;
  rank: string;
  onDismiss: () => void;
}

export const LevelUpCelebration = memo(({ isVisible, level, rank, onDismiss }: LevelUpCelebrationProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onDismiss, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80"
      onClick={onDismiss}
      style={{ transform: 'translateZ(0)' }}
    >
      <div className="relative glass-card-elevated border-2 border-primary/50 rounded-3xl p-8 md:p-12 text-center">
        {/* Stars decoration */}
        <div className="absolute -top-4 -left-4">
          <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
        </div>
        <div className="absolute -top-4 -right-4">
          <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
        </div>

        {/* Trophy icon */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-yellow-500/30 to-orange-500/30 flex items-center justify-center border border-yellow-500/40">
          <Trophy className="w-10 h-10 text-yellow-400" />
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          <span className="text-primary">LEVEL UP!</span>
        </h2>

        {/* Level display */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            {level}
          </span>
        </div>

        {/* Rank */}
        <p className="text-lg text-accent font-semibold mb-2">
          You are now a <span className="text-primary">{rank}</span>
        </p>

        {/* Sparkles */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm">Keep creating to unlock more!</span>
          <Sparkles className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
});

LevelUpCelebration.displayName = 'LevelUpCelebration';
