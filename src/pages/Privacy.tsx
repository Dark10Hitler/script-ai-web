import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to App
        </Link>

        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Data We Collect</h2>
            <p>
              We collect only what's necessary: your anonymous user ID (stored locally), 
              generation history, and credit balance. No personal information is required.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">How We Use It</h2>
            <p>
              Your data is used solely to provide the script generation service, 
              track your credits, and improve our AI models.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Third Parties</h2>
            <p>
              We use OpenRouter for AI processing and Cryptomus for payments. 
              These services have their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Your Rights</h2>
            <p>
              You can clear your local data anytime by clearing browser storage. 
              For account deletion requests, contact us via Telegram.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Contact</h2>
            <p>
              Questions? Reach out via our{" "}
              <a 
                href="https://t.me/CreatorScriptBot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Telegram Bot
              </a>.
            </p>
          </section>
        </div>

        <p className="text-sm text-muted-foreground/60 mt-12">
          Last updated: January 2025
        </p>
      </div>
    </div>
  );
};

export default Privacy;
