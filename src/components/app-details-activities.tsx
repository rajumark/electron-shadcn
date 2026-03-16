import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ActivityData {
  actions: string[];
  authorities?: string[];
  autoVerify?: boolean;
  categories: string[];
  mimeTypes?: string[];
  name: string;
  priority?: string;
  schemes?: string[];
}

interface ParsedActivitiesData {
  activities: ActivityData[];
  intentFilters: {
    nonDataActions: ActivityData[];
    mimeTypedActions: ActivityData[];
    schemes: Array<{
      scheme: string;
      activities: ActivityData[];
    }>;
  };
  rawText: string;
}

export const AppDetailsActivities: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ui");

  // Mock data - in real implementation, this would come from parsed ADB output
  const mockData: ParsedActivitiesData = {
    activities: [
      {
        name: "com.whatsapp/.Main",
        actions: ["android.intent.action.MAIN"],
        categories: [
          "android.intent.category.LAUNCHER",
          "android.intent.category.MULTIWINDOW_LAUNCHER",
        ],
      },
      {
        name: "com.whatsapp/.Conversation",
        actions: [
          "com.whatsapp.Conversation",
          "android.intent.action.VIEW",
          "android.intent.action.SENDTO",
        ],
        categories: [
          "android.intent.category.DEFAULT",
          "android.intent.category.BROWSABLE",
        ],
        schemes: ["sms", "smsto"],
      },
    ],
    intentFilters: {
      nonDataActions: [
        {
          name: "com.whatsapp/.Main",
          actions: ["android.intent.action.MAIN"],
          categories: ["android.intent.category.LAUNCHER"],
        },
      ],
      mimeTypedActions: [
        {
          name: "com.whatsapp/.contact.ui.picker.ContactPicker",
          actions: ["android.intent.action.SEND"],
          mimeTypes: ["*"],
        },
      ],
      schemes: [
        {
          scheme: "whatsapp",
          activities: [
            {
              name: "com.whatsapp/.TextAndDirectChatDeepLink",
              actions: ["android.intent.action.VIEW"],
              categories: [
                "android.intent.category.DEFAULT",
                "android.intent.category.BROWSABLE",
              ],
              authorities: ["send", "chat", "call"],
            },
          ],
        },
      ],
    },
    rawText: `Activity Resolver Table:
  Non-Data Actions:
      android.intent.action.MAIN:
        9c91a1d com.whatsapp/.Main filter 32492
          Action: "android.intent.action.MAIN"
          Category: "android.intent.category.LAUNCHER"
          Category: "android.intent.category.MULTIWINDOW_LAUNCHER"`,
  };

  const renderActivityCard = (activity: ActivityData) => (
    <Card className="mb-4" key={activity.name}>
      <CardHeader>
        <CardTitle className="font-mono text-sm">{activity.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activity.actions.length > 0 && (
          <div>
            <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
              Actions
            </h4>
            <div className="flex flex-wrap gap-1">
              {activity.actions.map((action, idx) => (
                <Badge className="text-xs" key={idx} variant="secondary">
                  {action}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {activity.categories.length > 0 && (
          <div>
            <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
              Categories
            </h4>
            <div className="flex flex-wrap gap-1">
              {activity.categories.map((category, idx) => (
                <Badge className="text-xs" key={idx} variant="outline">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {activity.schemes && activity.schemes.length > 0 && (
          <div>
            <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
              Schemes
            </h4>
            <div className="flex flex-wrap gap-1">
              {activity.schemes.map((scheme, idx) => (
                <Badge className="text-xs" key={idx} variant="default">
                  {scheme}://
                </Badge>
              ))}
            </div>
          </div>
        )}

        {activity.authorities && activity.authorities.length > 0 && (
          <div>
            <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
              Authorities
            </h4>
            <div className="flex flex-wrap gap-1">
              {activity.authorities.map((authority, idx) => (
                <Badge className="text-xs" key={idx} variant="outline">
                  {authority}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {activity.mimeTypes && activity.mimeTypes.length > 0 && (
          <div>
            <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
              MIME Types
            </h4>
            <div className="flex flex-wrap gap-1">
              {activity.mimeTypes.map((mimeType, idx) => (
                <Badge className="text-xs" key={idx} variant="secondary">
                  {mimeType}
                </Badge>
              ))}
            </div>
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
              {/* Main Activities */}
              <div>
                <h3 className="mb-3 font-semibold text-lg">Main Activities</h3>
                {mockData.activities.map(renderActivityCard)}
              </div>

              {/* Intent Filters */}
              <div>
                <h3 className="mb-3 font-semibold text-lg">Intent Filters</h3>

                {/* Non-Data Actions */}
                <div className="mb-6">
                  <h4 className="mb-2 font-medium text-md">Non-Data Actions</h4>
                  {mockData.intentFilters.nonDataActions.map(
                    renderActivityCard
                  )}
                </div>

                {/* MIME Typed Actions */}
                <div className="mb-6">
                  <h4 className="mb-2 font-medium text-md">
                    MIME Typed Actions
                  </h4>
                  {mockData.intentFilters.mimeTypedActions.map(
                    renderActivityCard
                  )}
                </div>

                {/* Schemes */}
                <div className="mb-6">
                  <h4 className="mb-2 font-medium text-md">URL Schemes</h4>
                  {mockData.intentFilters.schemes.map((schemeData) => (
                    <Card className="mb-4" key={schemeData.scheme}>
                      <CardHeader>
                        <CardTitle className="font-mono text-sm">
                          {schemeData.scheme}://
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {schemeData.activities.map(renderActivityCard)}
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
