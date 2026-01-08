import { motion } from "framer-motion";
import { Zap, TrendingUp, Flame, Palette, ArrowRight } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";

interface TrendTopic {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  icon: React.ReactNode;
  prompt: string;
}

interface TrendRadarProps {
  onQuickGenerate: (prompt: string) => void;
}

const radarData = [
  { subject: "AI", value: 92, fullMark: 100 },
  { subject: "Humor", value: 78, fullMark: 100 },
  { subject: "Crypto", value: 65, fullMark: 100 },
  { subject: "Drama", value: 85, fullMark: 100 },
  { subject: "Lifestyle", value: 70, fullMark: 100 },
];

const trendTopics: TrendTopic[] = [
  {
    id: "1",
    title: "The AI Revolution Paradox",
    tag: "Tech",
    tagColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    icon: <TrendingUp className="w-4 h-4" />,
    prompt: "Write a viral script about 'The AI Revolution Paradox' with a controversial hook that challenges viewers' assumptions about artificial intelligence taking over jobs. Include surprising statistics and a plot twist ending.",
  },
  {
    id: "2",
    title: "Why 9-5 is Dying",
    tag: "Business",
    tagColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    icon: <Flame className="w-4 h-4" />,
    prompt: "Write a viral script about 'Why the 9-5 is Dying' with a provocative opening that hooks viewers in the first 2 seconds. Use the 'Pattern Interrupt' technique and include real examples of people who escaped the corporate trap.",
  },
  {
    id: "3",
    title: "Cyberpunk Aesthetics",
    tag: "Art",
    tagColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    icon: <Palette className="w-4 h-4" />,
    prompt: "Write a viral script about 'Cyberpunk Aesthetics in 2024' focusing on the visual storytelling aspect. Include cinematic scene descriptions, neon color palettes, and futuristic sound design suggestions. Make it visually stunning for AI video generation.",
  },
];

export const TrendRadar = ({ onQuickGenerate }: TrendRadarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full mb-8"
    >
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Zap className="w-5 h-5 text-yellow-400" />
        </motion.div>
        <h2 className="text-lg font-semibold text-foreground">TODAY'S VIRAL FORECAST</h2>
        <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full border border-red-500/30 animate-pulse">
          LIVE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Radar Chart */}
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
            {/* Animated pulse overlay */}
            <motion.div
              className="absolute inset-0 rounded-full border border-primary/20 pointer-events-none"
              style={{ margin: "auto", width: "60%", height: "60%" }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* Topic Cards */}
        <div className="flex flex-col gap-3">
          {trendTopics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="glass-card border border-border/50 hover:border-primary/30 rounded-xl p-4 transition-all duration-300 group"
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
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
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
          ))}
        </div>
      </div>
    </motion.div>
  );
};
