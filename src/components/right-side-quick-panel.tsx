import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { ipc } from "@/ipc/manager";
import {
  ArrowLeft,
  Home,
  Square,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Battery,
  Settings,
  Camera,
  Smartphone,
  Bell,
  ChevronDown,
  Unlock,
  User,
  Hand,
  Loader2,
} from "lucide-react";

export function RightSideQuickPanel() {
  const { selectedDevice } = useSelectedDevice();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const executeADBCommand = async (command: string, args: string[] = []) => {
    if (!selectedDevice?.id) {
      console.warn("No device selected");
      return;
    }

    setIsLoading(command);
    try {
      await ipc.client.adb.executeADBCommand({
        args: ["-s", selectedDevice.id, ...args],
        useCache: false,
      });
      console.log(`Successfully executed ${command}`);
    } catch (error) {
      console.error(`Failed to execute ${command}:`, error);
    } finally {
      setIsLoading(null);
    }
  };

  const handleBack = () =>
    executeADBCommand("back", ["shell", "input", "keyevent", "4"]);
  const handleHome = () =>
    executeADBCommand("home", ["shell", "input", "keyevent", "3"]);
  const handleRecent = () =>
    executeADBCommand("recent", ["shell", "input", "keyevent", "187"]);
  const handleVolumeUp = () =>
    executeADBCommand("volume_up", ["shell", "input", "keyevent", "24"]);
  const handleVolumeDown = () =>
    executeADBCommand("volume_down", ["shell", "input", "keyevent", "25"]);
  const handleVolumeMute = () =>
    executeADBCommand("volume_mute", ["shell", "input", "keyevent", "164"]);
  const handleSettings = () =>
    executeADBCommand("settings", [
      "shell",
      "am",
      "start",
      "-a",
      "android.settings.SETTINGS",
    ]);
  const handlePower = () =>
    executeADBCommand("power", ["shell", "input", "keyevent", "26"]);
  const handleScreenshot = async () => {
    if (!selectedDevice?.id) {
      return;
    }

    setIsLoading("screenshot");
    try {
      await ipc.client.adb.executeADBCommand({
        args: [
          "-s",
          selectedDevice.id,
          "shell",
          "screencap",
          "-p",
          "/sdcard/screenshot.png",
        ],
        useCache: false,
      });

      const desktop = `${process.env.HOME || process.env.USERPROFILE}/Desktop`;
      await ipc.client.adb.executeADBCommand({
        args: [
          "-s",
          selectedDevice.id,
          "pull",
          "/sdcard/screenshot.png",
          `${desktop}/screenshot-${Date.now()}.png`,
        ],
        useCache: false,
      });

      console.log("Screenshot saved to desktop");
    } catch (error) {
      console.error("Failed to take screenshot:", error);
    } finally {
      setIsLoading(null);
    }
  };
  const handleMediaPlay = () =>
    executeADBCommand("media_play", ["shell", "input", "keyevent", "126"]);
  const handleMediaPause = () =>
    executeADBCommand("media_pause", ["shell", "input", "keyevent", "127"]);
  const handleQuickSettings = () =>
    executeADBCommand("quick_settings", [
      "shell",
      "cmd",
      "statusbar",
      "expand-settings",
    ]);
  const handleNotifications = () =>
    executeADBCommand("notifications", [
      "shell",
      "cmd",
      "statusbar",
      "expand-notifications",
    ]);
  const handleCollapseAll = () =>
    executeADBCommand("collapse", ["shell", "cmd", "statusbar", "collapse"]);
  const handleUnlockMenu = () =>
    executeADBCommand("unlock_menu", ["shell", "input", "keyevent", "82"]);
  const handleDeveloperSettings = () =>
    executeADBCommand("developer_settings", [
      "shell",
      "am",
      "start",
      "-a",
      "com.android.settings.APPLICATION_DEVELOPMENT_SETTINGS",
    ]);
  const handleShowTaps = (show: boolean) =>
    executeADBCommand("show_taps", [
      "shell",
      "settings",
      "put",
      "system",
      "show_touches",
      show ? "1" : "0",
    ]);

  const IconButton = ({
    icon,
    tooltip,
    onClick,
    isLoading = false,
    disabled = !selectedDevice?.id,
  }: {
    icon: React.ReactNode;
    tooltip: string;
    onClick: () => void;
    isLoading?: boolean;
    disabled?: boolean;
  }) => (
    <Button
      className="h-8 w-full p-0 hover:bg-gray-200 disabled:opacity-50 dark:hover:bg-gray-700"
      disabled={disabled || isLoading}
      onClick={onClick}
      size="sm"
      title={tooltip}
      variant="ghost"
    >
      {isLoading ? <Loader2 className="h-3 w-3 animate-spin text-foreground hover:text-primary transition-colors" /> : icon}
    </Button>
  );

  return (
    <div className="scrollbar-hide flex h-full w-[30px] flex-col items-center gap-1 overflow-y-auto overflow-x-hidden border-gray-200 border-l bg-gray-100 py-1 dark:border-gray-700 dark:bg-gray-800">
      {/* Navigation */}
      <IconButton
        icon={<ArrowLeft className="h-3 w-3 text-foreground hover:text-primary transition-colors" />}
        isLoading={isLoading === "back"}
        onClick={handleBack}
        tooltip="Back Key"
      />
      <IconButton
        icon={<Home className="h-3 w-3 text-foreground hover:text-primary transition-colors" />}
        isLoading={isLoading === "home"}
        onClick={handleHome}
        tooltip="Home Key"
      />
      <IconButton
        icon={<Square className="h-3 w-3 text-foreground hover:text-primary transition-colors" />}
        isLoading={isLoading === "recent"}
        onClick={handleRecent}
        tooltip="Recent Apps Key"
      />

      {/* Divider */}
      <div className="my-1 h-px w-4 flex-shrink-0 bg-gray-300 dark:bg-gray-600" />

      {/* Volume */}
      <IconButton
        icon={<Volume className="h-3 w-3 text-foreground hover:text-primary transition-colors" />}
        isLoading={isLoading === "volume_up"}
        onClick={handleVolumeUp}
        tooltip="Volume Up"
      />
      <IconButton
        icon={<Volume1 className="h-3 w-3 text-foreground hover:text-primary transition-colors" />}
        isLoading={isLoading === "volume_down"}
        onClick={handleVolumeDown}
        tooltip="Volume Down"
      />
      <IconButton
        icon={<Volume2 className="h-3 w-3 text-foreground hover:text-primary transition-colors" />}
        isLoading={isLoading === "volume_mute"}
        onClick={handleVolumeMute}
        tooltip="Volume Mute"
      />

      {/* Media */}
      <IconButton
        icon={<Play className="h-3 w-3 text-foreground hover:text-primary transition-colors" />}
        isLoading={isLoading === "media_play"}
        onClick={handleMediaPlay}
        tooltip="Media Play"
      />
      <IconButton
        icon={<Pause className="h-3 w-3 text-foreground hover:text-primary transition-colors" />}
        isLoading={isLoading === "media_pause"}
        onClick={handleMediaPause}
        tooltip="Media Pause"
      />

      {/* Divider */}
      <div className="my-1 h-px w-4 flex-shrink-0 bg-gray-300 dark:bg-gray-600" />

      {/* Power */}
      <IconButton
        icon={<Battery className="h-3 w-3 text-foreground hover:text-primary transition-colors" />}
        isLoading={isLoading === "power"}
        onClick={handlePower}
        tooltip="Screen Lock/Unlock (Power)"
      />
      <IconButton
        icon={<Settings className="h-3 w-3 text-foreground hover:text-primary transition-colors" />}
        isLoading={isLoading === "settings"}
        onClick={handleSettings}
        tooltip="Open Settings"
      />
      <IconButton
        icon={<Camera className="h-3 w-3 text-foreground hover:text-primary transition-colors" />}
        isLoading={isLoading === "screenshot"}
        onClick={handleScreenshot}
        tooltip="Screenshot to Desktop"
      />

      {/* Divider */}
      <div className="my-1 h-px w-4 flex-shrink-0 bg-gray-300 dark:bg-gray-600" />

      {/* System */}
      <IconButton
        icon={<Smartphone className="h-3 w-3 text-foreground hover:text-primary transition-colors" />}
        isLoading={isLoading === "quick_settings"}
        onClick={handleQuickSettings}
        tooltip="Quick Settings"
      />
      <IconButton
        icon={<Bell className="h-3 w-3 text-foreground hover:text-primary transition-colors" />}
        isLoading={isLoading === "notifications"}
        onClick={handleNotifications}
        tooltip="Notifications"
      />
      <IconButton
        icon={<ChevronDown className="h-3 w-3 text-foreground hover:text-primary transition-colors" />}
        isLoading={isLoading === "collapse"}
        onClick={handleCollapseAll}
        tooltip="Collapse All"
      />
      <IconButton
        icon={<Unlock className="h-3 w-3 text-foreground hover:text-primary transition-colors" />}
        isLoading={isLoading === "unlock_menu"}
        onClick={handleUnlockMenu}
        tooltip="Unlock Menu"
      />

      {/* Divider */}
      <div className="my-1 h-px w-4 flex-shrink-0 bg-gray-300 dark:bg-gray-600" />

      {/* Advanced */}
      <IconButton
        icon={<User className="h-3 w-3 text-foreground hover:text-primary transition-colors" />}
        isLoading={isLoading === "developer_settings"}
        onClick={handleDeveloperSettings}
        tooltip="Developer Settings"
      />

      {/* Show Tap Options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="h-8 w-full flex-shrink-0 p-0 hover:bg-gray-200 disabled:opacity-50 dark:hover:bg-gray-700"
            disabled={!selectedDevice?.id}
            size="sm"
            title="Show Tap Options"
            variant="ghost"
          >
            <Hand className="h-3 w-3 text-foreground hover:text-primary transition-colors" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left">
          <DropdownMenuItem onClick={() => handleShowTaps(true)}>
            Show tap dot
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShowTaps(false)}>
            Hide tap dot
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
