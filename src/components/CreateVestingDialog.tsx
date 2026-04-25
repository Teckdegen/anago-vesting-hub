import { useState } from "react";
import { parseUnits } from "viem";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CheckCircle2 } from "lucide-react";
import { Modal } from "./Modal";
import { TokenPicker } from "./TokenPicker";
import { DurationPicker } from "./DurationPicker";
import { useContractAddresses } from "@/lib/web3/hooks";
import { VESTING_FACTORY_ABI } from "@/lib/web3/contracts";
import { ERC20_ABI, type TokenInfo } from "@/lib/web3/tokens";
import { formatAmount } from "@/lib/web3/format";

const ZERO = "0x0000000000000000000000000000000000000000" as const;
const isAddress = (s: string) => /^0x[a-fA-F0-9]{40}$/.test(s);

type Props = { open: boolean; onClose: () => void };

export function CreateVestingDialog({ open, onClose }: Props) {
  const { address } = useAccount();
  const { vestingFactory } = useContractAddresses();

  const [token, setToken] = useState<(TokenInfo & { balance: bigint }) | undefined>();
  const [amount, setAmount] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [duration, setDuration] = useState(365 * 86400);
  const [withCliff, setWithCliff] = useState(false);
  const [cliff, setCliff] = useState(90 * 86400);

  const parsedAmount = (() => {
    if (!token || !amount) return 0n;
    try { return parseUnits(amount, token.decimals); } catch { return 0n; }
  })();

  // Allowance check — same pattern as CreateLockDialog
  const allowanceQ = useReadContract({
    address: token?.address,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address && token ? [address, vestingFactory] : undefined,
    query: {
      enabled: !!address && !!token && token.address !== ZERO,
      refetchInterval: 2000,
    },
  });
  const allowance = (allowanceQ.data as bigint | undefined) ?? 0n;
  const needsApproval = parsedAmount > 0n && parsedAmount > allowance;

  const approveTx = useWriteContract();
  const vestTx = useWriteContract();
  const approveRcpt = useWaitForTransactionReceipt({ hash: approveTx.data });
  const vestRcpt = useWaitForTransactionReceipt({ hash: vestTx.data });

  if (approveRcpt.isSuccess) allowanceQ.refetch();

  const factoryUnset = vestingFactory === ZERO;
  const validBeneficiary = isAddress(beneficiary);
  const cliffInvalid = withCliff && cliff > duration;

  const handleApprove = () => {
    if (!token) return;
    approveTx.writeContract({
      address: token.address,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [vestingFactory, parsedAmount],
    });
  };

  const handleCreate = () => {
    if (!validBeneficiary || !token) return;
    const start = BigInt(Math.floor(Date.now() / 1000));
    if (withCliff) {
      vestTx.writeContract({
        address: vestingFactory,
        abi: VESTING_FACTORY_ABI,
        functionName: "createVestingWithCliff",
        args: [
          beneficiary as `0x${string}`,
          token.address,
          parsedAmount,
          start,
          BigInt(duration),
          BigInt(cliff),
        ],
      });
    } else {
      vestTx.writeContract({
        address: vestingFactory,
        abi: VESTING_FACTORY_ABI,
        functionName: "createVesting",
        args: [
          beneficiary as `0x${string}`,
          token.address,
          parsedAmount,
          start,
          BigInt(duration),
        ],
      });
    }
  };

  const reset = () => {
    vestTx.reset();
    approveTx.reset();
    setBeneficiary("");
    setToken(undefined);
    setAmount("");
    setWithCliff(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="New Vesting Schedule">
      {factoryUnset ? (
        <Notice tone="warn">
          VestingFactory not configured. Set the address in{" "}
          <code style={{ color: "rgba(255,255,255,0.7)" }}>src/lib/web3/contracts.ts</code>.
        </Notice>
      ) : !address ? (
        <Notice tone="info">Connect your wallet to continue.</Notice>
      ) : vestRcpt.isSuccess ? (
        <SuccessState onDone={reset} />
      ) : (
        <div className="space-y-5">

          {/* Step 1 — Token */}
          <div>
            <Label>1. Token to vest</Label>
            <TokenPicker selected={token} onSelect={setToken} excludeNative />
          </div>

          {token && (
            <>
              {/* Step 2 — Amount */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>2. Amount</Label>
                  <button
                    onClick={() => setAmount(formatAmount(token.balance, token.decimals, 8))}
                    className="font-mono text-[9px] uppercase tracking-wider transition hover:opacity-80"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    Max: {formatAmount(token.balance, token.decimals)}
                  </button>
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                  placeholder="0.0"
                  className="w-full bg-transparent rounded-xl px-4 py-3 font-grotesk text-[20px] outline-none transition"
                  style={{
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.04)",
                  }}
                />
              </div>

              {/* Step 3 — Beneficiary */}
              <div>
                <Label>3. Beneficiary</Label>

                {/* "Use my address" checkbox card */}
                <button
                  type="button"
                  onClick={() => {
                    if (address) {
                      setBeneficiary(beneficiary === address ? "" : address);
                    }
                  }}
                  className="w-full flex items-center gap-3 rounded-xl px-4 py-3 mb-3 transition"
                  style={{
                    background: beneficiary === address ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${beneficiary === address ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)"}`,
                  }}
                >
                  {/* checkbox */}
                  <span
                    className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition"
                    style={{
                      background: beneficiary === address ? "#fff" : "transparent",
                      border: `1.5px solid ${beneficiary === address ? "#fff" : "rgba(255,255,255,0.35)"}`,
                    }}
                  >
                    {beneficiary === address && (
                      <svg viewBox="0 0 10 8" className="w-2.5 h-2" fill="none">
                        <path d="M1 4l2.5 2.5L9 1" stroke="#0D0B14" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <div className="text-left min-w-0">
                    <p className="font-grotesk text-[12px] uppercase tracking-wider" style={{ color: "#fff" }}>
                      Use my address
                    </p>
                    <p className="font-mono text-[9px] truncate mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {address ?? "Connect wallet first"}
                    </p>
                  </div>
                </button>

                {/* manual input */}
                <input
                  value={beneficiary}
                  onChange={(e) => setBeneficiary(e.target.value.trim())}
                  placeholder="or paste any 0x… address"
                  className="w-full bg-transparent rounded-xl px-4 py-3 font-mono text-[12px] outline-none transition"
                  style={{
                    color: "#fff",
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${beneficiary && !validBeneficiary ? "rgba(255,100,100,0.55)" : "rgba(255,255,255,0.12)"}`,
                  }}
                />
                {beneficiary && !validBeneficiary && (
                  <p className="font-mono text-[10px] mt-1.5" style={{ color: "rgba(255,120,120,0.9)" }}>
                    Not a valid address.
                  </p>
                )}
              </div>

              {/* Step 4 — Duration */}
              <div>
                <Label>4. Vesting Duration</Label>
                <DurationPicker value={duration} onChange={setDuration} />
              </div>

              {/* Step 5 — Cliff (optional) */}
              <div>
                <button
                  onClick={() => setWithCliff((v) => !v)}
                  className="w-full flex items-center justify-between rounded-xl px-4 py-3 transition"
                  style={{
                    background: withCliff ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${withCliff ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <div className="text-left">
                    <p className="font-grotesk text-[11px] uppercase tracking-wider" style={{ color: "#fff" }}>
                      Add a cliff
                    </p>
                    <p className="font-mono text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                      Nothing vests until cliff date
                    </p>
                  </div>
                  <Toggle on={withCliff} />
                </button>
                {withCliff && (
                  <div className="mt-3">
                    <DurationPicker value={cliff} onChange={setCliff} />
                    {cliffInvalid && (
                      <p className="font-mono text-[10px] mt-2" style={{ color: "rgba(255,120,120,0.9)" }}>
                        Cliff must be ≤ vesting duration.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action — approve first, then deploy+fund */}
              {needsApproval ? (
                <ActionButton
                  onClick={handleApprove}
                  disabled={parsedAmount === 0n || approveTx.isPending || approveRcpt.isLoading}
                  loading={approveTx.isPending || approveRcpt.isLoading}
                  label={`Approve ${token.symbol}`}
                  loadingLabel="Approving…"
                />
              ) : (
                <ActionButton
                  onClick={handleCreate}
                  disabled={
                    parsedAmount === 0n ||
                    !validBeneficiary ||
                    cliffInvalid ||
                    vestTx.isPending ||
                    vestRcpt.isLoading
                  }
                  loading={vestTx.isPending || vestRcpt.isLoading}
                  label="Deploy &amp; Fund Vesting"
                  loadingLabel="Deploying…"
                />
              )}

              {(approveTx.error || vestTx.error) && (
                <p className="font-mono text-[10px] break-words" style={{ color: "rgba(255,100,100,0.9)" }}>
                  {(approveTx.error || vestTx.error)?.message}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </Modal>
  );
}

// ── helpers ───────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[9px] uppercase tracking-[0.18em] mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
      {children}
    </p>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span className="relative w-9 h-5 rounded-full transition shrink-0"
      style={{ background: on ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.1)" }}>
      <span className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
        style={{ left: on ? "calc(100% - 18px)" : "2px", background: on ? "#0D0B14" : "rgba(255,255,255,0.6)" }} />
    </span>
  );
}

function ActionButton({ onClick, disabled, loading, label, loadingLabel }: {
  onClick: () => void; disabled: boolean; loading: boolean; label: string; loadingLabel: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-xl py-3 font-grotesk text-[12px] uppercase tracking-wider transition disabled:opacity-40 active:scale-[0.99]"
      style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}
      dangerouslySetInnerHTML={{ __html: loading ? loadingLabel : label }}
    />
  );
}

function Notice({ children, tone }: { children: React.ReactNode; tone: "info" | "warn" }) {
  return (
    <div className="rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <p className="font-mono text-[11px] leading-relaxed" style={{ color: tone === "warn" ? "rgba(255,180,50,0.9)" : "rgba(255,255,255,0.55)" }}>
        {children}
      </p>
    </div>
  );
}

function SuccessState({ onDone }: { onDone: () => void }) {
  return (
    <div className="text-center py-3">
      <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)" }}>
        <CheckCircle2 className="w-5 h-5" style={{ color: "#fff" }} strokeWidth={1.5} />
      </div>
      <p className="font-grotesk uppercase tracking-wider text-[14px] mb-1" style={{ color: "#fff" }}>
        Vesting deployed &amp; funded
      </p>
      <p className="font-mono text-[10px] max-w-[280px] mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
        Tokens are now locked in the vesting wallet and will release linearly to the beneficiary.
      </p>
      <button onClick={onDone}
        className="mt-5 rounded-xl px-5 py-2.5 font-grotesk text-[11px] uppercase tracking-wider transition"
        style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>
        Done
      </button>
    </div>
  );
}
