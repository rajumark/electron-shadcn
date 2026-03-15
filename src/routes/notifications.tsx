import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { NotificationRecordLeftSide } from "@/components/notification-record-left";
import { NotificationRecordRightSide } from "@/components/notification-record-right";
import { NotificationChannelLeftSide } from "@/components/notification-channel-left";
import { NotificationChannelRightSide } from "@/components/notification-channel-right";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

function NotificationsPage() {
  const { t } = useTranslation();
  const [leftWidth, setLeftWidth] = useState(30);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedNotificationRecord, setSelectedNotificationRecord] = useState("");
  const [selectedNotificationChannel, setSelectedNotificationChannel] = useState("");
  const [activeTab, setActiveTab] = useState("records");
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!(isDragging && containerRef.current)) {
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth =
      ((e.clientX - containerRect.left) / containerRect.width) * 100;

    if (newLeftWidth >= 20 && newLeftWidth <= 80) {
      setLeftWidth(newLeftWidth);
    }
  }, [isDragging]);

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

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList variant="line" className="mx-4 mt-2">
            <TabsTrigger value="records">Notification Records</TabsTrigger>
            <TabsTrigger value="channels">Notification Channels</TabsTrigger>
          </TabsList>
          
          <TabsContent value="records" className="flex-1 mt-0 overflow-hidden">
            <div className="flex h-full overflow-hidden">
              <div className="relative flex flex-1 min-w-0" ref={containerRef}>
                <NotificationRecordLeftSide
                  leftWidth={leftWidth}
                  selectedNotificationRecord={selectedNotificationRecord}
                  onNotificationRecordSelect={setSelectedNotificationRecord}
                  isDragging={isDragging}
                  onDragStart={handleMouseDown}
                />

                <div
                  className="relative cursor-col-resize bg-gray-300 hover:bg-gray-400 transition-colors"
                  style={{ width: '0.5px' }}
                  onMouseDown={handleMouseDown}
                />

                <NotificationRecordRightSide selectedNotificationRecord={selectedNotificationRecord} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="channels" className="flex-1 mt-0 overflow-hidden">
            <div className="flex h-full overflow-hidden">
              <div className="relative flex flex-1 min-w-0" ref={containerRef}>
                <NotificationChannelLeftSide
                  leftWidth={leftWidth}
                  selectedNotificationChannel={selectedNotificationChannel}
                  onNotificationChannelSelect={setSelectedNotificationChannel}
                  isDragging={isDragging}
                  onDragStart={handleMouseDown}
                />

                <div
                  className="relative cursor-col-resize bg-gray-300 hover:bg-gray-400 transition-colors"
                  style={{ width: '0.5px' }}
                  onMouseDown={handleMouseDown}
                />

                <NotificationChannelRightSide selectedNotificationChannel={selectedNotificationChannel} />
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
