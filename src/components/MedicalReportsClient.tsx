"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@/components/PageShell";
import AnatomyMap from "@/components/AnatomyMap";
import MedicalRecordsChat from "@/components/MedicalRecordsChat";
import MedicalCitationChat from "@/components/MedicalCitationChat";
import SeverityChip from "@/components/SeverityChip";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import { ExternalLink } from "lucide-react";

export default function MedicalReportsClient() {
  const pathname = usePathname();
  const clientId = pathname.match(/^\/clients\/([^/]+)/)?.[1];
  const { records, ready } = useMedicalRecords(clientId);

  const grouped = records.reduce<Record<string, typeof records>>((acc, r) => {
    const key = String(r.recordType) || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  const groups = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-navy/60">
          {ready ? `${records.length} imported record${records.length === 1 ? "" : "s"}` : "Loading…"}
        </p>
        {clientId && (
          <Link
            href={`/clients/${clientId}/health-summary`}
            className="rounded-full border border-navy/15 px-4 py-2 text-xs font-semibold text-navy transition hover:border-accent"
          >
            View Health Summary
          </Link>
        )}
      </div>

      {!ready ? (
        <Card className="p-10 text-center text-sm text-muted">Loading records…</Card>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <Card className="flex flex-col items-center p-6">
              <h2 className="mb-4 font-serif-display text-lg font-semibold text-navy">
                Anatomical injury map
              </h2>
              <AnatomyMap records={records} />
            </Card>

            <div className="flex flex-col gap-6">
              {records.length === 0 ? (
                <Card className="p-10 text-center">
                  <p className="font-medium text-navy">No medical reports yet</p>
                  <p className="mt-1 text-sm text-muted">
                    Import Excel records from Documents to populate this view.
                  </p>
                </Card>
              ) : (
                groups.map(([recordType, items]) => (
                  <section key={recordType}>
                    <h2 className="mb-4 font-serif-display text-lg font-semibold text-navy">
                      Summary — {recordType}
                      <span className="ml-2 text-sm font-normal text-muted">({items.length})</span>
                    </h2>
                    <div className="grid gap-4">
                      {items.map((record) => (
                        <Card key={record.id} className="p-6">
                          <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-xs uppercase tracking-wide text-muted">
                                {record.facility}
                                {record.encounterDate !== "unknown" &&
                                  ` · ${new Date(record.encounterDate + "T00:00:00").toLocaleDateString()}`}
                              </p>
                              <p className="mt-1 font-medium text-navy">{record.primaryProvider}</p>
                            </div>
                            {record.severityFlag && (
                              <SeverityChip flag={record.severityFlag} />
                            )}
                          </div>
                          <p className="text-[15px] leading-relaxed text-navy/80">
                            {record.executiveSummary ?? record.summary}
                          </p>
                          {record.bodyParts.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {record.bodyParts.map((part) => (
                                <span
                                  key={part}
                                  className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-navy/70"
                                >
                                  {part}
                                </span>
                              ))}
                            </div>
                          )}
                          {record.pdfUrl && (
                            <a
                              href={record.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-navy transition hover:brightness-95"
                            >
                              <ExternalLink size={14} />
                              View Original PDF
                            </a>
                          )}
                        </Card>
                      ))}
                    </div>
                  </section>
                ))
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <MedicalRecordsChat records={records} />
            <MedicalCitationChat records={records} />
          </div>
        </div>
      )}
    </>
  );
}
