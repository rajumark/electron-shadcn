import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Search, X, RefreshCw } from "lucide-react";
import { ipc } from "@/ipc/manager";
import { useSelectedDevice } from "@/hooks/use-selected-device";

interface PackageInfo {
  name: string;
  channelCount: number;
  uid: number;
}

interface NotificationChannelLeftSideProps {
  leftWidth: number;
  selectedPackage: string;
  onPackageSelect: (pkg: string) => void;
  isDragging: boolean;
  onDragStart: () => void;
}

export const NotificationChannelLeftSide: React.FC<NotificationChannelLeftSideProps> = ({
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
    const lines = output.split('\n');
    const packageMap = new Map<string, PackageInfo>();
    let currentPackage = "";
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Match AppSettings lines to get package and uid
      const appSettingsMatch = line.match(/AppSettings: ([^ ]+) \((\d+)\)/);
      if (appSettingsMatch) {
        currentPackage = appSettingsMatch[1];
        const uid = parseInt(appSettingsMatch[2]);
        
        if (!packageMap.has(currentPackage)) {
          packageMap.set(currentPackage, {
            name: currentPackage,
            channelCount: 0,
            uid: uid,
          });
        }
      }
      
      // Match NotificationChannel lines to count channels per package
      const channelMatch = line.match(/NotificationChannel\{mId='([^']+)',/);
      if (channelMatch && currentPackage && packageMap.has(currentPackage)) {
        const packageInfo = packageMap.get(currentPackage)!;
        packageInfo.channelCount++;
      }
    }
    
    // Filter out packages with 0 channels
    return Array.from(packageMap.values()).filter(pkg => pkg.channelCount > 0);
  };

  // Fetch notification packages when device is selected or refresh is triggered
  useEffect(() => {
    if (!selectedDevice || !selectedDevice.id?.trim()) {
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
          packages.every((pkg, index) => pkg.name === parsedPackages[index].name);

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
          }`,
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
    if (!selectedDevice || !selectedDevice.id?.trim()) {
      return;
    }

    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedDevice]);

  // Memoized filtered packages for performance
  const memoizedFilteredPackages = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return packages;
    }
    return packages.filter(pkg => 
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
    setRefreshKey(prev => prev + 1);
  };

  const handlePackageClick = useCallback((packageName: string) => {
    onPackageSelect(packageName);
  }, [onPackageSelect]);

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ width: `${leftWidth}%` }}
    >
      <div className="flex flex-col h-full min-h-0">
        {/* Header with Title and Refresh */}
        <div className="flex items-center justify-between mx-2 pt-2 pb-2">
          <h2 className="text-sm font-medium">
            Packages ({packages.length})
          </h2>
          <button
            onClick={handleRefreshPackages}
            className="p-1.5 hover:bg-muted rounded-md transition-colors"
            title="Refresh packages"
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
            placeholder={`Search in ${packages.length} packages`}
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

        {/* Packages List Container */}
        <div className="flex-1 flex flex-col overflow-hidden mx-2">
          {loadingPackages ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <p className="text-xs text-muted-foreground mt-2">Loading packages...</p>
            </div>
          ) : filteredPackages.length > 0 ? (
            <div
              ref={packagesListRef}
              className="flex-1 overflow-auto"
            >
              {filteredPackages.map((pkg) => (
                <div
                  key={pkg.name}
                  className={`p-3 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedPackage === pkg.name ? "bg-muted" : ""
                  }`}
                  onClick={() => handlePackageClick(pkg.name)}
                >
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium font-mono truncate flex-1">
                        {pkg.name}
                      </span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {pkg.channelCount} channels
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      UID: {pkg.uid}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : selectedDevice ? (
            <div className="flex flex-col items-center justify-center mx-2">
              <p className="text-xs text-muted-foreground text-center py-4">
                {searchQuery.trim() ? "No packages found matching your search" : "No notification packages found"}
              </p>
              {searchQuery.trim() && packages.length > 0 && (
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
                Select a device to view notification packages
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
