import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import AuroraBackground from "@/components/AuroraBackground";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import Toast from "@/components/Toast";
import { sendMessage, Message } from "@/lib/openrouter";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (content: string) => {
    const userMessage: Message = { role: "user", content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessage(newMessages);
      const assistantMessage: Message = { role: "assistant", content: response };
      setMessages([...newMessages, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* SEO */}
      <title>AuraChat - AI Interface</title>
      <meta name="description" content="AuraChat - A cyber-organic minimalist AI chat interface powered by GPT-4o" />
      
      {/* Aurora Background */}
      <AuroraBackground />

      {/* Error Toast */}
      <Toast 
        message={error || ""} 
        isVisible={!!error} 
        onClose={() => setError(null)} 
      />

      {/* Main Content */}
      <main className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <header className="flex-shrink-0 pt-8 pb-4 px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground tracking-tight">
                  AuraChat
                </h1>
                <p className="text-xs text-muted-foreground">
                  Powered by GPT-4o
                </p>
              </div>
            </div>
            
            {/* Analytical Engine Badge */}
            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
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
              <span className="text-[10px] uppercase tracking-wider text-emerald-500 font-medium">
                Analytical Engine Active
              </span>
            </motion.div>
          </motion.div>
        </header>

        {/* Chat Area */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-6 pb-40"
        >
          <div className="max-w-3xl mx-auto py-8">
            <AnimatePresence mode="popLayout">
              {messages.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center justify-center min-h-[50vh] text-center"
                >
                  <motion.div
                    className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 flex items-center justify-center mb-6"
                    animate={{
                      boxShadow: [
                        "0 0 30px hsl(187 94% 43% / 0.1)",
                        "0 0 50px hsl(263 70% 58% / 0.15)",
                        "0 0 30px hsl(160 84% 39% / 0.1)",
                        "0 0 30px hsl(187 94% 43% / 0.1)",
                      ],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Sparkles className="w-10 h-10 text-primary" />
                  </motion.div>
                  <h2 className="text-2xl font-medium text-foreground mb-3">
                    Start a conversation
                  </h2>
                  <p className="text-muted-foreground max-w-md leading-relaxed">
                    Ask me anything. I'm here to help with code, ideas, explanations, or just a friendly chat.
                  </p>
                </motion.div>
              ) : (
                messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    role={message.role}
                    content={message.content}
                    index={index}
                  />
                ))
              )}
            </AnimatePresence>

            {/* Loading indicator */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 text-muted-foreground mt-6"
                >
                  <motion.div
                    className="flex gap-1"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span className="w-2 h-2 rounded-full bg-primary/60" />
                    <motion.span 
                      className="w-2 h-2 rounded-full bg-primary/60"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.span 
                      className="w-2 h-2 rounded-full bg-primary/60"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                    />
                  </motion.div>
                  <span className="text-sm">Thinking...</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <ChatInput 
          onSend={handleSend} 
          isLoading={isLoading} 
        />
      </main>
    </div>
  );
};

export default Index;
