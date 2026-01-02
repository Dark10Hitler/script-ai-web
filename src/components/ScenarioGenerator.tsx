import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Loader2, AlertCircle } from 'lucide-react';
import { useUserId } from '@/hooks/useUserId';
import { useBalance } from '@/hooks/useBalance';
import { generateScenario } from '@/lib/scenarioApi';
import { BalanceHeader } from './BalanceHeader';
import { ScenarioResult } from './ScenarioResult';
import { useToast } from '@/hooks/use-toast';

export const ScenarioGenerator = () => {
  const userId = useUserId();
  const { balance, isLoading: balanceLoading, fetchBalance } = useBalance(userId);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchBalance();
    }
  }, [userId, fetchBalance]);

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
      toast({
        title: 'No Credits',
        description: 'Please top up your balance to generate scenarios.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setResult(null);

    try {
      const response = await generateScenario(userId, prompt);
      const content = response.result || response.scenario || response.content || '';
      setResult(content);
      await fetchBalance();
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Something went wrong.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            AI Scenario <span className="text-primary neon-text">Generator</span>
          </h1>
          <p className="text-muted-foreground">
            Create detailed scenarios with the power of AI
          </p>
        </motion.div>

        {/* Balance Header */}
        <BalanceHeader
          balance={balance}
          isLoading={balanceLoading}
          userId={userId}
          onRefresh={fetchBalance}
        />

        {/* Generator Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6"
        >
          <label className="block text-sm font-medium text-foreground mb-3">
            Describe your scenario
          </label>
          
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a detailed description of the scenario you want to generate..."
            className="w-full h-40 md:h-48 p-4 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
            disabled={isGenerating}
          />

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              {prompt.length > 0 && (
                <span>{prompt.length} characters</span>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim() || balance === 0}
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
                  Click the "Top Up" button above to add credits via Telegram.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Result */}
        {result && <ScenarioResult content={result} />}
      </div>
    </div>
  );
};
