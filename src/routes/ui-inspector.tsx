import { createFileRoute } from "@tanstack/react-router";
import { UIInspector } from "@/components/ui-inspector";

function UIInspectorPage() {
  return <UIInspector />;
}

export const Route = createFileRoute("/ui-inspector")({
  component: UIInspectorPage,
});
