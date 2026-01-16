import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const Terms = () => {
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

        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Service Description</h2>
            <p>
              ScriptAI provides AI-powered script generation for content creators. 
              Our service uses advanced language models to help you create scripts 
              for TikTok, YouTube Shorts, Instagram Reels, and other platforms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Credits & Payments</h2>
            <p>
              Credits are digital tokens used to generate scripts. Payments are processed 
              securely through Cryptomus. All credit purchases are final — 
              <strong className="text-foreground"> no refunds</strong> are provided for 
              digital credits once purchased.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Age Requirement</h2>
            <p>
              You must be <strong className="text-foreground">18 years or older</strong> to 
              use this service and make purchases. By using ScriptAI, you confirm that 
              you meet this age requirement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Content Ownership</h2>
            <p>
              Scripts generated through our service are yours to use. However, you are 
              responsible for ensuring your use of generated content complies with 
              applicable laws and platform guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Limitation of Liability</h2>
            <p>
              ScriptAI is provided "as is" without warranties. We are not liable for 
              any damages arising from your use of generated scripts or the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Contact</h2>
            <p>
              For questions or support, contact us at{" "}
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

export default Terms;
