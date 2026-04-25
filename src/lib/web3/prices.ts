/**
 * USD price source. Today this is a static map per chain — every token
 * defaults to $0 unless listed here. Drop in a Pyth / Chainlink / API hook
 * later by changing only `useTokenPriceUsd` below; nothing else needs to
 * move.
 *
 * Prices are USD per whole token (decimals already applied).
 *
 * Add entries when you list a token. Lowercased addresses recommended.
 */
export const PRICE_MAP: Record<number, Record<string, number>> = {
  10143: {
    // Native MON — set when there's a market price; 0 keeps it out of TVL.
    "0x0000000000000000000000000000000000000000": 0,
    // "0xUsdcAddress": 1,
    // "0xWmonAddress": 2.5,
  },
};

/**
 * Hook returning USD per whole token. Today: synchronous lookup. Tomorrow:
 * swap the body for a price-feed read; consumers don't change.
 */
export function useTokenPriceUsd(chainId: number, token: string): number {
  const lower = token.toLowerCase();
  const map = PRICE_MAP[chainId] ?? {};
  // exact match first, else case-insensitive
  return (
    map[token] ??
    map[lower] ??
    Object.entries(map).find(([k]) => k.toLowerCase() === lower)?.[1] ??
    0
  );
}

/**
 * Convert a raw bigint amount (with `decimals`) and USD-per-token price
 * into a `number` of dollars. Lossy for huge values — only call for
 * display.
 */
export function bigintToUsd(
  amount: bigint,
  decimals: number,
  priceUsd: number,
): number {
  if (priceUsd === 0 || amount === 0n) return 0;
  // Convert bigint to a regular number safely by going through a string.
  // Acceptable because we only render this; never feed it back on-chain.
  const whole = Number(amount) / 10 ** decimals;
  return whole * priceUsd;
}
