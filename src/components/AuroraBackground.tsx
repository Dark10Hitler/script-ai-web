import { motion } from "framer-motion";

const AuroraBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient - Black to Deep Purple Mesh */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 10%, hsl(280 80% 15% / 0.8), transparent 50%),
            radial-gradient(ellipse 60% 50% at 80% 20%, hsl(270 60% 12% / 0.6), transparent 50%),
            radial-gradient(ellipse 70% 70% at 50% 90%, hsl(280 50% 8% / 0.8), transparent 50%),
            linear-gradient(180deg, hsl(0 0% 0%) 0%, hsl(270 50% 5%) 50%, hsl(280 40% 8%) 100%)
          `,
        }}
      />
      
      {/* Aurora layers */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Primary neon cyan aurora */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[60vw] h-[60vh] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, hsl(185 100% 50% / 0.08), transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -30, 50, 0],
            scale: [1, 1.1, 0.95, 1],
            opacity: [0.3, 0.5, 0.4, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Secondary purple aurora */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-[50vw] h-[50vh] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, hsl(280 80% 50% / 0.08), transparent 70%)",
            filter: "blur(120px)",
          }}
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 40, -20, 0],
            scale: [1, 0.95, 1.1, 1],
            opacity: [0.2, 0.4, 0.3, 0.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Mesh gradient overlay */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 30% 70%, hsl(280 60% 40% / 0.05), transparent 40%),
              radial-gradient(circle at 70% 30%, hsl(185 100% 50% / 0.03), transparent 40%)
            `,
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Subtle grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(185 100% 50%) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(185 100% 50%) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </motion.div>

      {/* Vignette effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 50%, transparent 10%, hsl(270 50% 3%) 100%)",
        }}
      />
    </div>
  );
};

export default AuroraBackground;
