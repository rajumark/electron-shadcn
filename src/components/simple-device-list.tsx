import { useEffect, useState, useCallback } from "react";
import { Smartphone, X } from "lucide-react";
import { ipc } from "@/ipc/manager";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Device {
  id: string;
  name: string;
}

export function SimpleDeviceList() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedDevice, setSelectedDevice } = useSelectedDevice();

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

          // Add fake devices for testing
          const fakeDevices = [
            { id: "FAKE12345", name: "Test Device 1" },
            { id: "FAKE67890", name: "Test Device 2" },
            { id: "FAKEABCDE", name: "Test Device 3" }
          ];

          // Combine real and fake devices
          const allDevices = [...parsedDevices, ...fakeDevices.map(device => device.id)];

          // Fetch device names asynchronously for real devices only
          const devicesWithNames = await Promise.all(
            parsedDevices.map(async (device) => ({
              id: device,
              name: await getDeviceName(device),
            }))
          );

          // Add fake devices with their names
          const finalDevices = [...devicesWithNames, ...fakeDevices];

          setDevices(finalDevices);
          
          // Auto-select first device if none selected, or if selected device is no longer available
          if (finalDevices.length > 0 && (!selectedDevice || !finalDevices.some(d => d.id === selectedDevice.id))) {
            setSelectedDevice(finalDevices[0]);
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
  }, [selectedDevice, setSelectedDevice]);

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
     
      <Tabs value={selectedDevice?.id || ""} onValueChange={(value) => {
        const device = devices.find(d => d.id === value);
        if (device) setSelectedDevice(device);
      }} className="w-full">
        <TabsList className="inline-flex justify-start px-4 h-auto flex-wrap gap-1 bg-transparent border-0">
          {devices.map((device) => (
            <TabsTrigger
              key={device.id}
              value={device.id}
              className="px-3 py-1 text-sm rounded-md border transition-all whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary bg-background hover:bg-muted border-border hover:text-foreground"
            >
              {device.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
   
  );
}
