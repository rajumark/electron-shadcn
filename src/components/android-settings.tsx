import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, Pin, PinOff } from "lucide-react";
import { ipc } from "@/ipc/manager";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { androidSettings, type AndroidSetting } from "@/constants/android-settings";

export const AndroidSettings: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pinnedSettings, setPinnedSettings] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
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
    return androidSettings.filter(setting =>
      setting.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Get pinned settings
  const pinnedSettingsList = useMemo(() => {
    return androidSettings.filter(setting => pinnedSettings.includes(setting.id));
  }, [pinnedSettings]);

  // Toggle pin status
  const togglePin = useCallback((settingId: string) => {
    if (pinnedSettings.includes(settingId)) {
      savePinnedSettings(pinnedSettings.filter(id => id !== settingId));
    } else {
      savePinnedSettings([...pinnedSettings, settingId]);
    }
  }, [pinnedSettings, savePinnedSettings]);

  // Launch Android setting
  const launchSetting = useCallback(async (setting: AndroidSetting) => {
    if (!selectedDevice || !selectedDevice.id?.trim()) {
      setError("No device selected");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Force stop settings app first
      const forceStopCommand = ["-s", selectedDevice.id, "shell", "am", "force-stop", "com.android.settings"];
      await ipc.client.adb.executeADBCommand({ args: forceStopCommand });

      // Launch the specific setting
      const intentCommand = ["-s", selectedDevice.id, "shell", "am", "start", "-a", setting.intent];
      const result = await ipc.client.adb.executeADBCommand({ args: intentCommand });
      
      console.log(`Successfully launched: ${setting.text}`);
    } catch (error) {
      console.error(`Failed to launch ${setting.text}:`, error);
      setError(`Failed to launch ${setting.text}: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  }, [selectedDevice]);

  const SettingButton: React.FC<{ setting: AndroidSetting; isPinned?: boolean }> = ({ setting, isPinned = false }) => {
    const [showPinIcon, setShowPinIcon] = useState(false);

    return (
      <button
        className="group relative flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-colors"
        onClick={() => launchSetting(setting)}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowPinIcon(true);
        }}
        onMouseLeave={() => setShowPinIcon(false)}
        disabled={loading}
      >
        <span className="truncate max-w-[200px]">{setting.text}</span>
        
        {/* Pin icon - visible on hover or context menu */}
        <button
          className={`opacity-0 group-hover:opacity-100 transition-opacity ${showPinIcon ? 'opacity-100' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            togglePin(setting.id);
          }}
          title={isPinned ? "Unpin" : "Pin"}
        >
          {isPinned ? (
            <Pin className="h-3.5 w-3.5 text-blue-600 fill-current" />
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
    showPinned?: boolean 
  }> = ({ title, settings, showPinned = false }) => {
    if (settings.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-xs font-medium text-gray-600 mb-3 px-2">{title}</h3>
        <div className="flex flex-wrap gap-2 px-2">
          {settings.map(setting => (
            <SettingButton 
              key={setting.id} 
              setting={setting} 
              isPinned={showPinned}
            />
          ))}
        </div>
      </div>
    );
  };

  if (!selectedDevice || !selectedDevice.id?.trim()) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Select a device to access Android settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search Header */}
      <div className="sticky top-0 bg-white p-4 z-10">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search Android settings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}
        
        {/* Loading Indicator */}
        {loading && (
          <div className="mt-3 flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <p className="text-xs text-gray-600">Launching setting...</p>
          </div>
        )}
      </div>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Show pinned section only when not searching */}
        {!searchQuery.trim() && pinnedSettingsList.length > 0 && (
          <SettingsSection 
            title="Pinned Settings" 
            settings={pinnedSettingsList} 
            showPinned={true}
          />
        )}

        {/* All Settings */}
        <SettingsSection 
          title={searchQuery.trim() ? "Search Results" : "All Settings"} 
          settings={filteredSettings} 
        />

        {/* No results */}
        {filteredSettings.length === 0 && searchQuery.trim() && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No settings found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};
