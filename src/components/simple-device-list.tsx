import { useEffect, useState, useCallback } from "react";
import { Smartphone, X } from "lucide-react";
import { ipc } from "@/ipc/manager";

interface Device {
  id: string;
  name: string;
}

export function SimpleDeviceList() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDeviceName = useCallback(async (deviceId: string): Promise<string> => {
    // Cache device names to avoid repeated ADB calls
    const nameMap: Record<string, string> = {};
    
    if (nameMap[deviceId]) {
      return nameMap[deviceId];
    }

    try {
      // Get device manufacturer and model
      const manufacturer = await ipc.client.adb.executeADBCommand({
        args: ["-s", deviceId, "shell", "getprop", "ro.product.manufacturer"]
      });
      
      const model = await ipc.client.adb.executeADBCommand({
        args: ["-s", deviceId, "shell", "getprop", "ro.product.model"]
      });

      const brand = manufacturer?.trim() || "Unknown";
      const deviceModel = model?.trim() || "Unknown";
      
      const deviceName = `${brand} ${deviceModel}`.trim() || `Device ${deviceId.substring(0, 8)}`;
      
      // Cache result
      nameMap[deviceId] = deviceName;
      
      return deviceName;
    } catch (error) {
      console.error(`Failed to get device name for ${deviceId}:`, error);
      const fallbackName = `Device ${deviceId.substring(0, 8)}`;
      nameMap[deviceId] = fallbackName;
      return fallbackName;
    }
  }, []);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    const fetchDevices = async () => {
      try {
        const result = await ipc.client.adb.executeADBCommand({
          args: ["devices"],
        });

        if (result) {
          // Parse ADB devices output
          const lines = result.split("\n").slice(1);
          const parsedDevices = lines
            .filter((line) => line.trim() !== "" && line.includes("\t"))
            .map((line) => line.split("\t")[0]?.trim())
            .filter((device) => device !== "");

          // Fetch device names asynchronously
          const devicesWithNames = await Promise.all(
            parsedDevices.map(async (device) => ({
              ...device,
              name: await getDeviceName(device),
            }))
          );

          setDevices(devicesWithNames);
          
          // Auto-select first device if none selected
          if (devicesWithNames.length > 0 && !selectedDevice) {
            setSelectedDevice(devicesWithNames[0].id);
          }
          
          setError(null);
        }
      } catch (err) {
        console.error("Failed to fetch devices:", err);
        setError("Failed to fetch devices");
        setDevices([]);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchDevices();

    // Poll every 5 seconds
    pollInterval = setInterval(fetchDevices, 5000);

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [selectedDevice]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-muted border-b">
        <div className="animate-pulse flex items-center gap-2">
          <Smartphone className="h-4 w-4" />
          <span className="text-sm text-muted-foreground">Loading devices...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-muted border-b">
        <X className="h-4 w-4 text-destructive" />
        <span className="text-sm text-destructive">{error}</span>
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-muted border-b">
        <Smartphone className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">No devices connected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-muted border-b overflow-x-auto">
      <Smartphone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <div className="flex gap-1">
        {devices.map((device) => (
          <button
            key={device.id}
            onClick={() => setSelectedDevice(device.id)}
            type="button"
            className={`px-3 py-1 text-sm rounded-md border transition-all whitespace-nowrap ${
              selectedDevice === device.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background hover:bg-muted border-border hover:text-foreground"
            }`}
          >
            {device.name}
          </button>
        ))}
      </div>
    </div>
  );
}
