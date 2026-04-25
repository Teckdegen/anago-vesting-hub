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
    setTimeout(() => {
      lockTx.reset();
      onClose();
    }, 800);
  }

  const factoryUnset = tokenLock === ZERO;

  return (
    <Modal open={open} onClose={onClose} title="New Lock">
      {factoryUnset ? (
        <p className="font-mono text-[11px] text-amber-400">
          TokenLock address not configured. Deploy the contract and set it in
          <code className="ml-1">src/lib/web3/contracts.ts</code>.
        </p>
      ) : !address ? (
        <p className="font-mono text-[11px] text-cream/65">Connect your wallet to continue.</p>
      ) : (
        <div className="space-y-5">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/55 mb-2">
              1. Token
            </p>
            <TokenPicker selected={token} onSelect={setToken} excludeNative />
          </div>

          {token && (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/55">
                    2. Amount
                  </p>
                  <button
                    onClick={() => setAmount(formatAmount(token.balance, token.decimals, 8))}
                    className="font-mono text-[9px] uppercase tracking-wider text-purple-300 hover:text-purple-200"
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
                  className="w-full bg-transparent rounded-lg px-3 py-2.5 font-grotesk text-cream text-[18px] outline-none"
                  style={{ border: "1px solid rgba(155,127,212,0.35)" }}
                />
              </div>

              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/55 mb-2">
                  3. Lock Duration
                </p>
                <DurationPicker value={duration} onChange={setDuration} />
              </div>

              {needsApproval ? (
                <button
                  onClick={handleApprove}
                  disabled={parsedAmount === 0n || approveTx.isPending || approveRcpt.isLoading}
                  className="w-full rounded-full py-3 font-grotesk text-[12px] uppercase tracking-wider transition disabled:opacity-50"
                  style={{
                    background: "rgba(155,127,212,0.25)",
                    color: "#EDE0FF",
                    border: "1px solid rgba(155,127,212,0.65)",
                  }}
                >
                  {approveTx.isPending || approveRcpt.isLoading
                    ? "Approving…"
                    : `Approve ${token.symbol}`}
                </button>
              ) : (
                <button
                  onClick={handleLock}
                  disabled={parsedAmount === 0n || lockTx.isPending || lockRcpt.isLoading}
                  className="w-full rounded-full py-3 font-grotesk text-[12px] uppercase tracking-wider transition disabled:opacity-50"
                  style={{
                    background: "rgba(155,127,212,0.3)",
                    color: "#EDE0FF",
                    border: "1px solid rgba(155,127,212,0.7)",
                  }}
                >
                  {lockTx.isPending || lockRcpt.isLoading ? "Locking…" : "Lock"}
                </button>
              )}

              {(approveTx.error || lockTx.error) && (
                <p className="font-mono text-[10px] text-red-400 break-words">
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
