import Header from "@/components/Header";
import { PageHeading } from "@/components/PageShell";
import PoliceReportClient from "@/components/PoliceReportClient";

export default function PoliceReportPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header showBack />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <PageHeading
          eyebrow="Stage 2 · Incident"
          title="Police Report"
          description="Extracted facts from the responding officer's incident report, shown alongside photographic evidence and the original document."
        />
        <PoliceReportClient />
      </main>
    </div>
  );
}
