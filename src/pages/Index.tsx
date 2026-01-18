import { useState, useCallback, memo } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import AuroraBackground from "@/components/AuroraBackground";
import { ScenarioGenerator } from "@/components/ScenarioGenerator";
import { BrowserWarning } from "@/components/BrowserWarning";
import { RecoveryModal } from "@/components/RecoveryModal";
import { AccessGate } from "@/components/AccessGate";
import { UserHeader } from "@/components/UserHeader";
import { GamificationProvider } from "@/contexts/GamificationContext";
import { useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";

const Index = memo(() => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  const handleShowRecovery = useCallback(() => setShowRecoveryModal(true), []);
  const handleHideRecovery = useCallback(() => setShowRecoveryModal(false), []);
  const handleRecover = useCallback((id: string) => {
    // Recovery is now handled via AccessGate
    setShowRecoveryModal(false);
  }, []);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="relative min-h-screen overflow-hidden flex flex-col">
        <AuroraBackground />
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <p className="text-muted-foreground">Verifying access...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show access gate if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <AuroraBackground />
        <AccessGate />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      {/* SEO */}
      <title>AI Script Generator - Create Viral Content</title>
      <meta name="description" content="Generate professional scripts for TikTok, YouTube Shorts, and Instagram Reels with AI powered by Claude 3.5 Sonnet" />
      
      {/* Aurora Background */}
      <AuroraBackground />

      {/* Browser Warning */}
      <BrowserWarning />

      {/* Toaster */}
      <Toaster />

      {/* User Header - Shows username, ID, credits, logout */}
      <UserHeader />

      {/* Main Content */}
      <main className="relative z-10 flex-1">
        {/* Header Logo - No animations */}
        <header
          className="fixed top-4 left-4 z-20 flex items-center gap-3"
          style={{ transform: 'translateZ(0)' }}
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div className="hidden sm:block">
            <h2 className="text-lg font-semibold text-foreground tracking-tight">
              ScriptAI
            </h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Powered by Claude
            </p>
          </div>
        </header>

        {/* Scenario Generator */}
        <GamificationProvider>
          <ScenarioGenerator 
            userId={user.lovable_id} 
            onShowRecovery={handleShowRecovery}
          />
        </GamificationProvider>
      </main>

      {/* Footer */}
      <Footer />

      {/* Recovery Modal */}
      <RecoveryModal
        isOpen={showRecoveryModal}
        onClose={handleHideRecovery}
        onRecover={handleRecover}
      />
    </div>
  );
});

Index.displayName = 'Index';

export default Index;
