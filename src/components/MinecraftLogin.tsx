import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { LogIn, LogOut, User, Loader2 } from "lucide-react";

interface MinecraftLoginProps {
  username: string;
  skinUrl: string;
  isLoggedIn: boolean;
  onLogin: (username: string) => void;
  onLogout: () => void;
}

const MinecraftLogin = ({ username, skinUrl, isLoggedIn, onLogin, onLogout }: MinecraftLoginProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setError("Please enter your username!");
      return;
    }
    if (trimmed.length < 3 || trimmed.length > 16) {
      setError("Username must be 3-16 characters long!");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setError("Only letters, numbers and _ are allowed!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const img = new Image();
      img.src = `https://mc-heads.net/avatar/${trimmed}/100`;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        setTimeout(() => resolve(), 3000);
      });
      onLogin(trimmed);
    } catch {
      onLogin(trimmed);
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md mx-auto mb-8"
      >
        <div className="glass-strong rounded-2xl p-6 flex items-center gap-4">
          <motion.img
            src={skinUrl}
            alt={`${username}'s skin`}
            className="w-16 h-16 rounded-xl border-2 border-glow-purple/30"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
          />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-body">Logged in as</p>
            <p className="font-display font-bold text-foreground text-lg">{username}</p>
          </div>
          <motion.button
            onClick={onLogout}
            className="glass px-4 py-2 rounded-lg font-display font-bold text-sm text-foreground hover:scale-105 transition-all duration-300 flex items-center gap-2 hover:border-destructive/40"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <section className="relative py-16 px-4" ref={ref}>
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="glass-strong rounded-2xl p-8 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[2px] gradient-purple" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[40px] bg-glow-purple/10 blur-[30px]" />

          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block mb-4"
          >
            <div className="w-14 h-14 rounded-2xl gradient-purple flex items-center justify-center glow-purple">
              <User className="w-7 h-7 text-primary-foreground" />
            </div>
          </motion.div>

          <h2 className="font-display text-2xl font-bold gradient-text mb-2">Login</h2>
          <p className="text-muted-foreground text-sm mb-6 font-body">
            Enter your Minecraft username to purchase
          </p>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Minecraft Username"
                className="w-full glass rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-body text-center transition-all duration-300"
                maxLength={16}
              />
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="text-destructive text-xs mt-2 font-body"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={handleLogin}
              disabled={loading}
              className="w-full gradient-purple py-3 rounded-lg font-display font-bold text-primary-foreground tracking-wider glow-purple flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              {loading ? "Loading..." : "Login"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MinecraftLogin;
