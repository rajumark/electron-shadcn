import type React from "react";
import { useState } from "react";
import { Menu } from "lucide-react";
import DragWindowRegion from "@/components/drag-window-region";
import { RightSideQuickPanel } from "@/components/right-side-quick-panel";
import { SimpleDeviceList } from "@/components/simple-device-list";
import { LeftSidebar } from "@/components/left-sidebar";
import { Button } from "@/components/ui/button";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <DragWindowRegion title="Pilotfish" />
      <div className="flex items-center gap-2 px-2 py-1 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-foreground">Pilotfish</span>
        </div>
        <SimpleDeviceList />
      </div>
      <div className="relative flex-1 overflow-hidden flex">
        {isSidebarVisible && <LeftSidebar />}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
        {/* Right-side quick panel with minimal component */}
        <div className="absolute top-0 right-0 z-50 h-full w-[30px]">
          <RightSideQuickPanel />
        </div>
      </div>
    </div>
  );
}
