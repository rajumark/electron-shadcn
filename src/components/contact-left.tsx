import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Search, X, RefreshCw, User, Phone } from "lucide-react";
import { ipc } from "@/ipc/manager";
import { useSelectedDevice } from "@/hooks/use-selected-device";

interface Contact {
  contact_id: string;
  display_name: string;
  data1: string; // phone number
}

interface ContactLeftSideProps {
  leftWidth: number;
  selectedContact: string;
  onContactSelect: (contactId: string) => void;
  isDragging: boolean;
  onDragStart: () => void;
  onContactsUpdate: (contacts: Contact[]) => void;
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
    console.log('=== DEBUG: parseContactsData called with response length:', rawResponse?.length);
    
    if (!rawResponse || rawResponse.trim() === '') {
      console.log('=== DEBUG: Empty response received');
      return [];
    }
    
    const parsedContacts: Contact[] = [];
    
    // Split by newlines first, then process each line that contains "Row:"
    const lines = rawResponse.split('\n');
    
    for (const line of lines) {
      if (!line.includes('Row:') || !line.includes('contact_id=')) {
        continue; // Skip lines that don't contain contact data
      }
      
      console.log(`=== DEBUG: Processing line:`, line.substring(0, 150));
      
      try {
        // Extract all key=value pairs using regex
        const keyValuePairs = line.match(/(\w+)=([^,]+)/g);
        if (!keyValuePairs) {
          console.log('=== DEBUG: No key=value pairs found');
          continue;
        }
        
        const contact: Partial<Contact> = {};
        
        for (const pair of keyValuePairs) {
          const [key, ...valueParts] = pair.split('=');
          const value = valueParts.join('=').trim();
          
          console.log(`=== DEBUG: Found pair: ${key} = ${value}`);
          
          switch (key.trim()) {
            case 'contact_id':
              contact.contact_id = value;
              break;
            case 'display_name':
              contact.display_name = value === 'NULL' || value === '' ? undefined : value;
              break;
            case 'data1':
              contact.data1 = value === 'NULL' || value === '' ? undefined : value;
              break;
          }
        }
        
        console.log(`=== DEBUG: Parsed contact:`, contact);
        
        // Add contact if it has the minimum required fields
        if (contact.contact_id && (contact.display_name || contact.data1)) {
          const finalContact = {
            contact_id: contact.contact_id,
            display_name: contact.display_name || 'No name',
            data1: contact.data1 || 'No number'
          } as Contact;
          parsedContacts.push(finalContact);
          console.log(`=== DEBUG: ✓ Added contact: ${finalContact.display_name} (${finalContact.data1})`);
        } else {
          console.log(`=== DEBUG: ✗ Skipped contact - missing required fields`);
        }
      } catch (error) {
        console.error(`=== DEBUG: Error parsing line:`, error);
      }
    }
    
    console.log(`=== DEBUG: Final parsed contacts count: ${parsedContacts.length}`);
    return parsedContacts;
  };

  // Fetch contacts when device is selected or refresh is triggered
  useEffect(() => {
    if (!selectedDevice || !selectedDevice.id?.trim()) {
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
          "-s", selectedDevice.id,
          "shell", "content", "query", 
          "--uri", "content://com.android.contacts/data/phones", 
          "--projection", "contact_id:display_name:data1"
        ];
        
        console.log('=== DEBUG: ADB Command:', adbArgs.join(' '));
        console.log('=== DEBUG: Full command path:', `/Users/raju/Library/Application\\ Support/Pilotfish/platform-tools/adb ${adbArgs.join(' ')}`);
        
        const response = await ipc.client.adb.executeADBCommand({
          args: adbArgs,
          useCache: true
        });

        console.log('=== DEBUG: ADB Response type:', typeof response);
        console.log('=== DEBUG: ADB Response length:', response?.length);
        console.log('=== DEBUG: ADB Response (first 1000 chars):', response?.substring(0, 1000));

        if (response) {
          console.log('=== DEBUG: Raw ADB Response:', response);
          console.log('=== DEBUG: Response length:', response?.length);
          const parsedContacts = parseContactsData(response);
          console.log('=== DEBUG: Parsed contacts:', parsedContacts);
          console.log('=== DEBUG: Parsed contacts count:', parsedContacts.length);
          
          // Sort contacts by contact_id in descending order (highest number first)
          const sortedContacts = parsedContacts.sort((a, b) => {
            const aId = parseInt(a.contact_id) || 0;
            const bId = parseInt(b.contact_id) || 0;
            return bId - aId; // Descending order
          });
          
          // Deduplicate by contact_id (keep first occurrence)
          const uniqueContacts = sortedContacts.filter((contact, index, array) => 
            array.findIndex(c => c.contact_id === contact.contact_id) === index
          );
          
          console.log('=== DEBUG: Sorted contacts (first 5):', sortedContacts.slice(0, 5));
          console.log('=== DEBUG: Unique contacts count:', uniqueContacts.length);
          
          // Check if data has changed
          const isSameLength = contacts.length === uniqueContacts.length;
          const isSame = isSameLength && contacts.every((contact, index) => 
            contact.contact_id === uniqueContacts[index]?.contact_id
          );

          if (!isSame) {
            setContacts(uniqueContacts);
            setFilteredContacts(uniqueContacts);
            setHasLoadedOnce(true);
            onContactsUpdate(uniqueContacts);
          }
        } else {
          throw new Error('No response from ADB command');
        }
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
        setError(
          `Failed to fetch contacts: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
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
      setRefreshKey(prev => prev + 1);
    }
  }, [isRefreshing]);

  const handleContactClick = useCallback((contactId: string) => {
    onContactSelect(contactId);
  }, [onContactSelect]);

  return (
    <div
      className="flex flex-col bg-background border-r border-border"
      style={{ width: `${leftWidth}%` }}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Contacts</h2>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || loading || !selectedDevice}
            className="p-2 hover:bg-muted rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh contacts"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-auto">
        {loading && !hasLoadedOnce ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-3"></div>
              <p className="text-sm text-muted-foreground">Loading contacts...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-2">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            {filteredContacts.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? "No contacts found" : "No contacts available"}
                  </p>
                </div>
              </div>
            ) : (
              <div ref={contactListRef} className="divide-y divide-border">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.contact_id}
                    onClick={() => handleContactClick(contact.contact_id)}
                    className={`p-2 cursor-pointer transition-colors hover:bg-muted ${
                      selectedContact === contact.contact_id ? "bg-muted border-l-2 border-primary" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-muted rounded-full">
                        <User className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">
                          {contact.display_name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {contact.data1}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Drag Handle */}
      <div
        className={`absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-primary transition-colors ${
          isDragging ? "bg-primary" : ""
        }`}
        onMouseDown={onDragStart}
        style={{ right: '-0.5px' }}
      />
    </div>
  );
};
