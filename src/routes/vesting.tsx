import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/PortfolioPage";

export const Route = createFileRoute("/vesting")({
  component: VestingPage,
  head: () => ({
    meta: [
      { title: "Vesting — The Dog House" },
      { name: "description", content: "Manage vesting schedules for teams, investors and contributors on Monad." },
      { property: "og:title", content: "Vesting — The Dog House" },
      { property: "og:description", content: "Vesting schedules on Monad, powered by ANAGO." },
    ],
  }),
});

function VestingPage() {
  return (
    <PortfolioPage
      title="Vesting"
      subtitle="Linear and cliff vesting schedules on Monad"
      segments={[
        { label: "Allocated", pct: 0, color: "#6FFF00" },
        { label: "Vested", pct: 0, color: "#16a34a" },
        { label: "Claimable", pct: 0, color: "#84cc16" },
        { label: "Cliff", pct: 0, color: "#22c55e" },
        { label: "Revoked", pct: 0, color: "#10b981" },
      ]}
      tabs={["Schedules", "Claimable", "Cliffs", "Revoked", "History"]}
      emptyHeading="No vesting schedules"
      emptyBody="Create a vesting schedule for your team, investors, or contributors."
      ctaLabel="Create schedule"
    />
  );
}
