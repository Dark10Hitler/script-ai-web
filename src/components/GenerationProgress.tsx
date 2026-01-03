import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface GenerationProgressProps {
  isColdStart?: boolean;
}

export const GenerationProgress = ({ isColdStart }: GenerationProgressProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 mt-6"
    >
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center"
          animate={{
            boxShadow: [
              '0 0 20px hsl(185 100% 50% / 0.2)',
              '0 0 40px hsl(185 100% 50% / 0.4)',
              '0 0 20px hsl(185 100% 50% / 0.2)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-6 h-6 text-primary" />
        </motion.div>
        <div className="flex-1">
          <p className="text-foreground font-medium">
            {isColdStart 
              ? 'Waking up AI server...'
              : 'Claude 3.5 Sonnet is crafting your masterpiece...'}
          </p>
          <p className="text-sm text-muted-foreground">
            {isColdStart 
              ? 'Cold start detected. This takes ~30 seconds.'
              : 'This usually takes 10-20 seconds'}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: isColdStart ? 30 : 15, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
};
