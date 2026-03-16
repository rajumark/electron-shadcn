import {
  Briefcase,
  Calendar,
  Camera,
  Database,
  FileText,
  Image as ImageIcon,
  Info,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  Tag,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { ipc } from "@/ipc/manager";

interface ContactData {
  _id: string;
  account_name: string;
  account_type: string;
  contact_id: string;
  data1?: string;
  data2?: string;
  data3?: string;
  data4?: string;
  data5?: string;
  data6?: string;
  data7?: string;
  data8?: string;
  data9?: string;
  data10?: string;
  data11?: string;
  data12?: string;
  data13?: string;
  data14?: string;
  data15?: string;
  display_name: string;
  is_primary?: string;
  is_super_primary?: string;
  lookup: string;
  mimetype: string;
  phone_number?: string;
  photo_thumb_uri?: string;
  photo_uri?: string;
  raw_contact_id: string;
  starred: string; // Changed from boolean to string since it comes as '1' or '0'
  [key: string]: any;
}

interface ContactRightProps {
  contactId?: string; // New optional prop for direct contact_id lookup
  contactName?: string;
  phoneNumber: string;
}

export const ContactRight: React.FC<ContactRightProps> = ({
  phoneNumber,
  contactName,
  contactId,
}) => {
  const { selectedDevice } = useSelectedDevice();
  const [contactData, setContactData] = useState<ContactData[]>([]);
  const [rawResponse, setRawResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCopyToast, setShowCopyToast] = useState(false);

  // Function to copy raw data to clipboard
  const copyRawData = async () => {
    if (rawResponse) {
      try {
        await navigator.clipboard.writeText(rawResponse);
        setShowCopyToast(true);
        setTimeout(() => setShowCopyToast(false), 2000); // Hide after 2 seconds
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  };

  // Parse ADB response into structured data
  const parseContactData = (rawResponse: string): ContactData[] => {
    const rows = rawResponse.split("Row:").filter((row) => row.trim());
    const parsedData: ContactData[] = [];

    for (const row of rows) {
      if (!row.trim()) {
        continue;
      }

      const dataMap: Record<string, any> = {};
      const fields = row
        .trim()
        .split(", ")
        .map((field) => field.trim());

      for (const field of fields) {
        const keyValue = field.split("=", 2);
        if (keyValue.length === 2) {
          const key = keyValue[0].trim();
          const value = keyValue[1].trim();
          dataMap[key] = value === "NULL" ? null : value;
        }
      }

      if (dataMap._id) {
        parsedData.push(dataMap as ContactData);
      }
    }

    return parsedData;
  };

  // Group contact data by category
  const organizeContactData = (data: ContactData[]) => {
    const allData = data.reduce(
      (acc, item) => {
        // Basic Info
        if (item.mimetype === "vnd.android.cursor.item/name") {
          acc.basicInfo = item;
        }
        // Phone Numbers
        else if (item.mimetype === "vnd.android.cursor.item/phone_v2") {
          acc.phoneNumbers.push(item);
        }
        // Emails
        else if (item.mimetype === "vnd.android.cursor.item/email_v2") {
          acc.emails.push(item);
        }
        // Events
        else if (item.mimetype === "vnd.android.cursor.item/contact_event") {
          acc.events.push(item);
        }
        // Nickname
        else if (item.mimetype === "vnd.android.cursor.item/nickname") {
          acc.nickname = item;
        }
        // Note
        else if (item.mimetype === "vnd.android.cursor.item/note") {
          acc.note = item;
        }
        // Organization
        else if (item.mimetype === "vnd.android.cursor.item/organization") {
          acc.organization = item;
        }
        // Address
        else if (
          item.mimetype === "vnd.android.cursor.item/postal-address_v2"
        ) {
          acc.addresses.push(item);
        }
        // Website
        else if (item.mimetype === "vnd.android.cursor.item/website") {
          acc.websites.push(item);
        }
        // Relations
        else if (item.mimetype === "vnd.android.cursor.item/relation") {
          acc.relations.push(item);
        }
        // Groups
        else if (item.mimetype === "vnd.android.cursor.item/group_membership") {
          acc.groups.push(item);
        }
        // Photo
        else if (item.mimetype === "vnd.android.cursor.item/photo") {
          acc.photo = item;
        }
        // WhatsApp data
        else if (item.account_type === "com.whatsapp") {
          acc.whatsappData.push(item);
        }
        // Custom fields
        else if (
          item.mimetype ===
          "vnd.com.google.cursor.item/contact_user_defined_field"
        ) {
          acc.customFields.push(item);
        }
        // File attachments
        else if (
          item.mimetype === "vnd.com.google.cursor.item/contact_file_as"
        ) {
          acc.files.push(item);
        }
        // Identity
        else if (item.mimetype === "vnd.android.cursor.item/identity") {
          acc.identity = item;
        }

        return acc;
      },
      {
        basicInfo: null as ContactData | null,
        phoneNumbers: [] as ContactData[],
        emails: [] as ContactData[],
        events: [] as ContactData[],
        nickname: null as ContactData | null,
        note: null as ContactData | null,
        organization: null as ContactData | null,
        addresses: [] as ContactData[],
        websites: [] as ContactData[],
        relations: [] as ContactData[],
        groups: [] as ContactData[],
        photo: null as ContactData | null,
        whatsappData: [] as ContactData[],
        customFields: [] as ContactData[],
        files: [] as ContactData[],
        identity: null as ContactData | null,
        allData: data,
      }
    );

    return allData;
  };

  useEffect(() => {
    const fetchContactData = async () => {
      if (!selectedDevice) {
        setContactData([]);
        return;
      }

      // If we have contactId, use it directly. Otherwise, try to find by phone number.
      let targetContactId: string | null = contactId || null;

      setIsLoading(true);
      setError(null);

      try {
        // If we don't have contactId, try to find contact by phone number (original logic)
        if (!targetContactId && phoneNumber) {
          const phoneQuery = `content://com.android.contacts/data/phones/filter/${phoneNumber}`;
          const phoneCommand = `/Users/raju/Library/Application\\ Support/Pilotfish/platform-tools/adb -s ${selectedDevice.id} shell content query --uri ${phoneQuery}`;

          console.log("=== DEBUG: Phone query command:", phoneCommand);

          const phoneResponse = await ipc.client.adb.getContactByPhone({
            deviceId: selectedDevice.id,
            phoneNumber,
          });

          if (phoneResponse.success && phoneResponse.data) {
            console.log("=== DEBUG: Phone query response:", phoneResponse.data);
            const phoneData = parseContactData(phoneResponse.data);
            if (phoneData.length > 0) {
              targetContactId = phoneData[0].contact_id;
              console.log("=== DEBUG: Found contact ID:", targetContactId);
            }
          }
        }

        if (targetContactId) {
          // Fetch full contact data using contact_id
          const contactQuery = `content://com.android.contacts/data --where "contact_id=${targetContactId}"`;
          const contactCommand = `/Users/raju/Library/Application\\ Support/Pilotfish/platform-tools/adb -s ${selectedDevice.id} shell content query --uri ${contactQuery}`;

          console.log("=== DEBUG: Contact query command:", contactCommand);

          const contactResponse = await ipc.client.adb.getContactDetails({
            deviceId: selectedDevice.id,
            contactId: targetContactId,
          });

          if (contactResponse.success && contactResponse.data) {
            console.log(
              "=== DEBUG: Contact data response:",
              contactResponse.data
            );
            const parsedData = parseContactData(contactResponse.data);
            setContactData(parsedData);
            setRawResponse(contactResponse.data);
          } else {
            console.log("=== DEBUG: Contact query failed:", contactResponse);
            setError("Failed to fetch contact details");
            setRawResponse(contactResponse.data || "No data available");
          }
        } else if (phoneNumber) {
          setError("Contact not found for this phone number");
        } else {
          setError("No contact information available");
        }
      } catch (err) {
        console.error("=== DEBUG: Error fetching contact data:", err);
        setError("Error fetching contact data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactData();
  }, [phoneNumber, contactId, selectedDevice]);

  const organizedData = organizeContactData(contactData);

  const formatEventType = (type?: string) => {
    switch (type) {
      case "1":
        return "Birthday";
      case "2":
        return "Anniversary";
      case "3":
        return "Other";
      default:
        return "Event";
    }
  };

  const formatPhoneNumber = (number?: string, type?: string) => {
    if (!number) {
      return "";
    }

    let label = "Phone";
    switch (type) {
      case "1":
        label = "Home";
        break;
      case "2":
        label = "Mobile";
        break;
      case "3":
        label = "Work";
        break;
      default:
        label = "Phone";
        break;
    }

    return `${label}: ${number}`;
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-3 inline-block h-6 w-6 animate-spin rounded-full border-primary border-b-2" />
          <p className="text-muted-foreground text-sm">
            Loading contact details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <User className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
          <p className="mb-2 text-muted-foreground text-sm">{error}</p>
          <p className="text-muted-foreground text-xs">
            This number may not be saved in your contacts.
          </p>
        </div>
      </div>
    );
  }

  if (contactData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <User className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            No contact information available for this number.
          </p>
          <p className="mt-2 text-muted-foreground text-xs">
            This number is not saved in your contacts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <Tabs className="flex h-full flex-col" defaultValue="details">
        <TabsList className="mx-4 mt-0" variant="line">
          <TabsTrigger value="details">Contact Details</TabsTrigger>
          <TabsTrigger value="raw">Raw Data</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto">
          <TabsContent className="mt-0 p-4" value="details">
            <div className="max-w-full space-y-6">
              {/* Contact Header */}
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="mb-4 flex items-center gap-4">
                  {organizedData.photo?.photo_thumb_uri ? (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-lg">
                        {organizedData.basicInfo?.display_name ||
                          contactName ||
                          "Unknown Contact"}
                      </h2>
                      {organizedData.basicInfo?.starred === "1" && (
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {organizedData.basicInfo?.account_name || "Local Contact"}
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  {organizedData.phoneNumbers.map((phone, index) => (
                    <button
                      className="flex items-center gap-2 rounded-md bg-green-500 px-3 py-2 text-sm text-white transition-colors hover:bg-green-600"
                      key={index}
                    >
                      <Phone className="h-4 w-4" />
                      Call
                    </button>
                  ))}
                  <button className="flex items-center gap-2 rounded-md bg-blue-500 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-600">
                    <MessageCircle className="h-4 w-4" />
                    Message
                  </button>
                </div>
              </div>

              {/* Basic Information */}
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">Basic Information</h3>
                </div>
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="mb-1 font-medium text-muted-foreground text-xs">
                      Display Name
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.display_name || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-muted-foreground text-xs">
                      Display Name Alt
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.display_name_alt || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-muted-foreground text-xs">
                      Sort Key
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.sort_key || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-muted-foreground text-xs">
                      Sort Key Alt
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.sort_key_alt || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-muted-foreground text-xs">
                      Phonetic Name
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.phonetic_name || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-muted-foreground text-xs">
                      Phonetic Name Style
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.phonetic_name_style || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-muted-foreground text-xs">
                      Contact ID
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.contact_id || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-muted-foreground text-xs">
                      Raw Contact ID
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.raw_contact_id || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-muted-foreground text-xs">
                      Name Raw Contact ID
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.name_raw_contact_id || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-muted-foreground text-xs">
                      Starred
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.starred || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-muted-foreground text-xs">
                      Pinned
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.pinned || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-muted-foreground text-xs">
                      Has Phone Number
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.has_phone_number || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-muted-foreground text-xs">
                      In Default Directory
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.in_default_directory || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-muted-foreground text-xs">
                      In Visible Group
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.in_visible_group || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-muted-foreground text-xs">
                      Send to Voicemail
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.send_to_voicemail || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-muted-foreground text-xs">
                      Times Contacted
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.times_contacted || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-muted-foreground text-xs">
                      Last Time Contacted
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.last_time_contacted || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-muted-foreground text-xs">
                      Last Time Used
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.last_time_used || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-muted-foreground text-xs">
                      Times Used
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.times_used || "NULL"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone Numbers */}
              {organizedData.phoneNumbers.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm">Phone Numbers</h3>
                  </div>
                  <div className="space-y-3">
                    {organizedData.phoneNumbers.map((phone, index) => (
                      <div
                        className="rounded border border-border p-3"
                        key={index}
                      >
                        <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                          <div>
                            <p className="mb-1 font-medium text-muted-foreground text-xs">
                              Number
                            </p>
                            <p className="break-all font-mono">
                              {phone.data1 || phone.data4 || "NULL"}
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 font-medium text-muted-foreground text-xs">
                              Normalized Number
                            </p>
                            <p className="break-all font-mono">
                              {phone.data4 || "NULL"}
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 font-medium text-muted-foreground text-xs">
                              Type
                            </p>
                            <p className="break-all font-mono">
                              {phone.data2 === "1"
                                ? "Home"
                                : phone.data2 === "2"
                                  ? "Mobile"
                                  : phone.data2 === "3"
                                    ? "Work"
                                    : phone.data2 || "NULL"}
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 font-medium text-muted-foreground text-xs">
                              Is Primary
                            </p>
                            <p className="break-all font-mono">
                              {phone.is_primary || "NULL"}
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 font-medium text-muted-foreground text-xs">
                              Is Super Primary
                            </p>
                            <p className="break-all font-mono">
                              {phone.is_super_primary || "NULL"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Emails */}
              {organizedData.emails.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm">Email Addresses</h3>
                  </div>
                  <div className="space-y-3">
                    {organizedData.emails.map((email, index) => (
                      <div
                        className="rounded border border-border p-3"
                        key={index}
                      >
                        <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                          <div>
                            <p className="mb-1 font-medium text-muted-foreground text-xs">
                              Email
                            </p>
                            <p className="break-all font-mono">
                              {email.data1 || "NULL"}
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 font-medium text-muted-foreground text-xs">
                              Type
                            </p>
                            <p className="break-all font-mono">
                              {email.data2 === "1"
                                ? "Home"
                                : email.data2 === "2"
                                  ? "Work"
                                  : email.data2 || "NULL"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nickname */}
              {organizedData.nickname && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm">Nickname</h3>
                  </div>
                  <div className="text-sm">
                    <p className="break-all font-mono">
                      {organizedData.nickname.data1 || "NULL"}
                    </p>
                  </div>
                </div>
              )}

              {/* Organization */}
              {organizedData.organization && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm">Organization</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                    <div>
                      <p className="mb-1 font-medium text-muted-foreground text-xs">
                        Company
                      </p>
                      <p className="break-all font-mono">
                        {organizedData.organization.data1 || "NULL"}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 font-medium text-muted-foreground text-xs">
                        Job Title
                      </p>
                      <p className="break-all font-mono">
                        {organizedData.organization.data4 || "NULL"}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 font-medium text-muted-foreground text-xs">
                        Department
                      </p>
                      <p className="break-all font-mono">
                        {organizedData.organization.data5 || "NULL"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Addresses */}
              {organizedData.addresses.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm">Addresses</h3>
                  </div>
                  <div className="space-y-3">
                    {organizedData.addresses.map((address, index) => (
                      <div
                        className="rounded border border-border p-3"
                        key={index}
                      >
                        <div className="text-sm">
                          <p className="break-all font-mono">
                            {address.data1 || "NULL"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Events */}
              {organizedData.events.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm">Events</h3>
                  </div>
                  <div className="space-y-3">
                    {organizedData.events.map((event, index) => (
                      <div
                        className="rounded border border-border p-3"
                        key={index}
                      >
                        <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                          <div>
                            <p className="mb-1 font-medium text-muted-foreground text-xs">
                              Event Type
                            </p>
                            <p className="break-all font-mono">
                              {formatEventType(event.data2)}
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 font-medium text-muted-foreground text-xs">
                              Date
                            </p>
                            <p className="break-all font-mono">
                              {event.data1 || "NULL"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* WhatsApp Integration */}
              {organizedData.whatsappData.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-green-500" />
                    <h3 className="font-semibold text-sm">
                      WhatsApp Integration
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {organizedData.whatsappData.map((item, index) => {
                      if (
                        item.mimetype ===
                        "vnd.android.cursor.item/vnd.com.whatsapp.profile"
                      ) {
                        return (
                          <div
                            className="rounded border border-border p-3"
                            key={index}
                          >
                            <div className="text-sm">
                              <p className="mb-1 font-medium text-muted-foreground text-xs">
                                WhatsApp Profile
                              </p>
                              <p className="break-all font-mono">
                                {item.data3 || "NULL"}
                              </p>
                            </div>
                          </div>
                        );
                      }
                      if (item.mimetype.includes("call")) {
                        return (
                          <div
                            className="rounded border border-border p-3"
                            key={index}
                          >
                            <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                              <div>
                                <p className="mb-1 font-medium text-muted-foreground text-xs">
                                  Call Type
                                </p>
                                <p className="break-all font-mono">
                                  {item.mimetype.includes("video")
                                    ? "Video Call"
                                    : "Voice Call"}
                                </p>
                              </div>
                              <div>
                                <p className="mb-1 font-medium text-muted-foreground text-xs">
                                  Action
                                </p>
                                <p className="break-all font-mono">
                                  {item.data3 || "NULL"}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}

              {/* Custom Fields */}
              {organizedData.customFields.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm">Custom Fields</h3>
                  </div>
                  <div className="space-y-3">
                    {organizedData.customFields.map((field, index) => (
                      <div
                        className="rounded border border-border p-3"
                        key={index}
                      >
                        <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                          <div>
                            <p className="mb-1 font-medium text-muted-foreground text-xs">
                              Label
                            </p>
                            <p className="break-all font-mono">
                              {field.data1 || "NULL"}
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 font-medium text-muted-foreground text-xs">
                              Value
                            </p>
                            <p className="break-all font-mono">
                              {field.data2 || "NULL"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Files */}
              {organizedData.files.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm">Files</h3>
                  </div>
                  <div className="space-y-3">
                    {organizedData.files.map((file, index) => (
                      <div
                        className="rounded border border-border p-3"
                        key={index}
                      >
                        <div className="text-sm">
                          <p className="break-all font-mono">
                            {file.data1 || "NULL"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Note */}
              {organizedData.note && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm">Note</h3>
                  </div>
                  <div className="text-sm">
                    <p className="whitespace-pre-wrap break-all font-mono">
                      {organizedData.note.data1 || "NULL"}
                    </p>
                  </div>
                </div>
              )}

              {/* Photo Information */}
              {organizedData.photo && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <Camera className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm">Photo Information</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                    <div>
                      <p className="mb-1 font-medium text-muted-foreground text-xs">
                        Photo URI
                      </p>
                      <p className="break-all font-mono">
                        {organizedData.photo.photo_uri || "NULL"}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 font-medium text-muted-foreground text-xs">
                        Photo Thumb URI
                      </p>
                      <p className="break-all font-mono">
                        {organizedData.photo.photo_thumb_uri || "NULL"}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 font-medium text-muted-foreground text-xs">
                        Photo File ID
                      </p>
                      <p className="break-all font-mono">
                        {organizedData.photo.data14 || "NULL"}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 font-medium text-muted-foreground text-xs">
                        Is Primary
                      </p>
                      <p className="break-all font-mono">
                        {organizedData.photo.is_primary || "NULL"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Technical Details */}
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">Technical Details</h3>
                </div>
                <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Account Type
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.account_type || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Account Name
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.account_name || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Account Type & Data Set
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.account_type_and_data_set ||
                        "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Data Version
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.data_version || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Version</p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.version || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Dirty</p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.dirty || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Source ID
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.sourceid || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Lookup URI
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.lookup || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Phone Book Bucket
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.phonebook_bucket || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Phone Book Bucket Alt
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.phonebook_bucket_alt || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Phone Book Label
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.phonebook_label || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Phone Book Label Alt
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.phonebook_label_alt || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Display Name Source
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.display_name_source || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Contact Last Updated Timestamp
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo
                        ?.contact_last_updated_timestamp || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Carrier Presence
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.carrier_presence || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Raw Contact Is User Profile
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.raw_contact_is_user_profile ||
                        "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Photo File ID
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.photo_file_id || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Photo ID
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.photo_id || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Custom Ringtone
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.custom_ringtone || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Status</p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.status || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Contact Status
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.contact_status || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Contact Status Timestamp
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.contact_status_ts || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Contact Status Res Package
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.contact_status_res_package ||
                        "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Contact Status Label
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.contact_status_label || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Contact Status Icon
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.contact_status_icon || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Chat Capability
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.chat_capability || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Contact Chat Capability
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.contact_chat_capability ||
                        "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Mode</p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.mode || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Group Source ID
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.group_sourceid || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Res Package
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.res_package || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Data Sync1
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.data_sync1 || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Data Sync2
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.data_sync2 || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Data Sync3
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.data_sync3 || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Data Sync4
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.data_sync4 || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Status Timestamp
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.status_ts || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Status Label
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.status_label || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Status Icon
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.status_icon || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Status Res Package
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.status_res_package || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Contact Presence
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.contact_presence || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Backup ID
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.backup_id || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Data Set
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.data_set || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Preferred Phone Account Component Name
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo
                        ?.preferred_phone_account_component_name || "NULL"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Preferred Phone Account ID
                    </p>
                    <p className="break-all font-mono">
                      {organizedData.basicInfo?.preferred_phone_account_id ||
                        "NULL"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent className="mt-0 flex-1 overflow-hidden" value="raw">
            <div className="flex h-full flex-col overflow-hidden p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-sm">Raw ADB Response</h3>
                <button
                  className="flex items-center gap-1 rounded bg-primary px-3 py-2 text-primary-foreground text-xs transition-colors hover:bg-primary/90"
                  disabled={!rawResponse}
                  onClick={copyRawData}
                >
                  Copy
                </button>
              </div>

              {/* Toast Notification */}
              {showCopyToast && (
                <div className="fixed top-4 right-4 z-50 animate-pulse rounded-md bg-green-500 px-4 py-2 text-white shadow-lg">
                  Copied to clipboard!
                </div>
              )}

              {/* Raw Data Container with proper overflow handling */}
              <div className="min-h-0 flex-1 overflow-auto rounded bg-muted p-3">
                <pre className="whitespace-pre-wrap break-all font-mono text-xs">
                  {rawResponse || "No raw data available"}
                </pre>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
