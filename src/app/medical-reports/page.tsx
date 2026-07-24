import Header from "@/components/Header";
import { PageHeading } from "@/components/PageShell";
import MedicalReportsClient from "@/components/MedicalReportsClient";

export default function MedicalReportsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header showBack />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <PageHeading
          eyebrow="Stage 3 · Records"
          title="Medical Reports"
          description="Imported clinical records grouped by type, with summaries, body parts, and source PDF links."
        />
        <MedicalReportsClient />
      </main>
    </div>
  );
}
