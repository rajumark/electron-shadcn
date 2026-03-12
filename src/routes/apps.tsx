import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

function AppsPage() {
  const { t } = useTranslation();
  const [leftWidth, setLeftWidth] = useState(30);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!(isDragging && containerRef.current)) {
        return;
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      if (newLeftWidth >= 20 && newLeftWidth <= 50) {
        setLeftWidth(newLeftWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

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
  }, [isDragging]);

  return (
    <div className="mb-2 flex min-h-full">
      <div className="relative flex flex-1" ref={containerRef}>
        {/* Left Section */}
        <div
          className="mr-0 mb-2 ml-2 min-h-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          style={{ width: `${leftWidth}%` }}
        >
          <h2 className="mb-2 font-semibold text-lg">Left Section</h2>
          <p className="text-muted-foreground text-sm">
            This is the left panel taking {Math.round(leftWidth)}% of the space.
            You can resize it by dragging the divider.
          </p>
        </div>

        {/* Resizable Divider */}
        <div
          className="group relative w-2 cursor-col-resize transition-all hover:w-2"
          onMouseDown={() => setIsDragging(true)}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`h-8 w-1 rounded-full bg-gray-400 opacity-0 transition-opacity group-hover:opacity-60 ${isDragging ? "opacity-100" : ""}`}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="mr-2 mb-2 ml-0 min-h-full flex-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-2 font-semibold text-lg">Right Section</h2>
          <p className="text-muted-foreground text-sm">
            This is the right panel taking {Math.round(100 - leftWidth)}% of the
            space. You can resize it by dragging the divider.
          </p>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/apps")({
  component: AppsPage,
});
