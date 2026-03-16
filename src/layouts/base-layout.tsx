import type React from "react";
import DragWindowRegion from "@/components/drag-window-region";
import { MenubarDemo } from "@/components/menubar-demo";
import { RightSideQuickPanel } from "@/components/right-side-quick-panel";
import { SimpleDeviceList } from "@/components/simple-device-list";
import { LeftSidebar } from "@/components/left-sidebar";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <DragWindowRegion title="Pilotfish" />
      <MenubarDemo />
      <SimpleDeviceList />
      <div className="relative flex-1 overflow-hidden flex">
        <LeftSidebar />
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
