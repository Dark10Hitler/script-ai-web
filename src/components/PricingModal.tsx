import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Star, Crown, ExternalLink, RefreshCw, Shield, Timer, Sparkles, Check, Bot, Lock, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getPaymentUrl } from '@/lib/apiConfig';
import { toast } from 'sonner';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

interface SelectedTier {
  name: string;
  price: string;
  credits: number;
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
        <span className="bg-destructive/20 text-destructive px-2 py-1 rounded font-bold text-sm">
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className="text-destructive">:</span>
        <span className="bg-destructive/20 text-destructive px-2 py-1 rounded font-bold text-sm">
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className="text-destructive">:</span>
        <span className="bg-destructive/20 text-destructive px-2 py-1 rounded font-bold text-sm">
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

const NeonBorder = ({ color }: { color: string }) => (
  <motion.div
    className={`absolute inset-0 rounded-2xl opacity-50`}
    style={{
      background: `linear-gradient(135deg, ${color}33, transparent, ${color}33)`,
      boxShadow: `0 0 20px ${color}40, inset 0 0 20px ${color}20`,
    }}
    animate={{
      opacity: [0.3, 0.6, 0.3],
    }}
    transition={{ duration: 2, repeat: Infinity }}
  />
);

const pricingTiers = [
  {
    id: 'starter',
    name: 'Starter Pack',
    subtitle: 'Perfect for testing',
    price: '$2',
    originalPrice: '$4',
    savings: '$2',
    savingsPercent: '50%',
    credits: 10,
    perScript: '20',
    icon: Zap,
    popular: false,
    bestValue: false,
    buttonText: 'Get Starter',
    features: [
      '10 Pro AI Scripts',
      'Viral Hook Matrix',
      "Director's Storyboard",
    ],
    neonColor: '#06B6D4', // Cyan
    gradient: 'from-cyan-500/10 to-blue-500/10',
    borderColor: 'border-cyan-500/40',
    iconBg: 'bg-cyan-500/20',
    iconColor: 'text-cyan-400',
    glowColor: 'shadow-cyan-500/20',
  },
  {
    id: 'viral',
    name: 'Viral Creator',
    subtitle: '🔥 MOST POPULAR',
    price: '$4',
    originalPrice: '$8',
    savings: '$4',
    savingsPercent: '50%',
    credits: 30,
    perScript: '13',
    icon: Star,
    popular: true,
    bestValue: false,
    buttonText: 'Get Viral Pack',
    features: [
      'Everything in Starter PLUS:',
      '30 High-Retention Scripts',
      'AI Cover Art Generator',
      'PDF Production Plans',
    ],
    neonColor: '#8B5CF6', // Violet/Primary
    gradient: 'from-violet-500/20 to-purple-500/20',
    borderColor: 'border-violet-500/60',
    iconBg: 'bg-violet-500/20',
    iconColor: 'text-violet-400',
    glowColor: 'shadow-violet-500/30',
  },
  {
    id: 'pro',
    name: 'Pro Studio',
    subtitle: 'For agencies & power users',
    price: '$10',
    originalPrice: '$25',
    savings: '$15',
    savingsPercent: '60%',
    credits: 100,
    perScript: '10',
    icon: Crown,
    popular: false,
    bestValue: true,
    buttonText: 'Get Pro Pack',
    features: [
      'Ultimate Access:',
      '100 Unlimited AI Scripts',
      'Priority AI Processing',
      'Full Sound & Voice Direction',
      'Commercial Usage License',
    ],
    neonColor: '#F59E0B', // Amber
    gradient: 'from-amber-500/10 to-orange-500/10',
    borderColor: 'border-amber-500/50',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    glowColor: 'shadow-amber-500/20',
  },
];

// Confirmation Modal Component
const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  tier, 
  userId,
  onRefresh,
  isRefreshing
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  tier: SelectedTier | null;
  userId: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}) => {
  const handleOpenBot = () => {
    toast.info(
      "Opening Telegram... Please wait about a minute while we generate your invoice. ⏳✨",
      { duration: 8000 }
    );
    window.open(getPaymentUrl(userId), '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && tier && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(15, 15, 20, 0.98)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              boxShadow: '0 0 40px rgba(139, 92, 246, 0.2), 0 0 80px rgba(139, 92, 246, 0.1)',
            }}
          >
            {/* Neon glow effect */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, transparent 50%, rgba(6, 182, 212, 0.1) 100%)',
              }}
            />
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors z-10"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            <div className="relative z-10 p-6">
              {/* Lock Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center border border-violet-500/30">
                  <Lock className="w-8 h-8 text-violet-400" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-center text-foreground mb-2">
                🔐 Secure Crypto Payment
              </h3>
              
              {/* Selected Plan Summary */}
              <div className="text-center mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-muted-foreground">Selected Plan:</p>
                <p className="text-lg font-bold text-foreground">
                  {tier.name} — <span className="text-primary">{tier.price}</span> for {tier.credits} Scripts
                </p>
              </div>

              {/* Description */}
              <p className="text-center text-muted-foreground text-sm mb-6">
                Payments are processed securely via our Telegram Bot using Cryptomus to protect your anonymity and ensure instant delivery.
              </p>

              {/* Primary CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOpenBot}
                className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-3 mb-3"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
                }}
              >
                <Bot className="w-5 h-5" />
                <span>🤖 Open Bot to Pay</span>
                <ExternalLink className="w-4 h-4" />
              </motion.button>

              {/* Secondary CTA */}
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="w-full py-3 rounded-xl font-medium text-foreground flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>I already paid (Refresh Balance)</span>
              </button>

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  <span>Encrypted</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Instant</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3 text-cyan-400" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const PricingModal = ({ isOpen, onClose, userId }: PricingModalProps) => {
  const { refreshProfile, isLoading } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SelectedTier | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSelectTier = (tier: typeof pricingTiers[0]) => {
    setSelectedTier({
      name: tier.name,
      price: tier.price,
      credits: tier.credits,
    });
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setSelectedTier(null);
  };

  const handleCheckPayment = async () => {
    setIsRefreshing(true);
    try {
      await refreshProfile();
      toast.success("✨ Profile refreshed! Check your credits.");
      setShowConfirmation(false);
      onClose();
    } catch {
      toast.error("Failed to refresh. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={onClose}
          >
            {/* Backdrop with cyberpunk grid */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0" 
              style={{
                background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, rgba(5, 5, 5, 0.98) 70%)',
              }}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl rounded-3xl p-6 md:p-8 overflow-hidden my-8"
              style={{
                background: 'rgba(10, 10, 15, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 100px -20px rgba(139, 92, 246, 0.3)',
              }}
            >
              {/* Decorative neon lines */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors z-10 border border-white/10"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              <div className="relative z-10">
                {/* Urgency Banner */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap items-center justify-center gap-3 mb-6 p-3 rounded-xl"
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                  }}
                >
                  <Timer className="w-5 h-5 text-destructive animate-pulse" />
                  <span className="text-sm font-semibold text-destructive">⚡ FLASH SALE: UP TO 60% OFF ENDS IN</span>
                  <CountdownTimer />
                </motion.div>

                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Choose Your{' '}
                    <span 
                      className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
                      style={{ textShadow: '0 0 30px rgba(139, 92, 246, 0.5)' }}
                    >
                      Content Empire
                    </span>{' '}
                    Plan
                  </h2>
                  <p className="text-muted-foreground max-w-lg mx-auto">
                    Join 10,000+ creators dominating the algorithm. Secure crypto payment via Telegram.
                  </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                  {pricingTiers.map((tier, index) => (
                    <motion.div
                      key={tier.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      whileHover={{ scale: 1.03, y: -5 }}
                      className={`relative p-6 rounded-2xl transition-all duration-300 cursor-pointer group overflow-hidden ${
                        tier.popular ? 'md:scale-105 z-10' : ''
                      }`}
                      style={{
                        background: tier.popular 
                          ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)'
                          : 'rgba(20, 20, 25, 0.8)',
                        border: `1px solid ${tier.neonColor}50`,
                        boxShadow: tier.popular 
                          ? `0 0 30px ${tier.neonColor}30, inset 0 0 30px ${tier.neonColor}10` 
                          : 'none',
                      }}
                      onClick={() => handleSelectTier(tier)}
                    >
                      {/* Animated neon border for popular */}
                      {tier.popular && <NeonBorder color={tier.neonColor} />}

                      {/* Badges */}
                      {tier.popular && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4, type: "spring" }}
                          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-white text-xs font-bold overflow-hidden"
                          style={{
                            background: 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)',
                            boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
                          }}
                        >
                          <span className="relative z-10">🔥 MOST POPULAR</span>
                        </motion.div>
                      )}
                      {tier.bestValue && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring" }}
                          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-white text-xs font-bold overflow-hidden"
                          style={{
                            background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
                            boxShadow: '0 0 20px rgba(245, 158, 11, 0.5)',
                          }}
                        >
                          <span className="relative z-10">👑 BEST VALUE</span>
                        </motion.div>
                      )}

                      {/* Header */}
                      <div className="flex items-center gap-3 mb-4 mt-2">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{
                            background: `${tier.neonColor}20`,
                            boxShadow: `0 0 15px ${tier.neonColor}30`,
                          }}
                        >
                          <tier.icon className="w-6 h-6" style={{ color: tier.neonColor }} />
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
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                        style={{
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#10B981',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                        }}
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span>YOU SAVE {tier.savings} ({tier.savingsPercent} OFF)</span>
                      </motion.div>

                      {/* Per script cost */}
                      <p className="text-sm text-muted-foreground mb-4">
                        Only <span className="text-foreground font-bold">{tier.perScript}¢</span> per script
                        {tier.bestValue && <span className="text-emerald-400 font-medium"> — Absolute Lowest!</span>}
                      </p>

                      {/* Features */}
                      <ul className="space-y-2 mb-5">
                        {tier.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: tier.neonColor }} />
                            <span className="text-foreground/90">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectTier(tier);
                        }}
                        className="w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        style={{
                          background: tier.popular 
                            ? `linear-gradient(135deg, ${tier.neonColor} 0%, #D946EF 100%)`
                            : tier.bestValue
                            ? `linear-gradient(135deg, ${tier.neonColor} 0%, #EF4444 100%)`
                            : `${tier.neonColor}20`,
                          color: tier.popular || tier.bestValue ? 'white' : tier.neonColor,
                          border: tier.popular || tier.bestValue ? 'none' : `1px solid ${tier.neonColor}50`,
                          boxShadow: tier.popular ? `0 0 25px ${tier.neonColor}50` : 'none',
                        }}
                      >
                        <span>{tier.buttonText}</span>
                        <ExternalLink className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>

                {/* Comparison text */}
                <p className="text-center text-sm text-muted-foreground mb-6">
                  That's less than the price of <span className="text-foreground font-medium">2 coffees</span> for a month of professional content.
                </p>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-foreground font-medium">Crypto Secure</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                    <Bot className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-foreground font-medium">Telegram Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                    <span className="text-xs text-foreground font-medium">Instant Credits</span>
                  </div>
                </div>

                {/* Check Payment Button */}
                <div className="text-center">
                  <button
                    onClick={handleCheckPayment}
                    disabled={isLoading || isRefreshing}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium transition-all disabled:opacity-50"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>Check Payment Status</span>
                  </button>
                  <p className="text-xs text-muted-foreground mt-3">
                    Click after completing payment in Telegram
                  </p>
                </div>

                {/* Footer note */}
                <p className="text-center text-xs text-muted-foreground mt-6">
                  Trusted by creators on TikTok, Reels, and Shorts worldwide.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={handleCloseConfirmation}
        tier={selectedTier}
        userId={userId}
        onRefresh={handleCheckPayment}
        isRefreshing={isRefreshing}
      />
    </>
  );
};