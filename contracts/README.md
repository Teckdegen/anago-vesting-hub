# Dog House Contracts

Solidity contracts for the **Vesting** and **Token Lock** sections of the dashboard.

| Contract                | Purpose                                                                 |
|-------------------------|-------------------------------------------------------------------------|
| `VestingWallet.sol`     | OpenZeppelin v5.6 vesting wallet (linear schedule).                     |
| `VestingWalletCliff.sol`| OpenZeppelin v5.1 abstract cliff extension.                             |
| `VestingCliff.sol`      | Concrete (deployable) `VestingWalletCliff`.                             |
| `VestingFactory.sol`    | Deploys vesting / cliff vesting wallets in one tx + on-chain registry.  |
| `TokenLock.sol`         | Singleton time-lock for ERC-20 tokens (separate from vesting).          |

## Vesting vs Lock — when to use which

- **Vesting**: linear release of funds over time, optionally with a cliff.
  Funds drip out of a per-recipient wallet. Built on the audited OZ
  `VestingWallet`. Deployed via `VestingFactory`.
- **Token Lock**: hard time-lock. Tokens cannot be touched until the unlock
  timestamp; afterwards the owner withdraws the full amount in one call.
  All locks live in a single `TokenLock` contract instance.

## Setup

```bash
cd contracts
npm install
cp .env.example .env       # fill PRIVATE_KEY
```

## Compile

```bash
npm run compile
```

## Deploy to Monad testnet

```bash
# 1. Vesting factory (deploys vesting + cliff vesting from the dashboard)
npm run deploy:factory

# 2. Token lock (singleton — every user lock lives inside this contract)
npm run deploy:lock

# Optional: stand-alone vesting wallets without going through the factory
BENEFICIARY=0xYourAddr START=1767225600 DURATION=31536000 \
  npm run deploy:vesting

BENEFICIARY=0xYourAddr START=1767225600 DURATION=31536000 CLIFF=7776000 \
  npm run deploy:cliff
```

Both deploys append their addresses to `contracts/deployments.json`. Copy
them into the frontend at [src/lib/web3/contracts.ts](../src/lib/web3/contracts.ts).

## Verify on Monad explorer

```bash
npm run verify -- <ADDRESS> [...constructor args]
```

## Using the contracts

**Vesting (via factory)**
```solidity
factory.createVesting(beneficiary, startTimestamp, durationSeconds);
factory.createVestingWithCliff(beneficiary, startTimestamp, durationSeconds, cliffSeconds);
```
Then send ERC-20 / native MON to the returned wallet address. Anyone can
call `release()` / `release(token)` on the wallet — funds always go to the
beneficiary.

**Token Lock**
```solidity
// 1. approve TokenLock to pull `amount`
IERC20(token).approve(address(tokenLock), amount);
// 2. lock until `unlockAt` (must be in the future)
uint256 id = tokenLock.createLock(token, amount, unlockAt);
// 3. after unlock time:
tokenLock.withdraw(id);
// optional:
tokenLock.extendLock(id, laterUnlockAt);    // can only push later
tokenLock.transferLockOwnership(id, newOwner);
```
