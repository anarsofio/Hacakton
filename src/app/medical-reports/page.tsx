import Header from "@/components/Header";
import { Card, PageHeading, SourceViewer, KeyPointsList } from "@/components/PageShell";
import AIBadge from "@/components/AIBadge";
import { medicalReport } from "@/lib/mockData";

export default function MedicalReportsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header showBack />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <PageHeading
          eyebrow="Stage 3 · Records"
          title="Medical Reports"
          description="AI-extracted diagnoses, providers, and procedures across every uploaded medical record, shown alongside the source documents for verification."
        />

        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="flex flex-col gap-6">
            <Card className="p-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-serif-display text-lg font-semibold text-navy">AI Summary</h2>
                <AIBadge />
              </div>
              <p className="text-[15px] leading-relaxed text-navy/80">{medicalReport.summary}</p>
            </Card>

            <Card className="p-6">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="font-serif-display text-lg font-semibold text-navy">Key Points</h2>
                <AIBadge />
              </div>
              <KeyPointsList points={medicalReport.keyPoints} />
            </Card>
          </div>

          <div className="lg:sticky lg:top-24 lg:h-fit">
            <SourceViewer filename={medicalReport.sourceDocument} />
          </div>
        </div>
      </main>
    </div>
  );
}
