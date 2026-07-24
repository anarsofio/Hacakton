"use client";

import { usePathname } from "next/navigation";
import { Card } from "@/components/PageShell";
import SeverityChip from "@/components/SeverityChip";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import { ExternalLink, FileText, Inbox } from "lucide-react";

export default function TimelineClient() {
  const pathname = usePathname();
  const clientId = pathname.match(/^\/clients\/([^/]+)/)?.[1];
  const { records, ready } = useMedicalRecords(clientId);

  if (!ready) {
    return (
      <Card className="p-10 text-center text-sm text-muted">Loading timeline…</Card>
    );
  }

  if (records.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-3 p-16 text-center">
        <Inbox size={28} className="text-navy/30" strokeWidth={1.5} />
        <p className="font-medium text-navy">No treatment timeline yet</p>
        <p className="max-w-md text-sm text-muted">
          Import Excel medical records from Documents. Encounters will appear here chronologically
          with summaries and PDF links.
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif-display text-lg font-semibold text-navy">
          Treatment chronology
        </h2>
        <p className="text-xs text-muted">{records.length} encounters</p>
      </div>

      <div className="mb-8 flex flex-col gap-4">
        {records.map((record) => (
          <Card key={record.id} className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-semibold text-navy">
                    {record.recordType}
                  </span>
                  {record.severityFlag && <SeverityChip flag={record.severityFlag} />}
                  {record.dateWarning && (
                    <span className="rounded-full border border-warning/40 bg-warning/15 px-2.5 py-0.5 text-[11px] font-medium text-navy">
                      Date unverified
                    </span>
                  )}
                </div>
                <p className="mt-2 font-serif-display text-base font-semibold text-navy">
                  {record.encounterDate !== "unknown"
                    ? new Date(record.encounterDate + "T00:00:00").toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Unknown date"}
                </p>
                <p className="mt-1 text-sm text-navy/70">
                  {record.primaryProvider} · {record.facility}
                </p>
              </div>
              {record.pdfUrl && (
                <a
                  href={record.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-navy/15 px-3 py-1.5 text-xs font-medium text-navy transition hover:border-accent"
                >
                  <ExternalLink size={13} />
                  PDF
                </a>
              )}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-navy/80">
              {record.executiveSummary ??
                (record.summary.length > 220
                  ? `${record.summary.slice(0, 220)}…`
                  : record.summary)}
            </p>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line/70 text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Provider</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Summary</th>
              <th className="px-5 py-3 font-medium">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {records.map((record) => (
              <tr key={record.id} className="align-top transition hover:bg-navy/[0.02]">
                <td className="whitespace-nowrap px-5 py-3 font-medium text-navy">
                  {record.encounterDate !== "unknown"
                    ? new Date(record.encounterDate + "T00:00:00").toLocaleDateString()
                    : "Unknown"}
                </td>
                <td className="px-5 py-3 text-navy/80">{record.primaryProvider}</td>
                <td className="px-5 py-3 text-navy/80">{record.recordType}</td>
                <td className="px-5 py-3 text-navy/70">
                  {record.executiveSummary ?? record.summary}
                </td>
                <td className="whitespace-nowrap px-5 py-3">
                  {record.pdfUrl ? (
                    <a
                      href={record.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-muted hover:text-navy"
                    >
                      <FileText size={12} /> PDF
                    </a>
                  ) : (
                    <span className="text-xs text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
