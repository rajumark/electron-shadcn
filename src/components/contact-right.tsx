import { useState, useEffect } from "react";
import { User, Phone, Mail, Calendar, Star, MessageCircle, Video, Cake, MapPin, Briefcase, Camera, Settings, Info, Hash, Globe, Shield, Clock, Users, CreditCard, Tag, Database, FileText, Image as ImageIcon } from "lucide-react";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { ipc } from "@/ipc/manager";

interface ContactData {
  _id: string;
  contact_id: string;
  display_name: string;
  phone_number?: string;
  photo_uri?: string;
  photo_thumb_uri?: string;
  starred: boolean;
  account_type: string;
  account_name: string;
  lookup: string;
  raw_contact_id: string;
  mimetype: string;
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
  is_primary?: string;
  is_super_primary?: string;
  [key: string]: any;
}

interface ContactRightProps {
  phoneNumber: string;
  contactName?: string;
}

export const ContactRight: React.FC<ContactRightProps> = ({ phoneNumber, contactName }) => {
  const { selectedDevice } = useSelectedDevice();
  const [contactData, setContactData] = useState<ContactData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse ADB response into structured data
  const parseContactData = (rawResponse: string): ContactData[] => {
    const rows = rawResponse.split('Row:').filter(row => row.trim());
    const parsedData: ContactData[] = [];

    for (const row of rows) {
      if (!row.trim()) continue;
      
      const dataMap: Record<string, any> = {};
      const fields = row.trim().split(', ').map(field => field.trim());
      
      for (const field of fields) {
        const keyValue = field.split('=', 2);
        if (keyValue.length === 2) {
          const key = keyValue[0].trim();
          const value = keyValue[1].trim();
          dataMap[key] = value === 'NULL' ? null : value;
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
    const basicInfo = data.find(item => item.mimetype === 'vnd.android.cursor.item/name');
    const phoneNumbers = data.filter(item => item.mimetype === 'vnd.android.cursor.item/phone_v2');
    const emails = data.filter(item => item.mimetype === 'vnd.android.cursor.item/email_v2');
    const events = data.filter(item => item.mimetype === 'vnd.android.cursor.item/contact_event');
    const photo = data.find(item => item.mimetype === 'vnd.android.cursor.item/photo');
    const nickname = data.find(item => item.mimetype === 'vnd.android.cursor.item/nickname');
    const note = data.find(item => item.mimetype === 'vnd.android.cursor.item/note');
    const groups = data.filter(item => item.mimetype === 'vnd.android.cursor.item/group_membership');
    const identities = data.filter(item => item.mimetype === 'vnd.android.cursor.item/identity');
    const whatsappData = data.filter(item => item.account_type === 'com.whatsapp');
    const callingCard = data.find(item => item.mimetype === 'vnd.android.cursor.item/calling_card');
    const position = data.find(item => item.mimetype === 'vnd.android.cursor.item/contact_position');

    return {
      basicInfo,
      phoneNumbers,
      emails,
      events,
      photo,
      nickname,
      note,
      groups,
      identities,
      whatsappData,
      callingCard,
      position,
      allData: data
    };
  };

  useEffect(() => {
    const fetchContactData = async () => {
      if (!phoneNumber || !selectedDevice) {
        setContactData([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // First, try to find contact by phone number
        const phoneQuery = `content://com.android.contacts/data/phones/filter/${phoneNumber}`;
        const phoneCommand = `/Users/raju/Library/Application\\ Support/Pilotfish/platform-tools/adb -s ${selectedDevice.id} shell content query --uri ${phoneQuery}`;
        
        console.log('=== DEBUG: Phone query command:', phoneCommand);
        
        const phoneResponse = await ipc.client.adb.getContactByPhone({
          deviceId: selectedDevice.id,
          phoneNumber: phoneNumber
        });

        let contactId: string | null = null;
        
        if (phoneResponse.success && phoneResponse.data) {
          console.log('=== DEBUG: Phone query response:', phoneResponse.data);
          const phoneData = parseContactData(phoneResponse.data);
          if (phoneData.length > 0) {
            contactId = phoneData[0].contact_id;
            console.log('=== DEBUG: Found contact ID:', contactId);
          }
        }

        if (contactId) {
          // Fetch full contact data using contact_id
          const contactQuery = `content://com.android.contacts/data --where "contact_id=${contactId}"`;
          const contactCommand = `/Users/raju/Library/Application\\ Support/Pilotfish/platform-tools/adb -s ${selectedDevice.id} shell content query --uri ${contactQuery}`;
          
          console.log('=== DEBUG: Contact query command:', contactCommand);
          
          const contactResponse = await ipc.client.adb.getContactDetails({
            deviceId: selectedDevice.id,
            contactId: contactId
          });

          if (contactResponse.success && contactResponse.data) {
            console.log('=== DEBUG: Contact data response:', contactResponse.data);
            const parsedData = parseContactData(contactResponse.data);
            setContactData(parsedData);
          } else {
            console.log('=== DEBUG: Contact query failed:', contactResponse);
            setError('Failed to fetch contact details');
          }
        } else {
          setError('Contact not found for this phone number');
        }
      } catch (err) {
        console.error('=== DEBUG: Error fetching contact data:', err);
        setError('Error fetching contact data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactData();
  }, [phoneNumber, selectedDevice]);

  const organizedData = organizeContactData(contactData);

  const formatEventType = (type?: string) => {
    switch (type) {
      case '1': return 'Birthday';
      case '2': return 'Anniversary';
      case '3': return 'Other';
      default: return 'Event';
    }
  };

  const formatPhoneNumber = (number?: string, type?: string) => {
    if (!number) return '';
    
    let label = 'Phone';
    switch (type) {
      case '1': label = 'Home'; break;
      case '2': label = 'Mobile'; break;
      case '3': label = 'Work'; break;
      default: label = 'Phone'; break;
    }
    
    return `${label}: ${number}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-3"></div>
          <p className="text-sm text-muted-foreground">Loading contact details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-2">{error}</p>
          <p className="text-xs text-muted-foreground">
            This number may not be saved in your contacts.
          </p>
        </div>
      </div>
    );
  }

  if (contactData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No contact information available for this number.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            This number is not saved in your contacts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Contact Header */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-4 mb-4">
          {organizedData.photo?.photo_thumb_uri ? (
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">
                {organizedData.basicInfo?.display_name || contactName || 'Unknown Contact'}
              </h2>
              {organizedData.basicInfo?.starred === '1' && (
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {organizedData.basicInfo?.account_name || 'Local Contact'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          {organizedData.phoneNumbers.map((phone, index) => (
            <button
              key={index}
              className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors text-sm"
            >
              <Phone className="h-4 w-4" />
              Call
            </button>
          ))}
          <button className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors text-sm">
            <MessageCircle className="h-4 w-4" />
            Message
          </button>
        </div>
      </div>

      {/* Phone Numbers */}
      {organizedData.phoneNumbers.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Phone Numbers</h3>
          </div>
          <div className="space-y-2">
            {organizedData.phoneNumbers.map((phone, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{phone.data1 || phone.data4}</p>
                  <p className="text-xs text-muted-foreground">
                    {phone.is_primary === '1' ? 'Primary' : ''}
                    {phone.is_super_primary === '1' ? 'Super Primary' : ''}
                    {phone.data2 === '1' ? 'Home' : phone.data2 === '2' ? 'Mobile' : phone.data2 === '3' ? 'Work' : 'Other'}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button className="p-1 hover:bg-muted rounded">
                    <Phone className="h-3 w-3" />
                  </button>
                  <button className="p-1 hover:bg-muted rounded">
                    <MessageCircle className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Basic Information</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Display Name</p>
            <p className="text-sm">{organizedData.basicInfo?.display_name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Contact ID</p>
            <p className="text-sm font-mono">{organizedData.basicInfo?.contact_id || 'N/A'}</p>
          </div>
          {organizedData.nickname && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Nickname</p>
              <p className="text-sm">{organizedData.nickname.data1 || 'N/A'}</p>
            </div>
          )}
          {organizedData.basicInfo?.starred === '1' && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Starred</p>
              <p className="text-sm">Yes</p>
            </div>
          )}
        </div>
      </div>

      {/* Events (Birthday, Anniversary) */}
      {organizedData.events.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Events</h3>
          </div>
          <div className="space-y-2">
            {organizedData.events.map((event, index) => (
              <div key={index} className="flex items-center gap-3">
                <Cake className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{formatEventType(event.data2)}</p>
                  <p className="text-xs text-muted-foreground">{event.data1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WhatsApp Integration */}
      {organizedData.whatsappData.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-4 w-4 text-green-500" />
            <h3 className="text-sm font-semibold">WhatsApp</h3>
          </div>
          <div className="space-y-2">
            {organizedData.whatsappData.map((item, index) => {
              if (item.mimetype === 'vnd.android.cursor.item/vnd.com.whatsapp.profile') {
                return (
                  <div key={index} className="flex items-center gap-2">
                    <p className="text-sm">{item.data3}</p>
                  </div>
                );
              }
              if (item.mimetype.includes('call')) {
                return (
                  <div key={index} className="flex items-center gap-2">
                    {item.mimetype.includes('video') ? <Video className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                    <p className="text-sm">{item.data3}</p>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}

      {/* Groups */}
      {organizedData.groups.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Groups</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {organizedData.groups.map((group, index) => (
              <span key={index} className="px-2 py-1 bg-muted text-xs rounded">
                Group {group.data1}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Note */}
      {organizedData.note && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Note</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {organizedData.note.data1 || 'No note available'}
          </p>
        </div>
      )}

      {/* Technical Details */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Technical Details</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="font-medium text-muted-foreground">Raw Contact ID</p>
            <p className="font-mono">{organizedData.basicInfo?.raw_contact_id || 'N/A'}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Account Type</p>
            <p className="font-mono">{organizedData.basicInfo?.account_type || 'N/A'}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Lookup URI</p>
            <p className="font-mono break-all">{organizedData.basicInfo?.lookup || 'N/A'}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Photo URI</p>
            <p className="font-mono break-all">{organizedData.basicInfo?.photo_uri || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
