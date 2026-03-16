import { AppDetailsActivities } from "@/components/app-details-activities";
import { AppDetailsApkFiles } from "@/components/app-details-apk-files";
import { AppDetailsBasics } from "@/components/app-details-basics";
import { AppDetailsDomain } from "@/components/app-details-domain";
import { AppDetailsMetadata } from "@/components/app-details-metadata";
import AppDetailsPermissions from "@/components/app-details-permissions";
import { AppDetailsProviders } from "@/components/app-details-providers";
import { AppDetailsQueries } from "@/components/app-details-queries";
import { AppDetailsSecurity } from "@/components/app-details-security";
import { AppDetailsServices } from "@/components/app-details-services";
import { AppDetailsStorage } from "@/components/app-details-storage";
import { AppDetailsSystem } from "@/components/app-details-system";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AppsRightSideProps {
  selectedPackage: string;
}

export const AppsRightSide: React.FC<AppsRightSideProps> = ({
  selectedPackage,
}) => {
  return (
    <div className="mr-2 mb-2 ml-0 min-h-full min-w-0 flex-1">
      {selectedPackage ? (
        <div className="flex h-full flex-col">
          {/* Package Name */}
          <div className="p-4 pb-2">
            <p className="break-all font-mono text-muted-foreground text-sm">
              {selectedPackage}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex-1 overflow-hidden">
            <Tabs className="flex h-full flex-col" defaultValue="basics">
              <TabsList
                className="mx-4 mt-0 max-h-32 flex-wrap overflow-y-auto"
                variant="line"
              >
                <TabsTrigger value="basics">App Info</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="providers">Providers</TabsTrigger>
                <TabsTrigger value="domain">Domain</TabsTrigger>
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
                <TabsTrigger value="queries">Queries</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                <TabsTrigger value="apk-files">APK Files</TabsTrigger>
                <TabsTrigger value="storage">Storage</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-auto">
                <TabsContent className="mt-0" value="basics">
                  <AppDetailsBasics />
                </TabsContent>
                <TabsContent className="mt-0" value="activities">
                  <AppDetailsActivities />
                </TabsContent>
                <TabsContent className="mt-0" value="services">
                  <AppDetailsServices />
                </TabsContent>
                <TabsContent className="mt-0" value="providers">
                  <AppDetailsProviders />
                </TabsContent>
                <TabsContent className="mt-0" value="domain">
                  <AppDetailsDomain />
                </TabsContent>
                <TabsContent className="mt-0" value="metadata">
                  <AppDetailsMetadata />
                </TabsContent>
                <TabsContent className="mt-0" value="queries">
                  <AppDetailsQueries />
                </TabsContent>
                <TabsContent className="mt-0" value="security">
                  <AppDetailsSecurity />
                </TabsContent>
                <TabsContent className="mt-0" value="system">
                  <AppDetailsSystem />
                </TabsContent>
                <TabsContent className="mt-0" value="permissions">
                  <AppDetailsPermissions packageName={selectedPackage} />
                </TabsContent>
                <TabsContent className="mt-0" value="apk-files">
                  <AppDetailsApkFiles />
                </TabsContent>
                <TabsContent className="mt-0" value="storage">
                  <AppDetailsStorage />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-gray-300" />
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground text-sm">
            Select an app from the left panel to view details here.
          </p>
        </div>
      )}
    </div>
  );
};
