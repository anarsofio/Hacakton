"use client";

import { useState } from "react";
import { Card } from "@/components/PageShell";
import PrimaryButton from "@/components/PrimaryButton";
import { caseOverview, negotiationLetterDraft } from "@/lib/mockData";
import { Download, FileDown, Loader2 } from "lucide-react";

export default function NegotiationLetterClient() {
  const [draft, setDraft] = useState(negotiationLetterDraft);
  const [customNotes, setCustomNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function redoLetter() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/gemini/redo-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentDraft: draft,
          customNotes,
          caseContext: `${caseOverview.clientName} — ${caseOverview.caseNumber}`,
        }),
      });
      const data = (await res.json()) as { letter?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not regenerate letter");
        return;
      }
      if (data.letter) setDraft(data.letter);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
      <div className="flex flex-col gap-4">
        <Card className="p-5">
          <label className="mb-2 block text-sm font-medium text-navy">
            Custom notes / instructions
          </label>
          <textarea
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            rows={4}
            placeholder="Add case nuances, additional points, or tone instructions for regeneration…"
            className="w-full resize-none rounded-lg border border-line bg-white/70 px-3.5 py-2.5 text-sm text-navy outline-none focus:border-accent"
          />
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 font-serif-display text-lg font-semibold text-navy">Draft letter</h2>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={22}
            className="w-full resize-y rounded-lg border border-line bg-white/70 p-4 font-serif-display text-[13.5px] leading-relaxed text-navy outline-none transition focus:border-accent"
          />
          {error && <p className="mt-2 text-xs text-critical">{error}</p>}
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Card className="p-5">
          <h3 className="mb-3 font-serif-display text-base font-semibold text-navy">
            Compiled from
          </h3>
          <ul className="space-y-2 text-sm text-navy/70">
            <li>· Police Report facts</li>
            <li>· Medical Reports diagnoses</li>
            <li>· Treatment Timeline / chronology</li>
            <li>· Quality of Life questionnaire</li>
            <li>· Pecuniary Damages totals</li>
          </ul>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 font-serif-display text-base font-semibold text-navy">Export</h3>
          <div className="flex flex-col gap-2">
            <button className="flex items-center justify-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-xs font-semibold text-navy hover:brightness-95">
              <FileDown size={14} /> Export as PDF
            </button>
            <button className="flex items-center justify-center gap-1.5 rounded-full border border-navy/15 px-4 py-2.5 text-xs font-medium text-navy hover:border-accent">
              <Download size={14} /> Export as Word (.docx)
            </button>
            <PrimaryButton
              onClick={redoLetter}
              disabled={loading}
              className="mt-2 w-full"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Regenerating…
                </>
              ) : (
                "Redo Letter"
              )}
            </PrimaryButton>
          </div>
        </Card>

        <p className="rounded-xl border border-line/60 bg-white/40 p-4 text-[11px] leading-relaxed text-navy/70">
          Requires attorney review and sign-off before transmission to any third party.
        </p>
      </div>
    </div>
  );
}
