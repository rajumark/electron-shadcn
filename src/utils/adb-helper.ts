import { exec, spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import { access, chmod, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import { app } from "electron";
import { existsSync } from "node:fs";

const execAsync = promisify(exec);

// Cache for ADB commands to avoid repeated calls
const commandCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

// Debounce function to prevent rapid successive calls
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const PLATFORM_TOOLS_URL = {
  win32:
    "https://dl.google.com/android/repository/platform-tools-latest-windows.zip",
  darwin:
    "https://dl.google.com/android/repository/platform-tools-latest-darwin.zip",
  linux:
    "https://dl.google.com/android/repository/platform-tools-latest-linux.zip",
} as const;

const platformToolsPath = join(app.getPath("userData"), "platform-tools");

export const ADBHelper = {
  async checkADBReady(): Promise<boolean> {
    try {
      const adbPath = this.getADBPath();
      await access(adbPath);

      return new Promise((resolve) => {
        const adb = spawn(adbPath, ["version"], { stdio: "pipe" });
        adb.on("close", (code) => {
          resolve(code === 0);
        });
        adb.on("error", () => {
          resolve(false);
        });
      });
    } catch {
      return false;
    }
  },

  async downloadADB(
    progressCallback?: (progress: number) => void
  ): Promise<void> {
    const platform = process.platform as keyof typeof PLATFORM_TOOLS_URL;
    const url = PLATFORM_TOOLS_URL[platform];

    if (!url) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    const tempDir = join(app.getPath("temp"), "platform-tools-temp");

    try {
      // Clean up any existing temp directory
      await this.cleanupTempDir(tempDir);

      // Create fresh temp directory
      await mkdir(tempDir, { recursive: true });
      await mkdir(platformToolsPath, { recursive: true });

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Failed to download platform-tools: ${response.statusText}`
        );
      }

      const totalSize = Number(response.headers.get("content-length")) || 0;
      let downloadedSize = 0;

      const zipPath = join(tempDir, "platform-tools.zip");
      const writeStream = createWriteStream(zipPath);

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get response body reader");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        downloadedSize += value.length;
        const progress = totalSize > 0 ? (downloadedSize / totalSize) * 100 : 0;
        progressCallback?.(Math.round(progress));

        writeStream.write(value);
      }

      writeStream.end();

      await new Promise((resolve, reject) => {
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });

      // Extract to temp directory first
      await this.extractToTemp(zipPath, tempDir);

      // Move files to final location
      await this.moveFromTempToFinal(tempDir, platformToolsPath);

      // Set executable permissions
      if (platform === "darwin" || platform === "linux") {
        await this.setExecutablePermissions();
      }
    } catch (error) {
      throw new Error(
        `ADB download failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      // Always clean up temp directory
      await this.cleanupTempDir(tempDir);
    }
  },

  async cleanupTempDir(tempDir: string): Promise<void> {
    try {
      await rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  },

  async extractToTemp(zipPath: string, tempDir: string): Promise<void> {
    const platform = process.platform;

    if (platform === "win32") {
      try {
        await execAsync("where powershell");
        await execAsync(
          `Expand-Archive -Path "${zipPath}" -DestinationPath "${tempDir}" -Force`,
          { shell: "powershell.exe" }
        );
      } catch {
        throw new Error(
          "Failed to extract ZIP file. PowerShell is required on Windows."
        );
      }
    } else {
      try {
        await execAsync(`unzip -o "${zipPath}" -d "${tempDir}"`);
      } catch {
        throw new Error(
          "Failed to extract ZIP file. unzip command is required on macOS/Linux."
        );
      }
    }
  },

  async moveFromTempToFinal(tempDir: string, finalDir: string): Promise<void> {
    const platform = process.platform;
    const extractedPath = join(tempDir, "platform-tools");

    try {
      // Check if platform-tools directory exists in temp
      await access(extractedPath);

      if (platform === "win32") {
        // Windows: Use robocopy for reliable file operations
        await execAsync(`robocopy "${extractedPath}" "${finalDir}" /E /MOVE`, {
          shell: "cmd.exe",
        });
      } else {
        // macOS/Linux: Use standard mv command
        await execAsync(`mv "${extractedPath}"/* "${finalDir}/"`);
      }

      // Remove empty platform-tools directory from temp
      await rm(extractedPath, { recursive: true, force: true });
    } catch (error) {
      // If the nested directory doesn't exist, files might be directly in tempDir
      try {
        // Move all files from tempDir to finalDir
        if (platform === "win32") {
          await execAsync(`robocopy "${tempDir}" "${finalDir}" /E /MOVE`, {
            shell: "cmd.exe",
          });
        } else {
          await execAsync(`mv "${tempDir}"/* "${finalDir}/"`);
        }
      } catch (moveError) {
        console.warn("Failed to move files from temp directory:", moveError);
        throw new Error("Failed to organize extracted files");
      }
    }
  },

  async setExecutablePermissions(): Promise<void> {
    const adbPath = this.getADBPath();
    try {
      await chmod(adbPath, "755");
    } catch (error) {
      console.warn("Failed to set executable permissions for ADB:", error);
    }
  },

  getADBPath(): string {
    const platform = process.platform;
    const adbExecutable = platform === "win32" ? "adb.exe" : "adb";
    
    // First try the bundled platform-tools path
    const bundledPath = join(platformToolsPath, adbExecutable);
    if (existsSync(bundledPath)) {
      return bundledPath;
    }
    
    // Fallback to system PATH (for development/testing)
    try {
      const { execSync } = require('child_process');
      const systemPath = execSync('which adb', { encoding: 'utf8' }).trim();
      if (systemPath && existsSync(systemPath)) {
        return systemPath;
      }
    } catch (error) {
      // ADB not found in PATH
    }
    
    // Return bundled path as last resort (will show error if it doesn't exist)
    return bundledPath;
  },

  executeADBCommand(
    args: string[],
    options?: {
      useCache?: boolean;
    },
  ): Promise<string> {
    const useCache = options?.useCache ?? true;
    const cacheKey = JSON.stringify(args);
    const now = Date.now();

    if (useCache) {
      const cached = commandCache.get(cacheKey);
      if (cached && now - cached.timestamp < CACHE_DURATION) {
        return Promise.resolve(cached.data);
      }
    }

    const adbPath = this.getADBPath();
    console.log('=== DEBUG: ADB Path exists:', existsSync(adbPath));
    console.log('=== DEBUG: ADB Path:', adbPath);

    return new Promise((resolve, reject) => {
      const adb = spawn(adbPath, args, { 
        stdio: "pipe",
        // Add timeout to prevent hanging
        timeout: 30000 
      });
      
      let stdout = "";
      let stderr = "";

      adb.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      adb.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      adb.on("close", (code) => {
        console.log('=== DEBUG: ADB Process closed with code:', code);
        console.log('=== DEBUG: ADB stderr:', stderr);
        if (code === 0) {
          if (useCache) {
            commandCache.set(cacheKey, { data: stdout, timestamp: now });

            if (commandCache.size > 100) {
              const cutoff = now - CACHE_DURATION;
              for (const [key, value] of commandCache.entries()) {
                if (value.timestamp < cutoff) {
                  commandCache.delete(key);
                }
              }
            }
          }

          resolve(stdout);
        } else {
          reject(new Error(`ADB command failed with code ${code}: ${stderr}`));
        }
      });

      adb.on("error", (error) => {
        console.error('=== DEBUG: ADB Process error:', error);
        reject(new Error(`Failed to execute ADB command: ${error.message}`));
      });

      // Handle timeout
      adb.on("timeout", () => {
        console.error('=== DEBUG: ADB Process timeout');
        adb.kill();
        reject(new Error("ADB command timed out after 30 seconds"));
      });
    });
  },

  // Debounced version for package listing to prevent rapid calls
  executeADBCommandDebounced: debounce(function(this: any, args: string[]) {
    return this.executeADBCommand(args);
  }, 500),

  // Clear cache method
  clearCache(): void {
    commandCache.clear();
  },

  // Get cache size for monitoring
  getCacheSize(): number {
    return commandCache.size;
  },
};
