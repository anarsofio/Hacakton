import Header from "@/components/Header";
import CaseStepper from "@/components/CaseStepper";
import { Card } from "@/components/PageShell";
import { caseOverview, daysSince, insightsFeed } from "@/lib/mockData";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const days = daysSince(caseOverview.incidentDate);

  const overviewCards = [
    { label: "Client", value: caseOverview.clientName },
    { label: "Case status", value: caseOverview.status },
    { label: "Days since incident", value: `${days} days` },
    {
      label: "Estimated total damages",
      value: `$${caseOverview.estimatedDamages.toLocaleString()}`,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">
            Case No. {caseOverview.caseNumber}
          </p>
          <h1 className="mt-1 font-serif-display text-3xl font-semibold text-navy sm:text-4xl">
            {caseOverview.clientName}
          </h1>
          <p className="mt-2 max-w-xl text-[15px] text-navy/60">
            Incident date {new Date(caseOverview.incidentDate).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            . Follow the stages below in order, or jump to any stage directly.
          </p>
        </div>

        <Card className="mb-12 px-6 py-10 sm:px-10">
          <CaseStepper />
        </Card>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <section>
            <h2 className="mb-4 font-serif-display text-lg font-semibold text-navy">
              Case overview
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {overviewCards.map((c) => (
                <Card key={c.label} className="p-5">
                  <p className="text-xs uppercase tracking-wide text-muted">{c.label}</p>
                  <p className="mt-2 font-serif-display text-lg font-semibold leading-snug text-navy">
                    {c.value}
                  </p>
                </Card>
              ))}
            </div>

            <Card className="mt-4 flex items-center justify-between p-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Next action needed</p>
                <p className="mt-1 text-sm font-medium text-navy">{caseOverview.nextAction}</p>
              </div>
              <a
                href="/negotiation-letter"
                className="flex shrink-0 items-center gap-1 rounded-full bg-navy px-4 py-2 text-xs font-semibold text-gold transition hover:bg-navy-light"
              >
                Open <ArrowUpRight size={14} />
              </a>
            </Card>
          </section>

          <section>
            <h2 className="mb-4 font-serif-display text-lg font-semibold text-navy">
              Recent activity &amp; AI insights
            </h2>
            <Card className="divide-y divide-line/60 p-2">
              {insightsFeed.map((item) => (
                <div key={item.id} className="flex gap-3 p-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                    <Sparkles size={14} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-navy">{item.title}</p>
                    <p className="mt-0.5 text-[13px] text-navy/60">{item.detail}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-muted">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
