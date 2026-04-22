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
      theme={{
        name: "vesting",
        accent: "#7c3aed",
        accent2: "#4f46e5",
        tag: "Vesting Hub",
      }}
      segments={[
        { label: "Allocated", pct: 0, color: "#7c3aed" },
        { label: "Vested", pct: 0, color: "#4f46e5" },
        { label: "Claimable", pct: 0, color: "#06b6d4" },
        { label: "Cliff", pct: 0, color: "#f59e0b" },
        { label: "Revoked", pct: 0, color: "#ef4444" },
      ]}
      tabs={["Schedules", "Claimable", "Cliffs", "Revoked", "History"]}
      emptyHeading="No vesting schedules"
      emptyBody="Create a vesting schedule for your team, investors, or contributors."
      ctaLabel="Create schedule"
    />
  );
}
