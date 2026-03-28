import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Shield, RefreshCw, Search, Lock, Package2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

interface Order {
  orderCode: string;
  username: string;
  email: string;
  discordUsername: string;
  paymentMethod: string;
  itemName: string;
  price: string;
  description: string;
  status: "Pending" | "Paid" | "Completed" | "Cancelled";
  createdAt: string;
  updatedAt?: string;
}

const statuses: Order["status"][] = ["Pending", "Paid", "Completed", "Cancelled"];

const Admin = () => {
  const [password, setPassword] = useState(localStorage.getItem("admin_password") || "");
  const [savedPassword, setSavedPassword] = useState(localStorage.getItem("admin_password") || "");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const fetchOrders = async (adminPassword = savedPassword) => {
    if (!adminPassword) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}/api/orders`, {
        method: "GET",
        headers: {
          "x-admin-password": adminPassword,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to load orders.");
      }

      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders. Check your admin password.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderCode: string, status: Order["status"]) => {
    try {
      setStatusLoading(orderCode);
      setError("");

      const response = await fetch(`${API_BASE}/api/orders/${encodeURIComponent(orderCode)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": savedPassword,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to update order status.");
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.orderCode === orderCode ? { ...order, status: data.order.status, updatedAt: data.order.updatedAt } : order
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update order status.");
    } finally {
      setStatusLoading(null);
    }
  };

  const handleSavePassword = async () => {
    localStorage.setItem("admin_password", password);
    setSavedPassword(password);
    await fetchOrders(password);
  };

  useEffect(() => {
    if (savedPassword) {
      fetchOrders(savedPassword);
    }
  }, [savedPassword]);

  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;

    return orders.filter((order) =>
      [
        order.orderCode,
        order.username,
        order.email,
        order.discordUsername,
        order.itemName,
        order.price,
        order.paymentMethod,
        order.description,
        order.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [orders, query]);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden px-4 py-10">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-glow-purple/5 blur-[160px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl gradient-purple flex items-center justify-center glow-purple">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-black gradient-text">
              Admin Panel
            </h1>
          </div>

          <p className="text-muted-foreground font-body max-w-2xl">
            Manage webshop orders, review customer details, and update payment or completion status.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
          className="glass-strong rounded-2xl p-6 md:p-8 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground font-body mb-2 block">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full glass rounded-lg pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-body transition-all duration-300"
                />
              </div>
            </div>

            <button
              onClick={handleSavePassword}
              className="gradient-purple px-5 py-3 rounded-lg font-display font-bold text-primary-foreground glow-purple transition-all duration-300 hover:scale-[1.02]"
              type="button"
            >
              Save & Load Orders
            </button>

            <button
              onClick={() => fetchOrders(savedPassword)}
              className="glass px-5 py-3 rounded-lg font-display font-bold text-foreground flex items-center justify-center gap-2 transition-all duration-300 hover:border-glow-purple/20"
              type="button"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {error && <p className="text-destructive text-sm mt-4">{error}</p>}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="glass-strong rounded-2xl p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center glow-purple">
                <Package2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">Orders</h2>
                <p className="text-sm text-muted-foreground">{filteredOrders.length} visible</p>
              </div>
            </div>

            <div className="relative w-full md:w-[320px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search orders..."
                className="w-full glass rounded-lg pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-body transition-all duration-300"
              />
            </div>
          </div>

          {loading ? (
            <div className="glass rounded-xl p-8 text-center text-muted-foreground">
              Loading orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="glass rounded-xl p-8 text-center text-muted-foreground">
              No orders found.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.orderCode} className="glass rounded-xl p-5">
                  <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-display text-lg font-bold text-primary">
                          {order.orderCode}
                        </span>
                        <span className="text-sm text-foreground font-medium">
                          {order.itemName}
                        </span>
                        <span className="text-sm text-muted-foreground">{order.price}</span>
                        <span
                          className={`text-xs px-3 py-1 rounded-full border ${
                            order.status === "Pending"
                              ? "border-yellow-500/30 text-yellow-400"
                              : order.status === "Paid"
                              ? "border-blue-500/30 text-blue-400"
                              : order.status === "Completed"
                              ? "border-emerald-500/30 text-emerald-400"
                              : "border-red-500/30 text-red-400"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Minecraft:</span>{" "}
                          <span className="text-foreground">{order.username}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Discord:</span>{" "}
                          <span className="text-foreground break-all">{order.discordUsername}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Email:</span>{" "}
                          <span className="text-foreground break-all">{order.email}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Payment:</span>{" "}
                          <span className="text-foreground">{order.paymentMethod}</span>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-muted-foreground">Description:</span>{" "}
                          <span className="text-foreground break-words">{order.description}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Created:</span>{" "}
                          <span className="text-foreground">
                            {new Date(order.createdAt).toLocaleString()}
                          </span>
                        </div>
                        {order.updatedAt && (
                          <div>
                            <span className="text-muted-foreground">Updated:</span>{" "}
                            <span className="text-foreground">
                              {new Date(order.updatedAt).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="xl:w-[220px]">
                      <label className="text-xs text-muted-foreground font-body mb-2 block">
                        Change Status
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {statuses.map((status) => (
                          <button
                            key={status}
                            onClick={() => updateStatus(order.orderCode, status)}
                            disabled={statusLoading === order.orderCode}
                            className={`px-3 py-2 rounded-lg text-sm font-display font-bold transition-all duration-300 ${
                              order.status === status
                                ? "gradient-purple text-primary-foreground glow-purple"
                                : "glass text-foreground hover:border-glow-purple/20"
                            } disabled:opacity-50`}
                            type="button"
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;