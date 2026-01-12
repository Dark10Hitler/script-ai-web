import { useEffect, useRef, useState } from 'react';

interface AdUnitProps {
  className?: string;
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const AdUnit = ({ 
  className = '', 
  slot = '',
  format = 'auto',
  responsive = true
}: AdUnitProps) => {
  const adRef = useRef<HTMLModElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Wait for main content to load before initializing ads
    const initAd = () => {
      if (typeof window !== 'undefined' && window.adsbygoogle && adRef.current) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setIsLoaded(true);
        } catch (error) {
          console.log('AdSense error:', error);
        }
      }
    };

    // Delay ad initialization to prioritize main content
    const timer = setTimeout(() => {
      if (document.readyState === 'complete') {
        initAd();
      } else {
        window.addEventListener('load', initAd);
        return () => window.removeEventListener('load', initAd);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative my-6 ${className}`}>
      {/* Glassmorphism container */}
      <div className="glass-card rounded-xl p-4 border border-border/30 bg-background/20 backdrop-blur-sm">
        {/* Advertisement label */}
        <div className="absolute top-2 left-3 z-10">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">
            Advertisement
          </span>
        </div>
        
        {/* Ad container */}
        <div className="min-h-[100px] flex items-center justify-center pt-4">
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ 
              display: 'block',
              minHeight: '90px',
              width: '100%'
            }}
            data-ad-client="ca-pub-5239800749025669"
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive={responsive ? 'true' : 'false'}
          />
          
          {/* Placeholder when ad not loaded */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center pt-6">
              <div className="text-xs text-muted-foreground/40 font-mono">
                Ad Space
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdUnit;
