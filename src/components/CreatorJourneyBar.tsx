import { motion } from "framer-motion";
import { Flame, Lock, Sparkles, Trophy } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface CreatorJourneyBarProps {
  streak: number;
  currentXP: number;
  maxXP: number;
  level: number;
  rank: string;
  nextRank: string;
  onGenerateXP?: () => void;
}

export const CreatorJourneyBar = ({
  streak = 3,
  currentXP = 350,
  maxXP = 500,
  level = 4,
  rank = "Content Padawan",
  nextRank = "Viral Lord",
}: CreatorJourneyBarProps) => {
  const progressPercent = (currentXP / maxXP) * 100;
  const hasStreak = streak > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full glass-card-elevated border border-primary/20 rounded-2xl p-4 mb-6"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Streak Engine */}
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                className="relative"
                animate={hasStreak ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className={`
                  w-14 h-14 rounded-xl flex items-center justify-center
                  ${hasStreak 
                    ? "bg-gradient-to-br from-orange-500/30 to-red-500/30 shadow-[0_0_25px_rgba(249,115,22,0.4)]" 
                    : "bg-muted/50 border border-border"
                  }
                `}>
                  <Flame 
                    className={`w-7 h-7 ${hasStreak ? "text-orange-400" : "text-muted-foreground"}`} 
                    fill={hasStreak ? "currentColor" : "none"}
                  />
                </div>
                {hasStreak && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    {streak}
                  </motion.div>
                )}
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[200px] text-center">
              {hasStreak 
                ? "Come back tomorrow to keep the fire burning! (+10 Bonus Credits)" 
                : "Generate your first script to start a streak!"
              }
            </TooltipContent>
          </Tooltip>

          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">
              {hasStreak ? `${streak} Day Streak` : "No Streak Yet"}
            </p>
            <p className="text-xs text-muted-foreground">
              {hasStreak ? "Keep the momentum!" : "Start generating!"}
            </p>
          </div>
        </div>

        {/* Level & XP Progress */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          {/* Circular Progress Avatar */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="4"
                  />
                  <motion.circle
                    cx="28"
                    cy="28"
                    r="24"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 24}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 24 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 24 * (1 - progressPercent / 100) }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="drop-shadow-[0_0_6px_hsl(var(--primary))]"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center border border-primary/30">
                    <Trophy className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>Level {level} - {rank}</TooltipContent>
          </Tooltip>

          {/* XP Bar */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-primary">{rank}</span>
              <span className="text-xs text-muted-foreground">Lvl {level}</span>
            </div>
            <div className="relative">
              <Progress value={progressPercent} className="h-2 bg-muted/50" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentXP}/{maxXP} XP to <span className="text-accent">{nextRank}</span>
            </p>
          </div>
        </div>

        {/* Mystery Chest */}
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              className="relative cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-12 h-12 rounded-xl bg-muted/30 border border-border flex items-center justify-center">
                <Lock className="w-5 h-5 text-muted-foreground" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </motion.div>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="font-medium">🎁 Mystery Chest</p>
            <p className="text-xs text-muted-foreground">Unlock at Level 5</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* No Streak CTA */}
      {!hasStreak && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 pt-4 border-t border-border/50"
        >
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>Generate your first script today to start your streak!</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
