import { useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { ShoppingBag, ChevronDown, ChevronUp } from "lucide-react";

interface Buyer {
  username: string;
  rankName: string;
  timestamp: number;
}

const STORAGE_KEY = "loadingsmp_recent_buyers";
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export function loadBuyers(): Buyer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const buyers: Buyer[] = JSON.parse(raw);
    const cutoff = Date.now() - THIRTY_DAYS;
    return buyers.filter((b) => b.timestamp > cutoff);
  } catch {
    return [];
  }
}

export function saveBuyer(username: string, rankName: string) {
  const buyers = loadBuyers();
  buyers.unshift({ username, rankName, timestamp: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(buyers));
}

const RecentBuyers = ({ buyers }: { buyers: Buyer[] }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-50px" });
  const [showAll, setShowAll] = useState(false);

  const visibleBuyers = showAll ? buyers : buyers.slice(0, 5);

  return (
    <section className="relative py-16 px-4" ref={ref}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: 10, filter: "blur(10px)" }}
          animate={inView ? { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" } : { opacity: 0, y: 30, rotateX: 10, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ perspective: 800 }}
        >
          <div className="glass-strong rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[2px] gradient-purple" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[40px] bg-glow-purple/10 blur-[30px]" />

            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ y: [0, -3, 0], rotateY: [0, 180, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center glow-purple">
                  <ShoppingBag className="w-4 h-4 text-primary-foreground" />
                </div>
              </motion.div>
              <h3 className="font-display text-lg font-bold gradient-text">Recent Purchases</h3>
            </div>

            {buyers.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="text-muted-foreground text-sm font-body text-center py-6"
              >
                No purchases in the last 30 days.
              </motion.p>
            ) : (
              <>
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {visibleBuyers.map((buyer, i) => (
                      <motion.div
                        key={`${buyer.username}-${buyer.timestamp}`}
                        initial={{ opacity: 0, x: -30, rotateY: -15, filter: "blur(8px)" }}
                        animate={inView
                          ? { opacity: 1, x: 0, rotateY: 0, filter: "blur(0px)" }
                          : { opacity: 0, x: -30, rotateY: -15, filter: "blur(8px)" }
                        }
                        exit={{ opacity: 0, x: 30, rotateY: 15, filter: "blur(8px)" }}
                        transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                        layout
                        className="glass rounded-lg p-3 flex items-center gap-3"
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <motion.img
                          src={`https://mc-heads.net/avatar/${buyer.username}/32`}
                          alt={buyer.username}
                          className="w-8 h-8 rounded-lg border border-glow-purple/20"
                          whileHover={{ scale: 1.2, rotateZ: 10 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        />
                        <div className="flex-1">
                          <span className="font-display font-bold text-sm text-foreground">{buyer.username}</span>
                          <span className="text-muted-foreground text-xs ml-2 font-body">purchased</span>
                          <span className="text-primary text-xs font-display font-bold ml-1">{buyer.rankName}</span>
                        </div>
                        <span className="text-xs text-muted-foreground font-body">
                          {getTimeAgo(buyer.timestamp)}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {buyers.length > 5 && (
                  <motion.button
                    onClick={() => setShowAll((v) => !v)}
                    className="mt-4 w-full glass rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-display font-bold text-primary hover:text-primary/80 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    layout
                  >
                    <motion.span
                      key={showAll ? "less" : "more"}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {showAll ? "Show Less" : `Show All (${buyers.length})`}
                    </motion.span>
                    <motion.div
                      animate={{ rotate: showAll ? 180 : 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </motion.div>
                  </motion.button>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

function getTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default RecentBuyers;
export type { Buyer };
