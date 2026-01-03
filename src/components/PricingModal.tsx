import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Star, Crown, ExternalLink, RefreshCw } from 'lucide-react';
import { useBalanceContext } from '@/contexts/BalanceContext';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const pricingTiers = [
  {
    name: 'Starter',
    price: '$2',
    credits: 20,
    icon: Zap,
    popular: false,
    description: 'Perfect for trying out',
  },
  {
    name: 'Creator',
    price: '$4',
    credits: 50,
    icon: Star,
    popular: true,
    description: 'Most Popular',
  },
  {
    name: 'Pro',
    price: '$10',
    credits: 130,
    icon: Crown,
    popular: false,
    description: 'Best Value',
  },
];

export const PricingModal = ({ isOpen, onClose, userId }: PricingModalProps) => {
  const { fetchBalance, isLoading } = useBalanceContext();

  const handleBuy = (tier: typeof pricingTiers[0]) => {
    const url = `https://t.me/EducationGPT_AIBot?start=${userId}`;
    window.open(url, '_blank');
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
            className="relative w-full max-w-3xl glass-card rounded-2xl p-6 md:p-8 overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Upgrade Your <span className="text-primary neon-text">Plan</span>
              </h2>
              <p className="text-muted-foreground">
                Get more credits to generate unlimited AI scripts
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {pricingTiers.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-6 rounded-xl border ${
                    tier.popular
                      ? 'border-primary/50 bg-primary/5'
                      : 'border-border/50 bg-secondary/20'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      Most Popular
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      tier.popular ? 'bg-primary/20' : 'bg-secondary/50'
                    }`}>
                      <tier.icon className={`w-5 h-5 ${tier.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{tier.name}</h3>
                      <p className="text-xs text-muted-foreground">{tier.description}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-foreground">{tier.price}</span>
                    <span className="text-muted-foreground ml-2">/ {tier.credits} scripts</span>
                  </div>

                  <button
                    onClick={() => handleBuy(tier)}
                    className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                      tier.popular
                        ? 'glow-button text-primary-foreground'
                        : 'bg-secondary hover:bg-secondary/80 text-foreground'
                    }`}
                  >
                    <span>Buy Now</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Check Payment Button */}
            <div className="text-center">
              <button
                onClick={handleCheckPayment}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary/50 hover:bg-secondary/70 text-foreground font-medium transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Check Payment Status</span>
              </button>
              <p className="text-xs text-muted-foreground mt-2">
                Click after completing payment in Telegram
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
