"use client";

import { useState } from "react";
import { Card } from "@/components/PageShell";
import AIBadge from "@/components/AIBadge";
import { negotiationLetterDraft } from "@/lib/mockData";
import { Download, FileDown, RotateCcw } from "lucide-react";

export default function NegotiationLetterClient() {
  const [draft, setDraft] = useState(negotiationLetterDraft);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif-display text-lg font-semibold text-navy">Draft letter</h2>
          <AIBadge />
        </div>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={26}
          className="w-full resize-y rounded-lg border border-line bg-white/70 p-4 font-serif-display text-[13.5px] leading-relaxed text-navy outline-none transition focus:border-gold"
        />
      </Card>

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
            <li>· Financial Reports totals</li>
          </ul>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 font-serif-display text-base font-semibold text-navy">Export</h3>
          <div className="flex flex-col gap-2">
            <button className="flex items-center justify-center gap-1.5 rounded-full bg-gold px-4 py-2.5 text-xs font-semibold text-navy hover:bg-gold-light">
              <FileDown size={14} /> Export as PDF
            </button>
            <button className="flex items-center justify-center gap-1.5 rounded-full border border-navy/15 px-4 py-2.5 text-xs font-medium text-navy hover:border-gold">
              <Download size={14} /> Export as Word (.docx)
            </button>
            <button
              onClick={() => setDraft(negotiationLetterDraft)}
              className="mt-1 flex items-center justify-center gap-1.5 text-xs font-medium text-navy/50 hover:text-navy"
            >
              <RotateCcw size={12} /> Reset to AI draft
            </button>
          </div>
        </Card>

        <p className="rounded-xl border border-gold/25 bg-gold/5 p-4 text-[11px] leading-relaxed text-navy/70">
          Requires attorney review and sign-off before transmission to any third party.
        </p>
      </div>
    </div>
  );
}
