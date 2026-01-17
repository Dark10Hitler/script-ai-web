import { useState, useEffect, memo } from 'react';
import { Brain, Sparkles, Zap, TrendingUp } from 'lucide-react';

interface NeuralProgressProps {
  isColdStart?: boolean;
}

const NEURAL_STAGES = [
  { icon: Brain, label: 'Analyzing Trends...', color: 'primary' },
  { icon: Sparkles, label: 'Simulating Audience Retention...', color: 'accent' },
  { icon: Zap, label: 'Generating Viral Hooks...', color: 'primary' },
  { icon: TrendingUp, label: 'Directing Scenes...', color: 'accent' },
  { icon: Brain, label: 'Polishing Final Output...', color: 'primary' },
];

const COLD_START_STAGES = [
  { icon: Brain, label: 'Waking up AI server...', color: 'primary' },
  { icon: Zap, label: 'Initializing neural networks...', color: 'accent' },
  { icon: Sparkles, label: 'Server warming up (~30s)...', color: 'primary' },
];

export const NeuralProgress = memo(({ isColdStart }: NeuralProgressProps) => {
  const [stageIndex, setStageIndex] = useState(0);
  const stages = isColdStart ? COLD_START_STAGES : NEURAL_STAGES;
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % stages.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [stages.length]);
  
  const currentStage = stages[stageIndex];
  const Icon = currentStage.icon;

  return (
    <div
      className="glass-card-elevated rounded-2xl p-6 mt-6 relative"
      style={{ transform: 'translateZ(0)' }}
    >
      <div className="relative z-10">
        {/* Icon and Status */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, hsl(var(--${currentStage.color}) / 0.2), hsl(var(--${currentStage.color}) / 0.1))`,
            }}
          >
            <Icon className={`w-7 h-7 ${currentStage.color === 'primary' ? 'text-primary' : 'text-accent'}`} />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">
              {currentStage.label}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isColdStart 
                ? 'Cold start detected. Initial request takes longer.'
                : 'Neural processing in progress. Please wait...'}
            </p>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex gap-2 mb-4">
          {stages.map((_, idx) => (
            <div
              key={idx}
              className="h-1.5 flex-1 rounded-full overflow-hidden bg-muted/50"
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: idx <= stageIndex ? '100%' : '0%',
                  background: idx <= stageIndex 
                    ? 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))'
                    : 'transparent',
                }}
              />
            </div>
          ))}
        </div>

        {/* Main Progress Bar */}
        <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent animate-pulse"
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
});

NeuralProgress.displayName = 'NeuralProgress';
