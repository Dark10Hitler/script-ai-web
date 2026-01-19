import { memo, useState } from 'react';
import { User, Coins, RefreshCw, LogOut, Copy, Check, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PricingModal } from './PricingModal';

export const UserHeader = memo(() => {
  const { user, refreshProfile, logout } = useAuth();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  if (!user) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshProfile();
    setIsRefreshing(false);
    toast({
      title: 'Profile Refreshed',
      description: 'Your credits have been synced.',
    });
  };

  const handleCopyId = async () => {
    await navigator.clipboard.writeText(user.lovable_id);
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'Access ID copied to clipboard.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully.',
    });
  };

  return (
    <>
      <div 
        className="fixed top-4 right-4 z-20 flex items-center gap-2"
        style={{ transform: 'translateZ(0)' }}
      >
        {/* User Info Card */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-card/80 border border-border/50 backdrop-blur-sm">
          {/* Username */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {user.username}
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-4 bg-border/50" />

          {/* Credits with Top Up button */}
          <button
            onClick={() => setShowPricing(true)}
            className="flex items-center gap-2 group cursor-pointer"
            title="Top up credits"
          >
            <Coins className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              {user.balance}
            </span>
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
              <Plus className="w-3 h-3 text-primary" />
            </div>
          </button>

          {/* Divider */}
          <div className="w-px h-4 bg-border/50" />

          {/* ID (clickable to copy) */}
          <button
            onClick={handleCopyId}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
            title="Click to copy Access ID"
          >
            {copied ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            <span className="hidden sm:inline max-w-[100px] truncate">
              {user.lovable_id}
            </span>
          </button>
        </div>

        {/* Action Buttons */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-xl bg-card/80 border border-border/50 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-card transition-colors disabled:opacity-50"
          title="Refresh Profile"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={handleLogout}
          className="p-2 rounded-xl bg-card/80 border border-border/50 backdrop-blur-sm text-muted-foreground hover:text-destructive hover:bg-card transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        userId={user.lovable_id}
      />
    </>
  );
});

UserHeader.displayName = 'UserHeader';