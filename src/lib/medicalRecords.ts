export type SeverityFlag = "Normal" | "Requires Follow-up" | "Urgent";

export type RecordType =
  | "Consultation"
  | "Imaging/MRI"
  | "Lab Test"
  | "Surgery"
  | "Other";

export type MedicalRecord = {
  id: string;
  clientId: string;
  encounterDate: string;
  dateWarning?: boolean;
  primaryProvider: string;
  facility: string;
  bodyParts: string[];
  medicineTypes: string[];
  recordType: RecordType | string;
  summary: string;
  pdfUrl?: string;
  pdfDownloadUrl?: string;
  executiveSummary?: string;
  aiTags?: string[];
  severityFlag?: SeverityFlag;
  enrichedAt?: string;
};

function storageKey(clientId: string): string {
  return `caseflow.medicalRecords.${clientId}`;
}

export function createRecordId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `rec-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function recordDedupeKey(record: Pick<MedicalRecord, "encounterDate" | "facility" | "summary">): string {
  return `${record.encounterDate}|${record.facility}|${record.summary}`;
}

export function loadRecords(clientId: string): MedicalRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(clientId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MedicalRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRecords(clientId: string, records: MedicalRecord[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(clientId), JSON.stringify(records));
}

export function deleteRecordsForClient(clientId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(storageKey(clientId));
}

export function appendRecords(clientId: string, incoming: MedicalRecord[]): {
  added: MedicalRecord[];
  skipped: number;
} {
  const existing = loadRecords(clientId);
  const seen = new Set(existing.map(recordDedupeKey));
  const added: MedicalRecord[] = [];

  for (const record of incoming) {
    const key = recordDedupeKey(record);
    if (seen.has(key)) continue;
    seen.add(key);
    added.push(record);
  }

  if (added.length > 0) {
    saveRecords(clientId, [...existing, ...added]);
  }

  return { added, skipped: incoming.length - added.length };
}

export function sortRecordsByDate(records: MedicalRecord[]): MedicalRecord[] {
  return [...records].sort((a, b) => {
    if (a.encounterDate === "unknown" && b.encounterDate === "unknown") return 0;
    if (a.encounterDate === "unknown") return 1;
    if (b.encounterDate === "unknown") return -1;
    return a.encounterDate.localeCompare(b.encounterDate);
  });
}
