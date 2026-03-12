import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";

function AppsPage() {
  const { t } = useTranslation();
  const [leftWidth, setLeftWidth] = useState(30);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      
      if (newLeftWidth >= 20 && newLeftWidth <= 50) {
        setLeftWidth(newLeftWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  return (
    <div className="flex min-h-full mb-2">
      <div 
        ref={containerRef}
        className="flex flex-1 relative"
      >
        {/* Left Section */}
        <div 
          className="p-4 rounded-lg bg-orange-100 shadow-sm border border-orange-200 ml-2 mr-0 mb-2 min-h-full"
          style={{ width: `${leftWidth}%` }}
        >
          <h2 className="text-lg font-semibold mb-2">Left Section</h2>
          <p className="text-sm text-muted-foreground">
            This is the left panel taking {Math.round(leftWidth)}% of the space. You can resize it by dragging the divider.
          </p>
        </div>
        
        {/* Resizable Divider */}
        <div 
          className="w-2 hover:w-2 transition-all cursor-col-resize relative group"
          onMouseDown={() => setIsDragging(true)}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-1 h-8 bg-gray-400 rounded-full transition-opacity opacity-0 group-hover:opacity-60 ${isDragging ? 'opacity-100' : ''}`} />
          </div>
        </div>
        
        {/* Right Section */}
        <div 
          className="flex-1 p-4 rounded-lg bg-blue-100 shadow-sm border border-blue-200 ml-0 mr-2 mb-2 min-h-full"
        >
          <h2 className="text-lg font-semibold mb-2">Right Section</h2>
          <p className="text-sm text-muted-foreground">
            This is the right panel taking {Math.round(100 - leftWidth)}% of the space. You can resize it by dragging the divider.
          </p>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/apps")({
  component: AppsPage,
});
