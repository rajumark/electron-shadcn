import { Copy, History, Play, Save, Terminal, X } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { ipc } from "@/ipc/manager";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Toggle } from "./ui/toggle";

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
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const { selectedDevice } = useSelectedDevice();
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load command history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await ipc.client.store.getCommandHistory();
        setCommandHistory(history);
      } catch (error) {
        console.error("Failed to load command history:", error);
      }
    };
    loadHistory();
  }, []);

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
        includeDeviceId,
      });

      if (result.success) {
        setOutput(result.output || "Command executed successfully");
        toast.success("Command executed successfully");

        // Save to history (avoid duplicates)
        await ipc.client.store.addToCommandHistory({ command: command.trim() });
        const updatedHistory = await ipc.client.store.getCommandHistory();
        setCommandHistory(updatedHistory);
      } else {
        setOutput(`Error: ${result.error}`);
        toast.error(`Command failed: ${result.error}`);
        console.error("ADB Command Error Details:", result);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setOutput(`Error: ${errorMessage}`);
      toast.error(`Command failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryCommand = (historyCommand: string) => {
    setCommand(historyCommand);
    setHistoryOpen(false);
    setShowSuggestions(false);
  };

  const handleCommandChange = (value: string) => {
    setCommand(value);

    // Generate suggestions based on history
    if (value.trim()) {
      const filteredSuggestions = commandHistory
        .filter((cmd) => cmd.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 8); // Limit to 8 suggestions
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
      setSelectedSuggestionIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setCommand(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (showSuggestions && selectedSuggestionIndex >= 0) {
        handleSuggestionSelect(suggestions[selectedSuggestionIndex]);
      } else {
        handleRunCommand();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (showSuggestions && suggestions.length > 0) {
        const newIndex = Math.min(
          selectedSuggestionIndex + 1,
          suggestions.length - 1
        );
        setSelectedSuggestionIndex(newIndex);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (showSuggestions && suggestions.length > 0) {
        const newIndex = Math.max(selectedSuggestionIndex - 1, -1);
        setSelectedSuggestionIndex(newIndex);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output);
    toast.success("Output copied to clipboard");
  };

  const handleSaveOutput = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `adb-output-${new Date().toISOString().slice(0, 19)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Output saved as text file");
  };

  const highlightSearchMatches = (text: string) => {
    // Textarea doesn't support HTML highlighting, so we'll just return the text
    // Search functionality will work through browser's built-in search (Ctrl+F)
    return text;
  };

  const updateSearchMatches = () => {
    if (!searchQuery.trim()) {
      setTotalMatches(0);
      setCurrentMatchIndex(0);
      return;
    }

    const regex = new RegExp(
      searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "gi"
    );
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

  useEffect(() => {
    updateSearchMatches();
  }, [searchQuery, output]);

  return (
    <div className={`flex h-full flex-col ${className}`}>
      {/* Header with controls */}
      <div className="space-y-4 border-b p-4">
        {/* Command input row */}
        <div className="relative flex items-center gap-4">
          <Popover onOpenChange={setHistoryOpen} open={historyOpen}>
            <PopoverTrigger asChild>
              <Button
                disabled={commandHistory.length === 0}
                size="sm"
                variant="outline"
              >
                <History className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="max-h-60 w-80 overflow-y-auto"
            >
              <div className="space-y-1">
                <div className="mb-2 font-medium text-muted-foreground text-xs">
                  Command History
                </div>
                {commandHistory.length === 0 ? (
                  <div className="text-muted-foreground text-xs italic">
                    No commands in history
                  </div>
                ) : (
                  commandHistory.map((cmd, index) => (
                    <div
                      className="cursor-pointer rounded p-2 font-mono text-xs hover:bg-muted"
                      key={index}
                      onClick={() => handleSelectHistoryCommand(cmd)}
                    >
                      {cmd}
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>

          <div className="relative w-1/2">
            <Input
              className="w-full"
              disabled={isLoading}
              onChange={(e) => handleCommandChange(e.target.value)}
              onFocus={() => {
                if (command.trim()) {
                  handleCommandChange(command);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="Enter ADB command"
              ref={inputRef}
              value={command}
            />

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-md border border-border bg-popover shadow-md">
                {suggestions.map((suggestion, index) => (
                  <div
                    className={`cursor-pointer px-3 py-2 font-mono text-xs hover:bg-muted ${
                      index === selectedSuggestionIndex ? "bg-muted" : ""
                    }`}
                    key={index}
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            disabled={isLoading || !command.trim()}
            onClick={handleRunCommand}
            size="default"
          >
            <Play className="mr-2 h-4 w-4" />
            {isLoading ? "Running..." : "Run"}
          </Button>

          <div className="flex items-center gap-2">
            <Toggle
              aria-label="Include device ID"
              disabled={!selectedDevice}
              onPressedChange={setIncludeDeviceId}
              pressed={includeDeviceId}
              size="sm"
              variant="outline"
            >
              {includeDeviceId ? (
                <Terminal className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Toggle>
            <span className="text-muted-foreground text-sm">
              {includeDeviceId ? "Device ID included" : "Device ID excluded"}
            </span>
          </div>
        </div>
      </div>

      {/* Output area with controls */}
      <div className="flex min-h-0 flex-1 flex-col p-4">
        {/* Output controls */}
        <div className="mb-4 flex flex-shrink-0 items-center gap-2">
          <Button
            disabled={!output}
            onClick={handleCopyOutput}
            size="sm"
            variant="outline"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Output
          </Button>
          <Button
            disabled={!output}
            onClick={handleSaveOutput}
            size="sm"
            variant="outline"
          >
            <Save className="mr-2 h-4 w-4" />
            Save as TXT
          </Button>

          <div className="flex-1" />
        </div>

        {/* Output display */}
        <textarea
          className="min-h-0 flex-1 resize-none overflow-auto rounded-md border-none bg-muted/50 p-3 font-mono text-xs focus:outline-none"
          placeholder="Command output will appear here..."
          readOnly
          ref={outputRef}
          value={output}
        />
      </div>
    </div>
  );
}
