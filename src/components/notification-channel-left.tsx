import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Search, X, RefreshCw } from "lucide-react";
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

interface NotificationChannelLeftSideProps {
  leftWidth: number;
  selectedNotificationChannel: string;
  onNotificationChannelSelect: (channel: string) => void;
  isDragging: boolean;
  onDragStart: () => void;
}

export const NotificationChannelLeftSide: React.FC<NotificationChannelLeftSideProps> = ({
  leftWidth,
  selectedNotificationChannel,
  onNotificationChannelSelect,
  isDragging,
  onDragStart,
}) => {
  const [channels, setChannels] = useState<NotificationChannel[]>([]);
  const [filteredChannels, setFilteredChannels] = useState<NotificationChannel[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [error, setError] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const channelsListRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const { selectedDevice } = useSelectedDevice();

  // Parse notification channels from dumpsys output
  const parseNotificationChannels = (output: string): NotificationChannel[] => {
    const channels: NotificationChannel[] = [];
    const lines = output.split('\n');
    let currentPackage = "";
    let currentUid = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Match AppSettings lines to get package and uid
      const appSettingsMatch = line.match(/AppSettings: ([^ ]+) \((\d+)\)/);
      if (appSettingsMatch) {
        currentPackage = appSettingsMatch[1];
        currentUid = parseInt(appSettingsMatch[2]);
        continue;
      }
      
      // Match NotificationChannel lines - handle truncated names better
      const channelMatch = line.match(/NotificationChannel\{mId='([^']+)', mName=([^,]+), mDescription=([^,]+), mImportance=(\d+), mBypassDnd=(true|false), mLockscreenVisibility=(-?\d+), mSound=([^,]+), mLights=(true|false), mLightColor=(\d+), mVibrationPattern=([^,]+), mVibrationEffect=([^,]+), mUserLockedFields=(\d+), mUserVisibleTaskShown=(true|false), mVibrationEnabled=(true|false), mShowBadge=(true|false), mDeleted=(true|false), mDeletedTimeMs=(-?\d+), mGroup='([^']*)', mAudioAttributes=([^,]+), mBlockableSystem=(true|false), mAllowBubbles=(-?\d+), mImportanceLockedDefaultApp=(true|false), mOriginalImp=(\d+), mParent=([^,]+), mConversationId=([^,]+), mDemoted=(true|false), mImportantConvo=(true|false), mLastNotificationUpdateTimeMs=(\d+)\}/);
      
      if (channelMatch && currentPackage) {
        const channel: NotificationChannel = {
          id: channelMatch[1],
          name: channelMatch[2].replace(/\.\.\./g, ''), // Remove truncation indicators
          description: channelMatch[3] === "" ? undefined : channelMatch[3],
          importance: parseInt(channelMatch[4]),
          bypassDnd: channelMatch[5] === "true",
          lockscreenVisibility: parseInt(channelMatch[6]),
          sound: channelMatch[7],
          lights: channelMatch[8] === "true",
          lightColor: parseInt(channelMatch[9]),
          vibrationPattern: channelMatch[10] === "null" ? undefined : channelMatch[10],
          vibrationEnabled: channelMatch[12] === "true",
          showBadge: channelMatch[13] === "true",
          deleted: channelMatch[14] === "true",
          group: channelMatch[17] === "null" || channelMatch[17] === "" ? undefined : channelMatch[17],
          packageName: currentPackage,
          uid: currentUid,
          userLockedFields: parseInt(channelMatch[11]),
          userVisibleTaskShown: channelMatch[12] === "true",
          blockableSystem: channelMatch[19] === "true",
          allowBubbles: parseInt(channelMatch[20]),
          importanceLockedDefaultApp: channelMatch[21] === "true",
          originalImp: parseInt(channelMatch[22]),
          conversationId: channelMatch[24] === "null" ? undefined : channelMatch[24],
          demoted: channelMatch[25] === "true",
          importantConvo: channelMatch[26] === "true",
          lastNotificationUpdateTimeMs: parseInt(channelMatch[27]),
        };
        
        channels.push(channel);
      }
    }
    
    return channels;
  };

  // Fetch notification channels when device is selected or refresh is triggered
  useEffect(() => {
    if (!selectedDevice || !selectedDevice.id?.trim()) {
      setChannels([]);
      setFilteredChannels([]);
      setHasLoadedOnce(false);
      return;
    }

    const fetchNotificationChannels = async () => {
      if (!hasLoadedOnce) {
        setLoadingChannels(true);
      }
      setError("");

      try {
        const output = await ipc.client.adb.executeCommand({
          deviceId: selectedDevice.id,
          command: "dumpsys notification",
        });

        const parsedChannels = parseNotificationChannels(output);
        
        const isSameLength = channels.length === parsedChannels.length;
        const isSame =
          isSameLength &&
          channels.every((channel, index) => 
            channel.id === parsedChannels[index].id && 
            channel.packageName === parsedChannels[index].packageName
          );

        if (!isSame) {
          setChannels(parsedChannels);
          setFilteredChannels(parsedChannels);
          setHasLoadedOnce(true);
        }
      } catch (error) {
        console.error("Failed to fetch notification channels:", error);
        setError(
          `Failed to fetch notification channels: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        );
        setChannels([]);
        setFilteredChannels([]);
      } finally {
        if (!hasLoadedOnce) {
          setLoadingChannels(false);
        }
      }
    };

    fetchNotificationChannels();
  }, [selectedDevice, refreshKey, channels, hasLoadedOnce]);

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

  // Auto-refresh channels every 10 seconds while a valid device is selected
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

  // Memoized filtered channels for performance
  const memoizedFilteredChannels = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return channels;
    }
    return channels.filter(channel => 
      channel.packageName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      channel.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      channel.id.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      (channel.description && channel.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
    );
  }, [channels, debouncedSearchQuery]);

  // Update filtered channels when memoized result changes
  useEffect(() => {
    setFilteredChannels(memoizedFilteredChannels);
    
    // Scroll to top instantly when search results change
    if (channelsListRef.current) {
      channelsListRef.current.scrollTop = 0;
    }
  }, [memoizedFilteredChannels]);

  const handleRefreshChannels = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleChannelClick = useCallback((channelKey: string) => {
    onNotificationChannelSelect(channelKey);
  }, [onNotificationChannelSelect]);

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
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ width: `${leftWidth}%` }}
    >
      <div className="flex flex-col h-full min-h-0">
        {/* Header with Title and Refresh */}
        <div className="flex items-center justify-between mx-2 pt-2 pb-2">
          <h2 className="text-sm font-medium">
            Notification Channels ({channels.length})
          </h2>
          <button
            onClick={handleRefreshChannels}
            className="p-1.5 hover:bg-muted rounded-md transition-colors"
            title="Refresh channels"
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
            placeholder={`Search in ${channels.length} channels`}
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

        {/* Channels List Container */}
        <div className="flex-1 flex flex-col overflow-hidden mx-2">
          {loadingChannels ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <p className="text-xs text-muted-foreground mt-2">Loading notification channels...</p>
            </div>
          ) : filteredChannels.length > 0 ? (
            <div
              ref={channelsListRef}
              className="flex-1 overflow-auto"
            >
              {filteredChannels.map((channel) => {
                const channelKey = getChannelKey(channel);
                return (
                  <div
                    key={channelKey}
                    className={`p-2 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedNotificationChannel === channelKey ? "bg-muted" : ""
                    }`}
                    onClick={() => handleChannelClick(channelKey)}
                  >
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium font-mono truncate flex-1">
                          {channel.packageName}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          channel.deleted ? 'bg-destructive/20 text-destructive' : 
                          channel.showBadge ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {channel.deleted ? 'Deleted' : channel.showBadge ? 'Badge' : 'No Badge'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-foreground truncate flex-1">
                          {channel.name}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {formatImportance(channel.importance)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground truncate flex-1 font-mono">
                          {channel.id}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {channel.lights ? '🔦' : ''} {channel.vibrationEnabled ? '📳' : ''}
                        </span>
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
          ) : selectedDevice ? (
            <div className="flex flex-col items-center justify-center mx-2">
              <p className="text-xs text-muted-foreground text-center py-4">
                {searchQuery.trim() ? "No notification channels found matching your search" : "No notification channels found"}
              </p>
              {searchQuery.trim() && channels.length > 0 && (
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
                Select a device to view notification channels
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
