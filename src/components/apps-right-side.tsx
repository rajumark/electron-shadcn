import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { AppDetailsBasics } from "@/components/app-details-basics";
import AppDetailsPermissions from "@/components/app-details-permissions";
import { AppDetailsApkFiles } from "@/components/app-details-apk-files";
import { AppDetailsStorage } from "@/components/app-details-storage";

interface AppsRightSideProps {
  selectedPackage: string;
}

export const AppsRightSide: React.FC<AppsRightSideProps> = ({
  selectedPackage,
}) => {
  return (
    <div className="mr-2 mb-2 ml-0 min-h-full flex-1 min-w-0">
      {selectedPackage ? (
        <div className="h-full flex flex-col">
          {/* Package Name */}
          <div className="p-4 pb-2">
            <p className="text-sm text-muted-foreground font-mono break-all">
              {selectedPackage}
            </p>
          </div>
          
          {/* Tabs */}
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="basics" className="h-full flex flex-col">
              <TabsList variant="line" className="mx-4 mt-0">
                <TabsTrigger value="basics">Basics</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                <TabsTrigger value="apk-files">APK Files</TabsTrigger>
                <TabsTrigger value="storage">Storage</TabsTrigger>
              </TabsList>
              
              <div className="flex-1 overflow-auto">
                <TabsContent value="basics" className="mt-0">
                  <AppDetailsBasics />
                </TabsContent>
                <TabsContent value="permissions" className="mt-0">
                  <AppDetailsPermissions packageName={selectedPackage} />
                </TabsContent>
                <TabsContent value="apk-files" className="mt-0">
                  <AppDetailsApkFiles />
                </TabsContent>
                <TabsContent value="storage" className="mt-0">
                  <AppDetailsStorage />
                </TabsContent>
              </div>
            </Tabs>
          </div>
          
          {/* Divider */}
          <div className="w-full h-px bg-gray-300" />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground text-sm">
            Select an app from the left panel to view details here.
          </p>
        </div>
      )}
    </div>
  );
};
