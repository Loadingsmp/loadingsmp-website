import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { X, ShoppingCart, Mail, CreditCard, Loader2 } from "lucide-react";
import type { Rank } from "./RankStore";

interface CheckoutProps {
  selectedRank: Rank | null;
  onClose: () => void;
  username: string;
  skinUrl: string;
  onPurchaseComplete: (username: string, rankName: string) => void;
}

const CheckoutSection = ({ selectedRank, onClose, username, skinUrl }: CheckoutProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-50px" });
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "card" | null>(null);
  const [processing, setProcessing] = useState(false);
  const [emailError, setEmailError] = useState("");

  if (!selectedRank) return null;

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handlePurchase = () => {
    if (!email || !validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailError("");
    setProcessing(true);

    window.open("https://discord.gg/KZrUBb6vW5", "_blank");

    setTimeout(() => {
      setProcessing(false);
    }, 800);
  };

  const handleClose = () => {
    setEmail("");
    setPaymentMethod(null);
    setProcessing(false);
    setEmailError("");
    onClose();
  };

  return (
    <section id="checkout" className="relative py-32 px-4" ref={ref}>
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-glow-purple/5 blur-[150px]" />

      <div className="max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key="checkout"
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="glass-strong rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[2px] gradient-purple" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[60px] bg-glow-purple/10 blur-[40px]" />

              <motion.button
                onClick={handleClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-all duration-300 z-10"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>

              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center glow-purple">
                    <ShoppingCart className="w-5 h-5 text-primary-foreground" />
                  </div>
                </motion.div>
                <h2 className="font-display text-2xl font-bold gradient-text">
                  Complete in Discord
                </h2>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                className="glass rounded-xl p-4 mb-4 flex items-center gap-4"
              >
                <img
                  src={skinUrl}
                  alt={`${username}'s skin`}
                  className="w-12 h-12 rounded-lg border-2 border-glow-purple/30"
                />
                <div>
                  <p className="text-xs text-muted-foreground font-body">Buyer</p>
                  <p className="font-display font-bold text-foreground">{username}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                className="glass rounded-xl p-4 mb-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-display font-bold text-foreground">{selectedRank.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Contact us on Discord to complete this order
                  </p>
                </div>
                <span className="font-display text-2xl font-black gradient-text">
                  {selectedRank.price}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                className="mb-4"
              >
                <label className="text-xs text-muted-foreground font-body mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                    placeholder="your@email.com"
                    className="w-full glass rounded-lg pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-body transition-all duration-300"
                  />
                </div>
                <AnimatePresence>
                  {emailError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                      className="text-destructive text-xs mt-1 font-body"
                    >
                      {emailError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                className="mb-4"
              >
                <label className="text-xs text-muted-foreground font-body mb-2 block">
                  Preferred Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    onClick={() => setPaymentMethod("paypal")}
                    className={`glass rounded-xl p-4 text-center transition-all duration-300 ${
                      paymentMethod === "paypal"
                        ? "ring-2 ring-primary/60 border-glow-purple/40"
                        : "hover:border-glow-purple/20"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                  >
                    <span className="text-2xl block mb-1 font-bold text-foreground">P</span>
                    <span className="text-xs text-muted-foreground font-body">PayPal</span>
                  </motion.button>

                  <motion.button
                    onClick={() => setPaymentMethod("card")}
                    className={`glass rounded-xl p-4 text-center transition-all duration-300 ${
                      paymentMethod === "card"
                        ? "ring-2 ring-primary/60 border-glow-purple/40"
                        : "hover:border-glow-purple/20"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                  >
                    <CreditCard className="w-6 h-6 mx-auto mb-1 text-foreground" />
                    <span className="text-xs text-muted-foreground font-body">Credit Card</span>
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
                className="glass rounded-xl p-4 mb-6 space-y-2"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{selectedRank.price}</span>
                </div>
                <div className="border-t border-border my-2" />
                <div className="flex justify-between font-display font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="gradient-text">{selectedRank.price}</span>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.6, ease: "easeOut" }}
                className="text-sm text-muted-foreground mb-6 font-body"
              >
                After clicking the button below, our Discord server will open in a new tab so
                you can complete your order with staff.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
              >
                <motion.button
                  onClick={handlePurchase}
                  disabled={processing}
                  className="w-full gradient-purple py-4 rounded-lg font-display font-bold text-primary-foreground tracking-wider glow-purple flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-300"
                  whileHover={{ scale: processing ? 1 : 1.02 }}
                  whileTap={{ scale: processing ? 1 : 0.98 }}
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    <>Complete in Discord</>
                  )}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CheckoutSection;