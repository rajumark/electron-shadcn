import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SignatureData {
  algorithm?: string;
  fingerprint?: string;
  signature: string;
}

interface KeySetData {
  keySetManager: string;
  packageName: string;
  signingKeySets: number;
}

interface SecurityData {
  apkSigningVersion: number;
  customPermissions: Array<{
    name: string;
    type: string;
    protectionLevel: string;
  }>;
  declaredPermissions: Array<{
    name: string;
    protectionLevel: string;
  }>;
  keySets: KeySetData[];
  signatures: SignatureData[];
}

interface ParsedSecurityData {
  rawText: string;
  security: SecurityData;
}

export const AppDetailsSecurity: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ui");

  // Mock data - in real implementation, this would come from parsed ADB output
  const mockData: ParsedSecurityData = {
    security: {
      signatures: [
        {
          signature:
            "39:87:D0:43:D1:0A:EF:AF:5A:87:10:B3:67:14:18:FE:57:E0:E1:9B:65:3C:9D:F8:25:58:FE:B5:FF:CE:5D:44",
          algorithm: "SHA-256",
        },
      ],
      keySets: [
        {
          packageName: "com.whatsapp",
          signingKeySets: 234,
          keySetManager: "[com.whatsapp]",
        },
      ],
      apkSigningVersion: 2,
      declaredPermissions: [
        {
          name: "com.whatsapp.permission.BROADCAST",
          protectionLevel: "signature",
        },
        {
          name: "com.whatsapp.permission.MAPS_RECEIVE",
          protectionLevel: "signature",
        },
        {
          name: "com.whatsapp.permission.IDENTITY_VERIFICATION",
          protectionLevel: "signature",
        },
        {
          name: "com.whatsapp.permission.REGISTRATION",
          protectionLevel: "signature",
        },
        {
          name: "com.whatsapp.permission.MIGRATION_CONTENT_PROVIDER",
          protectionLevel: "signature",
        },
        {
          name: "com.whatsapp.sticker.READ",
          protectionLevel: "normal",
        },
        {
          name: "com.whatsapp.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION",
          protectionLevel: "signature",
        },
      ],
      customPermissions: [
        {
          name: "com.whatsapp.permission.BROADCAST",
          type: "signature",
          protectionLevel: "signature",
        },
        {
          name: "com.whatsapp.permission.MAPS_RECEIVE",
          type: "signature",
          protectionLevel: "signature",
        },
        {
          name: "com.whatsapp.permission.IDENTITY_VERIFICATION",
          type: "signature",
          protectionLevel: "signature",
        },
        {
          name: "com.whatsapp.permission.REGISTRATION",
          type: "signature",
          protectionLevel: "signature",
        },
        {
          name: "com.whatsapp.permission.MIGRATION_CONTENT_PROVIDER",
          type: "signature",
          protectionLevel: "signature",
        },
        {
          name: "com.whatsapp.sticker.READ",
          type: "normal",
          protectionLevel: "normal",
        },
        {
          name: "com.whatsapp.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION",
          type: "signature",
          protectionLevel: "signature",
        },
      ],
    },
    rawText: `Key Set Manager:
  [com.whatsapp]
      Signing KeySets: 234

Packages:
  Package [com.whatsapp] (4c87987):
    signatures=PackageSignatures{b94098c version:2, signatures:[2b6cb416], past signatures:[]}
    installPermissionsFixed=false
    pkgFlags=[ HAS_CODE ALLOW_CLEAR_USER_DATA ALLOW_BACKUP KILL_AFTER_RESTORE RESTORE_ANY_VERSION ]
    privatePkgFlags=[ PRIVATE_FLAG_ACTIVITIES_RESIZE_MODE_RESIZEABLE_VIA_SDK_VERSION ALLOW_AUDIO_PLAYBACK_CAPTURE PRIVATE_FLAG_REQUEST_LEGACY_EXTERNAL_STORAGE HAS_DOMAIN_URLS PARTIALLY_DIRECT_BOOT_AWARE PRIVATE_FLAG_ALLOW_NATIVE_HEAP_POINTER_TAGGING PRIVATE_FLAG_HAS_FRAGILE_USER_DATA ]
    apexModuleName=null
    declared permissions:
      com.whatsapp.permission.BROADCAST: prot=signature
      com.whatsapp.permission.MAPS_RECEIVE: prot=signature
      com.whatsapp.permission.IDENTITY_VERIFICATION: prot=signature
      com.whatsapp.permission.REGISTRATION: prot=signature
      com.whatsapp.permission.MIGRATION_CONTENT_PROVIDER: prot=signature
      com.whatsapp.sticker.READ: prot=normal
      com.whatsapp.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION: prot=signature

Permissions:
  Permission [com.whatsapp.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION] (886c09):
    sourcePackage=com.whatsapp
    uid=10411 gids=[] type=0 prot=signature
    perm=PermissionInfo{f9c298e com.whatsapp.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION}
    flags=0x0`,
  };

  const renderSignatureCard = (signature: SignatureData, index: number) => (
    <Card className="mb-4" key={index}>
      <CardHeader>
        <CardTitle className="text-sm">App Signature {index + 1}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
            Signature Hash
          </h4>
          <div className="break-all rounded bg-muted p-3 font-mono text-xs">
            {signature.signature}
          </div>
        </div>

        {signature.algorithm && (
          <div>
            <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
              Algorithm
            </h4>
            <Badge className="text-xs" variant="outline">
              {signature.algorithm}
            </Badge>
          </div>
        )}

        {signature.fingerprint && (
          <div>
            <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
              Fingerprint
            </h4>
            <div className="break-all rounded bg-muted p-3 font-mono text-xs">
              {signature.fingerprint}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderPermissionCard = (permission: any, index: number) => (
    <Card className="mb-3" key={index}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="mb-2 font-mono text-sm">{permission.name}</div>
            <div className="flex gap-2">
              <Badge className="text-xs" variant="outline">
                Type: {permission.type || permission.protectionLevel}
              </Badge>
              <Badge
                className="text-xs"
                variant={
                  permission.protectionLevel === "signature"
                    ? "default"
                    : "secondary"
                }
              >
                {permission.protectionLevel}
              </Badge>
            </div>
          </div>
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
              {/* App Signatures */}
              <div>
                <h3 className="mb-3 font-semibold text-lg">App Signatures</h3>
                {mockData.security.signatures.map(renderSignatureCard)}
              </div>

              {/* Key Sets */}
              <div>
                <h3 className="mb-3 font-semibold text-lg">Key Set Manager</h3>
                {mockData.security.keySets.map((keySet, index) => (
                  <Card className="mb-4" key={index}>
                    <CardHeader>
                      <CardTitle className="text-sm">
                        {keySet.packageName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
                            Signing Key Sets
                          </h4>
                          <Badge className="text-xs" variant="default">
                            {keySet.signingKeySets}
                          </Badge>
                        </div>
                        <div>
                          <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
                            Key Set Manager
                          </h4>
                          <Badge className="text-xs" variant="outline">
                            {keySet.keySetManager}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* APK Signing Version */}
              <div>
                <h3 className="mb-3 font-semibold text-lg">
                  APK Signing Information
                </h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
                          APK Signing Version
                        </h4>
                        <Badge className="text-xs" variant="default">
                          v{mockData.security.apkSigningVersion}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Custom Permissions */}
              <div>
                <h3 className="mb-3 font-semibold text-lg">
                  Custom Permissions
                </h3>
                {mockData.security.customPermissions.map(renderPermissionCard)}
              </div>

              {/* Declared Permissions */}
              <div>
                <h3 className="mb-3 font-semibold text-lg">
                  Declared Permissions
                </h3>
                {mockData.security.declaredPermissions.map(
                  renderPermissionCard
                )}
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
