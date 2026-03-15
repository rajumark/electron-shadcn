import { useState, useEffect } from "react";
import { Copy, RefreshCw } from "lucide-react";
import { ipc } from "@/ipc/manager";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface NotificationRecordDetails {
  key: string;
  pkg: string;
  user: string;
  id: string;
  tag: string | null;
  importance: number;
  channel: string;
  flags: string[];
  visibility: string;
  uid: number;
  userId: number;
  opPkg: string;
  postTime: number;
  title?: string;
  text?: string;
  subText?: string;
  largeIcon?: string;
  smallIcon?: string;
  sound?: string;
  vibrate?: string;
  defaults?: number;
  color?: string;
  groupKey?: string;
  sortKey?: string;
  actions?: number;
  category?: string;
  flagsRaw?: string;
  visibilityRaw?: string;
  priority?: string;
  when?: number;
  createTime?: number;
  updateTime?: number;
  ledARGB?: number;
  ledOnMS?: number;
  ledOffMS?: number;
  iconRes?: string;
  contentView?: string;
  contentViewString?: string;
  defaultsString?: string;
  flagsString?: string;
  fullNotificationString?: string;
}

interface NotificationRecordRightSideProps {
  selectedNotificationRecord: string;
}

export const NotificationRecordRightSide: React.FC<NotificationRecordRightSideProps> = ({
  selectedNotificationRecord,
}) => {
  const [recordDetails, setRecordDetails] = useState<NotificationRecordDetails | null>(null);
  const [rawData, setRawData] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const { selectedDevice } = useSelectedDevice();

  // Parse notification record details from dumpsys output
  const parseNotificationRecordDetails = (output: string, targetKey: string): NotificationRecordDetails | null => {
    const lines = output.split('\n');
    let recordStartIndex = -1;
    
    // Find the start of the target notification record
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(`key=${targetKey}:`)) {
        recordStartIndex = i;
        break;
      }
    }
    
    if (recordStartIndex === -1) {
      return null;
    }
    
    const details: Partial<NotificationRecordDetails> = {
      key: targetKey,
    };
    
    // Parse the record and following lines
    for (let i = recordStartIndex; i < Math.min(recordStartIndex + 100, lines.length); i++) {
      const line = lines[i];
      
      // Parse main notification record line
      const recordMatch = line.match(/NotificationRecord\([^:]+: pkg=([^ ]+) user=([^ ]+) id=([^ ]+) tag=([^ ]+) importance=(\d+) key=([^:]+): Notification\(channel=([^ ]+) ([^)]+)\)/);
      if (recordMatch) {
        details.pkg = recordMatch[1];
        details.user = recordMatch[2];
        details.id = recordMatch[3];
        details.tag = recordMatch[4] === "null" ? null : recordMatch[4];
        details.importance = parseInt(recordMatch[5]);
        details.channel = recordMatch[7];
        details.fullNotificationString = recordMatch[0];
      }
      
      // Parse notification properties
      const shortcutMatch = line.match(/shortcut=([^ ]+)/);
      if (shortcutMatch) details.shortcut = shortcutMatch[1];
      
      const contentViewMatch = line.match(/contentView=([^ ]+)/);
      if (contentViewMatch) details.contentView = contentViewMatch[1];
      
      const vibrateMatch = line.match(/vibrate=([^ ]+)/);
      if (vibrateMatch) details.vibrate = vibrateMatch[1];
      
      const soundMatch = line.match(/sound=([^ ]+)/);
      if (soundMatch) details.sound = soundMatch[1];
      
      const defaultsMatch = line.match(/defaults=(\d+)/);
      if (defaultsMatch) details.defaults = parseInt(defaultsMatch[1]);
      
      const flagsMatch = line.match(/flags=([^ ]+)/);
      if (flagsMatch) details.flagsRaw = flagsMatch[1];
      
      const colorMatch = line.match(/color=(0x[0-9a-fA-F]+)/);
      if (colorMatch) details.color = colorMatch[1];
      
      const visMatch = line.match(/vis=([^ ]+)/);
      if (visMatch) details.visibilityRaw = visMatch[1];
      
      const groupKeyMatch = line.match(/groupKey=([^ ]+)/);
      if (groupKeyMatch) details.groupKey = groupKeyMatch[1];
      
      const sortKeyMatch = line.match(/sortKey=([^ ]+)/);
      if (sortKeyMatch) details.sortKey = sortKeyMatch[1];
      
      const actionsMatch = line.match(/actions=(\d+)/);
      if (actionsMatch) details.actions = parseInt(actionsMatch[1]);
      
      const categoryMatch = line.match(/category=([^ ]+)/);
      if (categoryMatch) details.category = categoryMatch[1];
      
      const priorityMatch = line.match(/priority=(\d+)/);
      if (priorityMatch) details.priority = priorityMatch[1];
      
      const whenMatch = line.match(/when=(\d+)/);
      if (whenMatch) details.when = parseInt(whenMatch[1]);
      
      const createTimeMatch = line.match(/creationTime=(\d+)/);
      if (createTimeMatch) details.createTime = parseInt(createTimeMatch[1]);
      
      const updateTimeMatch = line.match(/updateTime=(\d+)/);
      if (updateTimeMatch) details.updateTime = parseInt(updateTimeMatch[1]);
      
      // Parse uid, opPkg, postTime from subsequent lines
      const uidMatch = line.match(/uid=(\d+)/);
      if (uidMatch) details.uid = parseInt(uidMatch[1]);
      
      const opPkgMatch = line.match(/opPkg=(.+)/);
      if (opPkgMatch) details.opPkg = opPkgMatch[1];
      
      const postTimeMatch = line.match(/postTime=(\d+)/);
      if (postTimeMatch) details.postTime = parseInt(postTimeMatch[1]);
      
      // Parse notification content
      const titleMatch = line.match(/title=([^=\s]+)/);
      if (titleMatch) details.title = titleMatch[1];
      
      const textMatch = line.match(/text=([^=\s]+)/);
      if (textMatch) details.text = textMatch[1];
      
      const subTextMatch = line.match(/subText=([^=\s]+)/);
      if (subTextMatch) details.subText = subTextMatch[1];
      
      const largeIconMatch = line.match(/largeIcon=([^=\s]+)/);
      if (largeIconMatch) details.largeIcon = largeIconMatch[1];
      
      const smallIconMatch = line.match(/smallIcon=([^=\s]+)/);
      if (smallIconMatch) details.smallIcon = smallIconMatch[1];
      
      const ledARGBMatch = line.match(/ledARGB=(0x[0-9a-fA-F]+)/);
      if (ledARGBMatch) details.ledARGB = parseInt(ledARGBMatch[1]);
      
      const ledOnMSMatch = line.match(/ledOnMS=(\d+)/);
      if (ledOnMSMatch) details.ledOnMS = parseInt(ledOnMSMatch[1]);
      
      const ledOffMSMatch = line.match(/ledOffMS=(\d+)/);
      if (ledOffMSMatch) details.ledOffMS = parseInt(ledOffMSMatch[1]);
      
      const iconResMatch = line.match(/icon=Icon\(typ=RESOURCE pkg=([^ ]+) id=([^)]+)\)/);
      if (iconResMatch) details.iconRes = `${iconResMatch[1]}:${iconResMatch[2]}`;
      
      // Stop parsing when we hit the next record
      if (i > recordStartIndex && line.includes("NotificationRecord(") && !line.includes(targetKey)) {
        break;
      }
    }
    
    return details as NotificationRecordDetails;
  };

  // Fetch notification record details
  useEffect(() => {
    if (!selectedNotificationRecord || !selectedDevice || !selectedDevice.id?.trim()) {
      setRecordDetails(null);
      setRawData("");
      return;
    }

    const fetchRecordDetails = async () => {
      setLoading(true);
      setError("");

      try {
        const output = await ipc.client.adb.executeCommand({
          deviceId: selectedDevice.id,
          command: "dumpsys notification",
        });

        const details = parseNotificationRecordDetails(output, selectedNotificationRecord);
        
        if (details) {
          setRecordDetails(details);
          
          // Extract relevant raw data for this record
          const lines = output.split('\n');
          let recordStartIndex = -1;
          let recordEndIndex = -1;
          
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(`key=${selectedNotificationRecord}:`)) {
              recordStartIndex = i;
            }
            if (recordStartIndex !== -1 && i > recordStartIndex && lines[i].includes("NotificationRecord(")) {
              recordEndIndex = i;
              break;
            }
          }
          
          if (recordStartIndex !== -1) {
            const recordLines = lines.slice(recordStartIndex, recordEndIndex !== -1 ? recordEndIndex : recordStartIndex + 80);
            setRawData(recordLines.join('\n'));
          }
        } else {
          setError("Notification record not found");
        }
      } catch (error) {
        console.error("Failed to fetch notification record details:", error);
        setError(
          `Failed to fetch notification record details: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        );
        setRecordDetails(null);
        setRawData("");
      } finally {
        setLoading(false);
      }
    };

    fetchRecordDetails();
  }, [selectedNotificationRecord, selectedDevice, refreshKey]);

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

  const formatFlags = (flagsRaw?: string) => {
    if (!flagsRaw) return "N/A";
    
    const flagMap: { [key: string]: string } = {
      "AUTO_CANCEL": "Auto Cancel",
      "ONGOING_EVENT": "Ongoing",
      "NO_CLEAR": "No Clear",
      "GROUP_SUMMARY": "Group Summary",
      "ONLY_ALERT_ONCE": "Alert Once",
      "CAN_COLORIZE": "Can Colorize",
      "FOREGROUND_SERVICE": "Foreground Service",
    };
    
    return flagsRaw.split('|').map(flag => flagMap[flag] || flag).join(', ');
  };

  const formatVisibility = (visibilityRaw?: string) => {
    if (!visibilityRaw) return "N/A";
    
    const visibilityMap: { [key: string]: string } = {
      "PRIVATE": "Private",
      "PUBLIC": "Public",
      "SECRET": "Secret",
    };
    
    return visibilityMap[visibilityRaw] || visibilityRaw;
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

  return (
    <div className="mr-2 mb-2 ml-0 min-h-full flex-1 min-w-0">
      {selectedNotificationRecord ? (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 pb-2 border-b border-border">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground font-mono break-all">
                {selectedNotificationRecord}
              </p>
              <div className="flex items-center space-x-2">
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
                  <p className="text-xs text-muted-foreground mt-2">Loading notification details...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </div>
            ) : recordDetails ? (
              <Tabs defaultValue="details" className="h-full flex flex-col">
                <TabsList variant="line" className="mx-4 mt-0">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="raw">Raw Data</TabsTrigger>
                </TabsList>
                
                <div className="flex-1 overflow-auto">
                  <TabsContent value="details" className="mt-0 p-4">
                    <div className="space-y-6">
                      {/* Basic Information */}
                      <div>
                        <h3 className="text-sm font-medium mb-3">Basic Information</h3>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="font-medium">Package:</span>
                            <p className="font-mono text-muted-foreground break-all">{recordDetails.pkg}</p>
                          </div>
                          <div>
                            <span className="font-medium">Channel:</span>
                            <p className="font-mono text-muted-foreground">{recordDetails.channel}</p>
                          </div>
                          <div>
                            <span className="font-medium">ID:</span>
                            <p className="font-mono text-muted-foreground">{recordDetails.id}</p>
                          </div>
                          <div>
                            <span className="font-medium">Tag:</span>
                            <p className="font-mono text-muted-foreground">{recordDetails.tag || "N/A"}</p>
                          </div>
                          <div>
                            <span className="font-medium">Importance:</span>
                            <p className="text-muted-foreground">{formatImportance(recordDetails.importance)}</p>
                          </div>
                          <div>
                            <span className="font-medium">Visibility:</span>
                            <p className="text-muted-foreground">{formatVisibility(recordDetails.visibilityRaw)}</p>
                          </div>
                          <div>
                            <span className="font-medium">UID:</span>
                            <p className="font-mono text-muted-foreground">{recordDetails.uid}</p>
                          </div>
                          <div>
                            <span className="font-medium">User ID:</span>
                            <p className="font-mono text-muted-foreground">{recordDetails.userId}</p>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className="text-sm font-medium mb-3">Content</h3>
                        <div className="space-y-2 text-xs">
                          {recordDetails.title && (
                            <div>
                              <span className="font-medium">Title:</span>
                              <p className="text-muted-foreground">{recordDetails.title}</p>
                            </div>
                          )}
                          {recordDetails.text && (
                            <div>
                              <span className="font-medium">Text:</span>
                              <p className="text-muted-foreground">{recordDetails.text}</p>
                            </div>
                          )}
                          {recordDetails.subText && (
                            <div>
                              <span className="font-medium">Sub Text:</span>
                              <p className="text-muted-foreground">{recordDetails.subText}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Behavior */}
                      <div>
                        <h3 className="text-sm font-medium mb-3">Behavior</h3>
                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="font-medium">Flags:</span>
                            <p className="text-muted-foreground">{formatFlags(recordDetails.flagsRaw)}</p>
                          </div>
                          {recordDetails.sound && (
                            <div>
                              <span className="font-medium">Sound:</span>
                              <p className="font-mono text-muted-foreground">{recordDetails.sound}</p>
                            </div>
                          )}
                          {recordDetails.vibrate && (
                            <div>
                              <span className="font-medium">Vibration:</span>
                              <p className="font-mono text-muted-foreground">{recordDetails.vibrate}</p>
                            </div>
                          )}
                          {recordDetails.color && (
                            <div>
                              <span className="font-medium">Color:</span>
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-4 h-4 border border-border rounded"
                                  style={{ backgroundColor: recordDetails.color }}
                                ></div>
                                <span className="font-mono text-muted-foreground">{recordDetails.color}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Timing */}
                      <div>
                        <h3 className="text-sm font-medium mb-3">Timing</h3>
                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="font-medium">Posted:</span>
                            <p className="text-muted-foreground">{formatTimestamp(recordDetails.postTime)}</p>
                          </div>
                          {recordDetails.when && (
                            <div>
                              <span className="font-medium">When:</span>
                              <p className="text-muted-foreground">{formatTimestamp(recordDetails.when)}</p>
                            </div>
                          )}
                          {recordDetails.createTime && (
                            <div>
                              <span className="font-medium">Created:</span>
                              <p className="text-muted-foreground">{formatTimestamp(recordDetails.createTime)}</p>
                            </div>
                          )}
                          {recordDetails.updateTime && (
                            <div>
                              <span className="font-medium">Updated:</span>
                              <p className="text-muted-foreground">{formatTimestamp(recordDetails.updateTime)}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* System Information */}
                      <div>
                        <h3 className="text-sm font-medium mb-3">System Information</h3>
                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="font-medium">Operator Package:</span>
                            <p className="font-mono text-muted-foreground">{recordDetails.opPkg}</p>
                          </div>
                          {recordDetails.groupKey && (
                            <div>
                              <span className="font-medium">Group Key:</span>
                              <p className="font-mono text-muted-foreground">{recordDetails.groupKey}</p>
                            </div>
                          )}
                          {recordDetails.sortKey && (
                            <div>
                              <span className="font-medium">Sort Key:</span>
                              <p className="font-mono text-muted-foreground">{recordDetails.sortKey}</p>
                            </div>
                          )}
                          {recordDetails.category && (
                            <div>
                              <span className="font-medium">Category:</span>
                              <p className="font-mono text-muted-foreground">{recordDetails.category}</p>
                            </div>
                          )}
                          {recordDetails.iconRes && (
                            <div>
                              <span className="font-medium">Icon:</span>
                              <p className="font-mono text-muted-foreground">{recordDetails.iconRes}</p>
                            </div>
                          )}
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
          <p className="text-sm text-muted-foreground">Select a notification record to view details</p>
        </div>
      )}
    </div>
  );
};
