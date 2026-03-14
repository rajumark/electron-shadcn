import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

function UIInspectorPage() {
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <h1 className="font-bold text-4xl">UI Inspector</h1>
        <p className="text-muted-foreground">Coming soon</p>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/ui-inspector")({
  component: UIInspectorPage,
});
