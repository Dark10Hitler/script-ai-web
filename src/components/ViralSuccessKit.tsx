import { useState, memo, useCallback } from 'react';
import { Rocket, Zap, Copy, Check, Loader2, Hash, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Hook {
  type: 'fear' | 'curiosity' | 'controversy' | 'value' | 'urgency';
  emoji: string;
  label: string;
  text: string;
}

interface Hashtags {
  broad: string[];
  niche: string[];
  trending: string[];
}

interface ViralBoostResponse {
  hooks: Hook[];
  hashtags: Hashtags;
}

const hookColors: Record<string, { bg: string; border: string; text: string }> = {
  fear: { bg: 'hsl(0 72% 51% / 0.1)', border: 'hsl(0 72% 51% / 0.3)', text: 'hsl(0 72% 65%)' },
  curiosity: { bg: 'hsl(45 93% 47% / 0.1)', border: 'hsl(45 93% 47% / 0.3)', text: 'hsl(45 93% 60%)' },
  controversy: { bg: 'hsl(25 95% 53% / 0.1)', border: 'hsl(25 95% 53% / 0.3)', text: 'hsl(25 95% 65%)' },
  value: { bg: 'hsl(160 84% 39% / 0.1)', border: 'hsl(160 84% 39% / 0.3)', text: 'hsl(160 84% 50%)' },
  urgency: { bg: 'hsl(256 82% 66% / 0.1)', border: 'hsl(256 82% 66% / 0.3)', text: 'hsl(256 82% 75%)' },
};

const HookCard = memo(({ hook, index, onCopy }: { hook: Hook; index: number; onCopy: (text: string) => void }) => {
  const [copied, setCopied] = useState(false);
  const colors = hookColors[hook.type] || hookColors.curiosity;

  const handleCopy = useCallback(() => {
    onCopy(hook.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [hook.text, onCopy]);

  return (
    <div
      className="p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02]"
      style={{
        background: colors.bg,
        borderColor: colors.border,
        transform: 'translateZ(0)',
        animationDelay: `${index * 50}ms`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{hook.emoji}</span>
          <span 
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: colors.text }}
          >
            {hook.label}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background/50 border border-border/50 text-xs font-medium transition-colors hover:bg-background"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <p className="text-foreground text-sm leading-relaxed font-medium">
        "{hook.text}"
      </p>
    </div>
  );
});
HookCard.displayName = 'HookCard';

const HashtagChip = memo(({ tag, category }: { tag: string; category: 'broad' | 'niche' | 'trending' }) => {
  const colors = {
    broad: 'bg-primary/10 border-primary/30 text-primary',
    niche: 'bg-accent/10 border-accent/30 text-accent',
    trending: 'bg-neon-emerald/10 border-neon-emerald/30 text-neon-emerald',
  };

  return (
    <span 
      className={`inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-medium ${colors[category]}`}
      style={{ transform: 'translateZ(0)' }}
    >
      #{tag}
    </span>
  );
});
HashtagChip.displayName = 'HashtagChip';

export const ViralSuccessKit = memo(() => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ViralBoostResponse | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const { toast } = useToast();

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      toast({
        title: 'Empty Topic',
        description: 'Please enter a video topic.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('viral-boost', {
        body: { topic: topic.trim() },
      });

      if (error) {
        throw new Error(error.message || 'Generation failed');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      toast({
        title: '🚀 Viral Boost Ready!',
        description: '5 psychological hooks + optimized hashtags generated.',
      });
    } catch (error: any) {
      console.error('Viral boost error:', error);
      toast({
        title: 'Generation Failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  }, [topic, toast]);

  const handleCopyHook = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Hook Copied!',
      description: 'Paste it in your video caption.',
    });
  }, [toast]);

  const handleCopyAllHashtags = useCallback(() => {
    if (!result?.hashtags) return;
    
    const allTags = [
      ...result.hashtags.broad,
      ...result.hashtags.niche,
      ...result.hashtags.trending,
    ].map(tag => `#${tag}`).join(' ');
    
    navigator.clipboard.writeText(allTags);
    setCopiedAll(true);
    toast({
      title: 'All Hashtags Copied!',
      description: `${result.hashtags.broad.length + result.hashtags.niche.length + result.hashtags.trending.length} hashtags ready to paste.`,
    });
    setTimeout(() => setCopiedAll(false), 2000);
  }, [result, toast]);

  return (
    <div className="mt-10 mb-8">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
          <Rocket className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            Viral Success Kit
            <Sparkles className="w-5 h-5 text-accent" />
          </h2>
          <p className="text-sm text-muted-foreground">
            Psychological hooks + smart hashtags for maximum reach
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="glass-card rounded-2xl p-6" style={{ transform: 'translateZ(0)' }}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter your video topic (e.g., 'How to save money' or 'My gym transformation')..."
              className="w-full h-12 px-4 pr-10 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
              disabled={isGenerating}
              onKeyDown={(e) => e.key === 'Enter' && !isGenerating && handleGenerate()}
            />
            <Zap className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className="glow-button flex items-center justify-center gap-2 px-6 h-12 rounded-xl text-primary-foreground font-semibold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                <span>Generate Viral Boost</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="mt-6 space-y-6">
          {/* Hook Lab */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="text-2xl">🧪</span>
              Hook Lab
              <span className="text-xs font-normal text-muted-foreground ml-2">5 Psychological Triggers</span>
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {result.hooks.map((hook, index) => (
                <HookCard key={`${hook.type}-${index}`} hook={hook} index={index} onCopy={handleCopyHook} />
              ))}
            </div>
          </div>

          {/* Hashtag Engine */}
          <div className="glass-card rounded-2xl p-6" style={{ transform: 'translateZ(0)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Hash className="w-5 h-5 text-accent" />
                Viral Hashtag Cloud
              </h3>
              <button
                onClick={handleCopyAllHashtags}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent text-sm font-medium transition-colors hover:bg-accent/20"
              >
                {copiedAll ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy All Hashtags</span>
                  </>
                )}
              </button>
            </div>

            {/* Broad Tags */}
            <div className="mb-4">
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Broad (High Volume)
              </p>
              <div className="flex flex-wrap gap-2">
                {result.hashtags.broad.map((tag) => (
                  <HashtagChip key={tag} tag={tag} category="broad" />
                ))}
              </div>
            </div>

            {/* Niche Tags */}
            <div className="mb-4">
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Niche (Targeted)
              </p>
              <div className="flex flex-wrap gap-2">
                {result.hashtags.niche.map((tag) => (
                  <HashtagChip key={tag} tag={tag} category="niche" />
                ))}
              </div>
            </div>

            {/* Trending Tags */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Trending (Algorithm Boost)
              </p>
              <div className="flex flex-wrap gap-2">
                {result.hashtags.trending.map((tag) => (
                  <HashtagChip key={tag} tag={tag} category="trending" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

ViralSuccessKit.displayName = 'ViralSuccessKit';
