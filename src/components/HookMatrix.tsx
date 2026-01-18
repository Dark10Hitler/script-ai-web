import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Sparkles, Brain, Target, Flame, Eye, Diamond, Clock } from 'lucide-react';
import { HookVariant } from '@/lib/aiResponseParser';

// Re-export for backward compatibility
export type { HookVariant };

interface HookMatrixProps {
  hooks: HookVariant[];
}

const typeConfig: Record<string, { label: string; color: string; bgGlow: string; icon: typeof Zap }> = {
  aggressive: {
    label: 'Aggressive',
    color: 'from-red-500 to-orange-500',
    bgGlow: 'rgba(239, 68, 68, 0.3)',
    icon: Zap,
  },
  intriguing: {
    label: 'Intriguing',
    color: 'from-primary to-violet-400',
    bgGlow: 'rgba(139, 92, 246, 0.3)',
    icon: Brain,
  },
  visual: {
    label: 'Visual',
    color: 'from-accent to-emerald-400',
    bgGlow: 'rgba(6, 182, 212, 0.3)',
    icon: Target,
  },
  fear: {
    label: 'Fear',
    color: 'from-red-600 to-red-400',
    bgGlow: 'rgba(220, 38, 38, 0.3)',
    icon: Zap,
  },
  curiosity: {
    label: 'Curiosity',
    color: 'from-yellow-500 to-amber-400',
    bgGlow: 'rgba(245, 158, 11, 0.3)',
    icon: Eye,
  },
  controversy: {
    label: 'Controversy',
    color: 'from-orange-500 to-red-400',
    bgGlow: 'rgba(249, 115, 22, 0.3)',
    icon: Flame,
  },
  value: {
    label: 'Value',
    color: 'from-emerald-500 to-teal-400',
    bgGlow: 'rgba(16, 185, 129, 0.3)',
    icon: Diamond,
  },
  urgency: {
    label: 'Urgency',
    color: 'from-purple-500 to-violet-400',
    bgGlow: 'rgba(139, 92, 246, 0.3)',
    icon: Clock,
  },
};

const RetentionMeter = ({ score, delay = 0, color }: { score: number; delay?: number; color: string }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1800;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart for smoother end
        setAnimatedScore(Math.round(score * eased));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [score, delay]);

  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;
  
  // Determine color based on score
  const getScoreColor = () => {
    if (animatedScore >= 85) return '#10B981'; // emerald
    if (animatedScore >= 70) return '#06B6D4'; // cyan
    return '#8B5CF6'; // violet
  };

  return (
    <div className="relative w-28 h-28 mx-auto">
      {/* Animated glow */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ delay: delay / 1000 + 0.5, duration: 0.5 }}
        className="absolute inset-0 rounded-full blur-2xl"
        style={{ background: getScoreColor() }}
      />
      
      {/* SVG Meter */}
      <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="4"
          opacity={0.3}
        />
        {/* Progress circle with gradient */}
        <defs>
          <linearGradient id={`meter-gradient-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--accent))" />
            <stop offset="50%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke={`url(#meter-gradient-${score})`}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.8, delay: delay / 1000, ease: "easeOut" }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay / 1000 + 0.3, type: "spring" }}
          className="text-3xl font-bold text-foreground tabular-nums"
        >
          {animatedScore}%
        </motion.span>
        <span className="text-[9px] text-muted-foreground uppercase tracking-[0.15em] mt-0.5">Retention</span>
      </div>
    </div>
  );
};

export const HookMatrix = ({ hooks }: HookMatrixProps) => {
  if (!hooks || hooks.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center border border-primary/20">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground tracking-tight">Viral Hook Matrix</h3>
          <p className="text-sm text-muted-foreground">AI-optimized opening hooks with retention analysis</p>
        </div>
      </motion.div>

      {/* Hook Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {hooks.map((hook, index) => {
          const config = typeConfig[hook.type] || typeConfig.intriguing;
          const Icon = config.icon;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.15, duration: 0.4 }}
              whileHover={{ 
                scale: 1.02, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Gradient border effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
              
              {/* Card content */}
              <div className="relative glass-card-elevated rounded-2xl p-6 h-full border border-border/50 group-hover:border-primary/40 transition-all duration-300">
                {/* Type badge */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${config.color} mb-4`}>
                  <Icon className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-semibold text-white uppercase tracking-wide">{config.label}</span>
                </div>

                {/* Title */}
                <h4 className="text-lg font-semibold text-foreground mb-3 line-clamp-1">
                  {hook.title}
                </h4>

                {/* Retention Meter */}
                <div className="my-5">
                  <RetentionMeter 
                    score={hook.retentionForecast} 
                    delay={index * 200 + 300}
                    color={config.bgGlow}
                  />
                </div>

                {/* Hook Text */}
                <div className="mb-4 p-3 rounded-xl bg-background/50 border border-border/30">
                  <p className="text-sm text-foreground/90 leading-relaxed italic">
                    "{hook.hookText}"
                  </p>
                </div>

                {/* Psychology Note */}
                <div className="mt-auto pt-3 border-t border-border/30">
                  <div className="flex items-start gap-2">
                    <Brain className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {hook.mechanism}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};
