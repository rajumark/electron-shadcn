import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import React, { useMemo, useCallback, forwardRef } from "react";

interface PackageListProps {
  packages: string[];
  selectedPackage: string;
  onPackageClick: (pkg: string) => void;
  onContextMenuAction: (action: string, pkg: string) => void;
  pinnedPackages: string[];
}

const ITEM_HEIGHT = 28; // Height of each package item
const VISIBLE_ITEMS = 50; // Number of items to render at once
const BUFFER_SIZE = 10; // Extra items above/below visible area

const PackageListHeader = ({ title }: { title: string }) => (
  <div className="sticky top-0 z-10 bg-background border-b border-border/50 px-2 py-1">
    <span className="text-xs font-medium text-muted-foreground">{title}</span>
  </div>
);

const PackageListItem = React.memo(({ pkg, isSelected, onClick, onContextMenuAction, isPinned }: {
  pkg: string;
  isSelected: boolean;
  onClick: () => void;
  onContextMenuAction: (action: string, pkg: string) => void;
  isPinned: boolean;
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
      <ContextMenuItem onClick={() => onContextMenuAction("start", pkg)}>
        Start
      </ContextMenuItem>
      <ContextMenuItem onClick={() => onContextMenuAction("force_stop", pkg)}>
        Force Stop
      </ContextMenuItem>
      <ContextMenuItem onClick={() => onContextMenuAction("restart", pkg)}>
        Restart
      </ContextMenuItem>
      <ContextMenuItem onClick={() => onContextMenuAction("clear_data", pkg)}>
        Clear Data
      </ContextMenuItem>
      <ContextMenuItem onClick={() => onContextMenuAction("uninstall", pkg)}>
        Uninstall
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={() => onContextMenuAction("search_here", pkg)}>
        Search here
      </ContextMenuItem>
      <ContextMenuItem onClick={() => onContextMenuAction("copy", pkg)}>
        Copy
      </ContextMenuItem>
      <ContextMenuItem onClick={() => onContextMenuAction("home", pkg)}>
        Home
      </ContextMenuItem>
      <ContextMenuItem onClick={() => onContextMenuAction("permissions", pkg)}>
        Permissions
      </ContextMenuItem>
      <ContextMenuItem onClick={() => onContextMenuAction("app_info", pkg)}>
        App Info
      </ContextMenuItem>
      <ContextMenuItem onClick={() => onContextMenuAction("enable", pkg)}>
        Enable
      </ContextMenuItem>
      <ContextMenuItem onClick={() => onContextMenuAction("disable", pkg)}>
        Disable
      </ContextMenuItem>
      <ContextMenuItem onClick={() => onContextMenuAction("full_details", pkg)}>
        Full Details
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={() => onContextMenuAction("open_in_playstore_app", pkg)}>
        Open in Playstore app
      </ContextMenuItem>
      <ContextMenuItem onClick={() => onContextMenuAction("open_in_playstore_site", pkg)}>
        View in Playstore site
      </ContextMenuItem>
      <ContextMenuItem onClick={() => onContextMenuAction("find_apk_online", pkg)}>
        Find APK Online
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={() => onContextMenuAction("pin_app", pkg)}>
        {isPinned ? "Unpin app" : "Pin app"}
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
));

PackageListItem.displayName = "PackageListItem";

export const PackageList = React.memo(forwardRef<HTMLDivElement, PackageListProps>(function PackageList({ packages, selectedPackage, onPackageClick, onContextMenuAction, pinnedPackages }: PackageListProps, ref) {
  const [scrollTop, setScrollTop] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Use forwarded ref or local ref
  React.useImperativeHandle(ref, () => containerRef.current!);

  // Separate pinned and unpinned packages with memoization
  const { pinnedItems, unpinnedItems } = useMemo(() => {
    const pinned = packages.filter(pkg => pinnedPackages.includes(pkg));
    const unpinned = packages.filter(pkg => !pinnedPackages.includes(pkg));
    return { pinnedItems: pinned, unpinnedItems: unpinned };
  }, [packages, pinnedPackages]);

  // Combine items with headers for virtualization
  const allItems = useMemo(() => {
    const items: Array<{ type: 'header' | 'item'; data?: string; title?: string }> = [];
    
    if (pinnedItems.length > 0) {
      items.push({ type: 'header', title: 'Pinned Apps' });
      items.push(...pinnedItems.map(pkg => ({ type: 'item' as const, data: pkg })));
    }
    
    if (unpinnedItems.length > 0) {
      if (pinnedItems.length > 0) {
        items.push({ type: 'header', title: 'All Apps' });
      }
      items.push(...unpinnedItems.map(pkg => ({ type: 'item' as const, data: pkg })));
    }
    
    return items;
  }, [pinnedItems, unpinnedItems]);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER_SIZE);
    const endIndex = Math.min(
      allItems.length,
      startIndex + VISIBLE_ITEMS + BUFFER_SIZE * 2
    );
    return { startIndex, endIndex };
  }, [scrollTop, allItems.length]);

  // Handle scroll events
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Render only visible items
  const visibleItems = useMemo(() => {
    return allItems.slice(visibleRange.startIndex, visibleRange.endIndex).map((item, index) => {
      const actualIndex = visibleRange.startIndex + index;
      
      if (item.type === 'header') {
        return (
          <PackageListHeader 
            key={`header-${actualIndex}`} 
            title={item.title!} 
          />
        );
      }
      
      return (
        <PackageListItem
          key={item.data}
          pkg={item.data!}
          isSelected={selectedPackage === item.data}
          onClick={() => onPackageClick(item.data!)}
          onContextMenuAction={onContextMenuAction}
          isPinned={pinnedPackages.includes(item.data!)}
        />
      );
    });
  }, [allItems, visibleRange, selectedPackage, onPackageClick, onContextMenuAction]);

  const totalHeight = allItems.length * ITEM_HEIGHT;
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
}));

PackageList.displayName = "PackageList";
