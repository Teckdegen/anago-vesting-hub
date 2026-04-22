import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/PortfolioPage";

export const Route = createFileRoute("/dlmm")({
  component: DLMMPage,
  head: () => ({
    meta: [
      { title: "DLMM — The Dog House" },
      { name: "description", content: "Dynamic Liquidity Market Maker on Monad. Provide concentrated liquidity and earn fees." },
      { property: "og:title", content: "DLMM — The Dog House" },
      { property: "og:description", content: "Concentrated liquidity on Monad." },
    ],
  }),
});

function DLMMPage() {
  return (
    <PortfolioPage
      title="DLMM"
      subtitle="Dynamic Liquidity Market Maker on Monad"
      theme={{
        name: "dlmm",
        accent: "#0ea5e9",
        accent2: "#2563eb",
        tag: "Liquidity Lab",
      }}
      segments={[
        { label: "Liquidity", pct: 0, color: "#0ea5e9" },
        { label: "Fees earned", pct: 0, color: "#2563eb" },
        { label: "Open orders", pct: 0, color: "#f59e0b" },
        { label: "Range bins", pct: 0, color: "#06b6d4" },
        { label: "Out of range", pct: 0, color: "#ef4444" },
      ]}
      tabs={["Positions", "Bins", "Open orders", "Fees", "History"]}
      emptyHeading="No liquidity positions"
      emptyBody="Open a DLMM position to earn fees from concentrated liquidity."
      ctaLabel="Add liquidity"
    />
  );
}
