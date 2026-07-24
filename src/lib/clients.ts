import { deleteRecordsForClient } from "@/lib/medicalRecords";

export type ClientStatus =
  | "Intake"
  | "Active"
  | "Treatment"
  | "Demand"
  | "Settled"
  | "Closed";

export type Client = {
  id: string;
  name: string;
  status: ClientStatus;
  dateAdded: string; // ISO date YYYY-MM-DD
};

export const CLIENT_STATUSES: ClientStatus[] = [
  "Intake",
  "Active",
  "Treatment",
  "Demand",
  "Settled",
  "Closed",
];

const STORAGE_KEY = "caseflow.clients";

export function createClientId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `client-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function loadClients(): Client[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Client[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveClients(clients: Client[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

export function getClientById(id: string): Client | undefined {
  return loadClients().find((c) => c.id === id);
}

export function deleteClient(id: string): void {
  saveClients(loadClients().filter((c) => c.id !== id));
  deleteRecordsForClient(id);
}

export function formatDisplayDate(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
