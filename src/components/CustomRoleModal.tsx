import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Check, Sparkles, Palette } from "lucide-react";

import design1 from "@/assets/designs/design1.png";
import design2 from "@/assets/designs/design2.png";
import design3 from "@/assets/designs/design3.png";
import design4 from "@/assets/designs/design4.png";
import design5 from "@/assets/designs/design5.png";
import design6 from "@/assets/designs/design6.png";
import design7 from "@/assets/designs/design7.png";
import design8 from "@/assets/designs/design8.png";
import design9 from "@/assets/designs/design9.png";
import design10 from "@/assets/designs/design10.png";

interface Feature {
  id: string;
  name: string;
  price: number;
}

interface Design {
  id: string;
  name: string;
  image: string;
  price: number;
}

const features: Feature[] = [
  { id: "ec_command", name: "/ec (acces to your enderchest)", price: 1.99 },
  { id: "fly_lobby", name: "Fly in Lobby", price: 0.49 },
  { id: "hide_name", name: "Hide your Nametag", price: 0.99 },
  { id: "extra_home", name: "+5 Extra Home", price: 1.99},
  { id: "claim_blocks", name: "40 Claim Blocks Weekly", price: 2.49 },
  { id: "coin_boost", name: "1.5x Coin Multiplier", price: 1.99 },
  { id: "job_boost", name: "2x Job Multiplier", price: 2.49 },
  { id: "cosmetics", name: "Exclusive Cosmetics", price: 1.99 },
  { id: "auction", name: "20 Auction Slots", price: 1.49 },
  { id: "quick_buy", name: "Quick Buy Access", price: 0.99 },
  { id: "no_jail", name: "No Jail", price: 1.29 },
  { id: "crate_key", name: "1x Quad Spawner Crate Key", price: 2.99 },
  { id: "invis", name: "Be invisible at spawn", price: 1.99 },
  { id: "lottery_crate", name: "10x Lottery Crate Key", price: 4.99 },
  { id: "tpa", name: "Send TPAHERE request to everyone at once", price: 15.00 },
  { id: "emote", name: "1x Exlusive Emote", price: 0.99 },
  { id: "coins_everyworld", name: "Earn coins in the overworld", price: 1.00 },
];

const designs: Design[] = [
  { id: "d1", name: "Amethyst", image: design1, price: 0.99 },
  { id: "d2", name: "Frost Star", image: design2, price: 1.49 },
  { id: "d3", name: "Golden Crown", image: design3, price: 1.99 },
  { id: "d4", name: "Emerald", image: design4, price: 0.99 },
  { id: "d5", name: "Phoenix", image: design5, price: 2.49 },
  { id: "d6", name: "Lunar", image: design6, price: 1.49 },
  { id: "d7", name: "Sakura", image: design7, price: 1.29 },
  { id: "d8", name: "Lightning", image: design8, price: 1.49 },
  { id: "d9", name: "Solar", image: design9, price: 1.79 },
  { id: "d10", name: "Nebula", image: design10, price: 2.99 },
];

export interface CustomRoleOrder {
  name: string;
  features: Feature[];
  design: Design;
  totalPrice: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOrder: (order: CustomRoleOrder) => void;
}

const CustomRoleModal = ({ isOpen, onClose, onOrder }: Props) => {
  const [roleName, setRoleName] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const [nameError, setNameError] = useState("");

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const totalPrice = () => {
    let total = 1.99; // base price
    selectedFeatures.forEach((id) => {
      const f = features.find((feat) => feat.id === id);
      if (f) total += f.price;
    });
    const d = designs.find((des) => des.id === selectedDesign);
    if (d) total += d.price;
    return total;
  };

  const handleOrder = () => {
    if (!roleName.trim()) {
      setNameError("Please enter a role name");
      return;
    }
    if (roleName.length > 5) {
      setNameError("Max 5 characters");
      return;
    }
    if (!selectedDesign) {
      setNameError("Please select a design");
      return;
    }
    const chosenFeatures = features.filter((f) => selectedFeatures.includes(f.id));
    const chosenDesign = designs.find((d) => d.id === selectedDesign)!;
    onOrder({
      name: roleName,
      features: chosenFeatures,
      design: chosenDesign,
      totalPrice: totalPrice(),
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl glass-strong p-6 md:p-8"
            initial={{ opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[2px] gradient-purple" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[60px] bg-glow-purple/10 blur-[40px]" />

            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-all duration-300 z-10"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left side - Builder */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center glow-purple">
                      <Sparkles className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </motion.div>
                  <h2 className="font-display text-2xl font-bold gradient-text">Custom Role Builder</h2>
                </div>

                {/* Role Name */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <label className="text-xs text-muted-foreground font-body mb-2 block">Role Name (max 5 chars)</label>
                  <input
                    type="text"
                    maxLength={5}
                    value={roleName}
                    onChange={(e) => { setRoleName(e.target.value); setNameError(""); }}
                    placeholder="KING"
                    className="w-full glass rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-display text-lg tracking-wider transition-all duration-300"
                  />
                  <div className="flex justify-between mt-1">
                    {nameError && <span className="text-destructive text-xs">{nameError}</span>}
                    <span className="text-xs text-muted-foreground ml-auto">{roleName.length}/5</span>
                  </div>
                </motion.div>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <label className="text-xs text-muted-foreground font-body mb-3 block">Select Features</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {features.map((feat, i) => {
                      const selected = selectedFeatures.includes(feat.id);
                      return (
                        <motion.button
                          key={feat.id}
                          onClick={() => toggleFeature(feat.id)}
                          className={`glass rounded-lg p-3 text-left flex items-center gap-3 transition-all duration-300 ${
                            selected ? "ring-2 ring-primary/60 border-glow-purple/40" : "hover:border-glow-purple/20"
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * i, duration: 0.3 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all duration-300 ${
                            selected ? "gradient-purple" : "glass"
                          }`}>
                            {selected && <Check className="w-3 h-3 text-primary-foreground" />}
                          </div>
                          <span className="text-sm text-foreground font-body flex-1">{feat.name}</span>
                          <span className="text-xs text-primary font-display font-bold">${feat.price.toFixed(2)}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Designs */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Palette className="w-4 h-4 text-primary" />
                    <label className="text-xs text-muted-foreground font-body">Select Design</label>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {designs.map((design, i) => {
                      const selected = selectedDesign === design.id;
                      return (
                        <motion.button
                          key={design.id}
                          onClick={() => setSelectedDesign(design.id)}
                          className={`glass rounded-xl p-2 flex flex-col items-center gap-1 transition-all duration-300 ${
                            selected ? "ring-2 ring-primary/60 glow-purple scale-105" : "hover:border-glow-purple/20 hover:scale-105"
                          }`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: selected ? 1.05 : 1 }}
                          transition={{ delay: 0.03 * i, duration: 0.3 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <img src={design.image} alt={design.name} className="w-12 h-12 object-contain" loading="lazy" width={48} height={48} />
                          <span className="text-[10px] text-muted-foreground font-body">{design.name}</span>
                          <span className="text-[10px] text-primary font-display font-bold">${design.price.toFixed(2)}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              </div>

              {/* Right side - Price Panel */}
              <motion.div
                className="lg:w-72 lg:sticky lg:top-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="glass-strong rounded-2xl p-6 space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[2px] gradient-purple" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[30px] bg-glow-purple/10 blur-[20px]" />

                  <h3 className="font-display text-lg font-bold gradient-text">Order Summary</h3>

                  {/* Role preview */}
                  {roleName && (
                    <motion.div
                      className="glass rounded-lg p-3 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-xs text-muted-foreground">Your Role</span>
                      <p className="font-display text-xl font-black gradient-text tracking-widest">{roleName.toUpperCase()}</p>
                    </motion.div>
                  )}

                  {/* Base price */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Price</span>
                    <span className="text-foreground">$1.99</span>
                  </div>

                  {/* Selected features */}
                  <AnimatePresence>
                    {selectedFeatures.length > 0 && (
                      <motion.div
                        className="space-y-1"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-xs text-muted-foreground">Features</span>
                        {selectedFeatures.map((id) => {
                          const f = features.find((feat) => feat.id === id);
                          if (!f) return null;
                          return (
                            <motion.div
                              key={id}
                              className="flex justify-between text-xs"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <span className="text-muted-foreground">{f.name}</span>
                              <span className="text-foreground">${f.price.toFixed(2)}</span>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Selected design */}
                  {selectedDesign && (
                    <motion.div
                      className="flex justify-between text-sm items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-muted-foreground text-xs">Design: {designs.find((d) => d.id === selectedDesign)?.name}</span>
                      <span className="text-foreground text-xs">${designs.find((d) => d.id === selectedDesign)?.price.toFixed(2)}</span>
                    </motion.div>
                  )}

                  <div className="border-t border-border my-2" />

                  {/* Total */}
                  <div className="flex justify-between font-display font-bold">
                    <span className="text-foreground">Total</span>
                    <motion.span
                      key={totalPrice()}
                      className="gradient-text text-xl"
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      ${totalPrice().toFixed(2)}
                    </motion.span>
                  </div>

                  {/* Order button */}
                  <motion.button
                    onClick={handleOrder}
                    className="w-full gradient-purple py-3 rounded-lg font-display font-bold text-primary-foreground tracking-wider glow-purple transition-all duration-300"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Order Now — ${totalPrice().toFixed(2)}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomRoleModal;
