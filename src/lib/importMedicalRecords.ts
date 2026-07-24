import * as XLSX from "xlsx";
import {
  extractDriveFileId,
  isImportableDriveUrl,
  toDriveDownloadUrl,
} from "@/lib/driveLinks";
import {
  createRecordId,
  type MedicalRecord,
  recordDedupeKey,
} from "@/lib/medicalRecords";

const COL = {
  encounterDate: 0,
  primaryProvider: 1,
  facility: 2,
  bodyParts: 3,
  medicineTypes: 4,
  recordType: 5,
  summary: 6,
  pdfUrl: 7,
} as const;

function urlFromCell(cell: XLSX.CellObject | undefined): string | null {
  if (!cell) return null;

  const target = cell.l?.Target;
  if (typeof target === "string" && target.trim()) {
    return target.trim();
  }

  const value = String(cell.v ?? cell.w ?? "").trim();
  if (value.startsWith("http")) return value;

  return null;
}

function splitList(value: string): string[] {
  return value
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function cellText(cell: XLSX.CellObject | undefined): string {
  if (!cell) return "";
  return String(cell.v ?? cell.w ?? "").trim();
}

function parseEncounterDate(cell: XLSX.CellObject | undefined): {
  date: string;
  warning: boolean;
} {
  if (!cell) return { date: "unknown", warning: true };

  const raw = cell.v;
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    return { date: raw.toISOString().slice(0, 10), warning: false };
  }

  if (typeof raw === "number" && Number.isFinite(raw)) {
    const parsed = XLSX.SSF.parse_date_code(raw);
    if (parsed) {
      const y = parsed.y;
      const m = String(parsed.m).padStart(2, "0");
      const d = String(parsed.d).padStart(2, "0");
      return { date: `${y}-${m}-${d}`, warning: false };
    }
  }

  const text = cellText(cell);
  if (!text) return { date: "unknown", warning: true };

  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return { date: isoMatch[0], warning: false };

  const parsedMs = Date.parse(text);
  if (!Number.isNaN(parsedMs)) {
    return { date: new Date(parsedMs).toISOString().slice(0, 10), warning: false };
  }

  return { date: "unknown", warning: true };
}

function isHeaderRow(sheet: XLSX.WorkSheet, rowIndex: number): boolean {
  const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: COL.encounterDate });
  const label = cellText(sheet[cellRef]).toLowerCase();
  return label.includes("encounter") && label.includes("date");
}

function rowIsEmpty(sheet: XLSX.WorkSheet, rowIndex: number): boolean {
  for (let c = 0; c <= COL.pdfUrl; c++) {
    const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c });
    if (cellText(sheet[cellRef])) return false;
    if (urlFromCell(sheet[cellRef])) return false;
  }
  return true;
}

function parsePdfFields(cell: XLSX.CellObject | undefined): {
  pdfUrl?: string;
  pdfDownloadUrl?: string;
} {
  const url = urlFromCell(cell);
  if (!url) return {};

  if (isImportableDriveUrl(url)) {
    const fileId = extractDriveFileId(url);
    return {
      pdfUrl: url,
      pdfDownloadUrl: fileId ? toDriveDownloadUrl(fileId) : undefined,
    };
  }

  if (url.startsWith("http")) {
    return { pdfUrl: url };
  }

  return {};
}

export async function parseMedicalRecordsFromFile(
  file: File,
  clientId: string,
): Promise<MedicalRecord[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) return [];

  const sheet = workbook.Sheets[firstSheetName];
  if (!sheet["!ref"]) return [];

  const range = XLSX.utils.decode_range(sheet["!ref"]);
  const seen = new Set<string>();
  const records: MedicalRecord[] = [];

  for (let r = range.s.r; r <= range.e.r; r++) {
    if (isHeaderRow(sheet, r) || rowIsEmpty(sheet, r)) continue;

    const { date, warning } = parseEncounterDate(
      sheet[XLSX.utils.encode_cell({ r, c: COL.encounterDate })],
    );

    const primaryProvider = cellText(
      sheet[XLSX.utils.encode_cell({ r, c: COL.primaryProvider })],
    );
    const facility = cellText(
      sheet[XLSX.utils.encode_cell({ r, c: COL.facility })],
    );
    const bodyParts = splitList(
      cellText(sheet[XLSX.utils.encode_cell({ r, c: COL.bodyParts })]),
    );
    const medicineTypes = splitList(
      cellText(sheet[XLSX.utils.encode_cell({ r, c: COL.medicineTypes })]),
    );
    const recordType =
      cellText(sheet[XLSX.utils.encode_cell({ r, c: COL.recordType })]) ||
      "Other";
    const summary = cellText(
      sheet[XLSX.utils.encode_cell({ r, c: COL.summary })],
    );
    const pdfFields = parsePdfFields(
      sheet[XLSX.utils.encode_cell({ r, c: COL.pdfUrl })],
    );

    const draft: MedicalRecord = {
      id: createRecordId(),
      clientId,
      encounterDate: date,
      dateWarning: warning,
      primaryProvider,
      facility,
      bodyParts,
      medicineTypes,
      recordType,
      summary,
      ...pdfFields,
    };

    const key = recordDedupeKey(draft);
    if (seen.has(key)) continue;
    seen.add(key);
    records.push(draft);
  }

  return records;
}

export function recordsToDocuments(records: MedicalRecord[]) {
  return records
    .filter((r) => r.pdfUrl)
    .map((r) => ({
      id: r.id,
      name: r.pdfUrl
        ? `${r.recordType} — ${r.encounterDate !== "unknown" ? r.encounterDate : "Undated"}.pdf`
        : "Imported record.pdf",
      type: String(r.recordType),
      category: "Intake",
      uploadDate: r.encounterDate !== "unknown" ? r.encounterDate : new Date().toISOString().slice(0, 10),
      status: "Linked" as const,
      sourceUrl: r.pdfUrl,
      downloadUrl: r.pdfDownloadUrl,
    }));
}
