import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  X,
  ShoppingCart,
  Mail,
  CreditCard,
  CheckCircle,
  Loader2,
  Copy,
  ExternalLink,
} from "lucide-react";

interface CheckoutItem {
  name: string;
  price: string;
  description?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: CheckoutItem | null;
  username: string;
  skinUrl: string;
  onPurchaseComplete: (username: string, rankName: string) => void;
  isCustomRole?: boolean;
}

const DISCORD_INVITE_URL = "https://discord.gg/KZrUBb6vW5";

const CheckoutModal = ({
  isOpen,
  onClose,
  item,
  username,
  skinUrl,
}: Props) => {
  const [email, setEmail] = useState("");
  const [discordUsername, setDiscordUsername] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"PayPal" | "Credit Card" | null>(null);
  const [processing, setProcessing] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [discordError, setDiscordError] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [requestError, setRequestError] = useState("");

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handlePurchase = async () => {
    if (!email || !validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (!discordUsername.trim()) {
      setDiscordError("Please enter your Discord username");
      return;
    }

    if (!paymentMethod) {
      setRequestError("Please select a payment method.");
      return;
    }

    if (!item) return;

    setProcessing(true);
    setEmailError("");
    setDiscordError("");
    setRequestError("");

    try {
      const response = await fetch("http://localhost:3001/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          discordUsername,
          paymentMethod,
          itemName: item.name,
          price: item.price,
          description: item.description || "No description provided.",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to create order.");
      }

      setOrderCode(data.orderCode);
      setOrderCreated(true);
    } catch (error) {
      console.error(error);
      setRequestError("Something went wrong while creating your order. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleClose = () => {
    setOrderCreated(false);
    setEmail("");
    setDiscordUsername("");
    setPaymentMethod(null);
    setProcessing(false);
    setEmailError("");
    setDiscordError("");
    setOrderCode("");
    setCopySuccess(false);
    setRequestError("");
    onClose();
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(orderCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const openDiscord = () => {
    const link = document.createElement("a");
    link.href = DISCORD_INVITE_URL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative z-10 w-full max-w-lg rounded-2xl glass-strong p-8 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[2px] gradient-purple" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[60px] bg-glow-purple/10 blur-[40px]" />

            <AnimatePresence mode="wait">
              {orderCreated ? (
                <motion.div
                  key="order-created"
                  initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-center relative"
                >
                  <motion.div
                    className="absolute inset-0 bg-emerald-500/5 rounded-2xl"
                    animate={{ opacity: [0.05, 0.15, 0.05] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />

                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.2 }}
                    className="inline-block mb-6"
                  >
                    <div
                      className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto"
                      style={{ boxShadow: "0 0 40px rgba(16, 185, 129, 0.3)" }}
                    >
                      <CheckCircle className="w-10 h-10 text-emerald-400" />
                    </div>
                  </motion.div>

                  <motion.h2
                    className="font-display text-3xl font-bold text-emerald-400 mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    Order Created
                  </motion.h2>

                  <motion.p
                    className="text-muted-foreground mb-6 font-body text-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    Your order has been successfully created. Please take a screenshot of this
                    window and open a ticket in our Discord server.
                  </motion.p>

                  <motion.div
                    className="glass rounded-xl p-4 mb-6 text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-muted-foreground text-sm">Order Code</span>
                      <span className="font-display font-bold text-primary text-lg">
                        {orderCode}
                      </span>
                    </div>

                    <div className="border-t border-border my-3" />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Username</span>
                        <span className="text-foreground font-medium text-right">{username}</span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Discord</span>
                        <span className="text-foreground font-medium text-right break-all">
                          {discordUsername}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Package</span>
                        <span className="text-foreground font-medium text-right">{item.name}</span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Price</span>
                        <span className="text-foreground font-medium text-right">{item.price}</span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Payment Method</span>
                        <span className="text-foreground font-medium text-right">
                          {paymentMethod}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Email</span>
                        <span className="text-foreground font-medium text-right break-all">
                          {email}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.p
                    className="text-muted-foreground text-sm mb-6 font-body"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                  >
                    A staff member will review your order and tell you how to complete the payment.
                  </motion.p>

                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                  >
                    <motion.button
                      onClick={handleCopyCode}
                      className="glass px-4 py-3 rounded-lg font-display font-bold text-foreground flex items-center justify-center gap-2 transition-all duration-300"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                    >
                      <Copy className="w-4 h-4" />
                      {copySuccess ? "Copied!" : "Copy Order Code"}
                    </motion.button>

                    <motion.button
                      onClick={openDiscord}
                      className="gradient-purple px-4 py-3 rounded-lg font-display font-bold text-primary-foreground glow-purple flex items-center justify-center gap-2 transition-all duration-300"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open Discord
                    </motion.button>
                  </motion.div>

                  <motion.button
                    onClick={handleClose}
                    className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-all duration-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    type="button"
                  >
                    Close
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="checkout"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-all duration-300 z-10"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
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
                    <h2 className="font-display text-2xl font-bold gradient-text">Checkout</h2>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="glass rounded-xl p-4 mb-4 flex items-center gap-4"
                  >
                    <img
                      src={skinUrl}
                      alt={username}
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
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="glass rounded-xl p-4 mb-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-display font-bold text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.description || "One-time purchase"}
                      </p>
                    </div>
                    <span className="font-display text-2xl font-black gradient-text">
                      {item.price}
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
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
                          setRequestError("");
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
                          className="text-destructive text-xs mt-1"
                        >
                          {emailError}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35, duration: 0.5 }}
                    className="mb-4"
                  >
                    <label className="text-xs text-muted-foreground font-body mb-2 block">
                      Discord Username
                    </label>

                    <input
                      type="text"
                      value={discordUsername}
                      onChange={(e) => {
                        setDiscordUsername(e.target.value);
                        setDiscordError("");
                        setRequestError("");
                      }}
                      placeholder="exampleuser or exampleuser#1234"
                      className="w-full glass rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-body transition-all duration-300"
                    />

                    <AnimatePresence>
                      {discordError && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-destructive text-xs mt-1"
                        >
                          {discordError}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mb-4"
                  >
                    <label className="text-xs text-muted-foreground font-body mb-2 block">
                      Payment Method
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        onClick={() => {
                          setPaymentMethod("PayPal");
                          setRequestError("");
                        }}
                        className={`glass rounded-xl p-4 text-center transition-all duration-300 ${
                          paymentMethod === "PayPal"
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
                        onClick={() => {
                          setPaymentMethod("Credit Card");
                          setRequestError("");
                        }}
                        className={`glass rounded-xl p-4 text-center transition-all duration-300 ${
                          paymentMethod === "Credit Card"
                            ? "ring-2 ring-primary/60 border-glow-purple/40"
                            : "hover:border-glow-purple/20"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                      >
                        <CreditCard className="w-6 h-6 mx-auto mb-1 text-foreground" />
                        <span className="text-xs text-muted-foreground font-body">
                          Credit Card
                        </span>
                      </motion.button>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="glass rounded-xl p-4 mb-4"
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">{item.price}</span>
                    </div>
                    <div className="border-t border-border my-2" />
                    <div className="flex justify-between font-display font-bold">
                      <span className="text-foreground">Total</span>
                      <span className="gradient-text">{item.price}</span>
                    </div>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55, duration: 0.5 }}
                    className="text-sm text-muted-foreground mb-4 font-body"
                  >
                    When you click complete, an order confirmation will be generated with a unique
                    code. Please screenshot it and open a ticket in our Discord server.
                  </motion.p>

                  {requestError && (
                    <p className="text-destructive text-xs mb-4">{requestError}</p>
                  )}

                  <motion.button
                    onClick={handlePurchase}
                    disabled={processing}
                    className="w-full gradient-purple py-4 rounded-lg font-display font-bold text-primary-foreground tracking-wider glow-purple flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-300"
                    whileHover={{ scale: processing ? 1 : 1.02 }}
                    whileTap={{ scale: processing ? 1 : 0.98 }}
                    type="button"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating Order...
                      </>
                    ) : (
                      <>Complete</>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;