import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, AlertCircle } from 'lucide-react';

const isInAppBrowser = (): boolean => {
  const ua = navigator.userAgent || navigator.vendor || '';
  return /FBAN|FBAV|Instagram|TikTok|Musical|BytedanceWebview|Snapchat/i.test(ua);
};

export const BrowserWarning = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('browser_warning_dismissed');
    if (!dismissed && isInAppBrowser()) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('browser_warning_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && !isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-0 left-0 right-0 z-50 p-3 bg-gradient-to-r from-primary/20 to-accent/20 border-b border-primary/30 backdrop-blur-sm"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-primary shrink-0" />
              <p className="text-sm text-foreground">
                <span className="font-medium">Using TikTok browser?</span>{' '}
                <span className="text-muted-foreground">
                  For secure payments, tap "..." and "Open in Browser"
                </span>
              </p>
            </div>
            
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors shrink-0"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
