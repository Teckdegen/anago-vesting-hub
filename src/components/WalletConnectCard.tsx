import { useAccount, useDisconnect, useChainId } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { Wallet, LogOut, Copy, Check } from "lucide-react";
import { useState } from "react";

function shorten(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

/**
 * The ONE place in the app where a user connects or disconnects their
 * wallet. Lives on /dashboard. Every other page reads `useAccount()` once
 * the user has connected here.
 */
export function WalletConnectCard() {
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (!address) return;
    await navigator.clipboard?.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  if (!isConnected || !address) {
    return (
      <div
        className="rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <Wallet
              className="w-4 h-4"
              style={{ color: "rgba(255,255,255,0.85)" }}
              strokeWidth={1.5}
            />
          </div>
          <div>
            <p
              className="font-grotesk uppercase text-[13px] tracking-wider"
              style={{ color: "#fff" }}
            >
              Connect your wallet
            </p>
            <p
              className="font-mono text-[10px] mt-0.5"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              One connection unlocks every page — Locks, Vesting, CLMM, Farms.
            </p>
          </div>
        </div>
        <button
          onClick={() => open()}
          className="w-full sm:w-auto rounded-xl px-5 py-3 font-grotesk text-[12px] uppercase tracking-wider transition active:scale-[0.98]"
          style={{
            background: "rgba(255,255,255,0.95)",
            color: "#0D0B14",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: "#4ade80", boxShadow: "0 0 8px #4ade80" }}
        />
        <div className="min-w-0">
          <p
            className="font-mono text-[9px] uppercase tracking-[0.2em]"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Connected · chain {chainId}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <p
              className="font-mono text-[12px] truncate"
              style={{ color: "#fff" }}
            >
              {shorten(address)}
            </p>
            <button
              onClick={onCopy}
              className="w-6 h-6 rounded-md flex items-center justify-center transition hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.55)" }}
              aria-label="Copy address"
            >
              {copied ? (
                <Check className="w-3 h-3" style={{ color: "#4ade80" }} strokeWidth={2.4} />
              ) : (
                <Copy className="w-3 h-3" strokeWidth={1.6} />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => open()}
          className="rounded-xl px-3.5 py-2 font-grotesk text-[11px] uppercase tracking-wider transition"
          style={{
            background: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          Switch
        </button>
        <button
          onClick={() => disconnect()}
          className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-grotesk text-[11px] uppercase tracking-wider transition"
          style={{
            background: "rgba(255,80,80,0.08)",
            color: "rgba(255,140,140,0.95)",
            border: "1px solid rgba(255,80,80,0.25)",
          }}
        >
          <LogOut className="w-3 h-3" strokeWidth={2} />
          Disconnect
        </button>
      </div>
    </div>
  );
}
