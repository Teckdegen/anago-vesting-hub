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

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {PRESETS.map((p) => {
          const active = value === p.seconds;
          return (
            <button
              key={p.label}
              onClick={() => {
                onChange(p.seconds);
                setCustomDays("");
              }}
              className="px-3 py-1.5 rounded-full font-grotesk text-[11px] uppercase tracking-wider transition"
              style={{
                background: active ? "rgba(155,127,212,0.3)" : "rgba(155,127,212,0.08)",
                color: active ? "#EDE0FF" : "rgba(245,240,255,0.65)",
                border: `1px solid ${active ? "rgba(155,127,212,0.65)" : "rgba(155,127,212,0.3)"}`,
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          placeholder="Custom days"
          value={customDays || (isCustom ? Math.round(value / DAY) : "")}
          onChange={(e) => {
            setCustomDays(e.target.value);
            const days = Number(e.target.value);
            if (Number.isFinite(days) && days > 0) onChange(days * DAY);
          }}
          className="bg-transparent rounded-lg px-3 py-2 font-mono text-[11px] outline-none w-32"
          style={{
            color: "#EDE0FF",
            border: "1px solid rgba(155,127,212,0.35)",
          }}
        />
        <span className="font-mono text-[10px] text-cream/55">days</span>
      </div>
      <p className="font-mono text-[9px] text-cream/45 mt-2">
        Unlocks {new Date(Date.now() + value * 1000).toLocaleString()}
      </p>
    </div>
  );
}
