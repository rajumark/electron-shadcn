import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProviderData {
  authority: string;
  exported?: boolean;
  grantUriPermissions?: boolean;
  initOrder?: number;
  multiprocess?: boolean;
  name: string;
  readPermission?: string;
  writePermission?: string;
}

interface ParsedProvidersData {
  authorities: Array<{
    authority: string;
    provider: ProviderData;
  }>;
  providers: ProviderData[];
  rawText: string;
}

export const AppDetailsProviders: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ui");

  // Mock data - in real implementation, this would come from parsed ADB output
  const mockData: ParsedProvidersData = {
    providers: [
      {
        name: "com.whatsapp/.media.contentprovider.MediaProvider",
        authority: "com.whatsapp.provider.media",
        exported: true,
        grantUriPermissions: false,
      },
      {
        name: "com.whatsapp/androidx.core.content.FileProvider",
        authority: "com.whatsapp.fileprovider",
        exported: false,
        grantUriPermissions: true,
      },
      {
        name: "com.whatsapp/.stickers.ui.storage.WhitelistPackQueryContentProvider",
        authority: "com.whatsapp.provider.sticker_whitelist_check",
        exported: true,
        readPermission: "com.whatsapp.sticker.READ",
      },
      {
        name: "com.whatsapp/.accountswitching.AccountSwitchingContentProvider",
        authority:
          "com.whatsapp.accountswitching.AccountSwitchingContentProvider",
        exported: false,
      },
      {
        name: "com.whatsapp/.registration.directmigration.MigrationContentProvider",
        authority: "com.whatsapp.provider.MigrationContentProvider",
        exported: false,
        writePermission: "com.whatsapp.permission.MIGRATION_CONTENT_PROVIDER",
      },
    ],
    authorities: [
      {
        authority: "com.whatsapp.provider.media",
        provider: {
          name: "com.whatsapp/.media.contentprovider.MediaProvider",
          authority: "com.whatsapp.provider.media",
          exported: true,
          grantUriPermissions: false,
        },
      },
      {
        authority: "com.whatsapp.fileprovider",
        provider: {
          name: "com.whatsapp/androidx.core.content.FileProvider",
          authority: "com.whatsapp.fileprovider",
          exported: false,
          grantUriPermissions: true,
        },
      },
    ],
    rawText: `Registered ContentProviders:
  com.whatsapp/.media.contentprovider.MediaProvider:
    Provider{95325c0 com.whatsapp/.media.contentprovider.MediaProvider}
  com.whatsapp/androidx.core.content.FileProvider:
    Provider{67c2f9 com.whatsapp/androidx.core.content.FileProvider}
  com.whatsapp/.registration.directmigration.MigrationContentProvider:
    Provider{5accb43 com.whatsapp/.registration.directmigration.MigrationContentProvider}

ContentProvider Authorities:
  [com.whatsapp.provider.media]:
    Provider{95325c0 com.whatsapp/.media.contentprovider.MediaProvider}
      applicationInfo=ApplicationInfo{f8b231f com.whatsapp}
  [com.whatsapp.fileprovider]:
    Provider{67c2f9 com.whatsapp/androidx.core.content.FileProvider}
      applicationInfo=ApplicationInfo{b00f6be com.whatsapp}`,
  };

  const renderProviderCard = (provider: ProviderData) => (
    <Card className="mb-4" key={provider.name}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-mono text-sm">
          {provider.name}
          {provider.exported !== undefined && (
            <Badge
              className="text-xs"
              variant={provider.exported ? "default" : "secondary"}
            >
              {provider.exported ? "Exported" : "Private"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
            Authority
          </h4>
          <Badge className="font-mono text-xs" variant="outline">
            {provider.authority}
          </Badge>
        </div>

        {provider.readPermission && (
          <div>
            <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
              Read Permission
            </h4>
            <Badge className="text-xs" variant="secondary">
              {provider.readPermission}
            </Badge>
          </div>
        )}

        {provider.writePermission && (
          <div>
            <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
              Write Permission
            </h4>
            <Badge className="text-xs" variant="destructive">
              {provider.writePermission}
            </Badge>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {provider.grantUriPermissions !== undefined && (
            <div>
              <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
                Grant URI Permissions
              </h4>
              <Badge
                className="text-xs"
                variant={provider.grantUriPermissions ? "default" : "secondary"}
              >
                {provider.grantUriPermissions ? "Yes" : "No"}
              </Badge>
            </div>
          )}

          {provider.multiprocess !== undefined && (
            <div>
              <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
                Multiprocess
              </h4>
              <Badge
                className="text-xs"
                variant={provider.multiprocess ? "default" : "secondary"}
              >
                {provider.multiprocess ? "Yes" : "No"}
              </Badge>
            </div>
          )}
        </div>

        {provider.initOrder !== undefined && (
          <div>
            <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
              Init Order
            </h4>
            <Badge className="text-xs" variant="outline">
              {provider.initOrder}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex h-full flex-col">
      <Tabs
        className="flex h-full flex-col"
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ui">UI View</TabsTrigger>
          <TabsTrigger value="raw">Raw Data</TabsTrigger>
        </TabsList>

        <TabsContent className="mt-0 flex-1" value="ui">
          <ScrollArea className="h-full">
            <div className="space-y-6 p-4">
              {/* All Providers */}
              <div>
                <h3 className="mb-3 font-semibold text-lg">
                  Content Providers
                </h3>
                {mockData.providers.map(renderProviderCard)}
              </div>

              {/* Authorities */}
              <div>
                <h3 className="mb-3 font-semibold text-lg">
                  Provider Authorities
                </h3>
                {mockData.authorities.map((authData) => (
                  <Card className="mb-4" key={authData.authority}>
                    <CardHeader>
                      <CardTitle className="font-mono text-sm">
                        {authData.authority}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2 text-muted-foreground text-sm">
                        Provider: {authData.provider.name}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">
                          {authData.provider.exported ? "Exported" : "Private"}
                        </Badge>
                        {authData.provider.readPermission && (
                          <Badge variant="secondary">
                            Read: {authData.provider.readPermission}
                          </Badge>
                        )}
                        {authData.provider.writePermission && (
                          <Badge variant="destructive">
                            Write: {authData.provider.writePermission}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent className="mt-0 flex-1" value="raw">
          <ScrollArea className="h-full">
            <div className="p-4">
              <pre className="overflow-auto rounded-lg bg-muted p-4 font-mono text-xs">
                {mockData.rawText}
              </pre>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
