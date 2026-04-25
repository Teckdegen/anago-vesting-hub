import { useMemo } from "react";
import { useChainId, useReadContract } from "wagmi";
import { useContractAddresses } from "./hooks";
import { TOKEN_LOCK_ABI } from "./contracts";
import { bigintToUsd, PRICE_MAP, useTokenPriceUsd } from "./prices";
import { getTokenList } from "./tokens";

const ZERO = "0x0000000000000000000000000000000000000000" as const;

/**
 * Composable USD TVL.
 *
 * Each protocol module exposes one hook that returns `{ usd, isLoading }`.
 * `useProtocolTVL()` sums them. Adding CLMM or Farms later is one line:
 * write a `useCLMMTVL` hook and add it to the sum below.
 */

// ── Token Lock ───────────────────────────────────────────────────────────
function useLocksUsdEntries() {
  const { tokenLock } = useContractAddresses();

  const board = useReadContract({
    address: tokenLock,
    abi: TOKEN_LOCK_ABI,
    functionName: "tokenLeaderboard",
    args: [0n, 200n],
    query: { enabled: tokenLock !== ZERO },
  });

  const entries = useMemo(() => {
    const d = board.data as
      | readonly [readonly `0x${string}`[], readonly bigint[]]
      | undefined;
    if (!d) return [] as { token: `0x${string}`; amount: bigint }[];
    const [addrs, amts] = d;
    return addrs.map((token, i) => ({ token, amount: amts[i] }));
  }, [board.data]);

  return { entries, isLoading: board.isLoading };
}

export function useLocksTVL(): { usd: number; isLoading: boolean } {
  const chainId = useChainId();
  const { entries, isLoading } = useLocksUsdEntries();
  const tokenList = getTokenList(chainId);

  // We need decimals + price per token. Decimals come from the curated list;
  // unknown tokens fall back to 18 and contribute $0 (price 0).
  const usd = useMemo(() => {
    let total = 0;
    for (const { token, amount } of entries) {
      const meta = tokenList.find(
        (t) => t.address.toLowerCase() === token.toLowerCase(),
      );
      const decimals = meta?.decimals ?? 18;
      const price = priceLookup(chainId, token);
      total += bigintToUsd(amount, decimals, price);
    }
    return total;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, chainId]);

  return { usd, isLoading };
}

// ── Vesting (placeholder until per-wallet token+balance reads are wired) ─
export function useVestingTVL(): { usd: number; isLoading: boolean } {
  // Vesting wallets each hold an arbitrary mix of assets. Computing USD
  // requires reading every wallet's balance per token. That's fine to add
  // later — for now this returns 0 and contributes nothing to the total.
  return { usd: 0, isLoading: false };
}

// ── CLMM (placeholder) ──────────────────────────────────────────────────
export function useCLMMTVL(): { usd: number; isLoading: boolean } {
  return { usd: 0, isLoading: false };
}

// ── Yield Farm (placeholder) ────────────────────────────────────────────
export function useFarmTVL(): { usd: number; isLoading: boolean } {
  return { usd: 0, isLoading: false };
}

// ── Aggregate ───────────────────────────────────────────────────────────
export function useProtocolTVL(): { usd: number; isLoading: boolean } {
  const locks = useLocksTVL();
  const vesting = useVestingTVL();
  const clmm = useCLMMTVL();
  const farm = useFarmTVL();
  return {
    usd: locks.usd + vesting.usd + clmm.usd + farm.usd,
    isLoading: locks.isLoading || vesting.isLoading || clmm.isLoading || farm.isLoading,
  };
}

// ── helpers ─────────────────────────────────────────────────────────────

// Non-hook variant of useTokenPriceUsd; safe to call inside loops/useMemo.
function priceLookup(chainId: number, token: string): number {
  const map = PRICE_MAP[chainId] ?? {};
  const lower = token.toLowerCase();
  return (
    map[token] ??
    map[lower] ??
    Object.entries(map).find(([k]) => k.toLowerCase() === lower)?.[1] ??
    0
  );
}

// re-export for convenience
export { useTokenPriceUsd };
