/**
 * Curated token list per chain. Add/remove entries here — every page that
 * shows balances reads from this list.
 *
 * Replace the placeholder addresses with real Monad-testnet token addresses.
 * `logoURI` may be omitted; the UI falls back to a colored initial.
 */
export type TokenInfo = {
  address: `0x${string}`;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
};

const NATIVE: TokenInfo = {
  address: "0x0000000000000000000000000000000000000000",
  symbol: "MON",
  name: "Monad",
  decimals: 18,
};

export const TOKEN_LISTS: Record<number, TokenInfo[]> = {
  10143: [
    NATIVE,
    // Replace these with real testnet token addresses:
    // {
    //   address: "0x...",
    //   symbol: "USDC",
    //   name: "USD Coin",
    //   decimals: 6,
    //   logoURI: "https://...",
    // },
  ],
};

export function getTokenList(chainId: number): TokenInfo[] {
  return TOKEN_LISTS[chainId] ?? [];
}

export const ERC20_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }],
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
] as const;
