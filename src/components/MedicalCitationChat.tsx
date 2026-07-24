"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/PageShell";
import type { MedicalCitation } from "@/lib/gemini";
import type { MedicalRecord } from "@/lib/medicalRecords";
import { ExternalLink, Loader2, Sparkles } from "lucide-react";

export default function MedicalCitationChat({ records }: { records: MedicalRecord[] }) {
  const [citations, setCitations] = useState<MedicalCitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (records.length === 0) {
      setCitations([]);
      return;
    }
    setLoading(true);
    setError(null);
    fetch("/api/gemini/medical-citations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ records }),
    })
      .then((r) => r.json())
      .then((data: { citations?: MedicalCitation[]; error?: string }) => {
        if (data.error) setError(data.error);
        else setCitations(data.citations ?? []);
      })
      .catch(() => setError("Could not load citations"))
      .finally(() => setLoading(false));
  }, [records]);

  return (
    <Card className="flex h-[22rem] flex-col p-4">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles size={16} className="text-accent" />
        <h3 className="font-serif-display text-base font-semibold text-navy">
          Keywords &amp; source citations
        </h3>
      </div>
      {records.length === 0 ? (
        <p className="flex flex-1 items-center justify-center text-sm text-muted">
          Import records to extract cited terms
        </p>
      ) : loading ? (
        <p className="flex flex-1 items-center justify-center gap-2 text-sm text-muted">
          <Loader2 size={14} className="animate-spin" /> Extracting terms…
        </p>
      ) : error ? (
        <p className="text-sm text-critical">{error}</p>
      ) : (
        <ul className="flex-1 space-y-2 overflow-y-auto">
          {citations.map((c, i) => (
            <li key={i} className="rounded-lg border border-line/60 bg-white/40 px-3 py-2 text-sm">
              {c.sourceUrl ? (
                <a
                  href={c.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={c.pageHint ? `Page ${c.pageHint}` : undefined}
                  className="inline-flex items-center gap-1 font-medium text-navy hover:text-accent"
                >
                  {c.term}
                  <ExternalLink size={12} />
                </a>
              ) : (
                <span className="font-medium text-navy">{c.term}</span>
              )}
              {c.pageHint && (
                <span className="ml-2 text-xs text-muted">p. {c.pageHint}</span>
              )}
            </li>
          ))}
          {citations.length === 0 && (
            <li className="text-sm text-muted">No key terms extracted yet.</li>
          )}
        </ul>
      )}
    </Card>
  );
}
