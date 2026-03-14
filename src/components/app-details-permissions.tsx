import { useState, useEffect, useCallback } from "react";
import { Search, X, Loader2, Settings, RotateCcw, Info, RefreshCw } from "lucide-react";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { ipc } from "@/ipc/manager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface Permission {
  section: string;
  permission: string;
  granted?: boolean;
  details?: string;
  flags?: string;
}

interface AppDetailsPermissionsProps {
  packageName: string;
}

const AppDetailsPermissions: React.FC<AppDetailsPermissionsProps> = ({
  packageName,
}) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [filteredPermissions, setFilteredPermissions] = useState<Permission[]>([]);
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
    { name: "Display over other apps", intent: "android.settings.ACTION_MANAGE_OVERLAY_PERMISSION" },
    { name: "Notifications", intent: "android.settings.ACTION_APP_NOTIFICATION_SETTINGS" },
    { name: "Storage", intent: "android.settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION" },
    { name: "Location", intent: "android.settings.ACTION_LOCATION_SOURCE_SETTINGS" },
    { name: "Camera", intent: "android.settings.ACTION_APPLICATION_DETAILS_SETTINGS" },
    { name: "Microphone", intent: "android.settings.ACTION_APPLICATION_DETAILS_SETTINGS" },
    { name: "Contacts", intent: "android.settings.ACTION_APPLICATION_DETAILS_SETTINGS" },
    { name: "SMS", intent: "android.settings.ACTION_APPLICATION_DETAILS_SETTINGS" },
    { name: "Phone", intent: "android.settings.ACTION_APPLICATION_DETAILS_SETTINGS" },
    { name: "Calendar", intent: "android.settings.ACTION_APPLICATION_DETAILS_SETTINGS" },
    { name: "Photos & Videos", intent: "android.settings.ACTION_APPLICATION_DETAILS_SETTINGS" },
    { name: "VPN", intent: "android.settings.ACTION_VPN_SETTINGS" },
    { name: "Battery", intent: "android.settings.ACTION_BATTERY_SAVER_SETTINGS" },
  ];

  const fetchPermissions = useCallback(async () => {
    if (!packageName) return;
    
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
    if (!result) return [];

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

      if (currentSection === "declared permissions" && line.includes(": prot=")) {
        const [permission, details] = line.split(": prot=");
        permissionsList.push({
          section: currentSection,
          permission: permission.trim(),
          details: details.trim(),
        });
      } else if (currentSection === "install permissions" && line.includes(": granted=")) {
        const [permission, details] = line.split(": granted=");
        permissionsList.push({
          section: currentSection,
          permission: permission.trim(),
          granted: details.trim() === "true",
        });
      } else if (currentSection === "runtime permissions" && line.includes(": granted=")) {
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
            granted: granted,
          });
        }
      } else if (currentSection === "requested permissions" && line.trim()) {
        if (!line.includes(":")) {
          permissionsList.push({
            section: currentSection,
            permission: line.trim(),
          });
        }
      }
    }

    return permissionsList;
  };

  const modifyPermission = async (permissionName: string, isGranted: boolean) => {
    if (!packageName) return;

    console.log(`=== MODIFYING PERMISSION ===`);
    console.log(`Permission: ${permissionName}`);
    console.log(`Action: ${isGranted ? 'grant' : 'revoke'}`);
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

      console.log(`Command result:`, result);

      console.log(`Permission ${action}ed successfully: ${permissionName}`);
      
      // Add a small delay before refreshing to ensure the change is applied
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`=== REFRESHING PERMISSIONS AFTER CHANGE ===`);
      await fetchPermissions(); // Refresh list after change
      console.log(`=== PERMISSIONS REFRESHED ===`);
    } catch (error) {
      console.error(`Failed to ${isGranted ? "grant" : "revoke"} permission: ${permissionName}`, error);
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
        if (permission.section === "runtime permissions" && !permission.granted) {
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
        if (permission.section === "runtime permissions" && permission.granted) {
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
    if (!selectedDevice?.id) return;
    
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
    const uniquePermissions = permissions.filter((item, index, self) => 
      index === self.findIndex((p) => p.permission === item.permission && p.section === item.section)
    );
    
    const filtered = uniquePermissions.filter(item => {
      const matchesFilter = item.section.toLowerCase().includes(selectedFilter);
      const matchesSearch = item.permission.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
    setFilteredPermissions(filtered);
  }, [permissions, searchTerm, selectedFilter]);

  // Fetch permissions on component mount
  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const hasRuntimePermissions = permissions.some(item => item.section === "runtime permissions");
  const totalPermissions = filteredPermissions.length;
  const grantedPermissions = filteredPermissions.filter(item => item.granted).length;
  const nonGrantedPermissions = totalPermissions - grantedPermissions;

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Filter Chips */}
      <div className="mb-4">
        <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
          <TabsList variant="line" className="w-fit">
            {permissionTypes.map((type) => (
              <TabsTrigger
                key={type}
                value={type}
                className="text-xs"
              >
                {type.charAt(0).toUpperCase() + type.slice(1).replace(" permissions", "")}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search permissions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      {/* Permission Summary */}
      {totalPermissions > 0 && (
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Summary:</span> Total: {totalPermissions}
            {(selectedFilter === "runtime permissions" || selectedFilter === "install permissions") && (
              <>
                {" | Granted: "}
                <Badge variant="secondary" className="ml-1">
                  {grantedPermissions}
                </Badge>
                {" | Not Granted: "}
                <Badge variant="outline" className="ml-1">
                  {nonGrantedPermissions}
                </Badge>
              </>
            )}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      {hasRuntimePermissions && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={refreshPermissions}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={grantAllPermissions}
            disabled={actionLoading !== null}
            className="bg-green-600 hover:bg-green-700"
          >
            {actionLoading === "grant-all" ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Grant All
          </Button>
          <Button
            size="sm"
            onClick={revokeAllPermissions}
            disabled={actionLoading !== null}
            className="bg-red-600 hover:bg-red-700"
          >
            {actionLoading === "revoke-all" ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Revoke All
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={restartApp}
            disabled={actionLoading !== null}
          >
            {actionLoading === "restart" ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RotateCcw className="h-4 w-4 mr-2" />
            )}
            Restart App
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={openAppInfo}
          >
            <Info className="h-4 w-4 mr-2" />
            App Info
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              {settingsOptions.map((option) => (
                <DropdownMenuItem
                  key={option.intent}
                  onClick={() => openSettings(option.intent)}
                  className="flex items-center justify-between"
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
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : filteredPermissions.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No permissions found.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredPermissions.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                {/* Permission Switch */}
                {(item.section === "runtime permissions" || item.section === "install permissions") && (
                  <Switch
                    checked={item.granted || false}
                    onCheckedChange={(checked) => modifyPermission(item.permission, checked)}
                    disabled={item.section === "install permissions" || actionLoading !== null}
                    className="mr-3"
                  />
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono truncate">{item.permission}</p>
                  {item.details && (
                    <p className="text-xs text-muted-foreground mt-1">
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
