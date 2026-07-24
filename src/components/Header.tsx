import Link from "next/link";
import { Scale, ChevronLeft } from "lucide-react";
import { caseOverview } from "@/lib/mockData";

export default function Header({ showBack = false }: { showBack?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          {showBack && (
            <Link
              href="/"
              className="flex items-center gap-1 rounded-full border border-navy/15 px-3 py-1.5 text-xs font-medium text-navy/70 transition hover:border-gold hover:text-navy"
            >
              <ChevronLeft size={14} />
              Dashboard
            </Link>
          )}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-gold">
              <Scale size={16} strokeWidth={2.25} />
            </span>
            <span className="font-serif-display text-lg font-semibold tracking-tight text-navy">
              CaseFlow
            </span>
          </Link>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <div className="text-right leading-tight">
            <p className="text-[11px] uppercase tracking-wide text-muted">Active case</p>
            <p className="text-sm font-medium text-navy">
              {caseOverview.clientName} · {caseOverview.caseNumber}
            </p>
          </div>
          <div className="h-9 w-9 rounded-full border border-navy/15 bg-navy-light text-center text-sm font-semibold leading-9 text-gold">
            JH
          </div>
        </div>
      </div>
    </header>
  );
}
