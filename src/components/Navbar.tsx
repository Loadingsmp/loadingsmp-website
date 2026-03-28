import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import logo from "@/assets/logo.png";
import PlayNowButton from "./PlayNowButton";

interface NavbarProps {
  username?: string;
  skinUrl?: string;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

const Navbar = ({ username, skinUrl, isLoggedIn, onLogout }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "About", href: "#about" },
    { label: "Store", href: "#store" },
    { label: "Cosmetics", href: "#cosmetics" },
    { label: "Discord", href: "#discord" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-strong shadow-lg shadow-glow-purple/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3">
          <img src={logo} alt="LoadingSMP" className="w-10 h-10 object-contain" />
          <span className="font-display text-lg font-bold gradient-text hidden sm:inline">LoadingSMP</span>
        </a>

        <div className="flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 font-body"
            >
              {link.label}
            </a>
          ))}

          {isLoggedIn && username ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 glass rounded-lg px-3 py-1.5">
                <img src={skinUrl} alt={username} className="w-6 h-6 rounded" />
                <span className="text-sm font-display font-bold text-foreground">{username}</span>
              </div>
              <button
                onClick={onLogout}
                className="glass p-2 rounded-lg text-muted-foreground hover:text-foreground transition-all duration-300"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <PlayNowButton size="sm" />
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
