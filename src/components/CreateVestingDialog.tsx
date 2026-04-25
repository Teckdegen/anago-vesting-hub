import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Modal } from "./Modal";
import { TokenPicker } from "./TokenPicker";
import { DurationPicker } from "./DurationPicker";
import { useContractAddresses } from "@/lib/web3/hooks";
import { VESTING_FACTORY_ABI } from "@/lib/web3/contracts";
import type { TokenInfo } from "@/lib/web3/tokens";

const ZERO = "0x0000000000000000000000000000000000000000" as const;
const isAddress = (s: string) => /^0x[a-fA-F0-9]{40}$/.test(s);

type Props = { open: boolean; onClose: () => void };

export function CreateVestingDialog({ open, onClose }: Props) {
  const { address } = useAccount();
  const { vestingFactory } = useContractAddresses();
  const [token, setToken] = useState<(TokenInfo & { balance: bigint }) | undefined>();
  const [beneficiary, setBeneficiary] = useState("");
  const [duration, setDuration] = useState(365 * 86400);
  const [withCliff, setWithCliff] = useState(false);
  const [cliff, setCliff] = useState(90 * 86400);

  const tx = useWriteContract();
  const rcpt = useWaitForTransactionReceipt({ hash: tx.data });

  const factoryUnset = vestingFactory === ZERO;
  const validBeneficiary = isAddress(beneficiary);

  const handleCreate = () => {
    if (!validBeneficiary || !token) return;
    const start = BigInt(Math.floor(Date.now() / 1000));
    if (withCliff) {
      tx.writeContract({
        address: vestingFactory,
        abi: VESTING_FACTORY_ABI,
        functionName: "createVestingWithCliff",
        args: [beneficiary as `0x${string}`, start, BigInt(duration), BigInt(cliff)],
      });
    } else {
      tx.writeContract({
        address: vestingFactory,
        abi: VESTING_FACTORY_ABI,
        functionName: "createVesting",
        args: [beneficiary as `0x${string}`, start, BigInt(duration)],
      });
    }
  };

  if (rcpt.isSuccess) {
    setTimeout(() => {
      tx.reset();
      onClose();
    }, 1500);
  }

  return (
    <Modal open={open} onClose={onClose} title="New Vesting Schedule">
      {factoryUnset ? (
        <p className="font-mono text-[11px] text-amber-400">
          VestingFactory address not configured. Deploy and set it in
          <code className="ml-1">src/lib/web3/contracts.ts</code>.
        </p>
      ) : !address ? (
        <p className="font-mono text-[11px] text-cream/65">Connect your wallet to continue.</p>
      ) : rcpt.isSuccess ? (
        <div className="space-y-3">
          <p className="font-grotesk text-cream uppercase text-[14px]">Schedule deployed</p>
          <p className="font-mono text-[10px] text-cream/65">
            Send {token?.symbol ?? "tokens"} directly to the new wallet to fund it.
            The wallet address will appear under My Schedules.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/55 mb-2">
              1. Token (used to fund the schedule afterwards)
            </p>
            <TokenPicker selected={token} onSelect={setToken} />
          </div>

          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/55 mb-2">
              2. Beneficiary
            </p>
            <input
              value={beneficiary}
              onChange={(e) => setBeneficiary(e.target.value.trim())}
              placeholder="0x…"
              className="w-full bg-transparent rounded-lg px-3 py-2.5 font-mono text-cream text-[12px] outline-none"
              style={{
                border: `1px solid ${
                  beneficiary && !validBeneficiary
                    ? "rgba(255,80,80,0.55)"
                    : "rgba(155,127,212,0.35)"
                }`,
              }}
            />
            <button
              onClick={() => address && setBeneficiary(address)}
              className="font-mono text-[9px] uppercase tracking-wider text-purple-300 hover:text-purple-200 mt-1"
            >
              use my address
            </button>
          </div>

          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/55 mb-2">
              3. Vesting Duration
            </p>
            <DurationPicker value={duration} onChange={setDuration} />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={withCliff}
                onChange={(e) => setWithCliff(e.target.checked)}
                className="accent-purple-400"
              />
              <span className="font-mono text-[10px] uppercase tracking-wider text-cream/75">
                Add a cliff
              </span>
            </label>
            {withCliff && <DurationPicker value={cliff} onChange={setCliff} />}
            {withCliff && cliff > duration && (
              <p className="font-mono text-[10px] text-red-400 mt-1">
                Cliff must be ≤ vesting duration.
              </p>
            )}
          </div>

          <button
            onClick={handleCreate}
            disabled={
              !token ||
              !validBeneficiary ||
              (withCliff && cliff > duration) ||
              tx.isPending ||
              rcpt.isLoading
            }
            className="w-full rounded-full py-3 font-grotesk text-[12px] uppercase tracking-wider transition disabled:opacity-50"
            style={{
              background: "rgba(155,127,212,0.3)",
              color: "#EDE0FF",
              border: "1px solid rgba(155,127,212,0.7)",
            }}
          >
            {tx.isPending || rcpt.isLoading ? "Deploying…" : "Create Vesting"}
          </button>

          {tx.error && (
            <p className="font-mono text-[10px] text-red-400 break-words">{tx.error.message}</p>
          )}
        </div>
      )}
    </Modal>
  );
}
