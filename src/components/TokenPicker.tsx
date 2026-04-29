import { useState } from "react";
import { useAccount, useReadContracts } from "wagmi";
import { formatAmount } from "@/lib/web3/format";
import { ERC20_ABI, type TokenInfo } from "@/lib/web3/tokens";
import { Check, Search, Loader2 } from "lucide-react";

type Props = {
  selected?: TokenInfo;
  onSelect: (t: TokenInfo & { balance: bigint }) => void;
  excludeNative?: boolean;
};

const ZERO = "0x0000000000000000000000000000000000000000" as `0x${string}`;
const isAddr = (s: string): s is `0x${string}` => /^0x[a-fA-F0-9]{40}$/.test(s);

export function TokenPicker({ selected, onSelect, excludeNative }: Props) {
  const { address: wallet } = useAccount();
  const [input, setInput] = useState("");

  const addr = isAddr(input.trim()) ? (input.trim() as `0x${string}`) : null;

  const reads = useReadContracts({
    allowFailure: true,
    contracts: addr
      ? [
          { address: addr, abi: ERC20_ABI, functionName: "symbol" as const },
          { address: addr, abi: ERC20_ABI, functionName: "name" as const },
          { address: addr, abi: ERC20_ABI, functionName: "decimals" as const },
          {
            address: addr,
            abi: ERC20_ABI,
            functionName: "balanceOf" as const,
            args: wallet ? [wallet] : undefined,
          },
        ]
      : [],
    query: { enabled: !!addr && !!wallet },
  });

  const loading = reads.isLoading;
  const [symR, nameR, decR, balR] = reads.data ?? [];

  const resolved: (TokenInfo & { balance: bigint }) | null =
    addr && symR?.status === "success"
      ? {
          address: addr,
          symbol: symR.result as string,
          name: (nameR?.result as string) ?? "",
          decimals: (decR?.result as number) ?? 18,
          balance: balR?.status === "success" ? (balR.result as bigint) : 0n,
        }
      : null;

  const isSel = selected?.address?.toLowerCase() === addr?.toLowerCase();

  return (
    <div className="space-y-3">
      {/* Search / paste input */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
        style={{ background: "rgba(155,127,212,0.07)", border: "1px solid rgba(155,127,212,0.3)" }}
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" style={{ color: "rgba(196,168,240,0.6)" }} />
        ) : (
          <Search className="w-3.5 h-3.5 shrink-0" style={{ color: "rgba(196,168,240,0.5)" }} strokeWidth={1.5} />
        )}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.trim())}
          placeholder="Paste token contract address (0x…)"
          className="flex-1 bg-transparent font-mono text-[11px] outline-none placeholder:text-[rgba(155,127,212,0.4)]"
          style={{ color: "#EDE0FF" }}
          spellCheck={false}
        />
        {input && (
          <button
            onClick={() => setInput("")}
            className="font-mono text-[10px] transition hover:opacity-80"
            style={{ color: "rgba(196,168,240,0.45)" }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Hint */}
      {!input && (
        <p className="font-mono text-[12px]" style={{ color: "rgba(196,168,240,0.5)" }}>
          Paste any ERC-20 contract address — symbol, name and balance will load automatically.
        </p>
      )}

      {/* Invalid address warning */}
      {input && !addr && (
        <p className="font-mono text-[10px]" style={{ color: "rgba(255,120,120,0.85)" }}>
          Not a valid address — must be 0x followed by 40 hex characters.
        </p>
      )}

      {/* Resolved token card */}
      {resolved && (
        <button
          onClick={() => onSelect(resolved)}
          className="w-full text-left rounded-xl p-3 relative transition active:scale-[0.99]"
          style={{
            background: isSel ? "rgba(155,127,212,0.15)" : "rgba(155,127,212,0.05)",
            border: `1px solid ${isSel ? "rgba(155,127,212,0.55)" : "rgba(155,127,212,0.2)"}`,
          }}
        >
          {isSel && (
            <span
              className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full flex items-center justify-center"
              style={{ background: "#9B7FD4", color: "#0D0B14" }}
            >
              <Check className="w-2.5 h-2.5" strokeWidth={3} />
            </span>
          )}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-grotesk text-[12px] shrink-0"
              style={{ background: "rgba(155,127,212,0.2)", color: "#EDE0FF", border: "1px solid rgba(155,127,212,0.4)" }}
            >
              {resolved.symbol[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-grotesk text-[13px] uppercase tracking-wider" style={{ color: "#EDE0FF" }}>
                {resolved.symbol}
              </p>
              <p className="font-mono text-[9px] truncate" style={{ color: "rgba(196,168,240,0.5)" }}>
                {resolved.name}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-mono text-[11px] tabular-nums" style={{ color: "rgba(237,224,255,0.85)" }}>
                {formatAmount(resolved.balance, resolved.decimals)}
              </p>
              <p className="font-mono text-[9px]" style={{ color: "rgba(196,168,240,0.4)" }}>
                balance
              </p>
            </div>
          </div>
        </button>
      )}

      {/* No balance warning */}
      {resolved && resolved.balance === 0n && !excludeNative && (
        <p className="font-mono text-[9px]" style={{ color: "rgba(255,180,50,0.85)" }}>
          Your balance is 0 for this token.
        </p>
      )}

      {/* Currently selected (different from input) */}
      {selected && selected.address !== addr && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: "rgba(155,127,212,0.08)", border: "1px solid rgba(155,127,212,0.2)" }}
        >
          <Check className="w-3 h-3 shrink-0" style={{ color: "rgba(155,127,212,0.7)" }} />
          <p className="font-mono text-[10px]" style={{ color: "rgba(196,168,240,0.7)" }}>
            Selected: <span style={{ color: "#EDE0FF" }}>{selected.symbol}</span>
          </p>
        </div>
      )}
    </div>
  );
}
