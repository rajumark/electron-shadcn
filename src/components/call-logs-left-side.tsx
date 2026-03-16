import {
  Filter,
  Phone,
  PhoneIncoming,
  PhoneMissed,
  PhoneOutgoing,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { ipc } from "@/ipc/manager";
import {
  type CallLog,
  formatDate,
  formatDuration,
  formatTime,
  parseCallLogData,
} from "@/utils/call-log-parser";

interface CallLogsLeftSideProps {
  isDragging: boolean;
  leftWidth: number;
  onCallLogsUpdate: (callLogs: CallLog[]) => void;
  onCallSelect: (callId: string) => void;
  onDragStart: () => void;
  selectedCall: string;
}

export const CallLogsLeftSide: React.FC<CallLogsLeftSideProps> = ({
  leftWidth,
  selectedCall,
  onCallSelect,
  isDragging,
  onDragStart,
  onCallLogsUpdate,
}) => {
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [filteredCallLogs, setFilteredCallLogs] = useState<CallLog[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("all");

  const { selectedDevice } = useSelectedDevice();
  const [refreshKey, setRefreshKey] = useState(0);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const callListRef = useRef<HTMLDivElement>(null);

  // Filter options
  const filterOptions = [
    { id: "all", label: "All calls" },
    { id: "incoming", label: "Incoming" },
    { id: "outgoing", label: "Outgoing" },
    { id: "missed", label: "Missed" },
  ];

  // Fetch call logs when device is selected or refresh is triggered
  useEffect(() => {
    if (!(selectedDevice && selectedDevice.id?.trim())) {
      setCallLogs([]);
      setFilteredCallLogs([]);
      setHasLoadedOnce(false);
      return;
    }

    const fetchCallLogs = async () => {
      // Show loading state only for the first visible load on this device
      if (!hasLoadedOnce) {
        setLoading(true);
      }
      setError("");

      try {
        const response = await ipc.client.adb.getCallLogs({
          deviceId: selectedDevice.id,
        });

        if (response.success && response.data) {
          const parsedCallLogs = parseCallLogData(response.data);

          // Check if data has changed
          const isSameLength = callLogs.length === parsedCallLogs.length;
          const isSame =
            isSameLength &&
            callLogs.every(
              (call, index) => call.id === parsedCallLogs[index]?.id
            );

          if (!isSame) {
            setCallLogs(parsedCallLogs);
            setFilteredCallLogs(parsedCallLogs);
            setHasLoadedOnce(true);
            onCallLogsUpdate(parsedCallLogs);
          }
        } else {
          throw new Error(response.data || "Failed to fetch call logs");
        }
      } catch (error) {
        console.error("Failed to fetch call logs:", error);
        setError(
          `Failed to fetch call logs: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        setCallLogs([]);
        setFilteredCallLogs([]);
        onCallLogsUpdate([]);
      } finally {
        if (!hasLoadedOnce) {
          setLoading(false);
        }
      }
    };

    fetchCallLogs();
  }, [selectedDevice, refreshKey, hasLoadedOnce]);

  // Filter call logs based on type and search
  const memoizedFilteredCallLogs = useMemo(() => {
    let filtered = callLogs;

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((log) => log.type === filterType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (log) =>
          log.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (log.contactName &&
            log.contactName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }, [callLogs, filterType, searchQuery]);

  // Update filtered call logs when memoized result changes
  useEffect(() => {
    setFilteredCallLogs(memoizedFilteredCallLogs);
  }, [memoizedFilteredCallLogs]);

  const handleRefreshCallLogs = async () => {
    if (isRefreshing) {
      return;
    }
    setIsRefreshing(true);
    setRefreshKey((prev) => prev + 1);
    // Reset refreshing state after a short delay to show the animation
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleCallClick = useCallback(
    (callId: string) => {
      onCallSelect(callId);
    },
    [onCallSelect]
  );

  const getCallIcon = (type: CallLog["type"]) => {
    switch (type) {
      case "incoming":
        return <PhoneIncoming className="h-4 w-4 text-green-500" />;
      case "outgoing":
        return <PhoneOutgoing className="h-4 w-4 text-blue-500" />;
      case "missed":
        return <PhoneMissed className="h-4 w-4 text-red-500" />;
      case "rejected":
        return <PhoneMissed className="h-4 w-4 text-orange-500" />;
      case "blocked":
        return <PhoneMissed className="h-4 w-4 text-gray-500" />;
      case "voicemail":
        return <PhoneIncoming className="h-4 w-4 text-purple-500" />;
      default:
        return <Phone className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getCallTypeLabel = (type: CallLog["type"]): string => {
    switch (type) {
      case "incoming":
        return "Incoming Call";
      case "outgoing":
        return "Outgoing Call";
      case "missed":
        return "Missed Call";
      case "rejected":
        return "Rejected Call";
      case "blocked":
        return "Blocked Call";
      case "voicemail":
        return "Voicemail Call";
      default:
        return "Unknown Call Type";
    }
  };

  return (
    <div
      className="flex h-full flex-col overflow-hidden"
      style={{ width: `${leftWidth}%` }}
    >
      <div className="flex h-full min-h-0 flex-col">
        {/* Header with Title and Filter */}
        <div className="mx-2 flex items-center justify-between pt-2 pb-2">
          <h2 className="font-medium text-sm">
            {filterOptions.find((option) => option.id === filterType)?.label ||
              "Call Logs"}
          </h2>
          <div className="flex items-center gap-1">
            {/* Refresh Button */}
            <button
              className="rounded-md p-1.5 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isRefreshing || !selectedDevice}
              onClick={handleRefreshCallLogs}
              title="Refresh call logs"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>

            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative rounded-md p-1.5 transition-colors hover:bg-muted">
                  <Filter className="h-3.5 w-3.5" />
                  {filterType !== "all" && (
                    <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {filterOptions.map((option) => (
                  <DropdownMenuItem
                    className="flex items-center justify-between"
                    key={option.id}
                    onClick={() => setFilterType(option.id)}
                  >
                    <span>{option.label}</span>
                    {filterType === option.id && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mx-2 mb-2">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            className="w-full rounded-md border border-border py-1 pr-10 pl-10 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search in ${callLogs.length} calls`}
            type="text"
            value={searchQuery}
          />
          {searchQuery && (
            <button
              className="absolute inset-y-0 right-0 flex items-center pr-3 transition-colors hover:text-foreground"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Call Logs List Container */}
        <div className="mx-2 flex flex-1 flex-col overflow-hidden">
          {loading ? (
            <div className="py-4 text-center">
              <div className="inline-block h-4 w-4 animate-spin rounded-full border-primary border-b-2" />
              <p className="mt-2 text-muted-foreground text-xs">
                Loading call logs...
              </p>
            </div>
          ) : filteredCallLogs.length > 0 ? (
            <div className="flex-1 overflow-auto" ref={callListRef}>
              {filteredCallLogs.map((call) => (
                <div
                  className={`cursor-pointer border-border border-b p-3 transition-colors hover:bg-muted ${
                    selectedCall === call.id ? "bg-muted" : ""
                  }`}
                  key={call.id}
                  onClick={() => handleCallClick(call.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getCallIcon(call.type)}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate font-medium text-sm">
                          {call.contactName || call.phoneNumber}
                        </p>
                        <span className="text-muted-foreground text-xs">
                          {formatTime(call.timestamp)}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <p className="truncate text-muted-foreground text-xs">
                          {call.contactName ? call.phoneNumber : ""}
                        </p>
                        <span className="text-muted-foreground text-xs">
                          {formatDuration(call.duration)}
                        </span>
                      </div>
                      <p className="mt-1 text-muted-foreground text-xs">
                        {formatDate(call.timestamp)}
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-muted-foreground text-xs">
                          {getCallTypeLabel(call.type)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mx-2 flex flex-col items-center justify-center">
              <p className="py-4 text-center text-muted-foreground text-xs">
                {searchQuery.trim()
                  ? "No calls found matching your search"
                  : "No call logs found"}
              </p>
              {searchQuery.trim() && callLogs.length > 0 && (
                <button
                  className="rounded border border-border px-3 py-1 text-xs transition-colors hover:bg-muted"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Filter
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
