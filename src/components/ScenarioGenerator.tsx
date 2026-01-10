import { useState, useRef, memo, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Loader2, AlertCircle, Copy, Check } from 'lucide-react';
import { useBalanceContext } from '@/contexts/BalanceContext';
import { useGamification } from '@/contexts/GamificationContext';
import { generateScenario } from '@/lib/scenarioApi';
import { parseAIResponse } from '@/lib/aiResponseParser';
import { BalanceHeader } from './BalanceHeader';
import { ScenarioResult } from './ScenarioResult';
import { NeuralProgress } from './NeuralProgress';
import { PricingModal } from './PricingModal';
import { CreatorJourneyBar } from './CreatorJourneyBar';
import { LevelUpCelebration } from './LevelUpCelebration';
import { GenerationSkeleton } from './GenerationSkeleton';
import { CommunityFeedback } from './CommunityFeedback';
import { useToast } from '@/hooks/use-toast';
import { useRotatingPlaceholder } from '@/hooks/useRotatingPlaceholder';

// Lazy load heavy components for performance
const TrendRadar = lazy(() => import('./TrendRadar').then(m => ({ default: m.TrendRadar })));
const HookMatrix = lazy(() => import('./HookMatrix').then(m => ({ default: m.HookMatrix })));
const Storyboard = lazy(() => import('./Storyboard').then(m => ({ default: m.Storyboard })));
const DirectorSummary = lazy(() => import('./DirectorSummary').then(m => ({ default: m.DirectorSummary })));
const MasterPromptCenter = lazy(() => import('./MasterPromptCenter').then(m => ({ default: m.MasterPromptCenter })));
const RetentionHeatmap = lazy(() => import('./RetentionHeatmap').then(m => ({ default: m.RetentionHeatmap })));
const SoundPalette = lazy(() => import('./SoundPalette').then(m => ({ default: m.SoundPalette })));
const FinalVerdictBadge = lazy(() => import('./FinalVerdictBadge').then(m => ({ default: m.FinalVerdictBadge })));

// Local interface definitions
interface HookVariant {
  type: 'aggressive' | 'intriguing' | 'visual';
  title: string;
  hookText: string;
  retentionForecast: number;
  mechanism: string;
}

interface StoryboardScene {
  scene: number;
  timing: string;
  visual: string;
  audio: string;
  sfx: string;
  aiPrompt: string;
}

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

interface ParsedAIResponse {
  hooks: HookVariant[];
  scenes: StoryboardScene[];
  masterPrompt: MasterPrompt | null;
  rawContent: string;
  hasStructuredData: boolean;
}

interface ScenarioGeneratorProps {
  userId: string;
  onShowRecovery: () => void;
}

// Simple loading fallback for lazy components
const LazyFallback = () => (
  <div className="glass-card rounded-2xl p-6 animate-pulse">
    <div className="h-6 bg-muted/50 rounded w-1/3 mb-4" />
    <div className="h-32 bg-muted/30 rounded" />
  </div>
);

export const ScenarioGenerator = memo(({ userId, onShowRecovery }: ScenarioGeneratorProps) => {
  const { balance, isLoading: balanceLoading, fetchBalance } = useBalanceContext();
  const { 
    streak, currentXP, maxXP, level, rank, nextRank,
    addXP, incrementStreak, 
    showFloatingXP, floatingXPAmount,
    levelUpCelebration, newLevelRank, dismissLevelUp 
  } = useGamification();
  
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedAIResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationColdStart, setGenerationColdStart] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { placeholder, isVisible } = useRotatingPlaceholder();
  const generatorRef = useRef<HTMLDivElement>(null);

  const handleQuickGenerate = (topicPrompt: string) => {
    setPrompt(topicPrompt);
    generatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Empty Prompt',
        description: 'Please enter a scenario description.',
        variant: 'destructive',
      });
      return;
    }

    if (balance === 0) {
      setShowPricing(true);
      return;
    }

    setIsGenerating(true);
    setResult(null);
    setParsedData(null);
    setGenerationColdStart(false);

    const coldStartTimer = setTimeout(() => {
      setGenerationColdStart(true);
    }, 5000);

    try {
      console.log('Starting generation for user:', userId);
      const response = await generateScenario(userId, prompt);
      console.log('Generation response received:', response);
      
      if (response.error === 'Insufficient balance') {
        setShowPricing(true);
        return;
      }
      
      // Extract content from various possible response formats
      const content = response.script || response.result || response.scenario || response.content || '';
      console.log('Raw content length:', content.length);
      console.log('Content preview:', content.substring(0, 500));
      
      setResult(content);
      
      // Parse for structured data using the advanced parser
      console.log('Parsing AI response...');
      const parsed = parseAIResponse(content);
      console.log('Parse results:', {
        hasStructuredData: parsed.hasStructuredData,
        hooksCount: parsed.hooks.length,
        scenesCount: parsed.scenes.length,
        hasMasterPrompt: !!parsed.masterPrompt,
      });
      
      // Log individual items for debugging
      if (parsed.hooks.length > 0) {
        console.log('Hooks:', parsed.hooks.map(h => ({ type: h.type, text: h.hookText.substring(0, 50) })));
      }
      if (parsed.scenes.length > 0) {
        console.log('Scenes:', parsed.scenes.map(s => ({ scene: s.scene, visual: s.visual.substring(0, 50) })));
      }
      
      // Always set parsed data if there's any structured content
      if (parsed.hasStructuredData) {
        setParsedData(parsed);
      } else if (content.length > 50) {
        // Even if parsing failed, show demo data for UX
        console.log('No structured data found, using fallback demo data');
        setParsedData(parsed);
      }
      
      // Award XP on successful generation
      addXP(50);
      incrementStreak();
      
      await fetchBalance();
    } catch (error: any) {
      console.error('Generation error:', error);
      
      if (error.status === 403) {
        setShowPricing(true);
        toast({
          title: 'Insufficient Credits',
          description: 'Please top up your balance to continue generating scripts.',
          variant: 'destructive',
        });
        return;
      }
      
      if (error.status === 500) {
        toast({
          title: 'Server Error',
          description: error.serverMessage || error.message || 'Server error occurred. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: 'Generation Failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      clearTimeout(coldStartTimer);
      setIsGenerating(false);
      setGenerationColdStart(false);
    }
  };

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Script copied to clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 pt-20 md:pt-8">
      {/* Level Up Celebration */}
      <LevelUpCelebration
        isVisible={levelUpCelebration}
        level={level}
        rank={newLevelRank}
        onDismiss={dismissLevelUp}
      />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
            AI Script <span className="text-primary neon-text">Generator</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Create viral scripts powered by <span className="text-accent neon-text-cyan">Claude 3.5 Sonnet</span>
          </p>
        </motion.div>

        {/* Creator Journey Gamification Bar */}
        <CreatorJourneyBar
          streak={streak}
          currentXP={currentXP}
          maxXP={maxXP}
          level={level}
          rank={rank}
          nextRank={nextRank}
          showFloatingXP={showFloatingXP}
          floatingXPAmount={floatingXPAmount}
        />

        {/* Trend Radar - Daily Inspiration */}
        <Suspense fallback={<LazyFallback />}>
          <TrendRadar onQuickGenerate={handleQuickGenerate} />
        </Suspense>

        {/* Balance Header */}
        <BalanceHeader
          userId={userId}
          onRefresh={fetchBalance}
          onTopUp={() => setShowPricing(true)}
          onShowRecovery={onShowRecovery}
        />

        {/* Generator Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          ref={generatorRef}
          className="glass-card-elevated rounded-2xl p-6"
        >
          <label className="block text-sm font-medium text-foreground mb-3 tracking-wide">
            Describe your script idea
          </label>
          
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={placeholder}
              className={`w-full h-40 md:h-48 p-4 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 ${
                isGenerating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{
                opacity: prompt ? 1 : isVisible ? 0.7 : 0.4,
              }}
              disabled={isGenerating}
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              {prompt.length > 0 && (
                <span className="font-mono">{prompt.length} characters</span>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="glow-button flex items-center gap-2 px-8 py-3 rounded-xl text-primary-foreground font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>

          {/* Low balance warning */}
          {balance === 0 && !balanceLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">No credits available</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click "Top Up" to add credits and continue generating scripts.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Neural Processing Animation OR Skeleton Loader */}
        {isGenerating && (
          <>
            <NeuralProgress isColdStart={generationColdStart} />
            <GenerationSkeleton />
          </>
        )}

        {/* Director's Summary with PDF Download */}
        {parsedData && parsedData.hasStructuredData && (
          <Suspense fallback={<LazyFallback />}>
            <DirectorSummary 
              hooks={parsedData.hooks} 
              scenes={parsedData.scenes}
              userId={userId}
            />
          </Suspense>
        )}

        {/* Viral Hook Matrix */}
        {parsedData && parsedData.hooks.length > 0 && (
          <Suspense fallback={<LazyFallback />}>
            <HookMatrix hooks={parsedData.hooks} />
          </Suspense>
        )}

        {/* Director's Storyboard */}
        {parsedData && parsedData.scenes.length > 0 && (
          <>
            <Suspense fallback={<LazyFallback />}>
              <Storyboard scenes={parsedData.scenes} />
            </Suspense>
            
            {/* Retention Heatmap - After Storyboard */}
            <Suspense fallback={<LazyFallback />}>
              <RetentionHeatmap />
            </Suspense>
            
            {/* Sound Design Palette */}
            <Suspense fallback={<LazyFallback />}>
              <SoundPalette />
            </Suspense>
          </>
        )}

        {/* Master Prompt Command Center - Always last before verdict */}
        {parsedData && parsedData.masterPrompt && (
          <Suspense fallback={<LazyFallback />}>
            <MasterPromptCenter masterPrompt={parsedData.masterPrompt} />
          </Suspense>
        )}

        {/* Final Verdict Badge - Appears after all content */}
        {parsedData && parsedData.hasStructuredData && (
          <Suspense fallback={<LazyFallback />}>
            <FinalVerdictBadge type="tiktok" loopTechnique={true} />
          </Suspense>
        )}

        {/* Raw Result - Only show if no structured data was parsed, or show filtered content */}
        {result && (!parsedData?.hasStructuredData) && (
          <div className="relative mt-6">
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleCopy}
              className={`absolute top-10 right-8 z-10 flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/80 hover:bg-secondary border border-border/50 text-foreground text-sm font-medium transition-all ${copied ? 'animate-haptic' : ''}`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-neon-emerald" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </motion.button>
            <ScenarioResult content={result} hideStructuredBlocks={false} />
          </div>
        )}

        {/* Community Feedback Section */}
        <CommunityFeedback />
      </div>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        userId={userId}
      />
    </div>
  );
});

ScenarioGenerator.displayName = 'ScenarioGenerator';
