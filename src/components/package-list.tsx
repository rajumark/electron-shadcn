import React, { forwardRef, useCallback, useMemo } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface PackageListProps {
  onContextMenuAction: (action: string, pkg: string) => void;
  onPackageClick: (pkg: string) => void;
  packages: string[];
  pinnedPackages: string[];
  selectedPackage: string;
  packageIcons?: Record<string, string>;
}

const ITEM_HEIGHT = 28; // Height of each package item
const VISIBLE_ITEMS = 50; // Number of items to render at once
const BUFFER_SIZE = 10; // Extra items above/below visible area

const PackageListHeader = ({ title }: { title: string }) => (
  <div className="sticky top-0 z-10 border-border/50 border-b bg-background px-2 py-1">
    <span className="font-medium text-muted-foreground text-xs">{title}</span>
  </div>
);

const PackageListItem = React.memo(
  ({
    pkg,
    isSelected,
    onClick,
    onContextMenuAction,
    isPinned,
    icon,
  }: {
    pkg: string;
    isSelected: boolean;
    onClick: () => void;
    onContextMenuAction: (action: string, pkg: string) => void;
    isPinned: boolean;
    icon?: string;
  }) => (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className={`cursor-pointer truncate border-border/50 border-b p-2 font-mono text-xs last:border-b-0 flex items-center gap-2 ${
            isSelected
              ? "bg-primary text-primary-foreground"
              : "bg-background hover:bg-muted"
          }`}
          onClick={onClick}
          style={{
            height: `${ITEM_HEIGHT}px`,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
          }}
          title={pkg}
        >
          {icon && (
            <img 
              src={icon} 
              alt="" 
              className="w-4 h-4 flex-shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <span className="truncate flex-1">{pkg}</span>
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
        <ContextMenuItem
          onClick={() => onContextMenuAction("search_here", pkg)}
        >
          Search here
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onContextMenuAction("copy", pkg)}>
          Copy
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onContextMenuAction("home", pkg)}>
          Home
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => onContextMenuAction("permissions", pkg)}
        >
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
        <ContextMenuItem
          onClick={() => onContextMenuAction("full_details", pkg)}
        >
          Full Details
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() => onContextMenuAction("open_in_playstore_app", pkg)}
        >
          Open in Playstore app
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => onContextMenuAction("open_in_playstore_site", pkg)}
        >
          View in Playstore site
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => onContextMenuAction("find_apk_online", pkg)}
        >
          Find APK Online
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onContextMenuAction("pin_app", pkg)}>
          {isPinned ? "Unpin app" : "Pin app"}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
);

PackageListItem.displayName = "PackageListItem";

export const PackageList = React.memo(
  forwardRef<HTMLDivElement, PackageListProps>(function PackageList(
    {
      packages,
      selectedPackage,
      onPackageClick,
      onContextMenuAction,
      pinnedPackages,
      packageIcons = {},
    }: PackageListProps,
    ref
  ) {
    const [scrollTop, setScrollTop] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Use forwarded ref or local ref
    React.useImperativeHandle(ref, () => containerRef.current!);

    // Separate pinned and unpinned packages with memoization
    const { pinnedItems, unpinnedItems } = useMemo(() => {
      const pinned = packages.filter((pkg) => pinnedPackages.includes(pkg));
      const unpinned = packages.filter((pkg) => !pinnedPackages.includes(pkg));
      return { pinnedItems: pinned, unpinnedItems: unpinned };
    }, [packages, pinnedPackages]);

    // Combine items with headers for virtualization
    const allItems = useMemo(() => {
      const items: Array<{
        type: "header" | "item";
        data?: string;
        title?: string;
      }> = [];

      if (pinnedItems.length > 0) {
        items.push({ type: "header", title: "Pinned Apps" });
        items.push(
          ...pinnedItems.map((pkg) => ({ type: "item" as const, data: pkg }))
        );
      }

      if (unpinnedItems.length > 0) {
        if (pinnedItems.length > 0) {
          items.push({ type: "header", title: "All Apps" });
        }
        items.push(
          ...unpinnedItems.map((pkg) => ({ type: "item" as const, data: pkg }))
        );
      }

      return items;
    }, [pinnedItems, unpinnedItems]);

    // Calculate visible range
    const visibleRange = useMemo(() => {
      const startIndex = Math.max(
        0,
        Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER_SIZE
      );
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
      return allItems
        .slice(visibleRange.startIndex, visibleRange.endIndex)
        .map((item, index) => {
          const actualIndex = visibleRange.startIndex + index;

          if (item.type === "header") {
            return (
              <PackageListHeader
                key={`header-${actualIndex}`}
                title={item.title!}
              />
            );
          }

          return (
            <PackageListItem
              isPinned={pinnedPackages.includes(item.data!)}
              isSelected={selectedPackage === item.data}
              key={item.data}
              onClick={() => onPackageClick(item.data!)}
              onContextMenuAction={onContextMenuAction}
              pkg={item.data!}
              icon={packageIcons[item.data!]}
            />
          );
        });
    }, [
      allItems,
      visibleRange,
      selectedPackage,
      onPackageClick,
      onContextMenuAction,
      packageIcons,
      pinnedPackages,
    ]);

    const totalHeight = allItems.length * ITEM_HEIGHT;
    const offsetY = visibleRange.startIndex * ITEM_HEIGHT;

    return (
      <div
        className="h-full overflow-y-auto bg-background"
        onScroll={handleScroll}
        ref={containerRef}
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleItems}
          </div>
        </div>
      </div>
    );
  })
);

PackageList.displayName = "PackageList";
