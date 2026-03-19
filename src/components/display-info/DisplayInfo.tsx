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
  displayState: string;
  supportedModes: string;
  deviceInfo: string;
  activeRefreshRate: string;
  supportedRefreshRates: string;
  brightnessRange: string;
  roundedCorners: string;
  deviceModel: string;
  deviceManufacturer: string;
  androidVersion: string;
  sdkVersion: string;
  density: string;
  systemInsets: string;
  navigationInfo: string;
  dpiInfo: string;
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
      // Get additional device info
      const [
        modelResult,
        manufacturerResult,
        androidVersionResult,
        sdkVersionResult
      ] = await Promise.all([
        ipc.client.adb.executeADBCommand({
          args: ["-s", selectedDevice.id, "shell", "getprop", "ro.product.model"],
          useCache: false
        }),
        ipc.client.adb.executeADBCommand({
          args: ["-s", selectedDevice.id, "shell", "getprop", "ro.product.manufacturer"],
          useCache: false
        }),
        ipc.client.adb.executeADBCommand({
          args: ["-s", selectedDevice.id, "shell", "getprop", "ro.build.version.release"],
          useCache: false
        }),
        ipc.client.adb.executeADBCommand({
          args: ["-s", selectedDevice.id, "shell", "getprop", "ro.build.version.sdk"],
          useCache: false
        })
      ]);

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

      // Parse display info to extract specific details
      const displayInfoText = displayInfoResult || "";
      const displayMetricsText = displayMetricsResult || "";
      
      // Extract orientation from window displays
      const orientationMatch = displayMetricsText.match(/mDisplayRotation=(ROTATION_\w+)/);
      const currentAppOrientationMatch = displayMetricsText.match(/mCurrentAppOrientation=(SCREEN_ORIENTATION_\w+)/);
      const orientation = orientationMatch ? orientationMatch[0] : 
                         currentAppOrientationMatch ? currentAppOrientationMatch[0] : 
                         "orientation=0 (PORTRAIT)";
      
      // Extract refresh rate info
      const activeRefreshRateMatch = displayInfoText.match(/renderFrameRate ([\d.]+)/);
      const activeRefreshRate = activeRefreshRateMatch ? `renderFrameRate ${activeRefreshRateMatch[1]}` : "Not found";
      
      const supportedRefreshRatesMatch = displayInfoText.match(/supportedRefreshRates \[([\d., ]+)\]/);
      const supportedRefreshRates = supportedRefreshRatesMatch ? supportedRefreshRatesMatch[1] : "Not found";
      
      // Extract color mode
      const colorModeMatch = displayInfoText.match(/colorMode (\d+)/);
      const activeColorModeMatch = displayInfoText.match(/mActiveColorMode=(\d+)/);
      const colorMode = colorModeMatch ? `colorMode ${colorModeMatch[1]}` : "Not found";
      const activeColorMode = activeColorModeMatch ? `mActiveColorMode=${activeColorModeMatch[1]}` : "Not found";
      
      // Extract display state
      const displayStateMatch = displayInfoText.match(/mState=(\w+)/);
      const displayState = displayStateMatch ? displayStateMatch[0] : "Not found";
      
      // Extract HDR capabilities (removed from display but keeping for parsing)
      const hdrCapabilitiesMatch = displayInfoText.match(/hdrCapabilities\{[^}]+\}/);
      const hdrCapabilities = hdrCapabilitiesMatch ? hdrCapabilitiesMatch[0] : "Not found";
      
      // Extract supported modes from DisplayDeviceInfo
      const supportedModesMatch = displayInfoText.match(/supportedModes\s*\[([^\]]+)\]/);
      const supportedModes = supportedModesMatch ? supportedModesMatch[0] : "Not found";
      
      // Extract brightness range
      const brightnessMinMatch = displayInfoText.match(/brightnessMinimum ([\d.]+)/);
      const brightnessMaxMatch = displayInfoText.match(/brightnessMaximum ([\d.]+)/);
      const brightnessRange = (brightnessMinMatch && brightnessMaxMatch) ? 
        `brightnessMinimum ${brightnessMinMatch[1]}, brightnessMaximum ${brightnessMaxMatch[1]}` : "Not found";
      
      // Extract rounded corners
      const roundedCornersMatch = displayInfoText.match(/roundedCorners RoundedCorners\{[^}]+\}/);
      const roundedCorners = roundedCornersMatch ? roundedCornersMatch[0] : "Not found";
      
      // Extract device info
      const deviceInfoMatch = displayInfoText.match(/DisplayDeviceInfo\{"[^"]+"[^,]+, [\d x \d]+/);
      const deviceInfo = deviceInfoMatch ? deviceInfoMatch[0] : "Not found";
      
      // Physical display info
      const deviceWidthMatch = displayInfoText.match(/deviceWidth=(\d+)/);
      const deviceHeightMatch = displayInfoText.match(/deviceHeight=(\d+)/);
      const physicalDisplayInfo = (deviceWidthMatch && deviceHeightMatch) ? 
        `deviceWidth=${deviceWidthMatch[1]}, deviceHeight=${deviceHeightMatch[1]}` : "Not found";
      
      // Extract additional useful info
      const densityMatch = displayInfoText.match(/density (\d+)/);
      const density = densityMatch ? densityMatch[1] : "Not found";
      
      const aspectRatioMatch = displayInfoText.match(/mMinAspectRatio=([\d.]+).*mMaxAspectRatio=([\d.]+)/);
      const aspectRatio = aspectRatioMatch ? 
        `Min: ${aspectRatioMatch[1]}, Max: ${aspectRatioMatch[2]}` : "Not found";

      // Extract system insets and navigation info
      const statusBarHeightMatch = displayMetricsText.match(/statusBars.*frame=\[0,0-\[\d+,(\d+)\]/) ||
                                       displayInfoText.match(/type=statusBars.*frame=\[0,0-\[\d+,(\d+)\]/);
      const navigationBarHeightMatch = displayMetricsText.match(/navigationBars.*frame=\[0,(\d+)-\[\d+,\d+\]/) ||
                                           displayInfoText.match(/type=navigationBars.*frame=\[0,(\d+)-\[\d+,\d+\]/);
      const statusBarHeight = statusBarHeightMatch ? statusBarHeightMatch[1] : "115"; // Default fallback
      const navigationBarHeight = navigationBarHeightMatch ? navigationBarHeightMatch[1] : "59"; // Default fallback
      const systemInsets = `Status Bar: ${statusBarHeight}px, Navigation Bar: ${navigationBarHeight}px`;
      
      const navigationTypeMatch = displayMetricsText.match(/mHasBottomNavigationBar=(true|false)/);
      const navigationType = navigationTypeMatch ? 
        (navigationTypeMatch[1] === 'true' ? 'Bottom Navigation' : 'Side Navigation') : 'Bottom Navigation';
      const gestureNavigation = displayMetricsText.includes('mSystemGestureExclusion') || displayInfoText.includes('systemGestures');
      const navigationInfo = `${navigationType} (Gesture Navigation: ${gestureNavigation ? 'Yes' : 'No'})`;
      
      // Extract display cutout bounds for better UI development info (removed from display)
      const cutoutBoundsMatch = displayInfoText.match(/boundingRect=\{Bounds=\[Rect\([^\)]+\)\]/);
      const cutoutBounds = cutoutBoundsMatch ? cutoutBoundsMatch[0] : "No cutout";
      
      // Extract pixel density info
      const dpiMatch = displayInfoText.match(/(\d+\.\d+) x (\d+\.\d+) dpi/);
      const dpiInfo = dpiMatch ? `X: ${dpiMatch[1]}, Y: ${dpiMatch[2]}` : "Not found";

      const displayInfo: DisplayInfo = {
        displayInfo: displayInfoText || "Failed to fetch",
        screenSize: screenSizeResult || "Failed to fetch",
        screenDensity: screenDensityResult || "Failed to fetch",
        displayMetrics: displayMetricsText || "Failed to fetch",
        orientation,
        physicalDisplayInfo,
        refreshRate: activeRefreshRate,
        colorMode: `${colorMode} (${activeColorMode})`,
        displayState,
        supportedModes,
        deviceInfo,
        activeRefreshRate,
        supportedRefreshRates: supportedRefreshRates ? `supportedRefreshRates=[${supportedRefreshRates}]` : "Not found",
        brightnessRange,
        roundedCorners,
        deviceModel: modelResult || "Not found",
        deviceManufacturer: manufacturerResult || "Not found",
        androidVersion: androidVersionResult || "Not found",
        sdkVersion: sdkVersionResult || "Not found",
        density: density ? `density ${density}` : "Not found",
        systemInsets,
        navigationInfo,
        dpiInfo
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

          {/* Device Model Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Device Model</CardTitle>
            </CardHeader>
            <CardContent>
              <pre 
                className="text-xs bg-muted p-2 rounded cursor-pointer hover:bg-muted/80" 
                onClick={() => copyToClipboard(`${displayData?.deviceManufacturer} ${displayData?.deviceModel}` || "")}
                title="Click to copy"
              >
                {displayData?.deviceManufacturer} {displayData?.deviceModel}
              </pre>
            </CardContent>
          </Card>

          {/* Android Version */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Android Version</CardTitle>
            </CardHeader>
            <CardContent>
              <pre 
                className="text-xs bg-muted p-2 rounded cursor-pointer hover:bg-muted/80" 
                onClick={() => copyToClipboard(`Android ${displayData?.androidVersion} (API ${displayData?.sdkVersion})` || "")}
                title="Click to copy"
              >
                Android {displayData?.androidVersion} (API {displayData?.sdkVersion})
              </pre>
            </CardContent>
          </Card>

          {/* Device Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Display Device Info</CardTitle>
            </CardHeader>
            <CardContent>
              <pre 
                className="text-xs bg-muted p-2 rounded cursor-pointer hover:bg-muted/80" 
                onClick={() => copyToClipboard(displayData?.deviceInfo || "")}
                title="Click to copy"
              >
                {displayData?.deviceInfo || "No data"}
              </pre>
            </CardContent>
          </Card>

          {/* Active Refresh Rate */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Refresh Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <pre 
                className="text-xs bg-muted p-2 rounded cursor-pointer hover:bg-muted/80" 
                onClick={() => copyToClipboard(displayData?.activeRefreshRate || "")}
                title="Click to copy"
              >
                {displayData?.activeRefreshRate || "No data"}
              </pre>
            </CardContent>
          </Card>

          {/* Supported Refresh Rates */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Supported Refresh Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <pre 
                className="text-xs bg-muted p-2 rounded cursor-pointer hover:bg-muted/80" 
                onClick={() => copyToClipboard(displayData?.supportedRefreshRates || "")}
                title="Click to copy"
              >
                {displayData?.supportedRefreshRates || "No data"}
              </pre>
            </CardContent>
          </Card>

          {/* Brightness Range */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Brightness Range</CardTitle>
            </CardHeader>
            <CardContent>
              <pre 
                className="text-xs bg-muted p-2 rounded cursor-pointer hover:bg-muted/80" 
                onClick={() => copyToClipboard(displayData?.brightnessRange || "")}
                title="Click to copy"
              >
                {displayData?.brightnessRange || "No data"}
              </pre>
            </CardContent>
          </Card>

          {/* Density Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Display Density</CardTitle>
            </CardHeader>
            <CardContent>
              <pre 
                className="text-xs bg-muted p-2 rounded cursor-pointer hover:bg-muted/80" 
                onClick={() => copyToClipboard(displayData?.density || "")}
                title="Click to copy"
              >
                {displayData?.density || "No data"}
              </pre>
            </CardContent>
          </Card>

          {/* System Insets */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">System Insets</CardTitle>
            </CardHeader>
            <CardContent>
              <pre 
                className="text-xs bg-muted p-2 rounded cursor-pointer hover:bg-muted/80" 
                onClick={() => copyToClipboard(displayData?.systemInsets || "")}
                title="Click to copy"
              >
                {displayData?.systemInsets || "No data"}
              </pre>
            </CardContent>
          </Card>

          {/* DPI Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pixel Density (DPI)</CardTitle>
            </CardHeader>
            <CardContent>
              <pre 
                className="text-xs bg-muted p-2 rounded cursor-pointer hover:bg-muted/80" 
                onClick={() => copyToClipboard(displayData?.dpiInfo || "")}
                title="Click to copy"
              >
                {displayData?.dpiInfo || "No data"}
              </pre>
            </CardContent>
          </Card>

          {/* Navigation Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Navigation Info</CardTitle>
            </CardHeader>
            <CardContent>
              <pre 
                className="text-xs bg-muted p-2 rounded cursor-pointer hover:bg-muted/80" 
                onClick={() => copyToClipboard(displayData?.navigationInfo || "")}
                title="Click to copy"
              >
                {displayData?.navigationInfo || "No data"}
              </pre>
            </CardContent>
          </Card>

          {/* Rounded Corners */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rounded Corners</CardTitle>
            </CardHeader>
            <CardContent>
              <pre 
                className="text-xs bg-muted p-2 rounded cursor-pointer hover:bg-muted/80 max-h-32 overflow-y-auto" 
                onClick={() => copyToClipboard(displayData?.roundedCorners || "")}
                title="Click to copy"
              >
                {displayData?.roundedCorners || "No data"}
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
