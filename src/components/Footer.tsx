import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          {/* Left - Copyright */}
          <p className="order-2 sm:order-1">
            © 2026 ScriptAI. Powered by AI.
          </p>

          {/* Center - Legal Links */}
          <nav className="order-1 sm:order-2 flex items-center gap-4">
            <Link 
              to="/privacy" 
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-white/20">•</span>
            <Link 
              to="/terms" 
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </nav>

          {/* Right - Support */}
          <a
            href="https://t.me/Space2347D"
            target="_blank"
            rel="noopener noreferrer"
            className="order-3 inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
