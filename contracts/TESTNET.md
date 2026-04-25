# Monad Testnet — Deploy & Test Runbook

End-to-end recipe for deploying the Vesting + Token Lock contracts to Monad
testnet and exercising every flow from the dashboard.

---

## 0. Prereqs

- Node 18+ and `npm` (or `bun`).
- A Monad-testnet wallet with some test MON. Faucet: <https://faucet.monad.xyz>.
- Reown Cloud project ID (for WalletConnect) — get one at <https://cloud.reown.com>.

Network details (already in `hardhat.config.ts` and `src/lib/web3/config.ts`):

| Field        | Value                              |
|--------------|------------------------------------|
| Chain ID     | `10143`                            |
| RPC          | `https://testnet-rpc.monad.xyz`    |
| Native token | `MON`                              |
| Explorer     | `https://testnet.monadexplorer.com`|

---

## 1. Install & configure

```bash
# from repo root
bun install        # frontend deps (wagmi, viem, reown appkit)

cd contracts
npm install        # hardhat + openzeppelin
cp .env.example .env
```

Edit `contracts/.env`:

```
PRIVATE_KEY=0x<your funded testnet key>
MONAD_TESTNET_RPC=https://testnet-rpc.monad.xyz
```

Edit `.env.local` at the **repo root** (create it if missing):

```
VITE_REOWN_PROJECT_ID=<your-reown-project-id>
```

---

## 2. Compile

```bash
cd contracts
npm run compile
```

You should see:

```
Compiled 5 Solidity files successfully
```

Files: `VestingWallet`, `VestingWalletCliff`, `VestingCliff`, `VestingFactory`, `TokenLock`.

---

## 3. Deploy

Both contracts are independent — order doesn't matter. Run them once each:

```bash
npm run deploy:factory
npm run deploy:lock
```

Expected output (one example):

```
Deployer: 0xYourAddr (monadTestnet)
VestingFactory deployed → 0xFactory…
TokenLock      deployed → 0xLock…
```

Both addresses are **also written** to `contracts/deployments.json`.

### Wire the addresses into the frontend

Open `src/lib/web3/contracts.ts` and replace the placeholders under chain `10143`:

```ts
export const CONTRACTS: Record<number, {
  vestingFactory: `0x${string}`;
  tokenLock: `0x${string}`;
}> = {
  10143: {
    vestingFactory: "0xFactory…",
    tokenLock:      "0xLock…",
  },
};
```

---

## 4. (Optional) Verify on Monad explorer

```bash
npm run verify -- 0xFactory…
npm run verify -- 0xLock…
```

If verification needs constructor args, append them after the address:

```bash
# Example for a stand-alone VestingCliff:
npm run verify -- 0xWallet… 0xBeneficiary 1767225600 31536000 7776000
```

---

## 5. Get test ERC-20s

You need at least one ERC-20 in your wallet to test the Lock flow.
Two options:

**A. Use existing testnet tokens.** Add their addresses to
`src/lib/web3/tokens.ts` under chain `10143`:

```ts
{
  address: "0xUsdcOnMonadTestnet",
  symbol:  "USDC",
  name:    "USD Coin",
  decimals: 6,
  logoURI: "https://…",
}
```

**B. Deploy a throwaway test ERC-20.** Quickest one-liner using OpenZeppelin
`ERC20PresetMinterPauser` (already in the OZ install). Create
`contracts/contracts/TestERC20.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestERC20 is ERC20 {
    constructor() ERC20("Test", "TEST") {
        _mint(msg.sender, 1_000_000 ether);
    }
}
```

…and a script `contracts/scripts/deployTest.ts`:

```ts
import { ethers } from "hardhat";
async function main() {
  const T = await ethers.getContractFactory("TestERC20");
  const t = await T.deploy();
  await t.waitForDeployment();
  console.log("TestERC20 →", await t.getAddress());
}
main().catch((e) => { console.error(e); process.exitCode = 1; });
```

```bash
npm run compile
npx hardhat run scripts/deployTest.ts --network monadTestnet
```

Then add the printed address to `src/lib/web3/tokens.ts`.

---

## 6. Run the dashboard

```bash
# repo root
bun dev
```

Open <http://localhost:5173>. Click **Connect** → pick your wallet → switch
to Monad Testnet (the modal will prompt). The header should show your
shortened address.

---

## 7. Test the **Token Lock** flow

1. Go to **Token Lock** page.
2. Click **+ New** — the bottom sheet slides up (mobile) or modal opens (desktop).
3. **Step 1**: pick the test token. Card shows logo / ticker / name / balance.
4. **Step 2**: type an amount, or hit **Max**.
5. **Step 3**: pick **5m** for fastest possible test.
6. Click **Approve <SYMBOL>** — confirm in wallet (1st tx).
7. The button flips to **Lock Tokens** — confirm in wallet (2nd tx).
8. Modal closes. Switch to **My Locks** tab — your new lock is there with
   a `Time Left` countdown.
9. Switch to **Unlocking Soon** — the same lock appears (anything ≤ 3 days).
10. Switch to **Token Leaderboard** and **User Leaderboard** — both should
    now show the token / your address.
11. Wait for the timer to hit zero (~5 min for the shortest preset). The row's
    button changes from `Locked` → **Withdraw**. Click it, confirm.
12. After receipt, the row says `Withdrawn` and the leaderboards drop the
    contribution. ✅

### Sanity-check that locks **can't be unlocked early**

Try clicking Withdraw before the unlock time elapses — the contract will
revert with `StillLocked()`. The button is hidden in the UI before that
point; you'd need to call directly with viem/cast to test.

---

## 8. Test the **Vesting** flow

1. Go to **Vesting** page.
2. Click **+ New** — sheet slides up.
3. **Step 1**: pick a token (used for labelling; you'll fund manually later).
4. **Step 2**: paste a beneficiary address (or click **Use my address**).
5. **Step 3**: pick **5m** vesting duration.
6. Optional: toggle **Add a cliff**, choose a cliff ≤ duration (try **1m**).
7. Click **Deploy Vesting** — confirm tx. Success state appears.
8. Open the explorer link from the tx receipt → you'll see a **VestingCreated**
   event with the new wallet address.
9. **Fund it**: send some test ERC-20 (or native MON) directly to that wallet
   address from your wallet. The vesting schedule starts immediately.
10. Back on the Vesting page → **My Schedules**. Your row should show
    `Releasable` increasing over time as the linear schedule unlocks.
11. Once `Releasable > 0`, click **Claim** — confirm tx. The funds arrive at
    the beneficiary.

### Cliff behavior

If you set a 1-minute cliff with a 5-minute duration, `Releasable` will stay
**0** for the first 60 seconds, then jump to `(elapsed/duration) * total` and
keep climbing.

---

## 9. Verify the **Dashboard**

Visit `/dashboard` while connected:

- **Token Locks** row → `N active`, claimable count.
- **Vesting** row → `N schedules`.
- Lower section shows up to 3 locks (with unlock date / "Claimable") and 3
  vesting wallet addresses.

---

## 10. Verify the **Landing TVL**

Visit `/`. Bottom-right shows:

- Big number = on-chain magnitude of currently-locked amount (raw, mixed
  decimals — relative indicator only).
- Subtitle = `X tokens · Y locks · Z schedules`, all read live from chain.

Create another lock from a second wallet — the numbers update on refresh.

---

## Limits & answers to common questions

**Shortest possible lock?**
The contract requires `unlockAt > block.timestamp`, so technically **1
second**. The DurationPicker's shortest preset is **5 minutes** (added for
testnet). You can lower it further by editing
`src/components/DurationPicker.tsx`.

**Shortest possible vesting?**
`durationSeconds > 0`, so **1 second** at the contract level. Cliff must be
`≤ duration`. The picker's shortest is **5m**.

**Can a lock be unlocked early?**
No. `withdraw(id)` reverts with `StillLocked()` until `block.timestamp >=
unlockAt`. `extendLock(id, …)` can only push the unlock time **later**, never
sooner.

**Where do leaderboards come from?**
On-chain only — the `TokenLock` contract maintains `_totalLockedByToken`
and `_totalLockedByUser` mappings, plus address arrays. The UI calls
`tokenLeaderboard(offset, limit)` and `userLeaderboard(offset, limit)` and
sorts client-side. No indexer.

**Can someone steal a lock?**
`createLock` records `owner = msg.sender`. Only the owner can `withdraw`,
`extendLock`, or `transferLockOwnership`. Funds custody lives entirely
inside the audited OZ-style contract — no admin, no upgradeability, no
escape hatch.

**Why does the TVL show a count, not USD?**
There is no Monad-testnet price oracle wired in. The bigint sum is shown as
a relative magnitude. To get USD, plug a price source (Pyth feed / curated
map) into the formatter in `src/routes/index.tsx`.

---

## Troubleshooting

**“ConfigUnset” warning in console** — you forgot to set
`VITE_REOWN_PROJECT_ID` in `.env.local`. Fix → restart `bun dev`.

**Modal opens but "+ New" address shows the warning notice** — you didn't
paste the deployed `vestingFactory` / `tokenLock` addresses into
`src/lib/web3/contracts.ts`. Save the file, the page hot-reloads.

**TokenPicker shows "No tokens detected"** — the curated list in
`src/lib/web3/tokens.ts` is empty (only contains native `MON`). Add at
least one ERC-20 entry to test the lock flow.

**Approve goes through but Lock fails with "AmountMismatch"** — the token
is fee-on-transfer and reduced the amount on transfer. The contract handles
this by recording the actual delta — but if `received == 0` (e.g. 100% fee
or rebasing token shrinks instantly) it reverts. Use a clean ERC-20.

**Tx revert "UnlockInPast"** — your local clock is ahead of the chain. Use
a duration ≥ 1 minute to be safe.
