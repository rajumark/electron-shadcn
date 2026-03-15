import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ContactLeftSide } from "@/components/contact-left";
import { ContactRightSimple } from "@/components/contact-right-simple";

interface Contact {
  contact_id: string;
  display_name: string;
  data1: string;
}

function ContactsPage() {
  const { t } = useTranslation();
  const [leftWidth, setLeftWidth] = useState(30);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedContact, setSelectedContact] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!(isDragging && containerRef.current)) {
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth =
      ((e.clientX - containerRect.left) / containerRect.width) * 100;

    if (newLeftWidth >= 20 && newLeftWidth <= 80) {
      setLeftWidth(newLeftWidth);
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="flex h-full overflow-hidden">
      <div className="relative flex flex-1 min-w-0" ref={containerRef}>
        {/* Left Section - Contacts List */}
        <ContactLeftSide
          leftWidth={leftWidth}
          selectedContact={selectedContact}
          onContactSelect={setSelectedContact}
          isDragging={isDragging}
          onDragStart={handleMouseDown}
          onContactsUpdate={setContacts}
        />

        {/* Resizable Divider */}
        <div
          className="relative cursor-col-resize bg-gray-300 hover:bg-gray-400 transition-colors"
          style={{ width: '0.5px' }}
          onMouseDown={handleMouseDown}
        />

        {/* Right Section - Contact Details */}
        <ContactRightSimple selectedContact={selectedContact} contacts={contacts} />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/contacts")({
  component: ContactsPage,
});
