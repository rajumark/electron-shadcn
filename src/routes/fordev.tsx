import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ADBPathDisplay } from "@/components/adb-path-display";
import { useSelectedDevice } from "@/hooks/use-selected-device";

function ForDevPage() {
  const { t } = useTranslation();
  const { selectedDevice } = useSelectedDevice();

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <h1 className="font-bold text-4xl">ForDev</h1>
        <p className="text-muted-foreground">Developer Tools & Information</p>
        
        <div className="w-full max-w-2xl mt-8 space-y-6">
          <ADBPathDisplay />
          
          {selectedDevice && (
            <div className="p-4 bg-muted rounded-lg border">
              <h3 className="text-md font-semibold mb-2">Selected Device</h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Device ID:</span>
                  <span className="font-mono bg-background px-2 py-1 rounded border">
                    {selectedDevice.id}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Device Name:</span>
                  <span className="font-mono bg-background px-2 py-1 rounded border">
                    {selectedDevice.name}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/fordev")({
  component: ForDevPage,
});
