import { Copy, Terminal } from "lucide-react";
import { toast } from "sonner";
import { ipc } from "@/ipc/manager";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ADBPathDisplayProps {
  className?: string;
}

export function ADBPathDisplay({ className }: ADBPathDisplayProps) {
  const adbPath = "/home/raju/.config/Pilotfish/platform-tools/adb";
  const platformToolsPath = "/home/raju/.config/Pilotfish/platform-tools/";

  const handleOpenTerminal = async () => {
    try {
      await ipc.client.shell.openTerminal({ path: platformToolsPath });
      toast.success("Terminal opened successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to open terminal";
      toast.error(errorMessage);
      console.error("Failed to open terminal:", error);
    }
  };

  const handleCopyPath = () => {
    navigator.clipboard.writeText(adbPath);
    toast.success("ADB path copied to clipboard");
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          ADB Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="font-medium text-muted-foreground text-sm">
            ADB Path
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-md bg-muted/50 p-3 font-mono text-xs">
              {adbPath}
            </div>
            <Button onClick={handleCopyPath} size="sm" variant="outline">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button className="flex-1" onClick={handleOpenTerminal}>
            <Terminal className="mr-2 h-4 w-4" />
            Open Terminal
          </Button>
        </div>

        <div className="text-muted-foreground text-xs">
          Opens system terminal in the platform-tools directory
        </div>
      </CardContent>
    </Card>
  );
}
