import { RefreshCw, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { ipc } from "@/ipc/manager";

interface PackageInfo {
  channelCount: number;
  name: string;
  uid: number;
}

interface NotificationChannelLeftSideProps {
  isDragging: boolean;
  leftWidth: number;
  onDragStart: () => void;
  onPackageSelect: (pkg: string) => void;
  selectedPackage: string;
}

export const NotificationChannelLeftSide: React.FC<
  NotificationChannelLeftSideProps
> = ({
  leftWidth,
  selectedPackage,
  onPackageSelect,
  isDragging,
  onDragStart,
}) => {
  const [packages, setPackages] = useState<PackageInfo[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<PackageInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [error, setError] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const packagesListRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const { selectedDevice } = useSelectedDevice();

  // Parse notification channels from dumpsys output and extract unique packages
  const parseNotificationPackages = (output: string): PackageInfo[] => {
    const lines = output.split("\n");
    const packageMap = new Map<string, PackageInfo>();
    const channelMap = new Map<string, any>(); // Use Map to deduplicate channels
    let currentPackage = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Match AppSettings lines to get package and uid
      const appSettingsMatch = line.match(/AppSettings: ([^ ]+) \((\d+)\)/);
      if (appSettingsMatch) {
        currentPackage = appSettingsMatch[1];
        const uid = Number.parseInt(appSettingsMatch[2]);

        if (!packageMap.has(currentPackage)) {
          packageMap.set(currentPackage, {
            name: currentPackage,
            channelCount: 0,
            uid,
          });
        }
      }

      // Match NotificationChannel lines to count channels per package (with deduplication)
      const channelMatch = line.match(/NotificationChannel\{mId='([^']+)',/);
      if (channelMatch && currentPackage && packageMap.has(currentPackage)) {
        // Create unique key for deduplication
        const uniqueKey = `${currentPackage}:${channelMatch[1]}`;

        // Only count if we haven't seen this channel before
        if (!channelMap.has(uniqueKey)) {
          channelMap.set(uniqueKey, true); // Mark as seen
          const packageInfo = packageMap.get(currentPackage)!;
          packageInfo.channelCount++;
        }
      }
    }

    // Filter out packages with 0 channels
    return Array.from(packageMap.values()).filter(
      (pkg) => pkg.channelCount > 0
    );
  };

  // Fetch notification packages when device is selected or refresh is triggered
  useEffect(() => {
    if (!(selectedDevice && selectedDevice.id?.trim())) {
      setPackages([]);
      setFilteredPackages([]);
      setHasLoadedOnce(false);
      return;
    }

    const fetchNotificationPackages = async () => {
      if (!hasLoadedOnce) {
        setLoadingPackages(true);
      }
      setError("");

      try {
        const output = await ipc.client.adb.executeCommand({
          deviceId: selectedDevice.id,
          command: "dumpsys notification",
        });

        const parsedPackages = parseNotificationPackages(output);

        const isSameLength = packages.length === parsedPackages.length;
        const isSame =
          isSameLength &&
          packages.every(
            (pkg, index) => pkg.name === parsedPackages[index].name
          );

        if (!isSame) {
          setPackages(parsedPackages);
          setFilteredPackages(parsedPackages);
          setHasLoadedOnce(true);
        }
      } catch (error) {
        console.error("Failed to fetch notification packages:", error);
        setError(
          `Failed to fetch notification packages: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        setPackages([]);
        setFilteredPackages([]);
      } finally {
        if (!hasLoadedOnce) {
          setLoadingPackages(false);
        }
      }
    };

    fetchNotificationPackages();
  }, [selectedDevice, refreshKey, packages, hasLoadedOnce]);

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

  // Auto-refresh packages every 10 seconds while a valid device is selected
  useEffect(() => {
    if (!(selectedDevice && selectedDevice.id?.trim())) {
      return;
    }

    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 10_000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedDevice]);

  // Memoized filtered packages for performance
  const memoizedFilteredPackages = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return packages;
    }
    return packages.filter((pkg) =>
      pkg.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [packages, debouncedSearchQuery]);

  // Update filtered packages when memoized result changes
  useEffect(() => {
    setFilteredPackages(memoizedFilteredPackages);

    // Scroll to top instantly when search results change
    if (packagesListRef.current) {
      packagesListRef.current.scrollTop = 0;
    }
  }, [memoizedFilteredPackages]);

  const handleRefreshPackages = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handlePackageClick = useCallback(
    (packageName: string) => {
      onPackageSelect(packageName);
    },
    [onPackageSelect]
  );

  return (
    <div
      className="flex h-full flex-col overflow-hidden"
      style={{ width: `${leftWidth}%` }}
    >
      <div className="flex h-full min-h-0 flex-col">
        {/* Header with Title and Refresh */}
        <div className="mx-2 flex items-center justify-between pt-2 pb-2">
          <h2 className="font-medium text-sm">Packages ({packages.length})</h2>
          <button
            className="rounded-md p-1.5 transition-colors hover:bg-muted"
            onClick={handleRefreshPackages}
            title="Refresh packages"
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
            placeholder={`Search in ${packages.length} packages`}
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

        {/* Packages List Container */}
        <div className="mx-2 flex flex-1 flex-col overflow-hidden">
          {loadingPackages ? (
            <div className="py-4 text-center">
              <div className="inline-block h-4 w-4 animate-spin rounded-full border-primary border-b-2" />
              <p className="mt-2 text-muted-foreground text-xs">
                Loading packages...
              </p>
            </div>
          ) : filteredPackages.length > 0 ? (
            <div className="flex-1 overflow-auto" ref={packagesListRef}>
              {filteredPackages.map((pkg) => (
                <div
                  className={`cursor-pointer border-border border-b p-3 transition-colors hover:bg-muted/50 ${
                    selectedPackage === pkg.name ? "bg-muted" : ""
                  }`}
                  key={pkg.name}
                  onClick={() => handlePackageClick(pkg.name)}
                >
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="flex-1 truncate font-medium font-mono text-xs">
                        {pkg.name}
                      </span>
                      <span className="rounded bg-primary/10 px-2 py-1 text-primary text-xs">
                        {pkg.channelCount} channels
                      </span>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      UID: {pkg.uid}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : selectedDevice ? (
            <div className="mx-2 flex flex-col items-center justify-center">
              <p className="py-4 text-center text-muted-foreground text-xs">
                {searchQuery.trim()
                  ? "No packages found matching your search"
                  : "No notification packages found"}
              </p>
              {searchQuery.trim() && packages.length > 0 && (
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
                Select a device to view notification packages
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
