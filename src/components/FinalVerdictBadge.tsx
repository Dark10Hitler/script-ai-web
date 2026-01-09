import { motion } from 'framer-motion';
import { CheckCircle2, Infinity as InfinityIcon, Shield, Sparkles } from 'lucide-react';

type VerdictType = 'tiktok' | 'reels' | 'shorts' | 'universal';

interface FinalVerdictBadgeProps {
  type?: VerdictType;
  loopTechnique?: boolean;
}

const verdictConfig: Record<VerdictType, { label: string; color: string; gradient: string }> = {
  tiktok: {
    label: 'VERIFIED FOR TIKTOK ALGORITHM',
    color: 'text-cyan-400',
    gradient: 'from-cyan-500/20 via-pink-500/10 to-cyan-500/20',
  },
  reels: {
    label: 'REELS OPTIMIZED',
    color: 'text-pink-400',
    gradient: 'from-pink-500/20 via-purple-500/10 to-pink-500/20',
  },
  shorts: {
    label: 'YOUTUBE SHORTS READY',
    color: 'text-red-400',
    gradient: 'from-red-500/20 via-orange-500/10 to-red-500/20',
  },
  universal: {
    label: 'MULTI-PLATFORM OPTIMIZED',
    color: 'text-primary',
    gradient: 'from-primary/20 via-accent/10 to-primary/20',
  },
};

export const FinalVerdictBadge = ({ 
  type = 'tiktok', 
  loopTechnique = true 
}: FinalVerdictBadgeProps) => {
  const config = verdictConfig[type];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, type: 'spring', damping: 15 }}
      className="mt-10 mb-8"
    >
      <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-r ${config.gradient} border border-border/30`}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-30">
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.3) 0%, transparent 50%),
                               radial-gradient(circle at 80% 50%, hsl(var(--accent) / 0.3) 0%, transparent 50%)`,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        />

        <div className="relative p-8 text-center">
          {/* Stamp/Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.7, type: 'spring', damping: 10 }}
            className="inline-block mb-6"
          >
            <div 
              className="relative px-8 py-4 rounded-2xl border-4 border-dashed border-accent"
              style={{
                transform: 'rotate(-2deg)',
              }}
            >
              {/* Inner stamp */}
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Shield className={`w-8 h-8 ${config.color}`} />
                </motion.div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${config.color}`} />
                    <span className={`text-xl md:text-2xl font-black tracking-tight ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Corner decorations */}
              <Sparkles className={`absolute -top-2 -left-2 w-5 h-5 ${config.color}`} />
              <Sparkles className={`absolute -top-2 -right-2 w-5 h-5 ${config.color}`} />
              <Sparkles className={`absolute -bottom-2 -left-2 w-5 h-5 ${config.color}`} />
              <Sparkles className={`absolute -bottom-2 -right-2 w-5 h-5 ${config.color}`} />
            </div>
          </motion.div>

          {/* Loop Technique Notice */}
          {loopTechnique && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="glass-card inline-flex items-center gap-3 px-6 py-3 rounded-xl border border-primary/20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <InfinityIcon className="w-6 h-6 text-primary" />
              </motion.div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">Circular Loop Technique</p>
                <p className="text-xs text-muted-foreground">
                  The end connects perfectly back to the beginning for <span className="text-primary font-medium">infinite views</span>
                </p>
              </div>
            </motion.div>
          )}

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/30"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">98%</p>
              <p className="text-xs text-muted-foreground">Algorithm Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">A+</p>
              <p className="text-xs text-muted-foreground">Hook Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">∞</p>
              <p className="text-xs text-muted-foreground">Loop Potential</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
