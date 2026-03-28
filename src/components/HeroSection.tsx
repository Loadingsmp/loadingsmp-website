import { motion } from "framer-motion";
import FloatingCube from "./FloatingCube";
import PlayNowButton from "./PlayNowButton";
import logo from "@/assets/logo.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-glow-purple/8 blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-glow-blue/5 blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Floating cubes */}
      <FloatingCube size={60} x="10%" y="20%" delay={0} color="purple" opacity={0.2} />
      <FloatingCube size={40} x="82%" y="15%" delay={1} color="blue" opacity={0.15} />
      <FloatingCube size={80} x="88%" y="60%" delay={2} color="purple" opacity={0.1} duration={8} />
      <FloatingCube size={30} x="12%" y="72%" delay={0.5} color="blue" opacity={0.15} />
      <FloatingCube size={50} x="50%" y="82%" delay={1.5} color="purple" opacity={0.1} />
      <FloatingCube size={25} x="72%" y="30%" delay={3} color="blue" opacity={0.2} />
      <FloatingCube size={45} x="28%" y="8%" delay={2.5} color="purple" opacity={0.15} />

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        {/* Logo only - bigger */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <motion.img
            src={logo}
            alt="LoadingSMP Logo"
            className="w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 mx-auto drop-shadow-[0_0_60px_hsla(270,80%,60%,0.5)]"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto mb-10 font-body"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Build your empire. Dominate the SMP.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <PlayNowButton size="lg" />
          <a
            href="#store"
            className="glass px-8 py-4 rounded-lg font-display font-bold text-foreground tracking-wider hover:scale-105 transition-transform"
          >
            View Store
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 mx-auto flex items-start justify-center p-1.5">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-glow-purple"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
