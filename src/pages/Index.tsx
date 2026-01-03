import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import AuroraBackground from "@/components/AuroraBackground";
import { ScenarioGenerator } from "@/components/ScenarioGenerator";
import { BrowserWarning } from "@/components/BrowserWarning";
import { RecoveryModal } from "@/components/RecoveryModal";
import { BalanceProvider } from "@/contexts/BalanceContext";
import { useUserId } from "@/hooks/useUserId";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const { userId, needsRecovery, recoverAccount, showRecovery, hideRecovery } = useUserId();
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  const handleShowRecovery = () => setShowRecoveryModal(true);
  const handleHideRecovery = () => setShowRecoveryModal(false);
  const handleRecover = (id: string) => {
    recoverAccount(id);
    handleHideRecovery();
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* SEO */}
      <title>AI Script Generator - Create Viral Content</title>
      <meta name="description" content="Generate professional scripts for TikTok, YouTube Shorts, and Instagram Reels with AI powered by Claude 3.5 Sonnet" />
      
      {/* Aurora Background */}
      <AuroraBackground />

      {/* Browser Warning */}
      <BrowserWarning />

      {/* Toaster */}
      <Toaster />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Header Logo */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-4 z-20 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_20px_hsl(185_100%_50%/0.15)]">
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
        </motion.header>

        {/* Scenario Generator */}
        {userId ? (
          <BalanceProvider userId={userId}>
            <ScenarioGenerator 
              userId={userId} 
              onShowRecovery={handleShowRecovery}
            />
          </BalanceProvider>
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <p className="text-muted-foreground">Initializing...</p>
            </motion.div>
          </div>
        )}
      </main>

      {/* Recovery Modal */}
      <RecoveryModal
        isOpen={showRecoveryModal}
        onClose={handleHideRecovery}
        onRecover={handleRecover}
      />
    </div>
  );
};

export default Index;
