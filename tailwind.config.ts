import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        aurora: {
          cyan: "hsl(var(--aurora-cyan))",
          violet: "hsl(var(--aurora-violet))",
          emerald: "hsl(var(--aurora-emerald))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 16px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "aurora-pulse": {
          "0%, 100%": { 
            opacity: "0.4",
            transform: "scale(1) rotate(0deg)",
          },
          "33%": { 
            opacity: "0.6",
            transform: "scale(1.05) rotate(1deg)",
          },
          "66%": { 
            opacity: "0.5",
            transform: "scale(0.98) rotate(-1deg)",
          },
        },
        "aurora-drift": {
          "0%, 100%": { 
            transform: "translate(0, 0)",
          },
          "25%": { 
            transform: "translate(5%, -3%)",
          },
          "50%": { 
            transform: "translate(-3%, 5%)",
          },
          "75%": { 
            transform: "translate(-5%, -5%)",
          },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "breathe": {
          "0%, 100%": {
            opacity: "0.4",
            transform: "scaleX(0.95)",
          },
          "50%": {
            opacity: "1",
            transform: "scaleX(1)",
          },
        },
        "shimmer": {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "aurora-pulse": "aurora-pulse 8s ease-in-out infinite",
        "aurora-drift": "aurora-drift 15s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.4s ease-out",
        "breathe": "breathe 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "glow-primary": "0 0 40px hsl(var(--primary) / 0.3)",
        "glow-secondary": "0 0 40px hsl(var(--secondary) / 0.3)",
        "glow-accent": "0 0 40px hsl(var(--accent) / 0.3)",
        "inner-glow": "inset 0 1px 0 hsl(0 0% 100% / 0.05)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
