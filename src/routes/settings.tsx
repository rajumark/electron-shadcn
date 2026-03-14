import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { AndroidSettings } from "@/components/android-settings";

function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1">
        <AndroidSettings />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});
