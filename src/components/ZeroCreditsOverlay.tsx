import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Rocket, Coins, Zap, Crown, Star } from 'lucide-react';
import { PricingModal } from './PricingModal';

interface ZeroCreditsOverlayProps {
  userId: string;
}

export const ZeroCreditsOverlay = ({ userId }: ZeroCreditsOverlayProps) => {
  const [showPricing, setShowPricing] = useState(false);

  return (
    <>
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
            Unlock unlimited viral scripts with our premium packs. Choose the plan that fits your content empire!
          </p>

          {/* Mini Pricing Preview */}
          <div className="flex justify-center gap-3 mb-6">
            <motion.div 
              className="flex flex-col items-center p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30"
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="w-5 h-5 text-cyan-400 mb-1" />
              <span className="text-xs text-foreground font-bold">$2</span>
              <span className="text-xs text-muted-foreground">10 scripts</span>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center p-3 rounded-xl bg-violet-500/20 border border-violet-500/50 relative"
              whileHover={{ scale: 1.05 }}
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(139, 92, 246, 0)',
                  '0 0 15px 3px rgba(139, 92, 246, 0.3)',
                  '0 0 0 0 rgba(139, 92, 246, 0)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-violet-500 text-white text-[10px] font-bold">
                🔥 HOT
              </div>
              <Star className="w-5 h-5 text-violet-400 mb-1" />
              <span className="text-xs text-foreground font-bold">$4</span>
              <span className="text-xs text-muted-foreground">30 scripts</span>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/30"
              whileHover={{ scale: 1.05 }}
            >
              <Crown className="w-5 h-5 text-amber-400 mb-1" />
              <span className="text-xs text-foreground font-bold">$10</span>
              <span className="text-xs text-muted-foreground">100 scripts</span>
            </motion.div>
          </div>

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
            onClick={() => setShowPricing(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white font-bold"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
              boxShadow: '0 0 25px rgba(139, 92, 246, 0.4)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Coins className="w-5 h-5" />
            <span>View Premium Plans</span>
          </motion.button>

          <p className="text-xs text-muted-foreground mt-4">
            🔐 Secure crypto payment via Telegram
          </p>
        </div>
      </motion.div>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        userId={userId}
      />
    </>
  );
};