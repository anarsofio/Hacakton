import type { SeverityFlag } from "@/lib/medicalRecords";

export default function SeverityChip({ flag }: { flag: SeverityFlag | string }) {
  const styles =
    flag === "Urgent"
      ? "border-critical/30 bg-critical/10 text-critical"
      : flag === "Requires Follow-up"
        ? "border-warning/40 bg-warning/15 text-navy"
        : "border-accent/40 bg-accent/15 text-navy";

  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${styles}`}>
      {flag}
    </span>
  );
}
