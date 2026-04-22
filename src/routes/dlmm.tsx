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
      segments={[
        { label: "Liquidity", pct: 0, color: "#9B7FD4" },
        { label: "Fees earned", pct: 0, color: "#7C5CBF" },
        { label: "Open orders", pct: 0, color: "#5B4FE8" },
        { label: "Range bins", pct: 0, color: "#E8A0B0" },
        { label: "Out of range", pct: 0, color: "#8B5E3C" },
      ]}
      tabs={["Positions", "Bins", "Open orders", "Fees", "History"]}
      emptyHeading="No liquidity positions"
      emptyBody="Open a DLMM position to earn fees from concentrated liquidity."
      ctaLabel="Add liquidity"
    />
  );
}
