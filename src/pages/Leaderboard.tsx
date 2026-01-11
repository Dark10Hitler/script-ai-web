import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, Zap, FileText, Crown, Medal, Award, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuroraBackground from '@/components/AuroraBackground';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface LeaderboardEntry {
  id: string;
  user_id: string;
  display_name: string | null;
  level: number;
  total_xp: number;
  streak: number;
  scripts_generated: number;
}

type SortBy = 'xp' | 'level' | 'scripts';

const getRank = (level: number): string => {
  if (level >= 11) return 'Algorithm God';
  if (level >= 8) return 'Viral Lord';
  if (level >= 4) return 'Script Architect';
  return 'Content Padawan';
};

const getRankColor = (level: number): string => {
  if (level >= 11) return 'text-purple-400';
  if (level >= 8) return 'text-yellow-400';
  if (level >= 4) return 'text-primary';
  return 'text-muted-foreground';
};

const getPositionIcon = (position: number) => {
  switch (position) {
    case 1:
      return <Crown className="w-6 h-6 text-yellow-400 fill-yellow-400/20" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-300" />;
    case 3:
      return <Award className="w-6 h-6 text-amber-600" />;
    default:
      return <span className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">#{position}</span>;
  }
};

const LeaderboardSkeleton = () => (
  <div className="space-y-3">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="glass-card rounded-xl p-4 flex items-center gap-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
    ))}
  </div>
);

const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>('xp');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLeaderboard = async () => {
    setIsRefreshing(true);
    try {
      const orderColumn = sortBy === 'xp' ? 'total_xp' : sortBy === 'level' ? 'level' : 'scripts_generated';
      
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .order(orderColumn, { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return;
      }

      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [sortBy]);

  // Real-time subscription for live updates
  useEffect(() => {
    const channel = supabase
      .channel('leaderboard-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_stats',
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sortBy]);

  const sortOptions: { key: SortBy; label: string; icon: React.ReactNode }[] = [
    { key: 'xp', label: 'Total XP', icon: <Zap className="w-4 h-4" /> },
    { key: 'level', label: 'Level', icon: <Trophy className="w-4 h-4" /> },
    { key: 'scripts', label: 'Scripts', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AuroraBackground />

      <main className="relative z-10 p-4 md:p-8 pt-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <Link
              to="/"
              className="p-2 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-bold text-foreground">
                <span className="text-primary neon-text">Creator</span> Leaderboard
              </h1>
              <p className="text-sm text-muted-foreground">Top creators ranked by performance</p>
            </div>
            <motion.button
              onClick={fetchLeaderboard}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/50 transition-colors disabled:opacity-50"
              animate={isRefreshing ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: 'linear' }}
            >
              <RefreshCw className="w-5 h-5 text-foreground" />
            </motion.button>
          </motion.div>

          {/* Sort Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-2 mb-6 p-1 glass-card rounded-xl"
          >
            {sortOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setSortBy(option.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                  sortBy === option.key
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                {option.icon}
                <span className="hidden sm:inline">{option.label}</span>
              </button>
            ))}
          </motion.div>

          {/* Leaderboard List */}
          {isLoading ? (
            <LeaderboardSkeleton />
          ) : entries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-12 text-center"
            >
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No creators yet</h3>
              <p className="text-muted-foreground mb-6">Be the first to generate a script and claim the top spot!</p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                <Zap className="w-5 h-5" />
                Start Creating
              </Link>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div className="space-y-3">
                {entries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                    className={`glass-card rounded-xl p-4 flex items-center gap-4 border ${
                      index === 0 
                        ? 'border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)]' 
                        : index === 1 
                        ? 'border-gray-400/30' 
                        : index === 2 
                        ? 'border-amber-600/30' 
                        : 'border-border/50'
                    }`}
                  >
                    {/* Position */}
                    <div className="w-10 h-10 flex items-center justify-center">
                      {getPositionIcon(index + 1)}
                    </div>

                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${
                      index === 0 
                        ? 'bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border border-yellow-500/40' 
                        : 'bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20'
                    }`}>
                      {entry.display_name?.charAt(0).toUpperCase() || entry.user_id.substring(5, 7).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground truncate">
                          {entry.display_name || `Creator ${entry.user_id.substring(5, 13)}`}
                        </p>
                        {entry.streak > 0 && (
                          <div className="flex items-center gap-1 text-orange-400">
                            <Flame className="w-4 h-4" fill="currentColor" />
                            <span className="text-xs font-medium">{entry.streak}</span>
                          </div>
                        )}
                      </div>
                      <p className={`text-sm ${getRankColor(entry.level)}`}>
                        Lvl {entry.level} • {getRank(entry.level)}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      {sortBy === 'xp' && (
                        <div className="flex items-center gap-1 text-primary">
                          <Zap className="w-4 h-4" />
                          <span className="font-bold">{entry.total_xp.toLocaleString()}</span>
                        </div>
                      )}
                      {sortBy === 'level' && (
                        <div className="flex items-center gap-1 text-primary">
                          <Trophy className="w-4 h-4" />
                          <span className="font-bold">Level {entry.level}</span>
                        </div>
                      )}
                      {sortBy === 'scripts' && (
                        <div className="flex items-center gap-1 text-primary">
                          <FileText className="w-4 h-4" />
                          <span className="font-bold">{entry.scripts_generated}</span>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {sortBy !== 'scripts' && `${entry.scripts_generated} scripts`}
                        {sortBy === 'scripts' && `${entry.total_xp.toLocaleString()} XP`}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
