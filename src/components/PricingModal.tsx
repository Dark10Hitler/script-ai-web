import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Star, Crown, ExternalLink, RefreshCw, Shield, Timer, Sparkles, Check, Loader2 } from 'lucide-react';
import { useBalanceContext } from '@/contexts/BalanceContext';
import { getPaymentUrl } from '@/lib/apiConfig';
import { toast } from 'sonner';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 47, seconds: 33 });
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 font-mono">
        <span className="bg-destructive/20 text-destructive px-2 py-1 rounded font-bold">
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className="text-destructive">:</span>
        <span className="bg-destructive/20 text-destructive px-2 py-1 rounded font-bold">
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className="text-destructive">:</span>
        <span className="bg-destructive/20 text-destructive px-2 py-1 rounded font-bold">
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

const ShimmerEffect = () => (
  <motion.div
    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
    animate={{ translateX: ['100%', '-100%'] }}
    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
  />
);

const pricingTiers = [
  {
    name: 'The Starter',
    subtitle: 'Perfect for testing the magic',
    price: '$2',
    originalPrice: '$4',
    savings: '$2',
    savingsPercent: '50%',
    credits: 10,
    perScript: '20',
    icon: Zap,
    popular: false,
    features: [
      '10 Pro AI Scripts',
      'Viral Hook Matrix',
      "Director's Storyboard",
    ],
    gradient: 'from-cyan-500/20 to-blue-500/20',
    borderColor: 'border-cyan-500/30',
    iconBg: 'bg-cyan-500/20',
    iconColor: 'text-cyan-400',
  },
  {
    name: 'The Creator',
    subtitle: 'MOST POPULAR',
    price: '$4',
    originalPrice: '$8',
    savings: '$4',
    savingsPercent: '50%',
    credits: 30,
    perScript: '13',
    icon: Star,
    popular: true,
    features: [
      'Everything in Starter PLUS:',
      '30 High-Retention Scripts',
      'AI Cover Art Generator (3/script)',
      'PDF Production Plans',
    ],
    gradient: 'from-primary/30 to-violet-500/30',
    borderColor: 'border-primary/50',
    iconBg: 'bg-primary/20',
    iconColor: 'text-primary',
  },
  {
    name: 'The Agency/Pro',
    subtitle: 'BEST VALUE - BEST SELLER',
    price: '$10',
    originalPrice: '$25',
    savings: '$15',
    savingsPercent: '60%',
    credits: 100,
    perScript: '10',
    icon: Crown,
    popular: false,
    bestValue: true,
    features: [
      'Ultimate Access:',
      '100 Unlimited AI Scripts',
      'Priority AI Processing',
      'Full Sound & Voice Direction',
      'Commercial Usage License',
    ],
    gradient: 'from-amber-500/20 to-orange-500/20',
    borderColor: 'border-amber-500/40',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
  },
];

export const PricingModal = ({ isOpen, onClose, userId }: PricingModalProps) => {
  const { fetchBalance, isLoading } = useBalanceContext();

  const handleBuy = (tier: typeof pricingTiers[0]) => {
    toast.info(
      "Please wait a moment while we generate your invoice. It usually takes about a minute. Thank you for your patience! ⏳✨",
      { duration: 8000 }
    );
    window.open(getPaymentUrl(userId), '_blank');
  };

  const handleCheckPayment = async () => {
    await fetchBalance();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-background/95 backdrop-blur-xl" 
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl glass-card-elevated rounded-3xl p-6 md:p-8 overflow-hidden my-8"
          >
            {/* Decorative gradient orbs */}
            <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-accent/20 blur-3xl" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary/80 transition-colors z-10"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="relative z-10">
              {/* Urgency Banner */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-3 mb-6 p-3 rounded-xl bg-destructive/10 border border-destructive/30"
              >
                <Timer className="w-5 h-5 text-destructive animate-pulse" />
                <span className="text-sm font-semibold text-destructive">FLASH SALE: 60% OFF ENDS IN</span>
                <CountdownTimer />
              </motion.div>

              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Choose Your <span className="text-primary neon-text">Content Empire</span> Plan
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Join 10,000+ creators dominating the algorithm. One-time payment, lifetime edge.
                </p>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                {pricingTiers.map((tier, index) => (
                  <motion.div
                    key={tier.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className={`relative p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 cursor-pointer group ${
                      tier.popular
                        ? `${tier.borderColor} bg-gradient-to-br ${tier.gradient} scale-[1.02] shadow-lg shadow-primary/20`
                        : tier.bestValue
                        ? `${tier.borderColor} bg-gradient-to-br ${tier.gradient}`
                        : `border-border/50 bg-secondary/10 hover:bg-secondary/20`
                    }`}
                    onClick={() => handleBuy(tier)}
                  >
                    {/* Badges */}
                    {tier.popular && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: "spring" }}
                        className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold shadow-lg shadow-primary/30 overflow-hidden"
                      >
                        <ShimmerEffect />
                        <span className="relative z-10">⭐ MOST POPULAR</span>
                      </motion.div>
                    )}
                    {tier.bestValue && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-lg overflow-hidden"
                      >
                        <ShimmerEffect />
                        <span className="relative z-10">👑 BEST VALUE</span>
                      </motion.div>
                    )}

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4 mt-2">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tier.iconBg}`}>
                        <tier.icon className={`w-6 h-6 ${tier.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground text-lg">{tier.name}</h3>
                        <p className="text-xs text-muted-foreground">{tier.subtitle}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-foreground">{tier.price}</span>
                        <span className="text-lg text-muted-foreground line-through">{tier.originalPrice}</span>
                      </div>
                      <span className="text-muted-foreground text-sm">/ {tier.credits} scripts</span>
                    </div>

                    {/* Savings Badge */}
                    <motion.div 
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-emerald/20 text-neon-emerald text-xs font-semibold mb-3 overflow-hidden relative"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ShimmerEffect />
                      <span className="relative z-10">YOU SAVE {tier.savings} ({tier.savingsPercent} OFF)</span>
                    </motion.div>

                    {/* Per script cost */}
                    <p className="text-sm text-muted-foreground mb-4">
                      Only <span className="text-foreground font-bold">${tier.perScript}¢</span> per script
                      {tier.bestValue && <span className="text-neon-emerald font-medium"> — Absolute Lowest!</span>}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 mb-5">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${tier.popular ? 'text-primary' : tier.bestValue ? 'text-amber-400' : 'text-accent'}`} />
                          <span className="text-foreground/90">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuy(tier);
                      }}
                      className={`w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                        tier.popular
                          ? 'glow-button text-primary-foreground animate-pulse-glow'
                          : tier.bestValue
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90'
                          : 'bg-secondary hover:bg-secondary/80 text-foreground'
                      }`}
                    >
                      <span>Buy Now</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Comparison text for Pro plan */}
              <p className="text-center text-sm text-muted-foreground mb-6">
                That's less than the price of <span className="text-foreground font-medium">2 coffees</span> for a month of professional content.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/30 border border-border/30">
                  <Shield className="w-4 h-4 text-neon-emerald" />
                  <span className="text-xs text-foreground font-medium">Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/30 border border-border/30">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-xs text-foreground font-medium">Instant Delivery to Telegram</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/30 border border-border/30">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs text-foreground font-medium">Professional Grade AI</span>
                </div>
              </div>

              {/* Check Payment Button */}
              <div className="text-center">
                <button
                  onClick={handleCheckPayment}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-secondary/50 hover:bg-secondary/70 text-foreground font-medium transition-all disabled:opacity-50 border border-border/50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Check Payment Status</span>
                </button>
                <p className="text-xs text-muted-foreground mt-3">
                  Click after completing payment in Telegram
                </p>
              </div>

              {/* Footer note */}
              <p className="text-center text-xs text-muted-foreground mt-6">
                Used by creators on TikTok, Reels, and Shorts.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
