import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Sparkles } from "lucide-react";

import butterflyWings from "@/assets/cosmetics/butterfly-wings.png";
import fireWings from "@/assets/cosmetics/fire-wings.png";
import duckHat from "@/assets/cosmetics/duck-hat.png";
import frogCompanion from "@/assets/cosmetics/frog-companion.png";
import frogHat from "@/assets/cosmetics/frog-hat.png";
import goosePet from "@/assets/cosmetics/goose-pet.png";
import fireflyAura from "@/assets/cosmetics/firefly-aura.png";
import samuraiArmor from "@/assets/cosmetics/samurai-armor.png";
import lightningCape from "@/assets/cosmetics/lightning-cape.png";

export interface Cosmetic {
  name: string;
  price: string;
  image: string;
  category: string;
}

const cosmetics: Cosmetic[] = [
  { name: "Butterfly Wings", price: "$3.99", image: butterflyWings, category: "Wings" },
  { name: "Fire Wings", price: "$4.99", image: fireWings, category: "Wings" },
  { name: "Duck Hat", price: "$1.99", image: duckHat, category: "Hat" },
  { name: "Frog Companion", price: "$2.99", image: frogCompanion, category: "Pet" },
  { name: "Frog Hat", price: "$1.99", image: frogHat, category: "Hat" },
  { name: "Goose Pet", price: "$2.49", image: goosePet, category: "Pet" },
  { name: "Firefly Aura", price: "$3.49", image: fireflyAura, category: "Aura" },
  { name: "Samurai Armor", price: "$5.99", image: samuraiArmor, category: "Armor" },
  { name: "Lightning Cape", price: "$4.49", image: lightningCape, category: "Cape" },
  { name: "Mystery Box", price: "$1.49", image: fireflyAura, category: "Special" },
];

const CosmeticsSection = ({
  onSelectCosmetic,
  isLoggedIn,
}: {
  onSelectCosmetic: (cosmetic: Cosmetic) => void;
  isLoggedIn: boolean;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="cosmetics" className="relative py-32 px-4" ref={ref}>
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-glow-blue/5 blur-[150px]" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full bg-glow-purple/5 blur-[120px]" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 10 }}
          animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 40, rotateX: 10 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
          style={{ perspective: 800 }}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-6 h-6 text-glow-purple" />
            </motion.div>
            <span className="text-sm font-display font-bold text-glow-purple tracking-widest uppercase">New</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-4">Cosmetics Store</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Stand out with exclusive hats, wings, pets, and more</p>
          <div className="w-24 h-1 gradient-purple mx-auto rounded-full mt-4" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {cosmetics.map((item, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 50, rotateY: -10 }}
                animate={inView
                  ? { opacity: 1, y: 0, rotateY: 0 }
                  : { opacity: 0, y: 50, rotateY: -10 }
                }
                transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`relative rounded-2xl p-[1px] transition-all duration-500 cursor-pointer ${
                  isHovered ? "gradient-purple glow-purple scale-[1.08]" : "hover:scale-[1.03]"
                }`}
                style={{ perspective: 600, transformStyle: "preserve-3d" }}
                onClick={() => isLoggedIn ? onSelectCosmetic(item) : document.getElementById("login-section")?.scrollIntoView({ behavior: "smooth" })}
              >
                <div className="glass-strong rounded-2xl p-4 h-full flex flex-col items-center text-center">
                  <div className="relative w-full aspect-square mb-3 flex items-center justify-center overflow-hidden rounded-xl">
                    <motion.img
                      src={item.image}
                      alt={item.name}
                      className="w-4/5 h-4/5 object-contain drop-shadow-[0_0_20px_hsla(270,80%,60%,0.3)]"
                      animate={isHovered ? { y: [0, -8, 0], scale: 1.1 } : { y: [0, -4, 0], scale: 1 }}
                      transition={{ duration: isHovered ? 1.5 : 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent rounded-xl" />
                  </div>

                  <span className="text-xs text-muted-foreground font-body mb-1">{item.category}</span>
                  <h4 className="font-display font-bold text-sm text-foreground mb-1">{item.name}</h4>
                  <span className="font-display font-black text-lg gradient-text">{item.price}</span>

                  <motion.button
                    className={`w-full mt-3 py-2 rounded-lg text-xs font-display font-bold tracking-wider transition-all duration-500 ${
                      isHovered
                        ? "gradient-purple text-primary-foreground glow-purple"
                        : "glass text-foreground"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isLoggedIn ? "Buy Now" : "Login to Buy"}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CosmeticsSection;
