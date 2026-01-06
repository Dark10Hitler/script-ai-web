import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Gauge, Download, Loader2, TrendingUp, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

// Local interfaces to avoid circular imports
interface HookVariant {
  type: 'aggressive' | 'intriguing' | 'visual';
  title: string;
  hookText: string;
  retentionForecast: number;
  mechanism: string;
}

interface StoryboardScene {
  scene: number;
  timing: string;
  visual: string;
  audio: string;
  sfx: string;
  aiPrompt: string;
}

interface DirectorSummaryProps {
  hooks: HookVariant[];
  scenes: StoryboardScene[];
  userId: string;
}

// Transliterate Cyrillic to Latin for PDF compatibility
function transliterate(text: string): string {
  const map: { [key: string]: string } = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
    'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
    'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
    'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
    'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
    '«': '"', '»': '"', '—': '-', '–': '-'
  };
  
  return text.split('').map(char => map[char] || char).join('');
}

// Safe text for PDF - removes or replaces unsupported characters
function safePdfText(text: string): string {
  if (!text) return '';
  // First transliterate Cyrillic
  let safe = transliterate(text);
  // Remove any remaining non-ASCII characters
  safe = safe.replace(/[^\x00-\x7F]/g, '');
  // Clean up extra spaces
  safe = safe.replace(/\s+/g, ' ').trim();
  return safe;
}

const ImpactGauge = ({ score }: { score: number }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setAnimatedScore(Math.round(score * eased));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [score]);

  const rotation = (animatedScore / 100) * 180 - 90;
  
  return (
    <div className="relative w-48 h-28 mx-auto">
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 rounded-full blur-3xl opacity-50"
        style={{ 
          background: animatedScore >= 80 ? '#10B981' : animatedScore >= 60 ? '#06B6D4' : '#8B5CF6'
        }}
      />
      
      <svg className="w-full h-full" viewBox="0 0 200 110">
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="12"
          strokeLinecap="round"
          opacity={0.3}
        />
        
        <defs>
          <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="50%" stopColor="hsl(var(--accent))" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
        
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#gauge-gradient)"
          strokeWidth="12"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: animatedScore / 100 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        
        <motion.g
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{ transformOrigin: '100px 100px' }}
        >
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="35"
            stroke="hsl(var(--foreground))"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="8" fill="hsl(var(--foreground))" />
        </motion.g>
      </svg>
      
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
        <span className="text-4xl font-black text-foreground tabular-nums">{animatedScore}</span>
        <span className="text-lg text-muted-foreground">/100</span>
      </div>
    </div>
  );
};

export const DirectorSummary = ({ hooks, scenes, userId }: DirectorSummaryProps) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const avgRetention = hooks.length > 0 
    ? Math.round(hooks.reduce((sum, h) => sum + h.retentionForecast, 0) / hooks.length)
    : 75;
  
  const impactScore = Math.min(100, Math.round(
    (avgRetention * 0.6) + 
    (scenes.length * 5) + 
    (hooks.length * 5)
  ));

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let yOffset = margin;

      // Helper function to add new page if needed
      const checkPageBreak = (neededSpace: number) => {
        if (yOffset + neededSpace > pageHeight - 20) {
          pdf.addPage();
          yOffset = margin;
          return true;
        }
        return false;
      };

      // ========== HEADER ==========
      pdf.setFillColor(8, 8, 12);
      pdf.rect(0, 0, pageWidth, 45, 'F');
      
      // Brand
      pdf.setTextColor(139, 92, 246);
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ScriptAI', margin, 22);
      
      pdf.setTextColor(120, 120, 130);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text('PRODUCTION PLAN', margin, 32);
      
      // Metadata
      pdf.setTextColor(100, 100, 110);
      pdf.setFontSize(9);
      pdf.text(`ID: ${userId.substring(0, 12)}...`, pageWidth - margin - 50, 22);
      pdf.text(`Date: ${new Date().toLocaleDateString('en-US')}`, pageWidth - margin - 50, 30);
      
      yOffset = 55;

      // ========== OVERVIEW SECTION ==========
      pdf.setFillColor(15, 15, 20);
      pdf.roundedRect(margin, yOffset - 5, contentWidth, 35, 3, 3, 'F');
      
      pdf.setTextColor(139, 92, 246);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PRODUCTION OVERVIEW', margin + 5, yOffset + 5);
      
      // Stats row
      pdf.setFontSize(24);
      pdf.setTextColor(255, 255, 255);
      pdf.text(`${impactScore}`, margin + 5, yOffset + 22);
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 110);
      pdf.text('/100 Impact Score', margin + 25, yOffset + 22);
      
      pdf.setFontSize(16);
      pdf.setTextColor(6, 182, 212);
      pdf.text(`${avgRetention}%`, margin + 80, yOffset + 22);
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 110);
      pdf.text('Avg. Retention', margin + 100, yOffset + 22);
      
      pdf.setFontSize(16);
      pdf.setTextColor(16, 185, 129);
      pdf.text(`${hooks.length}/${scenes.length}`, margin + 155, yOffset + 22);
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 110);
      pdf.text('Hooks/Scenes', margin + 172, yOffset + 22);
      
      yOffset += 45;

      // ========== HOOK MATRIX ==========
      pdf.setTextColor(6, 182, 212);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('VIRAL HOOK MATRIX', margin, yOffset);
      yOffset += 10;

      hooks.forEach((hook, index) => {
        checkPageBreak(40);
        
        // Hook card background
        pdf.setFillColor(12, 12, 18);
        pdf.roundedRect(margin, yOffset - 3, contentWidth, 32, 2, 2, 'F');
        
        // Variant badge
        const colors: [number, number, number][] = [[239, 68, 68], [139, 92, 246], [6, 182, 212]];
        pdf.setFillColor(...colors[index]);
        pdf.roundedRect(margin + 3, yOffset, 25, 6, 1, 1, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'bold');
        pdf.text(['A', 'B', 'C'][index], margin + 12, yOffset + 4.5);
        
        // Title
        pdf.setTextColor(200, 200, 210);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(safePdfText(hook.title), margin + 32, yOffset + 5);
        
        // Retention badge
        pdf.setTextColor(16, 185, 129);
        pdf.setFontSize(10);
        pdf.text(`${hook.retentionForecast}%`, pageWidth - margin - 20, yOffset + 5);
        
        // Hook text
        pdf.setTextColor(180, 180, 190);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'italic');
        const hookLines = pdf.splitTextToSize(`"${safePdfText(hook.hookText)}"`, contentWidth - 10);
        pdf.text(hookLines.slice(0, 2), margin + 5, yOffset + 13);
        
        // Mechanism
        pdf.setTextColor(100, 100, 110);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        const mechLines = pdf.splitTextToSize(safePdfText(hook.mechanism), contentWidth - 10);
        pdf.text(mechLines.slice(0, 1), margin + 5, yOffset + 25);
        
        yOffset += 38;
      });

      yOffset += 10;

      // ========== STORYBOARD ==========
      checkPageBreak(20);
      pdf.setTextColor(139, 92, 246);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text("DIRECTOR'S STORYBOARD", margin, yOffset);
      yOffset += 12;

      scenes.forEach((scene) => {
        checkPageBreak(55);
        
        // Scene card background
        pdf.setFillColor(12, 12, 18);
        pdf.roundedRect(margin, yOffset - 3, contentWidth, 50, 2, 2, 'F');
        
        // Scene number circle
        pdf.setFillColor(139, 92, 246);
        pdf.circle(margin + 10, yOffset + 7, 7, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(String(scene.scene), margin + 8, yOffset + 10);
        
        // Timing
        pdf.setTextColor(100, 100, 110);
        pdf.setFontSize(8);
        pdf.text(safePdfText(scene.timing), margin + 22, yOffset + 5);
        
        // Visual section
        pdf.setTextColor(6, 182, 212);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.text('VISUAL:', margin + 22, yOffset + 12);
        pdf.setTextColor(180, 180, 190);
        pdf.setFont('helvetica', 'normal');
        const visualLines = pdf.splitTextToSize(safePdfText(scene.visual), contentWidth - 30);
        pdf.text(visualLines.slice(0, 2), margin + 40, yOffset + 12);
        
        // Audio section
        pdf.setTextColor(139, 92, 246);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.text('AUDIO:', margin + 22, yOffset + 24);
        pdf.setTextColor(180, 180, 190);
        pdf.setFont('helvetica', 'normal');
        const audioLines = pdf.splitTextToSize(safePdfText(scene.audio), contentWidth - 30);
        pdf.text(audioLines.slice(0, 2), margin + 40, yOffset + 24);
        
        // AI Prompt box
        pdf.setFillColor(5, 5, 8);
        pdf.roundedRect(margin + 5, yOffset + 32, contentWidth - 10, 14, 1, 1, 'F');
        pdf.setTextColor(16, 185, 129);
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'bold');
        pdf.text('AI PROMPT:', margin + 8, yOffset + 38);
        pdf.setTextColor(160, 160, 170);
        pdf.setFont('courier', 'normal');
        pdf.setFontSize(7);
        const promptLines = pdf.splitTextToSize(safePdfText(scene.aiPrompt), contentWidth - 45);
        pdf.text(promptLines.slice(0, 2).join(' '), margin + 32, yOffset + 38);
        
        yOffset += 56;
      });

      // ========== FOOTER ==========
      const lastPage = pdf.getNumberOfPages();
      for (let i = 1; i <= lastPage; i++) {
        pdf.setPage(i);
        pdf.setTextColor(60, 60, 70);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Generated by ScriptAI | Page ${i} of ${lastPage}`, margin, pageHeight - 8);
        pdf.text('Powered by Claude 3.5 Sonnet', pageWidth - margin - 45, pageHeight - 8);
      }

      // Save PDF
      pdf.save(`Script_Plan_${userId.substring(0, 8)}.pdf`);
      
      toast({
        title: 'PDF Downloaded',
        description: 'Your production plan has been saved',
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: 'PDF Generation Failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-8"
      ref={contentRef}
    >
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-[rgba(15,15,20,0.9)] to-[rgba(10,10,15,0.95)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center border border-primary/20">
              <Gauge className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground tracking-tight">PRODUCTION OVERVIEW</h2>
              <p className="text-sm text-muted-foreground">AI-generated content strategy analysis</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Total Impact Score</h3>
              <ImpactGauge score={impactScore} />
            </div>

            <div className="flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/30">
                <TrendingUp className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{avgRetention}%</p>
                  <p className="text-xs text-muted-foreground">Avg. Retention</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/30">
                <Zap className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{hooks.length} / {scenes.length}</p>
                  <p className="text-xs text-muted-foreground">Hooks / Scenes</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div className="p-4 rounded-xl bg-background/50 border border-border/30 mb-4">
                <p className="text-sm text-foreground/90 leading-relaxed">
                  <span className="text-primary font-semibold">AI Analysis:</span> High-retention hooks combined with cinematic scene transitions. This content structure is optimized for maximum algorithmic reach.
                </p>
              </div>
              
              <motion.button
                onClick={generatePDF}
                disabled={isGeneratingPDF}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glow-button w-full py-3.5 rounded-xl text-primary-foreground font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGeneratingPDF ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Preparing PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Download Production Plan</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
