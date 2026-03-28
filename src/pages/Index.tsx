import { useState } from "react";
import Navbar from "@/components/Navbar";
import Starfield from "@/components/Starfield";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import MinecraftLogin from "@/components/MinecraftLogin";
import RankStore from "@/components/RankStore";
import type { Rank } from "@/components/RankStore";
import CheckoutModal from "@/components/CheckoutModal";
import CustomRoleModal from "@/components/CustomRoleModal";
import type { CustomRoleOrder } from "@/components/CustomRoleModal";
import CosmeticsSection from "@/components/CosmeticsSection";
import type { Cosmetic } from "@/components/CosmeticsSection";
import RecentBuyers, { loadBuyers, saveBuyer } from "@/components/RecentBuyers";
import type { Buyer } from "@/components/RecentBuyers";
import DiscordSection from "@/components/DiscordSection";
import OnlinePlayersSection from "@/components/OnlinePlayersSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [selectedRank, setSelectedRank] = useState<Rank | null>(null);
  const [mcUsername, setMcUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [recentBuyers, setRecentBuyers] = useState<Buyer[]>(loadBuyers());
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<{ name: string; price: string; description?: string } | null>(null);
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [customRoleOpen, setCustomRoleOpen] = useState(false);

  const skinUrl = mcUsername ? `https://mc-heads.net/avatar/${mcUsername}/100` : "";

  const handleLogin = (username: string) => {
    setMcUsername(username);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setMcUsername("");
    setIsLoggedIn(false);
    setSelectedRank(null);
  };

  const handleSelectRank = (rank: Rank) => {
    if (!isLoggedIn) {
      document.getElementById("login-section")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setSelectedRank(rank);
    setCheckoutItem({
      name: rank.name,
      price: rank.price,
      description: "Monthly subscription",
    });
    setIsCustomRole(false);
    setCheckoutOpen(true);
  };

  const handleSelectCosmetic = (cosmetic: Cosmetic) => {
    setCheckoutItem({
      name: cosmetic.name,
      price: cosmetic.price,
      description: `${cosmetic.category} cosmetic`,
    });
    setIsCustomRole(false);
    setCheckoutOpen(true);
  };

  const handleCustomRoleOrder = (order: CustomRoleOrder) => {
    const featureLines =
      order.features.length > 0
        ? order.features
            .map((feature) => `• ${feature.name} ($${feature.price.toFixed(2)})`)
            .join("\n")
        : "• No extra features selected";

    const description = [
      `Role Name: ${order.name}`,
      `Design: ${order.design.name} ($${order.design.price.toFixed(2)})`,
      `Features:`,
      featureLines,
    ].join("\n");

    setCustomRoleOpen(false);
    setCheckoutItem({
      name: `Custom Role: ${order.name}`,
      price: `$${order.totalPrice.toFixed(2)}`,
      description,
    });
    setIsCustomRole(true);
    setCheckoutOpen(true);
  };

  const handleOpenCustomRole = () => {
    if (!isLoggedIn) {
      document.getElementById("login-section")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setCustomRoleOpen(true);
  };

  const handlePurchaseComplete = (username: string, rankName: string) => {
    saveBuyer(username, rankName);
    setRecentBuyers(loadBuyers());
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative">
      <Starfield />
      <Navbar username={mcUsername} skinUrl={skinUrl} isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <div className="relative z-10">
        <HeroSection />
        <div id="about">
          <AboutSection />
        </div>

        <div id="login-section">
          <MinecraftLogin
            username={mcUsername}
            skinUrl={skinUrl}
            isLoggedIn={isLoggedIn}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        </div>

        <RankStore
          onSelectRank={handleSelectRank}
          isLoggedIn={isLoggedIn}
          onOpenCustomRole={handleOpenCustomRole}
        />

        <div id="cosmetics">
          <CosmeticsSection onSelectCosmetic={handleSelectCosmetic} isLoggedIn={isLoggedIn} />
        </div>

        <OnlinePlayersSection />
        <RecentBuyers buyers={recentBuyers} />

        <div id="discord">
          <DiscordSection />
        </div>

        <Footer />
      </div>

      <CustomRoleModal
        isOpen={customRoleOpen}
        onClose={() => setCustomRoleOpen(false)}
        onOrder={handleCustomRoleOrder}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        item={checkoutItem}
        username={mcUsername}
        skinUrl={skinUrl}
        onPurchaseComplete={handlePurchaseComplete}
        isCustomRole={isCustomRole}
      />
    </div>
  );
};

export default Index;