import { createFileRoute } from "@tanstack/react-router";
import Screenshot from "@/components/screenshot/Screenshot";

function ScreenshotPage() {
  return <Screenshot />;
}

export const Route = createFileRoute("/screenshot")({
  component: ScreenshotPage,
});
