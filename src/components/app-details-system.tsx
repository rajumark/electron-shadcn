import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ReceiverData {
  actions: string[];
  categories?: string[];
  exported?: boolean;
  name: string;
  permission?: string;
}

interface AlarmData {
  actions: string[];
  name: string;
}

interface SystemIntegrationData {
  alarmReceivers: AlarmData[];
  backgroundServices: string[];
  batteryReceivers: ReceiverData[];
  bootReceivers: ReceiverData[];
  foregroundServices: string[];
  networkReceivers: ReceiverData[];
  nfcReceivers: ReceiverData[];
  storageReceivers: ReceiverData[];
  systemServiceReceivers: ReceiverData[];
}

interface ParsedSystemData {
  rawText: string;
  systemIntegration: SystemIntegrationData;
}

export const AppDetailsSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ui");

  // Mock data - in real implementation, this would come from parsed ADB output
  const mockData: ParsedSystemData = {
    systemIntegration: {
      bootReceivers: [
        {
          name: "com.whatsapp/.infra.systemreceivers.boot.BootReceiver",
          actions: ["android.intent.action.BOOT_COMPLETED"],
          exported: true,
        },
      ],
      networkReceivers: [
        {
          name: "androidx.work.impl.background.systemalarm.ConstraintProxy$NetworkStateProxy",
          actions: ["android.net.conn.CONNECTIVITY_CHANGE"],
          exported: false,
        },
      ],
      batteryReceivers: [
        {
          name: "androidx.work.impl.background.systemalarm.ConstraintProxy$BatteryNotLowProxy",
          actions: [
            "android.intent.action.BATTERY_OKAY",
            "android.intent.action.BATTERY_LOW",
          ],
          exported: false,
        },
        {
          name: "androidx.work.impl.background.systemalarm.ConstraintProxy$BatteryChargingProxy",
          actions: [
            "android.intent.action.ACTION_POWER_DISCONNECTED",
            "android.intent.action.ACTION_POWER_CONNECTED",
          ],
          exported: false,
        },
      ],
      storageReceivers: [
        {
          name: "androidx.work.impl.background.systemalarm.ConstraintProxy$StorageNotLowProxy",
          actions: [
            "android.intent.action.DEVICE_STORAGE_LOW",
            "android.intent.action.DEVICE_STORAGE_OK",
          ],
          exported: false,
        },
      ],
      alarmReceivers: [
        {
          name: "com.whatsapp/.alarmservice.AlarmBroadcastReceiver",
          actions: [
            "com.whatsapp.action.DAILY_CATCHUP_CRON",
            "com.whatsapp.action.BACKUP_MESSAGES",
            "com.whatsapp.action.DAILY_CRON",
            "com.whatsapp.action.HOURLY_CRON",
            "com.whatsapp.action.HEARTBEAT_WAKEUP",
            "com.whatsapp.action.AWAY_MESSAGES_CLEANUP",
            "com.whatsapp.action.ROTATE_SIGNED_PREKEY",
            "com.whatsapp.action.UPDATE_NTP",
          ],
        },
      ],
      nfcReceivers: [
        {
          name: "com.whatsapp/.identity.ui.IdentityVerificationActivity",
          actions: ["android.nfc.action.NDEF_DISCOVERED"],
          categories: ["android.intent.category.DEFAULT"],
        },
      ],
      systemServiceReceivers: [
        {
          name: "com.whatsapp/.infra.push.GcmListenerService",
          actions: ["com.google.firebase.MESSAGING_EVENT"],
          exported: true,
        },
        {
          name: "com.whatsapp/.calling.telecom.SelfManagedConnectionService",
          actions: ["android.telecom.ConnectionService"],
          permission: "android.permission.BIND_TELECOM_CONNECTION_SERVICE",
        },
      ],
      backgroundServices: [
        "com.whatsapp/.infra.push.GcmListenerService",
        "com.whatsapp/.alarmservice.AlarmBroadcastReceiver",
      ],
      foregroundServices: [
        "com.whatsapp/.calling.telecom.SelfManagedConnectionService",
      ],
    },
    rawText: `Receiver Resolver Table:
  Non-Data Actions:
      android.intent.action.BOOT_COMPLETED:
        89e79ac com.whatsapp/.infra.systemreceivers.boot.BootReceiver filter b946675
          Action: "android.intent.action.BOOT_COMPLETED"
      android.net.conn.CONNECTIVITY_CHANGE:
        126bc62 com.whatsapp/androidx.work.impl.background.systemalarm.ConstraintProxy$NetworkStateProxy filter b041f3
          Action: "android.net.conn.CONNECTIVITY_CHANGE"
      android.intent.action.BATTERY_OKAY:
        36ce8d6 com.whatsapp/androidx.work.impl.background.systemalarm.ConstraintProxy$BatteryNotLowProxy filter fd48757
          Action: "android.intent.action.BATTERY_OKAY"
          Action: "android.intent.action.BATTERY_LOW"
      com.whatsapp.action.DAILY_CATCHUP_CRON:
        96531f0 com.whatsapp/.alarmservice.AlarmBroadcastReceiver filter 4ed9369
          Action: "com.whatsapp.action.DAILY_CATCHUP_CRON"
          Action: "com.whatsapp.action.BACKUP_MESSAGES"
          Action: "com.whatsapp.action.DAILY_CRON"
          Action: "com.whatsapp.action.HOURLY_CRON"
          Action: "com.whatsapp.action.HEARTBEAT_WAKEUP"
          Action: "com.whatsapp.action.AWAY_MESSAGES_CLEANUP"
          Action: "com.whatsapp.action.ROTATE_SIGNED_PREKEY"
          Action: "com.whatsapp.action.UPDATE_NTP"
      android.nfc.action.NDEF_DISCOVERED:
        56fc83a com.whatsapp/.home.ui.HomeActivity filter 6761ceb
          Action: "android.nfc.action.NDEF_DISCOVERED"
          Category: "android.intent.category.DEFAULT"`,
  };

  const renderReceiverCard = (receiver: ReceiverData, index: number) => (
    <Card className="mb-3" key={index}>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="mb-2 font-mono text-sm">{receiver.name}</div>

          <div className="mb-2 flex flex-wrap gap-1">
            {receiver.actions.map((action, idx) => (
              <Badge className="text-xs" key={idx} variant="default">
                {action}
              </Badge>
            ))}
          </div>

          {receiver.categories && receiver.categories.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {receiver.categories.map((category, idx) => (
                <Badge className="text-xs" key={idx} variant="outline">
                  {category}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            {receiver.exported !== undefined && (
              <Badge
                className="text-xs"
                variant={receiver.exported ? "default" : "secondary"}
              >
                {receiver.exported ? "Exported" : "Private"}
              </Badge>
            )}

            {receiver.permission && (
              <Badge className="text-xs" variant="destructive">
                {receiver.permission}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderAlarmCard = (alarm: AlarmData, index: number) => (
    <Card className="mb-3" key={index}>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="mb-2 font-mono text-sm">{alarm.name}</div>

          <div className="flex flex-wrap gap-1">
            {alarm.actions.map((action, idx) => (
              <Badge className="text-xs" key={idx} variant="default">
                {action}
              </Badge>
            ))}
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
              {/* Boot Receivers */}
              <div>
                <h3 className="mb-3 font-semibold text-lg">Boot Receivers</h3>
                {mockData.systemIntegration.bootReceivers.map(
                  renderReceiverCard
                )}
              </div>

              {/* Network Receivers */}
              <div>
                <h3 className="mb-3 font-semibold text-lg">
                  Network State Receivers
                </h3>
                {mockData.systemIntegration.networkReceivers.map(
                  renderReceiverCard
                )}
              </div>

              {/* Battery Receivers */}
              <div>
                <h3 className="mb-3 font-semibold text-lg">
                  Battery & Power Receivers
                </h3>
                {mockData.systemIntegration.batteryReceivers.map(
                  renderReceiverCard
                )}
              </div>

              {/* Storage Receivers */}
              <div>
                <h3 className="mb-3 font-semibold text-lg">
                  Storage Receivers
                </h3>
                {mockData.systemIntegration.storageReceivers.map(
                  renderReceiverCard
                )}
              </div>

              {/* Alarm Receivers */}
              <div>
                <h3 className="mb-3 font-semibold text-lg">
                  Alarm & Scheduled Receivers
                </h3>
                {mockData.systemIntegration.alarmReceivers.map(renderAlarmCard)}
              </div>

              {/* NFC Receivers */}
              <div>
                <h3 className="mb-3 font-semibold text-lg">NFC Receivers</h3>
                {mockData.systemIntegration.nfcReceivers.map(
                  renderReceiverCard
                )}
              </div>

              {/* System Service Receivers */}
              <div>
                <h3 className="mb-3 font-semibold text-lg">
                  System Service Receivers
                </h3>
                {mockData.systemIntegration.systemServiceReceivers.map(
                  renderReceiverCard
                )}
              </div>

              {/* Background Services */}
              <div>
                <h3 className="mb-3 font-semibold text-lg">
                  Background Services
                </h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {mockData.systemIntegration.backgroundServices.map(
                        (service, idx) => (
                          <Badge
                            className="font-mono text-xs"
                            key={idx}
                            variant="outline"
                          >
                            {service}
                          </Badge>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Foreground Services */}
              <div>
                <h3 className="mb-3 font-semibold text-lg">
                  Foreground Services
                </h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {mockData.systemIntegration.foregroundServices.map(
                        (service, idx) => (
                          <Badge
                            className="font-mono text-xs"
                            key={idx}
                            variant="default"
                          >
                            {service}
                          </Badge>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
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
