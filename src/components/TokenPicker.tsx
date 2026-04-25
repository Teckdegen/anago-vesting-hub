import { useUserTokens } from "@/lib/web3/hooks";
import { formatAmount } from "@/lib/web3/format";
import type { TokenInfo } from "@/lib/web3/tokens";
import { Check } from "lucide-react";

type Props = {
  selected?: TokenInfo;
  onSelect: (t: TokenInfo & { balance: bigint }) => void;
  /** if true, hide the native token (locks need ERC-20 approval flow) */
  excludeNative?: boolean;
};

const ZERO = "0x0000000000000000000000000000000000000000";

export function TokenPicker({ selected, onSelect, excludeNative }: Props) {
  const { tokens, isLoading } = useUserTokens();
  const filtered = excludeNative ? tokens.filter((t) => t.address !== ZERO) : tokens;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-[68px] rounded-xl animate-pulse"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          />
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div
        className="rounded-xl px-4 py-5 text-center"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px dashed rgba(255,255,255,0.14)",
        }}
      >
        <p className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.6)" }}>
          No tokens found in your wallet
        </p>
        <p className="font-mono text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
          Make sure your wallet is connected and has token balances on Monad testnet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {filtered.map((t) => {
        const isSel = selected?.address === t.address;
        return (
          <button
            key={t.address}
            onClick={() => onSelect(t)}
            className="text-left rounded-xl p-3 relative transition active:scale-[0.985]"
            style={{
              background: isSel ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${isSel ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.08)"}`,
              boxShadow: isSel
                ? "inset 0 0 0 1px rgba(255,255,255,0.06)"
                : "none",
            }}
          >
            {isSel && (
              <span
                className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.95)", color: "#0D0B14" }}
              >
                <Check className="w-2.5 h-2.5" strokeWidth={3} />
              </span>
            )}

            <div className="flex items-center gap-2 mb-2">
              {t.logoURI ? (
                <img
                  src={t.logoURI}
                  alt={t.symbol}
                  className="w-7 h-7 rounded-full"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                />
              ) : (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center font-grotesk text-[11px]"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.85)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {t.symbol[0]}
                </div>
              )}
              <div className="min-w-0">
                <p
                  className="font-grotesk text-[12px] uppercase tracking-wider truncate"
                  style={{ color: "#fff" }}
                >
                  {t.symbol}
                </p>
                <p
                  className="font-mono text-[9px] truncate"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {t.name}
                </p>
              </div>
            </div>
            <p
              className="font-mono text-[10px] tabular-nums"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              {formatAmount(t.balance, t.decimals)}{" "}
              <span style={{ color: "rgba(255,255,255,0.4)" }}>{t.symbol}</span>
            </p>
          </button>
        );
      })}
    </div>
  );
}
