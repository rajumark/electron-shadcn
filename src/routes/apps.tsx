import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Filter, Search, X } from "lucide-react";
import { ipc } from "@/ipc/manager";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
 
function AppsPage() {
  const { t } = useTranslation();
  const [leftWidth, setLeftWidth] = useState(30);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // ADB and device state
  const [packages, setPackages] = useState<string[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [error, setError] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);
  
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
    if (!selectedDevice) {
      setPackages([]);
      setFilteredPackages([]);
      return;
    }

    const fetchPackages = async () => {
      setLoadingPackages(true);
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
        setPackages(packageList);
        setFilteredPackages(packageList);
      } catch (error) {
        console.error("Failed to fetch packages:", error);
        setError(`Failed to fetch packages: ${error instanceof Error ? error.message : "Unknown error"}`);
        setPackages([]);
        setFilteredPackages([]);
      } finally {
        setLoadingPackages(false);
      }
    };

    fetchPackages();
  }, [selectedDevice, refreshKey, filterType]);

  // Filter packages based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPackages(packages);
    } else {
      const filtered = packages.filter(pkg => 
        pkg.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPackages(filtered);
    }
  }, [packages, searchQuery]);

  const handleRefreshPackages = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handlePackageClick = (pkg: string) => {
    setSelectedPackage(pkg);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!(isDragging && containerRef.current)) {
        return;
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      if (newLeftWidth >= 20 && newLeftWidth <= 50) {
        setLeftWidth(newLeftWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  return (
    <div className="mb-2 flex h-[calc(100vh-4rem)]">
      <div className="relative flex flex-1" ref={containerRef}>
        {/* Left Section - Package List */}
        <div
          className="h-full flex flex-col"
          style={{ width: `${leftWidth}%` }}
        >
          <div className="px-4 pb-4 flex flex-col h-full">
            {/* Header with Title and Filter */}
            <div className="flex items-center justify-between mb-4">
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
            <div className="mb-4 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder={`Search in ${packages.length} items`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}

            {/* Package List */}
            <div className="flex-1 flex flex-col min-h-0">
              {loadingPackages ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <p className="text-xs text-muted-foreground mt-2">Loading packages...</p>
                </div>
              ) : filteredPackages.length > 0 ? (
                <>
                  <div className="flex-1 overflow-y-auto space-y-1">
                    {filteredPackages.map((pkg, index) => (
                      <div
                        key={index}
                        onClick={() => handlePackageClick(pkg)}
                        className={`p-2 border rounded text-xs font-mono cursor-pointer transition-colors ${
                          selectedPackage === pkg
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background hover:bg-muted border-border"
                        }`}
                      >
                        {pkg}
                      </div>
                    ))}
                  </div>
                </>
              ) : selectedDevice ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  {searchQuery.trim() ? "No packages found matching your search" : "No packages found or failed to load"}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Select a device to view installed packages
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Resizable Divider */}
        <div
          className="relative cursor-col-resize bg-gray-300 hover:bg-gray-400 transition-colors"
          style={{ width: '0.5px' }}
          onMouseDown={() => setIsDragging(true)}
        />

        {/* Right Section - App Details */}
        <div className="mr-2 mb-2 ml-0 min-h-full flex-1 p-4">
          <h2 className="mb-2 font-semibold text-sm">App Details</h2>
          {selectedPackage ? (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg border">
                <h3 className="text-xs font-semibold mb-2">Package Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">Package Name:</span>
                    <span className="text-xs font-mono bg-background px-2 py-1 rounded border break-all">
                      {selectedPackage}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-xs font-medium">Available Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors">
                    Get App Info
                  </button>
                  <button className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors">
                    Get Permissions
                  </button>
                  <button className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors">
                    Launch App
                  </button>
                  <button className="px-3 py-1 text-xs bg-destructive text-destructive-foreground rounded hover:bg-destructive/80 transition-colors">
                    Uninstall
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Select an app from the left panel to view details here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/apps")({
  component: AppsPage,
});
