import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check, Sparkles } from "lucide-react";

interface Rank {
  name: string;
  price: string;
  features: string[];
  badge?: string;
}

const ranks: Rank[] = [
  {
    name: "ELITE",
    price: "$2.99",
    features: [
      "5 claim blocks weekly",
      "2x Lottery Crate Key",
      "+1 home",
      "+200 Coins",
      "Up to 10 auction slots",
    ],
  },
  {
    name: "LOADING+",
    price: "$4.99",
    badge: "Popular",
    features: [
      "12 claim blocks weekly",
      "Earn coins in overworld",
      "Reduced jail time (-25%)",
      "+3 homes",
      "1x Quad Spawner Crate Key",
      "Fly in the lobby",
      "1.2x job multiplier",
      "1x Netherite Crate Key",
      "+300 coin",
      "Up to 20 auction slots",
      "1x Exlusive Cosmetic"
    ],
  },
  {
    name: "LOADED+",
    price: "$9.99",
    badge: "Best Value",
    features: [
      "20 claim blocks weekly",
      "Earn coins anywhere",
      "Reduced jail time (-50%)",
      "1x Quad Spawner Crate Key",
      "+3 homes",
      "Fly in the lobby",
      "Hide nametag",
      "1.7x job multiplier",
      "2x Netherite Crate Key",
      "Acces to your enderchest anywhere (/ec)",
      "1x Exclusive cosmetics",
      "Quick Buy",
      "Up to 30 auction slots",
      "1x Exlusive Emote"
    ],
  },
];

const RankStore = ({
  onSelectRank,
  isLoggedIn,
  onOpenCustomRole,
}: {
  onSelectRank: (rank: Rank) => void;
  isLoggedIn: boolean;
  onOpenCustomRole: () => void;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="store" className="relative py-32 px-4" ref={ref}>
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-glow-purple/5 blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-glow-blue/5 blur-[120px]" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-4">Rank Store</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Choose your rank and unlock premium features</p>
          <div className="w-24 h-1 gradient-purple mx-auto rounded-full mt-4" />
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6 lg:gap-8 items-start">
          {ranks.map((rank, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <motion.div
                key={rank.name}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.2 }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`relative rounded-2xl p-[1px] transition-all duration-500 ${
                  isHovered ? "gradient-purple glow-purple scale-[1.05]" : "hover:scale-[1.02]"
                }`}
              >
                {rank.badge && (
                  <motion.div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-purple px-4 py-1 rounded-full text-xs font-display font-bold text-primary-foreground tracking-wider z-10"
                    animate={{ y: [0, -4, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {rank.badge}
                  </motion.div>
                )}
                <div className={`glass-strong rounded-2xl p-8 h-full flex flex-col transition-all duration-500 ${isHovered ? "py-10" : ""}`}>
                  <h3 className="font-display text-2xl font-bold text-foreground mb-1">{rank.name}</h3>
                  <div className="mb-6">
                    <span className="font-display text-4xl font-black gradient-text">{rank.price}</span>
                    <span className="text-muted-foreground text-sm ml-1">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {rank.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-glow-purple mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => onSelectRank(rank)}
                    className={`w-full py-3 rounded-lg font-display font-bold tracking-wider transition-all duration-500 ${
                      isHovered
                        ? "gradient-purple text-primary-foreground glow-purple hover:scale-105"
                        : "glass text-foreground hover:border-glow-purple/40"
                    }`}
                  >
                    {isLoggedIn ? "Buy Now" : "Login to Buy"}
                  </button>
                </div>
              </motion.div>
            );
          })}

          {/* Custom Role Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            onMouseEnter={() => setHoveredIndex(3)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`relative rounded-2xl p-[1px] transition-all duration-500 ${
              hoveredIndex === 3 ? "gradient-purple glow-purple scale-[1.05]" : "hover:scale-[1.02]"
            }`}
          >
            <motion.div
              className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-purple px-4 py-1 rounded-full text-xs font-display font-bold text-primary-foreground tracking-wider z-10"
              animate={{ y: [0, -4, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Custom
            </motion.div>
            <div className={`glass-strong rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center transition-all duration-500 min-h-[400px] ${hoveredIndex === 3 ? "py-10" : ""}`}>
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="mb-6"
              >
                <div className="w-16 h-16 rounded-2xl gradient-purple flex items-center justify-center glow-purple">
                  <Sparkles className="w-8 h-8 text-primary-foreground" />
                </div>
              </motion.div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">Custom Role</h3>
              <p className="text-sm text-muted-foreground mb-2">Build your own unique rank for one MONTH</p>
              <div className="mb-6">
                <span className="text-muted-foreground text-sm">Starting at </span>
                <span className="font-display text-3xl font-black gradient-text">$1.99</span>
              </div>
              <ul className="space-y-2 mb-8 text-left w-full">
                {["Custom name (5 chars)", "Pick your features", "Choose a unique design", "Individual pricing"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 text-glow-purple mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={onOpenCustomRole}
                className={`w-full py-3 rounded-lg font-display font-bold tracking-wider transition-all duration-500 ${
                  hoveredIndex === 3
                    ? "gradient-purple text-primary-foreground glow-purple hover:scale-105"
                    : "glass text-foreground hover:border-glow-purple/40"
                }`}
              >
                {isLoggedIn ? "Order Custom Role" : "Login to Order"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RankStore;
export type { Rank };
