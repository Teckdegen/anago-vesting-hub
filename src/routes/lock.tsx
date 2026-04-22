import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/PortfolioPage";

export const Route = createFileRoute("/lock")({
  component: LockPage,
  head: () => ({
    meta: [
      { title: "Token Lock — The Dog House" },
      { name: "description", content: "Lock tokens with confidence on Monad. Track your locked positions and unlock schedules." },
      { property: "og:title", content: "Token Lock — The Dog House" },
      { property: "og:description", content: "Lock tokens with confidence on Monad." },
    ],
  }),
});

function LockPage() {
  return (
    <PortfolioPage
      title="Token Lock"
      subtitle="Secure your tokens with time-based locks on Monad"
      segments={[
        { label: "Active locks", pct: 0, color: "#6FFF00" },
        { label: "Pending unlock", pct: 0, color: "#16a34a" },
        { label: "Released", pct: 0, color: "#84cc16" },
        { label: "Scheduled", pct: 0, color: "#22c55e" },
        { label: "Claimed", pct: 0, color: "#10b981" },
      ]}
      tabs={["Locks", "Unlocks", "Schedules", "Released", "History"]}
      emptyHeading="No locked tokens yet"
      emptyBody="Create your first lock to secure tokens with a time-based release schedule."
      ctaLabel="Create lock"
    />
  );
}
