export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-line/70 bg-white/70 shadow-[0_1px_2px_rgba(15,27,45,0.04),0_8px_24px_-16px_rgba(15,27,45,0.25)] ${className}`}
    >
      {children}
    </div>
  );
}

export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">{eyebrow}</p>
      <h1 className="mt-1 font-serif-display text-3xl font-semibold text-navy sm:text-[2.1rem]">
        {title}
      </h1>
      {description && <p className="mt-2 max-w-2xl text-[15px] text-navy/60">{description}</p>}
    </div>
  );
}

export function SourceViewer({ filename }: { filename: string }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-line/70 px-4 py-3">
        <p className="text-xs font-medium text-navy/60">Source document</p>
        <p className="truncate text-xs text-muted">{filename}</p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-navy-light/[0.03] p-8 text-center">
        <div className="flex h-16 w-12 flex-col items-center justify-center gap-1 rounded-sm border border-navy/15 bg-white shadow-sm">
          <div className="h-1 w-7 rounded-full bg-navy/10" />
          <div className="h-1 w-7 rounded-full bg-navy/10" />
          <div className="h-1 w-5 rounded-full bg-navy/10" />
        </div>
        <p className="text-xs text-muted">Document preview placeholder</p>
        <p className="max-w-[16rem] text-[11px] text-muted/80">
          Connect a document viewer to render the original PDF/image alongside the AI summary for verification.
        </p>
      </div>
    </Card>
  );
}

export function KeyPointsList({
  points,
}: {
  points: { label: string; value: string }[];
}) {
  return (
    <dl className="divide-y divide-line/60">
      {points.map((p) => (
        <div key={p.label} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-4">
          <dt className="w-40 shrink-0 text-xs font-medium uppercase tracking-wide text-muted">
            {p.label}
          </dt>
          <dd className="text-sm text-navy">{p.value}</dd>
        </div>
      ))}
    </dl>
  );
}
