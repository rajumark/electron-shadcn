import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AppMetadata {
  apkSigningVersion: number;
  appId: number;
  codePath: string;
  extractNativeLibs: boolean;
  flags: string[];
  forceQueryable: boolean;
  hiddenApiEnforcementPolicy: number;
  installerPackageName: string;
  installTime: string;
  minSdk: number;
  nativeLibraryDir: string;
  packageName: string;
  pageSizeCompat: number;
  primaryCpuAbi: string;
  privateFlags: string[];
  resourcePath: string;
  secondaryCpuAbi?: string;
  splits: string[];
  targetSdk: number;
  updateTime: string;
  usesNonSdkApi: boolean;
  versionCode: number;
  versionName: string;
}

interface ParsedMetadataData {
  metadata: AppMetadata;
  rawText: string;
}

export const AppDetailsMetadata: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ui");

  // Mock data - in real implementation, this would come from parsed ADB output
  const mockData: ParsedMetadataData = {
    metadata: {
      packageName: "com.whatsapp",
      versionCode: 260_907_212,
      versionName: "2.26.9.72",
      targetSdk: 36,
      minSdk: 21,
      appId: 10_411,
      codePath:
        "/data/app/~~GDM1Aav3L4AvgnFiTMJCTg==/com.whatsapp-ENXvDzqOVft-1lo-lcCdtg==",
      resourcePath:
        "/data/app/~~GDM1Aav3L4AvgnFiTMJCTg==/com.whatsapp-ENXvDzqOVft-1lo-lcCdtg==",
      nativeLibraryDir:
        "/data/app/~~GDM1Aav3L4AvgnFiTMJCTg==/com.whatsapp-ENXvDzqOVft-1lo-lcCdtg==/lib",
      primaryCpuAbi: "arm64-v8a",
      secondaryCpuAbi: null,
      extractNativeLibs: false,
      flags: [
        "HAS_CODE",
        "ALLOW_CLEAR_USER_DATA",
        "ALLOW_BACKUP",
        "KILL_AFTER_RESTORE",
        "RESTORE_ANY_VERSION",
      ],
      privateFlags: [
        "PRIVATE_FLAG_ACTIVITIES_RESIZE_MODE_RESIZEABLE_VIA_SDK_VERSION",
        "ALLOW_AUDIO_PLAYBACK_CAPTURE",
        "PRIVATE_FLAG_REQUEST_LEGACY_EXTERNAL_STORAGE",
        "HAS_DOMAIN_URLS",
        "PARTIALLY_DIRECT_BOOT_AWARE",
        "PRIVATE_FLAG_ALLOW_NATIVE_HEAP_POINTER_TAGGING",
        "PRIVATE_FLAG_HAS_FRAGILE_USER_DATA",
      ],
      installTime: "2026-01-25 13:50:48",
      updateTime: "2026-03-14 15:49:03",
      installerPackageName: "com.facebook.system",
      splits: ["base"],
      apkSigningVersion: 2,
      hiddenApiEnforcementPolicy: 2,
      usesNonSdkApi: false,
      forceQueryable: false,
      pageSizeCompat: 0,
    },
    rawText: `Packages:
  Package [com.whatsapp] (4c87987):
    appId=10411
    pkg=Package{3cd10b4 com.whatsapp}
    codePath=/data/app/~~GDM1Aav3L4AvgnFiTMJCTg==/com.whatsapp-ENXvDzqOVft-1lo-lcCdtg==
    resourcePath=/data/app/~~GDM1Aav3L4AvgnFiTMJCTg==/com.whatsapp-ENXvDzqOVft-1lo-lcCdtg==
    legacyNativeLibraryDir=/data/app/~~GDM1Aav3L4AvgnFiTMJCTg==/com.whatsapp-ENXvDzqOVft-1lo-lcCdtg==/lib
    extractNativeLibs=false
    primaryCpuAbi=arm64-v8a
    secondaryCpuAbi=null
    versionCode=260907212 minSdk=21 targetSdk=36
    versionName=2.26.9.72
    hiddenApiEnforcementPolicy=2
    usesNonSdkApi=false
    splits=[base]
    apkSigningVersion=2
    flags=[ HAS_CODE ALLOW_CLEAR_USER_DATA ALLOW_BACKUP KILL_AFTER_RESTORE RESTORE_ANY_VERSION ]
    privateFlags=[ PRIVATE_FLAG_ACTIVITIES_RESIZE_MODE_RESIZEABLE_VIA_SDK_VERSION ALLOW_AUDIO_PLAYBACK_CAPTURE PRIVATE_FLAG_REQUEST_LEGACY_EXTERNAL_STORAGE HAS_DOMAIN_URLS PARTIALLY_DIRECT_BOOT_AWARE PRIVATE_FLAG_ALLOW_NATIVE_HEAP_POINTER_TAGGING PRIVATE_FLAG_HAS_FRAGILE_USER_DATA ]
    timeStamp=2026-03-14 15:48:58
    lastUpdateTime=2026-03-14 15:49:03
    installerPackageName=com.facebook.system`,
  };

  const renderMetadataSection = (title: string, data: Record<string, any>) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Object.entries(data).map(([key, value]) => (
            <div className="space-y-1" key={key}>
              <h4 className="font-semibold text-muted-foreground text-xs capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </h4>
              <div className="text-sm">
                {Array.isArray(value) ? (
                  <div className="flex flex-wrap gap-1">
                    {value.map((item, idx) => (
                      <Badge className="text-xs" key={idx} variant="outline">
                        {item}
                      </Badge>
                    ))}
                  </div>
                ) : typeof value === "boolean" ? (
                  <Badge
                    className="text-xs"
                    variant={value ? "default" : "secondary"}
                  >
                    {value ? "Yes" : "No"}
                  </Badge>
                ) : (
                  <span className="break-all font-mono text-xs">
                    {String(value)}
                  </span>
                )}
              </div>
            </div>
          ))}
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
              {/* Basic Information */}
              {renderMetadataSection("Basic Information", {
                packageName: mockData.metadata.packageName,
                versionCode: mockData.metadata.versionCode,
                versionName: mockData.metadata.versionName,
                targetSdk: mockData.metadata.targetSdk,
                minSdk: mockData.metadata.minSdk,
                appId: mockData.metadata.appId,
              })}

              {/* Installation Information */}
              {renderMetadataSection("Installation Information", {
                codePath: mockData.metadata.codePath,
                resourcePath: mockData.metadata.resourcePath,
                nativeLibraryDir: mockData.metadata.nativeLibraryDir,
                primaryCpuAbi: mockData.metadata.primaryCpuAbi,
                secondaryCpuAbi: mockData.metadata.secondaryCpuAbi || "N/A",
                extractNativeLibs: mockData.metadata.extractNativeLibs,
              })}

              {/* Application Flags */}
              {renderMetadataSection("Application Flags", {
                flags: mockData.metadata.flags,
                privateFlags: mockData.metadata.privateFlags,
                hiddenApiEnforcementPolicy:
                  mockData.metadata.hiddenApiEnforcementPolicy,
                usesNonSdkApi: mockData.metadata.usesNonSdkApi,
                forceQueryable: mockData.metadata.forceQueryable,
              })}

              {/* Technical Details */}
              {renderMetadataSection("Technical Details", {
                splits: mockData.metadata.splits,
                apkSigningVersion: mockData.metadata.apkSigningVersion,
                pageSizeCompat: mockData.metadata.pageSizeCompat,
                installerPackageName: mockData.metadata.installerPackageName,
                installTime: mockData.metadata.installTime,
                updateTime: mockData.metadata.updateTime,
              })}
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
