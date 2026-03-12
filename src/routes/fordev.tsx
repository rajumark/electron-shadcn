import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { ipc } from "@/ipc/manager";

function ForDevPage() {
  const { t } = useTranslation();
  const [adbPath, setAdbPath] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchADBPath = async () => {
      try {
        const path = await ipc.client.adb.getADBPath();
        setAdbPath(path || "ADB not found");
      } catch (error) {
        console.error("Failed to get ADB path:", error);
        setAdbPath("Error getting ADB path");
      } finally {
        setLoading(false);
      }
    };

    fetchADBPath();
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <h1 className="font-bold text-4xl">ForDev</h1>
        <p className="text-muted-foreground">Page name coming soon</p>
        
        <div className="mt-8 p-4 bg-muted rounded-lg border">
          <h2 className="text-lg font-semibold mb-2">ADB Information</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">ADB Path:</span>
              {loading ? (
                <span className="text-sm text-muted-foreground">Loading...</span>
              ) : (
                <span className="text-sm font-mono bg-background px-2 py-1 rounded border">
                  {adbPath}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/fordev")({
  component: ForDevPage,
});
