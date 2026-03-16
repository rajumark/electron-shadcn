import { Pin, PinOff, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  type AndroidSetting,
  androidSettings,
} from "@/constants/android-settings";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { ipc } from "@/ipc/manager";

export const AndroidSettings: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pinnedSettings, setPinnedSettings] = useState<string[]>([]);
  const { selectedDevice } = useSelectedDevice();

  // Load pinned settings from local storage
  useEffect(() => {
    const loadPinnedSettings = async () => {
      try {
        const stored = localStorage.getItem("pinnedAndroidSettings");
        if (stored) {
          setPinnedSettings(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Failed to load pinned settings:", error);
      }
    };
    loadPinnedSettings();
  }, []);

  // Save pinned settings to local storage
  const savePinnedSettings = useCallback((settings: string[]) => {
    try {
      localStorage.setItem("pinnedAndroidSettings", JSON.stringify(settings));
      setPinnedSettings(settings);
    } catch (error) {
      console.error("Failed to save pinned settings:", error);
    }
  }, []);

  // Filter settings based on search query
  const filteredSettings = useMemo(() => {
    if (!searchQuery.trim()) {
      return androidSettings;
    }
    return androidSettings.filter((setting) =>
      setting.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Get pinned settings
  const pinnedSettingsList = useMemo(() => {
    return androidSettings.filter((setting) =>
      pinnedSettings.includes(setting.id)
    );
  }, [pinnedSettings]);

  // Toggle pin status
  const togglePin = useCallback(
    (settingId: string) => {
      if (pinnedSettings.includes(settingId)) {
        savePinnedSettings(pinnedSettings.filter((id) => id !== settingId));
      } else {
        savePinnedSettings([...pinnedSettings, settingId]);
      }
    },
    [pinnedSettings, savePinnedSettings]
  );

  // Launch Android setting
  const launchSetting = useCallback(
    async (setting: AndroidSetting) => {
      if (!(selectedDevice && selectedDevice.id?.trim())) {
        toast.error("No device selected");
        return;
      }

      try {
        // Show loading toast
        const loadingToast = toast.loading(`Launching ${setting.text}...`);

        // Force stop settings app first
        const forceStopCommand = [
          "-s",
          selectedDevice.id,
          "shell",
          "am",
          "force-stop",
          "com.android.settings",
        ];
        await ipc.client.adb.executeADBCommand({ args: forceStopCommand });

        // Launch the specific setting
        const intentCommand = [
          "-s",
          selectedDevice.id,
          "shell",
          "am",
          "start",
          "-a",
          setting.intent,
        ];
        await ipc.client.adb.executeADBCommand({ args: intentCommand });

        // Update toast to success
        toast.success(`Successfully launched: ${setting.text}`, {
          id: loadingToast,
        });
        console.log(`Successfully launched: ${setting.text}`);
      } catch (error) {
        console.error(`Failed to launch ${setting.text}:`, error);
        toast.error(
          `Failed to launch ${setting.text}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    },
    [selectedDevice]
  );

  const SettingButton: React.FC<{
    setting: AndroidSetting;
    isPinned?: boolean;
  }> = ({ setting, isPinned = false }) => {
    const [showPinIcon, setShowPinIcon] = useState(false);

    return (
      <button
        className="group relative flex min-h-[30px] items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-left text-xs transition-colors hover:border-blue-200 hover:bg-blue-50"
        disabled={false}
        onClick={() => launchSetting(setting)}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowPinIcon(true);
        }}
        onMouseLeave={() => setShowPinIcon(false)}
      >
        <span className="line-clamp-2 w-full truncate">{setting.text}</span>

        {/* Pin icon - visible on hover or context menu */}
        <button
          className={`opacity-0 transition-opacity group-hover:opacity-100 ${showPinIcon ? "opacity-100" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            togglePin(setting.id);
          }}
          title={isPinned ? "Unpin" : "Pin"}
        >
          {isPinned ? (
            <Pin className="h-3.5 w-3.5 fill-current text-blue-600" />
          ) : (
            <PinOff className="h-3.5 w-3.5 text-gray-400" />
          )}
        </button>
      </button>
    );
  };

  const SettingsSection: React.FC<{
    title: string;
    settings: AndroidSetting[];
    showPinned?: boolean;
  }> = ({ title, settings, showPinned = false }) => {
    if (settings.length === 0) {
      return null;
    }

    return (
      <div className="mb-6">
        <h3 className="mb-3 px-2 font-medium text-gray-600 text-xs">{title}</h3>
        <div className="grid grid-cols-2 gap-2 px-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {settings.map((setting) => (
            <SettingButton
              isPinned={showPinned}
              key={setting.id}
              setting={setting}
            />
          ))}
        </div>
      </div>
    );
  };

  if (!(selectedDevice && selectedDevice.id?.trim())) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">
            Select a device to access Android settings
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Search Header */}
      <div className="sticky top-0 z-10 bg-white p-4">
        <div className="relative max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Android settings..."
            type="text"
            value={searchQuery}
          />
        </div>
      </div>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Show pinned section only when not searching */}
        {!searchQuery.trim() && pinnedSettingsList.length > 0 && (
          <SettingsSection
            settings={pinnedSettingsList}
            showPinned={true}
            title="Pinned Settings"
          />
        )}

        {/* All Settings */}
        <SettingsSection
          settings={filteredSettings}
          title={searchQuery.trim() ? "Search Results" : "All Settings"}
        />

        {/* No results */}
        {filteredSettings.length === 0 && searchQuery.trim() && (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              No settings found matching "{searchQuery}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
