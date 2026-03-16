import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DomainData {
  autoVerify?: boolean;
  domain: string;
  status?: string;
  verified: boolean;
}

interface ParsedDomainData {
  domains: DomainData[];
  packageName: string;
  rawText: string;
  signatures: string[];
  verificationState: {
    enabled: boolean;
    selectionState: {
      disabled: string[];
    };
  };
}

export const AppDetailsDomain: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ui");

  // Mock data - in real implementation, this would come from parsed ADB output
  const mockData: ParsedDomainData = {
    packageName: "com.whatsapp",
    domains: [
      {
        domain: "api.whatsapp.com",
        verified: true,
        autoVerify: true,
      },
      {
        domain: "www.whatsapp.com",
        verified: true,
        autoVerify: true,
      },
      {
        domain: "call.whatsapp.com",
        verified: true,
        autoVerify: true,
      },
      {
        domain: "wa.me",
        verified: true,
        autoVerify: true,
      },
      {
        domain: "chat.whatsapp.com",
        verified: true,
        autoVerify: true,
      },
      {
        domain: "b.whatsapp.com",
        verified: false,
        status: "1024",
        autoVerify: true,
      },
      {
        domain: "v.whatsapp.com",
        verified: true,
        autoVerify: true,
      },
      {
        domain: "whatsapp.com",
        verified: true,
        autoVerify: true,
      },
    ],
    signatures: [
      "39:87:D0:43:D1:0A:EF:AF:5A:87:10:B3:67:14:18:FE:57:E0:E1:9B:65:3C:9D:F8:25:58:FE:B5:FF:CE:5D:44",
    ],
    verificationState: {
      enabled: true,
      selectionState: {
        disabled: [
          "api.whatsapp.com",
          "b.whatsapp.com",
          "www.whatsapp.com",
          "call.whatsapp.com",
          "wa.me",
          "v.whatsapp.com",
          "whatsapp.com",
          "chat.whatsapp.com",
        ],
      },
    },
    rawText: `Domain verification status:
  com.whatsapp:
    ID: 0056d9a7-1bc7-43df-ada7-6553215c2148
    Signatures: [39:87:D0:43:D1:0A:EF:AF:5A:87:10:B3:67:14:18:FE:57:E0:E1:9B:65:3C:9D:F8:25:58:FE:B5:FF:CE:5D:44]
    Domain verification state:
      api.whatsapp.com: verified
      b.whatsapp.com: 1024
      www.whatsapp.com: verified
      call.whatsapp.com: verified
      wa.me: verified
      v.whatsapp.com: verified
      whatsapp.com: verified
      chat.whatsapp.com: verified
    User all:
      Verification link handling allowed: true
      Selection state:
        Disabled:
          api.whatsapp.com
          b.whatsapp.com
          www.whatsapp.com
          call.whatsapp.com
          wa.me
          v.whatsapp.com
          whatsapp.com
          chat.whatsapp.com`,
  };

  const renderDomainCard = (domain: DomainData) => (
    <Card className="mb-4" key={domain.domain}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-mono text-sm">
          {domain.domain}
          <Badge
            className="text-xs"
            variant={domain.verified ? "default" : "secondary"}
          >
            {domain.verified ? "Verified" : domain.status || "Not Verified"}
          </Badge>
          {domain.autoVerify && (
            <Badge className="text-xs" variant="outline">
              Auto-Verify
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
              Verification Status
            </h4>
            <Badge
              className="text-xs"
              variant={domain.verified ? "default" : "secondary"}
            >
              {domain.verified ? "✓ Verified" : "✗ Not Verified"}
            </Badge>
          </div>

          <div>
            <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
              Auto Verification
            </h4>
            <Badge
              className="text-xs"
              variant={domain.autoVerify ? "default" : "secondary"}
            >
              {domain.autoVerify ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </div>

        {domain.status && !domain.verified && (
          <div>
            <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
              Status Code
            </h4>
            <Badge className="font-mono text-xs" variant="outline">
              {domain.status}
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
              {/* Package Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Package: {mockData.packageName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
                      Verification Link Handling
                    </h4>
                    <Badge
                      className="text-xs"
                      variant={
                        mockData.verificationState.enabled
                          ? "default"
                          : "secondary"
                      }
                    >
                      {mockData.verificationState.enabled
                        ? "Allowed"
                        : "Disabled"}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
                      App Signature
                    </h4>
                    <div className="break-all rounded bg-muted p-2 font-mono text-xs">
                      {mockData.signatures[0]}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Verified Domains */}
              <div>
                <h3 className="mb-3 font-semibold text-lg">
                  Domain Verification Status
                </h3>
                {mockData.domains.map(renderDomainCard)}
              </div>

              {/* User Selection State */}
              {mockData.verificationState.selectionState.disabled.length >
                0 && (
                <div>
                  <h3 className="mb-3 font-semibold text-lg">
                    User Selection State
                  </h3>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">
                        Disabled Domains
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {mockData.verificationState.selectionState.disabled.map(
                          (domain, idx) => (
                            <Badge
                              className="font-mono text-xs"
                              key={idx}
                              variant="outline"
                            >
                              {domain}
                            </Badge>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
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
