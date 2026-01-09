import { motion } from 'framer-motion';
import { TrendingUp, Zap, Eye, Brain } from 'lucide-react';

interface RetentionPeak {
  position: number; // 0-100 percentage
  label: string;
  type: 'dopamine' | 'pattern' | 'hook';
}

interface RetentionHeatmapProps {
  peaks?: RetentionPeak[];
}

const defaultPeaks: RetentionPeak[] = [
  { position: 8, label: 'High-Retention Hook', type: 'hook' },
  { position: 35, label: 'Pattern Interrupt', type: 'pattern' },
  { position: 62, label: 'Dopamine Spike', type: 'dopamine' },
  { position: 85, label: 'Pattern Interrupt', type: 'pattern' },
];

const peakIcons = {
  dopamine: Zap,
  pattern: Brain,
  hook: Eye,
};

const peakColors = {
  dopamine: 'text-yellow-400',
  pattern: 'text-primary',
  hook: 'text-accent',
};

export const RetentionHeatmap = ({ peaks = defaultPeaks }: RetentionHeatmapProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-8"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/30 to-red-500/30 flex items-center justify-center border border-green-500/20">
          <TrendingUp className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground tracking-tight">Predicted Audience Attention</h3>
          <p className="text-xs text-muted-foreground">AI-analyzed retention curve based on psychological triggers</p>
        </div>
      </div>

      {/* Heatmap Container */}
      <div className="glass-card rounded-2xl p-6 border border-border/30">
        {/* Timeline Labels */}
        <div className="flex justify-between text-xs text-muted-foreground mb-2 px-1">
          <span>0:00</span>
          <span>Opening</span>
          <span>Mid-Point</span>
          <span>Climax</span>
          <span>End</span>
        </div>

        {/* The Heatmap Bar */}
        <div className="relative h-16 rounded-xl overflow-hidden">
          {/* Gradient Background */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 origin-left"
            style={{
              background: `linear-gradient(90deg, 
                hsl(142, 76%, 36%) 0%, 
                hsl(142, 76%, 46%) 10%,
                hsl(84, 85%, 45%) 25%,
                hsl(48, 96%, 53%) 40%,
                hsl(84, 85%, 45%) 50%,
                hsl(142, 76%, 46%) 60%,
                hsl(48, 96%, 53%) 70%,
                hsl(84, 85%, 45%) 80%,
                hsl(142, 76%, 46%) 90%,
                hsl(0, 84%, 60%) 100%
              )`,
            }}
          />

          {/* Animated Pulse Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          {/* Peak Pins */}
          {peaks.map((peak, index) => {
            const Icon = peakIcons[peak.type];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.15 }}
                className="absolute top-0 -translate-x-1/2 group cursor-pointer"
                style={{ left: `${peak.position}%` }}
              >
                {/* Pin Line */}
                <div className="w-0.5 h-16 bg-background/80" />
                
                {/* Pin Head */}
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className={`absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-background border-2 border-current ${peakColors[peak.type]} flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-3 h-3" />
                </motion.div>

                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="glass-card px-3 py-1.5 rounded-lg border border-border/50 whitespace-nowrap">
                    <span className={`text-xs font-semibold ${peakColors[peak.type]}`}>
                      [{peak.label}]
                    </span>
                  </div>
                  {/* Arrow */}
                  <div className="w-2 h-2 bg-secondary border-r border-b border-border/50 transform rotate-45 mx-auto -mt-1" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border/30">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground">High Retention</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-xs text-muted-foreground">Peak Engagement</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs text-muted-foreground">Drop-off Risk</span>
          </div>
        </div>

        {/* Insight Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20"
        >
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Psychology Analysis</p>
              <p className="text-xs text-muted-foreground mt-1">
                This script leverages <span className="text-primary font-medium">4 proven attention triggers</span> strategically 
                placed to maintain viewer engagement. Expected retention: <span className="text-green-400 font-bold">78%</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
