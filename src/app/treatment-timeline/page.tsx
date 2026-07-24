import Header from "@/components/Header";
import { PageHeading } from "@/components/PageShell";
import TimelineClient from "@/components/TimelineClient";

export default function TreatmentTimelinePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header showBack />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <PageHeading
          eyebrow="Stage 4 · Chronology"
          title="Treatment Timeline"
          description="The case centerpiece: medical record analysis and the full chronological treatment history, combined."
        />
        <TimelineClient />
      </main>
    </div>
  );
}
