"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/landing";
import { Icon, ICON_PATHS, LoadingSpinner } from "@/components/ui/Icon";
import { getPlatformStats, type PlatformStatsResponse } from "@/lib/api/stats";
import { cn } from "@/lib/cn";

export default function PlatformStatsPage(): React.JSX.Element {
  const [data, setData] = useState<PlatformStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      setIsLoading(true);
      setError(null);
      try {
        const stats = await getPlatformStats();
        setData(stats);
      } catch (err) {
        console.error("Failed to load platform stats:", err);
        setError(err instanceof Error ? err.message : "Failed to load platform stats.");
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  const handleCopy = (publicKey: string, id: string) => {
    navigator.clipboard.writeText(publicKey).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative ambient light spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px] pointer-events-none select-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-success/8 blur-[120px] pointer-events-none select-none" />

      <Navbar />

      <main className="py-16 lg:py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary tracking-tight animate-fade-in">
              Platform <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">Stats</span>
            </h1>
            <p className="text-text-secondary max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
              Real-time insights and transparent key metrics showcasing user registration, secure wallet generation, and transaction volume.
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-emerald-500 mx-auto rounded-full mt-6" />
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="relative flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <Icon path={ICON_PATHS.chartBar} size="lg" className="text-primary absolute" />
              </div>
              <p className="text-sm font-semibold text-text-secondary animate-pulse mt-4">Syncing platform metrics...</p>
            </div>
          ) : error ? (
            <div className="p-10 rounded-3xl bg-white/80 border border-white/60 backdrop-blur-md text-center shadow-[20px_20px_60px_rgba(0,0,0,0.05),-10px_-10px_40px_#ffffff] max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-error/10 text-error flex items-center justify-center mx-auto mb-5 shadow-sm">
                <Icon path={ICON_PATHS.alertCircle} size="xl" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Error Syncing Metrics</h3>
              <p className="text-sm text-text-secondary mb-8 leading-relaxed">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3.5 rounded-xl font-bold bg-primary text-white shadow-[4px_4px_12px_rgba(var(--primary-rgb),0.3)] hover:bg-primary-hover active:scale-[0.98] transition-all duration-200"
              >
                Retry Connection
              </button>
            </div>
          ) : data ? (
            <div className="space-y-16">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Users card */}
                <div className="group bg-gradient-to-br from-white to-gray-50/50 p-8 rounded-3xl shadow-[6px_6px_15px_rgba(163,177,198,0.35),-6px_-6px_15px_#ffffff] border border-white/80 flex flex-col items-center text-center transition-all duration-300 hover:shadow-[10px_10px_25px_rgba(163,177,198,0.45),-10px_-10px_25px_#ffffff] hover:-translate-y-1.5">
                  <div className="w-16 h-16 rounded-2xl bg-primary/8 text-primary flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/12 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)]">
                    <Icon path={ICON_PATHS.users} size="xl" />
                  </div>
                  <span className="text-4xl font-black bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
                    {data.summary.users.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-text-secondary mt-2">
                    Registered Users
                  </span>
                </div>

                {/* Wallets card */}
                <div className="group bg-gradient-to-br from-white to-gray-50/50 p-8 rounded-3xl shadow-[6px_6px_15px_rgba(163,177,198,0.35),-6px_-6px_15px_#ffffff] border border-white/80 flex flex-col items-center text-center transition-all duration-300 hover:shadow-[10px_10px_25px_rgba(163,177,198,0.45),-10px_-10px_25px_#ffffff] hover:-translate-y-1.5">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/8 text-emerald-600 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500/12 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)]">
                    <Icon path={ICON_PATHS.creditCard} size="xl" />
                  </div>
                  <span className="text-4xl font-black bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
                    {data.summary.wallets.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-text-secondary mt-2">
                    Stellar Wallets
                  </span>
                </div>

                {/* Escrows card */}
                <div className="group bg-gradient-to-br from-white to-gray-50/50 p-8 rounded-3xl shadow-[6px_6px_15px_rgba(163,177,198,0.35),-6px_-6px_15px_#ffffff] border border-white/80 flex flex-col items-center text-center transition-all duration-300 hover:shadow-[10px_10px_25px_rgba(163,177,198,0.45),-10px_-10px_25px_#ffffff] hover:-translate-y-1.5">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/8 text-amber-600 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-500/12 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)]">
                    <Icon path={ICON_PATHS.lock} size="xl" />
                  </div>
                  <span className="text-4xl font-black bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
                    {data.summary.escrows.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-text-secondary mt-2">
                    Escrows Created
                  </span>
                </div>

                {/* Transactions card */}
                <div className="group bg-gradient-to-br from-white to-gray-50/50 p-8 rounded-3xl shadow-[6px_6px_15px_rgba(163,177,198,0.35),-6px_-6px_15px_#ffffff] border border-white/80 flex flex-col items-center text-center transition-all duration-300 hover:shadow-[10px_10px_25px_rgba(163,177,198,0.45),-10px_-10px_25px_#ffffff] hover:-translate-y-1.5">
                  <div className="w-16 h-16 rounded-2xl bg-sky-500/8 text-sky-600 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-sky-500/12 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)]">
                    <Icon path={ICON_PATHS.refresh} size="xl" />
                  </div>
                  <span className="text-4xl font-black bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
                    {data.summary.transactions.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-text-secondary mt-2">
                    On-chain Transactions
                  </span>
                </div>
              </div>

              {/* Recent Stellar Wallets Section */}
              <div className="bg-white/80 border border-white/60 backdrop-blur-md p-8 sm:p-10 rounded-[32px] shadow-[20px_20px_60px_rgba(0,0,0,0.04),-10px_-10px_40px_#ffffff] space-y-8">
                <div className="border-b border-border-light pb-6 space-y-2">
                  <h2 className="text-2xl font-black text-text-primary flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-sm">
                      <Icon path={ICON_PATHS.link} size="md" />
                    </div>
                    Recent Generated Stellar Wallets
                  </h2>
                  <p className="text-sm text-text-secondary font-medium pl-13">
                    Decentralized accounts dynamically compiled on-chain to handle secure payments, milestones, and dispute resolution.
                  </p>
                </div>

                {data.recentWallets.length === 0 ? (
                  <div className="py-16 text-center border-2 border-dashed border-border-light rounded-2xl bg-gray-50/50">
                    <p className="text-sm font-semibold text-text-secondary">No Stellar wallets have been initialized yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-border-light shadow-sm">
                    <table className="w-full text-left border-collapse bg-white">
                      <thead>
                        <tr className="bg-gray-50 border-b border-border-light text-text-secondary text-xs uppercase tracking-wider font-extrabold">
                          <th className="py-4.5 px-6">Wallet Address</th>
                          <th className="py-4.5 px-6">Date Created</th>
                          <th className="py-4.5 px-6 text-right">Blockchain Explorer</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentWallets.map((wallet) => {
                          const truncatedKey = `${wallet.publicKey.slice(0, 10)}…${wallet.publicKey.slice(-10)}`;
                          const isCopied = copiedId === wallet.id;
                          return (
                            <tr key={wallet.id} className="border-b border-border-light hover:bg-gray-50/50 transition-colors last:border-0">
                              <td className="py-5 px-6 font-mono text-sm text-text-primary select-all">
                                <div className="flex items-center gap-3">
                                  <span className="font-bold tracking-tight">{truncatedKey}</span>
                                  <button
                                    onClick={() => handleCopy(wallet.publicKey, wallet.id)}
                                    className="p-2 rounded-xl border border-transparent text-text-secondary hover:text-primary hover:border-border-light hover:bg-background transition-all duration-200 active:scale-95"
                                    title="Copy full address"
                                  >
                                    <Icon path={isCopied ? ICON_PATHS.check : ICON_PATHS.copy} size="sm" className={isCopied ? "text-success" : ""} />
                                  </button>
                                  {isCopied && (
                                    <span className="text-xs text-success font-bold font-sans px-2 py-0.5 rounded-md bg-success/10 border border-success/20 animate-fade-in">
                                      Copied!
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-5 px-6 text-sm text-text-secondary font-medium">
                                {formatDate(wallet.createdAt)}
                              </td>
                              <td className="py-5 px-6 text-right">
                                <a
                                  href={`https://stellar.expert/explorer/testnet/account/${wallet.publicKey}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-background text-primary border border-border-light shadow-sm hover:text-primary-hover hover:border-primary/30 active:scale-[0.98] transition-all duration-200"
                                >
                                  <span>View Ledger</span>
                                  <Icon path={ICON_PATHS.externalLink} size="sm" />
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
