import * as XLSX from "xlsx";
import {
  extractDriveFileId,
  isImportableDriveUrl,
  toDriveDownloadUrl,
} from "@/lib/driveLinks";

export type CaseDocument = {
  id: string;
  name: string;
  type: string;
  category: string;
  uploadDate: string;
  status: "Processed" | "Processing" | "Linked";
  sourceUrl?: string;
  downloadUrl?: string;
};

const LINK_COLUMN_INDEX = 7;

function createDocId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `doc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

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

export async function parseSpreadsheetLinks(file: File): Promise<string[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) return [];

  const sheet = workbook.Sheets[firstSheetName];
  if (!sheet["!ref"]) return [];

  const range = XLSX.utils.decode_range(sheet["!ref"]);
  const seen = new Set<string>();
  const links: string[] = [];

  for (let r = range.s.r; r <= range.e.r; r++) {
    const cellRef = XLSX.utils.encode_cell({ r, c: LINK_COLUMN_INDEX });
    const url = urlFromCell(sheet[cellRef]);
    if (!url || !isImportableDriveUrl(url) || seen.has(url)) continue;
    seen.add(url);
    links.push(url);
  }

  return links;
}

export function linksToCaseDocuments(links: string[]): CaseDocument[] {
  const today = new Date().toISOString().slice(0, 10);
  const docs: CaseDocument[] = [];

  for (const sourceUrl of links) {
    const fileId = extractDriveFileId(sourceUrl);
    if (!fileId) continue;

    docs.push({
      id: createDocId(),
      name: `drive-${fileId.slice(0, 8)}.pdf`,
      type: "Imported PDF",
      category: "Intake",
      uploadDate: today,
      status: "Linked",
      sourceUrl,
      downloadUrl: toDriveDownloadUrl(fileId),
    });
  }

  return docs;
}

export async function importDocumentsFromSpreadsheet(
  file: File,
): Promise<CaseDocument[]> {
  const links = await parseSpreadsheetLinks(file);
  return linksToCaseDocuments(links);
}
