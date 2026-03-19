import { AlertCircle, Search, X, Lightbulb, Vibrate } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { ipc } from "@/ipc/manager";

interface NotificationChannel {
  allowBubbles: number;
  blockableSystem: boolean;
  bypassDnd: boolean;
  conversationId?: string;
  deleted: boolean;
  demoted: boolean;
  description?: string;
  group?: string;
  id: string;
  importance: number;
  importanceLockedDefaultApp: boolean;
  importantConvo: boolean;
  lastNotificationUpdateTimeMs: number;
  lightColor: number;
  lights: boolean;
  lockscreenVisibility: number;
  name: string;
  originalImp: number;
  packageName: string;
  showBadge: boolean;
  sound: string;
  uid: number;
  userLockedFields: number;
  userVisibleTaskShown: boolean;
  vibrationEnabled: boolean;
  vibrationPattern?: string;
}

interface NotificationChannelMiddleSideProps {
  channels: NotificationChannel[];
  onNotificationChannelSelect: (channel: string) => void;
  selectedNotificationChannel: string;
  selectedPackage: string;
}

export const NotificationChannelMiddleSide: React.FC<
  NotificationChannelMiddleSideProps
> = ({
  selectedPackage,
  selectedNotificationChannel,
  onNotificationChannelSelect,
  channels,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredChannels, setFilteredChannels] = useState<
    NotificationChannel[]
  >([]);
  const [openingSettings, setOpeningSettings] = useState(false);
  const [settingsError, setSettingsError] = useState<string>("");

  const { selectedDevice } = useSelectedDevice();

  // Filter channels for selected package
  const packageChannels = channels.filter(
    (channel) => channel.packageName === selectedPackage
  );

  // Filter channels based on search
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = packageChannels.filter(
        (channel) =>
          channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          channel.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (channel.description &&
            channel.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
      setFilteredChannels(filtered);
    } else {
      setFilteredChannels(packageChannels);
    }
  }, [searchQuery, packageChannels]);

  // Open notification settings for the selected package
  const openNotificationSettings = async () => {
    if (!(selectedDevice && selectedDevice.id?.trim() && selectedPackage)) {
      setSettingsError("No device or package selected");
      return;
    }

    setOpeningSettings(true);
    setSettingsError("");

    try {
      await ipc.client.adb.executeCommand({
        deviceId: selectedDevice.id,
        command: `shell am start -a android.settings.APP_NOTIFICATION_SETTINGS --es android.provider.extra.APP_PACKAGE ${selectedPackage}`,
      });
    } catch (error) {
      console.error("Failed to open notification settings:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setSettingsError(`Failed to open notification settings: ${errorMessage}`);
    } finally {
      setOpeningSettings(false);
    }
  };

  // Close error dialog
  const closeErrorDialog = () => {
    setSettingsError("");
  };

  const formatImportance = (importance: number) => {
    const importanceMap: { [key: number]: string } = {
      0: "None",
      1: "Min",
      2: "Low",
      3: "Default",
      4: "High",
      5: "Max",
    };
    return importanceMap[importance] || importance.toString();
  };

  const getChannelKey = (channel: NotificationChannel) => {
    return `${channel.packageName}:${channel.id}`;
  };

  return (
    <>
      <div className="flex h-full flex-col border-border border-r border-l">
        <div className="flex h-full min-h-0 flex-col">
          {/* Header */}
          <div className="border-border border-b p-3">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium text-sm">
                {selectedPackage} ({packageChannels.length})
              </h3>
              {/* Settings button temporarily hidden
            <button
              onClick={openNotificationSettings}
              disabled={!selectedDevice || !selectedPackage || openingSettings}
              className="p-1.5 hover:bg-muted rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Open notification settings"
            >
              <Settings className={`h-3.5 w-3.5 ${openingSettings ? 'animate-spin' : ''}`} />
            </button>
            */}
            </div>

            {/* Search Input */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-3 w-3 text-muted-foreground" />
              </div>
              <input
                className="w-full rounded-md border border-border py-1 pr-10 pl-10 text-xs focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${packageChannels.length} channels`}
                type="text"
                value={searchQuery}
              />
              {searchQuery && (
                <button
                  className="absolute inset-y-0 right-0 flex items-center pr-3 transition-colors hover:text-foreground"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Channels List */}
          <div className="flex-1 overflow-auto">
            {filteredChannels.length > 0 ? (
              <div className="space-y-1 p-2">
                {filteredChannels.map((channel) => {
                  const channelKey = getChannelKey(channel);
                  return (
                    <div
                      className={`cursor-pointer rounded border border-border p-2 transition-colors hover:bg-muted/50 ${
                        selectedNotificationChannel === channelKey
                          ? "border-primary bg-muted"
                          : ""
                      }`}
                      key={channelKey}
                      onClick={() => onNotificationChannelSelect(channelKey)}
                    >
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="flex-1 truncate font-medium text-xs">
                            {channel.name}
                          </span>
                          <span
                            className={`rounded px-1.5 py-0.5 text-xs ${
                              channel.deleted
                                ? "bg-destructive/20 text-destructive"
                                : channel.showBadge
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {channel.deleted
                              ? "Deleted"
                              : channel.showBadge
                                ? "Badge"
                                : "No Badge"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex-1 truncate font-mono text-muted-foreground text-xs">
                            {channel.id}
                          </span>
                          <div className="flex items-center space-x-1 text-muted-foreground text-xs">
                            <span>{formatImportance(channel.importance)}</span>
                            {channel.lights && <Lightbulb className="h-3 w-3" />}
                            {channel.vibrationEnabled && <Vibrate className="h-3 w-3" />}
                          </div>
                        </div>
                        {channel.group && (
                          <div className="truncate text-muted-foreground text-xs">
                            Group: {channel.group}
                          </div>
                        )}
                        {channel.description && (
                          <div className="truncate text-muted-foreground text-xs">
                            {channel.description}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center p-8">
                <p className="text-center text-muted-foreground text-xs">
                  {searchQuery.trim()
                    ? "No channels found matching your search"
                    : "No channels found for this package"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Dialog */}
      <Dialog onOpenChange={closeErrorDialog} open={!!settingsError}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Settings Error
            </DialogTitle>
            <DialogDescription>{settingsError}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={closeErrorDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
