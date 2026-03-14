import type React from "react";
import DragWindowRegion from "@/components/drag-window-region";
import { MenubarDemo } from "@/components/menubar-demo";
import { SimpleDeviceList } from "@/components/simple-device-list";
import { RightSideQuickPanel } from "@/components/right-side-quick-panel";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      <DragWindowRegion title="Pilotfish" />
      <MenubarDemo />
      <SimpleDeviceList />
      <div className="flex-1 overflow-hidden relative">
        {children}
        {/* Right-side quick panel with minimal component */}
        <div className="absolute top-0 right-0 w-[30px] h-full z-50">
          <RightSideQuickPanel />
        </div>
      </div>
    </div>
  );
}
