import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="flex-1 max-w-2xl mx-auto px-6 py-16 w-full">
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
              We collect minimal data: your Telegram ID (for payments and account linking), 
              generation history, and credit balance. No additional personal information is required.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">How We Use It</h2>
            <p>
              Your data is used solely to provide the script generation service, 
              process payments, track your credits, and improve our AI models.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Payments</h2>
            <p>
              All payments are processed securely through{" "}
              <strong className="text-foreground">Cryptomus</strong>. 
              We do not store your payment details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Third Parties</h2>
            <p>
              We use OpenRouter for AI processing and Cryptomus for payments. 
              These services operate under their own privacy policies.
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
            <h2 className="text-lg font-semibold text-foreground mb-2">Support</h2>
            <p>
              Questions? Reach out to{" "}
              <a 
                href="https://t.me/Space2347D" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                @Space2347D
              </a>{" "}
              on Telegram.
            </p>
          </section>
        </div>

        <p className="text-sm text-muted-foreground/60 mt-12">
          Last updated: January 2026
        </p>
      </div>
      
      <Footer />
    </div>
  );
};

export default Privacy;
