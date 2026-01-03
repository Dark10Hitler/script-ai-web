import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Loader2, AlertCircle, Copy, Check } from 'lucide-react';
import { useBalanceContext } from '@/contexts/BalanceContext';
import { generateScenario } from '@/lib/scenarioApi';
import { BalanceHeader } from './BalanceHeader';
import { ScenarioResult } from './ScenarioResult';
import { GenerationProgress } from './GenerationProgress';
import { PricingModal } from './PricingModal';
import { useToast } from '@/hooks/use-toast';
import { useRotatingPlaceholder } from '@/hooks/useRotatingPlaceholder';

interface ScenarioGeneratorProps {
  userId: string;
  onShowRecovery: () => void;
}

export const ScenarioGenerator = ({ userId, onShowRecovery }: ScenarioGeneratorProps) => {
  const { balance, isLoading: balanceLoading, isColdStart, fetchBalance } = useBalanceContext();
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationColdStart, setGenerationColdStart] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { placeholder, isVisible } = useRotatingPlaceholder();

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
    setGenerationColdStart(false);

    const startTime = Date.now();
    const coldStartTimer = setTimeout(() => {
      setGenerationColdStart(true);
    }, 5000);

    try {
      const response = await generateScenario(userId, prompt);
      clearTimeout(coldStartTimer);
      
      if (response.error === 'Insufficient balance') {
        setShowPricing(true);
        return;
      }
      
      const content = response.result || response.scenario || response.content || '';
      setResult(content);
      await fetchBalance();
    } catch (error: any) {
      console.error('Generation error:', error);
      
      if (error.status === 403) {
        setShowPricing(true);
        return;
      }
      
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Something went wrong.',
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
    <div className="min-h-screen p-4 md:p-8 pt-16 md:pt-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            AI Script <span className="text-primary neon-text">Generator</span>
          </h1>
          <p className="text-muted-foreground">
            Create viral scripts powered by Claude 3.5 Sonnet
          </p>
        </motion.div>

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
          className="glass-card rounded-2xl p-6"
        >
          <label className="block text-sm font-medium text-foreground mb-3">
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
                <span>{prompt.length} characters</span>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="glow-button flex items-center gap-2 px-6 py-3 rounded-xl text-primary-foreground font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Generation Progress */}
        {isGenerating && (
          <GenerationProgress isColdStart={generationColdStart} />
        )}

        {/* Result with Copy Button */}
        {result && (
          <div className="relative">
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleCopy}
              className="absolute top-10 right-8 z-10 flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/80 hover:bg-secondary text-foreground text-sm font-medium transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </motion.button>
            <ScenarioResult content={result} />
          </div>
        )}
      </div>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        userId={userId}
      />
    </div>
  );
};
