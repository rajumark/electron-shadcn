import { exec } from "node:child_process";
import { promisify } from "node:util";
import { os } from "@orpc/server";
import { z } from "zod";
import { ADBHelper } from "@/utils/adb-helper";
import { performance } from "./performance";
import { files } from "./files";

const execAsync = promisify(exec);

// Cache Aya server instances per device
const serverCache = new Map<string, any>();

export const checkADB = os.handler(async () => {
  return await ADBHelper.checkADBReady();
});

export const downloadADB = os.handler(async () => {
  return await ADBHelper.downloadADB();
});

export const executeADBCommand = os
  .input(
    z.object({
      args: z.array(z.string()),
      useCache: z.boolean().optional(),
    })
  )
  .handler(async ({ input }) => {
    return await ADBHelper.executeADBCommand(input.args, {
      useCache: input.useCache,
    });
  });

export const getADBPath = os.handler(() => {
  return ADBHelper.getADBPath();
});

export const getInstalledPackages = os
  .input(
    z.object({
      deviceId: z.string(),
      command: z.string().optional(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const command = input.command || "pm list packages";
      const commandParts = command.split(" ");

      const packages = await ADBHelper.executeADBCommand(
        ["-s", input.deviceId, "shell", ...commandParts],
        { useCache: true }
      );

      // Parse the output and return clean package names
      const packageList = packages
        .split("\n")
        .filter((line) => line.startsWith("package:"))
        .map((line) => line.replace("package:", "").trim())
        .filter((pkg) => pkg.length > 0);

      return packageList;
    } catch (error) {
      throw new Error(
        `Failed to get installed packages: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  });

export const clearADBCache = os.handler(() => {
  ADBHelper.clearCache();
  return { success: true };
});

export const getADBCacheSize = os.handler(() => {
  return { size: ADBHelper.getCacheSize() };
});

export const takeScreenshot = os
  .input(
    z.object({
      deviceId: z.string().optional(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const args = input.deviceId
        ? [
            "-s",
            input.deviceId,
            "shell",
            "screencap",
            "-p",
            "/sdcard/screenshot.png",
          ]
        : ["shell", "screencap", "-p", "/sdcard/screenshot.png"];

      const result = await ADBHelper.executeADBCommand(args);
      return { success: true, output: result };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  });

export const getScreenshotBase64 = os
  .input(
    z.object({
      deviceId: z.string().optional(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const args = input.deviceId
        ? [
            "-s",
            input.deviceId,
            "shell",
            "base64",
            "/sdcard/screenshot.png",
            "|",
            "tr",
            "-d",
            "'\\n'",
          ]
        : [
            "shell",
            "base64",
            "/sdcard/screenshot.png",
            "|",
            "tr",
            "-d",
            "'\\n'",
          ];

      const result = await ADBHelper.executeADBCommand(args);
      return { success: true, output: result.trim() };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  });

export const dumpUIXml = os
  .input(
    z.object({
      deviceId: z.string().optional(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const args = input.deviceId
        ? ["-s", input.deviceId, "shell", "uiautomator", "dump"]
        : ["shell", "uiautomator", "dump"];

      const result = await ADBHelper.executeADBCommand(args);
      return { success: true, output: result };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  });

export const getUIXml = os
  .input(
    z.object({
      deviceId: z.string().optional(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const args = input.deviceId
        ? ["-s", input.deviceId, "shell", "cat", "/sdcard/window_dump.xml"]
        : ["shell", "cat", "/sdcard/window_dump.xml"];

      const result = await ADBHelper.executeADBCommand(args);
      return { success: true, output: result };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  });

export const getCallLogs = os
  .input(
    z.object({
      deviceId: z.string(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const adbCommand = [
        "-s",
        input.deviceId,
        "shell",
        "content",
        "query",
        "--uri",
        "content://call_log/calls",
        "--projection",
        "_id:number:name:duration:date:type",
      ];

      console.log("=== DEBUG: Left side ADB Command:", adbCommand.join(" "));

      const result = await ADBHelper.executeADBCommand(adbCommand, {
        useCache: true,
      });

      console.log("=== DEBUG: Left side ADB Result:", result);
      console.log("=== DEBUG: Left side ADB Result length:", result?.length);

      return { success: true, data: result };
    } catch (error) {
      console.error("=== DEBUG: Left side ADB Error:", error);
      throw new Error(
        `Failed to get call logs: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  });

export const getCallLogDetails = os
  .input(
    z.object({
      deviceId: z.string(),
      callId: z.string(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const adbCommand = [
        "-s",
        input.deviceId,
        "shell",
        "content",
        "query",
        "--uri",
        "content://call_log/calls",
        "--where",
        `_id=${input.callId}`,
      ];

      console.log("=== DEBUG: ADB Command:", adbCommand.join(" "));

      const result = await ADBHelper.executeADBCommand(adbCommand, {
        useCache: true,
      });

      console.log("=== DEBUG: ADB Result:", result);
      console.log("=== DEBUG: ADB Result length:", result?.length);

      return { success: true, data: result };
    } catch (error) {
      console.error("=== DEBUG: ADB Error:", error);
      throw new Error(
        `Failed to get call log details: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  });

export const getCallHistoryByNumber = os
  .input(
    z.object({
      deviceId: z.string(),
      phoneNumber: z.string(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const adbCommand = [
        "-s",
        input.deviceId,
        "shell",
        "content",
        "query",
        "--uri",
        "content://call_log/calls",
        "--where",
        `number=\\'${input.phoneNumber}\\'`,
        "--projection",
        "_id:number:name:duration:date:type",
      ];

      console.log("=== DEBUG: History IPC Command:", adbCommand.join(" "));

      const result = await ADBHelper.executeADBCommand(adbCommand, {
        useCache: true,
      });

      console.log("=== DEBUG: History IPC Result:", result);
      console.log("=== DEBUG: History IPC Result length:", result?.length);

      return { success: true, data: result };
    } catch (error) {
      console.error("=== DEBUG: History IPC Error:", error);
      throw new Error(
        `Failed to get call history: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  });

export const executeIntentCommand = os
  .input(
    z.object({
      deviceId: z.string(),
      intentCommand: z.string(),
    })
  )
  .handler(async ({ input }) => {
    const adbPath = ADBHelper.getADBPath();
    const command = `${adbPath} -s ${input.deviceId} shell am start ${input.intentCommand}`;

    try {
      const { stdout } = await execAsync(command);
      return { success: true, output: stdout };
    } catch (error) {
      console.error("Intent command failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  });

export const getContactByPhone = os
  .input(
    z.object({
      deviceId: z.string(),
      phoneNumber: z.string(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const adbCommand = [
        "-s",
        input.deviceId,
        "shell",
        "content",
        "query",
        "--uri",
        `content://com.android.contacts/data/phones/filter/${input.phoneNumber}`,
      ];

      console.log(
        "=== DEBUG: Contact by phone ADB Command:",
        adbCommand.join(" ")
      );

      const result = await ADBHelper.executeADBCommand(adbCommand, {
        useCache: true,
      });

      console.log("=== DEBUG: Contact by phone ADB Result:", result);
      console.log(
        "=== DEBUG: Contact by phone ADB Result length:",
        result?.length
      );

      return { success: true, data: result };
    } catch (error) {
      console.error("=== DEBUG: Contact by phone ADB Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        data: null,
      };
    }
  });

export const getContactDetails = os
  .input(
    z.object({
      deviceId: z.string(),
      contactId: z.string(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const adbCommand = [
        "-s",
        input.deviceId,
        "shell",
        "content",
        "query",
        "--uri",
        "content://com.android.contacts/data",
        "--where",
        `contact_id=${input.contactId}`,
      ];

      console.log(
        "=== DEBUG: Contact details ADB Command:",
        adbCommand.join(" ")
      );

      const result = await ADBHelper.executeADBCommand(adbCommand, {
        useCache: true,
      });

      console.log("=== DEBUG: Contact details ADB Result:", result);
      console.log(
        "=== DEBUG: Contact details ADB Result length:",
        result?.length
      );

      return { success: true, data: result };
    } catch (error) {
      console.error("=== DEBUG: Contact details ADB Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        data: null,
      };
    }
  });

export const executeCommand = os
  .input(
    z.object({
      deviceId: z.string(),
      command: z.string(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const adbCommand = ["-s", input.deviceId, "shell", input.command];

      const result = await ADBHelper.executeADBCommand(adbCommand, {
        useCache: true,
      });
      return result;
    } catch (error) {
      throw new Error(
        `Failed to execute command: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  });

export const getBatteryInfo = os
  .input(
    z.object({
      deviceId: z.string(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const adbCommand = ["-s", input.deviceId, "shell", "dumpsys", "battery"];

      const result = await ADBHelper.executeADBCommand(adbCommand, {
        useCache: false,
      });
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        data: null,
      };
    }
  });

export const executeCustomADBCommand = os
  .input(
    z.object({
      command: z.string(),
      deviceId: z.string().optional(),
      includeDeviceId: z.boolean().default(false),
    })
  )
  .handler(async ({ input }) => {
    try {
      console.log("=== DEBUG: executeCustomADBCommand called with:", input);

      // Parse the command and handle shortcuts
      let parsedCommand = input.command.trim();

      // Handle shortcuts
      if (parsedCommand === "devices") {
        parsedCommand = "adb devices";
      } else if (!parsedCommand.startsWith("adb ")) {
        parsedCommand = `adb ${parsedCommand}`;
      }

      // Split command into parts
      const commandParts = parsedCommand.split(" ");

      // Remove 'adb' from the beginning if present
      if (commandParts[0] === "adb") {
        commandParts.shift();
      }

      // Build final command with device ID if needed
      let finalCommand: string[];
      if (input.includeDeviceId && input.deviceId) {
        finalCommand = ["-s", input.deviceId, ...commandParts];
      } else {
        finalCommand = commandParts;
      }

      console.log("=== DEBUG: Final ADB Command:", finalCommand);
      console.log("=== DEBUG: ADB Path:", ADBHelper.getADBPath());

      const result = await ADBHelper.executeADBCommand(finalCommand, {
        useCache: false,
      });
      console.log("=== DEBUG: ADB Result:", result);
      return { success: true, output: result };
    } catch (error) {
      console.error("=== DEBUG: Custom ADB Command Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        output: null,
      };
    }
  });

export const getDeviceOverview = os
  .input(
    z.object({
      deviceId: z.string(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const overview: Record<string, string | number | boolean> = {};

      // Get device properties
      const properties = [
        { key: 'name', command: 'getprop ro.product.name' },
        { key: 'brand', command: 'getprop ro.product.manufacturer' },
        { key: 'model', command: 'getprop ro.product.model' },
        { key: 'serialno', command: 'getprop ro.serialno' },
        { key: 'kernelVersion', command: 'uname -r' },
        { key: 'processor', command: 'getprop ro.product.cpu.abilist' },
        { key: 'abi', command: 'getprop ro.product.cpu.abi' },
        { key: 'wifi', command: 'dumpsys wifi | grep "Wi-Fi is" | head -1' },
        { key: 'ip', command: 'ip route get 1.1.1.1 | awk \'{print $7}\' | head -1' },
        { key: 'mac', command: 'cat /sys/class/net/wlan0/address 2>/dev/null || ip link show | grep -m1 ether | awk \'{print $2}\'' },
      ];

      for (const prop of properties) {
        try {
          const result = await ADBHelper.executeADBCommand([
            "-s", input.deviceId, "shell", prop.command
          ]);
          overview[prop.key] = result.trim();
        } catch (error) {
          overview[prop.key] = 'Unknown';
        }
      }

      // Get CPU info
      try {
        const cpuResult = await ADBHelper.executeADBCommand([
          "-s", input.deviceId, "shell", "cat /proc/cpuinfo | grep 'processor' | wc -l"
        ]);
        overview.cpuNum = parseInt(cpuResult.trim()) || 1;
      } catch (error) {
        overview.cpuNum = 1;
      }

      // Get memory info
      try {
        const memResult = await ADBHelper.executeADBCommand([
          "-s", input.deviceId, "shell", "cat /proc/meminfo | grep MemTotal"
        ]);
        const memMatch = memResult.match(/(\d+)/);
        overview.memTotal = memMatch ? parseInt(memMatch[1]) * 1024 : 0; // Convert KB to bytes
      } catch (error) {
        overview.memTotal = 0;
      }

      // Get storage info
      try {
        const storageResult = await ADBHelper.executeADBCommand([
          "-s", input.deviceId, "shell", "df /data | tail -1"
        ]);
        const storageParts = storageResult.trim().split(/\s+/);
        if (storageParts.length >= 4) {
          overview.storageTotal = parseInt(storageParts[1]) * 1024; // Convert KB to bytes
          overview.storageUsed = parseInt(storageParts[2]) * 1024; // Convert KB to bytes
        }
      } catch (error) {
        overview.storageTotal = 0;
        overview.storageUsed = 0;
      }

      // Get display info
      try {
        const densityResult = await ADBHelper.executeADBCommand([
          "-s", input.deviceId, "shell", "wm density"
        ]);
        const densityMatch = densityResult.match(/Physical density: (\d+)/);
        overview.density = densityMatch ? parseInt(densityMatch[1]) : 0;

        const sizeResult = await ADBHelper.executeADBCommand([
          "-s", input.deviceId, "shell", "wm size"
        ]);
        const sizeMatch = sizeResult.match(/Physical size: (\d+x\d+)/);
        overview.physicalResolution = sizeMatch ? sizeMatch[1] : 'Unknown';
        overview.physicalDensity = overview.density;
        overview.resolution = overview.physicalResolution;
      } catch (error) {
        overview.density = 0;
        overview.physicalResolution = 'Unknown';
        overview.physicalDensity = 0;
        overview.resolution = 'Unknown';
      }

      // Get font scale
      try {
        const fontScaleResult = await ADBHelper.executeADBCommand([
          "-s", input.deviceId, "shell", "settings get system font_scale"
        ]);
        overview.fontScale = parseFloat(fontScaleResult.trim()) || 1.0;
      } catch (error) {
        overview.fontScale = 1.0;
      }

      // Get Android version info
      try {
        const versionResult = await ADBHelper.executeADBCommand([
          "-s", input.deviceId, "shell", "getprop ro.build.version.release"
        ]);
        const sdkResult = await ADBHelper.executeADBCommand([
          "-s", input.deviceId, "shell", "getprop ro.build.version.sdk"
        ]);
        overview.androidVersion = versionResult.trim();
        overview.sdkVersion = parseInt(sdkResult.trim()) || 0;
      } catch (error) {
        overview.androidVersion = 'Unknown';
        overview.sdkVersion = 0;
      }

      // Check root status
      try {
        const rootResult = await ADBHelper.executeADBCommand([
          "-s", input.deviceId, "shell", "su -c 'echo root' 2>/dev/null"
        ]);
        overview.root = rootResult.trim() === 'root';
      } catch (error) {
        overview.root = false;
      }

      return { success: true, data: overview };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        data: null,
      };
    }
  });

export const root = os
  .input(
    z.object({
      deviceId: z.string(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const result = await ADBHelper.executeADBCommand([
        "-s", input.deviceId, "shell", "su -c 'echo root'"
      ]);
      return { success: true, rooted: result.trim() === 'root' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        rooted: false,
      };
    }
  });

export const restartAdbServer = os.handler(async () => {
  try {
    await ADBHelper.executeADBCommand(["kill-server"]);
    await ADBHelper.executeADBCommand(["start-server"]);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

export const openAdbCli = os.handler(async () => {
  try {
    const adbPath = ADBHelper.getADBPath();
    // This would need to be implemented based on the platform
    // For now, just return the path
    return { success: true, path: adbPath };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

export const adb = {
  checkADB,
  downloadADB,
  executeADBCommand,
  getADBPath,
  getInstalledPackages,
  clearADBCache,
  getADBCacheSize,
  takeScreenshot,
  getScreenshotBase64,
  dumpUIXml,
  getUIXml,
  getCallLogs,
  getCallLogDetails,
  getCallHistoryByNumber,
  executeIntentCommand,
  getContactByPhone,
  getContactDetails,
  executeCommand,
  getBatteryInfo,
  executeCustomADBCommand,
  getDeviceOverview,
  root,
  restartAdbServer,
  openAdbCli,
  performance,
  files,
};
