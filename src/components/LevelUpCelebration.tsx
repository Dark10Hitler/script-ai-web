import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, Star } from 'lucide-react';
import { useEffect } from 'react';

interface LevelUpCelebrationProps {
  isVisible: boolean;
  level: number;
  rank: string;
  onDismiss: () => void;
}

export const LevelUpCelebration = ({ isVisible, level, rank, onDismiss }: LevelUpCelebrationProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onDismiss, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          {/* Confetti particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10%',
                  backgroundColor: ['#00d4ff', '#ff6b6b', '#ffd93d', '#6bcb77', '#9b59b6'][i % 5],
                }}
                animate={{
                  y: ['0vh', '110vh'],
                  x: [0, (Math.random() - 0.5) * 200],
                  rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
                  scale: [1, 0.5],
                }}
                transition={{
                  duration: 2.5 + Math.random() * 1.5,
                  delay: Math.random() * 0.5,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>

          {/* Central celebration card */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="relative pointer-events-auto"
            onClick={onDismiss}
          >
            {/* Glow background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/50 to-accent/50 rounded-3xl blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <div className="relative glass-card-elevated border-2 border-primary/50 rounded-3xl p-8 md:p-12 text-center">
              {/* Stars decoration */}
              <motion.div
                className="absolute -top-4 -left-4"
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              </motion.div>
              <motion.div
                className="absolute -top-4 -right-4"
                animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              </motion.div>

              {/* Trophy icon */}
              <motion.div
                className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-yellow-500/30 to-orange-500/30 flex items-center justify-center border border-yellow-500/40"
                animate={{
                  boxShadow: [
                    '0 0 30px rgba(234, 179, 8, 0.3)',
                    '0 0 60px rgba(234, 179, 8, 0.5)',
                    '0 0 30px rgba(234, 179, 8, 0.3)',
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Trophy className="w-10 h-10 text-yellow-400" />
              </motion.div>

              {/* Title */}
              <motion.h2
                className="text-2xl md:text-3xl font-bold text-foreground mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-primary neon-text">LEVEL UP!</span>
              </motion.h2>

              {/* Level display */}
              <motion.div
                className="flex items-center justify-center gap-3 mb-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  {level}
                </span>
              </motion.div>

              {/* Rank */}
              <motion.p
                className="text-lg text-accent font-semibold mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                You are now a <span className="text-primary">{rank}</span>
              </motion.p>

              {/* Sparkles */}
              <motion.div
                className="flex items-center justify-center gap-2 text-muted-foreground"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">Keep creating to unlock more!</span>
                <Sparkles className="w-4 h-4" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
