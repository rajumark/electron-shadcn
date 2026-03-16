import {
  Clock,
  Database,
  Info,
  MessageCircle,
  MessageSquare,
  Phone,
  PhoneIncoming,
  PhoneMissed,
  PhoneOutgoing,
  Send,
  Settings,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { ipc } from "@/ipc/manager";
import {
  type CallLog,
  formatDateTime,
  formatDuration,
  parseCallLogData,
} from "@/utils/call-log-parser";
import { ContactRight } from "./contact-right";

interface CallLogsRightSideProps {
  callLogs: CallLog[];
  selectedCall: string;
}

export const CallLogsRightSide: React.FC<CallLogsRightSideProps> = ({
  selectedCall,
  callLogs,
}) => {
  const selectedCallData = callLogs.find((call) => call.id === selectedCall);
  const { selectedDevice } = useSelectedDevice();
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const [detailedCallData, setDetailedCallData] = useState<CallLog | null>(
    null
  );
  const [callHistory, setCallHistory] = useState<CallLog[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [lastFetchedCallId, setLastFetchedCallId] = useState<string | null>(
    null
  );
  const [rawDataSearch, setRawDataSearch] = useState("");

  // Simple parsing function for debugging
  const parseRawADBResponse = (input: string): Record<string, string> => {
    const dataMap: Record<string, string> = {};

    // Remove "Row: X" prefix if it exists
    const cleanInput = input.replace(/^Row:\s*\d+\s*/, "").trim();

    const fields = cleanInput.split(", ").map((field) => field.trim());

    // Parse each field
    for (const field of fields) {
      const keyValue = field.split("=", 2);
      if (keyValue.length === 2) {
        const key = keyValue[0].trim();
        const value = keyValue[1].trim();
        dataMap[key] = value;
      }
    }

    return dataMap;
  };

  // Function to copy raw data to clipboard
  const copyRawData = async () => {
    if (detailedCallData?.raw._raw_response) {
      try {
        await navigator.clipboard.writeText(detailedCallData.raw._raw_response);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  };
  const highlightText = (text: string, search: string) => {
    if (!search.trim()) {
      return text;
    }

    const regex = new RegExp(
      `(${search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span className="bg-yellow-200 font-semibold text-black" key={index}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const getCallIcon = (type: CallLog["type"], size = 20) => {
    const iconClass =
      type === "missed"
        ? "text-red-500"
        : type === "incoming"
          ? "text-green-500"
          : type === "outgoing"
            ? "text-blue-500"
            : type === "rejected"
              ? "text-orange-500"
              : type === "blocked"
                ? "text-gray-500"
                : type === "voicemail"
                  ? "text-purple-500"
                  : "text-muted-foreground";
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

  const getCallTypeLabel = (type: CallLog["type"]): string => {
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
    if (!(selectedCall && selectedDevice)) {
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
        const currentCall = callLogs.find((call) => call.id === selectedCall);
        if (!currentCall) {
          setIsLoadingDetails(false);
          setIsLoadingHistory(false);
          return;
        }

        // Fetch detailed call data
        try {
          // Use actual database _id instead of UUID
          const actualDatabaseId = currentCall.raw._id;

          console.log(
            "=== DEBUG: Fetching details for call ID (UUID):",
            selectedCall
          );
          console.log(
            "=== DEBUG: Fetching details for call ID (Database):",
            actualDatabaseId
          );
          console.log("=== DEBUG: Device ID:", selectedDevice?.id);

          if (!actualDatabaseId) {
            console.error("=== DEBUG: No database _id found in call data");
            return;
          }

          const adbCommand = `/Users/raju/Library/Application\\ Support/Pilotfish/platform-tools/adb -s ${selectedDevice.id} shell content query --uri content://call_log/calls --where "_id=${actualDatabaseId}"`;

          console.log("=== DEBUG: Full ADB Command:", adbCommand);

          const detailsResponse = await ipc.client.adb.getCallLogDetails({
            deviceId: selectedDevice.id,
            callId: actualDatabaseId, // Use actual database _id
          });

          console.log("=== DEBUG: Raw API response:", detailsResponse);
          console.log("=== DEBUG: Success:", detailsResponse.success);
          console.log("=== DEBUG: Data:", detailsResponse.data);

          if (detailsResponse.success && detailsResponse.data) {
            console.log("=== DEBUG: Raw data string:", detailsResponse.data);
            console.log("=== DEBUG: Data length:", detailsResponse.data.length);

            // Store raw response for debugging
            setDetailedCallData({
              id: actualDatabaseId, // Store actual database ID
              phoneNumber: currentCall.phoneNumber,
              contactName: currentCall.contactName,
              timestamp: currentCall.timestamp,
              duration: currentCall.duration,
              type: currentCall.type,
              raw: {
                _raw_response: detailsResponse.data,
                _adb_command: adbCommand,
                // Try to parse as fallback
                ...parseRawADBResponse(detailsResponse.data),
              },
            } as any);
          } else {
            console.log("=== DEBUG: Details response failed:", detailsResponse);

            // Still store the command for debugging even if failed
            setDetailedCallData({
              id: actualDatabaseId,
              phoneNumber: currentCall.phoneNumber,
              contactName: currentCall.contactName,
              timestamp: currentCall.timestamp,
              duration: currentCall.duration,
              type: currentCall.type,
              raw: {
                _raw_response: detailsResponse.data || "No response",
                _adb_command: adbCommand,
                _error: "API call failed",
              },
            } as any);
          }
        } catch (detailsError) {
          console.error(
            "=== DEBUG: Failed to fetch call details:",
            detailsError
          );

          // Store error info for debugging
          const actualDatabaseId = currentCall.raw._id;
          setDetailedCallData({
            id: actualDatabaseId,
            phoneNumber: currentCall.phoneNumber,
            contactName: currentCall.contactName,
            timestamp: currentCall.timestamp,
            duration: currentCall.duration,
            type: currentCall.type,
            raw: {
              _raw_response: "Error occurred",
              _adb_command: `/Users/raju/Library/Application\\ Support/Pilotfish/platform-tools/adb -s ${selectedDevice?.id} shell content query --uri content://call_log/calls --where "_id=${actualDatabaseId}"`,
              _error:
                detailsError instanceof Error
                  ? detailsError.message
                  : "Unknown error",
            },
          } as any);
        }

        // Fetch call history for same number
        try {
          const phoneNumber = currentCall.phoneNumber;
          const adbCommand = `/Users/raju/Library/Application\\ Support/Pilotfish/platform-tools/adb -s ${selectedDevice.id} shell content query --uri content://call_log/calls --where "number=\\'${phoneNumber}\\'"`;

          console.log("=== DEBUG: History ADB Command:", adbCommand);

          const historyResponse = await ipc.client.adb.getCallHistoryByNumber({
            deviceId: selectedDevice.id,
            phoneNumber,
          });

          console.log("=== DEBUG: History API response:", historyResponse);
          console.log("=== DEBUG: History success:", historyResponse.success);
          console.log("=== DEBUG: History data:", historyResponse.data);

          if (historyResponse.success && historyResponse.data) {
            console.log("=== DEBUG: History raw data:", historyResponse.data);
            const parsedHistory = parseCallLogData(historyResponse.data);
            console.log("=== DEBUG: Parsed history:", parsedHistory);
            console.log(
              "=== DEBUG: Parsed history length:",
              parsedHistory.length
            );

            if (parsedHistory.length > 0) {
              console.log("=== DEBUG: First history call:", parsedHistory[0]);
              setCallHistory(parsedHistory);
            }
          } else {
            console.log("=== DEBUG: History response failed:", historyResponse);
          }
        } catch (historyError) {
          console.error(
            "=== DEBUG: Failed to fetch call history:",
            historyError
          );
        }

        setLastFetchedCallId(selectedCall);
      } catch (error) {
        console.error("Failed to fetch detailed data:", error);
      } finally {
        setIsLoadingDetails(false);
        setIsLoadingHistory(false);
      }
    };

    fetchDetailedData();
  }, [selectedCall, selectedDevice]); // Removed callLogs from dependencies

  const executeAction = async (actionType: string, intentCommand: string) => {
    if (!(selectedDevice && selectedCallData)) {
      return;
    }

    setIsActionLoading(actionType);
    try {
      const result = await ipc.client.adb.executeIntentCommand({
        deviceId: selectedDevice.id,
        intentCommand,
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
    if (!selectedCallData) {
      return;
    }
    const command = `-a android.intent.action.DIAL -d tel:${selectedCallData.phoneNumber}`;
    executeAction("call", command);
  };

  const handleMessage = () => {
    if (!selectedCallData) {
      return;
    }
    const command = `-a android.intent.action.SENDTO -d sms:${selectedCallData.phoneNumber}`;
    executeAction("message", command);
  };

  const handleSaveContact = () => {
    if (!selectedCallData) {
      return;
    }
    const name =
      selectedCallData.contactName || `Contact ${selectedCallData.phoneNumber}`;
    const command = `-a android.intent.action.INSERT -t vnd.android.cursor.dir/contact -e name "${name}" -e phone "${selectedCallData.phoneNumber}"`;
    executeAction("saveContact", command);
  };

  const handleWhatsApp = () => {
    if (!selectedCallData) {
      return;
    }
    const cleanNumber = selectedCallData.phoneNumber.replace(/[^0-9+]/g, "");
    const command = `-a android.intent.action.VIEW -d "https://api.whatsapp.com/send?phone=${cleanNumber.replace("+", "")}"`;
    executeAction("whatsapp", command);
  };

  const handleTelegram = () => {
    if (!selectedCallData) {
      return;
    }
    const command = `-a android.intent.action.VIEW -d "tg://msg?to=${selectedCallData.phoneNumber}"`;
    executeAction("telegram", command);
  };

  const handleDirectSMS = () => {
    if (!selectedCallData) {
      return;
    }
    const message = "I missed your call. I will call you back shortly.";
    const command = `-a android.intent.action.SENDTO -d sms:${selectedCallData.phoneNumber} --es sms_body "${message}"`;
    executeAction("directSMS", command);
  };

  const needsSaveContact =
    selectedCallData &&
    (!selectedCallData.contactName ||
      selectedCallData.raw.lookup_uri === "NULL" ||
      !selectedCallData.raw.lookup_uri);

  return (
    <div className="mr-2 mb-2 ml-0 min-h-full min-w-0 flex-1">
      {selectedCall && selectedCallData ? (
        <div className="flex h-full flex-col">
          {/* Call Header */}
          <div className="border-border border-b p-4 pb-2">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-full bg-muted p-2">
                {getCallIcon(selectedCallData.type, 20)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-base">
                  {selectedCallData.contactName || selectedCallData.phoneNumber}
                </p>
                <p className="text-muted-foreground text-sm">
                  {selectedCallData.contactName
                    ? selectedCallData.phoneNumber
                    : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <span>{getCallTypeLabel(selectedCallData.type)}</span>
              <span>{formatDuration(selectedCallData.duration)}</span>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              {/* Call Button */}
              <button
                className="flex items-center gap-2 rounded-md bg-green-500 px-3 py-2 text-sm text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-300"
                disabled={isActionLoading === "call" || !selectedDevice}
                onClick={handleCall}
              >
                <Phone className="h-4 w-4" />
                {isActionLoading === "call" ? "Calling..." : "Call"}
              </button>

              {/* Message Button */}
              <button
                className="flex items-center gap-2 rounded-md bg-blue-500 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
                disabled={isActionLoading === "message" || !selectedDevice}
                onClick={handleMessage}
              >
                <MessageSquare className="h-4 w-4" />
                {isActionLoading === "message" ? "Opening..." : "Message"}
              </button>

              {/* Save Contact Button - Only show when contact needs to be saved */}
              {needsSaveContact && (
                <button
                  className="flex items-center gap-2 rounded-md bg-purple-500 px-3 py-2 text-sm text-white transition-colors hover:bg-purple-600 disabled:cursor-not-allowed disabled:bg-purple-300"
                  disabled={
                    isActionLoading === "saveContact" || !selectedDevice
                  }
                  onClick={handleSaveContact}
                >
                  <UserPlus className="h-4 w-4" />
                  {isActionLoading === "saveContact"
                    ? "Saving..."
                    : "Save Contact"}
                </button>
              )}

              {/* WhatsApp Button */}
              <button
                className="flex items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400"
                disabled={isActionLoading === "whatsapp" || !selectedDevice}
                onClick={handleWhatsApp}
                title="Open in WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </button>

              {/* Telegram Button */}
              <button
                className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                disabled={isActionLoading === "telegram" || !selectedDevice}
                onClick={handleTelegram}
                title="Open in Telegram"
              >
                <Send className="h-4 w-4" />
                Telegram
              </button>

              {/* Direct SMS with Pre-written Message */}
              <button
                className="flex items-center gap-2 rounded-md bg-orange-500 px-3 py-2 text-sm text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
                disabled={isActionLoading === "directSMS" || !selectedDevice}
                onClick={handleDirectSMS}
                title="Send SMS with pre-written message"
              >
                <Send className="h-4 w-4" />
                Quick Reply
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex-1 overflow-hidden">
            <Tabs className="flex h-full flex-col" defaultValue="basics">
              <TabsList className="mx-4 mt-0" variant="line">
                <TabsTrigger value="basics">Basics</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="raw">Raw Data</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-auto">
                <TabsContent className="mt-0 p-4" value="basics">
                  <div className="space-y-6">
                    {/* Basic Information Card */}
                    <div className="rounded-lg border border-border bg-card p-4">
                      <div className="mb-4 flex items-center gap-2">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Phone className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">
                            Call Information
                          </h3>
                          <p className="text-muted-foreground text-xs">
                            Basic call details
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <p className="mb-1 font-medium text-muted-foreground text-xs">
                              Contact
                            </p>
                            <p className="font-medium text-sm">
                              {selectedCallData.contactName || "Unknown"}
                            </p>
                            {selectedCallData.contactName && (
                              <p className="font-mono text-muted-foreground text-xs">
                                {selectedCallData.phoneNumber}
                              </p>
                            )}
                          </div>

                          <div>
                            <p className="mb-1 font-medium text-muted-foreground text-xs">
                              Date & Time
                            </p>
                            <p className="font-medium text-sm">
                              {formatDateTime(selectedCallData.timestamp)}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="mb-1 font-medium text-muted-foreground text-xs">
                              Duration
                            </p>
                            <p className="font-medium text-sm">
                              {formatDuration(selectedCallData.duration)}
                            </p>
                          </div>

                          <div>
                            <p className="mb-1 font-medium text-muted-foreground text-xs">
                              Call Type
                            </p>
                            <div className="flex items-center gap-2">
                              {getCallIcon(selectedCallData.type, 16)}
                              <p className="font-medium text-sm">
                                {getCallTypeLabel(selectedCallData.type)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Technical Details Card */}
                    <div className="rounded-lg border border-border bg-card p-4">
                      <div className="mb-4 flex items-center gap-2">
                        <div className="rounded-lg bg-orange-500/10 p-2">
                          <Settings className="h-4 w-4 text-orange-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">
                            Technical Details
                          </h3>
                          <p className="text-muted-foreground text-xs">
                            System & network information
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div>
                            <p className="font-medium text-muted-foreground text-xs">
                              Call ID
                            </p>
                            <p className="font-mono text-sm">
                              {detailedCallData?.raw._id || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground text-xs">
                              Subscription ID
                            </p>
                            <p className="font-mono text-sm">
                              {detailedCallData?.raw.subscription_id || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground text-xs">
                              Phone Account
                            </p>
                            <p className="break-all font-mono text-sm text-xs">
                              {detailedCallData?.raw.phone_account_address ||
                                "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground text-xs">
                              Presentation
                            </p>
                            <p className="font-mono text-sm">
                              {detailedCallData?.raw.presentation || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <p className="font-medium text-muted-foreground text-xs">
                              Features
                            </p>
                            <p className="font-mono text-sm">
                              {detailedCallData?.raw.features || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground text-xs">
                              Data Usage
                            </p>
                            <p className="font-mono text-sm">
                              {detailedCallData?.raw.data_usage || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground text-xs">
                              Last Modified
                            </p>
                            <p className="font-mono text-sm">
                              {detailedCallData?.raw.last_modified || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground text-xs">
                              Transcription State
                            </p>
                            <p className="font-mono text-sm">
                              {detailedCallData?.raw.transcription_state ||
                                "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Information Card */}
                    <div className="rounded-lg border border-border bg-card p-4">
                      <div className="mb-4 flex items-center gap-2">
                        <div className="rounded-lg bg-blue-500/10 p-2">
                          <Info className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">
                            Additional Information
                          </h3>
                          <p className="text-muted-foreground text-xs">
                            Extra call details
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div>
                            <p className="font-medium text-muted-foreground text-xs">
                              Formatted Number
                            </p>
                            <p className="font-mono text-sm">
                              {detailedCallData?.raw.formatted_number || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground text-xs">
                              Subject
                            </p>
                            <p className="font-mono text-sm">
                              {detailedCallData?.raw.subject || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground text-xs">
                              Country ISO
                            </p>
                            <p className="font-mono text-sm">
                              {detailedCallData?.raw.countryiso || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <p className="font-medium text-muted-foreground text-xs">
                              Geocoded Location
                            </p>
                            <p className="font-mono text-sm">
                              {detailedCallData?.raw.geocoded_location || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground text-xs">
                              Missed Reason
                            </p>
                            <p className="font-mono text-sm">
                              {detailedCallData?.raw.missed_reason || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground text-xs">
                              Photo URI
                            </p>
                            <p className="break-all font-mono text-sm text-xs">
                              {detailedCallData?.raw.photo_uri || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent className="mt-0 p-0" value="contact">
                  <ContactRight
                    contactName={selectedCallData.contactName}
                    phoneNumber={selectedCallData.phoneNumber}
                  />
                </TabsContent>

                <TabsContent className="mt-0 p-4" value="raw">
                  <div className="space-y-4">
                    {isLoadingDetails ? (
                      <div className="py-4 text-center">
                        <div className="inline-block h-4 w-4 animate-spin rounded-full border-primary border-b-2" />
                        <p className="mt-2 text-muted-foreground text-xs">
                          Loading raw data...
                        </p>
                      </div>
                    ) : detailedCallData ? (
                      <>
                        {/* Search Input with Copy Button */}
                        <div className="flex items-center gap-2">
                          <input
                            className="w-2/5 rounded-md border border-border px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                            onChange={(e) => setRawDataSearch(e.target.value)}
                            placeholder="Search in raw data..."
                            type="text"
                            value={rawDataSearch}
                          />
                          {rawDataSearch && (
                            <button
                              className="rounded bg-muted px-2 py-1 text-xs transition-colors hover:bg-muted/80"
                              onClick={() => setRawDataSearch("")}
                            >
                              Clear
                            </button>
                          )}
                          <button
                            className="flex items-center gap-1 rounded bg-primary px-3 py-2 text-primary-foreground text-xs transition-colors hover:bg-primary/90"
                            onClick={copyRawData}
                          >
                            Copy
                          </button>
                        </div>

                        {/* Show Raw ADB Response with highlighting */}
                        <div className="whitespace-pre-wrap break-all font-mono text-xs">
                          {highlightText(
                            detailedCallData.raw._raw_response ||
                              "No raw response",
                            rawDataSearch
                          )}
                        </div>

                        {/* Show Error if any */}
                        {detailedCallData.raw._error && (
                          <div className="rounded border border-red-200 bg-red-50 p-3">
                            <h4 className="mb-2 font-medium text-red-700 text-sm">
                              Error:
                            </h4>
                            <div className="break-all font-mono text-red-600 text-xs">
                              {detailedCallData.raw._error}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="py-8 text-center">
                        <Database className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground text-sm">
                          Loading detailed data failed. Please try selecting the
                          call again.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent className="mt-0 p-4" value="history">
                  <div className="space-y-3">
                    <p className="mb-4 font-medium text-sm">
                      Recent calls with this number
                    </p>

                    {isLoadingHistory ? (
                      <div className="py-4 text-center">
                        <div className="inline-block h-4 w-4 animate-spin rounded-full border-primary border-b-2" />
                        <p className="mt-2 text-muted-foreground text-xs">
                          Loading call history...
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Use fetched call history if available, otherwise filter local callLogs */}
                        {(callHistory.length > 0
                          ? callHistory
                          : callLogs.filter(
                              (call) =>
                                call.phoneNumber ===
                                selectedCallData?.phoneNumber
                            )
                        )
                          .sort(
                            (a, b) =>
                              b.timestamp.getTime() - a.timestamp.getTime()
                          )
                          .map((call) => (
                            <div
                              className="flex items-center gap-3 rounded-lg border border-border p-3"
                              key={call.id}
                            >
                              <div className="p-1">
                                {getCallIcon(call.type, 16)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-sm">
                                    {getCallTypeLabel(call.type)}
                                  </p>
                                  <span className="text-muted-foreground text-xs">
                                    {formatDuration(call.duration)}
                                  </span>
                                </div>
                                <p className="text-muted-foreground text-xs">
                                  {formatDateTime(call.timestamp)}
                                </p>
                              </div>
                            </div>
                          ))}

                        {(callHistory.length > 0
                          ? callHistory
                          : callLogs.filter(
                              (call) =>
                                call.phoneNumber ===
                                selectedCallData?.phoneNumber
                            )
                        ).length === 0 && (
                          <div className="py-8 text-center">
                            <Clock className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                            <p className="text-muted-foreground text-sm">
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
          <div className="h-px w-full bg-gray-300" />
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground text-sm">
            Select a call from the left panel to view details here.
          </p>
        </div>
      )}
    </div>
  );
};
