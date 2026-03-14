import React, { useState } from "react";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { ipc } from "@/ipc/manager";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const handleBack = () => executeADBCommand("back", ["shell", "input", "keyevent", "4"]);
  const handleHome = () => executeADBCommand("home", ["shell", "input", "keyevent", "3"]);
  const handleRecent = () => executeADBCommand("recent", ["shell", "input", "keyevent", "187"]);
  const handleVolumeUp = () => executeADBCommand("volume_up", ["shell", "input", "keyevent", "24"]);
  const handleVolumeDown = () => executeADBCommand("volume_down", ["shell", "input", "keyevent", "25"]);
  const handleVolumeMute = () => executeADBCommand("volume_mute", ["shell", "input", "keyevent", "164"]);
  const handleSettings = () => executeADBCommand("settings", ["shell", "am", "start", "-a", "android.settings.SETTINGS"]);
  const handlePower = () => executeADBCommand("power", ["shell", "input", "keyevent", "26"]);
  const handleScreenshot = async () => {
    if (!selectedDevice?.id) return;
    
    setIsLoading("screenshot");
    try {
      await ipc.client.adb.executeADBCommand({
        args: ["-s", selectedDevice.id, "shell", "screencap", "-p", "/sdcard/screenshot.png"],
        useCache: false,
      });
      
      const desktop = `${process.env.HOME || process.env.USERPROFILE}/Desktop`;
      await ipc.client.adb.executeADBCommand({
        args: ["-s", selectedDevice.id, "pull", "/sdcard/screenshot.png", `${desktop}/screenshot-${Date.now()}.png`],
        useCache: false,
      });
      
      console.log("Screenshot saved to desktop");
    } catch (error) {
      console.error("Failed to take screenshot:", error);
    } finally {
      setIsLoading(null);
    }
  };
  const handleMediaPlay = () => executeADBCommand("media_play", ["shell", "input", "keyevent", "126"]);
  const handleMediaPause = () => executeADBCommand("media_pause", ["shell", "input", "keyevent", "127"]);
  const handleQuickSettings = () => executeADBCommand("quick_settings", ["shell", "cmd", "statusbar", "expand-settings"]);
  const handleNotifications = () => executeADBCommand("notifications", ["shell", "cmd", "statusbar", "expand-notifications"]);
  const handleCollapseAll = () => executeADBCommand("collapse", ["shell", "cmd", "statusbar", "collapse"]);
  const handleUnlockMenu = () => executeADBCommand("unlock_menu", ["shell", "input", "keyevent", "82"]);
  const handleDeveloperSettings = () => executeADBCommand("developer_settings", ["shell", "am", "start", "-a", "com.android.settings.APPLICATION_DEVELOPMENT_SETTINGS"]);
  const handleShowTaps = (show: boolean) => executeADBCommand("show_taps", ["shell", "settings", "put", "system", "show_touches", show ? "1" : "0"]);

  const IconButton = ({ 
    emoji, 
    tooltip, 
    onClick, 
    isLoading = false,
    disabled = !selectedDevice?.id 
  }: {
    emoji: string;
    tooltip: string;
    onClick: () => void;
    isLoading?: boolean;
    disabled?: boolean;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      className="w-full h-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
      onClick={onClick}
      disabled={disabled || isLoading}
      title={tooltip}
    >
      <span className="text-sm">{isLoading ? "⏳" : emoji}</span>
    </Button>
  );

  return (
    <div className="w-[30px] bg-gray-100 dark:bg-gray-800 flex flex-col items-center py-1 gap-1 overflow-y-auto border-l border-gray-200 dark:border-gray-700">
      {/* Navigation */}
      <IconButton emoji="⬅️" tooltip="Back Key" onClick={handleBack} isLoading={isLoading === "back"} />
      <IconButton emoji="🏠" tooltip="Home Key" onClick={handleHome} isLoading={isLoading === "home"} />
      <IconButton emoji="⬜" tooltip="Recent Apps Key" onClick={handleRecent} isLoading={isLoading === "recent"} />
      
      {/* Divider */}
      <div className="w-4 h-px bg-gray-300 dark:bg-gray-600 my-1" />
      
      {/* Volume */}
      <IconButton emoji="🔊" tooltip="Volume Up" onClick={handleVolumeUp} isLoading={isLoading === "volume_up"} />
      <IconButton emoji="🔉" tooltip="Volume Down" onClick={handleVolumeDown} isLoading={isLoading === "volume_down"} />
      <IconButton emoji="🔇" tooltip="Volume Mute" onClick={handleVolumeMute} isLoading={isLoading === "volume_mute"} />
      
      {/* Media */}
      <IconButton emoji="▶️" tooltip="Media Play" onClick={handleMediaPlay} isLoading={isLoading === "media_play"} />
      <IconButton emoji="⏸️" tooltip="Media Pause" onClick={handleMediaPause} isLoading={isLoading === "media_pause"} />
      
      {/* Divider */}
      <div className="w-4 h-px bg-gray-300 dark:bg-gray-600 my-1" />
      
      {/* Power */}
      <IconButton emoji="🔋" tooltip="Screen Lock/Unlock (Power)" onClick={handlePower} isLoading={isLoading === "power"} />
      <IconButton emoji="⚙️" tooltip="Open Settings" onClick={handleSettings} isLoading={isLoading === "settings"} />
      <IconButton emoji="📸" tooltip="Screenshot to Desktop" onClick={handleScreenshot} isLoading={isLoading === "screenshot"} />
      
      {/* Divider */}
      <div className="w-4 h-px bg-gray-300 dark:bg-gray-600 my-1" />
      
      {/* System */}
      <IconButton emoji="📱" tooltip="Quick Settings" onClick={handleQuickSettings} isLoading={isLoading === "quick_settings"} />
      <IconButton emoji="🔔" tooltip="Notifications" onClick={handleNotifications} isLoading={isLoading === "notifications"} />
      <IconButton emoji="📉" tooltip="Collapse All" onClick={handleCollapseAll} isLoading={isLoading === "collapse"} />
      <IconButton emoji="🔓" tooltip="Unlock Menu" onClick={handleUnlockMenu} isLoading={isLoading === "unlock_menu"} />
      
      {/* Divider */}
      <div className="w-4 h-px bg-gray-300 dark:bg-gray-600 my-1" />
      
      {/* Advanced */}
      <IconButton emoji="👨‍💻" tooltip="Developer Settings" onClick={handleDeveloperSettings} isLoading={isLoading === "developer_settings"} />
      
      {/* Show Tap Options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
            disabled={!selectedDevice?.id}
            title="Show Tap Options"
          >
            <span className="text-sm">👆</span>
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
