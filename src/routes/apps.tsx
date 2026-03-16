import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppsLeftSide } from "@/components/apps-left-side";
import { AppsRightSide } from "@/components/apps-right-side";

function AppsPage() {
  const { t } = useTranslation();
  const [leftWidth, setLeftWidth] = useState(30);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("");
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

  return (
    <div className="flex h-full overflow-hidden">
      <div className="relative flex min-w-0 flex-1" ref={containerRef}>
        {/* Left Section - Package List */}
        <AppsLeftSide
          isDragging={isDragging}
          leftWidth={leftWidth}
          onDragStart={handleMouseDown}
          onPackageSelect={setSelectedPackage}
          selectedPackage={selectedPackage}
        />

        {/* Resizable Divider */}
        <div
          className="relative cursor-col-resize bg-gray-300 transition-colors hover:bg-gray-400"
          onMouseDown={handleMouseDown}
          style={{ width: "0.5px" }}
        />

        {/* Right Section - App Details */}
        <AppsRightSide selectedPackage={selectedPackage} />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/apps")({
  component: AppsPage,
});
