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
    <>
      <DragWindowRegion title="Pilotfish" />
      <MenubarDemo />
      <SimpleDeviceList />
      <main className="h-screen">{children}</main>
    </>
  );
}
