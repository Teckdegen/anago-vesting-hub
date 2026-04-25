import { useState } from "react";

const DAY = 86400;
const PRESETS = [
  { label: "7d",  seconds: 7 * DAY },
  { label: "30d", seconds: 30 * DAY },
  { label: "90d", seconds: 90 * DAY },
  { label: "6m",  seconds: 180 * DAY },
  { label: "1y",  seconds: 365 * DAY },
  { label: "2y",  seconds: 730 * DAY },
];

type Props = {
  value: number; // seconds
  onChange: (seconds: number) => void;
};

export function DurationPicker({ value, onChange }: Props) {
  const [customDays, setCustomDays] = useState<string>("");
  const isCustom = !PRESETS.some((p) => p.seconds === value);

  const unlockDate = new Date(Date.now() + value * 1000);

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {PRESETS.map((p) => {
          const active = value === p.seconds;
          return (
            <button
              key={p.label}
              onClick={() => {
                onChange(p.seconds);
                setCustomDays("");
              }}
              className="px-3 py-1.5 rounded-full font-grotesk text-[11px] uppercase tracking-wider transition active:scale-[0.97]"
              style={{
                background: active ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                color: active ? "#fff" : "rgba(255,255,255,0.55)",
                border: `1px solid ${active ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div
        className="flex items-center gap-2 rounded-xl px-3 py-2.5"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <input
          type="number"
          min={1}
          placeholder="Custom"
          value={customDays || (isCustom ? Math.round(value / DAY) : "")}
          onChange={(e) => {
            setCustomDays(e.target.value);
            const days = Number(e.target.value);
            if (Number.isFinite(days) && days > 0) onChange(days * DAY);
          }}
          className="bg-transparent font-mono text-[12px] outline-none w-full"
          style={{ color: "#fff" }}
        />
        <span
          className="font-mono text-[10px] uppercase tracking-wider shrink-0"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          days
        </span>
      </div>

      <div
        className="mt-3 flex items-center justify-between px-3 py-2 rounded-lg"
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span
          className="font-mono text-[9px] uppercase tracking-[0.18em]"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          Unlocks
        </span>
        <span className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.85)" }}>
          {unlockDate.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
          {" · "}
          {unlockDate.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
