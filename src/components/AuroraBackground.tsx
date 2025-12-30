import { motion } from "framer-motion";

const AuroraBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Aurora layers */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Primary cyan aurora */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[60vw] h-[60vh] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, hsl(187 94% 43% / 0.15), transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -30, 50, 0],
            scale: [1, 1.1, 0.95, 1],
            opacity: [0.4, 0.6, 0.5, 0.4],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Secondary violet aurora */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-[50vw] h-[50vh] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, hsl(263 70% 58% / 0.12), transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 40, -20, 0],
            scale: [1, 0.95, 1.1, 1],
            opacity: [0.3, 0.5, 0.4, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Tertiary emerald aurora */}
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-[40vw] h-[40vh] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, hsl(160 84% 39% / 0.08), transparent 70%)",
            filter: "blur(90px)",
          }}
          animate={{
            x: [0, 30, -50, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.05, 0.98, 1],
            opacity: [0.2, 0.4, 0.3, 0.2],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Subtle mesh overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(0 0% 50%) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(0 0% 50%) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </motion.div>

      {/* Vignette effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 20%, hsl(0 0% 4%) 100%)",
        }}
      />
    </div>
  );
};

export default AuroraBackground;
