"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import { Card, PageHeading } from "@/components/PageShell";
import SeverityChip from "@/components/SeverityChip";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import { Pill, Activity } from "lucide-react";

export default function HealthSummaryClient() {
  const pathname = usePathname();
  const clientId = pathname.match(/^\/clients\/([^/]+)/)?.[1];
  const { records, ready } = useMedicalRecords(clientId);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  const medications = useMemo(() => {
    const set = new Set<string>();
    for (const r of records) {
      for (const m of r.medicineTypes) set.add(m);
    }
    return [...set].sort();
  }, [records]);

  const bodyParts = useMemo(() => {
    const set = new Set<string>();
    for (const r of records) {
      for (const p of r.bodyParts) set.add(p);
    }
    return [...set].sort();
  }, [records]);

  const filtered = selectedPart
    ? records.filter((r) => r.bodyParts.includes(selectedPart))
    : records;

  return (
    <div className="flex min-h-screen flex-col">
      <Header showBack />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <PageHeading
          eyebrow="Clinical overview"
          title="Health Summary"
          description="Active medications and body-part encounter history derived from imported medical records."
        />

        {!ready ? (
          <Card className="p-10 text-center text-sm text-muted">Loading…</Card>
        ) : records.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="font-medium text-navy">No health data yet</p>
            <p className="mt-1 text-sm text-muted">
              Import Excel records from Documents to populate medications and anatomy filters.
            </p>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
            <div className="flex flex-col gap-6">
              <Card className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Pill size={18} className="text-gold" />
                  <h2 className="font-serif-display text-lg font-semibold text-navy">
                    Active medications
                  </h2>
                </div>
                {medications.length === 0 ? (
                  <p className="text-sm text-muted">No medications recorded in imports.</p>
                ) : (
                  <ul className="space-y-2">
                    {medications.map((med) => (
                      <li
                        key={med}
                        className="rounded-lg border border-line/70 bg-white/50 px-3 py-2 text-sm text-navy"
                      >
                        {med}
                      </li>
                    ))}
                  </ul>
                )}
              </Card>

              <Card className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Activity size={18} className="text-gold" />
                  <h2 className="font-serif-display text-lg font-semibold text-navy">
                    Body parts
                  </h2>
                </div>
                {bodyParts.length === 0 ? (
                  <p className="text-sm text-muted">No body parts tagged in imports.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPart(null)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                        selectedPart === null
                          ? "bg-navy text-gold"
                          : "border border-navy/15 text-navy/70 hover:border-gold"
                      }`}
                    >
                      All
                    </button>
                    {bodyParts.map((part) => (
                      <button
                        key={part}
                        type="button"
                        onClick={() => setSelectedPart(part)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                          selectedPart === part
                            ? "bg-navy text-gold"
                            : "border border-navy/15 text-navy/70 hover:border-gold"
                        }`}
                      >
                        {part}
                      </button>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            <div>
              <h2 className="mb-4 font-serif-display text-lg font-semibold text-navy">
                Encounters
                {selectedPart && (
                  <span className="ml-2 text-sm font-normal text-muted">· {selectedPart}</span>
                )}
              </h2>
              <div className="flex flex-col gap-4">
                {filtered.map((record) => (
                  <Card key={record.id} className="p-5">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[11px] font-semibold text-navy">
                        {record.recordType}
                      </span>
                      {record.severityFlag && (
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                            record.severityFlag === "Urgent"
                              ? "bg-red/10 text-red"
                              : record.severityFlag === "Requires Follow-up"
                                ? "bg-orange/10 text-orange"
                                : "bg-green/10 text-green"
                          }`}
                        >
                          {record.severityFlag}
                        </span>
                      )}
                      {record.severityFlag && <SeverityChip flag={record.severityFlag} />}
                    </div>
                    <p className="text-sm font-medium text-navy">
                      {record.encounterDate !== "unknown"
                        ? new Date(record.encounterDate + "T00:00:00").toLocaleDateString()
                        : "Unknown date"}
                      {record.dateWarning && (
                        <span className="ml-2 text-[11px] font-normal text-gold">
                          Date unverified
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-sm text-navy/70">
                      {record.primaryProvider} · {record.facility}
                    </p>
                    <p className="mt-2 text-sm text-navy/80">
                      {record.executiveSummary ?? record.summary}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
