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
          const match = line.match(/ActivityRecord{[^}]+([^}]+)([^}]+)/);
          if (match) {
            topActivity = match[1].trim();
            const parts = topActivity.split('/');
            if (parts.length > 0) {
              topPackage = parts[0];
            }
          }
          break;
        }
      }

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
      const match = result.match(/flips=(\d+)/);
      let fps = 0;

      if (match) {
        const flips = parseInt(match[1]);
        // This is a simplified FPS calculation - in a real implementation,
        // we'd track flips over time
        fps = Math.min(flips % 120, 120); // Cap at 120 for reasonable display
      }

      return {
        success: true,
        data: fps
      };
    } catch (error) {
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
