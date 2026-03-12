import { exec, spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import { access, chmod, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import { app } from "electron";

const execAsync = promisify(exec);

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

    try {
      await mkdir(platformToolsPath, { recursive: true });

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Failed to download platform-tools: ${response.statusText}`
        );
      }

      const totalSize = Number(response.headers.get("content-length")) || 0;
      let downloadedSize = 0;

      const zipPath = join(platformToolsPath, "platform-tools.zip");
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

      await this.extractZip(zipPath);

      if (platform === "darwin" || platform === "linux") {
        await this.setExecutablePermissions();
      }
    } catch (error) {
      throw new Error(
        `ADB download failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  async extractZip(zipPath: string): Promise<void> {
    const platform = process.platform;

    if (platform === "win32") {
      try {
        await execAsync("where powershell");
        await execAsync(
          `Expand-Archive -Path "${zipPath}" -DestinationPath "${platformToolsPath}" -Force`,
          { shell: "powershell.exe" }
        );

        // Move files from nested platform-tools directory
        const nestedPath = join(platformToolsPath, "platform-tools");
        try {
          await execAsync(`move "${nestedPath}\\*" "${platformToolsPath}"`, { shell: "cmd.exe" });
          await execAsync(`rmdir "${nestedPath}"`, { shell: "cmd.exe" });
        } catch (moveError) {
          console.warn("Failed to move files from nested directory:", moveError);
        }
      } catch {
        throw new Error("Failed to extract ZIP file. PowerShell is required on Windows.");
      }
    } else {
      try {
        await execAsync(`unzip -o "${zipPath}" -d "${platformToolsPath}"`);

        // Move files from nested platform-tools directory
        const nestedPath = join(platformToolsPath, "platform-tools");
        try {
          await execAsync(`mv "${nestedPath}"/* "${platformToolsPath}/"`);
          await execAsync(`rmdir "${nestedPath}"`);
        } catch (moveError) {
          console.warn("Failed to move files from nested directory:", moveError);
        }
      } catch {
        throw new Error("Failed to extract ZIP file. unzip command is required on macOS/Linux.");
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
    return join(platformToolsPath, adbExecutable);
  },

  executeADBCommand(args: string[]): Promise<string> {
    const adbPath = this.getADBPath();

    return new Promise((resolve, reject) => {
      const adb = spawn(adbPath, args, { stdio: "pipe" });
      let stdout = "";
      let stderr = "";

      adb.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      adb.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      adb.on("close", (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(`ADB command failed with code ${code}: ${stderr}`));
        }
      });

      adb.on("error", (error) => {
        reject(new Error(`Failed to execute ADB command: ${error.message}`));
      });
    });
  },
};
