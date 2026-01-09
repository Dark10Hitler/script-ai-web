import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Mic, Volume2, Sparkles, Copy, Check, ChevronDown, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DirectorTipToggle } from './DirectorTips';

// Local interface to avoid circular imports
export interface StoryboardScene {
  scene: number;
  timing: string;
  visual: string;
  audio: string;
  sfx: string;
  aiPrompt: string;
}

interface StoryboardProps {
  scenes: StoryboardScene[];
}

const SceneCard = ({ scene, index }: { scene: StoryboardScene; index: number }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const { toast } = useToast();

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(scene.aiPrompt);
    setCopied(true);
    toast({
      title: '✓ Copied to Clipboard',
      description: 'AI video prompt ready to paste',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        delay: index * 0.08,
        type: "spring",
        damping: 20,
        stiffness: 100
      }}
      className="group scene-card rounded-2xl overflow-hidden border border-border/30 hover:border-primary/30 transition-all duration-300"
    >
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-[100px_1fr_1fr_1.2fr] gap-0">
        {/* Scene Number */}
        <div className="relative p-5 flex flex-col items-center justify-center border-r border-border/30 bg-gradient-to-b from-primary/5 to-transparent">
          <span className="text-5xl font-black text-primary/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {String(scene.scene).padStart(2, '0')}
          </span>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-2">
              <span className="text-xl font-bold text-foreground">{scene.scene}</span>
            </div>
            {scene.timing && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="font-mono">{scene.timing}</span>
              </div>
            )}
          </div>
        </div>

        {/* Visual Column */}
        <div className="p-5 border-r border-border/30 bg-gradient-to-b from-cyan-500/5 to-transparent">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <Camera className="w-4 h-4 text-accent" />
            </div>
            <span className="text-xs text-accent font-semibold uppercase tracking-wider">Visual & Camera</span>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">{scene.visual}</p>
        </div>

        {/* Audio Column */}
        <div className="p-5 border-r border-border/30 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Mic className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs text-primary font-semibold uppercase tracking-wider">Audio & SFX</span>
          </div>
          {/* Dialogue in mono font */}
          <p className="text-sm text-foreground/80 font-mono italic leading-relaxed mb-2">
            {scene.audio}
          </p>
          {/* SFX in different style */}
          {scene.sfx && (
            <div className="mt-3 p-2 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-1.5 mb-1">
                <Volume2 className="w-3 h-3 text-primary" />
                <span className="text-[10px] text-primary font-semibold uppercase tracking-wide">SFX</span>
              </div>
              <p className="text-xs text-muted-foreground">{scene.sfx}</p>
            </div>
          )}
        </div>

        {/* AI Prompt Column */}
        <div className="p-5 bg-gradient-to-b from-emerald-500/5 to-transparent">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-neon-emerald/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-neon-emerald" />
              </div>
              <span className="text-xs text-neon-emerald font-semibold uppercase tracking-wider">AI Video Prompt</span>
            </div>
          </div>
          {/* Black box for prompt */}
          <div className="prompt-blackbox rounded-xl p-4 mb-3 min-h-[80px] bg-[#0a0a0a] border border-border/50">
            <p className="text-xs text-foreground/80 leading-relaxed font-mono">
              {scene.aiPrompt}
            </p>
          </div>
          <motion.button
            onClick={handleCopyPrompt}
            whileTap={{ scale: 0.95 }}
            className={`glow-button-cyan w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${copied ? 'bg-neon-emerald text-background' : ''}`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Prompt</span>
              </>
            )}
          </motion.button>
          
          {/* Director's Tip Toggle */}
          <DirectorTipToggle sceneNumber={scene.scene} />
        </div>
      </div>

      {/* Mobile/Tablet Layout - Accordion */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center">
              <span className="text-xl font-bold text-foreground">{String(scene.scene).padStart(2, '0')}</span>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-foreground">Scene {scene.scene}</span>
                {scene.timing && (
                  <span className="text-xs font-mono text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">{scene.timing}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{scene.visual.substring(0, 50)}...</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-5 space-y-4">
                {/* Visual */}
                <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Camera className="w-4 h-4 text-accent" />
                    <span className="text-xs text-accent font-semibold uppercase tracking-wider">Visual & Camera</span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">{scene.visual}</p>
                </div>

                {/* Audio */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Mic className="w-4 h-4 text-primary" />
                    <span className="text-xs text-primary font-semibold uppercase tracking-wider">Audio & SFX</span>
                  </div>
                  <p className="text-sm text-foreground/80 font-mono italic leading-relaxed">{scene.audio}</p>
                  {scene.sfx && (
                    <div className="mt-2 pt-2 border-t border-primary/20">
                      <span className="text-xs text-primary">SFX: </span>
                      <span className="text-xs text-muted-foreground">{scene.sfx}</span>
                    </div>
                  )}
                </div>

                {/* AI Prompt */}
                <div className="p-4 rounded-xl bg-neon-emerald/5 border border-neon-emerald/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-neon-emerald" />
                    <span className="text-xs text-neon-emerald font-semibold uppercase tracking-wider">AI Video Prompt</span>
                  </div>
                  <div className="prompt-blackbox rounded-lg p-3 mb-3 bg-[#0a0a0a]">
                    <p className="text-xs text-foreground/80 leading-relaxed font-mono">{scene.aiPrompt}</p>
                  </div>
                  <motion.button
                    onClick={handleCopyPrompt}
                    whileTap={{ scale: 0.95 }}
                    className={`glow-button-cyan w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 ${copied ? 'bg-neon-emerald text-background' : ''}`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Prompt
                      </>
                    )}
                  </motion.button>
                  
                  {/* Director's Tip Toggle for Mobile */}
                  <DirectorTipToggle sceneNumber={scene.scene} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export const Storyboard = ({ scenes }: StoryboardProps) => {
  if (!scenes || scenes.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mt-10"
    >
      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center border border-accent/20">
          <Camera className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground tracking-tight">Director's Storyboard</h3>
          <p className="text-sm text-muted-foreground">Scene-by-scene production guide with AI prompts</p>
        </div>
      </motion.div>

      {/* Desktop Header - Sticky */}
      <div className="hidden lg:grid lg:grid-cols-[100px_1fr_1fr_1.2fr] gap-0 glass-card rounded-2xl mb-2 sticky top-4 z-20">
        <div className="p-4 text-center border-r border-border/30">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Scene</span>
        </div>
        <div className="p-4 border-r border-border/30">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Visual & Camera</span>
        </div>
        <div className="p-4 border-r border-border/30">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Audio & SFX</span>
        </div>
        <div className="p-4">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">AI Video Prompt</span>
        </div>
      </div>

      {/* Scene Cards */}
      <div className="space-y-3">
        {scenes.map((scene, index) => (
          <SceneCard key={index} scene={scene} index={index} />
        ))}
      </div>
    </motion.section>
  );
};
