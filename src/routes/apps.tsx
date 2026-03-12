import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

function AppsPage() {
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col">
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <h1 className="font-bold text-4xl">Apps</h1>
          <p className="text-muted-foreground">Page name coming soon</p>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/apps")({
  component: AppsPage,
});
