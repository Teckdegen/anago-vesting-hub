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
      theme={{
        name: "lock",
        accent: "#b724ff",
        accent2: "#7c3aed",
        tag: "Lock Vault",
      }}
      segments={[
        { label: "Active locks", pct: 0, color: "#b724ff" },
        { label: "Pending unlock", pct: 0, color: "#7c3aed" },
        { label: "Released", pct: 0, color: "#ef4444" },
        { label: "Scheduled", pct: 0, color: "#f59e0b" },
        { label: "Claimed", pct: 0, color: "#10b981" },
      ]}
      tabs={["Locks", "Unlocks", "Schedules", "Released", "History"]}
      emptyHeading="No locked tokens yet"
      emptyBody="Create your first lock to secure tokens with a time-based release schedule."
      ctaLabel="Create lock"
    />
  );
}
