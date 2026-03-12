import { useEffect } from "react";
import { Smartphone, X } from "lucide-react";
import { useDeviceStore } from "@/stores/device-store";

export function DeviceList() {
  const { devices, selectedDevice, loading, error, selectDevice } = useDeviceStore();

  useEffect(() => {
    // Initial fetch
    useDeviceStore.getState().fetchDevices();
    
    // Poll every 5 seconds
    const pollInterval = setInterval(() => {
      useDeviceStore.getState().fetchDevices();
    }, 5000);

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, []);

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
            onClick={() => selectDevice(device.id)}
            type="button"
            className={`px-3 py-1 text-sm rounded-md border transition-all whitespace-nowrap ${
              selectedDevice?.id === device.id
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
