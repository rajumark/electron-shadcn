import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Calendar, Clock, User, Info, Code, Database, Settings } from "lucide-react";
import { CallLog, formatDuration, formatDateTime } from "@/utils/call-log-parser";

interface CallLogsRightSideProps {
  selectedCall: string;
  callLogs: CallLog[];
}


export const CallLogsRightSide: React.FC<CallLogsRightSideProps> = ({
  selectedCall,
  callLogs,
}) => {
  const selectedCallData = callLogs.find(call => call.id === selectedCall);


  const getCallIcon = (type: CallLog['type'], size: number = 20) => {
    const iconClass = type === "missed" ? "text-red-500" : type === "incoming" ? "text-green-500" : type === "outgoing" ? "text-blue-500" : type === "rejected" ? "text-orange-500" : type === "blocked" ? "text-gray-500" : type === "voicemail" ? "text-purple-500" : "text-muted-foreground";
    switch (type) {
      case "incoming":
        return <PhoneIncoming className={`h-4 w-4 ${iconClass}`} />;
      case "outgoing":
        return <PhoneOutgoing className={`h-4 w-4 ${iconClass}`} />;
      case "missed":
        return <PhoneMissed className={`h-4 w-4 ${iconClass}`} />;
      case "rejected":
        return <PhoneMissed className={`h-4 w-4 ${iconClass}`} />;
      case "blocked":
        return <PhoneMissed className={`h-4 w-4 ${iconClass}`} />;
      case "voicemail":
        return <PhoneIncoming className={`h-4 w-4 ${iconClass}`} />;
      default:
        return <Phone className={`h-4 w-4 ${iconClass}`} />;
    }
  };

  const getCallTypeLabel = (type: CallLog['type']): string => {
    switch (type) {
      case "incoming":
        return "Incoming Call";
      case "outgoing":
        return "Outgoing Call";
      case "missed":
        return "Missed Call";
      case "rejected":
        return "Rejected Call";
      case "blocked":
        return "Blocked Call";
      case "voicemail":
        return "Voicemail Call";
      default:
        return "Unknown Call Type";
    }
  };

  return (
    <div className="mr-2 mb-2 ml-0 min-h-full flex-1 min-w-0">
      {selectedCallData ? (
        <div className="h-full flex flex-col">
          {/* Call Header */}
          <div className="p-4 pb-2 border-b border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-muted rounded-full">
                {getCallIcon(selectedCallData.type, 20)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {selectedCallData.contactName || "Unknown Contact"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedCallData.phoneNumber}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{getCallTypeLabel(selectedCallData.type)}</span>
              <span>{formatDuration(selectedCallData.duration)}</span>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="basics" className="h-full flex flex-col">
              <TabsList variant="line" className="mx-4 mt-0">
                <TabsTrigger value="basics">Basics</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="raw">Raw Data</TabsTrigger>
              </TabsList>
              
              <div className="flex-1 overflow-auto">
                <TabsContent value="basics" className="mt-0 p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Date & Time</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(selectedCallData.timestamp)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Duration</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDuration(selectedCallData.duration)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Call Type</p>
                        <p className="text-sm text-muted-foreground">
                          {getCallTypeLabel(selectedCallData.type)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Phone Number</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {selectedCallData.phoneNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="contact" className="mt-0 p-4">
                  <div className="space-y-4">
                    {selectedCallData.contactName ? (
                      <>
                        <div className="flex items-center gap-3">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Contact Name</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedCallData.contactName}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Phone Number</p>
                            <p className="text-sm text-muted-foreground font-mono">
                              {selectedCallData.phoneNumber}
                            </p>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-border">
                          <p className="text-sm text-muted-foreground">
                            Contact information would be available in a real implementation with access to the device's contacts.
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">
                          No contact information available for this number.
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          This number is not saved in your contacts.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="technical" className="mt-0 p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Technical Details</p>
                        <p className="text-sm text-muted-foreground">
                          Advanced call information and system data
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Call ID</p>
                        <p className="text-sm font-mono">{selectedCallData.raw._id || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Subscription ID</p>
                        <p className="text-sm font-mono">{selectedCallData.raw.subscription_id || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Phone Account</p>
                        <p className="text-sm font-mono text-xs break-all">{selectedCallData.raw.phone_account_address || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Presentation</p>
                        <p className="text-sm font-mono">{selectedCallData.raw.presentation || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Features</p>
                        <p className="text-sm font-mono">{selectedCallData.raw.features || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Data Usage</p>
                        <p className="text-sm font-mono">{selectedCallData.raw.data_usage || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Last Modified</p>
                        <p className="text-sm font-mono">{selectedCallData.raw.last_modified || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Transcription State</p>
                        <p className="text-sm font-mono">{selectedCallData.raw.transcription_state || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm font-medium mb-2">Additional Fields</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {selectedCallData.raw.via_number && (
                          <div>
                            <span className="font-medium text-muted-foreground">Via Number:</span>
                            <span className="ml-2 font-mono">{selectedCallData.raw.via_number}</span>
                          </div>
                        )}
                        {selectedCallData.raw.normalized_number && (
                          <div>
                            <span className="font-medium text-muted-foreground">Normalized:</span>
                            <span className="ml-2 font-mono">{selectedCallData.raw.normalized_number}</span>
                          </div>
                        )}
                        {selectedCallData.raw.formatted_number && selectedCallData.raw.formatted_number !== 'NULL' && (
                          <div>
                            <span className="font-medium text-muted-foreground">Formatted:</span>
                            <span className="ml-2 font-mono">{selectedCallData.raw.formatted_number}</span>
                          </div>
                        )}
                        {selectedCallData.raw.numberlabel && selectedCallData.raw.numberlabel !== 'NULL' && (
                          <div>
                            <span className="font-medium text-muted-foreground">Number Label:</span>
                            <span className="ml-2 font-mono">{selectedCallData.raw.numberlabel}</span>
                          </div>
                        )}
                        {selectedCallData.raw.numbertype && selectedCallData.raw.numbertype !== 'NULL' && (
                          <div>
                            <span className="font-medium text-muted-foreground">Number Type:</span>
                            <span className="ml-2 font-mono">{selectedCallData.raw.numbertype}</span>
                          </div>
                        )}
                        {selectedCallData.raw.post_dial_digits && (
                          <div>
                            <span className="font-medium text-muted-foreground">Post Dial:</span>
                            <span className="ml-2 font-mono">{selectedCallData.raw.post_dial_digits}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="raw" className="mt-0 p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Raw ADB Data</p>
                        <p className="text-sm text-muted-foreground">
                          Complete data from Android call log database
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-muted rounded-lg p-3">
                      <div className="max-h-96 overflow-auto">
                        <div className="space-y-2">
                          {Object.entries(selectedCallData.raw)
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([key, value]) => (
                              <div key={key} className="flex items-start gap-2">
                                <span className="text-xs font-mono text-muted-foreground min-w-24">
                                  {key}:
                                </span>
                                <span className="text-xs font-mono break-all flex-1">
                                  {value === 'NULL' ? (
                                    <span className="text-muted-foreground italic">NULL</span>
                                  ) : value === '' ? (
                                    <span className="text-muted-foreground italic">empty</span>
                                  ) : (
                                    value
                                  )}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center gap-3">
                        <Code className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">ADB Command</p>
                          <p className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded mt-1">
                            adb shell content query --uri content://call_log/calls
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="history" className="mt-0 p-4">
                  <div className="space-y-3">
                    <p className="text-sm font-medium mb-4">Recent calls with this number</p>
                    
                    {/* Show call history for the same number */}
                    {callLogs
                      .filter(call => call.phoneNumber === selectedCallData.phoneNumber)
                      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                      .map((call) => (
                        <div key={call.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                          <div className="p-1">
                            {getCallIcon(call.type, 16)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">
                                {getCallTypeLabel(call.type)}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                {formatDuration(call.duration)}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {formatDateTime(call.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    
                    {callLogs.filter(call => call.phoneNumber === selectedCallData.phoneNumber).length === 1 && (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">
                          This is the only call with this number.
                        </p>
                      </div>
                    )}
                  </div>
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
            Select a call from the left panel to view details here.
          </p>
        </div>
      )}
    </div>
  );
};
