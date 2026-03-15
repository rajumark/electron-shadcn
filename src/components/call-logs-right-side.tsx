import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Calendar, Clock, User, Info, Code, Database, Settings, MessageSquare, UserPlus, MessageCircle, Send } from "lucide-react";
import { CallLog, formatDuration, formatDateTime, parseCallLogData } from "@/utils/call-log-parser";
import { ipc } from "@/ipc/manager";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { useState, useEffect } from "react";

interface CallLogsRightSideProps {
  selectedCall: string;
  callLogs: CallLog[];
}


export const CallLogsRightSide: React.FC<CallLogsRightSideProps> = ({
  selectedCall,
  callLogs,
}) => {
  const selectedCallData = callLogs.find(call => call.id === selectedCall);
  const { selectedDevice } = useSelectedDevice();
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const [detailedCallData, setDetailedCallData] = useState<CallLog | null>(null);
  const [callHistory, setCallHistory] = useState<CallLog[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [lastFetchedCallId, setLastFetchedCallId] = useState<string | null>(null);


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

  // Fetch detailed call data when a call is selected
  useEffect(() => {
    if (!selectedCall || !selectedDevice) {
      setDetailedCallData(null);
      setCallHistory([]);
      setLastFetchedCallId(null);
      return;
    }

    // Skip if we've already fetched data for this call
    if (lastFetchedCallId === selectedCall) {
      return;
    }

    const fetchDetailedData = async () => {
      setIsLoadingDetails(true);
      setIsLoadingHistory(true);
      
      try {
        // Get current call data from existing callLogs
        const currentCall = callLogs.find(call => call.id === selectedCall);
        if (!currentCall) {
          setIsLoadingDetails(false);
          setIsLoadingHistory(false);
          return;
        }

        // Fetch detailed call data
        try {
          const detailsResponse = await ipc.client.adb.getCallLogDetails({
            deviceId: selectedDevice.id,
            callId: selectedCall
          });
          
          if (detailsResponse.success && detailsResponse.data) {
            const parsedDetails = parseCallLogData(detailsResponse.data);
            if (parsedDetails.length > 0) {
              setDetailedCallData(parsedDetails[0]);
            }
          }
        } catch (detailsError) {
          console.error('Failed to fetch call details:', detailsError);
        }
        
        // Fetch call history for same number
        try {
          const historyResponse = await ipc.client.adb.getCallHistoryByNumber({
            deviceId: selectedDevice.id,
            phoneNumber: currentCall.phoneNumber
          });
          
          if (historyResponse.success && historyResponse.data) {
            const parsedHistory = parseCallLogData(historyResponse.data);
            setCallHistory(parsedHistory);
          }
        } catch (historyError) {
          console.error('Failed to fetch call history:', historyError);
        }
        
        setLastFetchedCallId(selectedCall);
      } catch (error) {
        console.error('Failed to fetch detailed data:', error);
      } finally {
        setIsLoadingDetails(false);
        setIsLoadingHistory(false);
      }
    };

    fetchDetailedData();
  }, [selectedCall, selectedDevice]); // Removed callLogs from dependencies

  const executeAction = async (actionType: string, intentCommand: string) => {
    if (!selectedDevice || !selectedCallData) return;
    
    setIsActionLoading(actionType);
    try {
      const result = await ipc.client.adb.executeIntentCommand({
        deviceId: selectedDevice.id,
        intentCommand
      });
      if (result.success) {
        console.log(`${actionType} action successful`);
      } else {
        console.error(`${actionType} action failed:`, result.error);
      }
    } catch (error) {
      console.error(`${actionType} action error:`, error);
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleCall = () => {
    if (!selectedCallData) return;
    const command = `-a android.intent.action.DIAL -d tel:${selectedCallData.phoneNumber}`;
    executeAction('call', command);
  };

  const handleMessage = () => {
    if (!selectedCallData) return;
    const command = `-a android.intent.action.SENDTO -d sms:${selectedCallData.phoneNumber}`;
    executeAction('message', command);
  };

  const handleSaveContact = () => {
    if (!selectedCallData) return;
    const name = selectedCallData.contactName || `Contact ${selectedCallData.phoneNumber}`;
    const command = `-a android.intent.action.INSERT -t vnd.android.cursor.dir/contact -e name "${name}" -e phone "${selectedCallData.phoneNumber}"`;
    executeAction('saveContact', command);
  };

  const handleWhatsApp = () => {
    if (!selectedCallData) return;
    const cleanNumber = selectedCallData.phoneNumber.replace(/[^0-9+]/g, '');
    const command = `-a android.intent.action.VIEW -d "https://api.whatsapp.com/send?phone=${cleanNumber.replace('+', '')}"`;
    executeAction('whatsapp', command);
  };
 
  const handleTelegram = () => {
    if (!selectedCallData) return;
    const command = `-a android.intent.action.VIEW -d "tg://msg?to=${selectedCallData.phoneNumber}"`;
    executeAction('telegram', command);
  };

  const handleDirectSMS = () => {
    if (!selectedCallData) return;
    const message = "I missed your call. I will call you back shortly.";
    const command = `-a android.intent.action.SENDTO -d sms:${selectedCallData.phoneNumber} --es sms_body "${message}"`;
    executeAction('directSMS', command);
  };

  const needsSaveContact = selectedCallData && (
    !selectedCallData.contactName || 
    selectedCallData.raw.lookup_uri === 'NULL' || 
    !selectedCallData.raw.lookup_uri
  );

  return (
    <div className="mr-2 mb-2 ml-0 min-h-full flex-1 min-w-0">
      {selectedCall && selectedCallData ? (
        <div className="h-full flex flex-col">
          {/* Call Header */}
          <div className="p-4 pb-2 border-b border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-muted rounded-full">
                {getCallIcon(selectedCallData.type, 20)}
              </div>
              <div className="flex-1">
                <p className="text-base font-medium">
                  {selectedCallData.contactName || selectedCallData.phoneNumber}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedCallData.contactName ? selectedCallData.phoneNumber : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{getCallTypeLabel(selectedCallData.type)}</span>
              <span>{formatDuration(selectedCallData.duration)}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
              {/* Call Button */}
              <button
                onClick={handleCall}
                disabled={isActionLoading === 'call' || !selectedDevice}
                className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-md transition-colors text-sm disabled:cursor-not-allowed"
              >
                <Phone className="h-4 w-4" />
                {isActionLoading === 'call' ? 'Calling...' : 'Call'}
              </button>

              {/* Message Button */}
              <button
                onClick={handleMessage}
                disabled={isActionLoading === 'message' || !selectedDevice}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-md transition-colors text-sm disabled:cursor-not-allowed"
              >
                <MessageSquare className="h-4 w-4" />
                {isActionLoading === 'message' ? 'Opening...' : 'Message'}
              </button>

              {/* Save Contact Button - Only show when contact needs to be saved */}
              {needsSaveContact && (
                <button
                  onClick={handleSaveContact}
                  disabled={isActionLoading === 'saveContact' || !selectedDevice}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white rounded-md transition-colors text-sm disabled:cursor-not-allowed"
                >
                  <UserPlus className="h-4 w-4" />
                  {isActionLoading === 'saveContact' ? 'Saving...' : 'Save Contact'}
                </button>
              )}

              {/* WhatsApp Button */}
              <button
                onClick={handleWhatsApp}
                disabled={isActionLoading === 'whatsapp' || !selectedDevice}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-md transition-colors text-sm disabled:cursor-not-allowed"
                title="Open in WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </button>

              {/* Telegram Button */}
              <button
                onClick={handleTelegram}
                disabled={isActionLoading === 'telegram' || !selectedDevice}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors text-sm disabled:cursor-not-allowed"
                title="Open in Telegram"
              >
                <Send className="h-4 w-4" />
                Telegram
              </button>

              {/* Direct SMS with Pre-written Message */}
              <button
                onClick={handleDirectSMS}
                disabled={isActionLoading === 'directSMS' || !selectedDevice}
                className="flex items-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-md transition-colors text-sm disabled:cursor-not-allowed"
                title="Send SMS with pre-written message"
              >
                <Send className="h-4 w-4" />
                Quick Reply
              </button>
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
                    {isLoadingDetails ? (
                      <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <p className="text-xs text-muted-foreground mt-2">Loading technical details...</p>
                      </div>
                    ) : (
                      <>
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
                            <p className="text-sm font-mono">{(detailedCallData || selectedCallData)?.raw._id || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Subscription ID</p>
                            <p className="text-sm font-mono">{(detailedCallData || selectedCallData)?.raw.subscription_id || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Phone Account</p>
                            <p className="text-sm font-mono text-xs break-all">{(detailedCallData || selectedCallData)?.raw.phone_account_address || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Presentation</p>
                            <p className="text-sm font-mono">{(detailedCallData || selectedCallData)?.raw.presentation || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Features</p>
                            <p className="text-sm font-mono">{(detailedCallData || selectedCallData)?.raw.features || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Data Usage</p>
                            <p className="text-sm font-mono">{(detailedCallData || selectedCallData)?.raw.data_usage || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Last Modified</p>
                            <p className="text-sm font-mono">{(detailedCallData || selectedCallData)?.raw.last_modified || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Transcription State</p>
                            <p className="text-sm font-mono">{(detailedCallData || selectedCallData)?.raw.transcription_state || 'N/A'}</p>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-border">
                          <p className="text-sm font-medium mb-2">Additional Fields</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {(detailedCallData || selectedCallData)?.raw.via_number && (
                              <div>
                                <span className="font-medium text-muted-foreground">Via Number:</span>
                                <span className="ml-2 font-mono">{(detailedCallData || selectedCallData)?.raw.via_number}</span>
                              </div>
                            )}
                            {(detailedCallData || selectedCallData)?.raw.normalized_number && (
                              <div>
                                <span className="font-medium text-muted-foreground">Normalized:</span>
                                <span className="ml-2 font-mono">{(detailedCallData || selectedCallData)?.raw.normalized_number}</span>
                              </div>
                            )}
                            {(detailedCallData || selectedCallData)?.raw.formatted_number && (detailedCallData || selectedCallData)?.raw.formatted_number !== 'NULL' && (
                              <div>
                                <span className="font-medium text-muted-foreground">Formatted:</span>
                                <span className="ml-2 font-mono">{(detailedCallData || selectedCallData)?.raw.formatted_number}</span>
                              </div>
                            )}
                            {(detailedCallData || selectedCallData)?.raw.numberlabel && (detailedCallData || selectedCallData)?.raw.numberlabel !== 'NULL' && (
                              <div>
                                <span className="font-medium text-muted-foreground">Number Label:</span>
                                <span className="ml-2 font-mono">{(detailedCallData || selectedCallData)?.raw.numberlabel}</span>
                              </div>
                            )}
                            {(detailedCallData || selectedCallData)?.raw.numbertype && (detailedCallData || selectedCallData)?.raw.numbertype !== 'NULL' && (
                              <div>
                                <span className="font-medium text-muted-foreground">Number Type:</span>
                                <span className="ml-2 font-mono">{(detailedCallData || selectedCallData)?.raw.numbertype}</span>
                              </div>
                            )}
                            {(detailedCallData || selectedCallData)?.raw.post_dial_digits && (
                              <div>
                                <span className="font-medium text-muted-foreground">Post Dial:</span>
                                <span className="ml-2 font-mono">{(detailedCallData || selectedCallData)?.raw.post_dial_digits}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="raw" className="mt-0 p-4">
                  <div className="space-y-4">
                    {isLoadingDetails ? (
                      <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <p className="text-xs text-muted-foreground mt-2">Loading raw data...</p>
                      </div>
                    ) : (
                      <>
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
                              {Object.entries((detailedCallData || selectedCallData)?.raw || {})
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
                      </>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="history" className="mt-0 p-4">
                  <div className="space-y-3">
                    <p className="text-sm font-medium mb-4">Recent calls with this number</p>
                    
                    {isLoadingHistory ? (
                      <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <p className="text-xs text-muted-foreground mt-2">Loading call history...</p>
                      </div>
                    ) : (
                      <>
                        {/* Try to use the fetched call history first, fallback to local callLogs */}
                        {(callHistory.length > 0 ? callHistory : callLogs
                          .filter(call => call.phoneNumber === selectedCallData?.phoneNumber))
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
                        
                        {((callHistory.length > 0 ? callHistory : callLogs.filter(call => call.phoneNumber === selectedCallData?.phoneNumber)).length === 0) && (
                          <div className="text-center py-8">
                            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground">
                              No call history available for this number.
                            </p>
                          </div>
                        )}
                      </>
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
