import { useUserTokens } from "@/lib/web3/hooks";
import { formatAmount } from "@/lib/web3/format";
import type { TokenInfo } from "@/lib/web3/tokens";

type Props = {
  selected?: TokenInfo;
  onSelect: (t: TokenInfo & { balance: bigint }) => void;
  /** if true, hide the native token (locks need ERC-20 approval flow) */
  excludeNative?: boolean;
};

export function TokenPicker({ selected, onSelect, excludeNative }: Props) {
  const { tokens, isLoading } = useUserTokens();
  const filtered = excludeNative
    ? tokens.filter((t) => t.address !== "0x0000000000000000000000000000000000000000")
    : tokens;

  if (isLoading) {
    return <p className="font-mono text-[10px] text-cream/55">Loading balances…</p>;
  }
  if (filtered.length === 0) {
    return (
      <p className="font-mono text-[10px] text-cream/55">
        No tokens in your wallet. Add tokens to{" "}
        <code className="text-[10px]">src/lib/web3/tokens.ts</code>.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {filtered.map((t) => {
        const isSel = selected?.address === t.address;
        return (
          <button
            key={t.address}
            onClick={() => onSelect(t)}
            className="text-left rounded-lg p-3 transition active:scale-[0.98]"
            style={{
              background: isSel ? "rgba(155,127,212,0.25)" : "rgba(155,127,212,0.08)",
              border: `1px solid ${isSel ? "rgba(155,127,212,0.65)" : "rgba(155,127,212,0.3)"}`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              {t.logoURI ? (
                <img src={t.logoURI} alt={t.symbol} className="w-7 h-7 rounded-full" />
              ) : (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center font-grotesk text-[11px]"
                  style={{ background: "rgba(155,127,212,0.25)", color: "#C4A8F0" }}
                >
                  {t.symbol[0]}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-grotesk text-cream text-[12px] uppercase tracking-wider truncate">
                  {t.symbol}
                </p>
                <p className="font-mono text-[9px] text-cream/55 truncate">{t.name}</p>
              </div>
            </div>
            <p className="font-mono text-[10px] text-cream/75 tabular-nums">
              {formatAmount(t.balance, t.decimals)} {t.symbol}
            </p>
          </button>
        );
      })}
    </div>
  );
}
