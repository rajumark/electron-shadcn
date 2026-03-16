import { RefreshCw, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { ipc } from "@/ipc/manager";

interface NotificationRecord {
  channel: string;
  flags: string[];
  id: string;
  importance: number;
  key: string;
  opPkg: string;
  pkg: string;
  postTime: number;
  subText?: string;
  tag: string | null;
  text?: string;
  title?: string;
  uid: number;
  user: string;
  userId: number;
  visibility: string;
}

interface NotificationRecordLeftSideProps {
  isDragging: boolean;
  leftWidth: number;
  onDragStart: () => void;
  onNotificationRecordSelect: (record: string) => void;
  selectedNotificationRecord: string;
}

export const NotificationRecordLeftSide: React.FC<
  NotificationRecordLeftSideProps
> = ({
  leftWidth,
  selectedNotificationRecord,
  onNotificationRecordSelect,
  isDragging,
  onDragStart,
}) => {
  const [records, setRecords] = useState<NotificationRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<NotificationRecord[]>(
    []
  );
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
    const lines = output.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Match NotificationRecord lines - more flexible regex that handles varying formats
      const recordMatch = line.match(
        /NotificationRecord\([^:]+: pkg=([^ ]+) user=([^ ]+) id=([^ ]+) tag=([^ ]+) importance=(\d+) key=([^:]+): Notification\(channel=([^ ]+)/
      );
      if (recordMatch) {
        const record: NotificationRecord = {
          key: recordMatch[6],
          pkg: recordMatch[1],
          user: recordMatch[2],
          id: recordMatch[3],
          tag: recordMatch[4] === "null" ? null : recordMatch[4],
          importance: Number.parseInt(recordMatch[5]),
          channel: recordMatch[7],
          flags: [],
          visibility: "PRIVATE",
          uid: 0,
          userId: 0,
          opPkg: "",
          postTime: 0,
        };

        // Look for uid, opPkg, postTime, and content in next few lines
        for (let j = i + 1; j < Math.min(i + 100, lines.length); j++) {
          const currentLine = lines[j];

          const uidMatch = currentLine.match(/uid=(\d+)/);
          if (uidMatch) {
            record.uid = Number.parseInt(uidMatch[1]);
          }

          const opPkgMatch = currentLine.match(/opPkg=(.+)/);
          if (opPkgMatch) {
            record.opPkg = opPkgMatch[1];
          }

          const postTimeMatch = currentLine.match(/postTime=(\d+)/);
          if (postTimeMatch) {
            record.postTime = Number.parseInt(postTimeMatch[1]);
          }

          // Extract flags
          const flagsMatch = currentLine.match(/flags=([^ ]+)/);
          if (flagsMatch) {
            record.flags = flagsMatch[1].split("|");
          }

          // Extract visibility
          const visMatch = currentLine.match(/vis=([^ )]+)/);
          if (visMatch) {
            record.visibility = visMatch[1];
          }

          // Extract title and text from extras
          const titleMatch = currentLine.match(
            /android\.title=String \[length=\d+\] (.+)/
          );
          if (titleMatch) {
            record.title = titleMatch[1].trim();
          }

          const textMatch = currentLine.match(
            /android\.text=String \[length=\d+\] (.+)/
          );
          if (textMatch) {
            record.text = textMatch[1].trim();
          }

          const bigTextMatch = currentLine.match(
            /android\.bigText=String \[length=\d+\] (.+)/
          );
          if (bigTextMatch && !record.text) {
            record.text = bigTextMatch[1].trim();
          }

          const subTextMatch = currentLine.match(
            /android\.subText=String \[length=\d+\] (.+)/
          );
          if (subTextMatch) {
            record.subText = subTextMatch[1].trim();
          }

          // Stop when we hit the next record
          if (
            currentLine.includes("NotificationRecord(") &&
            !currentLine.includes(record.key)
          ) {
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
    if (!(selectedDevice && selectedDevice.id?.trim())) {
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
          records.every(
            (record, index) => record.key === parsedRecords[index].key
          );

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
          }`
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
    if (!(selectedDevice && selectedDevice.id?.trim())) {
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
    return records.filter(
      (record) =>
        record.pkg.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        record.channel
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()) ||
        (record.title &&
          record.title
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase())) ||
        (record.text &&
          record.text
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()))
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
    setRefreshKey((prev) => prev + 1);
  };

  const handleRecordClick = useCallback(
    (recordKey: string) => {
      onNotificationRecordSelect(recordKey);
    },
    [onNotificationRecordSelect]
  );

  return (
    <div
      className="flex h-full flex-col overflow-hidden"
      style={{ width: `${leftWidth}%` }}
    >
      <div className="flex h-full min-h-0 flex-col">
        {/* Header with Title and Refresh */}
        <div className="mx-2 flex items-center justify-between pt-2 pb-2">
          <h2 className="font-medium text-sm">
            Notification Records ({records.length})
          </h2>
          <button
            className="rounded-md p-1.5 transition-colors hover:bg-muted"
            onClick={handleRefreshRecords}
            title="Refresh records"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mx-2 mb-2">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            className="w-full rounded-md border border-border py-1 pr-10 pl-10 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search in ${records.length} records`}
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

        {/* Error Display */}
        {error && (
          <div className="mx-2 mb-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3">
            <p className="text-destructive text-xs">{error}</p>
          </div>
        )}

        {/* Records List Container */}
        <div className="mx-2 flex flex-1 flex-col overflow-hidden">
          {loadingRecords ? (
            <div className="py-4 text-center">
              <div className="inline-block h-4 w-4 animate-spin rounded-full border-primary border-b-2" />
              <p className="mt-2 text-muted-foreground text-xs">
                Loading notification records...
              </p>
            </div>
          ) : filteredRecords.length > 0 ? (
            <div className="flex-1 overflow-auto" ref={recordsListRef}>
              {filteredRecords.map((record) => (
                <div
                  className={`cursor-pointer border-border border-b p-2 transition-colors hover:bg-muted/50 ${
                    selectedNotificationRecord === record.key ? "bg-muted" : ""
                  }`}
                  key={record.key}
                  onClick={() => handleRecordClick(record.key)}
                >
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="flex-1 truncate font-medium font-mono text-xs">
                        {record.pkg}
                      </span>
                      <span className="ml-2 text-muted-foreground text-xs">
                        {record.importance}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex-1 truncate text-muted-foreground text-xs">
                        {record.channel}
                      </span>
                      <span className="ml-2 text-muted-foreground text-xs">
                        ID: {record.id}
                      </span>
                    </div>
                    {record.title && (
                      <div className="truncate text-foreground text-xs">
                        {record.title}
                      </div>
                    )}
                    {record.text && (
                      <div className="truncate text-muted-foreground text-xs">
                        {record.text}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : selectedDevice ? (
            <div className="mx-2 flex flex-col items-center justify-center">
              <p className="py-4 text-center text-muted-foreground text-xs">
                {searchQuery.trim()
                  ? "No notification records found matching your search"
                  : "No notification records found"}
              </p>
              {searchQuery.trim() && records.length > 0 && (
                <button
                  className="rounded border border-border px-3 py-1 text-xs transition-colors hover:bg-muted"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Filter
                </button>
              )}
            </div>
          ) : (
            <div className="mx-2 flex flex-col items-center justify-center">
              <p className="py-4 text-center text-muted-foreground text-xs">
                Select a device to view notification records
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
