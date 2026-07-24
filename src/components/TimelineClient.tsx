"use client";

import { useState } from "react";
import { Card } from "@/components/PageShell";
import AIBadge from "@/components/AIBadge";
import SeverityBar from "@/components/SeverityBar";
import { treatmentTimeline as t } from "@/lib/mockData";
import {
  Image as ImageIcon,
  X,
  Sparkles,
  Download,
  Loader2,
  CheckCircle2,
  FileText,
  AlertTriangle,
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

export default function TimelineClient() {
  const [photoOpen, setPhotoOpen] = useState(false);
  const [outcomesOpen, setOutcomesOpen] = useState(false);
  const [exportState, setExportState] = useState<"idle" | "loading" | "ready">("idle");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [history, setHistory] = useState(t.exportHistory);

  function runExport() {
    setExportState("loading");
    setTimeout(() => {
      setExportState("ready");
      setPreviewOpen(true);
      setHistory((h) => [
        {
          name: `Alvarez_Treatment_Timeline_v${h.length + 1}.pdf`,
          date: new Date().toISOString().slice(0, 10),
          format: "PDF",
        },
        ...h,
      ]);
    }, 1400);
  }

  return (
    <>
      {/* Primary summary card */}
      <Card className="mb-8 p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-6">
            <SeverityBar value={t.severity} label={t.severityLabel} />

            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  t.injuryClassification === "Permanent"
                    ? "bg-red/10 text-red"
                    : "bg-green/10 text-green"
                }`}
              >
                {t.injuryClassification} injury
              </span>
              <button
                onClick={() => setPhotoOpen(true)}
                className="flex items-center gap-1.5 rounded-full border border-navy/15 px-3 py-1.5 text-xs font-medium text-navy transition hover:border-gold hover:text-gold-light"
              >
                <ImageIcon size={13} /> View incident photo
              </button>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Symptoms
                </p>
                <AIBadge />
              </div>
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {t.symptoms.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-navy/80">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                Treatment
              </p>
              <p className="text-sm leading-relaxed text-navy/80">{t.treatmentSummary}</p>
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
              onClick={() => setOutcomesOpen(true)}
              className="rounded-full bg-navy px-4 py-2.5 text-xs font-semibold text-gold transition hover:bg-navy-light"
            >
              Generate Possible Outcomes
            </button>
          </div>
        </div>
      </Card>

      {/* Visual timeline */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif-display text-lg font-semibold text-navy">
          Treatment chronology
        </h2>
        <button
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
          {t.events.map((e, i) => (
            <div key={e.date + e.eventType} className="flex flex-1 flex-col items-center text-center">
              <div className="flex w-full items-center">
                <div className={`h-px flex-1 ${i === 0 ? "opacity-0" : "bg-navy/15"}`} />
                <div className="mx-1 h-3 w-3 shrink-0 rounded-full border-2 border-navy bg-gold" />
                <div className={`h-px flex-1 ${i === t.events.length - 1 ? "opacity-0" : "bg-navy/15"}`} />
              </div>
              <p className="mt-3 text-[11px] font-semibold text-navy">
                {new Date(e.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </p>
              <p className="mt-0.5 max-w-[8rem] text-[11px] leading-tight text-navy/60">
                {e.eventType}
              </p>
              {e.gapAfterDays && (
                <span className="mt-1.5 flex items-center gap-1 rounded-full bg-red/10 px-2 py-0.5 text-[10px] font-medium text-red">
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
            {t.events.map((e) => (
              <tr key={e.date + e.eventType} className="align-top transition hover:bg-navy/[0.02]">
                <td className="whitespace-nowrap px-5 py-3 font-medium text-navy">
                  {new Date(e.date).toLocaleDateString()}
                </td>
                <td className="px-5 py-3 text-navy/80">{e.provider}</td>
                <td className="px-5 py-3 text-navy/80">{e.eventType}</td>
                <td className="px-5 py-3 text-navy/70">{e.notes}</td>
                <td className="whitespace-nowrap px-5 py-3">
                  <span className="flex items-center gap-1.5 text-xs text-muted">
                    <FileText size={12} /> {e.source}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div>
        <h2 className="mb-4 font-serif-display text-lg font-semibold text-navy">Export history</h2>
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
              <button className="flex items-center gap-1 text-xs font-medium text-navy/60 hover:text-gold-light">
                <Download size={13} /> Download
              </button>
            </div>
          ))}
        </Card>
      </div>

      {/* Photo modal */}
      <Modal open={photoOpen} onClose={() => setPhotoOpen(false)} title="Incident photo">
        <div className="flex aspect-video items-center justify-center rounded-xl border border-line bg-navy/[0.04] text-sm text-muted">
          Accident scene photo placeholder — Accident_Scene_Photo_01.jpg
        </div>
      </Modal>

      {/* Outcomes modal */}
      <Modal
        open={outcomesOpen}
        onClose={() => setOutcomesOpen(false)}
        title="Possible outcomes"
        wide
      >
        <div className="mb-4">
          <AIBadge label="AI-generated projection — not a medical diagnosis, requires professional review" />
        </div>
        <ul className="space-y-3 text-sm text-navy/80">
          <li className="rounded-lg border border-line/70 p-4">
            <p className="font-medium text-navy">Recurrent lumbar strain under physical load</p>
            <p className="mt-1 text-navy/60">
              Given the L4-L5 herniation and residual stiffness noted at PT discharge, exertion or
              prolonged static posture could plausibly trigger symptom flare-ups.
            </p>
          </li>
          <li className="rounded-lg border border-line/70 p-4">
            <p className="font-medium text-navy">Chronic intermittent nerve-root irritation</p>
            <p className="mt-1 text-navy/60">
              Mild nerve root impingement documented on imaging is sometimes associated with
              longer-tail intermittent numbness or tingling, particularly with prolonged sitting.
            </p>
          </li>
          <li className="rounded-lg border border-line/70 p-4">
            <p className="font-medium text-navy">Full symptom resolution</p>
            <p className="mt-1 text-navy/60">
              The documented improvement trend (60% at PT discharge) is also consistent with
              continued gradual resolution and no further intervention.
            </p>
          </li>
        </ul>
      </Modal>

      {/* Export preview modal */}
      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} title="Report ready" wide>
        <div className="mb-5 flex items-center gap-2 text-green">
          <CheckCircle2 size={18} />
          <p className="text-sm font-medium">Timeline report generated successfully.</p>
        </div>
        <div className="mb-5 rounded-xl border border-line bg-white/60 p-5">
          <p className="font-serif-display text-base font-semibold text-navy">
            Alvarez_Treatment_Timeline.pdf
          </p>
          <p className="mt-1 text-xs text-muted">
            Cover page · visual timeline · chronology table · summary stats · AI disclaimer footer
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Treatment span", value: "133 days" },
              { label: "Providers", value: "5" },
              { label: "Visits / procedures", value: "6" },
              { label: "Flagged gaps", value: "1" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg bg-navy/[0.04] p-3 text-center">
                <p className="font-serif-display text-lg font-semibold text-navy">{s.value}</p>
                <p className="text-[10px] uppercase tracking-wide text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-xs font-semibold text-navy hover:bg-gold-light">
            <Download size={14} /> Download PDF
          </button>
          <button className="rounded-full border border-navy/15 px-4 py-2 text-xs font-medium text-navy hover:border-gold">
            Share / email
          </button>
        </div>
      </Modal>
    </>
  );
}
