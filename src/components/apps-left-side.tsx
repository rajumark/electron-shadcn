import { Filter, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PackageList } from "@/components/package-list";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePackageContextMenu } from "@/hooks/use-package-context-menu";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { ipc } from "@/ipc/manager";
import { packageStore } from "@/utils/store";

interface AppsLeftSideProps {
  isDragging: boolean;
  leftWidth: number;
  onDragStart: () => void;
  onPackageSelect: (pkg: string) => void;
  selectedPackage: string;
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
  const [filterType, setFilterType] = useState<string>("user"); // all, user, system, disabled

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
    if (!(selectedDevice && selectedDevice.id?.trim())) {
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
    if (!(selectedDevice && selectedDevice.id?.trim())) {
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
    return packages.filter((pkg) =>
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
    setRefreshKey((prev) => prev + 1);
  };

  const handlePackageClick = useCallback(
    (pkg: string) => {
      onPackageSelect(pkg);
    },
    [onPackageSelect]
  );

  const handleAppUninstalled = useCallback(
    (pkg: string) => {
      setPackages((prev) => prev.filter((p) => p !== pkg));
      setFilteredPackages((prev) => prev.filter((p) => p !== pkg));
      if (selectedPackage === pkg) {
        onPackageSelect("");
      }
    },
    [selectedPackage, onPackageSelect]
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
      className="flex h-full flex-col overflow-hidden"
      style={{ width: `${leftWidth}%` }}
    >
      <div className="flex h-full min-h-0 flex-col">
        {/* Header with Title and Filter */}
        <div className="mx-2 flex items-center justify-between pt-2 pb-2">
          <h2 className="font-medium text-sm">
            {filterOptions.find((option) => option.id === filterType)?.label ||
              "Apps"}
          </h2>
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

        {/* Search Input */}
        <div className="relative mx-2 mb-2">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            className="w-full rounded-md border border-border py-1 pr-10 pl-10 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search in ${packages.length} items`}
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

        {/* Package List Container */}
        <div className="mx-2 flex flex-1 flex-col overflow-hidden">
          {loadingPackages ? (
            <div className="py-4 text-center">
              <div className="inline-block h-4 w-4 animate-spin rounded-full border-primary border-b-2" />
              <p className="mt-2 text-muted-foreground text-xs">
                Loading packages...
              </p>
            </div>
          ) : filteredPackages.length > 0 ? (
            <PackageList
              onContextMenuAction={handleContextMenuAction}
              onPackageClick={handlePackageClick}
              packages={filteredPackages}
              pinnedPackages={pinnedPackages}
              ref={packageListRef}
              selectedPackage={selectedPackage}
            />
          ) : selectedDevice ? (
            <div className="mx-2 flex flex-col items-center justify-center">
              <p className="py-4 text-center text-muted-foreground text-xs">
                {searchQuery.trim()
                  ? "No packages found matching your search"
                  : "No packages found or failed to load"}
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
                Select a device to view installed packages
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
