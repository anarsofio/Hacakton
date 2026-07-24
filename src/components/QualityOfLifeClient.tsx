"use client";

import { useState } from "react";
import { Card } from "@/components/PageShell";
import AIBadge from "@/components/AIBadge";
import { qualityOfLifeSections, qualityOfLifeSummary } from "@/lib/mockData";
import { CheckCircle2, ChevronLeft, ChevronRight, Save } from "lucide-react";

export default function QualityOfLifeClient() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const total = qualityOfLifeSections.length;
  const section = qualityOfLifeSections[step];

  if (submitted) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card className="p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif-display text-lg font-semibold text-navy">
              Quality of Life Impact — Summary
            </h2>
            <AIBadge />
          </div>
          <p className="text-[15px] leading-relaxed text-navy/80">{qualityOfLifeSummary}</p>
        </Card>

        <Card className="max-h-[32rem] overflow-y-auto p-6">
          <h3 className="mb-3 font-serif-display text-base font-semibold text-navy">
            Raw responses
          </h3>
          <div className="space-y-5">
            {qualityOfLifeSections.map((s) => (
              <div key={s.id}>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gold">
                  {s.title}
                </p>
                <ul className="space-y-2">
                  {s.questions.map((q) => (
                    <li key={q.q}>
                      <p className="text-xs text-muted">{q.q}</p>
                      <p className="text-sm text-navy">{q.a}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl p-6 sm:p-8">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted">
          <span>
            Step {step + 1} of {total}
          </span>
          <span>{section.title}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-navy/10">
          <div
            className="h-full rounded-full bg-gold transition-all"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="mb-5 font-serif-display text-xl font-semibold text-navy">{section.title}</h2>

      <div className="space-y-5">
        {section.questions.map((q) => (
          <div key={q.q}>
            <label className="mb-1.5 block text-sm font-medium text-navy">{q.q}</label>
            <textarea
              defaultValue={q.a}
              rows={2}
              className="w-full resize-none rounded-lg border border-line bg-white/70 px-3.5 py-2.5 text-sm text-navy outline-none transition focus:border-gold"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="flex items-center gap-1 rounded-full border border-navy/15 px-4 py-2 text-xs font-medium text-navy disabled:opacity-40"
        >
          <ChevronLeft size={14} /> Back
        </button>

        <button
          onClick={() => setSaved(true)}
          className="flex items-center gap-1.5 text-xs font-medium text-navy/60 hover:text-gold-light"
        >
          <Save size={13} /> {saved ? "Saved" : "Save & resume later"}
        </button>

        {step < total - 1 ? (
          <button
            onClick={() => setStep((s) => Math.min(total - 1, s + 1))}
            className="flex items-center gap-1 rounded-full bg-navy px-4 py-2 text-xs font-semibold text-gold"
          >
            Next <ChevronRight size={14} />
          </button>
        ) : (
          <button
            onClick={() => setSubmitted(true)}
            className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-xs font-semibold text-navy"
          >
            <CheckCircle2 size={14} /> Submit
          </button>
        )}
      </div>
    </Card>
  );
}
