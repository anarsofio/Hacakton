import Header from "@/components/Header";
import { PageHeading } from "@/components/PageShell";
import NegotiationLetterClient from "@/components/NegotiationLetterClient";

export default function NegotiationLetterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header showBack />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <PageHeading
          eyebrow="Stage 7 · Output"
          title="Settlement Demand Letter"
          description="Demand letter pulling from every prior stage. Add custom notes and regenerate before exporting."
        />
        <NegotiationLetterClient />
      </main>
    </div>
  );
}
