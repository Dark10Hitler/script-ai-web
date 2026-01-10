import { memo } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle, MessageCircle, ExternalLink } from 'lucide-react';

interface Review {
  id: number;
  avatar: string;
  name: string;
  rating: number;
  text: string;
  verified: boolean;
}

const reviews: Review[] = [
  {
    id: 1,
    avatar: '🎬',
    name: 'Alex M.',
    rating: 5,
    text: 'My TikTok views jumped from 500 to 50K after using these scripts!',
    verified: true,
  },
  {
    id: 2,
    avatar: '🚀',
    name: 'Sarah K.',
    rating: 5,
    text: 'The hook variations are genius. Every video now grabs attention instantly.',
    verified: true,
  },
  {
    id: 3,
    avatar: '💡',
    name: 'Mike D.',
    rating: 5,
    text: 'Director tips helped me understand WHY certain techniques work.',
    verified: true,
  },
  {
    id: 4,
    avatar: '🔥',
    name: 'Emma L.',
    rating: 5,
    text: 'Finally hit 100K followers thanks to the viral loop technique!',
    verified: true,
  },
  {
    id: 5,
    avatar: '✨',
    name: 'James R.',
    rating: 5,
    text: 'The storyboard feature saves me hours of planning every week.',
    verified: true,
  },
  {
    id: 6,
    avatar: '🎯',
    name: 'Lisa T.',
    rating: 5,
    text: 'Best investment for my content creation business. 10x ROI easy.',
    verified: true,
  },
  {
    id: 7,
    avatar: '⚡',
    name: 'Chris P.',
    rating: 5,
    text: 'The AI understands viral psychology better than most marketers!',
    verified: true,
  },
  {
    id: 8,
    avatar: '🌟',
    name: 'Nina S.',
    rating: 5,
    text: 'Went from 0 to 10K subs in 2 weeks. These scripts are magic.',
    verified: true,
  },
];

// Double the reviews for seamless loop
const doubledReviews = [...reviews, ...reviews];

const ReviewCard = memo(({ review }: { review: Review }) => (
  <div className="flex-shrink-0 w-80 glass-card rounded-xl p-5 border border-border/50 mx-3">
    <div className="flex items-start gap-3 mb-3">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl border border-primary/20">
        {review.avatar}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">{review.name}</span>
          {review.verified && (
            <CheckCircle className="w-4 h-4 text-primary fill-primary/20" />
          )}
        </div>
        <div className="flex gap-0.5">
          {[...Array(review.rating)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          ))}
        </div>
      </div>
    </div>
    <p className="text-sm text-muted-foreground leading-relaxed">"{review.text}"</p>
  </div>
));

ReviewCard.displayName = 'ReviewCard';

export const CommunityFeedback = memo(() => {
  const handleTelegramClick = () => {
    window.open('https://t.me/Space2347D', '_blank');
  };

  return (
    <section className="mt-16 mb-8">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          💬 <span className="text-primary neon-text">VOICES</span> FROM THE CREATOR COMMUNITY
        </h2>
        <p className="text-muted-foreground">See what creators are saying about their results</p>
      </motion.div>

      {/* Marquee Container */}
      <div className="relative overflow-hidden py-4">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Scrolling container */}
        <motion.div
          className="flex"
          animate={{ x: [0, -50 * reviews.length * 6] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 60,
              ease: 'linear',
            },
          }}
        >
          {doubledReviews.map((review, index) => (
            <ReviewCard key={`${review.id}-${index}`} review={review} />
          ))}
        </motion.div>
      </div>

      {/* Telegram CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex justify-center mt-8"
      >
        <motion.button
          onClick={handleTelegramClick}
          className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#0088cc]/20 hover:bg-[#0088cc]/30 border border-[#0088cc]/40 text-[#0088cc] font-semibold transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          animate={{
            boxShadow: [
              '0 0 20px rgba(0, 136, 204, 0.2)',
              '0 0 40px rgba(0, 136, 204, 0.4)',
              '0 0 20px rgba(0, 136, 204, 0.2)',
            ],
          }}
          transition={{
            boxShadow: { duration: 2, repeat: Infinity },
          }}
        >
          <MessageCircle className="w-5 h-5" />
          <span>Leave your feedback on Telegram</span>
          <ExternalLink className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      </motion.div>

      {/* Community stats */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-sm text-muted-foreground mt-4"
      >
        Join <span className="text-primary font-semibold">500+</span> creators sharing their viral results!
      </motion.p>
    </section>
  );
});

CommunityFeedback.displayName = 'CommunityFeedback';
