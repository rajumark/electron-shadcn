import { useState, useEffect } from "react";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { ipc } from "@/ipc/manager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Monitor, RotateCw, Smartphone } from "lucide-react";
import { toast } from "sonner";

interface DisplayInfo {
  displayInfo: string;
  screenSize: string;
  screenDensity: string;
  displayMetrics: string;
  orientation: string;
  physicalDisplayInfo: string;
  refreshRate: string;
  colorMode: string;
  hdrCapabilities: string;
  displayState: string;
  supportedModes: string;
  displayCutout: string;
}

export default function DisplayInfo() {
  const selectedDevice = useSelectedDevice((state) => state.selectedDevice);
  const [displayData, setDisplayData] = useState<DisplayInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedDevice) {
      fetchDisplayInfo();
    }
  }, [selectedDevice]);

  const fetchDisplayInfo = async () => {
    if (!selectedDevice || isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      // Basic commands that should work
      const [
        displayInfoResult,
        screenSizeResult,
        screenDensityResult,
        displayMetricsResult
      ] = await Promise.all([
        ipc.client.adb.executeADBCommand({
          args: ["-s", selectedDevice.id, "shell", "dumpsys", "display"],
          useCache: false
        }),
        ipc.client.adb.executeADBCommand({
          args: ["-s", selectedDevice.id, "shell", "wm", "size"],
          useCache: false
        }),
        ipc.client.adb.executeADBCommand({
          args: ["-s", selectedDevice.id, "shell", "wm", "density"],
          useCache: false
        }),
        ipc.client.adb.executeADBCommand({
          args: ["-s", selectedDevice.id, "shell", "dumpsys", "window", "displays"],
          useCache: false
        })
      ]);

      // Parse    basic display info to extract specific details
      const displayInfoText = displayInfoResult || "";
      const orientation = displayInfoText.match(/orientation=\d+/)?.[0] || "Not found";
      const refreshRate = displayInfoText.match(/refreshRate=[\d.]+/)?.[0] || "Not found";
      const colorMode = displayInfoText.match(/colorMode=\d+/)?.[0] || "Not found";
      const displayState = displayInfoText.match(/mState=\w+/)?.[0] || "Not found";
      const physicalDisplayInfo = displayInfoText.match(/mBaseDisplayInfo[^=]+=[^{]+{[^}]+}/)?.[0] || "Not found";
      const hdrCapabilities = displayInfoText.match(/hdr=[^,\s]+/)?.[0] || "Not found";
      const supportedModes = displayInfoText.match(/supportedModes=[^,\s]+/)?.[0] || "Not found";
      const displayCutout = displayInfoText.match(/cutout=[^,\s]+/)?.[0] || "Not found";

      const displayInfo: DisplayInfo = {
        displayInfo: displayInfoText || "Failed to fetch",
        screenSize: screenSizeResult || "Failed to fetch",
        screenDensity: screenDensityResult || "Failed to fetch",
        displayMetrics: displayMetricsResult || "Failed to fetch",
        orientation,
        physicalDisplayInfo,
        refreshRate,
        colorMode,
        hdrCapabilities,
        displayState,
        supportedModes,
        displayCutout
      };

      setDisplayData(displayInfo);
    } catch (error) {
      console.error("Failed to fetch display info:", error);
      toast.error("Failed to fetch display information");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const captureScreenshot = async () => {
    if (!selectedDevice) {
      toast.error("No device selected");
      return;
    }

    try {
      const takeResult = await ipc.client.adb.takeScreenshot({ deviceId: selectedDevice.id });
      
      if (!takeResult.success) {
        throw new Error(takeResult.error || "Failed to take screenshot");
      }

      const base64Result = await ipc.client.adb.getScreenshotBase64({ deviceId: selectedDevice.id });
      
      if (!base64Result.success) {
        throw new Error(base64Result.error || "Failed to get screenshot data");
      }

      return `data:image/png;base64,${base64Result.output}`;
    } catch (error) {
      console.error("Screenshot capture error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to capture screenshot");
      return null;
    }
  };

  const [screenshot, setScreenshot] = useState<string | null>(null);

  useEffect(() => {
    if (selectedDevice) {
      const loadScreenshot = async () => {
        const screenshotData = await captureScreenshot();
        setScreenshot(screenshotData || null);
      };
      loadScreenshot();
    }
  }, [selectedDevice]);

  if (!selectedDevice) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Device Connected</h3>
          <p className="text-muted-foreground">Please connect a device to view display information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Left Side - Display Info */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <Button onClick={fetchDisplayInfo} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Display Information Cards */}
        <div className="space-y-4">
          {/* Screen Size */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Screen Size</CardTitle>
            </CardHeader>
            <CardContent>
              <pre 
                className="text-xs bg-muted p-2 rounded cursor-pointer hover:bg-muted/80" 
                onClick={() => copyToClipboard(displayData?.screenSize || "")}
                title="Click to copy"
              >
                {displayData?.screenSize || "No data"}
              </pre>
            </CardContent>
          </Card>

          {/* Screen Density */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Screen Density</CardTitle>
            </CardHeader>
            <CardContent>
              <pre 
                className="text-xs bg-muted p-2 rounded cursor-pointer hover:bg-muted/80" 
                onClick={() => copyToClipboard(displayData?.screenDensity || "")}
                title="Click to copy"
              >
                {displayData?.screenDensity || "No data"}
              </pre>
            </CardContent>
          </Card>

          {/* Display Metrics */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Display Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <pre 
                className="text-xs bg-muted p-2 rounded cursor-pointer hover:bg-muted/80 max-h-32 overflow-y-auto" 
                onClick={() => copyToClipboard(displayData?.displayMetrics || "")}
                title="Click to copy"
              >
                {displayData?.displayMetrics || "No data"}
              </pre>
            </CardContent>
          </Card>

          {/* Orientation */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Display Orientation</CardTitle>
            </CardHeader>
            <CardContent>
              <pre 
                className="text-xs bg-muted p-2 rounded cursor-pointer hover:bg-muted/80" 
                onClick={() => copyToClipboard(displayData?.orientation || "")}
                title="Click to copy"
              >
                {displayData?.orientation || "No data"}
              </pre>
            </CardContent>
          </Card>

          {/* Physical Display Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Physical Display Info</CardTitle>
            </CardHeader>
            <CardContent>
              <pre 
                className="text-xs bg-muted p-2 rounded cursor-pointer hover:bg-muted/80 max-h-32 overflow-y-auto" 
                onClick={() => copyToClipboard(displayData?.physicalDisplayInfo || "")}
                title="Click to copy"
              >
                {displayData?.physicalDisplayInfo || "No data"}
              </pre>
            </CardContent>
          </Card>

          {/* Refresh Rate */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Refresh Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <pre 
                className="text-xs bg-muted p-2 rounded cursor-pointer hover:bg-muted/80" 
                onClick={() => copyToClipboard(displayData?.refreshRate || "")}
                title="Click to copy"
              >
                {displayData?.refreshRate || "No data"}
              </pre>
            </CardContent>
          </Card>

          {/* Color Mode */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Color Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <pre 
                className="text-xs bg-muted p-2 rounded cursor-pointer hover:bg-muted/80" 
                onClick={() => copyToClipboard(displayData?.colorMode || "")}
                title="Click to copy"
              >
                {displayData?.colorMode || "No data"}
              </pre>
            </CardContent>
          </Card>

          {/* HDR Capabilities */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">HDR Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <pre 
                className="text-xs bg-muted p-2 rounded cursor-pointer hover:bg-muted/80" 
                onClick={() => copyToClipboard(displayData?.hdrCapabilities || "")}
                title="Click to copy"
              >
                {displayData?.hdrCapabilities || "No data"}
              </pre>
            </CardContent>
          </Card>

          {/* Display State */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Display State</CardTitle>
            </CardHeader>
            <CardContent>
              <pre 
                className="text-xs bg-muted p-2 rounded cursor-pointer hover:bg-muted/80" 
                onClick={() => copyToClipboard(displayData?.displayState || "")}
                title="Click to copy"
              >
                {displayData?.displayState || "No data"}
              </pre>
            </CardContent>
          </Card>

          {/* Supported Modes */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Supported Modes</CardTitle>
            </CardHeader>
            <CardContent>
              <pre 
                className="text-xs bg-muted p-2 rounded cursor-pointer hover:bg-muted/80 max-h-32 overflow-y-auto" 
                onClick={() => copyToClipboard(displayData?.supportedModes || "")}
                title="Click to copy"
              >
                {displayData?.supportedModes || "No data"}
              </pre>
            </CardContent>
          </Card>

          {/* Display Cutout */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Display Cutout</CardTitle>
            </CardHeader>
            <CardContent>
              <pre 
                className="text-xs bg-muted p-2 rounded cursor-pointer hover:bg-muted/80" 
                onClick={() => copyToClipboard(displayData?.displayCutout || "")}
                title="Click to copy"
              >
                {displayData?.displayCutout || "No data"}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Screenshot */}
      <div className="w-1/2 border-l border-border p-4">
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Device Screenshot
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full p-0">
            {!screenshot ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin" />
                  <p className="text-sm text-muted-foreground">Loading screenshot...</p>
                </div>
              </div>
            ) : (
              <div className="h-full overflow-auto flex items-center justify-center p-4">
                <img
                  src={screenshot}
                  alt="Device Screenshot"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
