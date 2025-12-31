import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const ChatInput = ({ onSend, isLoading, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  }, [input]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-6 px-4 pointer-events-none">
      {/* Gradient fade */}
      <div 
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to top, hsl(0 0% 4%) 50%, transparent)",
        }}
      />
      
      <form 
        onSubmit={handleSubmit}
        className="relative max-w-3xl mx-auto pointer-events-auto"
      >
        <motion.div 
          className="input-capsule rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Loading breathing effect */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ 
                  opacity: 1, 
                  scaleX: 1,
                }}
                exit={{ opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="h-full w-full bg-gradient-to-r from-transparent via-primary to-transparent"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scaleX: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-end gap-3 p-3">
            {/* Expert Mode indicator */}
            <div className="flex items-center gap-2 flex-shrink-0 mb-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-emerald-500"
                animate={{
                  boxShadow: [
                    "0 0 4px 1px rgba(16, 185, 129, 0.4)",
                    "0 0 8px 2px rgba(16, 185, 129, 0.6)",
                    "0 0 4px 1px rgba(16, 185, 129, 0.4)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-[10px] uppercase tracking-wider text-emerald-500/70 font-medium hidden sm:inline">
                Expert Mode
              </span>
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send a message..."
              disabled={isLoading || disabled}
              rows={1}
              className="flex-1 bg-transparent border-0 outline-none resize-none text-foreground placeholder:text-muted-foreground text-base leading-relaxed min-h-[24px] max-h-[200px] disabled:opacity-50"
              style={{ scrollbarWidth: "none" }}
            />

            {/* Send button */}
            <motion.button
              type="submit"
              disabled={!input.trim() || isLoading || disabled}
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors mb-0.5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Hint text */}
        <motion.p 
          className="text-center text-xs text-muted-foreground/50 mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Press Enter to send, Shift + Enter for new line
        </motion.p>
      </form>
    </div>
  );
};

export default ChatInput;
