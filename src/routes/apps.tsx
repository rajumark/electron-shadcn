import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
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
    <div className="flex h-full overflow-hidden">
      <div className="relative flex flex-1 min-w-0" ref={containerRef}>
        {/* Left Section - Package List */}
        <AppsLeftSide
          leftWidth={leftWidth}
          selectedPackage={selectedPackage}
          onPackageSelect={setSelectedPackage}
          isDragging={isDragging}
          onDragStart={handleMouseDown}
        />

        {/* Resizable Divider */}
        <div
          className="relative cursor-col-resize bg-gray-300 hover:bg-gray-400 transition-colors"
          style={{ width: '0.5px' }}
          onMouseDown={handleMouseDown}
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
