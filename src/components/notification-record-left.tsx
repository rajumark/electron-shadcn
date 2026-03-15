import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Search, X, RefreshCw } from "lucide-react";
import { ipc } from "@/ipc/manager";
import { useSelectedDevice } from "@/hooks/use-selected-device";

interface NotificationRecord {
  key: string;
  pkg: string;
  user: string;
  id: string;
  tag: string | null;
  importance: number;
  channel: string;
  flags: string[];
  visibility: string;
  uid: number;
  userId: number;
  opPkg: string;
  postTime: number;
  title?: string;
  text?: string;
  subText?: string;
}

interface NotificationRecordLeftSideProps {
  leftWidth: number;
  selectedNotificationRecord: string;
  onNotificationRecordSelect: (record: string) => void;
  isDragging: boolean;
  onDragStart: () => void;
}

export const NotificationRecordLeftSide: React.FC<NotificationRecordLeftSideProps> = ({
  leftWidth,
  selectedNotificationRecord,
  onNotificationRecordSelect,
  isDragging,
  onDragStart,
}) => {
  const [records, setRecords] = useState<NotificationRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<NotificationRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [error, setError] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const recordsListRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const { selectedDevice } = useSelectedDevice();

  // Parse notification dumpsys output
  const parseNotificationDump = (output: string): NotificationRecord[] => {
    const records: NotificationRecord[] = [];
    const lines = output.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Match NotificationRecord lines - improved regex
      const recordMatch = line.match(/NotificationRecord\([^:]+: pkg=([^ ]+) user=([^ ]+) id=([^ ]+) tag=([^ ]+) importance=(\d+) key=([^:]+): Notification\(channel=([^ ]+) shortcut=([^ ]+) contentView=([^ ]+) vibrate=([^ ]+) sound=([^ ]+) tick defaults=(\d+) flags=([^ ]+) color=(0x[0-9a-fA-F]+) vis=([^)]+)\)/);
      if (recordMatch) {
        const record: NotificationRecord = {
          key: recordMatch[6],
          pkg: recordMatch[1],
          user: recordMatch[2],
          id: recordMatch[3],
          tag: recordMatch[4] === "null" ? null : recordMatch[4],
          importance: parseInt(recordMatch[5]),
          channel: recordMatch[7],
          flags: recordMatch[12].split('|'),
          visibility: recordMatch[14],
          uid: 0,
          userId: 0,
          opPkg: "",
          postTime: 0,
        };
        
        // Look for uid, opPkg, postTime, and content in next few lines
        for (let j = i + 1; j < Math.min(i + 50, lines.length); j++) {
          const uidMatch = lines[j].match(/uid=(\d+)/);
          if (uidMatch) {
            record.uid = parseInt(uidMatch[1]);
          }
          
          const opPkgMatch = lines[j].match(/opPkg=(.+)/);
          if (opPkgMatch) {
            record.opPkg = opPkgMatch[1];
          }
          
          const postTimeMatch = lines[j].match(/postTime=(\d+)/);
          if (postTimeMatch) {
            record.postTime = parseInt(postTimeMatch[1]);
          }
          
          // Extract title and text from extras
          const titleMatch = lines[j].match(/android\.title=String \[length=\d+\] (.+)/);
          if (titleMatch) {
            record.title = titleMatch[1].trim();
          }
          
          const textMatch = lines[j].match(/android\.text=String \[length=\d+\] (.+)/);
          if (textMatch) {
            record.text = textMatch[1].trim();
          }
          
          const bigTextMatch = lines[j].match(/android\.bigText=String \[length=\d+\] (.+)/);
          if (bigTextMatch && !record.text) {
            record.text = bigTextMatch[1].trim();
          }
          
          const subTextMatch = lines[j].match(/android\.subText=String \[length=\d+\] (.+)/);
          if (subTextMatch) {
            record.subText = subTextMatch[1].trim();
          }
          
          // Stop when we hit the next record
          if (lines[j].includes("NotificationRecord(") && !lines[j].includes(record.key)) {
            break;
          }
        }
        
        records.push(record);
      }
    }
    
    return records;
  };

  // Fetch notification records when device is selected or refresh is triggered
  useEffect(() => {
    if (!selectedDevice || !selectedDevice.id?.trim()) {
      setRecords([]);
      setFilteredRecords([]);
      setHasLoadedOnce(false);
      return;
    }

    const fetchNotificationRecords = async () => {
      if (!hasLoadedOnce) {
        setLoadingRecords(true);
      }
      setError("");

      try {
        const output = await ipc.client.adb.executeCommand({
          deviceId: selectedDevice.id,
          command: "dumpsys notification",
        });

        const parsedRecords = parseNotificationDump(output);
        
        const isSameLength = records.length === parsedRecords.length;
        const isSame =
          isSameLength &&
          records.every((record, index) => record.key === parsedRecords[index].key);

        if (!isSame) {
          setRecords(parsedRecords);
          setFilteredRecords(parsedRecords);
          setHasLoadedOnce(true);
        }
      } catch (error) {
        console.error("Failed to fetch notification records:", error);
        setError(
          `Failed to fetch notification records: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        );
        setRecords([]);
        setFilteredRecords([]);
      } finally {
        if (!hasLoadedOnce) {
          setLoadingRecords(false);
        }
      }
    };

    fetchNotificationRecords();
  }, [selectedDevice, refreshKey, records, hasLoadedOnce]);

  // Debounced search to prevent UI lag
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Auto-refresh records every 5 seconds while a valid device is selected
  useEffect(() => {
    if (!selectedDevice || !selectedDevice.id?.trim()) {
      return;
    }

    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedDevice]);

  // Memoized filtered records for performance
  const memoizedFilteredRecords = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return records;
    }
    return records.filter(record => 
      record.pkg.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      record.channel.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      (record.title && record.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) ||
      (record.text && record.text.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
    );
  }, [records, debouncedSearchQuery]);

  // Update filtered records when memoized result changes
  useEffect(() => {
    setFilteredRecords(memoizedFilteredRecords);
    
    // Scroll to top instantly when search results change
    if (recordsListRef.current) {
      recordsListRef.current.scrollTop = 0;
    }
  }, [memoizedFilteredRecords]);

  const handleRefreshRecords = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleRecordClick = useCallback((recordKey: string) => {
    onNotificationRecordSelect(recordKey);
  }, [onNotificationRecordSelect]);

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ width: `${leftWidth}%` }}
    >
      <div className="flex flex-col h-full min-h-0">
        {/* Header with Title and Refresh */}
        <div className="flex items-center justify-between mx-2 pt-2 pb-2">
          <h2 className="text-sm font-medium">
            Notification Records ({records.length})
          </h2>
          <button
            onClick={handleRefreshRecords}
            className="p-1.5 hover:bg-muted rounded-md transition-colors"
            title="Refresh records"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-2 mx-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder={`Search in ${records.length} records`}
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

        {/* Error Display */}
        {error && (
          <div className="mb-2 mx-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-xs text-destructive">{error}</p>
          </div>
        )}

        {/* Records List Container */}
        <div className="flex-1 flex flex-col overflow-hidden mx-2">
          {loadingRecords ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <p className="text-xs text-muted-foreground mt-2">Loading notification records...</p>
            </div>
          ) : filteredRecords.length > 0 ? (
            <div
              ref={recordsListRef}
              className="flex-1 overflow-auto"
            >
              {filteredRecords.map((record) => (
                <div
                  key={record.key}
                  className={`p-2 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedNotificationRecord === record.key ? "bg-muted" : ""
                  }`}
                  onClick={() => handleRecordClick(record.key)}
                >
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium font-mono truncate flex-1">
                        {record.pkg}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {record.importance}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground truncate flex-1">
                        {record.channel}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ID: {record.id}
                      </span>
                    </div>
                    {record.title && (
                      <div className="text-xs text-foreground truncate">
                        {record.title}
                      </div>
                    )}
                    {record.text && (
                      <div className="text-xs text-muted-foreground truncate">
                        {record.text}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : selectedDevice ? (
            <div className="flex flex-col items-center justify-center mx-2">
              <p className="text-xs text-muted-foreground text-center py-4">
                {searchQuery.trim() ? "No notification records found matching your search" : "No notification records found"}
              </p>
              {searchQuery.trim() && records.length > 0 && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs px-3 py-1 border border-border rounded hover:bg-muted transition-colors"
                >
                  Clear Filter
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mx-2">
              <p className="text-xs text-muted-foreground text-center py-4">
                Select a device to view notification records
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
