import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/PortfolioPage";

export const Route = createFileRoute("/farm")({
  component: FarmPage,
  head: () => ({
    meta: [
      { title: "Yield Farm — The Dog House" },
      { name: "description", content: "Stake and farm yield on Monad with the Dog House yield farms." },
      { property: "og:title", content: "Yield Farm — The Dog House" },
      { property: "og:description", content: "Stake, farm and earn on Monad." },
    ],
  }),
});

function FarmPage() {
  return (
    <PortfolioPage
      title="Yield Farm"
      subtitle="Stake, farm, and harvest rewards on Monad"
      segments={[
        { label: "Staked", pct: 0, color: "#9B7FD4" },
        { label: "Pending rewards", pct: 0, color: "#7C5CBF" },
        { label: "Harvested", pct: 0, color: "#5B4FE8" },
        { label: "Boosts", pct: 0, color: "#E8A0B0" },
        { label: "Locked", pct: 0, color: "#8B5E3C" },
      ]}
      tabs={["Pools", "Staked", "Rewards", "Boosts", "History"]}
      emptyHeading="No active farms"
      emptyBody="Pick a pool, stake your LP tokens and start harvesting rewards."
      ctaLabel="Browse farms"
    />
  );
}
