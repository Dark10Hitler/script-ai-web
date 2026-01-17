import { useState, useRef, memo, lazy, Suspense, useEffect, useCallback } from 'react';
import { Wand2, Loader2, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
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
import { ZeroCreditsOverlay } from './ZeroCreditsOverlay';
import { useToast } from '@/hooks/use-toast';
import { useRotatingPlaceholder } from '@/hooks/useRotatingPlaceholder';
import { ViralSuccessKit } from './ViralSuccessKit';

// Lazy load heavy components for performance
const TrendRadar = lazy(() => import('./TrendRadar').then(m => ({ default: m.TrendRadar })));
const HookMatrix = lazy(() => import('./HookMatrix').then(m => ({ default: m.HookMatrix })));
const Storyboard = lazy(() => import('./Storyboard').then(m => ({ default: m.Storyboard })));
const DirectorSummary = lazy(() => import('./DirectorSummary').then(m => ({ default: m.DirectorSummary })));
const MasterPromptCenter = lazy(() => import('./MasterPromptCenter').then(m => ({ default: m.MasterPromptCenter })));
const RetentionHeatmap = lazy(() => import('./RetentionHeatmap').then(m => ({ default: m.RetentionHeatmap })));
const SoundPalette = lazy(() => import('./SoundPalette').then(m => ({ default: m.SoundPalette })));
const FinalVerdictBadge = lazy(() => import('./FinalVerdictBadge').then(m => ({ default: m.FinalVerdictBadge })));
const AdUnit = lazy(() => import('./AdUnit'));

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

// Minimal loading fallback
const LazyFallback = memo(() => (
  <div className="glass-card rounded-2xl p-6">
    <div className="h-6 bg-muted/50 rounded w-1/3 mb-4" />
    <div className="h-32 bg-muted/30 rounded" />
  </div>
));
LazyFallback.displayName = 'LazyFallback';

export const ScenarioGenerator = memo(({ userId, onShowRecovery }: ScenarioGeneratorProps) => {
  const { balance, isLoading: balanceLoading, fetchBalance } = useBalanceContext();
  const { 
    streak, currentXP, maxXP, level, rank, nextRank,
    addXP, incrementStreak, 
    showFloatingXP, floatingXPAmount,
    levelUpCelebration, newLevelRank, dismissLevelUp,
    setUserId
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

  // Set userId in gamification context for database sync
  useEffect(() => {
    if (userId) {
      setUserId(userId);
    }
  }, [userId, setUserId]);

  const handleQuickGenerate = useCallback((topicPrompt: string) => {
    setPrompt(topicPrompt);
    generatorRef.current?.scrollIntoView({ behavior: 'auto', block: 'center' });
  }, []);

  const handleGenerate = useCallback(async () => {
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
      
      const content = response.script || response.result || response.scenario || response.content || '';
      console.log('Raw content length:', content.length);
      
      setResult(content);
      
      console.log('Parsing AI response...');
      const parsed = parseAIResponse(content);
      console.log('Parse results:', {
        hasStructuredData: parsed.hasStructuredData,
        hooksCount: parsed.hooks.length,
        scenesCount: parsed.scenes.length,
        hasMasterPrompt: !!parsed.masterPrompt,
      });
      
      if (parsed.hasStructuredData || content.length > 50) {
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
  }, [prompt, balance, userId, toast, addXP, incrementStreak, fetchBalance]);

  const handleCopy = useCallback(async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Script copied to clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, toast]);

  const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  }, []);

  const handleShowPricing = useCallback(() => setShowPricing(true), []);
  const handleClosePricing = useCallback(() => setShowPricing(false), []);

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
        {/* Header - No animations */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
            AI Script <span className="text-primary">Generator</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Create viral scripts powered by <span className="text-accent">Claude 3.5 Sonnet</span>
          </p>
        </div>

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
          onTopUp={handleShowPricing}
          onShowRecovery={onShowRecovery}
        />

        {/* Generator Card - No motion */}
        <div
          ref={generatorRef}
          className="glass-card-elevated rounded-2xl p-6 relative"
          style={{ transform: 'translateZ(0)' }}
        >
          {/* Zero Credits Overlay */}
          {balance === 0 && !balanceLoading && (
            <ZeroCreditsOverlay userId={userId} />
          )}

          <label className="block text-sm font-medium text-foreground mb-3 tracking-wide">
            Describe your script idea
          </label>
          
          <div className="relative">
            <textarea
              value={prompt}
              onChange={handlePromptChange}
              placeholder={placeholder}
              className={`w-full h-40 md:h-48 p-4 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors ${
                isGenerating || balance === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{
                opacity: prompt ? 1 : isVisible ? 0.7 : 0.4,
              }}
              disabled={isGenerating || balance === 0}
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
              disabled={isGenerating || !prompt.trim() || balance === 0}
              className="glow-button flex items-center gap-2 px-8 py-3 rounded-xl text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>

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

        {/* Ad Unit - Between Hook Matrix and Storyboard */}
        {parsedData && parsedData.hasStructuredData && (
          <Suspense fallback={null}>
            <AdUnit slot="1234567890" format="horizontal" />
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
          <>
            <Suspense fallback={<LazyFallback />}>
              <MasterPromptCenter masterPrompt={parsedData.masterPrompt} />
            </Suspense>
            
            {/* Ad Unit - Below Master Prompt */}
            <Suspense fallback={null}>
              <AdUnit slot="0987654321" format="auto" />
            </Suspense>
          </>
        )}

        {/* Final Verdict Badge - Appears after all content */}
        {parsedData && parsedData.hasStructuredData && (
          <Suspense fallback={<LazyFallback />}>
            <FinalVerdictBadge type="tiktok" loopTechnique={true} />
          </Suspense>
        )}

        {/* Raw Result - Only show if no structured data was parsed */}
        {result && (!parsedData?.hasStructuredData) && (
          <div className="relative mt-6">
            <button
              onClick={handleCopy}
              className={`absolute top-10 right-8 z-10 flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/80 hover:bg-secondary border border-border text-foreground text-sm font-medium transition-colors ${copied ? 'pulse-balance' : ''}`}
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
            </button>
            <ScenarioResult content={result} hideStructuredBlocks={false} />
          </div>
        )}

        {/* Viral Success Kit - Hook Lab & Hashtag Engine */}
        <ViralSuccessKit />

        {/* Community Feedback Section */}
        <CommunityFeedback />
      </div>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricing}
        onClose={handleClosePricing}
        userId={userId}
      />
    </div>
  );
});

ScenarioGenerator.displayName = 'ScenarioGenerator';
