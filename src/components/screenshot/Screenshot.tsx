import { useState, useRef, useEffect } from "react";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { ipc } from "@/ipc/manager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  RotateCw, 
  Download, 
  Copy, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RefreshCw,
  Camera
} from "lucide-react";
import { toast } from "sonner";

interface ScreenshotData {
  data: string;
  url: string;
  width: number;
  height: number;
  size: number;
}

export default function Screenshot() {
  const [screenshot, setScreenshot] = useState<ScreenshotData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const selectedDevice = useSelectedDevice((state) => state.selectedDevice);

  useEffect(() => {
    // Auto-capture screenshot on component mount if device is selected
    if (selectedDevice) {
      captureScreenshot();
    }
  }, [selectedDevice]);

  const captureScreenshot = async () => {
    if (!selectedDevice) {
      toast.error("No device selected");
      return;
    }

    setIsLoading(true);
    try {
      // Take screenshot first
      const takeResult = await ipc.client.adb.takeScreenshot({ deviceId: selectedDevice.id });

      if (!takeResult.success) {
        throw new Error(takeResult.error || "Failed to take screenshot");
      }

      // Get screenshot as base64
      const base64Result = await ipc.client.adb.getScreenshotBase64({ deviceId: selectedDevice.id });

      if (!base64Result.success) {
        throw new Error(base64Result.error || "Failed to get screenshot data");
      }

      // Create image data URL
      const dataUrl = `data:image/png;base64,${base64Result.output}`;
      
      // Load image to get dimensions
      const img = new Image();
      img.onload = () => {
        setScreenshot({
          data: dataUrl,
          url: dataUrl,
          width: img.width,
          height: img.height,
          size: Math.round((base64Result.output.length * 3) / 4), // Approximate size
        });
        setIsLoading(false);
      };
      img.onerror = () => {
        throw new Error("Failed to load screenshot image");
      };
      img.src = dataUrl;

    } catch (error) {
      console.error("Screenshot capture error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to capture screenshot");
      setIsLoading(false);
    }
  };

  const saveScreenshot = () => {
    if (!screenshot) return;

    const link = document.createElement('a');
    link.href = screenshot.url;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    link.download = `screenshot-${timestamp}.png`;
    link.click();
    
    toast.success("Screenshot saved");
  };

  const copyScreenshot = async () => {
    if (!screenshot) return;

    try {
      // Convert data URL to blob
      const response = await fetch(screenshot.url);
      const blob = await response.blob();
      
      // Copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      
      toast.success("Screenshot copied to clipboard");
    } catch (error) {
      console.error("Copy error:", error);
      toast.error("Failed to copy screenshot");
    }
  };

  const rotateLeft = () => {
    setRotation((prev) => prev - 90);
  };

  const rotateRight = () => {
    setRotation((prev) => prev + 90);
  };

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.1));
  };

  const resetView = () => {
    setZoom(1);
    setRotation(0);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="h-full flex flex-col p-4 gap-4">
      {/* Toolbar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Screenshot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={captureScreenshot}
              disabled={!selectedDevice || isLoading}
              variant="outline"
              size="sm"
            >
              <RotateCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Capturing...' : 'Capture'}
            </Button>
            
            <Button
              onClick={saveScreenshot}
              disabled={!screenshot}
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Save
            </Button>
            
            <Button
              onClick={copyScreenshot}
              disabled={!screenshot}
              variant="outline"
              size="sm"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>

            <div className="w-px h-6 bg-border mx-1" />

            <Button
              onClick={rotateLeft}
              disabled={!screenshot}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={rotateRight}
              disabled={!screenshot}
              variant="outline"
              size="sm"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={zoomIn}
              disabled={!screenshot}
              variant="outline"
              size="sm"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={zoomOut}
              disabled={!screenshot}
              variant="outline"
              size="sm"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={resetView}
              disabled={!screenshot}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Info */}
          {screenshot && (
            <div className="text-sm text-muted-foreground">
              {screenshot.width}×{screenshot.height} PNG {formatFileSize(screenshot.size)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Screenshot Display */}
      <Card className="flex-1 overflow-hidden">
        <CardContent className="h-full p-0">
          {!selectedDevice ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No device selected</p>
                <p className="text-sm">Select a device to capture screenshots</p>
              </div>
            </div>
          ) : isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <RotateCw className="h-12 w-12 mx-auto mb-2 animate-spin" />
                <p>Capturing screenshot...</p>
              </div>
            </div>
          ) : !screenshot ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No screenshot captured</p>
                <p className="text-sm">Click "Capture" to take a screenshot</p>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-auto flex items-center justify-center p-4">
              <img
                ref={imageRef}
                src={screenshot.url}
                alt="Screenshot"
                className="max-w-full max-h-full object-contain transition-transform duration-200"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
