import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Search, X, Filter, Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, RefreshCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ipc } from "@/ipc/manager";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { parseCallLogData, CallLog, formatDuration, formatTime, formatDate } from "@/utils/call-log-parser";

interface CallLogsLeftSideProps {
  leftWidth: number;
  selectedCall: string;
  onCallSelect: (callId: string) => void;
  isDragging: boolean;
  onDragStart: () => void;
  onCallLogsUpdate: (callLogs: CallLog[]) => void;
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
    if (!selectedDevice || !selectedDevice.id?.trim()) {
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
          const isSame = isSameLength && callLogs.every((call, index) => 
            call.id === parsedCallLogs[index]?.id
          );

          if (!isSame) {
            setCallLogs(parsedCallLogs);
            setFilteredCallLogs(parsedCallLogs);
            setHasLoadedOnce(true);
            onCallLogsUpdate(parsedCallLogs);
          }
        } else {
          throw new Error(response.data || 'Failed to fetch call logs');
        }
      } catch (error) {
        console.error("Failed to fetch call logs:", error);
        setError(
          `Failed to fetch call logs: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
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
  }, [selectedDevice, refreshKey, callLogs, hasLoadedOnce]);

  // Filter call logs based on type and search
  const memoizedFilteredCallLogs = useMemo(() => {
    let filtered = callLogs;
    
    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(log => log.type === filterType);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(log => 
        log.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.contactName && log.contactName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [callLogs, filterType, searchQuery]);

  // Update filtered call logs when memoized result changes
  useEffect(() => {
    setFilteredCallLogs(memoizedFilteredCallLogs);
    
    // Scroll to top when search results change
    if (callListRef.current) {
      callListRef.current.scrollTop = 0;
    }
  }, [memoizedFilteredCallLogs]);

  const handleRefreshCallLogs = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setRefreshKey(prev => prev + 1);
    // Reset refreshing state after a short delay to show the animation
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleCallClick = useCallback((callId: string) => {
    onCallSelect(callId);
  }, [onCallSelect]);

  const getCallIcon = (type: CallLog['type']) => {
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

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ width: `${leftWidth}%` }}
    >
      <div className="flex flex-col h-full min-h-0">
        {/* Header with Title and Filter */}
        <div className="flex items-center justify-between mx-2 pt-2 pb-2">
          <h2 className="text-sm font-medium">
            {filterOptions.find(option => option.id === filterType)?.label || "Call Logs"}
          </h2>
          <div className="flex items-center gap-1">
            {/* Refresh Button */}
            <button
              onClick={handleRefreshCallLogs}
              disabled={isRefreshing || !selectedDevice}
              className="p-1.5 hover:bg-muted rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh call logs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            
            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 hover:bg-muted rounded-md transition-colors relative">
                  <Filter className="h-3.5 w-3.5" />
                  {filterType !== "all" && (
                    <div className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {filterOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.id}
                    onClick={() => setFilterType(option.id)}
                    className="flex items-center justify-between"
                  >
                    <span>{option.label}</span>
                    {filterType === option.id && (
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search Input */}
        <div className="mb-2 mx-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder={`Search in ${callLogs.length} calls`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-1 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Call Logs List Container */}
        <div className="flex-1 flex flex-col overflow-hidden mx-2">
          {loading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <p className="text-xs text-muted-foreground mt-2">Loading call logs...</p>
            </div>
          ) : filteredCallLogs.length > 0 ? (
            <div ref={callListRef} className="flex-1 overflow-auto">
              {filteredCallLogs.map((call) => (
                <div
                  key={call.id}
                  onClick={() => handleCallClick(call.id)}
                  className={`p-3 border-b border-border hover:bg-muted cursor-pointer transition-colors ${
                    selectedCall === call.id ? "bg-muted" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getCallIcon(call.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">
                          {call.contactName || call.phoneNumber}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(call.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground truncate">
                          {call.contactName ? call.phoneNumber : ""}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatDuration(call.duration)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(call.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mx-2">
              <p className="text-xs text-muted-foreground text-center py-4">
                {searchQuery.trim() ? "No calls found matching your search" : "No call logs found"}
              </p>
              {searchQuery.trim() && callLogs.length > 0 && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs px-3 py-1 border border-border rounded hover:bg-muted transition-colors"
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
