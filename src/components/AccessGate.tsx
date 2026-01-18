import { useState, memo } from 'react';
import { Loader2, Send, MessageCircle, Sparkles, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const TELEGRAM_BOT_URL = 'https://t.me/Insightoraculbot';

export const AccessGate = memo(() => {
  const { verifyAccessId, isVerifying, error } = useAuth();
  const [accessId, setAccessId] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleVerify = async () => {
    const trimmedId = accessId.trim();
    
    if (!trimmedId) {
      setLocalError('Please enter your Access ID');
      return;
    }
    
    // Basic format validation
    if (!trimmedId.startsWith('scen_') || trimmedId.length < 10) {
      setLocalError('Invalid format. Access ID should start with "scen_"');
      return;
    }
    
    setLocalError(null);
    await verifyAccessId(trimmedId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isVerifying) {
      handleVerify();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)/0.5) 100%)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div 
        className="w-full max-w-md p-8 rounded-3xl border border-border/50 bg-card/95"
        style={{
          boxShadow: '0 25px 50px -12px hsl(var(--primary)/0.15)',
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Access Required
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter your Access ID to unlock the AI Script Generator
          </p>
        </div>

        {/* Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Access ID
            </label>
            <input
              type="text"
              value={accessId}
              onChange={(e) => setAccessId(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="scen_xxxxxxxx_xxxxxxxx"
              disabled={isVerifying}
              className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors font-mono text-sm disabled:opacity-50"
            />
          </div>

          {/* Error Message */}
          {(error || localError) && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error || localError}
            </div>
          )}

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={isVerifying || !accessId.trim()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Verify Access</span>
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-border/50" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-border/50" />
        </div>

        {/* Telegram Link */}
        <a
          href={TELEGRAM_BOT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-[#0088cc] text-white font-semibold transition-all hover:bg-[#0088cc]/90"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Get Access ID via Telegram</span>
        </a>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Don't have an Access ID? Start the Telegram bot to receive one instantly.
          </p>
        </div>

        {/* Branding */}
        <div className="mt-8 pt-6 border-t border-border/30 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">ScriptAI</span>
        </div>
      </div>
    </div>
  );
});

AccessGate.displayName = 'AccessGate';
