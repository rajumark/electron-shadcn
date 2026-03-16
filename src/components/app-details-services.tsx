import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ServiceData {
  actions: string[];
  categories?: string[];
  exported?: boolean;
  name: string;
  permission?: string;
  priority?: string;
}

interface ParsedServicesData {
  backgroundServices: ServiceData[];
  boundServices: ServiceData[];
  rawText: string;
  services: ServiceData[];
}

export const AppDetailsServices: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ui");

  // Mock data - in real implementation, this would come from parsed ADB output
  const mockData: ParsedServicesData = {
    services: [
      {
        name: "com.whatsapp/.infra.push.GcmListenerService",
        actions: ["com.google.firebase.MESSAGING_EVENT"],
        exported: true,
      },
      {
        name: "com.whatsapp/.calling.telecom.SelfManagedConnectionService",
        actions: ["android.telecom.ConnectionService"],
        permission: "android.permission.BIND_TELECOM_CONNECTION_SERVICE",
        exported: false,
      },
      {
        name: "com.whatsapp/.contact.ui.sync.ContactsSyncAdapterService",
        actions: ["android.content.SyncAdapter"],
        exported: false,
      },
      {
        name: "com.whatsapp/.accountsync.AccountAuthenticatorService",
        actions: ["android.accounts.AccountAuthenticator"],
        exported: false,
      },
    ],
    backgroundServices: [
      {
        name: "com.whatsapp/.infra.push.GcmListenerService",
        actions: ["com.google.firebase.MESSAGING_EVENT"],
        exported: true,
      },
    ],
    boundServices: [
      {
        name: "com.whatsapp/.calling.telecom.SelfManagedConnectionService",
        actions: ["android.telecom.ConnectionService"],
        permission: "android.permission.BIND_TELECOM_CONNECTION_SERVICE",
        exported: false,
      },
    ],
    rawText: `Service Resolver Table:
  Non-Data Actions:
      com.google.firebase.MESSAGING_EVENT:
        953abc5 com.whatsapp/.infra.push.GcmListenerService filter 654591a
          Action: "com.google.firebase.MESSAGING_EVENT"
      android.telecom.ConnectionService:
        ccdb5d3 com.whatsapp/.calling.telecom.SelfManagedConnectionService filter 52ee510 permission android.permission.BIND_TELECOM_CONNECTION_SERVICE
          Action: "android.telecom.ConnectionService"
      android.content.SyncAdapter:
        7787d37 com.whatsapp/.contact.ui.sync.ContactsSyncAdapterService filter 3fe42a4
          Action: "android.content.SyncAdapter"`,
  };

  const renderServiceCard = (service: ServiceData) => (
    <Card className="mb-4" key={service.name}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-mono text-sm">
          {service.name}
          {service.exported !== undefined && (
            <Badge
              className="text-xs"
              variant={service.exported ? "default" : "secondary"}
            >
              {service.exported ? "Exported" : "Private"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {service.actions.length > 0 && (
          <div>
            <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
              Actions
            </h4>
            <div className="flex flex-wrap gap-1">
              {service.actions.map((action, idx) => (
                <Badge className="text-xs" key={idx} variant="secondary">
                  {action}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {service.categories && service.categories.length > 0 && (
          <div>
            <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
              Categories
            </h4>
            <div className="flex flex-wrap gap-1">
              {service.categories.map((category, idx) => (
                <Badge className="text-xs" key={idx} variant="outline">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {service.permission && (
          <div>
            <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
              Required Permission
            </h4>
            <Badge className="text-xs" variant="destructive">
              {service.permission}
            </Badge>
          </div>
        )}

        {service.priority && (
          <div>
            <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
              Priority
            </h4>
            <Badge className="text-xs" variant="outline">
              {service.priority}
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
              {/* All Services */}
              <div>
                <h3 className="mb-3 font-semibold text-lg">All Services</h3>
                {mockData.services.map(renderServiceCard)}
              </div>

              {/* Background Services */}
              {mockData.backgroundServices.length > 0 && (
                <div>
                  <h3 className="mb-3 font-semibold text-lg">
                    Background Services
                  </h3>
                  {mockData.backgroundServices.map(renderServiceCard)}
                </div>
              )}

              {/* Bound Services */}
              {mockData.boundServices.length > 0 && (
                <div>
                  <h3 className="mb-3 font-semibold text-lg">Bound Services</h3>
                  {mockData.boundServices.map(renderServiceCard)}
                </div>
              )}
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
