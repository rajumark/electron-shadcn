import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NotificationChannelLeftSide } from "@/components/notification-channel-left";
import { NotificationChannelMiddleSide } from "@/components/notification-channel-middle";
import { NotificationChannelRightSide } from "@/components/notification-channel-right";
import { NotificationRecordLeftSide } from "@/components/notification-record-left";
import { NotificationRecordRightSide } from "@/components/notification-record-right";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { ipc } from "@/ipc/manager";

function NotificationsPage() {
  const { t } = useTranslation();
  const [leftWidth, setLeftWidth] = useState(30);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedNotificationRecord, setSelectedNotificationRecord] =
    useState("");
  const [selectedNotificationChannel, setSelectedNotificationChannel] =
    useState("");
  const { selectedDevice } = useSelectedDevice();
  const [selectedPackage, setSelectedPackage] = useState("");
  const [activeTab, setActiveTab] = useState("records");
  const [notificationChannels, setNotificationChannels] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!(isDragging && containerRef.current)) {
        return;
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      if (newLeftWidth >= 20 && newLeftWidth <= 80) {
        setLeftWidth(newLeftWidth);
      }
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
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
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Parse notification channels from dumpsys output
  const parseNotificationChannels = (output: string): any[] => {
    const lines = output.split("\n");
    const channels: any[] = [];
    let currentPackage = "";
    const channelMap = new Map<string, any>(); // Use Map to deduplicate by package:channelId

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Match AppSettings lines to get package and uid
      const appSettingsMatch = line.match(/AppSettings: ([^ ]+) \((\d+)\)/);
      if (appSettingsMatch) {
        currentPackage = appSettingsMatch[1];
        continue;
      }

      // Match NotificationChannel lines - more flexible regex
      const channelMatch = line.match(/NotificationChannel\{mId='([^']+)',/);
      if (channelMatch && currentPackage) {
        // Create unique key for deduplication
        const uniqueKey = `${currentPackage}:${channelMatch[1]}`;

        // Skip if we already have this channel
        if (channelMap.has(uniqueKey)) {
          continue;
        }

        // Extract all the channel properties in a more flexible way
        const channelLine = line;
        const channel: any = {
          packageName: currentPackage,
          id: channelMatch[1],
        };

        // Extract other properties with individual regex matches
        const nameMatch = channelLine.match(/mName=([^,]+)/);
        if (nameMatch) {
          channel.name = nameMatch[1].replace(/\.\.\./g, "");
        }

        const descMatch = channelLine.match(/mDescription=([^,]+)/);
        if (descMatch) {
          channel.description = descMatch[1] === "" ? undefined : descMatch[1];
        }

        const impMatch = channelLine.match(/mImportance=(\d+)/);
        if (impMatch) {
          channel.importance = Number.parseInt(impMatch[1]);
        }

        const bypassMatch = channelLine.match(/mBypassDnd=(true|false)/);
        if (bypassMatch) {
          channel.bypassDnd = bypassMatch[1] === "true";
        }

        const visibilityMatch = channelLine.match(
          /mLockscreenVisibility=(-?\d+)/
        );
        if (visibilityMatch) {
          channel.lockscreenVisibility = Number.parseInt(visibilityMatch[1]);
        }

        const soundMatch = channelLine.match(/mSound=([^,]+)/);
        if (soundMatch) {
          channel.sound = soundMatch[1];
        }

        const lightsMatch = channelLine.match(/mLights=(true|false)/);
        if (lightsMatch) {
          channel.lights = lightsMatch[1] === "true";
        }

        const lightColorMatch = channelLine.match(/mLightColor=(\d+)/);
        if (lightColorMatch) {
          channel.lightColor = Number.parseInt(lightColorMatch[1]);
        }

        const vibEnabledMatch = channelLine.match(
          /mVibrationEnabled=(true|false)/
        );
        if (vibEnabledMatch) {
          channel.vibrationEnabled = vibEnabledMatch[1] === "true";
        }

        const badgeMatch = channelLine.match(/mShowBadge=(true|false)/);
        if (badgeMatch) {
          channel.showBadge = badgeMatch[1] === "true";
        }

        const deletedMatch = channelLine.match(/mDeleted=(true|false)/);
        if (deletedMatch) {
          channel.deleted = deletedMatch[1] === "true";
        }

        const groupMatch = channelLine.match(/mGroup='([^']*)'/);
        if (groupMatch) {
          channel.group =
            groupMatch[1] === "null" || groupMatch[1] === ""
              ? undefined
              : groupMatch[1];
        }

        // Set defaults for other properties
        channel.vibrationPattern = undefined;
        channel.userLockedFields = 0;
        channel.userVisibleTaskShown = false;
        channel.blockableSystem = false;
        channel.allowBubbles = -1;
        channel.importanceLockedDefaultApp = false;
        channel.originalImp = channel.importance;
        channel.conversationId = undefined;
        channel.demoted = false;
        channel.importantConvo = false;
        channel.lastNotificationUpdateTimeMs = 0;

        // Add to map for deduplication
        channelMap.set(uniqueKey, channel);
      }
    }

    // Convert Map to array and return
    return Array.from(channelMap.values());
  };

  // Fetch notification channels when device is selected
  useEffect(() => {
    if (!(selectedDevice && selectedDevice.id?.trim())) {
      setNotificationChannels([]);
      return;
    }

    const fetchNotificationChannels = async () => {
      try {
        const output = await ipc.client.adb.executeCommand({
          deviceId: selectedDevice.id,
          command: "dumpsys notification",
        });

        const parsedChannels = parseNotificationChannels(output);
        setNotificationChannels(parsedChannels);
      } catch (error) {
        console.error("Failed to fetch notification channels:", error);
        setNotificationChannels([]);
      }
    };

    fetchNotificationChannels();
  }, [selectedDevice]);

  // Memoize channels to prevent unnecessary re-renders
  const memoizedChannels = useMemo(
    () => notificationChannels,
    [notificationChannels]
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-hidden">
        <Tabs
          className="flex h-full flex-col"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          <TabsList className="mx-4 mt-2" variant="line">
            <TabsTrigger value="records">Notification Records</TabsTrigger>
            <TabsTrigger value="channels">Notification Channels</TabsTrigger>
          </TabsList>

          <TabsContent className="mt-0 flex-1 overflow-hidden" value="records">
            <div className="flex h-full overflow-hidden">
              <div className="relative flex min-w-0 flex-1" ref={containerRef}>
                <NotificationRecordLeftSide
                  isDragging={isDragging}
                  leftWidth={leftWidth}
                  onDragStart={handleMouseDown}
                  onNotificationRecordSelect={setSelectedNotificationRecord}
                  selectedNotificationRecord={selectedNotificationRecord}
                />

                <div
                  className="relative cursor-col-resize bg-gray-300 transition-colors hover:bg-gray-400"
                  onMouseDown={handleMouseDown}
                  style={{ width: "0.5px" }}
                />

                <NotificationRecordRightSide
                  selectedNotificationRecord={selectedNotificationRecord}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent className="mt-0 flex-1 overflow-hidden" value="channels">
            <div className="flex h-full overflow-hidden">
              <div className="relative flex min-w-0 flex-1" ref={containerRef}>
                <NotificationChannelLeftSide
                  isDragging={isDragging}
                  leftWidth={leftWidth}
                  onDragStart={handleMouseDown}
                  onPackageSelect={setSelectedPackage}
                  selectedPackage={selectedPackage}
                />

                <div
                  className="relative cursor-col-resize bg-gray-300 transition-colors hover:bg-gray-400"
                  onMouseDown={handleMouseDown}
                  style={{ width: "0.5px" }}
                />

                <NotificationChannelMiddleSide
                  channels={memoizedChannels}
                  onNotificationChannelSelect={setSelectedNotificationChannel}
                  selectedNotificationChannel={selectedNotificationChannel}
                  selectedPackage={selectedPackage}
                />

                <div
                  className="relative cursor-col-resize bg-gray-300 transition-colors hover:bg-gray-400"
                  onMouseDown={handleMouseDown}
                  style={{ width: "0.5px" }}
                />

                <NotificationChannelRightSide
                  channels={memoizedChannels}
                  selectedNotificationChannel={selectedNotificationChannel}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/notifications")({
  component: NotificationsPage,
});
