import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Calendar, Clock, User, Info } from "lucide-react";

interface CallLog {
  id: string;
  phoneNumber: string;
  contactName?: string;
  timestamp: Date;
  duration: number; // in seconds
  type: "incoming" | "outgoing" | "missed";
}

interface CallLogsRightSideProps {
  selectedCall: string;
}

// Dummy data - in a real app this would come from the left side or a store
const dummyCallLogs: CallLog[] = [
  {
    id: "1",
    phoneNumber: "+1 234-567-8901",
    contactName: "John Doe",
    timestamp: new Date("2024-03-14T10:30:00"),
    duration: 120,
    type: "incoming"
  },
  {
    id: "2", 
    phoneNumber: "+1 234-567-8902",
    contactName: "Jane Smith",
    timestamp: new Date("2024-03-14T09:15:00"),
    duration: 300,
    type: "outgoing"
  },
  {
    id: "3",
    phoneNumber: "+1 234-567-8903",
    timestamp: new Date("2024-03-14T08:45:00"),
    duration: 0,
    type: "missed"
  },
  {
    id: "4",
    phoneNumber: "+1 234-567-8904",
    contactName: "Bob Johnson",
    timestamp: new Date("2024-03-13T18:20:00"),
    duration: 180,
    type: "incoming"
  },
  {
    id: "5",
    phoneNumber: "+1 234-567-8905",
    contactName: "Alice Brown",
    timestamp: new Date("2024-03-13T15:10:00"),
    duration: 45,
    type: "outgoing"
  },
  {
    id: "6",
    phoneNumber: "+1 234-567-8906",
    timestamp: new Date("2024-03-13T12:30:00"),
    duration: 0,
    type: "missed"
  },
  {
    id: "7",
    phoneNumber: "+1 234-567-8907",
    contactName: "Charlie Wilson",
    timestamp: new Date("2024-03-12T20:15:00"),
    duration: 600,
    type: "incoming"
  },
  {
    id: "8",
    phoneNumber: "+1 234-567-8908",
    contactName: "Diana Davis",
    timestamp: new Date("2024-03-12T16:45:00"),
    duration: 240,
    type: "outgoing"
  }
];

export const CallLogsRightSide: React.FC<CallLogsRightSideProps> = ({
  selectedCall,
}) => {
  const selectedCallData = dummyCallLogs.find(call => call.id === selectedCall);

  const formatDuration = (seconds: number): string => {
    if (seconds === 0) return "Missed";
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes} minutes`;
  };

  const formatDateTime = (date: Date): string => {
    return date.toLocaleString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCallIcon = (type: "incoming" | "outgoing" | "missed", size: number = 20) => {
    const iconClass = type === "missed" ? "text-red-500" : type === "incoming" ? "text-green-500" : "text-blue-500";
    switch (type) {
      case "incoming":
        return <PhoneIncoming className={`h-${size/5} w-${size/5} ${iconClass}`} />;
      case "outgoing":
        return <PhoneOutgoing className={`h-${size/5} w-${size/5} ${iconClass}`} />;
      case "missed":
        return <PhoneMissed className={`h-${size/5} w-${size/5} ${iconClass}`} />;
    }
  };

  const getCallTypeLabel = (type: "incoming" | "outgoing" | "missed"): string => {
    switch (type) {
      case "incoming":
        return "Incoming Call";
      case "outgoing":
        return "Outgoing Call";
      case "missed":
        return "Missed Call";
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
            <Tabs defaultValue="details" className="h-full flex flex-col">
              <TabsList variant="line" className="mx-4 mt-0">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <div className="flex-1 overflow-auto">
                <TabsContent value="details" className="mt-0 p-4">
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
                
                <TabsContent value="history" className="mt-0 p-4">
                  <div className="space-y-3">
                    <p className="text-sm font-medium mb-4">Recent calls with this number</p>
                    
                    {/* Show dummy history for the same number */}
                    {dummyCallLogs
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
                    
                    {dummyCallLogs.filter(call => call.phoneNumber === selectedCallData.phoneNumber).length === 1 && (
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
