import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

// GPU-accelerated animation variants using only transform and opacity
const auroraVariants = {
  primary: {
    x: [0, 100, -50, 0],
    y: [0, -50, 50, 0],
    scale: [1, 1.1, 0.95, 1],
    opacity: [0.2, 0.35, 0.25, 0.2],
  },
  secondary: {
    x: [0, -80, 40, 0],
    y: [0, 60, -40, 0],
    scale: [1, 0.9, 1.05, 1],
    opacity: [0.15, 0.25, 0.18, 0.15],
  },
  mesh: {
    opacity: [1, 0.8, 1],
  },
};

const AuroraBackground = memo(() => {
  // Memoize static styles to prevent re-calculation
  const gradientStyles = useMemo(() => ({
    base: {
      background: `
        radial-gradient(ellipse 100% 100% at 50% 0%, hsl(256 82% 10% / 0.5) 0%, transparent 50%),
        radial-gradient(ellipse 80% 80% at 80% 80%, hsl(187 94% 10% / 0.3) 0%, transparent 50%),
        radial-gradient(ellipse 60% 60% at 20% 60%, hsl(256 82% 8% / 0.4) 0%, transparent 50%),
        linear-gradient(180deg, hsl(0 0% 2%) 0%, hsl(240 5% 4%) 100%)
      `,
    },
    primary: {
      background: `radial-gradient(ellipse 50% 30% at 60% 40%, hsl(256 82% 50% / 0.4) 0%, transparent 70%)`,
      filter: 'blur(80px)',
      transform: 'translateZ(0)', // Force GPU layer
    },
    secondary: {
      background: `radial-gradient(ellipse 40% 25% at 70% 60%, hsl(187 94% 43% / 0.35) 0%, transparent 70%)`,
      filter: 'blur(100px)',
      transform: 'translateZ(0)', // Force GPU layer
    },
    mesh: {
      background: `
        radial-gradient(circle at 30% 20%, hsl(256 82% 30% / 0.08) 0%, transparent 40%),
        radial-gradient(circle at 70% 80%, hsl(187 94% 30% / 0.06) 0%, transparent 40%)
      `,
    },
    grid: {
      backgroundImage: `
        linear-gradient(hsl(0 0% 100% / 0.1) 1px, transparent 1px),
        linear-gradient(90deg, hsl(0 0% 100% / 0.1) 1px, transparent 1px)
      `,
      backgroundSize: '60px 60px',
    },
    vignette: {
      background: `radial-gradient(ellipse 70% 70% at 50% 50%, transparent 0%, hsl(0 0% 2% / 0.8) 100%)`,
    },
    noise: {
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
    },
  }), []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden will-change-auto">
      {/* Base dark background with subtle gradient */}
      <div className="absolute inset-0" style={gradientStyles.base} />

      {/* Animated aurora - Primary (Violet) - GPU accelerated */}
      <motion.div
        className="absolute w-[150%] h-[150%] -top-1/4 -left-1/4 opacity-20 will-change-transform"
        style={gradientStyles.primary}
        animate={auroraVariants.primary}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Animated aurora - Secondary (Cyan) - GPU accelerated */}
      <motion.div
        className="absolute w-[120%] h-[120%] -bottom-1/4 -right-1/4 opacity-15 will-change-transform"
        style={gradientStyles.secondary}
        animate={auroraVariants.secondary}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Mesh gradient overlay - GPU accelerated opacity only */}
      <motion.div
        className="absolute inset-0 will-change-opacity"
        style={gradientStyles.mesh}
        animate={auroraVariants.mesh}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Static elements - no animation needed */}
      <div className="absolute inset-0 opacity-[0.02]" style={gradientStyles.grid} />
      <div className="absolute inset-0" style={gradientStyles.vignette} />
      <div className="absolute inset-0 opacity-[0.015]" style={gradientStyles.noise} />
    </div>
  );
});

AuroraBackground.displayName = 'AuroraBackground';

export default AuroraBackground;
