import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Toggle } from "./ui/toggle";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { ipc } from "@/ipc/manager";
import { toast } from "sonner";
import { Terminal, Play, Smartphone, X } from "lucide-react";

interface ADBTerminalProps {
  className?: string;
}

export function ADBTerminal({ className }: ADBTerminalProps) {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [includeDeviceId, setIncludeDeviceId] = useState(false);
  const { selectedDevice } = useSelectedDevice();

  const handleRunCommand = async () => {
    if (!command.trim()) {
      toast.error("Please enter a command");
      return;
    }

    setIsLoading(true);
    setOutput("Executing command...");

    try {
      const result = await ipc.client.adb.executeCustomADBCommand({
        command: command.trim(),
        deviceId: selectedDevice?.id,
        includeDeviceId: includeDeviceId,
      });

      if (result.success) {
        setOutput(result.output || "Command executed successfully");
        toast.success("Command executed successfully");
      } else {
        setOutput(`Error: ${result.error}`);
        toast.error(`Command failed: ${result.error}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setOutput(`Error: ${errorMessage}`);
      toast.error(`Command failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleRunCommand();
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header with controls */}
      <div className="border-b p-4 space-y-4">
        {/* Device toggle */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            <span className="text-sm font-medium">
              {selectedDevice ? selectedDevice.name : "No device selected"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Toggle
              pressed={includeDeviceId}
              onPressedChange={setIncludeDeviceId}
              variant="outline"
              size="sm"
              aria-label="Include device ID"
              disabled={!selectedDevice}
            >
              {includeDeviceId ? (
                <Smartphone className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Toggle>
            <span className="text-sm text-muted-foreground">
              {includeDeviceId ? "Device ID included" : "Device ID excluded"}
            </span>
          </div>
        </div>

        {/* Command input */}
        <div className="flex gap-2">
          <Input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter ADB command (e.g., 'adb devices' or 'devices')"
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleRunCommand}
            disabled={isLoading || !command.trim()}
            size="default"
          >
            <Play className="h-4 w-4 mr-2" />
            {isLoading ? "Running..." : "Run"}
          </Button>
        </div>

        {/* Command hint */}
        <div className="text-xs text-muted-foreground">
          <p>Tips: • Type 'devices' for quick device list • 'adb shell dumpsys batterystats --history' works as-is</p>
          {includeDeviceId && selectedDevice && (
            <p>• Command will run as: adb -s {selectedDevice.id} [command]</p>
          )}
          {!selectedDevice && (
            <p>• Select a device from the device list above to use device-specific commands</p>
          )}
        </div>
      </div>

      {/* Output area */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="flex items-start gap-2 mb-2">
          <Terminal className="h-4 w-4 mt-1 text-muted-foreground" />
          <h3 className="text-sm font-medium">Output</h3>
        </div>
        <div className="bg-muted/50 rounded-md p-3 min-h-[200px] font-mono text-xs">
          {output ? (
            <pre className="whitespace-pre-wrap break-words">{output}</pre>
          ) : (
            <div className="text-muted-foreground italic">
              Command output will appear here...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
