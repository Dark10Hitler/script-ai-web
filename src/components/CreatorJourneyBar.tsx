import { memo } from "react";
import { Flame, Lock, Sparkles, Trophy, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CreatorJourneyBarProps {
  streak: number;
  currentXP: number;
  maxXP: number;
  level: number;
  rank: string;
  nextRank: string;
  showFloatingXP?: boolean;
  floatingXPAmount?: number;
}

export const CreatorJourneyBar = memo(({
  streak = 0,
  currentXP = 0,
  maxXP = 100,
  level = 1,
  rank = "Content Padawan",
  nextRank = "Script Architect",
  showFloatingXP = false,
  floatingXPAmount = 0,
}: CreatorJourneyBarProps) => {
  const progressPercent = Math.min((currentXP / maxXP) * 100, 100);
  const hasStreak = streak > 0;

  return (
    <div className="w-full glass-card-elevated border border-primary/20 rounded-2xl p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Streak Engine */}
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative" style={{ transform: 'translateZ(0)' }}>
                <div className={`
                  w-14 h-14 rounded-xl flex items-center justify-center
                  ${hasStreak 
                    ? "bg-gradient-to-br from-orange-500/30 to-red-500/30" 
                    : "bg-muted/50 border border-border"
                  }
                `}>
                  <Flame 
                    className={`w-7 h-7 ${hasStreak ? "text-orange-400" : "text-muted-foreground"}`} 
                    fill={hasStreak ? "currentColor" : "none"}
                  />
                </div>
                {hasStreak && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {streak}
                  </div>
                )}
              </div>
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
        <div className="flex items-center gap-4 flex-1 max-w-md relative">
          {/* Floating XP - CSS only */}
          {showFloatingXP && (
            <div className="absolute -top-8 right-1/2 translate-x-1/2 z-20 pointer-events-none">
              <span className="text-lg font-bold text-primary">
                +{floatingXPAmount} XP
              </span>
            </div>
          )}

          {/* Circular Progress Avatar - Static SVG */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative" style={{ transform: 'translateZ(0)' }}>
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="4"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 24}`}
                    strokeDashoffset={2 * Math.PI * 24 * (1 - progressPercent / 100)}
                    style={{ transition: 'stroke-dashoffset 0.3s ease' }}
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

          {/* XP Bar - CSS transitions */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-primary">{rank}</span>
              <span className="text-xs text-muted-foreground">Lvl {level}</span>
            </div>
            <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%`, transform: 'translateZ(0)' }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentXP}/{maxXP} XP to <span className="text-accent">{nextRank}</span>
            </p>
          </div>
        </div>

        {/* Mystery Chest - Static */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative cursor-pointer" style={{ transform: 'translateZ(0)' }}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                level >= 5 
                  ? "bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border border-yellow-500/40" 
                  : "bg-muted/30 border border-border"
              }`}>
                <Lock className={`w-5 h-5 ${level >= 5 ? "text-yellow-400" : "text-muted-foreground"}`} />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className={`w-4 h-4 ${level >= 5 ? "text-yellow-400" : "text-yellow-500/50"}`} />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="font-medium">🎁 Mystery Chest</p>
            <p className="text-xs text-muted-foreground">
              {level >= 5 ? "Ready to open!" : `Unlock at Level 5 (${5 - level} more)`}
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Leaderboard Link - Static */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to="/leaderboard">
              <div className="relative cursor-pointer" style={{ transform: 'translateZ(0)' }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center hover:border-primary/50 transition-colors">
                  <Crown className="w-5 h-5 text-primary" />
                </div>
              </div>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="font-medium">🏆 Leaderboard</p>
            <p className="text-xs text-muted-foreground">See top creators</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* No Streak CTA - Static */}
      {!hasStreak && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>Generate your first script today to start your streak!</span>
          </div>
        </div>
      )}
    </div>
  );
});

CreatorJourneyBar.displayName = 'CreatorJourneyBar';
