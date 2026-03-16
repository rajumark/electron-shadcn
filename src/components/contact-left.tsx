import { RefreshCw, Search, User, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { ipc } from "@/ipc/manager";

interface Contact {
  contact_id: string;
  data1: string; // phone number
  display_name: string;
}

interface ContactLeftSideProps {
  isDragging: boolean;
  leftWidth: number;
  onContactSelect: (contactId: string) => void;
  onContactsUpdate: (contacts: Contact[]) => void;
  onDragStart: () => void;
  selectedContact: string;
}

export const ContactLeftSide: React.FC<ContactLeftSideProps> = ({
  leftWidth,
  selectedContact,
  onContactSelect,
  isDragging,
  onDragStart,
  onContactsUpdate,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const { selectedDevice } = useSelectedDevice();
  const [refreshKey, setRefreshKey] = useState(0);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const contactListRef = useRef<HTMLDivElement>(null);

  // Parse ADB response for contacts - Simple key-based approach
  const parseContactsData = (rawResponse: string): Contact[] => {
    console.log(
      "=== DEBUG: parseContactsData called with response length:",
      rawResponse?.length
    );

    if (!rawResponse || rawResponse.trim() === "") {
      console.log("=== DEBUG: Empty response received");
      return [];
    }

    const parsedContacts: Contact[] = [];

    // Split by newlines first, then process each line that contains "Row:"
    const lines = rawResponse.split("\n");

    for (const line of lines) {
      if (!(line.includes("Row:") && line.includes("contact_id="))) {
        continue; // Skip lines that don't contain contact data
      }

      console.log("=== DEBUG: Processing line:", line.substring(0, 150));

      try {
        // Extract all key=value pairs using regex
        const keyValuePairs = line.match(/(\w+)=([^,]+)/g);
        if (!keyValuePairs) {
          console.log("=== DEBUG: No key=value pairs found");
          continue;
        }

        const contact: Partial<Contact> = {};

        for (const pair of keyValuePairs) {
          const [key, ...valueParts] = pair.split("=");
          const value = valueParts.join("=").trim();

          console.log(`=== DEBUG: Found pair: ${key} = ${value}`);

          switch (key.trim()) {
            case "contact_id":
              contact.contact_id = value;
              break;
            case "display_name":
              contact.display_name =
                value === "NULL" || value === "" ? undefined : value;
              break;
            case "data1":
              contact.data1 =
                value === "NULL" || value === "" ? undefined : value;
              break;
          }
        }

        console.log("=== DEBUG: Parsed contact:", contact);

        // Add contact if it has the minimum required fields
        if (contact.contact_id && (contact.display_name || contact.data1)) {
          const finalContact = {
            contact_id: contact.contact_id,
            display_name: contact.display_name || "No name",
            data1: contact.data1 || "No number",
          } as Contact;
          parsedContacts.push(finalContact);
          console.log(
            `=== DEBUG: ✓ Added contact: ${finalContact.display_name} (${finalContact.data1})`
          );
        } else {
          console.log("=== DEBUG: ✗ Skipped contact - missing required fields");
        }
      } catch (error) {
        console.error("=== DEBUG: Error parsing line:", error);
      }
    }

    console.log(
      `=== DEBUG: Final parsed contacts count: ${parsedContacts.length}`
    );
    return parsedContacts;
  };

  // Fetch contacts when device is selected or refresh is triggered
  useEffect(() => {
    if (!(selectedDevice && selectedDevice.id?.trim())) {
      setContacts([]);
      setFilteredContacts([]);
      setHasLoadedOnce(false);
      return;
    }

    const fetchContacts = async () => {
      // Show loading state only for the first visible load on this device
      if (!hasLoadedOnce) {
        setLoading(true);
      }
      setError("");

      try {
        const adbArgs = [
          "-s",
          selectedDevice.id,
          "shell",
          "content",
          "query",
          "--uri",
          "content://com.android.contacts/data/phones",
          "--projection",
          "contact_id:display_name:data1",
        ];

        console.log("=== DEBUG: ADB Command:", adbArgs.join(" "));
        console.log(
          "=== DEBUG: Full command path:",
          `/Users/raju/Library/Application\\ Support/Pilotfish/platform-tools/adb ${adbArgs.join(" ")}`
        );

        const response = await ipc.client.adb.executeADBCommand({
          args: adbArgs,
          useCache: true,
        });

        console.log("=== DEBUG: ADB Response type:", typeof response);
        console.log("=== DEBUG: ADB Response length:", response?.length);
        console.log(
          "=== DEBUG: ADB Response (first 1000 chars):",
          response?.substring(0, 1000)
        );

        if (response) {
          console.log("=== DEBUG: Raw ADB Response:", response);
          console.log("=== DEBUG: Response length:", response?.length);
          const parsedContacts = parseContactsData(response);
          console.log("=== DEBUG: Parsed contacts:", parsedContacts);
          console.log(
            "=== DEBUG: Parsed contacts count:",
            parsedContacts.length
          );

          // Sort contacts by contact_id in descending order (highest number first)
          const sortedContacts = parsedContacts.sort((a, b) => {
            const aId = Number.parseInt(a.contact_id) || 0;
            const bId = Number.parseInt(b.contact_id) || 0;
            return bId - aId; // Descending order
          });

          // Deduplicate by contact_id (keep first occurrence)
          const uniqueContacts = sortedContacts.filter(
            (contact, index, array) =>
              array.findIndex((c) => c.contact_id === contact.contact_id) ===
              index
          );

          console.log(
            "=== DEBUG: Sorted contacts (first 5):",
            sortedContacts.slice(0, 5)
          );
          console.log(
            "=== DEBUG: Unique contacts count:",
            uniqueContacts.length
          );

          // Check if data has changed
          const isSameLength = contacts.length === uniqueContacts.length;
          const isSame =
            isSameLength &&
            contacts.every(
              (contact, index) =>
                contact.contact_id === uniqueContacts[index]?.contact_id
            );

          if (!isSame) {
            setContacts(uniqueContacts);
            setFilteredContacts(uniqueContacts);
            setHasLoadedOnce(true);
            onContactsUpdate(uniqueContacts);
          }
        } else {
          throw new Error("No response from ADB command");
        }
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
        setError(
          `Failed to fetch contacts: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        setContacts([]);
        setFilteredContacts([]);
        onContactsUpdate([]);
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    };

    fetchContacts();
  }, [selectedDevice, refreshKey]);

  // Filter contacts based on search query
  useEffect(() => {
    let filtered = contacts;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = contacts.filter(
        (contact) =>
          contact.display_name.toLowerCase().includes(query) ||
          contact.data1.toLowerCase().includes(query) ||
          contact.contact_id.toLowerCase().includes(query)
      );
    }

    setFilteredContacts(filtered);
  }, [contacts, searchQuery]);

  const handleRefresh = useCallback(() => {
    if (!isRefreshing) {
      setIsRefreshing(true);
      setRefreshKey((prev) => prev + 1);
    }
  }, [isRefreshing]);

  const handleContactClick = useCallback(
    (contactId: string) => {
      onContactSelect(contactId);
    },
    [onContactSelect]
  );

  return (
    <div
      className="flex h-full flex-col overflow-hidden"
      style={{ width: `${leftWidth}%` }}
    >
      <div className="flex h-full min-h-0 flex-col">
        {/* Header with Title and Refresh */}
        <div className="mx-2 flex items-center justify-between pt-2 pb-2">
          <h2 className="font-medium text-sm">Contacts</h2>
          <div className="flex items-center gap-1">
            {/* Refresh Button */}
            <button
              className="rounded-md p-1.5 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isRefreshing || !selectedDevice}
              onClick={handleRefresh}
              title="Refresh contacts"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mx-2 mb-2">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            className="w-full rounded-md border border-border py-1 pr-10 pl-10 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search in ${contacts.length} contacts`}
            type="text"
            value={searchQuery}
          />
          {searchQuery && (
            <button
              className="absolute inset-y-0 right-0 flex items-center pr-3 transition-colors hover:text-foreground"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Contacts List Container */}
        <div className="mx-2 flex flex-1 flex-col overflow-hidden">
          {loading ? (
            <div className="py-4 text-center">
              <div className="inline-block h-4 w-4 animate-spin rounded-full border-primary border-b-2" />
              <p className="mt-2 text-muted-foreground text-xs">
                Loading contacts...
              </p>
            </div>
          ) : filteredContacts.length > 0 ? (
            <div className="flex-1 overflow-auto" ref={contactListRef}>
              {filteredContacts.map((contact) => (
                <div
                  className={`cursor-pointer border-border border-b p-3 transition-colors hover:bg-muted ${
                    selectedContact === contact.contact_id ? "bg-muted" : ""
                  }`}
                  key={contact.contact_id}
                  onClick={() => handleContactClick(contact.contact_id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate font-medium text-sm">
                          {contact.display_name}
                        </p>
                        <span className="text-muted-foreground text-xs">
                          ID: {contact.contact_id}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <p className="truncate text-muted-foreground text-xs">
                          {contact.data1}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mx-2 flex flex-col items-center justify-center">
              <p className="py-4 text-center text-muted-foreground text-xs">
                {searchQuery.trim()
                  ? "No contacts found matching your search"
                  : "No contacts found"}
              </p>
              {searchQuery.trim() && contacts.length > 0 && (
                <button
                  className="rounded border border-border px-3 py-1 text-xs transition-colors hover:bg-muted"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Filter
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Drag Handle */}
      <div
        className={`absolute top-0 right-0 h-full w-1 cursor-col-resize bg-transparent transition-colors hover:bg-primary ${
          isDragging ? "bg-primary" : ""
        }`}
        onMouseDown={onDragStart}
        style={{ right: "-0.5px" }}
      />
    </div>
  );
};
