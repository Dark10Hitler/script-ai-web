import { memo, useMemo } from 'react';

/**
 * PERFORMANCE OPTIMIZED: Static gradient background
 * - Removed all Framer Motion animations
 * - Removed blur filters
 * - GPU accelerated with translateZ(0)
 */
const AuroraBackground = memo(() => {
  const gradientStyles = useMemo(() => ({
    base: {
      background: `
        radial-gradient(ellipse 100% 100% at 50% 0%, hsl(256 82% 8% / 0.5) 0%, transparent 50%),
        radial-gradient(ellipse 80% 80% at 80% 80%, hsl(187 94% 8% / 0.3) 0%, transparent 50%),
        linear-gradient(180deg, hsl(0 0% 2%) 0%, hsl(240 5% 4%) 100%)
      `,
      transform: 'translateZ(0)',
    },
    vignette: {
      background: `radial-gradient(ellipse 70% 70% at 50% 50%, transparent 0%, hsl(0 0% 2% / 0.6) 100%)`,
    },
  }), []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Static gradient background */}
      <div className="absolute inset-0" style={gradientStyles.base} />
      {/* Vignette overlay */}
      <div className="absolute inset-0" style={gradientStyles.vignette} />
    </div>
  );
});

AuroraBackground.displayName = 'AuroraBackground';

export default AuroraBackground;
