"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import CaseStepper from "@/components/CaseStepper";
import DeleteClientModal from "@/components/DeleteClientModal";
import { Card } from "@/components/PageShell";
import { deleteClient, getClientById, type Client } from "@/lib/clients";
import { ArrowUpRight, Inbox, Trash2 } from "lucide-react";

export default function ClientCaseDashboard({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [client, setClient] = useState<Client | undefined>(undefined);
  const [ready, setReady] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    setClient(getClientById(clientId));
    setReady(true);
  }, [clientId]);

  function handleDeleteConfirm() {
    deleteClient(clientId);
    router.push("/");
  }

  if (ready && !client) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header showBack backLabel="Clients" backHref="/" />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
          <h1 className="font-serif-display text-2xl font-semibold text-navy">
            Client not found
          </h1>
          <p className="mt-2 text-sm text-navy/60">
            This client may have been deleted or the link is invalid.
          </p>
          <Link
            href="/"
            className="mt-6 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-navy transition hover:brightness-95"
          >
            Back to clients
          </Link>
        </main>
      </div>
    );
  }

  const displayName = client?.name ?? "Client workspace";
  const status = client?.status ?? "Intake";

  const overviewCards = [
    { label: "Client", value: ready ? displayName : "…" },
    { label: "Case status", value: ready ? status : "…" },
    { label: "Documents", value: "None yet" },
    { label: "Estimated total damages", value: "—" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header showBack backLabel="Clients" backHref="/" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">
              Case workspace
            </p>
            <h1 className="mt-1 font-serif-display text-3xl font-semibold text-navy sm:text-4xl">
              {ready ? displayName : "Loading…"}
            </h1>
            <p className="mt-2 max-w-xl text-[15px] text-navy/60">
              Follow the stages below in order, or jump to any stage directly. Stages can be empty
              until documents and reports are added.
            </p>
          </div>
          {ready && client && (
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-[#a70000]/25 px-4 py-2 text-sm font-medium text-[#a70000] transition hover:bg-[#a70000]/5"
            >
              <Trash2 size={15} strokeWidth={2} />
              Delete client
            </button>
          )}
        </div>

        <Card className="mb-12 px-6 py-10 sm:px-10">
          <CaseStepper clientId={clientId} />
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

            <Card className="mt-4 flex items-center justify-between gap-4 p-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Next action needed</p>
                <p className="mt-1 text-sm font-medium text-navy">
                  Start with Documents to upload case materials
                </p>
              </div>
              <Link
                href={`/clients/${clientId}/documents`}
                className="flex shrink-0 items-center gap-1 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-navy transition hover:brightness-95"
              >
                Open <ArrowUpRight size={14} />
              </Link>
            </Card>
          </section>

          <section>
            <h2 className="mb-4 font-serif-display text-lg font-semibold text-navy">
              Recent activity &amp; AI insights
            </h2>
            <Card className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy/5 text-navy/45">
                <Inbox size={18} strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-sm font-medium text-navy">No activity yet</p>
                <p className="mt-1 max-w-xs text-[13px] text-navy/55">
                  Insights will appear here as documents are processed and stages are completed.
                </p>
              </div>
            </Card>
          </section>
        </div>
      </main>

      <DeleteClientModal
        open={deleteOpen}
        clientName={displayName}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
