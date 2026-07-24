import Header from "@/components/Header";
import { PageHeading } from "@/components/PageShell";
import QualityOfLifeClient from "@/components/QualityOfLifeClient";

export default function QualityOfLifePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header showBack />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <PageHeading
          eyebrow="Stage 5 · Impact"
          title="Quality of Life"
          description="A guided questionnaire completed by the client, capturing pain, activity limitations, and emotional impact in their own words."
        />
        <QualityOfLifeClient />
      </main>
    </div>
  );
}
