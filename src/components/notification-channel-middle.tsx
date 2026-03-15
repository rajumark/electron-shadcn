import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { ipc } from "@/ipc/manager";
import { useSelectedDevice } from "@/hooks/use-selected-device";

interface NotificationChannel {
  id: string;
  name: string;
  description?: string;
  importance: number;
  bypassDnd: boolean;
  lockscreenVisibility: number;
  sound: string;
  lights: boolean;
  lightColor: number;
  vibrationPattern?: string;
  vibrationEnabled: boolean;
  showBadge: boolean;
  deleted: boolean;
  group?: string;
  packageName: string;
  uid: number;
  userLockedFields: number;
  userVisibleTaskShown: boolean;
  blockableSystem: boolean;
  allowBubbles: number;
  importanceLockedDefaultApp: boolean;
  originalImp: number;
  conversationId?: string;
  demoted: boolean;
  importantConvo: boolean;
  lastNotificationUpdateTimeMs: number;
}

interface NotificationChannelMiddleSideProps {
  selectedPackage: string;
  selectedNotificationChannel: string;
  onNotificationChannelSelect: (channel: string) => void;
  channels: NotificationChannel[];
}

export const NotificationChannelMiddleSide: React.FC<NotificationChannelMiddleSideProps> = ({
  selectedPackage,
  selectedNotificationChannel,
  onNotificationChannelSelect,
  channels,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredChannels, setFilteredChannels] = useState<NotificationChannel[]>([]);

  // Filter channels for selected package
  const packageChannels = channels.filter(channel => channel.packageName === selectedPackage);

  // Debug Info - Show first few package names for comparison
  const samplePackageNames = channels.slice(0, 5).map(c => c.packageName);

  // Filter channels based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredChannels(packageChannels);
    } else {
      const filtered = packageChannels.filter(channel =>
        channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (channel.description && channel.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredChannels(filtered);
    }
  }, [searchQuery, packageChannels]);

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
    <div className="flex flex-col h-full border-l border-r border-border">
      <div className="flex flex-col h-full min-h-0">
        {/* Header */}
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">
              {selectedPackage} ({packageChannels.length})
            </h3>
          </div>
          
          {/* Debug Info */}
          <div className="text-xs text-muted-foreground mb-2 p-2 bg-muted/50 rounded">
            <div>Selected Package: {selectedPackage || "None"}</div>
            <div>Total Channels Available: {channels.length}</div>
            <div>Channels for Package: {packageChannels.length}</div>
            <div className="mt-1">Sample Package Names:</div>
            {samplePackageNames.map((pkg, idx) => (
              <div key={idx} className="ml-2 font-mono">{pkg}</div>
            ))}
          </div>
          
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-3 w-3 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder={`Search in ${packageChannels.length} channels`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-1 text-xs border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-auto">
          {filteredChannels.length > 0 ? (
            <div className="p-2 space-y-1">
              {filteredChannels.map((channel) => {
                const channelKey = getChannelKey(channel);
                return (
                  <div
                    key={channelKey}
                    className={`p-2 border border-border rounded cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedNotificationChannel === channelKey ? "bg-muted border-primary" : ""
                    }`}
                    onClick={() => onNotificationChannelSelect(channelKey)}
                  >
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium truncate flex-1">
                          {channel.name}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          channel.deleted 
                            ? 'bg-destructive/20 text-destructive' 
                            : channel.showBadge 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {channel.deleted ? 'Deleted' : channel.showBadge ? 'Badge' : 'No Badge'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground truncate flex-1 font-mono">
                          {channel.id}
                        </span>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <span>{formatImportance(channel.importance)}</span>
                          {channel.lights && <span>🔦</span>}
                          {channel.vibrationEnabled && <span>📳</span>}
                        </div>
                      </div>
                      {channel.group && (
                        <div className="text-xs text-muted-foreground truncate">
                          Group: {channel.group}
                        </div>
                      )}
                      {channel.description && (
                        <div className="text-xs text-muted-foreground truncate">
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
              <p className="text-xs text-muted-foreground text-center">
                {searchQuery.trim() 
                  ? "No channels found matching your search" 
                  : "No channels found for this package"
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
