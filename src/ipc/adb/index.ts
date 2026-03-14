import { os } from "@orpc/server";
import { z } from "zod";
import { ADBHelper } from "@/utils/adb-helper";

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
        [
          "-s",
          input.deviceId,
          "shell",
          ...commandParts,
        ],
        { useCache: true },
      );
      
      // Parse the output and return clean package names
      const packageList = packages
        .split("\n")
        .filter(line => line.startsWith("package:"))
        .map(line => line.replace("package:", "").trim())
        .filter(pkg => pkg.length > 0);
      
      return packageList;
    } catch (error) {
      throw new Error(`Failed to get installed packages: ${error instanceof Error ? error.message : "Unknown error"}`);
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
        ? ["-s", input.deviceId, "shell", "screencap", "-p", "/sdcard/screenshot.png"]
        : ["shell", "screencap", "-p", "/sdcard/screenshot.png"];
      
      const result = await ADBHelper.executeADBCommand(args);
      return { success: true, output: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
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
        ? ["-s", input.deviceId, "shell", "base64", "/sdcard/screenshot.png", "|", "tr", "-d", "'\\n'"]
        : ["shell", "base64", "/sdcard/screenshot.png", "|", "tr", "-d", "'\\n'"];
      
      const result = await ADBHelper.executeADBCommand(args);
      return { success: true, output: result.trim() };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
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
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
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
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
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
};
