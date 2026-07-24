"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Card } from "@/components/PageShell";
import SeverityBar from "@/components/SeverityBar";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import { buildTimelineFromRecords } from "@/lib/timelineFromRecords";
import {
  Image as ImageIcon,
  X,
  Sparkles,
  Download,
  Loader2,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Inbox,
} from "lucide-react";

function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 px-4 backdrop-blur-sm">
      <div
        className={`max-h-[85vh] w-full overflow-y-auto rounded-2xl border border-line bg-cream shadow-2xl ${
          wide ? "max-w-2xl" : "max-w-lg"
        }`}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-line/70 bg-cream px-6 py-4">
          <h3 className="font-serif-display text-lg font-semibold text-navy">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-navy/60 transition hover:bg-navy/5 hover:text-navy"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function formatEventDate(date: string, style: "short" | "long" = "long"): string {
  if (date === "unknown" || !date) return "Unknown date";
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(
    undefined,
    style === "short"
      ? { month: "short", day: "numeric" }
      : undefined,
  );
}

export default function TimelineClient() {
  const pathname = usePathname();
  const clientId = pathname.match(/^\/clients\/([^/]+)/)?.[1];
  const { records, ready } = useMedicalRecords(clientId);
  const timeline = useMemo(() => buildTimelineFromRecords(records), [records]);

  const [photoOpen, setPhotoOpen] = useState(false);
  const [outcomesOpen, setOutcomesOpen] = useState(false);
  const [exportState, setExportState] = useState<"idle" | "loading" | "ready">("idle");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [history, setHistory] = useState<
    { name: string; date: string; format: string }[]
  >([]);

  const visualEvents = timeline.events.filter((e) => e.date !== "unknown");

  function runExport() {
    setExportState("loading");
    setTimeout(() => {
      setExportState("ready");
      setPreviewOpen(true);
      setHistory((h) => [
        {
          name: `Treatment_Timeline_v${h.length + 1}.pdf`,
          date: new Date().toISOString().slice(0, 10),
          format: "PDF",
        },
        ...h,
      ]);
    }, 1400);
  }

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
          Import Excel medical records from Documents. Encounters will appear here as a visual
          chronology with summary stats and export options.
        </p>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-8 p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-6">
            <SeverityBar value={timeline.severity} label={timeline.severityLabel} />

            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  timeline.injuryClassification === "Permanent"
                    ? "bg-critical/10 text-critical"
                    : "bg-accent/15 text-navy"
                }`}
              >
                {timeline.injuryClassification} injury
              </span>
              <button
                type="button"
                onClick={() => setPhotoOpen(true)}
                className="flex items-center gap-1.5 rounded-full border border-navy/15 px-3 py-1.5 text-xs font-medium text-navy transition hover:border-gold hover:text-gold-light"
              >
                <ImageIcon size={13} /> View incident photo
              </button>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                Symptoms
              </p>
              {timeline.symptoms.length > 0 ? (
                <ul className="grid gap-1.5 sm:grid-cols-2">
                  {timeline.symptoms.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-navy/80">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                      {s}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-navy/55">
                  No body parts or tags recorded yet — add records with affected areas in the
                  spreadsheet.
                </p>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                Treatment
              </p>
              <p className="text-sm leading-relaxed text-navy/80">{timeline.treatmentSummary}</p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 rounded-xl border border-gold/25 bg-navy/[0.03] p-5">
            <div>
              <p className="flex items-center gap-1.5 font-serif-display text-base font-semibold text-navy">
                <Sparkles size={15} className="text-gold" /> Possible outcomes
              </p>
              <p className="mt-2 text-sm text-navy/60">
                Generate an AI projection of possible delayed or long-term outcomes based on the
                diagnosis and treatment record.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOutcomesOpen(true)}
              className="rounded-full bg-navy px-4 py-2.5 text-xs font-semibold text-gold transition hover:bg-navy-light"
            >
              Generate Possible Outcomes
            </button>
          </div>
        </div>
      </Card>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif-display text-lg font-semibold text-navy">
          Treatment chronology
        </h2>
        <button
          type="button"
          onClick={runExport}
          disabled={exportState === "loading"}
          className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-xs font-semibold text-navy transition hover:bg-gold-light disabled:opacity-70"
        >
          {exportState === "loading" ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Generating report...
            </>
          ) : (
            <>
              <Download size={14} /> Export Timeline Report
            </>
          )}
        </button>
      </div>

      <Card className="mb-4 overflow-x-auto p-6">
        <div className="flex min-w-[640px] items-start justify-between gap-1">
          {visualEvents.map((e, i) => (
            <div key={e.id} className="flex flex-1 flex-col items-center text-center">
              <div className="flex w-full items-center">
                <div className={`h-px flex-1 ${i === 0 ? "opacity-0" : "bg-navy/15"}`} />
                <div className="mx-1 h-3 w-3 shrink-0 rounded-full border-2 border-navy bg-gold" />
                <div
                  className={`h-px flex-1 ${i === visualEvents.length - 1 ? "opacity-0" : "bg-navy/15"}`}
                />
              </div>
              <p className="mt-3 text-[11px] font-semibold text-navy">
                {formatEventDate(e.date, "short")}
              </p>
              <p className="mt-0.5 max-w-[8rem] text-[11px] leading-tight text-navy/60">
                {e.eventType}
              </p>
              {e.gapAfterDays && (
                <span className="mt-1.5 flex items-center gap-1 rounded-full bg-critical/10 px-2 py-0.5 text-[10px] font-medium text-critical">
                  <AlertTriangle size={10} /> {e.gapAfterDays}-day gap
                </span>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-8 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line/70 text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Provider</th>
              <th className="px-5 py-3 font-medium">Treatment type</th>
              <th className="px-5 py-3 font-medium">Diagnosis / notes</th>
              <th className="px-5 py-3 font-medium">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {timeline.events.map((e) => (
              <tr key={e.id} className="align-top transition hover:bg-navy/[0.02]">
                <td className="whitespace-nowrap px-5 py-3 font-medium text-navy">
                  {formatEventDate(e.date)}
                </td>
                <td className="px-5 py-3 text-navy/80">{e.provider}</td>
                <td className="px-5 py-3 text-navy/80">{e.eventType}</td>
                <td className="px-5 py-3 text-navy/70">{e.notes}</td>
                <td className="whitespace-nowrap px-5 py-3">
                  {e.sourceUrl ? (
                    <a
                      href={e.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-muted hover:text-navy"
                    >
                      <FileText size={12} /> {e.source}
                    </a>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs text-muted">
                      <FileText size={12} /> {e.source}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {history.length > 0 && (
        <div>
          <h2 className="mb-4 font-serif-display text-lg font-semibold text-navy">
            Export history
          </h2>
          <Card className="divide-y divide-line/60 p-2">
            {history.map((h) => (
              <div key={h.name} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2.5">
                  <FileText size={15} className="text-navy/40" />
                  <div>
                    <p className="text-sm font-medium text-navy">{h.name}</p>
                    <p className="text-[11px] text-muted">
                      {new Date(h.date).toLocaleDateString()} · {h.format}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-medium text-navy/60 hover:text-gold-light"
                >
                  <Download size={13} /> Download
                </button>
              </div>
            ))}
          </Card>
        </div>
      )}

      <Modal open={photoOpen} onClose={() => setPhotoOpen(false)} title="Incident photo">
        <div className="flex aspect-video items-center justify-center rounded-xl border border-line bg-navy/[0.04] text-sm text-muted">
          Incident photo not linked — upload police report materials in the Police Report stage.
        </div>
      </Modal>

      <Modal
        open={outcomesOpen}
        onClose={() => setOutcomesOpen(false)}
        title="Possible outcomes"
        wide
      >
        <ul className="space-y-3 text-sm text-navy/80">
          {timeline.events.slice(0, 3).map((e) => (
            <li key={e.id} className="rounded-lg border border-line/70 p-4">
              <p className="font-medium text-navy">
                Following {e.eventType.toLowerCase()} ({formatEventDate(e.date, "short")})
              </p>
              <p className="mt-1 text-navy/60">{e.notes}</p>
            </li>
          ))}
          {timeline.events.length === 0 && (
            <li className="text-navy/60">Import records to generate outcome projections.</li>
          )}
        </ul>
      </Modal>

      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} title="Report ready" wide>
        <div className="mb-5 flex items-center gap-2 text-accent">
          <CheckCircle2 size={18} />
          <p className="text-sm font-medium">Timeline report generated successfully.</p>
        </div>
        <div className="mb-5 rounded-xl border border-line bg-white/60 p-5">
          <p className="font-serif-display text-base font-semibold text-navy">
            Treatment_Timeline.pdf
          </p>
          <p className="mt-1 text-xs text-muted">
            Cover page · visual timeline · chronology table · summary stats
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                label: "Treatment span",
                value:
                  timeline.stats.treatmentSpanDays != null
                    ? `${timeline.stats.treatmentSpanDays} days`
                    : "—",
              },
              { label: "Providers", value: String(timeline.stats.providerCount) },
              { label: "Visits / procedures", value: String(timeline.stats.visitCount) },
              { label: "Flagged gaps", value: String(timeline.stats.gapCount) },
            ].map((s) => (
              <div key={s.label} className="rounded-lg bg-navy/[0.04] p-3 text-center">
                <p className="font-serif-display text-lg font-semibold text-navy">{s.value}</p>
                <p className="text-[10px] uppercase tracking-wide text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-xs font-semibold text-navy hover:bg-gold-light"
          >
            <Download size={14} /> Download PDF
          </button>
          <button
            type="button"
            className="rounded-full border border-navy/15 px-4 py-2 text-xs font-medium text-navy hover:border-gold"
          >
            Share / email
          </button>
        </div>
      </Modal>
    </>
  );
}
