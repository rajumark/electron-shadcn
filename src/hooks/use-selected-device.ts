import { useState, useEffect } from "react";
import { ipc } from "@/ipc/manager";

export interface SelectedDevice {
  id: string;
  name: string;
}

export function useSelectedDevice() {
  const [selectedDevice, setSelectedDevice] = useState<SelectedDevice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    const fetchSelectedDevice = async () => {
      try {
        // Get connected devices
        const devicesResult = await ipc.client.adb.executeADBCommand({
          args: ["devices"],
        });
        
        if (devicesResult) {
          const lines = devicesResult.split("\n").slice(1);
          const devices = lines
            .filter((line) => line.trim() !== "" && line.includes("\t"))
            .map((line) => line.split("\t")[0]?.trim())
            .filter((device) => device !== "");

          if (devices.length > 0) {
            const deviceId = devices[0];
            
            // Get manufacturer
            const manufacturer = await ipc.client.adb.executeADBCommand({
              args: ["-s", deviceId, "shell", "getprop", "ro.product.manufacturer"]
            });
            
            // Get model
            const model = await ipc.client.adb.executeADBCommand({
              args: ["-s", deviceId, "shell", "getprop", "ro.product.model"]
            });
            
            const brand = manufacturer?.trim() || "Unknown";
            const deviceModel = model?.trim() || "Unknown";
            
            const deviceName = `${brand} ${deviceModel}`.trim() || `Device ${deviceId.substring(0, 8)}`;
            
            setSelectedDevice({ id: deviceId, name: deviceName });
          } else {
            setSelectedDevice(null);
          }
        } else {
          setSelectedDevice(null);
        }
      } catch (error) {
        console.error("Failed to fetch selected device:", error);
        setSelectedDevice(null);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchSelectedDevice();

    // Poll every 5 seconds
    pollInterval = setInterval(fetchSelectedDevice, 5000);

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, []);

  return { selectedDevice, loading };
}
