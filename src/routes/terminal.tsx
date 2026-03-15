import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ADBTerminal } from "@/components/adb-terminal";

function TerminalPage() {
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h1 className="font-bold text-2xl">ADB Terminal</h1>
        <p className="text-muted-foreground text-sm">Execute ADB commands with device ID toggle</p>
      </div>
      <div className="flex-1">
        <ADBTerminal />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/terminal")({
  component: TerminalPage,
});
