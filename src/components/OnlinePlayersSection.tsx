import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  Wifi,
  WifiOff,
  Users,
  Server,
  Layers,
  MessageSquareText,
  RefreshCw,
} from "lucide-react";

interface PlayerEntry {
  name: string;
  uuid?: string;
}

interface ServerStatusResponse {
  online: boolean;
  hostname?: string;
  ip?: string;
  port?: number;
  version?: string;
  software?: string;
  icon?: string;
  motd?: {
    clean?: string[];
  };
  players?: {
    online?: number;
    max?: number;
    list?: PlayerEntry[];
  };
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const OnlinePlayersSection = () => {
  const [status, setStatus] = useState<ServerStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchStatus = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(`${API_BASE}/api/server-status`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to fetch server status.");
      }

      setStatus(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load server data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus(false);

    const interval = setInterval(() => {
      fetchStatus(false);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const motdLines = useMemo(() => {
    if (!status?.motd?.clean || !Array.isArray(status.motd.clean)) return [];
    return status.motd.clean.filter(Boolean).slice(0, 2);
  }, [status]);

  const playerList = useMemo(() => {
    if (!status?.players?.list || !Array.isArray(status.players.list)) return [];
    return status.players.list.slice(0, 8);
  }, [status]);

  return (
    <section id="online-players" className="relative py-28 px-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-glow-purple/5 blur-[150px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center glow-purple">
              <Server className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-black gradient-text">
              Server Status
            </h2>
          </div>

          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            Live information from LoadingSMP, including online status, player count, version,
            software, MOTD and visible player list.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="glass-strong rounded-2xl p-6 md:p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] h-[2px] gradient-purple" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[220px] h-[60px] bg-glow-purple/10 blur-[40px]" />

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              {status?.icon ? (
                <img
                  src={status.icon}
                  alt="Server Icon"
                  className="w-16 h-16 rounded-2xl border border-glow-purple/20 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center border border-glow-purple/20">
                  <Server className="w-7 h-7 text-primary" />
                </div>
              )}

              <div>
                <h3 className="font-display text-2xl font-bold text-foreground">
                  LoadingSMP
                </h3>
                <p className="text-sm text-muted-foreground break-all">
                  loadinghsmpp.falix.dev
                </p>
              </div>
            </div>

            <button
              onClick={() => fetchStatus(true)}
              type="button"
              className="glass rounded-xl px-4 py-3 text-sm font-display font-bold text-foreground flex items-center justify-center gap-2 transition-all duration-300 hover:border-glow-purple/20"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="glass rounded-2xl p-8 text-center">
              <div className="inline-flex items-center gap-3 text-muted-foreground">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span className="font-body">Loading server data...</span>
              </div>
            </div>
          ) : error ? (
            <div className="glass rounded-2xl p-8 text-center">
              <div className="inline-flex items-center gap-3 text-destructive">
                <WifiOff className="w-5 h-5" />
                <span className="font-body">{error}</span>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <div className="glass rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        status?.online ? "bg-emerald-500/15" : "bg-red-500/15"
                      }`}
                    >
                      {status?.online ? (
                        <Wifi className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <WifiOff className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground font-body">Status</span>
                  </div>
                  <p
                    className={`font-display text-xl font-bold ${
                      status?.online ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {status?.online ? "Online" : "Offline"}
                  </p>
                </div>

                <div className="glass rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground font-body">Players</span>
                  </div>
                  <p className="font-display text-xl font-bold text-foreground">
                    {status?.players?.online ?? 0} / {status?.players?.max ?? 0}
                  </p>
                </div>

                <div className="glass rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground font-body">Version</span>
                  </div>
                  <p className="font-display text-xl font-bold text-foreground break-words">
                    {status?.version || "Unknown"}
                  </p>
                </div>

                <div className="glass rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Server className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground font-body">Software</span>
                  </div>
                  <p className="font-display text-xl font-bold text-foreground break-words">
                    {status?.software || "Unknown"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="glass rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquareText className="w-4 h-4 text-primary" />
                    <h4 className="font-display text-lg font-bold text-foreground">MOTD</h4>
                  </div>

                  {motdLines.length > 0 ? (
                    <div className="space-y-2">
                      {motdLines.map((line, index) => (
                        <p key={index} className="text-sm text-muted-foreground font-body">
                          {line}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground font-body">
                      No MOTD available.
                    </p>
                  )}
                </div>

                <div className="glass rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-primary" />
                    <h4 className="font-display text-lg font-bold text-foreground">
                      Visible Players
                    </h4>
                  </div>

                  {playerList.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {playerList.map((player) => (
                        <div
                          key={`${player.name}-${player.uuid ?? "nouuid"}`}
                          className="glass rounded-lg p-3 flex items-center gap-3"
                        >
                          <img
                            src={`https://mc-heads.net/avatar/${player.name}/32`}
                            alt={player.name}
                            className="w-8 h-8 rounded-md border border-glow-purple/20"
                          />
                          <span className="text-sm text-foreground font-body truncate">
                            {player.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground font-body">
                      No visible players returned by the server.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 glass rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground font-body">Detected Host</p>
                  <p className="text-sm text-foreground font-medium break-all">
                    {status?.hostname || status?.ip || "Unknown"}
                    {status?.port ? `:${status.port}` : ""}
                  </p>
                </div>

                <p className="text-xs text-muted-foreground font-body">
                  Auto-refreshes every 60 seconds
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default OnlinePlayersSection;