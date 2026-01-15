import { useState, useCallback, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, TrendingUp, Flame, Palette, ArrowRight, RefreshCw, Brain, Skull, Heart, Dumbbell, Coins, Sparkles, Mic, Shield } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TrendTopic {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  icon: React.ReactNode;
  prompt: string;
  category: "AI" | "Humor" | "Crypto" | "Drama" | "Lifestyle";
}

interface TrendRadarProps {
  onQuickGenerate: (prompt: string) => void;
}

// Large pool of 20 viral topics
const allTopics: TrendTopic[] = [
  {
    id: "1",
    title: "The AI Revolution Paradox",
    tag: "Tech",
    tagColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    icon: <Brain className="w-4 h-4" />,
    prompt: "Write a viral script about 'The AI Revolution Paradox' with a controversial hook that challenges viewers' assumptions about artificial intelligence taking over jobs. Include surprising statistics and a plot twist ending.",
    category: "AI",
  },
  {
    id: "2",
    title: "Why 9-5 is Dying",
    tag: "Business",
    tagColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    icon: <Flame className="w-4 h-4" />,
    prompt: "Write a viral script about 'Why the 9-5 is Dying' with a provocative opening that hooks viewers in the first 2 seconds. Use the 'Pattern Interrupt' technique and include real examples of people who escaped the corporate trap.",
    category: "Lifestyle",
  },
  {
    id: "3",
    title: "Cyberpunk Aesthetics",
    tag: "Art",
    tagColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    icon: <Palette className="w-4 h-4" />,
    prompt: "Write a viral script about 'Cyberpunk Aesthetics in 2024' focusing on the visual storytelling aspect. Include cinematic scene descriptions, neon color palettes, and futuristic sound design suggestions.",
    category: "Lifestyle",
  },
  {
    id: "4",
    title: "Bitcoin's Secret Pattern",
    tag: "Crypto",
    tagColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: <Coins className="w-4 h-4" />,
    prompt: "Write a viral script about 'Bitcoin's Hidden 4-Year Cycle Pattern' with a mysterious hook. Reveal the pattern step by step, building suspense. End with a bold prediction that will spark debate.",
    category: "Crypto",
  },
  {
    id: "5",
    title: "The Dark Side of Hustle Culture",
    tag: "Drama",
    tagColor: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: <Skull className="w-4 h-4" />,
    prompt: "Write a viral script exposing 'The Dark Side of Hustle Culture' with an emotional hook about burnout. Include a personal story angle and a redemption arc. Make viewers question their own habits.",
    category: "Drama",
  },
  {
    id: "6",
    title: "Why Your Brain Craves Drama",
    tag: "Psychology",
    tagColor: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    icon: <Brain className="w-4 h-4" />,
    prompt: "Write a viral script about 'Why Your Brain is Addicted to Drama' explaining the neuroscience behind gossip and conflict. Use a self-aware, slightly humorous tone that makes viewers feel 'called out'.",
    category: "Drama",
  },
  {
    id: "7",
    title: "Solana vs Ethereum War",
    tag: "Crypto",
    tagColor: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: <Coins className="w-4 h-4" />,
    prompt: "Write a viral script about 'The Solana vs Ethereum War of 2024' framed as an epic battle. Use dramatic sports-commentary style. Include technical details but make them accessible and exciting.",
    category: "Crypto",
  },
  {
    id: "8",
    title: "ASMR for Productivity",
    tag: "Wellness",
    tagColor: "bg-teal-500/20 text-teal-400 border-teal-500/30",
    icon: <Mic className="w-4 h-4" />,
    prompt: "Write a viral script about 'How ASMR Can 10x Your Focus' combining science with sensory descriptions. Include specific sound examples and a 'try this now' interactive element.",
    category: "Lifestyle",
  },
  {
    id: "9",
    title: "The True Crime Algorithm",
    tag: "Drama",
    tagColor: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: <Skull className="w-4 h-4" />,
    prompt: "Write a viral script about 'Why True Crime is Taking Over Your Feed' exploring the psychology of morbid curiosity. Use a meta, self-aware angle that acknowledges the irony.",
    category: "Drama",
  },
  {
    id: "10",
    title: "Biohacking Your Sleep",
    tag: "Health",
    tagColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: <Dumbbell className="w-4 h-4" />,
    prompt: "Write a viral script about 'The $0 Biohack That Changed My Sleep Forever' using a personal transformation narrative. Include specific actionable tips and before/after comparisons.",
    category: "Lifestyle",
  },
  {
    id: "11",
    title: "ChatGPT's Hidden Features",
    tag: "Tech",
    tagColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    icon: <Sparkles className="w-4 h-4" />,
    prompt: "Write a viral script revealing '5 ChatGPT Secrets Nobody Talks About' with a 'insider knowledge' tone. Each reveal should build on the last, ending with the most mind-blowing feature.",
    category: "AI",
  },
  {
    id: "12",
    title: "Toxic Positivity Exposed",
    tag: "Psychology",
    tagColor: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    icon: <Heart className="w-4 h-4" />,
    prompt: "Write a viral script about 'The Problem with Toxic Positivity' that validates negative emotions. Use a compassionate but direct tone. Include examples of phrases to avoid and what to say instead.",
    category: "Drama",
  },
  {
    id: "13",
    title: "NFTs Are Back (Quietly)",
    tag: "Crypto",
    tagColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: <Coins className="w-4 h-4" />,
    prompt: "Write a viral script about 'NFTs Are Quietly Making a Comeback' with a contrarian angle. Challenge the 'NFTs are dead' narrative with surprising data. Build intrigue before the reveal.",
    category: "Crypto",
  },
  {
    id: "14",
    title: "The Dopamine Detox Myth",
    tag: "Health",
    tagColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: <Brain className="w-4 h-4" />,
    prompt: "Write a viral script debunking 'Dopamine Detox' with actual neuroscience. Use a 'myth vs reality' format. Be respectful but firm in correcting misinformation.",
    category: "Lifestyle",
  },
  {
    id: "15",
    title: "AI Girlfriends Phenomenon",
    tag: "Tech",
    tagColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    icon: <Heart className="w-4 h-4" />,
    prompt: "Write a viral script about 'The Rise of AI Companions' exploring loneliness in the digital age. Balance curiosity with empathy. Avoid judgment while raising thoughtful questions.",
    category: "AI",
  },
  {
    id: "16",
    title: "Gym Bros vs Science",
    tag: "Fitness",
    tagColor: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: <Dumbbell className="w-4 h-4" />,
    prompt: "Write a viral script about 'Gym Advice That's Actually Wrong' debunking common fitness myths with humor. Use a 'roast' style that's playful, not mean. Include the correct alternatives.",
    category: "Humor",
  },
  {
    id: "17",
    title: "Privacy is Dead",
    tag: "Tech",
    tagColor: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: <Shield className="w-4 h-4" />,
    prompt: "Write a viral script about 'Your Phone is Listening (Proof)' with a paranoid but factual tone. Build suspense with specific examples. End with practical protection tips.",
    category: "Drama",
  },
  {
    id: "18",
    title: "Meme Coins Psychology",
    tag: "Crypto",
    tagColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: <Coins className="w-4 h-4" />,
    prompt: "Write a viral script about 'Why Meme Coins Keep Winning' analyzing the psychology of FOMO and community. Use self-aware humor while explaining the actual mechanics.",
    category: "Crypto",
  },
  {
    id: "19",
    title: "Side Hustles That Backfire",
    tag: "Business",
    tagColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    icon: <Flame className="w-4 h-4" />,
    prompt: "Write a viral script about 'Side Hustles That Actually Lose Money' with a cautionary but entertaining tone. Include real examples and the math behind why they fail.",
    category: "Humor",
  },
  {
    id: "20",
    title: "The Loneliness Epidemic",
    tag: "Society",
    tagColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: <Heart className="w-4 h-4" />,
    prompt: "Write a viral script about 'Why Everyone Feels Lonely Now' with empathy and data. Avoid toxic positivity. Offer genuine connection strategies that don't feel forced.",
    category: "Drama",
  },
];

// Generate radar data based on selected topics
const generateRadarData = (topics: TrendTopic[]) => {
  const baseData = [
    { subject: "AI", value: 40, fullMark: 100 },
    { subject: "Humor", value: 40, fullMark: 100 },
    { subject: "Crypto", value: 40, fullMark: 100 },
    { subject: "Drama", value: 40, fullMark: 100 },
    { subject: "Lifestyle", value: 40, fullMark: 100 },
  ];

  // Boost categories based on selected topics
  topics.forEach((topic) => {
    const categoryIndex = baseData.findIndex((d) => d.subject === topic.category);
    if (categoryIndex !== -1) {
      baseData[categoryIndex].value = Math.min(100, baseData[categoryIndex].value + 25);
    }
  });

  // Add some randomness
  return baseData.map((d) => ({
    ...d,
    value: Math.min(100, d.value + Math.floor(Math.random() * 15)),
  }));
};

// Get 3 random unique topics
const getRandomTopics = (exclude: string[] = []): TrendTopic[] => {
  const available = allTopics.filter((t) => !exclude.includes(t.id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
};

// Memoized topic card component
const TopicCard = memo(({ topic, index, onQuickGenerate }: { 
  topic: TrendTopic; 
  index: number; 
  onQuickGenerate: (prompt: string) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ 
      delay: index * 0.1,
      duration: 0.3,
      ease: "easeOut"
    }}
    // Removed 'layout' prop for GPU performance
    className="glass-card border border-border/50 hover:border-primary/30 rounded-xl p-4 transition-all duration-300 group will-change-transform"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 text-xs rounded-full border ${topic.tagColor}`}>
            {topic.tag}
          </span>
          {index === 0 && (
            <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full border border-red-500/30 flex items-center gap-1">
              <Flame className="w-3 h-3" /> Hot
            </span>
          )}
        </div>
        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
          {topic.icon}
          {topic.title}
        </h4>
      </div>
      <Button
        size="sm"
        onClick={() => onQuickGenerate(topic.prompt)}
        className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 gap-1 shrink-0"
      >
        <Zap className="w-3 h-3" />
        Quick Generate
        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Button>
    </div>
  </motion.div>
));

TopicCard.displayName = 'TopicCard';

// Memoized radar chart component
const RadarChartSection = memo(({ radarData }: { radarData: any[] }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.3 }}
    className="glass-card border border-primary/20 rounded-2xl p-4"
  >
    <h3 className="text-sm font-medium text-muted-foreground mb-2">Trend Intensity Radar</h3>
    <div className="h-[220px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid 
            stroke="hsl(var(--border))" 
            strokeOpacity={0.3}
          />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Trends"
            dataKey="value"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
      {/* Animated pulse overlay - GPU accelerated */}
      <motion.div
        className="absolute inset-0 rounded-full border border-primary/20 pointer-events-none will-change-transform"
        style={{ margin: "auto", width: "60%", height: "60%", transform: "translateZ(0)" }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  </motion.div>
));

RadarChartSection.displayName = 'RadarChartSection';

export const TrendRadar = memo(({ onQuickGenerate }: TrendRadarProps) => {
  const [currentTopics, setCurrentTopics] = useState<TrendTopic[]>(() => getRandomTopics());
  const [radarData, setRadarData] = useState(() => generateRadarData(currentTopics));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const { toast } = useToast();

  const handleRefresh = useCallback(() => {
    if (cooldown) return;

    setIsRefreshing(true);
    setCooldown(true);

    // Show loading toast
    toast({
      title: "🔍 Analyzing Global Trends...",
      description: "Scanning viral patterns across platforms.",
    });

    // Simulate API delay
    setTimeout(() => {
      const excludeIds = currentTopics.map((t) => t.id);
      const newTopics = getRandomTopics(excludeIds);
      setCurrentTopics(newTopics);
      setRadarData(generateRadarData(newTopics));
      setIsRefreshing(false);

      toast({
        title: "✨ New Trends Loaded!",
        description: "Fresh viral topics ready for generation.",
      });
    }, 800);

    // Cooldown timer
    setTimeout(() => {
      setCooldown(false);
    }, 2000);
  }, [cooldown, currentTopics, toast]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full mb-8"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="will-change-transform"
            style={{ transform: "translateZ(0)" }}
          >
            <Zap className="w-5 h-5 text-yellow-400" />
          </motion.div>
          <h2 className="text-lg font-semibold text-foreground">TODAY'S VIRAL FORECAST</h2>
          <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full border border-red-500/30 animate-pulse">
            LIVE
          </span>
        </div>

        {/* Refresh Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={cooldown}
          className={`
            gap-2 backdrop-blur-md bg-background/30 border border-border/50 
            hover:bg-primary/10 hover:border-primary/30 transition-all
            ${cooldown ? "cursor-not-allowed opacity-50" : ""}
          `}
        >
          <motion.div
            animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="will-change-transform"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.div>
          <span className="hidden sm:inline">Refresh Intelligence</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Radar Chart */}
        <RadarChartSection radarData={radarData} />

        {/* Topic Cards with AnimatePresence */}
        <div className="flex flex-col gap-3 overflow-hidden">
          <AnimatePresence mode="sync">
            {currentTopics.map((topic, index) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                index={index}
                onQuickGenerate={onQuickGenerate}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
});

TrendRadar.displayName = 'TrendRadar';
