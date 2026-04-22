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
      theme={{
        name: "farm",
        accent: "#6FFF00",
        accent2: "#16a34a",
        tag: "Farm Field",
      }}
      segments={[
        { label: "Staked", pct: 0, color: "#6FFF00" },
        { label: "Pending rewards", pct: 0, color: "#16a34a" },
        { label: "Harvested", pct: 0, color: "#06b6d4" },
        { label: "Boosts", pct: 0, color: "#f59e0b" },
        { label: "Locked", pct: 0, color: "#b724ff" },
      ]}
      tabs={["Pools", "Staked", "Rewards", "Boosts", "History"]}
      emptyHeading="No active farms"
      emptyBody="Pick a pool, stake your LP tokens and start harvesting rewards."
      ctaLabel="Browse farms"
    />
  );
}
