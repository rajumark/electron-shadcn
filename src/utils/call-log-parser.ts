// Valid call log database columns (from the original Kotlin code)
export const VALID_CALL_LOG_COLUMNS = [
  "name",
  "duration",
  "subject",
  "is_call_log_phone_account_migration_pending",
  "source_id",
  "my_number",
  "cloud_antispam_type",
  "subscription_id",
  "cloud_antispam_type_tag",
  "cnap_name",
  "post_dial_digits",
  "call_screening_app_name",
  "priority",
  "number",
  "countryiso",
  "forwarded_call",
  "sync_1",
  "sync_2",
  "sync_3",
  "photo_uri",
  "geocoded_location",
  "call_id_description",
  "missed_reason",
  "call_id_app_name",
  "block_reason",
  "subscription_component_name",
  "add_for_all_users",
  "numbertype",
  "features",
  "call_id_name",
  "transcription",
  "phone_call_type",
  "call_id_nuisance_confidence",
  "missed_count",
  "last_modified",
  "ai",
  "_id",
  "new",
  "date",
  "type",
  "simid",
  "contact_id",
  "presentation",
  "via_number",
  "number_type",
  "numberlabel",
  "normalized_number",
  "composer_photo_uri",
  "phone_account_address",
  "phone_account_hidden",
  "lookup_uri",
  "voicemail_uri",
  "matched_number",
  "call_id_package_name",
  "mark_deleted",
  "transcription_state",
  "data_usage",
  "location",
  "call_screening_component_name",
  "call_id_details",
  "is_read",
  "firewalltype",
  "formatted_number",
  "photo_id",
  "is_business_call",
  "cached_convert_number",
  "asserted_display_name",
];

export interface CallLog {
  contactName?: string;
  duration: number; // in seconds
  id: string;
  phoneNumber: string;
  raw: Record<string, string>; // Raw data from ADB
  timestamp: Date;
  type:
    | "incoming"
    | "outgoing"
    | "missed"
    | "rejected"
    | "blocked"
    | "voicemail"
    | "unknown";
}

export function parseCallLogData(input: string): CallLog[] {
  const lines = input.split("\n").filter((line) => line.trim());
  const callLogs: CallLog[] = [];

  for (const line of lines) {
    const parsedCall = parseSingleCallLog(line);
    if (parsedCall) {
      callLogs.push(parsedCall);
    }
  }

  // Apply name fallback logic - for calls without names, try to find name from other calls with same number
  const phoneNumberToNameMap = new Map<string, string>();

  // First pass: collect all phone numbers that have names
  callLogs.forEach((call) => {
    if (call.contactName && call.phoneNumber) {
      phoneNumberToNameMap.set(call.phoneNumber, call.contactName);
    }
  });

  // Second pass: apply fallback names
  callLogs.forEach((call) => {
    if (
      !call.contactName &&
      call.phoneNumber &&
      phoneNumberToNameMap.has(call.phoneNumber)
    ) {
      call.contactName = phoneNumberToNameMap.get(call.phoneNumber);
    }
  });

  // Sort by ID descending (most recent first)
  return callLogs.sort((a, b) => {
    const aId = Number.parseInt(a.raw._id || "0");
    const bId = Number.parseInt(b.raw._id || "0");
    return bId - aId;
  });
}

function parseSingleCallLog(input: string): CallLog | null {
  if (!(input && input.trim())) {
    return null;
  }

  const dataMap: Record<string, string> = {};

  // Simple, robust parsing approach
  // Remove "Row: X" prefix if it exists
  const cleanInput = input.replace(/^Row:\s*\d+\s*/, "").trim();

  // Split by comma and parse each key=value pair
  const pairs = cleanInput.split(",").map((pair) => pair.trim());

  for (const pair of pairs) {
    const equalIndex = pair.indexOf("=");
    if (equalIndex > 0) {
      const key = pair.substring(0, equalIndex).trim();
      const value = pair.substring(equalIndex + 1).trim();
      dataMap[key] = value;
    }
  }

  // Parse timestamp
  const timestamp = new Date(Number.parseInt(dataMap.date || "0"));

  // Parse duration
  const duration = Number.parseInt(dataMap.duration || "0");

  // Parse call type
  const typeValue = Number.parseInt(dataMap.type || "0");
  let callType: CallLog["type"] = "unknown";
  switch (typeValue) {
    case 1:
      callType = "incoming";
      break;
    case 2:
      callType = "outgoing";
      break;
    case 3:
      callType = "missed";
      break;
    case 4:
      callType = "rejected";
      break;
    case 5:
      callType = "blocked";
      break;
    case 6:
      callType = "voicemail";
      break;
    default:
      callType = "unknown";
      break;
  }

  // Handle contact name
  let contactName: string | undefined = dataMap.name;
  if (!contactName || contactName === "NULL") {
    // Try other possible name fields
    contactName =
      dataMap.cnap_name ||
      dataMap.contact_name ||
      dataMap.contactName ||
      dataMap.cached_name;
  }

  // Clean up the name if it exists
  if (contactName && contactName !== "NULL") {
    contactName = contactName.trim();
    if (contactName === "") {
      contactName = undefined;
    }
  } else {
    contactName = undefined;
  }

  const result = {
    id: dataMap._id || Math.random().toString(),
    phoneNumber: dataMap.number || "",
    contactName: contactName || undefined,
    timestamp,
    duration,
    type: callType,
    raw: dataMap,
  };

  return result;
}

function mapCallTypeString(typeString: string): CallLog["type"] {
  const normalized = typeString.toLowerCase();

  if (normalized.includes("incoming")) {
    return "incoming";
  }
  if (normalized.includes("outgoing")) {
    return "outgoing";
  }
  if (normalized.includes("missed")) {
    return "missed";
  }
  if (normalized.includes("rejected")) {
    return "rejected";
  }
  if (normalized.includes("blocked")) {
    return "blocked";
  }
  if (normalized.includes("voicemail")) {
    return "voicemail";
  }

  return "unknown";
}

function getCallTypeDescription(callType: number): string {
  switch (callType) {
    case 1:
      return "Incoming Call";
    case 2:
      return "Outgoing Call";
    case 3:
      return "Missed Call";
    case 4:
      return "Rejected Call";
    case 5:
      return "Blocked Call";
    case 6:
      return "Voicemail Call";
    default:
      return `Unknown Call Type(type=${callType})`;
  }
}

function convertTimestampToDate(timestamp: string): string {
  try {
    const date = new Date(Number.parseInt(timestamp) * 1); // timestamp is in milliseconds
    const dateFormat = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    return dateFormat.format(date);
  } catch (error) {
    return timestamp;
  }
}

function parseTimestamp(dateString: string): Date {
  try {
    // Try parsing as Unix timestamp in milliseconds first
    const timestamp = Number.parseInt(dateString);
    if (!isNaN(timestamp) && timestamp > 1_000_000_000_000) {
      // Check if it's in milliseconds (after year 2001)
      return new Date(timestamp);
    }
    if (!isNaN(timestamp) && timestamp > 1_000_000_000) {
      // Check if it's in seconds (after year 2001)
      return new Date(timestamp * 1000); // Convert to milliseconds
    }

    // Try parsing as formatted date string
    return new Date(dateString);
  } catch (error) {
    console.error("Timestamp parsing error:", error, "for value:", dateString);
    return new Date(); // Fallback to current time
  }
}

// Utility functions for display
export function formatDuration(seconds: number): string {
  if (seconds === 0) {
    return "";
  }
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0
    ? `${minutes}m ${remainingSeconds}s`
    : `${minutes}m`;
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDate(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  return date.toLocaleDateString();
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
