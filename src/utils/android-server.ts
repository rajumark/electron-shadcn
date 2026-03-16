import { ADBHelper } from "./adb-helper";

export class AndroidServer {
  private deviceId: string;
  private isRunning = false;

  constructor(deviceId: string) {
    this.deviceId = deviceId;
  }

  async initialize(): Promise<boolean> {
    try {
      // Check if server is already running
      const isRunning = await this.checkServerRunning();
      if (isRunning) {
        this.isRunning = true;
        return true;
      }

      // Try to start a simple server using shell commands
      await this.startSimpleServer();
      this.isRunning = true;
      return true;
    } catch (error) {
      console.error("Failed to initialize Android server:", error);
      return false;
    }
  }

  private async checkServerRunning(): Promise<boolean> {
    try {
      const result = await ADBHelper.executeADBCommand([
        "-s",
        this.deviceId,
        "shell",
        "ps | grep aya || echo 'not_running'"
      ]);
      return !result.includes("not_running");
    } catch {
      return false;
    }
  }

  private async startSimpleServer(): Promise<void> {
    // Create a simple script that can extract app icons
    const iconExtractorScript = `# Simple icon extractor script
mkdir -p /data/local/tmp/aya/icons

extract_icon() {
    pkg="$1"
    
    # Get APK path
    apk_path=$(pm path "$pkg" | cut -d: -f2)
    if [ -z "$apk_path" ]; then
        echo "ERROR: APK not found"
        exit 1
    fi
    
    # Try to extract icon using aapt if available
    if command -v aapt >/dev/null 2>&1; then
        icon_info=$(aapt dump badging "$apk_path" | grep "application-icon:" | head -1)
        if [ -n "$icon_info" ]; then
            icon_path=$(echo "$icon_info" | sed "s/.*'\\([^']*\\)'.*/\\1/")
            if [ -f "$icon_path" ]; then
                cp "$icon_path" "/data/local/tmp/aya/icons/\${pkg}.png"
                echo "SUCCESS: Icon extracted to /data/local/tmp/aya/icons/\${pkg}.png"
                exit 0
            fi
        fi
    fi
    
    # Fallback: try to find any icon in the APK
    unzip -l "$apk_path" | grep -i "\\.(png|jpg|jpeg)$" | head -1 | awk '{print $4}' > /tmp/icon_file.txt
    if [ -s /tmp/icon_file.txt ]; then
        icon_file=$(cat /tmp/icon_file.txt)
        unzip -p "$apk_path" "$icon_file" > "/data/local/tmp/aya/icons/\${pkg}.png" 2>/dev/null
        if [ -f "/data/local/tmp/aya/icons/\${pkg}.png" ]; then
            echo "SUCCESS: Icon extracted to /data/local/tmp/aya/icons/\${pkg}.png"
            exit 0
        fi
    fi
    
    echo "ERROR: Could not extract icon"
    exit 1
}

# Listen for commands
while true; do
    if [ -f /data/local/tmp/aya/command ]; then
        command=$(cat /data/local/tmp/aya/command)
        pkg=$(cat /data/local/tmp/aya/package)
        
        case "$command" in
            "extract_icon")
                extract_icon "$pkg" > /data/local/tmp/aya/result 2>&1
                ;;
            "stop")
                break
                ;;
        esac
        
        rm -f /data/local/tmp/aya/command /data/local/tmp/aya/package
    fi
    sleep 1
done`;

    // Push and run the script
    await ADBHelper.executeADBCommand([
      "-s",
      this.deviceId,
      "shell",
      "mkdir -p /data/local/tmp/aya"
    ]);

    // Write the script to the device
    const scriptBase64 = Buffer.from(iconExtractorScript).toString('base64');
    await ADBHelper.executeADBCommand([
      "-s",
      this.deviceId,
      "shell",
      `echo "${scriptBase64}" | base64 -d > /data/local/tmp/aya/icon_extractor.sh`
    ]);

    await ADBHelper.executeADBCommand([
      "-s",
      this.deviceId,
      "shell",
      "chmod +x /data/local/tmp/aya/icon_extractor.sh"
    ]);

    // Start the server in background
    await ADBHelper.executeADBCommand([
      "-s",
      this.deviceId,
      "shell",
      "nohup /data/local/tmp/aya/icon_extractor.sh > /data/local/tmp/aya/server.log 2>&1 &"
    ]);
  }

  async extractAppIcon(packageName: string): Promise<string | null> {
    try {
      if (!this.isRunning) {
        await this.initialize();
      }

      // Send command to extract icon
      await ADBHelper.executeADBCommand([
        "-s",
        this.deviceId,
        "shell",
        `echo "extract_icon" > /data/local/tmp/aya/command && echo "${packageName}" > /data/local/tmp/aya/package`
      ]);

      // Wait for extraction to complete
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check result
      const result = await ADBHelper.executeADBCommand([
        "-s",
        this.deviceId,
        "shell",
        "cat /data/local/tmp/aya/result 2>/dev/null || echo 'NO_RESULT'"
      ]);

      if (result.includes("SUCCESS")) {
        // Get the icon file and convert to base64
        const iconPath = `/data/local/tmp/aya/icons/${packageName}.png`;
        const base64Result = await ADBHelper.executeADBCommand([
          "-s",
          this.deviceId,
          "shell",
          `base64 "${iconPath}" 2>/dev/null || echo 'FAILED'`
        ]);

        if (!base64Result.includes("FAILED")) {
          return `data:image/png;base64,${base64Result.trim()}`;
        }
      }

      return null;
    } catch (error) {
      console.error("Failed to extract app icon:", error);
      return null;
    }
  }

  async cleanup(): Promise<void> {
    try {
      await ADBHelper.executeADBCommand([
        "-s",
        this.deviceId,
        "shell",
        "rm -rf /data/local/tmp/aya"
      ]);
      this.isRunning = false;
    } catch (error) {
      console.error("Failed to cleanup Android server:", error);
    }
  }
}
