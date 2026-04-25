import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CheckCircle2, Copy } from "lucide-react";
import { Modal } from "./Modal";
import { TokenPicker } from "./TokenPicker";
import { DurationPicker } from "./DurationPicker";
import { useContractAddresses } from "@/lib/web3/hooks";
import { VESTING_FACTORY_ABI } from "@/lib/web3/contracts";
import type { TokenInfo } from "@/lib/web3/tokens";
import { shortAddr } from "@/lib/web3/format";

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
  const cliffInvalid = withCliff && cliff > duration;

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

  const reset = () => {
    tx.reset();
    setBeneficiary("");
    setToken(undefined);
    setWithCliff(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="New Vesting Schedule">
      {factoryUnset ? (
        <Notice tone="warn">
          VestingFactory address not configured. Deploy it and paste the address into{" "}
          <code style={{ color: "rgba(255,255,255,0.7)" }}>src/lib/web3/contracts.ts</code>.
        </Notice>
      ) : !address ? (
        <Notice tone="info">Connect your wallet to continue.</Notice>
      ) : rcpt.isSuccess ? (
        <SuccessState onDone={reset} />
      ) : (
        <div className="space-y-5">
          {/* Step 1 — Token */}
          <div>
            <Label>1. Token</Label>
            <Hint>Used to label the schedule. Fund the wallet with this token afterwards.</Hint>
            <TokenPicker selected={token} onSelect={setToken} />
          </div>

          {/* Step 2 — Beneficiary */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>2. Beneficiary</Label>
              <button
                onClick={() => address && setBeneficiary(address)}
                className="font-mono text-[9px] uppercase tracking-wider transition hover:opacity-80"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                Use my address
              </button>
            </div>
            <input
              value={beneficiary}
              onChange={(e) => setBeneficiary(e.target.value.trim())}
              placeholder="0x…"
              className="w-full bg-transparent rounded-xl px-4 py-3 font-mono text-[12px] outline-none transition"
              style={{
                color: "#fff",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${
                  beneficiary && !validBeneficiary
                    ? "rgba(255,100,100,0.55)"
                    : "rgba(255,255,255,0.12)"
                }`,
              }}
            />
            {beneficiary && !validBeneficiary && (
              <p
                className="font-mono text-[10px] mt-1.5"
                style={{ color: "rgba(255,120,120,0.9)" }}
              >
                Not a valid address.
              </p>
            )}
          </div>

          {/* Step 3 — Duration */}
          <div>
            <Label>3. Vesting Duration</Label>
            <DurationPicker value={duration} onChange={setDuration} />
          </div>

          {/* Step 4 — Cliff */}
          <div>
            <button
              onClick={() => setWithCliff((v) => !v)}
              className="w-full flex items-center justify-between rounded-xl px-4 py-3 transition"
              style={{
                background: withCliff ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${
                  withCliff ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)"
                }`,
              }}
            >
              <div className="text-left">
                <p
                  className="font-grotesk text-[11px] uppercase tracking-wider"
                  style={{ color: "#fff" }}
                >
                  Add a cliff
                </p>
                <p
                  className="font-mono text-[9px] mt-0.5"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  Nothing vests until cliff date
                </p>
              </div>
              <Toggle on={withCliff} />
            </button>

            {withCliff && (
              <div className="mt-3">
                <DurationPicker value={cliff} onChange={setCliff} />
                {cliffInvalid && (
                  <p
                    className="font-mono text-[10px] mt-2"
                    style={{ color: "rgba(255,120,120,0.9)" }}
                  >
                    Cliff must be ≤ vesting duration.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action */}
          <ActionButton
            onClick={handleCreate}
            disabled={
              !token ||
              !validBeneficiary ||
              cliffInvalid ||
              tx.isPending ||
              rcpt.isLoading
            }
            loading={tx.isPending || rcpt.isLoading}
            label="Deploy Vesting"
            loadingLabel="Deploying…"
          />

          {tx.error && (
            <p
              className="font-mono text-[10px] break-words"
              style={{ color: "rgba(255,100,100,0.9)" }}
            >
              {tx.error.message}
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}

// ── tiny presentational helpers, keep visual parity with CreateLockDialog ──

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-mono text-[9px] uppercase tracking-[0.18em] mb-2"
      style={{ color: "rgba(255,255,255,0.4)" }}
    >
      {children}
    </p>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-mono text-[9px] mb-2 -mt-1"
      style={{ color: "rgba(255,255,255,0.35)" }}
    >
      {children}
    </p>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      className="relative w-9 h-5 rounded-full transition shrink-0"
      style={{ background: on ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.1)" }}
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
        style={{
          left: on ? "calc(100% - 18px)" : "2px",
          background: on ? "#0D0B14" : "rgba(255,255,255,0.6)",
        }}
      />
    </span>
  );
}

function ActionButton({
  onClick,
  disabled,
  loading,
  label,
  loadingLabel,
}: {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  label: string;
  loadingLabel: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-xl py-3 font-grotesk text-[12px] uppercase tracking-wider transition disabled:opacity-40 active:scale-[0.99]"
      style={{
        background: "rgba(255,255,255,0.1)",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.2)",
      }}
    >
      {loading ? loadingLabel : label}
    </button>
  );
}

function Notice({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "info" | "warn";
}) {
  const color = tone === "warn" ? "rgba(255,180,50,0.9)" : "rgba(255,255,255,0.55)";
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <p className="font-mono text-[11px] leading-relaxed" style={{ color }}>
        {children}
      </p>
    </div>
  );
}

function SuccessState({ onDone }: { onDone: () => void }) {
  // The deployed wallet address is in the receipt logs; the user can read it
  // from the explorer. Show a clean confirmation.
  return (
    <div className="text-center py-3">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.18)",
        }}
      >
        <CheckCircle2 className="w-5 h-5" style={{ color: "#fff" }} strokeWidth={1.5} />
      </div>
      <p
        className="font-grotesk uppercase tracking-wider text-[14px] mb-1"
        style={{ color: "#fff" }}
      >
        Schedule deployed
      </p>
      <p
        className="font-mono text-[10px] max-w-[280px] mx-auto leading-relaxed"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        Send tokens to the new wallet to fund it. The wallet shows up under My
        Schedules — funds will vest from there.
      </p>
      <button
        onClick={onDone}
        className="mt-5 rounded-xl px-5 py-2.5 font-grotesk text-[11px] uppercase tracking-wider transition"
        style={{
          background: "rgba(255,255,255,0.1)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        Done
      </button>
    </div>
  );
}

// (intentionally unused — kept as a hint for future use when we surface the
// deployed wallet address in the success state by parsing receipt logs)
void Copy;
void shortAddr;
