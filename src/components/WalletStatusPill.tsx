import { useAccount } from "wagmi";
import { Link } from "@tanstack/react-router";

function shorten(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

/**
 * Read-only wallet status indicator for headers across the app. There is
 * intentionally NO connect/disconnect action here — the single source of
 * truth for that lives on /dashboard. If the user clicks the pill while
 * disconnected, we route them to /dashboard so they connect once and use
 * everywhere.
 */
export function WalletStatusPill() {
  const { address, isConnected } = useAccount();

  if (isConnected && address) {
    return (
      <div
        className="flex items-center gap-2 rounded-full px-3 py-2"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.14)",
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "#4ade80", boxShadow: "0 0 6px #4ade80" }}
        />
        <span
          className="font-mono text-[10px]"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          {shorten(address)}
        </span>
      </div>
    );
  }

  return (
    <Link
      to="/dashboard"
      className="rounded-full px-4 py-2 font-grotesk text-[11px] uppercase tracking-wider transition hover:opacity-90"
      style={{
        background: "rgba(255,255,255,0.06)",
        color: "rgba(255,255,255,0.7)",
        border: "1px solid rgba(255,255,255,0.14)",
      }}
    >
      Connect →
    </Link>
  );
}
