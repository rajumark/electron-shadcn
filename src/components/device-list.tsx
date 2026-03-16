import { Smartphone, X } from "lucide-react";
import { useEffect } from "react";
import { useDeviceStore } from "@/stores/device-store";

export function DeviceList() {
  const { devices, selectedDevice, loading, error, selectDevice } =
    useDeviceStore();

  useEffect(() => {
    // Initial fetch
    useDeviceStore.getState().fetchDevices();

    // Poll every 3 seconds
    const pollInterval = setInterval(() => {
      useDeviceStore.getState().fetchDevices();
    }, 3000);

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 border-b bg-muted px-4 py-2">
        <div className="flex animate-pulse items-center gap-2">
          <Smartphone className="h-4 w-4" />
          <span className="text-muted-foreground text-sm">
            Loading devices...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 border-b bg-muted px-4 py-2">
        <X className="h-4 w-4 text-destructive" />
        <span className="text-destructive text-sm">{error}</span>
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="flex items-center gap-2 border-b bg-muted px-4 py-2">
        <Smartphone className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground text-sm">
          No devices connected
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto border-b bg-muted px-4 py-2">
      <Smartphone className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
      <div className="flex gap-1">
        {devices.map((device) => (
          <button
            className={`whitespace-nowrap rounded-md border px-3 py-1 text-sm transition-all ${
              selectedDevice?.id === device.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-muted hover:text-foreground"
            }`}
            key={device.id}
            onClick={() => selectDevice(device.id)}
            type="button"
          >
            {device.name}
          </button>
        ))}
      </div>
    </div>
  );
}
