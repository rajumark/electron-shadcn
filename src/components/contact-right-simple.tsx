import { User } from "lucide-react";

interface Contact {
  contact_id: string;
  display_name: string;
  data1: string;
}

interface ContactRightSimpleProps {
  selectedContact: string;
  contacts: Contact[];
}

export const ContactRightSimple: React.FC<ContactRightSimpleProps> = ({
  selectedContact,
  contacts,
}) => {
  const selectedContactData = contacts.find(contact => contact.contact_id === selectedContact);

  if (!selectedContact || !selectedContactData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Select a contact to view details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="p-4 bg-muted rounded-full inline-block mb-4">
          <User className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold mb-2">
          {selectedContactData.display_name}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {selectedContactData.data1}
        </p>
        <div className="p-3 bg-card border border-border rounded-lg">
          <p className="text-xs font-mono text-muted-foreground mb-1">Contact ID:</p>
          <p className="text-sm font-mono">contact_id={selectedContactData.contact_id}</p>
        </div>
      </div>
    </div>
  );
};
