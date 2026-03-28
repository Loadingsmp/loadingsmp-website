import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <section className="relative py-32 px-4" ref={ref}>
      <div className="absolute top-0 left-1/3 w-[400px] h-[400px] rounded-full bg-glow-purple/5 blur-[150px]" />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 8 }}
          animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 40, rotateX: 8 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
          style={{ perspective: 800 }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-4">About LoadingSMP</h2>
          <div className="w-24 h-1 gradient-purple mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: "Survival Reimagined", desc: "A premium SMP experience with, economy, jobs, and weekly events that keep the world alive." },
            { title: "Community First", desc: "Join hundreds of players building, trading, and competing. Our active staff ensures a fair and fun environment." },
            { title: "Custom Features", desc: "Spawner crates, auctions, custom cosmetics, drills, and a deep progression system you won't find anywhere else." },
            { title: "Always Online", desc: "99.9% uptime with dedicated hardware. Low latency, zero lag, and regular updates every week." },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30, rotateY: i % 2 === 0 ? -8 : 8, filter: "blur(6px)" }}
              animate={inView
                ? { opacity: 1, y: 0, rotateY: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 30, rotateY: i % 2 === 0 ? -8 : 8, filter: "blur(6px)" }
              }
              transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease: "easeOut" }}
              className="glass rounded-xl p-6 hover:scale-[1.03] transition-all duration-500"
              style={{ perspective: 600, transformStyle: "preserve-3d" }}
              whileHover={{ rotateY: 3, rotateX: -2 }}
            >
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
