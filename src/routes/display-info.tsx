import { createFileRoute } from "@tanstack/react-router";
import DisplayInfo from "@/components/display-info/DisplayInfo";

function DisplayInfoPage() {
  return <DisplayInfo />;
}

export const Route = createFileRoute("/display-info")({
  component: DisplayInfoPage,
});
