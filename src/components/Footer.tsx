import { MessageCircle, ShoppingBag, BookOpen, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative border-t border-border py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-display text-xl font-bold gradient-text mb-3">LoadingSMP</h3>
            <p className="text-sm text-muted-foreground">The ultimate Minecraft SMP experience.</p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-3 tracking-wider">SERVER</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-glow-purple" />
                <span className="font-mono">loadingsmp.net</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-3 tracking-wider">LINKS</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#store" className="hover:text-foreground transition-colors flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Store</a></li>
              <li><a href="https://discord.gg/wuXvSEDu" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Discord</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors flex items-center gap-2"><BookOpen className="w-4 h-4" /> Rules</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-3 tracking-wider">SOCIALS</h4>
            <div className="flex gap-3">
              {["Twitter", "YouTube", "TikTok"].map((s) => (
                <a key={s} href="#" className="glass w-10 h-10 rounded-lg flex items-center justify-center text-xs text-muted-foreground hover:text-foreground hover:scale-110 transition-all font-display">
                  {s[0]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © 2026 LoadingSMP. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
