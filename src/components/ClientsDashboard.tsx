"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Users } from "lucide-react";
import Header from "@/components/Header";
import DeleteClientModal from "@/components/DeleteClientModal";
import NewClientModal from "@/components/NewClientModal";
import {
  type Client,
  deleteClient,
  formatDisplayDate,
  loadClients,
  saveClients,
} from "@/lib/clients";

export default function ClientsDashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [ready, setReady] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);

  useEffect(() => {
    setClients(loadClients());
    setReady(true);
  }, []);

  function handleCreate(client: Client) {
    setClients((prev) => {
      const next = [client, ...prev];
      saveClients(next);
      return next;
    });
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    deleteClient(deleteTarget.id);
    setClients((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              Workspace
            </p>
            <h1 className="mt-1 font-serif-display text-3xl font-semibold text-navy sm:text-4xl">
              Clients
            </h1>
            <p className="mt-2 max-w-xl text-[15px] text-navy/60">
              Open a client to work their case, or add someone new to get started.
            </p>
          </div>
          {ready && clients.length > 0 && (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-navy transition hover:brightness-95 sm:self-auto"
            >
              <Plus size={16} strokeWidth={2.25} />
              New Client
            </button>
          )}
        </div>

        {!ready ? (
          <div className="rounded-2xl border border-dashed border-line py-24 text-center text-sm text-muted">
            Loading…
          </div>
        ) : clients.length === 0 ? (
          <EmptyState onNew={() => setModalOpen(true)} />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clients.map((client) => (
              <li key={client.id} className="relative">
                <Link
                  href={`/clients/${client.id}`}
                  className="group block rounded-2xl border border-line/70 bg-white/70 p-5 shadow-[0_1px_2px_rgba(15,27,45,0.04),0_8px_24px_-16px_rgba(15,27,45,0.25)] transition hover:border-gold/50 hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-serif-display text-lg font-semibold text-navy transition group-hover:text-navy-light">
                      {client.name}
                    </h2>
                    <StatusPill status={client.status} />
                  </div>
                  <dl className="mt-4 space-y-2 text-[13px]">
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted">Date added</dt>
                      <dd className="font-medium text-navy/80">
                        {formatDisplayDate(client.dateAdded)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted">Client ID</dt>
                      <dd
                        className="truncate font-mono text-[11px] text-navy/55"
                        title={client.id}
                      >
                        {client.id.slice(0, 8)}…
                      </dd>
                    </div>
                  </dl>
                </Link>
                <button
                  type="button"
                  aria-label={`Delete ${client.name}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setDeleteTarget(client);
                  }}
                  className="absolute right-3 top-3 rounded-full border border-transparent p-2 text-navy/35 transition hover:border-[#a70000]/20 hover:bg-[#a70000]/5 hover:text-[#a70000]"
                >
                  <Trash2 size={15} strokeWidth={2} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      <NewClientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />

      <DeleteClientModal
        open={deleteTarget !== null}
        clientName={deleteTarget?.name ?? ""}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line/80 bg-white/40 px-6 py-24 text-center">
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-navy/5 text-navy/50">
        <Users size={26} strokeWidth={1.75} />
      </span>
      <h2 className="font-serif-display text-xl font-semibold text-navy sm:text-2xl">
        You don&apos;t have any clients yet.
      </h2>
      <p className="mt-2 max-w-sm text-[15px] text-navy/55">
        Create your first client to open a case workspace and start managing documents and timelines.
      </p>
      <button
        type="button"
        onClick={onNew}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-navy transition hover:brightness-95"
      >
        <Plus size={16} strokeWidth={2.25} />
        New Client
      </button>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  return (
    <span className="shrink-0 rounded-full border border-navy/10 bg-cream-dim/80 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-navy/70">
      {status}
    </span>
  );
}
