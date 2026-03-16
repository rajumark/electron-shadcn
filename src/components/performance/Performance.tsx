import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import LunaPerformanceMonitor from "luna-performance-monitor/react";
import { Battery, Cpu, MemoryStick, Zap } from "lucide-react";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { ipc } from "@/ipc/manager";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

interface PerformanceData {
  cpus: Array<{
    times: {
      user: number;
      nice: number;
      sys: number;
      idle: number;
      iowait: number;
      irq: number;
      softirq: number;
    };
    speed?: number;
  }>;
  cpuLoads: number[];
  cpuTemperature: number;
  memUsed: number;
  memTotal: number;
  batteryLevel: number;
  batteryTemperature: number;
  batteryVoltage: number;
  uptime: number;
}

interface TopPackage {
  name: string;
  label: string;
  pid: number;
}

function PerformancePage() {
  const { t } = useTranslation();
  const { selectedDevice } = useSelectedDevice();
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    cpus: [],
    cpuLoads: [],
    cpuTemperature: 0,
    memUsed: 0,
    memTotal: 0,
    batteryLevel: 0,
    batteryTemperature: 0,
    batteryVoltage: 0,
    uptime: 0,
  });
  const [topPackage, setTopPackage] = useState<TopPackage>({
    name: '',
    label: '',
    pid: 0,
  });
  const [fps, setFps] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dataRef = useRef(performanceData);

  const parseCpuStat = (cpuStat: string) => {
    const lines = cpuStat.split('\n');
    const cpus: any[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine.startsWith('cpu')) continue;
      if (trimmedLine === 'cpu') continue; // Skip aggregate line

      const parts = trimmedLine.split(/\s+/);
      if (parts.length < 8) continue;

      const cpu: any = {
        times: {
          user: parseFloat(parts[1]) || 0,
          nice: parseFloat(parts[2]) || 0,
          sys: parseFloat(parts[3]) || 0,
          idle: parseFloat(parts[4]) || 0,
          iowait: parseFloat(parts[5]) || 0,
          irq: parseFloat(parts[6]) || 0,
          softirq: parseFloat(parts[7]) || 0,
        }
      };

      cpus.push(cpu);
    }

    return cpus;
  };

  const parseMemInfo = (memInfo: string) => {
    const lines = memInfo.split('\n');
    let memTotal = 0;
    let memAvailable = 0;
    let memFree = 0;

    for (const line of lines) {
      if (line.startsWith('MemTotal:')) {
        memTotal = parseInt(line.split(/\s+/)[1]) * 1024;
      } else if (line.startsWith('MemAvailable:')) {
        memAvailable = parseInt(line.split(/\s+/)[1]) * 1024;
      } else if (line.startsWith('MemFree:')) {
        memFree = parseInt(line.split(/\s+/)[1]) * 1024;
      }
    }

    const memUsed = memTotal - (memAvailable || memFree);
    return { memTotal, memUsed };
  };

  const parseBatteryInfo = (batteryInfo: string) => {
    const lines = batteryInfo.split('\n');
    let level = 0;
    let temperature = 0;
    let voltage = 0;

    for (const line of lines) {
      if (line.includes('level:')) {
        level = parseInt(line.split(':')[1].trim());
      } else if (line.includes('temperature:')) {
        temperature = parseInt(line.split(':')[1].trim());
      } else if (line.includes('voltage:')) {
        voltage = parseInt(line.split(':')[1].trim());
      }
    }

    return { level, temperature, voltage };
  };

  const parseCpuTemperature = (thermalInfo: string) => {
    const lines = thermalInfo.split('\n');
    const cpuTemperatures: number[] = [];

    for (const line of lines) {
      if (line.includes('CPU') && line.includes('Temperature')) {
        const match = line.match(/mValue=([\d.]+)/);
        if (match) {
          cpuTemperatures.push(parseFloat(match[1]));
        }
      }
    }

    return cpuTemperatures.length > 0 
      ? cpuTemperatures.reduce((a, b) => a + b) / cpuTemperatures.length 
      : 0;
  };

  const parseUptime = (uptime: string) => {
    const [seconds] = uptime.split(' ');
    return Math.round(parseFloat(seconds) * 1000);
  };

  const calculateCpuLoads = (cpus: any[]) => {
    // Simplified CPU load calculation based on idle vs total time
    return cpus.map(cpu => {
      const { times } = cpu;
      const total = times.user + times.nice + times.sys + times.idle + 
                   times.iowait + times.irq + times.softirq;
      const idle = times.idle;
      const load = total > 0 ? ((total - idle) / total) * 100 : 0;
      return Math.min(Math.max(load, 0), 100); // Clamp between 0-100
    });
  };

  const fetchPerformanceData = async () => {
    if (!selectedDevice) {
      setError("No device selected");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await ipc.client.adb.performance.getPerformanceData({
        deviceId: selectedDevice.id,
      });

      if (response.success && response.data) {
        const { cpuStat, memInfo, batteryInfo, uptime, thermalInfo, cpuFreqs } = response.data;
        
        const cpus = parseCpuStat(cpuStat);
        const { memTotal, memUsed } = parseMemInfo(memInfo);
        const { level, temperature, voltage } = parseBatteryInfo(batteryInfo);
        const cpuTemperature = parseCpuTemperature(thermalInfo);
        const uptimeMs = parseUptime(uptime);
        const cpuLoads = calculateCpuLoads(cpus);

        // Add CPU speeds to the cpus array
        const cpuFreqNumbers = (cpuFreqs as string[]).map(freq => 
          parseInt(freq.trim()) ? Math.floor(parseInt(freq.trim()) / 1000) : 0
        );
        
        const cpusWithSpeed = cpus.map((cpu, idx) => ({
          ...cpu,
          speed: cpuFreqNumbers[idx] || 0
        }));

        const newData = {
          cpus: cpusWithSpeed,
          cpuLoads,
          cpuTemperature,
          memUsed,
          memTotal,
          batteryLevel: level,
          batteryTemperature: temperature,
          batteryVoltage: voltage,
          uptime: uptimeMs,
        };

        dataRef.current = newData;
        setPerformanceData(newData);

        // Fetch top package
        const topPackageResponse = await ipc.client.adb.performance.getTopPackage({
          deviceId: selectedDevice.id,
        });

        if (topPackageResponse.success && topPackageResponse.data) {
          setTopPackage(topPackageResponse.data);
        }

        // Fetch FPS
        const fpsResponse = await ipc.client.adb.performance.getFps({
          deviceId: selectedDevice.id,
          packageName: topPackageResponse.data?.name,
        });

        if (fpsResponse.success) {
          setFps(fpsResponse.data || 0);
        }

      } else {
        setError(response.error || "Failed to fetch performance data");
        toast.error(response.error || "Failed to fetch performance data");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDevice) {
      fetchPerformanceData();
      const interval = setInterval(fetchPerformanceData, 1000);
      return () => clearInterval(interval);
    }
  }, [selectedDevice]);

  const memData = useCallback(() => {
    return Math.round(dataRef.current.memUsed / 1024 / 1024);
  }, []);

  const cpuData = useCallback(() => {
    const cpuLoads = dataRef.current.cpuLoads;
    if (cpuLoads.length === 0) return 0;
    const cpuLoad = cpuLoads.reduce((sum, load) => sum + load, 0) / cpuLoads.length;
    return Math.floor(cpuLoad);
  }, []);

  const individualCpuData = useCallback((idx: number) => {
    return () => Math.round(dataRef.current.cpuLoads[idx] || 0);
  }, []);

  const fpsData = useCallback(() => fps, [fps]);

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const batteryLevel = `${performanceData.batteryLevel}%`;
  const batteryVoltage = `${(performanceData.batteryVoltage / 1000).toFixed(2)}V`;
  const batteryTemperature = `${(performanceData.batteryTemperature / 10).toFixed(1)}°C`;

  if (!selectedDevice) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <Cpu className="h-12 w-12 text-muted-foreground" />
          <h1 className="font-bold text-4xl">No Device Selected</h1>
          <p className="text-muted-foreground">
            Please select a device to view performance information
          </p>
        </div>
      </div>
    );
  }

  if (error && !performanceData.memTotal) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <Cpu className="h-12 w-12 text-destructive" />
          <h1 className="font-bold text-4xl">Performance Monitor</h1>
          <p className="text-destructive">{error}</p>
          <Button disabled={isLoading} onClick={fetchPerformanceData}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-with-toolbar flex h-full flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="panel-toolbar flex items-center justify-between border-b bg-muted/30 p-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            Uptime {formatDuration(performanceData.uptime)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">{batteryVoltage}</span>
            <span className="text-sm">{batteryTemperature}</span>
          </div>
          <div className="flex items-center gap-2">
            <Battery className="h-4 w-4" />
            <span className="text-sm font-medium">{batteryLevel}</span>
          </div>
          <Button disabled={isLoading} onClick={fetchPerformanceData} size="sm" variant="ghost">
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="panel-body flex-1 overflow-y-auto p-4">
        <div className="charts space-y-4">
          {/* Main CPU Chart */}
          <div>
            <LunaPerformanceMonitor
              title={`CPU ${performanceData.cpuTemperature.toFixed(1)}°C`}
              data={cpuData}
              theme="light"
              max={100}
              color="#10b981"
              height={80}
              unit="%"
            />
            {/* Individual CPU cores */}
            <div className="cpu-container mt-2 grid grid-cols-4 gap-1">
              {/* First row: CPU0-3 */}
              {performanceData.cpuLoads.slice(0, 4).map((load, idx) => (
                <div key={idx} className="min-w-[120px]">
                  <LunaPerformanceMonitor
                    title={`CPU${idx} ${performanceData.cpus[idx]?.speed || 0}MHz`}
                    data={individualCpuData(idx)}
                    theme="light"
                    max={100}
                    height={50}
                    color="#22c55e"
                    unit="%"
                  />
                </div>
              ))}
            </div>
            <div className="cpu-container mt-1 grid grid-cols-4 gap-1">
              {/* Second row: CPU4-7 */}
              {performanceData.cpuLoads.slice(4, 8).map((load, idx) => {
                const actualIdx = idx + 4;
                return (
                  <div key={actualIdx} className="min-w-[120px]">
                    <LunaPerformanceMonitor
                      title={`CPU${actualIdx} ${performanceData.cpus[actualIdx]?.speed || 0}MHz`}
                      data={individualCpuData(actualIdx)}
                      theme="light"
                      max={100}
                      height={50}
                      color="#22c55e"
                      unit="%"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Memory Chart */}
          <LunaPerformanceMonitor
            title={`Memory ${performanceData.memTotal > 0 ? Math.round((performanceData.memUsed / performanceData.memTotal) * 100) : 0}%`}
            data={memData}
            theme="light"
            smooth={false}
            color="#8b5cf6"
            height={80}
            unit="MB"
          />

          {/* FPS Chart */}
          <LunaPerformanceMonitor
            title={`FPS ${topPackage.label || topPackage.name || 'System'}`}
            data={fpsData}
            theme="light"
            smooth={false}
            height={80}
            color="#f97316"
          />
        </div>
      </div>
    </div>
  );
}

export default PerformancePage;
