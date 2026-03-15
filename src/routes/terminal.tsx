import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ADBTerminal } from "@/components/adb-terminal";

function TerminalPage() {
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1">
        <ADBTerminal />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/terminal")({
  component: TerminalPage,
});
