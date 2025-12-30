import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";
import { useState } from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  index: number;
}

const ChatMessage = ({ role, content, index }: ChatMessageProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05,
        ease: [0.25, 0.1, 0.25, 1] 
      }}
      className={`relative flex ${isUser ? "justify-end" : "justify-start"} mb-6`}
    >
      {isUser ? (
        // User message - right aligned with glow bar
        <div className="flex items-start gap-4 max-w-[80%] md:max-w-[70%]">
          <div className="relative">
            <p className="text-foreground text-right text-lg leading-relaxed font-light text-glow">
              {content}
            </p>
          </div>
          {/* Glow bar */}
          <div className="w-1 min-h-full rounded-full user-glow-bar flex-shrink-0" />
        </div>
      ) : (
        // Assistant message - left aligned with glassmorphism on hover
        <motion.div
          className="relative max-w-[85%] md:max-w-[75%]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Glassmorphism background */}
          <motion.div
            className="absolute -inset-4 rounded-2xl glass-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          <div className="relative prose prose-invert prose-lg max-w-none">
            <ReactMarkdown
              components={{
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const isInline = !match && !className;
                  
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
                    <CodeBlock 
                      language={match ? match[1] : "text"}
                      value={String(children).replace(/\n$/, "")}
                    />
                  );
                },
                p({ children }) {
                  return (
                    <p className="text-foreground/90 leading-relaxed mb-4 last:mb-0">
                      {children}
                    </p>
                  );
                },
                h1({ children }) {
                  return (
                    <h1 className="text-2xl font-semibold text-foreground mb-4 mt-6 first:mt-0">
                      {children}
                    </h1>
                  );
                },
                h2({ children }) {
                  return (
                    <h2 className="text-xl font-semibold text-foreground mb-3 mt-5 first:mt-0">
                      {children}
                    </h2>
                  );
                },
                h3({ children }) {
                  return (
                    <h3 className="text-lg font-medium text-foreground mb-2 mt-4 first:mt-0">
                      {children}
                    </h3>
                  );
                },
                ul({ children }) {
                  return (
                    <ul className="list-disc list-outside ml-5 mb-4 space-y-1 text-foreground/90">
                      {children}
                    </ul>
                  );
                },
                ol({ children }) {
                  return (
                    <ol className="list-decimal list-outside ml-5 mb-4 space-y-1 text-foreground/90">
                      {children}
                    </ol>
                  );
                },
                li({ children }) {
                  return <li className="leading-relaxed">{children}</li>;
                },
                strong({ children }) {
                  return <strong className="font-semibold text-foreground">{children}</strong>;
                },
                em({ children }) {
                  return <em className="italic text-foreground/80">{children}</em>;
                },
                blockquote({ children }) {
                  return (
                    <blockquote className="border-l-2 border-primary/50 pl-4 italic text-muted-foreground my-4">
                      {children}
                    </blockquote>
                  );
                },
                a({ href, children }) {
                  return (
                    <a 
                      href={href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
                    >
                      {children}
                    </a>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
