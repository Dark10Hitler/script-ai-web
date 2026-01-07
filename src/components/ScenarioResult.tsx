import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Sparkles } from 'lucide-react';
import CodeBlock from './CodeBlock';

interface ScenarioResultProps {
  content: string;
  hideStructuredBlocks?: boolean;
}

// Filter out structured blocks (БЛОК 1, 2, 3) and raw markdown tables
const filterContent = (content: string): string => {
  let filtered = content;
  
  // Remove БЛОК 1 section (hooks)
  filtered = filtered.replace(/БЛОК\s*1[:\s]*.*?(?=БЛОК\s*2|$)/gis, '');
  
  // Remove БЛОК 2 section (storyboard table)
  filtered = filtered.replace(/БЛОК\s*2[:\s]*.*?(?=БЛОК\s*3|Copy-Paste|$)/gis, '');
  
  // Remove БЛОК 3 section (master prompt)
  filtered = filtered.replace(/БЛОК\s*3[:\s]*.*/gis, '');
  
  // Remove "Copy-Paste for AI Agent" blocks
  filtered = filtered.replace(/Copy-Paste\s+(for\s+)?AI\s+Agent[:\s]*.*/gis, '');
  
  // Remove standalone markdown tables (lines with |)
  filtered = filtered.replace(/^\|.*\|$/gm, '');
  filtered = filtered.replace(/^\|[-:\s|]+\|$/gm, '');
  
  // Remove VIRAL HOOK MATRIX header if present
  filtered = filtered.replace(/#+\s*VIRAL HOOK MATRIX.*/gi, '');
  filtered = filtered.replace(/VIRAL HOOK MATRIX.*/gi, '');
  
  // Remove DIRECTOR'S STORYBOARD header if present
  filtered = filtered.replace(/#+\s*DIRECTOR['']?S STORYBOARD.*/gi, '');
  filtered = filtered.replace(/DIRECTOR['']?S STORYBOARD.*/gi, '');
  
  // Remove UNIVERSAL AI AGENT BLUEPRINT header if present
  filtered = filtered.replace(/#+\s*UNIVERSAL AI AGENT BLUEPRINT.*/gi, '');
  filtered = filtered.replace(/🚀\s*UNIVERSAL AI AGENT BLUEPRINT.*/gi, '');
  
  // Remove Variant A/B/C blocks
  filtered = filtered.replace(/Variant\s+[ABC][:\s]+.+?(?=Variant\s+[ABC]|БЛОК|$)/gis, '');
  
  // Clean up excessive whitespace and empty lines
  filtered = filtered.replace(/\n{3,}/g, '\n\n');
  filtered = filtered.trim();
  
  return filtered;
};

export const ScenarioResult = ({ content, hideStructuredBlocks = true }: ScenarioResultProps) => {
  const displayContent = hideStructuredBlocks ? filterContent(content) : content;
  
  // Don't render if content is empty after filtering
  if (!displayContent || displayContent.length < 20) {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 mt-6"
    >
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border/50">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Generated Scenario</h3>
      </div>

      <div className="prose prose-invert max-w-none">
        <ReactMarkdown
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const isInline = !match;

              if (isInline) {
                return (
                  <code
                    className="px-1.5 py-0.5 rounded bg-muted text-primary font-mono text-sm"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              return (
                <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
              );
            },
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold text-foreground mt-6 mb-4">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold text-foreground mt-5 mb-3">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-medium text-foreground mt-4 mb-2">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="text-foreground/90 leading-relaxed mb-4">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-2 mb-4 text-foreground/90">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-2 mb-4 text-foreground/90">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="text-foreground/90">{children}</li>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-primary">{children}</strong>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-primary/50 pl-4 italic text-muted-foreground my-4">
                {children}
              </blockquote>
            ),
            // Hide table elements since we render them as styled components
            table: () => null,
            thead: () => null,
            tbody: () => null,
            tr: () => null,
            th: () => null,
            td: () => null,
          }}
        >
          {displayContent}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
};
