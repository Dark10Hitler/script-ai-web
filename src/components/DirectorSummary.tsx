import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Gauge, Download, FileText, Loader2, TrendingUp, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { HookVariant, StoryboardScene } from '@/lib/aiResponseParser';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface DirectorSummaryProps {
  hooks: HookVariant[];
  scenes: StoryboardScene[];
  userId: string;
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

  const rotation = (animatedScore / 100) * 180 - 90; // -90 to 90 degrees
  
  return (
    <div className="relative w-48 h-28 mx-auto">
      {/* Glow effect */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 rounded-full blur-3xl opacity-50"
        style={{ 
          background: animatedScore >= 80 ? '#10B981' : animatedScore >= 60 ? '#06B6D4' : '#8B5CF6'
        }}
      />
      
      {/* Semi-circle gauge */}
      <svg className="w-full h-full" viewBox="0 0 200 110">
        {/* Background arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="12"
          strokeLinecap="round"
          opacity={0.3}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="50%" stopColor="hsl(var(--accent))" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
        
        {/* Progress arc */}
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
        
        {/* Needle */}
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
      
      {/* Score display */}
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
  
  // Calculate average retention score
  const avgRetention = hooks.length > 0 
    ? Math.round(hooks.reduce((sum, h) => sum + h.retentionForecast, 0) / hooks.length)
    : 75;
  
  // Calculate impact score based on hooks and scenes
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
      let yOffset = margin;

      // Header with logo and branding
      pdf.setFillColor(5, 5, 5);
      pdf.rect(0, 0, pageWidth, 40, 'F');
      
      pdf.setTextColor(139, 92, 246);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ScriptAI', margin, 20);
      
      pdf.setTextColor(150, 150, 150);
      pdf.setFontSize(10);
      pdf.text('Production Plan', margin, 28);
      
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(8);
      pdf.text(`User ID: ${userId}`, pageWidth - margin - 60, 20);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin - 60, 26);
      
      yOffset = 50;

      // Impact Score Section
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PRODUCTION OVERVIEW', margin, yOffset);
      
      yOffset += 10;
      pdf.setFontSize(12);
      pdf.setTextColor(139, 92, 246);
      pdf.text(`Total Impact Score: ${impactScore}/100`, margin, yOffset);
      
      yOffset += 8;
      pdf.setTextColor(150, 150, 150);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Average Retention: ${avgRetention}% | ${hooks.length} Hook Variants | ${scenes.length} Scenes`, margin, yOffset);

      yOffset += 15;

      // Hook Matrix Section
      pdf.setTextColor(6, 182, 212);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('VIRAL HOOK MATRIX', margin, yOffset);
      yOffset += 8;

      hooks.forEach((hook, index) => {
        if (yOffset > pageHeight - 40) {
          pdf.addPage();
          yOffset = margin;
        }

        pdf.setTextColor(200, 200, 200);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Variant ${['A', 'B', 'C'][index]}: ${hook.title}`, margin, yOffset);
        yOffset += 6;

        pdf.setTextColor(150, 150, 150);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        const hookLines = pdf.splitTextToSize(`"${hook.hookText}"`, pageWidth - margin * 2);
        pdf.text(hookLines, margin, yOffset);
        yOffset += hookLines.length * 4 + 2;

        pdf.setTextColor(139, 92, 246);
        pdf.text(`Retention: ${hook.retentionForecast}%`, margin, yOffset);
        yOffset += 10;
      });

      yOffset += 5;

      // Storyboard Section
      pdf.setTextColor(6, 182, 212);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DIRECTOR\'S STORYBOARD', margin, yOffset);
      yOffset += 10;

      scenes.forEach((scene, index) => {
        if (yOffset > pageHeight - 60) {
          pdf.addPage();
          yOffset = margin;
        }

        // Scene header
        pdf.setFillColor(20, 20, 25);
        pdf.rect(margin - 2, yOffset - 5, pageWidth - margin * 2 + 4, 8, 'F');
        
        pdf.setTextColor(139, 92, 246);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`SCENE ${scene.scene}`, margin, yOffset);
        if (scene.timing) {
          pdf.setTextColor(100, 100, 100);
          pdf.setFontSize(9);
          pdf.text(scene.timing, margin + 30, yOffset);
        }
        yOffset += 8;

        // Visual
        pdf.setTextColor(6, 182, 212);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text('VISUAL:', margin, yOffset);
        pdf.setTextColor(180, 180, 180);
        pdf.setFont('helvetica', 'normal');
        const visualLines = pdf.splitTextToSize(scene.visual, pageWidth - margin * 2 - 20);
        pdf.text(visualLines, margin + 20, yOffset);
        yOffset += visualLines.length * 4 + 4;

        // Audio
        pdf.setTextColor(139, 92, 246);
        pdf.setFont('helvetica', 'bold');
        pdf.text('AUDIO:', margin, yOffset);
        pdf.setTextColor(180, 180, 180);
        pdf.setFont('helvetica', 'normal');
        const audioLines = pdf.splitTextToSize(scene.audio, pageWidth - margin * 2 - 20);
        pdf.text(audioLines, margin + 20, yOffset);
        yOffset += audioLines.length * 4 + 4;

        // AI Prompt
        pdf.setTextColor(16, 185, 129);
        pdf.setFont('helvetica', 'bold');
        pdf.text('AI PROMPT:', margin, yOffset);
        yOffset += 4;
        
        pdf.setFillColor(10, 10, 10);
        const promptLines = pdf.splitTextToSize(scene.aiPrompt, pageWidth - margin * 2 - 4);
        pdf.rect(margin, yOffset - 3, pageWidth - margin * 2, promptLines.length * 4 + 6, 'F');
        
        pdf.setTextColor(200, 200, 200);
        pdf.setFontSize(8);
        pdf.setFont('courier', 'normal');
        pdf.text(promptLines, margin + 2, yOffset + 1);
        yOffset += promptLines.length * 4 + 12;
      });

      // Footer
      pdf.setTextColor(80, 80, 80);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Generated by ScriptAI - Powered by Claude 3.5 Sonnet', margin, pageHeight - 10);

      // Save PDF
      pdf.save(`Script_Plan_${userId.substring(0, 8)}.pdf`);
      
      toast({
        title: '✓ PDF Downloaded',
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
      {/* Production Overview Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-[rgba(15,15,20,0.9)] to-[rgba(10,10,15,0.95)]">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center border border-primary/20">
              <Gauge className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground tracking-tight">PRODUCTION OVERVIEW</h2>
              <p className="text-sm text-muted-foreground">AI-generated content strategy analysis</p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Impact Gauge */}
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Total Impact Score</h3>
              <ImpactGauge score={impactScore} />
            </div>

            {/* Stats */}
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

            {/* AI Summary & Download */}
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
