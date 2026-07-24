import Header from "@/components/Header";
import { Card, PageHeading } from "@/components/PageShell";
import { documents } from "@/lib/mockData";
import { UploadCloud, FileText, CheckCircle2, Loader2 } from "lucide-react";

const categoryStyles: Record<string, string> = {
  Incident: "bg-orange/10 text-orange",
  Treatment: "bg-navy/10 text-navy",
  Financial: "bg-green/10 text-green",
  Intake: "bg-gold/15 text-gold",
};

export default function DocumentsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header showBack />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <PageHeading
          eyebrow="Stage 1 · Intake"
          title="Documents"
          description="Upload every case document here — police reports, medical records, bills, photos, and correspondence. Files are auto-categorized so downstream stages know exactly where to pull from."
        />

        <Card className="mb-8 flex flex-col items-center justify-center gap-3 border-dashed border-navy/25 bg-white/40 px-6 py-14 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy/5 text-navy">
            <UploadCloud size={22} strokeWidth={1.75} />
          </span>
          <div>
            <p className="font-medium text-navy">Drag and drop files, or click to browse</p>
            <p className="mt-1 text-sm text-muted">
              PDFs, images, and scanned documents · multi-file batch upload supported
            </p>
          </div>
          <button className="mt-2 rounded-full bg-navy px-5 py-2 text-xs font-semibold text-gold transition hover:bg-navy-light">
            Choose files
          </button>
        </Card>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif-display text-lg font-semibold text-navy">
            Uploaded documents
          </h2>
          <p className="text-xs text-muted">{documents.length} files</p>
        </div>

        <Card className="overflow-hidden">
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
              {documents.map((doc) => (
                <tr key={doc.id} className="transition hover:bg-navy/[0.02]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <FileText size={16} className="shrink-0 text-navy/50" />
                      <span className="font-medium text-navy">{doc.name}</span>
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
                    {new Date(doc.uploadDate).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    {doc.status === "Processed" ? (
                      <span className="flex items-center gap-1.5 text-green">
                        <CheckCircle2 size={14} /> Processed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-gold">
                        <Loader2 size={14} className="animate-spin" /> Processing
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>
    </div>
  );
}
