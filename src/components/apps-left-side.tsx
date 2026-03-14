import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Search, X, Filter } from "lucide-react";
import { ipc } from "@/ipc/manager";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { packageStore } from "@/utils/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PackageList } from "@/components/package-list";
import { usePackageContextMenu } from "@/hooks/use-package-context-menu";

interface AppsLeftSideProps {
  leftWidth: number;
  selectedPackage: string;
  onPackageSelect: (pkg: string) => void;
  isDragging: boolean;
  onDragStart: () => void;
}

export const AppsLeftSide: React.FC<AppsLeftSideProps> = ({
  leftWidth,
  selectedPackage,
  onPackageSelect,
  isDragging,
  onDragStart,
}) => {
  const [packages, setPackages] = useState<string[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [error, setError] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [pinnedPackages, setPinnedPackages] = useState<string[]>([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const packageListRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Filter state
  const [filterType, setFilterType] = useState<string>("all"); // all, user, system, disabled
  
  // Filter options
  const filterOptions = [
    { id: "all", label: "All apps", command: "pm list packages" },
    { id: "user", label: "User apps", command: "pm list packages -3" },
    { id: "system", label: "System apps", command: "pm list packages -s" },
    { id: "disabled", label: "Disabled apps", command: "pm list packages -d" },
  ];
  
  const { selectedDevice } = useSelectedDevice();

  // Fetch packages when device is selected or refresh is triggered
  useEffect(() => {
    if (!selectedDevice || !selectedDevice.id?.trim()) {
      setPackages([]);
      setFilteredPackages([]);
      setHasLoadedOnce(false);
      return;
    }

    const fetchPackages = async () => {
      // Show loading state only for the first visible load on this device
      if (!hasLoadedOnce) {
        setLoadingPackages(true);
      }
      setError("");

      try {
        let command = "pm list packages";
        if (filterType === "user") {
          command = "pm list packages -3";
        } else if (filterType === "system") {
          command = "pm list packages -s";
        } else if (filterType === "disabled") {
          command = "pm list packages -d";
        }

        const packageList = await ipc.client.adb.getInstalledPackages({
          deviceId: selectedDevice.id,
          command,
        });

        const isSameLength = packages.length === packageList.length;
        const isSame =
          isSameLength &&
          packages.every((pkg, index) => pkg === packageList[index]);

        if (!isSame) {
          setPackages(packageList);
          setFilteredPackages(packageList);
          setHasLoadedOnce(true);
        }
      } catch (error) {
        console.error("Failed to fetch packages:", error);
        setError(
          `Failed to fetch packages: ${
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

    fetchPackages();
  }, [selectedDevice, refreshKey, filterType, packages, hasLoadedOnce]);

  // Debounced search to prevent UI lag
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 150ms delay for instant UI feel
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Auto-refresh packages every 3 seconds while a valid device is selected
  useEffect(() => {
    if (!selectedDevice || !selectedDevice.id?.trim()) {
      return;
    }

    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedDevice]);

  // Load pinned packages on mount
  useEffect(() => {
    const loadPinnedPackages = async () => {
      const pinned = await packageStore.getPinnedPackages();
      setPinnedPackages(pinned);
    };
    loadPinnedPackages();
  }, []);

  // Memoized filtered packages for performance
  const memoizedFilteredPackages = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return packages;
    }
    return packages.filter(pkg => 
      pkg.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [packages, debouncedSearchQuery]);

  // Update filtered packages when memoized result changes
  useEffect(() => {
    setFilteredPackages(memoizedFilteredPackages);
    
    // Scroll to top instantly when search results change
    if (packageListRef.current) {
      packageListRef.current.scrollTop = 0;
    }
  }, [memoizedFilteredPackages]);

  const handleRefreshPackages = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handlePackageClick = useCallback((pkg: string) => {
    onPackageSelect(pkg);
  }, [onPackageSelect]);

  const handleAppUninstalled = useCallback(
    (pkg: string) => {
      setPackages((prev) => prev.filter((p) => p !== pkg));
      setFilteredPackages((prev) => prev.filter((p) => p !== pkg));
      if (selectedPackage === pkg) {
        onPackageSelect("");
      }
    },
    [selectedPackage, onPackageSelect],
  );

  const { handleContextMenuAction } = usePackageContextMenu({
    selectedDevice,
    setPinnedPackages,
    setRefreshKey,
    setError,
    setSearchQuery,
    onAppUninstalled: handleAppUninstalled,
  });

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ width: `${leftWidth}%` }}
    >
      <div className="flex flex-col h-full min-h-0">
        {/* Header with Title and Filter */}
        <div className="flex items-center justify-between mx-2 pt-2 pb-2">
          <h2 className="text-sm font-medium">
            {filterOptions.find(option => option.id === filterType)?.label || "Apps"}
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
            placeholder={`Search in ${packages.length} items`}
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

        {/* Package List Container */}
        <div className="flex-1 flex flex-col overflow-hidden mx-2">
          {loadingPackages ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <p className="text-xs text-muted-foreground mt-2">Loading packages...</p>
            </div>
          ) : filteredPackages.length > 0 ? (
            <PackageList
              ref={packageListRef}
              packages={filteredPackages}
              selectedPackage={selectedPackage}
              onPackageClick={handlePackageClick}
              onContextMenuAction={handleContextMenuAction}
              pinnedPackages={pinnedPackages}
            />
          ) : selectedDevice ? (
            <div className="flex flex-col items-center justify-center mx-2">
              <p className="text-xs text-muted-foreground text-center py-4">
                {searchQuery.trim() ? "No packages found matching your search" : "No packages found or failed to load"}
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
                Select a device to view installed packages
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
