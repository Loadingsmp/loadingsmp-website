import { motion } from "framer-motion";

interface FloatingCubeProps {
  size: number;
  x: string;
  y: string;
  delay?: number;
  duration?: number;
  opacity?: number;
  color?: "purple" | "blue";
}

const FloatingCube = ({ size, x, y, delay = 0, duration = 6, opacity = 0.3, color = "purple" }: FloatingCubeProps) => {
  const bg = color === "purple"
    ? "bg-glow-purple/20 border-glow-purple/30"
    : "bg-glow-blue/20 border-glow-blue/30";

  const shadow = color === "purple"
    ? "shadow-[0_0_20px_hsla(270,80%,60%,0.3)]"
    : "shadow-[0_0_20px_hsla(220,80%,60%,0.3)]";

  return (
    <motion.div
      className={`absolute ${bg} border rounded-lg ${shadow}`}
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        opacity,
      }}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 10, -5, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
};

export default FloatingCube;
