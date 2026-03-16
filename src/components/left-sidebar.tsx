import { useRouter } from "@tanstack/react-router";
import { Code, FileText, Home, Settings, Terminal, Eye, Phone, Users, MessageSquare, Image, Activity, Calendar, Info, Battery, Bell, Cpu, Folder } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { path: "/", label: "Home page", icon: Home },
  { path: "/second", label: "Second page", icon: FileText },
  { path: "/apps", label: "Apps", icon: Code },
  { path: "/settings", label: "Settings", icon: Settings },
  { path: "/terminal", label: "Terminal", icon: Terminal },
  { path: "/fordev", label: "ForDev", icon: Code },
  { path: "/uidemo", label: "UI Demo", icon: FileText },
  { path: "/ui-inspector", label: "UI Inspector", icon: Eye },
  { path: "/call-logs", label: "Call Logs", icon: Phone },
  { path: "/contacts", label: "Contacts", icon: Users },
  { path: "/messages", label: "Messages", icon: MessageSquare },
  { path: "/medias", label: "Medias", icon: Image },
  { path: "/lifecycle", label: "Lifecycle", icon: Activity },
  { path: "/calendar", label: "Calendar", icon: Calendar },
  { path: "/properties", label: "Properties", icon: Info },
  { path: "/batteries", label: "Batteries", icon: Battery },
  { path: "/notifications", label: "Notifications", icon: Bell },
  { path: "/cpu-usage", label: "CPU Usage", icon: Cpu },
  { path: "/file-explorer", label: "File Explorer", icon: Folder },
  { path: "/pilotfish-settings", label: "Pilotfish Settings", icon: Settings },
];

export function LeftSidebar() {
  const router = useRouter();
  const [currentRoute, setCurrentRoute] = useState("/");

  useEffect(() => {
    setCurrentRoute(router.state.location.pathname);
  }, [router.state.location.pathname]);

  const handleNavigation = (path: string) => {
    router.navigate({ to: path });
  };

  return (
    <div className="w-48 bg-background border-r border-border flex flex-col">
      <div className="p-2 flex-1 overflow-y-auto">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1.35 text-sm rounded-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "text-[rgba(0,0,0,0.8)]",
                  isActive && "bg-accent text-accent-foreground font-medium text-black"
                )}
              >
                <Icon className={cn(
                  "h-[14px] w-[14px] text-[rgba(0,0,0,0.7)]",
                  isActive && "text-black"
                )} />
                <span className="truncate text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
