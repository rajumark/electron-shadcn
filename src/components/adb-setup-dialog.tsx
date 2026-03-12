import { AlertCircle, CheckCircle, Download, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface ADBSetupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSetupComplete: () => void;
}

export function ADBSetupDialog({
  isOpen,
  onClose,
  onSetupComplete,
}: ADBSetupDialogProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    setError(null);
    setDownloadProgress(0);

    try {
      // Simulate progress updates during download
      const progressInterval = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      // Call the download function
      const { ipc } = await import("@/ipc/manager");
      await ipc.client.adb.downloadADB();

      clearInterval(progressInterval);
      setDownloadProgress(100);
      setIsComplete(true);

      setTimeout(() => {
        onSetupComplete();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download ADB");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-lg border border-border bg-background shadow-lg">
        <div className="flex items-center justify-between border-border border-b p-6">
          <h2 className="font-semibold text-lg">ADB Setup Required</h2>
          <Button
            className="h-6 w-6"
            disabled={isDownloading}
            onClick={onClose}
            size="icon"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          {isComplete ? (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <div className="text-center">
                <h3 className="mb-2 font-semibold text-lg">Setup Complete!</h3>
                <p className="text-muted-foreground text-sm">
                  ADB has been successfully installed and is ready to use.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-start space-x-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-500" />
                <div className="text-muted-foreground text-sm">
                  <p className="mb-2">
                    Android Debug Bridge (ADB) is required but not found on your
                    system.
                  </p>
                  <p>
                    Would you like to download and install it automatically?
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 p-3">
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}

              {isDownloading && (
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>Downloading platform-tools...</span>
                    <span>{Math.round(downloadProgress)}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  disabled={isDownloading}
                  onClick={onClose}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  className="flex items-center space-x-2"
                  disabled={isDownloading}
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                  <span>
                    {isDownloading ? "Downloading..." : "Download ADB"}
                  </span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
