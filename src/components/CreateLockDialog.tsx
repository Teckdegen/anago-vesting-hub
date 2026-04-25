import { useState } from "react";
import { parseUnits } from "viem";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Modal } from "./Modal";
import { TokenPicker } from "./TokenPicker";
import { DurationPicker } from "./DurationPicker";
import { useContractAddresses } from "@/lib/web3/hooks";
import { TOKEN_LOCK_ABI } from "@/lib/web3/contracts";
import { ERC20_ABI, type TokenInfo } from "@/lib/web3/tokens";
import { formatAmount } from "@/lib/web3/format";

const ZERO = "0x0000000000000000000000000000000000000000" as const;

type Props = { open: boolean; onClose: () => void };

export function CreateLockDialog({ open, onClose }: Props) {
  const { address } = useAccount();
  const { tokenLock } = useContractAddresses();
  const [token, setToken] = useState<(TokenInfo & { balance: bigint }) | undefined>();
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState(30 * 86400);

  const parsedAmount = (() => {
    if (!token || !amount) return 0n;
    try { return parseUnits(amount, token.decimals); } catch { return 0n; }
  })();

  const allowanceQ = useReadContract({
    address: token?.address,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address && token ? [address, tokenLock] : undefined,
    query: { enabled: !!address && !!token && token.address !== ZERO },
  });
  const allowance = (allowanceQ.data as bigint | undefined) ?? 0n;
  const needsApproval = parsedAmount > allowance;

  const approveTx = useWriteContract();
  const lockTx = useWriteContract();
  const approveRcpt = useWaitForTransactionReceipt({ hash: approveTx.data });
  const lockRcpt = useWaitForTransactionReceipt({ hash: lockTx.data });

  const handleApprove = () => {
    if (!token) return;
    approveTx.writeContract({
      address: token.address,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [tokenLock, parsedAmount],
    });
  };

  const handleLock = () => {
    if (!token) return;
    const unlockAt = BigInt(Math.floor(Date.now() / 1000) + duration);
    lockTx.writeContract({
      address: tokenLock,
      abi: TOKEN_LOCK_ABI,
      functionName: "createLock",
      args: [token.address, parsedAmount, unlockAt],
    });
  };

  if (lockRcpt.isSuccess) {
    setTimeout(() => { lockTx.reset(); onClose(); }, 800);
  }

  const factoryUnset = tokenLock === ZERO;

  return (
    <Modal open={open} onClose={onClose} title="New Lock">
      {factoryUnset ? (
        <p className="font-mono text-[11px]" style={{ color: "rgba(255,180,50,0.9)" }}>
          TokenLock address not configured. Deploy the contract and set it in{" "}
          <code className="ml-1" style={{ color: "rgba(255,255,255,0.6)" }}>src/lib/web3/contracts.ts</code>.
        </p>
      ) : !address ? (
        <p className="font-mono text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>
          Connect your wallet to continue.
        </p>
      ) : (
        <div className="space-y-5">

          {/* Step 1 — Token */}
          <div>
            <Label>1. Token</Label>
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

              {/* Step 3 — Duration */}
              <div>
                <Label>3. Lock Duration</Label>
                <DurationPicker value={duration} onChange={setDuration} />
              </div>

              {/* Action */}
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
                  onClick={handleLock}
                  disabled={parsedAmount === 0n || lockTx.isPending || lockRcpt.isLoading}
                  loading={lockTx.isPending || lockRcpt.isLoading}
                  label="Lock Tokens"
                  loadingLabel="Locking…"
                />
              )}

              {(approveTx.error || lockTx.error) && (
                <p className="font-mono text-[10px] break-words" style={{ color: "rgba(255,100,100,0.9)" }}>
                  {(approveTx.error || lockTx.error)?.message}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </Modal>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[9px] uppercase tracking-[0.18em] mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
      {children}
    </p>
  );
}

function ActionButton({
  onClick, disabled, loading, label, loadingLabel,
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
