import {
  sortRecordsByDate,
  type MedicalRecord,
  type SeverityFlag,
} from "@/lib/medicalRecords";

export type TimelineEvent = {
  id: string;
  date: string;
  provider: string;
  eventType: string;
  notes: string;
  source: string;
  sourceUrl?: string;
  gapAfterDays?: number;
};

export type TimelineView = {
  severity: number;
  severityLabel: string;
  injuryClassification: "Permanent" | "Non-Permanent";
  symptoms: string[];
  treatmentSummary: string;
  events: TimelineEvent[];
  stats: {
    treatmentSpanDays: number | null;
    providerCount: number;
    visitCount: number;
    gapCount: number;
  };
};

const GAP_THRESHOLD_DAYS = 30;

function daysBetween(a: string, b: string): number {
  const da = new Date(`${a}T00:00:00`);
  const db = new Date(`${b}T00:00:00`);
  return Math.round((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24));
}

function pdfLabel(url: string | undefined): string {
  if (!url) return "—";
  try {
    const path = new URL(url).pathname;
    const name = path.split("/").pop();
    return name && name.length > 0 ? decodeURIComponent(name) : "PDF";
  } catch {
    return "PDF";
  }
}

function providerLabel(record: MedicalRecord): string {
  if (record.primaryProvider && record.facility) {
    return `${record.primaryProvider} — ${record.facility}`;
  }
  return record.primaryProvider || record.facility || "Unknown provider";
}

function severityToImpact(records: MedicalRecord[]): { value: number; label: string } {
  const flags = records.map((r) => r.severityFlag).filter(Boolean) as SeverityFlag[];
  const urgent = flags.filter((f) => f === "Urgent").length;
  const followUp = flags.filter((f) => f === "Requires Follow-up").length;

  if (urgent > 0) {
    return {
      value: Math.min(95, 70 + urgent * 8),
      label: urgent > 1 ? "High Impact" : "Moderate–High Impact",
    };
  }
  if (followUp >= Math.ceil(records.length / 2)) {
    return { value: 62, label: "Moderate–High Impact" };
  }
  if (followUp > 0) {
    return { value: 48, label: "Moderate Impact" };
  }
  return { value: 28, label: "Low–Moderate Impact" };
}

function buildTreatmentSummary(records: MedicalRecord[]): string {
  const dated = sortRecordsByDate(records).filter((r) => r.encounterDate !== "unknown");
  if (dated.length === 0) {
    return "Import medical records from Documents to build a chronological treatment summary.";
  }

  const parts = dated.map((r) => r.executiveSummary ?? r.summary).filter(Boolean);
  if (parts.length === 0) {
    return `${dated.length} encounter${dated.length === 1 ? "" : "s"} on record across the treatment period.`;
  }

  const joined = parts.join(" ");
  if (joined.length <= 320) return joined;
  return `${joined.slice(0, 317)}…`;
}

function collectSymptoms(records: MedicalRecord[]): string[] {
  const fromBodyParts = [
    ...new Set(records.flatMap((r) => r.bodyParts).map((s) => s.trim()).filter(Boolean)),
  ];
  if (fromBodyParts.length > 0) return fromBodyParts.slice(0, 8);

  const fromTags = [
    ...new Set(
      records
        .flatMap((r) => r.aiTags ?? [])
        .map((s) => s.trim())
        .filter((t) => t.length > 2),
    ),
  ];
  return fromTags.slice(0, 8);
}

export function buildTimelineFromRecords(records: MedicalRecord[]): TimelineView {
  const sorted = sortRecordsByDate(records);
  const dated = sorted.filter((r) => r.encounterDate !== "unknown");
  const { value: severity, label: severityLabel } = severityToImpact(sorted);

  const events: TimelineEvent[] = sorted.map((record, i) => {
    let gapAfterDays: number | undefined;
    const next = sorted[i + 1];
    if (
      next &&
      record.encounterDate !== "unknown" &&
      next.encounterDate !== "unknown"
    ) {
      const gap = daysBetween(record.encounterDate, next.encounterDate);
      if (gap >= GAP_THRESHOLD_DAYS) gapAfterDays = gap;
    }

    return {
      id: record.id,
      date: record.encounterDate,
      provider: providerLabel(record),
      eventType: String(record.recordType),
      notes: record.executiveSummary ?? record.summary,
      source: pdfLabel(record.pdfUrl),
      sourceUrl: record.pdfUrl,
      gapAfterDays,
    };
  });

  const providers = new Set(
    sorted.map((r) => r.primaryProvider || r.facility).filter(Boolean),
  );

  let treatmentSpanDays: number | null = null;
  if (dated.length >= 2) {
    treatmentSpanDays = daysBetween(dated[0].encounterDate, dated[dated.length - 1].encounterDate);
  }

  return {
    severity,
    severityLabel,
    injuryClassification: "Non-Permanent",
    symptoms: collectSymptoms(sorted),
    treatmentSummary: buildTreatmentSummary(sorted),
    events,
    stats: {
      treatmentSpanDays,
      providerCount: providers.size,
      visitCount: sorted.length,
      gapCount: events.filter((e) => e.gapAfterDays).length,
    },
  };
}
