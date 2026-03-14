import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import React from "react";

interface PackageListProps {
  packages: string[];
  selectedPackage: string;
  onPackageClick: (pkg: string) => void;
  onContextMenuAction: (action: string, pkg: string) => void;
}

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
        className={`p-2 text-xs font-mono cursor-pointer truncate border-b border-border/50 last:border-b-0 ${
          isSelected
            ? "bg-primary text-primary-foreground"
            : "bg-background hover:bg-muted"
        }`}
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
  return (
    <div className="h-full overflow-y-auto space-y-1 bg-background">
      {packages.map((pkg, index) => (
        <PackageListItem
          key={`${pkg}-${index}`}
          pkg={pkg}
          isSelected={selectedPackage === pkg}
          onClick={() => onPackageClick(pkg)}
          onContextMenuAction={onContextMenuAction}
        />
      ))}
    </div>
  );
});
