import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { ipc } from "@/ipc/manager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Battery, 
  BatteryFull, 
  BatteryLow, 
  BatteryMedium,
  Zap, 
  Thermometer, 
  RefreshCw, 
  Usb,
  Wifi,
  ZapOff,
  Info
} from "lucide-react";
import { toast } from "sonner";
 
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

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!(isDragging && containerRef.current)) {
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth =
      ((e.clientX - containerRect.left) / containerRect.width) * 100;

    if (newLeftWidth >= 20 && newLeftWidth <= 80) {
      setLeftWidth(newLeftWidth);
    }
  }, [isDragging]);

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
    const lines = rawOutput.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || !trimmedLine.includes(':')) continue;
      
      const [key, ...valueParts] = trimmedLine.split(':');
      const value = valueParts.join(':').trim();
      
      if (key && value) {
        const cleanKey = key.replace(/^\s+/, '').replace(/\s+$/, '');
        const cleanValue = value.replace(/^\s+/, '').replace(/\s+$/, '');
        
        // Try to parse as number, otherwise keep as string
        const numValue = Number(cleanValue);
        data[cleanKey] = isNaN(numValue) ? cleanValue : numValue;
      }
    }
    
    return data;
  };

  const fetchBatteryInfo = async () => {
    if (!selectedDevice) {
      setError('No device selected');
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
        toast.success('Battery information updated');
      } else {
        setError(response.error || 'Failed to fetch battery information');
        toast.error(response.error || 'Failed to fetch battery information');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
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
    if (level >= 90) return BatteryFull;
    if (level >= 60) return Battery;
    if (level >= 30) return BatteryMedium;
    return BatteryLow;
  };

  const getBatteryStatus = (status: number) => {
    switch (status) {
      case 1: return { text: 'Unknown', variant: 'secondary' as const };
      case 2: return { text: 'Charging', variant: 'default' as const };
      case 3: return { text: 'Discharging', variant: 'outline' as const };
      case 4: return { text: 'Not Charging', variant: 'secondary' as const };
      case 5: return { text: 'Fully Charged', variant: 'default' as const };
      default: return { text: 'Unknown', variant: 'secondary' as const };
    }
  };

  const getHealthText = (health: number) => {
    switch (health) {
      case 1: return 'Unknown';
      case 2: return 'Good';
      case 3: return 'Overheat';
      case 4: return 'Dead';
      case 5: return 'Over Voltage';
      case 6: return 'Unspecified Failure';
      case 7: return 'Cold';
      default: return 'Unknown';
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
    if (timestamp === 0) return 'Never';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getPowerSource = () => {
    if (!batteryData) return 'Unknown';
    
    const acPowered = batteryData['AC powered'];
    const usbPowered = batteryData['USB powered'];
    const wirelessPowered = batteryData['Wireless powered'];
    
    if (acPowered) return 'AC Power';
    if (usbPowered) return 'USB Power';
    if (wirelessPowered) return 'Wireless';
    return 'Battery';
  };

  const getPowerSourceIcon = () => {
    if (!batteryData) return ZapOff;
    
    const acPowered = batteryData['AC powered'];
    const usbPowered = batteryData['USB powered'];
    const wirelessPowered = batteryData['Wireless powered'];
    
    if (acPowered) return Zap;
    if (usbPowered) return Usb;
    if (wirelessPowered) return Wifi;
    return ZapOff;
  };

  if (!selectedDevice) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <Info className="h-12 w-12 text-muted-foreground" />
          <h1 className="font-bold text-4xl">No Device Selected</h1>
          <p className="text-muted-foreground">Please select a device to view battery information</p>
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
          <Button onClick={fetchBatteryInfo} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const level = Number(batteryData?.['level']) || 0;
  const status = Number(batteryData?.['status']) || 1;
  const health = Number(batteryData?.['health']) || 1;
  const temperature = Number(batteryData?.['temperature']) || 0;
  const voltage = Number(batteryData?.['voltage']) || 0;
  const chargeWatt = Number(batteryData?.['charge watt']) || 0;
  const fullCapacity = Number(batteryData?.['Full capacity']) || 0;
  const fullDesignCapacity = Number(batteryData?.['Full design capacity']) || 0;
  const cycleCount = Number(batteryData?.['cycle count']) || 0;
  const technology = batteryData?.['technology'] || 'Unknown';
  const manufacturingDate = Number(batteryData?.['manufacturing date property']) || 0;
  
  const BatteryIcon = getBatteryIcon(level);
  const PowerIcon = getPowerSourceIcon();
  const batteryStatus = getBatteryStatus(status);
  const healthText = getHealthText(health);
  const capacityPercentage = fullDesignCapacity > 0 ? (fullCapacity / fullDesignCapacity) * 100 : 0;

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex-1 overflow-hidden">
        <div className="relative flex flex-1 min-w-0 h-full" ref={containerRef}>
          {/* Battery Left - Current UI */}
          <div 
            className="flex flex-col gap-4 overflow-auto h-full"
            style={{ width: `${leftWidth}%` }}
          >
            {batteryData && (
              <>
                {/* Refresh Button */}
                <div className="flex justify-start">
                  <Button onClick={fetchBatteryInfo} disabled={isLoading} size="sm">
                    <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>

                {/* At-a-Glance Stats - Compact */}
                <div className="grid grid-cols-2 gap-2">
                  <Card className="p-3">
                    <div className="flex flex-col items-center">
                      <BatteryIcon className="h-6 w-6 mb-1 text-primary" />
                      <div className="text-xl font-bold">{level}%</div>
                      <Badge variant={batteryStatus.variant} className="text-xs mt-1">
                        {batteryStatus.text}
                      </Badge>
                    </div>
                  </Card>

                  <Card className="p-3">
                    <div className="flex flex-col items-center">
                      <Battery className="h-6 w-6 mb-1 text-green-600" />
                      <div className="text-xl font-bold">{healthText}</div>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {health}
                      </Badge>
                    </div>
                  </Card>

                  <Card className="p-3">
                    <div className="flex flex-col items-center">
                      <PowerIcon className="h-6 w-6 mb-1 text-blue-600" />
                      <div className="text-sm font-bold">{getPowerSource()}</div>
                      <Badge variant="outline" className="text-xs mt-1">
                        Power
                      </Badge>
                    </div>
                  </Card>

                  <Card className="p-3">
                    <div className="flex flex-col items-center">
                      <Thermometer className={`h-6 w-6 mb-1 ${
                        temperature > 400 ? 'text-red-600' : temperature > 300 ? 'text-orange-600' : 'text-blue-600'
                      }`} />
                      <div className="text-sm font-bold">{formatTemperature(temperature)}</div>
                      <Badge variant="outline" className="text-xs mt-1">
                        Temp
                      </Badge>
                    </div>
                  </Card>
                </div>

                {/* Live Telemetry - Compact */}
                <Card className="p-3">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Charging Telemetry
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-muted-foreground">Voltage</div>
                        <div className="text-sm font-semibold">{formatVoltage(voltage)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Power</div>
                        <div className="text-sm font-semibold">{formatPower(chargeWatt)}</div>
                      </div>
                    </div>
                    
                    {fullDesignCapacity > 0 && (
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Capacity</span>
                          <span>{capacityPercentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={capacityPercentage} className="h-1" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>{formatCapacity(fullCapacity)}</span>
                          <span>{formatCapacity(fullDesignCapacity)}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Stats - Compact */}
                <Card className="p-3">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Technology</span>
                      <span className="text-sm font-medium">{technology}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Cycles</span>
                      <span className="text-sm font-medium">{cycleCount}</span>
                    </div>
                    {manufacturingDate > 0 && (
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Mfg. Date</span>
                        <span className="text-sm font-medium">{formatDate(manufacturingDate)}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Hardware Details - Compact */}
                <Card className="p-3 flex-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Hardware Details</CardTitle>
                  </CardHeader>
                  <CardContent className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Property</TableHead>
                          <TableHead className="text-xs">Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(batteryData)
                          .filter(([key]) => !key.includes('Time when') && !key.includes('The last'))
                          .sort(([a], [b]) => a.localeCompare(b))
                          .map(([key, value]) => (
                            <TableRow key={key}>
                              <TableCell className="font-medium text-xs">{key}</TableCell>
                              <TableCell className="text-xs">{String(value)}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Resizable Divider */}
          <div
            className="relative cursor-col-resize bg-gray-300 hover:bg-gray-400 transition-colors"
            style={{ width: '0.5px' }}
            onMouseDown={handleMouseDown}
          />

          {/* Battery Right - Coming Soon */}
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
            <div className="text-center space-y-2">
              <Battery className="h-16 w-16 mx-auto text-muted-foreground" />
              <h2 className="text-xl font-semibold text-muted-foreground">Coming Soon</h2>
              <p className="text-sm text-muted-foreground">Advanced battery analytics and insights</p>
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
