import { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Copy, Check, Sparkles, Mic2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Local interface to avoid circular imports
interface MasterPrompt {
  fullText: string;
  role: string;
  context: string;
  imagePrompts: string[];
  voiceSettings: {
    stability: number;
    clarity: number;
    styleExaggeration: number;
  };
}

interface MasterPromptCenterProps {
  masterPrompt: MasterPrompt;
}

const VoiceSlider = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono text-foreground">{value}%</span>
    </div>
    <div className="relative h-2 bg-secondary/50 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  </div>
);

const AudioWaveformAnimation = () => {
  return (
    <div className="flex items-center gap-1 h-8">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-accent to-primary rounded-full"
          animate={{
            height: [8, 24, 8, 16, 8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export const MasterPromptCenter = ({ masterPrompt }: MasterPromptCenterProps) => {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(masterPrompt.fullText);
    setCopied(true);
    toast({
      title: '🚀 Blueprint Copied!',
      description: 'Ready to paste into ChatGPT, Claude, or Gemini',
    });
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSelectAll = () => {
    const promptElement = document.getElementById('master-prompt-text');
    if (promptElement) {
      const range = document.createRange();
      range.selectNodeContents(promptElement);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-10"
    >
      {/* Section Container */}
      <div 
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 15, 20, 0.9) 0%, rgba(10, 10, 15, 0.95) 100%)',
          border: '2px solid rgba(139, 92, 246, 0.3)',
        }}
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
        </div>
        
        <div className="relative z-10 p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center border border-primary/30">
              <Rocket className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
                🚀 UNIVERSAL AI AGENT BLUEPRINT
              </h2>
              <p className="text-sm text-muted-foreground">
                Copy this to ChatGPT, Claude, or Gemini to unlock full 360° marketing strategy
              </p>
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Master Prompt Box - 2 columns */}
            <div className="lg:col-span-2">
              {/* Image prompts badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/30 mb-4">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-xs font-medium text-accent">
                  Includes {masterPrompt.imagePrompts.length} High-CTR Image Prompts (Midjourney/DALL-E Ready)
                </span>
              </div>

              {/* Code box */}
              <motion.div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleSelectAll}
                className="relative group cursor-text"
              >
                {/* Scanning line effect */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"
                  animate={{ y: [0, 300, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                
                <div 
                  className={`relative rounded-xl p-5 min-h-[300px] max-h-[400px] overflow-y-auto transition-all duration-300 ${
                    isHovered ? 'border-neon-emerald/50' : 'border-border/30'
                  }`}
                  style={{ 
                    background: '#0a0a0a',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                  }}
                >
                  <pre 
                    id="master-prompt-text"
                    className="text-xs text-foreground/90 font-mono whitespace-pre-wrap leading-relaxed"
                  >
                    {masterPrompt.fullText.split('\n').map((line, i) => {
                      // Syntax highlighting
                      if (line.match(/^(ROLE|CONTEXT|TASK|IMAGE|VOICE):/i)) {
                        return (
                          <span key={i}>
                            <span className="text-primary font-semibold">{line}</span>
                            {'\n'}
                          </span>
                        );
                      }
                      if (line.includes('GENERATION')) {
                        return (
                          <span key={i}>
                            <span className="text-accent">{line}</span>
                            {'\n'}
                          </span>
                        );
                      }
                      return <span key={i}>{line}{'\n'}</span>;
                    })}
                  </pre>
                </div>

                {/* Floating copy button */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`absolute bottom-4 right-4 px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-lg ${
                    copied 
                      ? 'bg-neon-emerald text-background'
                      : 'glow-button text-primary-foreground'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Copied & Ready to Paste!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      <span>Copy Blueprint</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            </div>

            {/* ElevenLabs Voice Settings Card */}
            <div className="lg:col-span-1">
              <div className="glass-card-elevated rounded-2xl p-5 h-full border border-primary/20">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Mic2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">🎙 ElevenLabs Voice Settings</h3>
                    <p className="text-xs text-muted-foreground">Optimized for content narration</p>
                  </div>
                </div>

                {/* Audio waveform animation */}
                <div className="flex justify-center mb-6">
                  <AudioWaveformAnimation />
                </div>

                {/* Voice sliders (read-only visual) */}
                <div className="space-y-4">
                  <VoiceSlider 
                    label="Stability" 
                    value={masterPrompt.voiceSettings.stability} 
                    color="linear-gradient(90deg, #8B5CF6, #06B6D4)"
                  />
                  <VoiceSlider 
                    label="Clarity + Similarity" 
                    value={masterPrompt.voiceSettings.clarity} 
                    color="linear-gradient(90deg, #06B6D4, #10B981)"
                  />
                  <VoiceSlider 
                    label="Style Exaggeration" 
                    value={masterPrompt.voiceSettings.styleExaggeration} 
                    color="linear-gradient(90deg, #F59E0B, #EF4444)"
                  />
                </div>

                {/* Tips */}
                <div className="mt-5 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-xs text-muted-foreground">
                    <span className="text-primary font-medium">Pro Tip:</span> Copy these exact settings to ElevenLabs for optimal voice quality
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
