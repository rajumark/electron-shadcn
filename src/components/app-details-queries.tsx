import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface QueryData {
  componentName?: string;
  direction?: "queries" | "queried-by";
  packageName?: string;
  type: "via-package-name" | "via-component" | "via-interaction";
}

interface IntentQuery {
  action: string;
  categories?: string[];
  data?: string;
}

interface ParsedQueriesData {
  componentQueries: Array<{
    componentName: string;
    direction: "queries" | "queried-by";
  }>;
  intentQueries: IntentQuery[];
  interactionQueries: Array<{
    user: number;
    packages: string[];
    components: string[];
  }>;
  packageNameQueries: Array<{
    packageName: string;
    direction: "queries" | "queried-by";
  }>;
  rawText: string;
}

export const AppDetailsQueries: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ui");

  // Mock data - in real implementation, this would come from parsed ADB output
  const mockData: ParsedQueriesData = {
    packageNameQueries: [
      { packageName: "com.facebook.system", direction: "queried-by" },
      { packageName: "com.facebook.services", direction: "queried-by" },
      { packageName: "com.google.android.apps.maps", direction: "queries" },
      { packageName: "com.instagram.android", direction: "queries" },
      { packageName: "in.amazon.mShop.android.shopping", direction: "queries" },
      { packageName: "com.phonepe.app", direction: "queries" },
      { packageName: "net.one97.paytm", direction: "queries" },
    ],
    componentQueries: [
      { componentName: "com.google.android.gms", direction: "queried-by" },
      { componentName: "com.android.chrome", direction: "queries" },
      {
        componentName: "com.google.android.providers.media.module",
        direction: "queries",
      },
      { componentName: "com.instagram.android", direction: "queries" },
    ],
    intentQueries: [
      {
        action: "android.intent.action.VIEW",
        data: "https://messenger.com/...",
      },
      {
        action: "com.facebook.GET_PHONE_ID",
      },
      {
        action: "android.intent.action.VIEW",
        data: "content://*/...",
        categories: ["*/*"],
      },
      {
        action: "android.intent.action.SEND",
        data: "content://*/...",
        categories: ["*/*"],
      },
      {
        action: "android.intent.action.PICK",
        data: "content://*/...",
        categories: ["*/*"],
      },
      {
        action: "android.intent.action.MAIN",
        categories: ["android.intent.category.HOME"],
      },
      {
        action: "android.intent.action.SEND_MULTIPLE",
        data: "content://*/...",
        categories: ["*/*"],
      },
      {
        action: "android.intent.action.VIEW",
        categories: ["android.intent.category.BROWSABLE"],
        data: "https:/...",
      },
    ],
    interactionQueries: [
      {
        user: 0,
        packages: [
          "vendor.qti.frameworks.utils",
          "com.android.server.telecom",
          "com.android.settings",
          "android",
          "com.android.location.fused",
        ],
        components: [
          "com.android.chrome",
          "com.google.android.apps.maps",
          "com.android.systemui",
        ],
      },
    ],
    rawText: `Queries:
  system apps queryable: false
  queries via forceQueryable:
  queries via package name:
    com.facebook.system:
      com.whatsapp
    com.facebook.services:
      com.whatsapp
    com.google.android.apps.maps:
      com.whatsapp
    in.amazon.mShop.android.shopping:
      com.whatsapp
    com.phonepe.app:
      com.whatsapp
    net.one97.paytm:
      com.whatsapp
    com.instagram.android:
      com.whatsapp
  queries via component:
    com.google.android.gms:
      com.whatsapp
    com.android.chrome:
      com.whatsapp
    com.google.android.providers.media.module:
      com.whatsapp
  queriesIntents=[Intent { act=android.intent.action.VIEW dat=https://messenger.com/... }, Intent { act=com.facebook.GET_PHONE_ID }, Intent { act=android.intent.action.VIEW dat=content://*/... typ=*/* }, Intent { act=android.intent.action.SEND dat=content://*/... typ=*/* }, Intent { act=android.intent.action.PICK dat=content://*/... typ=*/* }, Intent { act=android.intent.action.MAIN cat=[android.intent.category.HOME] }, Intent { act=android.intent.action.SEND_MULTIPLE dat=content://*/... typ=*/* }, Intent { act=android.intent.action.VIEW cat=[android.intent.category.BROWSABLE] dat=https:/... }]
  queryable via interaction:
    User 0:
      [vendor.qti.frameworks.utils,com.android.server.telecom,com.android.settings,android,com.android.location.fused]:
        com.whatsapp
      [com.android.chrome,com.google.android.apps.maps,com.android.systemui]:
        com.whatsapp`,
  };

  const renderQueryCard = (query: QueryData, index: number) => (
    <Card className="mb-3" key={index}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="mb-2 font-mono text-sm">
              {query.packageName || query.componentName}
            </div>
            <div className="flex gap-2">
              <Badge className="text-xs" variant="outline">
                {query.type.replace("-", " ")}
              </Badge>
              <Badge
                className="text-xs"
                variant={
                  query.direction === "queries" ? "default" : "secondary"
                }
              >
                {query.direction === "queries" ? "Queries" : "Queried By"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderIntentCard = (intent: IntentQuery, index: number) => (
    <Card className="mb-3" key={index}>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-muted-foreground text-xs">
              Action:
            </h4>
            <Badge className="font-mono text-xs" variant="default">
              {intent.action}
            </Badge>
          </div>

          {intent.data && (
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-muted-foreground text-xs">
                Data:
              </h4>
              <Badge className="font-mono text-xs" variant="outline">
                {intent.data}
              </Badge>
            </div>
          )}

          {intent.categories && intent.categories.length > 0 && (
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-muted-foreground text-xs">
                Categories:
              </h4>
              <div className="flex flex-wrap gap-1">
                {intent.categories.map((category, idx) => (
                  <Badge className="text-xs" key={idx} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
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
              {/* Package Name Queries */}
              <div>
                <h3 className="mb-3 font-semibold text-lg">
                  Package Name Queries
                </h3>
                {mockData.packageNameQueries.map((query, index) =>
                  renderQueryCard({ ...query, type: "via-package-name" }, index)
                )}
              </div>

              {/* Component Queries */}
              <div>
                <h3 className="mb-3 font-semibold text-lg">
                  Component Queries
                </h3>
                {mockData.componentQueries.map((query, index) =>
                  renderQueryCard(
                    {
                      ...query,
                      type: "via-component",
                      componentName: query.componentName,
                    },
                    index
                  )
                )}
              </div>

              {/* Intent Queries */}
              <div>
                <h3 className="mb-3 font-semibold text-lg">Intent Queries</h3>
                {mockData.intentQueries.map(renderIntentCard)}
              </div>

              {/* Interaction Queries */}
              <div>
                <h3 className="mb-3 font-semibold text-lg">
                  Interaction Queries
                </h3>
                {mockData.interactionQueries.map((interaction, index) => (
                  <Card className="mb-4" key={index}>
                    <CardHeader>
                      <CardTitle className="text-sm">
                        User {interaction.user}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
                          Packages
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {interaction.packages.map((pkg, idx) => (
                            <Badge
                              className="font-mono text-xs"
                              key={idx}
                              variant="outline"
                            >
                              {pkg}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
                          Components
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {interaction.components.map((comp, idx) => (
                            <Badge
                              className="font-mono text-xs"
                              key={idx}
                              variant="secondary"
                            >
                              {comp}
                            </Badge>
                          ))}
                        </div>
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
