import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Music, Waves, Zap, Wind, Drum } from 'lucide-react';

interface SoundChip {
  id: string;
  name: string;
  category: 'whoosh' | 'impact' | 'riser' | 'ambient' | 'beat' | 'fx';
  icon: typeof Volume2;
}

const soundAssets: SoundChip[] = [
  { id: '1', name: 'Deep Whoosh - 808', category: 'whoosh', icon: Wind },
  { id: '2', name: 'Vinyl Scratch', category: 'fx', icon: Music },
  { id: '3', name: 'Cinematic Riser', category: 'riser', icon: Waves },
  { id: '4', name: 'Bass Drop', category: 'impact', icon: Zap },
  { id: '5', name: 'Ambient Pad', category: 'ambient', icon: Waves },
  { id: '6', name: 'Trap Hi-Hat', category: 'beat', icon: Drum },
  { id: '7', name: 'Reverse Cymbal', category: 'riser', icon: Music },
  { id: '8', name: 'Glitch FX', category: 'fx', icon: Zap },
  { id: '9', name: 'Sub Bass Hit', category: 'impact', icon: Volume2 },
];

const categoryColors: Record<string, string> = {
  whoosh: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400',
  impact: 'from-red-500/20 to-red-500/5 border-red-500/30 text-red-400',
  riser: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400',
  ambient: 'from-green-500/20 to-green-500/5 border-green-500/30 text-green-400',
  beat: 'from-orange-500/20 to-orange-500/5 border-orange-500/30 text-orange-400',
  fx: 'from-pink-500/20 to-pink-500/5 border-pink-500/30 text-pink-400',
};

export const SoundPalette = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-8"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/30 to-purple-500/30 flex items-center justify-center border border-pink-500/20">
          <Volume2 className="w-5 h-5 text-pink-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground tracking-tight">Sound Design Palette</h3>
          <p className="text-xs text-muted-foreground">Recommended audio assets for maximum impact</p>
        </div>
      </div>

      {/* Sound Chips Grid */}
      <div className="glass-card rounded-2xl p-6 border border-border/30">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {soundAssets.map((sound, index) => {
            const Icon = sound.icon;
            const isHovered = hoveredId === sound.id;
            
            return (
              <motion.div
                key={sound.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onHoverStart={() => setHoveredId(sound.id)}
                onHoverEnd={() => setHoveredId(null)}
                className={`
                  relative p-4 rounded-xl cursor-pointer transition-all duration-300
                  bg-gradient-to-br ${categoryColors[sound.category]}
                  border hover:scale-105 hover:shadow-lg
                `}
                style={{
                  boxShadow: isHovered 
                    ? '0 0 30px hsl(var(--primary) / 0.2)' 
                    : 'none',
                }}
              >
                {/* Icon */}
                <div className="flex items-center justify-center mb-3">
                  <motion.div
                    animate={isHovered ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                </div>

                {/* Name */}
                <p className="text-xs font-medium text-center text-foreground leading-tight">
                  {sound.name}
                </p>

                {/* Sound Wave Animation on Hover */}
                <AnimatedWave isActive={isHovered} />

                {/* Category Tag */}
                <div className="absolute top-2 right-2">
                  <span className="text-[8px] uppercase font-bold tracking-wider opacity-50">
                    {sound.category}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Usage Tip */}
        <div className="mt-5 pt-5 border-t border-border/30">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30">
            <Music className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              <span className="text-foreground font-medium">Pro Tip:</span> Layer the "Cinematic Riser" 
              with "Bass Drop" for maximum hook impact. Place sound effects 0.5s before visual cuts 
              for a professional feel.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

// Animated sound wave component
const AnimatedWave = ({ isActive }: { isActive: boolean }) => {
  return (
    <motion.div
      className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-0.5 h-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      {[1, 2, 3, 4, 5].map((bar) => (
        <motion.div
          key={bar}
          className="w-0.5 bg-current rounded-full"
          animate={isActive ? {
            height: ['4px', `${8 + Math.random() * 8}px`, '4px'],
          } : { height: '4px' }}
          transition={{
            duration: 0.4,
            repeat: isActive ? Infinity : 0,
            delay: bar * 0.1,
          }}
        />
      ))}
    </motion.div>
  );
};
