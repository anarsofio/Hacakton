"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import { Card, PageHeading } from "@/components/PageShell";
import {
  parseMedicalRecordsFromFile,
  recordsToDocuments,
} from "@/lib/importMedicalRecords";
import type { CaseDocument } from "@/lib/importDocuments";
import { appendRecords, loadRecords } from "@/lib/medicalRecords";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Loader2,
  Link2,
  Sheet,
} from "lucide-react";

const categoryStyles: Record<string, string> = {
  Incident: "bg-orange/10 text-orange",
  Treatment: "bg-navy/10 text-navy",
  Financial: "bg-green/10 text-green",
  Intake: "bg-gold/15 text-gold",
};

type ImportPhase = "idle" | "parsing" | "enriching" | "done";

export default function DocumentsClient({ clientId }: { clientId: string }) {
  const [docs, setDocs] = useState<CaseDocument[]>([]);
  const [phase, setPhase] = useState<ImportPhase>("idle");
  const [progress, setProgress] = useState("");
  const [message, setMessage] = useState<{
    type: "ok" | "err" | "warn";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDocs(recordsToDocuments(loadRecords(clientId)));
  }, [clientId]);

  const importing = phase === "parsing" || phase === "enriching";

  async function handleImportFile(file: File | undefined) {
    if (!file) return;
    setPhase("parsing");
    setProgress("Parsing spreadsheet…");
    setMessage(null);

    try {
      const parsed = await parseMedicalRecordsFromFile(file, clientId);
      if (parsed.length === 0) {
        setMessage({
          type: "err",
          text: "No valid records found. Ensure 8 columns are mapped and rows contain data.",
        });
        setPhase("idle");
        return;
      }

      setPhase("enriching");
      setProgress(`Enriching ${parsed.length} record${parsed.length === 1 ? "" : "s"} with AI…`);

      let enriched = parsed;
      let aiWarning = false;
      try {
        const res = await fetch("/api/gemini/enrich", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ records: parsed }),
        });
        const data = (await res.json()) as {
          records?: typeof parsed;
          warning?: string;
        };
        if (data.records?.length) enriched = data.records;
        if (data.warning) aiWarning = true;
      } catch {
        aiWarning = true;
      }

      const { added, skipped } = appendRecords(clientId, enriched);
      const allRecords = loadRecords(clientId);
      setDocs(recordsToDocuments(allRecords));

      setPhase("done");
      setProgress("");

      if (added.length === 0) {
        setMessage({
          type: "warn",
          text: `All ${parsed.length} record${parsed.length === 1 ? "" : "s"} were duplicates and skipped.`,
        });
      } else {
        const parts = [
          `Done — ${added.length} record${added.length === 1 ? "" : "s"} imported`,
        ];
        if (skipped > 0) parts.push(`${skipped} duplicate${skipped === 1 ? "" : "s"} skipped`);
        setMessage({
          type: aiWarning ? "warn" : "ok",
          text: aiWarning
            ? `${parts.join("; ")}. AI enrichment unavailable — showing raw import data.`
            : parts.join("; "),
        });
      }
    } catch {
      setMessage({
        type: "err",
        text: "Could not read that file. Use a valid .xlsx or .csv.",
      });
    } finally {
      setPhase("idle");
      setProgress("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header showBack />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <PageHeading
          eyebrow="Stage 1 · Intake"
          title="Documents"
          description="Upload case documents or import structured medical records from Excel to populate timelines, reports, and health summaries."
        />

        <Card className="mb-8 flex flex-col items-center justify-center gap-3 border-dashed border-navy/25 bg-white/40 px-6 py-14 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy/5 text-navy">
            <UploadCloud size={22} strokeWidth={1.75} />
          </span>
          <div>
            <p className="font-medium text-navy">Drag and drop files, or click to browse</p>
            <p className="mt-1 text-sm text-muted">
              PDFs, images, and scanned documents · or import Excel medical records
            </p>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              className="rounded-full bg-accent px-5 py-2 text-xs font-semibold text-navy transition hover:brightness-95"
            >
              Choose files
            </button>
            <button
              type="button"
              disabled={importing}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-full border border-navy/20 bg-transparent px-5 py-2 text-xs font-semibold text-navy transition hover:border-gold hover:text-navy disabled:opacity-50"
            >
              <Sheet size={14} strokeWidth={2} />
              {importing ? "Importing…" : "Import Excel Records"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
              className="hidden"
              onChange={(e) => handleImportFile(e.target.files?.[0])}
            />
          </div>
          {importing && progress && (
            <p className="mt-2 flex items-center justify-center gap-2 text-sm text-navy/70">
              <Loader2 size={14} className="animate-spin" />
              {progress}
            </p>
          )}
          {message && !importing && (
            <p
              className={`mt-2 text-sm ${
                message.type === "ok"
                  ? "text-green"
                  : message.type === "warn"
                    ? "text-gold"
                    : "text-[#b5533f]"
              }`}
            >
              {message.text}
            </p>
          )}
        </Card>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif-display text-lg font-semibold text-navy">
            Uploaded documents
          </h2>
          <p className="text-xs text-muted">{docs.length} files</p>
        </div>

        <Card className="overflow-hidden">
          {docs.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="font-medium text-navy">No documents yet</p>
              <p className="mt-1 text-sm text-muted">
                Import an Excel file with 8 columns (Encounter Date through Link To Pdf), or upload
                files above.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line/70 text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-5 py-3 font-medium">File</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Uploaded</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {docs.map((doc) => (
                  <tr key={doc.id} className="transition hover:bg-navy/[0.02]">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <FileText size={16} className="shrink-0 text-navy/50" />
                        {doc.sourceUrl ? (
                          <a
                            href={doc.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-navy underline-offset-2 hover:underline"
                            title={doc.downloadUrl ?? doc.sourceUrl}
                          >
                            {doc.name}
                          </a>
                        ) : (
                          <span className="font-medium text-navy">{doc.name}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-navy/70">{doc.type}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          categoryStyles[doc.category] ?? "bg-navy/10 text-navy"
                        }`}
                      >
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-navy/70">
                      {doc.uploadDate !== "unknown"
                        ? new Date(doc.uploadDate + "T00:00:00").toLocaleDateString()
                        : "Unknown"}
                    </td>
                    <td className="px-5 py-3">
                      <StatusCell status={doc.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </main>
    </div>
  );
}

function StatusCell({ status }: { status: CaseDocument["status"] }) {
  if (status === "Processed") {
    return (
      <span className="flex items-center gap-1.5 text-green">
        <CheckCircle2 size={14} /> Processed
      </span>
    );
  }
  if (status === "Linked") {
    return (
      <span className="flex items-center gap-1.5 text-navy/70">
        <Link2 size={14} /> Linked
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-gold">
      <Loader2 size={14} className="animate-spin" /> Processing
    </span>
  );
}
