"use client";

import { useState } from "react";
import { Card } from "@/components/PageShell";
import PrimaryButton from "@/components/PrimaryButton";
import type { MedicalRecord } from "@/lib/medicalRecords";
import { Loader2, Send } from "lucide-react";

type Message = { role: "user" | "assistant"; text: string };

export default function MedicalRecordsChat({ records }: { records: MedicalRecord[] }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setError(null);
    setMessages((m) => [...m, { role: "user", text: q }]);
    setLoading(true);
    try {
      const res = await fetch("/api/gemini/medical-qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, records }),
      });
      const data = (await res.json()) as { answer?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not get answer");
        return;
      }
      setMessages((m) => [...m, { role: "assistant", text: data.answer ?? "" }]);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="flex h-[22rem] flex-col p-4">
      <h3 className="mb-3 font-serif-display text-base font-semibold text-navy">
        Ask about medical records
      </h3>
      {records.length === 0 ? (
        <p className="flex flex-1 items-center justify-center text-sm text-muted">
          Import records to enable Q&amp;A
        </p>
      ) : (
        <>
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {messages.length === 0 && (
              <p className="text-sm text-muted">
                Ask natural-language questions about diagnoses, treatment, or providers.
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`rounded-xl px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "ml-8 bg-navy/8 text-navy"
                    : "mr-8 border border-line/60 bg-white/50 text-navy/80"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <p className="flex items-center gap-2 text-xs text-muted">
                <Loader2 size={12} className="animate-spin" /> Thinking…
              </p>
            )}
            {error && <p className="text-xs text-critical">{error}</p>}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="e.g. What imaging was performed?"
              className="flex-1 rounded-full border border-line bg-white/70 px-4 py-2 text-sm outline-none focus:border-accent"
            />
            <PrimaryButton onClick={send} disabled={loading} className="px-3">
              <Send size={14} />
            </PrimaryButton>
          </div>
        </>
      )}
    </Card>
  );
}
