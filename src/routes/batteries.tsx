import { createFileRoute } from "@tanstack/react-router";
import {
  Battery,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  Info,
  RefreshCw,
  Thermometer,
  Usb,
  Wifi,
  Zap,
  ZapOff,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { ipc } from "@/ipc/manager";

interface BatteryData {
  [key: string]: string | number;
}

function BatteriesPage() {
  const { t } = useTranslation();
  const { selectedDevice } = useSelectedDevice();
  const [batteryData, setBatteryData] = useState<BatteryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!(isDragging && containerRef.current)) {
        return;
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      if (newLeftWidth >= 20 && newLeftWidth <= 80) {
        setLeftWidth(newLeftWidth);
      }
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const parseBatteryData = (rawOutput: string): BatteryData => {
    const data: BatteryData = {};
    const lines = rawOutput.split("\n");

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!(trimmedLine && trimmedLine.includes(":"))) {
        continue;
      }

      const [key, ...valueParts] = trimmedLine.split(":");
      const value = valueParts.join(":").trim();

      if (key && value) {
        const cleanKey = key.replace(/^\s+/, "").replace(/\s+$/, "");
        const cleanValue = value.replace(/^\s+/, "").replace(/\s+$/, "");

        // Try to parse as number, otherwise keep as string
        const numValue = Number(cleanValue);
        data[cleanKey] = isNaN(numValue) ? cleanValue : numValue;
      }
    }

    return data;
  };

  const fetchBatteryInfo = async () => {
    if (!selectedDevice) {
      setError("No device selected");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await ipc.client.adb.getBatteryInfo({
        deviceId: selectedDevice.id,
      });

      if (response.success && response.data) {
        const parsedData = parseBatteryData(response.data);
        setBatteryData(parsedData);
        toast.success("Battery information updated");
      } else {
        setError(response.error || "Failed to fetch battery information");
        toast.error(response.error || "Failed to fetch battery information");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDevice) {
      fetchBatteryInfo();
    }
  }, [selectedDevice]);

  const getBatteryIcon = (level: number) => {
    if (level >= 90) {
      return BatteryFull;
    }
    if (level >= 60) {
      return Battery;
    }
    if (level >= 30) {
      return BatteryMedium;
    }
    return BatteryLow;
  };

  const getBatteryStatus = (status: number) => {
    switch (status) {
      case 1:
        return { text: "Unknown", variant: "secondary" as const };
      case 2:
        return { text: "Charging", variant: "default" as const };
      case 3:
        return { text: "Discharging", variant: "outline" as const };
      case 4:
        return { text: "Not Charging", variant: "secondary" as const };
      case 5:
        return { text: "Fully Charged", variant: "default" as const };
      default:
        return { text: "Unknown", variant: "secondary" as const };
    }
  };

  const getHealthText = (health: number) => {
    switch (health) {
      case 1:
        return "Unknown";
      case 2:
        return "Good";
      case 3:
        return "Overheat";
      case 4:
        return "Dead";
      case 5:
        return "Over Voltage";
      case 6:
        return "Unspecified Failure";
      case 7:
        return "Cold";
      default:
        return "Unknown";
    }
  };

  const formatTemperature = (temp: number) => {
    return `${(temp / 10).toFixed(1)}°C`;
  };

  const formatVoltage = (voltage: number) => {
    return `${(voltage / 1000).toFixed(2)}V`;
  };

  const formatCurrent = (current: number) => {
    return `${(current / 1000).toFixed(0)}mA`;
  };

  const formatPower = (watts: number) => {
    return `${watts}W`;
  };

  const formatCapacity = (capacity: number) => {
    return `${(capacity / 1000).toFixed(0)}mAh`;
  };

  const formatDate = (timestamp: number) => {
    if (timestamp === 0) {
      return "Never";
    }
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getPowerSource = () => {
    if (!batteryData) {
      return "Unknown";
    }

    const acPowered = batteryData["AC powered"];
    const usbPowered = batteryData["USB powered"];
    const wirelessPowered = batteryData["Wireless powered"];

    if (acPowered) {
      return "AC Power";
    }
    if (usbPowered) {
      return "USB Power";
    }
    if (wirelessPowered) {
      return "Wireless";
    }
    return "Battery";
  };

  const getPowerSourceIcon = () => {
    if (!batteryData) {
      return ZapOff;
    }

    const acPowered = batteryData["AC powered"];
    const usbPowered = batteryData["USB powered"];
    const wirelessPowered = batteryData["Wireless powered"];

    if (acPowered) {
      return Zap;
    }
    if (usbPowered) {
      return Usb;
    }
    if (wirelessPowered) {
      return Wifi;
    }
    return ZapOff;
  };

  if (!selectedDevice) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <Info className="h-12 w-12 text-muted-foreground" />
          <h1 className="font-bold text-4xl">No Device Selected</h1>
          <p className="text-muted-foreground">
            Please select a device to view battery information
          </p>
        </div>
      </div>
    );
  }

  if (error && !batteryData) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <Battery className="h-12 w-12 text-destructive" />
          <h1 className="font-bold text-4xl">Battery Information</h1>
          <p className="text-destructive">{error}</p>
          <Button disabled={isLoading} onClick={fetchBatteryInfo}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const level = Number(batteryData?.["level"]) || 0;
  const status = Number(batteryData?.["status"]) || 1;
  const health = Number(batteryData?.["health"]) || 1;
  const temperature = Number(batteryData?.["temperature"]) || 0;
  const voltage = Number(batteryData?.["voltage"]) || 0;
  const chargeWatt = Number(batteryData?.["charge watt"]) || 0;
  const fullCapacity = Number(batteryData?.["Full capacity"]) || 0;
  const fullDesignCapacity = Number(batteryData?.["Full design capacity"]) || 0;
  const cycleCount = Number(batteryData?.["cycle count"]) || 0;
  const technology = batteryData?.["technology"] || "Unknown";
  const manufacturingDate =
    Number(batteryData?.["manufacturing date property"]) || 0;

  const BatteryIcon = getBatteryIcon(level);
  const PowerIcon = getPowerSourceIcon();
  const batteryStatus = getBatteryStatus(status);
  const healthText = getHealthText(health);
  const capacityPercentage =
    fullDesignCapacity > 0 ? (fullCapacity / fullDesignCapacity) * 100 : 0;

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex-1 overflow-hidden">
        <div className="relative flex h-full min-w-0 flex-1" ref={containerRef}>
          {/* Battery Left - Current UI */}
          <div
            className="flex h-full flex-col gap-4 overflow-auto"
            style={{ width: `${leftWidth}%` }}
          >
            {batteryData && (
              <>
                {/* Refresh Button */}
                <div className="flex justify-start">
                  <Button
                    disabled={isLoading}
                    onClick={fetchBatteryInfo}
                    size="sm"
                  >
                    <RefreshCw
                      className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`}
                    />
                  </Button>
                </div>

                {/* Main Battery Status - Ultra Compact */}
                <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-green-50 p-3 dark:from-blue-950 dark:to-green-950">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BatteryIcon className="h-5 w-5 text-primary" />
                      <span className="font-bold text-lg">{level}%</span>
                    </div>
                    <Badge className="text-xs" variant={batteryStatus.variant}>
                      {batteryStatus.text}
                    </Badge>
                  </div>
                  <Progress className="mb-2 h-2" value={level} />
                  <div className="flex justify-between text-muted-foreground text-xs">
                    <span>Health: {healthText}</span>
                    <span>{getPowerSource()}</span>
                  </div>
                </div>

                {/* Quick Metrics Grid - Minimal */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded bg-muted/30 p-2">
                    <Thermometer
                      className={`mx-auto mb-1 h-4 w-4 ${
                        temperature > 400
                          ? "text-red-600"
                          : temperature > 300
                            ? "text-orange-600"
                            : "text-blue-600"
                      }`}
                    />
                    <div className="font-medium text-xs">
                      {formatTemperature(temperature)}
                    </div>
                    <div className="text-muted-foreground text-xs">Temp</div>
                  </div>
                  <div className="rounded bg-muted/30 p-2">
                    <Zap className="mx-auto mb-1 h-4 w-4 text-yellow-600" />
                    <div className="font-medium text-xs">
                      {formatVoltage(voltage)}
                    </div>
                    <div className="text-muted-foreground text-xs">Voltage</div>
                  </div>
                  <div className="rounded bg-muted/30 p-2">
                    <PowerIcon className="mx-auto mb-1 h-4 w-4 text-blue-600" />
                    <div className="font-medium text-xs">
                      {formatPower(chargeWatt)}
                    </div>
                    <div className="text-muted-foreground text-xs">Power</div>
                  </div>
                </div>

                {/* Capacity Info - Compact */}
                {fullDesignCapacity > 0 && (
                  <div className="rounded bg-muted/20 p-2">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-medium text-xs">
                        Capacity Health
                      </span>
                      <span className="font-bold text-xs">
                        {capacityPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      className="mb-1 h-1.5"
                      value={capacityPercentage}
                    />
                    <div className="flex justify-between text-muted-foreground text-xs">
                      <span>{formatCapacity(fullCapacity)}</span>
                      <span>{formatCapacity(fullDesignCapacity)}</span>
                    </div>
                  </div>
                )}

                {/* Battery Specs - Minimal List */}
                <div className="space-y-1 rounded bg-muted/10 p-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Technology</span>
                    <span className="font-medium">{technology}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Cycles</span>
                    <span className="font-medium">{cycleCount}</span>
                  </div>
                  {manufacturingDate > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Mfg. Date</span>
                      <span className="font-medium">
                        {formatDate(manufacturingDate)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Hardware Details - Compact Table */}
                <div className="overflow-auto rounded bg-muted/5 p-2">
                  <div className="mb-2 font-medium text-muted-foreground text-xs">
                    Hardware Details
                  </div>
                  <div className="space-y-1">
                    {Object.entries(batteryData)
                      .filter(
                        ([key]) =>
                          !(
                            key.includes("Time when") ||
                            key.includes("The last")
                          )
                      )
                      .sort(([a], [b]) => a.localeCompare(b))
                      .slice(0, 8) // Show only first 8 items to save space
                      .map(([key, value]) => (
                        <div className="flex justify-between text-xs" key={key}>
                          <span className="max-w-[60%] truncate text-muted-foreground">
                            {key}
                          </span>
                          <span className="max-w-[40%] truncate text-right font-medium">
                            {String(value)}
                          </span>
                        </div>
                      ))}
                    {Object.keys(batteryData).length > 8 && (
                      <div className="pt-1 text-center text-muted-foreground text-xs">
                        ... and {Object.keys(batteryData).length - 8} more
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Resizable Divider */}
          <div
            className="relative cursor-col-resize bg-gray-300 transition-colors hover:bg-gray-400"
            onMouseDown={handleMouseDown}
            style={{ width: "0.5px" }}
          />

          {/* Battery Right - Coming Soon */}
          <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-muted border-dashed">
            <div className="space-y-2 text-center">
              <Battery className="mx-auto h-16 w-16 text-muted-foreground" />
              <h2 className="font-semibold text-muted-foreground text-xl">
                Coming Soon
              </h2>
              <p className="text-muted-foreground text-sm">
                Advanced battery analytics and insights
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/batteries")({
  component: BatteriesPage,
});
