import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface GenerationProgressProps {
  isColdStart?: boolean;
}

const PROGRESS_MESSAGES = [
  'Connecting to Claude...',
  'Brainstorming ideas...',
  'Writing scenes...',
  'Adding dramatic flair...',
  'Polishing the script...',
  'Almost there...',
];

const COLD_START_MESSAGES = [
  'Waking up AI server...',
  'Server is starting...',
  'Initializing Claude...',
  'Almost ready...',
];

export const GenerationProgress = ({ isColdStart }: GenerationProgressProps) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = isColdStart ? COLD_START_MESSAGES : PROGRESS_MESSAGES;
  
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [messages.length]);
  
  const currentMessage = messages[messageIndex];
  
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
          <AnimatePresence mode="wait">
            <motion.p
              key={currentMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-foreground font-medium"
            >
              {currentMessage}
            </motion.p>
          </AnimatePresence>
          <p className="text-sm text-muted-foreground">
            {isColdStart 
              ? 'Cold start detected. This takes ~30 seconds.'
              : 'This usually takes 10-30 seconds'}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: isColdStart ? 30 : 20, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
};
