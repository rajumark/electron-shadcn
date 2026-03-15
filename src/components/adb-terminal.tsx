import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Toggle } from "./ui/toggle";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { ipc } from "@/ipc/manager";
import { toast } from "sonner";
import { Terminal, Play, X, Copy, Save, Search, ChevronUp, ChevronDown } from "lucide-react";

interface ADBTerminalProps {
  className?: string;
}

export function ADBTerminal({ className }: ADBTerminalProps) {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [includeDeviceId, setIncludeDeviceId] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const { selectedDevice } = useSelectedDevice();
  const outputRef = useRef<HTMLDivElement>(null);

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

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output);
    toast.success("Output copied to clipboard");
  };

  const handleSaveOutput = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adb-output-${new Date().toISOString().slice(0, 19)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Output saved as text file");
  };

  const highlightSearchMatches = (text: string) => {
    if (!searchQuery.trim()) {
      return text;
    }

    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      if (regex.test(part)) {
        return `<mark class="bg-yellow-300 text-black">${part}</mark>`;
      }
      return part;
    }).join('');
  };

  const updateSearchMatches = () => {
    if (!searchQuery.trim()) {
      setTotalMatches(0);
      setCurrentMatchIndex(0);
      return;
    }

    const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = output.match(regex);
    setTotalMatches(matches ? matches.length : 0);
    setCurrentMatchIndex(0);
  };

  const handleNextMatch = () => {
    if (totalMatches > 0) {
      setCurrentMatchIndex((prev) => (prev + 1) % totalMatches);
    }
  };

  const handlePrevMatch = () => {
    if (totalMatches > 0) {
      setCurrentMatchIndex((prev) => (prev - 1 + totalMatches) % totalMatches);
    }
  };

  React.useEffect(() => {
    updateSearchMatches();
  }, [searchQuery, output]);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header with controls */}
      <div className="border-b p-4 space-y-4">
        {/* Command input row */}
        <div className="flex items-center gap-4">
          <Input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter ADB command"
            className="w-1/2"
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
                <Terminal className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Toggle>
            <span className="text-sm text-muted-foreground">
              {includeDeviceId ? "Device ID included" : "Device ID excluded"}
            </span>
          </div>
        </div>
      </div>

      {/* Output area with controls */}
      <div className="flex-1 flex flex-col p-4 overflow-auto">
        {/* Output controls */}
        <div className="flex items-center gap-2 mb-4">
          <Button
            onClick={handleCopyOutput}
            variant="outline"
            size="sm"
            disabled={!output}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Output
          </Button>
          <Button
            onClick={handleSaveOutput}
            variant="outline"
            size="sm"
            disabled={!output}
          >
            <Save className="h-4 w-4 mr-2" />
            Save as TXT
          </Button>
          
          <div className="flex-1" />
          
          {/* Search controls */}
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in output"
              className="w-48 h-6 text-xs"
            />
            {totalMatches > 0 && (
              <span className="text-sm text-muted-foreground">
                ({currentMatchIndex + 1}/{totalMatches})
              </span>
            )}
            <Button
              onClick={handlePrevMatch}
              variant="outline"
              size="sm"
              disabled={totalMatches === 0}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleNextMatch}
              variant="outline"
              size="sm"
              disabled={totalMatches === 0}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Output display */}
        <div className="flex-1 bg-muted/50 rounded-md p-3 font-mono text-xs overflow-auto">
          {output ? (
            <div
              ref={outputRef}
              className="whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{
                __html: highlightSearchMatches(output)
              }}
            />
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
