import { os } from "@orpc/server";
import { z } from "zod";
import { ADBHelper } from "@/utils/adb-helper";

export const getPerformanceData = os
  .input(
    z.object({
      deviceId: z.string(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const { deviceId } = input;

      // Get CPU data
      const cpuStat = await ADBHelper.executeADBCommand([
        "-s", deviceId, "shell", "cat", "/proc/stat"
      ]);

      // Get memory data
      const memInfo = await ADBHelper.executeADBCommand([
        "-s", deviceId, "shell", "cat", "/proc/meminfo"
      ]);

      // Get battery data
      const batteryInfo = await ADBHelper.executeADBCommand([
        "-s", deviceId, "shell", "dumpsys", "battery"
      ]);

      // Get uptime
      const uptime = await ADBHelper.executeADBCommand([
        "-s", deviceId, "shell", "cat", "/proc/uptime"
      ]);

      // Get CPU temperature
      const thermalInfo = await ADBHelper.executeADBCommand([
        "-s", deviceId, "shell", "dumpsys", "thermalservice"
      ]);

      // Get CPU frequencies for all cores
      const cpuFreqPromises = [];
      for (let i = 0; i < 8; i++) { // Check up to 8 cores
        cpuFreqPromises.push(
          ADBHelper.executeADBCommand([
            "-s", deviceId, "shell", "cat", `/sys/devices/system/cpu/cpu${i}/cpufreq/scaling_cur_freq`
          ]).catch(() => "0") // Handle missing cores gracefully
        );
      }
      const cpuFreqs = await Promise.all(cpuFreqPromises);

      // Get top activity
      const topActivity = await ADBHelper.executeADBCommand([
        "-s", deviceId, "shell", "dumpsys", "activity"
      ]);

      // Get FPS data
      const surfaceFlinger = await ADBHelper.executeADBCommand([
        "-s", deviceId, "shell", "dumpsys", "SurfaceFlinger"
      ]);

      return {
        success: true,
        data: {
          cpuStat,
          memInfo,
          batteryInfo,
          uptime,
          thermalInfo,
          cpuFreqs,
          topActivity,
          surfaceFlinger,
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        data: null
      };
    }
  });

export const getTopPackage = os
  .input(
    z.object({
      deviceId: z.string(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const { deviceId } = input;
      
      const result = await ADBHelper.executeADBCommand([
        "-s", deviceId, "shell", "dumpsys", "activity"
      ]);

      // Parse top activity from dumpsys output
      const lines = result.split('\n');
      let topPackage = '';
      let topActivity = '';

      for (const line of lines) {
        if (line.includes('mResumedActivity')) {
          // Look for patterns like "mResumedActivity: ActivityRecord{1234567 u0 com.example.app/.MainActivity t12345}"
          const match = line.match(/mResumedActivity:.*?\s+([a-zA-Z0-9.]+\/[a-zA-Z0-9.]+)/);
          if (match) {
            const fullActivity = match[1].trim();
            const parts = fullActivity.split('/');
            if (parts.length >= 2) {
              topPackage = parts[0].trim();
              topActivity = parts[1].trim();
            }
          } else {
            // Fallback pattern matching
            const fallbackMatch = line.match(/ActivityRecord{[^}]*\s+([a-zA-Z0-9.]+)\//);
            if (fallbackMatch) {
              topPackage = fallbackMatch[1].trim();
              topActivity = 'MainActivity'; // Default activity name
            }
          }
          break;
        }
      }

      // If still no package found, try alternative approach
      if (!topPackage) {
        for (const line of lines) {
          if (line.includes('TaskRecord{') && line.includes('top=')) {
            const match = line.match(/top=ActivityRecord{[^}]*\s+([a-zA-Z0-9.]+)\//);
            if (match) {
              topPackage = match[1].trim();
              topActivity = 'MainActivity';
              break;
            }
          }
        }
      }

      console.log('=== DEBUG: Top package parsed:', { topPackage, topActivity, sampleLine: lines.find(l => l.includes('mResumedActivity')) });

      return {
        success: true,
        data: {
          name: topPackage,
          label: topActivity,
          pid: 0, // We'll need to implement PID extraction if needed
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        data: null
      };
    }
  });

export const getFps = os
  .input(
    z.object({
      deviceId: z.string(),
      packageName: z.string().optional(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const { deviceId, packageName } = input;
      
      const result = await ADBHelper.executeADBCommand([
        "-s", deviceId, "shell", "dumpsys", "SurfaceFlinger"
      ]);

      // Parse FPS from SurfaceFlinger output
      let fps = 0;
      
      // Method 1: Look for flips count
      const flipsMatch = result.match(/flips=(\d+)/);
      if (flipsMatch) {
        const flips = parseInt(flipsMatch[1]);
        // Simple FPS calculation - this would ideally track flips over time
        fps = Math.min(flips % 120, 120); // Cap at 120 for reasonable display
      }
      
      // Method 2: Look for refresh rate info
      const refreshMatch = result.match(/refresh-rate=([\d.]+)/);
      if (refreshMatch) {
        fps = Math.round(parseFloat(refreshMatch[1]));
      }
      
      // Method 3: Look for VSync period
      const vsyncMatch = result.match(/VSYNC period=([\d.]+)/);
      if (vsyncMatch && fps === 0) {
        const period = parseFloat(vsyncMatch[1]);
        fps = Math.round(1000000000 / period); // Convert nanoseconds to Hz
      }

      console.log('=== DEBUG: FPS parsed:', { fps, flips: flipsMatch?.[1], refresh: refreshMatch?.[1], vsync: vsyncMatch?.[1] });

      return {
        success: true,
        data: fps
      };
    } catch (error) {
      console.error('=== DEBUG: FPS error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        data: 0
      };
    }
  });

export const performance = {
  getPerformanceData,
  getTopPackage,
  getFps,
};
