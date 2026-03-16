import {
  Info,
  Loader2,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { ipc } from "@/ipc/manager";

interface Permission {
  details?: string;
  flags?: string;
  granted?: boolean;
  permission: string;
  section: string;
}

interface AppDetailsPermissionsProps {
  packageName: string;
}

const AppDetailsPermissions: React.FC<AppDetailsPermissionsProps> = ({
  packageName,
}) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [filteredPermissions, setFilteredPermissions] = useState<Permission[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("runtime permissions");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const selectedDevice = useSelectedDevice();

  const permissionTypes = [
    "runtime permissions",
    "install permissions",
    "requested permissions",
    "declared permissions",
  ];

  const settingsOptions = [
    {
      name: "Display over other apps",
      intent: "android.settings.ACTION_MANAGE_OVERLAY_PERMISSION",
    },
    {
      name: "Notifications",
      intent: "android.settings.ACTION_APP_NOTIFICATION_SETTINGS",
    },
    {
      name: "Storage",
      intent: "android.settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION",
    },
    {
      name: "Location",
      intent: "android.settings.ACTION_LOCATION_SOURCE_SETTINGS",
    },
    {
      name: "Camera",
      intent: "android.settings.ACTION_APPLICATION_DETAILS_SETTINGS",
    },
    {
      name: "Microphone",
      intent: "android.settings.ACTION_APPLICATION_DETAILS_SETTINGS",
    },
    {
      name: "Contacts",
      intent: "android.settings.ACTION_APPLICATION_DETAILS_SETTINGS",
    },
    {
      name: "SMS",
      intent: "android.settings.ACTION_APPLICATION_DETAILS_SETTINGS",
    },
    {
      name: "Phone",
      intent: "android.settings.ACTION_APPLICATION_DETAILS_SETTINGS",
    },
    {
      name: "Calendar",
      intent: "android.settings.ACTION_APPLICATION_DETAILS_SETTINGS",
    },
    {
      name: "Photos & Videos",
      intent: "android.settings.ACTION_APPLICATION_DETAILS_SETTINGS",
    },
    { name: "VPN", intent: "android.settings.ACTION_VPN_SETTINGS" },
    {
      name: "Battery",
      intent: "android.settings.ACTION_BATTERY_SAVER_SETTINGS",
    },
  ];

  const fetchPermissions = useCallback(async () => {
    if (!packageName) {
      return;
    }

    setLoading(true);
    try {
      const command = selectedDevice?.id
        ? `-s ${selectedDevice.id} shell dumpsys package ${packageName}`
        : `shell dumpsys package ${packageName}`;

      const result = await ipc.client.adb.executeADBCommand({
        args: command.split(" "),
        useCache: false, // Disable cache to always get fresh data
      });

      if (result) {
        const parsedPermissions = parsePermissionsContent(result);
        setPermissions(parsedPermissions);
      }
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    } finally {
      setLoading(false);
    }
  }, [packageName, selectedDevice]);

  const refreshPermissions = async () => {
    try {
      // Clear cache first to ensure fresh data
      await ipc.client.adb.clearADBCache();
      // Then fetch permissions
      await fetchPermissions();
    } catch (error) {
      console.error("Failed to refresh permissions:", error);
    }
  };

  const parsePermissionsContent = (result: string): Permission[] => {
    if (!result) {
      return [];
    }

    const permissionsList: Permission[] = [];
    const lines = result.split("\n");
    let currentSection: string | null = null;

    for (const line of lines) {
      if (line.includes("declared permissions:")) {
        currentSection = "declared permissions";
      } else if (line.includes("requested permissions:")) {
        currentSection = "requested permissions";
      } else if (line.includes("install permissions:")) {
        currentSection = "install permissions";
      } else if (line.includes("runtime permissions:")) {
        currentSection = "runtime permissions";
      }

      if (
        currentSection === "declared permissions" &&
        line.includes(": prot=")
      ) {
        const [permission, details] = line.split(": prot=");
        permissionsList.push({
          section: currentSection,
          permission: permission.trim(),
          details: details.trim(),
        });
      } else if (
        currentSection === "install permissions" &&
        line.includes(": granted=")
      ) {
        const [permission, details] = line.split(": granted=");
        permissionsList.push({
          section: currentSection,
          permission: permission.trim(),
          granted: details.trim() === "true",
        });
      } else if (
        currentSection === "runtime permissions" &&
        line.includes(": granted=")
      ) {
        // Handle runtime permissions format: "android.permission.NAME: granted=false, flags=[...]"
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("android.permission.")) {
          const colonIndex = trimmedLine.indexOf(":");
          const permission = trimmedLine.substring(0, colonIndex);
          const rest = trimmedLine.substring(colonIndex + 1);

          // Extract granted status
          const grantedMatch = rest.match(/granted=(true|false)/);
          const granted = grantedMatch ? grantedMatch[1] === "true" : false;

          permissionsList.push({
            section: currentSection,
            permission: permission.trim(),
            granted,
          });
        }
      } else if (
        currentSection === "requested permissions" &&
        line.trim() &&
        !line.includes(":")
      ) {
        permissionsList.push({
          section: currentSection,
          permission: line.trim(),
        });
      }
    }

    return permissionsList;
  };

  const modifyPermission = async (
    permissionName: string,
    isGranted: boolean
  ) => {
    if (!packageName) {
      return;
    }

    console.log("=== MODIFYING PERMISSION ===");
    console.log(`Permission: ${permissionName}`);
    console.log(`Action: ${isGranted ? "grant" : "revoke"}`);
    console.log(`Package: ${packageName}`);

    setActionLoading(isGranted ? "grant" : "revoke");
    try {
      // Clear cache before modifying to ensure fresh state
      await ipc.client.adb.clearADBCache();

      const action = isGranted ? "grant" : "revoke";
      const command = selectedDevice?.id
        ? `-s ${selectedDevice.id} shell pm ${action} ${packageName} ${permissionName}`
        : `shell pm ${action} ${packageName} ${permissionName}`;

      console.log(`Executing command: ${command}`);

      const result = await ipc.client.adb.executeADBCommand({
        args: command.split(" "),
        useCache: false, // Don't cache this command
      });

      console.log("Command result:", result);

      console.log(`Permission ${action}ed successfully: ${permissionName}`);

      // Add a small delay before refreshing to ensure the change is applied
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("=== REFRESHING PERMISSIONS AFTER CHANGE ===");
      await fetchPermissions(); // Refresh list after change
      console.log("=== PERMISSIONS REFRESHED ===");
    } catch (error) {
      console.error(
        `Failed to ${isGranted ? "grant" : "revoke"} permission: ${permissionName}`,
        error
      );
    } finally {
      setActionLoading(null);
    }
  };

  const grantAllPermissions = async () => {
    setActionLoading("grant-all");
    try {
      // Clear cache before batch operations to ensure fresh state
      await ipc.client.adb.clearADBCache();

      for (const permission of permissions) {
        if (
          permission.section === "runtime permissions" &&
          !permission.granted
        ) {
          await modifyPermission(permission.permission, true);
        }
      }
    } finally {
      setActionLoading(null);
    }
  };

  const revokeAllPermissions = async () => {
    setActionLoading("revoke-all");
    try {
      // Clear cache before batch operations to ensure fresh state
      await ipc.client.adb.clearADBCache();

      for (const permission of permissions) {
        if (
          permission.section === "runtime permissions" &&
          permission.granted
        ) {
          await modifyPermission(permission.permission, false);
        }
      }
    } finally {
      setActionLoading(null);
    }
  };

  const restartApp = async () => {
    setActionLoading("restart");
    try {
      const command = selectedDevice?.id
        ? `-s ${selectedDevice.id} shell am force-stop ${packageName}`
        : `shell am force-stop ${packageName}`;

      await ipc.client.adb.executeADBCommand({
        args: command.split(" "),
      });

      console.log("App restarted successfully.");
    } catch (error) {
      console.error("Failed to restart app:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const openAppInfo = async () => {
    try {
      const command = selectedDevice?.id
        ? `-s ${selectedDevice.id} shell am start -a android.settings.APPLICATION_DETAILS_SETTINGS -d package:${packageName}`
        : `shell am start -a android.settings.APPLICATION_DETAILS_SETTINGS -d package:${packageName}`;

      await ipc.client.adb.executeADBCommand({
        args: command.split(" "),
      });

      console.log("App info opened successfully.");
    } catch (error) {
      console.error("Failed to open app info:", error);
    }
  };

  const openSettings = async (intent: string) => {
    if (!selectedDevice?.id) {
      return;
    }

    try {
      const intentCommand = `-s ${selectedDevice.id} shell am start -a ${intent}`;

      // Force stop settings first
      const forceStopCommand = `-s ${selectedDevice.id} shell am force-stop com.android.settings`;
      await ipc.client.adb.executeADBCommand({
        args: forceStopCommand.split(" "),
      });

      await ipc.client.adb.executeADBCommand({
        args: intentCommand.split(" "),
      });

      console.log(`Settings opened successfully: ${intent}`);
    } catch (error) {
      console.error(`Failed to open settings: ${intent}`, error);
    }
  };

  // Filter permissions based on search and filter, and remove duplicates
  useEffect(() => {
    const uniquePermissions = permissions.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (p) => p.permission === item.permission && p.section === item.section
        )
    );

    const filtered = uniquePermissions.filter((item) => {
      const matchesFilter = item.section.toLowerCase().includes(selectedFilter);
      const matchesSearch = item.permission
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
    setFilteredPermissions(filtered);
  }, [permissions, searchTerm, selectedFilter]);

  // Fetch permissions on component mount
  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const hasRuntimePermissions = permissions.some(
    (item) => item.section === "runtime permissions"
  );
  const totalPermissions = filteredPermissions.length;
  const grantedPermissions = filteredPermissions.filter(
    (item) => item.granted
  ).length;
  const nonGrantedPermissions = totalPermissions - grantedPermissions;

  return (
    <div className="flex h-full flex-col p-0">
      {/* Filter Chips */}
      <div className="mt-0 mb-0">
        <Tabs onValueChange={setSelectedFilter} value={selectedFilter}>
          <TabsList className="w-fit" variant="line">
            {permissionTypes.map((type) => (
              <TabsTrigger className="text-xs" key={type} value={type}>
                {type.charAt(0).toUpperCase() +
                  type.slice(1).replace(" permissions", "")}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
        <Input
          className="pr-10 pl-10"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search permissions..."
          value={searchTerm}
        />
        {searchTerm && (
          <button
            className="absolute top-1/2 right-3 -translate-y-1/2 transform"
            onClick={() => setSearchTerm("")}
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      {/* Permission Summary */}
      {totalPermissions > 0 && (
        <div className="mb-4 rounded-lg bg-muted p-3">
          <p className="text-muted-foreground text-sm">
            <span className="font-medium">Summary:</span> Total:{" "}
            {totalPermissions}
            {(selectedFilter === "runtime permissions" ||
              selectedFilter === "install permissions") && (
              <>
                {" | Granted: "}
                <Badge className="ml-1" variant="secondary">
                  {grantedPermissions}
                </Badge>
                {" | Not Granted: "}
                <Badge className="ml-1" variant="outline">
                  {nonGrantedPermissions}
                </Badge>
              </>
            )}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      {hasRuntimePermissions && (
        <div className="mb-4 flex flex-wrap gap-2">
          <Button
            disabled={loading}
            onClick={refreshPermissions}
            size="sm"
            variant="outline"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            disabled={actionLoading !== null}
            onClick={grantAllPermissions}
            size="sm"
          >
            {actionLoading === "grant-all" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Grant All
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700"
            disabled={actionLoading !== null}
            onClick={revokeAllPermissions}
            size="sm"
          >
            {actionLoading === "revoke-all" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Revoke All
          </Button>
          <Button
            disabled={actionLoading !== null}
            onClick={restartApp}
            size="sm"
            variant="outline"
          >
            {actionLoading === "restart" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="mr-2 h-4 w-4" />
            )}
            Restart App
          </Button>
          <Button onClick={openAppInfo} size="sm" variant="outline">
            <Info className="mr-2 h-4 w-4" />
            App Info
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              {settingsOptions.map((option) => (
                <DropdownMenuItem
                  className="flex items-center justify-between"
                  key={option.intent}
                  onClick={() => openSettings(option.intent)}
                >
                  {option.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Permissions List */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : filteredPermissions.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No permissions found.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredPermissions.map((item, index) => (
              <div
                className="flex items-center justify-between rounded-lg border bg-card p-3"
                key={index}
              >
                {/* Permission Switch */}
                {(item.section === "runtime permissions" ||
                  item.section === "install permissions") && (
                  <Switch
                    checked={item.granted}
                    className="mr-3"
                    disabled={
                      item.section === "install permissions" ||
                      actionLoading !== null
                    }
                    onCheckedChange={(checked) =>
                      modifyPermission(item.permission, checked)
                    }
                  />
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-sm">
                    {item.permission}
                  </p>
                  {item.details && (
                    <p className="mt-1 text-muted-foreground text-xs">
                      {item.details}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppDetailsPermissions;
