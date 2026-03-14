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
    <div className="h-screen flex flex-col overflow-hidden">
      <DragWindowRegion title="Pilotfish" />
      <MenubarDemo />
      <SimpleDeviceList />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
