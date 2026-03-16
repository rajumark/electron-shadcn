import { createFileRoute } from "@tanstack/react-router";
import PerformancePage from "@/components/performance/Performance";

function CpuUsagePage() {
  return <PerformancePage />;
}

export const Route = createFileRoute("/cpu-usage")({
  component: CpuUsagePage,
});
