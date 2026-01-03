import { motion } from 'framer-motion';
import { Loader2, ServerCog } from 'lucide-react';

export const ColdStartNotice = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20"
    >
      <div className="relative">
        <ServerCog className="w-5 h-5 text-primary" />
        <motion.div
          className="absolute inset-0 bg-primary/30 rounded-full blur-md"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">AI server is waking up...</p>
        <p className="text-xs text-muted-foreground">This may take ~30 seconds. Please wait.</p>
      </div>
      <Loader2 className="w-4 h-4 text-primary animate-spin" />
    </motion.div>
  );
};
