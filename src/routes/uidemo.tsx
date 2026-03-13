import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

function UIDemoPage() {
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col items-start justify-start gap-2 p-8">
        <h1 className="font-bold text-2xl">UI Demo</h1>
        <p className="text-muted-foreground">Coming soon</p>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/uidemo")({
  component: UIDemoPage,
});
