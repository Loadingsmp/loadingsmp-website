import { motion } from "framer-motion";

interface PlayNowButtonProps {
  href?: string;
  size?: "sm" | "lg";
  className?: string;
}

const PlayNowButton = ({ href = "#store", size = "lg", className = "" }: PlayNowButtonProps) => {
  const sizeClasses = size === "lg"
    ? "px-8 py-4 text-base"
    : "px-5 py-2 text-sm";

  return (
    <a href={href} className={`relative inline-block group ${className}`}>
      {/* Orbiting neon border */}
      <div className="absolute -inset-[2px] rounded-xl overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            background: "conic-gradient(from 0deg, transparent 0%, hsl(270 80% 60%) 10%, hsl(220 80% 60%) 20%, transparent 30%)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
        {/* Second counter-rotating strip */}
        <motion.div
          className="absolute inset-0 opacity-60"
          style={{
            background: "conic-gradient(from 180deg, transparent 0%, hsl(270 80% 70%) 8%, hsl(220 80% 70%) 16%, transparent 24%)",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Glow pulse behind */}
      <motion.div
        className="absolute -inset-1 rounded-xl bg-glow-purple/20 blur-md"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Button face */}
      <div
        className={`relative z-10 rounded-xl font-display font-bold tracking-wider text-primary-foreground ${sizeClasses}`}
        style={{
          background: "linear-gradient(135deg, hsl(270 60% 20%), hsl(260 50% 12%))",
        }}
      >
        <span className="relative z-10 drop-shadow-[0_0_8px_hsla(270,80%,60%,0.6)]">
          Play Now
        </span>
      </div>

      {/* Hover lightning flicker */}
      <motion.div
        className="absolute -inset-2 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: "0 0 20px hsla(270,80%,60%,0.5), 0 0 40px hsla(270,80%,60%,0.3), 0 0 60px hsla(220,80%,60%,0.2)",
        }}
      />
    </a>
  );
};

export default PlayNowButton;
