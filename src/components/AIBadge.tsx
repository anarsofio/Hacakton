import { Sparkles } from "lucide-react";

export default function AIBadge({ label = "AI-generated — review required" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-[11px] font-medium text-navy/70">
      <Sparkles size={11} className="text-gold" />
      {label}
    </span>
  );
}
