"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  CLIENT_STATUSES,
  type Client,
  type ClientStatus,
  createClientId,
} from "@/lib/clients";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (client: Client) => void;
};

export default function NewClientModal({ open, onClose, onCreate }: Props) {
  const titleId = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<ClientStatus>("Intake");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setName("");
    setStatus("Intake");
    setError("");
    const t = window.setTimeout(() => nameRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Client name is required.");
      nameRef.current?.focus();
      return;
    }
    const today = new Date();
    const dateAdded = today.toISOString().slice(0, 10);
    onCreate({
      id: createClientId(),
      name: trimmed,
      status,
      dateAdded,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-navy/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-t-2xl border border-line/70 bg-cream p-6 shadow-[0_24px_64px_-24px_rgba(15,27,45,0.55)] sm:rounded-2xl sm:p-7"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">
              New client
            </p>
            <h2
              id={titleId}
              className="mt-1 font-serif-display text-2xl font-semibold text-navy"
            >
              Add a client
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-navy/15 p-2 text-navy/60 transition hover:border-gold hover:text-navy"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              Client name
            </span>
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Maria Alvarez"
              className="rounded-xl border border-navy/15 bg-white px-3.5 py-2.5 text-sm text-navy outline-none transition placeholder:text-navy/35 focus:border-gold"
            />
            {error && <span className="text-xs text-[#b5533f]">{error}</span>}
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              Status
            </span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ClientStatus)}
              className="rounded-xl border border-navy/15 bg-white px-3.5 py-2.5 text-sm text-navy outline-none transition focus:border-gold"
            >
              {CLIENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-1 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 text-sm font-medium text-navy/70 transition hover:text-navy"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-navy transition hover:brightness-95"
            >
              Create client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
