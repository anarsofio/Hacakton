"use client";

import { useEffect, useId, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

type Props = {
  open: boolean;
  clientName: string;
  onClose: () => void;
  onConfirm: () => void;
  busy?: boolean;
};

export default function DeleteClientModal({
  open,
  clientName,
  onClose,
  onConfirm,
  busy = false,
}: Props) {
  const titleId = useId();
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => confirmRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, busy]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-navy/45 backdrop-blur-[2px]"
        onClick={busy ? undefined : onClose}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-t-2xl border border-line/70 bg-cream p-6 shadow-[0_24px_64px_-24px_rgba(15,27,45,0.55)] sm:rounded-2xl sm:p-7"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#a70000]/10 text-[#a70000]">
              <AlertTriangle size={18} strokeWidth={2} />
            </span>
            <div>
              <h2
                id={titleId}
                className="font-serif-display text-xl font-semibold text-navy"
              >
                Delete client?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-navy/65">
                <span className="font-medium text-navy">{clientName}</span> and
                all associated medical records will be permanently removed. This
                cannot be undone.
              </p>
            </div>
          </div>
          {!busy && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-navy/15 p-2 text-navy/60 transition hover:border-gold hover:text-navy"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-full px-4 py-2 text-sm font-medium text-navy/70 transition hover:text-navy disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded-full bg-[#a70000] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
          >
            {busy ? "Deleting…" : "Delete permanently"}
          </button>
        </div>
      </div>
    </div>
  );
}
