import type React from "react";
import DragWindowRegion from "@/components/drag-window-region";
import { MenubarDemo } from "@/components/menubar-demo";
import { SimpleDeviceList } from "@/components/simple-device-list";

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
        {/* Fixed 30px vertical bar at right edge - starts below menubar */}
        <div className="absolute top-0 right-0 w-[30px] h-full bg-orange-500 z-50" />
      </div>
    </div>
  );
}
