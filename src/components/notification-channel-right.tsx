import { useState, useEffect, useMemo } from "react";
import { Copy, RefreshCw, Volume2, Vibrate, Lightbulb, Settings, AlertCircle } from "lucide-react";
import { ipc } from "@/ipc/manager";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface NotificationChannelDetails {
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
  fullChannelString?: string;
}

interface NotificationChannelRightSideProps {
  selectedNotificationChannel: string;
  channels: NotificationChannelDetails[];
}

export const NotificationChannelRightSide: React.FC<NotificationChannelRightSideProps> = ({
  selectedNotificationChannel,
  channels,
}) => {
  const [rawData, setRawData] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [openingSettings, setOpeningSettings] = useState(false);
  const [settingsError, setSettingsError] = useState<string>("");

  const { selectedDevice } = useSelectedDevice();

  // Find the selected channel from the channels array
  const channelDetails = useMemo(() => {
    return channels.find(channel => 
      `${channel.packageName}:${channel.id}` === selectedNotificationChannel
    );
  }, [channels, selectedNotificationChannel]);

  // Open channel notification settings for the selected channel
  const openChannelSettings = async () => {
    if (!selectedDevice || !selectedDevice.id?.trim() || !channelDetails) {
      setSettingsError("No device or channel selected");
      return;
    }

    setOpeningSettings(true);
    setSettingsError("");
    
    try {
      await ipc.client.adb.executeCommand({
        deviceId: selectedDevice.id,
        command: `shell am start -a android.settings.CHANNEL_NOTIFICATION_SETTINGS --es android.provider.extra.APP_PACKAGE ${channelDetails.packageName} --es android.provider.extra.CHANNEL_ID ${channelDetails.id}`,
      });
    } catch (error) {
      console.error("Failed to open channel settings:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setSettingsError(`Failed to open channel settings: ${errorMessage}`);
    } finally {
      setOpeningSettings(false);
    }
  };

  // Close error dialog
  const closeErrorDialog = () => {
    setSettingsError("");
  };

  // Parse notification channel details from dumpsys output
  const parseNotificationChannelDetails = (output: string, targetChannelKey: string): NotificationChannelDetails | null => {
    const [packageName, channelId] = targetChannelKey.split(':');
    const lines = output.split('\n');
    
    let currentPackage = "";
    let currentUid = 0;
    let foundChannel: NotificationChannelDetails | null = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Match AppSettings lines to get package and uid
      const appSettingsMatch = line.match(/AppSettings: ([^ ]+) \((\d+)\)/);
      if (appSettingsMatch) {
        currentPackage = appSettingsMatch[1];
        currentUid = parseInt(appSettingsMatch[2]);
        
        // Reset found channel when we move to a different package
        if (currentPackage !== packageName) {
          foundChannel = null;
        }
        continue;
      }
      
      // Only process channels for the target package
      if (currentPackage !== packageName) {
        continue;
      }
      
      // Match NotificationChannel lines
      const channelMatch = line.match(/NotificationChannel\{mId='([^']+)', mName=([^,]+), mDescription=([^,]+), mImportance=(\d+), mBypassDnd=(true|false), mLockscreenVisibility=(-?\d+), mSound=([^,]+), mLights=(true|false), mLightColor=(\d+), mVibrationPattern=([^,]+), mVibrationEffect=([^,]+), mUserLockedFields=(\d+), mUserVisibleTaskShown=(true|false), mVibrationEnabled=(true|false), mShowBadge=(true|false), mDeleted=(true|false), mDeletedTimeMs=(-?\d+), mGroup='([^']*)', mAudioAttributes=([^,]+), mBlockableSystem=(true|false), mAllowBubbles=(-?\d+), mImportanceLockedDefaultApp=(true|false), mOriginalImp=(\d+), mParent=([^,]+), mConversationId=([^,]+), mDemoted=(true|false), mImportantConvo=(true|false), mLastNotificationUpdateTimeMs=(\d+)\}/);
      
      if (channelMatch) {
        const channel: NotificationChannelDetails = {
          id: channelMatch[1],
          name: channelMatch[2],
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
          fullChannelString: line,
        };
        
        // Check if this is the target channel
        if (channel.id === channelId) {
          foundChannel = channel;
          break;
        }
      }
    }
    
    return foundChannel;
  };

  // Fetch notification channel details when channel is selected
  useEffect(() => {
    if (!selectedDevice || !selectedDevice.id?.trim() || !selectedNotificationChannel) {
      setRawData("");
      setError("");
      return;
    }

    const fetchChannelDetails = async () => {
      setLoading(true);
      setError("");

      try {
        const output = await ipc.client.adb.executeCommand({
          deviceId: selectedDevice.id,
          command: "dumpsys notification",
        });

        // Extract the raw data for the selected package
        const [packageName] = selectedNotificationChannel.split(':');
        const lines = output.split('\n');
        let packageRawData = "";
        let inTargetPackage = false;

        for (const line of lines) {
          const appSettingsMatch = line.match(/AppSettings: ([^ ]+) \(/);
          if (appSettingsMatch) {
            if (appSettingsMatch[1] === packageName) {
              inTargetPackage = true;
              packageRawData += line + '\n';
            } else {
              inTargetPackage = false;
            }
          } else if (inTargetPackage) {
            packageRawData += line + '\n';
          }
        }

        setRawData(packageRawData);
      } catch (error) {
        console.error("Failed to fetch channel details:", error);
        setError(
          `Failed to fetch channel details: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        setRawData("");
      } finally {
        setLoading(false);
      }
    };

    fetchChannelDetails();
  }, [selectedDevice, selectedNotificationChannel, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(rawData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString();
  };

  const formatImportance = (importance?: number) => {
    if (importance === undefined) return "N/A";
    
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

  const formatLockscreenVisibility = (visibility?: number) => {
    if (visibility === undefined) return "N/A";
    
    const visibilityMap: { [key: string]: string } = {
      "-1": "Secret",
      "-1000": "Private",
      "0": "Public",
      "1": "Public",
    };
    
    return visibilityMap[visibility.toString()] || visibility.toString();
  };

  const formatAllowBubbles = (allowBubbles?: number) => {
    if (allowBubbles === undefined) return "N/A";
    
    const bubbleMap: { [key: string]: string } = {
      "-1": "Default",
      "0": "Not Allowed",
      "1": "Allowed",
    };
    
    return bubbleMap[allowBubbles.toString()] || allowBubbles.toString();
  };

  return (
    <>
      <div className="mr-2 mb-2 ml-0 min-h-full flex-1 min-w-0">
      {selectedNotificationChannel ? (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 pb-2 border-b border-border">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground font-mono break-all">
                {selectedNotificationChannel}
              </p>
              <div className="flex items-center space-x-2">
              {/* Settings button temporarily hidden
              <button
                onClick={openChannelSettings}
                disabled={!selectedDevice || !channelDetails || openingSettings}
                className="p-1.5 hover:bg-muted rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Open channel notification settings"
              >
                <Settings className={`h-3.5 w-3.5 ${openingSettings ? 'animate-spin' : ''}`} />
              </button>
              */}
              <button
                onClick={handleRefresh}
                className="p-1.5 hover:bg-muted rounded-md transition-colors"
                title="Refresh details"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleCopyToClipboard}
                className="p-1.5 hover:bg-muted rounded-md transition-colors"
                title="Copy raw data"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
            </div>
            {copied && (
              <p className="text-xs text-green-600 mt-1">Copied to clipboard!</p>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <p className="text-xs text-muted-foreground mt-2">Loading channel details...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </div>
            ) : channelDetails ? (
              <Tabs defaultValue="details" className="h-full flex flex-col">
                <TabsList variant="line" className="mx-4 mt-0">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="raw">Raw Data</TabsTrigger>
                </TabsList>
                
                <div className="flex-1 overflow-auto">
                  <TabsContent value="details" className="mt-0 p-4">
                    <div className="space-y-6">
                      {/* Status Badge */}
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          channelDetails.deleted 
                            ? 'bg-destructive/20 text-destructive' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {channelDetails.deleted ? 'Deleted' : 'Active'}
                        </span>
                        {channelDetails.showBadge && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Badge
                          </span>
                        )}
                        {channelDetails.importantConvo && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            Important Conversation
                          </span>
                        )}
                      </div>

                      {/* Basic Information */}
                      <div>
                        <h3 className="text-sm font-medium mb-3">Basic Information</h3>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="font-medium">Package:</span>
                            <p className="font-mono text-muted-foreground break-all">{channelDetails.packageName}</p>
                          </div>
                          <div>
                            <span className="font-medium">Channel ID:</span>
                            <p className="font-mono text-muted-foreground">{channelDetails.id}</p>
                          </div>
                          <div>
                            <span className="font-medium">Name:</span>
                            <p className="text-muted-foreground">{channelDetails.name}</p>
                          </div>
                          <div>
                            <span className="font-medium">Importance:</span>
                            <p className="text-muted-foreground">{formatImportance(channelDetails.importance)}</p>
                          </div>
                          <div>
                            <span className="font-medium">UID:</span>
                            <p className="font-mono text-muted-foreground">{channelDetails.uid}</p>
                          </div>
                          <div>
                            <span className="font-medium">Lockscreen Visibility:</span>
                            <p className="text-muted-foreground">{formatLockscreenVisibility(channelDetails.lockscreenVisibility)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {channelDetails.description && (
                        <div>
                          <h3 className="text-sm font-medium mb-3">Description</h3>
                          <p className="text-xs text-muted-foreground">{channelDetails.description}</p>
                        </div>
                      )}

                      {/* Behavior Settings */}
                      <div>
                        <h3 className="text-sm font-medium mb-3">Behavior Settings</h3>
                        <div className="space-y-3 text-xs">
                          <div className="flex items-center space-x-2">
                            <Volume2 className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">Sound:</span>
                            <p className="font-mono text-muted-foreground">{channelDetails.sound}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Vibrate className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">Vibration:</span>
                            <p className="text-muted-foreground">
                              {channelDetails.vibrationEnabled ? 'Enabled' : 'Disabled'}
                              {channelDetails.vibrationPattern && ` (${channelDetails.vibrationPattern})`}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Lightbulb className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">Lights:</span>
                            <p className="text-muted-foreground">
                              {channelDetails.lights ? 'Enabled' : 'Disabled'}
                              {channelDetails.lights && channelDetails.lightColor > 0 && (
                                <span className="ml-2 flex items-center space-x-1">
                                  <span>Color:</span>
                                  <div 
                                    className="w-3 h-3 border border-border rounded"
                                    style={{ backgroundColor: `#${channelDetails.lightColor.toString(16).padStart(6, '0')}` }}
                                  ></div>
                                  <span className="font-mono">#{channelDetails.lightColor.toString(16).padStart(6, '0')}</span>
                                </span>
                              )}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">Bypass Do Not Disturb:</span>
                            <p className="text-muted-foreground">{channelDetails.bypassDnd ? 'Yes' : 'No'}</p>
                          </div>
                          <div>
                            <span className="font-medium">Show Badge:</span>
                            <p className="text-muted-foreground">{channelDetails.showBadge ? 'Yes' : 'No'}</p>
                          </div>
                          <div>
                            <span className="font-medium">Allow Bubbles:</span>
                            <p className="text-muted-foreground">{formatAllowBubbles(channelDetails.allowBubbles)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Group Information */}
                      {channelDetails.group && (
                        <div>
                          <h3 className="text-sm font-medium mb-3">Group Information</h3>
                          <div className="space-y-2 text-xs">
                            <div>
                              <span className="font-medium">Group:</span>
                              <p className="font-mono text-muted-foreground">{channelDetails.group}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Conversation Information */}
                      {(channelDetails.conversationId || channelDetails.importantConvo || channelDetails.demoted) && (
                        <div>
                          <h3 className="text-sm font-medium mb-3">Conversation Information</h3>
                          <div className="space-y-2 text-xs">
                            {channelDetails.conversationId && (
                              <div>
                                <span className="font-medium">Conversation ID:</span>
                                <p className="font-mono text-muted-foreground">{channelDetails.conversationId}</p>
                              </div>
                            )}
                            <div>
                              <span className="font-medium">Important Conversation:</span>
                              <p className="text-muted-foreground">{channelDetails.importantConvo ? 'Yes' : 'No'}</p>
                            </div>
                            <div>
                              <span className="font-medium">Demoted:</span>
                              <p className="text-muted-foreground">{channelDetails.demoted ? 'Yes' : 'No'}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* System Information */}
                      <div>
                        <h3 className="text-sm font-medium mb-3">System Information</h3>
                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="font-medium">Blockable System:</span>
                            <p className="text-muted-foreground">{channelDetails.blockableSystem ? 'Yes' : 'No'}</p>
                          </div>
                          <div>
                            <span className="font-medium">Importance Locked:</span>
                            <p className="text-muted-foreground">{channelDetails.importanceLockedDefaultApp ? 'Yes' : 'No'}</p>
                          </div>
                          <div>
                            <span className="font-medium">Original Importance:</span>
                            <p className="text-muted-foreground">{formatImportance(channelDetails.originalImp)}</p>
                          </div>
                          <div>
                            <span className="font-medium">User Locked Fields:</span>
                            <p className="font-mono text-muted-foreground">{channelDetails.userLockedFields}</p>
                          </div>
                          <div>
                            <span className="font-medium">User Visible Task Shown:</span>
                            <p className="text-muted-foreground">{channelDetails.userVisibleTaskShown ? 'Yes' : 'No'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Timing Information */}
                      <div>
                        <h3 className="text-sm font-medium mb-3">Timing Information</h3>
                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="font-medium">Last Notification Update:</span>
                            <p className="text-muted-foreground">{formatTimestamp(channelDetails.lastNotificationUpdateTimeMs)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="raw" className="mt-0 p-4">
                    <pre className="text-xs font-mono whitespace-pre-wrap bg-muted/50 p-3 rounded border">
                      {rawData}
                    </pre>
                  </TabsContent>
                </div>
              </Tabs>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">No details available</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-muted-foreground">Select a notification channel to view details</p>
        </div>
      )}
    </div>

    {/* Error Dialog */}
    <Dialog open={!!settingsError} onOpenChange={closeErrorDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Settings Error
          </DialogTitle>
          <DialogDescription>
            {settingsError}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={closeErrorDialog}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
  );
};
