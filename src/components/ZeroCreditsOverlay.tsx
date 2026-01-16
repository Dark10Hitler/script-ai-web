import { motion } from 'framer-motion';
import { Sparkles, Rocket, ExternalLink, Coins } from 'lucide-react';
import { getPaymentUrl } from '@/lib/apiConfig';

interface ZeroCreditsOverlayProps {
  userId: string;
}

export const ZeroCreditsOverlay = ({ userId }: ZeroCreditsOverlayProps) => {
  const handleGetCredits = () => {
    window.open(getPaymentUrl(userId), '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-20 backdrop-blur-md bg-background/80 rounded-2xl flex items-center justify-center p-6"
    >
      <div className="text-center max-w-md">
        {/* Animated Icon */}
        <motion.div
          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
          animate={{
            boxShadow: [
              '0 0 0 0 hsl(var(--primary) / 0)',
              '0 0 30px 10px hsl(var(--primary) / 0.2)',
              '0 0 0 0 hsl(var(--primary) / 0)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Coins className="w-10 h-10 text-primary" />
        </motion.div>

        {/* Message */}
        <h3 className="text-xl font-bold text-foreground mb-2">
          Free Limit Reached
        </h3>
        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
          Top up your balance in our Telegram Bot to continue creating viral scripts.
        </p>

        {/* Features List */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>AI-powered script generation</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Rocket className="w-4 h-4 text-primary" />
            <span>Instant viral hooks & storyboards</span>
          </div>
        </div>

        {/* CTA Button */}
        <motion.button
          onClick={handleGetCredits}
          className="glow-button w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-primary-foreground font-semibold"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>Get More Credits</span>
          <ExternalLink className="w-4 h-4" />
        </motion.button>

        <p className="text-xs text-muted-foreground mt-4">
          Secure payment via Telegram Bot
        </p>
      </div>
    </motion.div>
  );
};