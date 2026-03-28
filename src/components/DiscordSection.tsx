import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageCircle } from "lucide-react";

const DiscordSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <section className="relative py-32 px-4" ref={ref}>
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-glow-blue/5 blur-[150px]" />

      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.92, rotateX: 10, filter: "blur(10px)" }}
          animate={inView
            ? { opacity: 1, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)" }
            : { opacity: 0, y: 60, scale: 0.92, rotateX: 10, filter: "blur(10px)" }
          }
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="glass-strong rounded-2xl p-10 text-center relative overflow-hidden"
          style={{ perspective: 800 }}
        >
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[2px] gradient-purple"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[60px] bg-glow-purple/10 blur-[40px]" />

          <motion.div
            className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-glow-purple/10 blur-[60px]"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-glow-blue/10 blur-[60px]"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />

          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block mb-6"
          >
            <div className="w-16 h-16 rounded-2xl gradient-purple flex items-center justify-center glow-purple">
              <MessageCircle className="w-8 h-8 text-primary-foreground" />
            </div>
          </motion.div>

          <motion.h2
            className="font-display text-3xl md:text-4xl font-bold gradient-text mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Join Our Community
          </motion.h2>
          <motion.p
            className="text-muted-foreground mb-8 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Connect with other players, get support, participate in events, and stay updated with the latest news.
          </motion.p>

          <motion.a
            href="https://discord.gg/wuXvSEDu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 gradient-purple px-8 py-4 rounded-lg font-display font-bold text-primary-foreground tracking-wider hover:scale-105 transition-transform glow-purple"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.97 }}
          >
            <MessageCircle className="w-5 h-5" />
            Join Discord
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default DiscordSection;
