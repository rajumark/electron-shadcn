import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Search, X, Filter, Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CallLog {
  id: string;
  phoneNumber: string;
  contactName?: string;
  timestamp: Date;
  duration: number; // in seconds
  type: "incoming" | "outgoing" | "missed";
}

interface CallLogsLeftSideProps {
  leftWidth: number;
  selectedCall: string;
  onCallSelect: (callId: string) => void;
  isDragging: boolean;
  onDragStart: () => void;
}

// Dummy data for call logs
const dummyCallLogs: CallLog[] = [
  {
    id: "1",
    phoneNumber: "+1 234-567-8901",
    contactName: "John Doe",
    timestamp: new Date("2024-03-14T10:30:00"),
    duration: 120,
    type: "incoming"
  },
  {
    id: "2", 
    phoneNumber: "+1 234-567-8902",
    contactName: "Jane Smith",
    timestamp: new Date("2024-03-14T09:15:00"),
    duration: 300,
    type: "outgoing"
  },
  {
    id: "3",
    phoneNumber: "+1 234-567-8903",
    timestamp: new Date("2024-03-14T08:45:00"),
    duration: 0,
    type: "missed"
  },
  {
    id: "4",
    phoneNumber: "+1 234-567-8904",
    contactName: "Bob Johnson",
    timestamp: new Date("2024-03-13T18:20:00"),
    duration: 180,
    type: "incoming"
  },
  {
    id: "5",
    phoneNumber: "+1 234-567-8905",
    contactName: "Alice Brown",
    timestamp: new Date("2024-03-13T15:10:00"),
    duration: 45,
    type: "outgoing"
  },
  {
    id: "6",
    phoneNumber: "+1 234-567-8906",
    timestamp: new Date("2024-03-13T12:30:00"),
    duration: 0,
    type: "missed"
  },
  {
    id: "7",
    phoneNumber: "+1 234-567-8907",
    contactName: "Charlie Wilson",
    timestamp: new Date("2024-03-12T20:15:00"),
    duration: 600,
    type: "incoming"
  },
  {
    id: "8",
    phoneNumber: "+1 234-567-8908",
    contactName: "Diana Davis",
    timestamp: new Date("2024-03-12T16:45:00"),
    duration: 240,
    type: "outgoing"
  }
];

export const CallLogsLeftSide: React.FC<CallLogsLeftSideProps> = ({
  leftWidth,
  selectedCall,
  onCallSelect,
  isDragging,
  onDragStart,
}) => {
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [filteredCallLogs, setFilteredCallLogs] = useState<CallLog[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  
  const callListRef = useRef<HTMLDivElement>(null);
  
  // Filter options
  const filterOptions = [
    { id: "all", label: "All calls" },
    { id: "incoming", label: "Incoming" },
    { id: "outgoing", label: "Outgoing" },
    { id: "missed", label: "Missed" },
  ];

  // Load dummy data on mount
  useEffect(() => {
    setLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setCallLogs(dummyCallLogs);
      setFilteredCallLogs(dummyCallLogs);
      setLoading(false);
    }, 500);
  }, []);

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

  const handleCallClick = useCallback((callId: string) => {
    onCallSelect(callId);
  }, [onCallSelect]);

  const formatDuration = (seconds: number): string => {
    if (seconds === 0) return "";
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const getCallIcon = (type: "incoming" | "outgoing" | "missed") => {
    switch (type) {
      case "incoming":
        return <PhoneIncoming className="h-4 w-4 text-green-500" />;
      case "outgoing":
        return <PhoneOutgoing className="h-4 w-4 text-blue-500" />;
      case "missed":
        return <PhoneMissed className="h-4 w-4 text-red-500" />;
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
