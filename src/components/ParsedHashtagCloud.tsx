import { memo, useState, useCallback } from 'react';
import { Hash, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ParsedHashtags } from '@/lib/aiResponseParser';

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

interface ParsedHashtagCloudProps {
  hashtags: ParsedHashtags;
}

export const ParsedHashtagCloud = memo(({ hashtags }: ParsedHashtagCloudProps) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const { toast } = useToast();

  const handleCopyAll = useCallback(() => {
    const allTags = [
      ...hashtags.broad,
      ...hashtags.niche,
      ...hashtags.trending,
    ].map(tag => `#${tag}`).join(' ');
    
    navigator.clipboard.writeText(allTags);
    setCopiedAll(true);
    toast({
      title: 'All Hashtags Copied!',
      description: `${hashtags.broad.length + hashtags.niche.length + hashtags.trending.length} hashtags ready to paste.`,
    });
    setTimeout(() => setCopiedAll(false), 2000);
  }, [hashtags, toast]);

  const hasAnyTags = hashtags.broad.length > 0 || hashtags.niche.length > 0 || hashtags.trending.length > 0;
  
  if (!hasAnyTags) return null;

  return (
    <div className="glass-card rounded-2xl p-6 mt-6" style={{ transform: 'translateZ(0)' }}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Hash className="w-5 h-5 text-accent" />
          Smart Hashtag Engine
        </h3>
        <button
          onClick={handleCopyAll}
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
      {hashtags.broad.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            Broad (High Volume)
          </p>
          <div className="flex flex-wrap gap-2">
            {hashtags.broad.map((tag) => (
              <HashtagChip key={tag} tag={tag} category="broad" />
            ))}
          </div>
        </div>
      )}

      {/* Niche Tags */}
      {hashtags.niche.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            Niche (Targeted)
          </p>
          <div className="flex flex-wrap gap-2">
            {hashtags.niche.map((tag) => (
              <HashtagChip key={tag} tag={tag} category="niche" />
            ))}
          </div>
        </div>
      )}

      {/* Trending Tags */}
      {hashtags.trending.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            Trending (Algorithm Boost)
          </p>
          <div className="flex flex-wrap gap-2">
            {hashtags.trending.map((tag) => (
              <HashtagChip key={tag} tag={tag} category="trending" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

ParsedHashtagCloud.displayName = 'ParsedHashtagCloud';
