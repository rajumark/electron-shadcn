import { create } from "zustand";
import { ipc } from "@/ipc/manager";

interface Device {
  id: string;
  name: string;
}

interface DeviceStore {
  devices: Device[];
  error: string | null;
  loading: boolean;
  selectedDevice: Device | null;
}

export const useDeviceStore = create<DeviceStore>((set, get) => ({
  devices: [],
  selectedDevice: null,
  loading: true,
  error: null,

  fetchDevices: async () => {
    set({ loading: true, error: null });

    try {
      const result = await ipc.client.adb.executeADBCommand({
        args: ["devices"],
      });

      if (result) {
        // Parse ADB devices output
        const lines = result.split("\n").slice(1); // Skip first line
        const parsedDevices = lines
          .filter((line) => line.trim() !== "" && line.includes("\t"))
          .map((line) => line.split("\t")[0]?.trim())
          .filter((device) => device.id !== "");

        // Fetch device names asynchronously
        const devicesWithNames = await Promise.all(
          parsedDevices.map(async (device) => ({
            ...device,
            name: await getDeviceName(device),
          }))
        );

        set({
          devices: devicesWithNames,
          selectedDevice:
            devicesWithNames.length > 0 && !get().selectedDevice
              ? devicesWithNames[0]
              : get().selectedDevice,
          loading: false,
          error: null,
        });
      }
    } catch (err) {
      console.error("Failed to fetch devices:", err);
      set({
        devices: [],
        selectedDevice: null,
        loading: false,
        error: "Failed to fetch devices",
      });
    }
  },

  selectDevice: (deviceId: string) => {
    const { devices } = get();
    const device = devices.find((d) => d.id === deviceId);
    if (device) {
      set({ selectedDevice: device });
    }
  },

  clearSelectedDevice: () => {
    set({ selectedDevice: null });
  },
}));

// Helper function to get device name
async function getDeviceName(deviceId: string): Promise<string> {
  // Cache device names to avoid repeated ADB calls
  const nameMap: Record<string, string> = {};

  if (nameMap[deviceId]) {
    return nameMap[deviceId];
  }

  try {
    // Get device manufacturer and model
    const manufacturer = await ipc.client.adb.executeADBCommand({
      args: ["-s", deviceId, "shell", "getprop", "ro.product.manufacturer"],
    });

    const model = await ipc.client.adb.executeADBCommand({
      args: ["-s", deviceId, "shell", "getprop", "ro.product.model"],
    });

    const brand = manufacturer?.trim() || "Unknown";
    const deviceModel = model?.trim() || "Unknown";

    const deviceName =
      `${brand} ${deviceModel}`.trim() || `Device ${deviceId.substring(0, 8)}`;

    // Cache result
    nameMap[deviceId] = deviceName;

    return deviceName;
  } catch (error) {
    console.error(`Failed to get device name for ${deviceId}:`, error);
    const fallbackName = `Device ${deviceId.substring(0, 8)}`;
    nameMap[deviceId] = fallbackName;
    return fallbackName;
  }
}
