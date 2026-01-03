import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, AlertTriangle } from 'lucide-react';

interface RecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecover: (id: string) => void;
}

export const RecoveryModal = ({ isOpen, onClose, onRecover }: RecoveryModalProps) => {
  const [recoveryId, setRecoveryId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recoveryId.trim()) {
      onRecover(recoveryId.trim());
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md glass-card rounded-2xl p-6 overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Key className="w-8 h-8 text-primary" />
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-foreground mb-2">
                Recover Your Account
              </h2>
              <p className="text-sm text-muted-foreground">
                Enter your account ID to restore your credits and history
              </p>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 mb-6">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                If you don't have your ID, a new account will be created with 10 free credits.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={recoveryId}
                onChange={(e) => setRecoveryId(e.target.value)}
                placeholder="scen_abc123..."
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-secondary/50 hover:bg-secondary/70 text-foreground font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!recoveryId.trim()}
                  className="flex-1 py-3 rounded-xl glow-button text-primary-foreground font-medium transition-all disabled:opacity-50"
                >
                  Recover
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
