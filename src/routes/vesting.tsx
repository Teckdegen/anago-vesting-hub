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
        { label: "Allocated", pct: 0, color: "#9B7FD4" },
        { label: "Vested", pct: 0, color: "#7C5CBF" },
        { label: "Claimable", pct: 0, color: "#5B4FE8" },
        { label: "Cliff", pct: 0, color: "#E8A0B0" },
        { label: "Revoked", pct: 0, color: "#8B5E3C" },
      ]}
      tabs={["Schedules", "Claimable", "Cliffs", "Revoked", "History"]}
      emptyHeading="No vesting schedules"
      emptyBody="Create a vesting schedule for your team, investors, or contributors."
      ctaLabel="Create schedule"
    />
  );
}
