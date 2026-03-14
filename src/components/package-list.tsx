import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import React, { useMemo, useCallback } from "react";

interface PackageListProps {
  packages: string[];
  selectedPackage: string;
  onPackageClick: (pkg: string) => void;
  onContextMenuAction: (action: string, pkg: string) => void;
}

const ITEM_HEIGHT = 28; // Height of each package item
const VISIBLE_ITEMS = 50; // Number of items to render at once
const BUFFER_SIZE = 10; // Extra items above/below visible area

const PackageListItem = React.memo(({ pkg, isSelected, onClick, onContextMenuAction }: {
  pkg: string;
  isSelected: boolean;
  onClick: () => void;
  onContextMenuAction: (action: string, pkg: string) => void;
}) => (
  <ContextMenu>
    <ContextMenuTrigger asChild>
      <div
        onClick={onClick}
        className={`p-2 text-xs cursor-pointer truncate border-b border-border/50 last:border-b-0 font-mono ${
          isSelected
            ? "bg-primary text-primary-foreground"
            : "bg-background hover:bg-muted"
        }`}
        style={{ 
          height: `${ITEM_HEIGHT}px`,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace"
        }}
        title={pkg}
      >
        {pkg}
      </div>
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem onClick={() => onContextMenuAction("open", pkg)}>
        Open
      </ContextMenuItem>
      <ContextMenuItem onClick={() => onContextMenuAction("force_stop", pkg)}>
        Force stop
      </ContextMenuItem>
      <ContextMenuItem onClick={() => onContextMenuAction("restart", pkg)}>
        Restart
      </ContextMenuItem>
      <ContextMenuItem onClick={() => onContextMenuAction("clear_data", pkg)}>
        Clear data
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={() => onContextMenuAction("pin_app", pkg)}>
        Pin app
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
));

PackageListItem.displayName = "PackageListItem";

export const PackageList = React.memo(function PackageList({ packages, selectedPackage, onPackageClick, onContextMenuAction }: PackageListProps) {
  const [scrollTop, setScrollTop] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER_SIZE);
    const endIndex = Math.min(
      packages.length,
      startIndex + VISIBLE_ITEMS + BUFFER_SIZE * 2
    );
    return { startIndex, endIndex };
  }, [scrollTop, packages.length]);

  // Handle scroll events
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Render only visible items
  const visibleItems = useMemo(() => {
    return packages.slice(visibleRange.startIndex, visibleRange.endIndex).map((pkg, index) => {
      const actualIndex = visibleRange.startIndex + index;
      return (
        <PackageListItem
          key={pkg}
          pkg={pkg}
          isSelected={selectedPackage === pkg}
          onClick={() => onPackageClick(pkg)}
          onContextMenuAction={onContextMenuAction}
        />
      );
    });
  }, [packages, visibleRange, selectedPackage, onPackageClick, onContextMenuAction]);

  const totalHeight = packages.length * ITEM_HEIGHT;
  const offsetY = visibleRange.startIndex * ITEM_HEIGHT;

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto bg-background"
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems}
        </div>
      </div>
    </div>
  );
});
