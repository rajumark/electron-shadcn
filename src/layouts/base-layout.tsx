import type React from "react";
import DragWindowRegion from "@/components/drag-window-region";
import { MenubarDemo } from "@/components/menubar-demo";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DragWindowRegion title="electron-shadcn" />
      <MenubarDemo />
      <main className="h-screen mb-2">{children}</main>
    </>
  );
}
