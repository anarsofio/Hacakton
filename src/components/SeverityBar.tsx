export default function SeverityBar({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Impact severity</p>
        <p className="text-xs font-semibold text-navy">{label}</p>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-navy/10">
        <div
          className="h-full rounded-full"
          style={{
            width: "100%",
            background:
              "linear-gradient(to right, var(--cf-accent), var(--cf-warning), var(--cf-critical))",
          }}
        />
        <div
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-navy shadow"
          style={{ left: `calc(${value}% - 8px)` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wide text-muted">
        <span>Minor impact</span>
        <span>High impact</span>
      </div>
    </div>
  );
}
