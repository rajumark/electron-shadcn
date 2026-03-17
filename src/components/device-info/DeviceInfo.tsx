import { useState, useEffect } from "react";
import { useDeviceStore } from "@/stores/device-store";
import { ipc } from "@/ipc/manager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Terminal, Unlock, RotateCcw, Wifi, Browser, HardDrive, Cpu, Monitor, Phone } from "lucide-react";
import { toast } from "sonner";

interface DeviceOverview {
  name: string;
  brand: string;
  model: string;
  serialno: string;
  androidVersion: string;
  sdkVersion: number;
  kernelVersion: string;
  processor: string;
  abi: string;
  cpuNum: number;
  memTotal: number;
  storageTotal: number;
  storageUsed: number;
  physicalResolution: string;
  physicalDensity: number;
  resolution: string;
  density: number;
  fontScale: number;
  wifi: string;
  ip: string;
  mac: string;
  root: boolean;
}

export default function DeviceInfo() {
  const { selectedDevice } = useDeviceStore();
  const [overview, setOverview] = useState<DeviceOverview | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedDevice) {
      refresh();
    }
  }, [selectedDevice]);

  async function refresh() {
    if (!selectedDevice || isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      const result = await ipc.client.adb.getDeviceOverview({
        deviceId: selectedDevice.id,
      });

      if (result.success && result.data) {
        setOverview(result.data as DeviceOverview);
      } else {
        toast.error("Failed to get device overview");
      }
    } catch (error) {
      console.error("Failed to get device overview:", error);
      toast.error("Failed to get device overview");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  }

  async function rootDevice() {
    if (!selectedDevice || overview?.root) {
      return;
    }

    try {
      const result = await ipc.client.adb.root({
        deviceId: selectedDevice.id,
      });

      if (result.success) {
        toast.success("Root command sent");
        setTimeout(() => refresh(), 2000);
      } else {
        toast.error("Failed to root device");
      }
    } catch (error) {
      console.error("Failed to root device:", error);
      toast.error("Failed to root device");
    }
  }

  async function restartAdbServer() {
    try {
      const result = await ipc.client.adb.restartAdbServer();
      if (result.success) {
        toast.success("ADB server restarted");
      } else {
        toast.error("Failed to restart ADB server");
      }
    } catch (error) {
      console.error("Failed to restart ADB server:", error);
      toast.error("Failed to restart ADB server");
    }
  }

  async function openAdbCli() {
    try {
      const result = await ipc.client.adb.openAdbCli();
      if (result.success) {
        toast.info(`ADB path: ${result.path}`);
      } else {
        toast.error("Failed to get ADB path");
      }
    } catch (error) {
      console.error("Failed to open ADB CLI:", error);
      toast.error("Failed to open ADB CLI");
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  if (!selectedDevice) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Device Connected</h3>
          <p className="text-muted-foreground">Please connect a device to view its information</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading device information...</span>
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Device Information</h3>
          <p className="text-muted-foreground mb-4">Unable to retrieve device information</p>
          <Button onClick={refresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Toolbar */}
      <div className="flex items-center gap-2 pb-4 border-b">
        <Button onClick={openAdbCli} variant="outline" size="sm">
          <Terminal className="h-4 w-4 mr-2" />
          ADB CLI
        </Button>
        <Button onClick={restartAdbServer} variant="outline" size="sm">
          <RotateCcw className="h-4 w-4 mr-2" />
          Restart ADB
        </Button>
        <Button 
          onClick={rootDevice} 
          variant="outline" 
          size="sm"
          disabled={overview.root}
        >
          <Unlock className="h-4 w-4 mr-2" />
          Root {overview.root ? "(Rooted)" : ""}
        </Button>
        <div className="flex-1" />
        <Button onClick={refresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Device Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Basic Device Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Device Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoItem
              label="Name"
              value={overview.name}
              onCopy={() => copyToClipboard(overview.name)}
            />
            <InfoItem
              label="Brand"
              value={overview.brand}
              onCopy={() => copyToClipboard(overview.brand)}
            />
            <InfoItem
              label="Model"
              value={overview.model}
              onCopy={() => copyToClipboard(overview.model)}
            />
            <InfoItem
              label="Serial Number"
              value={overview.serialno}
              onCopy={() => copyToClipboard(overview.serialno)}
            />
          </CardContent>
        </Card>

        {/* Android Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Android Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoItem
              label="Android Version"
              value={`Android ${overview.androidVersion} (API ${overview.sdkVersion})`}
              onCopy={() => copyToClipboard(`Android ${overview.androidVersion} (API ${overview.sdkVersion})`)}
            />
            <InfoItem
              label="Kernel Version"
              value={overview.kernelVersion}
              onCopy={() => copyToClipboard(overview.kernelVersion)}
            />
            <InfoItem
              label="Root Status"
              value={overview.root ? "Rooted" : "Not Rooted"}
            >
              <Badge variant={overview.root ? "default" : "secondary"}>
                {overview.root ? "Rooted" : "Not Rooted"}
              </Badge>
            </InfoItem>
          </CardContent>
        </Card>

        {/* Processor Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Processor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoItem
              label="Processor"
              value={`${overview.processor || 'Unknown'} (${overview.cpuNum} cores)`}
              onCopy={() => copyToClipboard(`${overview.processor || 'Unknown'} (${overview.cpuNum} cores)`)}
            />
            <InfoItem
              label="Architecture"
              value={overview.abi}
              onCopy={() => copyToClipboard(overview.abi)}
            />
            <InfoItem
              label="Memory"
              value={formatFileSize(overview.memTotal)}
              onCopy={() => copyToClipboard(formatFileSize(overview.memTotal))}
            />
          </CardContent>
        </Card>

        {/* Storage Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Storage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoItem
              label="Storage Used"
              value={`${formatFileSize(overview.storageUsed)} / ${formatFileSize(overview.storageTotal)}`}
              onCopy={() => copyToClipboard(`${formatFileSize(overview.storageUsed)} / ${formatFileSize(overview.storageTotal)}`)}
            />
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(overview.storageUsed / overview.storageTotal) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Display Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Display
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoItem
              label="Physical Resolution"
              value={`${overview.physicalResolution} (${overview.physicalDensity}dpi)`}
              onCopy={() => copyToClipboard(`${overview.physicalResolution} (${overview.physicalDensity}dpi)`)}
            />
            <InfoItem
              label="Resolution"
              value={`${overview.resolution} (${overview.density}dpi)`}
              onCopy={() => copyToClipboard(`${overview.resolution} (${overview.density}dpi)`)}
            />
            <InfoItem
              label="Font Scale"
              value={`${overview.fontScale}x`}
              onCopy={() => copyToClipboard(`${overview.fontScale}x`)}
            />
          </CardContent>
        </Card>

        {/* Network Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              Network
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoItem
              label="Wi-Fi"
              value={overview.wifi || "Unknown"}
              onCopy={() => copyToClipboard(overview.wifi || "Unknown")}
            />
            <InfoItem
              label="IP Address"
              value={overview.ip || "Unknown"}
              onCopy={() => copyToClipboard(overview.ip || "Unknown")}
            />
            <InfoItem
              label="MAC Address"
              value={overview.mac || "Unknown"}
              onCopy={() => copyToClipboard(overview.mac || "Unknown")}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoItem({ 
  label, 
  value, 
  onCopy, 
  children 
}: { 
  label: string; 
  value: string; 
  onCopy?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-muted-foreground">{label}:</span>
      <div className="flex items-center gap-2">
        {children || (
          <span 
            className="text-sm cursor-pointer hover:text-primary" 
            onClick={onCopy}
            title="Click to copy"
          >
            {value || "Unknown"}
          </span>
        )}
        {onCopy && (
          <Copy 
            className="h-3 w-3 text-muted-foreground hover:text-primary cursor-pointer" 
            onClick={onCopy}
          />
        )}
      </div>
    </div>
  );
}
