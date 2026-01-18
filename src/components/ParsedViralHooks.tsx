import { memo, useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ViralHook } from '@/lib/aiResponseParser';

const hookColors: Record<string, { bg: string; border: string; text: string }> = {
  fear: { bg: 'hsl(0 72% 51% / 0.1)', border: 'hsl(0 72% 51% / 0.3)', text: 'hsl(0 72% 65%)' },
  curiosity: { bg: 'hsl(45 93% 47% / 0.1)', border: 'hsl(45 93% 47% / 0.3)', text: 'hsl(45 93% 60%)' },
  controversy: { bg: 'hsl(25 95% 53% / 0.1)', border: 'hsl(25 95% 53% / 0.3)', text: 'hsl(25 95% 65%)' },
  value: { bg: 'hsl(160 84% 39% / 0.1)', border: 'hsl(160 84% 39% / 0.3)', text: 'hsl(160 84% 50%)' },
  urgency: { bg: 'hsl(256 82% 66% / 0.1)', border: 'hsl(256 82% 66% / 0.3)', text: 'hsl(256 82% 75%)' },
};

const HookCard = memo(({ hook, index }: { hook: ViralHook; index: number }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const colors = hookColors[hook.type] || hookColors.curiosity;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(hook.text);
    setCopied(true);
    toast({
      title: 'Hook Copied!',
      description: 'Paste it in your video caption.',
    });
    setTimeout(() => setCopied(false), 2000);
  }, [hook.text, toast]);

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

interface ParsedViralHooksProps {
  hooks: ViralHook[];
}

export const ParsedViralHooks = memo(({ hooks }: ParsedViralHooksProps) => {
  if (!hooks || hooks.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <span className="text-2xl">🎣</span>
        Viral Hooks
        <span className="text-xs font-normal text-muted-foreground ml-2">Psychological Triggers</span>
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {hooks.map((hook, index) => (
          <HookCard key={`${hook.type}-${index}`} hook={hook} index={index} />
        ))}
      </div>
    </div>
  );
});

ParsedViralHooks.displayName = 'ParsedViralHooks';
