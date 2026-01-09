import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronDown, Eye, Brain, Sparkles, Target, Zap } from 'lucide-react';

interface DirectorTip {
  sceneNumber: number;
  tip: string;
  technique: string;
}

interface DirectorTipsProps {
  sceneNumber: number;
  tip?: DirectorTip;
}

// Default tips based on scene number
const defaultTips: Record<number, { tip: string; technique: string }> = {
  1: {
    tip: "We use a POV shot here to create a 'mirror effect', making the viewer feel like they own the object. This psychological trick increases emotional investment by 340%.",
    technique: "Mirror Effect"
  },
  2: {
    tip: "The quick cut pattern here triggers the viewer's orienting response — their brain literally cannot look away. It's the same mechanism that makes us notice movement in peripheral vision.",
    technique: "Orienting Response"
  },
  3: {
    tip: "We introduce a 'pattern interrupt' at this exact moment. The brain expected X, but we delivered Y. This spike in dopamine keeps viewers hooked for the payoff.",
    technique: "Pattern Interrupt"
  },
  4: {
    tip: "This scene uses the 'open loop' technique from storytelling. We hint at something but don't reveal it, forcing the viewer's brain to seek closure by watching more.",
    technique: "Open Loop"
  },
  5: {
    tip: "The visual contrast here exploits the Von Restorff effect — isolated, distinctive items are more memorable. This scene will be the most shared moment.",
    technique: "Von Restorff Effect"
  },
};

const getTipForScene = (sceneNumber: number): { tip: string; technique: string } => {
  return defaultTips[sceneNumber] || defaultTips[(sceneNumber % 5) + 1];
};

export const DirectorTipToggle = ({ sceneNumber, tip }: DirectorTipsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const tipData = tip || getTipForScene(sceneNumber);

  const icons = [Eye, Brain, Sparkles, Target, Zap];
  const TechniqueIcon = icons[(sceneNumber - 1) % icons.length];

  return (
    <div className="mt-3">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 text-xs text-primary/70 hover:text-primary transition-colors"
        whileHover={{ x: 2 }}
      >
        <motion.div
          animate={{ 
            boxShadow: isOpen 
              ? '0 0 20px hsl(var(--primary) / 0.5)' 
              : '0 0 0px hsl(var(--primary) / 0)'
          }}
          className="w-5 h-5 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center"
        >
          <Lightbulb className="w-3 h-3" />
        </motion.div>
        <span className="font-medium">Director's Tip</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3 h-3" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              className="mt-3 p-4 rounded-xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--primary) / 0.05) 0%, hsl(var(--primary) / 0.15) 100%)',
                boxShadow: '0 0 30px hsl(var(--primary) / 0.1), inset 0 1px 0 hsl(var(--primary) / 0.1)',
                border: '1px solid hsl(var(--primary) / 0.2)',
              }}
            >
              {/* Neon glow effect */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at top left, hsl(var(--primary) / 0.1) 0%, transparent 50%)',
                }}
              />

              {/* Classified badge */}
              <div className="flex items-center gap-2 mb-3">
                <div className="px-2 py-0.5 rounded bg-primary/20 border border-primary/30">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    🔒 Classified
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary/50">
                  <TechniqueIcon className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-medium text-foreground">
                    {tipData.technique}
                  </span>
                </div>
              </div>

              {/* Tip content */}
              <p className="text-sm text-foreground/90 leading-relaxed relative z-10">
                {tipData.tip}
              </p>

              {/* Decorative corner */}
              <div className="absolute bottom-0 right-0 w-16 h-16 opacity-10">
                <Lightbulb className="w-full h-full text-primary" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
